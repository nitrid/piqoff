import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbRadioButton from "../../../../core/react/bootstrap/radiogroup.js";
import NbLabel from "../../../../core/react/bootstrap/label.js";
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NbButton from "../../../../core/react/bootstrap/button.js";
import { dialog } from '../../../../core/react/devex/dialog.js';
import { dataset,datatable,param,access } from "../../../../core/core.js";
import { posExtraCls} from "../../../../core/cls/pos.js";



export default class salesOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this.btnGetDetail = this.btnGetDetail.bind(this)
        this.lastPosSaleDt = new datatable();
        this.lastPosPayDt = new datatable();
        this.state={ticketId :""}
        
        Number.money = this.sysParam.filter({ID:'MoneySymbol',TYPE:0}).getValue()


        this.tabIndex = props.data.tabkey
    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");
        this.txtCustomerCode.CODE = ''
        this.txtPayChangeDesc.value = this.t("txtPayChangeDesc")
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT *,CONVERT(NVARCHAR,DOC_DATE,104) AS DATE,SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,25) AS TICKET_ID," + 
                    "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_EXTRA.POS_GUID =POS_VW_01.GUID AND TAG = 'PARK DESC' ),'') AS DESCRIPTION FROM POS_VW_01 WHERE STATUS = 0 ORDER BY DOC_DATE "
                },
                sql : this.core.sql
            }
        }
        await this.grdOpenTike.dataRefresh(tmpSource)
        console.log(this.grdOpenTike)
        if(this.grdOpenTike.data.datatable.length > 0)
        {
          this.popOpenTike.show()
        }
    }
    async _btnGetClick()
    {
        console.log(this.dtFirst.value)
        console.log(this.dtLast.value)
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT POS_GUID,LUSER_NAME, SUBSTRING(CONVERT(NVARCHAR(50),POS_GUID),20,25) AS TICKET_ID,CONVERT(NVARCHAR,(SELECT TOP 1 DOC_DATE FROM POS WHERE POS.GUID = POS_EXTRA_VW_01.POS_GUID),104) AS DATE,DESCRIPTION FROM POS_EXTRA_VW_01 WHERE (SELECT TOP 1 DOC_DATE FROM POS WHERE POS.GUID = POS_EXTRA_VW_01.POS_GUID) >=@FIRST_DATE AND (SELECT TOP 1 DOC_DATE FROM POS WHERE POS.GUID = POS_EXTRA_VW_01.POS_GUID) <= @LAST_DATE AND TAG = @TAG" ,
                    param : ['FIRST_DATE:date','LAST_DATE:date','TAG:string|50'],
                    value : [this.dtFirst.value,this.dtLast.value,this.cmbType.value]
                },
                sql : this.core.sql
            }
        }
        console.log(tmpSource)
        App.instance.setState({isExecute:true})
        await this.grdSaleTicketReport.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})
    }
    async btnGetDetail(pGuid)
    {
        this.lastPosSaleDt.selectCmd = 
        {
            query :  "SELECT ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.GUID = POS_SALE.BARCODE),'') AS BARCODE,  " +
            "ISNULL((SELECT TOP 1 NAME FROM ITEMS WHERE ITEMS.GUID = POS_SALE.ITEM),'') AS ITEM_NAME,  " +
            "ISNULL((SELECT TOP 1 DATA FROM POS_EXTRA WHERE POS_EXTRA.LINE_GUID = POS_SALE.GUID AND TAG = 'PRICE DESC'),'') AS LAST_DATA,  " +
            "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_EXTRA.LINE_GUID = POS_SALE.GUID ORDER BY TAG DESC),ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_EXTRA.POS_GUID = POS_SALE.POS AND TAG = 'FULL DELETE' ORDER BY TAG DESC),'')) AS DESCRIPTION,  " +
            "QUANTITY AS QUANTITY,  " +
            "PRICE AS PRICE,  " +
            "TOTAL AS TOTAL,  " +
            "DELETED AS DELETED  " +
            "FROM POS_SALE WHERE POS = @POS_GUID ",
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        
        await this.lastPosSaleDt.refresh()
        await this.grdSaleTicketItems.dataRefresh({source:this.lastPosSaleDt});
        
        this.lastPosPayDt.selectCmd = 
        {
            query :  "SELECT (AMOUNT-CHANGE) AS LINE_TOTAL,* FROM POS_PAYMENT_VW_01  WHERE POS_GUID = @POS_GUID ",
            param : ['POS_GUID:string|50'],
            value : [pGuid]
        }
        this.lastPosPayDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        this.lastPosPayDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        this.lastPosPayDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                    >
                                    </NdDatePicker>
                                </Item>
                                {/* cmbType */}
                                <Item>
                                    <Label text={this.t("cmbType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    showClearButton={true}
                                    notRefresh={true}
                                    data={{source:[{ID:"PARK DESC",VALUE:this.t("cmbTypeData.parkDesc")},{ID:"FULL DELETE",VALUE:this.t("cmbTypeData.fullDelete")},{ID:"ROW DELETE",VALUE:this.t("cmbTypeData.rowDelete")},{ID:"PRICE DESC",VALUE:this.t("cmbTypeData.priceChange")}]}}
                                    param={this.param.filter({ELEMENT:'PARK DESC',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'PARK DESC',USERS:this.user.CODE})}
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSaleTicketReport" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            sorting={{ mode: 'single' }}
                            height={600}
                            width={"100%"}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                                {
                                  this.btnGetDetail(e.data.POS_GUID)
                                  this.setState({ticketId:e.data.POS_ID})

                                }}
                            >                            
                                <Scrolling mode="standart" />
                                <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="DATE" caption={this.t("grdSaleTicketReport.clmDate")} visible={true} width={150}/> 
                                <Column dataField="LUSER_NAME" caption={this.t("grdSaleTicketReport.clmUser")} visible={true} width={150}/> 
                                <Column dataField="TICKET_ID" caption={this.t("grdSaleTicketReport.clmTicketId")} visible={true} width={200}/> 
                                <Column dataField="DESCRIPTION" caption={this.t("grdSaleTicketReport.clmDescription")} visible={true} width={400}/> 
                            </NdGrid>
                        </div>
                    </div>
                    <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'100%'}
                        height={'100%'}
                        position={{of:'#root'}}
                        >
                           <div className="row">
                         <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            {this.t("TicketId")} : {this.state.ticketId}
                            </div>
                         </div>
                          <div className="row">
                          <div className="col-1 pe-0"></div>
                            <div className="col-7 pe-0">
                            <NdGrid id="grdSaleTicketItems" parent={this} 
                                selection={{mode:"single"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowPrepared={(e) =>
                                {
                                    if(e.rowType == 'data' && e.data.DELETED == false && e.data.LAST_DATA == '')
                                    {
                                        e.rowElement.style.color ="green"
                                    }
                                    else if(e.rowType == 'data' && e.data.DELETED == false && e.data.LAST_DATA != '')
                                    {
                                        e.rowElement.style.color ="blue"
                                    }
                                    else if(e.rowType == 'data' && e.data.DELETED == true)
                                    {
                                        e.rowElement.style.color ="red"
                                    }
                                }}
                                >                            
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="BARCODE" caption={this.t("grdSaleTicketItems.clmBarcode")} visible={true} width={130}/> 
                                    <Column dataField="ITEM_NAME" caption={this.t("grdSaleTicketItems.clmName")} visible={true} width={250}/> 
                                    <Column dataField="QUANTITY" caption={this.t("grdSaleTicketItems.clmQuantity")} visible={true} width={60}/> 
                                    <Column dataField="PRICE" caption={this.t("grdSaleTicketItems.clmPrice")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    <Column dataField="TOTAL" caption={this.t("grdSaleTicketItems.clmTotal")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    <Column dataField="LAST_DATA" caption={this.t("grdSaleTicketItems.clmLastData")} visible={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                                    <Column dataField="DESCRIPTION" caption={this.t("grdSaleTicketItems.clmDescription")} visible={true} width={150} format={{ style: "currency", currency: "EUR",precision: 2}}/> 
                            </NdGrid>
                            </div>
                            <div className="col-3 ps-0">
                            <NdGrid id="grdSaleTicketPays" parent={this} 
                                selection={{mode:"single"}} 
                                showBorders={true}
                                filterRow={{visible:true}} 
                                headerFilter={{visible:true}}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                onRowPrepared={(e) =>
                                {
                                    if(e.rowType == 'data' && e.data.DELETED == false)
                                    {
                                        e.rowElement.style.color ="green"
                                    }
                                    else if(e.rowType == 'data' && e.data.DELETED == true)
                                    {
                                        e.rowElement.style.color ="blue"
                                    }
                                }}
                                >
                                    <Paging defaultPageSize={20} />
                                    <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                    <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                    <Column dataField="PAY_TYPE_NAME" caption={this.t("grdSaleTicketPays.clmPayName")} visible={true} width={155}/> 
                                    <Column dataField="LINE_TOTAL" caption={this.t("grdSaleTicketPays.clmTotal")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}}  width={150}/> 
                            </NdGrid>
                            </div>
                            </div>
                    </NdPopUp>
                    <div>
                    <NdPopUp parent={this} id={"popLastTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popLastTotal.title")}
                    container={"#root"} 
                    width={"600"}
                    height={"700"}
                    position={{of:"#root"}}
                    onHiding={async()=>
                    {
                        await this.lastPosPayDt.refresh()
                    }}
                    >
                        <div className="row">
                            <div className="col-12">
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2 pe-1">
                                        <NbRadioButton id={"rbtnTotalPayType"} parent={this} 
                                        button={[
                                            {
                                                id:"btn01",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-money-bill-1",
                                                text:"ESC"
                                            },
                                            {
                                                id:"btn02",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-credit-card",
                                                text:"CB"
                                            },
                                            {
                                                id:"btn03",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-rectangle-list",
                                                text:"CHQ"
                                            },
                                            {
                                                id:"btn04",
                                                style:{height:'49px',width:'100%'},
                                                icon:"fa-rectangle-list",
                                                text:"CHQe"
                                            }
                                        ]}/>
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-10">
                                        {/* grdLastTotalPay */}
                                        <div className="row">
                                            <div className="col-12">
                                                <NdGrid parent={this} id={"grdLastTotalPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={"138px"} 
                                                width={"100%"}
                                                dbApply={false}
                                                selection={{mode:"single"}}
                                                onRowPrepared={(e)=>
                                                {
                                                    e.rowElement.style.fontSize = "16px";
                                                    e.rowElement.style.fontWeight = "bold";
                                                }}
                                                onRowRemoved={async (e) =>
                                                {
                                                    
                                                }}
                                                >
                                                    <Editing confirmDelete={false}/>
                                                    <Column dataField="PAY_TYPE_NAME" width={200} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" width={100} format={"#,##0.00"}/>  
                                                    <Column dataField="CHANGE" width={100} format={"#,##0.00"}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        {/* lastPayRest */}
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <p className="fs-2 fw-bold text-center m-0"><NbLabel id="lastPayRest" parent={this} value={"0.00"} format={"currency"}/></p>
                                            </div>
                                        </div>
                                        {/* txtPopLastTotal */}
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <NdTextBox id="txtPopLastTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <div className="row">
                                        {/* T.R Detail */}
                                            <div className="col-3">
                                                <NbButton id={"btnPopLastTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async ()=>
                                                {
                                                    if(this.lastPosPayDt.where({PAY_TYPE:4}).length > 0)
                                                    {
                                                        let tmpDt = new datatable(); 
                                                        tmpDt.selectCmd = 
                                                        {
                                                            query : "SELECT AMOUNT AS AMOUNT,COUNT(AMOUNT) AS COUNT FROM CHEQPAY_VW_01 WHERE DOC = @DOC GROUP BY AMOUNT",
                                                            param : ['DOC:string|50'],
                                                            local : 
                                                            {
                                                                type : "select",
                                                                from : "CHEQPAY_VW_01",
                                                                where : {DOC : this.lastPosPayDt[0].POS_GUID},
                                                                aggregate:{count: "AMOUNT"},
                                                                groupBy: "AMOUNT",
                                                            }
                                                        }
                                                        tmpDt.selectCmd.value = [this.lastPosPayDt[0].POS_GUID]
                                                        await tmpDt.refresh();
                                                        
                                                        await this.grdLastTRDetail.dataRefresh({source:tmpDt});
                                                        this.popLastTRDetail.show()
                                                    }
                                                }}>
                                                    {this.t("trDeatil")}
                                                </NbButton>
                                            </div>
                                        {/* Line Delete */}
                                            <div className="col-3">
                                                <NbButton id={"btnPopLastTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    if(this.grdLastTotalPay.devGrid.getSelectedRowKeys().length > 0)
                                                    {                                                        
                                                        this.grdLastTotalPay.devGrid.deleteRow(this.grdLastTotalPay.devGrid.getRowIndexByKey(this.grdLastTotalPay.devGrid.getSelectedRowKeys()[0]))
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 : Number(this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT'))
                                                        this.txtPopLastTotal.newStart = true;

                                                        //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                        setTimeout(() => 
                                                        {
                                                            this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                        }, 100);
                                                    }
                                                }}>
                                                    {this.t("lineDelete")}
                                                </NbButton>
                                            </div>
                                        {/* Cancel */}
                                            <div className="col-3">
                                                <NbButton id={"btnPopLastTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>{this.popLastTotal.hide()}}>
                                                     {this.t("cancel")}
                                                </NbButton>
                                            </div>
                                        {/* Okey */}
                                            <div className="col-3">
                                                <NbButton id={"btnPopLastTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    let tmpTypeName = ""
                                                    let tmpAmount = Number(parseFloat(this.txtPopLastTotal.value).toFixed(2))
                                                    let tmpChange = Number(parseFloat(this.lastPosSaleDt[0].GRAND_TOTAL - (this.lastPosPayDt.sum('AMOUNT') + tmpAmount)).toFixed(2))

                                                    if(this.rbtnTotalPayType.value == 0)
                                                    {                                                        
                                                        tmpTypeName = "ESC"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 1)
                                                    {
                                                        tmpTypeName = "CB"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 2)
                                                    {
                                                        tmpTypeName = "CHQ"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 3)
                                                    {
                                                        tmpTypeName = "T.R"
                                                    }
                                                    else if(this.rbtnTotalPayType.value == 4)
                                                    {
                                                        tmpTypeName = "BON D'AVOIR"
                                                    }
                                                        
                                                    if(tmpChange < 0)
                                                    {
                                                        if(this.rbtnTotalPayType.value == 0)
                                                        {
                                                            tmpChange = tmpChange * -1
                                                            tmpAmount = this.txtPopLastTotal.value  //- tmpChange
                                                        }
                                                        else
                                                        {       
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgPayNotBigToPay',showTitle:true,title:this.lang.t("msgPayNotBigToPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.lang.t("msgPayNotBigToPay.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPayNotBigToPay.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            tmpAmount = (this.txtPopLastTotal.value  - tmpChange) * -1
                                                            tmpChange = 0
                                                        }
                                                    }
                                                    else
                                                    {
                                                        tmpChange = 0
                                                    }

                                                    if(tmpAmount > 0)
                                                    {
                                                        let tmpData = 
                                                        {
                                                            GUID : datatable.uuidv4(),
                                                            CUSER : this.core.auth.data.CODE,
                                                            POS_GUID : this.lastPosSaleDt[0].POS_GUID,
                                                            PAY_TYPE : this.rbtnTotalPayType.value,
                                                            PAY_TYPE_NAME : tmpTypeName,
                                                            LINE_NO : this.lastPosPayDt.length + 1,
                                                            AMOUNT : tmpAmount,
                                                            CHANGE : tmpChange
                                                        }
                                                        this.lastPosPayDt.push(tmpData)
                                                        this.lastPayRest.value = this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT') < 0 ? 0 + Number.money.sign : Number(this.lastPosSaleDt[0].GRAND_TOTAL - this.lastPosPayDt.sum('AMOUNT'))
                                                        this.txtPopLastTotal.newStart = true;
                                                    }

                                                    //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
                                                    setTimeout(() => 
                                                    {
                                                        this.grdLastTotalPay.devGrid.selectRowsByIndexes(0)
                                                    }, 100);
                                                }}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <div className="row pt-2">
                                    <div className="col-12">
                                        {this.t("payChangeNote")}
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    <div className="col-12">
                                        {this.t("payChangeNote2")}
                                    </div>
                                </div>
                                <div className="row py-2">
                                    <div className="col-12">
                                        <NdTextBox id={"txtPayChangeDesc"} placeholder={this.t("txtPayChangeDescPlace")} parent={this} simple={true}/>       
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopLastTotalSave"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.lastPayRest.value > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgMissingPay',showTitle:true,title:this.lang.t("msgMissingPay.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.lang.t("msgMissingPay.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMissingPay.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }

                                            await this.lastPosPayDt.delete()
                                            await this.lastPosPayDt.update() 
                                            this.popLastTotal.hide()
                                            this.extraObj = new posExtraCls()
                                            let tmpExtra = {...this.extraObj.empty}
                                            this.extraObj.addEmpty(tmpExtra);
                                            this.extraObj.dt()[0].TAG = 'PAYMENT_CHANGE'
                                            this.extraObj.dt()[0].POS_GUID = this.lastPosPayDt[0].POS_GUID
                                            this.extraObj.dt()[0].DESCRIPTION = this.txtPayChangeDesc.value
                                            
                                            this.extraObj.save()
                                        }}>
                                            <i className="text-white fa-solid fa-floppy-disk" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>       
                                             
                            </div>
                        </div>
                    </NdPopUp>
                        {/* Açık Fişler PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popOpenTike"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popOpenTike.title")}
                            container={"#root"} 
                            width={'900'}
                            height={'500'}
                            position={{of:'#root'}}
                            >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                <NdGrid parent={this} id={"grdOpenTike"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter={{visible:true}}
                                        height={350} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowDblClick={async(e)=>
                                        {
                                            this.btnGetDetail(e.data.GUID)
                                            this.setState({ticketId:e.data.TICKET_ID})
                                        }}
                                        onRowRemoved={async (e)=>{
                                        }}
                                        >
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="CUSER_NAME" caption={this.t("grdOpenTike.clmUser")} width={110}  headerFilter={{visible:true}}/>
                                            <Column dataField="DEVICE" caption={this.t("grdOpenTike.clmDevice")} width={80}  headerFilter={{visible:true}}/>
                                            <Column dataField="DATE" caption={this.t("grdOpenTike.clmDate")} width={100} allowEditing={false} />
                                            <Column dataField="TICKET_ID" caption={this.t("grdOpenTike.clmTicketId")} width={180}  headerFilter={{visible:true}}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdOpenTike.clmDescription")} width={250}  headerFilter={{visible:true}}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </NdPopUp>
                        </div>          
                </div>
                </ScrollView>
            </div>
        )
    }
}