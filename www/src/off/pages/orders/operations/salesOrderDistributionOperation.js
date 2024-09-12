import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core';
import { docCls } from '../../../../core/cls/doc.js'

export default class salesOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.printGuid = ''
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.state = {columns:[],summary:[],selecedItem:'',textColor:'green'}
        this.core = App.instance.core;
        this.orderList = new datatable()
        this.orderDetail = new datatable()
        this._btnGetClick = this._btnGetClick.bind(this)
        this._btnApprove = this._btnApprove.bind(this)
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
        
    }
    async _btnGetClick()
    {
        this.orderList = new datatable()
        this.orderList.selectCmd = 
        {
            query : `SELECT *,DEPOT_QUANTITY + COMING_QUANTITY AS TOTAL_QUANTITY,CASE WHEN APPROVED_QUANTITY = 0 THEN QUANTITY ELSE APPROVED_QUANTITY END AS APPROVED_QYT FROM (SELECT 
                    ORDERS.DOC_DATE,
                    ORDERS.ITEM,
                    ORDERS.ITEM_CODE,
                    ORDERS.ITEM_NAME,
                    ORDERS.OUTPUT,
                    ORDERS.OUTPUT_NAME,
                    SUM(ORDERS.TOTALHT) AS TOTALHT,
                    SUM(ORDERS.TOTAL) AS TOTAL,
                    CASE WHEN UNIT.GUID IS NULL THEN MAIN_UNIT.GUID ELSE UNIT.GUID END AS UNIT,
                    CASE WHEN UNIT.NAME IS NULL THEN MAIN_UNIT.NAME ELSE UNIT.NAME END AS UNIT_NAME, 
                    CASE WHEN UNIT.SYMBOL IS NULL THEN MAIN_UNIT.SYMBOL ELSE UNIT.SYMBOL END AS UNIT_SHORT, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN MAIN_UNIT.FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN SUM(ORDERS.QUANTITY) ELSE SUM(ORDERS.QUANTITY) / UNIT.FACTOR END AS QUANTITY,
                    CASE WHEN UNIT.FACTOR IS NULL THEN SUM(ORDERS.APPROVED_QUANTITY) ELSE SUM(ORDERS.APPROVED_QUANTITY) / UNIT.FACTOR END AS APPROVED_QUANTITY,
                    (SELECT [dbo].[FN_DEPOT_QUANTITY](ORDERS.ITEM,ORDERS.OUTPUT,GETDATE())) AS DEPOT_QUANTITY,
                    (SELECT dbo.FN_ORDER_PEND_QTY(ORDERS.ITEM,0,ORDERS.OUTPUT)) AS COMING_QUANTITY
                    FROM DOC_ORDERS_VW_01 AS ORDERS
                    LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON
                    ORDERS.ITEM = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '` + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + `'
                    LEFT OUTER JOIN ITEM_UNIT_VW_01 AS MAIN_UNIT ON
                    ORDERS.ITEM = MAIN_UNIT.ITEM_GUID AND MAIN_UNIT.TYPE = 0 
                    WHERE ORDERS.DOC_DATE >= @FIRST_DATE AND ORDERS.DOC_DATE <= @LAST_DATE AND ORDERS.TYPE =  1 AND  ORDERS.PEND_QUANTITY > 0 AND OUTPUT = @DEPOT
                    GROUP BY ORDERS.DOC_DATE,ORDERS.ITEM,ORDERS.ITEM_CODE,ORDERS.ITEM_NAME,ORDERS.UNIT_NAME,UNIT.GUID,UNIT.NAME, UNIT.SYMBOL,UNIT.FACTOR,
                    MAIN_UNIT.GUID,MAIN_UNIT.NAME, MAIN_UNIT.FACTOR, MAIN_UNIT.SYMBOL,ORDERS.OUTPUT,ORDERS.OUTPUT_NAME) AS TMP`,
            param : ['FIRST_DATE:date','LAST_DATE:date','DEPOT:string|50'],
            value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDepot.value]
        }
        App.instance.setState({isExecute:true})
        await this.orderList.refresh()
        await this.grdSlsOrdList.dataRefresh({source:this.orderList})
        App.instance.setState({isExecute:false})

        
    }
    async _btnApprove()
    {
        let tmpConfOb1 =
        {
            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfOb1);
        if(pResult == 'btn02')
        {
            return
        }
        App.instance.setState({isExecute:true})
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            let tmpQuery = 
            {
                query : `SELECT *,CASE WHEN APPROVED_QUANTITY = 0 THEN QUANTITY ELSE APPROVED_QUANTITY END AS APPROVED_QYT FROM (SELECT 
                ORDERS.DOC_DATE,
                ORDERS.GUID,
                ORDERS.ITEM,
                ORDERS.ITEM_CODE,
                ORDERS.ITEM_NAME,
                ORDERS.OUTPUT,
                ORDERS.OUTPUT_NAME,
                ORDERS.INPUT,
                ORDERS.INPUT_CODE,
                ORDERS.INPUT_NAME,
                (ORDERS.TOTALHT) AS TOTALHT,
                (ORDERS.TOTAL) AS TOTAL,
                CASE WHEN UNIT.GUID IS NULL THEN MAIN_UNIT.GUID ELSE UNIT.GUID END AS UNIT,
                CASE WHEN UNIT.NAME IS NULL THEN MAIN_UNIT.NAME ELSE UNIT.NAME END AS UNIT_NAME, 
                CASE WHEN UNIT.SYMBOL IS NULL THEN MAIN_UNIT.SYMBOL ELSE UNIT.SYMBOL END AS UNIT_SHORT, 
                CASE WHEN UNIT.FACTOR IS NULL THEN MAIN_UNIT.FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, 
                CASE WHEN UNIT.FACTOR IS NULL THEN (ORDERS.QUANTITY) ELSE (ORDERS.QUANTITY) / UNIT.FACTOR END AS QUANTITY,
                CASE WHEN UNIT.FACTOR IS NULL THEN (ORDERS.APPROVED_QUANTITY) ELSE (ORDERS.APPROVED_QUANTITY) / UNIT.FACTOR END AS APPROVED_QUANTITY,
                (SELECT [dbo].[FN_DEPOT_QUANTITY](ORDERS.ITEM,ORDERS.OUTPUT,GETDATE())) AS DEPOT_QUANTITY,
                (SELECT dbo.FN_ORDER_PEND_QTY(ORDERS.ITEM,0,ORDERS.OUTPUT)) AS COMING_QUANTITY
                FROM DOC_ORDERS_VW_01 AS ORDERS
                LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON
                ORDERS.ITEM = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '` + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + `'
                LEFT OUTER JOIN ITEM_UNIT_VW_01 AS MAIN_UNIT ON
                ORDERS.ITEM = MAIN_UNIT.ITEM_GUID AND MAIN_UNIT.TYPE = 0 
                WHERE ORDERS.DOC_DATE >= @FIRST_DATE AND ORDERS.DOC_DATE <= @LAST_DATE AND ORDERS.TYPE =  1 AND  ORDERS.PEND_QUANTITY > 0 AND OUTPUT = @DEPOT AND ITEM = @ITEM
                ) AS TMP`,
                param : ['FIRST_DATE:date','LAST_DATE:date','DEPOT:string|50','ITEM:string|50'],
                value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDepot.value,this.grdSlsOrdList.getSelectedData()[i].ITEM]
            }

            let tmpOrderLines =  await this.core.sql.execute(tmpQuery) 

            for (let x = 0; x < tmpOrderLines.result.recordset.length; x++) 
            {
                let tmpQuery = 
                {
                    query : "EXEC [dbo].[PRD_DOC_ORDERS_UPDATE] " + 
                            "@CUSER = @PCUSER, " + 
                            "@APPROVED_QUANTITY = @PAPPROVED_QUANTITY, " + 
                            "@GUID = @PGUID ", 
                    param : ['PCUSER:string|50','PAPPROVED_QUANTITY:float','PGUID:string|50'],
                    value : [this.user.CODE,tmpOrderLines.result.recordset[x].APPROVED_QYT * tmpOrderLines.result.recordset[x].UNIT_FACTOR,tmpOrderLines.result.recordset[x].GUID]
                }
                await this.core.sql.execute(tmpQuery) 
            }
        }
        App.instance.setState({isExecute:false})

        let tmpConfObj =
        {
            id:'msgSaveSuccess',showTitle:true,title:this.t("msgSaveSuccess.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSaveSuccess.btn01"),location:'before'},{id:"btn01",caption:this.t("msgSaveSuccess.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveSuccess.msg")}</div>)
        }
        
        let tmpdialog = await dialog(tmpConfObj);  
        if(tmpdialog == 'btn01')
        {
            let tmpOrderQuery = 
            {
                query: "SELECT DOC_GUID FROM DOC_ORDERS_VW_01 WHERE ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) AND OUTPUT = @DEPOT GROUP BY DOC_GUID HAVING SUM(APPROVED_QUANTITY) > 0 " ,
                param : ['FIRST_DATE:date','LAST_DATE:date','DEPOT:string|50'],
                value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDepot.value]
            }
            let tmpOrderData = await this.core.sql.execute(tmpOrderQuery) 
            
            if(tmpOrderData.result.recordset.length > 0)
            {
                for (let r = 0; r < tmpOrderData.result.recordset.length; r++) 
                {
                    let tmpPrintQuery = 
                {
                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) WHERE APPROVED_QUANTITY > 0 ORDER BY LINE_NO " ,
                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                    value:  [tmpOrderData.result.recordset[r].DOC_GUID,this.prmObj.filter({ID:'printDesing',USERS:this.user.CODE}).getValue().value,'']
                }
                let tmpData = await this.core.sql.execute(tmpPrintQuery) 
                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                {
                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         
    
                    mywindow.onload = function() 
                    {
                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                    } 
                    // if(pResult.split('|')[0] != 'ERR')
                    // {
                    //     let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                    //     mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                    // }
                });
                }
               
            }
        }
    }
    async getOrderDetail(pData)
    {
        this.orderDetail = new datatable()
        this.orderDetail.selectCmd = 
        {
            query : `SELECT *,CASE WHEN APPROVED_QUANTITY = 0 THEN QUANTITY ELSE APPROVED_QUANTITY END AS APPROVED_QYT FROM (SELECT 
                    ORDERS.DOC_DATE,
                    ORDERS.GUID,
                    ORDERS.ITEM,
                    ORDERS.ITEM_CODE,
                    ORDERS.ITEM_NAME,
                    ORDERS.OUTPUT,
                    ORDERS.OUTPUT_NAME,
                    ORDERS.INPUT,
                    ORDERS.INPUT_CODE,
                    ORDERS.INPUT_NAME,
                    (ORDERS.TOTALHT) AS TOTALHT,
                    (ORDERS.TOTAL) AS TOTAL,
                    CASE WHEN UNIT.GUID IS NULL THEN MAIN_UNIT.GUID ELSE UNIT.GUID END AS UNIT,
                    CASE WHEN UNIT.NAME IS NULL THEN MAIN_UNIT.NAME ELSE UNIT.NAME END AS UNIT_NAME, 
                    CASE WHEN UNIT.SYMBOL IS NULL THEN MAIN_UNIT.SYMBOL ELSE UNIT.SYMBOL END AS UNIT_SHORT, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN MAIN_UNIT.FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN (ORDERS.QUANTITY) ELSE (ORDERS.QUANTITY) / UNIT.FACTOR END AS QUANTITY,
                    CASE WHEN UNIT.FACTOR IS NULL THEN (ORDERS.APPROVED_QUANTITY) ELSE (ORDERS.APPROVED_QUANTITY) / UNIT.FACTOR END AS APPROVED_QUANTITY,
                    (SELECT [dbo].[FN_DEPOT_QUANTITY](ORDERS.ITEM,ORDERS.OUTPUT,GETDATE())) AS DEPOT_QUANTITY,
                    (SELECT dbo.FN_ORDER_PEND_QTY(ORDERS.ITEM,0,ORDERS.OUTPUT)) AS COMING_QUANTITY
                    FROM DOC_ORDERS_VW_01 AS ORDERS
                    LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON
                    ORDERS.ITEM = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '` + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + `'
                    LEFT OUTER JOIN ITEM_UNIT_VW_01 AS MAIN_UNIT ON
                    ORDERS.ITEM = MAIN_UNIT.ITEM_GUID AND MAIN_UNIT.TYPE = 0 
                    WHERE ORDERS.DOC_DATE >= @FIRST_DATE AND ORDERS.DOC_DATE <= @LAST_DATE AND ORDERS.TYPE =  1 AND  ORDERS.PEND_QUANTITY > 0 AND OUTPUT = @DEPOT AND ITEM = @ITEM
                    ) AS TMP`,
            param : ['FIRST_DATE:date','LAST_DATE:date','DEPOT:string|50','ITEM:string|50'],
            value : [this.dtDate.startDate,this.dtDate.endDate,this.cmbDepot.value,pData.ITEM]
        }

        App.instance.setState({isExecute:true})
        await this.orderDetail.refresh()
        await this.grdOrderDetail.dataRefresh({source:this.orderDetail})
        App.instance.setState({isExecute:false})
        this.itemTotalQyt = pData.TOTAL_QUANTITY
        if(pData.TOTAL_QUANTITY <  pData.APPROVED_QYT)
        {
            this.setState({textColor:'red'})
        }
        else
        if(pData.TOTAL_QUANTITY <  pData.APPROVED_QYT)
        {
            this.setState({textColor:'green'})
        }
        this.popOrderDetail.show()
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'sip_02_002',
                                                text: this.t('menu'),
                                                path: 'orders/documents/salesOrder.js',
                                            })
                                        }
                                    }    
                                } />
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
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}onApply={(async()=>{this._btnGetClick()}).bind(this)}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" 
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value = ""
                                    data = {{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
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
                            <NdButton text={this.t("btnGet")} type="Default" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsOrdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:false}} 
                            headerFilter={{visible:false}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            width={'100%'}
                            dbApply={false}
                            onCellPrepared={(e) =>
                            {
                                if(e.rowType === "data" && e.column.dataField === "APPROVED_QYT")
                                {
                                    e.cellElement.style.color = e.data.DEPOT_QUANTITY + e.data.COMING_QUANTITY < e.data.APPROVED_QYT ? "red" : "green";
                                }
                            }}
                            onRowDblClick={async(e)=>
                            {
                                this.setState({selecedItem:e.data.ITEM_CODE + ' - ' + e.data.ITEM_NAME})
                                this.getOrderDetail(e.data)
                            }}>                     
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="batch" allowUpdating={false} allowDeleting={false} allowAdding={false} confirmDelete={false}/>
                                <Column dataField="ITEM_CODE" caption={this.t("grdSlsOrdList.clmItemCode")} width={100}/>
                                <Column dataField="ITEM_NAME" caption={this.t("grdSlsOrdList.clmItemName")} width={300} />
                                <Column dataField="DEPOT_QUANTITY" caption={this.t("grdSlsOrdList.clmDepotQuantity")} width={120} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                <Column dataField="COMING_QUANTITY" caption={this.t("grdSlsOrdList.clmComingQuantity")} width={120} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                <Column dataField="TOTAL_QUANTITY" caption={this.t("grdSlsOrdList.clmTotalQuantity")} width={120} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                <Column dataField="QUANTITY" caption={this.t("grdSlsOrdList.clmQuantity")} width={120} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                <Column dataField="APPROVED_QYT" caption={this.t("grdSlsOrdList.clmApprovedQuantity")} width={120} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                <Column dataField="TOTALHT" caption={this.t("grdSlsOrdList.clmTotalHt")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={120} allowHeaderFiltering={false}/>
                                <Column dataField="TOTAL" caption={this.t("grdSlsOrdList.clmTotal")} width={110} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/>
                                <Summary>
                                    <TotalItem
                                    column="QUANTITY"
                                    summaryType="sum"/>
                                     <TotalItem
                                    column="APPROVED_QYT"
                                    summaryType="sum"/>
                                     <TotalItem
                                    column="DEPOT_QUANTITY"
                                    summaryType="sum"/>
                                     <TotalItem
                                    column="COMING_QUANTITY"
                                    summaryType="sum"/>
                                    <TotalItem
                                    column="TOTALHT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                    <TotalItem
                                    column="TOTAL"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                </Summary>
                            </NdGrid>
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
                            <NdButton text={this.t("btnSave")} type="success" width="100%" onClick={this._btnApprove}></NdButton>
                        </div>
                    </div>
                </ScrollView>
                <div>
                    <NdPopUp id={"popOrderDetail"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("popOrderDetail.title")} 
                    showCloseButton={true}
                    width={"1000px"}
                    height={"800PX"}
                    deferRendering={false}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.state.selecedItem}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* grdOrderDetail */}
                                    <Item>
                                        <NdGrid parent={this} id={"grdOrderDetail"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter={{visible:true}}
                                        filterRow = {{visible:true}}
                                        height={600} 
                                        width={'100%'}
                                        dbApply={false}
                                        selection={{mode:"multiple"}}
                                        onRowUpdated={async(e)=>
                                        {
                                           if(e.key.APPROVED_QYT > e.key.QUANTITY)
                                           {
                                                let tmpConfObj =
                                                {
                                                    id:'msgApprovedBig',showTitle:true,title:this.t("msgApprovedBig.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgApprovedBig.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgApprovedBig.msg")}</div>)
                                                }
                                                
                                                await dialog(tmpConfObj);  
                                                e.key.APPROVED_QYT = e.key.QUANTITY
                                           }
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                            <Column dataField="DOC_DATE" caption={this.t("grdOrderDetail.clmDate")} width={100} allowEditing={false} dataType="datetime" format={"dd/MM/yyyy"}/>
                                            <Column dataField="INPUT_NAME" caption={this.t("grdOrderDetail.clmCustomer")} width={230} allowEditing={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdOrderDetail.clmCode")} width={90} allowEditing={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdOrderDetail.clmName")} width={180} allowEditing={false}/>
                                            <Column dataField="QUANTITY" caption={this.t("grdOrderDetail.clmQuantity")} width={90} allowEditing={false} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                            <Column dataField="APPROVED_QYT" caption={this.t("grdOrderDetail.clmApprovedQuantity")} width={90} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this._cellRoleRender}/>
                                            <Summary>
                                                <TotalItem
                                                column="QUANTITY"
                                                summaryType="sum"/>
                                                <TotalItem
                                                column="APPROVED_QYT"
                                                summaryType="sum"/>
                                            </Summary>
                                        </NdGrid>
                                    </Item>
                                    <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnDetailCancel")} type="danger" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                           this.popOrderDetail.hide()
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnDetailApproved")} type="success" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            for (let i = 0; i < this.orderDetail.length; i++) 
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "EXEC [dbo].[PRD_DOC_ORDERS_UPDATE] " + 
                                                            "@CUSER = @PCUSER, " + 
                                                            "@APPROVED_QUANTITY = @PAPPROVED_QUANTITY, " + 
                                                            "@GUID = @PGUID ", 
                                                    param : ['PCUSER:string|50','PAPPROVED_QUANTITY:float','PGUID:string|50'],
                                                    value : [this.user.CODE,this.orderDetail[i].APPROVED_QYT * this.orderDetail[i].UNIT_FACTOR,this.orderDetail[i].GUID]
                                                }
                                                await this.core.sql.execute(tmpQuery) 
                                            }
                                            this.popOrderDetail.hide()
                                            this._btnGetClick()
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                                </Form>
                            </div>
                        </div>
                    </NdPopUp>  
                </div>
            </div>
        )
    }
}