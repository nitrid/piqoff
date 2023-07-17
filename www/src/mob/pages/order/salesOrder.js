import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import {docCls,docExtraCls} from '../../../core/cls/doc.js'

import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdDatePicker from '../../../core/react/devex/datepicker';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdNumberBox from '../../../core/react/devex/numberbox';
import NdPopUp from '../../../core/react/devex/popup';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class purchaseOrder extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.itemDt = new datatable();
        this.unitDt = new datatable();
        this.priceDt = new datatable();        
        this.orderDt = new datatable();

        this.itemDt.selectCmd = 
        {
            query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE OR MULTICODE = @CODE) OR (@CODE = '')",
            param : ['CODE:string|25'],
        }
        this.unitDt.selectCmd = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1 ORDER BY TYPE ASC",
            param : ['ITEM_GUID:string|50'],
        }
        this.priceDt.selectCmd = 
        {
            query : "SELECT dbo.FN_CUSTOMER_PRICE(@GUID,@CUSTOMER,@QUANTITY,GETDATE()) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
        }

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'200px',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()

        this.dtDocDate.value = moment(new Date())

        await this.cmbDepot.dataRefresh({source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}});

        let tmpDoc = {...this.docObj.empty}

        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        tmpDoc.REF = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'txtRef'}).getValue().value
        tmpDoc.INPUT = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value

        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false
        this.cmbDepot.readOnly = false
        this.dtDocDate.readOnly = false

        this.clearEntry();

        this.txtRef.props.onChange(tmpDoc.REF)

        await this.grdList.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
        await this.cmbUnit.dataRefresh({source : this.unitDt})
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.pageView.activePage('Main')
        this.init()
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.unitDt.clear();
        this.priceDt.clear();
        this.orderDt.clear();

        this.orderDt.push({UNIT:"",FACTOR:0,QUANTITY:0,PRICE:0,AMOUNT:0,DISCOUNT:0,DISCOUNT_RATE:0,VAT:0,SUM_AMOUNT:0})

        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.cmbUnit.setData([])
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:60});
        
        this.txtRef.readOnly = true
        this.txtRefNo.readOnly = true
        this.cmbDepot.readOnly = true
        this.dtDocDate.readOnly = true
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME

                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh()
                this.cmbUnit.setData(this.unitDt)

                if(this.unitDt.length > 0)
                {
                    this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                    this.txtFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                    this.txtFactor.props.onValueChanged()
                }

                this.txtBarcode.value = ""
                this.txtQuantity.focus();
            }
            else
            {                               
                document.getElementById("Sound").play(); 
                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeNotFound")}</div>)
                await dialog(this.alertContent);
                this.txtBarcode.value = ""
                this.txtBarcode.focus();
            }
            resolve();
        });
    }
    getPrice(pGuid,pQuantity,pCustomer)
    {
        return new Promise(async resolve => 
        {
            this.priceDt.selectCmd.value = [pGuid,pQuantity,(pCustomer == '' ? '00000000-0000-0000-0000-000000000000' : pCustomer)]
            await this.priceDt.refresh()
            if(this.priceDt.length > 0)
            {
                resolve(this.priceDt[0].PRICE)
            }
            resolve(0)
        });
    }
    async calcEntry()
    {
        if(this.txtFactor.value != 0 || this.txtQuantity.value != 0 || this.txtPrice.value != 0)
        {
            console.log(this.txtDiscount.value)
            let tmpQuantity = this.txtFactor.value * this.txtQuantity.value;
            if((arguments.length > 0 && arguments[0]) || arguments.length == 0)
            {
                this.txtPrice.value = Number((await this.getPrice(this.itemDt[0].GUID,tmpQuantity,this.docObj.dt()[0].OUTPUT))).round(2)
            }
            this.txtAmount.value = Number(this.txtPrice.value * tmpQuantity).round(2)
            this.txtVat.value = Number(this.txtAmount.value - this.txtDiscount.value).rateInc(this.itemDt[0].VAT,2)
            this.txtSumAmount.value = Number(this.txtAmount.value - this.txtDiscount.value).rateExc(this.itemDt[0].VAT,2)
        }
    }
    async addItem()
    {
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgQuantityCheck")}</div>)
            await dialog(this.alertContent);
            return
        }

        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value

        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                let tmpQuantity = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
                this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + tmpQuantity
                this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * tmpQuantity).toFixed(3))
                this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(3))
                this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT).toFixed(3))
                this.clearEntry()
                await this.save()
            }
            for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
            {
                if(this.docObj.docOrders.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
                {
                    if(prmRowMerge == 2)
                    {
                        document.getElementById("Sound2").play(); 
                        let tmpConfObj = 
                        {
                            id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCombineItem.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCombineItem.msg")}</div>)
                        }
                        let pResult = await dialog(tmpConfObj);
                        if(pResult == 'btn01')
                        {                   
                            tmpFnMergeRow(i)
                            return
                        }
                        else
                        {
                            break
                        }
                    }
                    else
                    {
                        tmpFnMergeRow(i)
                        return
                    }
                }
            }
        }

        let tmpDocItems = {...this.docObj.docOrders.empty}

        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docOrders.dt().length
        tmpDocItems.UNIT = this.orderDt[0].UNIT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DISCOUNT = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_1 = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_RATE = this.orderDt[0].DISCOUNT_RATE
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT
        tmpDocItems.PRICE = this.orderDt[0].PRICE
        tmpDocItems.VAT = this.orderDt[0].VAT
        tmpDocItems.AMOUNT = this.orderDt[0].AMOUNT
        tmpDocItems.TOTALHT = Number(this.orderDt[0].AMOUNT - this.orderDt[0].DISCOUNT).round(2)
        tmpDocItems.TOTAL = this.orderDt[0].SUM_AMOUNT

        console.log(tmpDocItems)
        this.docObj.docOrders.addEmpty(tmpDocItems)
        this.clearEntry()

        await this.save()
    }
}