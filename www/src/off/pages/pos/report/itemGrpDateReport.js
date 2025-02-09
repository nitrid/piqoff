import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling} from '../../../../core/react/devex/grid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser,Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
//PDF cikti//
// import { exportDataGrid } from 'devextreme/pdf_exporter';
// import { jsPDF } from 'jspdf';

// const exportFormats = ['pdf'];

export default class itemGrpDateReport extends React.PureComponent
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
                                                id:'msgClose',showTitle:true,title:this.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("btnYes"),location:'before'},{id:"btn02",caption:this.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgClose")}</div>)
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
                            <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.t("btnGet")} type="default" stylingMode="contained" width={'100%'}
                            onClick={async (e)=>
                            {
                                let lang = ''
                                if(localStorage.getItem('lang').toUpperCase() == "fr")
                                {
                                    lang = "french"
                                }
                                else if(localStorage.getItem('lang').toUpperCase() == "tr")
                                {
                                    lang = "turkish"
                                }
                                else
                                {
                                    lang = "english"
                                }

                                let tmpQuery = 
                                {
                                    query : `SET language @LANG
                                            SELECT 
                                            datename(month,(POS.DOC_DATE)) AS MOUNT, 
                                            '' AS RAPT,
                                            POS.DOC_DATE AS DOC_DATE, 
                                            ITEM_GRP_NAME AS ITEM_GRP_NAME,
                                            ROUND(SUM(TOTAL),2) AS TOTAL,  
                                            ROUND(SUM(FAMOUNT),2) AS FAMOUNT,  
                                            ROUND(SUM(QUANTITY),2) AS QUANTITY,  
                                            ROUND(SUM(VAT),2) AS VAT,  
                                            ROUND(SUM(COST_PRICE * QUANTITY),2) AS TOTAL_COST,  
                                            (SUM(FAMOUNT) - SUM(COST_PRICE * QUANTITY)) AS REST_TOTAL  
                                            FROM POS_SALE_DATEIL_REPORT_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                            GROUP BY POS.DOC_DATE,ITEM_GRP_NAME`,
                                    param : ['LANG:string','START:date','END:date'],
                                    value : [lang,this.dtDate.startDate,this.dtDate.endDate]
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
                                    caption: this.t("grdMonth"),
                                    width: 80,
                                    dataField: "MOUNT",
                                    dataType: "text",
                                    area: "row",
                                    expanded: false

                                },
                                {
                                    caption: this.t("grdDate"),
                                    width: 80,
                                    dataField: "ITEM_GRP_NAME",
                                    dataType: "text",
                                    area: "row",
                                },
                                {
                                    dataField: "RAPT",
                                    caption: "RAPT",
                                    width: 80,
                                    area: "column",
                                    expanded: true

                                },
                                {
                                    caption: this.t("grdQuantity"),
                                    dataField: "QUANTITY",
                                    dataType: "number",
                                    summaryType: "sum",
                                    area: "data",
                                },
                                {
                                    caption: this.t("grdTotalCost"),
                                    dataField: "TOTAL_COST",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 
                                    {

                                        style: "currency", currency: Number.money.code,
                                    },
                                    area: "data",
                                },
                                {
                                    caption: this.t("grdFamount"),
                                    dataField: "FAMOUNT",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 
                                    {

                                        style: "currency", currency: Number.money.code,
                                    },
                                    area: "data",
                                },
                                {
                                    caption: this.t("grdVat"),
                                    dataField: "VAT",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 
                                    {


                                        style: "currency", currency: Number.money.code,
                                    },
                                    area: "data",
                                },
                                {
                                    caption: this.t("grdTotal"),
                                    dataField: "TOTAL",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 


                                    {
                                        style: "currency", currency: Number.money.code,
                                    },
                                    area: "data",
                                },
                                {
                                    caption: this.t("grdRestTotal"),
                                    dataField: "REST_TOTAL",
                                    dataType: "number",
                                    summaryType: "sum",
                                    format: 
                                    {
                                        style: "currency", currency: Number.money.code,
                                    },
                                    area: "data",
                                },
                               
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