import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, TotalItem,StateStoring} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm,NdItem,NdLabel } from '../../../../core/react/devex/form.js';

export default class itemInvoicePurchaseReport extends React.PureComponent
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
                    query : `SELECT ITEM_CODE,MAX(ITEM_NAME) AS ITEM_NAME,SUM(QUANTITY) AS QUANTITY,ROUND(SUM(TOTALHT),2) AS AMOUNT,ROUND(SUM(VAT),2) AS VAT,ROUND(SUM(TOTAL),2) AS TOTAL 
                            FROM DOC_ITEMS_VW_01 
                            WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND REBATE = 0 AND TYPE = 0 AND (DOC_TYPE =20 OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000')) 
                            GROUP BY  ITEM_CODE`,
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
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
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
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_010")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true} defaultSortOrder="asc"/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Column dataField="VAT" caption={this.t("grdListe.clmVat")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true} /> 
                                <Column dataField="TOTAL" caption={this.t("grdListe.clmTotal")} format={{ style: "currency", currency: Number.money.code,precision: 2}} visible={true}/> 
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"
                                    />
                                    <TotalItem
                                    column="AMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="VAT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="TOTAL"
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