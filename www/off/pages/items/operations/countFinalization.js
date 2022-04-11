import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';

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

export default class countFinalization extends React.Component
{
    constructor(props)
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
       
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnSave = this._btnSave.bind(this)
        this.txtRef = Math.floor(Date.now() / 1000)
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

        this.txtRef = Math.floor(Date.now() / 1000)
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query :"SELECT *,[dbo].[FN_DEPOT_QUANTITY]([ITEM_GUID],@DEPOT,GETDATE()) AS QUANTITY FROM ITEM_MULTICODE_VW_01 WHERE [dbo].[FN_DEPOT_QUANTITY]([ITEM_GUID],@DEPOT,GETDATE()) > 0 "+
                    " AND ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                    param : ['DEPOT:string|50','CUSTOMER_CODE:string|50'],
                    value : [this.cmbDepot.value,this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdRebateList.dataRefresh(tmpSource)
    }
    async _btnSave(pType)
    {
        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.txtRef + this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);
            this.docObj.clearAll()
            this.txtRef = Math.floor(Date.now() / 1000)
            this._btnGetClick()
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
        
    }
    async _toGroupByCustomer(pData,pProperty)
    {
        return pData.reduce((acc, obj) => {
            const key = obj[pProperty];
            if (!acc[key]) {
               acc[key] = [];
            }
            
            acc[key].push(obj);
            return acc;
         }, {})
    }
    render()
    {
        
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmCriter">
                               {/* cmbDepot */}
                               <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE = 1"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSalesDis"}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                
                                </Item>
                                <Item>

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
                            <NdButton text={this.t("btnDispatch")} type="default" width="100%" onClick={()=>{this._btnSave(0)}}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdRebateList" parent={this} 
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

                                <Column dataField="ITEM_CODE" caption={this.t("grdRebateList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdRebateList.clmName")} visible={true} width={300}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdRebateList.clmQuantity")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdRebateList.clmCustomer")} visible={true}/> 
                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdRebateList.clmPrice")} visible={true}/> 
                                          
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}