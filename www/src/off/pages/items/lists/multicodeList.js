import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

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

export default class multicodeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['ITEM_NAME','ITEM_CODE','MAIN_GRP_NAME','MULTICODE','CUSTOMER_NAME']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "ITEM_NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "MAIN_GRP_NAME",NAME : this.t("grdListe.clmMainGrp")},                        
            {CODE : "ITEM_CODE",NAME :  this.t("grdListe.clmCode")},
            {CODE : "MULTICODE",NAME : this.t("grdListe.clmMulticode")},
            {CODE : "CUSTOMER_NAME",NAME :  this.t("grdListe.clmCustomer")},
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
                if(typeof e.value.find(x => x == 'MULTICODE') != 'undefined')
                {
                    this.groupList.push('MULTICODE')
                }
                if(typeof e.value.find(x => x == 'BARCODE') != 'undefined')
                {
                    this.groupList.push('BARCODE')
                }                
                if(typeof e.value.find(x => x == 'CODE') != 'undefined')
                {
                    this.groupList.push('CODE')
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
                    query : "SELECT * FROM ITEM_MULTICODE_VW_01 " +
                            "WHERE " +
                            "((ITEM_NAME = @ITEM_NAME) OR (@ITEM_NAME = '')) AND " +
                            "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                            "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                    param : ['ITEM_NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                    value : [this.txtUrunAdi.value,this.cmbUrunGrup.value,this.cmbTedarikci.value]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdListe.dataRefresh(tmpSource)
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
                                    <Label text={this.t("cmbCustomer")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="TITLE"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,TITLE FROM CUSTOMER_VW_01 WHERE TYPE IN(1,2) ORDER BY TITLE ASC"},sql : this.core.sql}}}
                                        // onValueChanged={onValueChanged}
                                        />
                                </Item>
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        // onValueChanged={onValueChanged}
                                        />
                                </Item>
                                <Item> </Item>
                                <Item>
                                    <Label text={this.t("btnCheck")} alignment="right" />
                                        <NdCheckBox id="chkAktif" parent={this} defaultValue={true}></NdCheckBox>
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
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.stk_03_005")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true} defaultSortOrder="asc"/> 
                                <Column dataField="MULTICODE" caption={this.t("grdListe.clmMulticode")} visible={true}/> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmMainGrp")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdListe.clmCustomer")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}