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
    }
    async componentDidMount()
    {
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
                                    <h5 className="card-title">Son Satış Detayı</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Hudo Distiribution</h6>
                                    <p className="fs-1 fw-bold text-primary">1.255,60€</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="card" style={{height:'150px'}}>
                                <div className="card-body">
                                    <h5 className="card-title">Günlük Satış Tutar</h5>
                                    <p className="fw-bold text-danger" style={{fontSize:'60px'}}>4.218,27€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pb-2'>
                        <div className='col-12'>
                            <div className="card" style={{height:'520px'}}>
                                <div className="card-body">
                                    <h5 className="card-title">Aylık Satış Detayı</h5>
                                    <p className="fs-3 fw-bold text-primary">12.825,15€</p>
                                    <div className="row">
                                        <div className="col-12">
                                        <Chart id="chart" title="Aylık Satış Raporu" 
                                        dataSource={
                                        [{
                                            state: 'Illinois',
                                            year2016: 803,
                                            year2017: 823,
                                            year2018: 863,
                                          }, {
                                            state: 'Indiana',
                                            year2016: 316,
                                            year2017: 332,
                                            year2018: 332,
                                          }, {
                                            state: 'Michigan',
                                            year2016: 452,
                                            year2017: 459,
                                            year2018: 470,
                                          }, {
                                            state: 'Ohio',
                                            year2016: 621,
                                            year2017: 642,
                                            year2018: 675,
                                          }, {
                                            state: 'Wisconsin',
                                            year2016: 290,
                                            year2017: 294,
                                            year2018: 301,
                                          }]}>
                                            <CommonSeriesSettings argumentField="state" type="bar" hoverMode="allArgumentPoints" selectionMode="allArgumentPoints">
                                            <Label visible={true}>
                                                <Format type="fixedPoint" precision={0} />
                                            </Label>
                                            </CommonSeriesSettings>
                                            <Series argumentField="state" valueField="year2018" name="2018"/>
                                            <Series valueField="year2017" name="2017"/>
                                            <Series valueField="year2016" name="2016"/>
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
