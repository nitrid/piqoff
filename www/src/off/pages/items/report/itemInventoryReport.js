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

export default class itemInventoryReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['NAME','CODE','QUANTITY','UNIT_SYMBOL','BARCODE','COST_PRICE','TOTAL_COST']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
            {CODE : "UNIT_SYMBOL",NAME : this.t("grdListe.clmUnitSymbol")},
            {CODE : "BARCODE",NAME : this.t("grdListe.clmBarcode")}, 
            {CODE : "COST_PRICE",NAME : this.t("grdListe.clmCostPrice")},    
            {CODE : "TOTAL_COST",NAME : this.t("grdListe.clmTotalCost")},    
            {CODE : "SALE_PRICE",NAME : this.t("grdListe.clmSalePrice")},    
            {CODE : "TOTAL_PRICE",NAME : this.t("grdListe.clmTotalPrice")},    
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
                if(typeof e.value.find(x => x == 'UNIT_SYMBOL') != 'undefined')
                {
                    this.groupList.push('UNIT_SYMBOL')
                }
                if(typeof e.value.find(x => x == 'COST_PRICE') != 'undefined')
                {
                    this.groupList.push('COST_PRICE')
                }
                if(typeof e.value.find(x => x == 'TOTAL_COST') != 'undefined')
                {
                    this.groupList.push('TOTAL_COST')
                }
                if(typeof e.value.find(x => x == 'SALE_PRICE') != 'undefined')
                {
                    this.groupList.push('SALE_PRICE')
                }
                if(typeof e.value.find(x => x == 'TOTAL_SALE') != 'undefined')
                {
                    this.groupList.push('TOTAL_SALE')
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
        if(this.chkZeroQuantity.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT *,ROUND((COST_PRICE * QUANTITY),2) AS TOTAL_COST,ROUND((SALE_PRICE * QUANTITY),2) AS TOTAL_PRICE  FROM [dbo].[FN_ITEM_INVENTORY](@DEPOT) ",
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdListe.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
            console.log(this.grdListe)
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
                        query : "SELECT *,ROUND((COST_PRICE * QUANTITY),2) AS TOTAL_COST,ROUND((SALE_PRICE * QUANTITY),2) AS TOTAL_PRICE FROM [dbo].[FN_ITEM_INVENTORY](@DEPOT) " +
                                "WHERE QUANTITY <> 0  ",
                        param : ['DEPOT:string|50'],
                        value : [this.cmbDepot.value]
                    },
                    sql : this.core.sql
                }
            }

            await this.grdListe.dataRefresh(tmpSource)
        }
        let tmpQuantity = this.grdListe.data.datatable.sum("QUANTITY",2)
        let tmpTotalCost = this.grdListe.data.datatable.sum("TOTAL_COST",2)

        this.txtTotalQuantity.setState({value:tmpQuantity})
        this.txtTotalCost.setState({value:tmpTotalCost})
      
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
                            <Form colCount={2} id="frmKriter">
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
                            height={'690'} 
                            width={'100%'}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.stk_05_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="UNIT_SYMBOL" caption={this.t("grdListe.clmUnitSymbol")} visible={true}/> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="COST_PRICE" caption={this.t("grdListe.clmCostPrice")} visible={true}/> 
                                <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} visible={true}/> 
                                <Column dataField="SALE_PRICE" caption={this.t("grdListe.clmSalePrice")} visible={false}/> 
                                <Column dataField="TOTAL_PRICE" caption={this.t("grdListe.clmTotalPrice")} visible={false}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <Form colCount={4}>
                        <EmptyItem colSpan={2}></EmptyItem>
                        <Item>
                            <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true}
                                />
                        </Item>
                        <Item>
                            <Label text={this.t("txtTotalCost")} alignment="right" />
                                <NdTextBox id="txtTotalCost" parent={this} simple={true} readOnly={true}
                                />
                        </Item>
                    </Form>
                </ScrollView>
            </div>
        )
    }
}