import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,docOrdersCls } from '../../../../core/cls/doc.js';
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
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class purchaseOrder extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this._getItems = this._getItems.bind(this)

        this.frmdocOrders = undefined;
        this.docLocked = false;   

        this.multiItemData = new datatable
       
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.getDoc(this.pagePrm.GUID,'',0)
        }
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
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.docObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.docObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.dtDocDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmdocOrders.option('disabled',false)
        await this.grdPurcOrders.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});

    }
    async getDoc(pGuid,pRef,pRefno)
    {
        console.log(pGuid)
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:60});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        if(this.docObj.dt()[0].LOCKED != 0)
        {
            this.docLocked = true
            let tmpConfObj =
            {
                id:'msgGetLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
            }

            await dialog(tmpConfObj);
            this.frmdocOrders.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmdocOrders.option('disabled',false)
        }
        this._getItems()
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
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docOrders.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docOrders.dt().sum("TOTAL",2)

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
                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                this.addItem(data[i],this.docObj.docOrders.dt().length-1)
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
                                query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
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
                                                    let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                    tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                    tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                    tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                    tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                    tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                    tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                    tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                    tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                    tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                    this.txtRef.readOnly = true
                                                    this.txtRefno.readOnly = true
                                                    this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                    this.addItem(data[i],this.docObj.docOrders.dt().length-1)
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
    }
    async addItem(pData,pIndex,pQuantity)
    {
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        let tmpCheckQuery = 
        {
            query :"SELECT MULTICODE,CUSTOMER_PRICE AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50'],
            value : [pData.CODE,this.docObj.dt()[0].OUTPUT]
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
        if(tmpCheckData.result.recordset.length == 0)
        {
            let tmpConfObj =
            {
                id:'msgCustomerNotFound',showTitle:true,title:this.t("msgCustomerNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCustomerNotFound.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCustomerNotFound.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerNotFound.msg")}</div>)
            }
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn02')
            {
                return
            }
        }
        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
        {
            if(this.docObj.docOrders.dt()[i].ITEM_CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + pQuantity
                    this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity).toFixed(3))
                    this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(3))
                    this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT).toFixed(3))
                    this._calculateTotal()
                    return
                }
                
            }
        }
        this.docObj.docOrders.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docOrders.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docOrders.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docOrders.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docOrders.dt()[pIndex].DISCOUNT = 0
        this.docObj.docOrders.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docOrders.dt()[pIndex].MULTICODE = tmpCheckData.result.recordset[0].MULTICODE
        this.docObj.docOrders.dt()[pIndex].QUANTITY = pQuantity
        let tmpQuery = 
        {
            query :"SELECT CUSTOMER_PRICE AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50'],
            value : [pData.CODE,this.docObj.dt()[0].OUTPUT]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.docOrders.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
            this.docObj.docOrders.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(2))
            this.docObj.docOrders.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE * pQuantity).toFixed(2) )
            this.docObj.docOrders.dt()[pIndex].TOTAL = parseFloat(((tmpData.result.recordset[0].PRICE * pQuantity)+ this.docObj.docOrders.dt()[pIndex].VAT).toFixed(2))
            this._calculateTotal()
        }
        else
        {
            this.docObj.docOrders.dt()[pIndex].PRICE =0
            this.docObj.docOrders.dt()[pIndex].VAT = 0
            this.docObj.docOrders.dt()[pIndex].AMOUNT = 0
            this.docObj.docOrders.dt()[pIndex].TOTAL = 0
            this._calculateTotal()
        }
    }
    async _getItems()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME,VAT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                    param : ['VAL:string|50']
                },
                sql:this.core.sql
            }
        }
        this.pg_txtItemsCode.setSource(tmpSource)
    } 
    async multiItemAdd()
    {
        let tmpMissCodes = []
        let tmpCounter = 0
        if(this.multiItemData.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMultiData',showTitle:true,title:this.t("msgMultiData.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgMultiData.btn01"),location:'before'},{id:"btn02",caption:this.t("msgMultiData.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiData.msg")}</div>)
            }

            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                this.multiItemData.clear()
            }
        }
        for (let i = 0; i < this.tagItemCode.value.length; i++) 
        {
            if(this.cmbMultiItemType.value == 0)
            {
                let tmpQuery = 
                {
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') = @VALUE " ,
                    param : ['VALUE:string|50'],
                    value : [this.tagItemCode.value[i]]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined')
                    {
                        this.multiItemData.push(tmpData.result.recordset[0])
                        tmpCounter = tmpCounter + 1
                    }
                }
                else
                {
                    tmpMissCodes.push("'" +this.tagItemCode.value[i] + "'")
                }
            }
            else if (this.cmbMultiItemType.value == 1)
            {
                let tmpQuery = 
                {
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VALUE) OR UPPER(NAME) LIKE UPPER(@VALUE) " ,
                    param : ['VALUE:string|50'],
                    value : [this.tagItemCode.value[i]]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined')
                    {
                        this.multiItemData.push(tmpData.result.recordset[0])
                        tmpCounter = tmpCounter + 1
                    }
                }
                else
                {
                    tmpMissCodes.push("'" +this.tagItemCode.value[i] + "'")
                }
            }
            
        }
        if(tmpMissCodes.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMissItemCode',showTitle:true,title:this.t("msgMissItemCode.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgMissItemCode.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",wordWrap:"break-word",fontSize:"20px"}}>{this.t("msgMissItemCode.msg") + ' ' +tmpMissCodes}</div>)
            }
        
            await dialog(tmpConfObj);
        }
        let tmpConfObj =
        {
            id:'msgMultiCodeCount',showTitle:true,title:this.t("msgMultiCodeCount.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgMultiCodeCount.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiCodeCount.msg") + ' ' +tmpCounter}</div>)
        }
    
         await dialog(tmpConfObj);

    }
    async multiItemSave()
    {
        for (let i = 0; i < this.multiItemData.length; i++) 
        {
            let tmpdocOrders = {...this.docObj.docOrders.empty}
            tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
            tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
            tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
            tmpdocOrders.REF = this.docObj.dt()[0].REF
            tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
            tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
            tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.txtRef.readOnly = true
            this.txtRefno.readOnly = true
            this.docObj.docOrders.addEmpty(tmpdocOrders)
            this.addItem(this.multiItemData[i],this.docObj.docOrders.dt().length-1,this.multiItemData[i].QUANTITY)
            this.popMultiItem.hide()
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
                                            this.getDoc(this.docObj.dt()[0].GUID,this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO)
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPurcOrder"  + this.tabIndex}
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
                                        if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdPurcOrders.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
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
                                                
                                                if((await this.docObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
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
                                            this.docObj.dt()[0].LOCKED = 1
                                            if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcOrders.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
                                            }
                                            if((await this.docObj.save()) == 0)
                                            {                                                    
                                                let tmpConfObj =
                                                {
                                                    id:'msgLocked',showTitle:true,title:this.t("msgLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgLocked.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLocked.msg")}</div>)
                                                }

                                                await dialog(tmpConfObj);
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 1)
                                        {
                                            this.popPassword.show()
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 2)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgLockedType2',showTitle:true,title:this.t("msgLockedType2.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgLockedType2.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLockedType2.msg")}</div>)
                                            }

                                            await dialog(tmpConfObj);
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
                            <Form colCount={3} id="frmPurcOrder">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 60 AND REF = @REF ",
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
                                            <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                            <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
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
                                    data={{source:{select:{query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0"},sql:this.core.sql}}}
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
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="OUTPUT_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="OUTPUT_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                            this.pg_txtCustomerCode.show()
                                            this.pg_txtCustomerCode.onClick = (data) =>
                                            { 
                                                if(data.length > 0)
                                                {
                                                    this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                    this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                    this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.setState({value:data[0].CODE});
                                                        this.txtRef.props.onChange()
                                                    }
                                                    this._getItems()
                                                }
                                            }
                                        }).bind(this)}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                            this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.setState({value:data[0].CODE});
                                                                this.txtRef.props.onChange()
                                                            }
                                                            this._getItems()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomerCode.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Tedarikçi']}/>
                                        
                                    </NdPopGrid>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}} 
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* Boş */}
                                <EmptyItem />
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                        {
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* Boş */}
                                <EmptyItem />
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmdocOrders = e.component
                            }}>
                                
                                 <Item>
                                    <NdGrid parent={this} id={"grdPurcOrders"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                        let rowIndex = e.component.getRowIndexByKey(e.key)

                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                        {
                                            e.key.DISCOUNT = parseFloat((((this.docObj.docOrders.dt()[rowIndex].AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(3))
                                        }
                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscount',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgDiscount.msg"}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            this.docObj.docOrders.dt()[rowIndex].DISCOUNT = 0 
                                            return
                                        }
                                        if(this.docObj.docOrders.dt()[rowIndex].VAT > 0)
                                        {
                                            this.docObj.docOrders.dt()[rowIndex].VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(2));
                                        }
                                        this.docObj.docOrders.dt()[rowIndex].AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(2))
                                        this.docObj.docOrders.dt()[rowIndex].TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +this.docObj.docOrders.dt()[rowIndex].VAT).toFixed(2))
                                        if(this.docObj.docOrders.dt()[rowIndex].DISCOUNT > 0)
                                        {
                                            this.docObj.docOrders.dt()[rowIndex].DISCOUNT_RATE = parseFloat(100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100).toFixed(2))
                                        }
                                        this._calculateTotal()
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                        await this.docObj.save()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="infinite" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.sip_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcOrders.clmCreateDate")} width={180} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdPurcOrders.clmItemCode")} width={150} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdPurcOrders.clmMulticode")} width={150}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdPurcOrders.clmItemName")} width={400} />
                                        <Column dataField="ITEM_BARCODE" caption={this.t("grdPurcOrders.clmBarcode")} width={150} allowEditing={false}/>
                                        <Column dataField="PRICE" caption={this.t("grdPurcOrders.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdPurcOrders.clmQuantity")} dataType={'number'}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdPurcOrders.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdPurcOrders.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdPurcOrders.clmDiscountRate")} dataType={'number'}/>
                                        <Column dataField="VAT" caption={this.t("grdPurcOrders.clmVat")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdPurcOrders.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPurcOrder">
                                {/* Ara Toplam-Stok Ekle */}
                                <Item location="after" colSpan={3}>
                                    <Button icon="add"
                                    validationGroup={"frmPurcOrder"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            
                                            if(typeof this.docObj.docOrders.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            if(data.length == 1)
                                                            {
                                                                this.addItem(data[0],this.docObj.docOrders.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        this.addItem(data[i],this.docObj.docOrders.dt().length -1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                        tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                        tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                        tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                        tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                        tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                        tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                        tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                        tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                        tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                        this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                           
                                            let tmpdocOrders = {...this.docObj.docOrders.empty}
                                            tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                            tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                            tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                            tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                            tmpdocOrders.REF = this.docObj.dt()[0].REF
                                            tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                            tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                            tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                            tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.docObj.docOrders.addEmpty(tmpdocOrders)
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    if(data.length == 1)
                                                    {
                                                        this.addItem(data[0],this.docObj.docOrders.dt().length -1)
                                                    }
                                                    else if(data.length > 1)
                                                    {
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            if(i == 0)
                                                            {
                                                                this.addItem(data[i],this.docObj.docOrders.dt().length -1)
                                                            }
                                                            else
                                                            {
                                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                this.txtRef.readOnly = true
                                                                this.txtRefno.readOnly = true
                                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                this.addItem(data[i],this.docObj.docOrders.dt().length-1)
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
                                     <Button icon="increaseindent" text="Toplu Ürün Ekleme"
                                    validationGroup={"frmPurcOrder"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.multiItemData.clear
                                            this.popMultiItem.show()
                                            if( typeof this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1] != 'undefined' && this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcInv.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
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
                                <Item  >
                                <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                    maxLength={32}
                                   
                                    ></NdTextBox>
                                </Item>
                                {/* İndirim */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtDiscount")} alignment="right" />
                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()  =>
                                                {
                                                    if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                    {
                                                        this.txtDiscountPercent.value  = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.docObj.dt()[0].DISCOUNT) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(2))
                                                        this.txtDiscountPrice.value = this.docObj.dt()[0].DISCOUNT
                                                    }
                                                    this.popDiscount.show()
                                                }
                                            },
                                        ]
                                    }
                                    ></NdTextBox>
                                </Item>
                                {/* KDV */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtVat")} alignment="right" />
                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'clear',
                                                onClick:async ()  =>
                                                {
                                                    
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                        {
                                                            this.docObj.docOrders.dt()[i].VAT = 0  
                                                            this.docObj.docOrders.dt()[i].VAT_RATE = 0
                                                            this.docObj.docOrders.dt()[i].TOTAL = (this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) - this.docObj.docOrders.dt()[i].DISCOUNT
                                                            this._calculateTotal()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    ></NdTextBox>
                                </Item>
                                {/* KDV */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    //param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* İndirim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDiscount"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDiscount.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDiscount.Percent")} alignment="right" />
                                    <NdNumberBox id="txtDiscountPercent" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPercent.value > 100)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent.value = 0;
                                                        this.txtDiscountPrice.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPrice.value =  parseFloat((this.docObj.dt()[0].AMOUNT * this.txtDiscountPercent.value / 100).toFixed(2))
                                            }).bind(this)}
                                    ></NdNumberBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popDiscount.Price")} alignment="right" />
                                <NdNumberBox id="txtDiscountPrice" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async()=>
                                        {
                                            if( this.txtDiscountPrice.value > this.docObj.dt()[0].AMOUNT)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDiscountPercent.value = 0;
                                                this.txtDiscountPrice.value = 0;
                                                return
                                            }
                                            this.txtDiscountPercent.value = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.txtDiscountPrice.value) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(2))
                                    }).bind(this)}
                                ></NdNumberBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                {
                                                    this.docObj.docOrders.dt()[i].DISCOUNT_RATE = this.txtDiscountPercent.value
                                                    this.docObj.docOrders.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(2))
                                                    if(this.docObj.docOrders.dt()[i].VAT > 0)
                                                    {
                                                        this.docObj.docOrders.dt()[i].VAT = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)).toFixed(2))
                                                    }
                                                    this.docObj.docOrders.dt()[i].TOTAL = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) + this.docObj.docOrders.dt()[i].VAT - this.docObj.docOrders.dt()[i].DISCOUNT).toFixed(2))
                                                }
                                                this._calculateTotal()
                                                this.popDiscount.hide(); 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popDiscount.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                     {/* Yönetici PopUp */}
                     <div>
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
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popPassword.Password")} alignment="right" />
                                    <NdTextBox id="txtPassword" parent={this} simple={true}
                                            maxLength={32}

                                    ></NdTextBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popPassword.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                if(this.txtPassword.value == '1234')
                                                {
                                                    this.docObj.dt()[0].LOCKED = 0
                                                    this.frmdocOrders.option('disabled',false)
                                                    this.docLocked = false
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPasswordSucces',showTitle:true,title:this.t("msgPasswordSucces.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPasswordSucces.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPasswordSucces.msg")}</div>)
                                                    }
                                        
                                                    await dialog(tmpConfObj);
                                                    this.popPassword.hide();  
                                                }
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPasswordWrong',showTitle:true,title:this.t("msgPasswordWrong.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPasswordWrong.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPasswordWrong.msg")}</div>)
                                                    }
                                        
                                                    await dialog(tmpConfObj);
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popPassword.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                        <Column dataField="MULTICODE" caption={this.t("pg_txtItemsCode.clmMulticode")} width={200}/>
                    </NdPopGrid>
                    {/* Dizayn Seçim PopUp */}
                    <div>
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
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '60'"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmPurcOrderPrint"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validDesign")} />
                                    </Validator> 
                                </NdSelectBox>
                            </Item>
                            <Item>
                            <Label text={this.t("popDesign.lang")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                data={{source:[{ID:"FR",VALUE:"FR"},{ID:"TR",VALUE:"TR"}]}}
                                >
                                </NdSelectBox>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let TmpFirma = "DORACAN Distribution SARL";
                                            let TmpBaslik = "ZAC HECKENWALD" + '\n' + "57740 LONGEVILLE-LES-ST-AVOLD" + '\n' + "Tel : 03 87 91 00 32" + '\n' + "longeville@prodorplus.fr" + '\n' 
                                            let tmpQuery = 
                                            {
                                                query:  "SELECT *, " +
                                                        "CONVERT(NVARCHAR,AMOUNT) AS AMOUNTF, " +
                                                        "@FIRMA AS FIRMA, " +
                                                        "@BASLIK AS BASLIK," +
                                                        "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH " +
                                                        "FROM DOC_ORDERS_VW_01 " +
                                                        "WHERE DOC_GUID=@DOC_GUID ORDER BY LINE_NO ASC",
                                                param:  ['DOC_GUID:string|50','DESIGN:string|25','FIRMA:string|250','BASLIK:string|250'],
                                                value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,TmpFirma,TmpBaslik]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
                                            {
                                                if(pResult.split('|')[0] != 'ERR')
                                                {
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                    mywindow.onload = function() 
                                                    {
                                                        console.log(11)
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                    }   
                                                }
                                            });
                                            this.popDesign.hide();  
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popDesign.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                    </div>  
                     {/* Toplu Stok PopUp */}
                     <div>
                        <NdPopUp parent={this} id={"popMultiItem"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMultiItem.title")}
                        container={"#root"} 
                        width={'900'}
                        height={'700'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={2} height={'fit-content'}>
                            <Item colSpan={2}>
                                <Label  alignment="right" />
                                    <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}
                                    />
                            </Item>
                            <Item></Item>       
                            <Item>
                                <Label text={this.t("cmbMultiItemType.title")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbMultiItemType" height='fit-content' 
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value={0}
                                data={{source:[{ID:0,VALUE:this.t("cmbMultiItemType.customerCode")},{ID:1,VALUE:this.t("cmbMultiItemType.ItemCode")}]}}
                                />
                            </Item>   
                            <Item></Item>   
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async (e)=>
                                        {       
                                           this.multiItemAdd()
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnClear")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.multiItemData.clear()
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                            <Item colSpan={2} >
                            <NdGrid parent={this} id={"grdMultiItem"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    headerFilter={{visible:true}}
                                    filterRow = {{visible:true}}
                                    height={400} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowRemoved={async (e)=>{
                                     
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="infinite" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Column dataField="CODE" caption={this.t("grdMultiItem.clmCode")} width={150} allowEditing={false} />
                                        <Column dataField="MULTICODE" caption={this.t("grdMultiItem.clmMulticode")} width={150} allowEditing={false} />
                                        <Column dataField="NAME" caption={this.t("grdMultiItem.clmName")} width={300}  headerFilter={{visible:true}} allowEditing={false} />
                                        <Column dataField="QUANTITY" caption={this.t("grdMultiItem.clmQuantity")} dataType={'number'} width={100} headerFilter={{visible:true}}/>
                                </NdGrid>
                            </Item>
                            <Item></Item>   
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                       
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.multiItemSave()
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                </ScrollView>                
            </div>
        )
    }
}