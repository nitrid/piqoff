import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class countInventoryReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['NAME','CODE','QUANTITY','BARCODE','COST_PRICE','TOTAL_COST','SALE_PRICE','TOTAL_PRICE']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "NAME",NAME : this.t("grdListe.clmName")},
            {CODE : "CODE",NAME : this.t("grdListe.clmCode")},                                   
            {CODE : "QUANTITY",NAME : this.t("grdListe.clmQuantity")},
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
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT ITEM_NAME AS NAME,ITEM_CODE  AS CODE, ROUND(SUM(QUANTITY),2) AS QUANTITY, MAX(BARCODE) AS BARCODE,MAX(COST_PRICE) AS COST_PRICE,ROUND(SUM(TOTAL_COST),2) AS TOTAL_COST,MAX(PRICE_SALE) AS SALE_PRICE, ROUND((MAX(PRICE_SALE) * SUM(QUANTITY)),2) AS TOTAL_PRICE FROM [ITEM_COUNT_VW_01] " +
                    "WHERE DOC_DATE >= @START AND DOC_DATE <= @END AND DEPOT = @DEPOT GROUP BY ITEM_NAME,ITEM_CODE ORDER BY ITEM_NAME",
                    param : ['START:date','END:date','DEPOT:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDepot.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdListe.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                            <Form colCount={3} id="frmKriter">
                                <Item>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value=""
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
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.stk_05_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="BARCODE" caption={this.t("grdListe.clmBarcode")} visible={true}/> 
                                <Column dataField="COST_PRICE" caption={this.t("grdListe.clmCostPrice")} format={{ style: "currency", currency: Number.money.code,precision: 3}} visible={true}/> 
                                <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="SALE_PRICE" caption={this.t("grdListe.clmSalePrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="TOTAL_PRICE" caption={this.t("grdListe.clmTotalPrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"/>
                                    <TotalItem
                                    column="TOTAL_COST"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="TOTAL_PRICE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary>
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