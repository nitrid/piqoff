import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import PieChart, { Series, Label, SmallValuesGrouping, Connector, Legend } from 'devextreme-react/pie-chart';
import AnimatedText from '../../core/react/bootstrap/animatedText.js';
import NbDateRange from '../../core/react/bootstrap/daterange.js';



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
      useDiscount : { query : "SELECT SUM(DISCOUNT) AS USE_DISCOUNT FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE  AND STATUS = 1",  param : ['FISRT_DATE:date','LAST_DATE:date'],value : [this.date,this.date] },   
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
                  <AnimatedText value={this.state.dailySalesTotal ? parseFloat(this.state.dailySalesTotal) : 0} type={'currency'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyCountTotal ? parseFloat(this.state.dailyCountTotal) : 0)} type={'number'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyPriceChange ? parseFloat(this.state.dailyPriceChange) : 0)} type={'number'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyRowDelete ? parseFloat(this.state.dailyRowDelete) : 0)} type={'number'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyFullDelete ? parseFloat(this.state.dailyFullDelete) : 0)} type={'number'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyRebateTicket ? parseFloat(this.state.dailyRebateTicket) : 0)} type={'number'} />
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
                  <AnimatedText value={parseFloat(this.state.dailyRebateTotal ? parseFloat(this.state.dailyRebateTotal) : 0)}  type={'currency'}  />
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
            <div className="card text-white " style={{ width: "100%", textAlign:"center",backgroundColor:"#532b97" }}>
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
                customizeText={this.customizeLabel}
              >
              <Connector visible={true} width={1} />
              </Label>
            </Series>
              <Legend horizontalAlignment="center" verticalAlignment="bottom" />
            </PieChart>
          </div>
        </div>
        <div className="row py-1 px-3" style={{height:'100px'}}>
          <div className="col-12">
           
          </div>
        </div>
      </ScrollView>
    )
  }
}