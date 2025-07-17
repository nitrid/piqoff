import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,Paging,Pager,Scrolling,Export, Summary, TotalItem, StateStoring} from '../../../../core/react/devex/grid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm,NdItem, NdLabel } from '../../../../core/react/devex/form.js';

export default class itemSalesReport extends React.PureComponent
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
        setTimeout(async () =>  {},1000)
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSlsOrderState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSlsOrderState',USERS:this.user.CODE, PAGE:this.props.data.id, APP:"OFF"})
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
                    query : `SELECT ITEM_NAME,ITEM_CODE,CDATE,TICKET_NO,QUANTITY,PRICE,AMOUNT,TICKET_DATE,STATUS,WEIGHER_NAME, 
                            ISNULL((SELECT TOP 1 DESCRIPTION + '/' FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'PRICE'),'') + ' ' + ISNULL((SELECT TOP 1 DESCRIPTION + '/' FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'QUANTITY'),'') + ''+ ISNULL((SELECT CASE WHEN COUNT(TAG) = 0 THEN '' ELSE CONVERT(NVARCHAR,COUNT(TAG)) + ' Réimprimé' END FROM BALANCE_COUNTER_EXTRA WHERE BALANCE_COUNTER_EXTRA.BALANCE = BC.GUID AND TAG = 'REPRINT'),'')  AS DESCRIPTIONS ,
                            CONVERT(NVARCHAR, CDATE , 108) AS TIME 
                            FROM BALANCE_COUNTER_VW_01 AS BC WHERE (CONVERT(NVARCHAR,CDATE,112) >= @FIRST_DATE AND CONVERT(NVARCHAR,CDATE,112) <= @LAST_DATE) AND TICKET_DATE <> '19700101' ORDER BY TICKET_NO ASC` ,
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
                                }
                                />
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
                            onRowPrepared={(e) =>
                            {
                                if(e.rowType == 'data' && e.data.STATUS  == false)
                                {
                                    e.rowElement.style.color ="Silver"
                                }
                            }}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdListe"}/>
                                <ColumnChooser enabled={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_014")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="TICKET_DATE" caption={this.t("grdListe.clmCDate")} visible={true}  dataType="date" format={'dd/MM/yyyy'}  width={150}/> 
                                <Column dataField="TIME" caption={this.t("grdListe.clmTime")} visible={true} width={100}/> 
                                <Column dataField="WEIGHER_NAME" caption={this.t("grdListe.clmUser")} visible={true}  dataType="number"  width={120}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdListe.clmCode")} visible={true}  dataType="number"  width={150}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdListe.clmName")} visible={true} width={200}/> 
                                <Column dataField="TICKET_NO" caption={this.t("grdListe.clmTicketNo")} visible={true}  dataType="number"  width={100}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdListe.clmQuantity")} visible={true}  dataType="number"  width={100}/> 
                                <Column dataField="PRICE" caption={this.t("grdListe.clmPrice")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/> 
                                <Column dataField="AMOUNT" caption={this.t("grdListe.clmAmount")} visible={true}  dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={100}/> 
                                <Column dataField="DESCRIPTIONS" caption={this.t("grdListe.clmDescriptions")} visible={true} width={350}/> 
                                <Column dataField="STATUS" caption={this.t("grdListe.clmStatus")} visible={true}  dataType="boolean"  width={80}/> 
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"
                                    />
                                     <TotalItem
                                    column="PRICE"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                      <TotalItem
                                    column="AMOUNT"
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