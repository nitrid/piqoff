import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import PieChart, { Series, Label, SmallValuesGrouping, Connector, Legend } from 'devextreme-react/pie-chart';
import AnimatedText from '../../core/react/bootstrap/animatedText.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NbPopUp from '../../core/react/bootstrap/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling}  from '../../core/react/devex/grid.js';


export default class Dashboard extends React.PureComponent
{
  constructor(props)
  {
    super(props)
    this.core = App.instance.core;
    this.state = { dailySalesTotal : 0, salesAvg: 0, dailyCountTotal: 0, monthlyCountTotal: 0,dailyPriceChange:0,dailyRowDelete:0,dailyFullDelete :0,dailyRebateTicket:0,dailyRebateTotal:0,dailyCustomerTicket:0,dailyUseLoyalty:0, bestItemGroup: [] };
    this.t = App.instance.lang.getFixedT(null ,null ,"dashboard")
    this.date = moment(new Date()).format("YYYY-MM-DD")
    this.query = 
    {
      dailySalesTotal : { query : "SELECT SUM(TOTAL) AS DAILY_SALES_TOTAL FROM POS_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND STATUS = 1 AND TYPE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      salesAvg : { query : "SELECT AVG(TOTAL) AS SALES_AVG FROM POS_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1 AND TYPE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},
      dailySalesCount : { query : "SELECT COUNT(*) AS DAILY_SALES_COUNT FROM POS_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1 AND TYPE = 0",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },
      bestItemGroup : { query : "SELECT TOP 5  ROUND(SUM(TOTAL),2) AS QUANTITY, ITEM_GRP_NAME FROM POS_SALE_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE GROUP BY ITEM_GRP_NAME ORDER BY SUM(TOTAL) DESC", param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },
      dailyPriceChange : { query : "SELECT COUNT(*) AS DAILY_PRICE_CHANGE FROM POS_EXTRA_VW_01 WHERE TAG = 'PRICE DESC' AND  CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },    
      dailyRowDelete : { query : "SELECT COUNT(*) AS DAILY_ROW_DELETE FROM POS_EXTRA_VW_01 WHERE TAG = 'ROW DELETE' AND  CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      dailyFullDelete : { query : "SELECT COUNT(*) AS DAILY_FULL_DELETE FROM POS_EXTRA_VW_01 WHERE TAG = 'FULL DELETE' AND  CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      dailyRebateTicket : { query : "SELECT COUNT(*) AS DAILY_REBATE_COUNT FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      dailyRebateTotal : { query : "SELECT SUM(TOTAL) AS DAILY_REBATE_TOTAL FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      dailyCustomerTicket : { query : "SELECT COUNT(*) AS DAILY_CUSTOMER_COUNT FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      dailyUseLoyalty : { query : "SELECT SUM(LOYALTY) AS DAILY_LOYALTY FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      useDiscount : { query : "SELECT SUM(DISCOUNT) AS USE_DISCOUNT FROM POS_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      useDiscountTicket : { query : "SELECT COUNT(*) AS USE_DISCOUNT_TICKET FROM POS_VW_01 WHERE  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE AND DISCOUNT <> 0 AND STATUS = 1",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },
      purchaseTotal : { query : "SELECT SUM(AMOUNT) AS PURCHASE_TOTAL FROM DOC_CUSTOMER_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 AND DOC_TYPE = 20 and REBATE = 0" ,  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date]},   
      purchasePrice : { query : "SELECT COUNT(*) AS PURCHASE_PRICE FROM PRICE_HISTORY AS PRICE WHERE CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePrice : { query : "SELECT COUNT(*) AS SALE_PRICE FROM PRICE_HISTORY AS PRICE WHERE CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      purchasePriceDown : { query : "SELECT COUNT(*) AS PURCHASE_PRICE_DOWN FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      purchasePriceUp : { query : "SELECT COUNT(*) AS PURCHASE_PRICE_UP FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE < PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 1 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePriceDown : { query : "SELECT COUNT(*) AS SALE_PRICE_DOWN FROM PRICE_HISTORY AS PRICE WHERE PRICE.FISRT_PRICE > PRICE.LAST_PRICE AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
      salePriceUp : { query : "SELECT COUNT(*) AS SALE_PRICE_UP FROM PRICE_HISTORY AS PRICE WHERE CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE AND PRICE.TYPE = 0 ",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
    }
  }
  async componentDidMount()
  {
    this.init();      
  }
  async init()
  {
    this.dtDate.value = moment(new Date()).format("YYYY-MM-DD")
    this.getSalesTotal();
    this.getSalesCount();
    this.getBestItemGroup();
    this.getExtra()
  }
  async getBestItemGroup()
  {
    const { result: { recordset: bestItemGroup } } = await this.core.sql.execute(this.query.bestItemGroup);

    if (bestItemGroup.length > 0) 
    {
      this.setState({ bestItemGroup: bestItemGroup });
    }
  }
  async getSalesTotal()
  {
    const { result: { recordset: dailySalesRecordset } } = await this.core.sql.execute(this.query.dailySalesTotal);
    const { result: { recordset: salesAvg } } = await this.core.sql.execute(this.query.salesAvg);

    if(dailySalesRecordset.length > 0) 
    {
      const { DAILY_SALES_TOTAL } = dailySalesRecordset[0];
      this.setState({ dailySalesTotal: DAILY_SALES_TOTAL });
    }

    if(salesAvg.length > 0) 
    {
      const { SALES_AVG } = salesAvg[0];
      this.setState({ salesAvg: SALES_AVG });
    }
  }
  async getSalesCount()
  {
    const { result: { recordset: dailyCountRecordset } } = await this.core.sql.execute(this.query.dailySalesCount);

    if(dailyCountRecordset.length > 0) 
    {
      const { DAILY_SALES_COUNT } = dailyCountRecordset[0];
      this.setState({ dailyCountTotal: DAILY_SALES_COUNT });
    }
  }
  async getExtra()
  {
    const { result: { recordset: dailyPriceRecordset } } = await this.core.sql.execute(this.query.dailyPriceChange);
    const { result: { recordset: dailyRowDeleteRecordset } } = await this.core.sql.execute(this.query.dailyRowDelete);
    const { result: { recordset: dailyFullDeleteRecordset } } = await this.core.sql.execute(this.query.dailyFullDelete);
    const { result: { recordset: dailyRebateTicketRecordset } } = await this.core.sql.execute(this.query.dailyRebateTicket);
    const { result: { recordset: dailyRebateTotalRecordset } } = await this.core.sql.execute(this.query.dailyRebateTotal);
    const { result: { recordset: dailyCustomerTicketRecordset } } = await this.core.sql.execute(this.query.dailyCustomerTicket);
    const { result: { recordset: dailyUseLoyaltyRecordset } } = await this.core.sql.execute(this.query.dailyUseLoyalty);
    const { result: { recordset: useDiscountRecordset } } = await this.core.sql.execute(this.query.useDiscount);
    const { result: { recordset: useDiscountTicketRecordset } } = await this.core.sql.execute(this.query.useDiscountTicket);
    const { result: { recordset: purchaseTotalRecordset } } = await this.core.sql.execute(this.query.purchaseTotal);
    const { result: { recordset: purchasePriceRecordset } } = await this.core.sql.execute(this.query.purchasePrice);
    const { result: { recordset: salePriceRecordset } } = await this.core.sql.execute(this.query.salePrice);
    const { result: { recordset: purchasePriceDownRecordset } } = await this.core.sql.execute(this.query.purchasePriceDown);
    const { result: { recordset: purchasePriceUpRecordset } } = await this.core.sql.execute(this.query.purchasePriceUp);
    const { result: { recordset: salePriceDownRecordset } } = await this.core.sql.execute(this.query.salePriceDown);
    const { result: { recordset: salePriceUpRecordset } } = await this.core.sql.execute(this.query.salePriceUp);






  
    if(dailyPriceRecordset.length > 0) 
    {
      const { DAILY_PRICE_CHANGE } = dailyPriceRecordset[0];
      this.setState({ dailyPriceChange: DAILY_PRICE_CHANGE });
    }

    if(dailyRowDeleteRecordset.length > 0) 
    {
      const { DAILY_ROW_DELETE } = dailyRowDeleteRecordset[0];
      this.setState({ dailyRowDelete: DAILY_ROW_DELETE});
    }

    if(dailyFullDeleteRecordset.length > 0) 
    {
      const { DAILY_FULL_DELETE } = dailyFullDeleteRecordset[0];
      this.setState({ dailyFullDelete: DAILY_FULL_DELETE });
    }

    if(dailyRebateTicketRecordset.length > 0) 
    {
      const { DAILY_REBATE_COUNT } = dailyRebateTicketRecordset[0];
      this.setState({ dailyRebateTicket: DAILY_REBATE_COUNT});
    }

    if(dailyRebateTotalRecordset.length > 0) 
    {
      const { DAILY_REBATE_TOTAL } = dailyRebateTotalRecordset[0];
      this.setState({ dailyRebateTotal: DAILY_REBATE_TOTAL });
    }

    if(dailyCustomerTicketRecordset.length > 0) 
    {
      const { DAILY_CUSTOMER_COUNT } = dailyCustomerTicketRecordset[0];
      this.setState({ dailyCustomerTicket: DAILY_CUSTOMER_COUNT});
    }

    if(dailyUseLoyaltyRecordset.length > 0) 
    {
      const { DAILY_LOYALTY } = dailyUseLoyaltyRecordset[0];
      this.setState({ dailyUseLoyalty: DAILY_LOYALTY});
    }
    if(useDiscountRecordset.length > 0) 
    {
      const { USE_DISCOUNT } = useDiscountRecordset[0];
      this.setState({ useDiscount: USE_DISCOUNT});
    }
    if(useDiscountTicketRecordset.length > 0) 
    {
      const { USE_DISCOUNT_TICKET } = useDiscountTicketRecordset[0];
      this.setState({ useDiscountTicket: USE_DISCOUNT_TICKET});
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
            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}
             onApply={(async()=>
              {
                  this.date = this.dtDate.value 
                  this.query.dailySalesTotal.value = [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.salesAvg.value = [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailySalesCount.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.bestItemGroup.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyPriceChange.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyRowDelete.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyFullDelete.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyRebateTicket.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyRebateTotal.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyCustomerTicket.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.dailyUseLoyalty.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.useDiscount.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.useDiscountTicket.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.purchaseTotal.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.purchasePrice.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.salePrice.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.purchasePriceDown.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.purchasePriceUp.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.salePriceDown.value =  [this.dtDate.startDate,this.dtDate.endDate]
                  this.query.salePriceUp.value =  [this.dtDate.startDate,this.dtDate.endDate]



                  this.getSalesTotal();
                  this.getSalesCount();
                  this.getBestItemGroup();
                  this.getExtra()
              }).bind(this)}/>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign: "center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailySalesTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={this.state.dailySalesTotal ? parseFloat(this.state.dailySalesTotal) : 0} type={'currency'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT PAY_TYPE_NAME,SUM(AMOUNT-CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 GROUP BY PAY_TYPE_NAME",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
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
                                query : " SELECT VAT_RATE,SUM(VAT) AS VAT,SUM(FAMOUNT) AS AMOUNT, SUM(TOTAL) AS TOTAL FROM POS_SALE_VW_01 WHERE VAT_RATE <> 0 AND  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 GROUP BY VAT_RATE",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                    await this.popSalesTotal.show()
                    await this.grdSalesTotal.dataRefresh(tmpSource)
                    await this.grdSalesVatRate.dataRefresh(tmpVatSource)
                  }).bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-success" style={{ width: "100%", textAlign:"center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailySalesCount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyCountTotal ? parseFloat(this.state.dailyCountTotal) : 0)} type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT PAY_TYPE_NAME,SUM(AMOUNT-CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 GROUP BY PAY_TYPE_NAME",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
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
                                query : " SELECT VAT_RATE,SUM(VAT) AS VAT,SUM(FAMOUNT) AS AMOUNT, SUM(TOTAL) AS TOTAL FROM POS_SALE_VW_01 WHERE VAT_RATE <> 0 AND  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 0 GROUP BY VAT_RATE",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                    await this.popSalesTotal.show()
                    await this.grdSalesTotal.dataRefresh(tmpSource)
                    await this.grdSalesVatRate.dataRefresh(tmpVatSource)
                  }).bind(this)}/>
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
            <div className="card text-white" style={{ width: "100%", textAlign:"center" ,backgroundColor:"#9d3948"}}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyPriceChange")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyPriceChange ? parseFloat(this.state.dailyPriceChange) : 0)} type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT *,(SELECT ITEM_NAME FROM POS_SALE_VW_01 WHERE GUID = POS_EXTRA_VW_01.LINE_GUID),(SELECT PRICE FROM POS_SALE_VW_01 WHERE GUID = POS_EXTRA_VW_01.LINE_GUID) AS LAST_PRICE AS NAME "  + 
                                "FROM POS_EXTRA_VW_01 WHERE TAG = 'PRICE DESC' AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                   
                    await this.popPriceDesc.show()
                    await this.grdPriceDesc.dataRefresh(tmpSource)
                  }).bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center" ,backgroundColor:"#972b54"}}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyRowDelete")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyRowDelete ? parseFloat(this.state.dailyRowDelete) : 0)} type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT *,(SELECT NAME FROM ITEMS WHERE GUID = (SELECT ITEM FROM POS_SALE WHERE GUID = POS_EXTRA_VW_01.LINE_GUID)) AS NAME FROM POS_EXTRA_VW_01 WHERE TAG = 'ROW DELETE' AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                   
                    await this.popLineDelete.show()
                    await this.grdLineDelete.dataRefresh(tmpSource)
                  }).bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white" style={{ width: "100%", textAlign:"center" ,backgroundColor:"#9d397a"}}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyFullDelete")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyFullDelete ? parseFloat(this.state.dailyFullDelete) : 0)} type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT *,(SELECT TOTAL FROM POS WHERE GUID = POS_EXTRA_VW_01.POS_GUID) AS TOTAL FROM POS_EXTRA_VW_01 WHERE TAG = 'FULL DELETE' AND CONVERT(nvarchar,CDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,CDATE,110) <= @LAST_DATE",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                   
                    await this.popPosDelete.show()
                    await this.grdPosDelete.dataRefresh(tmpSource)
                  }).bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white" style={{ width: "100%", textAlign:"center",backgroundColor:"#e84393" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyRebateTicket")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyRebateTicket ? parseFloat(this.state.dailyRebateTicket) : 0)} type={'number'} onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT * FROM POS_SALE_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 ",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popRebateTicket.show()
                    await this.grdRebateTicket.dataRefresh(tmpSource)
                  }).bind(this)}/>
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
                  <AnimatedText value={parseFloat(this.state.dailyRebateTotal ? parseFloat(this.state.dailyRebateTotal) : 0)}  type={'currency'}  onClicks={(async()=>
                  {
                    let tmpSource =
                    {
                        source : 
                        {
                            groupBy : this.groupList,
                            select : 
                            {
                                query : " SELECT PAY_TYPE_NAME,SUM(AMOUNT-CHANGE) AS AMOUNT FROM POS_PAYMENT_VW_01 WHERE DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 GROUP BY PAY_TYPE_NAME",
                                param : ['FISRT_DATE:date','LAST_DATE:date'],
                                value : [this.dtDate.startDate,this.dtDate.endDate]
                            },
                            sql : this.core.sql
                        }
                    }
                  
                    await this.popRebateTotal.show()
                    await this.grdRebateTotal.dataRefresh(tmpSource)
                  }).bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyCustomerTicket")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyCustomerTicket ? parseFloat(this.state.dailyCustomerTicket) : 0)} type={'number'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailyUseLoyalty")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.dailyUseLoyalty ? parseFloat(this.state.dailyUseLoyalty) : 0)}  type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#791158" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("useDiscountTicket")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.useDiscountTicket ? parseFloat(this.state.useDiscountTicket) : 0)}  type={'number'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#791158" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("useDiscount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseFloat(this.state.useDiscount ? parseFloat(this.state.useDiscount) : 0)}  type={'currency'} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row py-1 px-3">
          <div className="col-12">
            <PieChart
              id="pie"
              type="doughnut"
              title={this.t("bestItemGroup")}
              palette="Material"
              dataSource={this.state.bestItemGroup}
              animation={{
                easing: 'easeOutCubic',
                duration: 1500, 
              }}
            >
            <Series argumentField="ITEM_GRP_NAME" valueField="QUANTITY">
              <SmallValuesGrouping mode="topN" topCount={5} />
              <Label
                visible={true}
                format="fixedPoint"
                customizeText={(arg)=>
                  {
                    if( arg.valueText  !=0)  
                    return arg.valueText +"€" + " (" + arg.percentText + ")";  
                    else  
                     return arg.valueText+"€";  
                  }}
              >
              <Connector visible={true} width={1} />
              </Label>
            </Series>
              <Legend horizontalAlignment="center" verticalAlignment="bottom" percent={true}/>
            </PieChart>
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
                              e.cellElement.style.color =  "ref" 
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
      </ScrollView>
    )
  }
}