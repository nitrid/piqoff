import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import { Button } from 'devextreme-react/button';

import NbButton from '../../core/react/bootstrap/button.js';
import NdTextBox,{ Validator, NumericRule, RequiredRule, CompareRule,RangeRule } from '../../core/react/devex/textbox.js'
import NdNumberBox from '../../core/react/devex/numberbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js'
import NdButton from '../../core/react/devex/button.js'
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NbPopUp from '../../core/react/bootstrap/popup.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import { LoadPanel } from 'devextreme-react/load-panel';
import { docCls,docOrdersCls, docCustomerCls,docExtraCls }from '../../core/cls/doc.js';
import NdGrid,{Column,Editing, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem}from '../../core/react/devex/grid.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';


export default class extract extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"collection")
        this.lang = App.instance.lang;
        this.docObj = new docCls();

        this.state = 
        {
            isExecute : false
        }

        this._customerSearch = this._customerSearch.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        setTimeout(async () => 
        {
            if(App.instance.pagePrm != null)
            {
                this.getFactTotal(App.instance.pagePrm.GUID)
                App.instance.pagePrm = null
            }
            else
            {
                this.init()
            }
        }, 500);
    }
    async init()
    {
        this.docObj.clearAll()
    
        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 200
        tmpDoc.INPUT = '00000000-0000-0000-0000-000000000000'
        this.docObj.addEmpty(tmpDoc);
    }
    async maxRefNo(pRef)
    {
        let tmpQuery = 
        {
            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 200 AND REF = @REF ",
            param : ['REF:string|25'],
            value : [pRef]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }
      
    }
    async getFactTotal(pGuid)
    {

        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS,TOTAL - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 WHERE DOC_CUSTOMER_VW_01.INVOICE_GUID = DOC_VW_01.GUID),0) AS REMAINING FROM DOC_VW_01 WHERE GUID = @DOC AND DOC_TYPE IN(20,21) AND TYPE = 1 AND  " + 
            "TOTAL - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 WHERE DOC_CUSTOMER_VW_01.INVOICE_GUID = DOC_VW_01.GUID),0) > 0 ",
            param : ['DOC:string|50'],
            value : [pGuid]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            this.invoices = tmpData.result.recordset
            this.numCash.value = tmpData.result.recordset[0].REMAINING
            let tmpDoc = {...this.docObj.empty}
            tmpDoc.TYPE = 0
            tmpDoc.DOC_TYPE = 200
            tmpDoc.INPUT = '00000000-0000-0000-0000-000000000000'
            tmpDoc.REF = tmpData.result.recordset[0].INPUT_CODE
            tmpDoc.OUTPUT = tmpData.result.recordset[0].INPUT
            tmpDoc.OUTPUT_NAME = tmpData.result.recordset[0].INPUT_NAME
            tmpDoc.OUTPUT_CODE = tmpData.result.recordset[0].INPUT_CODE

            this.docObj.addEmpty(tmpDoc);
            this.maxRefNo(tmpData.result.recordset[0].INPUT_CODE)
        }
        this.popCash.show()
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
                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_02 WHERE (UPPER(CODE) LIKE UPPER('%' + @VAL + '%') OR UPPER(TITLE) LIKE UPPER('%' + @VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtCustomerSearch.value]
                },
                sql : this.core.sql
            }
        }
        this.setState({isExecute:true})
        await this.grdCustomer.dataRefresh(tmpSource)
        this.setState({isExecute:false})
    }
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docCustomer.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docCustomer.dt().sum("AMOUNT",2)
    }
    async getInvoices()
    {
        this.invoices = []
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS,TOTAL - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 WHERE DOC_CUSTOMER_VW_01.INVOICE_GUID = DOC_VW_01.GUID),0) AS REMAINING FROM DOC_VW_01 WHERE INPUT = @OUTPUT AND DOC_TYPE IN(20,21) AND TYPE = 1 AND  " + 
            "TOTAL - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 WHERE DOC_CUSTOMER_VW_01.INVOICE_GUID = DOC_VW_01.GUID),0) > 0 ",
            param : ['OUTPUT:string|50'],
            value : [this.docObj.dt()[0].OUTPUT]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_invoices.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_invoices.setData([])
        }

        this.pg_invoices.show()
        this.pg_invoices.onClick = async(data) =>
        {
            this.invoices = data
            let tmpTotal = 0
            for (let i = 0; i < data.length; i++) 
            {
                tmpTotal = tmpTotal + data[i].REMAINING
            }
            this.numCash.value = parseFloat(tmpTotal.toFixed(2))
        }
    }
    async _addPayment(pType,pAmount)
    {
        if(this.invoices.length > 0)
        {
            let tmpAmount  = pAmount
            for (let i = 0; i < this.invoices.length; i++) 
            {
                if(tmpAmount >= this.invoices[i].REMAINING)
                {
                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocCustomer.REF = this.docObj.dt()[0].REF
                    tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocCustomer.INVOICE_GUID = this.invoices[i].GUID 
                    tmpDocCustomer.INVOICE_REF = this.invoices[i].REFERANS 
                    tmpDocCustomer.INVOICE_DATE = this.invoices[i].DOC_DATE 
                    if(pType == 0)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 0
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    else if (pType == 1)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 1
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
        
                        let tmpCheck = {...this.docObj.checkCls.empty}
                        tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpCheck.REF = this.checkReference.value
                        tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CUSTOMER =   this.docObj.dt()[0].INPUT
                        tmpCheck.AMOUNT =  this.invoices[i].REMAINING
                        tmpCheck.SAFE =  this.cmbCashSafe.value
                        this.docObj.checkCls.addEmpty(tmpCheck)
                    }
                    else if (pType == 2)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 2
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                    this._calculateTotal()
                    tmpAmount = parseFloat((tmpAmount - this.invoices[i].REMAINING).toFixed(2))
                }
                else if(tmpAmount < this.invoices[i].REMAINING && tmpAmount != 0)
                {
                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocCustomer.REF = this.docObj.dt()[0].REF
                    tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocCustomer.INVOICE_GUID = this.invoices[i].GUID  
                    tmpDocCustomer.INVOICE_REF = this.invoices[i].REFERANS 

                    if(pType == 0)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 0
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    else if (pType == 1)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 1
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
        
                        let tmpCheck = {...this.docObj.checkCls.empty}
                        tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpCheck.REF = this.checkReference.value
                        tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                        tmpCheck.AMOUNT =  tmpAmount
                        tmpCheck.SAFE =  this.cmbCashSafe.value
                        this.docObj.checkCls.addEmpty(tmpCheck)
                    }
                    else if (pType == 2)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 2
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                    this._calculateTotal()
                    tmpAmount = 0
                }
            }


            if(tmpAmount > 0)
            {
                let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                tmpDocCustomer.REF = this.docObj.dt()[0].REF
                tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                
                if(pType == 0)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 0
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                }
                else if (pType == 1)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 1
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
    
                    let tmpCheck = {...this.docObj.checkCls.empty}
                    tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpCheck.REF = this.checkReference.value
                    tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                    tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                    tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                    tmpCheck.AMOUNT =  tmpAmount
                    tmpCheck.SAFE =  this.cmbCashSafe.value
                    this.docObj.checkCls.addEmpty(tmpCheck)
                }
                else if (pType == 2)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 2
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                }

                this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                this._calculateTotal()
            }
        }
        else
        {
            if(this.sysParam.filter({ID:'invoicesForPayment',USERS:this.user.CODE}).getValue().value == true)
            {
                let tmpConfObj =
                {
                    id:'msgInvoiceSelect',showTitle:true,title:this.t("msgInvoiceSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgInvoiceSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgInvoiceSelect.msg")}</div>)
                }
    
                await dialog(tmpConfObj);
                return
            }
            let tmpDocCustomer = {...this.docObj.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
            tmpDocCustomer.REF = this.docObj.dt()[0].REF
            tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
            
            if(pType == 0)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 0
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }
            else if (pType == 1)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 1
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value

                let tmpCheck = {...this.docObj.checkCls.empty}
                tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                tmpCheck.REF = this.checkReference.value
                tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                tmpCheck.AMOUNT =  pAmount
                tmpCheck.SAFE =  this.cmbCashSafe.value
                this.docObj.checkCls.addEmpty(tmpCheck)
            }
            else if (pType == 2)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 2
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }

            this.docObj.docCustomer.addEmpty(tmpDocCustomer)
            this._calculateTotal()
        }
    }
    async _addPayment(pType,pAmount)
    {
        if(this.invoices.length > 0)
        {
            let tmpAmount  = pAmount
            for (let i = 0; i < this.invoices.length; i++) 
            {
                if(tmpAmount >= this.invoices[i].REMAINING)
                {
                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocCustomer.REF = this.docObj.dt()[0].REF
                    tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocCustomer.INVOICE_GUID = this.invoices[i].GUID 
                    tmpDocCustomer.INVOICE_REF = this.invoices[i].REFERANS 
                    tmpDocCustomer.INVOICE_DATE = this.invoices[i].DOC_DATE 
                    if(pType == 0)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 0
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    else if (pType == 1)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 1
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
        
                        let tmpCheck = {...this.docObj.checkCls.empty}
                        tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpCheck.REF = this.checkReference.value
                        tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CUSTOMER =   this.docObj.dt()[0].INPUT
                        tmpCheck.AMOUNT =  this.invoices[i].REMAINING
                        tmpCheck.SAFE =  this.cmbCashSafe.value
                        this.docObj.checkCls.addEmpty(tmpCheck)
                    }
                    else if (pType == 2)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 2
                        tmpDocCustomer.AMOUNT = this.invoices[i].REMAINING
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                    this._calculateTotal()
                    tmpAmount = parseFloat((tmpAmount - this.invoices[i].REMAINING).toFixed(2))
                }
                else if(tmpAmount < this.invoices[i].REMAINING && tmpAmount != 0)
                {
                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocCustomer.REF = this.docObj.dt()[0].REF
                    tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocCustomer.INVOICE_GUID = this.invoices[i].GUID  
                    tmpDocCustomer.INVOICE_REF = this.invoices[i].REFERANS 

                    if(pType == 0)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 0
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    else if (pType == 1)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 1
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
        
                        let tmpCheck = {...this.docObj.checkCls.empty}
                        tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpCheck.REF = this.checkReference.value
                        tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                        tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                        tmpCheck.AMOUNT =  tmpAmount
                        tmpCheck.SAFE =  this.cmbCashSafe.value
                        this.docObj.checkCls.addEmpty(tmpCheck)
                    }
                    else if (pType == 2)
                    {
                        tmpDocCustomer.INPUT = this.cmbCashSafe.value
                        tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                        tmpDocCustomer.PAY_TYPE = 2
                        tmpDocCustomer.AMOUNT = tmpAmount
                        tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                    }
                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                    this._calculateTotal()
                    tmpAmount = 0
                }
            }


            if(tmpAmount > 0)
            {
                let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                tmpDocCustomer.REF = this.docObj.dt()[0].REF
                tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                
                if(pType == 0)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 0
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                }
                else if (pType == 1)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 1
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
    
                    let tmpCheck = {...this.docObj.checkCls.empty}
                    tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpCheck.REF = this.checkReference.value
                    tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                    tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                    tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                    tmpCheck.AMOUNT =  tmpAmount
                    tmpCheck.SAFE =  this.cmbCashSafe.value
                    this.docObj.checkCls.addEmpty(tmpCheck)
                }
                else if (pType == 2)
                {
                    tmpDocCustomer.INPUT = this.cmbCashSafe.value
                    tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                    tmpDocCustomer.PAY_TYPE = 2
                    tmpDocCustomer.AMOUNT = tmpAmount
                    tmpDocCustomer.DESCRIPTION = this.cashDescription.value
                }

                this.docObj.docCustomer.addEmpty(tmpDocCustomer)
                this._calculateTotal()
            }
        }
        else
        {
            if(this.sysParam.filter({ID:'invoicesForPayment',USERS:this.user.CODE}).getValue().value == true)
            {
                let tmpConfObj =
                {
                    id:'msgInvoiceSelect',showTitle:true,title:this.t("msgInvoiceSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgInvoiceSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgInvoiceSelect.msg")}</div>)
                }
    
                await dialog(tmpConfObj);
                return
            }
            let tmpDocCustomer = {...this.docObj.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
            tmpDocCustomer.REF = this.docObj.dt()[0].REF
            tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
            
            if(pType == 0)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 0
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }
            else if (pType == 1)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 1
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value

                let tmpCheck = {...this.docObj.checkCls.empty}
                tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                tmpCheck.REF = this.checkReference.value
                tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                tmpCheck.CHECK_DATE =  this.docObj.dt()[0].DOC_DATE
                tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                tmpCheck.AMOUNT =  pAmount
                tmpCheck.SAFE =  this.cmbCashSafe.value
                this.docObj.checkCls.addEmpty(tmpCheck)
            }
            else if (pType == 2)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = 2
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }

            this.docObj.docCustomer.addEmpty(tmpDocCustomer)
            this._calculateTotal()
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
                />
                <div style={{paddingTop:"65px"}}>
                    <div className="row px-2 pt-2">
                        
                    </div>
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
                                                this.init()
                                            }
                                        }}>
                                            <i className="fa-solid fa-file fa-1x"></i>
                                        </NbButton>
                                    </Item>
                                    <Item location="after" locateInMenu="auto">
                                        <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                        onClick={async()=>
                                        {
                                            console.log(this.docObj.dt())
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
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
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
                                            if(this.docObj.dt()[0].DOC_TYPE == 20)
                                            {
                                                this.popDesign.show()
                                            }
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
                                                this.init(); 
                                            }
                                        }}>
                                            <i className="fa-solid fa-trash fa-1x"></i>
                                        </NbButton>                                                    
                                    </Item>
                                </Toolbar>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className='col-12'>
                                <Form colCount={1}>
                                    {/* MUSTERI */}
                                    <Item  height={300}>
                                        <Label text={this.t("txtCustomer")} alignment="right" />
                                        <NdTextBox id="txtCustomer" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.popCustomer.show()
                                                        this.txtCustomerSearch.focus()
                                                    }
                                                }
                                            ]
                                        }
                                        selectAll={true}                           
                                        >     
                                        </NdTextBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("dtDocDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                        dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                        onValueChanged={(async()=>
                                        {
                                            this.checkRow()
                                        }).bind(this)}
                                        >
                                        </NdDatePicker>
                                    </Item>
                                     <Item location="after">
                                        <Button icon="add" text={this.t("btnCash")}
                                        onClick={async (e)=>
                                        {
                                                if(this.docObj.dt()[0].OUTPUT == '')
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
                                                this.numCash.setState({value:0});
                                                this.cashDescription.setState({value:''});
                                                this.popCash.show()
                                        }}/>
                                    </Item>
                                    {/* GRID */}
                                    <Item>
                                        <NdGrid parent={this} id={"grdDocPayments"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'600'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowUpdated={async(e)=>{

                                            this._calculateTotal()
                                        }}
                                        onRowRemoved={async (e)=>{
                                            this._calculateTotal()
                                            await this.docObj.save()
                                        }}
                                        onReady={async()=>
                                        {
                                            await this.grdDocPayments.dataRefresh({source:this.docObj.docCustomer.dt('DOC_CUSTOMER')});
                                        }}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Scrolling mode="infinite" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                            <Export fileName={this.lang.t("menu.fns_02_002")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdDocPayments.clmCreateDate")} width={100} allowEditing={false}/>
                                            <Column dataField="INPUT_NAME" caption={this.t("grdDocPayments.clmInputName")}  width={200} allowEditing={false}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdDocPayments.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} />
                                            <Column dataField="DESCRIPTION" caption={this.t("grdDocPayments.clmDescription")} />
                                            <Column dataField="INVOICE_REF" caption={this.t("grdDocPayments.clmInvoice")} />
                                            <Column dataField="INVOICE_DATE" caption={this.t("grdDocPayments.clmFacDate")}  dataType="date" 
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                        </NdGrid>
                                    </Item>
                                    {/* DIP TOPLAM */}
                                    <Item>
                                        <div className="row px-2 pt-2">
                                            <div className="col-12">
                                                <Form colCount={2} parent={this} id={"frmSale"}>
                                                    {/* Ara Toplam */}
                                                    <EmptyItem/>
                                                    <Item>
                                                        <Label text={this.t("txtTotal")} alignment="right" />
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
                     {/* CARI SECIMI POPUP */}
                     <div>                            
                        <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true}>
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
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                        onClick={()=>
                                        {
                                            this._customerSearch()
                                        }}>
                                            {this.t('popCustomer.btn01')}
                                        </NbButton>
                                    </div>
                                    <div className='col-6'>
                                        <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                        onClick={(async()=>
                                        {
                                            this.docObj.dt()[0].OUTPUT = this.grdCustomer.getSelectedData()[0].GUID
                                            this.docObj.dt()[0].OUTPUT_NAME = this.grdCustomer.getSelectedData()[0].TITLE
                                            this.docObj.dt()[0].OUTPUT_CODE = this.grdCustomer.getSelectedData()[0].CODE
                                            this.docObj.dt()[0].REF = this.grdCustomer.getSelectedData()[0].CODE
                                            this.maxRefNo(this.docObj.dt()[0].REF)
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
                                        height={'400'}
                                        width={'100%'}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <Scrolling mode="standart" />
                                            <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={200}/>
                                            <Column dataField="TITLE" caption={this.t("popCustomer.clmName")} width={400}/>
                                        </NdGrid>
                                    </div>
                                </div>
                            </div>
                        </NbPopUp>
                    </div>    
                     {/* Cash PopUp */}
                     <div>
                        <NdPopUp parent={this} id={"popCash"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCash.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'400'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbPayType */}
                                <Item>
                                    <Label text={this.t("cmbPayType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPayType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async(e)=>
                                        {
                                            this.cmbCashSafe.value = ''
                                            let tmpQuery
                                            if(e.value == 0)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 1)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 1"}
                                            }
                                            else if(e.value == 2)
                                            {
                                                tmpQuery = {query : "SELECT * FROM BANK_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 3)
                                            {
                                                tmpQuery = {query : "SELECT * FROM BANK_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 4)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 5)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                    
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {   
                                                this.cmbCashSafe.setData(tmpData.result.recordset)
                                            }
                                            else
                                            {
                                                this.cmbCashSafe.setData([])
                                            }
                                        }).bind(this)}
                                    data={{source:[{ID:0,VALUE:this.t("cmbPayType.cash")},{ID:1,VALUE:this.t("cmbPayType.check")},{ID:2,VALUE:this.t("cmbPayType.bankTransfer")},{ID:3,VALUE:this.t("cmbPayType.otoTransfer")},{ID:4,VALUE:this.t("cmbPayType.foodTicket")},{ID:5,VALUE:this.t("cmbPayType.bill")}]}}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbCashSafe */}
                                <Item>
                                    <Label text={this.t("popCash.cmbCashSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCashSafe"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {

                                        }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popCash.cash")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="numCash" parent={this} simple={true}
                                        maxLength={32}                                        
                                        >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RangeRule min={0.1} message={this.t("ValidCash")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("popCash.description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="cashDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdButton text={this.t("popCash.invoiceSelect")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async (e)=>
                                            {       
                                                this.getInvoices()
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCash.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmPayCash"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    if(this.cmbPayType.value == 1)
                                                    {
                                                        this.popCheck.show()
                                                    }
                                                    else
                                                    {
                                                        this._addPayment(this.cmbPayType.value,this.numCash.value)
                                                        this.popCash.hide();  
                                                    }
                                                }
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCash.btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popCash.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* Fatura Grid */}
                    <NdPopGrid id={"pg_invoices"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_invoices.title")} //
                    >
                        <Column dataField="REFERANS" caption={this.t("pg_invoices.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="INPUT_NAME" caption={this.t("pg_invoices.clmInputName")} width={300}/>
                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_invoices.clmDate")} width={250} />
                        <Column dataField="TOTAL" caption={this.t("pg_invoices.clmTotal")} width={200} />
                        <Column dataField="REMAINING" caption={this.t("pg_invoices.clmRemaining")} width={200} />
                    </NdPopGrid>                                
                </div>
            </div>
        )
    }
}