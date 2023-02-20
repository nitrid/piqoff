import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,docOrdersCls,docExtraCls } from '../../../../core/cls/doc.js';
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
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NbPopDescboard from "../../../tools/popdescboard.js";
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class purchaseOrder extends React.PureComponent
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
        this._getItems = this._getItems.bind(this)
        this._getBarcodes = this._getBarcodes.bind(this)

        this.frmdocOrders = undefined;
        this.docLocked = false;   
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false
        this.tabIndex = props.data.tabkey


        this.multiItemData = new datatable
        this.underPriceData = new datatable
        this.rightItems = [{ text: this.t("getOffers")}]

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
        this.dtDocDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        this.frmdocOrders.option('disabled',true)

        await this.grdPurcOrders.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});
        await this.grdUnderPrice.dataRefresh({source:this.underPriceData});
        this._getBarcodes()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        console.log(pGuid)
        this.docObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:60});
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
            this.frmdocOrders.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmdocOrders.option('disabled',false)
        }
        this._getItems()
        this._getBarcodes()
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
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docOrders.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docOrders.dt().sum("TOTAL",2)
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
                            this.customerControl = true
                            this.customerClear = false
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
                            query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ITEMS_VW_01.UNIT FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        
                        if(tmpData.result.recordset.length > 0)
                        {
                            this.customerControl = true
                            this.customerClear = false
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
                button={
                [
                    {
                        id:'01',
                        icon:'more',
                        onClick:()  =>
                        {
                            this.pg_txtItemsCode.show()
                            this.pg_txtItemsCode.onClick = async(data) =>
                            {
                                this.customerControl = true
                                this.customerClear = false
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
                    },
                ]}
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
                    this.grdPurcOrders.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
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
                                    this.txtUnitQuantity.value = e.data.QUANTITY / e.data.UNIT_FACTOR

                                }
                                await this.msgUnit.show().then(async () =>
                                {
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                    {
                                        e.data.PRICE = parseFloat((this.txtUnitPrice.value * this.txtUnitFactor.value).toFixed(4))
                                    }
                                    else
                                    {
                                        e.data.PRICE = parseFloat((this.txtUnitPrice.value / this.txtUnitFactor.value).toFixed(4))
                                    }
                                    e.data.QUANTITY = this.txtTotalQuantity.value
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(4));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(4))
                                    e.data.TOTALHT = parseFloat(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT).toFixed(4))
                                    e.data.TOTAL = parseFloat((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT).toFixed(4))
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                    //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                                    await this.itemRelatedUpdate(e.data.ITEM,this.txtTotalQuantity.value)
                                    //*****************************************/
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
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }

        let tmpCheckQuery = 
        {
            query :"SELECT MULTICODE,(SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM_GUID,CUSTOMER_GUID,@QUANTITY,GETDATE())) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
            value : [pData.CODE,this.docObj.dt()[0].OUTPUT,pQuantity]
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 

        if(tmpCheckData.result.recordset.length > 0)
        {  
            this.docObj.docOrders.dt()[pIndex].MULTICODE = tmpCheckData.result.recordset[0].MULTICODE
        }

        if(this.customerControl == true)
        {
            if(tmpCheckData.result.recordset.length == 0)
            {   
                let tmpCustomerBtn = ''

                if(this.customerClear == true)
                {
                    await this.grdPurcOrders.devGrid.deleteRow(0)
                    return 
                }
                App.instance.setState({isExecute:false})
                await this.msgCustomerNotFound.show().then(async (e) =>
                {
                   if(e == 'btn01' && this.checkCustomer.value == true)
                    {
                        this.customerControl = false
                        return
                    }

                    if(e == 'btn02')
                    {
                        tmpCustomerBtn = e
                        await this.grdPurcOrders.devGrid.deleteRow(0)
                        if(this.checkCustomer.value == true)
                        {
                            this.customerClear = true
                        }
                        return 
                    }
                })

                if(tmpCustomerBtn == 'btn02')
                {
                    return
                }
            }
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
                            this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity).toFixed(9))
                            this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(9))
                            this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT).toFixed(9))
                            this._calculateTotal()
                            await this.grdPurcOrders.devGrid.deleteRow(0)
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
                    this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity).toFixed(9))
                    this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(9))
                    this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT).toFixed(9))
                    this._calculateTotal()                    
                    await this.grdPurcOrders.devGrid.deleteRow(0)
                    //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                    await this.itemRelated(pData.GUID,this.docObj.docOrders.dt()[i].QUANTITY)
                    //*****************************************/
                    App.instance.setState({isExecute:false})
                    return
                }
            }
        }

        this.docObj.docOrders.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docOrders.dt()[pIndex].MULTICODE = pData.MULTICODE
        this.docObj.docOrders.dt()[pIndex].ITEM_BARCODE = pData.BARCODE
        this.docObj.docOrders.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docOrders.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docOrders.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docOrders.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docOrders.dt()[pIndex].DISCOUNT = 0
        this.docObj.docOrders.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docOrders.dt()[pIndex].QUANTITY = pQuantity

        let tmpQuery = 
        {
            query :"SELECT (SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM_GUID,CUSTOMER_GUID,@QUANTITY,GETDATE())) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID ORDER BY LDATE DESC",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
            value : [pData.CODE,this.docObj.dt()[0].OUTPUT,pQuantity]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 

        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.docOrders.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(9))
            this.docObj.docOrders.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(9))
            this.docObj.docOrders.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE * pQuantity).toFixed(9) )
            this.docObj.docOrders.dt()[pIndex].TOTAL = parseFloat(((tmpData.result.recordset[0].PRICE * pQuantity)+ this.docObj.docOrders.dt()[pIndex].VAT).toFixed(9))
            this._calculateTotal()
        }
        else
        {
            this.docObj.docOrders.dt()[pIndex].PRICE =0
            this.docObj.docOrders.dt()[pIndex].VAT = 0
            this.docObj.docOrders.dt()[pIndex].AMOUNT = 0
            this.docObj.docOrders.dt()[pIndex].TOTAL = 0
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
                        query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE GUID = @GUID",
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
                            this.docObj.docOrders.dt()[x].VAT = parseFloat((this.docObj.docOrders.dt()[x].VAT + (this.docObj.docOrders.dt()[x].PRICE * (this.docObj.docOrders.dt()[x].VAT_RATE / 100) * pQuantity)).toFixed(4))
                            this.docObj.docOrders.dt()[x].AMOUNT = parseFloat((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTAL = parseFloat((((this.docObj.docOrders.dt()[x].QUANTITY * this.docObj.docOrders.dt()[x].PRICE) - this.docObj.docOrders.dt()[x].DISCOUNT) + this.docObj.docOrders.dt()[x].VAT).toFixed(4))
                            this.docObj.docOrders.dt()[x].TOTALHT =  parseFloat((this.docObj.docOrders.dt()[x].TOTAL - this.docObj.docOrders.dt()[x].VAT).toFixed(4))
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
    async _getItems()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME,VAT,UNIT,ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE DELETED = 0 AND ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE," + 
                    "ISNULL((SELECT TOP 1 CUSTOMER_PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),COST_PRICE) AS PURC_PRICE,"+
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                    param : ['VAL:string|50']
                },
                sql:this.core.sql
            }
        }
        this.pg_txtItemsCode.setSource(tmpSource)
    } 
    async _getBarcodes()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {   query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,VAT,BARCODE,ITEMS_VW_01.UNIT,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = '"+this.docObj.dt()[0].OUTPUT+"' AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE,  " + 
                    "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                    " FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE  ITEM_BARCODE_VW_01.BARCODE LIKE  '%' +@BARCODE",
                    param : ['BARCODE:string|50'],
                },
                sql:this.core.sql
            }
        }
        this.pg_txtBarcode.setSource(tmpSource)
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
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') = @VALUE " ,
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
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
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
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false

        for (let i = 0; i < this.multiItemData.length; i++) 
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
    async _getOffers()
    {
        if(this.docObj.dt()[0].OUTPUT == '' || this.docObj.dt()[0].OUTPUT == '00000000-0000-0000-0000-000000000000')
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
                query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_OFFERS_VW_01 WHERE OUTPUT = @OUTPUT AND ORDER_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN(61)",
                param : ['OUTPUT:string|50'],
                value : [this.docObj.dt()[0].OUTPUT]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {   
                await this.pg_offersGrid.setData(tmpData.result.recordset)
            }
            else
            {
                await this.pg_offersGrid.setData([])
            }
    
            this.pg_offersGrid.show()
            this.pg_offersGrid.onClick = async(data) =>
            {
                App.instance.setState({isExecute:true})
                for (let i = 0; i < data.length; i++) 
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
                    tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.MULTICODE = data[i].MULTICODE
                    tmpDocItems.ITEM_BARCODE = data[i].ITEM_BARCODE
                    tmpDocItems.OFFER_LINE_GUID = data[i].GUID,
                    tmpDocItems.OFFER_DOC_GUID = data[i].DOC_GUID,
                    tmpDocItems.OFFER_REF = data[i].REF + '-' + data[i].REF_NO


                    await this.docObj.docOrders.addEmpty(tmpDocItems)
                    await this.core.util.waitUntil(100)
                }
                this._calculateTotal()
                App.instance.setState({isExecute:false})
            }
        }

    }
    async getDocs(pType)
    {
        let tmpQuery 
        if(pType == 0)
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0 AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE DESC"
            }
        }
        else
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0 ORDER BY DOC_DATE DESC"
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPurcOrder"  + this.tabIndex}
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
                                        let tmpPricePrm = this.sysParam.filter({ID:'pruchasePriceAlert',USERS:this.user.CODE}).getValue()
                                        if(typeof tmpPricePrm != 'undefined' && tmpPricePrm.value == true)
                                        {
                                            this.underPriceData.clear()
                                            App.instance.setState({isExecute:true})
                                            for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT ISNULL((SELECT NAME FROM ITEMS WHERE ITEMS.GUID = ITEM_MULTICODE.ITEM),'') AS ITEM_NAME,ISNULL((SELECT CODE FROM ITEMS WHERE ITEMS.GUID = ITEM_MULTICODE.ITEM),'') AS ITEM_CODDE, " +
                                                   " ISNULL((SELECT TITLE FROM CUSTOMER_VW_01 WHERE CUSTOMER_VW_01.GUID = ITEM_MULTICODE.CUSTOMER),'') AS CUSTOMER_NAME,CODE AS MULTICODE,  "+
                                                   "(SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM,CUSTOMER,@QUANTITY,GETDATE())) AS PRICE FROM ITEM_MULTICODE WHERE  DELETED = 0 AND ITEM = @ITEM_CODE AND (SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM,CUSTOMER,@QUANTITY,GETDATE())) < @PRICE " ,
                                                    param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float','PRICE:float'],
                                                    value : [this.docObj.docOrders.dt()[i].ITEM,this.docObj.dt()[0].OUTPUT,this.docObj.docOrders.dt()[i].QUANTITY,this.docObj.docOrders.dt()[i].PRICE]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    for (let i = 0; i < tmpData.result.recordset.length; i++) 
                                                    {
                                                        this.underPriceData.push(tmpData.result.recordset[i])
                                                    }
                                                }
                                            }
                                            App.instance.setState({isExecute:false})
                                            if(this.underPriceData.length > 0)
                                            {
                                                await this.popUnderPrice.show().then(async (e) =>
                                                {

                                                })
                                            }
                                        }
                                        if(this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdPurcOrders.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
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
                                                await this.grdPurcOrders.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
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
                            <Form colCount={3} id="frmPurcOrder">
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
                                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 60 AND REF = @REF ",
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
                                                    <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
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
                                                        query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND  TYPE = 0 AND DOC_TYPE = 60 ",
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
                                                    <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
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
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} />
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={120}  />
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300}  />
                                        <Column dataField="OUTPUT_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300}  />
                                        <Column dataField="OUTPUT_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300}  />
                                    </NdPopGrid>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
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
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
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
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                            this.pg_txtCustomerCode.show()
                                            this.pg_txtCustomerCode.onClick = async(data) =>
                                            { 
                                                if(data.length > 0)
                                                {
                                                    this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                    this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                    this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                 
                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                   
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.value = data[0].CODE;
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
                                                    this._getItems()
                                                    this._getBarcodes()
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
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                            this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                            
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE;
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
                                                            this._getItems()
                                                            this._getBarcodes()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
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
                                    title={this.t("pg_txtCustomerCode.title")} 
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
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Fournisseur','Her Ikisi']}/>
                                    </NdPopGrid>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}} 
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
                                    validationGroup={"frmPurcOrder" + this.tabIndex}
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
                                                                this.customerControl = true
                                                                this.customerClear = false
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
                                        {   
                                            query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER)",
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        console.log(tmpData)
                                       
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.txtPopQuantity.value = 1
                                            setTimeout(async () => 
                                            {
                                               this.txtPopQuantity.focus()
                                            }, 700);
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
                                            
                                                this.addItem(tmpData.result.recordset[0],(typeof this.docObj.docOrders.dt()[0] == 'undefined' ? 0 : this.docObj.docOrders.dt().length-1),this.txtPopQuantity.value)
                                            })
                                        }
                                        else
                                        {
                                            await this.pg_txtItemsCode.setVal(this.txtBarcode.value)
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
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
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
                                    validationGroup={"frmPurcOrder"  + this.tabIndex}
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
                                                        this.customerControl = true
                                                        this.customerClear = false
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        if(data.length > 0)
                                                        {
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
                                                    this.customerControl = true
                                                    this.customerClear = false
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
                                    validationGroup={"frmPurcOrder"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.multiItemData.clear
                                            this.popMultiItem.show()

                                            if( typeof this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1] != 'undefined' && this.docObj.docOrders.dt()[this.docObj.docOrders.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcOrders.devGrid.deleteRow(this.docObj.docOrders.dt().length - 1)
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
                                    <NdGrid parent={this} id={"grdPurcOrders"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'500'} 
                                    width={'100%'}
                                    dbApply={false}
                                    filterRow={{visible:true}}
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
                                    onRowUpdated={async(e)=>
                                    {
                                        if(typeof e.data.QUANTITY != 'undefined')
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_CUSTOMER_PRICE](@ITEM_GUID,@CUSTOMER_GUID,@QUANTITY,GETDATE()) AS PRICE",
                                                param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                                                value : [e.key.ITEM,this.docObj.dt()[0].OUTPUT,e.data.QUANTITY]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(9))
                                                
                                                this._calculateTotal()
                                            }
                                        }
                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                        {
                                            e.key.DISCOUNT = parseFloat((((e.key.AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(9))
                                        }

                                        if(e.key.DISCOUNT > (e.key.PRICE * e.key.QUANTITY))
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDiscount',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDiscount.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgDiscount.msg"}</div>)
                                            }
                                            dialog(tmpConfObj);
                                            e.key.DISCOUNT = 0 
                                            return
                                        }

                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(9));
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(9))
                                        e.key.TOTAL = parseFloat((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) +e.key.VAT).toFixed(9))
                                        
                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat(100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100).toFixed(9))
                                        }
                                        this._calculateTotal()
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                    }}
                                    >
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.sip_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcOrders.clmCreateDate")} width={80} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdPurcOrders.clmCuser")} width={90} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdPurcOrders.clmItemCode")} width={105} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdPurcOrders.clmMulticode")} width={100} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdPurcOrders.clmItemName")} width={230} />
                                        <Column dataField="ITEM_BARCODE" caption={this.t("grdPurcOrders.clmBarcode")} width={110} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdPurcOrders.clmQuantity")} width={70} editCellRender={this._cellRoleRender} dataType={'number'}/>
                                        <Column dataField="PRICE" caption={this.t("grdPurcOrders.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdPurcOrders.clmAmount")} width={90} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdPurcOrders.clmDiscount")} width={60} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdPurcOrders.clmDiscountRate")} width={60} dataType={'number'}/>
                                        <Column dataField="VAT" caption={this.t("grdPurcOrders.clmVat")} width={75} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdPurcOrders.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdPurcOrders.clmTotal")} width={110} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="OFFER_REF" caption={this.t("grdPurcOrders.clmOffer")} width={110}  headerFilter={{visible:true}} allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdPurcOrders.clmDescription")} width={100}  headerFilter={{visible:true}}/>
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdPurcOrders"
                                    onItemClick={(async(e)=>
                                    {
                                        if(e.itemData.text == this.t("getOffers"))
                                        {
                                            this._getOffers()
                                        }
                                    }).bind(this)} />
                                 </React.Fragment>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id="frmPurcOrder">
                                {/* Ara Toplam-Stok Ekle */}
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
                                                            this.txtDiscountPercent.value  = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.docObj.dt()[0].DISCOUNT) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(9))
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
                                                        for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
                                                        {
                                                            this.docObj.docOrders.dt()[i].VAT = 0  
                                                            this.docObj.docOrders.dt()[i].VAT_RATE = 0
                                                            this.docObj.docOrders.dt()[i].TOTAL = (this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) - this.docObj.docOrders.dt()[i].DISCOUNT
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
                                    //param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
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
                                                    this.txtDiscountPrice.value =  parseFloat((this.docObj.dt()[0].AMOUNT * this.txtDiscountPercent.value / 100).toFixed(9))
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
                                                    this.txtDiscountPercent.value = parseFloat((100 - (((this.docObj.dt()[0].AMOUNT - this.txtDiscountPrice.value) / this.docObj.dt()[0].AMOUNT) * 100)).toFixed(9))
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
                                                        this.docObj.docOrders.dt()[i].DISCOUNT_RATE = this.txtDiscountPercent.value
                                                        this.docObj.docOrders.dt()[i].DISCOUNT =  parseFloat((((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * this.txtDiscountPercent.value) / 100).toFixed(9))
                                                        
                                                        if(this.docObj.docOrders.dt()[i].VAT > 0)
                                                        {
                                                            this.docObj.docOrders.dt()[i].VAT = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)).toFixed(9))
                                                        }
                                                        this.docObj.docOrders.dt()[i].TOTAL = parseFloat(((this.docObj.docOrders.dt()[i].PRICE * this.docObj.docOrders.dt()[i].QUANTITY) + this.docObj.docOrders.dt()[i].VAT - this.docObj.docOrders.dt()[i].DISCOUNT).toFixed(9))
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
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="MULTICODE" caption={this.t("pg_txtItemsCode.clmMulticode")} width={200}/>
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                        <Column dataField="PURC_PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} width={300}  />
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
                                        data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '09'"},sql:this.core.sql}}}
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
                                            
                                        ></NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ORDERS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25'],
                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                console.log(JSON.stringify(tmpData.result.recordset)) //BAK
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
                                    <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}/>
                                </Item>
                                <EmptyItem />       
                                <Item>
                                    <Label text={this.t("cmbMultiItemType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMultiItemType" height='fit-content' 
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={0}
                                    data={{source:[{ID:0,VALUE:this.t("cmbMultiItemType.customerCode")},{ID:1,VALUE:this.t("cmbMultiItemType.ItemCode")}]}}/>
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
                                    <NdGrid
                                    parent={this} id={"grdMultiItem"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    headerFilter={{visible:true}}
                                    filterRow = {{visible:true}}
                                    height={400} 
                                    width={'100%'}
                                    dbApply={false}
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
                                        <div className='col-6'></div>
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
                      {/* notCustomer Dialog  */}
                      <NdDialog id={"msgCustomerNotFound"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={this.t("msgCustomerNotFound.title")} 
                        showCloseButton={false}
                        width={"500px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:this.t("msgCustomerNotFound.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCustomerNotFound.btn02"),location:'after'}]}
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
                                            <NdCheckBox id="checkCustomer" parent={this} simple={true}  
                                            value ={false}
                                            >
                                            </NdCheckBox>
                                        </Item>
                                    </Form>
                                </div>
                            </div>
                        <div className='row'></div>
                    </NdDialog>  
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
                        <div className='row'></div>
                    </NdDialog>  
                    {/*Düşük Fiyat PopUp */}
                    <div>
                        <NdDialog parent={this} id={"popUnderPrice"} 
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popUnderPrice.title")}
                        container={"#root"} 
                        width={'1200'}
                        height={'700'}
                        position={{of:'#root'}}
                        button={[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}]}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item >
                                    <NdGrid
                                    parent={this} id={"grdUnderPrice"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    headerFilter={{visible:true}}
                                    filterRow = {{visible:true}}
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                        <Column dataField="ITEM_CODDE" caption={this.t("grdUnderPrice.clmCode")} width={150} allowEditing={false} />
                                        <Column dataField="MULTICODE" caption={this.t("grdUnderPrice.clmMulticode")} width={150} allowEditing={false} />
                                        <Column dataField="ITEM_NAME" caption={this.t("grdUnderPrice.clmItemName")} width={350} allowEditing={false} />
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("grdUnderPrice.clmCustomerName")} width={250} allowEditing={false} />
                                        <Column dataField="PRICE" caption={this.t("grdUnderPrice.clmPrice")} width={100} allowEditing={false} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </NdDialog>
                    </div>  
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
                    {/* Teklif Grid */}
                    <NdPopGrid id={"pg_offersGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_offersGrid.title")} //
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="REFERANS" caption={this.t("pg_offersGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_offersGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_offersGrid.clmName")} width={500} />
                        <Column dataField="QUANTITY" caption={this.t("pg_offersGrid.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_offersGrid.clmPrice")} width={200} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                        <Column dataField="TOTAL" caption={this.t("pg_offersGrid.clmTotal")} width={300} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                    </NdPopGrid>
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
                                        this.txtTotalQuantity.value = Number(this.txtUnitQuantity.value * this.txtUnitFactor.value);
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
                                       this.txtTotalQuantity.value = Number(this.txtUnitQuantity.value * this.txtUnitFactor.value)
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
                </ScrollView>                
            </div>
        )
    }
}