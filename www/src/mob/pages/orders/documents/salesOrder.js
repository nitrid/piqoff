import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
import { docCls,docOrdersCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem, SimpleItem } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
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
import tr from '../../../meta/lang/devexpress/tr.js';
import { triggerHandler } from 'devextreme/events';
import NdPagerTab from '../../../../core/react/devex/pagertab.js';
import NbLabel from '../../../../core/react/bootstrap/label.js';
import validationEngine from "devextreme/ui/validation_engine"
import { isArray } from 'jquery';

export default class salesOrder extends React.PureComponent
{
    constructor()
    {
        super()
        this.barcode = 
        {
            name:"",
            vat:0,
            barcode: "",
            code:"",
            guid : "00000000-0000-0000-0000-000000000000",
            unit : "00000000-0000-0000-0000-000000000000",
            factor : 0,
            unit_id : ""
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.docObj = new docCls();

        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnSave")]
        this.setBarcode = this.setBarcode.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)
        this.barcodeScan = this.barcodeScan.bind(this)
        this._onItemRendered = this._onItemRendered.bind(this)
    }
    async init()
    {        
        this.docObj.clearAll()

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 60
        this.docObj.addEmpty(tmpDoc);
        
        this.txtCustomerCode.readOnly = false;
        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
    }
    async dropmenuClick(e)
    {
        if(e.itemData == this.t("btnNew"))
        {
            this.init()
        }
        else if(e.itemData == this.t("btnSave"))
        {
            let tmpConfObj =
            {
                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
            }
            
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                let tmpConfObj1 =
                {
                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
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
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:60});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    async barcodeScan()
    {
        cordova.plugins.barcodeScanner.scan(
            async function (result) 
            {
                if(result.cancelled == false)
                {
                    this.txtBarcode.value = result.text;
                    let tmpQuery = 
                    {
                        query : "SELECT GUID,CODE,NAME,BARCODE,VAT,UNIT_GUID,UNIT_ID,UNIT_FACTOR FROM ITEMS_BARCODE_MULTICODE_VW_01  WHERE BARCODE = @BARCODE OR CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length >0)
                    {
                        this.barcode.name = tmpData.result.recordset[0].NAME
                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                        this.barcode.code = tmpData.result.recordset[0].CODE 
                        this.barcode.guid = tmpData.result.recordset[0].GUID 
                        this.barcode.vat = tmpData.result.recordset[0].VAT 
                        this.barcode.unit = tmpData.result.recordset[0].UNIT_GUID
                        this.barcode.factor = tmpData.result.recordset[0].UNIT_FACTOR
                        this.barcode.unit_id = tmpData.result.recordset[0].UNIT_ID
                        this.setBarcode()
                    }
                    else
                    {
                        document.getElementById("Sound").play(); 
                        let tmpConfObj = 
                        {
                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        this.txtBarcode.value = ""
                    }
                }
            }.bind(this),
            function (error) 
            {
                //alert("Scanning failed: " + error);
            },
            {
              prompt : "Scan",
              orientation : "portrait"
            }
        );
    }
    async setBarcode()
    {
        this.txtQuantity.value = this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE}).getValue().value
        this.txtFactor.value = this.barcode.factor
        this.cmbUnit.value = this.barcode.unit_id
        
        let tmpQuery = 
        {
            query :"SELECT dbo.FN_PRICE_SALE_VAT_EXT(@GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000',@CONTRACT_CODE) AS PRICE",
            param : ['GUID:string|50','CONTRACT_CODE:string|25'],
            value : [this.barcode.guid,this.cmbPriceContract.value]
        }
        
        console.log(this.cmbPriceContract.value)
        let tmpData = await this.core.sql.execute(tmpQuery) 

        if(tmpData.result.recordset.length > 0)
        {
            this.txtPrice.value = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
            this.calculateItemPrice()
            // this.txtVat.value = parseFloat((tmpData.result.recordset[0].PRICE * (this.barcode.vat / 100)).toFixed(2))
            // this.txtAmount.value = parseFloat((Number(this.txtPrice.value) + Number(this.txtVat.value)).toFixed(2))
        }
        this.itemName.value = this.barcode.name

        let tmpQueryUnit = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1",
            param : ['ITEM_GUID:string|50'],
            value : [this.barcode.guid]
        }
        let tmpDataUnit = await this.core.sql.execute(tmpQueryUnit)
        await this.cmbUnit.dataRefresh({source : tmpDataUnit.result.recordset})
        
        if(this.chkAutoAdd.value == true)
        {
            setTimeout(async () => 
            {
                this.txtPopQuantity.focus()
            }, 500);
            await this.msgQuantity.show().then(async (e) =>
            {
                if(e == 'btn01')
                {
                    this.addItem(this.txtPopQuantity.value)
                }
            })
        }
        else
        {
            this.txtQuantity.focus()
        }        
    }
    barcodeReset()
    {
        if(this.chkAutoAdd.value == false)
        {
            this.barcode = 
            {
                name:"",
                vat:0,
                barcode: "",
                code:"",
                guid : "00000000-0000-0000-0000-000000000000",
            }
        }
        this.txtBarcode.value = ""
        this.txtAmount.value = 0
        this.txtVat.value = 0
        this.txtFactor.value = 0
        this.txtQuantity.value = 0
        this.txtPrice.value = 0
        this.txtBarcode.focus()
        this.itemName.value = this.barcode.name
    }
    async addItem(pQuantity)
    {        
        let validationResult = validationEngine.validateGroup('frmBarcode');
        if(validationResult.status == "valid")
        {
            if(this.txtBarcode.value == "")
            {
                let tmpConfObj = 
                {
                    id:'msgBarcodeCheck',showTitle:true,title:this.t("msgBarcodeCheck.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgBarcodeCheck.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeCheck.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }
            for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
            {
                if(this.docObj.docOrders.dt()[i].ITEM_CODE == this.barcode.code)
                {
                    document.getElementById("Sound2").play(); 
                    let tmpConfObj = 
                    {
                        id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                    }
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {                   
                        this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + (pQuantity * this.txtFactor.value)
                        this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity)).toFixed(3)
                        this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE)).toFixed(3)
                        this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT)).toFixed(3)
                        this._calculateTotal()
                        this.barcodeReset()
                        //BAĞLI ÜRÜN İÇİN YAPILDI ******************
                        await this.itemRelated(this.docObj.docOrders.dt()[i].ITEM,this.docObj.docOrders.dt()[i].QUANTITY)
                        //*****************************************/
                        return
                    }
                    else
                    {
                        break
                    }
                    
                }
            }
            let tmpDocItems = {...this.docObj.docOrders.empty}
            tmpDocItems.REF = this.docObj.dt()[0].REF
            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocItems.ITEM_NAME = this.barcode.name
            tmpDocItems.ITEM_CODE = this.barcode.code
            tmpDocItems.ITEM = this.barcode.guid
            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocItems.LINE_NO = this.docObj.docOrders.dt().length
            tmpDocItems.REF = this.docObj.dt()[0].REF
            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocItems.UNIT = this.barcode.unit
            tmpDocItems.UNIT_FACTOR = this.barcode.factor
            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocItems.QUANTITY = pQuantity * this.txtFactor.value
            tmpDocItems.VAT_RATE = this.barcode.vat
            tmpDocItems.PRICE = this.txtPrice.value
            tmpDocItems.VAT = (parseFloat(this.txtVat.value).toFixed(2))
            tmpDocItems.AMOUNT = (this.txtPrice.value * (pQuantity * this.txtFactor.value)).toFixed(2)
            tmpDocItems.TOTAL = this.txtAmount.value
            this.docObj.docOrders.addEmpty(tmpDocItems)
            this.barcodeReset()
            this._calculateTotal()
            //BAĞLI ÜRÜN İÇİN YAPILDI ******************
            await this.itemRelated(tmpDocItems.ITEM,pQuantity)
            //*****************************************/
            await this.docObj.save()
            this.txtPopQuantity.value = 1
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
    }
    itemRelated(pGuid,pQuantity)
    {
        return new Promise(async resolve =>
        {
            let tmpPrice = 0            
            let tmpRelatedQuery = 
            {
                query :"SELECT ITEM_GUID,ITEM_CODE,ITEM_NAME,ITEM_QUANTITY,RELATED_GUID,RELATED_CODE,RELATED_NAME,RELATED_QUANTITY FROM ITEM_RELATED_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
                param : ['ITEM_GUID:string|50'],
                value : [pGuid]
            }

            let tmpRelatedData = await this.core.sql.execute(tmpRelatedQuery)
            
            for (let i = 0; i < tmpRelatedData.result.recordset.length; i++) 
            {
                let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY

                if(tmpRelatedQt > 0)
                {
                    let tmpRelatedItemQuery = 
                    {   
                        query :"SELECT TOP 1 GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE,UNIT_GUID,UNIT_ID,UNIT_FACTOR FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        value : [tmpRelatedData.result.recordset[i].RELATED_GUID]
                    }
                    
                    let tmpRelatedItemData = await this.core.sql.execute(tmpRelatedItemQuery)

                    let tmpQuery = 
                    {
                        query :"SELECT dbo.FN_PRICE_SALE_VAT_EXT(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,NULL) AS PRICE",
                        param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
                        value : [tmpRelatedData.result.recordset[i].RELATED_GUID,tmpRelatedQt,this.docObj.dt()[0].INPUT]
                    }

                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    
                    if(tmpData.result.recordset.length > 0)
                    {
                        tmpPrice = tmpData.result.recordset[0].PRICE
                    }
                    
                    if(tmpRelatedItemData.result.recordset.length > 0)
                    {      
                        let tmpMerge = false

                        for (let x = 0; x < this.docObj.docOrders.dt().length; x++) 
                        {
                            if(this.docObj.docOrders.dt()[x].ITEM_CODE == tmpRelatedItemData.result.recordset[0].CODE)
                            {
                                this.docObj.docOrders.dt()[x].QUANTITY = this.docObj.docOrders.dt()[x].QUANTITY + (tmpRelatedQt * tmpRelatedItemData.result.recordset[0].UNIT_FACTOR)
                                this.docObj.docOrders.dt()[x].VAT = parseFloat((this.docObj.docOrders.dt()[x].VAT + (this.docObj.docOrders.dt()[x].PRICE * (this.docObj.docOrders.dt()[x].VAT_RATE / 100)) * tmpRelatedQt)).toFixed(3)
                                this.docObj.docOrders.dt()[x].AMOUNT = parseFloat((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE)).toFixed(3)
                                this.docObj.docOrders.dt()[x].TOTAL = parseFloat((((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE) - this.docObj.docOrders.dt()[x].DISCOUNT) + this.docObj.docOrders.dt()[x].VAT)).toFixed(3)
                                this._calculateTotal()
                                tmpMerge = true                                
                            }
                        }                        

                        if(!tmpMerge)
                        {
                            let tmpDocItems = {...this.docObj.docOrders.empty}
                            tmpDocItems.REF = this.docObj.dt()[0].REF
                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                            tmpDocItems.ITEM_NAME = tmpRelatedItemData.result.recordset[0].NAME
                            tmpDocItems.ITEM_CODE = tmpRelatedItemData.result.recordset[0].CODE
                            tmpDocItems.ITEM = tmpRelatedItemData.result.recordset[0].GUID
                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                            tmpDocItems.LINE_NO = this.docObj.docOrders.dt().length
                            tmpDocItems.REF = this.docObj.dt()[0].REF
                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                            tmpDocItems.UNIT = Array.isArray(tmpRelatedItemData.result.recordset[0].UNIT_GUID) ? tmpRelatedItemData.result.recordset[0].UNIT_GUID[0] : tmpRelatedItemData.result.recordset[0].UNIT_GUID
                            tmpDocItems.UNIT_FACTOR = tmpRelatedItemData.result.recordset[0].UNIT_FACTOR
                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                            tmpDocItems.QUANTITY = tmpRelatedQt * tmpRelatedItemData.result.recordset[0].UNIT_FACTOR
                            tmpDocItems.VAT_RATE = tmpRelatedItemData.result.recordset[0].VAT
                            tmpDocItems.PRICE = tmpPrice
                            tmpDocItems.VAT = parseFloat((tmpPrice * (tmpRelatedItemData.result.recordset[0].VAT / 100)) * tmpDocItems.QUANTITY).toFixed(2)
                            tmpDocItems.AMOUNT = (tmpPrice * tmpDocItems.QUANTITY).toFixed(2)
                            tmpDocItems.TOTAL = parseFloat(((tmpPrice * tmpDocItems.QUANTITY) + (tmpDocItems.VAT * tmpDocItems.QUANTITY))).toFixed(2)
                            this.docObj.docOrders.addEmpty(tmpDocItems)
                            this._calculateTotal()
                        }
                    }
                }                
            }
            resolve()
        })
    }
    itemRelatedUpdate(pGuid,pQuantity)
    {
        return new Promise(async resolve =>
        {
            await this.core.util.waitUntil()
            let tmpRelatedQuery = 
            {
                query :"SELECT ITEM_GUID,ITEM_CODE,ITEM_NAME,ITEM_QUANTITY,RELATED_GUID,RELATED_CODE,RELATED_NAME,RELATED_QUANTITY FROM ITEM_RELATED_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
                param : ['ITEM_GUID:string|50'],
                value : [pGuid]
            }
            
            let tmpRelatedData = await this.core.sql.execute(tmpRelatedQuery)                        
            
            for (let i = 0; i < tmpRelatedData.result.recordset.length; i++) 
            {
                let tmpExist = false
                for (let x = 0; x < this.docObj.docOrders.dt().length; x++) 
                {
                    if(this.docObj.docOrders.dt()[x].ITEM_CODE == tmpRelatedData.result.recordset[i].RELATED_CODE)
                    {                
                        let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY
                        
                        if(tmpRelatedQt > 0)
                        {
                            this.docObj.docOrders.dt()[x].QUANTITY = tmpRelatedQt
                            this.docObj.docOrders.dt()[x].VAT = parseFloat((this.docObj.docOrders.dt()[x].VAT + (this.docObj.docOrders.dt()[x].PRICE * (this.docObj.docOrders.dt()[x].VAT_RATE / 100) * pQuantity)).toFixed(4))
                            this.docObj.docOrders.dt()[x].AMOUNT = parseFloat((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTAL = parseFloat((((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE) - this.docObj.docOrders.dt()[x].DISCOUNT) + this.docObj.docOrders.dt()[x].VAT).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTALHT =  parseFloat((this.docObj.docOrders.dt()[x].TOTAL - this.docObj.docOrders.dt()[x].VAT).toFixed(4))
                        }
                        tmpExist = true
                    }
                }
                if(!tmpExist)
                {
                    await this.itemRelated(pGuid,pQuantity)
                }
            }
            resolve()
        })
    }
    calculateItemPrice()
    {
        this.txtVat.value =  parseFloat(((this.txtPrice.value * (this.barcode.vat / 100)) * (this.txtQuantity.value * this.txtFactor.value)).toFixed(2))
        this.txtAmount.value = parseFloat((parseFloat((this.txtPrice.value * (this.txtQuantity.value * this.txtFactor.value))) + parseFloat(this.txtVat.value))).toFixed(2)
    }
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docOrders.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docOrders.dt().sum("TOTAL",2)
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(1000)
        if(e.itemData.name == "Main")
        {   
            this.init()
        }
        else if(e.itemData.name == "Document")
        {
            await this.grdSlsOrder.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
        }
    }
    render()
    {
        return(
        <ScrollView>
            <div className="row p-2">
                <div className="row px-1 py-1">
                    <NdPagerTab id={"page"} parent={this} onItemRendered={this._onItemRendered}>
                        <Item name={"Main"}>
                            <div className="row px-1 py-1">
                                <Form colCount={1}>
                                    {/* txtRef-Refno */}
                                    <Item>
                                        <Label text={this.t("txtRefRefno")} alignment="right" />
                                        <div className="row">
                                            <div className="col-4 pe-0">
                                                <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                readOnly={false}
                                                maxLength={32}
                                                onChange={(async()=>
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 AND REF = @REF ",
                                                        param : ['REF:string|25'],
                                                        value : [this.txtRef.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                    }
                                                }).bind(this)}
                                                >
                                                    <Validator validationGroup={"frmLabelQeueu"}>
                                                        <RequiredRule message={this.t("validRef")} />
                                                    </Validator>  
                                                </NdTextBox>
                                            </div>
                                            <div className="col-8 ps-0">
                                                <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                readOnly={true}
                                                button=
                                                {
                                                    [
                                                        {
                                                            id:'01',
                                                            icon:'more',
                                                            onClick:async()=>
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
                                                        },
                                                        {
                                                            id:'03',
                                                            icon:'revert',
                                                            onClick:()=>
                                                            {
                                                                this.init()
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
                                                >
                                                <Validator validationGroup={"frmLabelQeueu"}>
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
                                        headerFilter = {{visible:false}}
                                        showBorders={true}
                                        width={'100%'}
                                        height={'100%'}
                                        selection={{mode:"single"}}
                                        title={this.t("pg_Docs.title")} 
                                        data={{source:{select:{query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0 AND DOC_DATE > GETDATE() - 30"},sql:this.core.sql}}}
                                        >
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={100} defaultSortOrder="asc" />
                                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={150} defaultSortOrder="asc" />
                                        <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={150} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </Item>
                                    {/* Depot */}
                                    <Item>
                                        <Label text={this.t("txtDepot")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh={true}
                                        dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                        displayExpr="NAME"
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        >
                                        </NdSelectBox>
                                    </Item>
                                    {/* txtCustomerCode */}
                                    <Item>
                                        <Label text={this.t("txtCustomerCode")} alignment="right" />
                                        <div className="row">
                                            <div className="col-12">
                                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}}
                                                onEnterKey={(async()=>
                                                {
                                                    await this.pg_CustomerSelect.setVal(this.txtCustomerCode.value)
                                                    this.pg_CustomerSelect.show()
                                                    this.pg_CustomerSelect.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.docObj.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE;
                                                                this.txtRef.props.onChange()
                                                            }
                                                        }
                                                    }
                                                }).bind(this)}
                                                button=
                                                {
                                                    [
                                                        {
                                                            id:'01',
                                                            icon:'more',
                                                            onClick:async()=>
                                                            {
                                                                this.pg_CustomerSelect.show()
                                                                this.pg_CustomerSelect.onClick = (data) =>
                                                                {
                                                                    if(data.length > 0)
                                                                    {
                                                                        this.docObj.dt()[0].INPUT = data[0].GUID
                                                                        this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                                        this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                                        let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                                        
                                                                        if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                                        {
                                                                            this.txtRef.value = data[0].CODE;
                                                                            this.txtRef.props.onChange()
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id:'02',
                                                            icon:'arrowdown',
                                                            onClick:()=>
                                                            {
                                                                
                                                            }
                                                        }
                                                    ]
                                                }
                                                onChange={(async()=>
                                                {
                                                    
                                                }).bind(this)}
                                                param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                                access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                                >
                                                </NdTextBox>
                                            </div>
                                        </div>
                                        {/*CARİ SEÇİM */}
                                        <NdPopGrid id={"pg_CustomerSelect"} parent={this} container={"#root"}
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        headerFilter = {{visible:false}}
                                        width={'100%'}
                                        height={'100%'}
                                        selection={{mode:"single"}}
                                        title={this.t("pg_CustomerSelect.title")} 
                                        search={true}
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        >
                                            <Column dataField="CODE" caption={this.t("pg_CustomerSelect.clmCode")} width={150} />
                                            <Column dataField="TITLE" caption={this.t("pg_CustomerSelect.clmTitle")} width={200} defaultSortOrder="asc" />
                                            <Column dataField="TYPE_NAME" caption={this.t("pg_CustomerSelect.clmTypeName")} width={100} />
                                            <Column dataField="GENUS_NAME" caption={this.t("pg_CustomerSelect.clmGenusName")} width={100} />
                                        </NdPopGrid>
                                    </Item> 
                                    {/* txtCustomerName */}
                                    <Item>
                                        <Label text={this.t("txtCustomerName")} alignment="right" />
                                        <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                        readOnly={true}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} 
                                        param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </Item> 
                                    {/* txtDate */}
                                    <Item>
                                        <Label text={this.t("txtDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"}
                                        dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                        onValueChanged={(async()=>{}).bind(this)}
                                        >
                                            <Validator validationGroup={"frmslsDoc"}>
                                                <RequiredRule message={this.t("validDocDate")} />
                                            </Validator> 
                                        </NdDatePicker>
                                    </Item>
                                    {/* cmbPriceContract */}
                                    <Item>
                                        <Label text={this.t("cmbPriceContract")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbPriceContract" notRefresh={true}
                                        displayExpr="NAME"
                                        valueExpr="CODE"
                                        value=""
                                        searchEnabled={true}
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM CONTRACT_VW_01 WHERE CUSTOMER = '00000000-0000-0000-0000-000000000000' GROUP BY CODE,NAME ORDER BY CODE ASC"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbPriceContract',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbPriceContract',USERS:this.user.CODE})}
                                        >
                                        </NdSelectBox>
                                    </Item>
                                    <Item>
                                        <div className="row">
                                            <div className="col-6 px-2 pt-2">
                                                <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%" onClick={async()=>{
                                                    if(this.cmbDepot.value == "")
                                                    {
                                                        let tmpConfObj = 
                                                        {
                                                            id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    else if(this.docObj.dt()[0].INPUT_CODE == "")
                                                    {
                                                        let tmpConfObj = 
                                                        {
                                                            id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    this.page.pageSelect("Barcode")
                                                }}
                                                ></NdButton>
                                            </div>
                                            <div className="col-6 px-2 pt-2">
                                                <NdButton text={this.t("btnDocument")} type="default" width="100%" onClick={()=>this.page.pageSelect("Document")}></NdButton>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </div>
                        </Item>
                        <Item name={"Barcode"}>
                            <div className="row px-1 py-1">
                                <Form colCount={1}>
                                    <Item>
                                        <div className="row">
                                            <div className="col-4 px-1 pt-1">
                                                <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                            </div>
                                            <div className="col-4 px-1 pt-1">
                                                <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.page.pageSelect("Document")}></NdButton>
                                            </div>
                                            <div className="col-4 px-1 pt-1">
                                            <DropDownButton
                                            text={this.t("mnuDetail.text")}
                                            style={{width:'100%',backgroundColor:"#337ab7",borderRadius: "5px"}}
                                            dropDownOptions={{width:'100%'}}
                                            displayExpr="text"
                                            keyExpr="id"
                                            items={[{id:'btn01',text:this.t("mnuDetail.btn01")}]}
                                            onItemClick={async (e)=>
                                            {
                                                if(e.itemData.id == 'btn01')
                                                {
                                                    let tmpConfObj = 
                                                    {
                                                        id:'msgDetail',showTitle:true,title:this.t("msgDetail.title"),showCloseButton:true,width:'350px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDetail.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }}
                                            />                                                
                                            </div>
                                        </div>
                                    </Item>
                                    <Item>
                                        <div className="col-12 px-2 pt-2">
                                            <NdTextBox id="txtBarcode" parent={this} placeholder={this.t("txtBarcodePlace")}
                                            button={
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:async()=>
                                                    {
                                                        this.popItemCode.show()
                                                        this.popItemCode.onClick = async(data) =>
                                                        {
                                                            if(data.length == 1)
                                                            {
                                                                this.txtBarcode.value = data[0].CODE
                                                                this.barcode = 
                                                                {
                                                                    name:data[0].NAME,
                                                                    code:data[0].CODE,
                                                                    barcode:data[0].BARCODE,
                                                                    guid : data[0].GUID,
                                                                    vat : data[0].VAT,
                                                                    unit : data[0].UNIT_GUID,
                                                                    factor : data[0].UNIT_FACTOR,
                                                                    unit_id : data[0].UNIT_ID
                                                                }
                                                                await this.setBarcode()
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    this.txtBarcode.value = data[i].CODE
                                                                    this.barcode = 
                                                                    {
                                                                        name:data[i].NAME,
                                                                        code:data[i].CODE,
                                                                        barcode:data[i].BARCODE,
                                                                        guid : data[i].GUID,
                                                                        vat : data[i].VAT,
                                                                        unit : data[i].UNIT_GUID,
                                                                        factor : data[i].UNIT_FACTOR,
                                                                        unit_id : data[i].UNIT_ID
                                                                    }
                                                                    await this.setBarcode()
                                                                    await this.addItem()
                                                                }
                                                                let tmpConfObj = 
                                                                {
                                                                    id:'msgItemsAdd',showTitle:true,title:this.t("msgItemsAdd.title"),showCloseButton:true,width:'350px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.t("msgItemsAdd.btn01"),location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemsAdd.msg")}</div>)
                                                                }
                                                                await dialog(tmpConfObj);
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    id:'02',
                                                    icon:'photo',
                                                    onClick:async()=>
                                                    {
                                                        this.barcodeScan()
                                                    }
                                                }
                                            ]}
                                            onEnterKey={(async(e)=>
                                            {
                                                if(e.component._changedValue == "")
                                                {
                                                    return
                                                }
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT GUID,CODE,NAME,BARCODE,VAT,UNIT_GUID,UNIT_ID,UNIT_FACTOR FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE = @BARCODE OR CODE = @BARCODE ",
                                                    param : ['BARCODE:string|50'],
                                                    value : [e.component._changedValue]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length >0)
                                                {
                                                    this.barcode.name = tmpData.result.recordset[0].NAME
                                                    this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                                    this.barcode.code = tmpData.result.recordset[0].CODE 
                                                    this.barcode.guid = tmpData.result.recordset[0].GUID 
                                                    this.barcode.vat = tmpData.result.recordset[0].VAT 
                                                    this.barcode.unit = tmpData.result.recordset[0].UNIT_GUID
                                                    this.barcode.factor = tmpData.result.recordset[0].UNIT_FACTOR
                                                    this.barcode.unit_id = tmpData.result.recordset[0].UNIT_ID
                                                    this.setBarcode()
                                                    
                                                }
                                                else
                                                {
                                                    await this.popItemCode.setVal(e.component._changedValue)
                                                    this.popItemCode.show()
                                                    this.popItemCode.onClick = async(data) =>
                                                    {
                                                        if(data.length == 1)
                                                        {
                                                            this.txtBarcode.value = data[0].CODE
                                                            this.barcode = 
                                                            {
                                                                name:data[0].NAME,
                                                                code:data[0].CODE,
                                                                barcode:data[0].BARCODE,
                                                                guid : data[0].GUID,
                                                                vat : data[0].VAT,
                                                                unit : data[0].UNIT_GUID,
                                                                factor : data[0].UNIT_FACTOR,
                                                                unit_id : data[0].UNIT_ID
                                                            }
                                                            await this.setBarcode()
                                                        }
                                                        else if(data.length > 1)
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                this.txtBarcode.value = data[i].CODE
                                                                this.barcode = 
                                                                {
                                                                    name:data[i].NAME,
                                                                    code:data[i].CODE,
                                                                    barcode:data[i].BARCODE,
                                                                    guid : data[i].GUID,
                                                                    vat : data[i].VAT,
                                                                    unit : data[i].UNIT_GUID,
                                                                    factor : data[i].UNIT_FACTOR,
                                                                    unit_id : data[i].UNIT_ID
                                                                }
                                                                await this.setBarcode()
                                                                await this.addItem()
                                                            }
                                                            let tmpConfObj = 
                                                            {
                                                                id:'msgItemsAdd',showTitle:true,title:this.t("msgItemsAdd.title"),showCloseButton:true,width:'350px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgItemsAdd.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemsAdd.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                        }
                                                    }
                                                }
                                            }).bind(this)}/>
                                        </div>
                                    </Item>
                                    <Item> 
                                        <div>
                                            <h5 className="text-center">
                                                <NbLabel id="itemName" parent={this} value={""}/>
                                            </h5>
                                        </div>
                                    </Item>
                                    <Item>
                                        <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} defaultValue={true} value={true} 
                                        param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                                    </Item>
                                    {/* txtQuantity */}
                                    <Item>
                                        <Label text={this.t("txtQuantity")}/>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <NdNumberBox id="txtFactor" parent={this} simple={true} readOnly={true} 
                                                param={this.param.filter({ELEMENT:'txtFactor',USERS:this.user.CODE})}
                                                access={this.access.filter({ELEMENT:'txtFactor',USERS:this.user.CODE})}
                                                >
                                                </NdNumberBox>
                                            </div>
                                            <div className='col-4'>
                                                <NdNumberBox id="txtQuantity" parent={this} simple={true}  
                                                param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                                access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                                onValueChanged={(async(e)=>
                                                {
                                                    this.calculateItemPrice()
                                                }).bind(this)}
                                                >
                                                </NdNumberBox>
                                            </div>
                                            <div className='col-4'>
                                                <NdSelectBox simple={true} parent={this} id="cmbUnit" height='fit-content' 
                                                style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                                displayExpr="NAME"                       
                                                valueExpr="ID"
                                                param={this.param.filter({ELEMENT:'cmbUnit',USERS:this.user.CODE})}
                                                access={this.access.filter({ELEMENT:'cmbUnit',USERS:this.user.CODE})}
                                                onValueChanged={(e)=>
                                                {
                                                    let tmpDt = this.cmbUnit.data.datatable.where({ID:e.value})
                                                    
                                                    this.barcode.unit = tmpDt.length > 0 ? tmpDt[0].GUID : '00000000-0000-0000-0000-000000000000'
                                                    this.barcode.factor = tmpDt.length > 0 ? tmpDt[0].FACTOR : 1
                                                    this.txtFactor.value = this.barcode.factor

                                                    this.calculateItemPrice()
                                                }}
                                                />
                                            </div>
                                        </div>
                                    </Item>
                                    {/* txtPrice */}
                                    <Item>
                                        <Label text={this.t("txtPrice")} alignment="right" />
                                        <NdNumberBox id="txtPrice" parent={this} simple={true}
                                        param={this.param.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                                        onValueChanged={(async(e)=>
                                        {
                                            this.calculateItemPrice()
                                        }).bind(this)}
                                        >
                                        </NdNumberBox>
                                    </Item>
                                    {/* txtVat */}
                                    <Item>
                                        <Label text={this.t("txtVat")} alignment="right" />
                                        <NdTextBox id="txtVat" parent={this} simple={true}  
                                        readOnly={true}
                                        param={this.param.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </Item>
                                    {/* txtAmount */}
                                    <Item>
                                        <Label text={this.t("txtAmount")} alignment="right" />
                                        <NdTextBox id="txtAmount" parent={this} simple={true}  
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        readOnly={true}
                                        param={this.param.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </Item>
                                    <Item>
                                        <div className="row">
                                            <div className="col-12 px-2 pt-2">
                                                <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={(e)=>this.addItem(this.txtQuantity.value)}></NdButton>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </div>
                        </Item>
                        <Item name={"Document"}>
                            <div className="row px-1 py-1">
                                <Form colCount={1} >
                                    <Item>
                                        <div className="row">
                                            <div className="col-4 px-1 pt-1">
                                                <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.page.pageSelect("Main")}></NdButton>
                                            </div>
                                            <div className="col-4 px-1 pt-1">
                                                <NdButton icon="plus" type="default" width="100%" onClick={async()=>{
                                                    if(this.cmbDepot.value == "")
                                                    {
                                                        let tmpConfObj = 
                                                        {
                                                            id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    else if(this.docObj.dt()[0].INPUT_CODE == "")
                                                    {
                                                        let tmpConfObj = 
                                                        {
                                                            id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    this.page.pageSelect("Barcode")
                                                }}
                                                ></NdButton>
                                            </div>
                                            <div className="col-4">
                                                
                                            </div>
                                        </div>
                                    </Item>
                                    <Item>
                                        <div className='col-12 px-2 pt-2'>
                                        <NdGrid parent={this} id={"grdSlsOrder"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter = {{visible:false}}
                                        height={'350'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowUpdating={async (e)=>
                                        {
                                            if(typeof e.newData.QUANTITY != 'undefined')
                                            {
                                                //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                                                await this.itemRelatedUpdate(e.key.ITEM,e.newData.QUANTITY)
                                                //*****************************************/
                                            }
                                        }}
                                        onRowUpdated={async(e)=>
                                        {
                                            let rowIndex = e.component.getRowIndexByKey(e.key)

                                            if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                            {
                                                e.key.DISCOUNT = parseFloat((((e.key.AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(2))
                                            }

                                            if(e.key.COST_PRICE > e.key.PRICE )
                                            {
                                                let tmpData = this.acsobj.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
                                                if(typeof tmpData != 'undefined' && tmpData ==  true)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgUnderPrice1',showTitle:true,title:this.t("msgUnderPrice1.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgUnderPrice1.btn01"),location:'before'},{id:"btn02",caption:this.t("msgUnderPrice1.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgUnderPrice1.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        
                                                    }
                                                    else if(pResult == 'btn02')
                                                    {
                                                        return
                                                    }
                                                }
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgUnderPrice2',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgUnderPrice2.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgUnderPrice2.msg"}</div>)
                                                    }
                                                    dialog(tmpConfObj);
                                                    return
                                                }
                                            }
                                            if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscount',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                                }
                                            
                                                dialog(tmpConfObj);
                                                e.key.DISCOUNT = 0 
                                                return
                                            }
                                            if(e.key.VAT > 0)
                                            {
                                                e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(2));
                                            }
                                            e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(2))
                                            e.key.TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +e.key.VAT).toFixed(2))

                                            let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
                                            let tmpMarginRate = (tmpMargin) * 100
                                            e.key.MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
                                            if(e.key.DISCOUNT > 0)
                                            {
                                                e.key.DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(2))
                                            }
                                            console.log(e.key.MARGIN)
                                            this._calculateTotal()
                                        }}
                                        onContentReady={async(e)=>{
                                                e.component.columnOption("command:edit", 'visibleIndex', -1)
                                            }}
                                        onRowRemoved={async (e)=>{
                                            this._calculateTotal()
                                            await this.docObj.save()
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                            <Scrolling mode="standart" />
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdSlsOrder.clmItemName")} width={150} />
                                            <Column dataField="QUANTITY" caption={this.t("grdSlsOrder.clmQuantity")} dataType={'number'} width={40}/>
                                            <Column dataField="PRICE" caption={this.t("grdSlsOrder.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={50}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdSlsOrder.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                            <Column dataField="DISCOUNT" caption={this.t("grdSlsOrder.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                            <Column dataField="DISCOUNT_RATE" caption={this.t("grdSlsOrder.clmDiscountRate")} dataType={'number'} width={150}/>
                                            <Column dataField="VAT" caption={this.t("grdSlsOrder.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={150}/>
                                            <Column dataField="TOTAL" caption={this.t("grdSlsOrder.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={150}/>
                                        </NdGrid>
                                        </div>
                                    </Item>
                                </Form>
                                <div className="row px-2 pt-2">
                                    <div className="col-12">
                                        <Form colCount={4} parent={this} id="frmslsDoc">
                                            {/* Ara Toplam */}
                                            <Item  >
                                            <Label text={this.t("txtAmount")} alignment="right" />
                                                <NdTextBox id="txtGrandAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            {/* İndirim */}
                                            <Item>
                                            <Label text={this.t("txtDiscount")} alignment="right" />
                                                <NdTextBox id="txtGrandDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
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
                                            <Item>
                                            <Label text={this.t("txtVat")} alignment="right" />
                                                <NdTextBox id="txtGrandVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
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
                                            <Item>
                                            <Label text={this.t("txtGrandTotal")} alignment="right" />
                                                <NdTextBox id="txtGrandTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                                maxLength={32}
                                                //param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                                //access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                                ></NdTextBox>
                                            </Item>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </Item>                    
                    </NdPagerTab>                
                    {/* Stok Seçim */}
                    <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    headerFilter = {{visible:false}}
                    width={'100%'}
                    height={'100%'}
                    title={this.t("popItemCode.title")} //
                    search={true}
                    selection={{mode:"single"}}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT  *,  " +
                                        "CASE WHEN UNDER_UNIT_VALUE =0  " +
                                        "THEN 0 " +
                                        "ELSE " +
                                        "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                                        "END AS UNDER_UNIT_PRICE " +
                                        "FROM  (  SELECT GUID,   " +
                                        "CODE,   " +
                                        "NAME,   " +
                                        "VAT,   " +
                                        "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                        "MAIN_GRP AS ITEM_GRP,   " +
                                        "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                                        "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')) AS PRICE, " +
                                        "ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE TYPE = 0 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),'00000000-0000-0000-0000-000000000000') AS UNIT_GUID, " +
                                        "ISNULL((SELECT TOP 1 ID FROM ITEM_UNIT WHERE TYPE = 0 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNIT_ID, " +
                                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 0 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNIT_FACTOR, " +
                                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                        "FROM ITEMS_VW_01) AS TMP " +
                                        "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("popItemCode.clmCode")} width={100} />
                        <Column dataField="NAME" caption={this.t("popItemCode.clmName")} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* İndirim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDiscount"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDiscount.title")}
                        container={"#root"} 
                        width={'350'}
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
                                                    this.txtDiscountPrice.value =  parseFloat((this.docObj.dt()[0].AMOUNT * this.txtDiscountPercent.value / 100).toFixed(3))
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
                                            this.txtDiscountPercent.value = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.txtDiscountPrice.value) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(3))
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
                                                    this.docObj.docOrders.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(3))
                                                    if(this.docObj.docOrders.dt()[i].VAT > 0)
                                                    {
                                                        this.docObj.docOrders.dt()[i].VAT = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)).toFixed(3))
                                                    }
                                                    this.docObj.docOrders.dt()[i].TOTAL = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) + this.docObj.docOrders.dt()[i].VAT - this.docObj.docOrders.dt()[i].DISCOUNT).toFixed(3))
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
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={this.t("msgQuantity.title")} 
                        showCloseButton={false}
                        width={"350px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'after'}]}
                        >
                            <div className="row px-3">
                                <div className="col-12 py-2 px-2">
                                    <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                                </div>
                                <div className="col-12 py-2 px-2">
                                <Form>
                                    <Item>
                                        <Label text={this.t("txtQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQuantity" parent={this} simple={true} 
                                        onEnterKey={(async()=>
                                            {
                                                this.addItem(this.txtPopQuantity.value)
                                                this.msgQuantity.hide()
                                            }).bind(this)} 
                                        >
                                    </NdNumberBox>
                                    </Item>
                                </Form>
                            </div>
                            </div>
                            <div className='row'>
                                
                            </div>
                        
                    </NdDialog>
                </div>
            </div>
        </ScrollView>
        )
    }
}