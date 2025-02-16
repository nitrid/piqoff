import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdTextBox from '../../core/react/devex/textbox.js'
import NbDateRange from '../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser,Export} from '../../core/react/devex/pivot.js';
import NdButton from '../../core/react/devex/button.js';
import { dialog } from '../../core/react/devex/dialog.js';

export default class posSaleReport extends React.PureComponent
{
    constructor()
    {
        super()

        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj

        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }
    async printReport()
    {
        let tmpQuery = 
        {
            query:  "SELECT " +
                    "POS.DOC_DATE AS DOC_DATE, " +
                    "'CAISSE :' + POS.DEVICE AS DEVICE, " +
                    "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                    "'SALES' AS TITLE, " +
                    "'HT' AS TYPE, " +
                    "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = 72),'') AS PATH,   " +
                    "POS.VAT_RATE AS VAT_RATE, " +
                    "CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT " +
                    "FROM POS_SALE_VW_01 AS POS " +
                    "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 " +
                    "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                    "UNION ALL " +
                    "SELECT " +
                    "POS.DOC_DATE AS DOC_DATE, " +
                    "'CAISSE :' + POS.DEVICE AS DEVICE, " +
                    "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                    "'SALES' AS TITLE, " +
                    "'TVA' AS TYPE, " +
                    "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = 72),'') AS PATH,   " +
                    "POS.VAT_RATE AS VAT_RATE, " +
                    "CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT " +
                    "FROM POS_SALE_VW_01 AS POS " +
                    "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 " +
                    "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " ,
            param : ['START:date','END:date'],
            value : [this.dtDate.startDate,this.dtDate.endDate]
        }
        
        App.instance.setState({isExecute:true})
        let tmpData = await this.core.sql.execute(tmpQuery) 
        App.instance.setState({isExecute:false})
        
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
        {
            if(pResult.split('|')[0] != 'ERR')
            {
                var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                mywindow.onload = function() 
                {
                    mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                } 
            }
        });
    }
    render()
    {
        return (
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'print',
                                        onClick: async()=>
                                        {
                                            this.printReport()
                                        }
                                    }
                                }/>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.setPage('menu')
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                        <div className="row ps-4 pt-2 pe-0">
                            <div className="col-12 px-0">
                                <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                            </div>
                        </div>
                        <div className="row ps-4 pt-2 pe-0">
                            <div className="col-12 px-0">
                                <Form colCount={4}>
                                    <Item>
                                        <Label text={this.lang.t("posSaleReport.txtTotalTicket")} alignment="right" />
                                        <NdTextBox id="txtTotalTicket" parent={this} simple={true} readOnly={true} 
                                        maxLength={32}/>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("posSaleReport.txtTicketAvg")} alignment="right" />
                                        <NdTextBox id="txtTicketAvg" parent={this} simple={true} readOnly={true} 
                                        maxLength={32}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                        <div className="row ps-4 pt-2 pe-0">
                            <div className="col-12 px-0">
                                <NdButton text={this.lang.t("posSaleReport.btnGet")} type="default" stylingMode="contained" width={'100%'}
                                onClick={async (e)=>
                                {
                                    let tmpTicketQuery = {
                                        query :"SELECT COUNT(GUID) AS TICKET,ISNULL(AVG(TOTAL),0) AS AVGTOTAL FROM POS_VW_01 WHERE STATUS = 1 AND  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE ",
                                        param : ['FISRT_DATE:date','LAST_DATE:date'],
                                        value : [this.dtDate.startDate,this.dtDate.endDate]
                                    }
                                    let tmpTicketData = await this.core.sql.execute(tmpTicketQuery) 
                                    if(tmpTicketData.result.recordset.length > 0)
                                    {
                                        this.txtTotalTicket.value = tmpTicketData.result.recordset[0].TICKET
                                        this.txtTicketAvg.value = tmpTicketData.result.recordset[0].AVGTOTAL.toLocaleString('fr-FR', {style: 'currency',currency: 'EUR'});
                                    }
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
                                                "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 " +
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
                                                "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 " +
                                                "GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.DEVICE " +
                                                "UNION ALL " +
                                                "SELECT " +
                                                "POS.DOC_DATE AS DOC_DATE, " +
                                                "POS.DEVICE AS DEVICE, " +
                                                "CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, " +
                                                "'PAYMENT' AS TITLE, " +
                                                "PAY_TYPE_NAME AS TYPE, " +
                                                "0 AS VAT_RATE, " +
                                                "CASE WHEN POS.TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT - CHANGE) * -1 END AS AMOUNT  " +
                                                "FROM POS_PAYMENT_VW_01 AS POS " +
                                                "WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' " +
                                                "GROUP BY POS.GUID,POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE_NAME,POS.PAY_TYPE,POS.DEVICE " , 
                                        param : ['START:date','END:date'],
                                        value : [this.dtDate.startDate,this.dtDate.endDate]
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
                        <div className="row ps-4 pt-2 pe-0">
                            <div className="col-12 px-0">
                                <NdPivot id="pvtData" parent={this} height={'101%'}
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
                                            style: "currency", currency: Number.money.code,
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
                    </div>
                </ScrollView>
            </div>
        )
    }
}