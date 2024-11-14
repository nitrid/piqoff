import moment from 'moment';

import React from 'react';
import App from '../../../lib/app.js';
import DocBase from '../../../tools/DocBase.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, RequiredRule, RangeRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import NdDocAi from '../../../tools/NdDocAi';

export default class purchaseInvoice extends DocBase
{
    constructor(props)
    {
        super(props)

        this.type = 0;
        this.docType = 20;
        this.rebate = 0;

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)

        this.frmDocItems = undefined;
        this.docLocked = false;
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false

        this.rightItems = [{ text: this.t("getDispatch")},{ text: this.t("getOrders")},{ text: this.t("getOffers")},{ text: this.t("getProforma")}]
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(100)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            if(typeof this.pagePrm.GUID != 'undefined')
            {
                setTimeout(() => 
                {
                    this.getDoc(this.pagePrm.GUID,'',0)
                }, 1000);
            }
            else if(typeof this.pagePrm.piqx != 'undefined')
            {
                setTimeout(() => 
                    {
                        this.initPiqX()
                    }, 1000);
                
            }
        }
    }
    async initPiqX()
    {
        this.piqX = this.pagePrm.piqx
        let jData = JSON.parse(this.piqX[0].JSON)

        if(jData.length > 0)
        {
            let tmpCustQuery = 
            {
                query : "SELECT * FROM CUSTOMERS WHERE TAX_NO = @TAX_NO",
                param : ['TAX_NO:string|25'],
                value : [this.piqX[0].DOC_FROM_NO]
            }

            let tmpCustData = await this.core.sql.execute(tmpCustQuery) 

            if(tmpCustData?.result?.recordset?.length > 0)
            {
                this.txtCustomerCode.value = tmpCustData.result.recordset[0].CODE
                this.txtCustomerName.value = tmpCustData.result.recordset[0].TITLE

                if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                {
                    this.frmDocItems.option('disabled',false)
                }
                this.docObj.dt()[0].OUTPUT = tmpCustData.result.recordset[0].GUID
                this.docObj.docCustomer.dt()[0].OUTPUT = tmpCustData.result.recordset[0].GUID
                this.docObj.dt()[0].OUTPUT_CODE = tmpCustData.result.recordset[0].CODE
                this.docObj.dt()[0].OUTPUT_NAME = tmpCustData.result.recordset[0].TITLE
                this.docObj.dt()[0].VAT_ZERO = tmpCustData.result.recordset[0].VAT_ZERO
                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                {
                    this.txtRef.value = tmpCustData.result.recordset[0].CODE
                }

                let tmpAdrQuery = 
                {
                    query : "SELECT ADRESS_NO FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                    param : ['CUSTOMER:string|50'],
                    value : [tmpCustData.result.recordset[0].GUID]
                }
                let tmpAdressData = await this.core.sql.execute(tmpAdrQuery) 
                if(tmpAdressData.result.recordset.length > 1)
                {
                    this.docObj.dt()[0].ADDRESS = tmpAdressData[0].ADRESS_NO
                }
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgFourniseurNotFound',showTitle:true,title:this.t("msgFourniseurNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgFourniseurNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgFourniseurNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }

            this.dtDocDate.value = jData[0].DOC_DATE
            this.dtShipDate.value = jData[0].SHIPMENT_DATE
            this.txtRefno.value = jData[0].REF_NO
            let tmpMissCodes = []

            for (let i = 0; i < jData.length; i++) 
            {
                let tmpData = {}

                let tmpItemQuery = 
                {
                    query : "SELECT " + 
                            "I.GUID AS ITEM, " + 
                            "I.CODE AS ITEM_CODE, " + 
                            "I.NAME AS ITEM_NAME, " + 
                            "I.UNIT AS UNIT, " + 
                            "I.COST_PRICE AS COST_PRICE, " +
                            "I.VAT AS VAT " +
                            "FROM ITEM_MULTICODE AS M " + 
                            "INNER JOIN ITEMS_VW_01 AS I ON " + 
                            "M.ITEM = I.GUID " + 
                            "WHERE M.CODE = @CODE AND M.CUSTOMER = @CUSTOMER",
                    param : ['CODE:string|50','CUSTOMER:string|50'],
                    value : [jData[i].ITEM_CODE,this.docObj.dt()[0].OUTPUT]
                }

                let tmpItemData = await this.core.sql.execute(tmpItemQuery) 
                
                if(tmpItemData?.result?.recordset?.length > 0)
                {
                    tmpData.GUID = tmpItemData.result.recordset[0].ITEM
                    tmpData.ITEM_TYPE = tmpItemData.result.recordset[0].ITEM_TYPE
                    tmpData.CODE = tmpItemData.result.recordset[0].ITEM_CODE
                    tmpData.NAME = tmpItemData.result.recordset[0].ITEM_NAME
                    tmpData.UNIT = tmpItemData.result.recordset[0].UNIT
                    tmpData.COST_PRICE = tmpItemData.result.recordset[0].COST_PRICE
                    tmpData.VAT = tmpItemData.result.recordset[0].VAT
                    await this.addItem(tmpData,null,jData[i].QUANTITY,jData[i].PRICE,jData[i].DISCOUNT,jData[i].DISCOUNT_RATE)
                }
                else
                {
                    tmpMissCodes.push("'" +jData[i].ITEM_CODE + "'")
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
        }
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdPurcInvState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdPurcInvState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async init()
    {
        return new Promise(async resolve =>
        {
            await super.init()
            this.grid = this["grdPurcInv"+this.tabIndex]
            this.grid.devGrid.clearFilter("row")
            this.dtDocDate.value = moment(new Date())
            this.dtShipDate.value = moment(new Date())

            let tmpDocCustomer = {...this.docObj.docCustomer.empty}
            tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
            tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
            tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
            tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
            tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docCustomer.addEmpty(tmpDocCustomer)
            
            this.docLocked = false
            this.piqX = undefined

            this.frmDocItems.option('disabled',true)        
            
            this.txtDiffrentPositive.value = 0
            this.txtDiffrentNegative.value = 0
            this.txtDiffrentTotal.value = 0
            this.txtDiffrentInv.value = 0

            this.pg_txtItemsCode.on('showing',()=>
            {
                this.pg_txtItemsCode.setSource(
                {
                    source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,NAME,VAT,ITEMS_VW_01.UNIT,0 AS ITEM_TYPE," + 
                                    "ISNULL((SELECT TOP 1 PRICE FROM ITEM_PRICE WHERE ITEM_PRICE.ITEM = ITEMS_VW_01.GUID AND ITEM_PRICE.CUSTOMER = '" + this.docObj.dt()[0].OUTPUT + "' AND DELETED = 0),COST_PRICE) AS PURC_PRICE,COST_PRICE, " +
                                    "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID AND CUSTOMER = '" + this.docObj.dt()[0].OUTPUT + "'  AND DELETED = 0),'') AS MULTICODE,STATUS " +
                                    "FROM ITEMS_VW_01 WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)) " ,
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                })
                
            })
            this.pg_txtBarcode.on('showing',()=>
            {
                this.pg_txtBarcode.setSource(
                {
                    source:
                    {
                        select:
                        {   query : "SELECT ITEMS_VW_01.GUID,CODE,NAME,COST_PRICE,VAT,ITEMS_VW_01.UNIT,BARCODE, " +
                                    "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND ITEM_MULTICODE.CUSTOMER = '" + this.docObj.dt()[0].OUTPUT + "' AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE, " + 
                                    "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME " + 
                                    "FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE  STATUS = 1 AND (ITEM_BARCODE_VW_01.BARCODE LIKE  '%' + @BARCODE)",
                            param : ['BARCODE:string|50'],
                        },
                        sql:this.core.sql
                    }
                })
            })
            this.pg_txtCustomerCode.on('showing',()=>
            {
                this.pg_txtCustomerCode.setSource(
                {
                    source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],VAT_ZERO,[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                })
            })
            resolve()
        });
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        App.instance.setState({isExecute:true})
        await super.getDoc(pGuid,pRef,pRefno);
        App.instance.setState({isExecute:false})
        
        this.frmDocItems.option('disabled',false)

        let tmpQuery = 
        {
            query : "SELECT ISNULL(ROUND(SUM(AMOUNT),2),0) AS TOTAL FROM DOC_ITEMS_VW_01 " + 
                    "WHERE INVOICE_DOC_GUID IN (SELECT  GUID FROM DOC_ITEMS_VW_01 AS DITEM " + 
                    "WHERE ((DITEM.DOC_GUID = @INVOICE_DOC_GUID) OR(DITEM.INVOICE_DOC_GUID = @INVOICE_DOC_GUID)) AND DOC_TYPE <> 21) AND DOC_TYPE = 21",
            param : ['INVOICE_DOC_GUID:string|50'],
            value : [this.docObj.dt()[0].GUID]
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        
        if(tmpData.result.recordset.length > 0)
        {   
            this.txtDiffrentInv.value = '-' +tmpData.result.recordset[0].TOTAL
            this.docObj.docCustomer.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
        }
        else
        {
            this.txtDiffrentInv.value = 0
        }
        
        let tmpDiffPovitive = 0
        let tmpDiffNegative = 0
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            if(this.docObj.docItems.dt()[i].DIFF_PRICE > 0 && this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
            {
                tmpDiffPovitive = tmpDiffPovitive + (this.docObj.docItems.dt()[i].DIFF_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            }
            if(this.docObj.docItems.dt()[i].DIFF_PRICE < 0 && this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
            {
                tmpDiffNegative = tmpDiffNegative + (this.docObj.docItems.dt()[i].DIFF_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            }
        }
        this.txtDiffrentPositive.value = parseFloat(tmpDiffPovitive).toFixed(2)
        this.txtDiffrentNegative.value = parseFloat(tmpDiffNegative).toFixed(2)
        this.txtDiffrentTotal.value = (parseFloat(tmpDiffNegative) + parseFloat(tmpDiffPovitive)).toFixed(2)
    }
    calculateTotal()
    {
        super.calculateTotal();

        this.docObj.docCustomer.dt()[0].AMOUNT = this.docObj.dt()[0].TOTAL
        this.docObj.docCustomer.dt()[0].ROUND = 0

        let tmpDiffPovitive = 0
        let tmpDiffNegative = 0
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            if(this.docObj.docItems.dt()[i].DIFF_PRICE > 0 && this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
            {
                tmpDiffPovitive = tmpDiffPovitive + (this.docObj.docItems.dt()[i].DIFF_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            }
            if(this.docObj.docItems.dt()[i].DIFF_PRICE < 0 && this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
            {
                tmpDiffNegative = tmpDiffNegative + (this.docObj.docItems.dt()[i].DIFF_PRICE * this.docObj.docItems.dt()[i].QUANTITY)
            }
        }
        this.txtDiffrentPositive.value = parseFloat(tmpDiffPovitive).toFixed(2)
        this.txtDiffrentNegative.value = parseFloat(tmpDiffNegative).toFixed(2)
        this.txtDiffrentTotal.value = (parseFloat(tmpDiffNegative) + parseFloat(tmpDiffPovitive)).toFixed(2)
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
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            this.customerControl = true
                            this.customerClear = false
                            this.combineControl = true
                            this.combineNew = false
                            
                            this.grid.devGrid.beginUpdate()
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                            this.grid.devGrid.endUpdate()
                        }
                        this.pg_txtItemsCode.setVal(e.value)
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
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async()  =>
                            {
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.customerControl = true
                                    this.customerClear = false
                                    this.combineControl = true
                                    this.combineNew = false
                                    
                                    this.grid.devGrid.beginUpdate()
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                    this.grid.devGrid.endUpdate()
                                }
                                this.pg_txtItemsCode.show()
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
                    this.grid.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.msgUnit.tmpData = e.data
                                await this.msgUnit.show();

                                e.key.UNIT = this.cmbUnit.value
                                e.key.UNIT_FACTOR = this.txtUnitFactor.value
                                if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                {
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value * this.txtUnitFactor.value).toFixed(4))
                                }
                                else
                                {
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                {
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value * this.txtUnitFactor.value).toFixed(4))
                                }
                                else
                                {
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value / this.txtUnitFactor.value).toFixed(4))
                                }
                                }
                                e.data.DIFF_PRICE = parseFloat((e.data.PRICE - e.data.CUSTOMER_PRICE).toFixed(3))
                                e.data.QUANTITY = this.txtTotalQuantity.value
                                if(this.docObj.dt()[0].VAT_ZERO != 1)
                                {
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                }
                                else
                                {
                                    e.data.VAT = 0
                                    e.data.VAT_RATE = 0
                                }
                                
                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                                await this.itemRelatedUpdate(e.data.ITEM,this.txtTotalQuantity.value)
                                //*****************************************/
                                this.calculateTotal()  
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
                    this.grid.devGrid.cellValue(e.rowIndex,"DISCOUNT",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.msgDiscountEntry.onShowed = async ()=>
                                {
                                    this.txtDiscount1.value = e.data.DISCOUNT_1
                                    this.txtDiscount2.value = e.data.DISCOUNT_2
                                    this.txtDiscount3.value = e.data.DISCOUNT_3
                                    this.txtTotalDiscount.value = (parseFloat(e.data.DISCOUNT_1) + parseFloat(e.data.DISCOUNT_2) + parseFloat(e.data.DISCOUNT_3))
                                }
                                
                                await this.msgDiscountEntry.show()
                                
                                e.data.DISCOUNT_1 = this.txtDiscount1.value
                                e.data.DISCOUNT_2 = this.txtDiscount2.value
                                e.data.DISCOUNT_3 = this.txtDiscount3.value
                                e.data.DISCOUNT = (parseFloat(this.txtDiscount1.value) + parseFloat(this.txtDiscount2.value) + parseFloat(this.txtDiscount3.value))
                                if(this.docObj.dt()[0].VAT_ZERO != 1)
                                {
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                }
                                else
                                {
                                    e.data.VAT = 0
                                    e.data.VAT_RATE = 0
                                }
                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                this.calculateTotal() 
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
                    this.grid.devGrid.cellValue(e.rowIndex,"DISCOUNT_RATE",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.msgDiscountPerEntry.onShowed = async ()=>
                                {
                                    this.txtDiscountPer1.value = Number(e.data.QUANTITY*e.data.PRICE).rate2Num(e.data.DISCOUNT_1,4)
                                    this.txtDiscountPer2.value = Number((e.data.QUANTITY*e.data.PRICE)-e.data.DISCOUNT_1).rate2Num(e.data.DISCOUNT_2,4)
                                    this.txtDiscountPer3.value = Number((e.data.QUANTITY*e.data.PRICE)-((e.data.DISCOUNT_1+e.data.DISCOUNT_2))).rate2Num(e.data.DISCOUNT_3,4)
                                }
                                
                                await this.msgDiscountPerEntry.show()
                                
                                e.data.DISCOUNT_1 = Number(e.data.AMOUNT).rateInc(this.txtDiscountPer1.value,4) 
                                e.data.DISCOUNT_2 = Number(e.data.AMOUNT-e.data.DISCOUNT_1).rateInc(this.txtDiscountPer2.value,4) 
                                e.data.DISCOUNT_3 = Number(e.data.AMOUNT-e.data.DISCOUNT_1-e.data.DISCOUNT_2).rateInc(this.txtDiscountPer3.value,4) 
                                e.data.DISCOUNT = (e.data.DISCOUNT_1 + e.data.DISCOUNT_2 + e.data.DISCOUNT_3)
                                if(this.docObj.dt()[0].VAT_ZERO != 1)
                                {
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                }
                                else
                                {
                                    e.data.VAT = 0
                                    e.data.VAT_RATE = 0
                                }
                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                this.calculateTotal()
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "ORIGIN")
        {
            return (
                <NdTextBox id={"txtGrdOrigins"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={async (r)=>
                {
                    e.data.ORIGIN = r.component._changedValue
                    let tmpQuery = 
                    {
                        query :"UPDATE ITEMS_GRP SET LDATE = dbo.GETDATE(),LUSER = @PCUSER,ORGINS = @ORGINS WHERE ITEM = @ITEM ",
                        param : ['ITEM:string|50','PCUSER:string|25','ORGINS:string|25'],
                        value : [e.data.ITEM,this.user.CODE,r.component._changedValue]
                    }
                    await this.core.sql.execute(tmpQuery) 
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.msgGrdOrigins.onShowed = async ()=>
                                {
                                    this.cmbOrigin.value = e.data.ORIGIN
                                }
                                await this.msgGrdOrigins.show().then(async () =>
                                {
                                  e.data.ORIGIN = this.cmbOrigin.value 
                                  let tmpQuery = 
                                  {
                                      query :"UPDATE ITEMS_GRP SET LDATE = dbo.GETDATE(),LUSER = @PCUSER,ORGINS = @ORGINS WHERE ITEM = @ITEM ",
                                      param : ['ITEM:string|50','PCUSER:string|25','ORGINS:string|25'],
                                      value : [e.data.ITEM,this.user.CODE,e.data.ORIGIN]
                                  }
                                  let tmpData = await this.core.sql.execute(tmpQuery) 
                                  if(typeof tmpData.result.err == 'undefined')
                                  {
                                     
                                  }
                                  else
                                  {
                                    let tmpConfObj1 =
                                    {
                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                    }
                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                    await dialog(tmpConfObj1);
                                  }
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
    addItem(pData,pIndex,pQuantity,pPrice,pDiscount,pDiscountPer,pVat)
    {
        return new Promise(async resolve => 
        {
            if(typeof pQuantity == 'undefined')
            {
                pQuantity = 1
            }
            if(typeof pData.ITEM_TYPE == 'undefined')
            {
                let tmpTypeQuery = 
                {
                    query :"SELECT TYPE FROM ITEMS WHERE GUID = @GUID ",
                    param : ['GUID:string|50'],
                    value : [pData.GUID]
                }
                let tmpType = await this.core.sql.execute(tmpTypeQuery) 
                if(tmpType.result.recordset.length > 0)
                {
                    pData.ITEM_TYPE = tmpType.result.recordset[0].TYPE
                }
            }
            if(pData.ITEM_TYPE == 0)
            {
                if(this.customerControl == true)
                {
                    let tmpCheckQuery = 
                    {
                        query :"SELECT CODE AS MULTICODE FROM ITEM_MULTICODE WHERE ITEM = @ITEM AND CUSTOMER = @CUSTOMER_GUID AND DELETED = 0",
                        param : ['ITEM:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                        value : [pData.GUID,this.docObj.dt()[0].OUTPUT,pQuantity]
                    }
                    let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
                    if(tmpCheckData.result.recordset.length == 0)
                    {   
                        let tmpCustomerBtn = ''
                        if(this.customerClear == true)
                        {
                            resolve()
                            return 
                        }
                        
                        if(this.prmObj.filter({ID:'compulsoryCustomer',USERS:this.user.CODE}).getValue().value == true)
                        {
                            let tmpConfObj =
                            {
                                id:'msgCompulsoryCustomer',showTitle:true,title:this.t("msgCompulsoryCustomer.title"),showCloseButton:true,width:'500px',height:'200px',
                                button:[{id:"btn01",caption:this.t("msgCompulsoryCustomer.btn01"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCompulsoryCustomer.msg")}</div>)
                            }
                            await dialog(tmpConfObj);
                            resolve()
                            return
                        }
                        await this.msgCustomerNotFound.show().then(async (e) =>
                        {
                            if(e == 'btn01' && this.checkCustomer.value == true)
                            {
                                this.customerControl = false
                                resolve()
                                return
                            }
                            if(e == 'btn02')
                            {
                                tmpCustomerBtn = e
                                if(this.checkCustomer.value == true)
                                {
                                    this.customerClear = true
                                }
                                resolve()
                                return 
                            }
                        })
                        if(tmpCustomerBtn == 'btn02')
                        {
                            resolve()
                            return
                        }
                    }
                }
            }
            //GRID DE AYNI ÜRÜNDEN OLUP OLMADIĞI KONTROL EDİLİYOR VE KULLANICIYA SORULUYOR,CEVAP A GÖRE SATIR BİRLİŞTERİLİYOR.
            let tmpMergDt = await this.mergeItem(pData.CODE)
            if(typeof tmpMergDt != 'undefined' && this.combineNew == false)
            {
                tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
                tmpMergDt[0].SUB_QUANTITY = tmpMergDt[0].SUB_QUANTITY / tmpMergDt[0].SUB_FACTOR
                if(this.docObj.dt()[0].VAT_ZERO != 1)
                {
                    tmpMergDt[0].VAT = Number((tmpMergDt[0].VAT + (tmpMergDt[0].PRICE * (tmpMergDt[0].VAT_RATE / 100) * pQuantity))).round(6)
                }
                else
                {
                    tmpMergDt[0].VAT = 0
                    tmpMergDt[0].VAT_RATE = 0
                }
                tmpMergDt[0].AMOUNT = Number((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE)).round(4)
                tmpMergDt[0].TOTAL = Number((((tmpMergDt[0].QUANTITY * tmpMergDt[0].PRICE) - tmpMergDt[0].DISCOUNT) + tmpMergDt[0].VAT)).round(2)
                tmpMergDt[0].TOTALHT =  Number((tmpMergDt[0].AMOUNT - tmpMergDt[0].DISCOUNT)).round(2)
                this.calculateTotal()
                //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                await this.itemRelated(pData.GUID,tmpMergDt[0].QUANTITY)
                //*****************************************/
                resolve()
                return
            }
            //******************************************************************************************************************/
            if(pIndex == null)
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
                await this.docObj.docItems.addEmpty(tmpDocItems)
                pIndex = this.docObj.docItems.dt().length - 1
            }

            let tmpGrpQuery = 
            {
                query : "SELECT ORGINS,UNIT_SHORT,ISNULL((SELECT top 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ITEM_UNIT_VW_01.ID = @ID),1) AS SUB_FACTOR, " +
                        "ISNULL((SELECT top 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND ITEM_UNIT_VW_01.ID = @ID),'') AS SUB_SYMBOL FROM ITEMS_VW_01 WHERE GUID = @GUID",
                param : ['GUID:string|50','ID:string|20'],
                value : [pData.GUID,this.sysParam.filter({ID:'secondFactor',USERS:this.user.CODE}).getValue().value]
            }
            let tmpGrpData = await this.core.sql.execute(tmpGrpQuery) 
            if(tmpGrpData.result.recordset.length > 0)
            {
                this.docObj.docItems.dt()[pIndex].ORIGIN = tmpGrpData.result.recordset[0].ORGINS
                this.docObj.docItems.dt()[pIndex].SUB_FACTOR = tmpGrpData.result.recordset[0].SUB_FACTOR
                this.docObj.docItems.dt()[pIndex].SUB_SYMBOL = tmpGrpData.result.recordset[0].SUB_SYMBOL
                this.docObj.docItems.dt()[pIndex].UNIT_SHORT = tmpGrpData.result.recordset[0].UNIT_SHORT
            }
           

            this.docObj.docItems.dt()[pIndex].ITEM_CODE = pData.CODE
            this.docObj.docItems.dt()[pIndex].ITEM = pData.GUID
            this.docObj.docItems.dt()[pIndex].ITEM_TYPE = pData.ITEM_TYPE
            this.docObj.docItems.dt()[pIndex].UNIT = pData.UNIT
            this.docObj.docItems.dt()[pIndex].COST_PRICE = pData.COST_PRICE
            if(typeof pVat == 'undefined')
            {
                this.docObj.docItems.dt()[pIndex].VAT_RATE = pData.VAT
                this.docObj.docItems.dt()[pIndex].OLD_VAT = pData.VAT
            }
            else
            {
                this.docObj.docItems.dt()[pIndex].VAT_RATE = Number(pVat)
                this.docObj.docItems.dt()[pIndex].OLD_VAT = pData.VAT
            }
            this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME

            this.docObj.docItems.dt()[pIndex].QUANTITY = pQuantity
            this.docObj.docItems.dt()[pIndex].SUB_QUANTITY = pQuantity / this.docObj.docItems.dt()[pIndex].SUB_FACTOR

            let tmpQuery = 
            {
                query :"SELECT (SELECT dbo.FN_PRICE(ITEM,@QUANTITY,dbo.GETDATE(),CUSTOMER,'00000000-0000-0000-0000-000000000000',0,1,0)) AS PRICE FROM ITEM_MULTICODE WHERE ITEM = @ITEM AND CUSTOMER = @CUSTOMER_GUID ORDER BY LDATE DESC",
                param : ['ITEM:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                value : [pData.GUID,this.docObj.dt()[0].OUTPUT,pQuantity]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(typeof pPrice == 'undefined')
            {
                if(tmpData.result.recordset.length > 0)
                {
                    this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
                    this.docObj.docItems.dt()[pIndex].VAT = Number((tmpData.result.recordset[0].PRICE * (this.docObj.docItems.dt()[pIndex].VAT_RATE / 100) * pQuantity)).round(6)
                    this.docObj.docItems.dt()[pIndex].AMOUNT = Number(tmpData.result.recordset[0].PRICE  * pQuantity).round(2)
                    this.docObj.docItems.dt()[pIndex].TOTAL = Number(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docItems.dt()[pIndex].VAT)).round(2)
                    this.docObj.docItems.dt()[pIndex].TOTALHT = Number((this.docObj.docItems.dt()[pIndex].AMOUNT - this.docObj.docItems.dt()[pIndex].DISCOUNT)).round(2)
                    this.docObj.docItems.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) * this.docObj.docItems.dt()[pIndex].SUB_FACTOR).round(2)
                    this.calculateTotal()
                }
                else
                {
                    this.docObj.docItems.dt()[pIndex].PRICE = 0
                    this.docObj.docItems.dt()[pIndex].VAT = 0
                    this.docObj.docItems.dt()[pIndex].AMOUNT = 0
                    this.docObj.docItems.dt()[pIndex].TOTAL =  0
                    this.docObj.docItems.dt()[pIndex].TOTALHT = 0
                    this.calculateTotal()
                }
            }
            else
            {
                this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((pPrice).toFixed(4))
                if(typeof pDiscountPer != 'undefined')
                {
                    this.docObj.docItems.dt()[pIndex].DISCOUNT = typeof pDiscountPer == 'undefined' ? 0 : ((this.docObj.docItems.dt()[pIndex].PRICE * pDiscountPer / 100) * pQuantity).toFixed(4)
                    this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = typeof pDiscountPer == 'undefined' ? 0 : pDiscountPer
                    this.docObj.docItems.dt()[pIndex].DISCOUNT_1 = this.docObj.docItems.dt()[pIndex].DISCOUNT
                }
                else
                {
                    this.docObj.docItems.dt()[pIndex].DISCOUNT = typeof pDiscount == 'undefined' ? 0 : pDiscount
                    this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = typeof pDiscount == 'undefined' ? 0 : (pDiscount / this.docObj.docItems.dt()[pIndex].AMOUNT)  * 100
                    this.docObj.docItems.dt()[pIndex].DISCOUNT_1 = this.docObj.docItems.dt()[pIndex].DISCOUNT
                }

                this.docObj.docItems.dt()[pIndex].TOTALHT = Number(((pPrice  * pQuantity) - this.docObj.docItems.dt()[pIndex].DISCOUNT)).round(2)
                this.docObj.docItems.dt()[pIndex].VAT = parseFloat((this.docObj.docItems.dt()[pIndex].TOTALHT * (this.docObj.docItems.dt()[pIndex].VAT_RATE / 100) ).toFixed(6))
                this.docObj.docItems.dt()[pIndex].AMOUNT = parseFloat((pPrice  * pQuantity)).round(2)
                this.docObj.docItems.dt()[pIndex].TOTAL = Number((this.docObj.docItems.dt()[pIndex].TOTALHT + this.docObj.docItems.dt()[pIndex].VAT)).round(2)
                this.calculateTotal()
            }
            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.docItems.dt()[pIndex].CUSTOMER_PRICE = tmpData.result.recordset[0].PRICE
                this.docObj.docItems.dt()[pIndex].DIFF_PRICE = this.docObj.docItems.dt()[pIndex].PRICE - this.docObj.docItems.dt()[pIndex].CUSTOMER_PRICE
            }
            if(this.docObj.dt()[0].VAT_ZERO == 1)
            {
                this.docObj.docItems.dt()[pIndex].VAT = 0
                this.docObj.docItems.dt()[pIndex].VAT_RATE = 0
            }
            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
            await this.itemRelated(pData.GUID,pQuantity)
            //*****************************************/
            resolve()
        })
    }
    async getDispatch()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ITEMS_VW_01 WHERE OUTPUT = @OUTPUT AND INVOICE_DOC_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN (40)",
            param : ['OUTPUT:string|50'],
            value : [this.docObj.dt()[0].OUTPUT]
        }
        super.getDispatch(tmpQuery)
    }
    async getOrders() 
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ORDERS_VW_01 WHERE OUTPUT = @OUTPUT AND SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN(60)",
            param : ['OUTPUT:string|50'],
            value : [this.docObj.dt()[0].OUTPUT]
        }
        super.getOrders(tmpQuery)
    }
    async getOffers()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_OFFERS_VW_01 WHERE OUTPUT = @OUTPUT AND SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN(61)",
            param : ['OUTPUT:string|50'],
            value : [this.docObj.dt()[0].OUTPUT]
        }
        super.getOffers(tmpQuery)
    }
    async getProforma()
    {
        let tmpQuery = 
        {
            query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ITEMS_VW_01 WHERE OUTPUT = @OUTPUT AND INVOICE_DOC_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN(120) AND REBATE = 0",
            param : ['OUTPUT:string|50'],
            value : [this.docObj.dt()[0].OUTPUT]
        }
        super.getProforma(tmpQuery)
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
                    query : "SELECT ITEMS.GUID,ITEMS.CODE,ITEMS.NAME,ITEMS.VAT,1 AS QUANTITY,ITEMS.COST_PRICE, " +
                            "CASE WHEN UNIT.GUID IS NULL THEN ITEMS.UNIT ELSE UNIT.GUID END AS UNIT, " +
                            "CASE WHEN UNIT.NAME IS NULL THEN ITEMS.UNIT_NAME ELSE UNIT.NAME END AS UNIT_NAME, " +
                            "CASE WHEN UNIT.SYMBOL IS NULL THEN ITEMS.UNIT_SHORT ELSE UNIT.SYMBOL END AS UNIT_SHORT, " +
                            "CASE WHEN UNIT.FACTOR IS NULL THEN ITEMS.UNIT_FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, " + 
                            "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID AND CUSTOMER = '" + this.docObj.dt()[0].OUTPUT + "' AND DELETED =0),'') AS MULTICODE " +
                            "FROM ITEMS_VW_01 AS ITEMS " + 
                            "LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON " +
                            "ITEMS.GUID = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '" + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + "' " +
                            "WHERE ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID AND CUSTOMER = '" + this.docObj.dt()[0].OUTPUT + "' AND DELETED =0),'') = @VALUE AND ITEMS.STATUS = 1" ,
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
                    query : "SELECT ITEMS.GUID,ITEMS.CODE,ITEMS.NAME,ITEMS.VAT,1 AS QUANTITY, " +
                            "CASE WHEN UNIT.GUID IS NULL THEN ITEMS.UNIT ELSE UNIT.GUID END AS UNIT, " +
                            "CASE WHEN UNIT.NAME IS NULL THEN ITEMS.UNIT_NAME ELSE UNIT.NAME END AS UNIT_NAME, " +
                            "CASE WHEN UNIT.SYMBOL IS NULL THEN ITEMS.UNIT_SHORT ELSE UNIT.SYMBOL END AS UNIT_SHORT, " +
                            "CASE WHEN UNIT.FACTOR IS NULL THEN ITEMS.UNIT_FACTOR ELSE UNIT.FACTOR END AS UNIT_FACTOR, " + 
                            "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE WHERE DELETED = 0 AND ITEM_GUID = ITEMS.GUID AND CUSTOMER_GUID = '" + this.docObj.dt()[0].OUTPUT + "'),'') AS MULTICODE " +
                            "FROM ITEMS_VW_01 AS ITEMS " +
                            "LEFT OUTER JOIN ITEM_UNIT_VW_01 AS UNIT ON " +
                            "ITEMS.GUID = UNIT.ITEM_GUID AND UNIT.TYPE = 2 AND UNIT.NAME = '" + this.sysParam.filter({ID:'cmbUnit',USERS:this.user.CODE}).getValue().value + "' " +
                            "WHERE ITEMS.CODE = @VALUE AND ITEMS.STATUS = 1" ,
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
    async excelAdd(pdata)
    {
        let tmpShema = this.prmObj.filter({ID:'excelFormat',USERS:this.user.CODE}).getValue()
        if(typeof tmpShema == 'string')
        {
            tmpShema = JSON.parse(tmpShema)
        }
        let tmpMissCodes = []
        let tmpCounter = 0
        this.grid.devGrid.beginUpdate()
        for (let i = 0; i < pdata.length; i++) 
        {
            let tmpQuery = 
            { 
                query : "SELECT " +
                        "GUID AS GUID," +
                        "CODE AS CODE," +
                        "NAME AS NAME," +
                        "VAT AS VAT," +
                        "ISNULL((SELECT TOP 1 GUID FROM ITEM_UNIT WHERE TYPE = 0 AND DELETED = 0 AND ITEM_UNIT.ITEM = ITEMS.GUID),'00000000-0000-0000-0000-000000000000') AS UNIT," +
                        "0 AS ITEM_TYPE," +
                        "COST_PRICE AS COST_PRICE " +
                        "FROM ITEMS_VW_01 AS ITEMS WHERE ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID AND CUSTOMER = @CUSTOMER_GUID AND DELETED =0),'') = @VALUE AND STATUS = 1" ,
                param : ['CUSTOMER_GUID:string|50','VALUE:string|50'],
                value : [this.docObj.dt()[0].OUTPUT,pdata[i][tmpShema.CODE]]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                await this.addItem(tmpData.result.recordset[0],null,pdata[i][tmpShema.QTY],pdata[i][tmpShema.PRICE],pdata[i][tmpShema.DISC],pdata[i][tmpShema.DISC_PER],pdata[i][tmpShema.TVA])
                tmpCounter = tmpCounter + 1
            }
            else
            {
                tmpMissCodes.push("'"+pdata[i].CODE+"'")
            }
        }
        this.grid.devGrid.endUpdate()
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

        this.grid.devGrid.beginUpdate()
        for (let i = 0; i < this.multiItemData.length; i++) 
        {
            await this.addItem(this.multiItemData[i],null,Number(this.multiItemData[i].QUANTITY * this.multiItemData[i].UNIT_FACTOR).round(3))
        }
        this.popMultiItem.hide()
        this.grid.devGrid.endUpdate()
    }
    async saveDoc()
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
            let tmpData = this.sysParam.filter({ID:'purcInvoıcePriceSave',USERS:this.user.CODE}).getValue()
            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
            {
                App.instance.setState({isExecute:true})
                this.newPrice.clear()
                this.newVat.clear()
                for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                {
                    if(this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
                    {
                        if(typeof this.docObj.docItems.dt()[i].OLD_VAT != 'undefined' && this.docObj.docItems.dt()[i].VAT_RATE != this.docObj.docItems.dt()[i].OLD_VAT && this.docObj.docItems.dt()[i].VAT_RATE != 0)
                        {
                            this.newVat.push({...this.docObj.docItems.dt()[i]})
                        }
                        if((this.docObj.docItems.dt()[i].COST_PRICE != this.docObj.docItems.dt()[i].PRICE && this.docObj.docItems.dt()[i].COST_PRICE != 0) ||(this.docObj.docItems.dt()[i].CUSTOMER_PRICE != this.docObj.docItems.dt()[i].PRICE && this.docObj.docItems.dt()[i].COST_PRICE != 0))
                        {
                            let tmpQuery = 
                            {
                                query : "SELECT TOP 1 PRICE_SALE_GUID AS PRICE_GUID,PRICE_SALE AS SALE_PRICE,VAT AS VAT,CUSTOMER_PRICE_GUID AS CUSTOMER_PRICE_GUID,VAT AS VAT_RATE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE  GUID = @ITEM AND CUSTOMER_GUID = @CUSTOMER",
                                param : ['ITEM:string|50','CUSTOMER:string|50'],
                                value : [this.docObj.docItems.dt()[i].ITEM,this.docObj.docItems.dt()[i].OUTPUT]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery)
                            if(tmpData.result.recordset.length > 0)
                            {
                                let tmpItemData = [{...this.docObj.docItems.dt()[i]}]
                                // if(tmpTaxSucre == 1)
                                // {
                                //     let tmpQuery2 = 
                                //     {
                                //         query : "SELECT MAIN_GUID FROM ITEMS_VW_01 WHERE GUID = @ITEM",
                                //         param : ['ITEM:string|50'],
                                //         value : [this.docObj.docItems.dt()[i].ITEM]
                                //     }
                                //     let tmpData2 = await this.core.sql.execute(tmpQuery2)
                                //     if(tmpData2.result.recordset.length > 0)
                                //     {
                                //         let tmpData = this.prmObj.filter({ID:'taxSugarGroupValidation'}).getValue()
                                //         if((typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == tmpData2.result.recordset[0].MAIN_GUID) != 'undefined'))
                                //         {
                                            
                                //         }
                                //     }
                                // }
                                tmpItemData[0].SALE_PRICE_GUID = tmpData.result.recordset[0].PRICE_GUID
                                tmpItemData[0].SALE_PRICE = tmpData.result.recordset[0].SALE_PRICE
                                tmpItemData[0].ITEM_VAT = tmpData.result.recordset[0].VAT
                                tmpItemData[0].CUSER = this.user.CODE
                                let tmpExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].ITEM_VAT / 100) + 1)
                                let tmpMargin = tmpExVat - tmpItemData[0].PRICE;
                                let tmpMarginRate = ((tmpMargin / tmpItemData[0].PRICE)) * 100
                                tmpItemData[0].PRICE_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
                                let tmpNetExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].ITEM_VAT / 100) + 1)
                                let tmpNetMargin = (tmpNetExVat - tmpItemData[0].PRICE) / 1.15;
                                let tmpNetMarginRate = (((tmpNetMargin / tmpItemData[0].PRICE))) * 100
                                tmpItemData[0].NET_MARGIN = tmpNetMargin.toFixed(2) + Number.money.sign + " / %" +  tmpNetMarginRate.toFixed(2); 
                                tmpItemData[0].MARGIN = ((tmpMargin / tmpExVat) * 100); 
                                tmpItemData[0].CUSTOMER_PRICE_GUID = tmpData.result.recordset[0].CUSTOMER_PRICE_GUID
                                this.newPrice.push(tmpItemData[0])
                            } 
                        }
                    }
                }
                if(this.newPrice.length > 0)
                {
                    await this.msgNewPrice.show().then(async (e) =>
                    {
                        if(e == 'btn02')
                        {
                            this.updatePriceData.insertCmd = 
                            {
                                query : "EXEC [dbo].[PRD_INVOICE_PRICE_UPDATE] " + 
                                "@PRICE_GUID = @PPRICE_GUID, " +
                                "@NEW_CUSER = @PNEW_CUSER, " + 
                                "@NEW_PRICE = @PNEW_PRICE, " +
                                "@UPDATE_ITEM = @PUPDATE_ITEM, " +
                                "@CUSTOMER_PRICE_GUID = @PCUSTOMER_PRICE_GUID, " +
                                "@COST_PRICE = @PCOST_PRICE ", 
                                param : ['PPRICE_GUID:string|50','PNEW_CUSER:string|25','PNEW_PRICE:float','PUPDATE_ITEM:string|50','PCUSTOMER_PRICE_GUID:string|50','PCOST_PRICE:float'],
                                dataprm : ['SALE_PRICE_GUID','CUSER','SALE_PRICE','ITEM','CUSTOMER_PRICE_GUID','PRICE']
                            } 
                            this.updatePriceData.updateCmd = 
                            {
                                query : "EXEC [dbo].[PRD_INVOICE_PRICE_UPDATE] " + 
                                "@PRICE_GUID = @PPRICE_GUID, " +
                                "@NEW_CUSER = @PNEW_CUSER, " + 
                                "@NEW_PRICE = @PNEW_PRICE, " +
                                "@UPDATE_ITEM = @PUPDATE_ITEM, " +
                                "@CUSTOMER_PRICE_GUID = @PCUSTOMER_PRICE_GUID, " +
                                "@COST_PRICE = @PCOST_PRICE ", 
                                param : ['PPRICE_GUID:string|50','PNEW_CUSER:string|25','PNEW_PRICE:float','PUPDATE_ITEM:string|50','PCUSTOMER_PRICE_GUID:string|50','PCOST_PRICE:float'],
                                dataprm : ['SALE_PRICE_GUID','CUSER','SALE_PRICE','ITEM','CUSTOMER_PRICE_GUID','PRICE']
                            } 
                            App.instance.setState({isExecute:true})
                            for (let i = 0; i < this.grdNewPrice.getSelectedData().length; i++) 
                            {
                                this.updatePriceData.push(this.grdNewPrice.getSelectedData()[i])
                            }
                            await this.updatePriceData.update()
                            App.instance.setState({isExecute:false})
                            this.updatePriceData.clear()
                        }
                    })
                }    
                if(this.newVat.length > 0)
                {
                    await this.msgNewVat.show().then(async (e) =>
                    {
            
                        if(e == 'btn01')
                        {
                            
                        }
                        if(e == 'btn02')
                        {
                            App.instance.setState({isExecute:true})
                            for (let i = 0; i < this.grdNewVat.getSelectedData().length; i++) 
                            {
                                let tmpQuery = 
                                {
                                    query :"UPDATE ITEMS SET VAT = @VAT WHERE GUID = @GUID",
                                    param : ['GUID:string|50','VAT:float'],
                                    value : [this.grdNewVat.getSelectedData()[i].ITEM,this.grdNewVat.getSelectedData()[i].VAT_RATE]
                                }
                                await this.core.sql.execute(tmpQuery) 
                            }
                            App.instance.setState({isExecute:false})
                        }
                    })
                }    
                App.instance.setState({isExecute:false})
            }
            
            let tmpConfObj =
            {
                id:'msgPriceDateUpdate',showTitle:true,title:this.t("msgPriceDateUpdate.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgPriceDateUpdate.btn01"),location:'before'},{id:"btn02",caption:this.t("msgPriceDateUpdate.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPriceDateUpdate.msg")}</div>)
            }
            
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                let tmpData = this.sysParam.filter({ID:'purcInvoıcePriceSave',USERS:this.user.CODE}).getValue()
                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                {
                    App.instance.setState({isExecute:true})
                    this.newPriceDate.clear()
                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                    {
                        if(this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
                        {
                            if(this.docObj.docItems.dt()[i].COST_PRICE == this.docObj.docItems.dt()[i].PRICE && this.docObj.docItems.dt()[i].COST_PRICE != 0 )
                            {
                                let tmpQuery = 
                                {
                                    query : "SELECT TOP 1 PRICE_SALE_GUID AS PRICE_GUID,PRICE_SALE AS SALE_PRICE,VAT AS VAT,CUSTOMER_PRICE_GUID AS CUSTOMER_PRICE_GUID,VAT AS VAT_RATE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE  GUID = @ITEM AND CUSTOMER_GUID = @CUSTOMER",
                                    param : ['ITEM:string|50','CUSTOMER:string|50'],
                                    value : [this.docObj.docItems.dt()[i].ITEM,this.docObj.docItems.dt()[i].OUTPUT]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                if(tmpData.result.recordset.length > 0)
                                {
                                    let tmpItemData = [{...this.docObj.docItems.dt()[i]}]
                                    tmpItemData[0].SALE_PRICE_GUID = tmpData.result.recordset[0].PRICE_GUID
                                    tmpItemData[0].SALE_PRICE = tmpData.result.recordset[0].SALE_PRICE
                                    tmpItemData[0].ITEM_VAT = tmpData.result.recordset[0].VAT
                                    tmpItemData[0].CUSER = this.user.CODE
                                    let tmpExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].ITEM_VAT / 100) + 1)
                                    let tmpMargin = tmpExVat - tmpItemData[0].PRICE;
                                    let tmpMarginRate = ((tmpMargin / tmpItemData[0].PRICE)) * 100
                                    tmpItemData[0].PRICE_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
                                    let tmpNetExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].ITEM_VAT / 100) + 1)
                                    let tmpNetMargin = (tmpNetExVat - tmpItemData[0].PRICE) / 1.15;
                                    let tmpNetMarginRate = (((tmpNetMargin / tmpItemData[0].PRICE))) * 100
                                    tmpItemData[0].NET_MARGIN = tmpNetMargin.toFixed(2) + Number.money.sign + " / %" +  tmpNetMarginRate.toFixed(2); 
                                    tmpItemData[0].MARGIN = ((tmpMargin / tmpExVat) * 100); 
                                    tmpItemData[0].CUSTOMER_PRICE_GUID = tmpData.result.recordset[0].CUSTOMER_PRICE_GUID
                                    console.log(tmpItemData[0])
                                    this.newPriceDate.push(tmpItemData[0])
                                } 
                            }
                        }
                    }
                    if(this.newPriceDate.length > 0)
                    {
                        await this.msgNewPriceDate.show().then(async (e) =>
                        {
                
                            if(e == 'btn01')
                            {
                                
                            }
                            if(e == 'btn02')
                            {
                                this.updatePriceData.insertCmd = 
                                {
                                    query : "EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] " + 
                                    "@GUID =  @PCUSTOMER_PRICE_GUID," +
                                    "@CUSER = @PNEW_CUSER ", 
                                    param : ['PNEW_CUSER:string|25','PCUSTOMER_PRICE_GUID:string|50'],
                                    dataprm : ['CUSER','CUSTOMER_PRICE_GUID']
                                } 
                                this.updatePriceData.updateCmd = 
                                {
                                    query : "EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] " + 
                                    "@GUID =  @PCUSTOMER_PRICE_GUID," +
                                    "@CUSER = @PNEW_CUSER ", 
                                    param : ['PNEW_CUSER:string|25','PCUSTOMER_PRICE_GUID:string|50'],
                                    dataprm : ['CUSER','CUSTOMER_PRICE_GUID']
                                } 
                                App.instance.setState({isExecute:true})
                                for (let i = 0; i < this.grdNewPriceDate.getSelectedData().length; i++) 
                                {
                                    this.updatePriceData.push(this.grdNewPriceDate.getSelectedData()[i])
                                }
                                await this.updatePriceData.update()
                                App.instance.setState({isExecute:false})
                                this.updatePriceData.clear()
                            }
                        })
                    }    
                    App.instance.setState({isExecute:false})
                }
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

                if(typeof this.piqX != 'undefined')
                {
                    this.core.socket.emit('piqXInvoiceSetStatus',{invoiceId:this.piqX[0].GUID,user:this.core.auth.data.CODE,status:1})
                }
                
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
                                    <NdButton id="btnImport" parent={this} icon="fa-solid fa-cloud-arrow-up" type="default"
                                    onClick={async()=>
                                    {
                                        this.popDocAi.show(this.docObj.dt()[0].OUTPUT)
                                        this.popDocAi.onImport = async(e) =>
                                        {
                                            if(typeof e != 'undefined')
                                            {
                                                if(e.CustomerCode != '')
                                                {
                                                    this.docObj.dt()[0].OUTPUT = e.CustomerGuid
                                                    this.docObj.docCustomer.dt()[0].OUTPUT = e.CustomerGuid
                                                    this.docObj.dt()[0].OUTPUT_CODE = e.CustomerCode
                                                    this.docObj.dt()[0].OUTPUT_NAME = e.CustomerName
                                                    this.docObj.dt()[0].VAT_ZERO = e.CustomerVatZero

                                                    let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                    
                                                    if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                    {
                                                        this.txtRef.value = e.CustomerCode
                                                    }
                                                    if(this.cmbDepot.value != '' && this.docLocked == false)
                                                    {
                                                        this.frmDocItems.option('disabled',false)
                                                    }

                                                    let tmpQuery = 
                                                    {
                                                        query : "SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER",
                                                        param : ['CUSTOMER:string|50'],
                                                        value : [e.CustomerGuid]
                                                    }
                                                    let tmpAdressData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpAdressData.result.recordset.length > 1)
                                                    {
                                                        this.pg_adress.onClick = async(pdata) =>
                                                        {
                                                            if(pdata.length > 0)
                                                            {
                                                                this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                            }
                                                        }
                                                        await this.pg_adress.show()
                                                        await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                    }
                                                }
                                                this.dtDocDate.value = moment(e.InvoiceDate)
                                                this.dtShipDate.value = moment(e.DueDate)

                                                this.grid.devGrid.beginUpdate()
                                                let tmpMissCodes = []
                                                for (let i = 0; i < e.Item.length; i++) 
                                                {
                                                    if(e.Item[i].ItemCode != '')
                                                    {
                                                        let tmpItem =
                                                        {
                                                            GUID : e.Item[i].ItemGuid,
                                                            CODE : e.Item[i].ItemCode,
                                                            NAME : e.Item[i].ItemName,
                                                            ITEM_TYPE : e.Item[i].ItemType,
                                                            UNIT : e.Item[i].ItemUnit,
                                                            COST_PRICE : e.Item[i].ItemCost,
                                                            VAT : e.Item[i].ItemVat
                                                        }
                                                        await this.addItem(tmpItem,null,e.Item[i].Quantity,e.Item[i].UnitPrice)
                                                    }
                                                    else
                                                    {
                                                        tmpMissCodes.push("'" +e.Item[i].ProductCode + "'")
                                                    }
                                                }
                                                this.grid.devGrid.endUpdate()
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
                                            }
                                            console.log(e)
                                        }
                                    }}/>
                                </Item>
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmDoc"  + this.tabIndex}
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
                                            await this.grid.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
                                        }
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                           this.saveDoc()
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
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
                                                await this.grid.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }
                                        else
                                        {
                                            await this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnInfo" parent={this} icon="info" type="default"
                                    onClick={async()=>
                                    {
                                        await this.popDetail.show()
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
                                        this.numDetailQuantity2.value = tmpQuantity2.toFixed(2)
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
                                    {
                                        console.log(this.docObj.isSaved)                             
                                        if(this.docObj.isSaved == false)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'isMsgSave',showTitle:true,title:this.t("isMsgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("isMsgSave.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("isMsgSave.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                            return
                                        }
                                        else
                                        {
                                            this.popDesign.show()
                                        }
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
                            <Form colCount={3} id={"frmDoc"  + this.tabIndex}>
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-6 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            maxLength={32}
                                            onChange={(async()=>
                                            {
                                                this.docObj.docCustomer.dt()[0].REF = this.txtRef.value
                                                this.checkRow()
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRef.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-6 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                            maxLength={10}
                                            button={
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
                                                        this.checkRow()
                                                    }
                                                }
                                            ]}
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = 0 AND DOC_TYPE = 20 ",
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
                                                this.checkRow()
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                                <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                    <RangeRule min={1} message={this.t("validRefNo")}/>
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
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
                                            this.docObj.docCustomer.dt()[0].INPUT = this.cmbDepot.value
                                            this.checkRow()
                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                            {
                                                this.frmDocItems.option('disabled',false)
                                            }
                                        }).bind(this)}
                                        data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validDepot")} />
                                            </Validator> 
                                        </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtDocNo")} alignment="right" />
                                    <NdTextBox id="txtDocNo" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_NO"}} 
                                    readOnly={false}
                                    onFocusOut={()=>
                                    {
                                        this.checkDocNo(this.txtDocNo.value)
                                    }}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  notRefresh = {true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                    {
                                        if(this.docObj.docItems.dt().length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgCustomerLock',showTitle:true,title:this.t("msgCustomerLock.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgCustomerLock.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerLock.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            return;
                                        }
                                        
                                        this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                {
                                                    this.frmDocItems.option('disabled',false)
                                                }
                                                this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                this.docObj.docCustomer.dt()[0].OUTPUT = data[0].GUID
                                                this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                this.docObj.dt()[0].VAT_ZERO = data[0].VAT_ZERO
                                                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                {
                                                    this.txtRef.value = data[0].CODE
                                                }
                                                if(this.cmbDepot.value != '' && this.docLocked == false)
                                                {
                                                    this.frmDocItems.option('disabled',false)
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
                                                    this.pg_adress.onClick = async(pdata) =>
                                                    {
                                                        if(pdata.length > 0)
                                                        {
                                                            this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                        }
                                                    }
                                                    await this.pg_adress.show()
                                                    await this.pg_adress.setData(tmpAdressData.result.recordset)
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
                                                onClick:async()=>
                                                {
                                                    if(this.docObj.docItems.dt().length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgCustomerLock',showTitle:true,title:this.t("msgCustomerLock.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCustomerLock.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerLock.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);
                                                        return;
                                                    }
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmDocItems.option('disabled',false)
                                                            }
                                                            this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                            this.docObj.docCustomer.dt()[0].OUTPUT = data[0].GUID
                                                            this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                            this.docObj.dt()[0].VAT_ZERO = data[0].VAT_ZERO
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE
                                                            }
                                                            if(this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmDocItems.option('disabled',false)
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
                                                                this.pg_adress.onClick = async(pdata) =>
                                                                {
                                                                    if(pdata.length > 0)
                                                                    {
                                                                        this.docObj.dt()[0].ADDRESS = pdata[0].ADRESS_NO
                                                                    }
                                                                }
                                                                await this.pg_adress.show()
                                                                await this.pg_adress.setData(tmpAdressData.result.recordset)
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
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
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                        this.docObj.docCustomer.dt()[0].DOC_DATE = this.dtDocDate.value
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
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
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* txtBarcode */}
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
                                                    if(this.txtBarcode.value == '')
                                                    {
                                                        return
                                                    }
                                                    if(this.cmbDepot.value == '' || this.txtCustomerCode.value == '')
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);
                                                        this.txtBarcode.value = ''
                                                        return
                                                    }
                                                  
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.value = ''
                                                        await this.core.util.waitUntil(100)

                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            this.grid.devGrid.beginUpdate()
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                await this.addItem(data[i],null)
                                                            }
                                                            this.grid.devGrid.endUpdate()
                                                        }
                                                    }
                                                    this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.txtBarcode.value == '')
                                        {
                                            return
                                        }
                                        if(this.cmbDepot.value == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                            this.txtBarcode.value = ''
                                            return
                                        }
                                        let tmpQuery = 
                                        {   query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE STATUS = 1 AND (BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER))",
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.msgQuantity.tmpData = tmpData.result.recordset[0]
                                            await this.msgQuantity.show()
                                            await this.addItem(tmpData.result.recordset[0],null,this.txtPopQteUnitQuantity.value,this.txtPopQteUnitPrice.value)
                                            this.txtBarcode.focus()
                                        }
                                        else
                                        {
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
                                                        this.msgQuantity.tmpData = data[0]
                                                        await this.msgQuantity.show()
                                                        await this.addItem(data[0],null,this.txtPopQteUnitQuantity.value,this.txtPopQteUnitPrice.value)
                                                        this.txtBarcode.focus()
                                                    }
                                                    else if(data.length > 1)
                                                    {
                                                        this.grid.devGrid.beginUpdate()
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            await this.addItem(data[i],null)
                                                        }
                                                        this.grid.devGrid.endUpdate()
                                                    }
                                                }
                                            }
                                            this.pg_txtItemsCode.setVal(this.txtBarcode.value)
                                        }
                                        this.txtBarcode.value = ''
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
                                    >
                                        <Validator validationGroup={"frmDoc"  + this.tabIndex}>
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
                                this.frmDocItems = e.component
                            }}>                                
                                <Item colSpan={3}>
                                    <Button icon="add"
                                    validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        this.customerControl = true
                                                        this.customerClear = false
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        
                                                        this.grid.devGrid.beginUpdate()
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            await this.addItem(data[i],null)
                                                        }
                                                        this.grid.devGrid.endUpdate()
                                                    }
                                                    this.pg_txtItemsCode.show()
                                                    return
                                                }
                                            }
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                this.customerControl = true
                                                this.customerClear = false
                                                this.combineControl = true
                                                this.combineNew = false
                                                
                                                this.grid.devGrid.beginUpdate()
                                                for (let i = 0; i < data.length; i++) 
                                                {
                                                    await this.addItem(data[i],null)
                                                }
                                                this.grid.devGrid.endUpdate()
                                            }
                                            this.pg_txtItemsCode.show()
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
                                    <Button icon="add" text={this.t("serviceAdd")}
                                    validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_service.onClick = async(data) =>
                                                    {
                                                        this.customerControl = true
                                                        this.customerClear = false
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        
                                                        this.grid.devGrid.beginUpdate()
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            await this.addItem(data[i],null)
                                                        }
                                                        this.grid.devGrid.endUpdate()
                                                    }
                                                    await this.pg_service.show()
                                                    return
                                                }
                                            }
                                           
                                            this.pg_service.onClick = async(data) =>
                                            {
                                                this.customerControl = true
                                                this.customerClear = false
                                                this.combineControl = true
                                                this.combineNew = false
                                                
                                                this.grid.devGrid.beginUpdate()
                                                for (let i = 0; i < data.length; i++)
                                                {
                                                    await this.addItem(data[i],null)
                                                }
                                                this.grid.devGrid.endUpdate()
                                            }
                                            await this.pg_service.show()   
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
                                    <Button icon="add" text={this.lang.t("collectiveItemAdd")}
                                    validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            await this.popMultiItem.show()
                                            await this.grdMultiItem.dataRefresh({source:this.multiItemData});
                                            if( typeof this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1] != 'undefined' && this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grid.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                    <Button icon="xlsxfile" text={this .t("excelAdd")}
                                    validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        await this.popExcel.show()
                                        let tmpShema = this.prmObj.filter({ID:'excelFormat',USERS:this.user.CODE}).getValue()

                                        if(typeof tmpShema == 'string')
                                        {
                                            tmpShema = JSON.parse(tmpShema)
                                        }
                                    
                                        this.txtPopExcelCode.value = tmpShema.CODE
                                        this.txtPopExcelQty.value = tmpShema.QTY
                                        this.txtPopExcelPrice.value = tmpShema.PRICE
                                        this.txtPopExcelVat.value = tmpShema.TVA
                                        this.txtPopExcelDisc.value = tmpShema.DISC
                                        this.txtPopExcelDiscRate.value = tmpShema.DISC_PER
                                    }}/>  
                                </Item>
                                <Item>
                                    <React.Fragment>
                                        <NdGrid parent={this} id={"grdPurcInv"+this.tabIndex} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter={{visible:false}}
                                        height={'400'} 
                                        width={'100%'}
                                        dbApply={false}
                                        sorting={{mode:'none'}}
                                        filterRow={{visible:true}}
                                        loadPanel={{enabled:true}}
                                        onRowPrepared={(e) =>
                                        {
                                            if(e.rowType == 'data' && e.data.ITEM_TYPE == 1)
                                            {
                                                e.rowElement.style.color ="#feaa2b"
                                            }
                                        }}
                                        onRowUpdating={async (e)=>
                                        {
                                            if(this.docLocked == true)
                                            {
                                                e.cancel = true
                                                let tmpConfObj =
                                                {
                                                    id:'msgGetLocked',showTitle:true,title:this.t("msgGetLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgGetLocked.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgGetLocked.msg")}</div>)
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
                                        onCellPrepared={(e) =>
                                        {
                                            if (e.column.dataField === 'PRICE' && e.data && e.data.PRICE < 0) 
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgNegativePrice',showTitle:true,title:this.t("msgNegativePrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgNegativePrice.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNegativePrice.msg")}</div>)
                                                    }
                                                
                                                    dialog(tmpConfObj);
                                                    e.data.PRICE = Math.abs(e.data.PRICE);
                                                }
    
                                                if(e.rowType === "data" && e.column.dataField === "DIFF_PRICE" && e.data.ITEM_TYPE == 0 && e.data.PRICE >= 0)
                                                {
                                                    if(e.data.PRICE > e.data.CUSTOMER_PRICE)
                                                    {
                                                        e.cellElement.style.color ="red"
                                                        e.cellElement.style.fontWeight ="bold"
                                                    }
                                                    else if(e.data.PRICE < e.data.CUSTOMER_PRICE)
                                                    {
                                                        e.cellElement.style.color ="green"
                                                        e.cellElement.style.fontWeight ="bold"
                                                    }
                                                    else
                                                    {
                                                        e.cellElement.style.color ="blue"
                                                    }
                                                }
                                            }}
                                            onRowUpdated={async(e)=>
                                            {
                                                if(typeof e.data.QUANTITY != 'undefined')
                                                {
                                                    e.key.SUB_QUANTITY =  e.data.QUANTITY / e.key.SUB_FACTOR
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT dbo.FN_PRICE(@ITEM_GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER_GUID,'00000000-0000-0000-0000-000000000000',0,1,0) AS PRICE",
                                                        param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                                                        value : [e.key.ITEM,this.docObj.dt()[0].OUTPUT,e.data.QUANTITY]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
                                                        e.key.SUB_PRICE = Number(((tmpData.result.recordset[0].PRICE).toFixed(3)) * e.key.SUB_FACTOR).round(2)
                                                        
                                                        this.calculateTotal()
                                                    }
                                                }
                                                if(typeof e.data.SUB_QUANTITY != 'undefined')
                                                {
                                                    e.key.QUANTITY = e.data.SUB_QUANTITY * e.key.SUB_FACTOR
                                                }
                                                if(typeof e.data.PRICE != 'undefined' && e.data.PRICE >= 0)
                                                {
                                                    e.key.SUB_PRICE = e.data.PRICE * e.key.SUB_FACTOR
                                                }
                                                if(typeof e.data.SUB_PRICE != 'undefined')
                                                {
                                                    e.key.PRICE = e.data.SUB_PRICE / e.key.SUB_FACTOR
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
                                            
                                            let tmpData = this.sysParam.filter({ID:'negativeQuantityForPruchase',USERS:this.user.CODE}).getValue()
                                            if(typeof tmpData != 'undefined' && tmpData.value ==  false)
                                            {
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
                                            }
                                            e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                            if(this.docObj.dt()[0].VAT_ZERO != 1)
                                            {
                                                e.key.VAT = parseFloat(((((e.key.TOTALHT) - (parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
                                            }
                                            else
                                            {
                                                e.key.VAT = 0
                                                e.key.VAT_RATE = 0
                                            }
                                            e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                            e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
                                            e.key.DIFF_PRICE = e.key.PRICE - e.key.CUSTOMER_PRICE
                                            if(e.key.DISCOUNT == 0)
                                            {
                                                e.key.DISCOUNT_RATE = 0
                                                e.key.DISCOUNT_1 = 0
                                                e.key.DISCOUNT_2 = 0
                                                e.key.DISCOUNT_3 = 0
                                            }
                                            if(typeof e.data.DISCOUNT_RATE == 'undefined')
                                            {
                                               e.key.DISCOUNT_RATE = Number(e.key.PRICE * e.key.QUANTITY).rate2Num(e.key.DISCOUNT)
                                            }
                                            this.calculateTotal()
                                        }}
                                        onRowRemoved={async (e)=>
                                        {
                                            this.calculateTotal()
                                        }}
                                        onReady={async()=>
                                        {
                                            await this["grdPurcInv" + this.tabIndex].dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
                                        }}
                                        >
                                            <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPurcInv"}/>
                                            <ColumnChooser enabled={true} />
                                            <Paging defaultPageSize={10} />
                                            <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Scrolling mode="standart" />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Export fileName={this.lang.t("menuOff.ftr_02_001")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="LINE_NO" caption={this.t("grdPurcInv.clmLineNo")} visible={false} width={40} dataType={'number'} allowHeaderFiltering={false} defaultSortOrder="desc"/>
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcInv.clmCreateDate")} width={80} allowEditing={false} allowHeaderFiltering={false}/>
                                            <Column dataField="CUSER_NAME" caption={this.t("grdPurcInv.clmCuser")} width={80} allowEditing={false} allowHeaderFiltering={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdPurcInv.clmItemCode")} width={85} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                            <Column dataField="MULTICODE" caption={this.t("grdPurcInv.clmMulticode")} width={60} allowHeaderFiltering={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdPurcInv.clmItemName")} width={200} allowHeaderFiltering={false}/>
                                            <Column dataField="ORIGIN" caption={this.t("grdPurcInv.clmOrigin")} width={60} allowEditing={true}  allowHeaderFiltering={false} editCellRender={this._cellRoleRender} />
                                            <Column dataField="QUANTITY" caption={this.t("grdPurcInv.clmQuantity")} width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                            <Column dataField="SUB_FACTOR" caption={this.t("grdPurcInv.clmSubFactor")} width={70} allowEditing={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="SUB_QUANTITY" caption={this.t("grdPurcInv.clmSubQuantity")} dataType={'number'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="PRICE" caption={this.t("grdPurcInv.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                            <Column dataField="SUB_PRICE" caption={this.t("grdPurcInv.clmSubPrice")} dataType={'number'} format={Number.money.sign + '#,##0.000'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + Number.money.sign + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="CUSTOMER_PRICE" caption={this.t("grdPurcInv.clmCustomerPrice")} dataType={'number'} format={Number.money.sign + '#,##0.000'} width={70} allowHeaderFiltering={false} allowEditing={false}/>
                                            <Column dataField="DIFF_PRICE" caption={this.t("grdPurcInv.clmDiffPrice")} dataType={'number'} format={Number.money.sign + '#,##0.000'} width={70} allowHeaderFiltering={false} allowEditing={false}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdPurcInv.clmAmount")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                            <Column dataField="DISCOUNT" caption={this.t("grdPurcInv.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: Number.money.code,precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                            <Column dataField="DISCOUNT_RATE" caption={this.t("grdPurcInv.clmDiscountRate")} dataType={'number'}  format={'##0.00'} width={60} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                            <Column dataField="VAT" caption={this.t("grdPurcInv.clmVat")} format={Number.money.sign + '#,##0.000'}allowEditing={false} width={75} allowHeaderFiltering={false}/>
                                            <Column dataField="VAT_RATE" caption={this.t("grdPurcInv.clmVat")} format={'%#,##'} allowEditing={false} width={55} allowHeaderFiltering={false}/>
                                            <Column dataField="TOTALHT" caption={this.t("grdPurcInv.clmTotalHt")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                            <Column dataField="TOTAL" caption={this.t("grdPurcInv.clmTotal")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                            <Column dataField="CONNECT_REF" caption={this.t("grdPurcInv.clmDispatch")}  width={110} allowEditing={false}  allowHeaderFiltering={false}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdPurcInv.clmDescription")} width={80}   allowHeaderFiltering={false}/>
                                        </NdGrid>
                                        <ContextMenu dataSource={this.rightItems}
                                        width={200}
                                        target={"#grdPurcInv"+this.tabIndex}
                                        onItemClick={(async(e)=>
                                        {
                                            if(e.itemData.text == this.t("getDispatch"))
                                            {
                                                this.getDispatch()
                                            }
                                            else if(e.itemData.text == this.t("getProforma"))
                                            {
                                                this.getProforma()
                                            }
                                            else if(e.itemData.text == this.t("getOrders"))
                                            {
                                                this.getOrders()
                                            }
                                            else if(e.itemData.text == this.t("getOffers"))
                                            {
                                                this.getOffers()
                                            }
                                        }).bind(this)} />
                                    </React.Fragment>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <TabPanel height="100%">
                                <Item title={this.t("tabTitleSubtotal")}>
                                    <div className="row px-2 pt-2">
                                        <div className="col-12">
                                            <Form colCount={4} parent={this} id={"frmDoc"  + this.tabIndex}>
                                                {/* Ara Toplam */}
                                                <EmptyItem colSpan={1}/>
                                                <Item>
                                                    <Label text={this.t("txtDiffrentPositive")} alignment="right" />
                                                    <NdTextBox id="txtDiffrentPositive" parent={this} simple={true} readOnly={true} 
                                                    maxLength={32}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'print',
                                                                onClick:async ()  =>
                                                                {
                                                                    if(this.docObj.isSaved == false)
                                                                    {
                                                                        let tmpConfObj =
                                                                        {
                                                                            id:'isMsgSave',showTitle:true,title:this.t("isMsgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                            button:[{id:"btn01",caption:this.t("isMsgSave.btn01"),location:'after'}],
                                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("isMsgSave.msg")}</div>)
                                                                        }
                                                                        await dialog(tmpConfObj);
                                                                        return
                                                                    }
                                                                    App.instance.menuClick(
                                                                    {
                                                                        id: 'tkf_02_003',
                                                                        text: this.lang.t('menuOff.tkf_02_003'),
                                                                        path: 'offers/documents/priceDiffDemand.js',
                                                                        pagePrm:{GUID:this.docObj.dt()[0].GUID}
                                                                    })
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    ></NdTextBox>
                                                </Item>
                                                <Item>
                                                    <Label text={this.t("txtAmount")} alignment="right" />
                                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}maxLength={32}></NdTextBox>
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
                                                                onClick:async()  =>
                                                                {
                                                                    await this.popDiscount.show()
                                                                    this.chkFirstDiscount.value = false
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
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    ></NdTextBox>
                                                </Item>
                                                {/* İndirim */}
                                                <EmptyItem colSpan={1}/>
                                                <Item>
                                                    <Label text={this.t("txtDiffrentNegative")} alignment="right" />
                                                    <NdTextBox id="txtDiffrentNegative" parent={this} simple={true} readOnly={true} maxLength={32}></NdTextBox>
                                                </Item>
                                                <Item>
                                                    <Label text={this.t("txtSubTotal")} alignment="right" />
                                                    <NdTextBox id="txtSubTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"SUBTOTAL"}} maxLength={32}></NdTextBox>
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
                                                                onClick:async()  =>
                                                                {
                                                                    await this.popDocDiscount.show()
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
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    ></NdTextBox>
                                                </Item>
                                                {/* KDV */}
                                                <EmptyItem colSpan={1}/>
                                                <Item  >
                                                    <Label text={this.t("txtDiffrentTotal")} alignment="right" />
                                                    <NdTextBox id="txtDiffrentTotal" parent={this} simple={true} readOnly={true} maxLength={32}></NdTextBox>
                                                </Item>
                                                <Item>
                                                    <Label text={this.t("txtTotalHt")} alignment="right" />
                                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}} maxLength={32}></NdTextBox>
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
                                                                    await this.popVatRate.show()
                                                                    this.vatRate.clear()
                                                                    for (let i = 0; i < this.docObj.docItems.dt().groupBy('VAT_RATE').length; i++) 
                                                                    {
                                                                        let tmpTotalHt  =  parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("TOTALHT",2) -this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("DOC_DISCOUNT",2))
                                                                        let tmpVat = parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                                        let tmpData = {"RATE":this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat,"TOTALHT":tmpTotalHt}
                                                                        this.vatRate.push(tmpData)
                                                                    }
                                                                    await this.grdVatRate.dataRefresh({source:this.vatRate})
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    ></NdTextBox>
                                                </Item>
                                                {/* KDV */}
                                                <EmptyItem colSpan={1}/>
                                                <Item  >
                                                    <Label text={this.t("txtDiffrentInv")} alignment="right" />
                                                    <NdTextBox id="txtDiffrentInv" parent={this} simple={true} readOnly={true} maxLength={32}></NdTextBox>
                                                </Item>
                                                <EmptyItem colSpan={1}/>
                                                <Item>
                                                    <Label text={this.t("txtTotal")} alignment="right" />
                                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}} maxLength={32}></NdTextBox>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleDetail")}>
                                    <div className="row px-2 pt-2">
                                        <div className="col-12">
                                        <Form colCount={4}>
                                            {/* txtTransport */}
                                            <Item>                                    
                                                <Label text={this.t("txtTransport")} alignment="right" />
                                                <NdTextBox id="txtTransport" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.docObj.dt('DOC'),field:"TRANSPORT_TYPE"}} 
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} readOnly={true}
                                                button=
                                                {
                                                    [
                                                        {
                                                            id:'01',
                                                            icon:'more',
                                                            onClick:async()=>
                                                            {
                                                                this.pg_transportType.onClick = (data) =>
                                                                {
                                                                    if(data.length > 0)
                                                                    {
                                                                        this.docObj.dt()[0].TRANSPORT_TYPE = data[0].CODE
                                                                    }
                                                                }
                                                                await this.pg_transportType.show()
                                                            }
                                                        },
                                                    ]
                                                }
                                                onChange={(async()=>
                                                {
                                                    let tmpResult = await this.checkItem(this.txtRef.value)
                                                    if(tmpResult == 3)
                                                    {
                                                        this.txtRef.value = "";
                                                    }
                                                }).bind(this)} 
                                                selectAll={true}                           
                                                >     
                                                </NdTextBox>      
                                                {/*GÜMRÜK KODU POPUP */}
                                                <NdPopGrid id={"pg_transportType"} parent={this} container={"#root"} 
                                                visible={false}
                                                position={{of:'#root'}} 
                                                showTitle={true} 
                                                showBorders={true}
                                                width={'90%'}
                                                height={'90%'}
                                                title={this.t("pg_transportType.title")} 
                                                selection={{mode:"single"}}
                                                data={{source:{select:{query : "SELECT TYPE_NO AS CODE,TYPE_NAME AS NAME FROM TRANSPORT_TYPE_VW_01"},sql:this.core.sql}}}
                                                deferRendering={true}
                                                >
                                                    <Column dataField="CODE" caption={this.t("pg_transportType.clmCode")} width={'20%'} />
                                                    <Column dataField="NAME" caption={this.t("pg_transportType.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                </NdPopGrid>
                                            </Item>
                                        </Form>
                                        </div>
                                    </div>
                                </Item>
                            </TabPanel>
                        </div>
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
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '14'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPrintPop"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popDesign.lang")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={localStorage.getItem('lang').toUpperCase()}
                                    searchEnabled={true}
                                    data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                App.instance.setState({isExecute:true})
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                console.log(JSON.stringify(tmpData.result.recordset))
                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                {
                                                    App.instance.setState({isExecute:false})
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
                                    <div className='row py-2'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    console.log(tmpQuery)
                                                    console.log(1)
                                                    App.instance.setState({isExecute:true})
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.setState({isExecute:false})
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        console.log(tmpData.result.recordset[0].PATH)
                                                        console.log(pResult.split('|')[0])
                                                        console.log(tmpData.result.recordset)
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                            console.log(mywindow)
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
                                            <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
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
                                                        await this.popMailSend.show()
                                                        this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                    }
                                                    else
                                                    {
                                                        await this.popMailSend.show()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
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
                        height={'250'}
                        position={{of:'#root'}}
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDetail.count")} alignment="right" />
                                    <NdNumberBox id="numDetailCount" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDetail.quantity")} alignment="right" />
                                    <NdNumberBox id="numDetailQuantity" parent={this} simple={true} readOnly={true} maxLength={32}/>
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
                                                                    "FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID OR INVOICE_DOC_GUID = @DOC_GUID ) AS TMP GROUP BY NAME ",
                                                            param : ['DOC_GUID:string|50'],
                                                            value : [this.docObj.dt()[0].GUID]
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        this.unitDetailData.clear()
                                                        if(tmpData.result.recordset.length > 0)
                                                        {   
                                                            await this.popUnit2.show();
                                                            await this.grdUnit2.dataRefresh({source:this.unitDetailData});
                                                            for (let i = 0; i < tmpData.result.recordset.length; i++) 
                                                            {
                                                                this.unitDetailData.push(tmpData.result.recordset[i])
                                                            }
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
                        deferRendering={true}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMailAddress"
                                    displayExpr="MAIL_ADDRESS"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT GUID,MAIL_ADDRESS FROM [dbo].[MAIL_SETTINGS]"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbMailAddress',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbMailAddress',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}/>
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
                                                        query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO " ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    App.instance.setState({isExecute:true})
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.setState({isExecute:false})
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
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
                                                        let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"facture " + this.docObj.dt()[0].REF + "-" + this.docObj.dt()[0].REF_NO + ".pdf",attachData:tmpAttach,text:"",mailGuid:this.cmbMailAddress.value}
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
                    {/* Document AI PopUp */}
                    <div>
                        <NdDocAi id={"popDocAi"} parent={this}/>
                    </div>
                    <div>{super.render()}</div>
                </ScrollView>     
            </div>
        )
    }
}