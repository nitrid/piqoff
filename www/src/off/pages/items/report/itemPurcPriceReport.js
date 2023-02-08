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
import { Chart, Series, CommonSeriesSettings,Format, Legend,Margin,ArgumentAxis,Grid,Title,Tooltip} from 'devextreme-react/chart';
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
        this.detailData = []

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
        this.detailData = [{value:"PURC",name :this.t("typePurc"),color:"#FF0000"},{value:"SALE", name:this.t("typeSale"),color:"#008000"}]
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
                    query : "SELECT   " +
                            "ITEMS.GUID,  " +
                            "ITEMS.NAME,  " +
                            "ITEMS.CODE,  " +
                            "PRICE.PRICE AS PURC_PRICE,  " +
                            "ISNULL((SELECT [dbo].[FN_PRICE_SALE](ITEMS.GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')),0) AS PRICE_SALE,  " +
                            "ISNULL((SELECT TOP 1 TITLE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = PRICE.CUSTOMER),'') AS CUSTOMER_NAME, " +
                            "PRICE.CUSTOMER AS CUSTOMER, " + 
                            "PRICE.LDATE AS LDATE " +
                            "FROM ITEMS AS ITEMS   " +
                            "INNER JOIN  " +
                            "ITEM_PRICE AS PRICE  " +
                            "ON ITEMS.GUID = PRICE.ITEM  " +
                            "WHERE PRICE.LDATE > @FISRT_DATE AND PRICE.TYPE = 1  ORDER BY ITEMS.NAME",
                    param : ['FISRT_DATE:date','LAST_DATE:date'],
                    value : [this.dtFirst.value]
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
            query :"SELECT CONVERT(NVARCHAR,CONVERT(datetime,CHANGE_DATE),104) AS DATE, " +
                   "PRICE AS PURC " +
                   "FROM [dbo].[ITEM_PRICE_LOG_VW_01] WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 1 AND CUSTOMER = @CUSTOMER AND UPDATE_DATE > @FISRT_DATE " + 
                   "UNION ALL " + 
                   "SELECT CONVERT(NVARCHAR,LDATE,104) AS DATE,PRICE AS PURC FROM ITEM_PRICE_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 1 AND CUSTOMER_GUID = @CUSTOMER ",
            param : ['ITEM_GUID:string|50','CUSTOMER:string|50','FISRT_DATE:date'],
            value : [pGuid,pCustomer,this.dtFirst.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpSaleQuery = 
        {
            query :"SELECT CONVERT(NVARCHAR,CONVERT(datetime,CHANGE_DATE),104) AS DATE, " +
                   "PRICE AS SALE " +
                   "FROM [dbo].[ITEM_PRICE_LOG_VW_01] WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 0 AND UPDATE_DATE > @FISRT_DATE " + 
                   "UNION ALL " + 
                   "SELECT CONVERT(NVARCHAR,LDATE,104) AS DATE,PRICE AS SALE FROM ITEM_PRICE_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 0 ",
            param : ['ITEM_GUID:string|50','CUSTOMER:string|50','FISRT_DATE:date'],
            value : [pGuid,pCustomer,this.dtFirst.value]
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
                           <Form>
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    >
                                    </NdDatePicker>
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
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.stk_05_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdItemPurcPriceReport.clmCode")} visible={true} width={150}/> 
                                <Column dataField="NAME" caption={this.t("grdItemPurcPriceReport.clmName")} visible={true} width={350}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdItemPurcPriceReport.clmCustomer")} visible={true} width={250}/> 
                                <Column dataField="LDATE" caption={this.t("grdItemPurcPriceReport.clmLdate")} dataType="date" width={250}
                                    editorOptions={{value:null}}
                                    cellRender={(e) => 
                                    {
                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                        {
                                            return e.text
                                        }
                                        
                                        return
                                    }}/>
                                <Column dataField="PURC_PRICE" caption={this.t("grdItemPurcPriceReport.clmTotalCost")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                                <Column dataField="PRICE_SALE" caption={this.t("grdItemPurcPriceReport.clmSale")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
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
                                    palette="Violet"
                                    dataSource={this.state.dataSource}
                                    width={'1150'}
                                    height={'700'}  
                                    >
                                    <CommonSeriesSettings
                                        argumentField="DATE"
                                        type={"line"}
                                        hoverMode="allArgumentPoints"
                                        selectionMode="allArgumentPoints"
                                        valueField={true}
                                    />
                                     {
                                        this.detailData.map((item) => <Series
                                        key={item.value}
                                        valueField={item.value}
                                        name={item.name} 
                                        color={item.color}/>)
                                    }
                                    <Margin bottom={20} />
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
                                    <Tooltip enabled={true} />
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