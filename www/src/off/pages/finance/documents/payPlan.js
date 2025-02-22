import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls,docCustomerCls,deptCreditMatchingCls } from '../../../../core/cls/doc.js';
import { payPlanCls } from '../../../../core/cls/PayPlanCls.js';

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
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class payPlan extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.payPlanObj = new payPlanCls();

        this.docObj.lang = this.lang
        this.docObj.type = 1
        this.payPlanObj.lang = this.lang
        this.payPlanObj.type = 1
        this.tabIndex = props.data.tabkey        

        this.docLocked = false;    
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.payPlanObj.clearAll()
            await this.payPlanObj.load({DOC_GUID:this.pagePrm.DOC_GUID});
            this.grdInstallment.dataRefresh({source:this.payPlanObj.dt()})  
        }
    }
    async init()
    {
        console.log("init")
        this.payPlanObj.clearAll()
        console.log(this.payPlanObj.dt())

        this.payPlanObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.payPlanObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.payPlanObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.payPlanObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })
        this.txtRef.readOnly = true;
        this.txtRef.setState({value:''})
    
        this.txtRefno.readOnly = false;
        this.txtRefno.setState({value:''})

        this.dtDocDate.value =  moment(new Date()).format("YYYY-MM-DD"),
        console.log(this.dtDocDate.value)
        
        this.txtCustomerCode.setState({value:''})
        this.txtCustomerName.setState({value:''})
        this.docLocked = false

    }
    async checkRow()
    {
        for (let i = 0; i < this.payPlanObj.dt().length; i++) 
        {
            this.payPlanObj.dt()[i].DOC_DATE = this.dtDocDate.value
            this.payPlanObj.dt()[i].REF_NO = this.txtRefno.value
            console.log(this.payPlanObj.dt()[i].DOC_DATE)
            console.log(this.payPlanObj.dt()[i].REF_NO)
        }
    }
    async _addInstallment(pDate,pAmount,pNo,pFacRef,pFacRefNo,pFacGuid,pTotalAmount,pDocGuid)
    {
        let tmpPayPlan = {...this.payPlanObj.empty}
        tmpPayPlan.FAC_GUID = pFacGuid
        tmpPayPlan.TOTAL = pTotalAmount

        tmpPayPlan.INSTALLMENT_DATE = pDate

        tmpPayPlan.DOC_GUID = pDocGuid
        tmpPayPlan.DOC_DATE = this.dtDocDate.value
        tmpPayPlan.CUSTOMER_GUID = this.tmpCustomerGuid
        tmpPayPlan.CUSTOMER_CODE = this.txtCustomerCode.value
        tmpPayPlan.CUSTOMER_NAME = this.txtCustomerName.value
        tmpPayPlan.REF_NO = pFacRefNo
        tmpPayPlan.INSTALLMENT_NO = pNo 
        tmpPayPlan.REF = pFacRef
        tmpPayPlan.AMOUNT = pAmount 

        console.log(tmpPayPlan)
        this.payPlanObj.addEmpty(tmpPayPlan)
        this.grdInstallment.dataRefresh({source:this.payPlanObj.dt()})  

    }
    async checkDoc(pRef,pRefNo)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '' && pRefNo !== '')
            {
                let tmpData = await new payPlanCls().load({REF:pRef,REF_NO:pRefNo});

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
                        this.getDoc(tmpData[0].DOC_GUID)
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
    async getDoc(pDocGuid)
    {
        this.payPlanObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.payPlanObj.load({DOC_GUID:pDocGuid});

        App.instance.setState({isExecute:false})

        this.tmpFacGuid = this.payPlanObj.dt()[0].FAC_GUID
        this.tmpFacRef = this.payPlanObj.dt()[0].REF
        this.tmpFacRefNo = this.payPlanObj.dt()[0].REF_NO
        this.tmpDocGuid = this.payPlanObj.dt()[0].DOC_GUID
        console.log(this.tmpDocGuid)

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = false
        
        this.docLocked = false
        this.grdInstallment.dataRefresh({source:this.payPlanObj.dt()})  
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
                    query: "SELECT * FROM DOC_CUSTOMER_VW_01 " +
                    "WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND "+ 
                    "((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))  " +
                    "AND TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0 " +
                    "AND INSTALLMENT_STATUS = 0 " +
                    "ORDER BY DOC_DATE DESC,REF_NO DESC",
                    param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.txtCustomerCode.value,this.dtFirst.startDate,this.dtFirst.endDate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdPopInstallment.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.tmpDocGuid = ''
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" 
                                    onClick={async (e)=>
                                    {
                                        console.log(this.payPlanObj.dt())
                                        if(this.payPlanObj.dt().length > 0)
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
                                                
                                                if((await this.payPlanObj.save()) == 0 && this.txtRefno.value != '')
                                                {
                                                    await this.payPlanObj.save()
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
                                            this.tmpDocGuid = ''
                                            console.log(this.payPlanObj.dt())
                                            this.payPlanObj.dt().removeAll()
                                            await this.payPlanObj.dt().delete()
                                            this.init()
                                        }
                                        
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
                            <Form colCount={3} id={"frmPayPlan"  + this.tabIndex}> 
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.payPlanObj.dt(),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC_INSTALLMENT_VW_01  WHERE REF = @REF GROUP BY REF ",
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
                                            <Validator validationGroup={"frmPayPlan"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.payPlanObj.dt(),field:"REF_NO"}}
                                            readOnly={false}
                                            onValueChanged={(async(e)=>
                                            {
                                                console.log(e)
                                                await this.checkRow()
                                            }).bind(this)}
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
                                                                    console.log(data[0])
                                                                    this.getDoc(data[0].DOC_GUID)
                                                                }
                                                            }
                                                                   
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'arrowdown',
                                                        onClick:async()=>
                                                        {
                                                            console.log(this.txtRefno.value)
                                                            this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                            await this.checkRow()
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpResult = await this.checkDoc(this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmPayPlan"  + this.tabIndex}>
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
                                    data={{source:{select:{query : "SELECT DOC_GUID,FAC_GUID,REF,REF_NO,MIN(INSTALLMENT_DATE) AS DATE,TOTAL,MAX(INSTALLMENT_NO) AS PAY_PLAN,CUSTOMER_NAME,CUSTOMER_CODE FROM DOC_INSTALLMENT_VW_01 GROUP BY DOC_GUID,FAC_GUID,REF,REF_NO,TOTAL,CUSTOMER_NAME,CUSTOMER_CODE"},sql:this.core.sql}}}
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
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={120} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={120} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("pg_Docs.clmCustomerName")} width={120} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_CODE" caption={this.t("pg_Docs.clmCustomerCode")} width={120} defaultSortOrder="asc" />
                                        <Column dataField="PAY_PLAN" caption={this.t("pg_Docs.clmInstallmentNo")} width={150} defaultSortOrder="asc" />
                                        <Column dataField="DATE" caption={this.t("pg_Docs.clmInstallmentDate")} width={200}  dataType="datetime" format={"dd/MM/yyyy"} defaultSortOrder="asc" />
                                        <Column dataField="TOTAL" caption={this.t("pg_Docs.clmTotal")} width={100} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.payPlanObj.dt(),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        await this.checkRow()
                                        console.log(this.dtDocDate.value)
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPayPlan" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />   
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} dt={{data:this.payPlanObj.dt(),field:"REF"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    value={this.tmpDocCode}
                                    onEnterKey={(async()=>
                                    {
                                        if(this.payPlanObj.dt().length > 0)
                                        {
                                            console.log(this.payPlanObj.dt())
                                            this.txtCustomerCode.readOnly = true
                                            return
                                        }
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.value = data[0].CODE
                                                this.txtCustomerName.value = data[0].TITLE
                                                this.txtRef.value = data[0].CODE
                                            }
                                        }
                                    }).bind(this)}
                                    button={[
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                if(this.payPlanObj.dt().length > 0)
                                                {
                                                    console.log(this.payPlanObj.dt())
                                                    this.txtCustomerCode.readOnly = true
                                                    return
                                                }
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.value = data[0].CODE
                                                        this.txtCustomerName.value = data[0].TITLE
                                                        this.txtRef.value = data[0].CODE
                                                    }
                                                }
                                            }
                                        }
                                    ]}
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
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
                                    title={this.t("pg_txtCustomerCode.title")}
                                    search={true}
                                    data = {{
                                        source:{
                                            select:{
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}>
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                    </NdPopGrid>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} dt={{data:this.payPlanObj.dt(),field:"CUSTOMER_NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* btnInstallment */}
                                <Item>
                                    <NdButton text={this.t("btnInstallment")} type="normal" stylingMode="contained" width={'35%'}
                                    onClick={async ()=>
                                    {
                                        if(this.payPlanObj.dt().length > 0)
                                        {
                                            this.btnInstallment.readOnly = true
                                            return
                                        }
                                        if(this.txtCustomerCode.value == '' || this.txtCustomerCode.value == undefined) {
                                            let tmpConfObj =
                                            {
                                                id:'msgCustomerNotSelected',showTitle:true,title:this.t("msgCustomerNotSelected.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgCustomerNotSelected.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerNotSelected.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return;
                                        }
                                        await this.popInstallment.show()
                        
                                    }}/>
                                </Item> 
                                {/* btnInstallmentCount */}
                                <Item>
                                    <NdButton text={this.t("btnInstallmentCount")} type="normal" stylingMode="contained" width={'35%'}
                                    onClick={async ()=>
                                    {
                                        if(this.tmpFacGuid == '' || this.tmpFacGuid == undefined || this.txtRefno.value == '') {
                                            let tmpConfObj =
                                            {
                                                id:'msgFactureNotSelected',showTitle:true,title:this.t("msgFactureNotSelected.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgFactureNotSelected.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgFactureNotSelected.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return;
                                        }
                                        if(this.tmpDocGuid != '' && this.tmpDocGuid != undefined)
                                        {
                                            console.log(this.tmpDocGuid)
                                            let tmpConfObj =
                                            {
                                                id:'msgPayPlanNotSelected',showTitle:true,title:this.t("msgPayPlanNotSelected.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgPayPlanNotSelected.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPayPlanNotSelected.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return;
                                        }
                                        this.payPlanObj.clearAll()
                                        this.popInstallmentCount.show()
                                    }}
                                    />
                                </Item>
                                       
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdInstallment" parent={this} dataSource={this.payPlanObj.dt()} 
                            onRowInserted={async(e)=>
                            {
                                this.grdInstallment.dataRefresh()
                            }}
                            >
                            <Paging defaultPageSize={10} />
                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                            <Scrolling mode="standart" />
                            <Editing mode="cell" allowUpdating={true} />
                            <Export fileName={this.lang.t("menuOff.fns_02_001")} enabled={true} allowExportSelectedData={true} />
                            <Column dataField="DOC_DATE" caption={this.t("grdInstallment.clmDocDate")} width={100} allowEditing={false} dataType="datetime" format={"dd/MM/yyyy"}/>
                            <Column dataField="REF_NO" caption={this.t("grdInstallment.clmRefNo")} width={100} allowEditing={false}/>
                            <Column dataField="REF" caption={this.t("grdInstallment.clmRef")} width={100} allowEditing={false}/>
                            <Column dataField="CUSTOMER_NAME" caption={this.t("grdInstallment.clmCustomerName")} width={200} allowEditing={false}/>
                            <Column dataField="INSTALLMENT_NO" caption={this.t("grdInstallment.clmInstallmentNo")} width={100} allowEditing={false} sortOrder={"asc"}/>
                            <Column dataField="INSTALLMENT_DATE" caption={this.t("grdInstallment.clmInstallmentDate")} width={200} allowEditing={true} dataType="datetime" format={"dd/MM/yyyy"}
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                            <Column dataField="AMOUNT" caption={this.t("grdInstallment.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/>
                            <Column dataField="TOTAL" caption={this.t("grdInstallment.clmTotal")} format={{ style: "currency", currency: Number.money.code,precision: 2}}  allowEditing={false}/>
                        </NdGrid>
                        </div>  
                    </div> 
                    {/* popInstallment */}
                    <div>
                        <NdPopUp parent={this} id={"popInstallment"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popInstallment.title")}
                            container={"#root"} 
                            width={'1200'}
                            height={'800'}
                            position={{of:'#root'}}
                            onShowing={async()=>
                            {
                                await this._btnGetClick()
                            }}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <Form colCount={1} className="mb-2">
                                                    <Item>
                                                        <Label text={this.t("dtFirst")} alignment="right" />
                                                        <NbDateRange id={"dtFirst"} 
                                                            parent={this} 
                                                            startDate={moment(new Date())} 
                                                            endDate={moment(new Date())}
                                                            onApply={(e)=>
                                                            {
                                                                this._btnGetClick()
                                                            }}
                                                            
                                                        />
                                                    </Item>
                                                </Form>
                                                <NdGrid id="grdPopInstallment" parent={this} 
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
                                                    console.log(e.data)
                                                    this.installmentTotal.value = e.data.AMOUNT
                                                    this.tmpFacGuid = e.data.GUID
                                                    this.tmpFacRef = e.data.REF
                                                    this.txtRefno.value = e.data.REF_NO
                                                    this.tmpCustomerGuid = e.data.INPUT
                                                    this.txtCustomerName.value = e.data.INPUT_NAME

                                                    this.popInstallment.hide()
                                                }}
                                                >
                                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                                    <Column dataField="REF" caption={this.t("grdPopInstallment.clmRef")} visible={true} width={200}/> 
                                                    <Column dataField="REF_NO" caption={this.t("grdPopInstallment.clmRefNo")} visible={true} width={100}/> 
                                                    <Column dataField="INPUT_CODE" caption={this.t("grdPopInstallment.clmInputCode")} visible={false}/> 
                                                    <Column dataField="INPUT_NAME" caption={this.t("grdPopInstallment.clmInputName")} visible={true}/> 
                                                    <Column dataField="AMOUNT" caption={this.t("grdPopInstallment.clmAmount")} visible={true}/> 
                                                    <Column dataField="DOC_DATE" caption={this.t("grdPopInstallment.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/> 
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                        </NdPopUp>
                    </div>
                    {/* Installment Count and Date */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdPopUp parent={this} id={"popInstallmentCount"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popInstallmentCount.title")}
                            container={"#root"} 
                            width={'400'}
                            height={'400'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("installmentPeriod")} alignment="right" />
                                        <NdNumberBox id="installmentPeriod" parent={this} simple={true} width={200} 
                                        min={3} max={24} step={3}
                                        onValueChanged={(e)=>
                                        {
                                            console.log(e.value)
                                        }}
                                        param={this.param.filter({ELEMENT:'installmentPeriod',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'installmentPeriod',USERS:this.user.CODE})}
                                        >
                                        <Validator validationGroup={"frmInstallmentPeriod"  + this.tabIndex}>
                                        <RangeRule min={3} max={24} step={3} message={this.t("ValidInstallmentPeriod")} />
                                        </Validator>  
                                        </NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("paymentDate")} alignment="right" />
                                        <NdDatePicker id="paymentDate" parent={this} simple={true} width={200} />
                                    </Item>
                                    <Item>
                                        <Label text={this.t("installmentTotal")} alignment="right" />
                                        <NdNumberBox id="installmentTotal" readOnly={true} value={''} visible={true} parent={this} simple={true} width={200} />
                                    </Item>
                                    <Item>
                                        <div className="row">
                                            <div className="col-12" style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                <NdButton text={this.t("installmentAdd")} type="normal" stylingMode="contained" width={'25%'} 
                                                onClick={()=>
                                                {
                                                    let totalAmount = this.installmentTotal.value;
                                                    let installmentPeriod = this.installmentPeriod.value;
                                                    let installmentAmount = totalAmount / installmentPeriod;
                                                    let doc_guid = datatable.uuidv4();
                                                    console.log(doc_guid)
                                                    let roundedInstallmentAmount = Math.floor(installmentAmount * 100) / 100;
                                                    for (let i = 1; i <= installmentPeriod; i++) 
                                                    {
                                                        console.log(i)
                                                        let documentDate = new Date(this.paymentDate.value);
                                                        documentDate.setMonth(documentDate.getMonth() + i)
                                                        // Son taksit için kusurat kontrolü
                                                        let currentInstallmentAmount = roundedInstallmentAmount;
                                                        if(i == installmentPeriod)
                                                        {
                                                            // Önceki taksitlerin toplamını hesapla
                                                            let previousTotal = roundedInstallmentAmount * (installmentPeriod - 1);
                                                            // Son taksite kalan kusuratı ekle
                                                            currentInstallmentAmount = +(totalAmount - previousTotal).toFixed(2);
                                                            console.log(currentInstallmentAmount)
                                                        }
                                                        console.log(currentInstallmentAmount)

                                                        this._addInstallment(documentDate,currentInstallmentAmount,i,this.tmpFacRef,this.txtRefno.value,this.tmpFacGuid,this.installmentTotal.value,doc_guid)
                                                    }
                                                    this.popInstallmentCount.hide()
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>
                    </div>
                </ScrollView>     
            </div>
        )
    }
}