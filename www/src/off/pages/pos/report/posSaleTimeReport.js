import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label, EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdPivot,{FieldChooser,Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';
//PDF cikti//
// import { exportDataGrid } from 'devextreme/pdf_exporter';
// import { jsPDF } from 'jspdf';

// const exportFormats = ['pdf'];

export default class posSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;

        this.btnGetDetail = this.btnGetDetail.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.chkRowTotal.value = true
        this.init()
    }
    async init()
    {
        this.dtFirst.value=moment(new Date())
        this.dtLast.value=moment(new Date())
    }
    async btnGetDetail(pGuid)
    {
        this.lastPosSaleDt.selectCmd = 
        {
            query :  `SELECT CONVERT(NVARCHAR,CDATE,108) AS TIME,* FROM POS_SALE_VW_01  WHERE POS_GUID = @POS_GUID `,
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        
        await this.lastPosSaleDt.refresh()
        await this.grdSaleTicketItems.dataRefresh({source:this.lastPosSaleDt});
        
        this.lastPosPayDt.selectCmd = 
        {
            query :  `SELECT (AMOUNT-CHANGE) AS LINE_TOTAL,* FROM POS_PAYMENT_VW_01  WHERE POS_GUID = @POS_GUID `,
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        
        this.lastPosPayDt.insertCmd = 
        {
            query : 
                    `EXEC [dbo].[PRD_POS_PAYMENT_INSERT] 
                    @GUID = @PGUID, 
                    @CUSER = @PCUSER, 
                    @POS = @PPOS, 
                    @TYPE = @PTYPE, 
                    @LINE_NO = @PLINE_NO, 
                    @AMOUNT = @PAMOUNT, 
                    @CHANGE = @PCHANGE `, 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        this.lastPosPayDt.updateCmd = 
        {
            query : 
                    `EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] 
                    @GUID = @PGUID, 
                    @CUSER = @PCUSER, 
                    @POS = @PPOS, 
                    @TYPE = @PTYPE, 
                    @LINE_NO = @PLINE_NO, 
                    @AMOUNT = @PAMOUNT, 
                    @CHANGE = @PCHANGE `, 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 

        this.lastPosPayDt.deleteCmd = 
        {
            query : 
                    `EXEC [dbo].[PRD_POS_PAYMENT_DELETE] 
                    @CUSER = @PCUSER, 
                    @UPDATE = 1, 
                    @GUID = @PGUID, 
                    @POS_GUID = @PPOS_GUID `, 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
        }

        await this.lastPosPayDt.refresh()

        await this.grdSaleTicketPays.dataRefresh({source:this.lastPosPayDt});

        await this.grdLastTotalPay.dataRefresh({source:this.lastPosPayDt});

        this.popDetail.show()
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-1">
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
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
                    <div className="row px-2 pt-1" style={{height:'80px'}}> 
                        <div className="col-12">
                            <Form colCount={2}>
                                <Item colSpan={1}>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"} type={'datetime'}/>
                                </Item>
                                <Item colSpan={1}>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"} type={'datetime'}/>
                                </Item>
                            </Form>
                            <Form colCount={3} parent={this} id="frmPurcoffer">
                                <Item colSpan={1}>
                                    <Label text={this.t("txtTotalTicket")} alignment="right" />
                                    <NdTextBox id="txtTotalTicket" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </Item>
                                <Item colSpan={1}>
                                    <Label text={this.lang.t("txtTicketAvg")} alignment="right" />
                                    <NdTextBox id="txtTicketAvg" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </Item>
                                <Item colSpan={1}>
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
                    <div className="row px-2 pt-1">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <NdButton text={this.lang.t("btnGet")} type="success" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpTicketQuery = {
                                    query :`SELECT COUNT(GUID) AS TICKET,ISNULL(AVG(TOTAL),0) AS AVGTOTAL FROM POS_VW_01 WHERE STATUS = 1 AND  LDATE >= @FISRT_DATE AND LDATE <= @LAST_DATE `,
                                    param : ['FISRT_DATE:datetime','LAST_DATE:datetime'],
                                    value : [this.dtFirst.value,this.dtLast.value]
                                }

                                let tmpTicketData = await this.core.sql.execute(tmpTicketQuery) 

                                if(tmpTicketData.result.recordset.length > 0)
                                {
                                    this.txtTotalTicket.value = tmpTicketData.result.recordset[0].TICKET
                                    this.txtTicketAvg.value = tmpTicketData.result.recordset[0].AVGTOTAL.toLocaleString('fr-FR', {style: 'currency',currency: 'EUR'});
                                }

                                let tmpQuery = 
                                {
                                    query : `SELECT 
                                    DATEADD(HOUR, DATEPART(HOUR, (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID)), CAST(CAST((SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) AS DATE) AS DATETIME)) AS DOC_DATE, 
                                    POS.DEVICE AS DEVICE,  
                                    CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE,  
                                    'SALES' AS TITLE,  
                                    'HT' AS TYPE,  
                                    POS.VAT_RATE AS VAT_RATE,  
                                    CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT  
                                    FROM POS_SALE_VW_01 AS POS  
                                    WHERE POS.STATUS = 1 AND (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID)>= @START AND (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0  
                                    GROUP BY POS.DOC_DATE,POS_GUID,POS.TYPE,POS.VAT_RATE,POS.DEVICE,DATEADD(HOUR, DATEPART(HOUR, LDATE), CAST(CAST(LDATE AS DATE) AS DATETIME)) 
                                    UNION ALL 
                                    SELECT 
                                    DATEADD(HOUR, DATEPART(HOUR, (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID)), CAST(CAST((SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) AS DATE) AS DATETIME)) AS DOC_DATE, 
                                    POS.DEVICE AS DEVICE,  
                                    CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE,  
                                    'SALES' AS TITLE,  
                                    'TVA' AS TYPE,  
                                    POS.VAT_RATE AS VAT_RATE,  
                                    CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT  
                                    FROM POS_SALE_VW_01 AS POS  
                                    WHERE POS.STATUS = 1 AND  (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) >= @START AND (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                    GROUP BY POS.DOC_DATE,POS_GUID,POS.TYPE,POS.VAT_RATE,POS.DEVICE,DATEADD(HOUR, DATEPART(HOUR, LDATE), CAST(CAST(LDATE AS DATE) AS DATETIME))
                                    UNION ALL 
                                    SELECT 
                                    DATEADD(HOUR, DATEPART(HOUR, (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID)), CAST(CAST((SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) AS DATE) AS DATETIME)) AS DOC_DATE, 
                                    POS.DEVICE AS DEVICE, 
                                    CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                    'PAYMENT' AS TITLE, 
                                    PAY_TYPE_NAME AS TYPE, 
                                    0 AS VAT_RATE, 
                                    CASE WHEN POS.TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT - CHANGE) * -1 END AS AMOUNT 
                                    FROM POS_PAYMENT_VW_01 AS POS 
                                    WHERE POS.STATUS = 1 AND (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) >= @START AND (SELECT TOP 1 LDATE FROM POS_VW_01 AS POS_VW_01 WHERE POS_VW_01.GUID = POS.POS_GUID) <= @END AND POS.DEVICE <> '9999' 
                                    GROUP BY POS.GUID,POS_GUID,POS.DOC_DATE,POS.TYPE,POS.PAY_TYPE_NAME,POS.PAY_TYPE,POS.DEVICE`,
                                    param : ['START:datetime','END:datetime'],
                                    value : [this.dtFirst.value,this.dtLast.value]
                                }

                                App.instance.loading.show()
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                App.instance.loading.hide()

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
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdPivot id="pvtData" parent={this} height={'700px'}
                            fields={
                            [
                                {
                                    caption: "TARIH",
                                    width: 120,
                                    dataField: "DOC_DATE",
                                    dataType: "date",
                                    format: "dd/MM/yyyy - HH:mm",
                                    area: "row",
                                    expanded: true
                                },
                                {
                                    caption: "DEVICE",
                                    width: 50,
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
                </ScrollView>
            </div>
        )
    }
}