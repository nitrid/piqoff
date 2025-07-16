import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Scrolling,Export,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
export default class countInventoryReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.btnGetClick = this.btnGetClick.bind(this)
    }
    async btnGetClick()
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT ITEM_NAME AS NAME,MAX(UNIT_SYMBOL) AS UNIT_SYMBOL,ITEM_CODE  AS CODE, ROUND(SUM(QUANTITY),2) AS QUANTITY, 
                            MAX(BARCODE) AS BARCODE,MAX(COST_PRICE) AS COST_PRICE,ROUND(SUM(TOTAL_COST),2) AS TOTAL_COST,
                            MAX(PRICE_SALE) AS SALE_PRICE, 
                            ROUND((MAX(PRICE_SALE) * SUM(QUANTITY)),2) AS TOTAL_PRICE FROM [ITEM_COUNT_VW_01] 
                            WHERE DOC_DATE >= @START AND DOC_DATE <= @END AND DEPOT = @DEPOT GROUP BY ITEM_NAME,ITEM_CODE ORDER BY ITEM_NAME`,
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
                            <NdForm colCount={3} id="frmKriter">
                                <NdItem>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    data={{source: {select : {query:"SELECT GUID,CODE,NAME FROM DEPOT ORDER BY CODE ASC"},sql : this.core.sql}}}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
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
                                <Column dataField="COST_PRICE" caption={this.t("grdListe.clmCostPrice")} format={{ style: "currency", currency: Number.money.code,precision: 3}} visible={true}/> 
                                <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="SALE_PRICE" caption={this.t("grdListe.clmSalePrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Column dataField="TOTAL_PRICE" caption={this.t("grdListe.clmTotalPrice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem column="QUANTITY" summaryType="sum"/>
                                    <TotalItem column="TOTAL_COST" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem column="TOTAL_PRICE" summaryType="sum" valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary>
                            </NdGrid>
                        </div>
                    </div>
                    <NdForm colCount={4}>
                        <NdEmptyItem colSpan={2}></NdEmptyItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalQuantity")} alignment="right" />
                            <NdTextBox id="txtTotalQuantity" parent={this} simple={true} readOnly={true}/>
                        </NdItem>
                        <NdItem>
                            <NdLabel text={this.t("txtTotalCost")} alignment="right" />
                            <NdTextBox id="txtTotalCost" parent={this} simple={true} readOnly={true}/>
                        </NdItem>
                    </NdForm>
                </ScrollView>
            </div>
        )
    }
}