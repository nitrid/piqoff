import React from 'react';
import App from '../../../lib/app.js';
import Toolbar from 'devextreme-react/toolbar';

import Form, {Item, Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, Paging,Pager,Scrolling,Export,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
export default class employeeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.groupList = [];
        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { }, 1000)
    }
    loadState()
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdListeState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async btnGetirClick()
    {        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : `SELECT * FROM EMPLOYEE_VW_01 WHERE (((NAME like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) OR ((CODE like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) )` ,
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
                            <Form colCount={2} id="frmKriter">
                                <Item>
                                    <Label text={this.t("txtEmployeeName")} alignment="right" />
                                    <NdTextBox id="txtEmployeeName" parent={this} simple={true} onEnterKey={this.btnGetirClick} placeholder={this.t("employeePlace")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}/>
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
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
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