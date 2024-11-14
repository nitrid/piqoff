import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import {Chart, Series, CommonSeriesSettings, Label, Format, Legend, Export} from 'devextreme-react/chart';

export default class Dashboard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.state = {dataSource : {}} 
        this.t = App.instance.lang.getFixedT(null,null,"dashboard")
        this.lang = App.instance.lang;
    }
    async componentDidMount()
    {
        this.init()        
    }
    async init()
    {
        let tmpQuery1 = 
        {
            query : "SELECT ISNULL(SUM(TOTAL),0) AS TOTAL FROM DOC_VW_01 WHERE DOC_DATE >  DATEADD(MM, DATEDIFF(MM, 0, dbo.GETDATE()), 0) AND TYPE = 1 AND DOC_TYPE = 60 AND CUSER = @CUSER ",
            param : ['CUSER:string|50'],
            value : [this.core.auth.data.CODE]
        }
        let tmpData1 = await this.core.sql.execute(tmpQuery1) 
        console.log(tmpData1)
        if(tmpData1.result.recordset.length > 0)
        {
           this.mountPrice = tmpData1.result.recordset[0].TOTAL + ' €'
        }
        let tmpQuery2 = 
        {
            query : "SELECT TOP 1 TOTAL AS TOTAL, INPUT_NAME AS CUSTOMER FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 60 AND CUSER = @CUSER ORDER BY CDATE DESC ",
            param : ['CUSER:string|50'],
            value : [this.core.auth.data.CODE]
        }
        let tmpData2 = await this.core.sql.execute(tmpQuery2) 
        if(tmpData2.result.recordset.length > 0)
        {
           this.lastCustomer = tmpData2.result.recordset[0].CUSTOMER
           this.lastSalePrice = tmpData2.result.recordset[0].TOTAL + ' €'
        }
        let tmpQuery = 
        {
            query : "SELECT FORMAT(DOC_DATE, 'MMMM', @LANG) AS MOUNT,SUM(TOTAL) AS TOTAL FROM DOC_VW_01 " +
                "WHERE DOC_DATE >  DATEADD(YY, DATEDIFF(YY, 0, dbo.GETDATE()), 0) AND TYPE = 1 AND DOC_TYPE = 60 AND CUSER = @CUSER " +
                "GROUP BY FORMAT(DOC_DATE, 'MMMM', @LANG),MONTH(DOC_DATE) ORDER BY MONTH(DOC_DATE) ",
            param : ['CUSER:string|50','LANG:string|10'],
            value : [this.core.auth.data.CODE,this.lang.language]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            let tmpTotal = 0
            for (let i = 0; i < tmpData.result.recordset.length; i++) 
            {
                tmpTotal += tmpData.result.recordset[i].TOTAL
            }
            this.yearPrice = Number(tmpTotal).round(2) + ' €'
            this.setState({dataSource:tmpData.result.recordset})
        }
    }
    render()
    {
        return(
            <div style={{paddingLeft:"15px",paddingRight:"15px",paddingTop:"75px"}}>
                <ScrollView showScrollbar={'never'} useNative={false}>
                    <div className='row pb-2'>
                        <div className='col-6'>
                            <div className="card" style={{height:'150px'}}>
                                <div className="card-body">
                                    <h5 className="card-title">{this.t("lastDocumant")}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{this.lastCustomer}</h6>
                                    <p className="fs-1 fw-bold text-primary">{this.lastSalePrice}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="card" style={{height:'150px'}}>
                                <div className="card-body">
                                    <h5 className="card-title">{this.t("mountSales")}</h5>
                                    <p className="fw-bold text-danger" style={{fontSize:'60px'}}>{this.mountPrice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <div className="card" style={{height:'520px'}}>
                                <div className="card-body">
                                    <h5 className="card-title">{this.t("yearSales")}</h5>
                                    <p className="fs-3 fw-bold text-primary">{this.yearPrice}</p>
                                    <div className="row">
                                        <div className="col-12">
                                        <Chart id="chart" title={this.t("yearSales")}
                                        dataSource={this.state.dataSource}>
                                            <CommonSeriesSettings argumentField="state" type="bar" hoverMode="allArgumentPoints" selectionMode="allArgumentPoints">
                                            <Label visible={true}>
                                                <Format type="fixedPoint" precision={0} />
                                            </Label>
                                            </CommonSeriesSettings>
                                            <Series
                                                valueField="TOTAL"
                                                argumentField="MOUNT"
                                                name={this.t("sale")}
                                                type="bar"
                                                color="#42c974" />
                                            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
                                            <Export enabled={true} />
                                        </Chart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>   
                </ScrollView>                
            </div>
        )
    }
}
