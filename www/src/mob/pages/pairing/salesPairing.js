import React from 'react';
import App from '../../lib/app.js';
import {datatable} from '../../../core/core.js'
import {docCls,docExtraCls} from '../../../core/cls/doc.js'

import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button.js';
import NdTextBox from '../../../core/react/devex/textbox.js';
import NdSelectBox from '../../../core/react/devex/selectbox.js';
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../core/react/devex/popgrid.js';
import NdNumberBox from '../../../core/react/devex/numberbox.js';
import NdPopUp from '../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid.js';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label.js';

import { PageBar } from '../../tools/pageBar.js';
import { PageView,PageContent } from '../../tools/pageView.js';
import moment from 'moment';

export default class salesPairing extends React.PureComponent
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
        this.orderDetailDt = new datatable();        
        this.orderGuid = ''

        this.itemDt.selectCmd = 
        {
            query : "SELECT    "  +
            "ITEMS.GUID AS GUID,   "  +
            "ITEMS.TYPE AS TYPE,   "  +
            "ITEMS.SPECIAL AS SPECIAL,   "  +
            "ITEMS.CODE AS CODE,   "  +
            "ITEMS.NAME AS NAME,   "  +
            "ITEMS.COST_PRICE AS COST_PRICE,   "  +
            "ITEMS.STATUS AS STATUS,   "  +
            "ITEMS.MAIN_GRP  AS MIAN_GRP,   "  +
            "ITEMS.MAIN_GRP_NAME AS MAIN_GRP_NAME,   "  +
            "ORDERS.UNIT AS UNIT_GUID, " +
            "(BARCODE) AS BARCODE,   "  +
            "ITEMS.UNIT_FACTOR AS UNIT_FACTOR,   "  +
            "ORDERS.GUID AS ORDER_LINE_GUID,   "  +
            "ORDERS.DOC_GUID AS ORDER_DOC_GUID,   "  +
            "ORDERS.QUANTITY AS QUANTITY,   "  +
            "CASE WHEN '" + this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value +   "' = 'true' THEN (ORDERS.APPROVED_QUANTITY - ORDERS.COMP_QUANTITY) ELSE (ORDERS.QUANTITY - ORDERS.COMP_QUANTITY) END AS PEND_QUANTITY,   "  +
            "ORDERS.PRICE AS PRICE,   "  +
            "ORDERS.DISCOUNT_1 AS DISCOUNT_1,   "  +
            "ORDERS.DISCOUNT_2 AS DISCOUNT_2,   "  +
            "ORDERS.DISCOUNT_3 AS DISCOUNT_3,   "  +
            "ORDERS.DOC_DISCOUNT_1 AS DOC_DISCOUNT_1,   "  +
            "ORDERS.DOC_DISCOUNT_2 AS DOC_DISCOUNT_2,   "  +
            "ORDERS.DOC_DISCOUNT_3 AS DOC_DISCOUNT_3,   "  +
            "ORDERS.VAT AS VAT,   "  +
            "ORDERS.VAT_RATE AS VAT_RATE   "  +
            "FROM ITEMS_BARCODE_MULTICODE_VW_01 AS ITEMS    "  +
            "INNER JOIN DOC_ORDERS AS ORDERS ON ITEMS.GUID = ORDERS.ITEM AND ORDERS.CLOSED = 0  "  +
            "WHERE ORDERS.DOC_GUID = @DOC_GUID AND (CODE = @CODE OR BARCODE = @CODE) OR (@CODE = '')",
            param : ['DOC_GUID:string|50','CODE:string|50'],
        }
        this.unitDt.selectCmd = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1  ORDER BY TYPE ASC",
            param : ['ITEM_GUID:string|50'],
        }
        this.priceDt.selectCmd = 
        {
            query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
        }
        this.orderDetailDt.selectCmd = 
        {
            query : "SELECT GUID,ITEM_NAME,ITEM_CODE,UNIT_NAME,PEND_QUANTITY/UNIT_FACTOR AS PEND_QUANTITY,LINE_NO FROM  " +
                    "(SELECT GUID,  " +
                    "ITEM_NAME,  " +
                    "ITEM_CODE,  " +
                    "LINE_NO,  " +
                    "CASE WHEN '" + this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value +   "' = 'true' THEN (APPROVED_QUANTITY - COMP_QUANTITY) ELSE (QUANTITY - COMP_QUANTITY) END AS PEND_QUANTITY ,  " +
                    "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE ITEM_UNIT.GUID = DOC_ORDERS_VW_01.UNIT),1) AS UNIT_FACTOR , " +
                    "ISNULL((SELECT SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.GUID = DOC_ORDERS_VW_01.UNIT),'U') AS UNIT_NAME " +
                    "FROM DOC_ORDERS_VW_01 WHERE DOC_GUID = @DOC_GUID AND CLOSED = 0) AS TMP ORDER BY LINE_NO ASC",
            param : ['DOC_GUID:string|50'],
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
        this.dtFirstDate.value = moment(new Date())
        this.dtLastDate.value = moment(new Date())

        this.dtDocDate.value = moment(new Date())

        await this.cmbDepot.dataRefresh({source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}});

        let tmpDoc = {...this.docObj.empty}

        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 40
        tmpDoc.REF = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'txtRef'}).getValue().value
        tmpDoc.OUTPUT = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value

        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false
        this.cmbDepot.readOnly = false
        this.dtDocDate.readOnly = false

        this.clearEntry();

        this.txtRef.props.onChange(tmpDoc.REF)

        await this.grdList.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
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

        this.lblItemName.value = ""
        this.lblOrderName.value = ""
        this.lblDepotQuantity.value = 0
        this.txtPendQuantity.value = 0
        this.txttotalQuantity.value = 0
        this.txtFactor.value = 0
        this.txtQuantity.value = 0
        this.cmbUnit.setData([])
        this.txtBarcode.focus()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:40});
        
        this.txtRef.readOnly = true
        this.txtRefNo.readOnly = true
        this.cmbDepot.readOnly = true
        this.dtDocDate.readOnly = true
    }
    async getOrders()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT REF,REF_NO,DOC_GUID,DOC_DATE,INPUT AS CUSTOMER,INPUT_CODE AS CUSTOMER_CODE,INPUT_NAME AS CUSTOMER_NAME, " + 
                            "OUTPUT_CODE AS DEPOT_CODE,OUTPUT_NAME AS DEPOT_NAME,OUTPUT AS DEPOT " +  
                            "FROM DOC_ORDERS_VW_01 " + 
                            "WHERE CLOSED = 0 AND CASE WHEN '" + this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value +   "' = 'true' THEN (DOC_ORDERS_VW_01.APPROVED_QUANTITY - DOC_ORDERS_VW_01.COMP_QUANTITY) ELSE DOC_ORDERS_VW_01.COMP_QUANTITY END > 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = ''))" + 
                            "GROUP BY REF,REF_NO,DOC_GUID,DOC_DATE,INPUT,INPUT_CODE,INPUT_NAME,OUTPUT_CODE,OUTPUT_NAME,OUTPUT",
                    param : ['FIRST_DATE:date','LAST_DATE:date','INPUT_CODE:string|50'],
                    value : [this.dtFirstDate.value,this.dtLastDate.value,this.docObj.dt()[0].INPUT_CODE]
                },
                sql : this.core.sql
            }
        }
        await this.grdOrderList.dataRefresh(tmpSource)
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [this.orderGuid,pCode]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME               

                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh()
                this.cmbUnit.setData(this.unitDt)

                if(this.unitDt.length > 0)
                {
                    if(this.itemDt[0].UNIT_GUID != '00000000-0000-0000-0000-000000000000')
                    {
                        this.cmbUnit.value = this.itemDt[0].UNIT_GUID
                        this.txtFactor.value = this.unitDt.where({GUID:this.itemDt[0].UNIT_GUID})[0].FACTOR
                    }
                    else
                    {
                        this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                        this.txtFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                    }
                   
                    this.txtFactor.props.onValueChanged()
                }

                this.txtPendQuantity.value = this.itemDt[0].PEND_QUANTITY / this.txtFactor.value
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
    async calcEntry() {
        // Vérifie si l'une des propriétés a une valeur différente de zéro
        if (this.txtFactor.value !== 0 || this.txtQuantity.value !== 0) 
        {
            this.txtPendQuantity.value = this.itemDt[0].PEND_QUANTITY / this.txtFactor.value
            // Calcule la quantité temporaire en multipliant txtFactor par txtQuantity
            this.txttotalQuantity.value = this.txtFactor.value * this.txtQuantity.value;
    
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
        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0 || (this.txttotalQuantity.value > (this.txtPendQuantity.value * this.txtFactor.value )))
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgQuantityCheck")}</div>)
            document.getElementById("Sound").play(); 
            await dialog(this.alertContent);
            return
        }

        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value

        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                let tmpQuantity = this.txttotalQuantity.value
                this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + tmpQuantity
                this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100)) * tmpQuantity).toFixed(3))
                this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(3))
                this.docObj.docItems.dt()[i].TOTAL = parseFloat((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT).toFixed(3))
                this.clearEntry()
                await this.save()
            }
            for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
            {
                if(this.docObj.docItems.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
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

        let tmpDocItems = {...this.docObj.docItems.empty}

        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
        tmpDocItems.UNIT = this.cmbUnit.value
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.txttotalQuantity.value
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT_RATE
        tmpDocItems.PRICE = this.itemDt[0].PRICE
        tmpDocItems.AMOUNT = (this.txttotalQuantity.value) * this.itemDt[0].PRICE
        tmpDocItems.DISCOUNT_1 = Number(((this.itemDt[0].DISCOUNT_1) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT_2 = Number(((this.itemDt[0].DISCOUNT_2) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT_3 = Number(((this.itemDt[0].DISCOUNT_3) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT = (tmpDocItems.DISCOUNT_1 + tmpDocItems.DISCOUNT_2 + tmpDocItems.DISCOUNT_3)
        tmpDocItems.DOC_DISCOUNT_1 = ((this.itemDt[0].DOC_DISCOUNT_1) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT_2 = ((this.itemDt[0].DOC_DISCOUNT_2) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT_3 = ((this.itemDt[0].DOC_DISCOUNT_3) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT = (tmpDocItems.DOC_DISCOUNT_1 + tmpDocItems.DOC_DISCOUNT_2 + tmpDocItems.DOC_DISCOUNT_3)
        tmpDocItems.TOTALHT = Number(tmpDocItems.AMOUNT - (tmpDocItems.DISCOUNT + tmpDocItems.DOC_DISCOUNT)).round(2)
        tmpDocItems.VAT = Number(tmpDocItems.TOTALHT).rateInc(tmpDocItems.VAT_RATE, 4);
        tmpDocItems.TOTAL = tmpDocItems.TOTALHT + tmpDocItems.VAT
        tmpDocItems.ORDER_LINE_GUID = this.itemDt[0].ORDER_LINE_GUID
        tmpDocItems.ORDER_DOC_GUID = this.itemDt[0].ORDER_DOC_GUID

        this.docObj.docItems.addEmpty(tmpDocItems)

        this.orderDetailDt.clear();
        this.orderDetailDt.selectCmd.value = [this.orderGuid]
        await this.orderDetailDt.refresh();  
        await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});
        this.clearEntry()

        await this.save()
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            console.log(this.docObj.docItems.dt())
            if(this.docObj.dt().length > 0)
            {
                let tmpVat = 0
                for (let i = 0; i < this.docObj.docItems.dt().groupBy('VAT_RATE').length; i++) 
                {
                    tmpVat = tmpVat + parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                }
                this.docObj.dt()[0].AMOUNT = this.docObj.docItems.dt().sum("AMOUNT",2)
                this.docObj.dt()[0].DISCOUNT = Number(parseFloat(this.docObj.docItems.dt().sum("AMOUNT",2)) - parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2))).round(2)
                this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_1",4)
                this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_2",4)
                this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_3",4)
                this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
                this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
                this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2))
                this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2)) - parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT",2))).round(2)
                this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
            }
            
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'after'}],
            }
            
            if((await this.docObj.save()) == 0)
            {                                                    
               
            }
            else
            {
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("msgSaveResult.msgFailed")}</div>)
                await dialog(tmpConfObj1);
            }
            this.getOrderName()
            resolve()
        })
    }
    async deleteAll()
    {
        this.docObj.dt('DOC').removeAt(0)
        await this.docObj.dt('DOC').delete();
        this.init()
        this.pageView.activePage('Main')
    }
    async onClickBarcodeShortcut()
    {
        if(this.docObj.dt()[0].OUTPUT == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDepot")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(this.docObj.dt()[0].INPUT == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgCustomer")}</div>)
            await dialog(this.alertContent);
            return
        }
        this.getOrderName()

        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.docObj.dt("DOC_ITEMS").length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    async onClickOrdersShortcut()
    {
        this.txtOrderRef.value = ''
        this.pageView.activePage('Orders')
    }
    async ordersSelect(pGuid)
    {
        if(typeof pGuid == 'undefined')
        {
            pGuid = this.grdOrderList.getSelectedData()[0].DOC_GUID
        }
        if(this.docObj.docItems.dt().length > 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgOrderSelected")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(typeof pGuid != 'undefined')
        {
            console.log(pGuid)
            if(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'GetOldDispatch'}).getValue())
            {
                console.log(111)
                let tmpQuery = 
                {
                    query :"SELECT * FROM DOC_CONNECT_VW_01 WHERE DOC_FROM = @GUID",
                    param : ['GUID:string|50'],
                    value : [pGuid]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                console.log(tmpData)
                if(tmpData.result.recordset.length > 0)
                {
                    await this.getDoc(tmpData.result.recordset[0].DOC_TO,'',0)
                    this.orderGuid = pGuid
                    this.onClickBarcodeShortcut()
                    return
                }
                console.log(2222)
            }
            let tmpQuery = 
            {
                query :"SELECT *,(SELECT ISNULL(MAX(DOC.REF_NO) + 1,1) FROM DOC WHERE DOC.TYPE = 1 AND DOC.DOC_TYPE = 40 AND DOC.REF = DOC_VW_01.REF) AS NEW_REF_NO  FROM DOC_VW_01 WHERE GUID = @GUID ",
                param : ['GUID:string|50'],
                value : [pGuid]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                console.log(tmpData.result.recordset[0])
                this.docObj.dt()[0].OUTPUT = tmpData.result.recordset[0].OUTPUT,
                this.docObj.dt()[0].INPUT_CODE = tmpData.result.recordset[0].INPUT_CODE
                this.docObj.dt()[0].INPUT_NAME = tmpData.result.recordset[0].INPUT_NAME
                this.docObj.dt()[0].INPUT = tmpData.result.recordset[0].INPUT
                this.docObj.dt()[0].REF = tmpData.result.recordset[0].REF
                this.orderGuid = tmpData.result.recordset[0].GUID
                this.txtRefNo.value = tmpData.result.recordset[0].NEW_REF_NO
                this.onClickBarcodeShortcut()
            }
        } 
        else if(this.grdOrderList.getSelectedData().length)
        {
            this.docObj.dt()[0].OUTPUT = this.grdOrderList.getSelectedData()[0].DEPOT,
            this.docObj.dt()[0].INPUT_CODE = this.grdOrderList.getSelectedData()[0].CUSTOMER_CODE
            this.docObj.dt()[0].INPUT_NAME = this.grdOrderList.getSelectedData()[0].CUSTOMER_NAME
            this.docObj.dt()[0].INPUT = this.grdOrderList.getSelectedData()[0].CUSTOMER
            this.docObj.dt()[0].REF = this.grdOrderList.getSelectedData()[0].CUSTOMER_CODE
            this.orderGuid = this.grdOrderList.getSelectedData()[0].DOC_GUID
            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF ",
                param : ['REF:string|25'],
                value : [this.txtRef.value]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
            }
            this.onClickBarcodeShortcut()
        }
    }
    async getOrderName()
    {
        console.log(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'showOrderLine'}).getValue())
        if(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'showOrderLine'}).getValue() == true)
        {
            this.orderDetailDt.selectCmd.value = [this.orderGuid]
            await this.orderDetailDt.refresh();  
            this.lblOrderName.value = this.orderDetailDt.where({PEND_QUANTITY:{'>':'0'}}).orderBy('LINE_NO',"asc")[0].ITEM_NAME
        }
    }
    async getOrderList()
    {
        this.orderDetailDt.clear();
        this.orderDetailDt.selectCmd.value = [this.orderGuid]
        await this.orderDetailDt.refresh();  
        await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});
        this.pageView.activePage('OrderDetail')
    }
    async orderComplated()
    {
        let tmpConfObj = 
        {
            id:'msgOrderComplated',showTitle:true,title:this.lang.t("msgOrderComplated.title"),showCloseButton:true,width:'350px',height:'200px',
            button:[{id:"btn01",caption:this.lang.t("msgOrderComplated.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgOrderComplated.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderComplated.msg")}</div>)
        }
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn01')
        {              
            for (let i = 0; i < this.orderDetailDt.length; i++) 
            {
                console.log(this.orderDetailDt)
                if(this.orderDetailDt[i].PEND_QUANTITY > 0)
                {
                    let tmpQuery = 
                    {
                        query :"UPDATE DOC_ORDERS SET CLOSED = 1 WHERE GUID = @GUID ",
                        param : ['GUID:string|50'],
                        value : [this.orderDetailDt[i].GUID]
                    }

                    await this.core.sql.execute(tmpQuery) 
                }
            }
            this.init()
        }
        else
        {
           
        }
    }
    render()
    {
        return(
            <div>
                <div>
                <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.kar_01")} content=
                {[
                    {
                        name : 'Main',isBack : false,isTitle : true,
                        menu :
                        [
                            {
                                icon : "fa-file",
                                text : this.lang.t("btnNewDoc"),
                                onClick : ()=>
                                {
                                    this.init()
                                }
                            },
                            {
                                icon : "fa-trash",
                                text : this.lang.t("btnDocDelete"),
                                onClick : ()=>
                                {
                                    if(this.docObj.dt().length > 0)
                                    {
                                        this.deleteAll();
                                    }
                                }
                            }
                        ]
                    },
                    {
                        name : 'Entry',isBack : true,isTitle : false,
                        menu :
                        [
                            {
                                icon : "fa-percent",
                                text : this.lang.t("btnLineDisc"),
                                onClick : ()=>
                                {
                                    this.popDiscount.show()
                                }
                            }
                        ],
                        shortcuts :
                        [
                            {icon : "fa-file-lines",onClick : this.onClickProcessShortcut.bind(this)}
                        ]
                    },
                    {
                        name : 'Process',isBack : true,isTitle : false,
                        shortcuts :
                        [
                            {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                        ]
                    },
                    {
                        name : 'Orders',isBack : true,isTitle : false,
                        shortcuts :
                        [
                            {icon : "fa-barcode",onClick : this.onClickOrdersShortcut.bind(this)}
                        ]
                    },
                    {
                        name : 'OrderDetail',isBack : true,isTitle : false,
                        shortcuts :
                        [
                            {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                        ]
                    }
                ]}
                onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'50px',height:'100%'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblRef")}</div>
                                        <div className='col-9'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                    onChange={(async(e)=>
                                                    {
                                                        try 
                                                        {
                                                            let tmpQuery = 
                                                            {
                                                                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF ",
                                                                param : ['REF:string|25'],
                                                                value : [typeof e.component == 'undefined' ? e : this.txtRef.value]
                                                            }

                                                            let tmpData = await this.core.sql.execute(tmpQuery) 

                                                            if(tmpData.result.recordset.length > 0)
                                                            {
                                                                this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
                                                            }
                                                        }
                                                        catch (error) 
                                                        {
                                                            console.log("Hata oluştu: ", error);
                                                        }
                                                        
                                                    }).bind(this)}
                                                    />
                                                </div>
                                                <div className='col-8'>
                                                    <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:async()=>
                                                                {
                                                                    this.popDoc.show()
                                                                    this.popDoc.onClick = (data) =>
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
                                                                    this.txtRefNo.value = Math.floor(Date.now() / 1000)
                                                                }
                                                            }
                                                        ]
                                                    }/>
                                                    {/*EVRAK SEÇİM */}
                                                    <NdPopGrid id={"popDoc"} parent={this} container={"#root"}
                                                    selection={{mode:"single"}}
                                                    visible={false}
                                                    position={{of:'#root'}} 
                                                    showTitle={true} 
                                                    showBorders={true}
                                                    width={'100%'}
                                                    height={'100%'}
                                                    title={this.t("popDoc.title")} 
                                                    data = 
                                                    {{
                                                        source:
                                                        {
                                                            select:
                                                            {
                                                                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 ORDER BY DOC_DATE DESC"
                                                            },
                                                            sql:this.core.sql
                                                        }
                                                    }}
                                                    >
                                                        <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                        <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("popDoc.clmDate")} width={100}  />
                                                        <Column dataField="INPUT_NAME" caption={this.t("popDoc.clmInputName")} width={200}  />
                                                        <Column dataField="INPUT_CODE" caption={this.t("popDoc.clmInputCode")} width={150}  />
                                                    </NdPopGrid>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDepot")}</div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                            dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerCode")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}
                                            dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            this.popCustomer.show()
                                                            this.popCustomer.onClick = async(data) =>
                                                            { 
                                                                if(data.length > 0)
                                                                {
                                                                    this.docObj.dt()[0].INPUT = data[0].GUID
                                                                    this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                                    this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                                
                                                                    if(this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue() ==  true)
                                                                    {
                                                                        this.txtRef.value = data[0].CODE;
                                                                        this.txtRef.props.onChange(data[0].CODE)
                                                                    }
                                                                    if(this.cmbDepot.value != '' && this.docLocked == false)
                                                                    {
                                                                        this.frmdocOrders.option('disabled',false)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }/>
                                            {/*CARI SECIMI POPUP */}
                                            <NdPopGrid id={"popCustomer"} parent={this} container={"#root"}
                                            selection={{mode:"single"}}
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'100%'}
                                            height={'100%'}
                                            title={this.lang.t("popCustomer.title")} 
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
                                                <Column dataField="CODE" caption={this.lang.t("popCustomer.clmCode")} width={150} />
                                                <Column dataField="TITLE" caption={this.lang.t("popCustomer.clmTitle")} width={500} defaultSortOrder="asc" />
                                                <Column dataField="TYPE_NAME" caption={this.lang.t("popCustomer.clmTypeName")} width={100} />
                                                <Column dataField="GENUS_NAME" caption={this.lang.t("popCustomer.clmGenusName")} width={100} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerName")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickOrdersShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-list"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnOrderSelect")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickProcessShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-file-lines"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnProcessLines")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-barcode"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnBarcodeEntry")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-success btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.orderComplated.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-check"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnOrderComplated")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Entry"} onActive={()=>
                        {
                            this.txtBarcode.focus();
                        }}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h6 style={{height:'60px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblOrderName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            onKeyUp={(async(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    await this.getItem(this.txtBarcode.value)
                                                }
                                            }).bind(this)}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'02',
                                                        icon:'photo',
                                                        onClick:()=>
                                                        {
                                                            if(typeof cordova == "undefined")
                                                            {
                                                                return;
                                                            }
                                                            cordova.plugins.barcodeScanner.scan(
                                                                async function (result) 
                                                                {
                                                                    if(result.cancelled == false)
                                                                    {
                                                                        this.txtBarcode.value = result.text;
                                                                        this.getItem(result.text)
                                                                    }
                                                                }.bind(this),
                                                                function (error) 
                                                                {
                                                                    
                                                                },
                                                                {
                                                                  prompt : "Scan",
                                                                  orientation : "portrait"
                                                                }
                                                            );
                                                        }
                                                    }
                                                ]
                                            }>
                                            </NdTextBox>
                                            {/*STOK SEÇİM */}
                                            <NdPopGrid id={"popItem"} parent={this} container={"#root"}
                                            selection={{mode:"single"}}
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'100%'}
                                            height={'100%'}
                                            search={true}
                                            title={this.lang.t("popItem.title")} 
                                            data = 
                                            {{
                                                source:
                                                {
                                                    select:
                                                    {
                                                        query : "SELECT CODE,NAME FROM ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))",
                                                        param : ['VAL:string|50']
                                                    },
                                                    sql:this.core.sql
                                                }
                                            }}
                                            >
                                                <Column dataField="CODE" caption={this.lang.t("popItem.clmCode")} width={120} />
                                                <Column dataField="NAME" caption={this.lang.t("popItem.clmName")} width={100} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.getOrderList.bind(this)}>{this.t("lblOrderList")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <h6 style={{height:'60px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <div style={{fontSize:'14px',fontWeight:'bold'}}>
                                                <label className='text-purple-light'>{this.t("lblDepotQuantity")}</label>
                                                <NbLabel id="lblDepotQuantity" parent={this} value={0}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblPendQuantity")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdNumberBox id="txtPendQuantity" parent={this} simple={true} maxLength={32} readOnly={true}  />
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblUnit")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                            onValueChanged={(e)=>
                                            {
                                                if(e.value != null && e.value != "")
                                                {
                                                    let tmpFactor = this.unitDt.where({GUID:e.value});
                                                    if(tmpFactor.length > 0)
                                                    {
                                                        this.txtFactor.value = tmpFactor[0].FACTOR
                                                        this.txtFactor.props.onValueChanged()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblQuantity")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onValueChanged={this.calcEntry.bind(this)}
                                            onEnterKey={this.addItem.bind(this)}/>
                                        </div>
                                        <div className='col-1 d-flex align-items-center justify-content-center'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>X</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdNumberBox id="txtQuantity" parent={this} simple={true} maxLength={32} onValueChanged={this.calcEntry.bind(this)}
                                            onEnterKey={this.addItem.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblTotalQuantity")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdNumberBox id="txttotalQuantity" parent={this} simple={true} maxLength={32} readOnly={true}  />
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.addItem.bind(this)}>{this.t("lblAdd")}
                                            </NbButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Process"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onRowRemoving={async (e)=>
                                            {
                                                if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                                {
                                                    e.cancel = true
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotDelete")}</div>)
                                                    await dialog(this.alertContent);
                                                    e.component.cancelEditData()
                                                }
                                            }}
                                            onRowRemoved={async (e)=>
                                            {
                                                if(this.docObj.docItems.dt().length == 0)
                                                {
                                                    this.deleteAll()
                                                }
                                                else
                                                {
                                                    await this.save()
                                                }
                                                
                                            }}
                                            onRowUpdating={async (e)=>
                                            {
                                                if(e.key.INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                                {
                                                    e.cancel = true
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotUpdate")}</div>)
                                                    await dialog(this.alertContent);
                                                    e.component.cancelEditData()
                                                }
                                            }}
                                            onRowUpdated={async(e)=>
                                            {
                                                if(typeof e.data.QUANTITY != 'undefined')
                                                {
                                                    e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                                    await this.save()
                                                }
                                                if(typeof e.data.PRICE != 'undefined')
                                                {
                                                    e.key.SUB_PRICE = e.data.PRICE / e.key.SUB_FACTOR
                                                }
                                                if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                                {
                                                    e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE,4)
                                                    e.key.DISCOUNT_1 = Number(e.key.PRICE * e.key.QUANTITY).rateInc( e.data.DISCOUNT_RATE,4)
                                                    e.key.DISCOUNT_2 = 0
                                                    e.key.DISCOUNT_3 = 0
                                                }
                                                if(typeof e.data.DISCOUNT != 'undefined')
                                                {
                                                    e.key.DISCOUNT_1 = e.data.DISCOUNT
                                                    e.key.DISCOUNT_2 = 0
                                                    e.key.DISCOUNT_3 = 0
                                                    e.key.DISCOUNT_RATE = Number(e.key.PRICE * e.key.QUANTITY).rate2Num(e.data.DISCOUNT)
                                                }
                                                
                                                if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                                {
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDiscount")}</div>)
                                                    await dialog(this.alertContent);
                                                    
                                                    e.key.DISCOUNT = 0 
                                                    e.key.DISCOUNT_1 = 0
                                                    e.key.DISCOUNT_2 = 0
                                                    e.key.DISCOUNT_3 = 0
                                                    e.key.DISCOUNT_RATE = 0
                                                    return
                                                }
        
                                                e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - (parseFloat(e.key.DISCOUNT) + parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
                                                e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                                e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                                e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
        
                                                if(e.key.DISCOUNT > 0)
                                                {
                                                    e.key.DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(4))
                                                }
                                                await this.save()
                                            }}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                <Column dataField="ITEM_NAME" caption={this.t("grdList.clmItemName")} width={150} />
                                                <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} dataType={'number'} width={40}/>
                                                <Column dataField="PRICE" caption={this.t("grdList.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={60}/>
                                                <Column dataField="AMOUNT" caption={this.t("grdList.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                                <Column dataField="DISCOUNT" caption={this.t("grdList.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                                <Column dataField="DISCOUNT_RATE" caption={this.t("grdList.clmDiscountRate")} dataType={'number'} width={80}/>
                                                <Column dataField="VAT" caption={this.t("grdList.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={80}/>
                                                <Column dataField="TOTAL" caption={this.t("grdList.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={100}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblDiscount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblDocDiscount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()  =>
                                                        {
                                                            console.log(this.docObj.dt()[0].SUBTOTAL)
                                                            console.log(this.docObj.dt()[0].DOC_DISCOUNT_1)
                                                            console.log( Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_1,5))
                                                            if(this.docObj.dt()[0].DOC_DISCOUNT > 0 )
                                                            {
                                                                this.txtDocDiscountPercent1.value  = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_1,5)
                                                                this.txtDocDiscountPrice1.value = this.docObj.dt()[0].DOC_DISCOUNT_1
                                                                this.txtDocDiscountPercent2.value  = Number(this.docObj.dt()[0].SUBTOTAL-parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_1)).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_2,5)
                                                                this.txtDocDiscountPrice2.value = this.docObj.dt()[0].DOC_DISCOUNT_2
                                                                this.txtDocDiscountPercent3.value  = Number(this.docObj.dt()[0].SUBTOTAL-(parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_1)+parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_2))).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_3,5)
                                                                this.txtDocDiscountPrice3.value = this.docObj.dt()[0].DOC_DISCOUNT_3
                                                            }
                                                            else
                                                            {
                                                                this.txtDocDiscountPercent1.value  = 0
                                                                this.txtDocDiscountPrice1.value = 0
                                                                this.txtDocDiscountPercent2.value  = 0
                                                                this.txtDocDiscountPrice2.value = 0
                                                                this.txtDocDiscountPercent3.value  = 0
                                                                this.txtDocDiscountPrice3.value = 0
                                                            }
                                                            this.popDocDiscount.show()
                                                        }
                                                    }
                                                ]
                                            }/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblTotalHt")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblVat")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtDocVat" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblGenAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Evrak İndirim PopUp */}
                            <NdPopUp parent={this} id={"popDocDiscount"} 
                            visible={false}                        
                            showCloseButton={false}
                            showTitle={true}
                            title={this.t("popDocDiscount.title")}
                            container={"#root"} 
                            width={"300"}
                            height={"400"}
                            position={{of:"#root"}}
                            >
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent1.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent1.value = 0;
                                                this.txtDocDiscountPrice1.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice1.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent1.value,2)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice1.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent1.value = 0;
                                                this.txtDocDiscountPrice1.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent1.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice1.value)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if(this.txtDocDiscountPercent2.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice2.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent2.value,2)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice2.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent2.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice2.value)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent3.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice3.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent3.value,2)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice3.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent3.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice3.value)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-12'>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={(async () =>
                                            {
                                                for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                {
                                                    let tmpDocData = this.docObj.docItems.dt()[i]
                                                    
                                                    tmpDocData.DOC_DISCOUNT_1 = Number(tmpDocData.TOTALHT).rateInc(this.txtDocDiscountPercent1.value,4)
                                                    tmpDocData.DOC_DISCOUNT_2 = Number(((tmpDocData.TOTALHT) - tmpDocData.DOC_DISCOUNT_1)).rateInc(this.txtDocDiscountPercent2.value,4)

                                                    tmpDocData.DOC_DISCOUNT_3 =  Number(((tmpDocData.TOTALHT)-(tmpDocData.DOC_DISCOUNT_1+tmpDocData.DOC_DISCOUNT_2))).rateInc(this.txtDocDiscountPercent3.value,4)
                                                    
                                                    tmpDocData.DOC_DISCOUNT = parseFloat((tmpDocData.DOC_DISCOUNT_1 + tmpDocData.DOC_DISCOUNT_2 + tmpDocData.DOC_DISCOUNT_3).toFixed(4))
                                                    tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                    
                                                    if(tmpDocData.VAT > 0)
                                                    {
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                    }
                                                    tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                    tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                }
                                                await this.save()
                                                this.popDocDiscount.hide()
                                            }).bind(this)}>{this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </NdPopUp> 
                        </PageContent>
                        <PageContent id={"Orders"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtFirstDate"} pickerType={"rollers"}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtLastDate"} pickerType={"rollers"}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblOrderRef")}</div>
                                        <div className='col-9'>
                                            <NdTextBox simple={true}  parent={this} id="txtOrderRef"
                                            onKeyUp={(async(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT GUID FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 AND REF +'-'+ CONVERT(NVARCHAR,REF_NO) = @REF ",
                                                        param : ['REF:string|100'],
                                                        value : [this.txtOrderRef.value]
                                                    }
                                        
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 

                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        this.ordersSelect(tmpData.result.recordset[0].GUID)
                                                    }
                                                    else
                                                    {
                                                        document.getElementById("Sound").play(); 
                                                        this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgOrderNotFound")}</div>)
                                                        await dialog(this.alertContent);
                                                    }
                                                }
                                            }).bind(this)}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.getOrders.bind(this)}>{this.t("lblList")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.ordersSelect.bind(this)}>{this.t("lblSelect")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOrderList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            selection={{mode:"single"}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="REF" caption={this.t("grdList.clmRef")} width={150} />
                                                <Column dataField="REF_NO" caption={this.t("grdList.clmRefNo")} dataType={'number'} width={80}/>
                                                <Column dataField="DOC_DATE" caption={this.t("grdList.clmDate")} allowEditing={false} dataType={"datetime"} format={"dd-MM-yyyy"} defaultSortOrder="desc"/>
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdList.clmCustomerName")} width={150}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"OrderDetail"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={(async () =>
                                            {   
                                                this.onClickBarcodeShortcut()
                                                await this.getItem(this.grdOrderDetail.getSelectedData()[0].ITEM_CODE)
                                            }).bind(this)}>{this.t("lblSelect")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOrderDetail"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            selection={{mode:"single"}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onRowPrepared={(e) =>
                                            {
                                                if(e.rowType == 'data' && e.data.PEND_QUANTITY == '0')
                                                {
                                                    e.rowElement.style.backgroundColor ="green"
                                                }
                                            }}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="ITEM_NAME" caption={this.t("grdOrderDetail.clmItemName")} width={250} />
                                                <Column dataField="PEND_QUANTITY" caption={this.t("grdOrderDetail.clmQuantity")} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_NAME}} dataType={'number'} width={160}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}