import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser,Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';

export default class posSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.chkRowTotal.value = true
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.lang.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpQuery = 
                                {
                                    query : "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'SALES' AS TITLE, " +
                                            "'HT' AS TYPE, " +
                                            "POS.VAT_RATE AS VAT_RATE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'SALES' AS TITLE, " +
                                            "'TVA' AS TYPE, " +
                                            "POS.VAT_RATE AS VAT_RATE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'PAYMENT' AS TITLE, " +
                                            "CASE WHEN PAY_TYPE = 0 THEN 'ESC' " +
                                            "WHEN PAY_TYPE = 1 THEN 'CB' " +
                                            "WHEN PAY_TYPE = 2 THEN 'CHQ' " +
                                            "WHEN PAY_TYPE = 3 THEN 'CHQe' " +
                                            "WHEN PAY_TYPE = 4 THEN 'BON D''AVOIR' " +
                                            "END AS TYPE, " +
                                            "0 AS VAT_RATE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT - CHANGE) * -1 END AS AMOUNT  " +
                                            "FROM POS_PAYMENT_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END " +
                                            "GROUP BY POS.GUID,POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE,POS.DEVICE " , 
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }
                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                console.log(tmpData)
                                App.instance.setState({isExecute:false})
                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.pvtData.setDataSource(tmpData.result.recordset)
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form>
                                <Item>
                                    <Label text={this.t("chkRowTotal")} alignment="right" />
                                    <NdCheckBox id="chkRowTotal" parent={this} defaultValue={true}
                                    onValueChanged={(e)=>
                                    {
                                        this.pvtData.setState({showRowTotals:e.value})
                                    }}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdPivot id="pvtData" parent={this} height={'750'}
                            fields={
                            [
                                {
                                    caption: "TARIH",
                                    width: 80,
                                    dataField: "DOC_DATE",
                                    dataType: "date",
                                    format: "dd/MM/yyyy",
                                    area: "row",
                                    expanded: true
                                },
                                {
                                    caption: "DEVICE",
                                    width: 80,
                                    dataField: "DEVICE",
                                    area: "row",
                                },
                                {
                                    caption: "TIP",
                                    width: 80,
                                    dataField: "DOC_TYPE",
                                    area: "row",
                                },                                
                                {
                                    dataField: "TITLE",
                                    caption: "TITLE",
                                    width: 80,
                                    area: "column",
                                    expanded: true
                                },
                                {
                                    caption: "VAT",
                                    dataField: "VAT_RATE",
                                    width: 50,
                                    area: "column",
                                    selector: (e) =>
                                    {
                                        if(e.VAT_RATE != 0)
                                        {
                                            return e.VAT_RATE
                                        }
                                    },
                                    expanded: true
                                },
                                {
                                    caption: "TYPE",
                                    dataField: "TYPE",
                                    width: 50,
                                    area: "column",
                                    sortBy: "none",
                                    expanded: true
                                },
                                {
                                    caption: "AMOUNT",
                                    dataField: "AMOUNT",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 
                                    {
                                        style: "currency", currency: "EUR",
                                    },
                                    area: "data",
                                }
                            ]}
                            allowSortingBySummary={true}
                            allowFiltering={true}
                            showBorders={true}
                            showColumnTotals={true}
                            showColumnGrandTotals={false}
                            showRowTotals={true}
                            showRowGrandTotals={true}
                            onCellPrepared={(e)=>
                            {
                                if(e.area == 'column' && e.cell.type == 'D')
                                {
                                    e.cellElement.style.color = '#1e272e'
                                    e.cellElement.style.fontWeight = 'bold';
                                }
                                if(e.area == 'row' && e.cell.type == 'T')
                                {
                                    e.cellElement.style.color = '#636e72'
                                    e.cellElement.style.fontWeight = 'bold';
                                }
                                if(e.area == 'data' && e.cell.rowType == 'T')
                                {
                                    e.cellElement.style.color = '#636e72'
                                    e.cellElement.style.fontWeight = 'bold';
                                }
                                if(e.area == 'row' && e.cell.type == 'GT')
                                {
                                    e.cellElement.style.color = '#1e272e'
                                    e.cellElement.style.fontWeight = 'bold';
                                }
                                if(e.area == 'data' && e.cell.rowType == 'GT')
                                {
                                    e.cellElement.style.color = '#1e272e'
                                    e.cellElement.style.fontWeight = 'bold';
                                }
                                if(e.area == 'column' && e.cell.type == 'T' && e.cell.path.length == 1 && e.cell.path[0] == "PAYMENT")
                                {
                                    e.cellElement.innerText = "Total"
                                }
                                if(e.area == 'column' && e.cell.type == 'T' && e.cell.path.length == 2 && e.cell.path[0] == "PAYMENT")
                                {
                                    e.cellElement.innerText = "Total"
                                }
                                if(e.area == 'column' && e.cell.type == 'T' && e.cell.path.length == 1 && e.cell.path[0] == "SALES")
                                {
                                    e.cellElement.innerText = "Total"
                                }
                                if(e.area == 'column' && e.cell.type == 'T' && e.cell.path.length == 2 && e.cell.path[0] == "SALES")
                                {
                                    e.cellElement.innerText = "TTC"
                                }
                            }}
                            >
                                <Export fileName={"Report"} enabled={true} allowExportSelectedData={true} />
                                <FieldChooser enabled={true} height={400} />
                            </NdPivot>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}