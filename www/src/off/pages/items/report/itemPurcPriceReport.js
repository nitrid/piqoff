import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { Chart,Tooltip, Series, CommonSeriesSettings,Format, Legend,Margin,ArgumentAxis,Grid,Title} from 'devextreme-react/chart';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class itemPurcPriceReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.state = {dataSource : {}} 
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.detailData = [{value:"PURC",name :this.t("typePurc"),color:"#FF0000"},{value:"SALE", name:this.t("typeSale"),color:"#008000"}]


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
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *" + 
                            " FROM " + 
                            "(SELECT   " +
                            "ITEMS.GUID,  " +
                            "ITEMS.NAME,  " +
                            "ITEMS.CODE,  " +
                            "PRICE.PRICE AS PURC_PRICE,  " +
                            "ITEMS.VAT AS VAT, " +
                            "ISNULL((SELECT TOP 1 PRICE FROM ITEM_PRICE_LOG_VW_01 WHERE ITEM_PRICE_LOG_VW_01.ITEM_GUID = PRICE.ITEM_GUID AND ITEM_PRICE_LOG_VW_01.CUSTOMER = PRICE.CUSTOMER_GUID AND TYPE = 1 ORDER BY CHANGE_DATE DESC),0) AS FISRT_PRICE," + 
                            "ISNULL((SELECT [dbo].[FN_PRICE_SALE](ITEMS.GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')),0) AS PRICE_SALE,  " +
                            "PRICE.CUSTOMER_NAME AS CUSTOMER_NAME, " +
                            "PRICE.CUSTOMER_GUID AS CUSTOMER, " + 
                            "PRICE.LDATE AS LDATE " +
                            "FROM ITEMS_VW_01 AS ITEMS   " +
                            "INNER JOIN  " +
                            "ITEM_PRICE_VW_01 AS PRICE  " +
                            "ON ITEMS.GUID = PRICE.ITEM_GUID  " +
                            "WHERE PRICE.LDATE > @FISRT_DATE AND PRICE.TYPE = 1 AND ((PRICE.CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND ((ITEMS.MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = ''))) AS TMP  ORDER BY NAME",
                    param : ['FISRT_DATE:date','LAST_DATE:date','CUSTOMER_CODE:string|50','MAIN_GRP:string|50'],
                    value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbTedarikci.value,this.cmbUrunGrup.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdItemPurcPriceReport.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async getDetail(pGuid,pCustomer)
    {

        let tmpQuery = 
        {
            query :"SELECT CONVERT(NVARCHAR,CONVERT(datetime,CHANGE_DATE),104) AS CONVERT_DATE, CHANGE_DATE AS DATE, " +
                   "PRICE AS PURC " +
                   "FROM [dbo].[ITEM_PRICE_LOG_VW_01] WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 1 AND CUSTOMER = @CUSTOMER  " + 
                   "UNION ALL " + 
                   "SELECT CONVERT(NVARCHAR,LDATE,104) AS CONVERT_DATE,LDATE AS DATE,PRICE AS PURC FROM ITEM_PRICE_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 1 AND CUSTOMER_GUID = @CUSTOMER ",
            param : ['ITEM_GUID:string|50','CUSTOMER:string|50'],
            value : [pGuid,pCustomer]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpSaleQuery = 
        {
            query :"SELECT CONVERT(NVARCHAR,CONVERT(datetime,CHANGE_DATE),104) AS CONVERT_DATE, CHANGE_DATE AS DATE, " +
                   "PRICE AS SALE " +
                   "FROM [dbo].[ITEM_PRICE_LOG_VW_01] WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 0 " + 
                   "UNION ALL " + 
                   "SELECT CONVERT(NVARCHAR,LDATE,104) AS CONVERT_DATE,LDATE AS DATE,PRICE AS SALE FROM ITEM_PRICE_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 0 ",
            param : ['ITEM_GUID:string|50','CUSTOMER:string|50'],
            value : [pGuid,pCustomer]
        }
        let tmpSaleData = await this.core.sql.execute(tmpSaleQuery) 
        let tmpRecordset = []
        for (let i = 0; i < tmpData.result.recordset.length; i++) 
        {
            tmpRecordset.push(tmpData.result.recordset[i])
        }
        for (let i = 0; i < tmpSaleData.result.recordset.length; i++) 
        {
            tmpRecordset.push(tmpSaleData.result.recordset[i])
        }
        function dateShot(a, b)
        {
            return new Date(a.DATE).getTime() - new Date(b.DATE).getTime();
        }
        tmpRecordset.sort(dateShot)
        if(tmpData.result.recordset.length > 0)
        {
            this.setState({dataSource:tmpRecordset})
        }
        else
        {
            this.setState({dataRefresh:{0:{QUANTITY:0,DOC_DATE:''}}})
        }
        this.popPriceGraphic.show()
    }
    btnPointPopup()
    {
        this.txtDescription.value = '',
        this.txtPointAmount.value =  0,
        this.txtPoint.value = 0,
        this.popPointEntry.show()
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
                           {/* dtFirst */}
                           <Form colCount={2}>
                                <Item colSpan={3}>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                           </Form>
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-6">
                           <Form colCount={2}>
                                <Item>
                                    <Label text={this.t("cmbCustomer")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbTedarikci" showClearButton={true} notRefresh={true}  searchEnabled={true} 
                                        displayExpr="TITLE"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1) ORDER BY TITLE ASC"},sql : this.core.sql}}}
                                        />
                                </Item>
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        data={{source: {select : {query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql : this.core.sql}}}
                                        />
                                </Item>
                           </Form>
                        </div>
                       
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                          {this.t("dlbClikMsg")}
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdItemPurcPriceReport" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            height={'700'} 
                            width={'100%'}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                    this.getDetail(e.data.GUID,e.data.CUSTOMER)
                                }}
                            onCellPrepared={(e) =>
                                {
                                    if(e.rowType === "data")
                                    {
                                        console.log(e)
                                        let tmpExVat = e.data.PRICE_SALE / ((e.data.VAT / 100) + 1)
                                        let tmpMargin = e.data.PURC_PRICE == 0 || tmpExVat == 0 ? 0 : tmpExVat - e.data.PURC_PRICE;
                                        let tmpMarginRate = tmpMargin == 0 ? 0 : (tmpMargin /  e.data.PURC_PRICE) * 100   //((tmpExVat - e.data.CUSTOMER_PRICE)/tmpExVat) * 100
                                        //e.data.MARGIN =  tmpMarginRate.toFixed(2) + "% / €" + tmpMargin.toFixed(2);        
                                        //e.data.GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2); 
                                        e.values[7] = tmpMarginRate.toFixed(2) + "% / €" + tmpMargin.toFixed(2); 

                                        // NET_MARGIN ANINDA ETKI ETSİN DİYE YAPILDI
                                        let tmpNetExVat = e.data.PRICE_SALE / ((e.data.VAT / 100) + 1)
                                        let tmpNetMargin = tmpNetExVat == 0 || e.data.PURC_PRICE == 0 ? 0 : (tmpNetExVat - e.data.PURC_PRICE) / 1.15;
                                        let tmpNetMarginRate = tmpNetMargin == 0 ? 0 : (tmpNetMargin / e.data.PURC_PRICE) * 100
                                        // e.data.NET_MARGIN = tmpNetMargin.toFixed(2) + "€ / %" +  tmpNetMarginRate.toFixed(2);
                                        // e.data.NET_MARGIN_RATE = tmpNetMarginRate.toFixed(2);    
                                        e.values[8] =   tmpNetMargin.toFixed(2) + "€  %" +  tmpNetMarginRate.toFixed(2);
                                    }
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.stk_05_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdItemPurcPriceReport.clmCode")} visible={true} width={150}/> 
                                <Column dataField="NAME" caption={this.t("grdItemPurcPriceReport.clmName")} visible={true} width={350}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemPurcPriceReport.clmCustomer")} visible={true} width={250}/> 
                                <Column dataField="LDATE" caption={this.t("grdItemPurcPriceReport.clmLdate")} dataType="date" width={150}
                                    editorOptions={{value:null}}
                                    cellRender={(e) => 
                                    {
                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                        {
                                            return e.text
                                        }
                                        
                                        return
                                    }}/>
                                <Column dataField="FISRT_PRICE" caption={this.t("grdItemPurcPriceReport.clmFisrtCost")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                <Column dataField="PURC_PRICE" caption={this.t("grdItemPurcPriceReport.clmTotalCost")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdItemPurcPriceReport.clmSale")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={100}/> 
                                <Column dataField="MARGIN" caption={this.t("grdItemPurcPriceReport.clmMargin")} visible={true}/> 
                                <Column dataField="NETMARGIN" caption={this.t("grdItemPurcPriceReport.clmNetMargin")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* Puan Detayı PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popPriceGraphic"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        container={"#root"} 
                        width={'1200'}
                        height={'800'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                <Chart
                                    dataSource={this.state.dataSource}
                                    width={'1150'}
                                    height={'700'} 
                                    tooltip={{"enabled":true}} 
                                    >
                                    <CommonSeriesSettings
                                        argumentField="CONVERT_DATE"
                                        type={"line"}
                                    />
                                     {
                                        this.detailData.map((item) => <Series
                                        key={item.value}
                                        valueField={item.value}
                                        name={item.name} 
                                        color={item.color}/>)
                                    }
                                    <ArgumentAxis
                                        valueMarginsEnabled={true}
                                        discreteAxisDivisionMode="crossLabels"
                                    >
                                        <Grid visible={true} />
                                    </ArgumentAxis>
                                    <Legend
                                        verticalAlignment="bottom"
                                        horizontalAlignment="center"
                                        itemTextPosition="bottom"
                                    />
                                    <Export enabled={true} />
                                    <Title text={this.t("graphicTitle")}>
                                    </Title>
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