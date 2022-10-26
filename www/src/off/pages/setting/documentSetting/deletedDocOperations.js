import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
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
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class rebateOperation extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
       
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnSave = this._btnSave.bind(this)
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
        this.docObj.clearAll()
    }
    async _btnGetClick()
    {
        let tmpType
        let tmpDocType
        let tmpRebate
        if(this.cmbType.value == 0)
        {
            tmpType = 0
            tmpDocType = 40
            tmpRebate = 0
        }
        else if(this.cmbType.value == 1)
        {
            tmpType = 1
            tmpDocType = 40
            tmpRebate = 0
        }
        else if(this.cmbType.value == 2)
        {
            tmpType = 1
            tmpDocType = 40
            tmpRebate = 1
        }
        else if(this.cmbType.value == 3)
        {
            tmpType = 1
            tmpDocType = 42
            tmpRebate = 0
        }
        else if(this.cmbType.value == 4)
        {
            tmpType = 0
            tmpDocType = 20
            tmpRebate = 0
        }
        else if(this.cmbType.value == 5)
        {
            tmpType = 1
            tmpDocType = 20
            tmpRebate = 0
        }
        else if(this.cmbType.value == 6)
        {
            tmpType = 1
            tmpDocType = 21
            tmpRebate = 0
        }
        else if(this.cmbType.value == 7)
        {
            tmpType = 1
            tmpDocType = 20
            tmpRebate = 1
        }
        else if(this.cmbType.value == 8)
        {
            tmpType = 0
            tmpDocType = 22
            tmpRebate = 0
        }
        else if(this.cmbType.value == 9)
        {
            tmpType = 0
            tmpDocType = 60
            tmpRebate = 0
        }
        else if(this.cmbType.value == 10)
        {
            tmpType = 1
            tmpDocType = 60
            tmpRebate = 0
        }
        else if(this.cmbType.value == 11)
        {
            tmpType = 0
            tmpDocType = 61
            tmpRebate = 0
        }
        else if(this.cmbType.value == 12)
        {
            tmpType = 1
            tmpDocType = 61
            tmpRebate = 0
        }
        
        let tmpSource =
        {
            source : 
            {
                select : 
                { 
                    query :"SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE_CONVERT,CASE TYPE WHEN 0 THEN (SELECT TOP 1 TITLE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC.OUTPUT) " +
                    "WHEN 1 THEN (SELECT TOP 1 TITLE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC.INPUT) END AS CUSTOMER " +
                    " FROM DOC WHERE TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE  AND REBATE = @REBATE AND DELETED = 1 ORDER BY CDATE DESC",
                    param : ['TYPE:int','DOC_TYPE:int','REBATE:int'],
                    value : [tmpType,tmpDocType,tmpRebate]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdDeleteList.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async _btnSave()
    {
        let tmpConfObj =
        {
            id:'mgsUnlock',showTitle:true,title:this.t("mgsUnlock.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("mgsUnlock.btn01"),location:'before'},{id:"btn02",caption:this.t("mgsUnlock.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("mgsUnlock.msg")}</div>)
        }
        let pResult = await dialog(tmpConfObj);

        if(pResult == 'btn01')
        {
            let tmpQuery = 
            {
                query : "EXEC [dbo].[PRD_DOC_RETURN] @CUSER = @PCUSER,@GUID=@PGUID ",
                param : ['PCUSER:string|50','PGUID:string|50'],
                value : [this.core.auth.data.CODE,this.grdDeleteList.getSelectedData()[0].GUID]
            }
            await this.core.sql.execute(tmpQuery) 
            let tmpConfObj =
            {
                id:'msgSuccess',showTitle:true,title:this.t("msgSuccess.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSuccess.btn01"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSuccess.msg")}</div>)
            }
            this._btnGetClick()
        }
    }
    render()
    {
        
        return(
            <div>
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
                            <Form colCount={2} id="frmCriter">
                               {/* cmbType */}
                               <Item>
                                    <Label text={this.t("cmbType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={0}
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:[{ID:0,VALUE:this.t("cmbTypeData.purchaseDispatch")},{ID:1,VALUE:this.t("cmbTypeData.salesDispatch")},{ID:2,VALUE:this.t("cmbTypeData.rebateDispatch")}
                                                    ,{ID:3,VALUE:this.t("cmbTypeData.branchSaleDispatch")},{ID:4,VALUE:this.t("cmbTypeData.purchaseInvoice")}
                                                    ,{ID:5,VALUE:this.t("cmbTypeData.salesInvoice")},{ID:6,VALUE:this.t("cmbTypeData.priceDifferenceInvoice")},{ID:7,VALUE:this.t("cmbTypeData.rebateInvoice")}
                                                    ,{ID:8,VALUE:this.t("cmbTypeData.branchSaleInvoice")},{ID:9,VALUE:this.t("cmbTypeData.purchaseOrder")},{ID:10,VALUE:this.t("cmbTypeData.salesOrder")}
                                                    ,{ID:11,VALUE:this.t("cmbTypeData.purchaseOffer")},{ID:12,VALUE:this.t("cmbTypeData.salesOffer")}]}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                           <NdButton text={this.t("btnUnlock")} type="default" width="100%" onClick={()=>{this._btnSave()}}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdDeleteList" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="REF" caption={this.t("grdDeleteList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdDeleteList.clmRefNo")} visible={true} width={300}/> 
                                <Column dataField="CUSTOMER" caption={this.t("grdDeleteList.clmCustomer")} visible={true}/> 
                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdDeleteList.clmDate")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}