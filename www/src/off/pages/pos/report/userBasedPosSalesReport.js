import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar from 'devextreme-react/toolbar';
import Form, {Item, Label, EmptyItem} from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Scrolling} from '../../../../core/react/devex/grid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPivot,{FieldChooser,Export} from '../../../../core/react/devex/pivot.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdPopUp from '../../../../core/react/devex/popup.js';

export default class userBasedPosSalesReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.chkRowTotal.value = true
        this.init()
    }
    async init()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : 
                        `SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DATE,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET_ID,
                        ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_EXTRA.POS_GUID =POS_VW_01.GUID AND TAG = 'PARK DESC' ),'') AS DESCRIPTION FROM POS_VW_01 WHERE STATUS IN (0,2) ORDER BY DOC_DATE `
                },
                sql : this.core.sql
            }
        }
        await this.grdOpenTike.dataRefresh(tmpSource)
        if(this.grdOpenTike.data.datatable.length > 0)
        {
          this.popOpenTike.show()
        }  
    }
    async printReport()
    {
        let tmpQuery = 
        {
            query:  
                    `SELECT 
                    POS.DOC_DATE AS DOC_DATE, 
                    'UTILISATEUR    :' + POS.LUSER AS LUSER, 
                    CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                    'SALES' AS TITLE, 
                    'HT' AS TYPE, 
                    ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = 72),'') AS PATH,  
                    POS.VAT_RATE AS VAT_RATE, 
                    CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT 
                    FROM POS_SALE_VW_01 AS POS 
                    WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                    GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.LUSER 
                    UNION ALL 
                    SELECT 
                    POS.DOC_DATE AS DOC_DATE, 
                    'UTILISATEUR :' + POS.LUSER AS LUSER, 
                    CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                    'SALES' AS TITLE, 
                    'TVA' AS TYPE, 
                    ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = 72),'') AS PATH,  
                    POS.VAT_RATE AS VAT_RATE, 
                    CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT 
                    FROM POS_SALE_VW_01 AS POS 
                    WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                    GROUP BY POS.DOC_DATE,POS.TYPE,POS.VAT_RATE,POS.LUSER `,
            param : ['START:date','END:date'],
            value : [this.dtDate.startDate,this.dtDate.endDate]
        }
        
        App.instance.loading.show()
        let tmpData = await this.core.sql.execute(tmpQuery) 
        App.instance.loading.hide()
        
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
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=> { this.printReport() }}/>
                                </Item>
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
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Form colCount={4}>
                                <Item colSpan={2}>
                                    <Label text={this.lang.t("dtDate")} alignment="right" />
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                <EmptyItem colSpan={1}/>
                                <EmptyItem colSpan={1}/>
                            </Form>
                            <Form colCount={4} parent={this} id="frmPurcoffer">
                                <Item colSpan={1}>
                                    <Label text={this.lang.t("txtTotalTicket")} alignment="right" />
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
                        <div className="col-4">
                        </div>
                        <div className="col-4">
                        </div>
                        <div className="col-4">
                            <NdButton text={this.lang.t("btnGet")} type="success" width={'100%'}
                            onClick={async (e)=>
                            {
                                let tmpTicketQuery = {
                                    query :`SELECT COUNT(GUID) AS TICKET,ISNULL(AVG(TOTAL),0) AS AVGTOTAL FROM POS_VW_01 WHERE STATUS = 1 AND  DOC_DATE >= @FISRT_DATE AND DOC_DATE <= @LAST_DATE `,
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
                                    query : `SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            POS.CUSER AS CUSER, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'SALES' AS TITLE, 
                                            'HT' AS TYPE, 
                                            POS.VAT_RATE AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(POS.FAMOUNT) ELSE SUM(POS.FAMOUNT) * -1 END AS AMOUNT 
                                            FROM POS_SALE_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                            GROUP BY POS.DOC_DATE, POS.TYPE, POS.VAT_RATE, POS.DEVICE, POS.CUSER 
                                            UNION ALL 
                                            SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            POS.CUSER AS CUSER, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'SALES' AS TITLE, 
                                            'TVA' AS TYPE, 
                                            POS.VAT_RATE AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(POS.VAT) ELSE SUM(POS.VAT) * -1 END AS AMOUNT 
                                            FROM POS_SALE_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' AND POS.TOTAL <> 0 
                                            GROUP BY POS.DOC_DATE, POS.TYPE, POS.VAT_RATE, POS.DEVICE, POS.CUSER 
                                            UNION ALL 
                                            SELECT 
                                            POS.DOC_DATE AS DOC_DATE, 
                                            POS.DEVICE AS DEVICE, 
                                            POS.CUSER AS CUSER, 
                                            CASE WHEN POS.TYPE = 0 THEN 'VENTE' ELSE 'REMB.MNT' END AS DOC_TYPE, 
                                            'PAYMENT' AS TITLE, 
                                            PAY_TYPE_NAME AS TYPE, 
                                            0 AS VAT_RATE, 
                                            CASE WHEN POS.TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT - CHANGE) * -1 END AS AMOUNT 
                                            FROM POS_PAYMENT_VW_01 AS POS 
                                            WHERE POS.STATUS = 1 AND POS.DOC_DATE >= @START AND POS.DOC_DATE <= @END AND POS.DEVICE <> '9999' 
                                            GROUP BY POS.DOC_DATE, POS.TYPE, POS.PAY_TYPE_NAME, POS.PAY_TYPE, POS.DEVICE, POS.CUSER `, 
                                    param : ['START:date','END:date'],
                                    value : [this.dtDate.startDate,this.dtDate.endDate]
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
                                    width: 80,
                                    dataField: "DOC_DATE",
                                    dataType: "date",
                                    format: "dd/MM/yyyy",
                                    area: "row",
                                    expanded: true
                                },
                                {
                                    caption: "CUSER",
                                    width: 80,
                                    dataField: "CUSER",
                                    area: "row",
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
                    {/* Açık Fişler PopUp */}
                    <NdPopUp parent={this} id={"popOpenTike"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popOpenTike.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'900px'}
                    height={'auto'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                            <NdGrid parent={this} id={"grdOpenTike"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={350} 
                                    width={'100%'}
                                    dbApply={false}
                                    >
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                        <Column dataField="CUSER_NAME" caption={this.lang.t("grdOpenTike.clmUser")} width={110}  headerFilter={{visible:true}}/>
                                        <Column dataField="DEVICE" caption={this.lang.t("grdOpenTike.clmDevice")} width={60}  headerFilter={{visible:true}}/>
                                        <Column dataField="DATE" caption={this.lang.t("grdOpenTike.clmDate")} width={90} allowEditing={false} />
                                        <Column dataField="TICKET_ID" caption={this.lang.t("grdOpenTike.clmTicketId")} width={150}  headerFilter={{visible:true}}/>
                                        <Column dataField="TOTAL" caption={this.lang.t("grdOpenTike.clmTotal")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}} headerFilter={{visible:true}}/>
                                        <Column dataField="DESCRIPTION" caption={this.lang.t("grdOpenTike.clmDescription")} width={250}  headerFilter={{visible:true}}/>
                                </NdGrid>
                            </Item>
                        </Form>
                    </NdPopUp>
                </ScrollView>
            </div>
        )
    }
}