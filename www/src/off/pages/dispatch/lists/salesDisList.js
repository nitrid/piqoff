import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar'; 
import Form, { EmptyItem, Label,Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';
import { docCls,docItemsCls,docCustomerCls,docExtraCls,deptCreditMatchingCls} from '../../../../core/cls/doc.js';
import { nf525Cls } from '../../../../core/cls/nf525.js';

import NdGrid,{Column,Paging,Pager,Export,Scrolling,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';

export default class salesDisList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

     
        this.core = App.instance.core;
        this.nf525 = new nf525Cls();
        this.extraObj = new docExtraCls();

        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async loadState()
    {
        let tmpLoad = await this.access.filter({ELEMENT:'grdSlsDisListState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    async saveState(e)
    {
        let tmpSave = await this.access.filter({ELEMENT:'grdSlsDisListState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        await tmpSave.setValue(e)
        await tmpSave.save()
    }
    async Init()
    {
        this.txtCustomerCode.CODE = ''
        this.cmbAllDesignList.value = this.param.filter({ELEMENT:'cmbAllDesignList',USERS:this.user.CODE}).getValue().value
    }
    async btnGetClick()
    {
        if(this.chkOpenDispatch.value == false)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : `SELECT *, 
                                CASE WHEN ISNULL((SELECT TOP 1 TYPE_TO FROM DOC_CONNECT_VW_01 WHERE DOC_CONNECT_VW_01.DOC_FROM = DOC_VW_01.GUID),0) <> 0 THEN  'OK' ELSE 'X' END AS FACTURE, 
                                (SELECT TOP 1 MAIN_GROUP_NAME FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_NAME,   
                                (SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_CODE   
                                FROM DOC_VW_01 
                                WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND 
                                ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) AND (((SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) = @MAIN_GROUP_CODE) OR (@MAIN_GROUP_CODE = '')) 
                                AND TYPE = 1 AND DOC_TYPE = 40  AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC`,
                        param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','MAIN_GROUP_CODE:string|50'],
                        value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate,this.cmbMainGrp.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.loading.show()
            await this.grdSlsDisList.dataRefresh(tmpSource)
            App.instance.loading.hide()
        }
        else
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : `SELECT *, 
                                CASE WHEN ISNULL((SELECT TOP 1 TYPE_TO FROM DOC_CONNECT_VW_01 WHERE DOC_CONNECT_VW_01.DOC_FROM = DOC_VW_01.GUID),0) <> 0 THEN  'OK' ELSE 'X' END AS FACTURE, 
                                (SELECT TOP 1 MAIN_GROUP_NAME FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_NAME,   
                                (SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_CODE   
                                FROM DOC_VW_01 
                                WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND 
                                ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) AND (((SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) = @MAIN_GROUP_CODE) OR (@MAIN_GROUP_CODE = '')) 
                                AND TYPE = 1 AND DOC_TYPE = 40  AND REBATE = 0 AND ISNULL((SELECT TOP 1 TYPE_TO FROM DOC_CONNECT_VW_01 WHERE DOC_CONNECT_VW_01.DOC_FROM = DOC_VW_01.GUID),0) = 0 ORDER BY DOC_DATE DESC,REF_NO DESC`,
                        param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','MAIN_GROUP_CODE:string|50'],
                        value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate,this.cmbMainGrp.value] 
                    },
                    sql : this.core.sql
                }
            }
            App.instance.loading.show()
            await this.grdSlsDisList.dataRefresh(tmpSource)
            App.instance.loading.hide()
        }
    }
    async convertInvoice()
    {
        let tmpConfObj =
        {
            id:'msgConvertInvoices',showTitle:true,title:this.t("msgConvertInvoices.title"),showCloseButton:false,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgConvertInvoices.btn01"),location:'before'},{id:"btn02",caption:this.t("msgConvertInvoices.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertInvoices.msg")}</div>)
        }
        
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn02')
        {
            return
        }
        
        let tmpDocGuids = []
        
        App.instance.loading.show()

        for (let i = 0; i < this.grdSlsDisList.getSelectedData().length; i++) 
        {
            let tmpDocCls =  new docCls

            let tmpDoc = {...tmpDocCls.empty}
            tmpDoc.TYPE = 1
            tmpDoc.DOC_TYPE = 20
            tmpDoc.REBATE = 0
            tmpDoc.INPUT = this.grdSlsDisList.getSelectedData()[i].INPUT
            tmpDoc.OUTPUT = this.grdSlsDisList.getSelectedData()[i].OUTPUT
            tmpDoc.VAT_ZERO = this.grdSlsDisList.getSelectedData()[i].VAT_ZERO
            tmpDoc.REF = this.grdSlsDisList.getSelectedData()[i].REF
            tmpDoc.LOCKED = 1
            tmpDoc.PRICE_LIST_NO = this.grdSlsDisList.getSelectedData()[i].PRICE_LIST_NO
            
            let tmpAdressQuery = 
            {
                query :`SELECT TOP 1 ADRESS_NO FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER_ADRESS_VW_01.CUSTOMER = @INPUT AND FACTURATION = 1 `,
                param : ['INPUT:string|50'],
                value : [this.grdSlsDisList.getSelectedData()[i].INPUT]
            }
            
            let tmpAdressData = await this.core.sql.execute(tmpAdressQuery) 
            
            if(tmpAdressData.result.recordset.length > 0)
            {
                tmpDoc.ADRESS_NO = tmpAdressData.result.recordset[0].ADRESS_NO
            }
            else
            {
                tmpDoc.ADRESS_NO = 0
            }
            
            let tmpQuery = 
            {
                query :`SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 20 --AND REF = @REF `,
            }
           
            let tmpData = await this.core.sql.execute(tmpQuery) 
           
            if(tmpData.result.recordset.length > 0)
            {
                tmpDoc.REF_NO = tmpData.result.recordset[0].REF_NO
            }
           
            tmpDocCls.addEmpty(tmpDoc);   
           
            let tmpDocCustomer = {...tmpDocCls.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = tmpDocCls.dt()[0].GUID
            tmpDocCustomer.TYPE = 1
            tmpDocCustomer.DOC_TYPE = 20    
            tmpDocCustomer.REF = tmpDocCls.dt()[0].REF
            tmpDocCustomer.REF_NO = tmpDocCls.dt()[0].REF_NO
            tmpDocCustomer.DOC_DATE = tmpDocCls.dt()[0].DOC_DATE
            tmpDocCustomer.INPUT = tmpDocCls.dt()[0].INPUT
            tmpDocCustomer.OUTPUT = tmpDocCls.dt()[0].OUTPUT
            tmpDocCustomer.DESCRIPTION = tmpDocCls.dt()[0].DESCRIPTION
            
            let tmpCusotmerQuery = 
            {
                query :"SELECT * FROM CUSTOMER_VW_02 WHERE GUID = @INPUT ",
                param : ['INPUT:string|50'],
                value : [ tmpDocCls.dt()[0].INPUT]
            }
           
            let tmpCustomerData = await this.core.sql.execute(tmpCusotmerQuery) 
           
            if(tmpCustomerData.result.recordset.length > 0)
            {
                tmpDocCustomer.EXPIRY_DATE =  moment(new Date()).add(tmpCustomerData.result.recordset[0].EXPIRY_DAY, 'days')
            }   
            
            tmpDocCls.docCustomer.addEmpty(tmpDocCustomer);
            
            let tmpLineQuery = 
            {
                query :"SELECT * FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID ",
                param : ['DOC_GUID:string|50'],
                value : [this.grdSlsDisList.getSelectedData()[i].GUID]
            }
            
            let tmpLineData = await this.core.sql.execute(tmpLineQuery) 
            
            if(tmpLineData.result.recordset.length > 0)
            {
                for (let x = 0; x < tmpLineData.result.recordset.length; x++) 
                {
                    if(tmpLineData.result.recordset[x].INVOICE_DOC_GUID ==  '00000000-0000-0000-0000-000000000000')
                    {
                        let tmpDocItems = {...tmpDocCls.docItems.empty}
                        tmpDocItems.GUID =tmpLineData.result.recordset[x].GUID
                        tmpDocItems.DOC_GUID =tmpLineData.result.recordset[x].DOC_GUID
                        tmpDocItems.TYPE =tmpLineData.result.recordset[x].TYPE
                        tmpDocItems.DOC_TYPE =tmpLineData.result.recordset[x].DOC_TYPE
                        tmpDocItems.REBATE =tmpLineData.result.recordset[x].REBATE
                        tmpDocItems.LINE_NO =tmpLineData.result.recordset[x].LINE_NO
                        tmpDocItems.REF =tmpLineData.result.recordset[x].REF
                        tmpDocItems.REF_NO =tmpLineData.result.recordset[x].REF_NO
                        tmpDocItems.DOC_DATE =tmpLineData.result.recordset[x].DOC_DATE
                        tmpDocItems.SHIPMENT_DATE =tmpLineData.result.recordset[x].SHIPMENT_DATE
                        tmpDocItems.INPUT =tmpLineData.result.recordset[x].INPUT
                        tmpDocItems.INPUT_CODE =tmpLineData.result.recordset[x].INPUT_CODE
                        tmpDocItems.INPUT_NAME =tmpLineData.result.recordset[x].INPUT_NAME
                        tmpDocItems.OUTPUT =tmpLineData.result.recordset[x].OUTPUT
                        tmpDocItems.OUTPUT_CODE =tmpLineData.result.recordset[x].OUTPUT_CODE
                        tmpDocItems.OUTPUT_NAME =tmpLineData.result.recordset[x].OUTPUT_NAME
                        tmpDocItems.ITEM =tmpLineData.result.recordset[x].ITEM
                        tmpDocItems.ITEM_CODE =tmpLineData.result.recordset[x].ITEM_CODE
                        tmpDocItems.ITEM_NAME =tmpLineData.result.recordset[x].ITEM_NAME
                        tmpDocItems.PRICE =tmpLineData.result.recordset[x].PRICE
                        tmpDocItems.QUANTITY =tmpLineData.result.recordset[x].QUANTITY
                        tmpDocItems.VAT =tmpLineData.result.recordset[x].VAT
                        tmpDocItems.AMOUNT =Number(tmpLineData.result.recordset[x].AMOUNT).round(2)
                        tmpDocItems.TOTAL =Number(tmpLineData.result.recordset[x].TOTAL).round(2)
                        tmpDocItems.TOTALHT =Number(tmpLineData.result.recordset[x].TOTALHT).round(2)
                        tmpDocItems.DESCRIPTION =tmpLineData.result.recordset[x].DESCRIPTION
                        tmpDocItems.INVOICE_DOC_GUID = tmpDocCls.dt()[0].GUID
                        tmpDocItems.INVOICE_LINE_GUID =tmpLineData.result.recordset[x].GUID
                        tmpDocItems.VAT_RATE =tmpLineData.result.recordset[x].VAT_RATE
                        tmpDocItems.DISCOUNT_RATE =tmpLineData.result.recordset[x].DISCOUNT_RATE
                        tmpDocItems.CONNECT_REF =tmpLineData.result.recordset[x].CONNECT_REF
                        tmpDocItems.ORDER_LINE_GUID =tmpLineData.result.recordset[x].ORDER_LINE_GUID
                        tmpDocItems.ORDER_DOC_GUID =tmpLineData.result.recordset[x].ORDER_DOC_GUID
                        tmpDocItems.OLD_VAT =tmpLineData.result.recordset[x].VAT_RATE
                        tmpDocItems.VAT_RATE =tmpLineData.result.recordset[x].VAT_RATE
                        tmpDocItems.DEPOT_QUANTITY =tmpLineData.result.recordset[x].DEPOT_QUANTITY
                        tmpDocItems.CUSTOMER_PRICE =tmpLineData.result.recordset[x].CUSTOMER_PRICE
                        tmpDocItems.SUB_FACTOR =tmpLineData.result.recordset[x].SUB_FACTOR
                        tmpDocItems.SUB_PRICE =tmpLineData.result.recordset[x].SUB_PRICE
                        tmpDocItems.SUB_QUANTITY =tmpLineData.result.recordset[x].SUB_QUANTITY
                        tmpDocItems.SUB_SYMBOL =tmpLineData.result.recordset[x].SUB_SYMBOL
                        tmpDocItems.UNIT_SHORT =tmpLineData.result.recordset[x].UNIT_SHORT
                        tmpDocItems.DOC_DISCOUNT_1 =tmpLineData.result.recordset[x].DOC_DISCOUNT_1
                        tmpDocItems.DOC_DISCOUNT_2 =tmpLineData.result.recordset[x].DOC_DISCOUNT_2
                        tmpDocItems.DOC_DISCOUNT_3 =tmpLineData.result.recordset[x].DOC_DISCOUNT_3
                        tmpDocItems.DOC_DISCOUNT =tmpLineData.result.recordset[x].DOC_DISCOUNT
                        tmpDocItems.DISCOUNT_1 =tmpLineData.result.recordset[x].DISCOUNT_1
                        tmpDocItems.DISCOUNT_2 =tmpLineData.result.recordset[x].DISCOUNT_2
                        tmpDocItems.DISCOUNT_3 =tmpLineData.result.recordset[x].DISCOUNT_3
                        tmpDocItems.DISCOUNT =tmpLineData.result.recordset[x].DISCOUNT
                        tmpDocItems.UNIT =tmpLineData.result.recordset[x].UNIT
                        tmpDocItems.CUSTOMER_PRICE =tmpLineData.result.recordset[x].CUSTOMER_PRICE
                        tmpDocItems.DIFF_PRICE =tmpLineData.result.recordset[x].DIFF_PRICE
                        tmpDocItems.COST_PRICE =tmpLineData.result.recordset[x].COST_PRICE
        
                        await tmpDocCls.docItems.addEmpty(tmpDocItems,false)
                        await this.core.util.waitUntil(100)
                        tmpDocCls.docItems.dt()[tmpDocCls.docItems.dt().length - 1].stat = 'edit'
                    }
                }
            }
            if(tmpDocCls.docItems.dt().length > 0)
            {
                let tmpVat = 0
                
                for (let i = 0; i < tmpDocCls.docItems.dt().groupBy('VAT_RATE').length; i++) 
                {
                    if(tmpDocCls.dt()[0].VAT_ZERO != 1)
                    {
                        tmpVat = tmpVat + parseFloat(tmpDocCls.docItems.dt().where({'VAT_RATE':tmpDocCls.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                    }
                }
                
                tmpDocCls.dt()[0].AMOUNT = tmpDocCls.docItems.dt().sum("AMOUNT",2)
                tmpDocCls.dt()[0].DISCOUNT = Number(parseFloat(tmpDocCls.docItems.dt().sum("AMOUNT",2)) - parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2))).round(2)
                tmpDocCls.dt()[0].DOC_DISCOUNT_1 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_1",4)
                tmpDocCls.dt()[0].DOC_DISCOUNT_2 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_2",4)
                tmpDocCls.dt()[0].DOC_DISCOUNT_3 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_3",4)
                tmpDocCls.dt()[0].DOC_DISCOUNT = Number((parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
                tmpDocCls.dt()[0].VAT = Number(tmpVat).round(2)
                tmpDocCls.dt()[0].SUBTOTAL = parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2))
                tmpDocCls.dt()[0].TOTALHT = parseFloat(parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2)) - parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT",2))).round(2)
                tmpDocCls.dt()[0].TOTAL = Number((parseFloat(tmpDocCls.dt()[0].TOTALHT)) + parseFloat(tmpDocCls.dt()[0].VAT)).round(2)
                tmpDocCls.docCustomer.dt()[0].AMOUNT = tmpDocCls.dt()[0].TOTAL
                
                let tmpSignedData = await this.nf525.signatureDoc(tmpDocCls.dt()[0],tmpDocCls.docItems.dt())                
                tmpDocCls.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
                tmpDocCls.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM
                
                await tmpDocCls.save()
                
                if(this.sysParam.filter({ID:'autoFactureMailSend',USERS:this.user.CODE}).getValue().value == true)
                {
                    await this.MailSend(tmpDocCls.dt()[0].GUID,tmpDocCls.dt()[0].INPUT,tmpDocCls.dt()[0].REF_NO)
                }
        
                tmpDocGuids.push(tmpDocCls.dt()[0])
            }
        }
        
        App.instance.loading.hide()
        
        let tmpConfObj2 =
        {
            id:'msgConvertSucces',showTitle:true,title:this.t("msgConvertSucces.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgConvertSucces.btn01"),location:'before'},{id:"btn02",caption:this.t("msgConvertSucces.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertSucces.msg")}</div>)
        }

        let tmpPrintDialog = await dialog(tmpConfObj2);
        
        if(tmpPrintDialog == 'btn01')
        {
            let tmpLines = []
            App.instance.loading.show()
            
            for (let i = 0; i < tmpDocGuids.length; i++) 
            {
                let tmpLastSignature = await this.nf525.signatureDocDuplicate(tmpDocGuids[i])
                this.extraObj.clearAll()
                let tmpExtra = {...this.extraObj.empty}
                tmpExtra.DOC = tmpDocGuids[i].GUID
                tmpExtra.DESCRIPTION = ''
                tmpExtra.TAG = 'PRINT'
                tmpExtra.SIGNATURE = tmpLastSignature.SIGNATURE
                tmpExtra.SIGNATURE_SUM = tmpLastSignature.SIGNATURE_SUM
                this.extraObj.addEmpty(tmpExtra);
                await this.extraObj.save()
                let tmpQuery = 
                {
                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO " ,
                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                    value:  [tmpDocGuids[i].GUID,'333',localStorage.getItem('lang').toUpperCase()]
                }
                App.instance.loading.show()
                let tmpData = await this.core.sql.execute(tmpQuery) 
                App.instance.loading.hide()
                for (let x = 0; x < tmpData.result.recordset.length; x++) 
                {
                    tmpLines.push(tmpData.result.recordset[x])
                }
                this.core.socket.emit('piqXInvoiceInsert',
                {
                    fromUser : tmpData.result.recordset[0].LUSER,
                    toUser : '',
                    docGuid : tmpData.result.recordset[0].DOC_GUID,
                    docDate : tmpData.result.recordset[0].DOC_DATE,
                    fromTax : tmpData.result.recordset[0].TAX_NO,
                    toTax : tmpData.result.recordset[0].CUSTOMER_TAX_NO,
                    fromType: tmpData.result.recordset[0].DOC_TYPE,
                    fromRebate: tmpData.result.recordset[0].REBATE,
                    json : JSON.stringify(tmpData.result.recordset),
                    pdf : "data:application/pdf;base64," + pResult.split('|')[1]
                },
                (pData) =>
                {
                    console.log(pData)
                })
              
            }
            console.log(JSON.stringify(tmpLines))
            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
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
            App.instance.loading.hide()
        }

        this.btnGetClick()
    }
    async printDispatch()
    {
        let tmpConfObj =
        {
            id:'msgPrintDispatch',showTitle:true,title:this.t("msgPrintDispatch.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgPrintDispatch.btn01"),location:'before'},{id:"btn02",caption:this.t("msgPrintDispatch.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPrintDispatch.msg")}</div>)
        }

        let tmpDialog = await dialog(tmpConfObj);

        if(tmpDialog == 'btn02')
        {
            return
        }

        let tmpLines = []

        App.instance.loading.show()

        for (let i = 0; i < this.grdSlsDisList.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG) ORDER BY DOC_DATE,LINE_NO ` ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdSlsDisList.getSelectedData()[i].GUID,this.cmbAllDesignList.value,localStorage.getItem('lang').toUpperCase()]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            for (let x = 0; x < tmpData.result.recordset.length; x++) 
            {
                tmpLines.push(tmpData.result.recordset[x])
            }

            this.core.socket.emit('piqXInvoiceInsert',
            {
                fromUser : tmpData.result.recordset[0].LUSER,
                toUser : '',
                docGuid : tmpData.result.recordset[0].DOC_GUID,
                docDate : tmpData.result.recordset[0].DOC_DATE,
                fromTax : tmpData.result.recordset[0].TAX_NO,
                toTax : tmpData.result.recordset[0].CUSTOMER_TAX_NO,
                fromType: tmpData.result.recordset[0].DOC_TYPE,
                fromRebate: tmpData.result.recordset[0].REBATE,
                json : JSON.stringify(tmpData.result.recordset),
                pdf : ""
            },
            (pData) =>
            {
                console.log(pData)
            })
                
        }
       
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
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
        App.instance.loading.hide()
    }
    async MailSend(pGuid,pCustomer,pRefno)
    {
        let tmpMAilQuery = 
        {
            query :`SELECT EMAIL,TITLE FROM CUSTOMER_VW_02 WHERE GUID = @GUID`,
            param:  ['GUID:string|50'],
            value:  [pCustomer]
        }
       
        let tmpMailAdress = await this.core.sql.execute(tmpMAilQuery) 
       
        if(tmpMailAdress.result.recordset.length > 0 && tmpMailAdress.result.recordset[0].EMAIL != '')
        {
            let txtSendMail = tmpMailAdress.result.recordset[0].EMAIL
            
            let tmpQuery = 
            {
                query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO ` ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [pGuid,this.sysParam.filter({ID:'autoFactureMailSend',USERS:this.user.CODE}).getValue().design,this.lang.languages[0].toString().toUpperCase()]
            }
            
            App.instance.loading.show()
            let tmpData = await this.core.sql.execute(tmpQuery)
            App.instance.loading.hide()
            
            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
            {
                App.instance.loading.show()
            
                let  tmpHtml = this.sysParam.filter({ID:'MailExplanation',USERS:this.user.CODE}).getValue()
            
                if(pResult.split('|')[0] != 'ERR')
                {
                }
            
                let tmpMailData = {html:tmpHtml,subject:"Facture-" + pRefno ,sendMail:txtSendMail,attachName:"Facture-" + pRefno + ".pdf",attachData:pResult.split('|')[1],text:""}
            
                this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                {
                    if((pResult1) == 0)
                    {  
                        let tmpQuery = 
                        {
                            query :`EXEC [dbo].[PRD_MAIL_STATUS_INSERT]  
                            @CUSER = @PCUSER, 
                            @DOC_GUID = @PDOC_GUID,  
                            @SENDER_MAIL = @PSENDER_MAIL, 
                            @RECIEVER_MAIL = @PRECIEVER_MAIL`,
                            param : ['PCUSER:string|25','PDOC_GUID:string|50','PSENDER_MAIL:string|50','PRECIEVER_MAIL:string|50'],
                            value : [this.user.CODE,pGuid,'',txtSendMail]
                        }
            
                        await this.core.sql.execute(tmpQuery) 
                    }
                    App.instance.loading.hide()
                });
            }); 
        } 
        else
        {
            let tmpText = this.t("msgNoMailAddress") + tmpMailAdress.result.recordset[0].TITLE
            let tmpMailData = {html:'',subject:"Facture-" + pRefno,sendMail:this.sysParam.filter({ID:'autoFactureMailSend',USERS:this.user.CODE}).getValue().mail,text:tmpText}
            this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
            {
                App.instance.loading.hide()
            });
        }    
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.props.data.tabkey}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'irs_02_002',
                                                text: this.t('menu'),
                                                path: 'dispatch/documents/salesDispatch.js',
                                            })
                                        }
                                    }    
                                } />
                                  <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'detailslayout',
                                        onClick: async () => 
                                        {
                                            this.convertInvoice()
                                            
                                        }
                                    }    
                                } />
                                  <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'print',
                                        onClick: async () => 
                                        {
                                            this.popAllDesign.show()
                                        }
                                    }    
                                } />
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                <Label text={this.t("dtFirst")} alignment="right" />
                                <NbDateRange id={"dtFirst"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                  
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtCustomerCode.setState({value:data[0].TITLE})
                                                    this.txtCustomerCode.CODE = data[0].CODE
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
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:data[0].TITLE})
                                                        this.txtCustomerCode.CODE = data[0].CODE
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#" + this.props.data.id + this.props.data.tabkey}
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.props.data.tabkey}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("pg_txtCustomerCode.title")} //
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
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
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                    
                                </NdPopGrid>
                                </Item> 
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMainGrp" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    data={{source: {select : {query:"SELECT CODE,NAME FROM CUSTOMER_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                          
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                        <Form>
                                <Item>
                                    <Label text={this.t("chkOpenDispatch")} alignment="right" />
                                    <NdCheckBox id="chkOpenDispatch" parent={this} value={false}></NdCheckBox>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsDisList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                    App.instance.menuClick(
                                        {
                                            id: 'irs_02_002',
                                            text: this.lang.t('menuOff.ftr_02_002'),
                                            path: 'dispatch/documents/salesDispatch.js',
                                            pagePrm:{GUID:e.data.GUID}
                                        })
                                }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring mode="custom" enabled={true} customSave={this.saveState} customLoad={this.loadState} storageKey={this.props.data.id + "_grdSlsDisList"} />
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.stk_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSlsDisList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsDisList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsDisList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsDisList.clmInputName")} visible={true}/> 
                                <Column dataField="MAIN_GROUP_NAME" caption={this.t("grdSlsDisList.clmMainGroup")} width={120} visible={true}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsDisList.clmDate")} visible={true} width={180} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                <Column dataField="TOTALHT" caption={this.t("grdSlsDisList.clmAmount")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsDisList.clmVat")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsDisList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>   
                                <Column dataField="FACTURE" caption={this.t("grdSlsDisList.clmFacture")} visible={true} width={100}/>
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
                  {/* Dizayn Seçim PopUp */}
                  <div>
                        <NdPopUp parent={this} id={"popAllDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={"#" + this.props.data.id + this.props.data.tabkey} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbAllDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '112'`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                             
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                this.printDispatch()
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popAllDesign.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
            </div>
        )
    }
}