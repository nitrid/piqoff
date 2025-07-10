import React from 'react';
import App from '../lib/app.js';
import { nf525Cls } from '../../core/cls/nf525.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import RadioGroup from 'devextreme-react/radio-group';
import NbButton from '../../core/react/bootstrap/button';
import NdListBox from '../../core/react/devex/listbox.js';
import NdDropDownBox from '../../core/react/devex/dropdownbox.js';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdNumberBox  from '../../core/react/devex/numberbox.js'
import NdCheckBox   from '../../core/react/devex/checkbox.js'
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Summary,TotalItem,Export,ColumnChooser,StateStoring} from '../../core/react/devex/grid.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdPopUp  from '../../core/react/devex/popup.js';
import NdButton   from '../../core/react/devex/button.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NbItemView from '../tools/itemView.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import { docCls,docOrdersCls, docCustomerCls,docExtraCls }from '../../core/cls/doc.js';
import { datatable } from '../../core/core.js';

export default class Sale extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"sale")
        this.lang = App.instance.lang;
        this.docObj = new docCls();
        this.docLines = new datatable()
        this.vatRate =  new datatable()
        this.nf525 = new nf525Cls();
        this.extraObj = new docExtraCls();
        this.balance = new datatable();
        this.customerExtreReportDt = new datatable();
        this.txtFactureNonSoldeDt = new datatable();

        this.state = 
        {
            columnListValue : ['DOC_DATE','TYPE_NAME','REF','REF_NO','DEBIT','RECEIVE','BALANCE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "DOC_DATE",NAME : this.t("grdListe.clmDocDate")},                                   
            {CODE : "TYPE_NAME",NAME : this.t("grdListe.clmTypeName")},
            {CODE : "REF",NAME : this.t("grdListe.clmRef")},
            {CODE : "REF_NO",NAME : this.t("grdListe.clmRefNo")},
            {CODE : "DEBIT",NAME : this.t("grdListe.clmDebit")},
            {CODE : "RECEIVE",NAME : this.t("grdListe.clmReceive")},
            {CODE : "BALANCE",NAME : this.t("grdListe.clmBalance")},
        ]
        this.groupList = [];


        this.balance.selectCmd = 
        {
            query : "SELECT ROUND(BALANCE,2) AS FACT_NON_SOLDE FROM ACCOUNT_BALANCE WHERE ACCOUNT_GUID = @ACCOUNT_GUID",
            param : ['ACCOUNT_GUID:string|50'],
        }
        this.customerExtreReportDt.selectCmd = 
        {
            query:  `SELECT
                    CONVERT(DATETIME,@FIRST_DATE) - 1 AS DOC_DATE,
                    '' AS REF,
                    0 AS REF_NO,
                    '00000000-0000-0000-0000-000000000000' AS DOC_GUID,
                    0 AS TYPE,
                    0 AS DOC_TYPE,
                    0 AS REBATE,
                    0 AS PAY_TYPE,
                    '' AS TYPE_NAME,
                    CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) < 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0 END AS DEBIT,
                    CASE WHEN (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) > 0 THEN  (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) ELSE 0  END AS RECEIVE,
                    (SELECT [dbo].[FN_CUSTOMER_BALANCE](@CUSTOMER,@FIRST_DATE)) AS BALANCE
                    UNION ALL
                    SELECT
                    DOC_DATE,
                    REF,
                    REF_NO,
                    DOC_GUID,
                    TYPE,
                    DOC_TYPE,
                    REBATE,
                    PAY_TYPE,
                    (SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,REBATE,PAY_TYPE)) AND LANG = @LANG) AS TYPE_NAME,
                    CASE TYPE WHEN 0 THEN (AMOUNT * -1) ELSE 0 END AS DEBIT,
                    CASE TYPE WHEN 1 THEN AMOUNT ELSE 0 END AS RECEIVE, 
                    CASE TYPE WHEN 0 THEN (AMOUNT * -1) WHEN 1 THEN AMOUNT END AS BALANCE 
                    FROM DOC_CUSTOMER_VW_01
                    WHERE (INPUT = @CUSTOMER OR OUTPUT = @CUSTOMER)
                    AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE  ORDER BY DOC_DATE ASC`,
            param: ['CUSTOMER:string|50', 'LANG:string|10', 'FIRST_DATE:date', 'LAST_DATE:date']
        }
        this.txtFactureNonSoldeDt.selectCmd = 
        {
            query: `SELECT *, ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) AS REMAINDER  
                    FROM ( 
                    SELECT 
                    TYPE, 
                    DOC_DATE, 
                    DOC_TYPE, 
                    INPUT_CODE, 
                    INPUT_NAME, 
                    DOC_REF, 
                    DOC_REF_NO, 
                    DOC_GUID, 
                    MAX(DOC_TOTAL) AS DOC_TOTAL, 
                    SUM(PAYING_AMOUNT) AS PAYING_AMOUNT
                    FROM DEPT_CREDIT_MATCHING_VW_03 
                    WHERE TYPE = 1 AND DOC_TYPE = 20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) 
                    GROUP BY DOC_TYPE, TYPE, DOC_DATE, INPUT_NAME, DOC_REF_NO, DOC_REF, INPUT_CODE , DOC_GUID 
                    ) AS TMP 
                    WHERE ROUND((DOC_TOTAL - PAYING_AMOUNT), 2) > 0`,  
                param : ['INPUT_CODE:string|50'],
        }

        this.docType = 0
        this.tmpPageLimit = 21
        this.tmpStartPage = 0
        this.tmpEndPage = 0
        this.bufferId = ''
        //this.mostSale = false
        // this.promoProduct = false

        this.state = 
        {
            isExecute : false,
            checkboxValue: false,
         
        }
        this.columnListData = 
        [
            {CODE : "MOST_SALES",NAME : this.t("mostSalesFilter")},
            // {CODE : "PROMO_PRODUCT",NAME : this.t("promoProductFilter")},
        ]
        this.radioPriorities = ['Low', 'Normal', 'Urgent', 'High']

        this._customerSearch = this._customerSearch.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this.getItems = this.getItems.bind(this)

        this.docLocked = false;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()
        let tmpDoc = {...this.docObj.empty}
        this.docObj.addEmpty(tmpDoc);
        this.docLines.clear()
        this.customerExtreReportDt.clear()
        this.txtFactureNonSoldeDt.clear()
        this.cmbGroup.value = ''
        this.docType = 0
        this.docLocked = false;
        this.orderGroup.value = this.sysParam.filter({ID:'salesItemsType',USERS:this.user.CODE}).getValue().value        
        this.dtFirstDate.value = moment(new Date());
        this.dtLastDate.value = moment(new Date());
        this.cmbDesignList.value = ''

        this.grdCustomerExtreReport.dataRefresh({source:this.customerExtreReportDt})
        this.grdFactNonSolde.dataRefresh({source:this.txtFactureNonSoldeDt})

        this.docObj.dt()[0].OUTPUT = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'cmbDepot'}).getValue().value
        this.docObj.dt()[0].PRICE_LIST_NO = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'PricingListNo'}).getValue()

        if(localStorage.getItem("data") != null)
        {
            let tmpConfObj1 =
            {
                id:'msgMemRecord',showTitle:true,title:this.t("msgMemRecord.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgMemRecord.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMemRecord.msg")}</div>)
            }
            await dialog(tmpConfObj1);
            
            this.docLines.import(JSON.parse(localStorage.getItem("data")))

            if(this.docLines.length > 0)
            {
                this.docObj.dt()[0].GUID = this.docLines[0].DOC_GUID
                this._calculateTotal();
            }
            this.getItems()
        }
        else
        {
            this.popCustomer.show()
            this.txtCustomerSearch.focus()
        }
    }
    _columnListBox(e)
    {
        var onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'MOST_SALES') != 'undefined')
                {
                    this.getItems()
                }
                else
                {
                    this.getItems()
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
    async getItems()
    {
        this.setState({isExecute:true})
        this.tmpPageLimit = 21
        this.tmpStartPage = 0
        this.tmpEndPage = 0
        this.bufferId = ''
        this.itemView.items = []
        //CORDOVA YADA ELECTRON İSE SQLLİTE LOCALDB KULLANILIYOR.
        if(this.core.local.platform != '')
        {
            let tmpQuery = 
            {
                query : "SELECT GUID,CODE,NAME,VAT,ROUND(PRICE,3) AS PRICE,IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,SUB_FACTOR " +
                        "FROM ITEMS_TAB_VW_01 " +
                        "WHERE ((UPPER(CODE) LIKE UPPER('%' || ? || '%')) OR (UPPER(NAME) LIKE UPPER('%' || ? || '%')) OR (BARCODE = ?)) AND " +
                        "((MAIN_GRP = ?) OR (? = ''))  GROUP BY GUID,CODE,NAME,VAT,ROUND(PRICE,3),IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,SUB_FACTOR ORDER BY "+ this.orderGroup.value +" LIMIT " + this.tmpPageLimit + " OFFSET " + this.tmpStartPage,
                values : [this.txtSearch.value.replaceAll(' ','%'),this.txtSearch.value.replaceAll(' ','%'),this.txtSearch.value.replaceAll(' ','%'),this.cmbGroup.value,this.cmbGroup.value],
            }            
            let tmpBuf = await this.core.local.select(tmpQuery) 

            if(typeof tmpBuf.result.err == 'undefined')
            {
                for (let i = 0; i < tmpBuf.result.recordset.length; i++) 
                {
                    let tmpItemObj = tmpBuf.result.recordset[i]
                    tmpItemObj.PRICE = (await this.getPrice(tmpItemObj.GUID,1,moment(new Date()).format('YYYY-MM-DD'),this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT,this.docObj.dt()[0].PRICE_LIST_NO,0,false))
                    this.itemView.items.push(tmpItemObj)
                }
                this.itemView.items = this.itemView.items
                this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
            }
            
            this.itemView.setItemAll()
        }
        else //CORDOVA YADA ELECTRON DEĞİL İSE SUNUCUDAN GETİRİLİYOR.
        {
            let tmpQuery = 
            {
                query : "SELECT GUID,CODE,NAME,VAT,ROUND(PRICE,3) AS PRICE,IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,SUB_FACTOR " +
                        "FROM ITEMS_TAB_VW_01 " +
                        "WHERE STATUS = 1 AND ((UPPER(CODE) LIKE UPPER('%' + @VAL + '%')) OR (UPPER(NAME) LIKE UPPER('%' + @VAL + '%')) OR (BARCODE = @VAL)) AND " +
                        "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) GROUP BY GUID,CODE,NAME,VAT,ROUND(PRICE,3),IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,FAVORI,SUB_FACTOR ORDER BY " + this.orderGroup.value,
                param : ['VAL:string|50','MAIN_GRP:string|50'],
                value : [this.txtSearch.value.replaceAll(' ','%'),this.cmbGroup.value],
                buffer : true
            }
            let tmpBuf = await this.core.sql.execute(tmpQuery) 
            if(typeof tmpBuf.result.err == 'undefined')
            {

                this.bufferId = tmpBuf.result.bufferId
                this.tmpEndPage = this.tmpStartPage + this.tmpPageLimit
                let tmpItems = await this.core.sql.buffer({start : this.tmpStartPage,end : this.tmpEndPage,bufferId : this.bufferId})  
                
                for (let i = 0; i < tmpItems.result.recordset.length; i++) 
                {
                    let tmpItemObj = tmpItems.result.recordset[i]
                    tmpItemObj.PRICE = (await this.getPrice(tmpItemObj.GUID,1,moment(new Date()).format('YYYY-MM-DD'),this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT,this.docObj.dt()[0].PRICE_LIST_NO,0,false))
                    this.itemView.items.push(tmpItemObj)
                }
                this.itemView.items = this.itemView.items
                this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
            }
            this.itemView.setItemAll()
        }
        
        this.setState({isExecute:false})
    }
    async loadMore()
    {
        this.setState({isExecute:true})
        //CORDOVA YADA ELECTRON İSE SQLLİTE LOCALDB KULLANILIYOR.
        if(this.core.local.platform != '')
        {
            let tmpQuery = 
            {
                query : "SELECT GUID,CODE,NAME,VAT,ROUND(PRICE,3) AS PRICE,IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,SUB_FACTOR FROM ITEMS_TAB_VW_01 " +
                        "WHERE ((UPPER(CODE) LIKE UPPER('%' || ? || '%')) OR (UPPER(NAME) LIKE UPPER('%' || ? || '%'))  OR (BARCODE = ?)) AND " +
                        "((MAIN_GRP = ?) OR (? = '')) GROUP BY GUID,CODE,NAME,VAT,ROUND(PRICE,3),IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,SUB_FACTOR ORDER BY " + this.orderGroup.value + " LIMIT " + this.tmpPageLimit + " OFFSET " + this.tmpStartPage,
                values : [this.txtSearch.value.replaceAll(' ','%'),this.txtSearch.value.replaceAll(' ','%'),this.txtSearch.value.replaceAll(' ','%'),this.cmbGroup.value,this.cmbGroup.value],
            }
            
            let tmpBuf = await this.core.local.select(tmpQuery) 

            if(typeof tmpBuf.result.err == 'undefined')
            {
                for (let i = 0; i < tmpBuf.result.recordset.length; i++) 
                {
                    let tmpItemObj = tmpBuf.result.recordset[i]
                    tmpItemObj.PRICE = (await this.getPrice(tmpItemObj.GUID,1,moment(new Date()).format('YYYY-MM-DD'),this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT,this.docObj.dt()[0].PRICE_LIST_NO,0,false))
                    this.itemView.items.push(tmpItemObj)
                }
                this.itemView.items = this.itemView.items
                this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
            }
            
            this.itemView.setItemAll()
        }
        else //CORDOVA YADA ELECTRON DEĞİL İSE SUNUCUDAN GETİRİLİYOR.
        {
            this.tmpEndPage = this.tmpStartPage + this.tmpPageLimit
            let tmpItems = await this.core.sql.buffer({start : this.tmpStartPage,end : this.tmpEndPage,bufferId : this.bufferId})  
            for (let i = 0; i < tmpItems.result.recordset.length; i++) 
            {
                let tmpItemObj = tmpItems.result.recordset[i]
                tmpItemObj.PRICE = (await this.getPrice(tmpItemObj.GUID,1,moment(new Date()).format('YYYY-MM-DD'),this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT,this.docObj.dt()[0].PRICE_LIST_NO,0,false))
                this.itemView.items.push(tmpItemObj)
            }
            this.itemView.items = this.itemView.items
            this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
            this.itemView.setItemAll()
        }
        this.setState({isExecute:false})
    }
    async getPrice(pItem,pQty,pDate,pCustomer,pDepot,pListNo,pType,pAddVat)
    {
        let tmpPrice = 0
        let tmpData
        if(this.core.local.platform != '')
        {
            let tmpQuery = 
            {
                query : `SELECT PRICE, ITEM_VAT, LIST_NO, LIST_VAT_TYPE, CONTRACT_VAT_TYPE 
                        FROM ITEM_PRICE_VW_02 
                        WHERE 
                            ITEM_GUID = ? AND 
                            TYPE = ? AND 
                            QUANTITY BETWEEN 0 AND ? AND 
                            (
                                (datetime(START_DATE) <= strftime('%Y-%m-%d', ?) AND datetime(FINISH_DATE) >= strftime('%Y-%m-%d', ?)) OR 
                                (START_DATE = '1970-01-01T00:00:00.000Z')
                            ) AND
                            (
                                (DEPOT = ?) OR 
                                (DEPOT = '00000000-0000-0000-0000-000000000000')
                            ) AND 
                            (LIST_NO = ? OR LIST_NO = 1) AND
                            (
                                (CUSTOMER_GUID = ?) OR 
                                (CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000')
                            )
                        ORDER BY LIST_NO DESC,DEPOT DESC, QUANTITY DESC, CONTRACT_GUID DESC, START_DATE DESC, FINISH_DATE DESC
                        LIMIT 1;`,
                values : [pItem,pType,pQty,pDate,pDate,pDepot == '' ? '00000000-0000-0000-0000-000000000000' : pDepot,pListNo,pCustomer == '' ? '00000000-0000-0000-0000-000000000000' : pCustomer],
            }
        
            tmpData = await this.core.local.select(tmpQuery) 
            if(typeof tmpData.result.err == 'undefined' && tmpData.result.recordset.length > 0)
            {
                let tmpVatType = 0
                tmpPrice = tmpData.result.recordset[0].PRICE
                
                if(pType == 0)
                {
                    if(tmpData.result.recordset[0].LIST_NO != 0)
                    {
                        tmpVatType = tmpData.result.recordset[0].LIST_VAT_TYPE
                    }
                    else
                    {
                        tmpVatType = tmpData.result.recordset[0].CONTRACT_VAT_TYPE
                    }
                    if(tmpVatType == 0)
                    {
                        tmpPrice = tmpPrice / ((tmpData.result.recordset[0].ITEM_VAT / 100) + 1)
                    }
                }
                if(pAddVat)
                {
                    tmpPrice = tmpPrice * ((tmpData.result.recordset[0].ITEM_VAT / 100) + 1)
                }
            }

        }
        else
        {
            let tmpQuery = 
            {
                query : `SELECT (SELECT [dbo].[FN_PRICE](GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,@DEPOT,@LIST_NO,@TYPE,0)) AS PRICE FROM ITEMS WHERE GUID = @GUID`,
                param : ['GUID:string|50','TYPE:int','QUANTITY:float','DEPOT:string|50','LIST_NO:int','CUSTOMER:string|50'],
                value : [pItem,pType,pQty,pDepot == '' ? '00000000-0000-0000-0000-000000000000' : pDepot,pListNo,pCustomer == '' ? '00000000-0000-0000-0000-000000000000' : pCustomer],
            }
            tmpData = await this.core.sql.execute(tmpQuery) 
            if(typeof tmpData.result.err == 'undefined' && tmpData.result.recordset.length > 0)
            {
                tmpPrice = tmpData.result.recordset[0].PRICE
            }
        }
        return Number(tmpPrice).round(3)
       
    }
    async _customerSearch()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME],[PRICE_LIST_NO],VAT_ZERO,BALANCE,(SELECT TOP 1 ADRESS + ' ' + CITY  FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER_ADRESS_VW_01.CUSTOMER = CUSTOMER_VW_02.GUID) AS ADRESS FROM CUSTOMER_VW_02 WHERE (UPPER(CODE) LIKE UPPER('%' + @VAL + '%') OR UPPER(TITLE) LIKE UPPER('%' + @VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtCustomerSearch.value]
                },
                sql : this.core.sql
            }
        }
        await this.grdCustomer.dataRefresh(tmpSource)
    }
    async _getOrders()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,DOC_ADDRESS,TOTAL FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0  AND DOC_DATE > dbo.GETDATE()-3 AND CUSER = '" + this.user.CODE + "' ORDER BY DOC_DATE,REF_NO DESC ",
                },
                sql : this.core.sql
            }
        }
        await this.grdDocs.dataRefresh(tmpSource)
    }
    async _getInvoices()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0 AND DOC_DATE > dbo.GETDATE()-30 ORDER BY DOC_DATE,REF_NO DESC ",
                },
                sql : this.core.sql
            }
        }
        await this.grdDocs.dataRefresh(tmpSource)
    }
    addItem(e)
    {
        let tmpDocOrders
        if(this.docType == 60 || this.docType == 0)
        {
            tmpDocOrders = {...this.docObj.docOrders.empty}
        }
        else if(this.docType == 20)
        {
            tmpDocOrders = {...this.docObj.docItems.empty}
        }
        tmpDocOrders.GUID = datatable.uuidv4()
        tmpDocOrders.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
        tmpDocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocOrders.LINE_NO = this.docLines.max("LINE_NO") + 1
        tmpDocOrders.REF = this.docObj.dt()[0].REF
        tmpDocOrders.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocOrders.INPUT = this.docObj.dt()[0].INPUT
        tmpDocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocOrders.ITEM_CODE = e.CODE
        tmpDocOrders.ITEM = e.GUID
        tmpDocOrders.ITEM_NAME = e.NAME
        tmpDocOrders.QUANTITY = e.QUANTITY * e.UNIT_FACTOR
        tmpDocOrders.UNIT = e.UNIT
        tmpDocOrders.UNIT_FACTOR = e.UNIT_FACTOR
        tmpDocOrders.PRICE = e.PRICE
        tmpDocOrders.AMOUNT = parseFloat(((tmpDocOrders.PRICE * tmpDocOrders.QUANTITY))).round(2)
        tmpDocOrders.TOTALHT = parseFloat(((tmpDocOrders.PRICE * tmpDocOrders.QUANTITY))).round(2)
        if(this.docObj.dt()[0].VAT_ZERO == 1)
        {
            tmpDocOrders.VAT_RATE = 0
            tmpDocOrders.VAT = 0
        }
        else
        {
            tmpDocOrders.VAT_RATE = e.VAT
            tmpDocOrders.VAT = parseFloat(((tmpDocOrders.TOTALHT ) * (e.VAT / 100)).toFixed(4))
        }
        tmpDocOrders.TOTAL = parseFloat(((tmpDocOrders.TOTALHT) + tmpDocOrders.VAT)).round(2)
        this.docLines.push(tmpDocOrders)

        this._calculateTotal()
    }
    onValueChange(e)
    {
        let tmpLine = this.docLines.where({'ITEM':e.GUID})
        if(tmpLine.length > 0)
        {
            if(e.QUANTITY > 0)
            { 
                tmpLine[0].QUANTITY = e.QUANTITY * e.UNIT_FACTOR
                tmpLine[0].PRICE = e.PRICE
                tmpLine[0].DISCOUNT = e.DISCOUNT
                tmpLine[0].AMOUNT = parseFloat(((tmpLine[0].PRICE * (e.QUANTITY * e.UNIT_FACTOR)))).round(2)
                tmpLine[0].TOTALHT = parseFloat(((tmpLine[0].PRICE * (e.QUANTITY * e.UNIT_FACTOR))) - tmpLine[0].DISCOUNT).round(2)
                if(this.docObj.dt()[0].VAT_ZERO == 1)
                {
                    tmpLine[0].VAT = 0
                }
                else
                {
                    tmpLine[0].VAT = parseFloat(((tmpLine[0].TOTALHT ) * (e.VAT / 100)).toFixed(4))
                }
                tmpLine[0].TOTAL = parseFloat(((tmpLine[0].TOTALHT) + tmpLine[0].VAT)).round(2)
                tmpLine[0].UNIT_FACTOR = e.UNIT_FACTOR
                tmpLine[0].UNIT = e.UNIT
            }
            else
            {
                this.docLines.removeAt(this.docLines.where({'ITEM':e.GUID})[0])
            }
            this._calculateTotal()
        }
        else
        {
            if(e.QUANTITY > 0)
            {
                this.addItem(e)
            }
        }
    }        
    async _calculateTotal()
    {
        let tmpVat = 0
        for (let i = 0; i < this.docLines.groupBy('VAT_RATE').length; i++) 
        {
            tmpVat = tmpVat + parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
        }
        this.docObj.dt()[0].AMOUNT = this.docLines.sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docLines.sum("DISCOUNT",2)
        this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docLines.sum("DOC_DISCOUNT_1",4)
        this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docLines.sum("DOC_DISCOUNT_2",4)
        this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docLines.sum("DOC_DISCOUNT_3",4)
        this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docLines.sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docLines.sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docLines.sum("DOC_DISCOUNT_3",4)))).round(2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docLines.sum("TOTALHT",2))
        this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docLines.sum("TOTALHT",2)) - parseFloat(this.docLines.sum("DOC_DISCOUNT",2))).round(2)
        this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)

        localStorage.setItem("data",JSON.stringify(this.docLines.toArray()))
    }
    async updateLine()
    {
        // LINE_NO'ya göre sırala
        this.docLines.sort((a, b) => a.LINE_NO - b.LINE_NO);

        // Sıralı listeyi güncelle
        for (let i = 0; i < this.docLines.length; i++) 
        {
            let tmpDocOrders = this.docLines[i];
            tmpDocOrders.LINE_NO = i + 1;
            this.docLines[i] = tmpDocOrders;
        }
    }  
    async checkRow()
    {
        for (let i = 0; i < this.docLines.length; i++) 
        {
            this.docLines[i].INPUT = this.docObj.dt()[0].INPUT
            this.docLines[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docLines[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
        }
    }    
    async orderSave()
    {
        if(this.docObj.dt()[0].REF_NO == 0)
        {
            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 " + (this.sysParam.filter({ID:'docNoAuto',USERS:this.user.CODE}).getValue() == false ? " AND REF = @REF " : ""),
                param : ['REF:string|25'],
                value : [this.docObj.dt()[0].REF]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
            }
            this.docObj.dt()[0].TYPE = 1 
            this.docObj.dt()[0].DOC_TYPE = 60
            for (let i = 0; i < this.docLines.length; i++) 
            {
                let tmpDocOrders = {...this.docObj.docOrders.empty}
                tmpDocOrders.DOC_GUID = this.docLines[i].DOC_GUID
                tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
                tmpDocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocOrders.LINE_NO = this.docLines[i].LINE_NO
                tmpDocOrders.REF = this.docObj.dt()[0].REF
                tmpDocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocOrders.INPUT = this.docObj.dt()[0].INPUT
                tmpDocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocOrders.ITEM_CODE = this.docLines[i].ITEM_CODE
                tmpDocOrders.ITEM = this.docLines[i].ITEM
                tmpDocOrders.ITEM_NAME = this.docLines[i].ITEM_NAME
                tmpDocOrders.VAT_RATE = this.docLines[i].VAT_RATE
                tmpDocOrders.QUANTITY = this.docLines[i].QUANTITY
                tmpDocOrders.PRICE = this.docLines[i].PRICE
                tmpDocOrders.AMOUNT = this.docLines[i].AMOUNT
                tmpDocOrders.TOTALHT = this.docLines[i].TOTALHT
                tmpDocOrders.VAT = this.docLines[i].VAT
                tmpDocOrders.TOTAL = this.docLines[i].TOTAL
                tmpDocOrders.UNIT = this.docLines[i].UNIT
                tmpDocOrders.UNIT_FACTOR = this.docLines[i].UNIT_FACTOR
                tmpDocOrders.DISCOUNT_1 = this.docLines[i].DISCOUNT_1   
                tmpDocOrders.DISCOUNT_2 = this.docLines[i].DISCOUNT_2
                tmpDocOrders.DISCOUNT_3 = this.docLines[i].DISCOUNT_3
                tmpDocOrders.DOC_DISCOUNT_1 = this.docLines[i].DOC_DISCOUNT_1
                tmpDocOrders.DOC_DISCOUNT_2 = this.docLines[i].DOC_DISCOUNT_2
                tmpDocOrders.DOC_DISCOUNT_3 = this.docLines[i].DOC_DISCOUNT_3
                tmpDocOrders.DOC_DISCOUNT = this.docLines[i].DOC_DISCOUNT   
                tmpDocOrders.DISCOUNT = this.docLines[i].DISCOUNT
                this.docObj.docOrders.addEmpty(tmpDocOrders)
            }
        }
        else
        {
            this.docObj.docOrders.datatable = this.docLines
        }

        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);

            localStorage.removeItem("data")
            if(this.sysParam.filter({ID:'autoNewOrder',USERS:this.user.CODE}).getValue() == true)
            {
                this.init()
            }
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
    }
    async factureSave()
    {
        if(this.docLocked == true)
        {
            let tmpConfObj =
            {
                id:'msgDocLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
            }
            
            await dialog(tmpConfObj);
            return
        }
        if(this.docObj.dt()[0].REF_NO == 0)
        {
            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 20  AND REBATE = 0",
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
            }
            this.docObj.dt()[0].TYPE = 1 
            this.docObj.dt()[0].DOC_TYPE = 20

            let tmpDocCustomer = {...this.docObj.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
            tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
            tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocCustomer.AMOUNT = this.docObj.dt()[0].TOTAL
            tmpDocCustomer.REF = this.docObj.dt()[0].REF
            tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocCustomer.INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docCustomer.addEmpty(tmpDocCustomer)

            for (let i = 0; i < this.docLines.length; i++) 
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docLines[i].DOC_GUID
                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocItems.LINE_NO = this.docLines[i].LINE_NO
                tmpDocItems.REF = this.docObj.dt()[0].REF
                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocItems.ITEM_CODE = this.docLines[i].ITEM_CODE
                tmpDocItems.ITEM = this.docLines[i].ITEM
                tmpDocItems.ITEM_NAME = this.docLines[i].ITEM_NAME
                tmpDocItems.VAT_RATE = this.docLines[i].VAT_RATE
                tmpDocItems.QUANTITY = this.docLines[i].QUANTITY
                tmpDocItems.PRICE = this.docLines[i].PRICE
                tmpDocItems.AMOUNT = this.docLines[i].AMOUNT
                tmpDocItems.TOTALHT = this.docLines[i].TOTALHT
                tmpDocItems.VAT = this.docLines[i].VAT
                tmpDocItems.TOTAL = this.docLines[i].TOTAL
                tmpDocItems.UNIT = this.docLines[i].UNIT
                tmpDocItems.UNIT_FACTOR = this.docLines[i].UNIT_FACTOR
                tmpDocItems.DISCOUNT_1 = this.docLines[i].DISCOUNT_1
                tmpDocItems.DISCOUNT_2 = this.docLines[i].DISCOUNT_2
                tmpDocItems.DISCOUNT_3 = this.docLines[i].DISCOUNT_3
                tmpDocItems.DOC_DISCOUNT_1 = this.docLines[i].DOC_DISCOUNT_1
                tmpDocItems.DOC_DISCOUNT_2 = this.docLines[i].DOC_DISCOUNT_2
                tmpDocItems.DOC_DISCOUNT_3 = this.docLines[i].DOC_DISCOUNT_3
                tmpDocItems.DOC_DISCOUNT = this.docLines[i].DOC_DISCOUNT
                tmpDocItems.DISCOUNT = this.docLines[i].DISCOUNT
                this.docObj.docItems.addEmpty(tmpDocItems)
            }
        }
        else
        {
            this.docObj.docItems.datatable = this.docLines
            this.docObj.docCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.TYPE = this.docObj.dt()[0].TYPE
            this.docObj.docCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            this.docObj.docCustomer.REBATE = this.docObj.dt()[0].REBATE
            this.docObj.docCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docCustomer.AMOUNT = this.docObj.dt()[0].TOTAL
            this.docObj.docCustomer.REF = this.docObj.dt()[0].REF
            this.docObj.docCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docCustomer.INPUT = this.docObj.dt()[0].INPUT
        }

        this.docObj.dt()[0].LOCKED = 1
        this.docLocked = true

        let tmpSignedData = await this.nf525.signatureDoc(this.docObj.dt()[0],this.docObj.docItems.dt())                
        this.docObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
        this.docObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM

        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);
            this.frmGrdSale.option('disabled',true)

            localStorage.removeItem("data")
            
            let tmpConfObj2 =
            {
                id:'msgCollection',showTitle:true,title:this.t("msgCollection.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCollection.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCollection.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgCollection.msg")}</div>)
            }

            let pResult = await dialog(tmpConfObj2);
            
            if(pResult == 'btn01')
            {
                App.instance.pagePrm = {GUID:this.docObj.dt()[0].GUID}
                App.instance.setState({page:'collection.js'})
            }
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
    }
    async getDoc(pGuid,pRef,pRefno,pDocType)
    {
        this.docObj.clearAll()
        this.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:pDocType});
        if(pDocType == 60)
        {
            this.docType = 60
            this.docLines = this.docObj.docOrders.dt()
            this.docLocked = false
        }
        else if(pDocType == 20)
        {
            this.docType = 20
            this.docLines = this.docObj.docItems.dt()

            if(this.docObj.dt()[0].LOCKED != 0)
            {
                this.docLocked = true
                this.frmGrdSale.option('disabled',true)
            }
            else
            {
                this.docLocked = false
                this.frmGrdSale.option('disabled',false)
            }
        }
        await this.grdSale.dataRefresh({source:this.docLines});

        this.setState({isExecute:false})
        this.itemView.setItemAll()
    }
    cordovaPrint(pdfObj,pdfData)
    {
        pdfObj.eventBus.on('print',async()=>
        {
            let pdfSave = (base64Data) =>
            {
                return new Promise((resolve, reject) => 
                {
                    let binaryData = atob(base64Data);
                    let length = binaryData.length;
                    let buffer = new ArrayBuffer(length);
                    let view = new Uint8Array(buffer);
                    for (let i = 0; i < length; i++) 
                    {
                        view[i] = binaryData.charCodeAt(i);
                    }
            
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directoryEntry) 
                    {
                        directoryEntry.getFile('pdf.pdf', { create: true }, function(fileEntry) 
                        {
                            fileEntry.createWriter(function(fileWriter) 
                            {
                                fileWriter.onwriteend = function() 
                                {
                                    resolve(fileEntry.nativeURL);
                                };
                                fileWriter.onerror = function(e) 
                                {
                                    reject(e);
                                };
            
                                var blob = new Blob([view], { type: 'application/pdf' });
                                fileWriter.write(blob);
                            }, function(error) 
                            {
                                reject(error);
                            });
                        }, function(error) 
                        {
                            reject(error);
                        });
                    });
                });
            }
            let tmpFilePath = await pdfSave(pdfData);
            cordova.plugins.printer.print(tmpFilePath);
        })
    }
    async priceListChange()
    {
        for (let i = 0; i < this.docLines.length; i++) 
        {
            if(this.docObj.dt()[0].VAT_ZERO == 1)
            {
                this.docLines[i].VAT_RATE = 0
                this.docLines[i].VAT = 0
            }
        }
        this._calculateTotal()
        
        let tmpConfObj1 =
        {
            id:'msgPriceListChange',showTitle:true,title:this.t("msgPriceListChange.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgPriceListChange.btn01"),location:'before'},{id:"btn02",caption:this.t("msgPriceListChange.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgPriceListChange.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj1);
        
        if(pResult == 'btn01')
        {
            for (let i = 0; i < this.docLines.length; i++) 
            {
                this.docLines[i].PRICE = await this.getPrice(this.docLines[i].ITEM,1,moment(new Date()).format('YYYY-MM-DD'),this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT,this.docObj.dt()[0].PRICE_LIST_NO,0,false)
                if(this.docObj.dt()[0].VAT_ZERO == 1)
                {
                    this.docLines[i].VAT_RATE = 0
                    this.docLines[i].VAT = 0
                }
                else
                {
                    this.docLines[i].VAT = parseFloat(((((this.docLines[i].PRICE * this.docLines[i].QUANTITY) - (parseFloat(this.docLines[i].DISCOUNT) + parseFloat(this.docLines[i].DOC_DISCOUNT))) * (this.docLines[i].VAT_RATE) / 100))).round(4);
                }
                this.docLines[i].AMOUNT = parseFloat((this.docLines[i].PRICE * this.docLines[i].QUANTITY).toFixed(3)).round(2)
                this.docLines[i].TOTALHT = Number((parseFloat((this.docLines[i].PRICE * this.docLines[i].QUANTITY).toFixed(3)) - (parseFloat(this.docLines[i].DISCOUNT)))).round(2)
                this.docLines[i].TOTAL = Number(((this.docLines[i].TOTALHT - this.docLines[i].DOC_DISCOUNT) + this.docLines[i].VAT)).round(2)
            }
            this._calculateTotal()
        }
    }
    async _btnGetirClick()
    {
        if(this.docObj.dt()[0].INPUT  != '')
        {
            this.customerExtreReportDt.selectCmd.value = [this.docObj.dt()[0].INPUT, localStorage.getItem('lang'), this.dtFirstDate.value, this.dtLastDate.value]
            await this.customerExtreReportDt.refresh()
        }
        else 
        {
            let tmpConfObj =
            {
                id:'msgNotCustomer',showTitle:true,title:this.t("msgNotCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgNotCustomer.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotCustomer.msg")}</div>)
            }
            await dialog(tmpConfObj);
        }
    }
    render()
    {
        return(
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                style={{backgroundColor:'#154c79'}}
                />
                <div style={{height:'50px',backgroundColor:'#bae7ea',top:'65px',position:'sticky',borderBottom:'1px solid #7f8fa6'}}>
                    <div className="row" style={{display:'flex', flexWrap:'wrap'}}>
                        <div className="col-12 col-md-1" align="left" style={{height:'45px',width:'100px',backgroundColor:'#2ecc71',paddingLeft:'20px',paddingTop:'5px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-secondary" style={{height:"100%",width:"100%",backgroundColor:'#2ecc71',color:'#fff',border:'none'}}
                            onClick={async()=>
                            {
                                for (let i = 0; i < this.docLines.length; i++) 
                                {
                                    this.docLines[i].DISCOUNT_RATE =  Number(this.docLines[i].QUANTITY * this.docLines[i].PRICE).rate2Num(this.docLines[i].DISCOUNT,3)
                                }
                                this.popCart.show()
                                
                                this.balance.clear()
                                if(this.docObj.dt()[0].INPUT != "" && this.docObj.dt()[0].INPUT != '00000000-0000-0000-0000-000000000000') 
                                {
                                    this.balance.selectCmd.value = [this.docObj.dt()[0].INPUT]
                                    await this.balance.refresh()
                                }
                            }}>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </NbButton>
                        </div>
                        
                        <div className={window.innerWidth <= 768 ? "col-12" : "col-md-2"} align="left" style={{paddingTop:'5px',margin: window.innerWidth <= 768 ? '5px 0' : '0 5px'}}>
                            <NdSelectBox simple={true} parent={this} id="orderGroup" height='fit-content' 
                            displayExpr="VALUE"                       
                            valueExpr="ID"
                            onValueChanged={(async(e)=>
                            {
                                this.getItems()
                            }).bind(this)}
                            data={{source:[{ID:"NAME",VALUE:this.t("orderGroup.Name")},{ID:"CODE",VALUE:this.t("orderGroup.Code")},{ID:"FAVORI DESC, NAME ASC",VALUE:this.t("orderGroup.Favori")},{ID:"SUB_FACTOR ASC",VALUE:this.t("orderGroup.Kilogram")}]}}
                            />
                        </div>
                        <div className={window.innerWidth <= 768 ? "col-12" : "col-md-3"} align="center" style={{paddingTop:'5px',margin: window.innerWidth <= 768 ? '5px 0' : '0 5px'}}>
                            <NdTextBox id={"txtSearch"} parent={this} simple={true} placeholder={"Search"}  onChange={this.getItems}
                             button={
                            [
                                {
                                    id:'01',
                                    icon:'find',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this.getItems()
                                    }
                                }                                                    
                            ]}
                            />
                        </div>
                        <div className={window.innerWidth <= 768 ? "col-12" : "col-md-3"} align="right" style={{paddingTop:'5px',margin: window.innerWidth <= 768 ? '5px 0' : '0 5px'}}>
                            <NdSelectBox simple={true} parent={this} id="cmbGroup" height='fit-content' 
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            value= ""
                            showClearButton={true}
                            onValueChanged={(async(e)=>
                            {
                                this.getItems()
                            }).bind(this)}
                            data={{source:{select:{query : "SELECT CODE,NAME,GUID FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                            />
                        </div>
                    </div>
                </div>               
                <div style={{marginTop: window.innerWidth < 768 ? '175px' : '75px', paddingLeft:"15px", paddingRight:"15px", paddingTop:"15px"}}>
                    <ScrollView showScrollbar={'never'} useNative={false} style= {{maxHeight: 'calc(100vh - 100px)'}}>
                        {/* Müşteri title alanı */}
                        <div className="col-12" style={{paddingLeft:'20px',paddingTop:'5px',marginBottom:'5px',textAlign:'center'}}>
                            <h4 style={{color:'#2c3e50',margin:0}}>
                                {this.docObj.dt() && this.docObj.dt().length > 0 ? this.docObj.dt()[0].INPUT_NAME || "" : ""}
                            </h4>
                        </div> 
                        <div className='row'>
                            <div className='col-12'>
                                <NbItemView id="itemView" parent={this} dt={this.docLines}  onValueChange={this.onValueChange} 
                                            defaultUnit={this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'defaultUnit'}).getValue().value} 
                                            unitLock={this.sysParam.filter({TYPE:0,USERS:this.user.CODE,ID:'unitLock'}).getValue()} 
                                            listPriceLock={this.sysParam.filter({TYPE:0,USERS:this.user.CODE,ID:'listPriceLock'}).getValue()} />
                            </div>
                        </div>
                        <div className='row'>                            
                            <div className='col-5 offset-5' style={{paddingBottom:"100px"}}>
                                <NbButton className="form-group btn btn-primary btn-block" style={{backgroundColor:'#154c79'}}
                                onClick={()=>
                                {
                                    this.loadMore()
                                }}>
                                    <i className="">{this.t("loadMore")}</i>
                                </NbButton>
                            </div>
                        </div>
                        {/* CART */}
                        <div>
                            <NbPopUp id={"popCart"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12' align={"right"}>
                                            <Toolbar>
                                                
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={async()=>
                                                    {
                                                        let tmpConfObj1 =
                                                        {
                                                            id:'msgNew',showTitle:true,title:this.t("msgNew.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgNew.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNew.btn02"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgNew.msg")}</div>)
                                                        }

                                                        let pResult = await dialog(tmpConfObj1);
                                                        
                                                        if(pResult == 'btn01')
                                                        {
                                                            localStorage.removeItem("data");
                                                            this.init()
                                                            this.popCart.hide();
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-plus fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px",background:"#69F0AE"}}
                                                    onClick={async()=>
                                                    {
                                                        console.log(this.docLines)
                                                        console.log(this.docObj.dt())
                                                        if(this.docLines.length == 0)
                                                        {
                                                            let tmpConfObj = 
                                                            {
                                                                id:'msgLineNotFound',showTitle:true,title:this.t("msgLineNotFound.title"),showCloseButton:true,width:'400px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgLineNotFound.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLineNotFound.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            return
                                                        }
                                                        if(this.docObj.dt()[0].INPUT == "")
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
                                                        if(this.docObj.dt()[0].OUTPUT == "")
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
                                                        if(this.docType == 60)
                                                        {
                                                            this.orderSave()
                                                            return;
                                                        }
                                                        else if(this.docType == 20)
                                                        {
                                                            this.factureSave()
                                                            return;
                                                        }

                                                        if(this.sysParam.filter({ID:'salesİnvoicesForFacture',USERS:this.user.CODE}).getValue().value == true)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'before'},{id:"btn03",caption:this.t("msgSave.btn03"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                                            }
                                                            
                                                            let pResult = await dialog(tmpConfObj);
                                                            if(pResult == 'btn01')
                                                            {
                                                                this.orderSave()
                                                            }
                                                            else if(pResult == 'btn02')
                                                            {
                                                                this.factureSave()
                                                            }

                                                        } else {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn03",caption:this.t("msgSave.btn03"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                                            }
                                                            
                                                            let pResult = await dialog(tmpConfObj);
                                                            if(pResult == 'btn01')
                                                            {
                                                                this.orderSave()
                                                            }
                                                        }    


                                                    }}>
                                                        <i className="fa-solid fa-floppy-disk fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={async()=>
                                                    {
                                                        let tmpQuery = 
                                                        {   
                                                            query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '15'"
                                                        }

                                                        if(this.docObj.dt()[0].DOC_TYPE != 20)
                                                        {
                                                            tmpQuery = 
                                                            {   
                                                                query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"
                                                            }
                                                        }
                                                        
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        await this.cmbDesignList.dataRefresh({source:tmpData.result.recordset});
                                                        this.popDesign.show()
                                                    }}>
                                                        <i className="fa-solid fa-print fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popDocs.show()
                                                    }}>
                                                        <i className="fa-solid fa-folder-open"></i>
                                                    </NbButton>
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
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
                                                            this.popCart.hide();
                                                            this.init(); 
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-trash fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{backgroundColor:'#f1424a',height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                        this.itemView.setItemAll()
                                                    }}>
                                                        <i className="fa-solid fa-xmark fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-12'>
                                            <Form colCount={1} > 
                                                {/* txtCustomer */}
                                                <Item>
                                                    <Label text={this.t("popCart.txtCustomer")} alignment="right" />
                                                    <NdTextBox id="txtCustomer" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.popCustomer.show()
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    selectAll={true}                           
                                                    >     
                                                    </NdTextBox>
                                                </Item>
                                                {/* cmbDepot */}
                                                <Item>
                                                    <Label text={this.t("popCart.cmbDepot")} alignment="right" />
                                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                                    displayExpr="NAME"                       
                                                    valueExpr="GUID"
                                                    value=""
                                                    searchEnabled={true}
                                                    readOnly={this.sysParam.filter({ID:'depotLock',USERS:this.user.CODE}).getValue()}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                                    >
                                                         <Validator validationGroup={"sale"}>
                                                            <RequiredRule message={this.t("validDepot")} />
                                                        </Validator> 
                                                    </NdSelectBox>
                                                </Item>
                                                {/* dtDocDate */}
                                                <Item>
                                                    <Label text={this.t("popCart.dtDocDate")} alignment="right" />
                                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    >
                                                    </NdDatePicker>
                                                </Item>
                                                {/* dtDShipmentDate */}
                                                <Item>
                                                    <Label text={this.t("popCart.dtDShipmentDate")} alignment="right" />
                                                    <NdDatePicker simple={true}  parent={this} id={"dtDShipmentDate"}
                                                    dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    >
                                                    </NdDatePicker>
                                                </Item>
                                                {/* cmbPricingList */}
                                                <Item>
                                                    <Label text={this.t("popCart.cmbPricingList")} alignment="right" />
                                                    <NdSelectBox simple={true} parent={this} id="cmbPricingList"
                                                    displayExpr="NAME"
                                                    valueExpr="NO"
                                                    value=""
                                                    dt={{data:this.docObj.dt('DOC'),field:"PRICE_LIST_NO"}} 
                                                    data={{source:{select:{query : "SELECT NO,NAME FROM ITEM_PRICE_LIST_VW_01 ORDER BY NO ASC"},sql:this.core.sql}}}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.priceListChange()
                                                    }).bind(this)}
                                                    >
                                                    </NdSelectBox>
                                                </Item>
                                                {/* txtDescription */}
                                                <Item>
                                                    <Label text={this.t("popCart.txtDescription")} alignment="right" />
                                                    <NdTextBox id="txtDescription" parent={this} simple={true} upper={true} dt={{data:this.docObj.dt('DOC'),field:"DESCRIPTION"}}
                                                    selectAll={true}                           
                                                    >     
                                                    </NdTextBox>
                                                </Item>
                                                {/* GRID */}
                                                <Item>
                                                    <NdGrid parent={this} id={"grdSale"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    headerFilter={{visible:true}}
                                                    sorting={{ mode: 'single' }}
                                                    height={'400'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    onInitialized={(e)=>
                                                    {
                                                        this.frmGrdSale = e.component
                                                    }}
                                                    onRowPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdating={async (e)=>
                                                    {
                                                    }}
                                                    onCellPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdated={async(e)=>
                                                    {
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
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscount',showTitle:true,title:this.t("msgDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                                            }
                                                        
                                                            dialog(tmpConfObj);
                                                            e.key.DISCOUNT = 0 
                                                            e.key.DISCOUNT_1 = 0
                                                            e.key.DISCOUNT_2 = 0
                                                            e.key.DISCOUNT_3 = 0
                                                            e.key.DISCOUNT_RATE = 0
                                                            return
                                                        }
                                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - (parseFloat(e.key.DISCOUNT) + parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(4);
                                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                                        e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                                        e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)                                                    
                                                        this._calculateTotal()
                                                    }}
                                                    onRowRemoved={async (e)=>
                                                    {
                                                        this._calculateTotal()
                                                        this.updateLine()
                                                    }}
                                                    onReady={async()=>
                                                    {
                                                        await this.grdSale.dataRefresh({source:this.docLines});
                                                    }}
                                                    >
                                                        <Paging defaultPageSize={10} />
                                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                                        <Scrolling mode="standart" />
                                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                        <Column dataField="LINE_NO" caption={"Line No"} width={70} dataType={'number'} defaultSortOrder="asc" visible={false}/>
                                                        <Column dataField="ITEM_NAME" caption={this.t("grdSale.clmItemName")} width={200} allowHeaderFiltering={false}/>
                                                        <Column dataField="QUANTITY" caption={this.t("grdSale.clmQuantity")} width={70} dataType={'number'} />
                                                        <Column dataField="PRICE" caption={this.t("grdSale.clmPrice")} width={70} dataType={'number'}
                                                        cellRender={(e) => {
                                                            return (
                                                                <div style={{
                                                                    color: e.value <= 0 ? '#FF0000' : 'inherit',
                                                                }}>
                                                                    {e.text}
                                                                </div>
                                                            )
                                                        }}
                                                        validationRules={[
                                                            {
                                                                type: 'required',
                                                                message: this.t("msgRequired")
                                                            },
                                                            {
                                                                type: 'numeric',
                                                                message: this.t("msgInvalidChar")
                                                            },
                                                            {
                                                                type: 'range',
                                                                min: 0.01,
                                                                message: this.t("msgInvalidPrice")
                                                            }
                                                        ]}
                                                        format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                                        <Column caption={this.t("grdSale.clmPriceAfterDiscount")} width={90} allowEditing={true} calculateCellValue={(rowData) => {
                                                            return (rowData.PRICE - (rowData.DISCOUNT / rowData.QUANTITY)).toFixed(2);
                                                        }} format={{ style: "currency", currency: "EUR", precision: 2 }} />
                                                        <Column dataField="AMOUNT" caption={this.t("grdSale.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT" caption={this.t("grdSale.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdSale.clmDiscountRate")} dataType={'number'}  format={'##0.00'} width={60} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                                        <Column dataField="VAT" caption={this.t("grdSale.clmVat")} format={'€#,##0.000'}allowEditing={false} width={75} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTALHT" caption={this.t("grdSale.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTAL" caption={this.t("grdSale.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                    </NdGrid>
                                                </Item>
                                                {/* DIP TOPLAM */}
                                                <Item>
                                                    <div className="row px-2 pt-2">
                                                        <div className="col-12">
                                                            <Form colCount={2} parent={this} id={"frmSale"}>
                                                                {/* Ara Toplam */}
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtFactNonSolde")} alignment="right" />
                                                                    <NdTextBox id="txtFactNonSolde" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.balance,field:"FACT_NON_SOLDE"}}
                                                                      button=
                                                                      {
                                                                          [
                                                                              {
                                                                                  id:'01',
                                                                                  icon:'more',
                                                                                  onClick:async ()  =>
                                                                                  {
                                                                                        {   
                                                                                            this.txtFactureNonSoldeDt.selectCmd.value = [this.docObj.dt()[0].INPUT_CODE]
                                                                                            await this.txtFactureNonSoldeDt.refresh()
                                                                                            await this.popFactNonSolde.show()
                                                                                        }                                                                       
                                                                                  }
                                                                              },
                                                                          ]
                                                                      }>
                                                                    </NdTextBox>
                                                                </Item>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtAmount")} alignment="right" />
                                                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}/>
                                                                </Item>
                                                                <Item>
                                                                    <NbButton className="form-group btn btn-primary btn-block" style={{backgroundColor:'#154c79',width:'100%'}}
                                                                            onClick={()=>
                                                                            {
                                                                                this.popCustomerExtreReport.show()
                                                                            }}>
                                                                            <i className="">{this.t("popCustomerExtre.customerExtreReport")}</i>
                                                                    </NbButton>
                                                                </Item>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:async ()  =>
                                                                                {
                                                                                    this.popDiscount.show()
                                                                                    await this.core.util.waitUntil(200)
                                                                                    if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                                                    {
                                                                                        this.txtDiscountPercent1.value  = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_1",3),3)
                                                                                        this.txtDiscountPrice1.value = this.docObj.docItems.dt().sum("DISCOUNT_1",2)
                                                                                        this.txtDiscountPercent2.value  = Number(this.docObj.dt()[0].AMOUNT-parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_1",3))).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_2",3),3)
                                                                                        this.txtDiscountPrice2.value = this.docObj.docItems.dt().sum("DISCOUNT_2",2)
                                                                                        this.txtDiscountPercent3.value  = Number(this.docObj.dt()[0].AMOUNT-(parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_1",3))+parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_2",3)))).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_3",3),3)
                                                                                        this.txtDiscountPrice3.value = this.docObj.docItems.dt().sum("DISCOUNT_3",2)
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        this.txtDiscountPercent1.value  = 0
                                                                                        this.txtDiscountPrice1.value = 0
                                                                                        this.txtDiscountPercent2.value  = 0
                                                                                        this.txtDiscountPrice2.value = 0
                                                                                        this.txtDiscountPercent3.value  = 0
                                                                                        this.txtDiscountPrice3.value = 0
                                                                                    }
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDocDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:async ()  =>
                                                                                {
                                                                                    this.popDocDiscount.show()
                                                                                    await this.core.util.waitUntil(200)
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
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem colSpan={1}/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotalHt")} alignment="right" />
                                                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}/>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtVat")} alignment="right" />
                                                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:async ()  =>
                                                                                {
                                                                                    this.vatRate.clear()
                                                                                    for (let i = 0; i < this.docLines.groupBy('VAT_RATE').length; i++) 
                                                                                    {
                                                                                        let tmpTotalHt  =  parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("TOTALHT",2))
                                                                                        let tmpVat = parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                                                        let tmpData = {"RATE":this.docLines.groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat,"TOTALHT":tmpTotalHt}
                                                                                        this.vatRate.push(tmpData)
                                                                                    }
                                                                                    await this.grdVatRate.dataRefresh({source:this.vatRate})
                                                                                    this.popVatRate.show()
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotal")} alignment="right" />
                                                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32}  dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}/>
                                                                </Item>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>
                        {/* CARI SECIMI POPUP */}
                        <div>                            
                            <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true} 
                                onHideing={(async()=>
                                {
                                    this.getItems()
                                }).bind(this)}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-10' align={"left"}>
                                            <h2 className='text-danger'>{this.t('popCustomer.title')}</h2>
                                        </div>
                                        <div className='col-2' align={"right"}>
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>                                    
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12'>
                                            <NdTextBox id="txtCustomerSearch" parent={this} simple={true} selectAll={true}
                                            onEnterKey={(async()=>
                                                {
                                                    this._customerSearch()
                                                }).bind(this)}/>
                                        </div>
                                    </div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%", backgroundColor: '#154c79'}}
                                            onClick={()=>
                                            {
                                                this._customerSearch()
                                            }}>
                                                {this.t('popCustomer.btn01')}
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%", backgroundColor: '#154c79'}}
                                            onClick={(async()=>
                                            {
                                                this.docObj.dt()[0].INPUT = this.grdCustomer.getSelectedData()[0].GUID
                                                this.docObj.dt()[0].INPUT_NAME =  this.grdCustomer.getSelectedData()[0].TITLE
                                                this.docObj.dt()[0].INPUT_CODE =  this.grdCustomer.getSelectedData()[0].CODE
                                                this.docObj.dt()[0].REF = this.grdCustomer.getSelectedData()[0].CODE
                                                this.docObj.dt()[0].PRICE_LIST_NO = this.grdCustomer.getSelectedData()[0].PRICE_LIST_NO
                                                this.docObj.dt()[0].VAT_ZERO = this.grdCustomer.getSelectedData()[0].VAT_ZERO
                                                this.balance.clear()
                                                this.balance.selectCmd.value = [this.docObj.dt()[0].INPUT]
                                                await this.balance.refresh()
                                                
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                    param : ['CUSTOMER:string|50'],
                                                    value : [this.grdCustomer.getSelectedData()[0].GUID]
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
                                                for (let i = 0; i < this.docLines.length; i++) 
                                                {
                                                    this.docLines[i].INPUT = this.grdCustomer.getSelectedData()[0].GUID
                                                }
                                                if(this.docLines.length > 0)
                                                {
                                                    this.priceListChange()
                                                }
                                                this.popCustomer.hide();
                                            }).bind(this)}>
                                                {this.t('popCustomer.btn02')}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomer"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            headerFilter={{visible:true}}
                                            selection={{mode:"single"}}
                                            height={'600'}
                                            width={'100%'}
                                            onRowClick={async(e)=>
                                            {
                                                this.docObj.dt()[0].INPUT = e.data.GUID
                                                this.docObj.dt()[0].INPUT_NAME =  e.data.TITLE
                                                this.docObj.dt()[0].INPUT_CODE =  e.data.CODE
                                                this.docObj.dt()[0].REF = e.data.CODE
                                                this.docObj.dt()[0].PRICE_LIST_NO = e.data.PRICE_LIST_NO
                                                this.docObj.dt()[0].VAT_ZERO = e.data.VAT_ZERO
                                                this.balance.clear()
                                                this.balance.selectCmd.value = [this.docObj.dt()[0].INPUT]
                                                await this.balance.refresh()
                                                
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                    param : ['CUSTOMER:string|50'],
                                                    value : [e.data.GUID]
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
                                                for (let i = 0; i < this.docLines.length; i++) 
                                                {
                                                    this.docLines[i].INPUT = e.data.GUID
                                                }
                                                if(this.docLines.length > 0)
                                                {
                                                    this.priceListChange()
                                                }
                                                this.popCustomer.hide();
                                            }}
                                            >
                                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                                <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={130}/>
                                                <Column dataField="TITLE" caption={this.t("popCustomer.clmName")} width={400}/>
                                                <Column dataField="ADRESS" caption={this.t("popCustomer.clmAdress")} width={400}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>     
                        {/* EVRAK SECIMI POPUP */}
                        <div>                            
                            <NbPopUp id={"popDocs"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-10' align={"left"}>
                                            <h2 className='text-danger'>{this.t('popDocs.title')}</h2>
                                        </div>
                                        <div className='col-2' align={"right"}>
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popDocs.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>   
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className="col-4" align="right" style={{paddingRight:'25px',paddingTop:'5px'}}>
                                            <NdSelectBox simple={true} parent={this} id="cmbDocType" notRefresh = {true}
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            value={60}
                                            searchEnabled={true}
                                            onValueChanged={(async()=>
                                                {
                                                }).bind(this)}
                                            data={{source:[{ID:60,VALUE:this.t("cmbDocType.order")},{ID:20,VALUE:this.t("cmbDocType.invoice")}]}}
                                            >
                                            </NdSelectBox>
                                        </div>           
                                    </div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={()=>
                                            {
                                                if(this.cmbDocType.value == 60)
                                                {
                                                    this._getOrders()
                                                }
                                                else
                                                {
                                                    this._getInvoices()
                                                }
                                            }}>
                                                {this.t('popDocs.btn01')}
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={(async()=>
                                            {
                                               this.getDoc(this.grdDocs.getSelectedData()[0].GUID,this.grdDocs.getSelectedData()[0].REF,this.grdDocs.getSelectedData()[0].REF_NO,this.cmbDocType.value)
                                               this.popDocs.hide()
                                            }).bind(this)}>
                                                {this.t('popDocs.btn02')}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdDocs"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            headerFilter={{visible:true}}
                                            selection={{mode:"single"}}
                                            height={'400'}
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={10} />
                                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                <Scrolling mode="standart" />
                                                <Column dataField="REF" caption={this.t("grdDocs.clmRef")} width={150}/>
                                                <Column dataField="REF_NO" caption={this.t("grdDocs.clmRefNo")} width={100}/>
                                                <Column dataField="INPUT_NAME" caption={this.t("grdDocs.clmInputName")} width={250}/>
                                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdDocs.clmDate")} width={150}/>
                                                <Column dataField="TOTAL" caption={this.t("grdDocs.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div> 
                        {/* KDV POPUP */}
                        <div>
                            <NdPopUp parent={this} id={"popVatRate"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popVatRate.title")}
                            container={"#root"} 
                            width={'500'}
                            height={'250'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item >
                                        <NdGrid parent={this} id={"grdVatRate"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'100%'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowRemoved={async (e)=>{
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="RATE" caption={this.t("grdVatRate.clmRate")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                            <Column dataField="VAT" caption={this.t("grdVatRate.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                            <Column dataField="TOTALHT" caption={this.t("grdVatRate.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                        </NdGrid>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnVatToZero")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {       
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgVatDelete.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                    }
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        for (let i = 0; i < this.docLines.length; i++) 
                                                        {
                                                            this.docLines[i].VAT = 0  
                                                            this.docLines[i].VAT_RATE = 0
                                                            this.docLines[i].TOTAL = (this.docLines[i].PRICE * this.docLines[i].QUANTITY) - (this.docLines[i].DISCOUNT + this.docLines[i].DOC_DISCOUNT)
                                                            this._calculateTotal()
                                                        }
                                                        this.popVatRate.hide()
                                                    }
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popVatRate.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>    
                        {/* İNDİRİM POPUP */}
                        <div>
                            <NbPopUp parent={this} id={"popDiscount"} 
                            centered={true}
                            title={this.t("popDiscount.title")}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent1")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent1" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if(this.txtDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDiscountPercent1.value = 0;
                                                            this.txtDiscountPrice1.value = 0;
                                                            return
                                                        }
                                                        this.txtDiscountPrice1.value =  Number(this.docObj.dt()[0].AMOUNT).rateInc(this.txtDiscountPercent1.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price1")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice1" parent={this} simple={true}
                                        maxLength={32}
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDiscountPrice1.value > this.docObj.dt()[0].AMOUNT)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDiscountPercent1.value = 0;
                                                this.txtDiscountPrice1.value = 0;
                                                return
                                            }
                                            this.txtDiscountPercent1.value = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.txtDiscountPrice1.value)
                                        }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent2")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent2" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDiscountPercent2.value = 0;
                                                            this.txtDiscountPrice2.value = 0;
                                                            return
                                                        }
                                                        this.txtDiscountPrice2.value =  Number(this.docObj.dt()[0].AMOUNT - Number(this.txtDiscountPrice1.value)).rateInc(this.txtDiscountPercent2.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price2")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice2" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice2.value > this.docObj.dt()[0].AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent2.value = 0;
                                                        this.txtDiscountPrice2.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPercent2.value = Number(this.docObj.dt()[0].AMOUNT - Number(this.txtDiscountPrice1.value)).rate2Num(this.txtDiscountPrice2.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent3")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent3" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPercent1.value > 100)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent3.value = 0;
                                                        this.txtDiscountPrice3.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPrice3.value = Number(this.docObj.dt()[0].AMOUNT - (Number(this.txtDiscountPrice1.value) + Number(this.txtDiscountPrice2.value))).rateInc(this.txtDiscountPercent3.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price3")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice3" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                            {
                                                if( this.txtDiscountPrice3.value > this.docObj.dt()[0].AMOUNT)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    this.txtDiscountPercent3.value = 0;
                                                    this.txtDiscountPrice3.value = 0;
                                                    return
                                                }
                                                this.txtDiscountPercent3.value = Number(this.docObj.dt()[0].AMOUNT - (Number(this.txtDiscountPrice1.value) + Number(this.txtDiscountPrice2.value))).rate2Num(this.txtDiscountPrice3.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.chkFirstDiscount")} alignment="right" />
                                        <NdCheckBox id="chkFirstDiscount" parent={this} simple={true}  
                                        value ={false}
                                        >
                                        </NdCheckBox>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {           
                                                    for (let i = 0; i < this.docLines.length; i++) 
                                                    {
                                                        let tmpDocData = this.docLines[i]
                                                        if(this.chkFirstDiscount.value == false)
                                                        {
                                                            tmpDocData.DISCOUNT_1 = Number(tmpDocData.PRICE * tmpDocData.QUANTITY).rateInc(this.txtDiscountPercent1.value,4)
                                                        }
                                                        tmpDocData.DISCOUNT_2 = Number(((tmpDocData.PRICE * tmpDocData.QUANTITY) - tmpDocData.DISCOUNT_1)).rateInc(this.txtDiscountPercent2.value,4)

                                                        tmpDocData.DISCOUNT_3 =  Number(((tmpDocData.PRICE * tmpDocData.QUANTITY)-(tmpDocData.DISCOUNT_1+tmpDocData.DISCOUNT_2))).rateInc(this.txtDiscountPercent3.value,4)
                                                        
                                                        tmpDocData.DISCOUNT = parseFloat((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3)).round(2)
                                                        tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                        tmpDocData.TOTALHT = parseFloat((Number((tmpDocData.PRICE * tmpDocData.QUANTITY)) - parseFloat(Number(tmpDocData.DISCOUNT_1) + Number(tmpDocData.DISCOUNT_2) + Number(tmpDocData.DISCOUNT_3)).round(4))).round(2)
                                                        
                                                        if(tmpDocData.VAT > 0)
                                                        {
                                                            tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(4))
                                                        }
                                                        tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                        tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                    }
                                                    this._calculateTotal()
                                                    this.popDiscount.hide(); 
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popDiscount.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NbPopUp>
                        </div> 
                        {/* EVRAK İNDİRİM POPUP */}
                        <div>
                            <NbPopUp parent={this} id={"popDocDiscount"} 
                            centered={true}
                            title={this.t("popDocDiscount.title")}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent1")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent1" parent={this} simple={true}
                                                maxLength={32}
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
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price1")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice1" parent={this} simple={true}
                                            maxLength={32}
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
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent2")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent2" parent={this} simple={true}
                                                maxLength={32}
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
                                                        this.txtDocDiscountPercent2.value = 0;
                                                        this.txtDocDiscountPrice2.value = 0;
                                                        return
                                                    }
                                                    this.txtDocDiscountPrice2.value =  Number(this.docObj.dt()[0].SUBTOTAL - Number(this.txtDocDiscountPrice1.value)).rateInc(this.txtDocDiscountPercent2.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price2")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice2" parent={this} simple={true}
                                            maxLength={32}
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
                                                this.txtDocDiscountPercent2.value = Number(this.docObj.dt()[0].SUBTOTAL - Number(this.txtDocDiscountPrice1.value)).rate2Num(this.txtDocDiscountPrice2.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent3")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent3" parent={this} simple={true}
                                                maxLength={32}
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
                                                        this.txtDocDiscountPercent3.value = 0;
                                                        this.txtDocDiscountPrice3.value = 0;
                                                        return
                                                    }
                                                    this.txtDocDiscountPrice3.value = Number(this.docObj.dt()[0].SUBTOTAL - (Number(this.txtDocDiscountPrice1.value) + Number(this.txtDocDiscountPrice2.value))).rateInc(this.txtDocDiscountPercent3.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price3")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice3" parent={this} simple={true}
                                            maxLength={32}
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
                                                this.txtDocDiscountPercent3.value = Number(this.docObj.dt()[0].SUBTOTAL - (Number(this.txtDocDiscountPrice1.value) + Number(this.txtDocDiscountPrice2.value))).rate2Num(this.txtDocDiscountPrice3.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {
                                                    for (let i = 0; i < this.docLines.length; i++) 
                                                    {
                                                        let tmpDocData = this.docLines[i]
                                                        
                                                        tmpDocData.DOC_DISCOUNT_1 = Number(tmpDocData.TOTALHT).rateInc(this.txtDocDiscountPercent1.value,4)
                                                        tmpDocData.DOC_DISCOUNT_2 = Number(((tmpDocData.TOTALHT) - tmpDocData.DOC_DISCOUNT_1)).rateInc(this.txtDocDiscountPercent2.value,4)

                                                        tmpDocData.DOC_DISCOUNT_3 =  Number(((tmpDocData.TOTALHT)-(tmpDocData.DOC_DISCOUNT_1+tmpDocData.DOC_DISCOUNT_2))).rateInc(this.txtDocDiscountPercent3.value,4)
                                
                                                        tmpDocData.DOC_DISCOUNT = parseFloat((tmpDocData.DOC_DISCOUNT_1 + tmpDocData.DOC_DISCOUNT_2 + tmpDocData.DOC_DISCOUNT_3).toFixed(4))
                                                        tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                        
                                                        if(tmpDocData.VAT > 0)
                                                        {
                                                            tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(4))
                                                        }
                                                        tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                        tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                    }
                                                    this._calculateTotal()
                                                    this.popDocDiscount.hide(); 
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popDocDiscount.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NbPopUp>
                        </div>
                        {/* DIZAYN SECIM POPUP */}
                        <div>
                            <NdPopUp parent={this} id={"popDesign"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popDesign.title")}
                            container={"#root"} 
                            width={'500'}
                            height={'280'}
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
                                        //data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '15'"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmSalesInvPrint" + this.tabIndex}>
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
                                        onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                        data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                        >
                                            <Validator validationGroup={"frmSalesInvPrint" + this.tabIndex}>
                                                <RequiredRule message={this.t("validDesign")} />
                                            </Validator> 
                                        </NdSelectBox>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("popDesign.btnPrint")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSalesInvPrint" + this.tabIndex}
                                                    onClick={async (e)=>
                                                    {       
                                                        if(e.validationGroup.validate().status == "valid")
                                                        {
                                                            this.setState({isExecute:true})
                                                            let tmpQuery = {}
                                                            if(this.docObj.dt()[0].DOC_TYPE == 20)
                                                            {
                                                                let tmpLastSignature = await this.nf525.signatureDocDuplicate(this.docObj.dt()[0])
                                                                let tmpExtra = {...this.extraObj.empty}
                                                                tmpExtra.DOC = this.docObj.dt()[0].GUID
                                                                tmpExtra.DESCRIPTION = ''
                                                                tmpExtra.TAG = 'PRINT'
                                                                tmpExtra.SIGNATURE = tmpLastSignature.SIGNATURE
                                                                tmpExtra.SIGNATURE_SUM = tmpLastSignature.SIGNATURE_SUM
                                                                this.extraObj.addEmpty(tmpExtra);
                                                                await this.extraObj.save()

                                                                tmpQuery = 
                                                                {
                                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO" ,
                                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                                }
                                                            }
                                                            else
                                                            {
                                                                tmpQuery = 
                                                                {
                                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO" ,
                                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                                }
                                                            }                                                       
                                                            let tmpData = await this.core.sql.execute(tmpQuery)                                                                                                               
                                                            //console.log(tmpData.result.recordset) // BAK
                                                            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async(pResult) => 
                                                            {
                                                                if(pResult.split('|')[0] != 'ERR')
                                                                {     
                                                                    let base64ToUint8Array = (base64)=>
                                                                    {
                                                                        let raw = atob(base64);
                                                                        let uint8Array = new Uint8Array(raw.length);
                                                                        for (let i = 0; i < raw.length; i++) 
                                                                        {
                                                                            uint8Array[i] = raw.charCodeAt(i);
                                                                        }
                                                                        return uint8Array;
                                                                    }

                                                                    this.popPrintView.show()

                                                                    document.getElementById('printView').innerHTML = '<iframe id="pdfFrame" style="width:100%;height:100%;"></iframe>'
                                                                    let pdfViewerFrame = document.getElementById("pdfFrame");
                                                                    let tmpBase64 = base64ToUint8Array(pResult.split('|')[1])

                                                                    pdfViewerFrame.onload = (async function() 
                                                                    {
                                                                        await pdfViewerFrame.contentWindow.PDFViewerApplication.open(tmpBase64);
                                                                        if(App.instance.core.local.platform == 'cordova')
                                                                        {
                                                                            this.cordovaPrint(pdfViewerFrame.contentWindow.PDFViewerApplication,pResult.split('|')[1])
                                                                        }
                                                                    }).bind(this)
                                                                    pdfViewerFrame.setAttribute("src","./lib/pdf/web/viewer.html?file=");
                                                                }
                                                            });
                                                            this.popDesign.hide();  
                                                        }
                                                    }}/>
                                            </div>
                                        </div>
                                        <div className='row py-2'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popDesign.btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSalesInvPrint" + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    await this.popMailSend.show()
                                                    await this.popFactNonSolde.hide()
                                                    
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0",
                                                        param:  ['GUID:string|50'],
                                                        value:  [this.docObj.dt()[0].INPUT]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    { 
                                                        this.popDesign.hide()
                                                        this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                    }
                                                }
                                            }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("popDesign.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                        {/* Mail Send PopUp */}
                        <div>
                            <NbPopUp parent={this} id={"popMailSend"} 
                            centered={true}
                            title={this.t("popMailSend.title")}
                            container={"#root"} 
                            width={'600'}
                            height={'600'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbMailAddress" notRefresh = {true}
                                        displayExpr="MAIL_ADDRESS"                       
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        data={{source:{select:{query : "SELECT * FROM MAIL_SETTINGS "},sql:this.core.sql}}}
                                        >
                                            <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                                <RequiredRule message={this.t("validMail")} />
                                            </Validator> 
                                        </NdSelectBox>
                                    </Item>
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
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                                validationGroup={"frmMailsend"  + this.tabIndex}
                                                onClick={async (e)=>
                                                {       
                                                    if(e.validationGroup.validate().status == "valid")
                                                    {
                                                        this.setState({isExecute:true})
                                                        let tmpLines = []
                                                        let tmpLastSignature = await this.nf525.signatureDocDuplicate(this.docObj.dt()[0])
                                                        let tmpExtra = {...this.extraObj.empty}
                                                        tmpExtra.DOC = this.docObj.dt()[0].GUID
                                                        tmpExtra.DESCRIPTION = ''
                                                        tmpExtra.TAG = 'PRINT'
                                                        tmpExtra.SIGNATURE = tmpLastSignature.SIGNATURE
                                                        tmpExtra.SIGNATURE_SUM = tmpLastSignature.SIGNATURE_SUM
                                                        this.extraObj.addEmpty(tmpExtra);
                                                        await this.extraObj.save()    
                                                        for (let i = 0; i < this.grdFactNonSolde.getSelectedData().length; i++) 
                                                            {
                                                                let tmpQuery = 
                                                                {
                                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
                                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                                    value:  [this.grdFactNonSolde.getSelectedData()[i].DOC_GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
                                                                }
                                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                                for (let x = 0; x < tmpData.result.recordset.length; x++) 
                                                                {
                                                                    tmpLines.push(tmpData.result.recordset[x])
                                                                }
                                                            }
                                                        if(tmpLines.length > 0)
                                                        {
                                                            await this.popMailSend.show()
                                                            let tmpQuery = 
                                                            {
                                                                query :"SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0",
                                                                param:  ['GUID:string|50'],
                                                                value:  [tmpLines[0].INPUT]
                                                            }
                                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        }
                                                        //console.log(JSON.stringify(tmpData.result.recordset)) // BAK
                                                        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' +  tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) => 
                                                        {
                                                            this.setState({isExecute:true}) 
                                                            let tmpAttach = pResult.split('|')[1]
                                                            let tmpHtml = ''
                                                           
                                                            if(pResult.split('|')[0] != 'ERR')
                                                            {
                                                            }
                                                            let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:" "+ this.docObj.dt()[0].REF + "-" + this.docObj.dt()[0].REF_NO + ".pdf",attachData:tmpAttach,text:"",mailGuid:this.cmbMailAddress.value}
                                                            this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                            {
                                                                this.setState({isExecute:false})      
                                                                let tmpConfObj1 =
                                                                {
                                                                    id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                                }
                                                                
                                                                if((pResult1) == 0)
                                                                {  
                                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgMailSendResult.msgSuccess")}</div>)
                                                                    await dialog(tmpConfObj1);
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
                                                <NdButton text={this.t("popMailSend.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popMailSend.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NbPopUp>
                        </div>
                        {/* PRINTVIEW POPUP */}
                        <div>
                            <NbPopUp id={"popPrintView"} parent={this} title={""} fullscreen={true}>
                                <div className='row' style={{paddingTop:"10px",paddingBottom:"10px"}}>
                                    <div className='col-12' align={"right"}>
                                        <Toolbar>
                                            <Item location="after" locateInMenu="auto">
                                                <NbButton className="form-group btn btn-block btn-outline-dark" style={{backgroundColor:'#f1424a',height:"40px",width:"40px"}}
                                                onClick={()=>
                                                {
                                                    this.popPrintView.hide();
                                                }}>
                                                    <i className="fa-solid fa-xmark fa-1x"></i>
                                                </NbButton>
                                            </Item>
                                        </Toolbar>
                                    </div>
                                </div>
                                <div id={"printView"}></div>
                            </NbPopUp>
                        </div>
                          {/* Adres Seçim PopUp */}
                        <div>
                            <NdPopGrid id={"pg_adress"} showCloseButton={false} parent={this} container={"#root"}
                            visible={false}
                            position={{of:'#root'}} 
                            showTitle={true} 
                            showBorders={true}
                            width={'90%'}
                            height={'90%'}
                            title={this.t("pg_adress.title")} //
                            deferRendering={true}
                            >
                                <Column dataField="ADRESS" caption={this.t("pg_adress.clmAdress")} width={250} />
                                <Column dataField="CITY" caption={this.t("pg_adress.clmCity")} width={150} />
                                <Column dataField="ZIPCODE" caption={this.t("pg_adress.clmZipcode")} width={300} defaultSortOrder="asc" />
                                <Column dataField="COUNTRY" caption={this.t("pg_adress.clmCountry")} width={200}/>
                            </NdPopGrid>
                        </div>
                           {/* Adres Seçim PopUp */}
                           <div>
                            <NdPopUp parent={this} id={"popFactNonSolde"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popFactNonSolde")}
                            container={"#root"} 
                            width={'600'}
                            height={'650'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>                                
                                <Item>
                                        <NdButton text={this.t("btnMailSend")} type="danger" width="100%" stylingMode="contained"
                                                  onClick={async ()=>{
                                                        let tmpQuery = 
                                                        {   
                                                            query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '115'"
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        await this.cmbDesignList.dataRefresh({source:tmpData.result.recordset});
                                                        this.popDesign.show()
                                                  }}  
                                        ></NdButton>
                                    </Item>
                                <Item >
                                <NdGrid parent={this} id={"grdFactNonSolde"}    
                                        selection= {{mode : 'multiple'}} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'100%'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowDblClick={async(e)=>
                                            {
                                                this.setState({isExecute:true})
                                                
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [e.data.DOC_GUID,this.cmbDesignList.value,localStorage.getItem('lang').toUpperCase()]
                                                }
                                                this.setState({isExecute:true})                                                        
                                                let tmpData = await this.core.sql.execute(tmpQuery)                                                         
                                                this.setState({isExecute:false})
                                                this.popFactNonSolde.hide(); 
                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async(pResult) => 
                                                    {
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {     
                                                            let base64ToUint8Array = (base64)=>
                                                            {
                                                                let raw = atob(base64);
                                                                let uint8Array = new Uint8Array(raw.length);
                                                                for (let i = 0; i < raw.length; i++) 
                                                                {
                                                                    uint8Array[i] = raw.charCodeAt(i);
                                                                }
                                                                return uint8Array;
                                                            }

                                                            this.popPrintView.show()

                                                            document.getElementById('printView').innerHTML = '<iframe id="pdfFrame" style="width:100%;height:100%;"></iframe>'
                                                            let pdfViewerFrame = document.getElementById("pdfFrame");
                                                            let tmpBase64 = base64ToUint8Array(pResult.split('|')[1])

                                                            pdfViewerFrame.onload = (async function() 
                                                            {
                                                                await pdfViewerFrame.contentWindow.PDFViewerApplication.open(tmpBase64);
                                                                if(App.instance.core.local.platform == 'cordova')
                                                                {
                                                                    this.cordovaPrint(pdfViewerFrame.contentWindow.PDFViewerApplication,pResult.split('|')[1])
                                                                }
                                                            }).bind(this)
                                                            pdfViewerFrame.setAttribute("src","./lib/pdf/web/viewer.html?file=");
                                                        }
                                                    });
                                            }}
                                        onRowRemoved={async (e)=>{
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="DOC_DATE" caption={this.t("grdFactNonSolde.clmDocDate")} defaultSortOrder="asc" dataType="date"  />
                                            <Column dataField="DOC_REF_NO" caption={this.t("grdFactNonSolde.clmRefNo")}  />
                                            <Column dataField="REMAINDER" caption={this.t("grdFactNonSolde.clmRemainder")} format={{ style: "currency", currency: "EUR",precision: 2}} />
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </NdPopUp>
                            <NdPopUp parent={this} id={"popCustomerExtreReport" } 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popCustomerExtreReport")}
                            container={"#root"} 
                            width={'600'}
                            height={'650'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <NdDatePicker simple={true}  parent={this} id={"dtFirstDate"} pickerType={"rollers"} />
                                    </Item>
                                    <Item>
                                        <NdDatePicker simple={true}  parent={this} id={"dtLastDate"} pickerType={"rollers"} />
                                    </Item>
                                    <Item>
                                        <NdButton text={this.t("btnGet")} type="success" width="50%" onClick={this._btnGetirClick} stylingMode="contained" ></NdButton>
                                    </Item>
                                    <Item >
                                        <NdGrid id="grdCustomerExtreReport" parent={this} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'100%'} 
                                        width={'100%'}
                                        dbApply={false}
                                        clearOnRefresh={true}
                                        onRowDblClick={async(e)=>
                                        {
                                            this.setState({isExecute:true})
                                            
                                            let tmpQuery = 
                                            {
                                                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
                                                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                value:  [e.data.DOC_GUID,'33',localStorage.getItem('lang').toUpperCase()]
                                            }
                                            this.setState({isExecute:true})                                                        
                                            let tmpData = await this.core.sql.execute(tmpQuery)  
                                            
                                            this.setState({isExecute:false})
                                            this.popCustomerExtreReport.hide(); 
                                            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',async(pResult) => 
                                            {
                                                if(pResult.split('|')[0] != 'ERR')
                                                {     
                                                    let base64ToUint8Array = (base64)=>
                                                    {
                                                        let raw = atob(base64);
                                                        let uint8Array = new Uint8Array(raw.length);
                                                        for (let i = 0; i < raw.length; i++) 
                                                        {
                                                            uint8Array[i] = raw.charCodeAt(i);
                                                        }
                                                        return uint8Array;
                                                    }

                                                    this.popPrintView.show()

                                                    document.getElementById('printView').innerHTML = '<iframe id="pdfFrame" style="width:100%;height:100%;"></iframe>'
                                                    let pdfViewerFrame = document.getElementById("pdfFrame");
                                                    let tmpBase64 = base64ToUint8Array(pResult.split('|')[1])

                                                    pdfViewerFrame.onload = (async function() 
                                                    {
                                                        await pdfViewerFrame.contentWindow.PDFViewerApplication.open(tmpBase64);
                                                        if(App.instance.core.local.platform == 'cordova')
                                                        {
                                                            this.cordovaPrint(pdfViewerFrame.contentWindow.PDFViewerApplication,pResult.split('|')[1])
                                                        }
                                                    }).bind(this)
                                                    pdfViewerFrame.setAttribute("src","./lib/pdf/web/viewer.html?file=");
                                                }
                                            });
                                        }}
                                        >
                                            <Paging defaultPageSize={20} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                            <Column dataField="DOC_DATE" caption={this.t("grdCustomerExtreReport.clmDocDate")} visible={true} dataType="date" 
                                            editorOptions={{value:null}}
                                            cellRender={(e) => 
                                            {
                                                if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                {
                                                    return e.text
                                                }
                                                
                                                return
                                            }}/>
                                            <Column dataField="TYPE_NAME" caption={this.t("grdCustomerExtreReport.clmTypeName")} visible={true}/> 
                                            <Column dataField="REF" caption={this.t("grdCustomerExtreReport.clmRef")} visible={true}/> 
                                            <Column dataField="REF_NO" caption={this.t("grdCustomerExtreReport.clmRefNo")} visible={true}/> 
                                            <Column dataField="DEBIT" caption={this.t("grdCustomerExtreReport.clmDebit")}  visible={true}
                                            cellRender={(e) => {
                                                return e.value ? e.text : ' ';
                                            }}/> 
                                            <Column dataField="RECEIVE" caption={this.t("grdCustomerExtreReport.clmReceive")} visible={true} 
                                            cellRender={(e) => {
                                                return e.value ? e.text : ' ';
                                            }}/> 
                                            <Column dataField="BALANCE" caption={this.t("grdCustomerExtreReport.clmBalance")} visible={true}/>
                                            <Summary>
                                                <TotalItem
                                                column="DEBIT"
                                                summaryType="sum" />
                                                <TotalItem
                                                column="RECEIVE"
                                                summaryType="sum" />
                                            </Summary> 
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>
                          
                        {/* PRINTVIEW POPUP */}
                        {/* <div>
                            <NbPopUp id={"popCriter"} parent={this} title={"jtjtyhtyh"} fullscreen={false} width={'300'} centered={true}
                            height={'250'}>
                                <div>
                                    <Form>                                    
                                        <Item>
                                            <NdCheckBox text="grg" id="chkMostSales" parent={this} simple={true}  
                                            value={this.state.checkboxValue}
                                            onValueChanged={this.handleCheckboxChange}/>
                                        </Item>
                                    </Form>
                                </div>
                            </NbPopUp>
                        </div> */}
                    </ScrollView>
                </div>
            </div>
        )
    }
}
