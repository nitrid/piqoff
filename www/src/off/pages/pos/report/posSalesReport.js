import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
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
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser} from '../../../../core/react/devex/pivot.js';

export default class posSalesReport extends React.Component
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
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
                            <NdButton text={this.lang.t("btnSave")} type="default" stylingMode="contained" width={'100%'}
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
                                            "SUM(POS.FAMOUNT) AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1  " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                            "UNION ALL " +
                                            "SELECT " +
                                            "POS.DOC_DATE AS DOC_DATE, " +
                                            "POS.DEVICE AS DEVICE, " +
                                            "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                            "'SALES' AS TITLE, " +
                                            "'TVA' AS TYPE, " +
                                            "POS.VAT_RATE AS VAT_RATE, " +
                                            "SUM(POS.VAT) AS AMOUNT " +
                                            "FROM POS_SALE_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 " +
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
                                            "SUM(AMOUNT - CHANGE) AS AMOUNT " +
                                            "FROM POS_PAYMENT_VW_01 AS POS " +
                                            "WHERE POS.STATUS = 1 " +
                                            "GROUP BY POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE,POS.DEVICE ", 
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                if(tmpData.result.recordset.length > 0)
                                {
                                    this.pivotgrid.setDataSource(tmpData.result.recordset)
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdPivot id="pivotgrid" parent={this}
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
                                    }
                                },
                                {
                                    caption: "TYPE",
                                    dataField: "TYPE",
                                    width: 50,
                                    area: "column",
                                    sortBy: "none"
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
                                },
                                // {
                                //     groupName: 'TITLE',
                                //     visible: false
                                // },
                                // {
                                //     groupName: 'Address',
                                //     caption: "VAT",
                                //     dataField: "VAT_RATE",
                                //     width: 50,
                                //     area: "column",
                                //     groupIndex: 0
                                // },
                                // {
                                //     caption: "HT",
                                //     dataField: "HT",
                                //     dataType: "number",
                                //     summaryType: "sum",
                                //     format: 
                                //     {
                                //         style: "currency", currency: "EUR",
                                //     },
                                //     area: "data",
                                // },
                                // {
                                //     caption: "TVA",
                                //     dataField: "TVA",
                                //     dataType: "number",
                                //     summaryType: "sum",
                                //     format: 
                                //     {
                                //         style: "currency", currency: "EUR",
                                //     },
                                //     area: "data",
                                // },
                                // {
                                //     groupName: 'SALES',
                                //     caption: "TTC",
                                //     dataField: "TTC",
                                //     dataType: "number",
                                //     summaryType: "sum",
                                //     format: 
                                //     {
                                //         style: "currency", currency: "EUR",
                                //     },
                                //     area: "data",
                                // },
                                // {
                                //     caption: "AMOUNT",
                                //     dataField: "PAY_AMOUNT",
                                //     dataType: "number",
                                //     summaryType: "sum",
                                //     format: 
                                //     {
                                //         style: "currency", currency: "EUR",
                                //     },
                                //     area: "data"
                                // }
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
                                <FieldChooser enabled={true} height={400} />
                            </NdPivot>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}