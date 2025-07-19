import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';
import { docCls,docItemsCls,docCustomerCls,docExtraCls,deptCreditMatchingCls} from '../../../../core/cls/doc.js';

import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Button,Paging,Pager,Export,Summary,TotalItem,StateStoring,ColumnChooser,Scrolling} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';

import NdPopUp from '../../../../core/react/devex/popup.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import {NdForm,NdItem,NdLabel,NdEmptyItem} from '../../../../core/react/devex/form.js';

export default class salesOrdList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

       
        this.printGuid = ''
        
        this.core = App.instance.core;
        this.groupList = [];
        this.btnGetClick = this.btnGetClick.bind(this)
        this.btnGrdPrint = this.btnGrdPrint.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)
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
        this.txtCustomerCode.CODE = ''
        this.btnGetClick()
        this.cmbAllDesignList.value = this.param.filter({ELEMENT:'cmbAllDesignList',USERS:this.user.CODE}).getValue().value
        this.grdSlsOrdList.devGrid.clearFilter('header')
        this.grdSlsOrdList.devGrid.clearSorting()
        this.grdSlsOrdList.devGrid.clearFilter('row')
    }
    async btnGetClick()
    {
        if(this.chkInvOrDisp.value == false)
        {
            let tmpSource =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : `SELECT *, 
                                CASE WHEN ISNULL((SELECT TOP 1 TYPE_TO FROM DOC_CONNECT_VW_01 WHERE DOC_CONNECT_VW_01.DOC_FROM = DOC_VW_01.GUID),0) <> 0 THEN  'OK' ELSE 'X' END AS LIVRE, 
                                (SELECT TOP 1 MAIN_GROUP_NAME FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_NAME,   
                                (SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) AS MAIN_GROUP_CODE   
                                FROM DOC_VW_01 
                                WHERE ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND 
                                ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101')) AND (((SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_VW_01.INPUT) = @MAIN_GROUP_CODE) OR (@MAIN_GROUP_CODE = '')) 
                                AND TYPE = 1 AND DOC_TYPE = 60  AND REBATE = 0 ORDER BY DOC_DATE DESC,REF_NO DESC`, 
                                param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','MAIN_GROUP_CODE:string|50'],
                                value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate,this.cmbMainGrp.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdSlsOrdList.dataRefresh(tmpSource)
            App.instance.setState({isExecute:false})
        }
        else
        {
            let tmpSource2 =
            {
                source : 
                {
                    groupBy : this.groupList,
                    select : 
                    {
                        query : `SELECT * FROM (SELECT DOC_GUID AS GUID,   
                                REF,   
                                REF_NO,   
                                DOC_DATE,   
                                OUTPUT_NAME,   
                                OUTPUT_CODE,   
                                OUTPUT,   
                                INPUT_CODE,   
                                INPUT_NAME,   
                                INPUT,   
                                SUM(AMOUNT) as AMOUNT,   
                                SUM(TOTAL) as TOTAL,   
                                SUM(VAT) as VAT,   
                                SUM(DISCOUNT) as DISCOUNT,   
                                MAX(SHIPMENT_DATE) as SHIPMENT_DATE,   
                                (SELECT TOP 1 VAT_ZERO FROM DOC_VW_01 WHERE DOC_VW_01.GUID = MAX(DOC_ORDERS_VW_01.DOC_GUID)) as VAT_ZERO,   
                                (SELECT TOP 1 ADDRESS FROM DOC_VW_01 WHERE DOC_VW_01.GUID = MAX(DOC_ORDERS_VW_01.DOC_GUID)) as ADDRESS,   
                                SUM(DOC_DISCOUNT) as DOC_DISCOUNT,   
                                SUM(DOC_DISCOUNT_1) as DOC_DISCOUNT_1,   
                                SUM(DOC_DISCOUNT_2) as DOC_DISCOUNT_2,   
                                SUM(DOC_DISCOUNT_3) as DOC_DISCOUNT_3,   
                                (SELECT TOP 1 PRICE_LIST_NO FROM DOC_VW_01 WHERE DOC_VW_01.GUID = MAX(DOC_ORDERS_VW_01.DOC_GUID)) as PRICE_LIST_NO,   
                                SUM(TOTALHT) as TOTALHT,  
                                CASE WHEN ISNULL((SELECT TOP 1 TYPE_TO FROM DOC_CONNECT_VW_01 WHERE DOC_CONNECT_VW_01.DOC_FROM = DOC_ORDERS_VW_01.DOC_GUID),0) <> 0 THEN  'OK' ELSE 'X' END AS LIVRE, 
                                CASE WHEN SUM(APPROVED_QUANTITY) = 0 THEN SUM(PEND_QUANTITY) ELSE SUM(APPROVED_QUANTITY - COMP_QUANTITY) END AS PEND_QUANTITY,  
                                (SELECT TOP 1 MAIN_GROUP_NAME FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_ORDERS_VW_01.INPUT) AS MAIN_GROUP_NAME,  
                                (SELECT TOP 1 MAIN_GROUP_CODE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = DOC_ORDERS_VW_01.INPUT) AS MAIN_GROUP_CODE  
                                FROM DOC_ORDERS_VW_01   
                                WHERE  ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND    
                                ((DOC_DATE >= @FIRST_DATE) OR (@FIRST_DATE = '19700101')) AND ((DOC_DATE <= @LAST_DATE) OR (@LAST_DATE = '19700101'))   
                                AND TYPE = 1 AND PEND_QUANTITY > 0 AND CLOSED = 0   
                                GROUP BY DOC_GUID,REF,REF_NO,DOC_DATE,OUTPUT_NAME,OUTPUT_CODE,INPUT_NAME,INPUT_CODE,INPUT,OUTPUT   
                                ) AS TMP WHERE PEND_QUANTITY > 0 AND (( MAIN_GROUP_CODE = @MAIN_GROUP_CODE) OR (@MAIN_GROUP_CODE = ''))
                                ORDER BY DOC_DATE DESC,REF_NO DESC   `,
                        param : ['INPUT_CODE:string|50','FIRST_DATE:date','LAST_DATE:date','MAIN_GROUP_CODE:string|50'],
                        value : [this.txtCustomerCode.CODE,this.dtFirst.startDate,this.dtFirst.endDate,this.cmbMainGrp.value]
                    },
                    sql : this.core.sql
                }
            }
            App.instance.setState({isExecute:true})
            await this.grdSlsOrdList.dataRefresh(tmpSource2)
            App.instance.setState({isExecute:false})
        }
    }
    async btnGrdPrint(e)
    {
        this.printGuid = e.row.data.GUID
        this.popDesign.show() 
        console.log(e.row.data.GUID)
    }
    async convertDispatch()
    {
        let tmpConfObj =
        {
            id:'msgConvertDispatch',showTitle:true,title:this.t("msgConvertDispatch.title"),showCloseButton:false,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgConvertDispatch.btn01"),location:'before'},{id:"btn02",caption:this.t("msgConvertDispatch.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertDispatch.msg")}</div>)
        }
        
        let pResult = await dialog(tmpConfObj);
        
        if(pResult == 'btn02')
        {
            return
        }
        
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            if(this.grdSlsOrdList.getSelectedData()[i].LIVRE == 'X')
            {
                
                let tmpDocCls =  new docCls

                let tmpDoc = {...tmpDocCls.empty}
                tmpDoc.TYPE = 1
                tmpDoc.DOC_TYPE = 40
                tmpDoc.REBATE = 0
                tmpDoc.INPUT = this.grdSlsOrdList.getSelectedData()[i].INPUT
                tmpDoc.OUTPUT = this.grdSlsOrdList.getSelectedData()[i].OUTPUT
                tmpDoc.VAT_ZERO = this.grdSlsOrdList.getSelectedData()[i].VAT_ZERO
                tmpDoc.REF = this.grdSlsOrdList.getSelectedData()[i].REF,
                tmpDoc.PRICE_LIST_NO = this.grdSlsOrdList.getSelectedData()[i].PRICE_LIST_NO    
                tmpDoc.ADDRESS = this.grdSlsOrdList.getSelectedData()[i].ADDRESS
        
                let tmpQuery = 
                {
                    query :`SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 --AND REF = @REF `,
                }
        
                let tmpData = await this.core.sql.execute(tmpQuery) 
        
                if(tmpData.result.recordset.length > 0)
                {
                    tmpDoc.REF_NO = tmpData.result.recordset[0].REF_NO
                }
        
                tmpDocCls.addEmpty(tmpDoc);     
        
                let tmpLineQuery = 
                {
                    query :`SELECT * FROM DOC_ORDERS_VW_01 WHERE DOC_GUID = @DOC_GUID `,
                    param : ['DOC_GUID:string|50'],
                    value : [this.grdSlsOrdList.getSelectedData()[i].GUID]
                }
        
                let tmpLineData = await this.core.sql.execute(tmpLineQuery) 
        
                if(tmpLineData.result.recordset.length > 0)
                {
                    for (let x = 0; x < tmpLineData.result.recordset.length; x++) 
                    {
                        let tmpdocItems = {...tmpDocCls.docItems.empty}
                        tmpdocItems.DOC_GUID = tmpDocCls.dt()[0].GUID
                        tmpdocItems.TYPE = tmpDocCls.dt()[0].TYPE
                        tmpdocItems.DOC_TYPE = tmpDocCls.dt()[0].DOC_TYPE
                        tmpdocItems.LINE_NO = tmpDocCls.docItems.dt().length
                        tmpdocItems.REF = tmpDocCls.dt()[0].REF
                        tmpdocItems.REF_NO = tmpDocCls.dt()[0].REF_NO
                        tmpdocItems.OUTPUT = tmpDocCls.dt()[0].OUTPUT
                        tmpdocItems.INPUT = tmpDocCls.dt()[0].INPUT
                        tmpdocItems.DOC_DATE = tmpDocCls.dt()[0].DOC_DATE
                        tmpdocItems.SHIPMENT_DATE = tmpDocCls.dt()[0].SHIPMENT_DATE
                        tmpdocItems.LINE_NO = tmpDocCls.docOrders.dt().length
                        tmpdocItems.ITEM = tmpLineData.result.recordset[x].ITEM
                        tmpdocItems.ITEM_NAME = tmpLineData.result.recordset[x].ITEM_NAME
                        tmpdocItems.UNIT = tmpLineData.result.recordset[x].UNIT
                        tmpdocItems.OUTPUT = tmpDocCls.dt()[0].OUTPUT
                        tmpdocItems.DISCOUNT = tmpLineData.result.recordset[x].DISCOUNT
                        tmpdocItems.DISCOUNT_1 = tmpLineData.result.recordset[x].DISCOUNT_1
                        tmpdocItems.DISCOUNT_2 = tmpLineData.result.recordset[x].DISCOUNT_2
                        tmpdocItems.DISCOUNT_3 = tmpLineData.result.recordset[x].DISCOUNT_3
                        tmpdocItems.DOC_DISCOUNT_1 = tmpLineData.result.recordset[x].DOC_DISCOUNT_1
                        tmpdocItems.DOC_DISCOUNT_2 = tmpLineData.result.recordset[x].DOC_DISCOUNT_2
                        tmpdocItems.DOC_DISCOUNT_3 = tmpLineData.result.recordset[x].DOC_DISCOUNT_3
                        tmpdocItems.DISCOUNT_RATE = tmpLineData.result.recordset[x].DISCOUNT_RATE
                        tmpdocItems.INPUT = tmpDocCls.dt()[0].INPUT
                        tmpdocItems.DOC_DATE = tmpDocCls.dt()[0].DOC_DATE
                        tmpdocItems.QUANTITY = tmpLineData.result.recordset[x].QUANTITY
                        tmpdocItems.VAT_RATE = tmpLineData.result.recordset[x].VAT_RATE
                        tmpdocItems.PRICE = tmpLineData.result.recordset[x].PRICE
                        tmpdocItems.VAT = tmpLineData.result.recordset[x].VAT
                        tmpdocItems.AMOUNT = Number(tmpLineData.result.recordset[x].AMOUNT).round(2)
                        tmpdocItems.TOTALHT = Number(tmpLineData.result.recordset[x].TOTALHT).round(2)
                        tmpdocItems.TOTAL = Number(tmpLineData.result.recordset[x].TOTAL).round(2)
                        tmpdocItems.ORDER_DOC_GUID = tmpLineData.result.recordset[x].DOC_GUID
                        tmpdocItems.ORDER_LINE_GUID = tmpLineData.result.recordset[x].GUID
    
                        tmpDocCls.docItems.addEmpty(tmpdocItems)
                    }
                }
                if(tmpDocCls.docItems.dt().length > 0)
                {
                    let tmpVat = 0
                    for (let i = 0; i < tmpDocCls.docItems.dt().groupBy('VAT_RATE').length; i++) 
                    {
                        if(tmpDocCls.dt()[0].VAT_ZERO != 1)
                        {
                            tmpVat = tmpVat + parseFloat(tmpDocCls.docItems.dt().where({'VAT_RATE':tmpDocCls.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                        }
                    }
                    tmpDocCls.dt()[0].AMOUNT = tmpDocCls.docItems.dt().sum("AMOUNT",2)
                    tmpDocCls.dt()[0].DISCOUNT = Number(parseFloat(tmpDocCls.docItems.dt().sum("AMOUNT",2)) - parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2))).round(2)
                    tmpDocCls.dt()[0].DOC_DISCOUNT_1 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_1",4)
                    tmpDocCls.dt()[0].DOC_DISCOUNT_2 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_2",4)
                    tmpDocCls.dt()[0].DOC_DISCOUNT_3 = tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_3",4)
                    tmpDocCls.dt()[0].DOC_DISCOUNT = Number((parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
                    tmpDocCls.dt()[0].VAT = Number(tmpVat).round(2)
                    tmpDocCls.dt()[0].SUBTOTAL = parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2))
                    tmpDocCls.dt()[0].TOTALHT = parseFloat(parseFloat(tmpDocCls.docItems.dt().sum("TOTALHT",2)) - parseFloat(tmpDocCls.docItems.dt().sum("DOC_DISCOUNT",2))).round(2)
                    tmpDocCls.dt()[0].TOTAL = Number((parseFloat(tmpDocCls.dt()[0].TOTALHT)) + parseFloat(tmpDocCls.dt()[0].VAT)).round(2)
                    await tmpDocCls.save()
                }
            }
           
        }
        let tmpConfObj1 =
        {
            id:'msgConvertSucces',showTitle:true,title:this.t("msgConvertSucces.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgConvertSucces.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgConvertSucces.msg")}</div>)
        }

        await dialog(tmpConfObj1);
        this.btnGetClick()
    }
    async printOrders()
    {
        let tmpLines = []
        for (let i = 0; i < this.grdSlsOrdList.getSelectedData().length; i++) 
        {
            let tmpPrintQuery = 
            {
                query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID)  ORDER BY LINE_NO ` ,
                param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                value:  [this.grdSlsOrdList.getSelectedData()[i].GUID,this.cmbAllDesignList.value,localStorage.getItem('lang').toUpperCase()]
            }
            let tmpData = await this.core.sql.execute(tmpPrintQuery) 

            for (let x = 0; x < tmpData.result.recordset.length; x++) 
            {
                tmpLines.push(tmpData.result.recordset[x])
            }
        }
        this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',(pResult) => 
        {
            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

            mywindow.onload = function() 
            {
                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
            } 
        });
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdSlsOrdListState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdSlsOrdListState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
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
                                        icon: 'detailslayout',
                                        onClick: async () => 
                                        {
                                            this.convertDispatch()
                                        }
                                    }    
                                } />
                                <Item location="after" locateInMenu="auto">
                                <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                onClick={()=>
                                {
                                    this.popAllDesign.show()
                                }}/>
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmCriter">
                                {/* dtFirst */}
                                <Item>
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NbDateRange id={"dtFirst"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                </Item>
                                <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        { 
                                            if(data.length > 0)
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtCustomerCode.setState({value:data[0].TITLE})
                                                    this.txtCustomerCode.CODE = data[0].CODE
                                                }
                                            }
                                        }
                                    }).bind(this)}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:data[0].TITLE})
                                                        this.txtCustomerCode.CODE = data[0].CODE
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                >   
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#" + this.props.data.id + this.props.data.tabkey}
                                visible={false}
                                position={{of:'#' + this.props.data.id + this.props.data.tabkey}} 
                                showTitle={true} 
                                showBorders={true}
                                width={'90%'}
                                height={'90%'}
                                title={this.t("pg_txtCustomerCode.title")} //
                                search={true}
                                data = 
                                {{
                                    source:
                                    {
                                        select:
                                        {
                                            query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                                            param : ['VAL:string|50']
                                        },
                                        sql:this.core.sql
                                    }
                                }}
                                button=
                                {
                                    {
                                        id:'01',
                                        icon:'more',
                                        onClick:()=>
                                        {
                                            console.log(1111)
                                        }
                                    }
                                }
                                >
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>       
                                </NdPopGrid>
                                </Item> 
                                <Item>
                                    <Label text={this.t("cmbMainGrp")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMainGrp" showClearButton={true} notRefresh={true}  searchEnabled={true}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    data={{source: {select : {query:`SELECT CODE,NAME FROM CUSTOMER_GROUP ORDER BY NAME ASC`},sql : this.core.sql}}}
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
                            <Form>
                                <Item>
                                    <Label text={this.t("chkInvOrDisp")} alignment="left" />
                                    <NdCheckBox id="chkInvOrDisp" parent={this} defaultValue={true} value={true} />
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdSlsOrdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'sip_02_002',
                                    text: this.t('menuOff.sip_01_002'),
                                    path: 'orders/documents/salesOrder.js',
                                    pagePrm:{GUID:e.data.GUID}
                                })
                            }}
                            >  
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdSlsOrdList"}/>                                  
                                <ColumnChooser enabled={true} />  
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="infinite" />}
                                <Export fileName={this.lang.t("menuOff.sip_01_002")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="REF" caption={this.t("grdSlsOrdList.clmRef")} visible={true} width={200}/> 
                                <Column dataField="REF_NO" caption={this.t("grdSlsOrdList.clmRefNo")} visible={true} width={100}/> 
                                <Column dataField="INPUT_CODE" caption={this.t("grdSlsOrdList.clmInputCode")} visible={false}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdSlsOrdList.clmInputName")} visible={true}/>
                                <Column dataField="MAIN_GROUP_NAME" caption={this.t("grdSlsOrdList.clmMainGroup")} width={100} visible={true}/> 
                                <Column dataField="OUTPUT_NAME" caption={this.t("grdSlsOrdList.clmOutputName")} visible={false}/> 
                                <Column dataField="DOC_DATE" caption={this.t("grdSlsOrdList.clmDate")} visible={true} width={200} dataType="datetime" format={"dd/MM/yyyy"}/>
                                <Column dataField="TOTALHT" caption={this.t("grdSlsOrdList.clmAmount")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="VAT" caption={this.t("grdSlsOrdList.clmVat")} visible={false} format={{ style: "currency", currency: Number.money.code,precision: 2}}/> 
                                <Column dataField="TOTAL" caption={this.t("grdSlsOrdList.clmTotal")} visible={true} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>              
                                <Column dataField="LIVRE" caption={this.t("grdSlsOrdList.clmLivre")} visible={true} width={100}/>
                                <Column type="buttons" width={70} fixed={true} fixedPosition="right">
                                    <Button hint="Clone" icon="print" onClick={this.btnGrdPrint} />
                                </Column>
                                <Summary>
                                    <TotalItem
                                    column="TOTALHT"
                                    summaryType="sum"
                                    valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                                      <TotalItem
                                    column="VAT"
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
                </ScrollView>
                {/* Dizayn Seçim PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popDesign"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popDesign.title")}
                    container={"#" + this.props.data.id + this.props.data.tabkey} 
                    width={'500'}
                    height={'auto'}
                    position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                displayExpr="DESIGN_NAME"                       
                                valueExpr="TAG"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '111'`},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmSlsOrderMail" + this.tabIndex}>
                                        <RequiredRule message={this.t("validDesign")} />
                                    </Validator> 
                                </NdSelectBox>
                            </NdItem>
                            <NdItem>
                            <NdLabel text={this.t("popDesign.lang")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value={localStorage.getItem('lang').toUpperCase()}
                                searchEnabled={true}
                                data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                >
                                </NdSelectBox>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpQuery = 
                                                {
                                                    query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO ` ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [this.printGuid,this.cmbDesignList.value]
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 

                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                {
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

                                                    mywindow.onload = function() 
                                                    {
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                    } 
                                                });
                                                this.popDesign.hide();  
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popDesign.hide();  
                                        }}/>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpQuery = 
                                                {
                                                    query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO ` ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [this.printGuid,this.cmbDesignList.value]
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
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                        onClick={async (e)=>
                                        {    
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                this.popMailSend.show()
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                </div>  
                {/* Dizayn Seçim PopUp */}
                <div>
                <NdPopUp parent={this} id={"popAllDesign"} 
                visible={false}
                showCloseButton={true}
                showTitle={true}
                title={this.t("popDesign.title")}
                container={"#" + this.props.data.id + this.props.data.tabkey} 
                width={'500'}
                height={'auto'}
                position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                >
                    <NdForm colCount={1} height={'fit-content'}>
                        <NdItem>
                            <NdLabel text={this.t("popDesign.design")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="cmbAllDesignList" notRefresh = {true}
                            displayExpr="DESIGN_NAME"                       
                            valueExpr="TAG"
                            value=""
                            searchEnabled={true}
                            data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '111'`},sql:this.core.sql}}}
                            />
                        </NdItem>
                        <NdItem>
                            <div className='row'>
                                <div className='col-6'>
                                    <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                    onClick={async (e)=>
                                    {       
                                        this.printOrders()
                                    }}/>
                                </div>
                                <div className='col-6'>
                                    <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                    onClick={()=>
                                    {
                                        this.popAllDesign.hide();  
                                    }}/>
                                </div>
                            </div>
                        </NdItem>
                    </NdForm>
                </NdPopUp>
                </div>  
            </div>
        )
    }
}