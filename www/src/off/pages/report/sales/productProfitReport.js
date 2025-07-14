import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,StateStoring,ColumnChooser,TotalItem} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import { NdForm,NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';

export default class productProfitReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            itemOptions: [],
            noDataMessage: ''
        }
        this.core = App.instance.core;
        this.cmbItem = null;

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
    }
    render(){
        return (
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
                        <NdForm id="frmReport" parent={this} width="100%" colCount={2}>
                            <NdItem>
                                <NdLabel text={this.t("dtDate")}/>
                                <NbDateRange id={"dtDate"} parent={this} 
                                startDate={moment().startOf('month')} 
                                endDate={moment().endOf('month')}/>
                            </NdItem>
                            <NdItem>
                                <NdLabel text={this.t("cmbMainGrp")}/>
                                <NdSelectBox simple={true} parent={this} id="cmbMainGrp"
                                value={''}
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                placeholder={this.t("selectMainGrp")}
                                showClearButton={true}
                                data={{
                                    source:{
                                        select:{
                                            query: "SELECT NAME,CODE FROM ITEM_GROUP " +
                                                    "ORDER BY NAME",
                                        },
                                        sql: this.core.sql
                                    }
                                }}
                                />
                            </NdItem>
                        </NdForm>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-6">
                            
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            {this.state.noDataMessage ? (
                                <div className="alert alert-warning" role="alert">
                                    {this.state.noDataMessage}
                                </div>
                            ) : (
                                <NdGrid id="grdListe" parent={this} 
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
                                    <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                    <ColumnChooser enabled={true} />
                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={true} />}
                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,20,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                    {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                    <Export fileName={this.lang.t("menuOff.slsRpt_01_012")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="ROW_NO" caption={this.t("grdListe.clmRowNo")}  width={70} visible={true}/>
                                    <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmItemCode")} width={130} visible={true}/>
                                    <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmItemName")} width={300}visible={true}/>
                                    <Column dataField="MAIN_GRP_NAME" caption={this.t("grdListe.clmMainGrpName")}width={180} visible={true}/> 
                                    <Column dataField="TOTAL_QUANTITY" caption={this.t("grdListe.clmQuantity")} width={100} visible={true}/>
                                    <Column dataField="AVG_COST_PRICE" caption={this.t("grdListe.clmAvgCostPrice")} width={100} visible={true}
                                    format={{ style: "currency", currency: "EUR", precision: 3}}/>
                                    <Column dataField="TOTAL_COST" caption={this.t("grdListe.clmTotalCost")} width={100} visible={true}
                                    format={{ style: "currency", currency: "EUR", precision: 3}}/>
                                    <Column dataField="AVG_SELL_PRICE" caption={this.t("grdListe.clmAvgSellPrice")} width={100} visible={true}
                                    format={{ style: "currency", currency: "EUR", precision: 3}}/>
                                    <Column dataField="TOTALHT" caption={this.t("grdListe.clmTotalRevenue")} width={100} visible={true}
                                    format={{ style: "currency", currency: "EUR", precision: 3}}/>
                                    <Column dataField="TOTAL_PROFIT" caption={this.t("grdListe.clmTotalProfit")} width={100} visible={true}
                                    format={{ style: "currency", currency: "EUR", precision: 3}}/>
                                    <Column dataField="PROFIT_PERCENT" caption={this.t("grdListe.clmProfitPercent")} width={100} visible={true}
                                    cellRender={((e) => {
                                        const value = e.value != null ? e.value : 0;
                                        return (
                                            <div style={{color: value >= 0 ? '#28a745' : '#dc3545', textAlign: 'right'}}>
                                                {value.toFixed(2)} %
                                            </div>
                                        )
                                    }).bind(this)}/>
                                    <Summary>
                                        <TotalItem column="TOTAL_QUANTITY" summaryType="sum" displayFormat="{0}" />
                                        <TotalItem column="TOTAL_COST" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR", precision: 3}} />
                                        <TotalItem column="TOTALHT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR", precision: 3}} />
                                        <TotalItem column="TOTAL_PROFIT" summaryType="sum" valueFormat={{ style: "currency", currency: "EUR", precision: 3}} />
                                        <TotalItem column="PROFIT_PERCENT" summaryType="avg" valueFormat={{ precision: 2 }} displayFormat="{0} %" />
                                    </Summary>
                                </NdGrid>
                            )}
                        </div>
                    </div>                    
                </ScrollView>
            </div>
        )
    }

    async btnGetirClick()
    {
        try {
            this.setState({ noDataMessage: '' });
            
            let tmpQuery = {
                query: "SELECT " +
                       "ROW_NUMBER() OVER(ORDER BY MAIN_GRP_NAME, ITEM_NAME) AS ROW_NO, " +
                       "MAIN_GRP_NAME, " +
                       "ITEM_NAME, " +
                       "ITEM_CODE, " +
                       "SUM(QUANTITY) AS TOTAL_QUANTITY, " +
                       "ROUND(AVG(COST_PRICE), 2) AS AVG_COST_PRICE, " +
                       "ROUND(SUM(TOTAL_COST), 2) AS TOTAL_COST, " +
                       "ROUND(SUM(TOTALHT), 2) AS TOTALHT, " +
                       "ROUND((SUM(TOTALHT) - SUM(TOTAL_COST)), 2) AS TOTAL_PROFIT, " +
                       "ROUND(AVG(TOTALHT / NULLIF(QUANTITY, 0)), 2) AS AVG_SELL_PRICE,  " +
                       "CASE WHEN SUM(TOTAL_COST) > 0 THEN " +
                       "ROUND(((SUM(TOTALHT) - SUM(TOTAL_COST)) / SUM(TOTAL_COST)) * 100, 2) " +
                       "ELSE 0 END AS PROFIT_PERCENT " +
                       "FROM DOC_ITEMS_DETAIL_VW_01 " +
                       "WHERE TYPE = 1 AND REBATE= 0 AND " +
                       "(DOC_TYPE = 20 OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) " +
                       "AND (MAIN_CODE = @MAIN_CODE OR @MAIN_CODE = '') " +
                       "AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE " +
                       "GROUP BY MAIN_GRP_NAME, ITEM_NAME,ITEM_CODE " +
                       "ORDER BY MAIN_GRP_NAME, ITEM_NAME",
                param : ['FIRST_DATE:date','LAST_DATE:date','MAIN_CODE:string|50'],
                value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbMainGrp.value]
            };
            let result = await this.core.sql.execute(tmpQuery);
            
            if(result && result.result && result.result.recordset && result.result.recordset.length > 0) {
                let tmpSource =
                {
                    source : 
                    {
                        select: tmpQuery,
                        sql : this.core.sql
                    }
                }
                await this.grdListe.dataRefresh(tmpSource);
            }
            else {
                // Veri bulunamadığında mesajı güncelleyelim
                this.setState({ noDataMessage: this.lang.t("msgNoData")});
                console.log("Seçilen kriterlere uygun veri bulunamadı.");
            }
        }
        catch(err) {
            console.error("Veri yüklenirken bir hata oluştu:", err.message);
        }
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
}

// CSS sınıflarını tanımlayalım
<style>
{`
    .positive-value {
        color: #28a745 !important;
        text-align: right;
    }
    .negative-value {
        color: #dc3545 !important;
        text-align: right;
    }
`}
</style>