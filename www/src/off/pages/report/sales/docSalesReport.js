import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';  
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling} from '../../../../core/react/devex/grid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser,Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdPopUp from '../../../../core/react/devex/popup.js';

export default class docSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        console.log('0000000000000000')  
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
                                    query : "SELECT  " +
                                    "ITEMS.INVOICE_DATE AS DOC_DATE,  " +
                                    "'SALES' AS TITLE,   " +
                                    "'HT' AS TYPE,  " +
                                    "ITEMS.VAT_RATE AS VAT_RATE,  " +
                                    "SUM((TOTAL-VAT)) AS AMOUNT  " +
                                    "FROM [DOC_ITEMS_VW_01] AS ITEMS  " +
                                    "WHERE  TYPE = 1 AND REBATE = 0 AND ((DOC_TYPE = 20 AND ITEMS.DOC_DATE >= @START AND ITEMS.DOC_DATE <= @END) OR (ITEMS.DOC_TYPE = 40 AND ITEMS.INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000' AND ITEMS.INVOICE_DATE >= @START AND ITEMS.INVOICE_DATE <= @END)) AND ITEM_CODE <> 'INTERFEL'" +
                                    "GROUP BY ITEMS.INVOICE_DATE,ITEMS.TYPE,ITEMS.VAT_RATE,ITEMS.DOC_TYPE " +
                                    "UNION ALL  " +
                                    "SELECT  " +
                                    "ITEMS.INVOICE_DATE AS DOC_DATE,  " +
                                    "'SALES' AS TITLE,   " +
                                    "'TVA' AS TYPE,  " +
                                    "ITEMS.VAT_RATE AS VAT_RATE,  " +
                                    "SUM((VAT)) AS AMOUNT  " +
                                    "FROM [DOC_ITEMS_VW_01] AS ITEMS  " +
                                    "WHERE TYPE = 1 AND REBATE = 0 AND ((DOC_TYPE = 20 AND ITEMS.DOC_DATE >= @START AND ITEMS.DOC_DATE <= @END) OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000' AND ITEMS.INVOICE_DATE >= @START AND ITEMS.INVOICE_DATE <= @END)) " +
                                    "GROUP BY ITEMS.INVOICE_DATE,ITEMS.TYPE,ITEMS.VAT_RATE,ITEMS.DOC_TYPE " +
                                    "UNION ALL  " +
                                    "SELECT  " +
                                    "ITEMS.INVOICE_DATE AS DOC_DATE,  " +
                                    "'SALES' AS TITLE,   " +
                                    "'INTERFEL' AS TYPE,  " +
                                    "ITEMS.VAT_RATE AS VAT_RATE,  " +
                                    "SUM((TOTALHT)) AS AMOUNT  " +
                                    "FROM [DOC_ITEMS_VW_01] AS ITEMS  " +
                                    "WHERE TYPE = 1 AND REBATE = 0 AND ((DOC_TYPE = 20 AND ITEMS.DOC_DATE >= @START AND ITEMS.DOC_DATE <= @END) OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID <> '00000000-0000-0000-0000-000000000000' AND ITEMS.INVOICE_DATE >= @START AND ITEMS.INVOICE_DATE <= @END)) AND ITEM_CODE = 'INTERFEL' " +
                                    "GROUP BY ITEMS.INVOICE_DATE,ITEMS.TYPE,ITEMS.VAT_RATE,ITEMS.DOC_TYPE " +
                                    "UNION ALL  " +
                                    "SELECT  " +
                                    "PAY.DOC_DATE AS DOC_DATE,  " +
                                    "'PAYMENT' AS TITLE,  " +
                                    "(SELECT VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_CUSTOMER_TYPE_NAME](TYPE,DOC_TYPE,0,PAY_TYPE)) AND LANG = 'TR')  AS TYPE,  " +
                                    "0 AS VAT_RATE,  " +
                                    "SUM((AMOUNT)) AS AMOUNT  " +
                                    "FROM DOC_CUSTOMER_VW_01 AS PAY  " +
                                    "WHERE  PAY.DOC_DATE >= @START AND PAY.DOC_DATE <= @END AND TYPE = 0 AND DOC_TYPE= 200 AND REBATE = 0 " +
                                    "GROUP BY PAY.DOC_DATE,PAY.TYPE,PAY.PAY_TYPE,PAY.DOC_TYPE ",
                                    param : ['START:date','END:date','LANG:string|5'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate,localStorage.getItem('lang')]
                                }
                                App.instance.setState({isExecute:true})
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                App.instance.setState({isExecute:false})
                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.pvtData.setDataSource(tmpData.result.recordset)
                                }
                                else
                                {
                                    this.pvtData.setDataSource([])
                                }
                            }}/>
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
                                        return e.VAT_RATE
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