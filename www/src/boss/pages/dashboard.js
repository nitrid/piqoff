import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import PieChart, { Series, Label, SmallValuesGrouping, Connector, Legend } from 'devextreme-react/pie-chart';
import AnimatedText from '../../core/react/bootstrap/animatedText.js';

export default class Dashboard extends React.PureComponent
{
  constructor(props)
  {
    super(props)
    this.core = App.instance.core;
    this.state = { dailySalesTotal : 0, monthlySalesTotal: 0, dailyCountTotal: 0, monthlyCountTotal: 0,dailyPriceChange:0,dailyRowDelete:0,dailyFullDelete :0,dailyRebateTicket:0,dailyRebateTotal:0,dailyCustomerTicket:0,dailyUseLoyalty:0, bestItemGroup: [] };
    this.t = App.instance.lang.getFixedT(null ,null ,"dashboard")
    this.query = 
    {
      dailySalesTotal : { query : "SELECT ROUND(SUM(AMOUNT),0) AS DAILY_SALES_TOTAL FROM POS_PAYMENT_VW_01 WHERE DOC_DATE = CONVERT(nvarchar,GETDATE(),110)" },
      monthlySalesTotal : { query : "SELECT ROUND(SUM(AMOUNT),0) AS MONTHLY_SALES_TOTAL FROM POS_PAYMENT_VW_01 WHERE DOC_DATE >= GETDATE() - 30" },
      dailySalesCount : { query : "SELECT COUNT(*) AS DAILY_SALES_COUNT FROM POS_PAYMENT_VW_01 WHERE DOC_DATE = CONVERT(nvarchar,GETDATE(),110)" },
      monthlySalesCount : { query : "SELECT COUNT(*) AS MONTHLY_SALES_COUNT FROM POS_PAYMENT_VW_01 WHERE DOC_DATE >= GETDATE() - 30" },
      bestItemGroup : { query : "SELECT TOP 3 COUNT(QUANTITY) AS QUANTITY, ITEM_GRP_NAME FROM POS_SALE_VW_01 WHERE DOC_DATE >= DATEADD(month, -3, GETDATE()) GROUP BY ITEM_GRP_NAME" },
      dailyPriceChange : { query : "SELECT COUNT(*) AS DAILY_PRICE_CHANGE FROM POS_EXTRA_VW_01 WHERE TAG = 'PRICE DESC' AND CONVERT(nvarchar,CDATE,110) = CONVERT(nvarchar,GETDATE(),110) " },    
      dailyRowDelete : { query : "SELECT COUNT(*) AS DAILY_ROW_DELETE FROM POS_EXTRA_VW_01 WHERE TAG = 'ROW DELETE' AND CONVERT(nvarchar,CDATE,110) = CONVERT(nvarchar,GETDATE(),110) " },   
      dailyFullDelete : { query : "SELECT COUNT(*) AS DAILY_FULL_DELETE FROM POS_EXTRA_VW_01 WHERE TAG = 'FULL DELETE' AND CONVERT(nvarchar,CDATE,110) = CONVERT(nvarchar,GETDATE(),110) " },   
      dailyRebateTicket : { query : "SELECT COUNT(*) AS DAILY_REBATE_COUNT FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= CONVERT(nvarchar,GETDATE(),110) " },   
      dailyRebateTotal : { query : "SELECT SUM(TOTAL) AS DAILY_REBATE_TOTAL FROM POS_VW_01 WHERE TYPE = 1 AND DOC_DATE >= CONVERT(nvarchar,GETDATE(),110) " },   
      dailyCustomerTicket : { query : "SELECT COUNT(*) AS DAILY_CUSTOMER_COUNT FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= CONVERT(nvarchar,GETDATE(),110) " },   
      dailyUseLoyalty : { query : "SELECT SUM(LOYALTY) AS DAILY_LOYALTY FROM POS_VW_01 WHERE CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000' AND DOC_DATE >= CONVERT(nvarchar,GETDATE(),110) " },   
    }
  }
  async componentDidMount()
  {
    this.init();      
  }
  async init()
  {
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
    const { result: { recordset: monthlySalesRecordset } } = await this.core.sql.execute(this.query.monthlySalesTotal);

    if(dailySalesRecordset.length > 0) 
    {
      const { DAILY_SALES_TOTAL } = dailySalesRecordset[0];
      this.setState({ dailySalesTotal: DAILY_SALES_TOTAL });
    }

    if(monthlySalesRecordset.length > 0) 
    {
      const { MONTHLY_SALES_TOTAL } = monthlySalesRecordset[0];
      this.setState({ monthlySalesTotal: MONTHLY_SALES_TOTAL });
    }
  }
  async getSalesCount()
  {
    const { result: { recordset: dailyCountRecordset } } = await this.core.sql.execute(this.query.dailySalesCount);
    const { result: { recordset: monthlyCountRecordset } } = await this.core.sql.execute(this.query.monthlySalesCount);

    if(dailyCountRecordset.length > 0) 
    {
      const { DAILY_SALES_COUNT } = dailyCountRecordset[0];
      this.setState({ dailyCountTotal: DAILY_SALES_COUNT });
    }

    if(monthlyCountRecordset.length > 0) 
    {
      const { MONTHLY_SALES_COUNT } = monthlyCountRecordset[0];
      this.setState({ monthlyCountTotal: MONTHLY_SALES_COUNT });
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
  }
  render()
  {
    return(
      <ScrollView>
        <div className="row py-1 px-3">
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign: "center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("dailySalesTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={this.state.dailySalesTotal ? parseInt(this.state.dailySalesTotal) : 0} type={'currency'} />
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
                  <AnimatedText value={parseInt(this.state.dailyCountTotal ? parseInt(this.state.dailyCountTotal) : 0)} type={'number'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-primary" style={{ width: "100%", textAlign:"center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("monthlySalesTotal")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseInt(this.state.monthlySalesTotal ? parseInt(this.state.monthlySalesTotal) : 0)} type={'currency'} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-1">
            <div className="card text-white bg-success" style={{ width: "100%", textAlign:"center" }}>
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{this.t("monthlySalesCount")}</h5>
                </div>
                <div className="text-center">
                  <AnimatedText value={parseInt(this.state.monthlyCountTotal ? parseInt(this.state.monthlyCountTotal) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyPriceChange ? parseInt(this.state.dailyPriceChange) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyRowDelete ? parseInt(this.state.dailyRowDelete) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyFullDelete ? parseInt(this.state.dailyFullDelete) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyRebateTicket ? parseInt(this.state.dailyRebateTicket) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyRebateTotal ? parseInt(this.state.dailyRebateTotal) : 0)}  type={'currency'}  />
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
                  <AnimatedText value={parseInt(this.state.dailyCustomerTicket ? parseInt(this.state.dailyCustomerTicket) : 0)} type={'number'} />
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
                  <AnimatedText value={parseInt(this.state.dailyUseLoyalty ? parseInt(this.state.dailyUseLoyalty) : 0)}  type={'currency'} />
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
              <SmallValuesGrouping mode="topN" topCount={3} />
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
            <p className="text-center text-muted">{this.t("lastThreeMonthsData")}</p>
          </div>
        </div>
      </ScrollView>
    )
  }
}