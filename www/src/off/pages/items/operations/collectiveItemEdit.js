import React from 'react';
import App from '../../../lib/app.js';
import {editItemCls} from '../../../../core/cls/items.js'
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
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class collectiveItemEdit extends React.Component
{
    constructor(props)
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.editObj = new editItemCls();

        this._cellRoleRender = this._cellRoleRender.bind(this)
       
        this._btnGetClick = this._btnGetClick.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.init()
        }, 1000);
    }
    async init()
    {
        this.editObj.clearAll()

        this.txtCustomerCode.GUID ='00000000-0000-0000-0000-000000000000'
        this.txtCustomerCode.CODE =''
        console.log(this.editObj.dt())
        await this.grdItemList.dataRefresh({source:this.editObj.dt('ITEM_EDIT')});
    }
    async _btnGetClick()
    {
        if(this.txtName.value != '' && this.txtName.value.slice(-1) != '*')
        {
            let txtName = this.txtName.value + '*'
            this.txtName.setState({value:txtName})
        }
        
        let tmpSrc = ""
        if(this.txtCode.value.length == 1)
        {
            tmpSrc = "((CODE LIKE '" + this.txtCode.value[0] + "' + '%') OR (BARCODE LIKE '" + this.txtCode.value[0] + "' + '%') OR (MULTICODE LIKE '" + this.txtCode.value[0] + "' + '%')) AND"
        }
        else if(this.txtCode.value.length > 1 )
        {
            let TmpVal = ''
            for (let i = 0; i < this.txtCode.value.length; i++) 
            {
                TmpVal = TmpVal + ",'" + this.txtCode.value[i] + "'"
                
            }
            tmpSrc = "((CODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (BARCODE IN (" + TmpVal.substring(1,TmpVal.length) + ")) OR (MULTICODE IN (" + TmpVal.substring(1,TmpVal.length) + "))) AND"
        }

        await this.editObj.load({NAME:this.txtName.value.replaceAll("*", "%"),MAIN_GRP:this.cmbItemGroup.value,CUSTOMER_CODE:this.txtCustomerCode.value,QUERY:tmpSrc})
            
       
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == 'ORGINS')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data.value)
            }
            return (
                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                displayExpr="NAME"                       
                valueExpr="CODE"
                notRefresh = {true}
                value=""
                searchEnabled={true} pageSize ={50} showClearButton={true}
                onValueChanged={onValueChanged}
                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                >
                </NdSelectBox>      
            )
        }
        else if(e.column.dataField == 'VAT')
        {
            let onValueChanged = function(data)
            {
                e.setValue(data.value)
            }
            return (
            <NdSelectBox simple={true} parent={this} id="clmVat"
                displayExpr="VAT"                       
                valueExpr="VAT"
                notRefresh = {true}
                value="0"
                searchEnabled={true} pageSize ={50} showClearButton={true}
                onValueChanged={onValueChanged}
                data={{source:{select:{query : "SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                >
            </NdSelectBox>    
            ) 
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
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            this._btnGetClick()
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default"
                                    onClick={async (e)=>
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
                                            
                                            if(await this.editObj.save() == 0)
                                            {                                                    
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmCriter">
                            {/* txtCode */}
                            <Item>
                                    <Label text={this.t("txtCode")} alignment="right" />
                                        <NdTagBox id="txtCode" parent={this} simple={true} value={[]} placeholder={this.t("codePlaceHolder")}
                                        />
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
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
                                                        this.txtCustomerCode.GUID = data[0].GUID
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            id:'02',
                                            icon:'clear',
                                            onClick:()=>
                                            {
                                                this.txtCustomerCode.setState({value:''})
                                                this.txtCustomerCode.CODE =''
                                                this.txtCustomerCode.GUID ='00000000-0000-0000-0000-000000000000'
                                            }
                                        },
                                    ]
                                }
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
                                data={{source:{select:{query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2)"},sql:this.core.sql}}}
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
                                
                                {/* txtName */}
                                <Item>
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} 
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                 {/* cmbItemGroup */}
                                 <Item>
                                    <Label text={this.t("cmbItemGroup")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGroup"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh = {true}
                                    onValueChanged={(async()=>
                                        {
                                            console.log(this.cmbItemGroup)
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGroup',USERS:this.user.CODE})}
                                    button=
                                    {
                                        [
                                            {
                                                id:'02',
                                                icon:'clear',
                                                onClick:()=>
                                                {
                                                    this.txtCustomerCode.setState({cmbItemGroup:''})
                                                    this.cmbItemGroup.valueExpr =''
                                                }
                                            },
                                        ]
                                    }
                                    >
                                    </NdSelectBox>
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
                            <NdGrid id="grdItemList" parent={this} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            height={'100%'} 
                            width={'100%'}
                            dbApply={false}
                            >                            
                                <Paging defaultPageSize={14} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={false} confirmDelete={false}/>
                                <Column dataField="CODE" caption={this.t("grdItemList.clmCode")} visible={true} width={150} allowEditing={false}/> 
                                <Column dataField="NAME" caption={this.t("grdItemList.clmName")} visible={true} defaultSortOrder="asc"  /> 
                                <Column dataField="BARCODE" caption={this.t("grdItemList.clmBarcode")} visible={true} width={150} allowEditing={false}/> 
                                <Column dataField="MULTICODE" caption={this.t("grdItemList.clmMulticode")} visible={true} width={150}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemList.clmCustomerName")} visible={true}  allowEditing={false}/> 
                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdItemList.clmCustomerPrice")} visible={true} width={100}/> 
                                <Column dataField="MAIN_UNIT_NAME" caption={this.t("grdItemList.clmMainUnit")} visible={true} width={100}/> 
                                <Column dataField="UNDER_UNIT_NAME" caption={this.t("grdItemList.clmUnderUnit")} visible={true} width={100}/> 
                                <Column dataField="UNDER_FACTOR" caption={this.t("grdItemList.clmUnderFactor")} visible={true} width={100}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdItemList.clmPriceSale")} visible={true} width={100} /> 
                                <Column dataField="VAT" caption={this.t("grdItemList.clmVat")} visible={true} width={100} editCellRender={this._cellRoleRender}/>    
                                <Column dataField="ORGINS" caption={this.t("grdItemList.clmOrgins")} visible={true} width={150} editCellRender={this._cellRoleRender}/>   
                                <Column dataField="STATUS" caption={this.t("grdItemList.clmStatus")} visible={true} width={100}/>    
                                          
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}