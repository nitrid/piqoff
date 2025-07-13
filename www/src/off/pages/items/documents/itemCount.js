import React from 'react';
import App from '../../../lib/app.js';
import { itemCountCls } from '../../../../core/cls/count.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import { datatable } from '../../../../core/core.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class itemCount extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.countObj = new itemCountCls();
        this.tabIndex = props.data.tabkey


        this.state = 
        {
            columnListValue : ['CDATE_FORMAT','ITEM_CODE','ITEM_NAME','QUANTITY','COST_PRICE','TOTAL_COST','MULTICODE','CUSTOMER_NAME','BARCODE']
        }
        
        this.columnListData = 
        [
            {CODE : "CDATE_FORMAT",NAME : this.t("grdItemCount.clmCreateDate")},
            {CODE : "ITEM_CODE",NAME : this.t("grdItemCount.clmItemCode")},
            {CODE : "ITEM_NAME",NAME : this.t("grdItemCount.clmItemName")},                                   
            {CODE : "QUANTITY",NAME : this.t("grdItemCount.clmQuantity")},
            {CODE : "COST_PRICE",NAME : this.t("grdItemCount.clmCostPrice")},
            {CODE : "TOTAL_COST",NAME : this.t("grdItemCount.clmTotalCost")},
            {CODE : "CUSTOMER_NAME",NAME : this.t("grdItemCount.clmCustomerName")},
            {CODE : "MULTICODE",NAME : this.t("grdItemCount.clmMulticode")},
            {CODE : "BARCODE",NAME : this.t("grdItemCount.clmBarcode")},
            
        ]

        this.groupList = [];

        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.columnListBox = this.columnListBox.bind(this)

        this.frmCount = undefined;
        this.docLocked = false;        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
       
    }
    async init()
    {
        this.countObj.clearAll()

        this.countObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:true});
            }
        })
        this.countObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:true});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.countObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:true});          
        })
        this.countObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:true});
        })

        this.msgQuantity.onShowed = async ()=>
        {
            this.txtPopQteUnitQuantity.value = 1
            this.txtPopQuantity.value = 1
            this.txtPopQuantity.focus()
            
            let tmpUnitDt = new datatable()
            tmpUnitDt.selectCmd = 
            {
                query: `SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE` ,
                param: ['ITEM:string|50'],
                value: [this.msgQuantity.tmpData.GUID]
            }
            await tmpUnitDt.refresh()
            
            if(tmpUnitDt.length > 0)
            {   
                this.cmbPopQteUnit.setData(tmpUnitDt)
                let tmpDefaultUnit = tmpUnitDt.where({TYPE:{'<>' : 0}}).where({NAME:this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value})
                if(tmpDefaultUnit.length > 0)
                {
                    this.cmbPopQteUnit.value = tmpDefaultUnit[0].GUID
                    this.txtPopQteUnitFactor.value = tmpDefaultUnit[0].FACTOR
                    this.txtPopQteUnitQuantity.value = this.txtPopQuantity.value * this.txtPopQteUnitFactor.value
                }
                else
                {
                    this.cmbPopQteUnit.value = this.msgQuantity.tmpData.UNIT
                    this.txtPopQteUnitFactor.value = 1
                }
            }
        }

        this.txtRef.setState({value:this.user.CODE})
        
        this.dtDocDate.value =  moment(new Date()).format("YYYY-MM-DD"),
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmCount.option('disabled',false)
        await this.grdItemCount.dataRefresh({source:this.countObj.dt('ITEM_COUNT')});
        this.txtRef.props.onChange()

        if(typeof this.pagePrm != 'undefined')
        {
            this.getDoc('00000000-0000-0000-0000-000000000000',this.pagePrm.REF,this.pagePrm.REF_NO)
        }
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.countObj.clearAll()
        await this.countObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true

        let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
        this.txtAmount.setState({value :totalPrice})

        if(this.countObj.dt()[0].LOCKED != 0)
        {
            this.toast.show({message:this.t("msgGetLocked.msg"),type:"error"})
            this.frmCount.option('disabled',true)
        }
        else
        {
            this.frmCount.option('disabled',false)
        }

        this.btnPrint.setState({disabled:false});
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new countObj().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'auto',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getDoc('00000000-0000-0000-0000-000000000000',pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        this.init()
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onKeyDown={async(k)=>
                {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                    {
                        await this.pg_txtItemsCode.setVal(e.value)
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            if(data.length > 0)
                            {
                                if(data.length == 1)
                                {
                                    this.addItem(data[0],e.rowIndex)
                                }
                                else if(data.length > 1)
                                {
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        if(i == 0)
                                        {
                                            this.addItem(data[i],e.rowIndex)
                                        }
                                        else
                                        {
                                            let tmpDocItems = {...this.countObj.empty}
                                            tmpDocItems.LINE_NO = this.countObj.dt().length
                                            tmpDocItems.REF = this.txtRef.value
                                            tmpDocItems.REF_NO = this.txtRefno.value
                                            tmpDocItems.DEPOT = this.cmbDepot.value
                                            tmpDocItems.DOC_DATE = this.dtDocDate.value
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.countObj.addEmpty(tmpDocItems)
                                            this.addItem(data[i],this.countObj.dt().length-1)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }}
                onValueChanged={(v)=>{e.value = v.value}}
                onChange={(async(r)=>
                {
                    if(typeof r.event.isTrusted == 'undefined')
                    {
                        let tmpQuery = 
                        {
                            query : `SELECT 
                                    ITEMS.GUID,
                                    ITEMS.CODE,
                                    ITEMS.NAME,
                                    ITEMS.VAT,
                                    ITEMS.COST_PRICE,
                                    ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE, 
                                    ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME 
                                    FROM ITEMS_VW_04 AS ITEMS 
                                    INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                    WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE`,
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        if(tmpData.result.recordset.length > 0)
                        {
                            
                            this.addItem(tmpData.result.recordset[0],e.rowIndex)
                        }
                        else
                        {
                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:"warning"})
                        }
                    }
                }).bind(this)}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    if(data.length > 0)
                                    {
                                        if(data.length == 1)
                                        {
                                            this.addItem(data[0],e.rowIndex)
                                        }
                                        else if(data.length > 1)
                                        {
                                            for (let i = 0; i < data.length; i++) 
                                            {
                                                if(i == 0)
                                                {
                                                    this.addItem(data[i],e.rowIndex)
                                                }
                                                else
                                                {
                                                    let tmpDocItems = {...this.countObj.empty}
                                                    tmpDocItems.LINE_NO = this.countObj.dt().length
                                                    tmpDocItems.REF = this.txtRef.value
                                                    tmpDocItems.REF_NO = this.txtRefno.value
                                                    tmpDocItems.DEPOT = this.cmbDepot.value
                                                    tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                    this.txtRef.readOnly = true
                                                    this.txtRefno.readOnly = true
                                                    this.countObj.addEmpty(tmpDocItems)
                                                    this.addItem(data[i],this.countObj.dt().length-1)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        else  if(e.column.dataField == "QUANTITY")
        {
            return (
                <NdNumberBox id={"numGrdQuantity"+e.rowIndex} parent={this} simple={true} 
                value={e.value}
                onValueChanged={async (v)=>
                {
                    if(v.value > 1000)
                    {
                        let tmpConfObj = 
                        {
                            id:'msgBigQuantity',showTitle:true,title:this.t("msgBigQuantity.title"),showCloseButton:true,width:'500px',height:'auto',
                            button:[{id:"btn01",caption:this.t("msgBigQuantity.btn01"),location:'before'},{id:"btn02",caption:this.t("msgBigQuantity.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBigQuantity.msg")}</div>)
                        }
                        let pResult = await dialog(tmpConfObj);
                        if(pResult == 'btn01')
                        {
                            e.setValue(v.value)
                            return
                        }
                        else if(pResult == 'btn02')
                        {
                            return
                        }
                    }
                    else
                    {
                        e.setValue(v.value)
                    }
                }}
                >  
                </NdNumberBox>
            )
        }
    }
    async addItem(pData,pIndex)
    {
        let tmpQuantity = 1
        this.msgQuantity.tmpData = pData
        let tmpResult = await this.msgQuantity.show()
        
        if(tmpResult == 'btn02')
        {
            if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
            {
                await this.grdItemCount.devGrid.deleteRow(0)
            }
            this.msgQuantity.hide()
            this.txtBarcode.focus()
            return
        }
        else
        {
            tmpQuantity = this.txtPopQteUnitQuantity.value
        }
      
        for (let i = 0; i < this.countObj.dt().length; i++) 
        {
            if(this.countObj.dt()[i].ITEM_CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'auto',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'before'},{id:"btn03",caption:this.t("msgCombineItem.btn03"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }

                let pResult = await dialog(tmpConfObj);
                
                if(pResult == 'btn01')
                {
                    this.countObj.dt()[i].QUANTITY = parseFloat(this.countObj.dt()[i].QUANTITY) + parseFloat(tmpQuantity)
                    let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                    this.txtAmount.setState({value :totalPrice})
                    if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                    {
                        await this.grdItemCount.devGrid.deleteRow(0)
                    }
                    this.txtBarcode.focus()
                    return
                }

                if(pResult == 'btn02')
                {
                    this.countObj.dt()[i].QUANTITY =  parseFloat(tmpQuantity)
                    let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                    this.txtAmount.setState({value :totalPrice})
                    if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                    {
                        await this.grdItemCount.devGrid.deleteRow(0)
                    }
                    this.txtBarcode.focus()
                    return
                }
                if(pResult == 'btn03')
                {
                    this.txtBarcode.focus()
                    return
                }
            }
        }

        this.countObj.dt()[pIndex].ITEM_CODE = pData.CODE
        this.countObj.dt()[pIndex].ITEM = pData.GUID
        this.countObj.dt()[pIndex].ITEM_NAME = pData.NAME
        this.countObj.dt()[pIndex].QUANTITY = tmpQuantity
        this.countObj.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.countObj.dt()[pIndex].MULTICODE = pData.MULTICODE
        this.countObj.dt()[pIndex].CUSTOMER_NAME = pData.CUSTOMER_NAME
        this.countObj.dt()[pIndex].BARCODE = pData.BARCODE
        this.countObj.dt()[pIndex].TOTAL_COST =parseFloat(pData.COST_PRICE *tmpQuantity).toFixed(2)
        this.txtBarcode.focus()

        let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
        this.txtAmount.setState({value :totalPrice})
    }
    columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'CDATE_FORMAT') != 'undefined')
                {
                    this.groupList.push('CDATE_FORMAT')
                }
                if(typeof e.value.find(x => x == 'ITEM_CODE') != 'undefined')
                {
                    this.groupList.push('ITEM_CODE')
                }             
                if(typeof e.value.find(x => x == 'BARCODE') != 'undefined')
                {
                    this.groupList.push('BARCODE')
                }   
                if(typeof e.value.find(x => x == 'ITEM_NAME') != 'undefined')
                {
                    this.groupList.push('ITEM_NAME')
                }
                if(typeof e.value.find(x => x == 'QUANTITY') != 'undefined')
                {
                    this.groupList.push('QUANTITY')
                }
                if(typeof e.value.find(x => x == 'COST_PRICE') != 'undefined')
                {
                    this.groupList.push('COST_PRICE')
                }
                if(typeof e.value.find(x => x == 'TOTAL_COST') != 'undefined')
                {
                    this.groupList.push('TOTAL_COST')
                }
                if(typeof e.value.find(x => x == 'CUSTOMER_NAME') != 'undefined')
                {
                    this.groupList.push('CUSTOMER_NAME')
                }

                for (let i = 0; i < this.grdItemCount.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdItemCount.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdItemCount.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdItemCount.devGrid.columnOption(i,'visible',true)
                    }
                }
                this.setState({columnListValue : e.value})
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.columnListData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.columnListValue}
            onOptionChanged={onOptionChanged}
            />
        )
    }
    async checkRow()
    {
        for (let i = 0; i < this.countObj.dt().length; i++) 
        {
            this.countObj.dt()[i].DEPOT = this.countObj.dt()[0].DEPOT
            this.countObj.dt()[i].DOC_DATE = this.countObj.dt()[0].DOC_DATE
        }
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={()=>
                                    {
                                        this.getDoc('00000000-0000-0000-0000-000000000000',this.countObj.dt()[0].REF,this.countObj.dt()[0].REF_NO)
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmCountFrom" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.countObj.dt()[0].LOCKED == 1)
                                        {
                                            this.toast.show({message:this.t("msgDocLocked.msg"),type:"warning"})
                                            return
                                        }

                                        if(typeof this.countObj.dt()[0] == 'undefined')
                                        {
                                            this.toast.show({message:this.t("msgNotRow.msg"),type:"warning"})
                                            this.getDoc('00000000-0000-0000-0000-000000000000',this.countObj.dt()[0].REF,this.countObj.dt()[0].REF_NO)
                                            return
                                        }

                                        if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
                                        }

                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);

                                            if(pResult == 'btn01')
                                            {
                                                if((await this.countObj.save()) == 0)
                                                {
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                    this.btnPrint.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    }
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:"warning"})
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        if(this.countObj.dt()[0].LOCKED == 1)
                                        {
                                            this.toast.show({message:this.t("msgDocLocked.msg"),type:"warning"})
                                            return
                                        }

                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);

                                        if(pResult == 'btn01')
                                        {
                                            let tmpDelete = {...this.countObj.dt('ITEM_COUNT')}

                                            for (let i = 0; i < tmpDelete.length; i++) 
                                            {
                                                this.countObj.dt('ITEM_COUNT').removeAt(0)
                                            }

                                            await this.countObj.dt('ITEM_COUNT').delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnLock" parent={this} icon="key" type="default"
                                    onClick={async()=>
                                    {
                                        if(this.countObj.dt()[0].LOCKED == 0)
                                        {
                                            for (let i = 0; i < this.countObj.dt().length; i++) 
                                            {
                                                this.countObj.dt()[i].LOCKED = 1
                                            }

                                            this.frmCount.option('disabled',true)
                                            
                                            if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdRebItems.devGrid.deleteRow(this.countObj.dt().length - 1)
                                            }

                                            if((await this.countObj.save()) == 0)
                                            {
                                                this.toast.show({message:this.t("msgLocked.msg"),type:"success"})
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgSaveResult.msgFailed"),type:"error"})
                                            }
                                        }
                                        else if(this.countObj.dt()[0].LOCKED == 1)
                                        {
                                            this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default" onClick={()=>{this.popDesign.show()}}/>
                                </Item>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);

                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmCountFrom">
                                {/* txtRef-Refno */}
                                <NdItem>
                                    <NdLabel text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-6 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM ITEM_COUNT WHERE REF = @REF`,
                                                    param : ['REF:string|25'],
                                                    value : [this.txtRef.value]
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmCountFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-6 ps-0">
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF_NO"}}
                                            readOnly={true}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                            this.pg_Docs.show()
                                                            this.pg_Docs.onClick = (data) =>
                                                            {
                                                                if(data.length > 0)
                                                                {
                                                                    this.getDoc('00000000-0000-0000-0000-000000000000',data[0].REF,data[0].REF_NO)
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'arrowdown',
                                                        onClick:()=>
                                                        {
                                                            this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmCountFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : `SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,DEPOT_NAME,SUM(QUANTITY) AS QUANTITY,COUNT(REF) AS TOTAL_LINE FROM ITEM_COUNT_VW_01 GROUP BY REF,REF_NO,DOC_DATE,DEPOT_NAME ORDER BY DOC_DATE DESC`},sql:this.core.sql}}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                   
                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={70} />
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={70}  />                                        
                                        <Column dataField="DEPOT_NAME" caption={this.t("pg_Docs.clmDepotName")} width={300}  />
                                        <Column dataField="DOC_DATE" caption={this.t("pg_Docs.clmDocDate")} width={100}  />
                                        <Column dataField="TOTAL_LINE" caption={this.t("pg_Docs.clmTotalLine")} width={200}  />
                                        <Column dataField="QUANTITY" caption={this.t("pg_Docs.clmQuantity")} width={200}  />
                                    </NdPopGrid>
                                </NdItem>
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DEPOT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>{this.checkRow()}).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 "},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCountFrom" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                {/* dtDocDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>{this.checkRow()}).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCountFrom" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* BARKOD EKLEME */}
                                <NdItem>
                                    <NdLabel text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:"fa-solid fa-barcode",
                                                onClick:async(e)=>
                                                {
                                                    if(this.cmbDepot.value == '')
                                                    {
                                                        this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                                        this.txtBarcode.setState({value:""})
                                                        return
                                                    }

                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        let tmpDocItems = {...this.countObj.empty}
                                                        tmpDocItems.LINE_NO = this.countObj.dt().length
                                                        tmpDocItems.REF = this.txtRef.value
                                                        tmpDocItems.REF_NO = this.txtRefno.value
                                                        tmpDocItems.DEPOT = this.cmbDepot.value
                                                        tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                        this.txtRef.readOnly = true
                                                        this.txtRefno.readOnly = true
                                                        this.countObj.addEmpty(tmpDocItems)
                
                                                        await this.core.util.waitUntil(100)
                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            if(data.length == 1)
                                                            {
                                                                await this.addItem(data[0],this.countObj.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        this.addItem(data[i],this.countObj.dt().length - 1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpDocItems = {...this.countObj.empty}
                                                                        tmpDocItems.LINE_NO = this.countObj.dt().length
                                                                        tmpDocItems.REF = this.txtRef.value
                                                                        tmpDocItems.REF_NO = this.txtRefno.value
                                                                        tmpDocItems.DEPOT = this.cmbDepot.value
                                                                        tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.countObj.addEmpty(tmpDocItems)
        
                                                                        await this.core.util.waitUntil(100)
                                                                        this.addItem(data[i],this.countObj.dt().length - 1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.cmbDepot.value == '')
                                        {
                                            this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                            this.txtBarcode.setState({value:""})
                                            return
                                        }

                                        let tmpQuery = 
                                        {   query : `SELECT 
                                                    ITEMS.GUID,
                                                    ITEMS.CODE,
                                                    ITEMS.NAME,
                                                    ITEMS.VAT,
                                                    ITEMS.COST_PRICE,
                                                    ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE, 
                                                    ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME 
                                                    FROM ITEMS_VW_04 AS ITEMS 
                                                    INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID WHERE ITEMS.CODE = @CODE OR BARCODE.BARCODE = @CODE`,
                                            param : ['CODE:string|50'],
                                            value : [this.txtBarcode.value]
                                        }

                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            if(typeof this.countObj.dt()[this.countObj.dt().length - 1] == 'undefined' || this.countObj.dt()[this.countObj.dt().length - 1].CODE != '')
                                            {
                                                let tmpDocItems = {...this.countObj.empty}
                                                tmpDocItems.LINE_NO = this.countObj.dt().length
                                                tmpDocItems.REF = this.txtRef.value
                                                tmpDocItems.REF_NO = this.txtRefno.value
                                                tmpDocItems.DEPOT = this.cmbDepot.value
                                                tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.countObj.addEmpty(tmpDocItems)
                                            }
                                            
                                            this.addItem(tmpData.result.recordset[0],this.countObj.dt().length - 1)
                                        }
                                        else
                                        {
                                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:"warning"})
                                        }
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this.columnListBox}
                            />
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={1} onInitialized={(e)=>{this.frmCount = e.component}}>
                                <NdItem location="after">
                                    <Button icon="add"
                                    validationGroup={"frmCountFrom" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.countObj.dt()[0] != 'undefined')
                                            {
                                                if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            if(data.length == 1)
                                                            {
                                                                this.addItem(data[0],this.countObj.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        this.addItem(data[i],this.countObj.dt().length -1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpDocItems = {...this.countObj.empty}
                                                                        tmpDocItems.LINE_NO = this.countObj.dt().length
                                                                        tmpDocItems.REF = this.txtRef.value
                                                                        tmpDocItems.REF_NO = this.txtRefno.value
                                                                        tmpDocItems.DEPOT = this.cmbDepot.value
                                                                        tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.countObj.addEmpty(tmpDocItems)
                                                                        this.addItem(data[i],this.countObj.dt().length-1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                           
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                let tmpDocItems = {...this.countObj.empty}
                                                tmpDocItems.LINE_NO = this.countObj.dt().length
                                                tmpDocItems.REF = this.txtRef.value
                                                tmpDocItems.REF_NO = this.txtRefno.value
                                                tmpDocItems.DEPOT = this.cmbDepot.value
                                                tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.countObj.addEmpty(tmpDocItems)

                                                if(data.length > 0)
                                                {
                                                    if(data.length == 1)
                                                    {
                                                        this.addItem(data[0],this.countObj.dt().length -1)
                                                    }
                                                    else if(data.length > 1)
                                                    {
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            if(i == 0)
                                                            {
                                                                this.addItem(data[i],e.rowIndex)
                                                            }
                                                            else
                                                            {
                                                                let tmpDocItems = {...this.countObj.empty}
                                                                tmpDocItems.LINE_NO = this.countObj.dt().length
                                                                tmpDocItems.REF = this.txtRef.value
                                                                tmpDocItems.REF_NO = this.txtRefno.value
                                                                tmpDocItems.DEPOT = this.cmbDepot.value
                                                                tmpDocItems.DOC_DATE = this.dtDocDate.value
                                                                this.txtRef.readOnly = true
                                                                this.txtRefno.readOnly = true
                                                                this.countObj.addEmpty(tmpDocItems)
                                                                this.addItem(data[i],this.countObj.dt().length-1)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:"warning"})
                                        }
                                    }}/>
                                </NdItem>
                                <NdItem>
                                    <NdGrid parent={this} id={"grdItemCount"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'595'} 
                                    width={'100%'}
                                    dbApply={false}
                                    filterRow={{visible:true}} 
                                    loadPanel={{enabled:true}}
                                    onRowUpdated={async(e)=>
                                    {
                                        if(typeof e.data.QUANTITY != 'undefined' || typeof e.data.COST_PRICE != 'undefined')
                                        {
                                            e.key.TOTAL_COST = parseFloat(((e.key.QUANTITY * e.key.COST_PRICE) )).toFixed(3)
                                            let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                                            this.txtAmount.setState({value :totalPrice})
                                        }
                                    }}
                                    >
                                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                        {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menuOff.stk_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdItemCount.clmCreateDate")} width={200} visible={true} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdItemCount.clmCuser")} width={100} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdItemCount.clmItemCode")} width={150} visible={true} editCellRender={this.cellRoleRender}/>
                                        <Column dataField="BARCODE" caption={this.t("grdItemCount.clmBarcode")} width={150} visible={true} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdItemCount.clmItemName")} width={350} visible={true} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdItemCount.clmQuantity")} dataType={'number'} editCellRender={this.cellRoleRender} width={150} visible={true}/>
                                        <Column dataField="COST_PRICE" caption={this.t("grdItemCount.clmCostPrice")} dataType={'number'} width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="TOTAL_COST" caption={this.t("grdItemCount.clmTotalCost")} dataType={'number'}  width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdItemCount.clmMulticode")} dataType={'text'}  width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemCount.clmCustomerName")} dataType={'text'}  width={150} visible={true} allowEditing={false}/>
                                    </NdGrid>
                                </NdItem>
                            </NdForm>
                        </div>
                        <div className="row px-2 pt-2">
                            <div className="col-12">
                                <NdForm colCount={4} parent={this} id="frmslsDoc">
                                    <NdEmptyItem colSpan={3}/>
                                    {/*  Toplam Maliyet */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtAmount")} alignment="right" />
                                        <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                    </div>
                    <NdPopGrid id={"pg_txtItemsCode"}  parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    selection ={{mode:"single"}}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT 
                                        GUID,
                                        CODE,
                                        NAME,
                                        VAT,
                                        COST_PRICE,
                                        ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE, 
                                        ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS BARCODE, 
                                        ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME 
                                        FROM ITEMS_VW_04 AS ITEMS WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>                
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                    showTitle={true} 
                    title={this.t("msgQuantity.title")} 
                    showCloseButton={false}
                    width={"400px"}
                    height={"400px"}
                    button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'before'},{id:"btn02",caption:this.t("msgQuantity.btn02"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <NdForm>
                                    <NdItem>
                                        <NdSelectBox simple={true} parent={this} id="cmbPopQteUnit"
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async(e)=>
                                        {
                                            this.txtPopQteUnitFactor.value = this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].FACTOR
                                            if(this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].TYPE == 1)
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value / this.txtPopQteUnitFactor.value).toFixed(3))
                                            }
                                            else
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value * this.txtPopQteUnitFactor.value).toFixed(3))
                                            };
                                        }).bind(this)}
                                        />
                                    </NdItem>
                                    <NdItem>
                                        <NdLabel text={this.lang.t("msgQuantity.txtQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQuantity" parent={this} simple={true}  
                                        onEnterKey={(async(e)=>{this.msgQuantity._onClick()}).bind(this)}
                                        onValueChanged={(async(e)=>
                                        {
                                            if(typeof this.cmbPopQteUnit?.data?.datatable == 'undefined')
                                            {
                                                return
                                            }

                                            if(this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].TYPE == 1)
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value / this.txtPopQteUnitFactor.value).toFixed(3))
                                            }
                                            else
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value * this.txtPopQteUnitFactor.value).toFixed(3))
                                            };
                                        }).bind(this)}
                                        />
                                    </NdItem>
                                    <NdItem>
                                        <NdLabel text={this.lang.t("msgQuantity.txtUnitFactor")} alignment="right" />
                                        <NdNumberBox id="txtPopQteUnitFactor" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </NdItem>
                                    <NdItem>
                                        <NdLabel text={this.lang.t("msgQuantity.txtTotalQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQteUnitQuantity" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                    </NdDialog>  
                    {/* Dizayn Seçim PopUp */}
                    <NdPopUp parent={this} id={"popDesign"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popDesign.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'250'}
                    position={{of:'#root'}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '03'"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmPurcofferPrint"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validDesign")} />
                                    </Validator> 
                                </NdSelectBox>
                            </NdItem>
                            <NdItem>
                                <NdLabel text={this.t("popDesign.lang")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value={localStorage.getItem('lang').toUpperCase()}
                                searchEnabled={true}
                                data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                />
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                        
                                            let tmpQuery = 
                                            {
                                                query:  `SELECT *, 
                                                        ISNULL((SELECT TOP 1 NAME FROM COMPANY),'') AS FIRMA, 
                                                        REPLACE(ISNULL((SELECT ADDRESS1 + ' | ' + ADDRESS2  + ' | ' + TEL + ' | ' + MAIL FROM COMPANY),''),'|', CHAR(13)) AS BASLIK,
                                                        ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH 
                                                        FROM [dbo].[ITEM_COUNT_VW_01] 
                                                        WHERE REF=@REF AND REF_NO = @REF_NO ORDER BY LINE_NO ASC`,
                                                param:  ['REF:string|50','REF_NO:int','DESIGN:string|25'],
                                                value:  [this.countObj.dt()[0].REF,this.countObj.dt()[0].REF_NO,this.cmbDesignList.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                            {
                                                if(pResult.split('|')[0] != 'ERR')
                                                {
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

                                                    mywindow.onload = function() 
                                                    {
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                    } 
                                                }
                                            });
                                            this.popDesign.hide();  
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popDesign.hide()}}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    {/* Yönetici PopUp */}
                    <NdPopUp parent={this} id={"popPassword"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popPassword.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#root'}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popPassword.Password")} alignment="right" />
                                <NdTextBox id="txtPassword" mode="password" parent={this} simple={true} maxLength={32}/>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popPassword.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let tmpPass = btoa(this.txtPassword.value);
                                            let tmpQuery = 
                                            {
                                                query : "SELECT TOP 1 * FROM USERS WHERE PWD = @PWD AND ROLE = 'Administrator' AND STATUS = 1", 
                                                param : ['PWD:string|50'],
                                                value : [tmpPass],
                                            }

                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                for (let i = 0; i < this.countObj.dt().length; i++) 
                                                {
                                                    this.countObj.dt()[i].LOCKED = 0
                                                }
                                                this.frmCount.option('disabled',false)
                                                this.docLocked = false
                                                this.toast.show({message:this.t("msgPasswordSucces.msg"),type:"success"})
                                                this.popPassword.hide();  
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgPasswordWrong.msg"),type:"error"})
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>{this.popPassword.hide()}}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    {/* BARKOD POPUP */}
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtBarcode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT 
                                        ITEMS.GUID,
                                        ITEMS.CODE,
                                        ITEMS.NAME,
                                        ITEMS.VAT,
                                        ITEMS.COST_PRICE,
                                        ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE, 
                                        ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME,
                                        BARCODE.BARCODE AS BARCODE 
                                        FROM ITEMS_VW_04 AS ITEMS 
                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                        WHERE BARCODE.BARCODE LIKE '%'+@BARCODE`,
                                param : ['BARCODE:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                        <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>  
            </div>
        )
    }
}