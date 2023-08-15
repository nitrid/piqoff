import React from 'react';
import App from '../lib/app.js';
import { nf525Cls } from '../../core/cls/nf525.js';

import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdNumberBox  from '../../core/react/devex/numberbox.js'
import NdCheckBox   from '../../core/react/devex/checkbox.js'
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../core/react/devex/grid.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdPopUp  from '../../core/react/devex/popup.js';
import NdButton   from '../../core/react/devex/button.js';
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
        this.vatRate =  new datatable()
        this.nf525 = new nf525Cls();
        this.docType = 0
        this.tmpPageLimit = 21
        this.tmpStartPage = 0
        this.tmpEndPage = 0
        this.bufferId = ''
        this.state = 
        {
            isExecute : false
        }

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

        this.popCustomer.show()
        this.cmbGroup.value = ''
        this.docType = 0
    }
    async getItems()
    {
        this.setState({isExecute:true})
        this.tmpPageLimit = 21
        this.tmpStartPage = 0
        this.tmpEndPage = 0
        this.bufferId = ''
        this.itemView.items = []
        let tmpQuery = 
        {
            query :"SELECT  GUID,CODE,NAME,VAT,PRICE,IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR FROM ITEMS_VW_02 " +
            "WHERE STATUS = 1 AND " +
            " UPPER(NAME) LIKE UPPER(@VAL + '%') AND ((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = ''))",
            param : ['VAL:string|50','MAIN_GRP:string|50'],
            value : [this.txtSearch.value,this.cmbGroup.value],
            buffer : true
        }
        let tmpBuf = await this.core.sql.execute(tmpQuery) 
        if(typeof tmpBuf.result.err == 'undefined')
        {
            this.bufferId = tmpBuf.result.bufferId
            this.tmpEndPage = this.tmpStartPage + this.tmpPageLimit
            let tmpItems = await this.core.sql.buffer({start : this.tmpStartPage,end : this.tmpEndPage,bufferId : this.bufferId})  
            for (let i = 0; i < tmpItems.result.recordset.length; i++) 
            {
                this.itemView.items.push(tmpItems.result.recordset[i])
            }
            this.itemView.items = this.itemView.items
            this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
        }
        this.itemView.setItemAll()
        this.setState({isExecute:false})
    }
    async loadMore()
    {
        this.setState({isExecute:true})
        this.tmpEndPage = this.tmpStartPage + this.tmpPageLimit
        let tmpItems = await this.core.sql.buffer({start : this.tmpStartPage,end : this.tmpEndPage,bufferId : this.bufferId})  
        for (let i = 0; i < tmpItems.result.recordset.length; i++) 
        {
            this.itemView.items.push(tmpItems.result.recordset[i])
        }
        this.itemView.items = this.itemView.items
        this.tmpStartPage = this.tmpStartPage + this.tmpPageLimit
        this.itemView.setItemAll()
        this.setState({isExecute:false})
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
                    query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_02 WHERE (UPPER(CODE) LIKE UPPER(@VAL + '%') OR UPPER(TITLE) LIKE UPPER(@VAL + '%')) AND STATUS = 1",
                    param : ['VAL:string|50'],
                    value : [this.txtCustomerSearch.value]
                },
                sql : this.core.sql
            }
        }
        await this.grdCustomer.dataRefresh(tmpSource)
    }
    async _getOrders()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,DOC_ADDRESS,TOTAL FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0  AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE,REF_NO DESC ",
                },
                sql : this.core.sql
            }
        }
        await this.grdDocs.dataRefresh(tmpSource)
    }
    async _getInvoices()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 0 AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE,REF_NO DESC ",
                },
                sql : this.core.sql
            }
        }
        await this.grdDocs.dataRefresh(tmpSource)
    }
    addItem(e)
    {
        let tmpdocOrders
        if(this.docType == 60 || this.docType == 0)
        {
            tmpdocOrders = {...this.docObj.docOrders.empty}
        }
        else if(this.docType == 20)
        {
            tmpdocOrders = {...this.docObj.docItems.empty}
        }

        tmpdocOrders.GUID = datatable.uuidv4()
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
        tmpdocOrders.QUANTITY = e.QUANTITY * e.UNIT_FACTOR
        tmpdocOrders.UNIT = e.UNIT
        tmpdocOrders.UNIT_FACTOR = e.UNIT_FACTOR
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
        let tmpLine = this.docLines.where({'ITEM':e.GUID})
        if(tmpLine.length > 0)
        {
            if(e.QUANTITY > 0)
            {
                tmpLine[0].QUANTITY = e.QUANTITY * e.UNIT_FACTOR
                tmpLine[0].AMOUNT = parseFloat(((tmpLine[0].PRICE * (e.QUANTITY * e.UNIT_FACTOR)))).round(2)
                tmpLine[0].TOTALHT = parseFloat(((tmpLine[0].PRICE * (e.QUANTITY * e.UNIT_FACTOR)))).round(2)
                tmpLine[0].VAT = parseFloat(((tmpLine[0].TOTALHT ) * (e.VAT / 100)).toFixed(4))
                tmpLine[0].TOTAL = parseFloat(((tmpLine[0].TOTALHT) + tmpLine[0].VAT)).round(2)
                tmpLine[0].UNIT_FACTOR = e.UNIT_FACTOR
                tmpLine[0].UNIT = e.UNIT
            }
            else
            {
                this.docLines.removeAt(this.docLines.where({'ITEM':e.GUID})[0])
            }
            this._calculateTotal()
        }
        else
        {
            if(e.QUANTITY > 0)
            {
                this.addItem(e)
            }
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
        if(this.docObj.dt()[0].REF_NO == 0)
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
                tmpDocOrders.UNIT = this.docLines[i].UNIT
                tmpDocOrders.UNIT_FACTOR = this.docLines[i].UNIT_FACTOR
                this.docObj.docOrders.addEmpty(tmpDocOrders)
            }
        }
        else
        {
            this.docObj.docOrders.datatable = this.docLines
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
        if(this.docObj.dt()[0].REF_NO == 0)
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
                tmpDocItems.UNIT = this.docLines[i].UNIT
                tmpDocItems.UNIT_FACTOR = this.docLines[i].UNIT_FACTOR
                this.docObj.docItems.addEmpty(tmpDocItems)
            }
        }
        else
        {
            console.log(this.docLines)
            this.docObj.docItems.datatable = this.docLines
            this.docObj.docCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            this.docObj.docCustomer.TYPE = this.docObj.dt()[0].TYPE
            this.docObj.docCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            this.docObj.docCustomer.REBATE = this.docObj.dt()[0].REBATE
            this.docObj.docCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docCustomer.AMOUNT = this.docObj.dt()[0].TOTAL
            this.docObj.docCustomer.REF = this.docObj.dt()[0].REF
            this.docObj.docCustomer.REF_NO = this.docObj.dt()[0].REF_NO
            this.docObj.docCustomer.OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docCustomer.INPUT = this.docObj.dt()[0].INPUT
        }

        let tmpSignedData = await this.nf525.signatureDoc(this.docObj.dt()[0],this.docObj.docItems.dt())                
        this.docObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
        this.docObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM

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
    async getDoc(pGuid,pRef,pRefno,pDocType)
    {
        this.docObj.clearAll()
        this.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:pDocType});
        if(pDocType == 60)
        {
            this.docType = 60
            this.docLines = this.docObj.docOrders.dt()
        }
        else if(pDocType == 20)
        {
            this.docType = 20
            this.docLines = this.docObj.docItems.dt()
        }
        await this.grdSale.dataRefresh({source:this.docLines});
        this.setState({isExecute:false})
        this.itemView.setItemAll()
    }
    render()
    {
        return(
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
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
                            showClearButton={true}
                            onValueChanged={(async(e)=>
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
                                <NbItemView id="itemView" parent={this} dt={this.docLines} onValueChange={this.onValueChange} defaultUnit={this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'defaultUnit'}).getValue().value}/>
                            </div>
                        </div>
                        <div className='row'>                            
                            <div className='col-5 offset-5' style={{paddingBottom:"100px"}}>
                                <NbButton className="form-group btn btn-primary btn-block"
                                onClick={()=>
                                {
                                    this.loadMore()
                                }}>
                                    <i className="">{this.t("loadMore")}</i>
                                </NbButton>
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
                                                        if(this.docLines.length == 0)
                                                        {
                                                            let tmpConfObj = 
                                                            {
                                                                id:'msgLineNotFound',showTitle:true,title:this.t("msgLineNotFound.title"),showCloseButton:true,width:'400px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgLineNotFound.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLineNotFound.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            return
                                                        }
                                                        if(this.docObj.dt()[0].INPUT == "")
                                                        {
                                                            let tmpConfObj = 
                                                            {
                                                                id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            return
                                                        }
                                                        if(this.docObj.dt()[0].OUTPUT == "")
                                                        {
                                                            let tmpConfObj = 
                                                            {
                                                                id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                                                            }
                                                            await dialog(tmpConfObj);
                                                            return
                                                        }
                                                       
                                                        if(this.docType == 20)
                                                        {
                                                            this.orderSave()
                                                        }
                                                        else if(this.docType == 60)
                                                        {
                                                            this.factureSave()
                                                        }

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
                                                    onClick={()=>
                                                    {
                                                        this.popDocs.show()
                                                    }}>
                                                        <i className="fa-solid fa-folder-open"></i>
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
                                                                                    if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                                                    {
                                                                                        this.txtDiscountPercent1.value  = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_1",3),3)
                                                                                        this.txtDiscountPrice1.value = this.docObj.docItems.dt().sum("DISCOUNT_1",2)
                                                                                        this.txtDiscountPercent2.value  = Number(this.docObj.dt()[0].AMOUNT-parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_1",3))).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_2",3),3)
                                                                                        this.txtDiscountPrice2.value = this.docObj.docItems.dt().sum("DISCOUNT_2",2)
                                                                                        this.txtDiscountPercent3.value  = Number(this.docObj.dt()[0].AMOUNT-(parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_1",3))+parseFloat(this.docObj.docItems.dt().sum("DISCOUNT_2",3)))).rate2Num(this.docObj.docItems.dt().sum("DISCOUNT_3",3),3)
                                                                                        this.txtDiscountPrice3.value = this.docObj.docItems.dt().sum("DISCOUNT_3",2)
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        this.txtDiscountPercent1.value  = 0
                                                                                        this.txtDiscountPrice1.value = 0
                                                                                        this.txtDiscountPercent2.value  = 0
                                                                                        this.txtDiscountPrice2.value = 0
                                                                                        this.txtDiscountPercent3.value  = 0
                                                                                        this.txtDiscountPrice3.value = 0
                                                                                    }
                                                                                    this.popDiscount.show()
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
                                                                                    if(this.docObj.dt()[0].DOC_DISCOUNT > 0 )
                                                                                    {
                                                                                        this.txtDocDiscountPercent1.value  = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_1,5)
                                                                                        this.txtDocDiscountPrice1.value = this.docObj.dt()[0].DOC_DISCOUNT_1
                                                                                        this.txtDocDiscountPercent2.value  = Number(this.docObj.dt()[0].SUBTOTAL-parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_1)).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_2,5)
                                                                                        this.txtDocDiscountPrice2.value = this.docObj.dt()[0].DOC_DISCOUNT_2
                                                                                        this.txtDocDiscountPercent3.value  = Number(this.docObj.dt()[0].SUBTOTAL-(parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_1)+parseFloat(this.docObj.dt()[0].DOC_DISCOUNT_2))).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_3,5)
                                                                                        this.txtDocDiscountPrice3.value = this.docObj.dt()[0].DOC_DISCOUNT_3
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        this.txtDocDiscountPercent1.value  = 0
                                                                                        this.txtDocDiscountPrice1.value = 0
                                                                                        this.txtDocDiscountPercent2.value  = 0
                                                                                        this.txtDocDiscountPrice2.value = 0
                                                                                        this.txtDocDiscountPercent3.value  = 0
                                                                                        this.txtDocDiscountPrice3.value = 0
                                                                                    }
                                                                                    this.popDocDiscount.show()
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
                                                                                    this.vatRate.clear()
                                                                                    for (let i = 0; i < this.docLines.groupBy('VAT_RATE').length; i++) 
                                                                                    {
                                                                                        let tmpTotalHt  =  parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("TOTALHT",2))
                                                                                        let tmpVat = parseFloat(this.docLines.where({'VAT_RATE':this.docLines.groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                                                        let tmpData = {"RATE":this.docLines.groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat,"TOTALHT":tmpTotalHt}
                                                                                        this.vatRate.push(tmpData)
                                                                                    }
                                                                                    await this.grdVatRate.dataRefresh({source:this.vatRate})
                                                                                    this.popVatRate.show()
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
                            <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true} 
                                onHideing={(async()=>
                                {
                                    this.getItems()
                                }).bind(this)}>
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
                         {/* EVRAK SECIMI POPUP */}
                         <div>                            
                            <NbPopUp id={"popDocs"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-10' align={"left"}>
                                            <h2 className='text-danger'>{this.t('popDocs.title')}</h2>
                                        </div>
                                        <div className='col-2' align={"right"}>
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popDocs.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>   
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className="col-4" align="right" style={{paddingRight:'25px',paddingTop:'5px'}}>
                                            <NdSelectBox simple={true} parent={this} id="cmbDocType" notRefresh = {true}
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            value={60}
                                            searchEnabled={true}
                                            onValueChanged={(async()=>
                                                {
                                                }).bind(this)}
                                            data={{source:[{ID:60,VALUE:this.t("cmbDocType.order")},{ID:20,VALUE:this.t("cmbDocType.invoice")}]}}
                                            >
                                            </NdSelectBox>
                                        </div>           
                                    </div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={()=>
                                            {
                                                if(this.cmbDocType.value == 60)
                                                {
                                                    this._getOrders()
                                                }
                                                else
                                                {
                                                    this._getInvoices()
                                                }
                                            }}>
                                                {this.t('popDocs.btn01')}
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={(async()=>
                                            {
                                               this.getDoc(this.grdDocs.getSelectedData()[0].GUID,this.grdDocs.getSelectedData()[0].REF,this.grdDocs.getSelectedData()[0].REF_NO,this.cmbDocType.value)
                                            }).bind(this)}>
                                                {this.t('popDocs.btn02')}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdDocs"} 
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
                                                <Column dataField="REF" caption={this.t("grdDocs.clmRef")} width={150}/>
                                                <Column dataField="REF_NO" caption={this.t("grdDocs.clmRefNo")} width={100}/>
                                                <Column dataField="INPUT_NAME" caption={this.t("grdDocs.clmInputName")} width={250}/>
                                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("grdDocs.clmDate")} width={150}/>
                                                <Column dataField="TOTAL" caption={this.t("grdDocs.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} width={150}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div> 
                        {/* KDV PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popVatRate"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popVatRate.title")}
                            container={"#root"} 
                            width={'500'}
                            height={'250'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item >
                                        <NdGrid parent={this} id={"grdVatRate"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        height={'100%'} 
                                        width={'100%'}
                                        dbApply={false}
                                        onRowRemoved={async (e)=>{
                                        
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="RATE" caption={this.t("grdVatRate.clmRate")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                            <Column dataField="VAT" caption={this.t("grdVatRate.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                            <Column dataField="TOTALHT" caption={this.t("grdVatRate.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                        </NdGrid>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnVatToZero")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {       
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        for (let i = 0; i < this.docLines.length; i++) 
                                                        {
                                                            this.docLines[i].VAT = 0  
                                                            this.docLines[i].VAT_RATE = 0
                                                            this.docLines[i].TOTAL = (this.docLines[i].PRICE * this.docLines[i].QUANTITY) - (this.docLines[i].DISCOUNT + this.docLines[i].DOC_DISCOUNT)
                                                            this._calculateTotal()
                                                        }
                                                        this.popVatRate.hide()
                                                    }
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popVatRate.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>    
                        {/* İndirim PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popDiscount"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popDiscount.title")}
                            container={"#root"} 
                            width={'500'}
                            height={'500'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent1")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent1" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDiscountPercent1.value = 0;
                                                            this.txtDiscountPrice1.value = 0;
                                                            return
                                                        }

                                                        this.txtDiscountPrice1.value =  Number(this.docObj.dt()[0].AMOUNT).rateInc(this.txtDiscountPercent1.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price1")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice1" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice1.value > this.docObj.dt()[0].AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent1.value = 0;
                                                        this.txtDiscountPrice1.value = 0;
                                                        return
                                                    }
                                                    
                                                    this.txtDiscountPercent1.value = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.txtDiscountPrice1.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent2")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent2" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDiscountPercent2.value = 0;
                                                            this.txtDiscountPrice2.value = 0;
                                                            return
                                                        }
                                                        this.txtDiscountPrice2.value =  Number(this.docObj.dt()[0].AMOUNT - Number(this.txtDiscountPrice1.value)).rateInc(this.txtDiscountPercent2.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price2")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice2" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice2.value > this.docObj.dt()[0].AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent2.value = 0;
                                                        this.txtDiscountPrice2.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPercent2.value = Number(this.docObj.dt()[0].AMOUNT - Number(this.txtDiscountPrice1.value)).rate2Num(this.txtDiscountPrice2.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Percent3")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPercent3" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDiscountPercent3.value = 0;
                                                            this.txtDiscountPrice3.value = 0;
                                                            return
                                                        }
                                                        this.txtDiscountPrice3.value = Number(this.docObj.dt()[0].AMOUNT - (Number(this.txtDiscountPrice1.value) + Number(this.txtDiscountPrice2.value))).rateInc(this.txtDiscountPercent3.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.Price3")} alignment="right" />
                                        <NdNumberBox id="txtDiscountPrice3" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice3.value > this.docObj.dt()[0].AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent3.value = 0;
                                                        this.txtDiscountPrice3.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPercent3.value = Number(this.docObj.dt()[0].AMOUNT - (Number(this.txtDiscountPrice1.value) + Number(this.txtDiscountPrice2.value))).rate2Num(this.txtDiscountPrice3.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDiscount.chkFirstDiscount")} alignment="right" />
                                        <NdCheckBox id="chkFirstDiscount" parent={this} simple={true}  
                                        value ={false}
                                        >
                                        </NdCheckBox>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {           
                                                    
                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                    {
                                                        let tmpDocData = this.docObj.docItems.dt()[i]

                                                        if(this.chkFirstDiscount.value == false)
                                                        {
                                                            tmpDocData.DISCOUNT_1 = Number(tmpDocData.PRICE * tmpDocData.QUANTITY).rateInc(this.txtDiscountPercent1.value,4)
                                                        }
                                                        tmpDocData.DISCOUNT_2 = Number(((tmpDocData.PRICE * tmpDocData.QUANTITY) - tmpDocData.DISCOUNT_1)).rateInc(this.txtDiscountPercent2.value,4)

                                                        tmpDocData.DISCOUNT_3 =  Number(((tmpDocData.PRICE * tmpDocData.QUANTITY)-(tmpDocData.DISCOUNT_1+tmpDocData.DISCOUNT_2))).rateInc(this.txtDiscountPercent3.value,4)
                                                        
                                                        tmpDocData.DISCOUNT = parseFloat((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3)).round(2)
                                                        tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                        tmpDocData.TOTALHT = parseFloat((Number((tmpDocData.PRICE * tmpDocData.QUANTITY)) - parseFloat(Number(tmpDocData.DISCOUNT_1) + Number(tmpDocData.DISCOUNT_2) + Number(tmpDocData.DISCOUNT_3)).round(4))).round(2)
                                                        
                                                        if(tmpDocData.VAT > 0)
                                                        {
                                                            tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(4))
                                                        }
                                                        tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                        tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                    }
                                                    this._calculateTotal()
                                                    this.popDiscount.hide(); 
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popDiscount.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div> 
                         {/*Evrak İndirim PopUp */}
                        <div>
                            <NdPopUp parent={this} id={"popDocDiscount"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popDocDiscount.title")}
                            container={"#root"} 
                            width={'500'}
                            height={'500'}
                            position={{of:'#root'}}
                            >
                                <Form colCount={1} height={'fit-content'}>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent1")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent1" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDocDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDocDiscountPercent1.value = 0;
                                                            this.txtDocDiscountPrice1.value = 0;
                                                            return
                                                        }

                                                        this.txtDocDiscountPrice1.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent1.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price1")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice1" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDocDiscountPrice1.value > this.docObj.dt()[0].SUBTOTAL)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDocDiscountPercent1.value = 0;
                                                        this.txtDocDiscountPrice1.value = 0;
                                                        return
                                                    }
                                                    
                                                    this.txtDocDiscountPercent1.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice1.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent2")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent2" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDocDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDocDiscountPercent2.value = 0;
                                                            this.txtDocDiscountPrice2.value = 0;
                                                            return
                                                        }
                                                        this.txtDocDiscountPrice2.value =  Number(this.docObj.dt()[0].SUBTOTAL - Number(this.txtDocDiscountPrice1.value)).rateInc(this.txtDocDiscountPercent2.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price2")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice2" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDocDiscountPrice2.value > this.docObj.dt()[0].SUBTOTAL)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDocDiscountPercent2.value = 0;
                                                        this.txtDocDiscountPrice2.value = 0;
                                                        return
                                                    }
                                                    this.txtDocDiscountPercent2.value = Number(this.docObj.dt()[0].SUBTOTAL - Number(this.txtDocDiscountPrice1.value)).rate2Num(this.txtDocDiscountPrice2.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Percent3")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPercent3" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                    {
                                                        if( this.txtDocDiscountPercent1.value > 100)
                                                        {
                                                            let tmpConfObj =
                                                            {
                                                                id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                            }
                                                
                                                            await dialog(tmpConfObj);
                                                            this.txtDocDiscountPercent3.value = 0;
                                                            this.txtDocDiscountPrice3.value = 0;
                                                            return
                                                        }
                                                        this.txtDocDiscountPrice3.value = Number(this.docObj.dt()[0].SUBTOTAL - (Number(this.txtDocDiscountPrice1.value) + Number(this.txtDocDiscountPrice2.value))).rateInc(this.txtDocDiscountPercent3.value,2)
                                                }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("popDocDiscount.Price3")} alignment="right" />
                                        <NdNumberBox id="txtDocDiscountPrice3" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDocDiscountPrice3.value > this.docObj.dt()[0].SUBTOTAL)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDocDiscountPercent3.value = 0;
                                                        this.txtDocDiscountPrice3.value = 0;
                                                        return
                                                    }
                                                    this.txtDocDiscountPercent3.value = Number(this.docObj.dt()[0].SUBTOTAL - (Number(this.txtDocDiscountPrice1.value) + Number(this.txtDocDiscountPrice2.value))).rate2Num(this.txtDocDiscountPrice3.value)
                                            }).bind(this)}
                                        ></NdNumberBox>
                                    </Item>
                                    <Item>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                onClick={async ()=>
                                                {           
                                                    
                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                    {
                                                        let tmpDocData = this.docObj.docItems.dt()[i]
                                                        
                                                        tmpDocData.DOC_DISCOUNT_1 = Number(tmpDocData.TOTALHT).rateInc(this.txtDocDiscountPercent1.value,4)
                                                        tmpDocData.DOC_DISCOUNT_2 = Number(((tmpDocData.TOTALHT) - tmpDocData.DOC_DISCOUNT_1)).rateInc(this.txtDocDiscountPercent2.value,4)

                                                        tmpDocData.DOC_DISCOUNT_3 =  Number(((tmpDocData.TOTALHT)-(tmpDocData.DOC_DISCOUNT_1+tmpDocData.DOC_DISCOUNT_2))).rateInc(this.txtDocDiscountPercent3.value,4)
                                                        
                                                        tmpDocData.DOC_DISCOUNT = parseFloat((tmpDocData.DOC_DISCOUNT_1 + tmpDocData.DOC_DISCOUNT_2 + tmpDocData.DOC_DISCOUNT_3).toFixed(4))
                                                        tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                        
                                                        if(tmpDocData.VAT > 0)
                                                        {
                                                            tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(4))
                                                        }
                                                        tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                        tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                    }
                                                    this._calculateTotal()
                                                    this.popDocDiscount.hide(); 
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                onClick={()=>
                                                {
                                                    this.popDocDiscount.hide();  
                                                }}/>
                                            </div>
                                        </div>
                                    </Item>
                                </Form>
                            </NdPopUp>
                        </div>    
                    </ScrollView>
                </div>
            </div>
        )
    }
}
