import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, TotalItem,StateStoring} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel} from '../../../../core/react/devex/form.js';

export default class docComparisonReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this.btnGetirClick = this.btnGetirClick.bind(this)
        this.loadState = this.loadState.bind(this)
        this.saveState = this.saveState.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => { }, 1000);
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
                select : 
                {
                    query : 
                            `SELECT  
                            INPUT_NAME, 
                            INPUT_CODE, 
                            INPUT, 
                            ISNULL((SELECT SUM(TOTAL) FROM DOC_VW_01 AS ORDERS WHERE ORDERS.DOC_TYPE=60 AND ORDERS.TYPE=1 AND ORDERS.INPUT = DOC_VW_01.INPUT AND ORDERS.REBATE = 0 AND ORDERS.DOC_DATE >= @FIRST_DATE AND ORDERS.DOC_DATE <= @LAST_DATE),0) AS ORDERS, 
                            ISNULL((SELECT SUM(TOTAL) FROM DOC_VW_01 AS DISPATCH WHERE DISPATCH.DOC_TYPE=40 AND DISPATCH.TYPE=1 AND DISPATCH.INPUT = DOC_VW_01.INPUT AND DISPATCH.REBATE = 0 AND DISPATCH.DOC_DATE >= @FIRST_DATE AND DISPATCH.DOC_DATE <= @LAST_DATE),0) AS DISPATCH, 
                            ISNULL((SELECT SUM(TOTAL) FROM DOC_VW_01 AS INVOICE WHERE INVOICE.DOC_TYPE=20 AND INVOICE.TYPE=1 AND INVOICE.INPUT = DOC_VW_01.INPUT AND INVOICE.REBATE = 0 AND INVOICE.DOC_DATE >= @FIRST_DATE AND INVOICE.DOC_DATE <= @LAST_DATE),0) AS INVOICE, 
                            ISNULL((SELECT SUM(AMOUNT) FROM DOC_CUSTOMER_VW_01 AS PAYMENT WHERE PAYMENT.TYPE = 0 AND PAYMENT.OUTPUT = DOC_VW_01.INPUT AND PAYMENT.DOC_TYPE = 200 AND PAYMENT.DOC_DATE >= @FIRST_DATE AND PAYMENT.DOC_DATE <= @LAST_DATE),0) AS COLLECTION 
                            FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE IN(60,61,20,40) AND REBATE = 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE GROUP BY INPUT_NAME,INPUT_CODE,INPUT ` ,
                    param : ['FIRST_DATE:date','LAST_DATE:date'],
                    value : [this.dtDate.startDate,this.dtDate.endDate]
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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment().startOf('month')} endDate={moment().endOf('month')}/>
                                </NdItem>
                            </NdForm>
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
                            showBorders={true}
                            filterRow={{visible:false}} 
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
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.slsRpt_01_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="INPUT_CODE" caption={this.t("grdListe.clmCode")} visible={true} /> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="ORDERS" caption={this.t("grdListe.clmOrders")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="DISPATCH" caption={this.t("grdListe.clmDispatch")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="INVOICE" caption={this.t("grdListe.clmInvoice")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                <Column dataField="COLLECTION" caption={this.t("grdListe.clmCollection")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} defaultSortOrder="desc"/> 
                                <Summary>
                                    <TotalItem
                                    column="ORDERS"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="DISPATCH"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="INVOICE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="COLLECTION"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}