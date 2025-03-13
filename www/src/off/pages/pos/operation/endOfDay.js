import React from 'react';
import App from '../../../lib/app.js';
import ReactWizard from 'react-bootstrap-wizard';
import moment from 'moment';

import { posEnddayCls } from '../../../../core/cls/pos.js';

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
import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { docCls} from "../../../../core/cls/doc.js"


import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class endOfDay extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls()
        this.enddayObj = new posEnddayCls()
        this.btnGetDetail = this.btnGetDetail.bind(this)
        this.message = ''
        this.Advance = 0
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.state={ticketId :""}
        this.tabIndex = props.data.tabkey

        this.reactWizardRef = React.createRef();

        this.finishButtonClick = this.finishButtonClick.bind(this)
        ReactWizard.defaultProps = 
        {
            validate: true,
            previousButtonText: this.t("previous"),
            finishButtonText: this.t("finish"),
            nextButtonText: this.t("next"),
            color: "primary",
            progressbar: false
        };

        this.steps = [
        {
            stepName: this.t("start"),
            stepIcon: "tim-icons icon-single-02",
            component: this.stepStart(),
        },
        {
            stepName: this.t("advance"),
            stepIcon: "tim-icons icon-settings-gear-63",
            component: this.stepAdvance(),
        },
        {
            stepName: this.t("cash"),
            stepIcon: "tim-icons icon-delivery-fast",
            component: this.stepCash()
        }, 
        {
            stepName: this.t("debitCard"),
            stepIcon: "tim-icons icon-settings-gear-63",
            component: this.stepCreditCard()
        },
        {
            stepName: this.t("check"),
            stepIcon: "tim-icons icon-settings-gear-63",
            component: this.stepCheck()
        },
        {
            stepName: this.t("ticketRest"),
            stepIcon: "tim-icons icon-settings-gear-63",
            component: this.stepRestorant()
        },
        {
            stepName: this.t("ticketCard"),
            stepIcon: "tim-icons icon-settings-gear-63",
            component: this.stepTicketCard()
        }];


        this.Cash = '';
        this.DebitCard = '';
        this.Check = '';
        this.TicketRest =  ''
        this.TicketCard = ''
        this.color =
        {
            cash :"green",
            card :"green",
            check :"green",
            rest :"green",
            ticket :"green",
        }
        this.paymentData = new datatable

        this.state = {
            ticketId: "",
        }
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.dtDocDate.value = moment(new Date()).format("YYYY-MM-DD")
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DATE,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET_ID, " + 
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
    }
    async btnGetDetail(pGuid)
    {
        this.lastPosSaleDt.selectCmd = 
        {
            query :  "SELECT * FROM POS_SALE_VW_01  WHERE POS_GUID = @POS_GUID ",
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
        await this.grdSaleTicketPays.dataRefresh({source:this.lastPosPayDt});

        this.popDetail.show()
    }
    async finishButtonClick()
    {
        this.message = this.txtAdvance.value.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        this.Advance = this.txtAdvance.value
        let tmpQuery = 
        {
            query : "SELECT   " +
                    "MAX(DOC_DATE) AS DOC_DATE,PAY_TYPE AS PAY_TYPE,TYPE AS TYPE,  " +
                    "PAY_TYPE_NAME AS PAY_TYPE_NAME,   " +
                    "CASE WHEN TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT) * -1 END AS AMOUNT   " +
                    "FROM POS_PAYMENT_VW_01 WHERE DOC_DATE = @DOC_DATE AND DEVICE = @DEVICE AND STATUS = 1   " +
                    "GROUP BY PAY_TYPE_NAME,PAY_TYPE,TYPE " ,
            param : ['DOC_DATE:date','DEVICE:string|50'],
            value : [this.dtDocDate.value,this.cmbSafe.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.paymentData.clear()
            for (let i = 0; i < tmpData.result.recordset.length; i++) 
            {
                this.paymentData.push(tmpData.result.recordset[i])
            }
        }
        if(parseFloat(this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2)) ==  parseFloat((this.txtCash.value - this.txtAdvance.value).toFixed(2)))
        {
            this.color.cash = "green"
            this.Cash = this.t("txtReal")
            this.setState({Cash:this.t("txtReal")})
        }
        else
        {
            let tmpCash
            tmpCash = (parseFloat((parseFloat(this.txtCash.value) - parseFloat(this.txtAdvance.value).toFixed(2))) - parseFloat((this.paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2))))
            let tmpCashValue
            if(tmpCash > 0)
            {
                this.color.cash = "blue"
                tmpCashValue = '+' + tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            else
            {
                this.color.cash = "red"
                tmpCashValue = tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            this.Cash = tmpCashValue
            this.setState({Cash:tmpCashValue})
        }

        if((this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT')).toFixed(2) ==  (this.txtCreditCard.value).toFixed(2))
        {
            this.color.card = "green"
            this.DebitCard = this.t("txtReal")
            this.setState({DebitCard:this.t("txtReal")})
        }
        else 
        {
            let tmpDebit = (this.txtCreditCard.value - parseFloat(this.paymentData.where({'PAY_TYPE':1}).sum('AMOUNT'))).toFixed(2)
            let tmpDebitValue
            if(tmpDebit > 0)
            {
                this.color.card = "blue"
                tmpDebitValue = '+' + tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            else
            {
                this.color.card = "red"
                tmpDebitValue = tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            this.DebitCard = tmpDebitValue
            this.setState({DebitCard:tmpDebitValue})
        }
        if(parseFloat((this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT')).toFixed(2)) ==  this.txtCheck.value)
        {
            this.color.check = "green"
            this.Check = this.t("txtReal")
            this.setState({Check:this.t("txtReal")})
        }
        else 
        {
            let tmpCheck = parseFloat((this.txtCheck.value - parseFloat(this.paymentData.where({'PAY_TYPE':2}).sum('AMOUNT'))).toFixed(2))
            let tmpCheckValue
            if(tmpCheck > 0)
            {
                this.color.check = "blue"
                tmpCheckValue = '+' + tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            else
            {
                this.color.check = "red"
                tmpCheckValue = tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            this.Check = tmpCheckValue
            this.setState({Check:tmpCheckValue})
        }

        if(parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT')) ==  this.txtRestorant.value)
        {
            this.color.rest = "green"
            this.TicketRest = this.t("txtReal")
            this.setState({TicketRest:this.t("txtReal")})
        }
        else 
        {
            let tmpTikcet = parseFloat((this.txtRestorant.value - parseFloat(this.paymentData.where({'PAY_TYPE':3}).sum('AMOUNT'))).toFixed(2))
            let tmpTicketValue
            if(tmpTikcet > 0)
            {
                this.color.rest = "blue"
                tmpTicketValue = '+' + tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            else
            {
                this.color.rest = "red"
                tmpTicketValue = tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
            }
            this.TicketRest = tmpTicketValue
            this.setState({TicketRest:tmpTikcet})
        }
        if(parseFloat(this.paymentData.where({'PAY_TYPE':9}).sum('AMOUNT')) ==  this.txtTicketCard.value)
            {
                this.color.ticket = "green"
                this.TicketCard = this.t("txtReal")
                this.setState({TicketCard:this.t("txtReal")})
            }
            else 
            {
                let tmpTicketCard = parseFloat((this.txtTicketCard.value - parseFloat(this.paymentData.where({'PAY_TYPE':9}).sum('AMOUNT'))).toFixed(2))
                let tmpTicketCardValue
                if(tmpTicketCard > 0)
                {
                    this.color.ticket = "blue"
                    tmpTicketCardValue = '+' + tmpTicketCard.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
                }
                else
                {
                    this.color.ticket = "red"
                    tmpTicketCardValue = tmpTicketCard.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
                }
                this.TicketCard = tmpTicketCardValue
                this.setState({TicketCard:tmpTicketCard})
            }

        

        this.popFinish.show()
    }
    stepStart()
    {
        return (
            <Form colCount={2}>
                <Item>
                    <Label text={this.t("dtDocDate")} alignment="right" />
                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                    onValueChanged={(async(e)=>
                    {
                        if(this.cmbSafe.value != '')
                        {
                            let tmpQuery = 
                            {
                                query : "SELECT ROUND((SUM(AMOUNT) - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 AS DOCOUT WHERE DOCOUT.OUTPUT = DOCIN.INPUT AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20),0)),2) AS AMOUNT FROM DOC_CUSTOMER_VW_01 AS DOCIN " + 
                                        "WHERE INPUT_CODE = @INPUT_CODE AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20 GROUP BY INPUT", 
                                param : ['INPUT_CODE:string|50'],
                                value : [this.cmbSafe.value]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery) 
                            
                            if(tmpData.result.recordset.length > 0)
                            {
                                this.txtAdvance.value = tmpData.result.recordset[0].AMOUNT 
                            }
                        }
                    }).bind(this)}
                    />
                </Item>
                <Item>
                    <Label text={this.t("cmbSafe")} alignment="right" />
                    <NdSelectBox simple={true} parent={this} id="cmbSafe" notRefresh = {true}
                    displayExpr="NAME"                       
                    valueExpr="CODE"
                    showClearButton={true}
                    value=""
                    data={{source:{select:{query : "SELECT NAME,CODE,GUID FROM [dbo].[SAFE_VW_01] WHERE TYPE = 2"},sql:this.core.sql}}}
                    param={this.param.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'cmbSafe',USERS:this.user.CODE})}
                    onValueChanged={(async(e)=>
                    {
                        let tmpQuery = 
                        {
                            query : "SELECT ROUND((SUM(AMOUNT) - ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 AS DOCOUT WHERE DOCOUT.OUTPUT = DOCIN.INPUT AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20),0)),2) AS AMOUNT FROM DOC_CUSTOMER_VW_01 AS DOCIN " + 
                                    "WHERE INPUT_CODE = @INPUT_CODE  AND TYPE = 2 AND DOC_TYPE = 201 AND PAY_TYPE = 20 GROUP BY INPUT", 
                            param : ['INPUT_CODE:string|50'],
                            value : [this.cmbSafe.value]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        if(tmpData.result.recordset.length > 0)
                        {
                            this.txtAdvance.value = tmpData.result.recordset[0].AMOUNT 
                        }
                    }).bind(this)}
                    />
                </Item>
            </Form>
        )
    }
    stepAdvance()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                        <Label text={this.t("txtAdvance")} alignment="right" />
                        <NdNumberBox id="txtAdvance" parent={this} simple={true} readOnly={true} 
                        param={this.param.filter({ELEMENT:'txtAdvance',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtAdvance',USERS:this.user.CODE})}
                        />
                </Item>
            </Form>
        )
    }
    stepCash()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                    <Label text={this.t("txtCash")} alignment="right" />
                    <NdNumberBox id="txtCash" parent={this} simple={true} 
                    readOnly={this.sysParam.filter({ID:'paymentWriteType',USERS:this.user.CODE}).getValue()}
                    param={this.param.filter({ELEMENT:'txtCash',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'txtCash',USERS:this.user.CODE})}
                    button={[
                        {
                            id:'001',
                            icon:'more',
                            onClick:async()=>
                            {
                                await this.popTotalCash.show()
                            }
                        }
                    ]}>
                    </NdNumberBox>
                </Item>
            </Form>
        )
    }
    stepCreditCard()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                    <Label text={this.t("txtCreditCard")} alignment="right" />
                    <NdNumberBox id="txtCreditCard" parent={this} simple={true}  
                    readOnly={this.sysParam.filter({ID:'paymentWriteType',USERS:this.user.CODE}).getValue()}
                    param={this.param.filter({ELEMENT:'txtCreditCard',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'txtCreditCard',USERS:this.user.CODE})}
                    button={[
                        {
                            id:'001',
                            icon:'more',
                            onClick:async()=>
                            {
                                await this.popTotalCreditCard.show()
                            }
                        }
                    ]}>
                    </NdNumberBox>
                </Item>
            </Form>      
        )
    }
    stepCheck()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                    <Label text={this.t("txtCheck")} alignment="right" />
                    <NdNumberBox id="txtCheck" parent={this} simple={true} 
                    param={this.param.filter({ELEMENT:'txtCheck',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'txtCheck',USERS:this.user.CODE})}
                    />
                </Item>
            </Form>      
        )
    }
    stepRestorant()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                    <Label text={this.t("txtRestorant")} alignment="right" />
                    <NdNumberBox id="txtRestorant" parent={this} simple={true}
                    param={this.param.filter({ELEMENT:'txtRestorant',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'txtRestorant',USERS:this.user.CODE})}
                    />
                </Item>
            </Form>      
        )
    }
    stepTicketCard()
    {
        return (
            <Form colCount={2}>
                <EmptyItem/>
                <Item>
                    <Label text={this.t("txtTicketCard")} alignment="right" />
                    <NdNumberBox id="txtTicketCard" parent={this} simple={true} 
                    param={this.param.filter({ELEMENT:'txtTicketCard',USERS:this.user.CODE})}
                    access={this.access.filter({ELEMENT:'txtTicketCard',USERS:this.user.CODE})}
                    />
                </Item>
            </Form>
        )
    }
    async safeTransfer()
    {
        this.enddayObj.clearAll()
        let tmpSafeQuery = 
        {
            query : "SELECT GUID FROM SAFE_VW_01 WHERE CODE = @INPUT_CODE",
            param : ['INPUT_CODE:string|50'],
            value : [this.cmbSafe.value]
        }
        let tmpSafeData = await this.core.sql.execute(tmpSafeQuery) 
        let tmpCodeSafe = tmpSafeData.result.recordset[0].GUID
        let tmpEndday = {...this.enddayObj.empty}
        tmpEndday.CASH = this.txtCash.value
        tmpEndday.CDATE = this.dtDocDate.value
        tmpEndday.CREDIT = this.txtCreditCard.value
        tmpEndday.CHECK = this.txtCheck.value
        tmpEndday.TICKET = this.txtRestorant.value
        tmpEndday.TICKETCARD = this.txtTicketCard.value
        tmpEndday.ADVANCE = this.txtAdvance.value
        tmpEndday.SAFE = tmpCodeSafe
        
        this.enddayObj.addEmpty(tmpEndday)
        this.enddayObj.save()
        let tmpQuery = 
        {
            query : "SELECT GUID FROM SAFE_VW_01 WHERE CODE = @INPUT_CODE",
            param : ['INPUT_CODE:string|50'],
            value : [this.cmbSafe.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpSafe = tmpData.result.recordset[0].GUID
        if(this.docObj.dt().length == 0)
        {
            this.docObj.addEmpty()
            this.docObj.dt()[0].TYPE = 2
            this.docObj.dt()[0].DOC_TYPE = 201
            this.docObj.dt()[0].REF = 'POS'
            this.docObj.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
            this.docObj.dt()[0].DOC_DATE = this.dtDocDate.value
            this.docObj.dt()[0].INPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
            this.docObj.dt()[0].OUTPUT =  tmpSafe
            this.docObj.dt()[0].AMOUNT = 0
            this.docObj.dt()[0].TOTAL = 0
        }
        // if(this.txtCash.value > 0)
        // {
            this.docObj.docCustomer.addEmpty()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  ''
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = tmpSafe 
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = Number(this.txtCash.value + this.txtAdvance.value).round(2)
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
        // }
        if(this.txtCreditCard.value > 0)
        {
            this.docObj.docCustomer.addEmpty()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'BankSafe',TYPE:1}).getValue()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 21
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtCreditCard.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
        }
        if(this.txtRestorant.value > 0)
        {
            this.docObj.docCustomer.addEmpty()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'TicketRestSafe',TYPE:1}).getValue()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtRestorant.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
        }
        if(this.txtCheck.value > 0)
        {
            this.docObj.docCustomer.addEmpty()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'CheckSafe',TYPE:1}).getValue()
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtCheck.value
            this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
        }
        if(this.txtTicketCard.value > 0)
            {
                this.docObj.docCustomer.addEmpty()
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'TicketCardSafe',TYPE:1}).getValue()
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 21
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtTicketCard.value
                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
            }

        this.docObj.docCustomer.addEmpty()
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT =tmpSafe
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopAdvance.value
        this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''

        this.docObj.dt()[0].AMOUNT = Number(this.txtAdvance.value + this.txtCash.value).round(2)
        this.docObj.dt()[0].TOTAL = Number(this.txtAdvance.value + this.txtCash.value).round(2)
        await this.docObj.save()
        let tmpConfObj =
        {
            id:'msgSucces',showTitle:true,title:this.t("msgSucces.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSucces.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSucces.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        
        if(pResult == 'btn01')
        { 
            this.reactWizardRef.current.setState(
            {
                currentStep: 0,
                nextButton: true,
                previousButton: false,
                finishButton: false,
                width: "16.666666666666668%",
            })
            this.txtCash.value = 0
            this.txtCreditCard.value = 0
            this.txtRestorant.value = 0
            this.txtTicketCard.value = 0
            this.txtCheck.value = 0
            this.cmbSafe.value = ''
        }
    }

    async saveTotalCash()
    {
        let total = this.txtAmountCash1.value  + 
                   this.txtAmountCash2.value + 
                   this.txtAmountCash3.value + 
                   this.txtAmountCash4.value + 
                   this.txtAmountCash5.value;
        this.Cash = total;
        this.txtCash.value = total;
        this.txtAmountCashTotal.value = total;
    }

    async saveTotalCreditCard()
    {
        let total = this.txtAmountCreditCard1.value + 
                   this.txtAmountCreditCard2.value + 
                   this.txtAmountCreditCard3.value +
                   this.txtAmountCreditCard4.value +
                   this.txtAmountCreditCard5.value;
        this.DebitCard = total;
        this.txtCreditCard.value = total;
        this.txtAmountCreditCardTotal.value = total;
    }

    render()
    {
        return(
            <div>
                <div className='panel'>
                    <div className={"panel-body container-fluid"}>
                        <div className={'row'}>
                            <div className={'col-12'}>
                            <ReactWizard ref={this.reactWizardRef} color={"green"} steps={this.steps} progressbar={true} title={this.t("title")} finishButtonClick={this.finishButtonClick}>
                            </ReactWizard>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <NdPopUp parent={this} id={"popTotalCash"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popTotalCash.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'420'}
                        position={{of:'#root'}}
                        deferRendering={false}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("txtAmountCash1")} alignment="right" />
                                    <NdNumberBox id="txtAmountCash1" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCash()
                                        
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCash2")} alignment="right" />
                                    <NdNumberBox id="txtAmountCash2" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCash()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCash3")} alignment="right" />
                                    <NdNumberBox id="txtAmountCash3" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCash()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label  text={this.t("txtAmountCash4")} alignment="right" />
                                    <NdNumberBox id="txtAmountCash4" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCash()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCash5")} alignment="right" />
                                    <NdNumberBox id="txtAmountCash5" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCash()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCashTotal")} alignment="right" />
                                    <NdNumberBox id="txtAmountCashTotal" parent={this} simple={true}
                                    readOnly={true}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnSaveTotalCash")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={async (e)=>
                                            {       
                                                this.popTotalCash.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnCancelTotalCash")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.txtAmountCash1.value = 0;
                                                this.txtAmountCash2.value = 0;
                                                this.txtAmountCash3.value = 0;
                                                this.txtAmountCash4.value = 0;
                                                this.txtAmountCash5.value = 0;
                                                this.txtCash.value = 0;
                                                this.Cash = 0;
                                                this.txtAmountCashTotal.value = 0;
                                                this.popTotalCash.hide();
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    <div>
                    <NdPopUp parent={this} id={"popTotalCreditCard"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popTotalCreditCard.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'420'}
                        position={{of:'#root'}}
                        deferRendering={false}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("txtAmountCreditCard1")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCard1" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCreditCard()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCreditCard2")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCard2" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCreditCard()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCreditCard3")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCard3" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCreditCard()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label  text={this.t("txtAmountCreditCard4")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCard4" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCreditCard()
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCreditCard5")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCard5" parent={this} simple={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.saveTotalCreditCard()
                                    }}/>    
                                </Item>
                                <Item>
                                    <Label text={this.t("txtAmountCreditCardTotal")} alignment="right" />
                                    <NdNumberBox id="txtAmountCreditCardTotal" parent={this} simple={true}
                                    readOnly={true}
                                    />    
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnSaveTotalCreditCard")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={async (e)=>
                                            {       
                                                this.popTotalCreditCard.hide(); 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnCancelTotalCreditCard")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.txtAmountCreditCard1.value = 0;
                                                this.txtAmountCreditCard2.value = 0;
                                                this.txtAmountCreditCard3.value = 0;
                                                this.txtAmountCreditCard4.value = 0;
                                                this.txtAmountCreditCard5.value = 0;
                                                this.txtCreditCard.value = 0;
                                                this.DebitCard = 0;
                                                this.txtAmountCreditCardTotal.value = 0;
                                                this.popTotalCreditCard.hide();
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>                {/* Finish PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popFinish"} 
                    visible={false}
                    showTitle={true}
                    title={this.t("popFinish.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'600'}
                    position={{of:'#root'}}
                    >
                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-6'>
                                    <h2>{this.t("cash")}</h2>
                                </div>
                                <div className='col-6' style={{color:this.color.cash}}>
                                    <h2> : {this.Cash}</h2>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <h2>{this.t("debitCard")}</h2>
                                </div>
                                <div className='col-6' style={{color:this.color.card}}>
                                    <h2> : {this.DebitCard}</h2>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <h2>{this.t("check")}</h2>
                                </div>
                                <div className='col-6' style={{color:this.color.check}}>
                                    <h2> : {this.Check}</h2>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <h2>{this.t("ticketRest")}</h2>
                                </div>
                                <div className='col-6' style={{color:this.color.rest}}>
                                    <h2> : {this.TicketRest}</h2>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <h2>{this.t("ticketCard")}</h2>
                                </div>
                                <div className='col-6' style={{color:this.color.ticket}}>
                                    <h2> : {this.TicketCard}</h2>
                                </div>
                            </div>
                            <div className='row px-4'>
                                <div className='col-12'>
                                    <h2>{this.t("advanceMsg1")}</h2>
                                </div>
                            </div>
                            <div className='row px-4'>
                                <div className='col-4 offset-4'>
                                    <h2>{this.message}</h2>
                                </div>
                            </div>
                            <div className='row px-4'>
                                <div className='col-12'>
                                    <h2>{this.t("advanceMsg2")}</h2>
                                </div>
                            </div>
                            <div>
                                <Form colCount={2}>
                                    <Item>
                                        <NdButton text={this.t("btnNotTrue")}
                                        onClick={async ()=>
                                        {       
                                            this.popFinish.hide()
                                        }}/>
                                    </Item>
                                    <Item>
                                        <NdButton text={this.t("addAdvance")}
                                        onClick={async ()=>
                                        {       
                                            this.popAdvance.show()
                                        }}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdPopUp>
                </div> 
                {/* Açık Fişler PopUp */}
                <div>
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
                {/* Avans PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popAdvance"} 
                    visible={false}
                    showTitle={true}
                    title={this.t("popAdvance.title")}
                    container={"#root"} 
                    width={'450'}
                    height={'250'}
                    position={{of:'#root'}}
                    >
                        <Form colCount={1} height={'fit-content'} id={"frmAdvances"}>
                            <Item>
                                <div className='row px-4'>
                                    <div className='col-12'>
                                        <h4>{this.t("popAdvance.msg")}</h4>
                                    </div>
                                </div>
                            </Item>
                            <Item>
                                <Label text={this.t("txtPopAdvance")} alignment="right" />
                                <NdNumberBox id="txtPopAdvance" parent={this} simple={true}>
                                    <Validator validationGroup={"frmAdvance" + this.tabIndex}>
                                        <RangeRule min={0.9} message={this.t("validPriceFloat")}/>
                                    </Validator>
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnPopAdd")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmAdvance" + this.tabIndex}
                                        onClick={async (e)=>
                                        {
                                            if(e.validationGroup.validate().status == "valid")
                                            {  
                                                if(this.txtPopAdvance.value == 0)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgZeroQuantity',showTitle:true,title:this.t("msgZeroQuantity.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgZeroQuantity.btn01"),location:'before'},{id:"btn02",caption:this.t("msgZeroQuantity.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgZeroQuantity.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        return
                                                    }
                                                }
                                                else if(this.txtPopAdvance.value > 1000)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgBigAmount',showTitle:true,title:this.t("msgBigAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgBigAmount.btn01"),location:'before'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBigAmount.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        return
                                                    }
                                                }
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT GUID FROM SAFE_VW_01 WHERE CODE = @INPUT_CODE",
                                                    param : ['INPUT_CODE:string|50'],
                                                    value : [this.cmbSafe.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                let tmpSafe = tmpData.result.recordset[0].GUID
                                            
                                                if(this.docObj.dt().length == 0)
                                                {
                                                    this.docObj.addEmpty()
                                                    this.docObj.dt()[0].TYPE = 2
                                                    this.docObj.dt()[0].DOC_TYPE = 201
                                                    this.docObj.dt()[0].REF = 'POS'
                                                    this.docObj.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
                                                    this.docObj.dt()[0].DOC_DATE = this.dtDocDate.value
                                                    this.docObj.dt()[0].INPUT = tmpSafe
                                                    this.docObj.dt()[0].OUTPUT = '00000000-0000-0000-0000-000000000000'
                                                    this.docObj.dt()[0].AMOUNT =  Number(this.txtAdvance.value + this.txtCash.value).round(2)
                                                    this.docObj.dt()[0].TOTAL = Number(this.txtAdvance.value + this.txtCash.value).round(2)
                                                }
                                                
                                                this.docObj.docCustomer.addEmpty()
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].TYPE = 2
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_GUID = this.docObj.dt()[0].GUID
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_TYPE = 201
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DOC_DATE = this.dtDocDate.value
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF = 'POS'
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].REF_NO = this.docObj.dt()[0].REF_NO
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT = tmpSafe
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].INPUT_NAME =  this.cmbSafe.displayValue
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].PAY_TYPE = 20
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].AMOUNT = Number(this.txtCash.value).round(2)
                                                this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length-1].DESCRIPTION = ''
                                                
                                                this.safeTransfer()
                                                this.popAdvance.hide()
                                                this.popFinish.hide()
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
                {/* Detay Popup */}
                <div>
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
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menuOff.pos_02_001")} enabled={true} allowExportSelectedData={true} />
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
                </div>
            </div>
        )
    }
}
