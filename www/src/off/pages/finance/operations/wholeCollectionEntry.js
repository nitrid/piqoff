import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';
import * as xlsx from 'xlsx'

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
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class wholeCollectionEntry extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.tabIndex = props.data.tabkey
        this.payDt = new datatable()

        this._cellRoleRender = this._cellRoleRender.bind(this)        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.payDt = new datatable()
        await this.grdDocPayments.dataRefresh({source:this.payDt});
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == "OUTPUT_CODE")
        {
            return (
                <NdTextBox id={"txtGrdCustomerCode"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onKeyDown={async(k)=>
                {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                    {
                        await this.pg_txtCustomerCode.setVal(e.value)
                        this.pg_txtCustomerCode.onClick = async(data) =>
                        {
                            if(data.length > 0)
                            {
                                this.payDt[e.rowIndex].OUTPUT = data[0].GUID
                                this.payDt[e.rowIndex].OUTPUT_CODE = data[0].CODE
                                this.payDt[e.rowIndex].OUTPUT_NAME = data[0].TITLE
                            }
                        }
                    }
                }}
                onValueChanged={(v)=>
                {
                    e.value = v.value
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtCustomerCode.show()
                                this.pg_txtCustomerCode.onClick = async(data) =>
                                {
                                    if(data.length > 0)
                                    {
                                        this.payDt[e.rowIndex].OUTPUT = data[0].GUID
                                        this.payDt[e.rowIndex].OUTPUT_CODE = data[0].CODE
                                        this.payDt[e.rowIndex].OUTPUT_NAME = data[0].TITLE
                                    }
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    async excelAdd(pData)
    {
        let tmpShema = this.prmObj.filter({ID:'excelFormat',USERS:this.user.CODE}).getValue()
        if(typeof tmpShema == 'string')
        {
            tmpShema = JSON.parse(tmpShema)
        }

        for (let i = 0; i < pData.length; i++) 
        {
            if(typeof pData[i][tmpShema.AMOUNT] != 'undefined' && pData[i][tmpShema.AMOUNT] > 0)
            {
                if(typeof pData[i][tmpShema.DATE] == 'number')
                {
                    pData[i][tmpShema.DATE] = new Date((pData[i][tmpShema.DATE] - (25567 + 2))*86400*1000)
                }
                
                let tmpData =
                {
                    DOC_DATE : pData[i][tmpShema.DATE],
                    OUTPUT : '00000000-0000-0000-0000-000000000000',
                    OUTPUT_CODE : '',
                    OUTPUT_NAME : '',
                    INPUT : this.cmbCashSafeEx.value,
                    INPUT_NAME : this.cmbCashSafeEx.displayValue,
                    PAY_TYPE : this.cmbPayTypeEx.value,
                    AMOUNT : pData[i][tmpShema.AMOUNT],
                    DESCRIPTION : pData[i][tmpShema.DESC],
                    CHECK_REF : ""
                }
                this.payDt.push(tmpData)
            }
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

                                                for (let i = 0; i < this.payDt.length; i++) 
                                                {
                                                    this.docObj = new docCls();

                                                    let tmpDoc = {...this.docObj.empty}
                                                    tmpDoc.TYPE = 0
                                                    tmpDoc.DOC_TYPE = 200
                                                    tmpDoc.INPUT = '00000000-0000-0000-0000-000000000000'
                                                    tmpDoc.REF = this.txtRef.value
                                                    tmpDoc.REF_NO = Math.floor(Date.now() / 1000)
                                                    tmpDoc.OUTPUT = this.payDt[i].OUTPUT
                                                    tmpDoc.OUTPUT_CODE = this.payDt[i].OUTPUT_CODE
                                                    tmpDoc.OUTPUT_NAME = this.payDt[i].OUTPUT_NAME
                                                    tmpDoc.DOC_DATE = this.payDt[i].DOC_DATE
                                                    tmpDoc.AMOUNT = this.payDt[i].AMOUNT
                                                    tmpDoc.TOTAL = this.payDt[i].AMOUNT

                                                    this.docObj.addEmpty(tmpDoc);

                                                    let tmpDocCustomer = {...this.docObj.docCustomer.empty}
                                                    tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
                                                    tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
                                                    tmpDocCustomer.REF = this.docObj.dt()[0].REF
                                                    tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
                                                    tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                    tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                    tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                    tmpDocCustomer.INPUT = this.payDt[i].INPUT
                                                    tmpDocCustomer.AMOUNT = this.payDt[i].AMOUNT
                                                    tmpDocCustomer.DESCRIPTION = this.payDt[i].DESCRIPTION
                                                    tmpDocCustomer.PAY_TYPE = this.payDt[i].PAY_TYPE

                                                    if (this.payDt[i].PAY_TYPE == 1)
                                                    {
                                                        let tmpCheck = {...this.docObj.checkCls.empty}
                                                        tmpCheck.DOC_GUID = this.docObj.dt()[0].GUID
                                                        tmpCheck.REF = this.payDt[i].CHECK_REF
                                                        tmpCheck.DOC_DATE =  this.docObj.dt()[0].DOC_DATE
                                                        tmpCheck.CHECK_DATE = this.docObj.dt()[0].DOC_DATE
                                                        tmpCheck.CUSTOMER = this.docObj.dt()[0].INPUT
                                                        tmpCheck.AMOUNT = this.payDt[i].AMOUNT
                                                        tmpCheck.SAFE = this.payDt[i].INPUT
                                                        this.docObj.checkCls.addEmpty(tmpCheck)
                                                    }

                                                    this.docObj.docCustomer.addEmpty(tmpDocCustomer)

                                                    await this.docObj.save()
                                                }

                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
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
                                    <NdTextBox id="txtRef" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCollection"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validRef")} />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
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
                                    <Button icon="add"
                                    validationGroup={"frmCollection"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.dtDocDate.value = moment(new Date())
                                            this.txtCustomerCode.guid = ''
                                            this.txtCustomerCode.value = ''
                                            this.txtCustomerName.value = ''
                                            this.cmbCashSafe.value = ''
                                            this.cmbPayType.value = ''
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
                                    <Button icon="xlsxfile" text={this .t("excelAdd")}
                                    validationGroup={"frmCollection"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        let tmpShema = this.prmObj.filter({ID:'excelFormat',USERS:this.user.CODE}).getValue()

                                        if(typeof tmpShema == 'string')
                                        {
                                            tmpShema = JSON.parse(tmpShema)
                                        }
                                    
                                        this.txtPopExcelDate.value = tmpShema.DATE
                                        this.txtPopExcelDesc.value = tmpShema.DESC
                                        this.txtPopExcelAmount.value = tmpShema.AMOUNT

                                        this.popExcel.show()
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
                                        onRowUpdated={async(e)=>
                                        {
                                            
                                        }}
                                        >
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="infinite" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                            <Export fileName={this.lang.t("menu.fns_02_002")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="DOC_DATE" caption={this.t("grdDocPayments.clmDate")} dataType="date" allowEditing={false}/>
                                            <Column dataField="OUTPUT_CODE" caption={this.t("grdDocPayments.clmCustomerCode")} editCellRender={this._cellRoleRender}/>
                                            <Column dataField="OUTPUT_NAME" caption={this.t("grdDocPayments.clmCustomerName")} allowEditing={false}/>
                                            <Column dataField="INPUT_NAME" caption={this.t("grdDocPayments.clmInputName")} allowEditing={false}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdDocPayments.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                            <Column dataField="DESCRIPTION" caption={this.t("grdDocPayments.clmDescription")} />
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
                    {/* Cash PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popCash"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCash.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'500'}
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
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}/>
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
                                    onValueChanged={(async()=>
                                        {

                                        }).bind(this)}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* numCash */}
                                <Item>
                                    <Label text={this.t("cash")} alignment="right" />
                                    <div className="col-4 pe-0">
                                        <NdNumberBox id="numCash" parent={this} simple={true}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                                <RangeRule min={0.1} message={this.t("ValidCash")} />
                                            </Validator>  
                                        </NdNumberBox>
                                    </div>
                                </Item>
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.value = data[0].CODE
                                                this.txtCustomerCode.guid = data[0].GUID
                                                this.txtCustomerName.value = data[0].TITLE
                                            }
                                        }
                                    }).bind(this)}
                                    button={
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
                                                        this.txtCustomerCode.value = data[0].CODE
                                                        this.txtCustomerCode.guid = data[0].GUID
                                                        this.txtCustomerName.value = data[0].TITLE
                                                    }
                                                }
                                            }
                                        },
                                    ]}
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>                                    
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* cashDescription */}
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
                                                        let tmpData =
                                                        {
                                                            DOC_DATE : this.dtDocDate.value,
                                                            OUTPUT : this.txtCustomerCode.guid,
                                                            OUTPUT_CODE : this.txtCustomerCode.value,
                                                            OUTPUT_NAME : this.txtCustomerName.value,
                                                            INPUT : this.cmbCashSafe.value,
                                                            INPUT_NAME : this.cmbCashSafe.displayValue,
                                                            PAY_TYPE : this.cmbPayType.value,
                                                            AMOUNT : this.numCash.value,
                                                            DESCRIPTION : this.cashDescription.value,
                                                            CHECK_REF : ""
                                                        }
                                                        this.payDt.push(tmpData)
                                                        this.popCash.hide();  
                                                    }
                                                }
                                                else
                                                {
                                                    console.log(e.validationGroup.validate())
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
                        height={'200'}
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
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCheck.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                let tmpData =
                                                {
                                                    DOC_DATE : this.dtDocDate.value,
                                                    OUTPUT : this.txtCustomerCode.guid,
                                                    OUTPUT_CODE : this.txtCustomerCode.value,
                                                    OUTPUT_NAME : this.txtCustomerName.value,
                                                    INPUT : this.cmbCashSafe.value,
                                                    INPUT_NAME : this.cmbCashSafe.displayValue,
                                                    PAY_TYPE : this.cmbPayType.value,
                                                    AMOUNT : this.numCash.value,
                                                    DESCRIPTION : this.cashDescription.value,
                                                    CHECK_REF : this.checkReference.value
                                                }
                                                this.payDt.push(tmpData)
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
                    {/* Cari Secim PopUp */}
                    <div>                    
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
                    </div>
                    {/* Excel PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popExcel"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popExcel.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'450'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbPayType */}
                                <Item>
                                    <Label text={this.t("cmbPayType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPayTypeEx"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.cmbCashSafeEx.value = ''
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
                                            this.cmbCashSafeEx.setData(tmpData.result.recordset)
                                        }
                                        else
                                        {
                                            this.cmbCashSafeEx.setData([])
                                        }
                                    }).bind(this)}
                                    data={{source:[{ID:0,VALUE:this.t("cmbPayType.cash")},{ID:1,VALUE:this.t("cmbPayType.check")},{ID:2,VALUE:this.t("cmbPayType.bankTransfer")},{ID:3,VALUE:this.t("cmbPayType.otoTransfer")},{ID:4,VALUE:this.t("cmbPayType.foodTicket")},{ID:5,VALUE:this.t("cmbPayType.bill")}]}}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                                {/* cmbCashSafe */}
                                <Item>
                                    <Label text={this.t("cmbCashSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCashSafeEx"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popExcel.clmDate")} alignment="right" />
                                    <NdTextBox id="txtPopExcelDate" parent={this} simple={true} notRefresh = {true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    >
                                        <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validExcel")} />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popExcel.clmDesc")} alignment="right" />
                                    <NdTextBox id="txtPopExcelDesc" parent={this} simple={true} notRefresh = {true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    >
                                        <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validExcel")} />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popExcel.clmAmount")} alignment="right" />
                                    <NdTextBox id="txtPopExcelAmount" parent={this} simple={true} notRefresh = {true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    >
                                        <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validExcel")} />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                            </Form>
                            <Form colCount={2}>
                                <Item>
                                    <input type="file" name="upload" id="upload" text={"Excel Aktarım"} onChange={(e)=>
                                    {
                                        e.preventDefault();
                                        if (e.target.files) 
                                        {
                                            const reader = new FileReader();
                                            reader.onload = (e) => 
                                            {
                                                const data = e.target.result;
                                                const workbook = xlsx.read(data, { type: "array" });
                                                const sheetName = workbook.SheetNames[0];
                                                const worksheet = workbook.Sheets[sheetName];
                                                const json = xlsx.utils.sheet_to_json(worksheet);
                                                this.popExcel.hide()
                                                this.excelAdd(json)
                                            };
                                            reader.readAsArrayBuffer(e.target.files[0]);
                                        }
                                    }}/>    
                                </Item>
                                <Item>
                                    <NdButton id="btnShemaSave" parent={this} text={this.t('popExcel.shemaSave')} type="default"
                                    onClick={async()=>
                                    {
                                        let shemaJson={DATE:this.txtPopExcelDate.value,DESC:this.txtPopExcelDesc.value,AMOUNT:this.txtPopExcelAmount.value}
                                        this.prmObj.add({ID:'excelFormat',VALUE:shemaJson,USERS:this.user.CODE,APP:'OFF',TYPE:1,PAGE:'fns_05_001'})
                                        await this.prmObj.save()
                                    }}/>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                </ScrollView>     
            </div>
        )
    }
}