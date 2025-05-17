import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls,docCustomerCls,deptCreditMatchingCls } from '../../../../core/cls/doc.js';
import { payPlanCls,payPlanMatchingCls } from '../../../../core/cls/payPlan.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class collection extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.deptCreditMatchingObj = new deptCreditMatchingCls();
        this.deptCreditMatchingObj.lang = this.lang;
        this.deptCreditMatchingObj.type = 1
        this.payPlanMatchingObj = new payPlanMatchingCls();
        this.payPlanMatchingObj.lang = this.lang;
        this.tabIndex = props.data.tabkey
        
        this._calculateTotal = this._calculateTotal.bind(this)
        this._addPayment = this._addPayment.bind(this)
        this._btnCloseInvoice = this._btnCloseInvoice.bind(this)

        this.docLocked = false;        

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            setTimeout(() => {
                this.getDoc(this.pagePrm.GUID,'',-1)
            }, 1000);
        }
    }
    
    async init()
    {
        this.docObj.clearAll()
        this.deptCreditMatchingObj.clearAll()
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
                this.btnNew.setState({disabled:true});
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
            this.btnSave.setState({disabled:false});
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
        tmpDoc.DOC_TYPE = 200
        tmpDoc.INPUT = '00000000-0000-0000-0000-000000000000'
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmCollection.option('disabled',false)
        await this.grdDocPayments.dataRefresh({source:this.docObj.docCustomer.dt('DOC_CUSTOMER')});
        
        if(this.sysParam.filter({ID:'invoicesForPayment',USERS:this.user.CODE}).getValue().value == true)
        {
            this.numCash.readOnly = true
        }
        else
        {
            this.numCash.readOnly = false
        }
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:200});
        console.log("this.docObj.dt()",this.docObj.dt()[0])
        await this.deptCreditMatchingObj.load({PAID_DOC:this.docObj.dt()[0].GUID,PAYING_DOC:this.docObj.dt()[0].GUID})
        
        // Ödemelerle eşleşen fatura bilgilerini al
        let tmpQuery = 
        {
            query : "SELECT " +
                    "(SELECT REF FROM DOC_CUSTOMER_VW_01 WHERE GUID = (SELECT PAID_DOC FROM DEPT_CREDIT_MATCHING WHERE PAYING_DOC = DC.GUID)) AS DOC_REF, " +
                    "(SELECT REF_NO FROM DOC_CUSTOMER_VW_01 WHERE GUID = (SELECT PAID_DOC FROM DEPT_CREDIT_MATCHING WHERE PAYING_DOC = DC.GUID)) AS DOC_REF_NO, " +
                    "DC.GUID " +
                    "FROM DOC_CUSTOMER AS DC " +
                    "WHERE DC.DOC_GUID = @DOC_GUID",
            param : ['DOC_GUID:string|50'],
            value : [pGuid]
        }
        
        let tmpData = await this.core.sql.execute(tmpQuery)
        
        // Eşleşen belge bilgilerini inceliyoruz
        if(tmpData.result.recordset.length > 0)
        {
            for(let i = 0; i < this.docObj.docCustomer.dt().length; i++)
            {
                let paymentRow = this.docObj.docCustomer.dt()[i];
                let matchingDoc = tmpData.result.recordset.find(item => item.GUID === paymentRow.GUID);
                
                if(matchingDoc)
                {
                    // Satıra MATCHED_DOC özelliğini ekle
                    paymentRow.MATCHED_DOC = matchingDoc.DOC_REF + "-" + matchingDoc.DOC_REF_NO;
                }
            }
        }
        
        App.instance.setState({isExecute:false})

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
            this.frmCollection.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmCollection.option('disabled',false)
        }
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
        this.docObj.dt()[0].AMOUNT = this.docObj.docCustomer.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docCustomer.dt().sum("AMOUNT",2)
    }
    async _addPayment(pType,pAmount)
    {
        if(pAmount > 0)
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
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }
            else if (pType == 1)
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.DOC_DATE = this.checkDate.value
                tmpDocCustomer.PAY_TYPE = 1
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value

                let tmpCheck = {...this.docObj.checkCls.empty}
                tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                tmpCheck.REF = this.checkReference.value
                tmpCheck.DOC_DATE =  this.checkDate.value
                tmpCheck.CHECK_DATE =  this.checkDate.value
                tmpCheck.CUSTOMER =   this.docObj.dt()[0].OUTPUT
                tmpCheck.AMOUNT =  pAmount
                tmpCheck.SAFE =  this.cmbCashSafe.value
                this.docObj.checkCls.addEmpty(tmpCheck)
            }
            else
            {
                tmpDocCustomer.INPUT = this.cmbCashSafe.value
                tmpDocCustomer.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpDocCustomer.PAY_TYPE = pType
                tmpDocCustomer.AMOUNT = pAmount
                tmpDocCustomer.DESCRIPTION = this.cashDescription.value
            }

            this.docObj.docCustomer.addEmpty(tmpDocCustomer)
            // BORC ALACAK EŞLEŞMESİ İÇİN YAPILDI.*****************************************/
            let tmpDCPaidDt = this.deptCreditMatchingObj.popUpList.where({REMAINDER: {'>' : 0}}).where({TYPE : 1})
            if(tmpDCPaidDt.length > 0)
            {
                tmpDCPaidDt.push
                (
                    {
                        LDATE : moment(new Date()),
                        TYPE : tmpDocCustomer.TYPE,
                        DOC_DATE : tmpDocCustomer.DOC_DATE,
                        CUSTOMER_GUID : tmpDocCustomer.OUTPUT,
                        DOC : this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length - 1].GUID,
                        REMAINDER : pAmount * -1,
                    }
                )
                await this.deptCreditMatchingObj.matching(tmpDCPaidDt)
                if(this.deptCreditMatchingObj.popUpList.length > 0 )
                {
                    let payingRow = this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length - 1];
                    payingRow.MATCHED_DOC = this.deptCreditMatchingObj.popUpList[0].DOC_REF + "-" + this.deptCreditMatchingObj.popUpList[0].DOC_REF_NO;
                }
            }
            /******************************************************************************/

            let tmpPayDCPaidDt = this.payPlanMatchingObj.popUpList.where({AMOUNT: {'>' : 0}})
            if(tmpPayDCPaidDt.length > 0)
            {
                tmpPayDCPaidDt.push
                (
                    {
                        LDATE : moment(new Date()),
                        TYPE : 0,
                        DOC_DATE : tmpDocCustomer.DOC_DATE,
                        CUSTOMER_GUID : tmpDocCustomer.OUTPUT,
                        DOC : this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length - 1].GUID,
                        REMAINDER : pAmount * -1,
                    }
                )
                await this.payPlanMatchingObj.matching(tmpPayDCPaidDt)
                if(this.payPlanMatchingObj.popUpList.length > 0 && this.payPlanMatchingObj.popUpList[0].REF && this.payPlanMatchingObj.popUpList[0].REF_NO)
                {
                    let payingRow = this.docObj.docCustomer.dt()[this.docObj.docCustomer.dt().length - 1];
                    payingRow.MATCHED_DOC = this.payPlanMatchingObj.popUpList[0].REF + "-" + this.payPlanMatchingObj.popUpList[0].REF_NO;
                }
            }
            /******************************************************************************/
            this._calculateTotal()
        }
    }
    async _btnCloseInvoice(pCustomer)
    {
        let tmpQuery = 
        {
            query : "SELECT " +
            "(SELECT VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](DOC.TYPE,DOC.DOC_TYPE,DOC.REBATE,DOC.PAY_TYPE)) AND LANG = 'TR') AS DOC_TYPE," +
            "DOC.REF,DOC.REF_NO, " +
            "DOC.DOC_DATE," +
            "DOC.AMOUNT, " +
            "DEPT.PAYING_AMOUNT " +
            "FROM DOC_CUSTOMER_VW_01 AS DOC " +
            "LEFT OUTER JOIN [DEPT_CREDIT_MATCHING] AS DEPT ON DOC.GUID = DEPT.PAID_DOC " +
            "WHERE DEPT.PAYING_DOC = @pCustomer " +
            "UNION ALL " +
            "SELECT " +
            "(SELECT VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](DOC.TYPE,DOC.DOC_TYPE,DOC.REBATE,DOC.PAY_TYPE)) AND LANG = 'TR') AS DOC_TYPE," +
            "DOC.REF,DOC.REF_NO, " +
            "DOC.DOC_DATE," +
            "DOC.AMOUNT, " +
            "DEPT.PAYING_AMOUNT " +
            "FROM DOC_CUSTOMER_VW_01 AS DOC " +
            "LEFT OUTER JOIN [DEPT_CREDIT_MATCHING] AS DEPT ON DOC.GUID = DEPT.PAID_DOC " +
            "WHERE DEPT.PAYING_DOC = (SELECT TOP 1 PAID_DOC FROM [DEPT_CREDIT_MATCHING] WHERE PAYING_DOC = @pCustomer) " +
            "AND DOC.PAY_TYPE = -1",
            param : ['pCustomer:string|50'],
            value : [pCustomer]
        }
        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0)
        {
            await this.grdPopCloseInvoice.dataRefresh({source: tmpData.result.recordset});
            this.popCloseInvoice.show()
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmCollection"  + this.tabIndex}
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
                                                    await this.deptCreditMatchingObj.save()
                                                    await this.payPlanMatchingObj.save()  
                                                    if(this.deptCreditMatchingObj.dt().length > 0)
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query : "UPDATE DOC_INSTALLMENT SET STATUS = 1 WHERE FAC_GUID = @FAC_GUID",
                                                            param : ['FAC_GUID:string|50'],
                                                            value : [this.deptCreditMatchingObj.dt().where({TYPE : 1})[0].PAY_PLAN_DOC_GUID]
                                                        }
                                                        await this.core.sql.execute(tmpQuery)
                                                    }
                                                    
                                                    if(this.payPlanMatchingObj.dt().length > 0)
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query : "UPDATE DOC_INSTALLMENT SET STATUS = 1 WHERE GUID = @GUID",
                                                            param : ['GUID:string|50'],
                                                            value : [this.payPlanMatchingObj.dt().where({TYPE : 1})[0].PAY_PLAN_GUID]
                                                        }
                                                        await this.core.sql.execute(tmpQuery)
                                                    }
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                    this.init();
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
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
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

                                            this.deptCreditMatchingObj.dt().removeAll()
                                            await this.deptCreditMatchingObj.dt().delete()

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
                                            await this.docObj.save()
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
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else
                                        {
                                            this.popPassword.show()
                                            this.txtPassword.value = ''
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
                            <Form colCount={3} id={"frmCollection"  + this.tabIndex}>
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
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 200 AND REF = @REF ",
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
                                            <Validator validationGroup={"frmCollection"  + this.tabIndex}>
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
                                            <Validator validationGroup={"frmCollection"  + this.tabIndex}>
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
                                    data={{source:{select:{query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 200"},sql:this.core.sql}}}
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
                               {/* dtDocDate */}
                               <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                        {
                                            
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmCollection"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
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
                                                                this.txtRef.value = data[0].CODE;
                                                                this.txtRef.props.onChange()
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
                                        <Validator validationGroup={"frmCollection"  + this.tabIndex}>
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
                                this.frmCollection = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add" text={this.t("btnCash")}
                                    validationGroup={"frmCollection"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.numCash.setState({value:0});
                                            this.cashDescription.setState({value:''});
                                            this.popCash.show()
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
                                <Item colSpan={1}>
                                    <React.Fragment>
                                        <NdGrid parent={this} id={"grdDocPayments"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'500'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowDblClick={async(e)=>
                                        {
                                            this._btnCloseInvoice(e.data.GUID)
                                        }}
                                        onRowUpdating={async(e)=>{      
                                            if(this.deptCreditMatchingObj.popUpList.length > 0)
                                            {
                                                e.cancel = true
                                                let tmpConfObj =
                                                {
                                                    id:'msgRowNotUpdate',showTitle:true,title:this.t("msgRowNotUpdate.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgRowNotUpdate.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRowNotUpdate.msg")}</div>)
                                                }
                                            
                                                dialog(tmpConfObj);
                                                e.component.cancelEditData()
                                            }                                            
                                            
                                            this._calculateTotal()
                                        }}
                                        onRowRemoved={async (e)=>{
                                            this._calculateTotal()
                                            await this.docObj.save()
                                        }}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="infinite" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                            <Export fileName={this.lang.t("menuOff.fns_02_002")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdDocPayments.clmCreateDate")} width={200} allowEditing={false}/>
                                            <Column dataField="INPUT_NAME" caption={this.t("grdDocPayments.clmInputName")} allowEditing={false}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdDocPayments.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                            <Column dataField="DESCRIPTION" caption={this.t("grdDocPayments.clmDescription")} />
                                            <Column dataField="DOC_DATE" caption={this.t("grdDocPayments.clmDocDate")}  dataType="date" 
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                            <Column caption={this.t("grdDocPayments.clmMatchedDoc")} 
                                                cellRender={(e) => 
                                                {
                                                    if(this.deptCreditMatchingObj.popUpList.length > 0)
                                                    {
                                                        let matchedDoc = this.deptCreditMatchingObj.popUpList[0].DOC_REF + "-" + this.deptCreditMatchingObj.popUpList[0].DOC_REF_NO;

                                                        if (!e.data.MATCHED_DOC) {
                                                            e.data.MATCHED_DOC = matchedDoc;
                                                        }
                                                        
                                                        return e.data.MATCHED_DOC;
                                                    }
                                                    if(e.data.MATCHED_DOC) {
                                                        return e.data.MATCHED_DOC;
                                                    }
                                                    
                                                    return "";
                                                }}
                                                allowEditing={false}/>
                                        </NdGrid>
                                        <ContextMenu
                                        dataSource={this.rightItems}
                                        width={200}
                                        target="#grdDocPayments"
                                        onItemClick={(async(e)=>
                                        {
                                        }).bind(this)} />
                                    </React.Fragment>     
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id={"frmCollection"  + this.tabIndex}>                            
                                {/* TOPLAM */}
                                <EmptyItem colSpan={3}/>
                                <Item>
                                <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTotal',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
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
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbCashSafe */}
                                <Item>
                                    <Label text={this.t("cmbCashSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCashSafe"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("cash")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="numCash" parent={this} simple={true} maxLength={32}
                                        param={this.param.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                                <RangeRule min={0.1} message={this.t("ValidCash")} />
                                            </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="cashDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'cashDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cashDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("invoiceSelect")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {   
                                                await this.deptCreditMatchingObj.showPopUp(this.docObj.dt()[0].OUTPUT)
                                                this.numCash.value = Number(this.deptCreditMatchingObj.popUpList.sum('REMAINDER')).round(2)
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("installmentSelect")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async (e)=>
                                            {  
                                                this.payPlanMatchingObj.clearAll();
                                                await this.payPlanMatchingObj.showPopUp(this.docObj.dt()[0].OUTPUT)
                                                this.numCash.value = Number(this.payPlanMatchingObj.popUpList[0].AMOUNT)
                                                this.numCash.readOnly = true
                                                if(this.payPlanMatchingObj.popUpList[0].STATUS == 1)
                                                {
                                                    this.numCash.value = 0
                                                }
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
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                    {/* Check PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popCheck"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCheck.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'260'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("checkReference")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="checkReference" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'checkReference',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'checkReference',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                        <Label text={this.t("checkDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"checkDate"}
                                        onValueChanged={(async()=>
                                        {
                                                
                                        }).bind(this)}
                                        >
                                        </NdDatePicker>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCheck.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                this._addPayment(1,this.numCash.value)
                                                this.popCheck.hide(); 
                                                this.popCash.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popCheck.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    {/* Close Invoice PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popCloseInvoice"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCloseInvoice.title")}
                        container={"#root"} 
                        width={'1200'}
                        height={'360'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdPopCloseInvoice"} 
                                            height={'100%'} 
                                            width={'100%'}
                                            showBorders={true}
                                            selection={{mode:"multiple"}}
                                            onSelectionChanged={(e)=>
                                            {
                                                e.component.refresh(true);
                                            }}
                                            >
                                                <Column dataField="REF" caption={this.lang.t("popDeptCreditList.clmRef")} width={80}/>
                                                <Column dataField="REF_NO" caption={this.lang.t("popDeptCreditList.clmRefNo")} width={100}/>
                                                <Column dataField="DOC_TYPE" caption={this.lang.t("popDeptCreditList.clmTypeName")} width={100}/>
                                                <Column dataField="DOC_DATE" caption={this.lang.t("popDeptCreditList.clmDate")} width={100} dataType={"date"} defaultSortOrder="asc"/>
                                                <Column dataField="AMOUNT" caption={this.lang.t("popDeptCreditList.clmTotal")} width={100} />
                                                <Column dataField="PAYING_AMOUNT" caption={this.lang.t("popDeptCreditList.clmClosed")} width={100} />
                                                <Summary calculateCustomSummary={(options) =>
                                                {
                                                    if (options.name === 'SelectedRowsSummary') 
                                                    {
                                                        if (options.summaryProcess === 'start') 
                                                        {
                                                            options.totalValue = 0;
                                                        } 
                                                        else if (options.summaryProcess === 'calculate') 
                                                        {
                                                            if (options.component.isRowSelected(options.value)) 
                                                            {
                                                                options.totalValue += Number(options.value.PAYING_DAY).round(2);
                                                            }
                                                        }
                                                    }
                                                }}>
                                                    <TotalItem name="SelectedRowsSummary" summaryType="custom" valueFormat={{ style: "currency", currency:Number.money.code,precision: 3}} displayFormat="Sum: {0}" showInColumn="REMAINDER" />
                                                </Summary>
                                            </NdGrid>
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