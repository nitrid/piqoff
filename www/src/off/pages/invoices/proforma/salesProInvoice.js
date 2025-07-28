import moment from 'moment';

import React from 'react';
import App from '../../../lib/app.js';
import DocBase from '../../../tools/DocBase.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';


export default class salesInvoice extends DocBase
{
    constructor(props)
    {
        super(props)

        this.type = 1;
        this.docType = 120;
        this.rebate = 0;

        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.getPayment = this.getPayment.bind(this)
        this.addPayment = this.addPayment.bind(this)
        this.onItemRendered = this.onItemRendered.bind(this)
        this.onGridToolbarPreparing = this.onGridToolbarPreparing.bind(this)

        this.frmSalesInv = undefined;
        this.docLocked = false;        
        this.combineControl = true
        this.combineNew = false

        this.rightItems = [{ text: this.t("getDispatch"),},{ text: this.t("getOrders")},{ text: this.t("getOffers")}]
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
        await super.init()
        this.dtDocDate.value = moment(new Date())
        this.dtShipDate.value = moment(new Date())
        this.quantityControl = this.prmObj.filter({ID:'negativeQuantity',USERS:this.user.CODE}).getValue().value

        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
        tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
        tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
        tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        this.docObj.docCustomer.addEmpty(tmpDocCustomer)

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = true
        this.docLocked = false
        
        this.frmSalesInv.option('disabled',true)
        
        let tmpQuery = 
        {
            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 120  AND REBATE = 0",
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.txtRefno.value = tmpData.result.recordset[0].REF_NO
            this.docObj.docCustomer.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }

        this.pg_txtItemsCode.on('showing',()=>
        {
            this.pg_txtItemsCode.setSource(
            {
                source:
                {
                    select:
                    {
                        query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT,STATUS,(SELECT [dbo].[FN_PRICE](GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,0)) AS PRICE FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)" ,
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            })
        })
        this.pg_txtBarcode.on('showing',()=>
        {
            this.pg_txtBarcode.setSource(
            {
                source:
                {
                    select:
                    {   query : "SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,ITEMS_VW_01.UNIT,VAT,BARCODE,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = '" + this.docObj.dt()[0].INPUT + "' AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE, " + 
                                "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                "FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE  ITEM_BARCODE_VW_01.BARCODE LIKE  '%' + @BARCODE",
                        param : ['BARCODE:string|50'],
                    },
                    sql:this.core.sql
                }
            })
        })
        this.pg_txtCustomerCode.on('showing',()=>
        {
            this.pg_txtCustomerCode.setSource(
            {
                source:
                {
                    select:
                    {
                        query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME],VAT_ZERO FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            })
        })
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        App.instance.loading.show()
        await super.getDoc(pGuid,pRef,pRefno);
        App.instance.loading.hide()

        this.calculateMargin()
        this.calculateTotalMargin()

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        this.getPayment(this.docObj.dt()[0].GUID)
    }
    async calculateTotal()
    {
        super.calculateTotal()
        this.docObj.docCustomer.dt()[0].AMOUNT = this.docObj.dt()[0].TOTAL
    }
    async calculateTotalMargin()
    {
        super.calculateTotalMargin()
        this.txtMargin.setState({value:this.docObj.dt()[0].MARGIN})
    }
    async calculateMargin()
    {
        for(let  i= 0; i < this.docObj.docItems.dt().length; i++)
        {
            let tmpMargin = (this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT) - (this.docObj.docItems.dt()[i].COST_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            let tmpMarginRate = (tmpMargin /(this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT)) * 100
            this.docObj.docItems.dt()[i].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
        }
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
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            this.combineControl = true
                            this.combineNew = false
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.core.util.waitUntil(100)
                                await this.addItem(data[i],null)
                            }
                        }
                        await this.pg_txtItemsCode.setVal(e.value)
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
                            query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ITEMS_VW_01.UNIT FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        if(tmpData.result.recordset.length > 0)
                        {
                            this.combineControl = true
                            this.combineNew = false
                            await this.addItem(tmpData.result.recordset[0],e.rowIndex)
                        }
                        else
                        {
                            let tmpConfObj =
                            {
                                id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'auto',
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
                               
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.combineControl = true
                                    this.combineNew = false
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.core.util.waitUntil(100)
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                }
                                this.pg_txtItemsCode.show()
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "QUANTITY")
        {
            return (
                <NdTextBox id={"txtGrdQuantity"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.grdSlsInv.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.msgUnit.tmpData = e.data
                                await this.msgUnit.show()

                                e.data.UNIT = this.cmbUnit.value
                                e.data.QUANTITY = this.txtTotalQuantity.value
                                e.data.UNIT_FACTOR = this.txtUnitFactor.value
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    async onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitleSubtotal"))
        {        
           
        }
        else if(e.itemData.title == this.t("tabTitlePayments"))
        {
            this.getPayment(this.docObj.dt()[0].GUID)
        }
    }
    async addItem(pData,pIndex,pQuantity)
    {
        App.instance.loading.show()

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        //GRID DE AYNI ÜRÜNDEN OLUP OLMADIĞI KONTROL EDİLİYOR VE KULLANICIYA SORULUYOR,CEVAP A GÖRE SATIR BİRLİŞTERİLİYOR.
        let tmpMergDt = await this.mergeItem(pData.CODE)
        if(typeof tmpMergDt != 'undefined' && this.combineNew == false)
        {
            tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
            tmpMergDt[0].SUB_QUANTITY = tmpMergDt[0].SUB_QUANTITY / tmpMergDt[0].SUB_FACTOR
            if(this.docObj.dt()[0].VAT_ZERO != 1)
            {
                tmpMergDt[0].VAT = Number((tmpMergDt[0].VAT + (tmpMergDt[0].PRICE * (tmpMergDt[0].VAT_RATE / 100) * pQuantity))).round(6)
            }
            else
            {
                e.key.VAT = 0
            }
            tmpMergDt[0].AMOUNT = Number((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE)).round(4)
            tmpMergDt[0].TOTAL = Number((((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE) - tmpMergDt[0].DISCOUNT) + tmpMergDt[0].VAT)).round(2)
            tmpMergDt[0].TOTALHT =  Number((tmpMergDt[0].AMOUNT - tmpMergDt[0].DISCOUNT)).round(2)
            this.calculateTotal()
            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
            await this.itemRelated(pData.GUID,tmpMergDt[0].QUANTITY)
            //*****************************************/
            App.instance.loading.hide()
            return
        }
        //******************************************************************************************************************/
        if(pIndex == null)
        {
            let tmpDocItems = {...this.docObj.docItems.empty}
            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
            tmpDocItems.REF = this.docObj.dt()[0].REF
            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.docObj.docItems.addEmpty(tmpDocItems)
            pIndex = this.docObj.docItems.dt().length - 1
        }

        if(typeof this.quantityControl != 'undefined' && this.quantityControl ==  true)
        {
            let tmpCheckQuery = 
            {
                query :"SELECT [dbo].[FN_DEPOT_QUANTITY](@GUID,@DEPOT,dbo.GETDATE()) AS QUANTITY ",
                param : ['GUID:string|50','DEPOT:string|50'],
                value : [pData.GUID,this.docObj.dt()[0].OUTPUT]
            }
            let tmpQuantity = await this.core.sql.execute(tmpCheckQuery) 
            if(tmpQuantity.result.recordset.length > 0)
            {
               if(tmpQuantity.result.recordset[0].QUANTITY < pQuantity)
               {
                    App.instance.loading.hide()
                    let tmpConfObj =
                    {
                        id:'msgNotQuantity',showTitle:true,title:this.t("msgNotQuantity.title"),showCloseButton:true,width:'500px',height:'auto',
                        button:[{id:"btn01",caption:this.t("msgNotQuantity.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotQuantity.msg") + tmpQuantity.result.recordset[0].QUANTITY}</div>)
                    }
        
                    await dialog(tmpConfObj);
                    await this.grdSlsInv.devGrid.deleteRow(0)
                    return
               }
               else
               {
                    this.docObj.docItems.dt()[pIndex].DEPOT_QUANTITY = tmpQuantity.result.recordset[0].QUANTITY
               }
            }
        }
        
        this.docObj.docItems.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docItems.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docItems.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docItems.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.docObj.docItems.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docItems.dt()[pIndex].DISCOUNT = 0
        this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docItems.dt()[pIndex].QUANTITY = pQuantity
        let tmpQuery = 
        {
            query :"SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
            value : [pData.GUID,pQuantity,this.docObj.dt()[0].INPUT]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
            this.docObj.docItems.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(3))
            this.docObj.docItems.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE * pQuantity ).toFixed(3))
            this.docObj.docItems.dt()[pIndex].TOTAL =  parseFloat(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docItems.dt()[pIndex].VAT).toFixed(2))
            this.calculateTotal()
        }
        //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
        await this.itemRelated(pData.GUID,pQuantity)
        //*****************************************/
        App.instance.loading.hide()
    }
    async getDispatch()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ITEMS_VW_01 WHERE INPUT = @INPUT AND INVOICE_DOC_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND REBATE = 0 AND DOC_TYPE IN(40)",
            param : ['INPUT:string|50'],
            value : [this.docObj.dt()[0].INPUT]
        }
        super.getDispatch(tmpQuery)
    }
    async getOrders()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ORDERS_VW_01 WHERE INPUT = @INPUT AND SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND DOC_TYPE IN(60)",
            param : ['INPUT:string|50'],
            value : [this.docObj.dt()[0].INPUT]
        }
        super.getOrders(tmpQuery)
    }
    async getOffers()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_OFFERS_VW_01 WHERE INPUT = @INPUT AND SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND DOC_TYPE IN(61)",
            param : ['INPUT:string|50'],
            value : [this.docObj.dt()[0].INPUT]
        }
        super.getOffers(tmpQuery);
    }
    async getPayment()
    {
        if(typeof this.txtRemainder == 'undefined')
        {
            return
        }
        await this.payObj.load({PAYMENT_DOC_GUID:this.docObj.dt()[0].GUID});
        if(this.payObj.dt().length > 0)
        {
            let tmpRemainder = (this.docObj.dt()[0].TOTAL - this.payObj.dt()[0].TOTAL).toFixed(2)
            this.txtRemainder.value = tmpRemainder
            if(typeof this.txtMainRemainder != 'undefined')
            {
                this.txtMainRemainder.value = tmpRemainder
            }
        }
        else
        {
            this.txtRemainder.value = this.docObj.dt()[0].TOTAL
            if(typeof this.txtMainRemainder != 'undefined')
            {
                this.txtMainRemainder.value = this.docObj.dt()[0].TOTAL
            }
        }
       
    }
    async addPayment(pType,pAmount)
    {
        if(pAmount > this.txtRemainder.value)
        {
            let tmpConfObj =
            {
                id:'msgMoreAmount',showTitle:true,title:this.t("msgMoreAmount.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgMoreAmount.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMoreAmount.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        if(this.payObj.dt().length == 0)
        {
            let tmpPay = {...this.payObj.empty}
            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 200 AND REF = @REF ",
                param : ['REF:string|25'],
                value : [this.txtRef.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                tmpPay.REF = this.txtRef.value
                tmpPay.REF_NO = tmpData.result.recordset[0].REF_NO
            }
            tmpPay.TYPE = 0
            tmpPay.DOC_TYPE = 200
            tmpPay.INPUT = '00000000-0000-0000-0000-000000000000'
            tmpPay.OUTPUT = this.docObj.dt()[0].INPUT 
            this.payObj.addEmpty(tmpPay);
        }
        let tmpPayment = {...this.payObj.docCustomer.empty}
            tmpPayment.DOC_GUID = this.payObj.dt()[0].GUID
            tmpPayment.TYPE = this.payObj.dt()[0].TYPE
            tmpPayment.REF = this.payObj.dt()[0].REF
            tmpPayment.REF_NO = this.payObj.dt()[0].REF_NO
            tmpPayment.DOC_TYPE = this.payObj.dt()[0].DOC_TYPE
            tmpPayment.DOC_DATE = this.payObj.dt()[0].DOC_DATE
            tmpPayment.OUTPUT = this.payObj.dt()[0].OUTPUT
            tmpPayment.INVOICE_GUID = this.docObj.dt()[0].GUID                                   

            if(pType == 0)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 0
                tmpPayment.AMOUNT = pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value
            }
            else if (pType == 1)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 1
                tmpPayment.AMOUNT = pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value

                let tmpCheck = {...this.payObj.checkCls.empty}
                tmpCheck.DOC_GUID = this.payObj.dt()[0].GUID
                tmpCheck.REF = checkReference.value
                tmpCheck.DOC_DATE =  this.payObj.dt()[0].DOC_DATE
                tmpCheck.CHECK_DATE =  this.payObj.dt()[0].DOC_DATE
                tmpCheck.CUSTOMER =   this.payObj.dt()[0].OUTPUT
                tmpCheck.AMOUNT =  this.numcheck.value
                tmpCheck.SAFE =  this.cmbCashSafe.value
                this.payObj.checkCls.addEmpty(tmpCheck)
            }
            else if (pType == 2)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 2
                tmpPayment.AMOUNT = pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value
            }

            await this.payObj.docCustomer.addEmpty(tmpPayment)
            this.payObj.dt()[0].AMOUNT = this.payObj.docCustomer.dt().sum("AMOUNT",2)
            this.payObj.dt()[0].TOTAL = this.payObj.docCustomer.dt().sum("AMOUNT",2)
            
            if((await this.payObj.save()) == 0)
            {
              
            }
            await this.popPayment.show()
            await this.getPayment()
            await this.grdInvoicePayment.dataRefresh({source:this.payObj.docCustomer.dt()});
    }
    async multiItemAdd()
    {
        let tmpMissCodes = []
        let tmpCounter = 0
        if(this.multiItemData.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMultiData',showTitle:true,title:this.t("msgMultiData.title"),showCloseButton:true,width:'500px',height:'auto',
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
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') = @VALUE " ,
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
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE"+
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
            id:'msgMultiCodeCount',showTitle:true,title:this.t("msgMultiCodeCount.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgMultiCodeCount.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiCodeCount.msg") + ' ' +tmpCounter}</div>)
        }
    
         await dialog(tmpConfObj);

    }
    async multiItemSave()
    {
        this.combineControl = true
        this.combineNew = false
        for (let i = 0; i < this.multiItemData.length; i++) 
        {
            await this.core.util.waitUntil(100)
            await this.addItem(this.multiItemData[i],null,this.multiItemData[i].QUANTITY)
            this.popMultiItem.hide()
        }
    }
    onGridToolbarPreparing(e)
    {
        e.toolbarOptions.items.push({
            location: 'after',
            locateInMenu: 'auto',
            widget: 'dxButton',
            options: 
            {
                icon: 'add',
                validationGroup: 'frmSalesInv' + this.tabIndex,
                onClick: (async(c) => 
                {
                    if(c.validationGroup.validate().status == "valid")
                    { 
                        if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                        {
                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                            {
                                
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.combineControl = true
                                    this.combineNew = false
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.core.util.waitUntil(100)
                                        await this.addItem(data[i],null)
                                    }
                                }
                                this.pg_txtItemsCode.show()
                                return
                            }
                        }
                    
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            await this.core.util.waitUntil(100)
                            this.combineControl = true
                            this.combineNew = false
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.core.util.waitUntil(100)
                                await this.addItem(data[i],null)
                            }
                        }
                        this.pg_txtItemsCode.show()
        
                    }
                    else
                    {
                        let tmpConfObj =
                        {
                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'auto',
                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                        }
                        
                        await dialog(tmpConfObj);
                    }
                }).bind(this)
            }
        }),
        e.toolbarOptions.items.push(
        {
            location: 'after',
            locateInMenu: 'auto',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: this.t("collectiveItemAdd"),
                validationGroup: 'frmSalesInv' + this.tabIndex,
                onClick: (async(c) => 
                {
                    if(c.validationGroup.validate().status == "valid")
                    {
                        await this.popMultiItem.show()
                        await this.grdMultiItem.dataRefresh({source:this.multiItemData});
                        if( typeof this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1] != 'undefined' && this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                        {
                            await this.grdSlsInv.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
                        }
                    }
                    else
                    {
                        let tmpConfObj =
                        {
                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'auto',
                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                        }
                        
                        await dialog(tmpConfObj);
                    } 
                }).bind(this)
            }
        })
  }
    render()
    {
        return(
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-1">
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmSalesInv"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocLocked',showTitle:true,title:this.t("msgDocLocked.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgDocLocked.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocLocked.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdSlsInv.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                                //***** FACTURE İMZALAMA *****/
                                                let tmpSignedData = await this.nf525.signatureDoc(this.docObj.dt()[0],this.docObj.docItems.dt())                
                                                this.docObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
                                                this.docObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.docObj.save()) == 0)
                                                {       
                                                    this.getPayment()   
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnInfo" parent={this} icon="info" type="default"
                                    onClick={async()=>
                                    {
                                        await this.popDetail.show()
                                        this.numDetailCount.value = this.docObj.docItems.dt().length
                                        this.numDetailQuantity.value = Number(this.docObj.docItems.dt().sum("QUANTITY",2))
                                        let tmpQuantity2 = 0
                                        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_UNIT2_QUANTITY](@ITEM) AS QUANTITY",
                                                param : ['ITEM:string|50'],
                                                value : [this.docObj.docItems.dt()[i].ITEM]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                tmpQuantity2 = tmpQuantity2 + (tmpData.result.recordset[0].QUANTITY * this.docObj.docItems.dt()[i].QUANTITY)
                                            }
                                        }
                                        this.numDetailQuantity2.value = tmpQuantity2.toFixed(3)
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async ()=>
                                    {
                                        if(this.docObj.isSaved == false)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'isMsgSave',showTitle:true,title:this.t("isMsgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("isMsgSave.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("isMsgSave.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        else
                                        {
                                            this.popDesign.show()
                                        }
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
                    <div className="row px-2 pt-1" style={{height:'130px'}}>
                        <div className="col-12">
                            <Form colCount={3} id="frmSalesInv">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onValueChanged={(async(e)=>
                                            {
                                                this.docObj.docCustomer.dt()[0].REF = this.txtRef.value
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                           this.getDocs(0)
                                                        }
                                                    },
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND  TYPE = 1 AND DOC_TYPE = 120 AND REBATE = 0 ",
                                                    param : ['REF:string|50','REF_NO:int'],
                                                    value : [this.txtRef.value,this.txtRefno.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {   
                                                    if(tmpData.result.recordset[0].DELETED == 1)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocDeleted',showTitle:true,title:this.lang.t("msgDocDeleted.title"),showCloseButton:true,width:'500px',height:'auto',
                                                            button:[{id:"btn01",caption:this.lang.t("msgDocDeleted.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDocDeleted.msg")}</div>)
                                                        }
                                                        this.txtRefno.value = 0
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                }
                                                this.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                    this.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                    <RangeRule min={1} message={this.t("validRefNo")}/>
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                            this.checkRow()
                                            this.docObj.docCustomer.dt()[0].OUTPUT = this.cmbDepot.value
                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                            {
                                                this.frmSalesInv.option('disabled',false)
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
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
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.docObj.dt()[0].INPUT = data[0].GUID
                                                    this.docObj.docCustomer.dt()[0].INPUT = data[0].GUID
                                                    this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                    this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.value = data[0].CODE
                                                    }
                                                    if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                    {
                                                        this.frmSalesInv.option('disabled',false)
                                                    }
                                                        let tmpQuery = 
                                                {
                                                    query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                    param : ['CUSTOMER:string|50'],
                                                    value : [ data[0].GUID]
                                                }
                                                let tmpAdressData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpAdressData.result.recordset.length > 1)
                                                    {   
                                                        this.pg_adress.onClick = async(pdata) =>
                                                        {
                                                            if(pdata.length > 0)
                                                            {
                                                                this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                            }
                                                        }
                                                        await this.pg_adress.show()
                                                        await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                        
                                                    }
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
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.docObj.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.docCustomer.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE
                                                            }
                                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmSalesInv.option('disabled',false)
                                                            }
                                                             let tmpQuery = 
                                                            {
                                                                query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                                param : ['CUSTOMER:string|50'],
                                                                value : [ data[0].GUID]
                                                            }
                                                            let tmpAdressData = await this.core.sql.execute(tmpQuery) 
                                                            if(tmpAdressData.result.recordset.length > 1)
                                                            {   
                                                                this.pg_adress.onClick = async(pdata) =>
                                                                {
                                                                    if(pdata.length > 0)
                                                                    {
                                                                        this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                                    }
                                                                }
                                                                await this.pg_adress.show()
                                                                await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                                
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} 
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
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* dtShipDate */}
                                <Item>
                                    <Label text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                 {/* BARKOD EKLEME */}
                                 <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  placeholder={this.t("txtBarcodePlace")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:"fa-solid fa-barcode",
                                                onClick:async(e)=>
                                                {
                                                    if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '')
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);
                                                        this.txtBarcode.setState({value:""})
                                                        return
                                                    }
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.setState({value:""})
                                                        await this.core.util.waitUntil(100)

                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                await this.core.util.waitUntil(100)
                                                                await this.addItem(data[i],null)
                                                            }
                                                        }
                                                    }
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                   
                                                    
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.cmbDepot.value == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            this.txtBarcode.setState({value:""})
                                            return
                                        }
                                        let tmpQuery = 
                                        {   query : "SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,ITEMS_VW_01.UNIT,VAT,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = @CUSTOMER AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE,  " + 
                                                    "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                                    " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].INPUT]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.msgQuantity.tmpData = tmpData.result.recordset[0]
                                            await this.msgQuantity.show()
                                            this.addItem(tmpData.result.recordset[0],null,this.txtPopQteUnitQuantity.value)
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                {/* Vade Tarih */}
                                <Item>
                                    <Label text={this.t("dtExpDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtExpDate"}
                                    dt={{data:this.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPurcInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=> { this.frmSalesInv = e.component }}>
                                <Item>
                                 <React.Fragment>
                                    <NdGrid parent={this} id={"grdSlsInv"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    onToolbarPreparing={this.onGridToolbarPreparing}
                                    height={'590px'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowPrepared={async(e)=>
                                        {

                                        }}
                                    onRowUpdating={async(e)=>
                                    {
                                        if(this.quantityControl == true)
                                        {
                                            if(typeof e.newData.QUANTITY != 'undefined' && e.key.DEPOT_QUANTITY < e.newData.QUANTITY)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgNotQuantity',showTitle:true,title:this.t("msgNotQuantity.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgNotQuantity.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotQuantity.msg") + e.oldData.DEPOT_QUANTITY}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                e.key.QUANTITY = e.oldData.DEPOT_QUANTITY
                                            }
                                        }
                                    }}
                                    onRowUpdated={async(e)=>{
                                        let rowIndex = e.component.getRowIndexByKey(e.key)

                                        if(typeof e.data.QUANTITY != 'undefined')
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_PRICE](@ITEM_GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER_GUID,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE",
                                                param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                                                value : [e.key.ITEM,this.docObj.dt()[0].INPUT,e.data.QUANTITY]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
                                                
                                                this.calculateTotal()
                                            }
                                        }
                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                        {
                                            e.key.DISCOUNT = parseFloat((((e.key.AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(2))
                                        }
                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscount',showTitle:true,title:this.t("msgDiscount.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            e.key.DISCOUNT = 0 
                                            return
                                        }
                                        
                                        if(this.docObj.dt()[0].VAT_ZERO != 1)
                                        {
                                            e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(3));
                                        }
                                        else
                                        {
                                            e.key.VAT = 0
                                        }
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3))
                                        e.key.TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +e.key.VAT).toFixed(3))

                                        let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
                                        let tmpMarginRate = (tmpMargin /(e.key.TOTAL - e.key.VAT)) * 100
                                        e.key.MARGIN = tmpMargin.toFixed(2) + Number.money.sign + "  / %" +  tmpMarginRate.toFixed(2)
                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat(100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100).toFixed(3))
                                        }
                                        this.calculateTotal()
                                    }}
                                    onRowRemoved={async (e)=>
                                    {
                                        this.calculateTotal()
                                    }}
                                    onReady={async(e)=>
                                    {
                                        await this.grdSlsInv.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
                                    }}
                                    >
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menuOff.ftr_02_002")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdSlsInv.clmCreateDate")} width={80} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdSlsInv.clmCuser")} width={90} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdSlsInv.clmItemCode")} width={100} editCellRender={this.cellRoleRender}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdSlsInv.clmItemName")} width={320}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdSlsInv.clmQuantity")} dataType={'number'} width={70} editCellRender={this.cellRoleRender}/>
                                        <Column dataField="PRICE" caption={this.t("grdSlsInv.clmPrice")} dataType={'number'} width={75} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdSlsInv.clmAmount")} width={90} format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdSlsInv.clmDiscount")} dataType={'number'} width={60} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdSlsInv.clmDiscountRate")} width={60} dataType={'number'}/>
                                        <Column dataField="MARGIN" caption={this.t("grdSlsInv.clmMargin")} width={80} allowEditing={false}/>
                                        <Column dataField="VAT" caption={this.t("grdSlsInv.clmVat")} width={75} format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdSlsInv.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdSlsInv.clmTotal")} width={110} format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                        <Column dataField="CONNECT_REF" caption={this.t("grdSlsInv.clmDispatch")} width={110} allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdSlsInv.clmDescription")} width={100} />
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdSlsInv"
                                    onItemClick={(async(e)=>
                                    {
                                        if(e.itemData.text == this.t("getDispatch"))
                                        {
                                            this.getDispatch()
                                        }
                                        else if(e.itemData.text == this.t("getPayment"))
                                        {
                                            await this.popPayment.show()
                                            await this.getPayment()
                                            await this.grdInvoicePayment.dataRefresh({source:this.payObj.docCustomer.dt()});
                                        }
                                        else if(e.itemData.text == this.t("getOrders"))
                                        {
                                            this.getOrders()
                                        }
                                        else if(e.itemData.text == this.t("getOffers"))
                                        {
                                            this.getOffers()
                                        }
                                    }).bind(this)} />
                                </React.Fragment>    
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-1' style={{height:'160px'}}>
                        <div className='col-12'>
                            <TabPanel height="100%" onItemRendered={this.onItemRendered}>
                                <Item title={this.t("tabTitleSubtotal")}>
                                <div className="row px-2 pt-1">
                                    <div className="col-12">
                                        <Form colCount={4} parent={this} id={"frmSlsInv"  + this.tabIndex}>
                                            {/* Ara Toplam */}
                                            <EmptyItem colSpan={2}/>
                                            <Item>
                                            <Label text={this.t("txtMargin")} alignment="right" />
                                                <NdTextBox id="txtMargin" parent={this} simple={true} readOnly={true}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            <Item  >
                                            <Label text={this.t("txtAmount")} alignment="right" />
                                                <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                                maxLength={32}
                                            
                                                ></NdTextBox>
                                            </Item>
                                            {/* İndirim */}
                                            <EmptyItem colSpan={3}/>
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
                                                            onClick:async()  =>
                                                            {
                                                                await this.popDiscount.show()
                                                                if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                                {
                                                                    this.txtDiscountPercent.value  = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.docObj.dt()[0].DISCOUNT) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(3))
                                                                    this.txtDiscountPrice.value = this.docObj.dt()[0].DISCOUNT
                                                                }
                                                                
                                                            }
                                                        },
                                                    ]
                                                }
                                                ></NdTextBox>
                                            </Item>
                                            {/* KDV */}
                                            <EmptyItem colSpan={3}/>
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
                                                                    id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                                                    button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                                }
                                                                
                                                                let pResult = await dialog(tmpConfObj);
                                                                if(pResult == 'btn01')
                                                                {
                                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                                    {
                                                                        this.docObj.docItems.dt()[i].VAT = 0  
                                                                        this.docObj.docItems.dt()[i].VAT_RATE = 0
                                                                        this.docObj.docItems.dt()[i].TOTAL = (this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) - this.docObj.docItems.dt()[i].DISCOUNT
                                                                        this.calculateTotal()
                                                                    }
                                                                }
                                                            }
                                                        },
                                                    ]
                                                }
                                                ></NdTextBox>
                                            </Item>
                                            {/* KDV */}
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtTotal")} alignment="right" />
                                                <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                        </Form>
                                    </div>
                                </div>
                                </Item>
                                <Item title={this.t("tabTitlePayments")}>
                                <div className="row px-2 pt-1">
                                    <div className="col-12">
                                        <Form colCount={4} parent={this} id={"frmSlsInv"  + this.tabIndex}>
                                            {/* Ödeme Toplam */}
                                            <EmptyItem colSpan={2}/>
                                            <Item>
                                            <Label text={this.t("txtExpFee")} alignment="right" />
                                                <NdNumberBox id="txtExpFee" format={{ style: "currency", currency: Number.money.code,precision: 2}} parent={this} simple={true} dt={{data:this.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_FEE"}}
                                                maxLength={32}
                                                ></NdNumberBox>
                                            </Item>
                                            <Item>
                                            <Label text={this.t("txtPayTotal")} alignment="right" />
                                                <NdTextBox id="txtPayTotal" format={{ style: "currency", currency: Number.money.code,precision: 2}} parent={this} simple={true} readOnly={true} dt={{data:this.payObj.dt('DOC'),field:"TOTAL"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            {/* Kalan */}
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtRemainder")} alignment="right" />
                                                <NdTextBox id="txtRemainder" parent={this} simple={true} readOnly={true}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtbalance")} alignment="right" />
                                                <NdTextBox id="txtbalance" format={{ style: "currency", currency: Number.money.code,precision: 2}} parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC_CUSTOMER'),field:"INPUT_BALANCE"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <NdButton text={this.t("getPayment")} type="normal" stylingMode="contained" width={'100%'} 
                                                    onClick={async (e)=>
                                                    {   
                                                        await this.popPayment.show()    
                                                        await this.getPayment()
                                                        await this.grdInvoicePayment.dataRefresh({source:this.payObj.docCustomer.dt()});
                                                    }}/>
                                                </div>
                                            </div>
                                            </Item>
                                        </Form>
                                    </div>
                                </div>
                                </Item>
                            </TabPanel>
                        </div>
                    </div>   
                    {/* Dizayn Seçim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '15'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popDesign.lang")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={localStorage.getItem('lang').toUpperCase()}
                                    searchEnabled={true}

                                    data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    >
                                        <Validator validationGroup={"frmSalesInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSalesInv"  + this.tabIndex}
                                            onClick={async ()=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    App.instance.loading.show()
                                                    let tmpLastSignature = await this.nf525.signatureDocDuplicate(this.docObj.dt()[0])
                                                    let tmpExtra = {...this.extraObj.empty}
                                                    tmpExtra.DOC = this.docObj.dt()[0].GUID
                                                    tmpExtra.DESCRIPTION = ''
                                                    tmpExtra.TAG = 'PRINT'
                                                    tmpExtra.SIGNATURE = tmpLastSignature.SIGNATURE
                                                    tmpExtra.SIGNATURE_SUM = tmpLastSignature.SIGNATURE_SUM
                                                    this.extraObj.addEmpty(tmpExtra);
                                                    await this.extraObj.save()
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    console.log(JSON.stringify(tmpData.result.recordset))
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async (pResult) => 
                                                    {
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                        
                                                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                            mywindow.onload = function() 
                                                            {
                                                                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                            } 
                                                            // let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                                            // mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                                                        }
                                                    });
                                                    this.popDesign.hide();  
                                                    App.instance.loading.hide()
                                                }
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
                                    <div className='row py-2'>
                                        <div className='col-6'>
                                                <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSalesInv"  + this.tabIndex}
                                                onClick={async (e)=>
                                                {       
                                                    if(e.validationGroup.validate().status == "valid")
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO " ,
                                                            param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                            value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                        }
                                                        App.instance.loading.show()
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        App.instance.loading.hide()
                                                        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                        {
                                                            console.log(tmpData.result.recordset)
                                                            if(pResult.split('|')[0] != 'ERR')
                                                            {
                                                                console.log(pResult)
                                                                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                                mywindow.onload = function() 
                                                                { 
                                                                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                                } 
                                                                // let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                                                // mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                                                            }
                                                        });
                                                    }
                                                }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSalesInv"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0",
                                                        param:  ['GUID:string|50'],
                                                        value:  [this.docObj.dt()[0].INPUT]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        await this.popMailSend.show()
                                                        this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                    }
                                                    else
                                                    {
                                                        await this.popMailSend.show()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                    
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>     
                    {/* Detay PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("popDetail.count")} alignment="right" />
                                <NdNumberBox id="numDetailCount" parent={this} simple={true} readOnly={true} maxLength={32}></NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("popDetail.quantity")} alignment="right" />
                                <NdNumberBox id="numDetailQuantity" parent={this} simple={true} readOnly={true} maxLength={32}></NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("popDetail.quantity2")} alignment="right" />
                                <NdTextBox id="numDetailQuantity2" parent={this} simple={true} readOnly={true} maxLength={32}
                                button={[
                                    {
                                        id:'01',
                                        icon:'more',
                                        onClick:async ()  =>
                                        {
                                            let tmpQuery = 
                                            {
                                                query : "SELECT " +
                                                        "NAME,ROUND(SUM(UNIT_FACTOR * QUANTITY),2) AS UNIT_FACTOR " +
                                                        "FROM ( " +
                                                        "SELECT ITEM_CODE,QUANTITY, " +
                                                        "(SELECT TOP 1 NAME FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS NAME, " +
                                                        "(SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS UNIT_FACTOR " +
                                                        "FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID OR INVOICE_DOC_GUID = @DOC_GUID ) AS TMP GROUP BY NAME ",
                                                param : ['DOC_GUID:string|50'],
                                                value : [this.docObj.dt()[0].GUID]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            this.unitDetailData.clear()
                                            if(tmpData.result.recordset.length > 0)
                                            {   
                                                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                                                {
                                                    this.unitDetailData.push(tmpData.result.recordset[i])
                                                }

                                                await this.popUnit2.show()
                                                await this.grdUnit2.dataRefresh({source:this.unitDetailData})
                                            }

                                        }
                                    },
                                ]}
                                ></NdTextBox>
                            </Item>
                        </Form>
                        </NdPopUp>
                    </div>   
                    {/* Mail Send PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'600'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}/>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                            validationGroup={"frmMailsend"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    App.instance.loading.show()
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.loading.hide()
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        App.instance.loading.show()
                                                        let tmpAttach = pResult.split('|')[1]
                                                        let tmpHtml = this.htmlEditor.value
                                                        if(this.htmlEditor.value.length == 0)
                                                        {
                                                            tmpHtml = ''
                                                        }
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                        }
                                                        let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"facture.pdf",attachData:tmpAttach,text:"",mailGuid:this.cmbMailAddress.value}
                                                        this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                        {
                                                            App.instance.loading.hide()
                                                            let tmpConfObj1 =
                                                            {
                                                                id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                                button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                            }
                                                            
                                                            if((pResult1) == 0)
                                                            {  
                                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgMailSendResult.msgSuccess")}</div>)
                                                                await dialog(tmpConfObj1);
                                                                this.htmlEditor.value = '',
                                                                this.txtMailSubject.value = '',
                                                                this.txtSendMail.value = ''
                                                                this.popMailSend.hide();  

                                                            }
                                                            else
                                                            {
                                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMailSendResult.msgFailed")}</div>)
                                                                await dialog(tmpConfObj1);
                                                                this.popMailSend.hide(); 
                                                            }
                                                        });
                                                    });
                                                }
                                                    
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popMailSend.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    <div>{super.render()}</div>
                </ScrollView>                
            </div>
        )
    }
}