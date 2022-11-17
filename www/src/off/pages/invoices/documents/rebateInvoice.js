import moment from 'moment';
import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,docExtraCls} from '../../../../core/cls/doc.js';

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
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NbPopDescboard from "../../../tools/popdescboard.js";
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class rebateInvoice extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.paymentObj = new docCls();
        this.extraObj = new docExtraCls()
        this.tabIndex = props.data.tabkey

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._getDispatch = this._getDispatch.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this._getPayment = this._getPayment.bind(this)
        this._addPayment = this._addPayment.bind(this)
        this._onItemRendered = this._onItemRendered.bind(this)

        this.frmRebateInv = undefined;
        this.docLocked = false;        
        this.combineControl = true
        this.combineNew = false

        this.rightItems = [{ text: this.t("getDispatch")},{ text: this.t("getProforma")}]
        this.unitDetailData = new datatable

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
        this.paymentObj.clearAll()

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
                this.btnNew.setState({disabled:true});
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

        this.dtDocDate.value = moment(new Date())
        this.dtShipDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 20
        tmpDoc.REBATE = 1
        this.docObj.addEmpty(tmpDoc);

        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
        tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
        tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
        tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        this.docObj.docCustomer.addEmpty(tmpDocCustomer)

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = true
        this.docLocked = false
        
        this.frmRebateInv.option('disabled',true)
        await this.grdRebtInv.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
        await this.grdInvoicePayment.dataRefresh({source:this.paymentObj.docCustomer.dt()});
        await this.grdUnit2.dataRefresh({source:this.unitDetailData})
        let tmpQuery = 
        {
            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 1 ",
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.txtRefno.value = tmpData.result.recordset[0].REF_NO
            this.docObj.docCustomer.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        this.paymentObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:20});
        App.instance.setState({isExecute:false})

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
            this.frmRebateInv.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmRebateInv.option('disabled',false)
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
        this.docObj.dt()[0].AMOUNT = this.docObj.docItems.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docItems.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docItems.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docItems.dt().sum("TOTAL",2)

        this.docObj.docCustomer.dt()[0].AMOUNT = this.docObj.dt()[0].TOTAL
    }
    async _calculateTotalMargin()
    {
        let tmpTotalCost = 0

        for (let  i= 0; i < this.docObj.docItems.dt().length; i++) 
        {
            tmpTotalCost += this.docObj.docItems.dt()[i].COST_PRICE * this.docObj.docItems.dt()[i].QUANTITY
        }
        let tmpMargin = ((this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT) - tmpTotalCost)
        let tmpMarginRate = (tmpMargin / (this.docObj.dt()[0].TOTAL - this.docObj.dt()[0].VAT)) * 100
        this.docObj.dt()[0].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
        console.log(this.docObj.dt()[0].MARGIN)
    }
    async _calculateMargin()
    {
        for(let  i= 0; i < this.docObj.docItems.dt().length; i++)
        {
            let tmpMargin = (this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT) - (this.docObj.docItems.dt()[i].COST_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            let tmpMarginRate = (tmpMargin /(this.docObj.docItems.dt()[i].TOTAL - this.docObj.docItems.dt()[i].VAT)) * 100
            this.docObj.docItems.dt()[i].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
        }
       
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
                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                            await this.core.util.waitUntil(100)
                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                                query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ITEMS_VW_01.UNIT FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
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
                                                let tmpDocItems = {...this.docObj.docItems.empty}
                                                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                tmpDocItems.REF = this.docObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docItems.addEmpty(tmpDocItems)
                                                await this.core.util.waitUntil(100)
                                                await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                    this.grdRebtInv.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
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
                                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
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
                                    this.txtUnitQuantity.value = e.data.QUANTITY / e.data.UNIT_FACTOR
                                }
                                await this.msgUnit.show().then(async () =>
                                {
                                    this.grdRebtInv.devGrid.cellValue(e.rowIndex,"QUANTITY",this.txtTotalQuantity.value)
                                    this.grdRebtInv.devGrid.cellValue(e.rowIndex,"UNIT",this.cmbUnit.value)
                                    this.grdRebtInv.devGrid.cellValue(e.rowIndex,"UNIT_FACTOR",this.txtUnitFactor.value )
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
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitleSubtotal"))
        {        
           
        }
        else if(e.itemData.title == this.t("tabTitlePayments"))
        {
            this._getPayment(this.docObj.dt()[0].GUID)
        }
    }
    async addItem(pData,pIndex,pQuantity)
    {
        App.instance.setState({isExecute:true})
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            if(this.docObj.docItems.dt()[i].ITEM_CODE == pData.CODE)
            {
                if(this.combineControl == true)
                {
                    let tmpCombineBtn = ''
                    App.instance.setState({isExecute:false})
                    await this.msgCombineItem.show().then(async (e) =>
                    {
                        if(e == 'btn01')
                        {
                            this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + pQuantity
                            this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100)* pQuantity )).toFixed(3))
                            this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(3))
                            this.docObj.docItems.dt()[i].TOTAL = parseFloat((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT).toFixed(3))
                            this._calculateTotal()
                            await this.grdRebtInv.devGrid.deleteRow(0)
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
                    this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY +  pQuantity
                    this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100)* pQuantity)).toFixed(3))
                    this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(3))
                    this.docObj.docItems.dt()[i].TOTAL = parseFloat((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT).toFixed(3))
                    this._calculateTotal()
                    await this.grdRebtInv.devGrid.deleteRow(0)
                    return
                }
            }
        }
        this.docObj.docItems.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docItems.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docItems.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docItems.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docItems.dt()[pIndex].DISCOUNT = 0
        this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = 0
        let tmpQuery = 
        {
            query :"SELECT dbo.[FN_CUSTOMER_PRICE](@GUID,@CUSTOMER,@QUANTITY,GETDATE()) AS PRICE",
            param : ['GUID:string|50','CUSTOMER:string|50','QUANTITY:float'],
            value : [pData.GUID,this.docObj.dt()[0].INPUT,pQuantity]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
            this.docObj.docItems.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100)).toFixed(3))
            this.docObj.docItems.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
            this.docObj.docItems.dt()[pIndex].TOTAL = parseFloat((tmpData.result.recordset[0].PRICE + this.docObj.docItems.dt()[pIndex].VAT).toFixed(3))
            this._calculateTotal()
        }
        App.instance.setState({isExecute:false})
    }
    async _getPayment()
    {
        await this.paymentObj.load({PAYMENT_DOC_GUID:this.docObj.dt()[0].GUID});
        if(this.paymentObj.dt().length > 0)
        {
            let tmpRemainder = (this.docObj.dt()[0].TOTAL - this.paymentObj.dt()[0].TOTAL).toFixed(2)
            this.txtRemainder.setState({value:tmpRemainder});
            this.txtMainRemainder.setState({value:tmpRemainder});
            
        }
        else
        {
            this.txtRemainder.setState({value:this.docObj.dt()[0].TOTAL});
            this.txtMainRemainder.setState({value:this.docObj.dt()[0].TOTAL});
        }
       
    }
    async _addPayment(pType,pAmount)
    {
        if(pAmount > this.txtRemainder.value)
        {
            let tmpConfObj =
            {
                id:'msgMoreAmount',showTitle:true,title:this.t("msgMoreAmount.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgMoreAmount.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMoreAmount.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        if(this.paymentObj.dt().length == 0)
        {
            let tmpPay = {...this.paymentObj.empty}
            let tmpQuery = 
            {
                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 200 AND REF = @REF ",
                param : ['REF:string|25'],
                value : [this.txtRef.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                tmpPay.REF = this.txtRef.value
                tmpPay.REF_NO = tmpData.result.recordset[0].REF_NO
            }
            tmpPay.TYPE = 0
            tmpPay.DOC_TYPE = 200
            tmpPay.INPUT = '00000000-0000-0000-0000-000000000000'
            tmpPay.OUTPUT = this.docObj.dt()[0].INPUT 
            this.paymentObj.addEmpty(tmpPay);
        }
        let tmpPayment = {...this.paymentObj.docCustomer.empty}
            tmpPayment.DOC_GUID = this.paymentObj.dt()[0].GUID
            tmpPayment.TYPE = this.paymentObj.dt()[0].TYPE
            tmpPayment.REF = this.paymentObj.dt()[0].REF
            tmpPayment.REF_NO = this.paymentObj.dt()[0].REF_NO
            tmpPayment.DOC_TYPE = this.paymentObj.dt()[0].DOC_TYPE
            tmpPayment.DOC_DATE = this.paymentObj.dt()[0].DOC_DATE
            tmpPayment.OUTPUT = this.paymentObj.dt()[0].OUTPUT
            tmpPayment.INVOICE_GUID = this.docObj.dt()[0].GUID                                   

            if(pType == 0)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 0
                tmpPayment.AMOUNT =pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value
            }
            else if (pType == 1)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 1
                tmpPayment.AMOUNT = pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value

                let tmpCheck = {...this.paymentObj.checkCls.empty}
                tmpCheck.DOC_GUID = this.paymentObj.dt()[0].GUID
                tmpCheck.REF = checkReference.value
                tmpCheck.DOC_DATE =  this.paymentObj.dt()[0].DOC_DATE
                tmpCheck.CHECK_DATE =  this.paymentObj.dt()[0].DOC_DATE
                tmpCheck.CUSTOMER =   this.paymentObj.dt()[0].OUTPUT
                tmpCheck.AMOUNT = pAmount
                tmpCheck.SAFE =  this.cmbCashSafe.value
                this.paymentObj.checkCls.addEmpty(tmpCheck)
            }
            else if (pType == 1)
            {
                tmpPayment.INPUT = this.cmbCashSafe.value
                tmpPayment.INPUT_NAME = this.cmbCashSafe.displayValue
                tmpPayment.PAY_TYPE = 2
                tmpPayment.AMOUNT = pAmount
                tmpPayment.DESCRIPTION = this.cashDescription.value
            }

            await this.paymentObj.docCustomer.addEmpty(tmpPayment)
            this.paymentObj.dt()[0].AMOUNT = this.paymentObj.docCustomer.dt().sum("AMOUNT",2)
            this.paymentObj.dt()[0].TOTAL = this.paymentObj.docCustomer.dt().sum("AMOUNT",2)
            
            if((await this.paymentObj.save()) == 0)
            {
              
            }
            await this._getPayment()
            this.popPayment.show()
    }
    async _getDispatch()
    {
        if(this.docObj.dt()[0].INPUT == '' || this.docObj.dt()[0].INPUT == '00000000-0000-0000-0000-000000000000')
        {
            let tmpConfObj =
            {
                id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        else
        {
            let tmpQuery = 
            {
                query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ITEMS_VW_01 WHERE INPUT = @INPUT AND INVOICE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND REBATE = 1 AND DOC_TYPE IN(40)",
                param : ['INPUT:string|50'],
                value : [this.docObj.dt()[0].INPUT]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {   
                await this.pg_dispatchGrid.setData(tmpData.result.recordset)
            }
            this.pg_dispatchGrid.show()
            this.pg_dispatchGrid.onClick = async(data) =>
            {
                for (let i = 0; i < data.length; i++) 
                {
                    let tmpDocItems = {...this.docObj.docItems.empty}
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
                    tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                    tmpDocItems.INVOICE_GUID = this.docObj.dt()[0].GUID
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.CONNECT_REF = data[i].CONNECT_REF
    
                    await this.docObj.docItems.addEmpty(tmpDocItems,false)
                    await this.core.util.waitUntil(100)
                    this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].stat = 'edit'
                }
                this.docObj.docItems.dt().emit('onRefresh')
                this._calculateTotal()
            }
        }

    }
    async checkRow()
    {
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.docItems.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docItems.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docItems.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docItems.dt()[i].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
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
    async getDocs(pType)
    {
        let tmpQuery 
        if(pType == 0)
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 1 AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE DESC"
            }
        }
        else
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 1 ORDER BY DOC_DATE DESC"
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
    async _getProforma()
    {
        if(this.docObj.dt()[0].INPUT == '' || this.docObj.dt()[0].INPUT == '00000000-0000-0000-0000-000000000000')
        {
            let tmpConfObj =
            {
                id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
            }

            await dialog(tmpConfObj);
            return
        }
        else
        {
            let tmpQuery = 
            {
                query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ITEMS_VW_01 WHERE INPUT = @INPUT AND INVOICE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 1 AND DOC_TYPE IN(120) AND REBATE = 1",
                param : ['INPUT:string|50'],
                value : [this.docObj.dt()[0].INPUT]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {   
                await this.pg_proformaGrid.setData(tmpData.result.recordset)
            }
            else
            {
                await this.pg_proformaGrid.setData([])
            }
    
            this.pg_proformaGrid.show()
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
                    tmpDocItems.PROFORMA_GUID = data[i].GUID
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.CONNECT_REF = data[i].CONNECT_REF
                    tmpDocItems.ORDER_GUID = data[i].ORDER_GUID
                    tmpDocItems.OLD_VAT = data[i].VAT_RATE
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DEPOT_QUANTITY = data[i].DEPOT_QUANTITY
                    tmpDocItems.CUSTOMER_PRICE = data[i].CUSTOMER_PRICE

                    await this.docObj.docItems.addEmpty(tmpDocItems)
                    await this.core.util.waitUntil(100)
                }
              
                this._calculateTotal()
                App.instance.setState({isExecute:false})
                setTimeout(() => {
                    this.btnSave.setState({disabled:false});
                    }, 500);
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmRebateInv"  + this.tabIndex}
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
                                        if(typeof this.docObj.docItems.dt()[0] == 'undefined')
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
                                        if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdRebtInv.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                                
                                                console.log(this.docObj.dt())
                                                if((await this.docObj.save()) == 0)
                                                {                                    
                                                    this._getPayment()                
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
                                        if(this.paymentObj.docCustomer.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgPayNotDeleted',showTitle:true,title:this.t("msgPayNotDeleted.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgPayNotDeleted.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPayNotDeleted.msg")}</div>)
                                            }
                                
                                            await dialog(tmpConfObj);
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
                                            return
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
                                        if(typeof this.docObj.docItems.dt()[0] == 'undefined')
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
                                        if(this.docObj.dt()[0].LOCKED == 0)
                                        {
                                            this.docObj.dt()[0].LOCKED = 1
                                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdRebtInv.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                                this.frmRebateInv.option('disabled',true)
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else
                                        {
                                            this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnInfo" parent={this} icon="info" type="default"
                                    onClick={async()=>
                                    {
                                        this.numDetailCount.value = this.docObj.docItems.dt().length
                                        this.numDetailQuantity.value =  this.docObj.docItems.dt().sum("QUANTITY",2)
                                        let tmpQuantity2 = 0
                                        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_UNIT2_QUANTITY](@ITEM) AS QUANTITY",
                                                param : ['ITEM:string|50'],
                                                value : [this.docObj.docItems.dt()[i].ITEM]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                tmpQuantity2 = tmpQuantity2 + (tmpData.result.recordset[0].QUANTITY * this.docObj.docItems.dt()[i].QUANTITY)
                                            }
                                        }
                                        this.numDetailQuantity2.value = tmpQuantity2.toFixed(3)
                                        this.popDetail.show()
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
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
                            <Form colCount={3} id={"frmRebateInv"  + this.tabIndex}>
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onValueChanged={(async(e)=>
                                            {
                                                this.docObj.docCustomer.dt()[0].REF = this.txtRef.value
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND  TYPE = 1 AND DOC_TYPE = 20 AND REBATE = 1 ",
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
                                                this.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                    <RangeRule min={1} message={this.t("validRefNo")}/>
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
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300} />
                                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} />
                                        <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={300} />
                                        
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
                                            this.docObj.docCustomer.dt()[0].OUTPUT = this.cmbDepot.value
                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                            {
                                                this.frmRebateInv.option('disabled',false)
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
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
                                                    this.docObj.docCustomer.dt()[0].INPUT = data[0].GUID
                                                    this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                    this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.value = data[0].CODE
                                                    }
                                                    if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                    {
                                                        this.frmRebateInv.option('disabled',false)
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
                                                                this.docObj.dt()[0].ADDRESS = pdata[0].TYPE
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
                                                            this.docObj.docCustomer.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE
                                                            } 
                                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmRebateInv.option('disabled',false)
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
                                                                        this.docObj.dt()[0].ADDRESS = pdata[0].TYPE
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
                                        <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
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
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Tedarikçi']}/>
                                        
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
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                        this.docObj.docCustomer.dt()[0].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY") 
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* dtShipDate */}
                                <Item>
                                    <Label text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmRebateInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                 {/* BARKOD EKLEME */}
                                 <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  placeholder={this.t("txtBarcodePlace")}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
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
                                                  
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.setState({value:""})
                                                        let tmpDocItems = {...this.docObj.docItems.empty}
                                                        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                        tmpDocItems.REF = this.docObj.dt()[0].REF
                                                        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                        this.txtRef.readOnly = true
                                                        this.txtRefno.readOnly = true
                                                        this.docObj.docItems.addEmpty(tmpDocItems)
                                                        await this.core.util.waitUntil(100)

                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            if(data.length == 1)
                                                            {
                                                                await this.addItem(data[0],this.docObj.docItems.dt().length -1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        await this.addItem(data[i],this.docObj.docItems.dt().length -1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpDocItems = {...this.docObj.docItems.empty}
                                                                        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                                        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                                        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                        tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                                        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                                        tmpDocItems.REF = this.docObj.dt()[0].REF
                                                                        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                                        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                                        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                                        this.txtRef.readOnly = true
                                                                        this.txtRefno.readOnly = true
                                                                        this.docObj.docItems.addEmpty(tmpDocItems)
                                                                        await this.core.util.waitUntil(100)
                                                                        await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.cmbDepot.value == '')
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
                                        {   query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,VAT,ITEMS_VW_01.UNIT,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = @CUSTOMER AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE,  " + 
                                            "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                            " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.txtPopQuantity.value = ''
                                            setTimeout(async () => 
                                            {
                                               this.txtPopQuantity.focus()
                                            }, 700);
                                            await this.msgQuantity.show().then(async (e) =>
                                            {
                                                let tmpDocItems = {...this.docObj.docItems.empty}
                                                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                tmpDocItems.REF = this.docObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                this.txtRef.readOnly = true
                                                this.txtRefno.readOnly = true
                                                this.docObj.docItems.addEmpty(tmpDocItems)
                                                await this.core.util.waitUntil(100)
                                            });
                                            
                                            this.addItem(tmpData.result.recordset[0],(typeof this.docObj.docItems.dt()[0] == 'undefined' ? 0 : this.docObj.docItems.dt().length-1),this.txtPopQuantity.value)
                                            this.txtBarcode.focus()
                                            
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
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* Vade Tarih */}
                                <Item>
                                    <Label text={this.t("dtExpDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtExpDate"}
                                    dt={{data:this.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmPurcInv"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmRebateInv = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmRebateInv"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            
                                            if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        if(data.length == 1)
                                                        {
                                                            await this.addItem(data[0],this.docObj.docItems.dt().length-1)
                                                        }
                                                        else if(data.length > 1)
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(i == 0)
                                                                {
                                                                    await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                                }
                                                                else
                                                                {
                                                                    let tmpDocItems = {...this.docObj.docItems.empty}
                                                                    tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                                    tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                                    tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                                    tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                                    tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                                    tmpDocItems.REF = this.docObj.dt()[0].REF
                                                                    tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                                    tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                                    tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                                    tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                                    tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                                    this.txtRef.readOnly = true
                                                                    this.txtRefno.readOnly = true
                                                                    this.docObj.docItems.addEmpty(tmpDocItems)
                                                                    await this.core.util.waitUntil(100)
                                                                    await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                           
                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                            await this.core.util.waitUntil(100)
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                this.combineControl = true
                                                this.combineNew = false
                                                if(data.length == 1)
                                                {
                                                    await this.addItem(data[0],this.docObj.docItems.dt().length-1)
                                                }
                                                else if(data.length > 1)
                                                {
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        if(i == 0)
                                                        {
                                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
                                                        }
                                                        else
                                                        {
                                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                                            this.txtRef.readOnly = true
                                                            this.txtRefno.readOnly = true
                                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                                            await this.core.util.waitUntil(100)
                                                            await this.addItem(data[i],this.docObj.docItems.dt().length-1)
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
                                </Item>
                                <Item>
                                 <React.Fragment>
                                    <NdGrid parent={this} id={"grdRebtInv"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>{
                                        if(typeof e.data.QUANTITY != 'undefined')
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_CUSTOMER_PRICE](@ITEM_GUID,@CUSTOMER_GUID,@QUANTITY,GETDATE()) AS PRICE",
                                                param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                                                value : [e.key.ITEM,this.docObj.dt()[0].INPUT,e.data.QUANTITY]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
                                                
                                                this._calculateTotal()
                                            }
                                        }
                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                        {
                                            e.key.DISCOUNT = parseFloat((((e.key.AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(2))
                                        }
                                        if(e.key.COST_PRICE > e.key.PRICE )
                                        {
                                            let tmpData = this.acsobj.filter({ID:'underMinCostPrice',USERS:this.user.CODE}).getValue()
                                            if(typeof tmpData != 'undefined' && tmpData ==  true)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnderPrice1',showTitle:true,title:this.t("msgUnderPrice1.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgUnderPrice1.btn01"),location:'before'},{id:"btn02",caption:this.t("msgUnderPrice1.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgUnderPrice1.msg")}</div>)
                                                }
                                                
                                                let pResult = await dialog(tmpConfObj);
                                                if(pResult == 'btn01')
                                                {
                                                    
                                                }
                                                else if(pResult == 'btn02')
                                                {
                                                    return
                                                }
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgUnderPrice2',showTitle:true,title:this.t("msgUnderPrice2.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgUnderPrice2.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgUnderPrice2.msg"}</div>)
                                                }
                                                dialog(tmpConfObj);
                                                return
                                            }
                                        }
                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscount',showTitle:true,title:this.t("msgDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgDiscount.msg"}</div>)
                                            }
                                        
                                            dialog(tmpConfObj);
                                            e.key.DISCOUNT = 0 
                                            return
                                        }

                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(3));
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3))
                                        e.key.TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +e.key.VAT).toFixed(3))
                                       
                                        let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
                                        let tmpMarginRate = (tmpMargin /(e.key.TOTAL - e.key.VAT)) * 100
                                        e.key.MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat(100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100).toFixed(3))
                                        }
                                        this._calculateTotal()
                                            
                                        
                                    }}
                                    onRowRemoved={async(e)=>{
                                        this._calculateTotal()
                                    }}
                                    >
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.ftr_02_003")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdRebtInv.clmCreateDate")} width={80} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdRebtInv.clmCuser")} width={90} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdRebtInv.clmItemCode")} width={100} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdRebtInv.clmMulticode")} width={105} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdRebtInv.clmItemName")} width={230} />
                                        <Column dataField="ITEM_BARCODE" caption={this.t("grdRebtInv.clmBarcode")} width={110} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdRebtInv.clmQuantity")} width={70} editCellRender={this._cellRoleRender} dataType={'number'} />
                                        <Column dataField="PRICE" caption={this.t("grdRebtInv.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdRebtInv.clmAmount")} width={90} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdRebtInv.clmDiscount")} width={60} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdRebtInv.clmDiscountRate")} width={60} dataType={'number'}/>
                                        <Column dataField="VAT" caption={this.t("grdRebtInv.clmVat")} width={75} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdRebtInv.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdRebtInv.clmTotal")} width={110} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdRebtInv.clmDescription")} width={100} />
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdRebtInv"
                                    onItemClick={(async(e)=>
                                    {
                                        if(e.itemData.text == this.t("getDispatch"))
                                        {
                                            this._getDispatch()
                                        }
                                        else if(e.itemData.text == this.t("getProforma"))
                                        {
                                            this._getProforma()
                                        }
                                        
                                    }).bind(this)} />
                                </React.Fragment>    
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <TabPanel height="100%" onItemRendered={this._onItemRendered}>
                                <Item title={this.t("tabTitleSubtotal")}>
                                <div className="row px-2 pt-2">
                                    <div className="col-12">
                                        <Form colCount={4} parent={this} id={"frmSlsInv"  + this.tabIndex}>
                                            {/* Ara Toplam */}
                                            <EmptyItem colSpan={3}/>
                                            <Item  >
                                            <Label text={this.t("txtAmount")} alignment="right" />
                                                <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                                maxLength={32}
                                            
                                                ></NdTextBox>
                                            </Item>
                                            {/* İndirim */}
                                            <EmptyItem colSpan={3}/>
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
                                                                    this.txtDiscountPercent.value  = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.docObj.dt()[0].DISCOUNT) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(3))
                                                                    this.txtDiscountPrice.value = this.docObj.dt()[0].DISCOUNT
                                                                }
                                                                this.popDiscount.show()
                                                            }
                                                        },
                                                    ]
                                                }
                                                ></NdTextBox>
                                            </Item>
                                            {/* KDV */}
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtVat")} alignment="right" />
                                                <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                                maxLength={32}
                                                button=
                                                {
                                                    [
                                                        {
                                                            id:'01',
                                                            icon:'clear',
                                                            onClick:async ()  =>
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
                                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                                    {
                                                                        this.docObj.docItems.dt()[i].VAT = 0  
                                                                        this.docObj.docItems.dt()[i].VAT_RATE = 0
                                                                        this.docObj.docItems.dt()[i].TOTAL = (this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) - this.docObj.docItems.dt()[i].DISCOUNT
                                                                        this._calculateTotal()
                                                                    }
                                                                }
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
                                </Item>
                                <Item title={this.t("tabTitlePayments")}>
                                <div className="row px-2 pt-2">
                                    <div className="col-12">
                                        <Form colCount={4} parent={this} id={"frmSlsInv"  + this.tabIndex}>
                                            {/* Ödeme Toplam */}
                                             <EmptyItem colSpan={2}/>
                                            <Item>
                                            <Label text={this.t("txtExpFee")} alignment="right" />
                                                <NdNumberBox id="txtExpFee" format={{ style: "currency", currency: "EUR",precision: 2}} parent={this} simple={true} dt={{data:this.docObj.docCustomer.dt('DOC_CUSTOMER'),field:"EXPIRY_FEE"}}
                                                maxLength={32}
                                                ></NdNumberBox>
                                            </Item>
                                            <Item>
                                            <Label text={this.t("txtPayTotal")} alignment="right" />
                                                <NdTextBox id="txtPayTotal" format={{ style: "currency", currency: "EUR",precision: 2}} parent={this} simple={true} readOnly={true} dt={{data:this.paymentObj.dt('DOC'),field:"TOTAL"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            {/* Kalan */}
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtRemainder")} alignment="right" />
                                                <NdTextBox id="txtRemainder" parent={this} simple={true} readOnly={true}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <Label text={this.t("txtbalance")} alignment="right" />
                                                <NdTextBox id="txtbalance" format={{ style: "currency", currency: "EUR",precision: 2}} parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC_CUSTOMER'),field:"INPUT_BALANCE"}}
                                                maxLength={32}
                                                ></NdTextBox>
                                            </Item>
                                            <EmptyItem colSpan={3}/>
                                            <Item>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <NdButton text={this.t("getPayment")} type="normal" stylingMode="contained" width={'100%'} 
                                                    onClick={async (e)=>
                                                    {       
                                                        await this._getPayment()
                                                        this.popPayment.show()
                                                    }}/>
                                                </div>
                                            </div>
                                            </Item>
                                        </Form>
                                    </div>
                                </div>
                                </Item>
                            </TabPanel>
                        </div>
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
                        height={'250'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDiscount.Percent")} alignment="right" />
                                    <NdNumberBox id="txtDiscountPercent" parent={this} simple={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPercent.value > 100)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent.value = 0;
                                                        this.txtDiscountPrice.value = 0;
                                                        return
                                                    }
                                                    this.txtDiscountPrice.value =  parseFloat((this.docObj.dt()[0].AMOUNT * this.txtDiscountPercent.value / 100).toFixed(3))
                                            }).bind(this)}
                                    ></NdNumberBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popDiscount.Price")} alignment="right" />
                                <NdNumberBox id="txtDiscountPrice" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async()=>
                                        {
                                            if( this.txtDiscountPrice.value > this.docObj.dt()[0].AMOUNT)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDiscountPercent.value = 0;
                                                this.txtDiscountPrice.value = 0;
                                                return
                                            }
                                            this.txtDiscountPercent.value = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.txtDiscountPrice.value) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(3))
                                    }).bind(this)}
                                ></NdNumberBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                {
                                                    this.docObj.docItems.dt()[i].DISCOUNT_RATE = this.txtDiscountPercent.value
                                                    this.docObj.docItems.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(3))
                                                    if(this.docObj.docItems.dt()[i].VAT > 0)
                                                    {
                                                        this.docObj.docItems.dt()[i].VAT = parseFloat(((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) * (this.docObj.docItems.dt()[i].VAT_RATE / 100)).toFixed(3))
                                                    }
                                                    this.docObj.docItems.dt()[i].TOTAL = parseFloat(((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) + this.docObj.docItems.dt()[i].VAT - this.docObj.docItems.dt()[i].DISCOUNT).toFixed(3))
                                                }
                                                this._calculateMargin()
                                                this._calculateTotal()
                                                this._calculateTotalMargin()
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
                                                    this.frmRebateInv.option('disabled',false)
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
                     {/* İrsaliye Grid */}
                    <NdPopGrid id={"pg_dispatchGrid"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        selection={{mode:"multiple"}}
                        title={this.t("pg_dispatchGrid.title")} //
                        >
                            <Column dataField="REFERANS" caption={this.t("pg_dispatchGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                            <Column dataField="ITEM_CODE" caption={this.t("pg_dispatchGrid.clmCode")} width={200}/>
                            <Column dataField="ITEM_NAME" caption={this.t("pg_dispatchGrid.clmName")} width={300} />
                            <Column dataField="QUANTITY" caption={this.t("pg_dispatchGrid.clmQuantity")} width={300} />
                            <Column dataField="PRICE" caption={this.t("pg_dispatchGrid.clmPrice")} width={300} />
                            <Column dataField="TOTAL" caption={this.t("pg_dispatchGrid.clmTotal")} width={300} />
                        </NdPopGrid>
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
                                query : "SELECT GUID,CODE,NAME,VAT,UNIT FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Finans PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popPayment"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popPayment.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'800'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={3} height={'fit-content'}>
                            <Item location="after">
                                    <Button icon="add" text={this.t("btnCash")}
                                    validationGroup={"frmPurcInv" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        this.popPayment.hide()
                                        this.numCash.setState({value:0});
                                        this.cashDescription.setState({value:''});
                                        this.popCash.show()
                                    }}/>
                                </Item>
                            </Form>
                                <NdGrid parent={this} id={"grdInvoicePayment"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    headerFilter={{visible:true}}
                                    height={'75%'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowRemoved={async (e)=>{
                                        this.popPayment.hide()
                                        this.paymentObj.dt()[0].AMOUNT = this.paymentObj.docCustomer.dt().sum("AMOUNT",2)
                                        this.paymentObj.dt()[0].TOTAL = this.paymentObj.docCustomer.dt().sum("AMOUNT",2)
                                        this.paymentObj.save()
                                        await this._getPayment()
                                        this.popPayment.show()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdInvoicePayment.clmCreateDate")} width={150} allowEditing={false} headerFilter={{visible:true}}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdInvoicePayment.clmPrice")} width={150}  headerFilter={{visible:true}}/>
                                        <Column dataField="INPUT_NAME" caption={this.t("grdInvoicePayment.clmInputName")} width={150}  headerFilter={{visible:true}}/>
                                        <Column dataField="PAY_TYPE_NAME" caption={this.t("grdInvoicePayment.clmTypeName")} width={150}  headerFilter={{visible:true}}/>
                                </NdGrid>
                                <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} parent={this} >
                                {/* Toplam */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtPayInvoıceTotal")} alignment="right" />
                                    <NdTextBox id="txtPayInvoıceTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                                {/* Ödeme Toplam */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtPayTotal")} alignment="right" />
                                    <NdTextBox id="txtPayTotal" parent={this} simple={true} readOnly={true} dt={{data:this.paymentObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                                {/* Kalan */}
                                <EmptyItem />
                                <Item>
                                <Label text={this.t("txtRemainder")} alignment="right" />
                                    <NdTextBox id="txtMainRemainder" parent={this} simple={true} readOnly={true}
                                    maxLength={32}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                            
                        </NdPopUp>
                    </div> 
                      {/* Cash PopUp */}
                      <div>
                        <NdPopUp parent={this} id={"popCash"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCash.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'400'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                {/* cmbPayType */}
                                <Item>
                                    <Label text={this.t("cmbPayType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPayType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async(e)=>
                                        {
                                            this.cmbCashSafe.value = ''
                                            let tmpQuery
                                            if(e.value == 0)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 1)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 1"}
                                            }
                                            else if(e.value == 2)
                                            {
                                                tmpQuery = {query : "SELECT * FROM BANK_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 3)
                                            {
                                                tmpQuery = {query : "SELECT * FROM BANK_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 4)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                            else if(e.value == 5)
                                            {
                                                tmpQuery = {query : "SELECT * FROM SAFE_VW_01 WHERE TYPE = 0"}
                                            }
                                    
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {   
                                                this.cmbCashSafe.setData(tmpData.result.recordset)
                                            }
                                            else
                                            {
                                                this.cmbCashSafe.setData([])
                                            }
                                        }).bind(this)}
                                    data={{source:[{ID:0,VALUE:this.t("cmbPayType.cash")},{ID:1,VALUE:this.t("cmbPayType.check")},{ID:2,VALUE:this.t("cmbPayType.bankTransfer")},{ID:3,VALUE:this.t("cmbPayType.otoTransfer")},{ID:4,VALUE:this.t("cmbPayType.foodTicket")},{ID:5,VALUE:this.t("cmbPayType.bill")}]}}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* cmbCashSafe */}
                                <Item>
                                    <Label text={this.t("cmbCashSafe")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbCashSafe"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    notRefresh={true}
                                    onValueChanged={(async()=>
                                        {

                                        }).bind(this)}
                                    param={this.param.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbCashSafe',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                            <RequiredRule message={this.t("ValidCash")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("cash")} alignment="right" />
                                    <div className='row'>
                                        <div className="col-4 pe-0">
                                            <NdNumberBox id="numCash" parent={this} simple={true}
                                            maxLength={32}                                        
                                            param={this.param.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'numCash',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmPayCash"  + this.tabIndex}>
                                                <RequiredRule message={this.t("ValidCash")} />
                                            </Validator>  
                                            </NdNumberBox>
                                        </div>
                                        <div className="col-6 pe-0">
                                            <Button icon="revert" text={this.t("getRemainder")}
                                            onClick={async (e)=>
                                            {
                                                this.numCash.value = this.txtRemainder.value
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                                <Item>
                                    <Label text={this.t("description")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="cashDescription" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'cashDescription',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cashDescription',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCash.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmPayCash"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    if(this.cmbPayType.value == 1)
                                                    {
                                                        this.popCheck.show()
                                                    }
                                                    else
                                                    {
                                                        this._addPayment(this.cmbPayType.value,this.numCash.value)
                                                        this.popCash.hide();  
                                                    }
                                                }
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popCash.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                      {/* check PopUp */}
                      <div>
                        <NdPopUp parent={this} id={"popCheck"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCheck.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'500'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                               
                                <Item>
                                    <Label text={this.t("checkReference")} alignment="right" />
                                    <div className="col-12 pe-0">
                                        <NdTextBox id="checkReference" parent={this} simple={true} width={500}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}                                        
                                        param={this.param.filter({ELEMENT:'checkReference',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'checkReference',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </div>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popCheck.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            validationGroup={"frmCollCheck" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                    this._addPayment(1,this.numCash.value)
                                                    this.popCheck.hide(); 
                                                    this.popCash.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popCheck.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    {/* Dizayn Seçim PopUp */}
                    <div>
                    <NdPopUp parent={this} id={"popDesign"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popDesign.title")}
                    container={"#root"} 
                    width={'500'}
                    height={'250'}
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
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '16'"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmPurcOrderPrint"  + this.tabIndex}>
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
                                data={{source:[{ID:"FR",VALUE:"FR"},{ID:"TR",VALUE:"TR"}]}}
                                >
                                </NdSelectBox>
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {   let tmpQuery = 
                                            {
                                                query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                param:  ['DOC_GUID:string|50','DESIGN:string|25'],
                                                value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
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
                                            this.popDesign.hide();  
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
                        width={"350px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'after'}]}
                        >
                            <div className="row">
                                <div className="col-12 py-2">
                                    <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                                </div>
                                <div className="col-12 py-2">
                                <Form>
                                    <Item>
                                        <Label text={this.t("txtQuantity")} alignment="right" />
                                        <NdNumberBox id="txtPopQuantity" parent={this} simple={true}  
                                        onEnterKey={(async(e)=>
                                        {
                                            this.msgQuantity._onClick()
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
                      {/* Detay PopUp */}
                      <div>
                        <NdPopUp parent={this} id={"popDetail"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDetail.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#root'}}
                        >
                        <Form colCount={1} height={'fit-content'}>
                        <Item>
                        <Label text={this.t("popDetail.count")} alignment="right" />
                        <NdNumberBox id="numDetailCount" parent={this} simple={true} readOnly={true}
                        maxLength={32}
                        ></NdNumberBox>
                        </Item>
                        <Item>
                        <Label text={this.t("popDetail.quantity")} alignment="right" />
                        <NdNumberBox id="numDetailQuantity" parent={this} simple={true} readOnly={true}
                        maxLength={32}
                        ></NdNumberBox>
                        </Item>
                        <Item>
                        <Label text={this.t("popDetail.quantity2")} alignment="right" />
                        <NdTextBox id="numDetailQuantity2" parent={this} simple={true} readOnly={true}
                        maxLength={32}
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
                        query : "SELECT " +
                        "NAME,ROUND(SUM(UNIT_FACTOR * QUANTITY),2) AS UNIT_FACTOR " +
                        "FROM ( " +
                        "SELECT ITEM_CODE,QUANTITY, " +
                        "(SELECT TOP 1 NAME FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS NAME, " +
                        "(SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID= ITEM AND TYPE = 1 ) AS UNIT_FACTOR " +
                        "FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID OR INVOICE_GUID = @DOC_GUID ) AS TMP GROUP BY NAME ",
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
                        ]
                        }
                        ></NdTextBox>
                        </Item>
                        </Form>
                        </NdPopUp>
                    </div>  
                    {/* Birim PopUp */}
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
                                    onRowRemoved={async (e)=>{
                                     
                                    }}
                                    >
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
                     {/* Adres Seçim Grid */}
                     <NdPopGrid id={"pg_adress"} parent={this} container={"#root"}
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
                                        this.txtTotalQuantity.value = this.txtUnitQuantity.value * this.txtUnitFactor.value;
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
                                    this.txtTotalQuantity.value = this.txtUnitQuantity.value * this.txtUnitFactor.value
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                    <NdNumberBox id="txtTotalQuantity" parent={this} simple={true}  readOnly={true}
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
                                </Item>
                            </Form>
                        </NdDialog>
                    </div>
                    {/* Proforma Grid */}
                    <NdPopGrid id={"pg_proformaGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_proformaGrid.title")} //
                    >
                        <Column dataField="REFERANS" caption={this.t("pg_proformaGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_proformaGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_proformaGrid.clmName")} width={450} />
                        <Column dataField="QUANTITY" caption={this.t("pg_proformaGrid.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_proformaGrid.clmPrice")} width={200} />
                        <Column dataField="TOTAL" caption={this.t("pg_proformaGrid.clmTotal")} width={200} />
                    </NdPopGrid>
                    <NbPopDescboard id={"popDeleteDesc"} parent={this} width={"900"} height={"400"} position={"#root"} head={this.lang.t("popDeleteDesc.head")} title={this.lang.t("popDeleteDesc.title")} 
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
                </ScrollView>
            </div>
        )
    }
}