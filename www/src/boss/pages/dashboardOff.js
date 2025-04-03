import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import PieChart, { Series, Label, SmallValuesGrouping, Connector, Legend } from 'devextreme-react/pie-chart';
import AnimatedText from '../../core/react/bootstrap/animatedText.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NbPopUp from '../../core/react/bootstrap/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling}  from '../../core/react/devex/grid.js';
import NbLabel from '../../core/react/bootstrap/label.js';


export default class dashboardOff extends React.PureComponent
{
  constructor(props)
  {
    super(props)
    this.core = App.instance.core;
    this.state = { dailySalesTotal : 0, salesAvg: 0, dailySalesCount: 0, dailyOrderTotal: 0,orderAvg:0,dailyOrderCount:0,dailyRebateCount:0,dailyRebateTotal:0,dailyCustomerTicket:0,dailyUseLoyalty:0, bestItemGroup: [],balanceTicketCreated:0,AllItemGroups:0 };
    this.t = App.instance.lang.getFixedT(null ,null ,"dashboardOff")
    this.date = moment(new Date()).format("YYYY-MM-DD")
    this.companyName = ''
    this.query = 
    {
      dailyOrderTotal : { query : "SELECT SUM(TOTAL) AS DAILY_ORDER_TOTAL FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      orderAvg : { query : "SELECT AVG(TOTAL) AS ORDER_AVG FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      dailyOrderCount : { query : "SELECT COUNT(*) AS DAILY_ORDER_COUNT FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },
      dailySalesTotal : { query : "SELECT SUM(TOTAL) AS DAILY_SALES_TOTAL FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      salesAvg : { query : "SELECT AVG(TOTAL) AS SALES_AVG FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      dailySalesCount : { query : "SELECT COUNT(*) AS DAILY_SALES_COUNT FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },
      dailyRebateTotal : { query : "SELECT SUM(TOTAL) AS DAILY_REBATE_TOTAL FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      dailyRebateCount : { query : "SELECT COUNT(*) AS DAILY_REBATE_COUNT FROM DOC_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND TYPE = 0 AND DOC_TYPE = 20 AND REBATE = 1" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      purchaseTotal : { query : "SELECT SUM(AMOUNT) AS PURCHASE_TOTAL FROM DOC_CUSTOMER_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 AND DOC_TYPE = 20 and REBATE = 0" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      purchasePrice : { query : "SELECT COUNT(*) AS PURCHASE_PRICE FROM PRICE_HISTORY AS PRICE WHERE CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePrice : { query : "SELECT COUNT(*) AS SALE_PRICE FROM PRICE_HISTORY AS PRICE WHERE CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      purchasePriceDown : { query : "SELECT COUNT(*) AS PURCHASE_PRICE_DOWN FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      purchasePriceUp : { query : "SELECT COUNT(*) AS PURCHASE_PRICE_UP FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE < PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePriceDown : { query : "SELECT COUNT(*) AS SALE_PRICE_DOWN FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePriceUp : { query : "SELECT COUNT(*) AS SALE_PRICE_UP FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE < PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },  
    }
  }
  async componentDidMount()
  {
    this.init();      
  }
  async init()
  {
    this.dtDate.value = moment(new Date()).format("YYYY-MM-DD")
    this.getExtra()
    let tmpQuery = 
    {
        query : " SELECT TOP 1 * FROM COMPANY_VW_01",
    }
    let tmpResult = (await this.core.sql.execute(tmpQuery)).result.recordset

    if(typeof tmpResult[0] != 'undefined')
    {
        this.companyName = tmpResult[0].NAME
    }
  }
  async getExtra()
  {
    const { result: { recordset: dailyOrderTotalRecordset } } = await this.core.sql.execute(this.query.dailyOrderTotal);
    const { result: { recordset: orderAvgRecordset } } = await this.core.sql.execute(this.query.orderAvg);
    const { result: { recordset: dailyOrderCountRecordset } } = await this.core.sql.execute(this.query.dailyOrderCount);
    const { result: { recordset: dailySalesTotalRecordset } } = await this.core.sql.execute(this.query.dailySalesTotal);
    const { result: { recordset: salesAvgRecordset } } = await this.core.sql.execute(this.query.salesAvg);
    const { result: { recordset: dailySalesCountRecordset } } = await this.core.sql.execute(this.query.dailySalesCount);
    const { result: { recordset: dailyRebateTotalRecordset } } = await this.core.sql.execute(this.query.dailyRebateTotal);
    const { result: { recordset: dailyRebateCountRecordset } } = await this.core.sql.execute(this.query.dailyRebateCount);
    const { result: { recordset: purchaseTotalRecordset } } = await this.core.sql.execute(this.query.purchaseTotal);
    const { result: { recordset: purchasePriceRecordset } } = await this.core.sql.execute(this.query.purchasePrice);
    const { result: { recordset: salePriceRecordset } } = await this.core.sql.execute(this.query.salePrice);
    const { result: { recordset: purchasePriceDownRecordset } } = await this.core.sql.execute(this.query.purchasePriceDown);
    const { result: { recordset: purchasePriceUpRecordset } } = await this.core.sql.execute(this.query.purchasePriceUp);
    const { result: { recordset: salePriceDownRecordset } } = await this.core.sql.execute(this.query.salePriceDown);
    const { result: { recordset: salePriceUpRecordset } } = await this.core.sql.execute(this.query.salePriceUp);

    




  


    if(dailyOrderTotalRecordset.length > 0) 
    {
      const { DAILY_ORDER_TOTAL } = dailyOrderTotalRecordset[0];
      this.setState({ dailyOrderTotal: DAILY_ORDER_TOTAL });
    }
    if(orderAvgRecordset.length > 0) 
    {
      const { ORDER_AVG } = orderAvgRecordset[0];
      this.setState({ orderAvg: ORDER_AVG });
    }
    if(dailyOrderCountRecordset.length > 0) 
    {
      const { DAILY_ORDER_COUNT } = dailyOrderCountRecordset[0];
      this.setState({ dailyOrderCount: DAILY_ORDER_COUNT });
    }
    if(dailySalesTotalRecordset.length > 0) 
    {
      const { DAILY_SALES_TOTAL } = dailySalesTotalRecordset[0];
      this.setState({ dailySalesTotal: DAILY_SALES_TOTAL });
    }
    if(salesAvgRecordset.length > 0) 
    {
      const { SALES_AVG } = salesAvgRecordset[0];
      this.setState({ salesAvg: SALES_AVG });
    }
    if(dailySalesCountRecordset.length > 0) 
    {
      const { DAILY_SALES_COUNT } = dailySalesCountRecordset[0];
      this.setState({ dailySalesCount: DAILY_SALES_COUNT });
    }
    if(dailyRebateTotalRecordset.length > 0) 
    {
      const { DAILY_REBATE_TOTAL } = dailyRebateTotalRecordset[0];
      this.setState({ dailyRebateTotal: DAILY_REBATE_TOTAL });
    }
    if(dailyRebateCountRecordset.length > 0) 
    {
      const { DAILY_REBATE_COUNT } = dailyRebateCountRecordset[0];
      this.setState({ dailyRebateCount: DAILY_REBATE_COUNT });
    }
    if(purchaseTotalRecordset.length > 0) 
    {
      const { PURCHASE_TOTAL } = purchaseTotalRecordset[0];
      this.setState({ purchaseTotal: PURCHASE_TOTAL});
    }
    if(purchasePriceRecordset.length > 0) 
    {
      const { PURCHASE_PRICE } = purchasePriceRecordset[0];
      this.setState({ purchasePrice: PURCHASE_PRICE});
    }
    if(salePriceRecordset.length > 0) 
    {
      const { SALE_PRICE } = salePriceRecordset[0];
      this.setState({ salePrice: SALE_PRICE});
    }
    if(purchasePriceDownRecordset.length > 0) 
    {
      const { PURCHASE_PRICE_DOWN } = purchasePriceDownRecordset[0];
      this.setState({ purchasePriceDown: PURCHASE_PRICE_DOWN});
    }
    if(purchasePriceUpRecordset.length > 0) 
    {
      const { PURCHASE_PRICE_UP } = purchasePriceUpRecordset[0];
      this.setState({ purchasePriceUp: PURCHASE_PRICE_UP});
    }
    if(salePriceDownRecordset.length > 0) 
    {
      const { SALE_PRICE_DOWN } = salePriceDownRecordset[0];
      this.setState({ salePriceDown: SALE_PRICE_DOWN});
    }
    if(salePriceUpRecordset.length > 0) 
    {
      const { SALE_PRICE_UP } = salePriceUpRecordset[0];
      this.setState({ salePriceUp: SALE_PRICE_UP});
    }
  }
  onClick()
  {
    console.log(1)
  }
  render()
  {
    return(
      <ScrollView>
        <div className="row py-1 px-3">
        <div className="col-sm-12 col-md-6 p-1">
          <div className="text-center">
                  <h5 className="card-title">{this.companyName}</h5>
                </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}
            onApply={(async()=>
              {
                this.date = this.dtDate.value 
                this.query.dailySalesTotal.value = [this.dtDate.startDate,this.dtDate.endDate]
                this.query.salesAvg.value = [this.dtDate.startDate,this.dtDate.endDate]
                this.query.dailySalesCount.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.dailyOrderCount.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.orderAvg.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.dailyRebateCount.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.dailyOrderTotal.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.dailyRebateTotal.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.purchaseTotal.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.purchasePrice.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.salePrice.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.purchasePriceDown.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.purchasePriceUp.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.salePriceDown.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.salePriceUp.value =  [this.dtDate.startDate,this.dtDate.endDate]
                this.query.salePriceUp.value =  [this.dtDate.startDate,this.dtDate.endDate]

                this.getExtra()
              }).bind(this)}/>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyOrderTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyOrderTotal ? parseFloat(this.state.dailyOrderTotal) : 0)} type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyOrderCount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyOrderCount ? parseFloat(this.state.dailyOrderCount) : 0)}  type={'number'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("orderAvg")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.orderAvg ? parseFloat(this.state.orderAvg) : 0)}  type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign: "center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailySalesTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={this.state.dailySalesTotal ? parseFloat(this.state.dailySalesTotal) : 0} type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign:"center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailySalesCount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailySalesCount ? parseFloat(this.state.dailySalesCount) : 0)} type={'number'}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign:"center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("salesAvg")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.salesAvg ? parseFloat(this.state.salesAvg) : 0)} type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white" style={{ width: "100%", textAlign:"center",backgroundColor:"#e84393" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyRebateTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyRebateTotal ? parseFloat(this.state.dailyRebateTotal) : 0)}  type={'currency'}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white" style={{ width: "100%", textAlign:"center",backgroundColor:"#e84393" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyRebateCount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyRebateCount ? parseFloat(this.state.dailyRebateCount) : 0)} type={'number'}  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row py-1 px-3">
          <div className="col-12">
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#224379" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("purchaseTotal")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.purchaseTotal ? parseFloat(this.state.purchaseTotal) : 0)}  type={'currency'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#224379" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("purchasePrice")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.purchasePrice ? parseFloat(this.state.purchasePrice) : 0)}  type={'number'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#224379" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("purchasePriceDown")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.purchasePriceDown ? parseFloat(this.state.purchasePriceDown) : 0)}  type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT * FROM PRICE_HISTORY_VW_01 AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popPurcPriceDown.show()
                    await this.grdPurcPriceDown.dataRefresh(tmpSource)
                  }).bind(this)}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#224379" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("purchasePriceUp")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.purchasePriceUp ? parseFloat(this.state.purchasePriceUp) : 0)}  type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT * FROM PRICE_HISTORY_VW_01 AS PRICE WHERE PRICE.FISRT_PRICE < PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popPurcPriceUp.show()
                    await this.grdPurcPriceUp.dataRefresh(tmpSource)
                  }).bind(this)}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#2b9788" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("salePrice")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.salePrice ? parseFloat(this.state.salePrice) : 0)}  type={'number'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#2b9788" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("salePriceDown")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.salePriceDown ? parseFloat(this.state.salePriceDown) : 0)}  type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT * FROM PRICE_HISTORY_VW_01 AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popSalePriceDown.show()
                    await this.grdSalePriceDown.dataRefresh(tmpSource)
                  }).bind(this)}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 p-1">
              <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#2b9788" }}>
                <div className="card-body">
                  <div className="text-center">
                    <h5 className="card-title">{this.t("salePriceUp")}</h5>
                  </div>
                  <div className="text-center">
                    <AnimatedText value={parseFloat(this.state.salePriceUp ? parseFloat(this.state.salePriceUp) : 0)}  type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT * FROM PRICE_HISTORY_VW_01 AS PRICE WHERE PRICE.FISRT_PRICE < PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popSalePriceUp.show()
                    await this.grdSalePriceUp.dataRefresh(tmpSource)
                  }).bind(this)}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row py-1 px-3" style={{height:'100px'}}>

        </div>
        <NbPopUp id={"popSalesTotal"} parent={this} title={this.t("salesTotalDetail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                    <NdDatePicker simple={true}  parent={this} id={"dtTimeFirst"} type={'datetime'}  pickerType="rollers"
                     onValueChanged={async(e)=>
                      {
                        let tmpSource =
                        {
                            source : 
                            {
                                groupBy : this.groupList,
                                select : 
                                {
                                    query : " SELECT PAY_TYPE_NAME,SUM(AMOUNT-CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE LDATE >= @FISRT_DATE AND LDATE <= @LAST_DATE  AND TYPE = 0 GROUP BY PAY_TYPE_NAME",
                                    param : ['FISRT_DATE:datetime','LAST_DATE:datetime'],
                                    value : [this.dtTimeFirst.value,this.dtTimeLast.value]
                                },
                                sql : this.core.sql
                            }
                        }
                        let tmpVatSource =
                        {
                            source : 
                            {
                                groupBy : this.groupList,
                                select : 
                                {
                                    query : " SELECT VAT_RATE,SUM(VAT) AS VAT,SUM(FAMOUNT) AS AMOUNT, SUM(TOTAL) AS TOTAL FROM POS_SALE_VW_01 WHERE VAT_RATE <> 0 AND  LDATE >= @FISRT_DATE AND LDATE <= @LAST_DATE AND STATUS = 1 AND TYPE = 0 GROUP BY VAT_RATE",
                                    param : ['FISRT_DATE:datetime','LAST_DATE:datetime'],
                                    value : [this.dtTimeFirst.value,this.dtTimeLast.value]
                                },
                                sql : this.core.sql
                            }
                        }
                        await this.grdSalesTotal.dataRefresh(tmpSource)
                        await this.grdSalesVatRate.dataRefresh(tmpVatSource)
                      }}/>
                  </div>
                  <div className="col-12">
                    <NdDatePicker simple={true}  parent={this} id={"dtTimeLast"} type={'datetime'}  pickerType="rollers"
                     onValueChanged={async(e)=>
                      {
                        let tmpSource =
                        {
                            source : 
                            {
                                groupBy : this.groupList,
                                select : 
                                {
                                    query : " SELECT PAY_TYPE_NAME,SUM(AMOUNT-CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE LDATE >= @FISRT_DATE AND LDATE <= @LAST_DATE  AND TYPE = 0 GROUP BY PAY_TYPE_NAME",
                                    param : ['FISRT_DATE:datetime','LAST_DATE:datetime'],
                                    value : [this.dtTimeFirst.value,this.dtTimeLast.value]
                                },
                                sql : this.core.sql
                            }
                        }
                        let tmpVatSource =
                        {
                            source : 
                            {
                                groupBy : this.groupList,
                                select : 
                                {
                                    query : " SELECT VAT_RATE,SUM(VAT) AS VAT,SUM(FAMOUNT) AS AMOUNT, SUM(TOTAL) AS TOTAL FROM POS_SALE_VW_01 WHERE VAT_RATE <> 0 AND  LDATE >= @FISRT_DATE AND LDATE <= @LAST_DATE AND STATUS = 1 AND TYPE = 0 GROUP BY VAT_RATE",
                                    param : ['FISRT_DATE:datetime','LAST_DATE:datetime'],
                                    value : [this.dtTimeFirst.value,this.dtTimeLast.value]
                                },
                                sql : this.core.sql
                            }
                        }
                        await this.grdSalesTotal.dataRefresh(tmpSource)
                        await this.grdSalesVatRate.dataRefresh(tmpVatSource)
                      }}/>
                  </div>
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdSalesTotal"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"138px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="PAY_TYPE_NAME" width={100} alignment={"center"}/>
                          <Column dataField="AMOUNT" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdSalesVatRate"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={true}
                      loadPanel={{enabled:true}}
                      height={"138px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                        <Column dataField="VAT_RATE" caption={this.t("grdSalesVatRate.vatRate")} width={60} alignment={"center"}/>
                        <Column dataField="AMOUNT" caption={this.t("grdSalesVatRate.amount")} width={90} format={"#,##0.00€"}/>       
                        <Column dataField="VAT" caption={this.t("grdSalesVatRate.vat")} width={90} format={"#,##0.00€"}/>       
                        <Column dataField="TOTAL" caption={this.t("grdSalesVatRate.total")} width={40} format={"#,##0.00€"}/>                                        
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popPriceDesc"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdPriceDesc"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="LUSER_NAME" width={80} alignment={"center"}/>
                          <Column dataField="NAME" width={250} alignment={"center"}/>
                          <Column dataField="DATA" width={50} alignment={"center"} format={"#,##0.00€"}/>
                          <Column dataField="LAST_PRICE" width={50} alignment={"center"} format={"#,##0.00€"}/>
                          <Column dataField="DESCRIPTION" width={200} />                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popLineDelete"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdLineDelete"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="LUSER_NAME" width={80} alignment={"center"}/>
                          <Column dataField="NAME" width={200} alignment={"center"}/>
                          <Column dataField="DESCRIPTION" width={200} />                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popPosDelete"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdPosDelete"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="LUSER_NAME" width={80} alignment={"center"}/>
                          <Column dataField="DESCRIPTION" width={200} alignment={"center"}/>
                          <Column dataField="TOTAL" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popRebateTicket"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdRebateTicket"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"250px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="LUSER_NAME" width={80} alignment={"center"}/>
                          <Column dataField="ITEM_NAME" width={120}/>
                          <Column dataField="QUANTITY" width={60} alignment={"center"}/>
                          <Column dataField="TOTAL" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popRebateTotal"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdRebateTotal"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"138px"} 
                      width={"100%"}
                      dbApply={false}
                      >
                          <Column dataField="PAY_TYPE_NAME" width={100} alignment={"center"}/>
                          <Column dataField="AMOUNT" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popPurcPriceDown"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdPurcPriceDown"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      onCellPrepared={(e) =>
                      {
                          if(e.rowType === "data" && e.column.dataField === "LAST_PRICE")
                          {
                            e.cellElement.style.color =  "blue" 
                          }
                      }}
                      >
                          <Column dataField="ITEM_NAME" width={200}/>
                          <Column dataField="FISRT_PRICE" width={60} format={"#,##0.00€"}/>    
                          <Column dataField="LAST_PRICE" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popPurcPriceUp"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdPurcPriceUp"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      onCellPrepared={(e) =>
                        {
                            if(e.rowType === "data" && e.column.dataField === "LAST_PRICE")
                            {
                              e.cellElement.style.color =  "red" 
                            }
                        }}
                      >
                          <Column dataField="ITEM_NAME" width={200}/>
                          <Column dataField="FISRT_PRICE" width={60} format={"#,##0.00€"}/>    
                          <Column dataField="LAST_PRICE" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popSalePriceDown"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdSalePriceDown"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      onCellPrepared={(e) =>
                        {
                            if(e.rowType === "data" && e.column.dataField === "LAST_PRICE")
                            {
                              e.cellElement.style.color =  "blue" 
                            }
                        }}
                      >
                          <Column dataField="ITEM_NAME" width={200} />
                          <Column dataField="FISRT_PRICE" width={60} format={"#,##0.00€"}/>    
                          <Column dataField="LAST_PRICE" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popSalePriceUp"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                      <NdGrid parent={this} id={"grdSalePriceUp"} 
                      showBorders={true} 
                      columnsAutoWidth={true} 
                      allowColumnReordering={true} 
                      allowColumnResizing={true} 
                      showRowLines={true}
                      showColumnLines={true}
                      showColumnHeaders={false}
                      loadPanel={{enabled:true}}
                      height={"350px"} 
                      width={"100%"}
                      dbApply={false}
                      onCellPrepared={(e) =>
                        {
                            if(e.rowType === "data" && e.column.dataField === "LAST_PRICE")
                            {
                              e.cellElement.style.color =  "red" 
                            }
                        }}
                      >
                          <Column dataField="ITEM_NAME" width={200} />
                          <Column dataField="FISRT_PRICE" width={60} format={"#,##0.00€"}/>    
                          <Column dataField="LAST_PRICE" width={40} format={"#,##0.00€"}/>                                                
                      </NdGrid>
                  </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popBalanceTicket"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
            <div>
              <div className="row  p-1">
                  <div className="col-12">
                    <NdGrid parent={this} id={"grdBalanceTicket"} 
                    showBorders={true} 
                    columnsAutoWidth={true} 
                    allowColumnReordering={true} 
                    allowColumnResizing={true} 
                    showRowLines={true}
                    showColumnLines={true}
                    showColumnHeaders={true}
                    loadPanel={{enabled:true}}
                    height={"59px"} 
                    width={"100%"}
                    dbApply={false}
                    onCellPrepared={(e) =>
                    {
                      if(e.rowType === "data" && e.column.dataField === "BALANCE_TICKET_CHECKED")
                      {
                        e.cellElement.style.color =  "red" 
                      }
                    }}
                    >
                      <Column dataField="BALANCE_TICKET_CREATED" caption={this.t("balanceTicketCreated")} width={150} />
                      <Column dataField="BALANCE_TICKET_CHECKED" caption={this.t("balanceTicketChecked")} width={100}/>
                    </NdGrid>
                  </div>
              </div>
              <div className="row  p-1">
                <div className="col-6">
                  <h6 style={{height:'60px',textAlign:"right",overflow:"hidden"}}>
                      <NbLabel id="lblTicketCreatedAmount" parent={this} value={this.t("ticketCreatedAmount")}/>
                  </h6>
                </div>
                <div className="col-6">
                  <h6 style={{height:'60px',textAlign:"right",overflow:"hidden"}}>
                      <NbLabel id="lblTicketCheckedAmount" parent={this} value={this.t("ticketCheckedAmount")}/>
                  </h6>
                </div>
              </div>
              <div className="row  p-1">
                <div className="col-6">
                  <h6 style={{height:'60px',textAlign:"right",overflow:"hidden"}}>
                  </h6>
                </div>
                <div className="col-6">
                  <h6 style={{height:'60px',textAlign:"right",overflow:"hidden"}}>
                      <NbLabel id="lblTicketDifferance" parent={this} value={this.t("TicketDifferance")}/>
                  </h6>
                </div>
              </div>
            </div>
        </NbPopUp>
        <NbPopUp id={"popAllItemGroups"} parent={this} title={this.t("detail")} fullscreen={false} centered={true}>
          <div>
            <div className="row  p-1">
                <div className="col-12">
                  <NdGrid parent={this} id={"grdAllItemGroups"} 
                  showBorders={true} 
                  columnsAutoWidth={true} 
                  allowColumnReordering={true} 
                  allowColumnResizing={true} 
                  showRowLines={true}
                  >
                    <Column caption={this.t("grdAllItemGroups.itemGroupName")} dataField="ITEM_GRP_NAME" width={200}/>
                    <Column caption={this.t("grdAllItemGroups.itemGroupAmount")} dataField="QUANTITY" width={100} format={"#,##0.00€"}/>                                                
                  </NdGrid>
                </div>
            </div>
          </div>  
        </NbPopUp>
      </ScrollView>
    )
  }
}