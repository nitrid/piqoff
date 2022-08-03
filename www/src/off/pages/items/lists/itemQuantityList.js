import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class QuantityList extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['NAME','CODE','QUANTITY','BARCODE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "BARCODE",NAME : this.t("grdListe.clmBarcode")},    
        ]
        this.groupList = [];
        this._btnGetirClick = this._btnGetirClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            // this.test.data.source.groupBy = ["NAME"]
            // await this.test.dataRefresh()
            //console.log(this.test.data.datatable)
            // this.test.data.store.load().then(
            //     (data) => { console.log(data)},
            //     (error) => { /* Handle the "error" here */ }
            // );
        }, 1000);
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'NAME') != 'undefined')
                {
                    this.groupList.push('NAME')
                }
                if(typeof e.value.find(x => x == 'BARCODE') != 'undefined')
                {
                    this.groupList.push('BARCODE')
                }                
                if(typeof e.value.find(x => x == 'CODE') != 'undefined')
                {
                    this.groupList.push('CODE')
                }
                if(typeof e.value.find(x => x == 'QUANTITY') != 'undefined')
                {
                    this.groupList.push('QUANTITY')
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
        if(this.chkZeroQuantity == true)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT NAME,CODE,ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS BARCODE,[dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,GETDATE()) AS QUANTITY FROM ITEMS " +
                                "WHERE  " +
                                "((NAME like @NAME + '%') OR (@NAME = ''))",
                        param : ['NAME:string|250','DEPOT:string|50'],
                        value : [this.txtUrunAdi.value,this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }

            await this.grdListe.dataRefresh(tmpSource)
        }
        else
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT NAME,CODE,ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS BARCODE,[dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,GETDATE()) AS QUANTITY FROM ITEMS " +
                                "WHERE [dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,GETDATE()) <> 0 AND " +
                                "((NAME like @NAME + '%') OR (@NAME = ''))",
                        param : ['NAME:string|250','DEPOT:string|50'],
                        value : [this.txtUrunAdi.value,this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }

            await this.grdListe.dataRefresh(tmpSource)
        }
        let tmpQuantity = this.grdListe.data.datatable.sum("QUANTITY",2)
        this.txtTotalQuantity.setState({value:tmpQuantity})
      
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
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: 'items/cards/itemCard.js'
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
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                        <NdTextBox id="txtUrunAdi" parent={this} simple={true} placeholder={this.t("ItemNamePlaceHolder")}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <EmptyItem />
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value="1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
                                        param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        data={{source: {select : {query:"SELECT GUID,CODE,NAME FROM DEPOT ORDER BY CODE ASC"},sql : this.core.sql}}}
                                        />
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
                        <NdCheckBox id="chkZeroQuantity" parent={this} text={this.t("chkZeroQuantity")}  value={false} ></NdCheckBox>
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
                            loadPanel={{enabled:true}}
                            >                            
                                <Paging defaultPageSize={12} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.stk_03_006")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 

                            </NdGrid>
                        </div>
                    </div>
                    <Form colCount={4}>
                        <EmptyItem colSpan={3}></EmptyItem>
                        <Item>
                            <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true}
                                />
                        </Item>
                    </Form>
                </ScrollView>
            </div>
        )
    }
}