import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../core/react/devex/grid.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NbItemView from '../tools/itemView.js';

import { docCls,docOrdersCls, docCustomerCls,docExtraCls }from '../../core/cls/doc.js';
import { datatable } from '../../core/core.js';

export default class Sale extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"sale")
        this.lang = App.instance.lang;
        this.docObj = new docCls();
        this.docLines = new datatable()

        this._customerSearch = this._customerSearch.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.getItems = this.getItems.bind(this)

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()
        let tmpDoc = {...this.docObj.empty}
        this.docObj.addEmpty(tmpDoc);
        this.docLines.clear()

        this.getItems()
        this.popCustomer.show()
        this.cmbGroup.value = ''
    }
    async getItems()
    {
        let tmpQuery = 
        {
            query :"SELECT TOP 25  GUID,CODE,NAME,VAT," +
            "ISNULL((SELECT [dbo].[FN_PRICE_SALE_VAT_EXT](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000',NULL)),0) AS PRICE," + 
            "(SELECT IMAGE FROM ITEM_IMAGE_VW_01 WHERE ITEM_IMAGE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID) AS IMAGES, " +
            "(SELECT TOP 1 GUID FROM ITEM_UNIT_VW_01 WHERE TYPE = 0 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID) AS UNIT, " +
            "(SELECT TOP 1 NAME FROM ITEM_UNIT_VW_01 WHERE TYPE = 0 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID) AS UNIT_NAME " + 
            " FROM ITEMS_VW_01 WHERE (SELECT IMAGE FROM ITEM_IMAGE_VW_01 WHERE ITEM_IMAGE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID) <> '' AND STATUS = 1 AND " +
            " UPPER(NAME) LIKE UPPER(@VAL + '%') AND ((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = ''))",
            param : ['VAL:string|50','MAIN_GRP:string|50'],
            value : [this.txtSearch.value,this.cmbGroup.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            console.log(111)
            this.itemView.items = tmpData.result.recordset
        }
        this.itemView.setItemAll()
    }
    async _customerSearch()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL + '%') OR UPPER(TITLE) LIKE UPPER(@VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtCustomerSearch.value]
                },
                sql : this.core.sql
            }
        }
        await this.grdCustomer.dataRefresh(tmpSource)
    }
    addItem(e)
    {
        let tmpdocOrders = {...this.docObj.docOrders.empty}
        tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
        tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
        tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpdocOrders.LINE_NO = this.docLines.length
        tmpdocOrders.REF = this.docObj.dt()[0].REF
        tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
        tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
        tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpdocOrders.ITEM_CODE = e.CODE
        tmpdocOrders.ITEM = e.GUID
        tmpdocOrders.ITEM_NAME = e.NAME
        tmpdocOrders.VAT_RATE = e.VAT
        tmpdocOrders.QUANTITY = e.QUANTITY
        tmpdocOrders.PRICE = e.PRICE
        tmpdocOrders.AMOUNT = parseFloat(((tmpdocOrders.PRICE * tmpdocOrders.QUANTITY))).round(2)
        tmpdocOrders.TOTALHT = parseFloat(((tmpdocOrders.PRICE * tmpdocOrders.QUANTITY))).round(2)
        tmpdocOrders.VAT = parseFloat(((tmpdocOrders.TOTALHT ) * (e.VAT / 100)).toFixed(4))
        tmpdocOrders.TOTAL = parseFloat(((tmpdocOrders.TOTALHT) + tmpdocOrders.VAT)).round(2)
        this.docLines.push(tmpdocOrders)
        this._calculateTotal()
    }
    onValueChange(e)
    {
        console.log(e)
        let tmpLine = this.docLines.where({'ITEM':e.GUID})
        if(tmpLine.length > 0)
        {
            if(e.QUANTITY > 0)
            {
                tmpLine[0].QUANTITY = e.QUANTITY
                tmpLine[0].AMOUNT = parseFloat(((tmpLine[0].PRICE * e.QUANTITY))).round(2)
                tmpLine[0].TOTALHT = parseFloat(((tmpLine[0].PRICE * e.QUANTITY))).round(2)
                tmpLine[0].VAT = parseFloat(((tmpLine[0].TOTALHT ) * (e.VAT / 100)).toFixed(4))
                tmpLine[0].TOTAL = parseFloat(((tmpLine[0].TOTALHT) + tmpLine[0].VAT)).round(2)
            }
            else
            {
                this.docLines.removeAt(this.docLines.where({'ITEM':e.GUID})[0])
            }
            this._calculateTotal()
        }
        else
        {
            this.addItem(e)
        }
    }
    async _calculateTotal()
    {
        let tmpVat = 0
        for (let i = 0; i < this.docLines.groupBy('VAT_RATE').length; i++) 
        {
            tmpVat = tmpVat + parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
        }
        this.docObj.dt()[0].AMOUNT = this.docLines.sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docLines.sum("DISCOUNT",2)
        this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docLines.sum("DOC_DISCOUNT_1",4)
        this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docLines.sum("DOC_DISCOUNT_2",4)
        this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docLines.sum("DOC_DISCOUNT_3",4)
        this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docLines.sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docLines.sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docLines.sum("DOC_DISCOUNT_3",4)))).round(2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docLines.sum("TOTALHT",2))
        this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docLines.sum("TOTALHT",2)) - parseFloat(this.docLines.sum("DOC_DISCOUNT",2))).round(2)
        this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
    }
    async checkRow()
    {
        for (let i = 0; i < this.docLines.length; i++) 
        {
            this.docLines[i].INPUT = this.docObj.dt()[0].INPUT
            this.docLines[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docLines[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
        }
    }    
    async orderSave()
    {
        let tmpQuery = 
        {
            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 AND REF = @REF ",
            param : ['REF:string|25'],
            value : [this.docObj.dt()[0].REF]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }
        this.docObj.dt()[0].TYPE = 1 
        this.docObj.dt()[0].DOC_TYPE = 60
        for (let i = 0; i < this.docLines.length; i++) 
        {
            let tmpDocOrders = {...this.docObj.docOrders.empty}
            tmpDocOrders.DOC_GUID = this.docLines[i].DOC_GUID
            tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
            tmpDocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocOrders.LINE_NO = this.docLines[i].LINE_NO
            tmpDocOrders.REF = this.docObj.dt()[0].REF
            tmpDocOrders.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocOrders.INPUT = this.docObj.dt()[0].INPUT
            tmpDocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocOrders.ITEM_CODE = this.docLines[i].ITEM_CODE
            tmpDocOrders.ITEM = this.docLines[i].ITEM
            tmpDocOrders.ITEM_NAME = this.docLines[i].ITEM_NAME
            tmpDocOrders.VAT_RATE = this.docLines[i].VAT_RATE
            tmpDocOrders.QUANTITY = this.docLines[i].QUANTITY
            tmpDocOrders.PRICE = this.docLines[i].PRICE
            tmpDocOrders.AMOUNT = this.docLines[i].AMOUNT
            tmpDocOrders.TOTALHT = this.docLines[i].TOTALHT
            tmpDocOrders.VAT = this.docLines[i].VAT
            tmpDocOrders.TOTAL = this.docLines[i].TOTAL
            this.docObj.docOrders.addEmpty(tmpDocOrders)
        }

        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
    }
    async factureSave()
    {
        let tmpQuery = 
        {
            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 20  AND REBATE = 0",
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }
        this.docObj.dt()[0].TYPE = 1 
        this.docObj.dt()[0].DOC_TYPE = 20

        
        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
        tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
        tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
        tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocCustomer.AMOUNT = this.docObj.dt()[0].TOTAL
        tmpDocCustomer.REF = this.docObj.dt()[0].REF
        tmpDocCustomer.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocCustomer.INPUT = this.docObj.dt()[0].INPUT
        this.docObj.docCustomer.addEmpty(tmpDocCustomer)

        for (let i = 0; i < this.docLines.length; i++) 
        {
            let tmpDocItems = {...this.docObj.docItems.empty}
            tmpDocItems.DOC_GUID = this.docLines[i].DOC_GUID
            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocItems.LINE_NO = this.docLines[i].LINE_NO
            tmpDocItems.REF = this.docObj.dt()[0].REF
            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            tmpDocItems.ITEM_CODE = this.docLines[i].ITEM_CODE
            tmpDocItems.ITEM = this.docLines[i].ITEM
            tmpDocItems.ITEM_NAME = this.docLines[i].ITEM_NAME
            tmpDocItems.VAT_RATE = this.docLines[i].VAT_RATE
            tmpDocItems.QUANTITY = this.docLines[i].QUANTITY
            tmpDocItems.PRICE = this.docLines[i].PRICE
            tmpDocItems.AMOUNT = this.docLines[i].AMOUNT
            tmpDocItems.TOTALHT = this.docLines[i].TOTALHT
            tmpDocItems.VAT = this.docLines[i].VAT
            tmpDocItems.TOTAL = this.docLines[i].TOTAL
            this.docObj.docOrders.addEmpty(tmpDocItems)
        }

        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.docObj.save()) == 0)
        {                                                    
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
            await dialog(tmpConfObj1);
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
    }
    render()
    {
        return(
            <div>
                <div style={{height:'50px',backgroundColor:'#f5f6fa',top:'65px',position:'sticky',borderBottom:'1px solid #7f8fa6'}}>
                    <div className="row">
                        <div className="col-1" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-secondary" style={{height:"100%",width:"100%"}}
                            onClick={()=>
                            {
                                this.popCart.show()
                            }}>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </NbButton>
                        </div>
                        <div className="col-1" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-secondary" style={{height:"100%",width:"100%"}}
                            onClick={()=>
                            {
                                this.popMenu.hide()
                                this.setState({page:'dashboard.js'})
                            }}>
                                <i className="fa-solid fa-filter"></i>
                            </NbButton>
                        </div>
                        <div className="col-2" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            
                        </div>
                        <div className="col-4" align="center" style={{paddingTop:'5px'}}>
                            <NdTextBox id={"txtSearch"} parent={this} simple={true} placeholder={"Search"}  onChange={this.getItems}
                             button={
                            [
                                {
                                    id:'01',
                                    icon:'find',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this.getItems()
                                    }
                                }                                                    
                            ]}
                            />
                        </div>
                        <div className="col-4" align="right" style={{paddingRight:'25px',paddingTop:'5px'}}>
                            <NdSelectBox simple={true} parent={this} id="cmbGroup" height='fit-content' style={{width:'250px'}}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            value= ""
                            searchEnabled={true}
                            showClearButton={true}
                            onValueChanged={(async()=>
                            {
                                this.getItems()
                            }).bind(this)}
                            data={{source:{select:{query : "SELECT CODE,NAME,GUID FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                            />
                        </div>
                    </div>
                </div>
                <div style={{paddingLeft:"15px",paddingRight:"15px",paddingTop:"65px"}}>
                    <ScrollView showScrollbar={'never'} useNative={false}>
                        <div className='row'>
                            <div className='col-12'>
                                <NbItemView id="itemView" parent={this} dt={this.docLines} onValueChange={this.onValueChange}/>
                            </div>
                        </div>
                        {/* CART */}
                        <div>
                            <NbPopUp id={"popCart"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12' align={"right"}>
                                            <Toolbar>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.init()
                                                        this.popCart.hide();
                                                    }}>
                                                        <i className="fa-solid fa-file fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={async()=>
                                                    {
                                                        
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'before'},{id:"btn03",caption:this.t("msgSave.btn03"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                                        }
                                                        
                                                        let pResult = await dialog(tmpConfObj);
                                                        if(pResult == 'btn01')
                                                        {
                                                            this.orderSave()
                                                        }
                                                        else if(pResult == 'btn02')
                                                        {
                                                            this.factureSave()
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-floppy-disk fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={async()=>
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                                        }
                                                        
                                                        let pResult = await dialog(tmpConfObj);
                                                        if(pResult == 'btn01')
                                                        {
                                                          
                                                            this.docObj.dt('DOC').removeAt(0)
                                                            await this.docObj.dt('DOC').delete();
                                                            this.popCart.hide();
                                                            this.init(); 
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-trash fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                        this.itemView.setItemAll()
                                                    }}>
                                                        <i className="fa-solid fa-xmark fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-12'>
                                            <Form colCount={1}>
                                                {/* MUSTERI */}
                                                <Item>
                                                    <Label text={this.t("popCart.txtCustomer")} alignment="right" />
                                                    <NdTextBox id="txtCustomer" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.popCustomer.show()
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    selectAll={true}                           
                                                    >     
                                                    </NdTextBox>
                                                </Item>
                                                {/* Depo */}
                                                <Item>
                                                    <Label text={this.t("popCart.cmbDepot")} alignment="right" />
                                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                                    displayExpr="NAME"                       
                                                    valueExpr="GUID"
                                                    value=""
                                                    searchEnabled={true}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                                    >
                                                         <Validator validationGroup={"sale"}>
                                                            <RequiredRule message={this.t("validDepot")} />
                                                        </Validator> 
                                                    </NdSelectBox>
                                                </Item>
                                                <Item>
                                                    <Label text={this.t("popCart.dtDocDate")} alignment="right" />
                                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                                    onValueChanged={(async()=>
                                                    {
                                                        this.checkRow()
                                                    }).bind(this)}
                                                    >
                                                    </NdDatePicker>
                                                </Item>
                                                {/* GRID */}
                                                <Item>
                                                    <NdGrid parent={this} id={"grdSale"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    headerFilter={{visible:true}}
                                                    height={'400'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    onRowPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdating={async (e)=>
                                                    {
                                                    }}
                                                    onCellPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdated={async(e)=>
                                                    {
                                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                                        {
                                                            e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE,4)
                                                            e.key.DISCOUNT_1 = Number(e.key.PRICE * e.key.QUANTITY).rateInc( e.data.DISCOUNT_RATE,4)
                                                            e.key.DISCOUNT_2 = 0
                                                            e.key.DISCOUNT_3 = 0
                                                        }
                                                        if(typeof e.data.DISCOUNT != 'undefined')
                                                        {
                                                            e.key.DISCOUNT_1 = e.data.DISCOUNT
                                                            e.key.DISCOUNT_2 = 0
                                                            e.key.DISCOUNT_3 = 0
                                                            e.key.DISCOUNT_RATE = Number(e.key.PRICE * e.key.QUANTITY).rate2Num(e.data.DISCOUNT)
                                                        }
                                                        
                                                    
                                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscount',showTitle:true,title:this.t("msgDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscount.msg")}</div>)
                                                            }
                                                        
                                                            dialog(tmpConfObj);
                                                            e.key.DISCOUNT = 0 
                                                            e.key.DISCOUNT_1 = 0
                                                            e.key.DISCOUNT_2 = 0
                                                            e.key.DISCOUNT_3 = 0
                                                            e.key.DISCOUNT_RATE = 0
                                                            return
                                                        }
                                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - (parseFloat(e.key.DISCOUNT) + parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(4);
                                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                                        e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                                        e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
                                                        this._calculateTotal()
                                                    }}
                                                    onRowRemoved={async (e)=>
                                                    {
                                                        this._calculateTotal()
                                                    }}
                                                    onReady={async()=>
                                                    {
                                                        await this.grdSale.dataRefresh({source:this.docLines});
                                                    }}
                                                    >
                                                        <Paging defaultPageSize={10} />
                                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                                        <Scrolling mode="standart" />
                                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                        <Column dataField="ITEM_NAME" caption={this.t("grdSale.clmItemName")} width={200} allowHeaderFiltering={false}/>
                                                        <Column dataField="QUANTITY" caption={this.t("grdSale.clmQuantity")} width={70} dataType={'number'} />
                                                        <Column dataField="PRICE" caption={this.t("grdSale.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                                        <Column dataField="AMOUNT" caption={this.t("grdSale.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT" caption={this.t("grdSale.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdSale.clmDiscountRate")} dataType={'number'}  format={'##0.00'} width={60} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                                        <Column dataField="VAT" caption={this.t("grdSale.clmVat")} format={'€#,##0.000'}allowEditing={false} width={75} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTALHT" caption={this.t("grdSale.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTAL" caption={this.t("grdSale.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                    </NdGrid>
                                                </Item>
                                                {/* DIP TOPLAM */}
                                                <Item>
                                                    <div className="row px-2 pt-2">
                                                        <div className="col-12">
                                                            <Form colCount={2} parent={this} id={"frmSale"}>
                                                                {/* Ara Toplam */}
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtAmount")} alignment="right" />
                                                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}/>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDocDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem colSpan={1}/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotalHt")} alignment="right" />
                                                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}/>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtVat")} alignment="right" />
                                                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:async ()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotal")} alignment="right" />
                                                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32}  dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}/>
                                                                </Item>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>
                        {/* CARI SECIMI POPUP */}
                        <div>                            
                            <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-10' align={"left"}>
                                            <h2 className='text-danger'>{this.t('popCustomer.title')}</h2>
                                        </div>
                                        <div className='col-2' align={"right"}>
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>                                    
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12'>
                                            <NdTextBox id="txtCustomerSearch" parent={this} simple={true} selectAll={true}
                                            onEnterKey={(async()=>
                                                {
                                                    this._customerSearch()
                                                }).bind(this)}/>
                                        </div>
                                    </div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={()=>
                                            {
                                                this._customerSearch()
                                            }}>
                                                {this.t('popCustomer.btn01')}
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={(async()=>
                                            {
                                                console.log(console.log(this))
                                                this.docObj.dt()[0].INPUT = this.grdCustomer.getSelectedData()[0].GUID
                                                this.docObj.dt()[0].INPUT_NAME =  this.grdCustomer.getSelectedData()[0].TITLE
                                                this.docObj.dt()[0].INPUT_CODE =  this.grdCustomer.getSelectedData()[0].CODE
                                                this.docObj.dt()[0].REF = this.grdCustomer.getSelectedData()[0].CODE
                                               
                                                this.popCustomer.hide();
                                            }).bind(this)}>
                                                {this.t('popCustomer.btn02')}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomer"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            headerFilter={{visible:true}}
                                            selection={{mode:"single"}}
                                            height={'400'}
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={10} />
                                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                <Scrolling mode="standart" />
                                                <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={200}/>
                                                <Column dataField="TITLE" caption={this.t("popCustomer.clmName")} width={400}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>
                    </ScrollView>
                </div>
            </div>
        )
    }
}
