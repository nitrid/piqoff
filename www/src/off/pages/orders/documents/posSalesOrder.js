import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docOrdersCls, docCustomerCls,docExtraCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NbPopDescboard from "../../../tools/popdescboard.js";
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';

export default class posSalesOrder extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this._calculateTotalMargin = this._calculateTotalMargin.bind(this)
        this._calculateMargin = this._calculateMargin.bind(this)
        this._getBarcodes = this._getBarcodes.bind(this)

        this.frmdocOrders = undefined;
        this.docLocked = false;        
        this.combineControl = true
        this.combineNew = false
        this.tabIndex = props.data.tabkey
       
        this.multiItemData = new datatable
        this.vatRate =  new datatable


    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.getDoc(this.pagePrm.GUID,'',0)
        }
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()
        this.grdSlsOrder.devGrid.clearFilter("row")


        this.docObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.docObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.docObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })


        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 62
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmdocOrders.option('disabled',true)
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        console.log(pGuid)
        this.docObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:62});
        App.instance.setState({isExecute:false})
        this._calculateMargin()
        this._calculateTotalMargin()

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        
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
            this.frmdocOrders.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmdocOrders.option('disabled',false)
        }
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

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
    async _calculateTotal()
    {
        let tmpVat = 0
        for (let i = 0; i < this.docObj.docOrders.dt().groupBy('VAT_RATE').length; i++) 
        {
            tmpVat = tmpVat + parseFloat(this.docObj.docOrders.dt().where({'VAT_RATE':this.docObj.docOrders.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
        }
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docObj.docOrders.dt().sum("DOC_DISCOUNT_1",4)
        this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docObj.docOrders.dt().sum("DOC_DISCOUNT_2",4)
        this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docObj.docOrders.dt().sum("DOC_DISCOUNT_3",4)
        this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docObj.docOrders.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docObj.docOrders.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docObj.docOrders.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docObj.docOrders.dt().sum("TOTALHT",2))
        this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docObj.docOrders.dt().sum("TOTALHT",2)) - parseFloat(this.docObj.docOrders.dt().sum("DOC_DISCOUNT",2))).round(2)
        this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
    }
    async _calculateTotalMargin()
    {
        let tmpTotalCost = 0

        for (let  i= 0; i < this.docObj.docOrders.dt().length; i++) 
        {
            tmpTotalCost += this.docObj.docOrders.dt()[i].COST_PRICE * this.docObj.docOrders.dt()[i].QUANTITY
        }
        let tmpMargin = ((this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT) - tmpTotalCost)
        let tmpMarginRate = ((( this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT) - tmpTotalCost) - (this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT)) * 100
        this.docObj.dt()[0].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
    }
    async _calculateMargin()
    {
        for(let  i= 0; i < this.docObj.docOrders.dt().length; i++)
        {
            let tmpMargin = (this.docObj.docOrders.dt()[i].TOTAL - this.docObj.docOrders.dt()[i].VAT) - (this.docObj.docOrders.dt()[i].COST_PRICE * this.docObj.docOrders.dt()[i].QUANTITY)
            let tmpMarginRate = (tmpMargin /(this.docObj.docOrders.dt()[i].TOTAL - this.docObj.docOrders.dt()[i].VAT)) * 100
            this.docObj.docOrders.dt()[i].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
        }
       
    }
    async _getBarcodes()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {   query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,VAT,BARCODE,ITEMS_VW_01.UNIT,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = '"+this.docObj.dt()[0].INPUT+"' AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE,  " + 
                    "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                    " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE  ITEM_BARCODE_VW_01.BARCODE LIKE  '%' +@BARCODE",
                    param : ['BARCODE:string|50'],
                },
                sql:this.core.sql
            }
        }
        this.pg_txtBarcode.setSource(tmpSource)
    } 
    _cellRoleRender(e)
    {
        if(e.column.dataField == "ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onKeyDown={async(k)=>
                    {
                        if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                        {
                            await this.pg_txtItemsCode.setVal(e.value)
                            this.pg_txtItemsCode.onClick = async(data) =>
                            {
                                this.combineControl = true
                                this.combineNew = false
                                if(data.length > 0)
                                {
                                    if(data.length == 1)
                                    {
                                        await this.addItem(data[0],e.rowIndex)
                                    }
                                    else if(data.length > 1)
                                    {
                                        for (let i = 0; i < data.length; i++) 
                                        {
                                            if(i == 0)
                                            {
                                                await this.addItem(data[i],e.rowIndex)
                                            }
                                            else
                                            {
                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                await this.core.util.waitUntil(100)
                                                await this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    onValueChanged={(v)=>
                    {
                        e.value = v.value
                    }}
                    onChange={(async(r)=>
                    {
                        if(typeof r.event.isTrusted == 'undefined')
                        {
                            let tmpQuery = 
                            {
                                query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,UNIT FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                                param : ['CODE:string|50'],
                                value : [r.component._changedValue]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery) 
                            if(tmpData.result.recordset.length > 0)
                            {
                                this.combineControl = true
                                this.combineNew = false   
                                await this.addItem(tmpData.result.recordset[0],e.rowIndex)
                            }
                            else
                            {
                                let tmpConfObj =
                                {
                                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                                }
                    
                                await dialog(tmpConfObj);
                            }
                        }
                    }).bind(this)}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    if(data.length > 0)
                                    {
                                        this.combineControl = true
                                        this.combineNew = false
                                        if(data.length == 1)
                                        {
                                            await this.addItem(data[0],e.rowIndex)
                                        }
                                        else if(data.length > 1)
                                        {
                                            for (let i = 0; i < data.length; i++) 
                                            {
                                                if(i == 0)
                                                {
                                                    await this.addItem(data[i],e.rowIndex)
                                                }
                                                else
                                                {
                                                    let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                    tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                    tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                    tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                    tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                    tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                    tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                    tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                    tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                    tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                    this.txtRef.readOnly = true
                                                    this.txtRefno.readOnly = true
                                                    this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                    await this.core.util.waitUntil(100)
                                                    await this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "QUANTITY")
        {
            return (
                <NdTextBox id={"txtGrdQuantity"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.grdSlsOrder.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                let tmpQuery = 
                                {
                                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                                    param:  ['ITEM:string|50'],
                                    value:  [e.data.ITEM]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                if(tmpData.result.recordset.length > 0)
                                {   
                                    this.cmbUnit.setData(tmpData.result.recordset)
                                    this.cmbUnit.value = e.data.UNIT
                                    this.txtUnitFactor.value = e.data.UNIT_FACTOR
                                    this.txtTotalQuantity.value =  e.data.QUANTITY
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                    {
                                        this.txtUnitQuantity.value = e.data.QUANTITY * e.data.UNIT_FACTOR
                                        this.txtUnitPrice.value = e.data.PRICE 
                                    }
                                    else
                                    {
                                        this.txtUnitQuantity.value = e.data.QUANTITY / e.data.UNIT_FACTOR
                                        this.txtUnitPrice.value = e.data.PRICE 
                                    }
                                }
                                await this.msgUnit.show().then(async () =>
                                {
                                    e.key.UNIT = this.cmbUnit.value
                                    e.key.UNIT_FACTOR = this.txtUnitFactor.value
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value).toFixed(4))
                                    e.data.QUANTITY = this.txtTotalQuantity.value
                                    e.data.VAT = Number(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100))).round(6)
                                    e.data.AMOUNT = Number((e.data.PRICE * e.data.QUANTITY)).round(4)
                                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                    //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                                    await this.itemRelatedUpdate(e.data.ITEM,this.txtTotalQuantity.value)
                                    //*****************************************/
                                    this._calculateTotal()
                                });  
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "DISCOUNT")
        {
            return (
                <NdTextBox id={"txtGrdDiscount"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.grdSlsOrder.devGrid.cellValue(e.rowIndex,"DISCOUNT",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.txtDiscount1.value = e.data.DISCOUNT_1
                                this.txtDiscount2.value = e.data.DISCOUNT_2
                                this.txtDiscount3.value = e.data.DISCOUNT_3
                                this.txtTotalDiscount.value = (parseFloat(e.data.DISCOUNT_1) + parseFloat(e.data.DISCOUNT_2) + parseFloat(e.data.DISCOUNT_3))
                                await this.msgDiscountEntry.show().then(async () =>
                                {
                                    e.data.DISCOUNT_1 = this.txtDiscount1.value
                                    e.data.DISCOUNT_2 = this.txtDiscount2.value
                                    e.data.DISCOUNT_3 = this.txtDiscount3.value
                                    e.data.DISCOUNT = (parseFloat(this.txtDiscount1.value) + parseFloat(this.txtDiscount2.value) + parseFloat(this.txtDiscount3.value))
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                    this._calculateTotal()
                                });  
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "DISCOUNT_RATE")
        {
            return (
                <NdTextBox id={"txtGrdDiscountRate"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.grdSlsOrder.devGrid.cellValue(e.rowIndex,"DISCOUNT_RATE",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.txtDiscountPer1.value = Number(e.data.QUANTITY*e.data.PRICE).rate2Num(e.data.DISCOUNT_1,4)
                                this.txtDiscountPer2.value = Number((e.data.QUANTITY*e.data.PRICE)-e.data.DISCOUNT_1).rate2Num(e.data.DISCOUNT_2,4)
                                this.txtDiscountPer3.value = Number((e.data.QUANTITY*e.data.PRICE)-((e.data.DISCOUNT_1+e.data.DISCOUNT_2))).rate2Num(e.data.DISCOUNT_3,4)
                                await this.msgDiscountPerEntry.show().then(async () =>
                                {
                                    e.data.DISCOUNT_1 = Number(e.data.AMOUNT).rateInc(this.txtDiscountPer1.value,4) 
                                    e.data.DISCOUNT_2 = Number(e.data.AMOUNT-e.data.DISCOUNT_1).rateInc(this.txtDiscountPer2.value,4) 
                                    e.data.DISCOUNT_3 = Number(e.data.AMOUNT-e.data.DISCOUNT_1-e.data.DISCOUNT_2).rateInc(this.txtDiscountPer3.value,4) 
                                    e.data.DISCOUNT = (e.data.DISCOUNT_1 + e.data.DISCOUNT_2 + e.data.DISCOUNT_3)
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                    this._calculateTotal()
                                });  
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    async addItem(pData,pIndex,pQuantity)
    {
        App.instance.setState({isExecute:true})
        let tmpGrpQuery = 
        {
            query :"SELECT ORGINS,UNIT_SHORT,ISNULL((SELECT top 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),1) AS SUB_FACTOR, " +
             "ISNULL((SELECT top 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),'') AS SUB_SYMBOL FROM ITEMS_VW_01 WHERE GUID = @GUID ",
            param : ['GUID:string|50'],
            value : [pData.GUID]
        }
        let tmpGrpData = await this.core.sql.execute(tmpGrpQuery) 
        if(tmpGrpData.result.recordset.length > 0)
        {
            this.docObj.docOrders.dt()[pIndex].ORIGIN = tmpGrpData.result.recordset[0].ORGINS
            this.docObj.docOrders.dt()[pIndex].SUB_FACTOR = tmpGrpData.result.recordset[0].SUB_FACTOR
            this.docObj.docOrders.dt()[pIndex].SUB_SYMBOL = tmpGrpData.result.recordset[0].SUB_SYMBOL
            this.docObj.docOrders.dt()[pIndex].UNIT_SHORT = tmpGrpData.result.recordset[0].UNIT_SHORT
        }
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        else
        {
            pQuantity = parseFloat(pQuantity)
        }
        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
        {
            if(this.docObj.docOrders.dt()[i].ITEM_CODE == pData.CODE)
            {
                if(this.combineControl == true)
                {
                    let tmpCombineBtn = ''
                    App.instance.setState({isExecute:false})
                    await this.msgCombineItem.show().then(async (e) =>
                    {
                        if(e == 'btn01')
                        {
                            this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + pQuantity
                            this.docObj.docOrders.dt()[i].SUB_QUANTITY = this.docObj.docOrders.dt()[i].SUB_QUANTITY + this.docObj.docOrders.dt()[i].SUB_FACTOR
                            this.docObj.docOrders.dt()[i].VAT = Number((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity)).round(6)
                            this.docObj.docOrders.dt()[i].AMOUNT = Number((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE)).round(2)
                            this.docObj.docOrders.dt()[i].TOTAL = Number((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT)).round(2)
                            this.docObj.docOrders.dt()[i].TOTALHT = Number((this.docObj.docOrders.dt()[i].AMOUNT - this.docObj.docOrders.dt()[i].DISCOUNT)).round(2)
                            this._calculateTotal()
                            await this.grdSlsOrder.devGrid.deleteRow(0)
                            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                            await this.itemRelated(pData.GUID,this.docObj.docOrders.dt()[i].QUANTITY)
                            //*****************************************/
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                            }
                            tmpCombineBtn = e
                            return
                        }
                        if(e == 'btn02')
                        {
                            if(this.checkCombine.value == true)
                            {
                                this.combineControl = false
                                this.combineNew = true
                            }
                            return
                        }
                    })
                    if(tmpCombineBtn == 'btn01')
                    {
                        return
                    }
                }
                else if(this.combineNew == false)
                {
                    this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + pQuantity
                    this.docObj.docOrders.dt()[i].SUB_QUANTITY = this.docObj.docOrders.dt()[i].SUB_QUANTITY + this.docObj.docOrders.dt()[i].SUB_FACTOR
                    this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity).toFixed(6))
                    this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(4))
                    this.docObj.docOrders.dt()[i].TOTAL = Number((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT)).round(2)
                    this.docObj.docOrders.dt()[i].TOTALHT = Number((this.docObj.docOrders.dt()[i].AMOUNT - this.docObj.docOrders.dt()[i].DISCOUNT)).round(2)
                    
                    this._calculateTotal()
                    await this.grdSlsOrder.devGrid.deleteRow(0)
                    //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                    await this.itemRelated(pData.GUID,this.docObj.docOrders.dt()[i].QUANTITY)
                    //*****************************************/
                    App.instance.setState({isExecute:false})
                    return
                }               
            }
        }
        this.docObj.docOrders.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docOrders.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docOrders.dt()[pIndex].ITEM_BARCODE = pData.BARCODE
        this.docObj.docOrders.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docOrders.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docOrders.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.docObj.docOrders.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docOrders.dt()[pIndex].DISCOUNT = 0
        this.docObj.docOrders.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docOrders.dt()[pIndex].QUANTITY = pQuantity
        this.docObj.docOrders.dt()[pIndex].SUB_QUANTITY = pQuantity * this.docObj.docOrders.dt()[pIndex].SUB_FACTOR
        let tmpQuery = 
        {
            query :"SELECT dbo.FN_PRICE_SALE_VAT_EXT(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,@CONTRACT_CODE) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','CONTRACT_CODE:string|25'],
            value : [pData.GUID,pQuantity,this.docObj.dt()[0].INPUT,this.cmbPriceContract.value]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            let tmpMargin = tmpData.result.recordset[0].PRICE - this.docObj.docOrders.dt()[pIndex].COST_PRICE
            let tmpMarginRate = ((tmpData.result.recordset[0].PRICE - this.docObj.docOrders.dt()[pIndex].COST_PRICE) - tmpData.result.recordset[0].PRICE) * 100
            this.docObj.docOrders.dt()[pIndex].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
            this.docObj.docOrders.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
            this.docObj.docOrders.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(6))
            this.docObj.docOrders.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE * pQuantity).toFixed(4))
            this.docObj.docOrders.dt()[pIndex].TOTAL = Number(((tmpData.result.recordset[0].PRICE * pQuantity)+ this.docObj.docOrders.dt()[pIndex].VAT)).round(2)
            this.docObj.docOrders.dt()[pIndex].TOTALHT = Number((this.docObj.docOrders.dt()[pIndex].AMOUNT - this.docObj.docOrders.dt()[pIndex].DISCOUNT)).round(2)
            this.docObj.docOrders.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) / this.docObj.docOrders.dt()[pIndex].SUB_FACTOR).round(2)
            this._calculateTotal()
        }
        //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
        await this.itemRelated(pData.GUID,pQuantity)
        //*****************************************/
        App.instance.setState({isExecute:false})
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
                        let tmpDocOrders = {...this.docObj.docOrders.empty}
                        tmpDocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpDocOrders.TYPE = this.docObj.dt()[0].TYPE
                        tmpDocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                        tmpDocOrders.LINE_NO = this.docObj.docOrders.dt().length
                        tmpDocOrders.REF = this.docObj.dt()[0].REF
                        tmpDocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                        tmpDocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                        tmpDocOrders.INPUT = this.docObj.dt()[0].INPUT
                        tmpDocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                        this.txtRef.readOnly = true
                        this.txtRefno.readOnly = true
                        this.docObj.docOrders.addEmpty(tmpDocOrders)
                        await this.core.util.waitUntil(100)
                        await this.addItem(tmpRelatedItemData.result.recordset[0],this.docObj.docOrders.dt().length-1,tmpRelatedQt)
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
                for (let x = 0; x < this.docObj.docOrders.dt().length; x++) 
                {
                    if(this.docObj.docOrders.dt()[x].ITEM_CODE == tmpRelatedData.result.recordset[i].RELATED_CODE)
                    {                
                        let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY
                        
                        if(tmpRelatedQt > 0)
                        {
                            this.docObj.docOrders.dt()[x].QUANTITY = tmpRelatedQt
                            this.docObj.docOrders.dt()[x].VAT = parseFloat((this.docObj.docOrders.dt()[x].VAT + (this.docObj.docOrders.dt()[x].PRICE * (this.docObj.docOrders.dt()[x].VAT_RATE / 100) * pQuantity)).toFixed(6))
                            this.docObj.docOrders.dt()[x].AMOUNT = parseFloat((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTAL = parseFloat((((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE) - this.docObj.docOrders.dt()[x].DISCOUNT) + this.docObj.docOrders.dt()[x].VAT).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTALHT =  parseFloat((this.docObj.docOrders.dt()[x].AMOUNT - this.docObj.docOrders.dt()[x].DISCOUNT).toFixed(4))
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
    async multiItemAdd()
    {
        let tmpMissCodes = []
        let tmpCounter = 0
        if(this.multiItemData.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMultiData',showTitle:true,title:this.t("msgMultiData.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgMultiData.btn01"),location:'before'},{id:"btn02",caption:this.t("msgMultiData.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiData.msg")}</div>)
            }

            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                this.multiItemData.clear()
            }
        }
        for (let i = 0; i < this.tagItemCode.value.length; i++) 
        {
            if(this.cmbMultiItemType.value == 0)
            {
                let tmpQuery = 
                {
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') = @VALUE " ,
                    param : ['VALUE:string|50'],
                    value : [this.tagItemCode.value[i]]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined')
                    {
                        this.multiItemData.push(tmpData.result.recordset[0])
                        tmpCounter = tmpCounter + 1
                    }
                }
                else
                {
                    tmpMissCodes.push("'" +this.tagItemCode.value[i] + "'")
                }
            }
            else if (this.cmbMultiItemType.value == 1)
            {
                let tmpQuery = 
                {
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY,UNIT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].INPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VALUE) OR UPPER(NAME) LIKE UPPER(@VALUE) " ,
                    param : ['VALUE:string|50'],
                    value : [this.tagItemCode.value[i]]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined')
                    {
                        this.multiItemData.push(tmpData.result.recordset[0])
                        tmpCounter = tmpCounter + 1
                    }
                }
                else
                {
                    tmpMissCodes.push("'" +this.tagItemCode.value[i] + "'")
                }
            }
            
        }
        if(tmpMissCodes.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMissItemCode',showTitle:true,title:this.t("msgMissItemCode.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgMissItemCode.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",wordWrap:"break-word",fontSize:"20px"}}>{this.t("msgMissItemCode.msg") + ' ' +tmpMissCodes}</div>)
            }
        
            await dialog(tmpConfObj);
        }
        let tmpConfObj =
        {
            id:'msgMultiCodeCount',showTitle:true,title:this.t("msgMultiCodeCount.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgMultiCodeCount.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiCodeCount.msg") + ' ' +tmpCounter}</div>)
        }
    
        await dialog(tmpConfObj);

    }
    async multiItemSave()
    {
        this.combineControl = true
        this.combineNew = false
        for (let i = 0; i < this.multiItemData.length; i++) 
        {
            let tmpdocOrders = {...this.docObj.docOrders.empty}
            tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
            tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
            tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
            tmpdocOrders.REF = this.docObj.dt()[0].REF
            tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
            tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
            tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
            tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.txtRef.readOnly = true
            this.txtRefno.readOnly = true
            this.docObj.docOrders.addEmpty(tmpdocOrders)
            await this.core.util.waitUntil(100)
            await this.addItem(this.multiItemData[i],this.docObj.docOrders.dt().length-1,this.multiItemData[i].QUANTITY)
            this.popMultiItem.hide()
        }
    }
    async checkRow()
    {
        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
        {
            this.docObj.docOrders.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docOrders.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docOrders.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
        }
    }
    async getDocs(pType)
    {
        let tmpQuery 
        if(pType == 0)
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,DOC_ADDRESS FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 62 AND REBATE = 0  AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE DESC"
            }
        }
        else
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,DOC_ADDRESS FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 62 AND REBATE = 0 ORDER BY DOC_DATE DESC"
            }
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        await this.pg_Docs.setData(tmpRows)
     
        this.pg_Docs.show()
        this.pg_Docs.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
            }
        }
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            this.getDoc(this.docObj.dt()[0].GUID,this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO)
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmslsDoc" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocLocked',showTitle:true,title:this.t("msgDocLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocLocked.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocLocked.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        if(typeof this.docObj.docOrders.dt()[0] == 'undefined')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgNotRow',showTitle:true,title:this.lang.t("msgNotRow.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("msgNotRow.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotRow.msg")}</div>)
                                            }

                                            await dialog(tmpConfObj);
                                            this.getDoc(this.docObj.dt()[0].GUID,this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO)
                                            return
                                        }
                                        if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdSlsOrder.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
                                        }
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.docObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
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
                                            return
                                        }
                                        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                        {
                                            if(this.docObj.docOrders.dt()[i].SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')   
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgdocNotDelete',showTitle:true,title:this.t("msgdocNotDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgdocNotDelete.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgdocNotDelete.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                        }
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            if(this.sysParam.filter({ID:'docDeleteDesc',USERS:this.user.CODE}).getValue().value == true)
                                            {
                                                this.popDeleteDesc.show()
                                            }
                                            else
                                            {
                                                this.docObj.dt('DOC').removeAt(0)
                                                await this.docObj.dt('DOC').delete();
                                                this.init(); 
                                            }
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnLock" parent={this} icon="key" type="default"
                                    onClick={async ()=>
                                    {
                                        if(this.docObj.dt()[0].LOCKED == 0)
                                        {
                                            this.docObj.dt()[0].LOCKED = 1
                                            if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdSlsOrder.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
                                            }
                                            if((await this.docObj.save()) == 0)
                                            {                                                    
                                                let tmpConfObj =
                                                {
                                                    id:'msgLocked',showTitle:true,title:this.t("msgLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgLocked.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLocked.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                this.frmdocOrders.option('disabled',true)
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 1)
                                        {
                                            this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 2)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgLockedType2',showTitle:true,title:this.t("msgLockedType2.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgLockedType2.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLockedType2.msg")}</div>)
                                            }

                                            await dialog(tmpConfObj);
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                     onClick={async ()=>
                                        {       
                                            this.popDesign.show()
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnInfo" parent={this} icon="info" type="default"
                                    onClick={async()=>
                                    {
                                        this.numDetailCount.value = this.docObj.docOrders.dt().length
                                        this.numDetailQuantity.value =  this.docObj.docOrders.dt().sum("QUANTITY",2)
                                        let tmpQuantity2 = 0
                                        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_UNIT2_QUANTITY](@ITEM) AS QUANTITY",
                                                param : ['ITEM:string|50'],
                                                value : [this.docObj.docOrders.dt()[i].ITEM]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                tmpQuantity2 = tmpQuantity2 + (tmpData.result.recordset[0].QUANTITY * this.docObj.docOrders.dt()[i].QUANTITY)
                                            }
                                        }
                                        this.numDetailQuantity2.value = tmpQuantity2.toFixed(3)
                                        let tmpExVat = Number(this.docObj.docOrders.dt().sum("PRICE",2))
                                        let tmpMargin = Number(tmpExVat) - Number(this.docObj.docOrders.dt().sum("COST_PRICE",2)) 
                                        let tmpMarginRate = ((tmpMargin / Number(this.docObj.docOrders.dt().sum("COST_PRICE",2)))) * 100
                                        this.txtDetailMargin.value = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2);                 
                                        this.popDetail.show()
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
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmslsDoc">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 62 AND REF = @REF ",
                                                    param : ['REF:string|25'],
                                                    value : [this.txtRef.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {
                                                           this.getDocs(0)
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'arrowdown',
                                                        onClick:()=>
                                                        {
                                                            this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND  TYPE = 1 AND DOC_TYPE = 62 ",
                                                    param : ['REF:string|50','REF_NO:int'],
                                                    value : [this.txtRef.value,this.txtRefno.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {   
                                                    if(tmpData.result.recordset[0].DELETED == 1)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocDeleted',showTitle:true,title:this.lang.t("msgDocDeleted.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.lang.t("msgDocDeleted.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgDocDeleted.msg")}</div>)
                                                        }
                                                        this.txtRefno.value = 0
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                }
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    {/*EVRAK SEÇİM */}
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
                                                    this.getDocs(1)
                                                }
                                            }
                                        ]
                                        
                                    }
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150}/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={120} />
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300}  />
                                        <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={200} />
                                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} />
                                        <Column dataField="DOC_ADDRESS" caption={this.t("pg_Docs.clmAddress")} width={300} />
                                        
                                    </NdPopGrid>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                        if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                        {
                                            this.frmdocOrders.option('disabled',false)
                                        }
                                    }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                            this.pg_txtCustomerCode.show()
                                            this.pg_txtCustomerCode.onClick = async(data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.docObj.dt()[0].INPUT = data[0].GUID
                                                    this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                    this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.value=data[0].CODE;
                                                        this.txtRef.props.onChange()
                                                    }
                                                    if(this.cmbDepot.value != '' && this.docLocked == false)
                                                    {
                                                        this.frmdocOrders.option('disabled',false)
                                                    }
                                                    let tmpQuery = 
                                                    {
                                                        query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                        param : ['CUSTOMER:string|50'],
                                                        value : [ data[0].GUID]
                                                    }
                                                    let tmpAdressData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpAdressData.result.recordset.length > 1)
                                                    {   
                                                        await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                        this.pg_adress.show()
                                                        this.pg_adress.onClick = async(pdata) =>
                                                        {
                                                            if(pdata.length > 0)
                                                            {
                                                                this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        await this.pg_adress.setData([])
                                                    }

                                                }
                                                this._getBarcodes()
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
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.docObj.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value=data[0].CODE;
                                                                this.txtRef.props.onChange()
                                                            }
                                                            if(this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmdocOrders.option('disabled',false)
                                                            }
                                                             let tmpQuery = 
                                                    {
                                                        query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                        param : ['CUSTOMER:string|50'],
                                                        value : [ data[0].GUID]
                                                    }
                                                    let tmpAdressData = await this.core.sql.execute(tmpQuery) 
                                                            if(tmpAdressData.result.recordset.length > 1)
                                                            {   
                                                                await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                                this.pg_adress.show()
                                                                this.pg_adress.onClick = async(pdata) =>
                                                                {
                                                                    if(pdata.length > 0)
                                                                    {
                                                                        console.log(pdata[0].TYPE)
                                                                        this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                                    }
                                                                }
                                                            }
                                                            else
                                                            {
                                                                await this.pg_adress.setData([])
                                                            }
                                                        }
                                                        this._getBarcodes()

                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
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
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                        
                                    </NdPopGrid>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} 
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* Boş */}
                                <EmptyItem />
                                {/* BARKOD EKLEME */}
                                <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  placeholder={this.t("txtBarcodePlace")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    validationGroup={"frmslsDoc" + this.tabIndex}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:"fa-solid fa-barcode",
                                                onClick:async(e)=>
                                                {
                                                    if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '')
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);
                                                        this.txtBarcode.setState({value:""})
                                                        return
                                                    }
                                                    if(e.validationGroup.validate().status == "valid")
                                                    {
                                                        await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                        this.pg_txtBarcode.show()
                                                        this.pg_txtBarcode.onClick = async(data) =>
                                                        {
                                                          

                                                            if(data.length > 0)
                                                            {
                                                                this.customerControl = true
                                                                this.customerClear = false
                                                                this.combineControl = true
                                                                this.combineNew = false
            
                                                                if(data.length == 1)
                                                                {
                                                                    let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                    tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                    tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                    tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                    tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                    tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                    tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                    tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                    tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                    tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                    this.txtRef.readOnly = true
                                                                    this.txtRefno.readOnly = true
                                                                    this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                    await this.core.util.waitUntil(100)
                                                                    await this.addItem(data[0],this.docObj.docOrders.dt().length -1)
                                                                }
                                                                else if(data.length > 1)
                                                                {
                                                                    for (let i = 0; i < data.length; i++) 
                                                                    {
                                                                    
                                                                        let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                        tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                        tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                        tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                        tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                        tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                        tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                        tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                        tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                        tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                        
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.docObj.docOrders.addEmpty(tmpdocOrders)
        
                                                                        await this.core.util.waitUntil(100)
                                                                        await this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                            if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '')
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                                }
                                                
                                                await dialog(tmpConfObj);
                                                this.txtBarcode.setState({value:""})
                                                return
                                            }
                                            let tmpQuery = 
                                            {  
                                                query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER)",
                                                param : ['CODE:string|50','CUSTOMER:string|50'],
                                                value : [this.txtBarcode.value,this.docObj.dt()[0].INPUT]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.txtPopQteUnitQuantity.value = 1
                                                this.txtPopQuantity.value = 1
                                                setTimeout(async () => 
                                                {
                                                    this.txtPopQuantity.focus()
                                                }, 700);
                                                let tmpUnitQuery = 
                                                {
                                                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                                                    param:  ['ITEM:string|50'],
                                                    value:  [tmpData.result.recordset[0].GUID]
                                                }
                                                let tmpUnitData = await this.core.sql.execute(tmpUnitQuery) 
                                                if(tmpUnitData.result.recordset.length > 0)
                                                {   
                                                    this.cmbPopQteUnit.setData(tmpUnitData.result.recordset)
                                                    this.cmbPopQteUnit.value = tmpData.result.recordset[0].UNIT
                                                    this.txtPopQteUnitFactor.value = 1
                                                }
                                                await this.msgQuantity.show().then(async (e) =>
                                                {
                                                    let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                    tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                    tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                    tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                    tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                    tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                    tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                    tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                    tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                    tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                    this.txtRef.readOnly = true
                                                    this.txtRefno.readOnly = true
                                                    this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                
                                                    this.addItem(tmpData.result.recordset[0],(typeof this.docObj.docOrders.dt()[0] == 'undefined' ? 0 : this.docObj.docOrders.dt().length-1),this.txtPopQteUnitQuantity.value)
                                                    this.txtBarcode.focus()
                                                })
                                            }
                                            else
                                            {
                                                await this.pg_txtItemsCode.setVal(this.txtBarcode.value)
                                                this.pg_txtItemsCode.show()
                                                this.pg_txtItemsCode.onClick = async(data) =>
                                                {
                                                   
                                                    if(data.length > 0)
                                                    {
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        if(data.length == 1)
                                                        {
                                                            this.txtPopQteUnitQuantity.value = 1
                                                            this.txtPopQuantity.value = 1
                                                            setTimeout(async () => 
                                                            {
                                                                this.txtPopQuantity.focus()
                                                            }, 700);
                                                            let tmpUnitQuery = 
                                                            {
                                                                query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                                                                param:  ['ITEM:string|50'],
                                                                value:  [data[0].GUID]
                                                            }
                                                            let tmpUnitData = await this.core.sql.execute(tmpUnitQuery) 
                                                            if(tmpUnitData.result.recordset.length > 0)
                                                            {   
                                                                this.cmbPopQteUnit.setData(tmpUnitData.result.recordset)
                                                                this.cmbPopQteUnit.value = data[0].UNIT
                                                                this.txtPopQteUnitFactor.value = 1
                                                            }
                                                            await this.msgQuantity.show().then(async (e) =>
                                                            {
                                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                this.txtRef.readOnly = true
                                                                this.txtRefno.readOnly = true
                                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                this.addItem(data[0],(typeof this.docObj.docOrders.dt()[0] == 'undefined' ? 0 : this.docObj.docOrders.dt().length-1),this.txtPopQteUnitQuantity.value)
                                                                this.txtBarcode.focus()
                                                            })
                                                        }
                                                        else if(data.length > 1)
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                    let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                    tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                    tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                    tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                    tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                    tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                    tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                    tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                    tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                    tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                    this.txtRef.readOnly = true
                                                                    this.txtRefno.readOnly = true
                                                                    this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                    await this.core.util.waitUntil(100)
                                                                    await this.addItem(data[i],this.docObj.docOrders.dt().length -1)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            this.txtBarcode.value = ''
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                 {/* dtDocDate */}
                                 <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* cmbPriceContract */}
                                <Item>
                                    <Label text={this.t("cmbPriceContract")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPriceContract" notRefresh={true}
                                    displayExpr="NAME"
                                    valueExpr="CODE"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM CONTRACT_VW_01 WHERE CUSTOMER = '00000000-0000-0000-0000-000000000000' GROUP BY CODE,NAME ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbPriceContract',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbPriceContract',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmdocOrders = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmslsDoc" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.docObj.docOrders.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.combineControl = true
                                                            this.combineNew = false
                                                            if(data.length == 1)
                                                            {
                                                                await this.addItem(data[0],this.docObj.docOrders.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        await this.addItem(data[i],this.docObj.docOrders.dt().length -1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                        tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                        tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                        tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                        tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                        tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                        tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                        tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                        tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                        tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                        await this.core.util.waitUntil(100)
                                                                        await this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                           
                                           
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                await this.core.util.waitUntil(100)
                                                if(data.length > 0)
                                                {
                                                    this.combineControl = true
                                                    this.combineNew = false
                                                    if(data.length == 1)
                                                    {
                                                        await this.addItem(data[0],this.docObj.docOrders.dt().length -1)
                                                    }
                                                    else if(data.length > 1)
                                                    {
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            if(i == 0)
                                                            {
                                                                await this.addItem(data[i],this.docObj.docOrders.dt().length -1)
                                                            }
                                                            else
                                                            {
                                                                let tmpdocOrders = {...this.docObj.docOrders.empty}
                                                                tmpdocOrders.DOC_GUID = this.docObj.dt()[0].GUID
                                                                tmpdocOrders.TYPE = this.docObj.dt()[0].TYPE
                                                                tmpdocOrders.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                tmpdocOrders.LINE_NO = this.docObj.docOrders.dt().length
                                                                tmpdocOrders.REF = this.docObj.dt()[0].REF
                                                                tmpdocOrders.REF_NO = this.docObj.dt()[0].REF_NO
                                                                tmpdocOrders.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                tmpdocOrders.INPUT = this.docObj.dt()[0].INPUT
                                                                tmpdocOrders.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                this.txtRef.readOnly = true
                                                                this.txtRefno.readOnly = true
                                                                this.docObj.docOrders.addEmpty(tmpdocOrders)
                                                                await this.core.util.waitUntil(100)
                                                                await this.addItem(data[i],this.docObj.docOrders.dt().length-1)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                    <Button icon="increaseindent" text={this.lang.t("collectiveItemAdd")}
                                     validationGroup={"frmslsDoc" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.multiItemData.clear
                                            this.popMultiItem.show()
                                            if( typeof this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1] != 'undefined' && this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcInv.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item>
                                <React.Fragment>
                                    <NdGrid parent={this} id={"grdSlsOrder"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'500'} 
                                    width={'100%'}
                                    dbApply={false}
                                    sorting={false}
                                    onRowPrepared={(e) =>
                                    {
                                        if(e.rowType == 'data' && e.data.SHIPMENT_LINE_GUID  != '00000000-0000-0000-0000-000000000000')
                                        {
                                            e.rowElement.style.color ="Silver"
                                        }
                                    }}
                                    onRowUpdating={async (e)=>
                                    {
                                        if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                        {
                                            e.cancel = true
                                            let tmpConfObj =
                                            {
                                                id:'msgRowNotUpdate',showTitle:true,title:this.t("msgRowNotUpdate.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgRowNotUpdate.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRowNotUpdate.msg")}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            e.component.cancelEditData()
                                        }
                                        if(typeof e.newData.PRICE != 'undefined' && e.key.COST_PRICE > e.newData.PRICE )
                                        {
                                            let tmpData = this.sysParam.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
                                            if(typeof tmpData != 'undefined' && tmpData ==  true)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnderPrice1',showTitle:true,title:this.t("msgUnderPrice1.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgUnderPrice1.btn01"),location:'before'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgUnderPrice1.msg")}</div>)
                                                }
                                                
                                                let pResult = await dialog(tmpConfObj);
                                                if(pResult == 'btn01')
                                                {
                                                    
                                                }
                                            }
                                            else
                                            {
                                                e.cancel = true
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnderPrice2',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgUnderPrice2.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgUnderPrice2.msg")}</div>)
                                                }
                                                dialog(tmpConfObj);
                                                e.component.cancelEditData()
                                            }
                                        }
                                        if(typeof e.newData.QUANTITY != 'undefined')
                                        {
                                            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                                            await this.itemRelatedUpdate(e.key.ITEM,e.newData.QUANTITY)
                                            //*****************************************/
                                        }
                                    }}
                                    onRowRemoving={async (e)=>
                                    {
                                        if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                        {
                                            e.cancel = true
                                            let tmpConfObj =
                                            {
                                                id:'msgRowNotDelete',showTitle:true,title:this.t("msgRowNotDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgRowNotDelete.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRowNotDelete.msg")}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            e.component.cancelEditData()
                                        }
                                    }}
                                    onRowUpdated={async(e)=>{

                                        if(typeof e.data.QUANTITY != 'undefined')
                                        {
                                            e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_PRICE_SALE_VAT_EXT](@ITEM_GUID,@QUANTITY,GETDATE(),@CUSTOMER_GUID,@CONTRACT_CODE) AS PRICE",
                                                param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float','CONTRACT_CODE:string|25'],
                                                value : [e.key.ITEM,this.docObj.dt()[0].INPUT,e.data.QUANTITY,this.cmbPriceContract.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
                                                
                                                this._calculateTotal()
                                            }
                                        }
                                        if(typeof e.data.SUB_QUANTITY != 'undefined')
                                        {
                                            e.key.QUANTITY = e.data.SUB_QUANTITY / e.key.SUB_FACTOR
                                        }
                                        if(typeof e.data.PRICE != 'undefined')
                                        {
                                            e.key.SUB_PRICE = e.data.PRICE / e.key.SUB_FACTOR
                                        }
                                        if(typeof e.data.SUB_PRICE != 'undefined')
                                        {
                                            e.key.PRICE = e.data.SUB_PRICE * e.key.SUB_FACTOR
                                        }
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

                                        e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                        e.key.VAT = parseFloat(((((e.key.TOTALHT) - (parseFloat(e.key.DISCOUNT) + parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                        e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)

                                        let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
                                        let tmpMarginRate = (tmpMargin /(e.key.TOTAL - e.key.VAT)) * 100
                                        e.key.MARGIN = tmpMargin + "€ / %" +  tmpMarginRate
                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(4))
                                        }
                                        this._calculateTotal()
                                       
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                    }}
                                    onReady={async()=>
                                    {
                                        await this.grdSlsOrder.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
                                    }}
                                    >
                                        <StateStoring enabled={true} type="localStorage" storageKey={this.props.data.id + "_grdSlsOrder"}/>
                                        <ColumnChooser enabled={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.sip_02_002")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdSlsOrder.clmCreateDate")} width={70} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdSlsOrder.clmCuser")} width={75} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdSlsOrder.clmItemCode")} width={75} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdSlsOrder.clmItemName")} width={240} />
                                        <Column dataField="ITEM_BARCODE" caption={this.t("grdSlsOrder.clmBarcode")} width={100} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdSlsOrder.clmQuantity")} width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                        <Column dataField="SUB_FACTOR" caption={this.t("grdSlsOrder.clmSubFactor")} width={70} allowEditing={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="SUB_QUANTITY" caption={this.t("grdSlsOrder.clmSubQuantity")} dataType={'number'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="PRICE" caption={this.t("grdSlsOrder.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="SUB_PRICE" caption={this.t("grdSlsOrder.clmSubPrice")} dataType={'number'} format={'€#,##0.000'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + "€/ " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdSlsOrder.clmAmount")} width={80} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdSlsOrder.clmDiscount")}  width={60} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdSlsOrder.clmDiscountRate")}  dataType={'number'}  format={'##0.00'} width={60} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MARGIN" caption={this.t("grdSlsOrder.clmMargin")} width={70} allowEditing={false}/>
                                        <Column dataField="VAT" caption={this.t("grdSlsOrder.clmVat")} width={70} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdSlsOrder.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTALHT" caption={this.t("grdSlsOrder.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdSlsOrder.clmTotal")} width={100} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false}/>
                                        <Column dataField="OFFER_REF" caption={this.t("grdSlsOrder.clmOffer")} width={100}  headerFilter={{visible:true}} allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdSlsOrder.clmDescription")} width={100}  headerFilter={{visible:true}}/>
                                    </NdGrid>
                                    </React.Fragment>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id={"frmPurcInv"  + this.tabIndex}>
                                {/* Ara Toplam */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                    maxLength={32}
                                
                                    ></NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDiscount")} alignment="right" />
                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                    maxLength={32}
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
                                                        this.txtDiscountPercent1.value  = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.docObj.docOrders.dt().sum("DISCOUNT_1",3),3)
                                                        this.txtDiscountPrice1.value = this.docObj.docOrders.dt().sum("DISCOUNT_1",2)
                                                        this.txtDiscountPercent2.value  = Number(this.docObj.dt()[0].AMOUNT-parseFloat(this.docObj.docOrders.dt().sum("DISCOUNT_1",3))).rate2Num(this.docObj.docOrders.dt().sum("DISCOUNT_2",3),3)
                                                        this.txtDiscountPrice2.value = this.docObj.docOrders.dt().sum("DISCOUNT_2",2)
                                                        this.txtDiscountPercent3.value  = Number(this.docObj.dt()[0].AMOUNT-(parseFloat(this.docObj.docOrders.dt().sum("DISCOUNT_1",3))+parseFloat(this.docObj.docOrders.dt().sum("DISCOUNT_2",3)))).rate2Num(this.docObj.docOrders.dt().sum("DISCOUNT_3",3),3)
                                                        this.txtDiscountPrice3.value = this.docObj.docOrders.dt().sum("DISCOUNT_3",2)
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
                                {/* İndirim */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtSubTotal")} alignment="right" />
                                    <NdTextBox id="txtSubTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"SUBTOTAL"}}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDocDiscount")} alignment="right" />
                                    <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()  =>
                                                {
                                                    console.log(this.docObj.dt()[0].SUBTOTAL)
                                                    console.log(this.docObj.dt()[0].DOC_DISCOUNT_1)
                                                    console.log( Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.docObj.dt()[0].DOC_DISCOUNT_1,5))
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
                                {/* KDV */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtTotalHt")} alignment="right" />
                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtVat")} alignment="right" />
                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:async ()  =>
                                                {
                                                    this.vatRate.clear()
                                                    for (let i = 0; i < this.docObj.docOrders.dt().groupBy('VAT_RATE').length; i++) 
                                                    {
                                                        let tmpTotalHt  =  parseFloat(this.docObj.docOrders.dt().where({'VAT_RATE':this.docObj.docOrders.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("TOTALHT",2))
                                                        let tmpVat = parseFloat(this.docObj.docOrders.dt().where({'VAT_RATE':this.docObj.docOrders.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                        let tmpData = {"RATE":this.docObj.docOrders.dt().groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat,"TOTALHT":tmpTotalHt}
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
                                {/* KDV */}
                                <EmptyItem colSpan={3}/>
                                
                                <Item>
                                    <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Detay PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'300'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDetail.count")} alignment="right" />
                                    <NdNumberBox id="numDetailCount" parent={this} simple={true} readOnly={true}
                                    maxLength={32}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDetail.quantity")} alignment="right" />
                                    <NdNumberBox id="numDetailQuantity" parent={this} simple={true} readOnly={true}
                                    maxLength={32}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDetail.quantity2")} alignment="right" />
                                    <NdTextBox id="numDetailQuantity2" parent={this} simple={true} readOnly={true}
                                    maxLength={32}
                                    button={[
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:async ()  =>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT " +
                                                            "NAME,ROUND(SUM(UNIT_FACTOR * QUANTITY),2) AS UNIT_FACTOR " +
                                                            "FROM ( " +
                                                            "SELECT ITEM_CODE,QUANTITY, " +
                                                            "(SELECT TOP 1 NAME FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS NAME, " +
                                                            "(SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS UNIT_FACTOR " +
                                                            "FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID OR INVOICE_DOC_GUID = @DOC_GUID ) AS TMP GROUP BY NAME ",
                                                    param : ['DOC_GUID:string|50'],
                                                    value : [this.docObj.dt()[0].GUID]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                this.unitDetailData.clear()
                                                if(tmpData.result.recordset.length > 0)
                                                {   
                                                    for (let i = 0; i < tmpData.result.recordset.length; i++) 
                                                    {
                                                        this.unitDetailData.push(tmpData.result.recordset[i])
                                                    }

                                                    this.popUnit2.show()
                                                }

                                            }
                                        },
                                    ]}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDetail.margin")} alignment="right" />
                                    <NdTextBox id="txtDetailMargin" parent={this} simple={true} readOnly={true}
                                    maxLength={32}/>
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
                                    onRowRemoved={async (e)=>
                                    {
                                        
                                    }}>
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Column dataField="NAME" caption={this.t("grdUnit2.clmName")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                        <Column dataField="UNIT_FACTOR" caption={this.t("grdUnit2.clmQuantity")} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </NdPopUp>
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
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("txtDiscount1")} alignment="right" />
                                    <NdNumberBox id="txtDiscount1" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDiscount2")} alignment="right" />
                                    <NdNumberBox id="txtDiscount2" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDiscount3")} alignment="right" />
                                    <NdNumberBox id="txtDiscount3" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.txtTotalDiscount.value = this.txtDiscount1.value + this.txtDiscount2.value + this.txtDiscount3.value
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtTotalDiscount")} alignment="right" />
                                    <NdNumberBox id="txtTotalDiscount" parent={this} simple={true}  readOnly={true}
                                    maxLength={32}
                                    >
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
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("txtDiscountPer1")} alignment="right" />
                                    <NdNumberBox id="txtDiscountPer1" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDiscountPer2")} alignment="right" />
                                    <NdNumberBox id="txtDiscountPer2" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDiscountPer3")} alignment="right" />
                                    <NdNumberBox id="txtDiscountPer3" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                            </Form>
                        </NdDialog>
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
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {           
                                                
                                                for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                {
                                                    let tmpDocData = this.docObj.docOrders.dt()[i]

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
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                    }
                                                    tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                    tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                }
                                                this._calculateTotal()
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
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {           
                                                
                                                for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                {
                                                    let tmpDocData = this.docObj.docOrders.dt()[i]
                                                    
                                                    tmpDocData.DOC_DISCOUNT_1 = Number(tmpDocData.TOTALHT).rateInc(this.txtDocDiscountPercent1.value,4)
                                                    tmpDocData.DOC_DISCOUNT_2 = Number(((tmpDocData.TOTALHT) - tmpDocData.DOC_DISCOUNT_1)).rateInc(this.txtDocDiscountPercent2.value,4)

                                                    tmpDocData.DOC_DISCOUNT_3 =  Number(((tmpDocData.TOTALHT)-(tmpDocData.DOC_DISCOUNT_1+tmpDocData.DOC_DISCOUNT_2))).rateInc(this.txtDocDiscountPercent3.value,4)
                                                    
                                                    tmpDocData.DOC_DISCOUNT = parseFloat((tmpDocData.DOC_DISCOUNT_1 + tmpDocData.DOC_DISCOUNT_2 + tmpDocData.DOC_DISCOUNT_3).toFixed(4))
                                                    tmpDocData.AMOUNT = parseFloat(((tmpDocData.PRICE * tmpDocData.QUANTITY))).round(2)
                                                    
                                                    if(tmpDocData.VAT > 0)
                                                    {
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                    }
                                                    tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                    tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                                }
                                                this._calculateTotal()
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
                    {/* KDV PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popVatRate"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("popVatRate.title")}
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
                                        <Column dataField="RATE" caption={this.lang.t("grdVatRate.clmRate")} width={120}  headerFilter={{visible:true}} allowEditing={false} />
                                        <Column dataField="VAT" caption={this.lang.t("grdVatRate.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
                                        <Column dataField="TOTALHT" caption={this.lang.t("grdVatRate.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 3}} dataType={'number'} width={120} headerFilter={{visible:true}}/>
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
                                                    for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                    {
                                                        this.docObj.docOrders.dt()[i].VAT = 0  
                                                        this.docObj.docOrders.dt()[i].VAT_RATE = 0
                                                        this.docObj.docOrders.dt()[i].TOTAL = (this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) - this.docObj.docOrders.dt()[i].DISCOUNT
                                                        this._calculateTotal()
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
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popPassword.Password")} alignment="right" />
                                    <NdTextBox id="txtPassword" mode="password" parent={this} simple={true}
                                            maxLength={32}

                                    ></NdTextBox>
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
                                                    this.frmdocOrders.option('disabled',false)
                                                    this.docLocked = false
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPasswordSucces',showTitle:true,title:this.t("msgPasswordSucces.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPasswordSucces.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPasswordSucces.msg")}</div>)
                                                    }
                                        
                                                    await dialog(tmpConfObj);
                                                    this.popPassword.hide();  
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
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT,(SELECT [dbo].[FN_PRICE_SALE_VAT_EXT](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000',NULL)) AS PRICE, " 
                                + "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE DELETED = 0 AND ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={450} defaultSortOrder="asc" />
                        <Column dataField="PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} width={200}  format={{ style: "currency", currency: "EUR",precision: 2}}/>
                    </NdPopGrid>
                      {/* BARKOD POPUP */}
                      <NdPopGrid id={"pg_txtBarcode"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pg_txtBarcode.title")} //
                        search={true}
                        >
                            <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                            <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                            <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                            <Column dataField="MULTICODE" caption={this.t("pg_txtBarcode.clmMulticode")} width={200}/>
                        </NdPopGrid>
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
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
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
                                    onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
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
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    console.log(JSON.stringify(tmpData.result.recordset)) // BAK
                                                    this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
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
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    App.instance.setState({isExecute:true})
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.setState({isExecute:false})
                                                    this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
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
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT EMAIL FROM CUSTOMER_VW_02 WHERE GUID = @GUID",
                                                        param:  ['GUID:string|50'],
                                                        value:  [this.docObj.dt()[0].INPUT]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                        this.popMailSend.show()
                                                    }
                                                    else
                                                    {
                                                        this.popMailSend.show()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                         {/* Toplu Stok PopUp */}
                         <div>
                        <NdPopUp parent={this} id={"popMultiItem"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMultiItem.title")}
                        container={"#root"} 
                        width={'900'}
                        height={'700'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={2} height={'fit-content'}>
                            <Item colSpan={2}>
                                <Label  alignment="right" />
                                    <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}
                                    />
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
                                    height={400} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowRemoved={async (e)=>{
                                     
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Column dataField="CODE" caption={this.t("grdMultiItem.clmCode")} width={150} allowEditing={false} />
                                        <Column dataField="MULTICODE" caption={this.t("grdMultiItem.clmMulticode")} width={150} allowEditing={false} />
                                        <Column dataField="NAME" caption={this.t("grdMultiItem.clmName")} width={300}  headerFilter={{visible:true}} allowEditing={false} />
                                        <Column dataField="QUANTITY" caption={this.t("grdMultiItem.clmQuantity")} dataType={'number'} width={100} headerFilter={{visible:true}}/>
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
                    {/* combineItem Dialog  */}
                    <NdDialog id={"msgCombineItem"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={this.t("msgCombineItem.title")} 
                        showCloseButton={false}
                        width={"500px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}]}
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
                                        <NdCheckBox id="checkCombine" parent={this} simple={true}  
                                        value ={false}
                                        >
                                        </NdCheckBox>
                                    </Item>
                                </Form>
                            </div>
                            </div>
                            <div className='row'>
                        
                            </div>
                        
                    </NdDialog>  
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={this.t("msgQuantity.title")} 
                        showCloseButton={false}
                        width={"400px"}
                        height={"410px"}
                        button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'after'}]}
                        >
                            <div className="row">
                                <div className="col-12 py-2">
                                    <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                                </div>
                                <div className="col-12 py-2">
                                <Form>
                                    {/* checkCustomer */}
                                    <Item>
                                        <Label text={this.t("txtQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQuantity" parent={this} simple={true} 
                                         onEnterKey={(async(e)=>
                                        {
                                            this.msgQuantity._onClick()
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
                                        >
                                    </NdNumberBox>
                                    </Item>
                                    <Item>
                                    <NdSelectBox simple={true} parent={this} id="cmbPopQteUnit"
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async(e)=>
                                        {
                                            this.txtPopQteUnitFactor.setState({value:this.cmbPopQteUnit.data.datatable.where({'GUID':this.cmbPopQteUnit.value})[0].FACTOR});
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
                                    <Label text={this.t("txtUnitFactor")} alignment="right" />
                                    <NdNumberBox id="txtPopQteUnitFactor" parent={this} simple={true}
                                    readOnly={true}
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                    <NdNumberBox id="txtPopQteUnitQuantity" parent={this} simple={true} readOnly={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                       
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                </Form>
                            </div>
                            </div>
                            <div className='row'>
                            
                            </div>
                        
                    </NdDialog>  
                     {/* Adres Seçim POPUP */}
                     <NdPopGrid id={"pg_adress"} showCloseButton={false} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pg_adress.title")} //
                        >
                            <Column dataField="ADRESS" caption={this.t("pg_adress.clmAdress")} width={250} />
                            <Column dataField="CITY" caption={this.t("pg_adress.clmCiyt")} width={150} />
                            <Column dataField="ZIPCODE" caption={this.t("pg_adress.clmZipcode")} width={300} defaultSortOrder="asc" />
                            <Column dataField="COUNTRY" caption={this.t("pg_adress.clmCountry")} width={200}/>
                        </NdPopGrid>
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
                                        this.txtUnitFactor.setState({value:this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].FACTOR});
                                        if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                        {
                                            this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value / this.txtUnitFactor.value).toFixed(3))
                                        }
                                        else
                                        {
                                            this.txtTotalQuantity.value = Number((this.txtUnitQuantity.value * this.txtUnitFactor.value).toFixed(3))
                                        };
                                    }).bind(this)}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtUnitFactor")} alignment="right" />
                                    <NdNumberBox id="txtUnitFactor" parent={this} simple={true}
                                    readOnly={true}
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtUnitQuantity")} alignment="right" />
                                    <NdNumberBox id="txtUnitQuantity" parent={this} simple={true}
                                    maxLength={32}
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
                                    <NdNumberBox id="txtTotalQuantity" parent={this} simple={true} 
                                    maxLength={32} readOnly={true}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtUnitPrice")} alignment="right" />
                                    <NdNumberBox id="txtUnitPrice" parent={this} simple={true} 
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
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
                    {/* Mail Send PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'600'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={32}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={32}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}>
                                    </NdHtmlEditor>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                            validationGroup={"frmMailsend"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    App.instance.setState({isExecute:true})
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.setState({isExecute:false})
                                                    this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
                                                    {
                                                        App.instance.setState({isExecute:true})
                                                        let tmpAttach = pResult.split('|')[1]
                                                        let tmpHtml = this.htmlEditor.value
                                                        if(this.htmlEditor.value.length == 0)
                                                        {
                                                            tmpHtml = ''
                                                        }
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                        }
                                                        let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"commande.pdf",attachData:tmpAttach,text:""}
                                                        this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                        {
                                                            App.instance.setState({isExecute:false})
                                                            let tmpConfObj1 =
                                                            {
                                                                id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                            }
                                                            
                                                            if((pResult1) == 0)
                                                            {  
                                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgMailSendResult.msgSuccess")}</div>)
                                                                await dialog(tmpConfObj1);
                                                                this.htmlEditor.value = '',
                                                                this.txtMailSubject.value = '',
                                                                this.txtSendMail.value = ''
                                                                this.popMailSend.hide();  

                                                            }
                                                            else
                                                            {
                                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMailSendResult.msgFailed")}</div>)
                                                                await dialog(tmpConfObj1);
                                                                this.popMailSend.hide(); 
                                                            }
                                                        });
                                                    });
                                                }
                                                    
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popMailSend.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                </ScrollView>                
            </div>
        )
    }
}