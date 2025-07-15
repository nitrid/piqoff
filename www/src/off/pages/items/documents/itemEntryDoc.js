import React from 'react';
import App from '../../../lib/app.js';
import { docCls } from '../../../../core/cls/doc.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import ContextMenu from 'devextreme-react/context-menu';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';

export default class itemEntryDoc extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
     
        this.cellRoleRender = this.cellRoleRender.bind(this)

        this.frmOutwas = undefined;
        this.docLocked = false;      
        this.combineControl = true
        this.combineNew = false  
        this.tabIndex = props.data.tabkey
        
        this.rightItems = [{ text: this.t("getDispatch"), }]
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()
        this.docObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:true});
            }
        })
        this.docObj.ds.on('onEdit',(pTblName,pData) =>
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
        this.docObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:true});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
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
                query: `SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE`,
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
        let tmpDoc = {...this.docObj.empty}
        tmpDoc.REF = this.user.CODE
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 0
        tmpDoc.REBATE = 0
        tmpDoc.OUTPUT = '00000000-0000-0000-0000-000000000000'
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        this.docLocked = false
        
        this.frmOutwas.option('disabled',false)
        await this.grdOutwasItems.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
        this.txtRef.props.onChange()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:0});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        if(this.docObj.dt()[0].LOCKED != 0)
        {
            this.docLocked = true
            this.toast.show({message:this.t("msgGetLocked.msg")})
            this.frmOutwas.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmOutwas.option('disabled',false)
        }
        this.calculateTotal()
        this.btnPrint.setState({disabled:false});
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

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
                        this.getDoc(pGuid,pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
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
    async calculateTotal()
    {
        let tmpTotal = 0

        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            tmpTotal += (this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].COST_PRICE)
        }

        this.txtTotalCost.setState({value:tmpTotal.toFixed(2)})
        let tmpQuantity = this.docObj.docItems.dt().sum("QUANTITY",0)
        this.txtTotalQuantity.setState({value:tmpQuantity})
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
                            this.combineControl = true
                            this.combineNew = false  
                            await this.pg_txtItemsCode.setVal(e.value)
                            this.pg_txtItemsCode.onClick = async(data) =>
                            {
                                if(data.length == 1)
                                {
                                    await this.addItem(data[0],e.rowIndex)
                                }
                                else if(data.length > 1)
                                {
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        if(i == 0)
                                        {
                                            await this.addItem(data[i],e.rowIndex)
                                        }
                                        else
                                        {
                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                            tmpDocItems.INPUT = '00000000-0000-0000-0000-000000000000'
                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                            this.combineControl = true
                            this.combineNew = false  
                            
                            let tmpQuery = 
                            {
                                query : `SELECT 
                                        ITEMS.GUID,
                                        ITEMS.CODE,
                                        ITEMS.NAME,
                                        ITEMS.VAT,
                                        ITEMS.COST_PRICE 
                                        FROM ITEMS_VW_04 AS ITEMS
                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                        WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE`,
                                param : ['CODE:string|50'],
                                value : [r.component._changedValue]
                            }

                            let tmpData = await this.core.sql.execute(tmpQuery) 

                            if(tmpData.result.recordset.length > 0)
                            {
                                await this.addItem(tmpData.result.recordset[0],e.rowIndex)
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
                                    this.combineControl = true
                                    this.combineNew = false

                                    if(data.length == 1)
                                    {
                                        await this.addItem(data[0],e.rowIndex)
                                    }
                                    else if(data.length > 1)
                                    {
                                        for (let i = 0; i < data.length; i++) 
                                        {
                                            if(i == 0)
                                            {
                                                await this.addItem(data[i],e.rowIndex)
                                            }
                                            else
                                            {
                                                let tmpDocItems = {...this.docObj.docItems.empty}
                                                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                tmpDocItems.REF = this.docObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpDocItems.INPUT = '00000000-0000-0000-0000-000000000000'
                                                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docItems.addEmpty(tmpDocItems)
                                                await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    ]
                }
                />  
            )
        }
        else if(e.column.dataField == "DESCRIPTION")
        {
            return (
                <NdTextBox id={"txtGrdDesc"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.docObj.docItems.dt()[e.rowIndex].DESCRIPTION = r.component._changedValue
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_quickDesc.show()
                                this.pg_quickDesc.onClick = async(data) =>
                                {
                                    if(data.length == 1)
                                    {
                                        e.value = data[0].DESCRIPTION
                                        this.docObj.docItems.dt()[e.rowIndex].DESCRIPTION = data[0].DESCRIPTION
                                    }
                                }
                            }
                        },
                    ]
                }
                />  
            )
        }
    }
    async addItem(pData,pIndex,pQuantity)
    {
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }

        App.instance.setState({isExecute:true})
        
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            if(this.docObj.docItems.dt()[i].ITEM_CODE == pData.CODE)
            {
                if(this.combineControl == true)
                {
                    let tmpCombineBtn = ''
                    App.instance.setState({isExecute:false})
                    await this.msgCombineItem.show().then(async (e) =>
                    {
    
                        if(e == 'btn01')
                        {
                            this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + pQuantity
                            this.calculateTotal()
                            await this.grdOutwasItems.devGrid.deleteRow(0)
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                            }
                            tmpCombineBtn = e
                            return
                        }
                        if(e == 'btn02')
                        {
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                                this.combineNew = true
                            }
                            return
                        }
                    })
                    if(tmpCombineBtn == 'btn01')
                    {
                        return
                    }
                }
                else if(this.combineNew == false)
                {
                    this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + pQuantity
                    this.calculateTotal()
                    await this.grdOutwasItems.devGrid.deleteRow(0)
                    return
                }
            }
        }

        this.docObj.docItems.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docItems.dt()[pIndex].BARCODE = pData.BARCODE
        this.docObj.docItems.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docItems.dt()[pIndex].VAT_RATE = 0
        this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docItems.dt()[pIndex].DISCOUNT = 0
        this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docItems.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.docObj.docItems.dt()[pIndex].QUANTITY = pQuantity

        this.calculateTotal()
        App.instance.setState({isExecute:false})
    }
    async checkRow()
    {
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.docItems.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docItems.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docItems.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
        }
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={()=>
                                    {
                                        this.getDoc(this.docObj.dt()[0].GUID,this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO)
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmOutwasFrom" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            this.toast.show({message:this.t("msgDocLocked.msg"),type:"warning"})
                                            return
                                        }

                                        if(typeof this.docObj.docItems.dt()[0] == 'undefined')
                                        {
                                            this.toast.show({message:this.lang.t("msgNotRow.msg"),type:"warning"})
                                            return
                                        }

                                        let tmpDatas = this.prmObj.filter({ID:'descriptionControl',USERS:this.user.CODE}).getValue()
                                        
                                        if(typeof tmpDatas != 'undefined' && tmpDatas.value ==  true)
                                        {
                                            for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                            {
                                                if(this.docObj.docItems.dt()[i].DESCRIPTION == '')
                                                {
                                                    this.toast.show({message:this.t("msgEmpDescription.msg"),type:"warning"})
                                                    return
                                                }
                                            }
                                        }

                                        if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdOutwasItems.devGrid.deleteRow(0)
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
                                                if((await this.docObj.save()) == 0)
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
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                        if(this.docLocked == true)
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
                                            this.docObj.dt('DOC').removeAt(0)
                                            await this.docObj.dt('DOC').delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnLock" parent={this} icon="key" type="default"
                                    onClick={async ()=>
                                    {
                                        if(this.docObj.dt()[0].LOCKED == 0)
                                        {
                                            this.docLocked = true
                                            this.docObj.dt()[0].LOCKED = 1
                                            this.frmOutwas.option('disabled',true)
                                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdOutwasItems.devGrid.deleteRow(0)
                                            }
                                            if((await this.docObj.save()) == 0)
                                            {                                                    
                                                this.toast.show({message:this.t("msgLocked.msg"),type:"success"})
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgSaveResult.msgFailed"),type:"error"})
                                            }
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 1)
                                        {
                                            this.txtPassword.setState({value:''})
                                            this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 2)
                                        {
                                            this.toast.show({message:this.t("msgLockedType2.msg"),type:"warning"})
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
                            <NdForm colCount={3} id="frmOutwasFrom">
                                {/* txtRef-Refno */}
                                <NdItem>
                                    <NdLabel text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-6 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 0 AND REF = @REF`,
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
                                                <Validator validationGroup={"frmOutwasFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-6 ps-0">
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                                    this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
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
                                                <Validator validationGroup={"frmOutwasFrom" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : `SELECT GUID,REF,REF_NO,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 0 AND REBATE = 0 ORDER BY DOC_DATE DESC`},sql:this.core.sql}}}
                                    button={[{id:'01',icon:'more',onClick:()=>{}}]}
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150}/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} />
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} />
                                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} />                                        
                                    </NdPopGrid>
                                </NdItem>
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbOutDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbOutDepot"
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>{this.checkRow()}).bind(this)}
                                    data={{source:{select:{query : `SELECT GUID,CODE,NAME FROM DEPOT_VW_01`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbOutDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbOutDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmOutwasFrom" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                {/* dtDocDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>{this.checkRow()}).bind(this)}
                                    >
                                        <Validator validationGroup={"frmOutwasFrom" + this.tabIndex}>
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
                                                    if(this.cmbOutDepot.value == '')
                                                    {
                                                        this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                                        this.txtBarcode.setState({value:""})
                                                        return
                                                    }
                                                  
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.setState({value:""})
                                                        let tmpDocItems = {...this.docObj.docItems.empty}
                                                        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                        tmpDocItems.REF = this.docObj.dt()[0].REF
                                                        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                        this.txtRef.readOnly = true
                                                        this.txtRefno.readOnly = true
                                                        this.docObj.docItems.addEmpty(tmpDocItems)
                                                        await this.core.util.waitUntil(100)

                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            if(data.length == 1)
                                                            {
                                                                await this.addItem(data[0],this.docObj.docItems.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        await this.addItem(data[i],this.docObj.docItems.dt().length -1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpDocItems = {...this.docObj.docItems.empty}
                                                                        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                                        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                                        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                                        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                                        tmpDocItems.REF = this.docObj.dt()[0].REF
                                                                        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                                        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                                        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.docObj.docItems.addEmpty(tmpDocItems)
        
                                                                        await this.core.util.waitUntil(100)
                                                                        await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                                        if(this.cmbOutDepot.value == '')
                                        {
                                            this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                            this.txtBarcode.setState({value:""})
                                            return
                                        }

                                        let tmpQuery = 
                                        {
                                            query : `SELECT 
                                                    ITEMS.GUID,
                                                    ITEMS.CODE,
                                                    ITEMS.NAME,
                                                    ITEMS.VAT,
                                                    ITEMS.COST_PRICE 
                                                    FROM ITEMS_VW_04 AS ITEMS
                                                    INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                                    WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE ORDER BY BARCODE.CDATE DESC`,
                                            param : ['CODE:string|50'],
                                            value : [this.txtBarcode.value]
                                        }

                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.combineControl = true
                                            this.combineNew = false  
                                            this.msgQuantity.tmpData = tmpData.result.recordset[0]
                                            
                                            let tmpResult = await this.msgQuantity.show()
                                            
                                            if(tmpResult == 'btn02')
                                            {
                                                return
                                            }

                                            if(typeof this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1] == 'undefined' || this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].CODE != '')
                                            {
                                                let tmpDocItems = {...this.docObj.docItems.empty}
                                                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                tmpDocItems.REF = this.docObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docItems.addEmpty(tmpDocItems)
                                            }
                                            await this.addItem(tmpData.result.recordset[0],this.docObj.docItems.dt().length - 1,this.txtPopQteUnitQuantity.value)  
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
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={1} onInitialized={(e)=>{this.frmOutwas = e.component}}>
                                <NdItem location="after">
                                    <Button icon="add"
                                    validationGroup={"frmOutwasFrom" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        this.combineControl = true
                                                        this.combineNew = false  

                                                        if(data.length == 1)
                                                        {
                                                            await this.addItem(data[0],this.docObj.docItems.dt().length-1)
                                                        }
                                                        else if(data.length > 1)
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(i == 0)
                                                                {
                                                                    await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                                }
                                                                else
                                                                {
                                                                    let tmpDocItems = {...this.docObj.docItems.empty}
                                                                    tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                                    tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                                    tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                    tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                                    tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                                    tmpDocItems.REF = this.docObj.dt()[0].REF
                                                                    tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                                    tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                    tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                                    tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                    tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                                    this.txtRef.readOnly = true
                                                                    this.txtRefno.readOnly = true
                                                                    this.docObj.docItems.addEmpty(tmpDocItems)
                                                                    await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                                                let tmpDocItems = {...this.docObj.docItems.empty}
                                                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                tmpDocItems.REF = this.docObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docItems.addEmpty(tmpDocItems)
                                                this.combineControl = true
                                                this.combineNew = false  

                                                if(data.length == 1)
                                                {
                                                    await this.addItem(data[0],this.docObj.docItems.dt().length-1)
                                                }
                                                else if(data.length > 1)
                                                {
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        if(i == 0)
                                                        {
                                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                        }
                                                        else
                                                        {
                                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                            this.txtRef.readOnly = true
                                                            this.txtRefno.readOnly = true
                                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            this.toast.show({message:this.t("msgDocValid.msg"),type:"warning"})
                                        }
                                    }}/>
                                </NdItem>
                                <NdItem>
                                    <React.Fragment>    
                                        <NdGrid parent={this} id={"grdOutwasItems"} 
                                        filterRow={{visible:true}} 
                                        height={'590'} 
                                        width={'100%'}
                                        dbApply={false}
                                        loadPanel={{enabled:true}}
                                        onRowUpdated={async(e)=>{this.calculateTotal()}}
                                        onRowRemoved={async(e)=>{this.calculateTotal()}}
                                        >
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Export fileName={this.lang.t("menuOff.stk_02_003")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdOutwasItems.clmCreateDate")} width={200} allowEditing={false}/>
                                            <Column dataField="CUSER_NAME" caption={this.t("grdOutwasItems.clmCuser")} width={100} allowEditing={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdOutwasItems.clmItemCode")} width={150} editCellRender={this.cellRoleRender}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdOutwasItems.clmItemName")} width={300} />
                                            <Column dataField="QUANTITY" caption={this.t("grdOutwasItems.clmQuantity")} dataType={'number'} width={150}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdOutwasItems.clmDescription")}>
                                            </Column>
                                        </NdGrid>
                                        <ContextMenu dataSource={this.rightItems} width={200} target="#grdOutwasItems"/>
                                    </React.Fragment>    
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 py-2">
                        <div className="col-12">
                            <NdForm colCount={4} parent={this} id="frmPurcoffer">
                                {/* TOPLAM MALIYET */}
                                <NdEmptyItem colSpan={3}/>
                                <NdItem>
                                    <NdLabel text={this.t("txtTotalCost")} alignment="right" />
                                    <NdTextBox id="txtTotalCost" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </NdItem>
                                {/* Toplam Miktar */}
                                <NdEmptyItem colSpan={3}/>
                                <NdItem>
                                    <NdLabel text={this.t("txtTotalQuantity")} alignment="right" />
                                    <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT GUID,CODE,NAME,VAT,COST_PRICE FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* İrsaliye Grid */}
                    <NdPopGrid id={"pg_dispatchGrid"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_dispatchGrid.title")} //
                    >
                        <Column dataField="REFERANS" caption={this.t("pg_dispatchGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="INPUT_NAME" caption={this.t("pg_dispatchGrid.clmCustomer")} width={300} />
                        <Column dataField="ITEM_CODE" caption={this.t("pg_dispatchGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_dispatchGrid.clmName")} width={300} />
                        <Column dataField="QUANTITY" caption={this.t("pg_dispatchGrid.clmQuantity")} width={300} />
                    </NdPopGrid>
                    {/* Yönetici PopUp */}
                    <NdPopUp parent={this} id={"popPassword"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popPassword.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
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
                                                query : `SELECT TOP 1 * FROM USERS WHERE PWD = @PWD AND ROLE = 'Administrator' AND STATUS = 1`, 
                                                param : ['PWD:string|50'],
                                                value : [tmpPass],
                                            }

                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.docObj.dt()[0].LOCKED = 0
                                                this.frmOutwas.option('disabled',false)
                                                this.docLocked = false
                                                this.toast.show({message:this.t("msgPasswordSucces.msg"),type:"success"})
                                                this.popPassword.hide();  
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgPasswordWrong.msg"),type:"warning"})
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popPassword.hide()}}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    {/* Hızlı Açıklama PopUp */}
                    <NdPopGrid id={"pg_quickDesc"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"single"}}
                    title={this.t("pg_quickDesc.title")} //
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT GUID,DESCRIPTION FROM [dbo].[QUICK_DESCRIPTION] WHERE PAGE = 'stk_02_003'`,
                            },
                            sql:this.core.sql
                        }
                    }}
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'add',
                                onClick:()=>
                                {
                                    this.txtQdescAdd.value = ''
                                    this.popQDescAdd.show()
                                    this.pg_quickDesc.hide()
                                }
                            }
                        ]
                    }
                    >
                        <Column dataField="DESCRIPTION" caption={this.t("pg_quickDesc.clmDesc")} width={150} />
                    </NdPopGrid>
                    {/* Açıklama Ekle PopUp */}
                    <NdPopUp parent={this} id={"popQDescAdd"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popQDescAdd.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popQDescAdd.description")} alignment="right" />
                                <NdTextBox id="txtQdescAdd" parent={this} simple={true} maxLength={32}/>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popQDescAdd.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let tmpDesc = {...this.qDescObj.empty}
                                            tmpDesc.DESCRIPTION = this.txtQdescAdd.value
                                            tmpDesc.PAGE = this.props.data.id
                                            this.qDescObj.addEmpty(tmpDesc);
                                            await this.qDescObj.save()
                                            this.popQDescAdd.hide();
                                            this.pg_quickDesc.show()
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popQDescAdd.hide()}}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    {/* combineItem Dialog  */}
                    <NdDialog id={"msgCombineItem"} container={"#root"} parent={this}
                    showTitle={true} 
                    title={this.t("msgCombineItem.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"auto"}
                    button={[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <NdForm>
                                    {/* checkCustomer */}
                                    <NdItem>
                                        <NdLabel text={this.lang.t("checkAll")} alignment="right" />
                                        <NdCheckBox id="checkCombine" parent={this} simple={true} value ={false}/>
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
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'500'}
                    height={'250'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '05'`},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                />
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
                                                query:  `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY LINE_NO `,
                                                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
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
                    {/* BARKOD POPUP */}
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                        BARCODE.BARCODE AS BARCODE 
                                        FROM ITEMS_VW_04 AS ITEMS
                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID 
                                        WHERE BARCODE.BARCODE LIKE '%'+ @BARCODE ORDER BY BARCODE.CDATE DESC`,
                                param : ['BARCODE:string|50'],
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                        <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this} 
                    showTitle={true} 
                    title={this.t("msgQuantity.title")} 
                    showCloseButton={false}
                    width={"400px"}
                    height={"auto"}
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
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>                
            </div>
        )
    }
}