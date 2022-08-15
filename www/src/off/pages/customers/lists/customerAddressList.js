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

export default class barcodeList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['CODE','TITLE','TYPE_NAME','GENUS_NAME','ADRESS','CITY','COUNTRY','ZIPCODE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "CODE",NAME : this.t("grdListe.clmCode")},
            {CODE : "TITLE",NAME : this.t("grdListe.clmTitle")},
            {CODE : "TYPE_NAME",NAME : this.t("grdListe.clmType")},
            {CODE : "GENUS_NAME",NAME : this.t("grdListe.clmGenus")},    
            {CODE : "ADRESS",NAME : this.t("grdListe.clmAddress")},    
            {CODE : "CITY",NAME : this.t("grdListe.clmCity")},                                   
            {CODE : "COUNTRY",NAME : this.t("grdListe.clmCountry")},    
            {CODE : "ZIPCODE",NAME : this.t("grdListe.clmZipcode")},    
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
                if(typeof e.value.find(x => x == 'ADRESS') != 'undefined')
                {
                    this.groupList.push('ADRESS')
                }
                if(typeof e.value.find(x => x == 'CITY') != 'undefined')
                {
                    this.groupList.push('CITY')
                }
                if(typeof e.value.find(x => x == 'COUNTRY') != 'undefined')
                {
                    this.groupList.push('COUNTRY')
                }
                if(typeof e.value.find(x => x == 'ZIPCODE') != 'undefined')
                {
                    this.groupList.push('ZIPCODE')
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
                    query : "SELECT * FROM CUSTOMER_VW_02 WHERE ((TITLE like '%' + @CUSTOMER_NAME + '%') OR (@CUSTOMER_NAME = '')) AND " +
                            " ((GENUS = @GENUS) OR (@GENUS = -1))  ",
                    param : ['CUSTOMER_NAME:string|250','GENUS:string|25'],
                    value : [this.txtCustomerName.value,this.cmbGenus.value]
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'cri_01_001',
                                                text: this.t('menu'),
                                                path: 'customers/cards/customerCard.js'
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
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                        <NdTextBox id="txtCustomerName" parent={this} simple={true} 
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content'
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={-1}
                                    data={{source:[{ID:-1,VALUE:this.t("cmbGenusData.allGenus")},{ID:0,VALUE:this.t("cmbGenusData.Customer")},{ID:1,VALUE:this.t("cmbGenusData.supplier")},{ID:2,VALUE:this.t("cmbGenusData.both")}]}}
                                    />
                                </Item>       
                                <Item> </Item>
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
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={15} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.cri_02_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true}/> 
                                <Column dataField="TITLE" caption={this.t("grdListe.clmTitle")} visible={true}/> 
                                <Column dataField="TYPE_NAME" caption={this.t("grdListe.clmType")} visible={true}/> 
                                <Column dataField="GENUS_NAME" caption={this.t("grdListe.clmGenus")} visible={true}/> 
                                <Column dataField="ADRESS" caption={this.t("grdListe.clmAddress")} visible={true}/> 
                                <Column dataField="CITY" caption={this.t("grdListe.clmCity")} visible={true}/> 
                                <Column dataField="COUNTRY" caption={this.t("grdListe.clmCountry")} visible={true}/> 
                                <Column dataField="ZIPCODE" caption={this.t("grdListe.clmZipcode")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}