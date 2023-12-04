import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import {  Chart, Series, CommonSeriesSettings,  Format, Legend } from 'devextreme-react/chart';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class itemGrpSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.state = {dataSource : {}} 
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.btnAnalysis = this.btnAnalysis.bind(this)
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {

    }
    async _btnGetClick()
    {
        let tmpQuery = {
            query :"SELECT COUNT(GUID) AS TICKET,ISNULL(AVG(TOTAL),0) AS AVGTOTAL FROM POS_VW_01 WHERE STATUS = 1 AND  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE ",
            param : ['FISRT_DATE:date','LAST_DATE:date'],
            value : [this.dtDate.startDate,this.dtDate.endDate]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.txtTotalTicket.value = tmpData.result.recordset[0].TICKET
            this.txtTicketAvg.value = tmpData.result.recordset[0].AVGTOTAL.toLocaleString('fr-FR', {style: 'currency',currency: 'EUR'});
        }
        if(this.chkTicket.value == true)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : "SELECT ITEM_GRP_NAME,ITEM_GRP_CODE, " +
                        "(SELECT COUNT(*) FROM (SELECT COUNT(POS_GUID) AS POS_GUID FROM POS_SALE_VW_01 AS PS WHERE PS.ITEM_GRP_NAME = POS_SALE_DATEIL_REPORT_VW_01.ITEM_GRP_NAME AND PS.DOC_DATE >= @FISRT_DATE AND PS.DOC_DATE <= @LAST_DATE GROUP BY POS_GUID) AS TMP) AS TICKET,  " +
                        "ROUND(SUM(TOTAL),2) AS TOTAL,  " +
                        "ROUND(SUM(FAMOUNT),2) AS FAMOUNT,  " +
                        "ROUND(SUM(QUANTITY),2) AS QUANTITY,  " +
                        "ROUND(SUM(VAT),2) AS VAT,  " +
                        "ROUND(SUM(COST_PRICE * QUANTITY),2) AS TOTAL_COST,  " +
                        "(SUM(FAMOUNT) - SUM(COST_PRICE * QUANTITY)) AS REST_TOTAL  " +
                        "FROM POS_SALE_DATEIL_REPORT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE GROUP BY ITEM_GRP_NAME,ITEM_GRP_CODE ORDER BY ITEM_GRP_CODE ",
                        param : ['FISRT_DATE:date','LAST_DATE:date'],
                        value : [this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdGroupSalesReport.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
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
                        query : "SELECT ITEM_GRP_NAME,ITEM_GRP_CODE, " +
                        "'' AS TICKET,  " +
                        "ROUND(SUM(TOTAL),2) AS TOTAL,  " +
                        "ROUND(SUM(FAMOUNT),2) AS FAMOUNT,  " +
                        "ROUND(SUM(QUANTITY),2) AS QUANTITY,  " +
                        "ROUND(SUM(VAT),2) AS VAT,  " +
                        "ROUND(SUM(COST_PRICE * QUANTITY),2) AS TOTAL_COST,  " +
                        "(SUM(FAMOUNT) - SUM(COST_PRICE * QUANTITY)) AS REST_TOTAL  " +
                        "FROM POS_SALE_DATEIL_REPORT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE GROUP BY ITEM_GRP_NAME,ITEM_GRP_CODE ORDER BY ITEM_GRP_CODE ",
                        param : ['FISRT_DATE:date','LAST_DATE:date'],
                        value : [this.dtDate.startDate,this.dtDate.endDate]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdGroupSalesReport.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
       
    }
    async getDetail(pGrp)
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :"SELECT  " +
                   "ITEM_CODE, " +
                   "ITEM_NAME, " +
                   "SUM(QUANTITY) AS QUANTITY, " +
                   "ROUND(SUM(TOTAL),2) AS TOTAL, " +
                   "ROUND(SUM(FAMOUNT),2) AS FAMOUNT, " +
                   "ROUND(SUM(VAT),2) AS VAT, " +
                   "ROUND(SUM(COST_PRICE * QUANTITY),2) AS COST_PRICE, " +
                   "(SUM(FAMOUNT) - SUM(COST_PRICE * QUANTITY)) AS REST_TOTAL " +
                   "FROM POS_SALE_DATEIL_REPORT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND ITEM_GRP_NAME = @ITEM_GRP_NAME " +
                   " GROUP BY  ITEM_CODE,ITEM_NAME ORDER BY ITEM_NAME " ,
                   param : ['FISRT_DATE:date','LAST_DATE:date','ITEM_GRP_NAME:string|50'],
                   value : [this.dtDate.startDate,this.dtDate.endDate,pGrp]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grpGrpDetail.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
        this.popGrpDetail.show()
    }
    btnPointPopup()
    {
        this.txtDescription.value = '',
        this.txtPointAmount.value =  0,
        this.txtPoint.value = 0,
        this.popPointEntry.show()
    }
    async btnAnalysis()
    {
        this.setState({dataSource:{}})
        let tmpQuery = 
        {
            query : "SELECT ITEM_GRP_CODE AS ITEM_GRP_CODE,ITEM_GRP_NAME, " +
            "ROUND(SUM(TOTAL),2) AS TOTAL  " +
            "FROM POS_SALE_DATEIL_REPORT_VW_01 WHERE DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE GROUP BY ITEM_GRP_CODE,ITEM_GRP_NAME ORDER BY ITEM_GRP_CODE,ITEM_GRP_NAME",
            param : ['FIRST_DATE:date','LAST_DATE:date'],
            value : [this.dtDate.startDate,this.dtDate.endDate]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.setState({dataSource:tmpData.result.recordset})
        }
        else
        {
            this.setState({dataRefresh:{0:{QUANTITY:0,DOC_DATE:''}}})
        }
        this.popAnalysis.show()
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
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-6">
                            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                        </div>
                        <div className="col-3">
                            <Form>
                                <Item>
                                    <Label text={this.t("chkTicket")} alignment="right" />
                                    <NdCheckBox id="chkTicket" parent={this} defaultValue={false}
                                    onValueChanged={(e)=>
                                    {
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPurcoffer">
                                <Item  >
                                    <Label text={this.t("txtTotalTicket")} alignment="right" />
                                    <NdTextBox id="txtTotalTicket" parent={this} simple={true} readOnly={true} 
                                    maxLength={32}
                                   
                                    ></NdTextBox>
                                </Item>
                                <Item  >
                                    <Label text={this.t("txtTicketAvg")} alignment="right" />
                                    <NdTextBox id="txtTicketAvg" parent={this} simple={true} readOnly={true} 
                                    maxLength={32}
                                   
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdGroupSalesReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            height={'700'} 
                            width={'100%'}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                                {
                                    this.getDetail(e.data.ITEM_GRP_NAME)
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_009")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="ITEM_GRP_CODE" caption={this.t("grdGroupSalesReport.clmGrpCode")} visible={true} width={100}/> 
                                <Column dataField="ITEM_GRP_NAME" caption={this.t("grdGroupSalesReport.clmGrpName")} visible={true} width={300}/> 
                                <Column dataField="TICKET" caption={this.t("grdGroupSalesReport.clmTicket")} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdGroupSalesReport.clmQuantity")} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="TOTAL_COST" caption={this.t("grdGroupSalesReport.clmTotalCost")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="FAMOUNT" caption={this.t("grdGroupSalesReport.clmFamount")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="VAT" caption={this.t("grdGroupSalesReport.clmVat")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="TOTAL" caption={this.t("grdGroupSalesReport.clmTotal")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} visible={true} width={150} allowHeaderFiltering={false}/> 
                                <Column dataField="REST_TOTAL" caption={this.t("grdGroupSalesReport.clmRestTotal")} visible={true}   format={{ style: "currency", currency: "EUR",precision: 2}} allowHeaderFiltering={false}/> 
                                <Summary>
                                    <TotalItem
                                    column="TOTAL_COST"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                     <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum" />
                                     <TotalItem
                                    column="FAMOUNT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                    <TotalItem
                                    column="VAT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                    <TotalItem
                                    column="TOTAL"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                    <TotalItem
                                    column="REST_TOTAL"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                </Summary>
                            </NdGrid>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-6">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGetAnalysis")} type="danger" width="100%" onClick={this.btnAnalysis}></NdButton>
                        </div>
                    </div>
                    {/* Detayı PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popGrpDetail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popGrpDetail.title")}
                        container={"#root"} 
                        width={'1200'}
                        height={'800'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <NdGrid id="grpGrpDetail" parent={this} 
                                    selection={{mode:"none"}} 
                                    showBorders={true}
                                    filterRow={{visible:true}} 
                                    headerFilter={{visible:false}}
                                    height={'600'} 
                                    width={'100%'}
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    loadPanel={{enabled:true}}
                                    onCellPrepared={(e) =>
                                    {

                                    }}
                                    onRowDblClick={async(e)=>
                                    {
                                    }}
                                    >                            
                                        <Scrolling mode="standart" />
                                        <Export fileName={this.lang.t("menuOff.pos_02_009")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grpGrpDetail.clmCode")} visible={true} width={100}/> 
                                        <Column dataField="ITEM_NAME" caption={this.t("grpGrpDetail.clmName")} visible={true} width={250}/> 
                                        <Column dataField="QUANTITY" caption={this.t("grpGrpDetail.clmQuantity")} visible={true} width={80}/> 
                                        <Column dataField="COST_PRICE" caption={this.t("grpGrpDetail.clmTotalCost")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                        <Column dataField="FAMOUNT" caption={this.t("grpGrpDetail.clmFamount")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                        <Column dataField="VAT" caption={this.t("grpGrpDetail.clmVat")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                        <Column dataField="TOTAL" caption={this.t("grpGrpDetail.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                        <Column dataField="REST_TOTAL" caption={this.t("grpGrpDetail.clmRestTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                        <Summary>
                                            <TotalItem
                                            column="TOTAL_COST"
                                            summaryType="sum"
                                            valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                            <TotalItem
                                            column="FAMOUNT"
                                            summaryType="sum"
                                            valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                            <TotalItem
                                            column="VAT"
                                            summaryType="sum"
                                            valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                            <TotalItem
                                            column="TOTAL"
                                            summaryType="sum"
                                            valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                            <TotalItem
                                            column="REST_TOTAL"
                                            summaryType="sum"
                                            valueFormat={{ style: "currency", currency: "EUR",precision: 2}} />
                                        </Summary>
                                    </NdGrid>
                                    </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                      {/* İstatistik POPUP */}
                      <div>
                        <NdPopUp parent={this} id={"popAnalysis"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAnalysis.title")}
                        container={"#root"} 
                        width={'1400'}
                        height={'800'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={3} height={'fit-content'}>
                                <Item colSpan={3}>
                                    <Chart id="chart" dataSource={this.state.dataSource} width={'1400'} height={'600'} autoHidePointMarkers={false}>
                                    <CommonSeriesSettings
                                        argumentField="state"
                                        type="bar"
                                        hoverMode="allArgumentPoints"
                                        selectionMode="allArgumentPoints"
                                        autoHidePointMarkers={false}
                                        >
                                        <Label visible={true}>
                                            <Format type="fixedPoint" precision={1} />
                                        </Label>
                                        </CommonSeriesSettings>
                                            <Series
                                            valueField="TOTAL"
                                            argumentField="ITEM_GRP_CODE"
                                            name="Vente"
                                            type="bar"
                                            color="#008000" />
                                    </Chart>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>          
                </ScrollView>
            </div>
        )
    }
}