import React from 'react';
import App from '../../../lib/app.js';


import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class employeeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['CODE','TYPE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "CODE",NAME : this.t("grdListe.clmCode")},           
            {CODE : "NAME",NAME : this.t("grdListe.clmName")},  
            {CODE : "LAST_NAME",NAME : this.t("grdListe.clmLastName")},                  
            {CODE : "PHONE1",NAME : this.t("grdListe.clmPhone1")},       
            {CODE : "GSM_PHONE",NAME : this.t("grdListe.clmGsm")},       
            {CODE : "EMAIL",NAME : this.t("grdListe.clmEmail")}, 
            {CODE : "AGE",NAME : this.t("grdListe.clmAge")},    
            {CODE : "INSURANCE_NO",NAME : this.t("grdListe.clmInsuranceNo")},   
            {CODE : "GENDER",NAME : this.t("grdListe.clmGender")},   
            {CODE : "MARIAL_STATUS",NAME : this.t("grdListe.clmMarıalStatus")},   
            {CODE : "WAGE",NAME : this.t("grdListe.clmWage")},      
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {

        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'CODE') != 'undefined')
                {
                    this.groupList.push('CODE')
                }                
                if(typeof e.value.find(x => x == 'TITLE') != 'undefined')
                {
                    this.groupList.push('TITLE')
                }
                if(typeof e.value.find(x => x == 'TYPE_NAME') != 'undefined')
                {
                    this.groupList.push('TYPE_NAME')
                }
                if(typeof e.value.find(x => x == 'GENUS_NAME') != 'undefined')
                {
                    this.groupList.push('GENUS_NAME')
                }
                
                for (let i = 0; i < this.grdListe.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdListe.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdListe.devGrid.columnOption(i,'visible',true)
                    }
                }

                this.setState(
                    {
                        columnListValue : e.value
                    }
                )
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.columnListData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.columnListValue}
            onOptionChanged={onOptionChanged}
            >
            </NdListBox>
        )
    }
    async _btnGetirClick()
    {        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT * FROM EMPLOYEE_VW_01 WHERE (((NAME like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) OR ((CODE like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) )" ,
                    param : ['EMPLOYEE_NAME:string|250'],
                    value : [this.txtEmployeeName.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
        
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'prsnl_01_001',
                                                text: this.t('menu'),
                                                path: 'employee/cards/employeeCards.js'
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <Label text={this.t("txtEmployeeName")} alignment="right" />
                                        <NdTextBox id="txtEmployeeName" parent={this} simple={true} onEnterKey={this._btnGetirClick} placeholder={this.t("employeePlace")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
                                </Item>                                                                 
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
                            />
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'prsnl_01_001',
                                    text: e.data.NAME.substring(0,10),
                                    path: 'employee/cards/employeeCards.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            onRowPrepared={(e) =>
                            {
                                if(e.rowType == 'data' && e.data.STATUS == false)
                                {
                                    e.rowElement.style.color ="Silver"
                                }
                                else if(e.rowType == 'data' && e.data.STATUS == true)
                                {
                                    e.rowElement.style.color ="Black"
                                }
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.prsnl_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/>                                  
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="LAST_NAME" caption={this.t("grdListe.clmLastName")} visible={true}/>                                    
                                <Column dataField="PHONE1" caption={this.t("grdListe.clmPhone1")} visible={false}/> 
                                <Column dataField="GSM_PHONE" caption={this.t("grdListe.clmGsm")} visible={false}/> 
                                <Column dataField="EMAIL" caption={this.t("grdListe.clmEmail")} visible={false}/> 
                                <Column dataField="AGE" caption={this.t("grdListe.clmAge")} visible={false}/>
                                <Column dataField="INSURANCE_NO" caption={this.t("grdListe.clmInsuranceNo")} visible={true}/>
                                <Column dataField="GENDER" caption={this.t("grdListe.clmGender")} visible={true}/>
                                <Column dataField="MARIAL_STATUS" caption={this.t("grdListe.clmMarıalStatus")} visible={true}/>
                                <Column dataField="WAGE" caption={this.t("grdListe.clmWage")} visible={true} dataType={'number'} allowEditing={true} format={{ style: "currency", currency:Number.money.code,precision: 2}}/>
 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}