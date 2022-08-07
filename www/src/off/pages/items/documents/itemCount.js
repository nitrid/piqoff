import React from 'react';
import App from '../../../lib/app.js';
import { itemCountCls } from '../../../../core/cls/count.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class itemCount extends React.Component
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

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._columnListBox = this._columnListBox.bind(this)

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
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
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
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.countObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.countObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })



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
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Evrağa Git",location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Evrak Bulundu"}</div>)
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
    async _calculateTotal()
    {
       
    }
    _cellRoleRender(e)
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
                    onValueChanged={(v)=>
                    {
                        e.value = v.value
                    }}
                onChange={(async(r)=>
                    {
                        if(typeof r.event.isTrusted == 'undefined')
                        {
                            let tmpQuery = 
                            {
                                query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS MULTICODE, "+
                                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS BARCODE, " + 
                                "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
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
                                let tmpConfObj =
                                {
                                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                                }
                    
                                await dialog(tmpConfObj);
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
                                id:'msgBigQuantity',showTitle:true,title:this.t("msgBigQuantity.title"),showCloseButton:true,width:'500px',height:'200px',
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
        let tmpBreak = false
        await this.msgQuantiy.show().then(async (e) =>
        {
            if(e == 'btn01')
            {
                tmpQuantity = this.txtQuantity.value
                this.msgQuantiy.hide()
            }
            else if(e == 'btn02')
            {
                tmpBreak = true
                if(this.countObj.dt()[this.countObj.dt().length - 1].ITEM_CODE == '')
                {
                    await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
                }
                this.msgQuantiy.hide()
                this.txtBarcode.focus()
            }
        })
        
        if(tmpBreak == true)
        {
            return
        }

        for (let i = 0; i < this.countObj.dt().length; i++) 
        {
            if(this.countObj.dt()[i].ITEM_CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'200px',
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
                        await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
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
                        await this.grdItemCount.devGrid.deleteRow(this.countObj.dt().length - 1)
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
        await this.countObj.save()

        let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
        this.txtAmount.setState({value :totalPrice})

    }
    _columnListBox(e)
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

                this.setState(
                    {
                        columnListValue : e.value
                    }
                )
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
            >
            </NdListBox>
        )
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmCountFrom"
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocLocked',showTitle:true,title:this.t("msgDocLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocLocked.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocLocked.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
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
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.countObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.countObj.dt('DOC').removeAt(0)
                                            await this.countObj.dt('DOC').delete();
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                              
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
                                    }}/>
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
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
                            <Form colCount={3} id="frmCountFrom">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM ITEM_COUNT WHERE REF = @REF ",
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
                                            <Validator validationGroup={"frmCountFrom"}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.countObj.dt('ITEM_COUNT'),field:"REF_NO"}}
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
                                            <Validator validationGroup={"frmCountFrom"}>
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
                                    data={{source:{select:{query : "SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,DEPOT_NAME,SUM(QUANTITY) AS QUANTITY,COUNT(REF) AS TOTAL_LINE  FROM ITEM_COUNT_VW_01 GROUP BY REF,REF_NO,DOC_DATE,DEPOT_NAME"},sql:this.core.sql}}}
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
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={70} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={70} defaultSortOrder="asc" />                                        
                                        <Column dataField="DEPOT_NAME" caption={this.t("pg_Docs.clmDepotName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="DOC_DATE" caption={this.t("pg_Docs.clmDocDate")} width={100} defaultSortOrder="asc" />
                                        <Column dataField="TOTAL_LINE" caption={this.t("pg_Docs.clmTotalLine")} width={200} defaultSortOrder="asc" />
                                        <Column dataField="QUANTITY" caption={this.t("pg_Docs.clmQuantity")} width={200} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* Boş */}
                                <EmptyItem />
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DEPOT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 "},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCountFrom"}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                        {
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCountFrom"}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* BARKOD EKLEME */}
                                <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.cmbDepot.value == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            this.txtBarcode.setState({value:""})
                                            return
                                        }
                                        let tmpQuery = 
                                        {   query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS MULTICODE,  " + 
                                            "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                            " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
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
                                            let tmpConfObj =
                                            {
                                                id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
                                        }
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
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
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmCount = e.component
                            }}>
                                <Item>
                                    <NdGrid parent={this} id={"grdItemCount"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    filterRow={{visible:true}} 
                                    loadPanel={{enabled:true}}
                                    onRowUpdated={async(e)=>{
                                        if(typeof e.data.QUANTITY != 'undefined' || typeof e.data.COST_PRICE != 'undefined')
                                        {
                                            e.key.TOTAL_COST = parseFloat(((e.key.QUANTITY * e.key.COST_PRICE) )).toFixed(3)
                                            let totalPrice= await this.countObj.dt().sum("TOTAL_COST",2)
                                            this.txtAmount.setState({value :totalPrice})
                                        }
                                    }}
                                    onRowRemoved={(e)=>{

                                    }}
                                    >
                                        <Paging defaultPageSize={15} />
                                         <Pager visible={true} allowedPageSizes={[5,10,50,500,1000]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="standard" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.stk_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdItemCount.clmCreateDate")} width={200} visible={true} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdItemCount.clmItemCode")} width={150} visible={true} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="BARCODE" caption={this.t("grdItemCount.clmBarcode")} width={150} visible={true} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdItemCount.clmItemName")} width={350} visible={true} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdItemCount.clmQuantity")} dataType={'number'} editCellRender={this._cellRoleRender} width={150} visible={true}/>
                                        <Column dataField="COST_PRICE" caption={this.t("grdItemCount.clmCostPrice")} dataType={'number'} width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="TOTAL_COST" caption={this.t("grdItemCount.clmTotalCost")} dataType={'number'}  width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdItemCount.clmMulticode")} dataType={'text'}  width={100} visible={true} allowEditing={false}/>
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemCount.clmCustomerName")} dataType={'text'}  width={150} visible={true} allowEditing={false}/>
                                    </NdGrid>
                                </Item>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup="frmCountFrom"
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
                                           
                                            let tmpDocItems = {...this.countObj.empty}
                                            tmpDocItems.LINE_NO = this.countObj.dt().length
                                            tmpDocItems.REF = this.txtRef.value
                                            tmpDocItems.REF_NO = this.txtRefno.value
                                            tmpDocItems.DEPOT = this.cmbDepot.value
                                            tmpDocItems.DOC_DATE = this.dtDocDate.value
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.countObj.addEmpty(tmpDocItems)
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
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                        <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmslsDoc">
                                {/* Ara Toplam */}
                                <EmptyItem />
                                {/*  Toplam Maliyet */}
                                <Item>
                                <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} 
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                            </Form>
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
                                query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS MULTICODE, " + 
                                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS BARCODE, " + 
                                "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                </ScrollView>  
                {/* Miktar Dialog  */}
                <NdDialog id={"msgQuantiy"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgQuantiy.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"250px"}
                    button={[{id:"btn01",caption:this.t("msgQuantiy.btn01"),location:'before'},{id:"btn02",caption:this.t("msgQuantiy.btn02"),location:'after'}]}
                    onShowed={()=>
                    {
                        this.txtQuantity.setState({value:1})
                        setTimeout(() => {
                            this.txtQuantity.focus()
                        }, 500);
                    }}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantiy.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                            <Form>
                                {/* txtQuantity */}
                                <Item>
                                    <Label text={this.t("txtQuantity")} alignment="right" />
                                    <NdTextBox id="txtQuantity" parent={this} simple={true}  
                                    param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                    value ={1}
                                    onFocusIn={(async(e)=>
                                        {
                                           
                                        }).bind(this)}
                                    >
                                    </NdTextBox>
                                </Item>
                            </Form>
                            </div>
                        </div>
                </NdDialog>             
            </div>
        )
    }
}