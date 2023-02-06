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
import { Chart, Series, CommonSeriesSettings,Format, Legend,Margin,ArgumentAxis,Grid,Title} from 'devextreme-react/chart';
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
        this.detailData = [{value:"PURC",name :this.lang.t("msgWarning")},{value:"SALE", name:this.lang.t("msgWarning")}]
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
    async getDetail(pGuid)
    {

        let tmpQuery = 
        {
            query :"SELECT SUM(QUANTITY) AS QUANTITY,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE FROM POS_SALE_VW_01 " +
                    "WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999' " +
                    "GROUP BY DOC_DATE,ITEM_CODE ",
            param : ['CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
            value : [this.txtRef.value,this.dtDate.startDate,this.dtDate.endDate]
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
        App.instance.setState({isExecute:true})
        await this.grpGrpDetail.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
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
                                    this.getDetail(e.data.ITEM_GRP_NAME)
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menuOff.pos_02_009")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CODE" caption={this.t("grdItemPurcPriceReport.clmGrpName")} visible={true} width={150}/> 
                                <Column dataField="NAME" caption={this.t("grdItemPurcPriceReport.clmTicket")} visible={true} width={350}/> 
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
                                <Column dataField="PRICE_SALE" caption={this.t("grdItemPurcPriceReport.clmFamount")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* Puan Detayı PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popPriceGraphic"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popPriceGraphic.title")}
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
                                    >
                                    <CommonSeriesSettings
                                        argumentField="DATE"
                                        type={"line"}
                                    />
                                     {
                                        this.detailData.map((item) => <Series
                                        key={item.date}
                                        valueField={item.date}
                                        name={item.date} />)
                                    }
                                    <Margin bottom={20} />
                                    <ArgumentAxis
                                        valueMarginsEnabled={false}
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
                                    <Title text="Energy Consumption in 2004">
                                    </Title>
                                    </Chart>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    <div>
                        <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        >
                         <div className="row">
                         <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                         
                            </div>
                         </div>
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            <NdGrid id="grdSaleTicketItems" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowDblClick={async(e)=>
                                    {
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="BARCODE" caption={this.t("grdSaleTicketItems.clmBarcode")} visible={true} width={150}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdSaleTicketItems.clmName")} visible={true} width={250}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdSaleTicketItems.clmQuantity")} visible={true} width={100}/> 
                                    <Column dataField="PRICE" caption={this.t("grdSaleTicketItems.clmPrice")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    <Column dataField="TOTAL" caption={this.t("grdSaleTicketItems.clmTotal")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                            </NdGrid>
                            </div>
                            <div className="col-3 ps-0">
                            <NdGrid id="grdSaleTicketPays" parent={this} 
                                selection={{mode:"multiple"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={false}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowDblClick={async(e)=>
                                    {
                                    
                                    }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="PAY_TYPE_NAME" caption={this.t("grdSaleTicketPays.clmPayName")} visible={true} width={155}/> 
                                    <Column dataField="LINE_TOTAL" caption={this.t("grdSaleTicketPays.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                            </NdGrid>
                            </div>
                            </div>
                        </NdPopUp>
                    </div>
                </ScrollView>
            </div>
        )
    }
}