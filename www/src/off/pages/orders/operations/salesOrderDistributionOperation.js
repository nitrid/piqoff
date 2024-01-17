import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Button, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export,Editing,Summary,TotalItem} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
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
        this.state = {columns:[],summary:[]}
        this.core = App.instance.core;
        this.orderList = new datatable()
        this._btnGetClick = this._btnGetClick.bind(this)
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
        this.dtFirst.value = moment(new Date(0)).format("YYYY-MM-DD");
        this.dtLast.value = moment(new Date(0)).format("YYYY-MM-DD");
    }
    async _btnGetClick()
    {
        this.orderList = new datatable()
        let tmpXDt = new datatable()
        this.orderList.selectCmd = 
        {
            query : `SELECT 
                    ORDERS.GUID,
                    ORDERS.DOC_GUID,
                    ORDERS.DOC_DATE,
                    ORDERS.REF + '-' + CONVERT(NVARCHAR(20),ORDERS.REF_NO) AS REF,
                    ORDERS.INPUT,
                    ORDERS.INPUT_CODE,
                    ORDERS.INPUT_NAME,
                    ORDERS.OUTPUT,
                    ORDERS.OUTPUT_NAME,
                    ORDERS.ITEM,
                    ORDERS.ITEM_CODE,
                    ORDERS.ITEM_NAME,
                    CASE WHEN UNIT.GUID IS NULL THEN ORDERS.UNIT ELSE UNIT.GUID END AS UNIT,
                    CASE WHEN UNIT.NAME IS NULL THEN ORDERS.UNIT_NAME ELSE UNIT.NAME END AS UNIT_NAME, 
                    CASE WHEN UNIT.SYMBOL IS NULL THEN ORDERS.UNIT_SHORT ELSE UNIT.SYMBOL END AS UNIT_SHORT, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN ORDERS.UNIT_FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, 
                    CASE WHEN UNIT.FACTOR IS NULL THEN ORDERS.PEND_QUANTITY ELSE ORDERS.PEND_QUANTITY / UNIT.FACTOR END AS PEND_QUANTITY 
                    FROM DOC_ORDERS_VW_01 AS ORDERS
                    LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON
                    ORDERS.ITEM = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '` + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + `'
                    WHERE ORDERS.DOC_DATE >= @FIRST_DATE AND ORDERS.DOC_DATE <= @LAST_DATE AND ORDERS.TYPE = 1 AND ORDERS.OUTPUT = @DEPOT AND ORDERS.PEND_QUANTITY > 0
                    ORDER BY ORDERS.DOC_DATE ASC`,
            param : ['FIRST_DATE:date','LAST_DATE:date','DEPOT:string|50'],
            value : [this.dtFirst.value,this.dtLast.value,this.cmbDepot.value]
        }
        
        await this.orderList.refresh()

        let tmpEmpty = {GUID:'',DOC_GUID:'',DOC_DATE:'',REF:'',INPUT:'',INPUT_NAME:''}

        for (let i = 0; i < this.orderList.length; i++) 
        {
            if (!tmpEmpty.hasOwnProperty(this.orderList[i].ITEM)) 
            {
                tmpEmpty[this.orderList[i].ITEM] = 0
            }
        }
        for (let i = 0; i < this.orderList.length; i++) 
        {
            if(tmpXDt.where({INPUT:this.orderList[i].INPUT}).length == 0)
            {
                let tmpDataRow = {...tmpEmpty}
                tmpDataRow.GUID = this.orderList[i].GUID,
                tmpDataRow.DOC_GUID = this.orderList[i].DOC_GUID,
                tmpDataRow.DOC_DATE = this.orderList[i].DOC_DATE,
                tmpDataRow.REF = this.orderList[i].REF,
                tmpDataRow.INPUT = this.orderList[i].INPUT,
                tmpDataRow.INPUT_NAME = this.orderList[i].INPUT_NAME,
                tmpDataRow[this.orderList[i].ITEM] = this.orderList[i].PEND_QUANTITY

                tmpXDt.push(tmpDataRow)
            }
            else
            {
                let tmpMDt = tmpXDt.where({INPUT:this.orderList[i].INPUT})
                tmpMDt[0][this.orderList[i].ITEM] = tmpMDt[0][this.orderList[i].ITEM] + this.orderList[i].PEND_QUANTITY
            }
        }

        await this.grdSlsOrdList.dataRefresh({source:tmpXDt})

        let tmpColumn = []
        let tmpSummary = []

        for (let i = 0; i < Object.keys(tmpEmpty).length; i++) 
        {
            if(Object.keys(tmpEmpty)[i].length >= 36)
            {
                let tmpCaption = this.orderList.where({ITEM:Object.keys(tmpEmpty)[i]}).length > 0 ? this.orderList.where({ITEM:Object.keys(tmpEmpty)[i]})[0].ITEM_NAME : Object.keys(tmpEmpty)[i]
                tmpColumn.push(<Column key={Object.keys(tmpEmpty)[i]} dataField={Object.keys(tmpEmpty)[i]} caption={tmpCaption} visible={true} width={100} allowEditing={true}
                headerCellRender={(e)=>
                {
                    return <div style={{whiteSpace:'normal',textAlign: 'center'}}>{tmpCaption}</div>
                }}
                cellRender={(e)=>
                {
                    return e.value + " / " + (this.orderList.where({ITEM:e.column.dataField}).length > 0 ? this.orderList.where({ITEM:e.column.dataField})[0].UNIT_SHORT : '')
                }}
                />)
                tmpSummary.push(<TotalItem key={Object.keys(tmpEmpty)[i]} column={Object.keys(tmpEmpty)[i]} summaryType="sum" 
                customizeText={(e) => 
                {
                    return e.value + '/' + (this.orderList.where({ITEM:Object.keys(tmpEmpty)[i]}).length > 0 ? this.orderList.where({ITEM:Object.keys(tmpEmpty)[i]})[0].UNIT_SHORT : '')
                }
                }/>)

            }
            else if(Object.keys(tmpEmpty)[i] == 'INPUT_NAME')
            {
                tmpColumn.push(<Column key={"INPUT_NAME"} dataField="INPUT_NAME" caption={this.t("grdSlsOrdList.clmInputName")} allowEditing={false} visible={true} width={300}/>)
            }
        }
        this.setState({columns:tmpColumn,summary:tmpSummary})
    }
    async orderUpdate(pData,pQty)
    {
        return new Promise(async resolve =>
        {
            let tmpDoc = new docCls()
            await tmpDoc.load({GUID:pData.DOC_GUID});
            let tmpItemOrder = tmpDoc.docOrders.dt().where({ITEM:pData.ITEM})
    
            if(tmpDoc.dt().length > 0 && tmpItemOrder.length > 0)
            {
                tmpItemOrder[0].QUANTITY = pQty * pData.UNIT_FACTOR
                tmpItemOrder[0].TOTALHT = Number((parseFloat((tmpItemOrder[0].PRICE * tmpItemOrder[0].QUANTITY).toFixed(3)) - (parseFloat(tmpItemOrder[0].DISCOUNT)))).round(2)
                tmpItemOrder[0].VAT = parseFloat(((((tmpItemOrder[0].TOTALHT) - (parseFloat(tmpItemOrder[0].DOC_DISCOUNT))) * (tmpItemOrder[0].VAT_RATE) / 100))).round(6);
                tmpItemOrder[0].AMOUNT = parseFloat((tmpItemOrder[0].PRICE * tmpItemOrder[0].QUANTITY).toFixed(3)).round(2)
                tmpItemOrder[0].TOTAL = Number(((tmpItemOrder[0].TOTALHT - tmpItemOrder[0].DOC_DISCOUNT) + tmpItemOrder[0].VAT)).round(2)
    
                let tmpVat = 0
                for (let i = 0; i < tmpDoc.docOrders.dt().groupBy('VAT_RATE').length; i++) 
                {
                    tmpVat = tmpVat + parseFloat(tmpDoc.docOrders.dt().where({'VAT_RATE':tmpDoc.docOrders.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                }
                tmpDoc.dt()[0].AMOUNT = tmpDoc.docOrders.dt().sum("AMOUNT",2)
                tmpDoc.dt()[0].DISCOUNT = Number(parseFloat(tmpDoc.docOrders.dt().sum("AMOUNT",2)) - parseFloat(tmpDoc.docOrders.dt().sum("TOTALHT",2))).round(2)
                tmpDoc.dt()[0].DOC_DISCOUNT_1 = tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_1",4)
                tmpDoc.dt()[0].DOC_DISCOUNT_2 = tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_2",4)
                tmpDoc.dt()[0].DOC_DISCOUNT_3 = tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_3",4)
                tmpDoc.dt()[0].DOC_DISCOUNT = Number((parseFloat(tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(tmpDoc.docOrders.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
                tmpDoc.dt()[0].VAT = Number(tmpVat).round(2)
                tmpDoc.dt()[0].SUBTOTAL = parseFloat(tmpDoc.docOrders.dt().sum("TOTALHT",2))
                tmpDoc.dt()[0].TOTALHT = parseFloat(parseFloat(tmpDoc.docOrders.dt().sum("TOTALHT",2)) - parseFloat(tmpDoc.docOrders.dt().sum("DOC_DISCOUNT",2))).round(2)
                tmpDoc.dt()[0].TOTAL = Number((parseFloat(tmpDoc.dt()[0].TOTALHT)) + parseFloat(tmpDoc.dt()[0].VAT)).round(2)
                
                await tmpDoc.save()
            }
            resolve()
        });
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
                                    <Label text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}/>
                                </Item>
                                {/* dtLast */}
                                <Item>
                                    <Label text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}/>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value = ""
                                    data = {{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
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
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
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
                            onRowUpdating={(e)=>
                            {
                                Object.keys(e.newData).forEach(async itemKey => 
                                {
                                    let tmpODt = {...this.orderList.where({ITEM:itemKey}).where({INPUT:e.key.INPUT})}
                                    let tmpOld = e.oldData[itemKey]
                                    let tmpNew = e.newData[itemKey]

                                    for (let i = 0; i < tmpODt.length; i++) 
                                    {
                                        let tmpReminder = tmpNew - tmpOld    
                                        let tmpWeight = tmpODt[i].PEND_QUANTITY / tmpOld
                                        let tmpAvgQty = tmpODt[i].PEND_QUANTITY + Math.round(tmpReminder * tmpWeight)
                                        console.log(tmpNew + " - " + tmpOld + " - " + tmpAvgQty)
                                        await this.orderUpdate(tmpODt[i],tmpAvgQty)
                                    }
                                })
                            }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Editing mode="batch" allowUpdating={true} allowDeleting={false} allowAdding={false} confirmDelete={false}/>
                                {this.state.columns}
                                <Summary>
                                    {this.state.summary}
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
                        container={"#root"} 
                        width={'500'}
                        height={'280'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmSlsOrderMail" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDesign.lang")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmSlsOrderMail" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.printGuid,this.cmbDesignList.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    console.log(JSON.stringify(tmpData.result.recordset)) // BAK
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
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
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
                                                            // let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                                            // mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
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
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
            </div>
        )
    }
}