
import moment from 'moment';
import React from 'react';
import App from '../lib/app.js';
import { docCls,docItemsCls,docCustomerCls,docExtraCls,deptCreditMatchingCls} from '../../core/cls/doc.js';
import { discountCls } from '../../core/cls/discount.js'
import { nf525Cls } from '../../core/cls/nf525.js';
import { datatable } from '../../core/core.js';

import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdNumberBox from '../../core/react/devex/numberbox.js';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdCheckBox from '../../core/react/devex/checkbox.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdDialog, { dialog } from '../../core/react/devex/dialog.js';
import NdButton from '../../core/react/devex/button.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring,GroupPanel, Summary, TotalItem,GroupItem} from '../../core/react/devex/grid.js';
import NbPopDescboard from "./popdescboard.js";
import NdDatePicker from '../../core/react/devex/datepicker.js';
import NdTagBox from '../../core/react/devex/tagbox.js';
import * as xlsx from 'xlsx'

export default class DocBase extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.nf525 = new nf525Cls();
        this.discObj = new discountCls();
        this.tabIndex = props.data.tabkey
        this.type = 0;
        this.docType = 0;
        this.rebate = 0;
        this.quantityControl = false

        this.calculateTotal = this.calculateTotal.bind(this)
        this.getDispatch = this.getDispatch.bind(this)
        this.calculateTotalMargin = this.calculateTotalMargin.bind(this)
        this.calculateMargin = this.calculateMargin.bind(this)
        
        this.multiItemData = new datatable()
        this.unitDetailData = new datatable()
        this.newPrice = new datatable()
        this.newPriceDate = new datatable()
        this.newVat = new datatable()
        this.updatePriceData = new datatable()
        this.vatRate =  new datatable()
    }
    get docDetailObj()
    {
        if((this.docType >= 20 && this.docType <= 59) || (this.docType >= 120 && this.docType <= 129))
        {
            return this.docObj.docItems
        }
        else if(this.docType == 60 || this.docType == 62)
        {
            return this.docObj.docOrders
        }
        else if(this.docType == 61)
        {
            return this.docObj.docOffers
        }
        else if(this.docType == 63)
        {
            return this.docObj.docDemand
        }
    }
    set docDetailObj(pVal)
    {
        if((this.docType >= 20 && this.docType <= 59) || (this.docType >= 120 && this.docType <= 129))
        {
            this.docObj.docItems = pVal
        }
        else if(this.docType == 60 && this.docType == 62)
        {
            this.docObj.docOrders = pVal
        }
        else if(this.docType == 61)
        {
            this.docObj.docOffers = pVal
        }
        else if(this.docType == 63)
        {
            return this.docObj.docDemand
        }
    }      
    init()
    {
        return new Promise(async resolve =>
        {
            this.docObj.clearAll()
            this.extraObj.clearAll()
            this.newPrice.clear()
            this.newPriceDate.clear()
            this.newVat.clear()
            this.multiItemData.clear()
            this.popMultiItem.tmpTagItemCode = undefined
    
            this.docObj.ds.on('onAddRow',(pTblName,pData) =>
            {
                if(pData.stat == 'new')
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:false});
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:true});
                    this.btnSave.setState({disabled:false});
                    this.btnPrint.setState({disabled:false});
                    if(typeof this.btnDelete != 'undefined')
                    {
                        this.btnDelete.setState({disabled:false});
                    }
                }
            })
            this.docObj.ds.on('onEdit',(pTblName,pData) =>
            {            
                if(pData.rowData.stat == 'edit')
                {
                    this.btnBack.setState({disabled:false});
                    this.btnNew.setState({disabled:true});
                    this.btnSave.setState({disabled:false});
                    this.btnPrint.setState({disabled:false});
                    if(typeof this.btnDelete != 'undefined')
                    {
                        this.btnDelete.setState({disabled:false});
                    }
                    pData.rowData.CUSER = this.user.CODE
                }                 
            })
            this.docObj.ds.on('onRefresh',(pTblName) =>
            {            
                this.btnBack.setState({disabled:true});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:true});
                this.btnPrint.setState({disabled:false});  
                if(typeof this.btnDelete != 'undefined')
                {
                    this.btnDelete.setState({disabled:false});
                }
                this.calculateMargin()
                this.calculateTotalMargin()        
            })
            this.docObj.ds.on('onDelete',(pTblName) =>
            {            
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
                if(typeof this.btnDelete != 'undefined')
                {
                    this.btnDelete.setState({disabled:false});
                }
            })

            let tmpDoc = {...this.docObj.empty}
            tmpDoc.TYPE = this.type
            tmpDoc.DOC_TYPE = this.docType
            tmpDoc.REBATE = this.rebate
            tmpDoc.TRANSPORT_TYPE = this.sysParam.filter({ID:'DocTrasportType',USERS:this.user.CODE}).getValue()

            this.docObj.addEmpty(tmpDoc);       
            
            this.msgNewPrice.onShowed = async ()=>
            {
                await this.grdNewPrice.dataRefresh({source:this.newPrice})
            }
            this.msgNewPriceDate.onShowed = async ()=>
            {
                await this.grdNewPriceDate.dataRefresh({source:this.newPriceDate})
            }
            this.msgNewVat.onShowed = async ()=>
            {
                await this.grdNewVat.dataRefresh({source:this.newVat})
            }
            this.msgQuantity.onShowed = async ()=>
            {
                this.txtPopQteUnitQuantity.value = 1
                this.txtPopQuantity.value = 1
                this.txtPopQuantity.focus()
                
                let tmpUnitDt = new datatable()
                tmpUnitDt.selectCmd = 
                {
                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                    param: ['ITEM:string|50'],
                    value: [this.msgQuantity.tmpData.GUID]
                }
                await tmpUnitDt.refresh()
                
                if(tmpUnitDt.length > 0)
                {   
                    this.cmbPopQteUnit.setData(tmpUnitDt)
                    let tmpDefaultUnit = tmpUnitDt.where({TYPE:{'<>' : 0}}).where({NAME:this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value})
                    if(tmpDefaultUnit.length > 0)
                    {
                        this.cmbPopQteUnit.value = tmpDefaultUnit[0].GUID
                        this.txtPopQteUnitFactor.value = tmpDefaultUnit[0].FACTOR
                    }
                    else
                    {
                        this.cmbPopQteUnit.value = this.msgQuantity.tmpData.UNIT
                        this.txtPopQteUnitFactor.value = 1
                    }
                    // FIYAT GETIRME İŞLEMİ ****************************************************************************************/
                    let tmpCustomer = '00000000-0000-0000-0000-000000000000'
                    let tmpDepot = typeof this.cmbDepot != 'undefined' ? this.cmbDepot.value : '00000000-0000-0000-0000-000000000000'
                    let tmpListNo = typeof this.cmbPricingList != 'undefined' ? this.cmbPricingList.value : 1

                    if(this.type == 0)
                    {
                        tmpCustomer = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].OUTPUT : '00000000-0000-0000-0000-000000000000'
                    }
                    else
                    {
                        tmpCustomer = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].INPUT : '00000000-0000-0000-0000-000000000000'
                    }
                    let priceType = 0
                    if(this.docObj.dt()[0].REBATE == 0)
                    {
                        priceType = this.type == 0 ? 1 : 0
                    }
                    else
                    {
                        priceType = this.type == 0 ? 0 : 1
                    }
                    let tmpPrice = await this.getPrice(this.msgQuantity.tmpData.GUID,this.txtPopQteUnitFactor.value,tmpCustomer,tmpDepot,tmpListNo,priceType,0)
                    if(this.docObj.dt()[0].DOC_TYPE == 42 || this.docObj.dt()[0].DOC_TYPE == 22)
                    {
                        tmpPrice = this.msgQuantity.tmpData.COST_PRICE
                    }
                    this.txtPopQteUnitPrice.value = Number(tmpPrice).round(3)
                    // *************************************************************************************************************/
                    // DEPO MIKTARLARI GETIRME *************************************************************************************/
                    let tmpDepotQty = await this.getDepotQty(this.msgQuantity.tmpData.GUID,tmpDepot)
                    if(typeof tmpDepotQty != 'undefined')
                    {
                        this.txtPopQteDepotQty.value = tmpDepotQty.DEPOT_QTY
                        this.txtPopQteReservQty.value = tmpDepotQty.RESERV_OUTPUT_QTY
                        this.txtPopQteInputQty.value = tmpDepotQty.RESERV_INPUT_QTY
                    }
                }
            }
            this.msgUnit.onShowed = async ()=>
            {
                let tmpUnitDt = new datatable()
                tmpUnitDt.selectCmd = 
                {
                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                    param:  ['ITEM:string|50'],
                    value:  [this.msgUnit.tmpData.ITEM]
                }
                await tmpUnitDt.refresh()

                if(tmpUnitDt.length > 0)
                {   
                    this.cmbUnit.setData(tmpUnitDt)
                    
                    let tmpDefaultUnit = tmpUnitDt.where({TYPE:{'<>' : 0}}).where({NAME:this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value})
                    if(tmpDefaultUnit.length > 0)
                    {
                        this.cmbUnit.value = tmpDefaultUnit[0].GUID
                        this.txtUnitFactor.value = tmpDefaultUnit[0].FACTOR
                    }
                    else
                    {
                        this.cmbUnit.value = this.msgUnit.tmpData.UNIT
                        this.txtUnitFactor.value = this.msgUnit.tmpData.UNIT_FACTOR
                    }
                    this.txtTotalQuantity.value =  this.msgUnit.tmpData.QUANTITY
                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                    {
                        this.txtUnitQuantity.value = this.msgUnit.tmpData.QUANTITY * this.txtUnitFactor.value                        
                        this.txtUnitPrice.value = Number(this.msgUnit.tmpData.PRICE).round(2)
                    }
                    else
                    {
                        this.txtUnitQuantity.value = this.msgUnit.tmpData.QUANTITY / this.txtUnitFactor.value
                        this.txtUnitPrice.value = Number(this.msgUnit.tmpData.PRICE * this.txtUnitFactor.value).round(2)
                    }
                }
            }
            resolve()
        })
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            this.docObj.clearAll()
            await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:this.type,DOC_TYPE:this.docType,SUB_FACTOR:this.sysParam.filter({ID:'secondFactor',USERS:this.user.CODE}).getValue().value});

            if(this.docObj.dt().length == 0)
            {
                resolve()
                return
            }
            if(this.docObj.dt()[0].LOCKED != 0)
            {
                this.docLocked = true
                let tmpConfObj =
                {
                    id:'msgGetLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
            else
            {
                this.docLocked = false
                this.frmDocItems.option('disabled',false)
            }
            resolve()
        })
    }
    async getDocs(pType)
    {
        let tmpQuery = {}
        if(pType == 0)
        {
            if(this.type == 0)
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = " + this.type + " AND DOC_TYPE = " + this.docType + " AND REBATE = " + this.rebate + " AND DOC_DATE > GETDATE() - 30 ORDER BY DOC_DATE DESC,REF_NO DESC"
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = " + this.type + " AND DOC_TYPE = " + this.docType + " AND REBATE = " + this.rebate + " AND DOC_DATE > GETDATE() - 30 ORDER BY DOC_DATE DESC,REF_NO DESC"
                }
            }
        }
        else
        {
            if(this.type == 0)
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = " + this.type + " AND DOC_TYPE = " + this.docType + " AND REBATE = " + this.rebate + " ORDER BY DOC_DATE DESC,REF_NO DESC"
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = " + this.type + " AND DOC_TYPE = " + this.docType + " AND REBATE = " + this.rebate + " ORDER BY DOC_DATE DESC,REF_NO DESC"
                }
            }
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        
        this.pg_Docs.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
            }
        }
        await this.pg_Docs.show()
        await this.pg_Docs.setData(tmpRows)
    }
    async getPrice(pItem,pQty,pCustomer,pDepot,pListNo,pType,pAddVat)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query :"SELECT dbo.FN_PRICE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,@DEPOT,@PRICE_LIST_NO,@TYPE,@ADD_VAT) AS PRICE",
                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','PRICE_LIST_NO:int','TYPE:int','ADD_VAT:bit'],
                value : [pItem,pQty,pCustomer,pDepot,pListNo,pType,pAddVat]
            }
            
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0].PRICE)
                return
            }

            resolve()
        })
    }
    async getDepotQty(pItem,pDepot)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT " +
                        "dbo.FN_DEPOT_QUANTITY(@ITEM,@DEPOT,GETDATE()) AS DEPOT_QTY, " +
                        "dbo.FN_ORDER_PEND_QTY(@ITEM,1,@DEPOT) AS RESERV_OUTPUT_QTY, " +
                        "dbo.FN_ORDER_PEND_QTY(@ITEM,0,@DEPOT) AS RESERV_INPUT_QTY",
                param : ['ITEM:string|50','DEPOT:string|50'],
                value : [pItem,pDepot]
            }
            
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset[0])
                return
            }

            resolve()
        })
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:this.type,DOC_TYPE:this.docType});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getDoc(pGuid,pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async checkRow()
    {
        for (let i = 0; i < this.docDetailObj.dt().length; i++) 
        {
            this.docDetailObj.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docDetailObj.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docDetailObj.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docDetailObj.dt()[i].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.docDetailObj.dt()[i].REF = this.docObj.dt()[0].REF
            this.docDetailObj.dt()[i].REF_NO = this.docObj.dt()[0].REF_NO
        }

        if(this.docType >= 20 && this.docType <= 39)
        {
            this.docObj.docCustomer.dt()[0].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docCustomer.dt()[0].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docCustomer.dt()[0].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docCustomer.dt()[0].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.docObj.docCustomer.dt()[0].REF = this.docObj.dt()[0].REF
            this.docObj.docCustomer.dt()[0].REF_NO = this.docObj.dt()[0].REF_NO
        }
        // MÜŞTERİ INDIRIM İ GETİRMEK İÇİN....
        await this.discObj.loadDocDisc({
            DEPOT:this.type == 0 ? this.docObj.dt()[0].INPUT : this.docObj.dt()[0].OUTPUT, 
            START_DATE : moment(this.docObj.dt()[0].DOC_DATE).format("YYYY-MM-DD"), 
            FINISH_DATE : moment(this.docObj.dt()[0].DOC_DATE).format("YYYY-MM-DD"),
        })
    }
    async calculateTotal()
    {
        let tmpVat = 0
        for (let i = 0; i < this.docDetailObj.dt().groupBy('VAT_RATE').length; i++) 
        {
            if(this.docObj.dt()[0].VAT_ZERO != 1)
            {
                tmpVat = tmpVat + parseFloat(this.docDetailObj.dt().where({'VAT_RATE':this.docDetailObj.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
            }
        }
        this.docObj.dt()[0].AMOUNT = this.docDetailObj.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = Number(parseFloat(this.docDetailObj.dt().sum("AMOUNT",2)) - parseFloat(this.docDetailObj.dt().sum("TOTALHT",2))).round(2)
        this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docDetailObj.dt().sum("DOC_DISCOUNT_1",4)
        this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docDetailObj.dt().sum("DOC_DISCOUNT_2",4)
        this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docDetailObj.dt().sum("DOC_DISCOUNT_3",4)
        this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docDetailObj.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docDetailObj.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docDetailObj.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docDetailObj.dt().sum("TOTALHT",2))
        this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docDetailObj.dt().sum("TOTALHT",2)) - parseFloat(this.docDetailObj.dt().sum("DOC_DISCOUNT",2))).round(2)
        this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
    }
    async calculateTotalMargin()
    {
        let tmpTotalCost = 0

        for (let  i= 0; i < this.docDetailObj.dt().length; i++) 
        {
            tmpTotalCost += this.docDetailObj.dt()[i].COST_PRICE * this.docDetailObj.dt()[i].QUANTITY
        }
        let tmpMargin = ((this.docObj.dt()[0].TOTALHT ) - tmpTotalCost)
        let tmpMarginRate = Number(tmpTotalCost).rate2Num(tmpMargin,2)
        this.docObj.dt()[0].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
    }
    async calculateMargin()
    {
        for(let  i= 0; i < this.docDetailObj.dt().length; i++)
        {
            let tmpMargin = Number(this.docDetailObj.dt()[i].TOTAL - this.docDetailObj.dt()[i].VAT).round(4) - Number(this.docDetailObj.dt()[i].COST_PRICE * this.docDetailObj.dt()[i].QUANTITY).round(4)
            let tmpMarginRate = Number((this.docDetailObj.dt()[i].COST_PRICE * this.docDetailObj.dt()[i].QUANTITY)).rate2Num(tmpMargin,2)
            this.docDetailObj.dt()[i].MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
        }
    }
    itemRelated(pGuid,pQuantity)
    {
        return new Promise(async resolve =>
        {
            let tmpRelatedQuery = 
            {
                query :"SELECT ITEM_GUID,ITEM_CODE,ITEM_NAME,ITEM_QUANTITY,RELATED_GUID,RELATED_CODE,RELATED_NAME,RELATED_QUANTITY FROM ITEM_RELATED_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
                param : ['ITEM_GUID:string|50'],
                value : [pGuid]
            }
    
            let tmpRelatedData = await this.core.sql.execute(tmpRelatedQuery)            
            
            for (let i = 0; i < tmpRelatedData.result.recordset.length; i++) 
            {
                let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY
                
                if(tmpRelatedQt > 0)
                {
                    let tmpRelatedItemQuery = 
                    {   
                        query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        value : [tmpRelatedData.result.recordset[i].RELATED_GUID]
                    }
    
                    let tmpRelatedItemData = await this.core.sql.execute(tmpRelatedItemQuery)
                    
                    if(tmpRelatedItemData.result.recordset.length > 0)
                    {
                        await this.core.util.waitUntil(100)
                        await this.addItem(tmpRelatedItemData.result.recordset[0],null,tmpRelatedQt)
                    }
                }
            }
            resolve()
        })
    }
    itemRelatedUpdate(pGuid,pQuantity)
    {
        return new Promise(async resolve =>
        {
            await this.core.util.waitUntil()
            let tmpRelatedQuery = 
            {
                query :"SELECT ITEM_GUID,ITEM_CODE,ITEM_NAME,ITEM_QUANTITY,RELATED_GUID,RELATED_CODE,RELATED_NAME,RELATED_QUANTITY FROM ITEM_RELATED_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
                param : ['ITEM_GUID:string|50'],
                value : [pGuid]
            }
            
            let tmpRelatedData = await this.core.sql.execute(tmpRelatedQuery)                        
            
            for (let i = 0; i < tmpRelatedData.result.recordset.length; i++) 
            {
                let tmpExist = false
                for (let x = 0; x < this.docDetailObj.dt().length; x++) 
                {
                    if(this.docDetailObj.dt()[x].ITEM_CODE == tmpRelatedData.result.recordset[i].RELATED_CODE)
                    {                
                        let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY
                        
                        if(tmpRelatedQt > 0)
                        {
                            if(this.docObj.dt()[0].VAT_ZERO != 1)
                            {
                                this.docDetailObj.dt()[x].VAT = parseFloat((this.docDetailObj.dt()[x].VAT + (this.docDetailObj.dt()[x].PRICE * (this.docDetailObj.dt()[x].VAT_RATE / 100) * pQuantity)).toFixed(6))
                            }
                            else
                            {
                                this.docDetailObj.dt()[x].VAT = 0
                            }
                            this.docDetailObj.dt()[x].QUANTITY = tmpRelatedQt
                            
                            this.docDetailObj.dt()[x].AMOUNT = parseFloat((this.docDetailObj.dt()[x].QUANTITY * this.docDetailObj.dt()[x].PRICE)).round(2)
                            this.docDetailObj.dt()[x].TOTAL = parseFloat((((this.docDetailObj.dt()[x].QUANTITY * this.docDetailObj.dt()[x].PRICE) - this.docDetailObj.dt()[x].DISCOUNT) + this.docDetailObj.dt()[x].VAT)).round(2)
                            this.docDetailObj.dt()[x].TOTALHT =  parseFloat((this.docDetailObj.dt()[x].AMOUNT - this.docDetailObj.dt()[x].DISCOUNT)).round(2)
                        }
                        tmpExist = true
                    }
                }
                if(!tmpExist)
                {
                    await this.itemRelated(pGuid,pQuantity)
                }
            }
            resolve()
        })
    }
    async getDispatch()
    {
        await this.pg_dispatchGrid.show()

        let tmpQuery = arguments[0]
        
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_dispatchGrid.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_dispatchGrid.setData([])
        }

        this.pg_dispatchGrid.onClick = async(data) =>
        {
            App.instance.setState({isExecute:true})
            for (let i = 0; i < data.length; i++) 
            {
                let tmpDocItems = {...this.docDetailObj.empty}
                tmpDocItems.GUID = data[i].GUID
                tmpDocItems.DOC_GUID = data[i].DOC_GUID
                tmpDocItems.TYPE = data[i].TYPE
                tmpDocItems.DOC_TYPE = data[i].DOC_TYPE
                tmpDocItems.REBATE = data[i].REBATE
                tmpDocItems.LINE_NO = data[i].LINE_NO
                tmpDocItems.REF = data[i].REF
                tmpDocItems.REF_NO = data[i].REF_NO
                tmpDocItems.DOC_DATE = data[i].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = data[i].SHIPMENT_DATE
                tmpDocItems.INPUT = data[i].INPUT
                tmpDocItems.INPUT_CODE = data[i].INPUT_CODE
                tmpDocItems.INPUT_NAME = data[i].INPUT_NAME
                tmpDocItems.OUTPUT = data[i].OUTPUT
                tmpDocItems.OUTPUT_CODE = data[i].OUTPUT_CODE
                tmpDocItems.OUTPUT_NAME = data[i].OUTPUT_NAME
                tmpDocItems.ITEM = data[i].ITEM
                tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                tmpDocItems.PRICE = data[i].PRICE
                tmpDocItems.QUANTITY = data[i].QUANTITY
                tmpDocItems.VAT = data[i].VAT
                tmpDocItems.AMOUNT = data[i].AMOUNT
                tmpDocItems.TOTAL = data[i].TOTAL
                tmpDocItems.TOTALHT = data[i].TOTALHT
                tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                tmpDocItems.INVOICE_DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.INVOICE_LINE_GUID = data[i].GUID
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.CONNECT_REF = data[i].CONNECT_REF
                tmpDocItems.ORDER_LINE_GUID = data[i].ORDER_LINE_GUID
                tmpDocItems.ORDER_DOC_GUID = data[i].ORDER_DOC_GUID
                tmpDocItems.OLD_VAT = data[i].VAT_RATE
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DEPOT_QUANTITY = data[i].DEPOT_QUANTITY
                tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE
                tmpDocItems.SUB_FACTOR = data[i].SUB_FACTOR
                tmpDocItems.SUB_PRICE = data[i].SUB_PRICE
                tmpDocItems.SUB_QUANTITY = data[i].SUB_QUANTITY
                tmpDocItems.SUB_SYMBOL = data[i].SUB_SYMBOL
                tmpDocItems.UNIT_SHORT = data[i].UNIT_SHORT
                tmpDocItems.DOC_DISCOUNT_1 = data[i].DOC_DISCOUNT_1
                tmpDocItems.DOC_DISCOUNT_2 = data[i].DOC_DISCOUNT_2
                tmpDocItems.DOC_DISCOUNT_3 = data[i].DOC_DISCOUNT_3
                tmpDocItems.DOC_DISCOUNT = data[i].DOC_DISCOUNT
                tmpDocItems.DISCOUNT_1 = data[i].DISCOUNT_1
                tmpDocItems.DISCOUNT_2 = data[i].DISCOUNT_2
                tmpDocItems.DISCOUNT_3 = data[i].DISCOUNT_3
                tmpDocItems.DISCOUNT = data[i].DISCOUNT
                tmpDocItems.UNIT = data[i].UNIT
                tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE
                tmpDocItems.DIFF_PRICE = data[i].DIFF_PRICE
                tmpDocItems.COST_PRICE = data[i].COST_PRICE

                await this.docDetailObj.addEmpty(tmpDocItems,false)
                await this.core.util.waitUntil(100)
                this.docDetailObj.dt()[this.docDetailObj.dt().length - 1].stat = 'edit'
            }
            
            this.docDetailObj.dt().emit('onRefresh')
            this.calculateTotal()
            App.instance.setState({isExecute:false})
            setTimeout(() => 
            {
                this.btnSave.setState({disabled:false});
            }, 500);
        }
    }
    async getOrders() 
    {
        await this.pg_ordersGrid.show()
        
        let tmpQuery = arguments[0]

        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_ordersGrid.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_ordersGrid.setData([])
        }

        this.pg_ordersGrid.onClick = async(data) =>
        {
            App.instance.setState({isExecute:true})
            for (let i = 0; i < data.length; i++) 
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocItems.LINE_NO = data[i].LINE_NO
                tmpDocItems.REF = this.docObj.dt()[0].REF
                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                tmpDocItems.INPUT_CODE = this.docObj.dt()[0].INPUT_CODE
                tmpDocItems.INPUT_NAME = this.docObj.dt()[0].INPUT_NAME
                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocItems.OUTPUT_CODE = this.docObj.dt()[0].OUTPUT_CODE
                tmpDocItems.OUTPUT_NAME = this.docObj.dt()[0].OUTPUT_NAME
                tmpDocItems.ITEM = data[i].ITEM
                tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                tmpDocItems.PRICE = data[i].PRICE
                tmpDocItems.QUANTITY = data[i].PEND_QUANTITY
                tmpDocItems.VAT = data[i].VAT
                tmpDocItems.AMOUNT = data[i].AMOUNT
                tmpDocItems.TOTAL = data[i].TOTAL
                tmpDocItems.TOTALHT = data[i].TOTALHT
                tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.ORDER_LINE_GUID = data[i].GUID
                tmpDocItems.ORDER_DOC_GUID = data[i].DOC_GUID
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.OLD_VAT = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.DISCOUNT_1 = data[i].DISCOUNT_1
                tmpDocItems.DISCOUNT_2 = data[i].DISCOUNT_2
                tmpDocItems.DISCOUNT_3 = data[i].DISCOUNT_3
                tmpDocItems.DISCOUNT = data[i].DISCOUNT
                tmpDocItems.DOC_DISCOUNT_1 = data[i].DOC_DISCOUNT_1
                tmpDocItems.DOC_DISCOUNT_2 = data[i].DOC_DISCOUNT_2
                tmpDocItems.DOC_DISCOUNT_3 = data[i].DOC_DISCOUNT_3
                tmpDocItems.DOC_DISCOUNT = data[i].DOC_DISCOUNT
                tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE
                tmpDocItems.DIFF_PRICE = (data[i].PRICE - data[i].CUSTOMER_PRICE).toFixed(3)
                tmpDocItems.COST_PRICE = data[i].COST_PRICE
            
                await this.docObj.docItems.addEmpty(tmpDocItems)
                await this.core.util.waitUntil(100)
            }
            this.calculateTotal()
            App.instance.setState({isExecute:false})
        }
    }
    async getOffers()
    {
        await this.pg_offersGrid.show()
        
        let tmpQuery = arguments[0]

        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_offersGrid.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_offersGrid.setData([])
        }

        this.pg_offersGrid.onClick = async(data) =>
        {
            App.instance.setState({isExecute:true})
            for (let i = 0; i < data.length; i++) 
            {
                if(this.docType == 60)
                {
                    let tmpDocItems = {...this.docObj.docOrders.empty}
                    tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocItems.LINE_NO = data[i].LINE_NO
                    tmpDocItems.REF = this.docObj.dt()[0].REF
                    tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                    tmpDocItems.INPUT_CODE = this.docObj.dt()[0].INPUT_CODE
                    tmpDocItems.INPUT_NAME = this.docObj.dt()[0].INPUT_NAME
                    tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocItems.OUTPUT_CODE = this.docObj.dt()[0].OUTPUT_CODE
                    tmpDocItems.OUTPUT_NAME = this.docObj.dt()[0].OUTPUT_NAME
                    tmpDocItems.ITEM = data[i].ITEM
                    tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                    tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                    tmpDocItems.PRICE = data[i].PRICE
                    tmpDocItems.QUANTITY = data[i].QUANTITY
                    tmpDocItems.VAT = data[i].VAT
                    tmpDocItems.AMOUNT = data[i].AMOUNT
                    tmpDocItems.TOTAL = data[i].TOTAL
                    tmpDocItems.TOTALHT = data[i].TOTALHT
                    tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.DISCOUNT_1 = data[i].DISCOUNT_1
                    tmpDocItems.DISCOUNT_2 = data[i].DISCOUNT_2
                    tmpDocItems.DISCOUNT_3 = data[i].DISCOUNT_3
                    tmpDocItems.DISCOUNT = data[i].DISCOUNT
                    tmpDocItems.DOC_DISCOUNT_1 = data[i].DOC_DISCOUNT_1
                    tmpDocItems.DOC_DISCOUNT_2 = data[i].DOC_DISCOUNT_2
                    tmpDocItems.DOC_DISCOUNT_3 = data[i].DOC_DISCOUNT_3
                    tmpDocItems.DOC_DISCOUNT = data[i].DOC_DISCOUNT
                    tmpDocItems.OFFER_LINE_GUID = data[i].GUID
                    tmpDocItems.OFFER_DOC_GUID = data[i].DOC_GUID
                    await this.docObj.docOrders.addEmpty(tmpDocItems)
                    await this.core.util.waitUntil(100)
                }
                else
                {
                    let tmpDocItems = {...this.docObj.docItems.empty}
                    tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                    tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                    tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                    tmpDocItems.LINE_NO = data[i].LINE_NO
                    tmpDocItems.REF = this.docObj.dt()[0].REF
                    tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                    tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                    tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                    tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                    tmpDocItems.INPUT_CODE = this.docObj.dt()[0].INPUT_CODE
                    tmpDocItems.INPUT_NAME = this.docObj.dt()[0].INPUT_NAME
                    tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                    tmpDocItems.OUTPUT_CODE = this.docObj.dt()[0].OUTPUT_CODE
                    tmpDocItems.OUTPUT_NAME = this.docObj.dt()[0].OUTPUT_NAME
                    tmpDocItems.ITEM = data[i].ITEM
                    tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                    tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                    tmpDocItems.PRICE = data[i].PRICE
                    tmpDocItems.QUANTITY = data[i].QUANTITY
                    tmpDocItems.VAT = data[i].VAT
                    tmpDocItems.AMOUNT = data[i].AMOUNT
                    tmpDocItems.TOTAL = data[i].TOTAL
                    tmpDocItems.TOTALHT = data[i].TOTALHT
                    tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.DISCOUNT_1 = data[i].DISCOUNT_1
                    tmpDocItems.DISCOUNT_2 = data[i].DISCOUNT_2
                    tmpDocItems.DISCOUNT_3 = data[i].DISCOUNT_3
                    tmpDocItems.DISCOUNT = data[i].DISCOUNT
                    tmpDocItems.DOC_DISCOUNT_1 = data[i].DOC_DISCOUNT_1
                    tmpDocItems.DOC_DISCOUNT_2 = data[i].DOC_DISCOUNT_2
                    tmpDocItems.DOC_DISCOUNT_3 = data[i].DOC_DISCOUNT_3
                    tmpDocItems.DOC_DISCOUNT = data[i].DOC_DISCOUNT
                    tmpDocItems.OFFER_LINE_GUID = data[i].GUID
                    tmpDocItems.OFFER_DOC_GUID = data[i].DOC_GUID
                    tmpDocItems.OLD_VAT = data[i].VAT_RATE
                    await this.docObj.docItems.addEmpty(tmpDocItems)
                    await this.core.util.waitUntil(100)
                }

                
            }
            this.calculateTotal()
            App.instance.setState({isExecute:false})
        }
    }
    async getProforma()
    {
        await this.pg_proformaGrid.show()
        
        let tmpQuery = arguments[0]

        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_proformaGrid.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_proformaGrid.setData([])
        }

        this.pg_proformaGrid.onClick = async(data) =>
        {
            App.instance.setState({isExecute:true})
            for (let i = 0; i < data.length; i++) 
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.TYPE = data[i].TYPE
                tmpDocItems.DOC_TYPE = 20
                tmpDocItems.REBATE = data[i].REBATE
                tmpDocItems.LINE_NO = data[i].LINE_NO
                tmpDocItems.REF = data[i].REF
                tmpDocItems.REF_NO = data[i].REF_NO
                tmpDocItems.DOC_DATE = data[i].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = data[i].SHIPMENT_DATE
                tmpDocItems.INPUT = data[i].INPUT
                tmpDocItems.INPUT_CODE = data[i].INPUT_CODE
                tmpDocItems.INPUT_NAME = data[i].INPUT_NAME
                tmpDocItems.OUTPUT = data[i].OUTPUT
                tmpDocItems.OUTPUT_CODE = data[i].OUTPUT_CODE
                tmpDocItems.OUTPUT_NAME = data[i].OUTPUT_NAME
                tmpDocItems.ITEM = data[i].ITEM
                tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                tmpDocItems.PRICE = data[i].PRICE
                tmpDocItems.QUANTITY = data[i].QUANTITY
                tmpDocItems.VAT = data[i].VAT
                tmpDocItems.AMOUNT = data[i].AMOUNT
                tmpDocItems.TOTAL = data[i].TOTAL
                tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                tmpDocItems.PROFORMA_LINE_GUID = data[i].GUID
                tmpDocItems.PROFORMA_DOC_GUID = data[i].DOC_GUID
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.CONNECT_REF = data[i].CONNECT_REF
                tmpDocItems.ORDER_LINE_GUID = data[i].ORDER_LINE_GUID
                tmpDocItems.ORDER_DOC_GUID = data[i].ORDER_DOC_GUID
                tmpDocItems.OLD_VAT = data[i].VAT_RATE
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DEPOT_QUANTITY = data[i].DEPOT_QUANTITY
                tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE

                await this.docObj.docItems.addEmpty(tmpDocItems)
                await this.core.util.waitUntil(100)
            }
            
            this.calculateTotal()
            App.instance.setState({isExecute:false})
            setTimeout(() => 
            {
                this.btnSave.setState({disabled:false});
            }, 500);
        }
    }
    async getRebate() 
    {
        await this.pg_getRebate.show()
        
        let tmpQuery = arguments[0]

        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_getRebate.setData(tmpData.result.recordset)
        }
        else
        {
            await this.pg_getRebate.setData([])
        }

        this.pg_getRebate.onClick = async(data) =>
        {
            App.instance.setState({isExecute:true})
            for (let i = 0; i < data.length; i++) 
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                tmpDocItems.LINE_NO = data[i].LINE_NO
                tmpDocItems.REF = this.docObj.dt()[0].REF
                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                tmpDocItems.INPUT_CODE = this.docObj.dt()[0].INPUT_CODE
                tmpDocItems.INPUT_NAME = this.docObj.dt()[0].INPUT_NAME
                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocItems.OUTPUT_CODE = this.docObj.dt()[0].OUTPUT_CODE
                tmpDocItems.OUTPUT_NAME = this.docObj.dt()[0].OUTPUT_NAME
                tmpDocItems.ITEM = data[i].ITEM
                tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                tmpDocItems.PRICE = data[i].PRICE
                tmpDocItems.QUANTITY = data[i].QUANTITY
                tmpDocItems.VAT = data[i].VAT
                tmpDocItems.AMOUNT = data[i].AMOUNT
                tmpDocItems.TOTAL = data[i].TOTAL
                tmpDocItems.TOTALHT = data[i].TOTALHT
                tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.REBATE_LINE_GUID = data[i].GUID
                tmpDocItems.REBATE_DOC_GUID = data[i].DOC_GUID
                tmpDocItems.VAT_RATE = data[i].VAT_RATE
                tmpDocItems.OLD_VAT = data[i].VAT_RATE
                tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                tmpDocItems.DISCOUNT_1 = data[i].DISCOUNT_1
                tmpDocItems.DISCOUNT_2 = data[i].DISCOUNT_2
                tmpDocItems.DISCOUNT_3 = data[i].DISCOUNT_3
                tmpDocItems.DISCOUNT = data[i].DISCOUNT
                tmpDocItems.DOC_DISCOUNT_1 = data[i].DOC_DISCOUNT_1
                tmpDocItems.DOC_DISCOUNT_2 = data[i].DOC_DISCOUNT_2
                tmpDocItems.DOC_DISCOUNT_3 = data[i].DOC_DISCOUNT_3
                tmpDocItems.DOC_DISCOUNT = data[i].DOC_DISCOUNT
                tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE
                tmpDocItems.DIFF_PRICE = (data[i].PRICE - data[i].CUSTOMER_PRICE).toFixed(3)
                tmpDocItems.COST_PRICE = data[i].COST_PRICE
                tmpDocItems.SUB_FACTOR = data[i].SUB_FACTOR
                tmpDocItems.SUB_SYMBOL = data[i].SUB_SYMBOL
                tmpDocItems.SUB_QUANTITY = data[i].SUB_QUANTITY
                tmpDocItems.SUB_PRICE = data[i].SUB_PRICE

            
                await this.docObj.docItems.addEmpty(tmpDocItems)
                await this.core.util.waitUntil(100)
            }
            this.calculateTotal()
            App.instance.setState({isExecute:false})
        }
    }
    async mergeItem(pCode)
    {
        return new Promise(async resolve =>
        {
            let tmpMergeDt = this.docDetailObj.dt().where({ITEM_CODE:pCode})
            if(tmpMergeDt.length > 0)
            {
                if(this.combineControl == true)
                {
                    let tmpBtnResult = await this.msgCombineItem.show();
                    if(tmpBtnResult == 'btn01')
                    {
                        if(this.checkCombine.value == true)
                        {
                            this.combineControl = false
                        }
                        this.combineNew = false
                    }
                    else
                    {
                        if(this.checkCombine.value == true)
                        {
                            this.combineControl = false
                        }
                        this.combineNew = true
                    }
                }
                resolve(tmpMergeDt)
            }
            else
            {
                resolve()
            }
        })
    }
    async checkDocNo(pDocNo)
    {
        if(this.prmObj.filter({ID:'checkDocNo',USERS:this.user.CODE}).getValue())
        {
            if(pDocNo != '')
            {
                let tmpQuery = 
                {
                    query : "SELECT * FROM DOC_VW_01 WHERE DOC_NO = @DOC_NO AND TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE AND REBATE = @REBATE",
                    param : ['DOC_NO:string|50','TYPE:int','DOC_TYPE:int','REBATE:bit'],
                    value : [pDocNo,this.type,this.docType,this.rebate]
                }
                let tmpResult = await this.core.sql.execute(tmpQuery) 
                if(tmpResult.result.recordset.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgCheckDocNo',showTitle:true,title:this.lang.t("msgCheckDocNo.title"),showCloseButton:true,width:'500px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgCheckDocNo.btn01"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCheckDocNo.msg")}</div>)
                    }
                    
                    await dialog(tmpConfObj);
                }
            }
        }
    }
    render()
    {
        return(
            <div>
                {/* Cari Seçim PopUp */}
                <div>
                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtCustomerCode.title")} //
                    search={true}
                    deferRendering={true}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                    </NdPopGrid>
                </div>
                {/* Evrak Seçim PopUp*/}
                <div>
                    <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_Docs.title")} 
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'more',
                                onClick:()=>
                                {
                                    this.pg_Docs.hide()
                                    this.getDocs(1)
                                }
                            }
                        ]
                    }
                    deferRendering={true}
                    >
                        {(()=>
                        {
                            if(this.type == 0)
                            {
                                let tmpArr = []
                                tmpArr.push(<Column key={"REF"} dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150}/>)
                                tmpArr.push(<Column key={"REF_NO"} dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={120} />)
                                tmpArr.push(<Column key={"DOC_DATE_CONVERT"} dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} />)
                                tmpArr.push(<Column key={"OUTPUT_NAME"} dataField="OUTPUT_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} />)
                                tmpArr.push(<Column key={"OUTPUT_CODE"} dataField="OUTPUT_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} />)
                                tmpArr.push(<Column key={"TOTAL"} dataField="TOTAL" format={{ style: "currency", currency: Number.money.code,precision: 2}} caption={this.t("pg_Docs.clmTotal")} width={300} />)
                                return tmpArr
                            }
                            else if(this.type == 1)
                            {
                                let tmpArr = []
                                tmpArr.push(<Column key={"REF"} dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150}/>)
                                tmpArr.push(<Column key={"REF_NO"} dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={120} />)
                                tmpArr.push(<Column key={"DOC_DATE_CONVERT"} dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} />)
                                tmpArr.push(<Column key={"INPUT_NAME"} dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} />)
                                tmpArr.push(<Column key={"INPUT_CODE"} dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={300} />)
                                tmpArr.push(<Column key={"TOTAL"} dataField="TOTAL" format={{ style: "currency", currency: Number.money.code,precision: 2}} caption={this.t("pg_Docs.clmTotal")} width={300} />)
                                return tmpArr
                            }
                        })()}
                    </NdPopGrid>
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
                    deferRendering={true}
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
                                <NdCheckBox id="chkFirstDiscount" parent={this} simple={true} value ={false}/>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {           
                                            
                                            for (let i = 0; i < this.docDetailObj.dt().length; i++) 
                                            {
                                                let tmpDocData = this.docDetailObj.dt()[i]

                                                if(this.chkFirstDiscount.value == false)
                                                {
                                                    tmpDocData.DISCOUNT_1 = Number(tmpDocData.PRICE * tmpDocData.QUANTITY).rateInc(this.txtDiscountPercent1.value,4)
                                                }
                                                tmpDocData.DISCOUNT_2 = Number(((tmpDocData.PRICE * tmpDocData.QUANTITY) - tmpDocData.DISCOUNT_1)).rateInc(this.txtDiscountPercent2.value,4)
                                                tmpDocData.DISCOUNT_3 =  Number(((tmpDocData.PRICE * tmpDocData.QUANTITY) - (tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2))).rateInc(this.txtDiscountPercent3.value,4)
                                                tmpDocData.DISCOUNT = parseFloat((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3)).round(2)
                                                tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                tmpDocData.TOTALHT = parseFloat((Number((tmpDocData.PRICE * tmpDocData.QUANTITY)) - parseFloat(Number(tmpDocData.DISCOUNT_1) + Number(tmpDocData.DISCOUNT_2) + Number(tmpDocData.DISCOUNT_3)).round(4))).round(2)
                                                
                                                if(tmpDocData.VAT > 0)
                                                {
                                                    if(this.docObj.dt()[0].VAT_ZERO != 1)
                                                    {
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                    }
                                                    else
                                                    {
                                                        tmpDocData.VAT = 0
                                                    }
                                                }
                                                tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                            }
                                            this.calculateTotal()
                                            this.popDiscount.hide(); 
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                {/* Evrak İndirim PopUp */}
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
                    deferRendering={true}
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
                                        <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {           
                                            
                                            for (let i = 0; i < this.docDetailObj.dt().length; i++) 
                                            {
                                                let tmpDocData = this.docDetailObj.dt()[i]
                                                
                                                tmpDocData.DOC_DISCOUNT_1 = Number(tmpDocData.TOTALHT).rateInc(this.txtDocDiscountPercent1.value,4)
                                                tmpDocData.DOC_DISCOUNT_2 = Number(((tmpDocData.TOTALHT) - tmpDocData.DOC_DISCOUNT_1)).rateInc(this.txtDocDiscountPercent2.value,4)
                                                tmpDocData.DOC_DISCOUNT_3 =  Number(((tmpDocData.TOTALHT)-(tmpDocData.DOC_DISCOUNT_1+tmpDocData.DOC_DISCOUNT_2))).rateInc(this.txtDocDiscountPercent3.value,4)
                                                tmpDocData.DOC_DISCOUNT = parseFloat((tmpDocData.DOC_DISCOUNT_1 + tmpDocData.DOC_DISCOUNT_2 + tmpDocData.DOC_DISCOUNT_3).toFixed(4))
                                                tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                
                                                if(tmpDocData.VAT > 0)
                                                {
                                                    if(this.docObj.dt()[0].VAT_ZERO != 1)
                                                    {
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                    }
                                                    else
                                                    {
                                                        tmpDocData.VAT = 0
                                                    }
                                                }
                                                tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                            }
                                            this.calculateTotal()
                                            this.popDocDiscount.hide(); 
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
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
                {/* Yönetici PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popPassword"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popPassword.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#root'}}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("popPassword.Password")} alignment="right" />
                                <NdTextBox id="txtPassword" mode="password" parent={this} simple={true} maxLength={32}></NdTextBox>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popPassword.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let tmpPass = btoa(this.txtPassword.value);
                                            let tmpQuery = 
                                            {
                                                query : "SELECT TOP 1 * FROM USERS WHERE PWD = @PWD AND ROLE = 'Administrator' AND STATUS = 1", 
                                                param : ['PWD:string|50'],
                                                value : [tmpPass],
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.docObj.dt()[0].LOCKED = 0
                                                this.docLocked = false
                                                let tmpConfObj =
                                                {
                                                    id:'msgPasswordSucces',showTitle:true,title:this.t("msgPasswordSucces.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgPasswordSucces.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPasswordSucces.msg")}</div>)
                                                }

                                                await dialog(tmpConfObj);
                                                this.popPassword.hide();  

                                                if(typeof this.popPassword.onStatus != 'undefined')
                                                {
                                                    this.popPassword.onStatus(true)
                                                }
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgPasswordWrong',showTitle:true,title:this.t("msgPasswordWrong.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgPasswordWrong.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPasswordWrong.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);

                                                if(typeof this.popPassword.onStatus != 'undefined')
                                                {
                                                    this.popPassword.onStatus(false)
                                                }
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popPassword.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div> 
                {/* İrsaliye Grid */}
                <div>
                    <NdPopGrid id={"pg_dispatchGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_dispatchGrid.title")} //
                    deferRendering={true}
                    >
                        <GroupPanel visible={true} allowColumnDragging={false}/>       
                        <Column dataField="REFERANS" caption={this.t("pg_dispatchGrid.clmReferans")} width={200} defaultSortOrder="asc" groupIndex={0}/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_dispatchGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_dispatchGrid.clmName")} width={450} />
                        <Column dataField="QUANTITY" caption={this.t("pg_dispatchGrid.clmQuantity")} width={200} />
                        <Column dataField="DOC_NO" caption={this.t("pg_dispatchGrid.clmDocNo")} width={200} />
                        <Column dataField="DOC_DATE" caption={this.t("pg_dispatchGrid.clmDate")}  width={110} dataType={'date'}  format={'dd/MM/yyyy'}/>
                        <Column dataField="PRICE" caption={this.t("pg_dispatchGrid.clmPrice")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                        <Column dataField="TOTALHT" caption={this.t("pg_dispatchGrid.clmTotal")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                        <Summary>
                            <GroupItem
                            column="TOTALHT"
                            summaryType="sum"
                            valueFormat={{ style: "currency", currency: Number.money.code,precision: 2}} />
                        </Summary>
                    </NdPopGrid>
                </div>
                {/* Stok Grid */}
                <div>
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    onRowPrepared={(e) =>
                    {
                        if(e.rowType == 'data' && e.data.STATUS == false)
                        {
                            e.rowElement.style.color ="Silver"
                        }
                        else if(e.rowType == 'data' && e.data.STATUS == true)
                        {
                            e.rowElement.style.color ="Black"
                        }
                    }}
                    deferRendering={true}
                    >
                        {(()=>
                        {
                            if(this.type == 0)
                            {
                                let tmpArr = []
                                tmpArr.push(<Column key={"CODE"} dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={200}/>)
                                tmpArr.push(<Column key={"NAME"} dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc"/>)
                                tmpArr.push(<Column key={"MULTICODE"} dataField="MULTICODE" caption={this.t("pg_txtItemsCode.clmMulticode")} width={200}/>)
                                tmpArr.push(<Column key={"PURC_PRICE"} dataField="PURC_PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} width={150} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>)
                                return tmpArr
                            }
                            else
                            {
                                let tmpArr = []
                                tmpArr.push(<Column key={"CODE"} dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={200}/>)
                                tmpArr.push(<Column key={"NAME"} dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc"/>)
                                tmpArr.push(<Column key={"PRICE"} dataField="PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>)
                                return tmpArr
                            }
                        })()}
                    </NdPopGrid>
                </div>
                {/* Hizmet Grid */}
                <div>
                    <NdPopGrid id={"pg_service"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_service.title")} //
                    data={{source:{select:{query : "SELECT *,1 AS ITEM_TYPE,'00000000-0000-0000-0000-000000000000' AS UNIT FROM SERVICE_ITEMS_VW_01 WHERE STATUS = 1"},sql:this.core.sql}}}
                    deferRendering={true}
                    >
                        <Column dataField="CODE" caption={this.t("pg_service.clmCode")} width={200}/>
                        <Column dataField="NAME" caption={this.t("pg_service.clmName")} width={300} defaultSortOrder="asc"/>
                    </NdPopGrid>
                </div>
                {/* Toplu Stok PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popMultiItem"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popMultiItem.title")}
                    container={"#root"} 
                    width={'1100'}
                    height={'750'}
                    position={{of:'#root'}}
                    deferRendering={true}
                    onHiding={()=>
                    {
                        this.popMultiItem.tmpTagItemCode = this.tagItemCode.value
                    }}
                    onShowed={()=>
                    {
                        if(typeof this.popMultiItem.tmpTagItemCode != 'undefined')
                        {
                            this.tagItemCode.value = this.popMultiItem.tmpTagItemCode
                            this.popMultiItem.tmpTagItemCode = undefined
                        }
                    }}
                    >
                        <Form colCount={2} height={'fit-content'}>
                            <Item colSpan={2}>
                                <Label  alignment="right" />
                                <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}/>
                            </Item>
                            <EmptyItem />       
                            <Item>
                                <Label text={this.t("cmbMultiItemType.title")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbMultiItemType" height='fit-content' 
                                displayExpr="VALUE"                       
                                valueExpr="ID"
                                value={0}
                                data={{source:[{ID:0,VALUE:this.t("cmbMultiItemType.customerCode")},{ID:1,VALUE:this.t("cmbMultiItemType.ItemCode")}]}}
                                />
                            </Item>   
                            <EmptyItem />   
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async (e)=>
                                        {       
                                            this.multiItemAdd()
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnClear")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.multiItemData.clear()
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                            <Item colSpan={2} >
                                <NdGrid parent={this} id={"grdMultiItem"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                headerFilter={{visible:true}}
                                filterRow = {{visible:true}}
                                height={600} 
                                width={'100%'}
                                dbApply={false}
                                >
                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                    <Column dataField="CODE" caption={this.t("grdMultiItem.clmCode")} width={150} allowEditing={false} />
                                    <Column dataField="MULTICODE" caption={this.t("grdMultiItem.clmMulticode")} width={150} allowEditing={false} />
                                    <Column dataField="NAME" caption={this.t("grdMultiItem.clmName")} width={300}  headerFilter={{visible:true}} allowEditing={false} />
                                    <Column dataField="QUANTITY" caption={this.t("grdMultiItem.clmQuantity")} dataType={'number'} width={100} headerFilter={{visible:true}} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                </NdGrid>
                            </Item>
                            <EmptyItem />   
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                    
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMultiItem.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.multiItemSave()
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>                   
                {/* Birim Detay PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popUnit2"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popUnit2.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'250'}
                    position={{of:'#root'}}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <NdGrid parent={this} id={"grdUnit2"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={'100%'} 
                                width={'100%'}
                                dbApply={false}
                                >
                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                    <Column dataField="NAME" caption={this.t("grdUnit2.clmName")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                    <Column dataField="UNIT_FACTOR" caption={this.t("grdUnit2.clmQuantity")} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                </NdGrid>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
                {/* KDV PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popVatRate"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popVatRate.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'300'}
                    position={{of:'#root'}}
                    deferRendering={true}
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
                                    <Column dataField="RATE" caption={this.lang.t("grdVatRate.clmRate")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                    <Column dataField="VAT" caption={this.lang.t("grdVatRate.clmVat")} format={{ style: "currency", currency: Number.money.code,precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                    <Column dataField="TOTALHT" caption={this.lang.t("grdVatRate.clmTotalHt")} format={{ style: "currency", currency: Number.money.code,precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                </NdGrid>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnVatToZero")} type="normal" stylingMode="contained" width={'100%'} 
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
                                                for (let i = 0; i < this.docDetailObj.dt().length; i++) 
                                                {
                                                    this.docDetailObj.dt()[i].VAT = 0  
                                                    this.docDetailObj.dt()[i].VAT_ZERO = 1 
                                                    this.docDetailObj.dt()[i].VAT_RATE = 0  
                                                    this.docDetailObj.dt()[i].TOTAL = (this.docDetailObj.dt()[i].PRICE * this.docDetailObj.dt()[i].QUANTITY) - (this.docDetailObj.dt()[i].DISCOUNT + this.docDetailObj.dt()[i].DOC_DISCOUNT)
                                                    this.calculateTotal()
                                                }
                                                this.popVatRate.hide()
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popVatRate.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnVatReCalculate")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            let tmpConfObj =
                                            {
                                                id:'msgVatCalculate',showTitle:true,title:this.lang.t("msgVatCalculate.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgVatCalculate.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgVatCalculate.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgVatCalculate.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                for (let i = 0; i < this.docDetailObj.dt().length; i++) 
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query : "SELECT VAT FROM ITEMS_VW_01 WHERE GUID = @ITEM", 
                                                        param : ['ITEM:string|50'],
                                                        value : [this.docDetailObj.dt()[i].ITEM]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(typeof tmpData.result.recordset.length != 'undefined')
                                                    {
                                                        this.docDetailObj.dt()[i].VAT_RATE = tmpData.result.recordset[0].VAT
                                                    }
                                                    this.docDetailObj.dt()[i].VAT = parseFloat(((this.docDetailObj.dt()[i].TOTALHT - this.docDetailObj.dt()[i].DOC_DISCOUNT) * (this.docDetailObj.dt()[i].VAT_RATE / 100)).toFixed(6))
                                                    this.docDetailObj.dt()[i].TOTAL = ((this.docDetailObj.dt()[i].PRICE * this.docDetailObj.dt()[i].QUANTITY) - (this.docDetailObj.dt()[i].DISCOUNT + this.docDetailObj.dt()[i].DOC_DISCOUNT)) + this.docDetailObj.dt()[i].VAT
                                                    this.calculateTotal()
                                                }
                                                this.popVatRate.hide()
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
                {/* notCustomer Dialog  */}
                <div>
                    <NdDialog id={"msgCustomerNotFound"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgCustomerNotFound.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"250px"}
                    button={[{id:"btn01",caption:this.t("msgCustomerNotFound.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCustomerNotFound.btn02"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerNotFound.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* checkCustomer */}
                                    <Item>
                                        <Label text={this.lang.t("checkAll")} alignment="right" />
                                        <NdCheckBox id="checkCustomer" parent={this} simple={true} value ={false}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>
                </div>  
                {/* combineItem Dialog  */}
                <div>
                    <NdDialog id={"msgCombineItem"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgCombineItem.title")} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"250px"}
                    button={[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* checkCustomer */}
                                    <Item>
                                        <Label text={this.lang.t("checkAll")} alignment="right" />
                                        <NdCheckBox id="checkCombine" parent={this} simple={true} value ={false}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>  
                </div>
                {/* Yeni Fiyat Dialog  */}
                <div>
                    <NdDialog id={"msgNewPrice"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgNewPrice.title")} 
                    showCloseButton={false}
                    width={"1000px"}
                    height={"800PX"}
                    button={[{id:"btn01",caption:this.t("msgNewPrice.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewPrice.btn02"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewPrice.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* grdNewPrice */}
                                    <Item>
                                        <NdGrid parent={this} id={"grdNewPrice"} 
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
                                            let tmpExVat = e.key.SALE_PRICE / ((e.key.ITEM_VAT / 100) + 1)
                                            let tmpMargin = tmpExVat -  e.key.PRICE;
                                            let tmpMarginRate = ((tmpMargin /  e.key.PRICE)) * 100
                                            e.key.PRICE_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
                                            let tmpNetExVat = e.key.SALE_PRICE / ((e.key.ITEM_VAT / 100) + 1)
                                            let tmpNetMargin = (tmpNetExVat - e.key.PRICE) / 1.15;
                                            let tmpNetMarginRate = (((tmpNetMargin / e.key.PRICE) )) * 100
                                            e.key.NET_MARGIN = tmpNetMargin.toFixed(2) + Number.money.sign + " / %" +  tmpNetMarginRate.toFixed(2); 
                                            e.key.MARGIN = ((tmpMargin / tmpExVat) * 100); 
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                            <Column dataField="ITEM_CODE" caption={this.t("grdNewPrice.clmCode")} width={100} allowEditing={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdNewPrice.clmName")} width={180} allowEditing={false}/>
                                            <Column dataField="COST_PRICE" caption={this.t("grdNewPrice.clmCostPrice")} width={100} allowEditing={false}/>
                                            <Column dataField="CUSTOMER_PRICE" caption={this.t("grdNewPrice.clmPrice")} width={100} allowEditing={false}/>
                                            <Column dataField="PRICE" caption={this.t("grdNewPrice.clmPrice2")} dataType={'number'} width={70} allowEditing={false}/>
                                            <Column dataField="SALE_PRICE" caption={this.t("grdNewPrice.clmSalePrice")} dataType={'number'} width={80} format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                            <Column dataField="PRICE_MARGIN" caption={this.t("grdNewPrice.clmMargin")}width={80} allowEditing={false}/>
                                            <Column dataField="NET_MARGIN" caption={this.t("grdNewPrice.clmNetMargin")}width={80} allowEditing={false}/>
                                            <Column dataField="MARGIN" caption={this.t("grdNewPrice.clmMarge")} width={80} format={"##0.00"} allowEditing={false}/>
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Yeni Fiyat Dialog  */}
                <div>
                    <NdDialog id={"msgNewPriceDate"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgNewPriceDate.title")} 
                    showCloseButton={false}
                    width={"1000px"}
                    height={"800PX"}
                    button={[{id:"btn01",caption:this.t("msgNewPriceDate.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewPriceDate.btn02"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewPriceDate.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* grdNewPriceDate */}
                                    <Item>
                                        <NdGrid parent={this} id={"grdNewPriceDate"} 
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
                                            let tmpExVat = e.key.SALE_PRICE / ((e.key.VAT_RATE / 100) + 1)
                                            let tmpMargin = tmpExVat -  e.key.PRICE;
                                            let tmpMarginRate = ((tmpMargin /  e.key.PRICE)) * 100
                                            e.key.PRICE_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
                                            let tmpNetExVat = e.key.SALE_PRICE / ((e.key.VAT_RATE / 100) + 1)
                                            let tmpNetMargin = (tmpNetExVat - e.key.PRICE) / 1.15;
                                            let tmpNetMarginRate = (((tmpNetMargin / e.key.PRICE) )) * 100
                                            e.key.NET_MARGIN = tmpNetMargin.toFixed(2) + Number.money.sign + " / %" +  tmpNetMarginRate.toFixed(2); 
                                        }}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                            <Column dataField="ITEM_CODE" caption={this.t("grdNewPriceDate.clmCode")} width={100} allowEditing={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdNewPriceDate.clmName")} width={180} allowEditing={false}/>
                                            <Column dataField="COST_PRICE" caption={this.t("grdNewPriceDate.clmCostPrice")} width={130} allowEditing={false}/>
                                            <Column dataField="CUSTOMER_PRICE" caption={this.t("grdNewPriceDate.clmPrice")} width={130} allowEditing={false}/>
                                            <Column dataField="SALE_PRICE" caption={this.t("grdNewPriceDate.clmSalePrice")} width={130} allowEditing={false}/>
                                            <Column dataField="PRICE_MARGIN" caption={this.t("grdNewPriceDate.clmMargin")} width={130} allowEditing={false}/>
                                            <Column dataField="NET_MARGIN" caption={this.t("grdNewPriceDate.clmNetMargin")}width={100} allowEditing={false}/>
                                            <Column dataField="MARGIN" caption={this.t("grdNewPrice.clmMarge")} width={80} format={"##0.00"} allowEditing={false}/>
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>  
                </div>
                {/* Yeni KDV Dialog  */}
                <div>
                    <NdDialog id={"msgNewVat"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgNewVat.title")} 
                    showCloseButton={false}
                    width={"800px"}
                    height={"600PX"}
                    button={[{id:"btn01",caption:this.t("msgNewVat.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewVat.btn02"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewVat.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    {/* grdNewVat */}
                                    <Item>
                                        <NdGrid parent={this} id={"grdNewVat"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter={{visible:true}}
                                        filterRow = {{visible:true}}
                                        height={400} 
                                        width={'100%'}
                                        dbApply={false}
                                        selection={{mode:"multiple"}}
                                        >
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                            <Column dataField="ITEM_CODE" caption={this.t("grdNewVat.clmCode")} width={150}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdNewVat.clmName")} width={250}/>
                                            <Column dataField="OLD_VAT" caption={this.t("grdNewVat.clmVat")} width={130}/>
                                            <Column dataField="VAT_RATE" caption={this.t("grdNewVat.clmVat2")} dataType={'number'} width={80}/>
                                        </NdGrid>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>  
                </div>
                {/* Miktar Dialog  */}
                <div>
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.lang.t("msgQuantity.title")} 
                    showCloseButton={false}
                    width={"400px"}
                    height={"550px"}
                    button={[{id:"btn01",caption:this.lang.t("msgQuantity.btn01"),location:'after'}]}
                    deferRendering={true}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgQuantity.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <Form>
                                    <Item>
                                        <NdSelectBox simple={true} parent={this} id="cmbPopQteUnit"
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async(e)=>
                                        {
                                            this.txtPopQteUnitFactor.value = this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].FACTOR
                                            if(this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].TYPE == 1)
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value / this.txtPopQteUnitFactor.value).toFixed(3))
                                            }
                                            else
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value * this.txtPopQteUnitFactor.value).toFixed(3))
                                            };
                                        }).bind(this)}
                                        >
                                        </NdSelectBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQuantity" parent={this} simple={true}  
                                        onEnterKey={(async(e)=>
                                        {
                                            this.txtPopQteUnitPrice.focus()
                                        }).bind(this)}
                                        onValueChanged={(async(e)=>
                                        {
                                            if(this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].TYPE == 1)
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value / this.txtPopQteUnitFactor.value).toFixed(3))
                                            }
                                            else
                                            {
                                                this.txtPopQteUnitQuantity.value = Number((this.txtPopQuantity.value * this.txtPopQteUnitFactor.value).toFixed(3))
                                            };
                                        }).bind(this)}
                                        />
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtUnitFactor")} alignment="right" />
                                        <NdNumberBox id="txtPopQteUnitFactor" parent={this} simple={true} readOnly={true} maxLength={32}>
                                        </NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtTotalQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQteUnitQuantity" parent={this} simple={true} readOnly={true} maxLength={32}>
                                        </NdNumberBox>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtUnitPrice")} alignment="right" />
                                        <NdNumberBox id="txtPopQteUnitPrice" parent={this} simple={true} maxLength={32}
                                        onEnterKey={(async(e)=>
                                        {
                                            this.msgQuantity._onClick()
                                        }).bind(this)}
                                        />
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtPopQteDepotQty")} alignment="right" />
                                        <NdNumberBox id="txtPopQteDepotQty" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtPopQteReservQty")} alignment="right" />
                                        <NdNumberBox id="txtPopQteReservQty" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </Item>
                                    <Item>
                                        <Label text={this.lang.t("msgQuantity.txtPopQteInputQty")} alignment="right" />
                                        <NdNumberBox id="txtPopQteInputQty" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                    </NdDialog>   
                </div>
                {/* Barkod PopUp */}
                <div>
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtBarcode.title")} //
                    search={true}
                    deferRendering={true}
                    >
                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                        <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                        <Column dataField="MULTICODE" caption={this.t("pg_txtBarcode.clmMulticode")} width={200}/>
                    </NdPopGrid>
                </div>
                {/* Sipariş Grid */}
                <div>
                    <NdPopGrid id={"pg_ordersGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.lang.t("pg_ordersGrid.title")} //
                    deferRendering={true}
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="REFERANS" caption={this.lang.t("pg_ordersGrid.clmReferans")} width={100} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.lang.t("pg_ordersGrid.clmCode")} width={120}/>
                        <Column dataField="DOC_DATE" caption={this.lang.t("pg_ordersGrid.clmDate")} width={100} dataType={"datetime"} format={"dd-MM-yyyy"} defaultSortOrder="desc"/>
                        <Column dataField="ITEM_NAME" caption={this.lang.t("pg_ordersGrid.clmName")} width={400} />
                        <Column dataField="QUANTITY" caption={this.lang.t("pg_ordersGrid.clmQuantity")} width={100} />
                        <Column dataField="PEND_QUANTITY" caption={this.lang.t("pg_ordersGrid.clmPendQuantity")} width={100} />
                        <Column dataField="PRICE" caption={this.lang.t("pg_ordersGrid.clmPrice")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                        <Column dataField="TOTAL" caption={this.lang.t("pg_ordersGrid.clmTotal")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                    </NdPopGrid>
                </div>
                {/* Teklif Grid */}
                <div>
                    <NdPopGrid id={"pg_offersGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_offersGrid.title")} //
                    deferRendering={true}
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="REFERANS" caption={this.t("pg_offersGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_offersGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_offersGrid.clmName")} width={500} />
                        <Column dataField="QUANTITY" caption={this.t("pg_offersGrid.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_offersGrid.clmPrice")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                        <Column dataField="TOTAL" caption={this.t("pg_offersGrid.clmTotal")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                    </NdPopGrid>
                </div>
                {/* Iade Grid */}
                <div>
                    <NdPopGrid id={"pg_getRebate"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_getRebate.title")} //
                    deferRendering={true}
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="REFERANS" caption={this.t("pg_getRebate.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_getRebate.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_getRebate.clmName")} width={500} />
                        <Column dataField="QUANTITY" caption={this.t("pg_getRebate.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_getRebate.clmPrice")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                        <Column dataField="TOTAL" caption={this.t("pg_getRebate.clmTotal")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 2}} />
                    </NdPopGrid>
                </div>
                {/* Excel PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popExcel"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popExcel.title")}
                    container={"#root"} 
                    width={'600'}
                    height={'450'}
                    position={{of:'#root'}}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmItemCode")} alignment="right" />
                                <NdTextBox id="txtPopExcelCode" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmQuantity")} alignment="right" />
                                <NdTextBox id="txtPopExcelQty" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmPrice")} alignment="right" />
                                <NdTextBox id="txtPopExcelPrice" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmDiscount")} alignment="right" />
                                <NdTextBox id="txtPopExcelDisc" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmDiscountRate")} alignment="right" />
                                <NdTextBox id="txtPopExcelDiscRate" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("grdPurcInv.clmVat")} alignment="right" />
                                <NdTextBox id="txtPopExcelVat" parent={this} simple={true} notRefresh={true} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                    <Validator validationGroup={"frmInvExcel"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validExcel")} />
                                    </Validator>  
                                </NdTextBox>
                            </Item>
                        </Form>
                        <Form colCount={2}>
                            <Item>
                                <input type="file" name="upload" id="upload" text={"Excel Aktarım"} onChange={(e)=>
                                {
                                    e.preventDefault();
                                    if (e.target.files) 
                                    {
                                        const reader = new FileReader();
                                        reader.onload = (e) => 
                                        {
                                            const data = e.target.result;
                                            const workbook = xlsx.read(data, { type: "array" });
                                            const sheetName = workbook.SheetNames[0];
                                            const worksheet = workbook.Sheets[sheetName];
                                            const json = xlsx.utils.sheet_to_json(worksheet);
                                            this.popExcel.hide()
                                            this.excelAdd(json)
                                        };
                                        reader.readAsArrayBuffer(e.target.files[0]);
                                    }
                                }}/>    
                            </Item>
                            <Item>
                                <NdButton id="btnShemaSave" parent={this} text={this.t('shemaSave')} type="default"
                                onClick={async()=>
                                {
                                    let shemaJson={CODE:this.txtPopExcelCode.value,QTY:this.txtPopExcelQty.value,PRICE:this.txtPopExcelPrice.value,DISC:this.txtPopExcelDisc.value,DISC_PER:this.txtPopExcelDiscRate.value,TVA:this.txtPopExcelVat.value}
                                    this.prmObj.add({ID:'excelFormat',VALUE:shemaJson,USERS:this.user.CODE,APP:'OFF',TYPE:1,PAGE:this.props.data.id})
                                    await this.prmObj.save()
                                }}/>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>  
                {/* Adres Seçim PopUp */}
                <div>
                    <NdPopGrid id={"pg_adress"} showCloseButton={false} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_adress.title")} //
                    deferRendering={true}
                    >
                        <Column dataField="ADRESS" caption={this.t("pg_adress.clmAdress")} width={250} />
                        <Column dataField="CITY" caption={this.t("pg_adress.clmCiyt")} width={150} />
                        <Column dataField="ZIPCODE" caption={this.t("pg_adress.clmZipcode")} width={300} defaultSortOrder="asc" />
                        <Column dataField="COUNTRY" caption={this.t("pg_adress.clmCountry")} width={200}/>
                    </NdPopGrid>
                </div>
                {/* Birim PopUp */}
                <div>
                    <NdDialog parent={this} id={"msgUnit"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("msgUnit.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'400'}
                    position={{of:'#root'}}
                    button={[{id:"btn01",caption:this.t("msgUnit.btn01"),location:'after'}]}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <NdSelectBox simple={true} parent={this} id="cmbUnit"
                                displayExpr="NAME"                       
                                valueExpr="GUID"
                                value=""
                                searchEnabled={true}
                                onValueChanged={(async(e)=>
                                {
                                    let tmpDt = this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})
                                    if(tmpDt.length > 0)
                                    {
                                        this.txtUnitFactor.value = tmpDt[0].FACTOR
                                        if(tmpDt[0].TYPE == 1)
                                        {
                                            this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value / tmpDt[0].FACTOR).toFixed(3))
                                            this.txtUnitPrice.value = Number(this.msgUnit.tmpData.PRICE / tmpDt[0].FACTOR).round(2)
                                        }
                                        else
                                        {
                                            this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value * tmpDt[0].FACTOR).toFixed(3))
                                            this.txtUnitPrice.value = Number(this.msgUnit.tmpData.PRICE * tmpDt[0].FACTOR).round(2)
                                        }
                                    }
                                    
                                }).bind(this)}
                                >
                                </NdSelectBox>
                            </Item>
                            <Item>
                                <Form colCount={1}>
                                    <Item>
                                        <Label text={this.t("txtUnitFactor")} alignment="right" />
                                        <NdNumberBox id="txtUnitFactor" parent={this} simple={true} readOnly={true} maxLength={32}>
                                        </NdNumberBox>
                                    </Item>
                                    {/* <Item>
                                        <NdButton id="btnFactorSave" parent={this} text={this.t("msgUnit.btnFactorSave")} type="default"
                                        onClick={async()=>
                                        {
                                            let tmpQuery = 
                                            {
                                                query : "EXEC [dbo].[PRD_ITEM_UNIT_UPDATE] @GUID = @PGUID, @CUSER = @PCUSER, @FACTOR = @PFACTOR", 
                                                param : ['PGUID:string|50','PCUSER:string|25','PFACTOR:float'],
                                                value : [this.cmbUnit.value,this.user.CODE,this.txtUnitFactor.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(typeof tmpData.result.err != 'undefined')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }}/>
                                    </Item> */}
                                </Form>
                            </Item>
                            <Item>
                                <Label text={this.t("txtUnitQuantity")} alignment="right" />
                                <NdNumberBox id="txtUnitQuantity" parent={this} simple={true} maxLength={32}
                                onValueChanged={(async(e)=>
                                {
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                    {
                                        this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value / this.txtUnitFactor.value).toFixed(3))
                                    }
                                    else
                                    {
                                        this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value * this.txtUnitFactor.value).toFixed(3))
                                    }
                                }).bind(this)}
                                >
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                <NdNumberBox id="txtTotalQuantity" parent={this} simple={true} maxLength={32} readOnly={true}
                                // onValueChanged={(async(e)=>
                                // {
                                //     if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                //     {
                                //         this.txtUnitFactor.value = Number((this.txtUnitQuantity.value / this.txtTotalQuantity.value).toFixed(3))
                                //     }
                                //     else
                                //     {
                                //         this.txtUnitFactor.value = Number((this.txtTotalQuantity.value / this.txtUnitQuantity.value).toFixed(3))
                                //     }
                                // }).bind(this)}
                                >
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtUnitPrice")} alignment="right" />
                                <NdNumberBox id="txtUnitPrice" parent={this} simple={true} maxLength={32}/>
                            </Item>
                        </Form>
                    </NdDialog>
                </div>  
                {/* Satır İndirim PopUp */}
                <div>
                    <NdDialog parent={this} id={"msgDiscountEntry"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("msgDiscountEntry.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'400'}
                    position={{of:'#root'}}
                    button={[{id:"btn01",caption:this.t("msgDiscountEntry.btn01"),location:'after'}]}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("txtDiscount1")} alignment="right" />
                                <NdNumberBox id="txtDiscount1" parent={this} simple={true} maxLength={32}
                                onValueChanged={(async(e)=>
                                {
                                    this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                }).bind(this)}
                                >
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtDiscount2")} alignment="right" />
                                <NdNumberBox id="txtDiscount2" parent={this} simple={true} maxLength={32}
                                onValueChanged={(async(e)=>
                                {
                                    this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                }).bind(this)}
                                >
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtDiscount3")} alignment="right" />
                                <NdNumberBox id="txtDiscount3" parent={this} simple={true} maxLength={32}
                                onValueChanged={(async(e)=>
                                {
                                    this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                }).bind(this)}
                                >
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtTotalDiscount")} alignment="right" />
                                <NdNumberBox id="txtTotalDiscount" parent={this} simple={true} readOnly={true} maxLength={32}>
                                </NdNumberBox>
                            </Item>
                        </Form>
                    </NdDialog>
                </div> 
                {/* Satır İndirim Yüzde PopUp */}
                <div>
                    <NdDialog parent={this} id={"msgDiscountPerEntry"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("msgDiscountPerEntry.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'400'}
                    position={{of:'#root'}}
                    button={[{id:"btn01",caption:this.t("msgDiscountPerEntry.btn01"),location:'after'}]}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("txtDiscountPer1")} alignment="right" />
                                <NdNumberBox id="txtDiscountPer1" parent={this} simple={true} maxLength={32}>
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtDiscountPer2")} alignment="right" />
                                <NdNumberBox id="txtDiscountPer2" parent={this} simple={true} maxLength={32}>
                                </NdNumberBox>
                            </Item>
                            <Item>
                                <Label text={this.t("txtDiscountPer3")} alignment="right" />
                                <NdNumberBox id="txtDiscountPer3" parent={this} simple={true} maxLength={32}>
                                </NdNumberBox>
                            </Item>
                        </Form>
                    </NdDialog>
                </div> 
                {/* Proforma Grid */}
                <div>
                    <NdPopGrid id={"pg_proformaGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_proformaGrid.title")}
                    deferRendering={true}
                    >
                        <Column dataField="REFERANS" caption={this.t("pg_proformaGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_proformaGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_proformaGrid.clmName")} width={450} />
                        <Column dataField="QUANTITY" caption={this.t("pg_proformaGrid.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_proformaGrid.clmPrice")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                        <Column dataField="TOTAL" caption={this.t("pg_proformaGrid.clmTotal")} width={200} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                    </NdPopGrid>
                </div>
                {/* Origins PopUp */}
                <div>
                    <NdDialog parent={this} id={"msgGrdOrigins"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("msgGrdOrigins.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'200'}
                    position={{of:'#root'}}
                    button={[{id:"btn01",caption:this.t("msgGrdOrigins.btn01"),location:'after'}]}
                    deferRendering={true}
                    >
                        <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <Label text={this.t("cmbOrigin")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                value=""
                                searchEnabled={true} showClearButton={true}
                                param={this.param.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                >
                                </NdSelectBox>                                    
                            </Item>                    
                        </Form>
                    </NdDialog>
                </div> 
                {/* Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popDeleteDesc"} parent={this} width={"900"} height={"450"} position={"#root"} head={this.lang.t("popDeleteDesc.head")} title={this.lang.t("popDeleteDesc.title")} 
                    param={this.sysParam.filter({ID:'DocDelDescription',TYPE:0})}
                    onClick={async (e)=>
                    {
                        let tmpExtra = {...this.extraObj.empty}
                        tmpExtra.DOC = this.docObj.dt()[0].GUID
                        tmpExtra.DESCRIPTION = e
                        tmpExtra.TAG = 'DOC_DELETE'
                        this.extraObj.addEmpty(tmpExtra);
                        this.extraObj.save()
                        this.docObj.dt('DOC').removeAt(0)
                        await this.docObj.dt('DOC').delete();
                        this.init()
                    }}></NbPopDescboard>
                </div>   
                  {/* Transport Detail PopUp */}
                  <div>
                    <NdPopUp parent={this} id={"popTransport"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("popTransport.title")}
                    container={"#root"} 
                    width={'800'}
                    height={'700'}
                    position={{of:'#root'}}
                    deferRendering={true}
                    >
                        <Form colCount={2} height={'fit-content'}>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderDate")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtSenderDate"}dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_DATE"}}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverDate")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtRecieverDate"}dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_DATE"}}/>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderName")} alignment="right" />
                                <NdTextBox id="txtSenderName" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_NAME"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverName")} alignment="right" />
                                <NdTextBox id="txtRecieverName" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_NAME"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderAdress")} alignment="right" />
                                <NdTextBox id="txtSenderAdress" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_ADRESS"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverAdress")} alignment="right" />
                                <NdTextBox id="txtRecieverAdress" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_ADRESS"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderCity")} alignment="right" />
                                <NdTextBox id="txtSenderCity" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_CITY"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverCity")} alignment="right" />
                                <NdTextBox id="txtRecieverCity" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_CITY"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderZipCode")} alignment="right" />
                                <NdTextBox id="txtRecieverCity" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_ZIPCODE"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverZipCode")} alignment="right" />
                                <NdTextBox id="txtSenderZipCode" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_ZIPCODE"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.cmbSenderCountry")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                displayExpr="NAME"                       
                                valueExpr="NAME"
                                value="FRANCE"
                                searchEnabled={true} showClearButton={true}
                                dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_COUNTRY"}}
                                param={this.param.filter({ELEMENT:'cmbSenderCountry',USERS:this.user.CODE})}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                >
                                </NdSelectBox>     
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.cmbRecieverCountry")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                displayExpr="NAME"                       
                                valueExpr="NAME"
                                value="FRANCE"
                                searchEnabled={true} showClearButton={true}
                                dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_COUNTRY"}}
                                param={this.param.filter({ELEMENT:'cmbRecieverCountry',USERS:this.user.CODE})}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                >
                                </NdSelectBox>     
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtSenderNote")} alignment="right" />
                                <NdTextBox id="txtSenderNote" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"SENDER_NOTE"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtRecieverNote")} alignment="right" />
                                <NdTextBox id="txtRecieverNote" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"RECIEVER_NOTE"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <EmptyItem/>
                            <EmptyItem/>
                            <EmptyItem/>
                            <EmptyItem/>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtTransporter")} alignment="right" />
                                <NdTextBox id="txtTransporter" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"TRANSPORTER"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtTransporterPlate")} alignment="right" />
                                <NdTextBox id="txtTransporterPlate" parent={this} simple={true} notRefresh={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"TRANSPORTER_PLATE"}} upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtPalletQuntity")} alignment="right" />
                                <NdTextBox id="txtPalletQuntity" mode={'number'} parent={this} simple={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"PALLET_QUANTITY"}}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtColis")} alignment="right" />
                                <NdTextBox id="txtColis" mode={'number'} parent={this} simple={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"COLIS"}} >
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtMetter")} alignment="right"/>
                                <NdTextBox id="txtMetter" mode={'number'} parent={this} simple={true}  dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"METTER"}}>
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.lang.t("popTransport.txtHeight")} alignment="right"/>
                                <NdTextBox id="txtHeight" mode={'number'} parent={this} simple={true} dt={{data:this.docObj.transportInfermotion.dt('TRANSPORT_INFORMATION'),field:"WEIGHT"}} >  
                                </NdTextBox>
                            </Item>
                            <EmptyItem/>
                            <Item>
                                <NdButton id="btnShemaSave" parent={this} text={this.lang.t('popTransport.btnSave')} type="default"
                                onClick={async()=>
                                {
                                    this.popTransport.hide()
                                }}/>
                            </Item>
                        </Form>
                    </NdPopUp>
                </div>               
            </div>
        )
    }
}