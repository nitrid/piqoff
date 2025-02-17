import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbRadioButton from "../../../../core/react/bootstrap/radiogroup.js";
import NbLabel from "../../../../core/react/bootstrap/label.js";
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbButton from "../../../../core/react/bootstrap/button.js";
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { dataset,datatable,param,access } from "../../../../core/core.js";
import { posExtraCls,posDeviceCls} from "../../../../core/cls/pos.js";
import { nf525Cls } from "../../../../core/cls/nf525.js";
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';


export default class salesOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this._sendMail = this._sendMail.bind(this)
        this.btnGetDetail = this.btnGetDetail.bind(this)
        this._factureInsert = this._factureInsert.bind(this)
        this.posDevice = new posDeviceCls();
        this.lastPosDt = new datatable();
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.lastPosPromoDt = new datatable();  
        this.firm = new datatable();
        this.nf525 = new nf525Cls();
        this.state={ticketId :""}
        
        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()


        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
        this.txtPayChangeDesc.value = this.t("txtPayChangeDesc")
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DATE,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET_ID," + 
                    "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_EXTRA.POS_GUID =POS_VW_01.GUID AND TAG = 'PARK DESC' ),'') AS DESCRIPTION FROM POS_VW_01 WHERE STATUS = 0 ORDER BY DOC_DATE "
                },
                sql : this.core.sql
            }
        }
        await this.grdOpenTike.dataRefresh(tmpSource)
        if(this.grdOpenTike.data.datatable.length > 0)
        {
          this.popOpenTike.show()
        }
         //** FIRMA GETIR ******************************/
         this.firm.selectCmd = 
         {
             query : "SELECT TOP 1 * FROM COMPANY_VW_01",
             local : 
             {
                 type : "select",
                 query : "SELECT * FROM COMPANY_VW_01 LIMIT 1;",
                 values : []
             }
         }
         await this.firm.refresh();
    }
    async _btnGetClick()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :  "SELECT "  +
                    " MAX(ITEM_CODE) AS ITEM_CODE,  "  +
                    " MAX(ITEM_NAME) AS ITEM_NAME,  "  +
                    " MAX(TIME) AS TIME,  "  +
                    " MAX(DATE) AS DATE,  "  +
                    " MAX(DEVICE) AS DEVICE,  "  +
                    " MAX(USERS) AS USERS, "  +
                    " SUBSTRING(CONVERT(NVARCHAR(50),SALE_POS_GUID),20,25) AS POS_ID, "  +
                    " SALE_POS_GUID AS POS_GUID, " +
                    " MAX(SALE_TYPE) AS SALE_TYPE,  "  +
                    " COUNT(PAYMENT_TYPE) AS PAY_COUNT,  "  +
                    " MAX(CUSTOMER) AS CUSTOMER,  "  +
                    " MAX(DISCOUNT) AS DISCOUNT,  "  +
                    " MAX(LOYALTY) AS LOYALTY,  "  +
                    " MAX(HT) AS HT,  "  +
                    " MAX(TVA) AS TVA,  "  +
                    " MAX(TTC) AS TTC,  "  +
                    " MAX(CUSTOMER_NAME) AS CUSTOMER_NAME,  "  +
                    " MAX(PAYMENT_TYPE) AS PAYMENT_TYPE,  "  +
                    " MAX(CUSTOMER_MAIL) AS CUSTOMER_MAIL, "+
                    " MAX(FACT_REF) AS FACT_REF, "+
                    " MAX(PAYMENT) AS PAYMENT,  "  +
                    " MAX(REF) AS REF " +
                    " FROM (  "  +
                    " SELECT  "  +
                    "SALE.POS_GUID AS SALE_POS_GUID, "  +
                    "PAYMENT.POS_GUID AS PAYMENT_POS_GUID, "  +
                    " MAX(SALE.ITEM_CODE) AS ITEM_CODE,  "  +
                    " MAX(SALE.ITEM_NAME) AS ITEM_NAME,  "  +
                    " CONVERT(NVARCHAR,MAX(SALE.CDATE),103) AS DATE,   "  +
                    " CONVERT(NVARCHAR,MAX(SALE.CDATE),108) AS TIME,   "  +
                    " MAX(SALE.DEVICE) AS DEVICE,  "  +
                    " ISNULL((SELECT NAME FROM USERS WHERE CODE = MAX(SALE.LUSER)),'') AS USERS,  "  +
                    " SALE.TYPE AS SALE_TYPE,  "  +
                    " PAYMENT.TYPE AS PAYMENT_TYPE,  "  +
                    " PAYMENT.PAY_TYPE_NAME AS PAY_TYPE_NAME, "  +
                    " MAX(SALE.CUSTOMER_CODE) AS CUSTOMER,  "  +
                    " MAX(SALE.GRAND_DISCOUNT) DISCOUNT,  "  +
                    " MAX(SALE.GRAND_LOYALTY) LOYALTY,  "  +
                    " MAX(SALE.GRAND_AMOUNT) HT, "  +
                    " MAX(SALE.GRAND_VAT) TVA, "  +
                    " MAX(SALE.GRAND_TOTAL) TTC,  "  +
                    " MAX(SALE.CUSTOMER_NAME) AS CUSTOMER_NAME,  "  +
                    " ISNULL((SELECT TOP 1 CUSTOMER_MAIL FROM POS_VW_01 WHERE POS_VW_01.GUID = SALE.POS_GUID),'') AS CUSTOMER_MAIL," +
                    " ISNULL((SELECT TOP 1 FACT_REF FROM POS_VW_01 WHERE POS_VW_01.GUID = SALE.POS_GUID),0) AS FACT_REF," +
                    " ISNULL((SELECT TOP 1 REF FROM POS_VW_01 WHERE POS_VW_01.GUID = SALE.POS_GUID),0) AS REF," +
                    " (SELECT SUM(AMOUNT) FROM [POS_PAYMENT_VW_01] AS PAY WHERE PAY.POS_GUID = SALE.POS_GUID ) AS PAYMENT   "  +
                    " FROM [dbo].[POS_SALE_VW_01] AS SALE  "  +
                    " INNER JOIN [dbo].[POS_PAYMENT_VW_01] AS PAYMENT ON  "  +
                    " PAYMENT.POS_GUID = SALE.POS_GUID AND PAYMENT.STATUS = 1  "  +
                    " WHERE SALE.DOC_DATE >= @FIRST_DATE AND SALE.DOC_DATE <= @LAST_DATE AND   "  +
                    " ((SALE.CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND  "  +
                    " ((SALE.DEVICE = @DEVICE) OR (@DEVICE = '')) AND  "  +
                    " ((PAYMENT.PAY_TYPE = @PAY_TYPE) OR (@PAY_TYPE = -1)) AND "  +
                    " ((ITEM_CODE = @ITEM_CODE OR SALE.INPUT =  @ITEM_CODE) OR (@ITEM_CODE = '')) AND  ((SUBSTRING(CONVERT(NVARCHAR(50),SALE.POS_GUID),20,25) = @TICKET_ID) OR (@TICKET_ID = '')) AND "  +
                    " ((SALE.LUSER = @LUSER) OR (@LUSER = '')) AND SALE.STATUS = 1 AND SALE.DEVICE <> '9999' "  +
                    " GROUP BY SALE.TYPE,PAYMENT.TYPE,PAYMENT.PAY_TYPE_NAME,PAYMENT.POS_GUID,SALE.POS_GUID) AS TMP  "  +
                    " GROUP BY SALE_POS_GUID,PAYMENT_POS_GUID HAVING COUNT(PAYMENT_TYPE) >= @PAY_COUNT AND  ((MAX(TTC) >= @FIRST_AMOUNT) OR (@FIRST_AMOUNT = 0)) AND ((MAX(TTC) <= @LAST_AMOUNT) OR (@LAST_AMOUNT = 0)) ORDER BY DATE,TIME",
                    param : ['FIRST_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50','DEVICE:string|25','PAY_TYPE:int','ITEM_CODE:string|50','TICKET_ID:string|50','LUSER:string|50','PAY_COUNT:string|50','FIRST_AMOUNT:float','LAST_AMOUNT:float'],
                    value : [this.dtFirst.value,this.dtLast.value,this.txtCustomerCode.value,this.cmbDevice.value,this.cmbPayType.value,this.txtItem.value,this.txtTicketno.value,this.cmbUser.value,this.ckhDoublePay.value ? 2 : 1,this.numFirstTicketAmount.value,this.numLastTicketAmount.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdSaleTicketReport.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async btnGetDetail(pGuid)
    {
        this.lastPosSaleDt.selectCmd = 
        {
            query :  "SELECT CONVERT(NVARCHAR,CDATE,108) AS TIME,* FROM POS_SALE_VW_01  WHERE POS_GUID = @POS_GUID ",
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        
        await this.lastPosSaleDt.refresh()
        await this.grdSaleTicketItems.dataRefresh({source:this.lastPosSaleDt});
        
        this.lastPosPayDt.selectCmd = 
        {
            query :  "SELECT (AMOUNT-CHANGE) AS LINE_TOTAL,* FROM POS_PAYMENT_VW_01  WHERE POS_GUID = @POS_GUID ",
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        this.lastPosPayDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@POS = @PPOS, " +
            "@TYPE = @PTYPE, " +
            "@TYPE_NAME = @PTYPE_NAME, " +
            "@LINE_NO = @PLINE_NO, " +
            "@AMOUNT = @PAMOUNT, " + 
            "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PTYPE_NAME:string|50','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','PAY_TYPE_NAME','LINE_NO','AMOUNT','CHANGE']
        } 
        this.lastPosPayDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@POS = @PPOS, " +
            "@TYPE = @PTYPE, " +
            "@TYPE_NAME = @PTYPE_NAME, " +
            "@LINE_NO = @PLINE_NO, " +
            "@AMOUNT = @PAMOUNT, " + 
            "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PTYPE_NAME:string|50','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','PAY_TYPE_NAME','LINE_NO','AMOUNT','CHANGE']
        } 
        this.lastPosPayDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
        }
        await this.lastPosPayDt.refresh()
        await this.grdSaleTicketPays.dataRefresh({source:this.lastPosPayDt});
        await this.grdLastTotalPay.dataRefresh({source:this.lastPosPayDt});

        this.popDetail.show()
    }
    async _sendMail()
    {
        for (let i = 0; i < this.grdSaleTicketReport.getSelectedData().length; i++) 
        {
            App.instance.setState({isExecute:true})
            let tmpLastPos = new datatable(); 
            tmpLastPos.selectCmd = 
            {
                query:  "SELECT * FROM POS_VW_01 WHERE GUID = @GUID ",
                param:  ["GUID:string|50"],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            }
            
            await tmpLastPos.refresh()
    
            this.lastPosSaleDt.selectCmd = 
            {
                query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                param:  ["GUID:string|50"],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            }
            
            await this.lastPosSaleDt.refresh()
    
            this.lastPosPromoDt.selectCmd = 
            {
                query : "SELECT * FROM [dbo].[POS_PROMO_VW_01] WHERE POS_GUID = @POS_GUID",
                param : ['POS_GUID:string|50'],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            } 
            
            await this.lastPosPromoDt.refresh()
    
            this.lastPosPayDt.selectCmd = 
            {
                query:  "SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                param:  ["GUID:string|50"],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            }
            this.lastPosPayDt.insertCmd = 
            {
                query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                        "@GUID = @PGUID, " +
                        "@CUSER = @PCUSER, " + 
                        "@POS = @PPOS, " +
                        "@TYPE = @PTYPE, " +
                        "@LINE_NO = @PLINE_NO, " +
                        "@AMOUNT = @PAMOUNT, " + 
                        "@CHANGE = @PCHANGE ", 
                param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
            } 
            this.lastPosPayDt.updateCmd = 
            {
                query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                        "@GUID = @PGUID, " +
                        "@CUSER = @PCUSER, " + 
                        "@POS = @PPOS, " +
                        "@TYPE = @PTYPE, " +
                        "@LINE_NO = @PLINE_NO, " +
                        "@AMOUNT = @PAMOUNT, " + 
                        "@CHANGE = @PCHANGE ", 
                param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
                dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
            } 
            this.lastPosPayDt.deleteCmd = 
            {
                query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                        "@CUSER = @PCUSER, " + 
                        "@UPDATE = 1, " +
                        "@GUID = @PGUID, " + 
                        "@POS_GUID = @PPOS_GUID ", 
                param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
                dataprm : ['CUSER','GUID','POS_GUID']
            }
            await this.lastPosPayDt.refresh()

            let tmpData = 
            {
                pos : tmpLastPos,
                possale : this.lastPosSaleDt,
                pospay : this.lastPosPayDt,
                pospromo : this.lastPosPromoDt,
                firm : this.firm,
                special : 
                {
                    type : tmpLastPos[0].FACT_REF == 0 ? 'Fis' : 'Fatura',
                    ticketCount : 0,
                    reprint : 1,
                    repas : 0,
                    factCertificate : '',
                    dupCertificate : '',
                    customerUsePoint : Math.floor(tmpLastPos[0].LOYALTY * 100),
                    customerPoint : (tmpLastPos[0].CUSTOMER_POINT + Math.floor(tmpLastPos[0].LOYALTY * 100)) - Math.floor(tmpLastPos[0].TOTAL),
                    customerGrowPoint : tmpLastPos[0].CUSTOMER_POINT - Math.floor(tmpLastPos[0].TOTAL)
                }
            }
            await this.print(tmpData)
            App.instance.setState({isExecute:false})
        }
     
        this.mailPopup.hide()
    }
    async _factureInsert()
    {
        let tmpConfObj =
        {
            id:'msgFacture',showTitle:true,title:this.t("msgFacture.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgFacture.btn01"),location:'before'},{id:"btn02",caption:this.t("msgFacture.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgFacture.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        if(pResult == 'btn02')
        {
            return
        }
        for (let i = 0; i < this.grdSaleTicketReport.getSelectedData().length; i++) 
        {
            App.instance.setState({isExecute:true})
            let tmpLastPos = new datatable(); 
            tmpLastPos.selectCmd = 
            {
                query:  "SELECT * FROM POS_VW_01 WHERE GUID = @GUID ",
                param:  ["GUID:string|50"],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            }
            
            await tmpLastPos.refresh()

            if(tmpLastPos[0].CUSTOMER_GUID == '00000000-0000-0000-0000-000000000000')
            {
                App.instance.setState({isExecute:false})
                let tmpConfObj =
                {
                    id:'msgFactureCustomer',showTitle:true,title:this.t("msgFactureCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgFactureCustomer.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgFactureCustomer.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    return
                }
            }
            this.lastPosSaleDt.selectCmd = 
            {
                query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @GUID ORDER BY LDATE DESC",
                param:  ["GUID:string|50"],
                value:  [this.grdSaleTicketReport.getSelectedData()[i].POS_GUID]
            }
            
            await this.lastPosSaleDt.refresh()
    
            if(tmpLastPos[0].FACT_REF == 0)
            {
                //***** FACTURE İMZALAMA *****/
                let tmpSignedData = await this.nf525.signatureSaleFact(tmpLastPos[0],this.lastPosSaleDt)  
                let tmpFactRef = tmpSignedData.REF
    
                let tmpInsertQuery = 
                {
                    query : "EXEC [dbo].[PRD_POS_FACTURE_INSERT] " + 
                            "@CUSER = @PCUSER, " + 
                            "@POS = @PPOS, " +
                            "@REF = @PREF, " +
                            "@SIGNATURE = @PSIGNATURE, " +
                            "@SIGNATURE_SUM = @PSIGNATURE_SUM, " +
                            "@APP_VERSION = @PAPP_VERSION ", 
                    param : ['PCUSER:string|25','PPOS:string|50','PREF:int','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max','PAPP_VERSION:string|25'],
                    value : [tmpLastPos[0].CUSER,tmpLastPos[0].GUID,tmpFactRef,tmpSignedData.SIGNATURE,tmpSignedData.SIGNATURE_SUM,this.core.appInfo.version],
                }
        
                await this.core.sql.execute(tmpInsertQuery)                                
            }
            App.instance.setState({isExecute:false})
        }
    }
    print(pData)
    {
        return new Promise(async resolve => 
        {
            let prmPrint = 'printPdf.js'
            import("../../../../pos/meta/print/" + prmPrint).then(async(e)=>
            {
                let tmpPrint = e.print(pData)

                // let tmpArr = [];
                // for (let i = 0; i < tmpPrint.length; i++) 
                // {
                //     let tmpObj = tmpPrint[i]
                //     if(typeof tmpPrint[i] == 'function')
                //     {
                //         tmpObj = tmpPrint[i]()
                //     }
                //     if(Array.isArray(tmpObj))
                //     {
                //         tmpArr.push(...tmpObj)
                //     }
                //     else if(typeof tmpObj == 'object')
                //     {
                //         tmpArr.push(tmpObj)
                //     }
                // }
                // console.log(JSON.stringify(tmpArr))

               
                await this.posDevice.pdfPrint(tmpPrint,this.txtSendMail.value,this.txtMailSubject.value,this.htmlEditor.value)
                resolve()
            })
        });
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                            <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnFacture" parent={this} icon="textdocument" type="default"
                                    onClick={async ()=>
                                    {
                                        this._factureInsert()
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnMailSend" parent={this} icon="message" type="default"
                                    onClick={async ()=>
                                    {
                                        this.txtSendMail.value = this.grdSaleTicketReport.getSelectedData()[0].CUSTOMER_MAIL
                                        this.htmlEditor.value = this.sysParam.filter({ID:'MailExplanation',USERS:this.user.CODE}).getValue()
                                        await this.mailPopup.show().then(async (e) =>
                                        {
                                        });
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
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
                                                        this.txtCustomerCode.setState({value:data[0].CODE})
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.setState({value:data[0].CODE})
                                                this.txtCustomerName.setState({value:data[0].TITLE})
                                                this._btnGetClick()
                                            }
                                        }
                                    }).bind(this)}
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}} 
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
                                            query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
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
                                {/* cmbDevice */}
                                <Item>
                                    <Label text={this.t("cmbDevice")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDevice"
                                    displayExpr="DISPLAY"                       
                                    valueExpr="CODE"
                                    showClearButton={true}
                                    notRefresh={true}
                                    data={{source:{select:{query:"SELECT CODE + '-' + NAME AS DISPLAY,CODE,NAME FROM POS_DEVICE_VW_01 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* numFirstTicketAmount */}
                                <Item>
                                    <Label text={this.t("numFirstTicketAmount")} alignment="right" />
                                    <NdNumberBox id="numFirstTicketAmount" title={this.t("numFirstTicketAmount")} parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        param={this.param.filter({ELEMENT:'numFirstTicketAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'numFirstTicketAmount',USERS:this.user.CODE})}
                                        onChange={(e)=>
                                            {
                                                if(this.numFirstTicketAmount.value == null)
                                                {
                                                    this.numFirstTicketAmount.value = 0
                                                }
                                            }}
                                            onValueChanged={(e)=>
                                            {
                                                if(e.value != null)
                                                {
                                                    this.numLastTicketAmount.value = e.value
                                                }
                                            }}>
                                    </NdNumberBox>
                                </Item>
                                {/* numLastTicketAmount */}
                                <Item>
                                    <Label text={this.t("numLastTicketAmount")} alignment="right" />
                                    <NdNumberBox id="numLastTicketAmount" title={this.t("numLastTicketAmount")} parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                        param={this.param.filter({ELEMENT:'numLastTicketAmount',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'numLastTicketAmount',USERS:this.user.CODE})}
                                        onChange={(e)=>
                                            {
                                                if(this.numLastTicketAmount.value == null)
                                                {
                                                    this.numLastTicketAmount.value = this.numFirstTicketAmount.value
                                                }
                                            }}>
                                    </NdNumberBox>
                                </Item>
                               {/* cmbPayType */}
                               <Item>
                                    <Label text={this.t("cmbPayType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPayType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={-1}
                                    data={{source:[{ID:-1,VALUE:this.t("cmbPayType.all")},{ID:0,VALUE:this.t("cmbPayType.esc")},{ID:1,VALUE:this.t("cmbPayType.cb")},{ID:2,VALUE:this.t("cmbPayType.check")},
                                    {ID:3,VALUE:this.t("cmbPayType.ticket")},{ID:4,VALUE:this.t("cmbPayType.bonD")},{ID:5,VALUE:this.t("cmbPayType.avoir")},{ID:6,VALUE:this.t("cmbPayType.virment")},
                                    {ID:7,VALUE:this.t("cmbPayType.prlv")}]}}
                                    param={this.param.filter({ELEMENT:'cmbPayType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbPayType',USERS:this.user.CODE})}
                                    />
                                </Item>
                                 {/* cmbUser */}
                               <Item>
                                    <Label text={this.t("cmbUser")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUser"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    showClearButton={true}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM USERS"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbUser',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbUser',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* txtTicketno */}
                                <Item>
                                    <Label text={this.t("txtTicketno")} alignment="right" />
                                    <NdTextBox id="txtTicketno" title={this.t("txtTicketno")} parent={this} simple={true} 
                                        param={this.param.filter({ELEMENT:'txtTicketno',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtTicketno',USERS:this.user.CODE})}
                                        onValueChanged={(e)=>
                                        {
                                        
                                        }}>
                                    </NdTextBox>
                                </Item>
                                {/* txtItem */}
                                <Item>                                    
                                    <Label text={this.t("txtItem")} alignment="right" />
                                    <NdTextBox id="txtItem" parent={this} simple={true} tabIndex={this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    showClearButton = {true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtItem.show()
                                                    this.pg_txtItem.onClick = (data) =>
                                                    {
                                                        this.txtItem.setState({value:data[0].CODE})  
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtItem',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtItem',USERS:this.user.CODE})}     
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtItem"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtItem.title")} 
                                    search={true}
                                    selection={{mode:"single"}} 
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,NAME FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) OR BARCODE LIKE @VAL",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                  
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* ckhDoublePay */}
                                <Item>
                                    <Label text={this.t("ckhDoublePay")} alignment="right" />
                                    <NdCheckBox id="ckhDoublePay" parent={this} defaultValue={false}
                                    param={this.param.filter({ELEMENT:'ckhDoublePay',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'ckhDoublePay',USERS:this.user.CODE})}/>
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
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSaleTicketReport" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            sorting={{ mode: 'single' }}
                            height={600}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                this.btnGetDetail(e.data.POS_GUID)
                                this.setState({ticketId:e.data.POS_ID})

                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DATE" caption={this.t("grdSaleTicketReport.clmDate")} visible={true} width={150}/> 
                                <Column dataField="TIME" caption={this.t("grdSaleTicketReport.clmTime")} visible={true} width={100}/> 
                                <Column dataField="USERS" caption={this.t("grdSaleTicketReport.slmUser")} visible={true} width={100}/>
                                <Column dataField="REF" caption={this.t("grdSaleTicketReport.clmRef")} visible={true} />  
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdSaleTicketReport.clmCustomer")} visible={true} width={250}/> 
                                <Column dataField="CUSTOMER" caption={this.t("grdSaleTicketReport.clmCardId")} visible={true} width={150}/> 
                                <Column dataField="DISCOUNT" caption={this.t("grdSaleTicketReport.clmDiscount")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="LOYALYT" caption={this.t("grdSaleTicketReport.clmLoyalyt")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="HT" caption={this.t("grdSaleTicketReport.clmHT")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TVA" caption={this.t("grdSaleTicketReport.clmVTA")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>  
                                <Column dataField="TTC" caption={this.t("grdSaleTicketReport.clmTTC")} visible={true} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>  
                                <Column dataField="POS_ID" caption={this.t("grdSaleTicketReport.clmTicketID")} visible={true} /> 
                                <Column dataField="FACT_REF" caption={this.t("grdSaleTicketReport.clmFacRef")} visible={true} />                                 
                            </NdGrid>
                        </div>
                    </div>
                    <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        >
                           <div className="row">
                         <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            {this.t("TicketId")} : {this.state.ticketId}
                            </div>
                         </div>
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            <NdGrid id="grdSaleTicketItems" parent={this} 
                                selection={{mode:"multiple"}} 
                                height={600}
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                               
                                >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                    <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="TIME" caption={this.t("grdSaleTicketItems.clmTime")} visible={true} width={150}/> 
                                    <Column dataField="BARCODE" caption={this.t("grdSaleTicketItems.clmBarcode")} visible={true} width={150}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdSaleTicketItems.clmName")} visible={true} width={250}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdSaleTicketItems.clmQuantity")} visible={true} width={100}/> 
                                    <Column dataField="PRICE" caption={this.t("grdSaleTicketItems.clmPrice")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                    <Column dataField="TOTAL" caption={this.t("grdSaleTicketItems.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                            </NdGrid>
                            </div>
                            <div className="col-3 ps-0">
                            <NdGrid id="grdSaleTicketPays" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowClick={async(e)=>
                                    {
                                        if(this.lastPosPayDt.length > 0)
                                        {
                                            this.rbtnTotalPayType.value = 0
                                            this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT'))
                                            this.txtPopLastTotal.value = this.lastPosSaleDt[0].GRAND_TOTAL;
                                            this.popLastTotal.show()
    
                                            //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                            setTimeout(() => 
                                            {
                                                this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                            }, 100);
                                        }
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="PAY_TYPE_NAME" caption={this.t("grdSaleTicketPays.clmPayName")} visible={true} width={155}/> 
                                    <Column dataField="LINE_TOTAL" caption={this.t("grdSaleTicketPays.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={150}/> 
                            </NdGrid>
                            </div>
                            </div>
                    </NdPopUp>
                    <div>
                        <NdPopUp parent={this} id={"popLastTotal"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popLastTotal.title")}
                        container={"#root"} 
                        width={"600"}
                        height={"700"}
                        position={{of:"#root"}}
                        onHiding={async()=>
                        {
                            await this.lastPosPayDt.refresh()
                        }}
                        >
                            <div className="row">
                                <div className="col-12">
                                    <div className="row pt-2">
                                        {/* Payment Type Selection */}
                                        <div className="col-2 pe-1">
                                            <NbRadioButton id={"rbtnTotalPayType"} parent={this} 
                                            button={[
                                                {
                                                    id:"btn01",
                                                    style:{height:'49px',width:'100%'},
                                                    icon:"fa-money-bill-1",
                                                    text:"ESC"
                                                },
                                                {
                                                    id:"btn02",
                                                    style:{height:'49px',width:'100%'},
                                                    icon:"fa-credit-card",
                                                    text:"CB"
                                                },
                                                {
                                                    id:"btn03",
                                                    style:{height:'49px',width:'100%'},
                                                    icon:"fa-rectangle-list",
                                                    text:"CHQ"
                                                },
                                                {
                                                    id:"btn04",
                                                    style:{height:'49px',width:'100%'},
                                                    icon:"fa-rectangle-list",
                                                    text:"CHQe"
                                                },
                                                {
                                                    id:"btn09",
                                                    style:{height:'49px',width:'100%'},
                                                    icon:"fa-brands fa-cc-amazon-pay",
                                                    text:"CB REST",
                                                    index:9
                                                }
                                            ]}/>
                                        </div>
                                        {/* Payment Grid */}
                                        <div className="col-10">
                                            {/* grdLastTotalPay */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <NdGrid parent={this} id={"grdLastTotalPay"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    showRowLines={true}
                                                    showColumnLines={true}
                                                    showColumnHeaders={false}
                                                    height={"138px"} 
                                                    width={"100%"}
                                                    dbApply={false}
                                                    selection={{mode:"single"}}
                                                    onRowPrepared={(e)=>
                                                    {
                                                        e.rowElement.style.fontSize = "16px";
                                                        e.rowElement.style.fontWeight = "bold";
                                                    }}
                                                    onRowRemoved={async (e) =>
                                                    {
                                                        
                                                    }}
                                                    >
                                                        <Editing confirmDelete={false}/>
                                                        <Column dataField="PAY_TYPE_NAME" width={200} alignment={"center"}/>
                                                        <Column dataField="AMOUNT" width={100} format={"#,##0.00"}/>  
                                                        <Column dataField="CHANGE" width={100} format={"#,##0.00"}/>                                                
                                                    </NdGrid>
                                                </div>
                                            </div>
                                            {/* lastPayRest */}
                                            <div className="row pt-1">
                                                <div className="col-12">
                                                    <p className="fs-2 fw-bold text-center m-0"><NbLabel id="lastPayRest" parent={this} value={"0.00"} format={"currency"}/></p>
                                                </div>
                                            </div>
                                            {/* txtPopLastTotal */}
                                            <div className="row pt-1">
                                                <div className="col-12">
                                                    <NdTextBox id="txtPopLastTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                    </NdTextBox> 
                                                </div>
                                            </div>                                        
                                        </div>
                                    </div>
                                    <div className="row pt-4">
                                        <div className="col-12">
                                            <div className="row">
                                            {/* T.R Detail */}
                                                <div className="col-3">
                                                    <NbButton id={"btnPopLastTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                    onClick={async ()=>
                                                    {
                                                        if(this.lastPosPayDt.where({PAY_TYPE:4}).length > 0)
                                                        {
                                                            let tmpDt = new datatable(); 
                                                            tmpDt.selectCmd = 
                                                            {
                                                                query : "SELECT AMOUNT AS AMOUNT,COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = @DOC GROUP BY AMOUNT",
                                                                param : ['DOC:string|50'],
                                                                local : 
                                                                {
                                                                    type : "select",
                                                                    from : "CHEQPAY_VW_01",
                                                                    where : {DOC : this.lastPosPayDt[0].POS_GUID},
                                                                    aggregate:{count: "AMOUNT"},
                                                                    groupBy: "AMOUNT",
                                                                }
                                                            }
                                                            tmpDt.selectCmd.value = [this.lastPosPayDt[0].POS_GUID]
                                                            await tmpDt.refresh();
                                                            
                                                            await this.grdLastTRDetail.dataRefresh({source:tmpDt});
                                                            this.popLastTRDetail.show()
                                                        }
                                                    }}>
                                                        {this.t("trDeatil")}
                                                    </NbButton>
                                                </div>
                                            {/* Line Delete */}
                                                <div className="col-3">
                                                    <NbButton id={"btnPopLastTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                    onClick={async()=>
                                                    {
                                                        if(this.grdLastTotalPay.devGrid.getSelectedRowKeys().length > 0)
                                                        {                                                        
                                                            this.grdLastTotalPay.devGrid.deleteRow(this.grdLastTotalPay.devGrid.getRowIndexByKey(this.grdLastTotalPay.devGrid.getSelectedRowKeys()[0]))
                                                            this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT'))
                                                            this.txtPopLastTotal.newStart = true;

                                                            //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                            setTimeout(() => 
                                                            {
                                                                this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                            }, 100);
                                                        }
                                                    }}>
                                                        {this.t("lineDelete")}
                                                    </NbButton>
                                                </div>
                                            {/* Cancel */}
                                                <div className="col-3">
                                                    <NbButton id={"btnPopLastTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                    onClick={()=>{this.popLastTotal.hide()}}>
                                                        {this.t("cancel")}
                                                    </NbButton>
                                                </div>
                                            {/* Okey */}
                                                <div className="col-3">
                                                    <NbButton id={"btnPopLastTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                    onClick={async()=>
                                                    {
                                                        let tmpTypeName = ""
                                                        let tmpAmount = Number(parseFloat(this.txtPopLastTotal.value).toFixed(2))
                                                        let tmpChange = Number(parseFloat(this.lastPosSaleDt[0].GRAND_TOTAL - (this.lastPosPayDt.sum('AMOUNT') + tmpAmount)).toFixed(2))

                                                        if(this.rbtnTotalPayType.value == 0)
                                                        {                                                        
                                                            tmpTypeName = "ESC"
                                                        }
                                                        else if(this.rbtnTotalPayType.value == 1)
                                                        {
                                                            tmpTypeName = "CB"
                                                        }
                                                        else if(this.rbtnTotalPayType.value == 2)
                                                        {
                                                            tmpTypeName = "CHQ"
                                                        }
                                                        else if(this.rbtnTotalPayType.value == 3)
                                                        {
                                                            tmpTypeName = "T.R"
                                                        }
                                                        else if(this.rbtnTotalPayType.value == 9)
                                                        {
                                                            tmpTypeName = "CB REST"
                                                        }
                                                            
                                                        if(tmpChange < 0)
                                                        {
                                                            if(this.rbtnTotalPayType.value == 0  && (this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT')) > 0)
                                                            {
                                                                tmpChange = tmpChange * -1
                                                                tmpAmount = this.txtPopLastTotal.value  //- tmpChange
                                                            }
                                                            else
                                                            {       
                                                                let tmpConfObj =
                                                                {
                                                                    id:'msgPayNotBigToPay',showTitle:true,title:this.lang.t("msgPayNotBigToPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:this.lang.t("msgPayNotBigToPay.btn01"),location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayNotBigToPay.msg")}</div>)
                                                                }
                                                                await dialog(tmpConfObj);
                                                                tmpAmount = (this.txtPopLastTotal.value  - tmpChange) * -1
                                                                tmpChange = 0
                                                            }
                                                        }
                                                        else
                                                        {
                                                            tmpChange = 0
                                                        }

                                                        if(tmpAmount > 0)
                                                        {
                                                            let tmpData = 
                                                            {
                                                                GUID : datatable.uuidv4(),
                                                                CUSER : this.core.auth.data.CODE,
                                                                POS_GUID : this.lastPosSaleDt[0].POS_GUID,
                                                                PAY_TYPE : this.rbtnTotalPayType.value,
                                                                PAY_TYPE_NAME : tmpTypeName,
                                                                LINE_NO : this.lastPosPayDt.length + 1,
                                                                AMOUNT : tmpAmount,
                                                                CHANGE : tmpChange
                                                            }
                                                            this.lastPosPayDt.push(tmpData)
                                                            this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 + Number.money.sign : Number(this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT'))
                                                            this.txtPopLastTotal.newStart = true;
                                                        }

                                                        //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                        setTimeout(() => 
                                                        {
                                                            this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                        }, 100);
                                                    }}>
                                                        <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                    </NbButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>  
                                    <div className="row pt-2">
                                        <div className="col-12">
                                            {this.t("payChangeNote")}
                                        </div>
                                    </div>
                                    <div className="row pt-1">
                                        <div className="col-12">
                                            {this.t("payChangeNote2")}
                                        </div>
                                    </div>
                                    <div className="row py-2">
                                        <div className="col-12">
                                            <NdTextBox id={"txtPayChangeDesc"} placeholder={this.t("txtPayChangeDescPlace")} parent={this} simple={true}/>       
                                        </div>
                                    </div>
                                    <div className="row pt-2">
                                        <div className="col-12">
                                            <NbButton id={"btnPopLastTotalSave"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                            onClick={async ()=>
                                            {
                                                if(this.lastPayRest.value > 0)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgMissingPay',showTitle:true,title:this.lang.t("msgMissingPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgMissingPay.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMissingPay.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }

                                                await this.lastPosPayDt.delete()
                                                await this.lastPosPayDt.update() 
                                                this.popLastTotal.hide()
                                                this.extraObj = new posExtraCls()
                                                let tmpExtra = {...this.extraObj.empty}
                                                this.extraObj.addEmpty(tmpExtra);
                                                this.extraObj.dt()[0].TAG = 'PAYMENT_CHANGE'
                                                this.extraObj.dt()[0].POS_GUID = this.lastPosPayDt[0].POS_GUID
                                                this.extraObj.dt()[0].DESCRIPTION = this.txtPayChangeDesc.value
                                                
                                                this.extraObj.save()
                                            }}>
                                                <i className="text-white fa-solid fa-floppy-disk" style={{fontSize: "24px"}} />
                                            </NbButton>
                                        </div>
                                    </div>       
                                                
                                </div>
                            </div>
                        </NdPopUp>
                        <div>
                            {/* Açık Fişler PopUp */}
                            <NdPopUp parent={this} id={"popOpenTike"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popOpenTike.title")}
                            container={"#root"} 
                            width={'900'}
                            height={'500'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <NdGrid parent={this} id={"grdOpenTike"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        filterRow={{visible:true}}
                                        height={350} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowDblClick={async(e)=>
                                        {
                                            this.btnGetDetail(e.data.GUID)
                                            this.setState({ticketId:e.data.TICKET_ID})
                                        }}
                                        onRowRemoved={async (e)=>{
                                        }}
                                        >
                                                <Scrolling mode="standart" />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="CUSER_NAME" caption={this.lang.t("grdOpenTike.clmUser")} width={110}  headerFilter={{visible:true}}/>
                                                <Column dataField="DEVICE" caption={this.lang.t("grdOpenTike.clmDevice")} width={60}  headerFilter={{visible:true}}/>
                                                <Column dataField="DATE" caption={this.lang.t("grdOpenTike.clmDate")} width={90} allowEditing={false} />
                                                <Column dataField="TICKET_ID" caption={this.lang.t("grdOpenTike.clmTicketId")} width={150}  headerFilter={{visible:true}}/>
                                                <Column dataField="TOTAL" caption={this.lang.t("grdOpenTike.clmTotal")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}} headerFilter={{visible:true}}/>
                                                <Column dataField="DESCRIPTION" caption={this.lang.t("grdOpenTike.clmDescription")} width={250}  headerFilter={{visible:true}}/>
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>          
                    </div>
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
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '71'"},sql:this.core.sql}}}
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
                                    value={localStorage.getItem('lang').toUpperCase()}
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                   data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                if(this.grdSaleTicketReport.devGrid.getSelectedRowsData().length > 0)
                                                {
                                                    App.instance.setState({isExecute:true})
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM POS_SALE_VW_01 WHERE POS_GUID = @POS_GUID ORDER BY LINE_NO " ,
                                                        param:  ['POS_GUID:string|50','DESIGN:string|25'],
                                                        value:  [this.grdSaleTicketReport.devGrid.getSelectedRowsData()[0].POS_GUID,this.cmbDesignList.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        App.instance.setState({isExecute:false})
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
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* Mail Send PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"mailPopup"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("mailPopup.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'600'}
                        position={{of:'#root'}}
                        deferRendering={false}
                       
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("mailPopup.cmbMailAddress")} alignment="right" />
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
                                    <Label text={this.t("mailPopup.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("mailPopup.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("mailPopup.txtMailHtmlEditor")}>
                                    </NdHtmlEditor>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className="col-12 px-1">
                                            <NbButton id={"btnMailSend"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                            onClick={async()=>
                                            {
                                                this._sendMail()
                                            }}>
                                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                            </NbButton>
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