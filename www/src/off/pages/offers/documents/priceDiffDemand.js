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

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';

export default class priceDiffDemand extends DocBase
{
    constructor(props)
    {
        super(props)
        this.type = 1;
        this.docType = 63;
        this.rebate = 0;

        this._cellRoleRender = this._cellRoleRender.bind(this)

        this.frmDocItems = undefined;
        this.docLocked = false;
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(100)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.getPriceDiff(this.pagePrm.GUID)
        }
    }
    async getPriceDiff(pGuid) 
    {
       
        let tmpQuery = 
        {
            query: "SELECT DOC_GUID,REF,REF_NO FROM DOC_DEMAND_VW_01 WHERE INVOICE_DOC_GUID = @DOC_GUID",
            param: ['DOC_GUID:string|50'],
            value: [pGuid]
        };
        let tmpData = await this.core.sql.execute(tmpQuery);

        if(tmpData.result.recordset.length > 0) 
        {

            this.getDoc(tmpData.result.recordset.DOC_GUID,tmpData.result.recordset.REF,tmpData.result.recordset.REF_NO)
        }
        else
        { 
            let tmpQuery = 
            {
                query: "SELECT * FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID",
                param: ['DOC_GUID:string|50'],
                value: [pGuid]
            };
            let tmpData = await this.core.sql.execute(tmpQuery);
            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.dt()[0].OUTPUT_CODE = tmpData.result.recordset[0].INPUT_CODE  
                this.docObj.dt()[0].OUTPUT_NAME = tmpData.result.recordset[0].INPUT_NAME  
                this.docObj.dt()[0].OUTPUT = tmpData.result.recordset[0].INPUT
                this.docObj.dt()[0].INPUT = tmpData.result.recordset[0].OUTPUT
                this.docObj.dt()[0].INPUT_NAME = tmpData.result.recordset[0].OUTPUT_NAME
                this.docObj.dt()[0].INPUT_CODE= tmpData.result.recordset[0].OUTPUT_CODE
                this.docObj.dt()[0].REF = tmpData.result.recordset[0].OUTPUT_CODE
    
                let tmpRefQuery = {
                    query: "SELECT ISNULL(MAX(REF_NO),0) +1 AS REF_NO FROM DOC_VW_01 WHERE REF = @REF AND DOC_TYPE = 63 AND  TYPE = 1",
                    param: ['REF:string|50'],
                    value: [this.docObj.dt()[0].REF]
                };
                let tmpRefData = await this.core.sql.execute(tmpRefQuery);
                this.docObj.dt()[0].REF_NO = tmpRefData.result.recordset[0].REF_NO
                           
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    if(tmpData.result.recordset[i].DIFF_PRICE != 0.00 )
                    {
                        let tmpDocDemand = {...this.docObj.docDemand.empty}
                        tmpDocDemand.DOC_TYPE =  this.docObj.dt()[0].DOC_TYPE
                        tmpDocDemand.TYPE = this.docObj.dt()[0].TYPE
                        tmpDocDemand.OUTPUT_CODE = this.docObj.dt()[0].OUTPUT_CODE
                        tmpDocDemand.DOC_GUID = this.docObj.dt()[0].GUID
                        tmpDocDemand.OUTPUT = this.docObj.dt()[0].OUTPUT
                        tmpDocDemand.INPUT =  this.docObj.dt()[0].INPUT
                        tmpDocDemand.REF =  this.docObj.dt()[0].REF
                        tmpDocDemand.REF_NO =  this.docObj.dt()[0].REF_NO
                        tmpDocDemand.INPUT_NAME =  this.docObj.dt()[0].INPUT_NAME
                        tmpDocDemand.DOC_DATE = moment(this.docObj.dt()[0].DOC_DATE)
                        tmpDocDemand.ITEM = tmpData.result.recordset[i].ITEM
                        tmpDocDemand.ITEM_CODE = tmpData.result.recordset[i].ITEM_CODE
                        tmpDocDemand.ITEM_NAME = tmpData.result.recordset[i].ITEM_NAME
                        tmpDocDemand.QUANTITY = tmpData.result.recordset[i].QUANTITY
                        tmpDocDemand.UNIT = tmpData.result.recordset[i].UNIT
                        tmpDocDemand.LINE_NO = this.docObj.docDemand.dt().max("LINE_NO") + 1
                        tmpDocDemand.PRICE = tmpData.result.recordset[i].DIFF_PRICE
                        tmpDocDemand.INVOICED_PRICE = tmpData.result.recordset[i].PRICE
                        tmpDocDemand.PRICE_AGREED = tmpData.result.recordset[i].CUSTOMER_PRICE
                        tmpDocDemand.TOTALHT = Number((parseFloat((tmpDocDemand.PRICE * tmpDocDemand.QUANTITY).toFixed(3)) - (parseFloat(tmpDocDemand.DISCOUNT)))).round(2)
                        tmpDocDemand.VAT = parseFloat(((((tmpDocDemand.TOTALHT) - (parseFloat(tmpDocDemand.DOC_DISCOUNT))) * (tmpDocDemand.VAT_RATE) / 100))).round(6);
                        tmpDocDemand.AMOUNT = parseFloat((tmpDocDemand.PRICE * tmpDocDemand.QUANTITY).toFixed(3)).round(2)
                        tmpDocDemand.TOTAL = Number(((tmpDocDemand.TOTALHT - tmpDocDemand.DOC_DISCOUNT) + tmpDocDemand.VAT)).round(2)
                        tmpDocDemand.CONNECT_DOC_DATE = tmpData.result.recordset[i].DOC_DATE,
                        tmpDocDemand.CONNECT_REF = tmpData.result.recordset[i].REF + '-' + tmpData.result.recordset[i].REF_NO
                        tmpDocDemand.INVOICE_DOC_GUID = pGuid,
                        tmpDocDemand.INVOICE_LINE_GUID = tmpData.result.recordset[i].GUID,
    
                        this.docObj.docDemand.addEmpty(tmpDocDemand)
                    }
                }
            }
            this.calculateTotal()
        }
    }
    async init()
    {
        await super.init()
        this.grdDiffOff.devGrid.clearFilter("row")
        this.dtDocDate.value = moment(new Date())
        this.dtShipDate.value = moment(new Date())

        this.docLocked = false
        
        // this.frmDocItems.option('disabled',true)        

        this.pg_txtItemsCode.on('showing',()=>
        {
            this.pg_txtItemsCode.setSource(
            {
                source:
                {
                    select:
                    {
                        query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE,UNIT,STATUS,(SELECT [dbo].[FN_PRICE] " +
                                "(GUID,1,GETDATE(),'" + this.docObj.dt()[0].OUTPUT +"','00000000-0000-0000-0000-000000000000',1,0,0)) AS PRICE " +
                                "FROM ITEMS_VW_01 WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))" ,
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
                        query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            })
        })
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        App.instance.setState({isExecute:true})
        await super.getDoc(pGuid,pRef,pRefno);
        App.instance.setState({isExecute:false})

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    calculateTotal()
    {
        super.calculateTotal()
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
                            
                            this.grdDiffOff.devGrid.beginUpdate()
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                            this.grdDiffOff.devGrid.endUpdate()
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
                                    
                                    this.grdDiffOff.devGrid.beginUpdate()
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                    this.grdDiffOff.devGrid.endUpdate()
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
                    this.grdDiffOff.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
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
                                e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) + e.data.VAT)).round(2)
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
                    this.grdDiffOff.devGrid.cellValue(e.rowIndex,"DISCOUNT",r.component._changedValue)
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
                                e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY)).round(2)
                                e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) + e.data.VAT)).round(2)
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
                    this.grdDiffOff.devGrid.cellValue(e.rowIndex,"DISCOUNT_RATE",r.component._changedValue)
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
                                e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));
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
                                        query :"UPDATE ITEMS_GRP SET LDATE = GETDATE(),LUSER = @PCUSER,ORGINS = @ORGINS WHERE ITEM = @ITEM ",
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
            //GRID DE AYNI ÜRÜNDEN OLUP OLMADIĞI KONTROL EDİLİYOR VE KULLANICIYA SORULUYOR,CEVAP A GÖRE SATIR BİRLİŞTERİLİYOR.
            let tmpMergDt = await this.mergeItem(pData.CODE)
            if(typeof tmpMergDt != 'undefined' && this.combineNew == false)
            {
                tmpMergDt[0].QUANTITY = tmpMergDt[0].QUANTITY + pQuantity
                tmpMergDt[0].SUB_QUANTITY = tmpMergDt[0].SUB_QUANTITY / tmpMergDt[0].SUB_FACTOR
                tmpMergDt[0].VAT = Number((tmpMergDt[0].VAT + (tmpMergDt[0].PRICE * (tmpMergDt[0].VAT_RATE / 100) * pQuantity))).round(6)
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
                let tmpDocDemand = {...this.docObj.docDemand.empty}
                tmpDocDemand.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocDemand.TYPE = this.docObj.dt()[0].TYPE
                tmpDocDemand.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocDemand.LINE_NO = this.docObj.docDemand.dt().length
                tmpDocDemand.REF = this.docObj.dt()[0].REF
                // tmpDocDemand.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocDemand.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocDemand.INPUT = this.docObj.dt()[0].INPUT
                tmpDocDemand.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                this.docObj.docDemand.addEmpty(tmpDocDemand)
                pIndex = this.docObj.docDemand.dt().length - 1
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
                this.docObj.docDemand.dt()[pIndex].SUB_FACTOR = tmpGrpData.result.recordset[0].SUB_FACTOR
                this.docObj.docDemand.dt()[pIndex].SUB_SYMBOL = tmpGrpData.result.recordset[0].SUB_SYMBOL
                this.docObj.docDemand.dt()[pIndex].UNIT_SHORT = tmpGrpData.result.recordset[0].UNIT_SHORT
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
                        query :"SELECT MULTICODE,(SELECT dbo.FN_PRICE(ITEM_GUID,@QUANTITY,GETDATE(),CUSTOMER_GUID,'00000000-0000-0000-0000-000000000000',0,1,0)) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
                        param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                        value : [pData.CODE,this.docObj.dt()[0].INPUT,pQuantity]
                    }
                    let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
                    if(tmpCheckData.result.recordset.length == 0)
                    {
                        let tmpCustomerBtn = ''
                        if(this.customerClear == true)
                        {
                            await this.grdDiffOff.devGrid.deleteRow(0)
                            resolve()
                            return 
                        }
                        
                        if(tmpCustomerBtn == 'btn02')
                        {
                            resolve()
                            return
                        }
                    }
                }
            }
            this.docObj.docDemand.dt()[pIndex].ITEM_CODE = pData.CODE
            this.docObj.docDemand.dt()[pIndex].ITEM = pData.GUID
            this.docObj.docDemand.dt()[pIndex].ITEM_TYPE = pData.ITEM_TYPE
            this.docObj.docDemand.dt()[pIndex].UNIT = pData.UNIT
            this.docObj.docDemand.dt()[pIndex].COST_PRICE = pData.COST_PRICE

            if(typeof pVat == 'undefined')
            {
                this.docObj.docDemand.dt()[pIndex].VAT_RATE = pData.VAT
                this.docObj.docDemand.dt()[pIndex].OLD_VAT = pData.VAT
            }
            else
            {
                this.docObj.docDemand.dt()[pIndex].VAT_RATE = Number(pVat)
                this.docObj.docDemand.dt()[pIndex].OLD_VAT = pData.VAT
            }
            this.docObj.docDemand.dt()[pIndex].ITEM_NAME = pData.NAME

            this.docObj.docDemand.dt()[pIndex].QUANTITY = pQuantity
            this.docObj.docDemand.dt()[pIndex].SUB_QUANTITY = pQuantity / this.docObj.docDemand.dt()[pIndex].SUB_FACTOR

            let tmpQuery = 
            {
                query :"SELECT (SELECT dbo.FN_PRICE(ITEM_GUID,@QUANTITY,GETDATE(),CUSTOMER_GUID,'00000000-0000-0000-0000-000000000000',0,1,0)) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID ORDER BY LDATE DESC",
                param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                value : [pData.CODE,this.docObj.dt()[0].INPUT,pQuantity]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(typeof pPrice == 'undefined')
            {
                if(tmpData.result.recordset.length > 0)
                {
                    this.docObj.docDemand.dt()[pIndex].PRICE_AGREED = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4))
                    this.docObj.docDemand.dt()[pIndex].VAT = Number((tmpData.result.recordset[0].PRICE * (this.docObj.docDemand.dt()[pIndex].VAT_RATE / 100) * pQuantity)).round(6)
                    this.docObj.docDemand.dt()[pIndex].AMOUNT = Number(tmpData.result.recordset[0].PRICE  * pQuantity).round(2)
                    this.docObj.docDemand.dt()[pIndex].TOTAL = Number(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docDemand.dt()[pIndex].VAT)).round(2)
                    this.docObj.docDemand.dt()[pIndex].TOTALHT = Number((this.docObj.docDemand.dt()[pIndex].AMOUNT - this.docObj.docDemand.dt()[pIndex].DISCOUNT)).round(2)
                    this.docObj.docDemand.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) * this.docObj.docDemand.dt()[pIndex].SUB_FACTOR).round(2)
                    this.calculateTotal()
                }
                else
                {
                    this.docObj.docDemand.dt()[pIndex].PRICE_AGREED = 0
                    this.docObj.docDemand.dt()[pIndex].VAT = 0
                    this.docObj.docDemand.dt()[pIndex].AMOUNT = 0
                    this.docObj.docDemand.dt()[pIndex].TOTAL =  0
                    this.docObj.docDemand.dt()[pIndex].TOTALHT = 0
                    this.calculateTotal()
                }
            }
            else
            {
                this.docObj.docDemand.dt()[pIndex].PRICE = parseFloat((pPrice).toFixed(4))
                if(typeof pDiscountPer != 'undefined')
                {
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT = typeof pDiscountPer == 'undefined' ? 0 : ((this.docObj.docDemand.dt()[pIndex].PRICE * pDiscountPer / 100) * pQuantity).toFixed(4)
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT_RATE = typeof pDiscountPer == 'undefined' ? 0 : pDiscountPer
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT_1 = this.docObj.docDemand.dt()[pIndex].DISCOUNT
                }
                else
                {
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT = typeof pDiscount == 'undefined' ? 0 : pDiscount
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT_RATE = typeof pDiscount == 'undefined' ? 0 : (pDiscount / this.docObj.docDemand.dt()[pIndex].AMOUNT)  * 100
                    this.docObj.docDemand.dt()[pIndex].DISCOUNT_1 = this.docObj.docDemand.dt()[pIndex].DISCOUNT
                }

                this.docObj.docDemand.dt()[pIndex].TOTALHT = Number(((pPrice  * pQuantity) - this.docObj.docDemand.dt()[pIndex].DISCOUNT)).round(2)
                this.docObj.docDemand.dt()[pIndex].VAT = parseFloat((this.docObj.docDemand.dt()[pIndex].TOTALHT * (this.docObj.docDemand.dt()[pIndex].VAT_RATE / 100) ).toFixed(6))
                this.docObj.docDemand.dt()[pIndex].AMOUNT = parseFloat((pPrice  * pQuantity)).round(2)
                this.docObj.docDemand.dt()[pIndex].TOTAL = Number((this.docObj.docDemand.dt()[pIndex].TOTALHT + this.docObj.docDemand.dt()[pIndex].VAT)).round(2)
                this.calculateTotal()
            }
            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.docDemand.dt()[pIndex].CUSTOMER_PRICE = tmpData.result.recordset[0].PRICE
                this.docObj.docDemand.dt()[pIndex].DIFF_PRICE = this.docObj.docDemand.dt()[pIndex].PRICE - this.docObj.docDemand.dt()[pIndex].CUSTOMER_PRICE
            }
            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
            await this.itemRelated(pData.GUID,pQuantity)
            //*****************************************/
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
                    query :"SELECT GUID,CODE,NAME,VAT,ITEMS_VW_01.UNIT,1 AS QUANTITY,0 AS ITEM_TYPE,COST_PRICE," + 
                    "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND CUSTOMER = '"+this.docObj.dt()[0].OUTPUT+"' AND DELETED = 0),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_01.GUID AND CUSTOMER = '"+this.docObj.dt()[0].OUTPUT+"' AND DELETED = 0),'') = @VALUE AND ITEMS_VW_01.STATUS = 1" ,
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
                    query :"SELECT GUID,CODE,NAME,VAT,UNIT,1 AS QUANTITY,0 AS ITEM_TYPE," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE CODE = @VALUE AND STATUS = 1" ,
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
    render()
    {
        return(
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
                                <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPriceDiffOff"  + this.tabIndex}
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
                                    if(typeof this.docObj.docDemand.dt()[0] == 'undefined')
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
                                    if(this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1].ITEM_CODE == '')
                                    {
                                        await this.grdDiffOff.devGrid.deleteRow(this.docObj.docDemand.dt().length - 1)
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
                                    if(typeof this.docObj.docDemand.dt()[0] == 'undefined')
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
                                        this.docLocked = true
                                        if(this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdDiffOff.devGrid.deleteRow(this.docObj.docDemand.dt().length - 1)
                                        }

                                        //***** TICKET İMZALAMA *****/
                                        let tmpSignedData = await this.nf525.signatureDoc(this.docObj.dt()[0],this.docObj.docDemand.dt())                
                                        this.docObj.dt()[0].SIGNATURE = tmpSignedData.SIGNATURE
                                        this.docObj.dt()[0].SIGNATURE_SUM = tmpSignedData.SIGNATURE_SUM
                                        if((await this.docObj.save()) == 0)
                                        {                                                    
                                            let tmpConfObj =
                                            {
                                                id:'msgLocked',showTitle:true,title:this.t("msgLocked.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgLocked.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgLocked.msg")}</div>)
                                            }

                                            await dialog(tmpConfObj);
                                            this.frmDocItems.option('disabled',true)
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
                                <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
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
                        <Form colCount={3} id={"frmPriceDiffOff"  + this.tabIndex}>
                            {/* txtRef-Refno */}
                            <Item>
                                <Label text={this.t("txtRefRefno")} alignment="right" />
                                <div className="row">
                                    <div className="col-4 pe-0">
                                        <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        readOnly={true}
                                        maxLength={32}
                                        onValueChanged={(async()=>
                                        {
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmPriceDiffOff"  + this.tabIndex}>
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
                                                query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = 1 AND DOC_TYPE = 63 ",
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
                                <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh={true}
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
                                        this.frmDocItems.option('disabled',false)
                                    }
                                }).bind(this)}
                                data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmPriceDiffOff"  + this.tabIndex}>
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
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                onEnterKey={(async(r)=>
                                {
                                    if(this.docObj.docDemand.dt().length > 0)
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
                                    await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                    {
                                        if(data.length > 0)
                                        {
                                            this.docObj.dt()[0].INPUT = data[0].GUID
                                            this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                            this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                            this.docObj.dt()[0].ZIPCODE = data[0].ZIPCODE
                                            this.docObj.dt()[0].TAX_NO = data[0].TAX_NO
                                           
                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                            {
                                                this.txtRef.value=data[0].CODE;
                                                this.txtRef.props.onValueChanged()
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
                                                        this.docObj.dt()[0].ZIPCODE = pdata[0].ZIPCODE
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
                                                if(this.docObj.docDemand.dt().length > 0)
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
                                                        this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                        this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                        this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                        this.docObj.dt()[0].ZIPCODE = data[0].ZIPCODE
                                                        this.docObj.dt()[0].TAX_NO = data[0].TAX_NO
                                                       
                                                        let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                        if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                        {
                                                            this.txtRef.value=data[0].CODE
                                                            this.txtRef.props.onValueChanged()
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
                                                                    this.docObj.dt()[0].ZIPCODE = pdata[0].ZIPCODE
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
                                    <Validator validationGroup={"frmPriceDiffOff"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validCustomerCode")} />
                                    </Validator>  
                                </NdTextBox>
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
                                }).bind(this)}
                                >
                                    <Validator validationGroup={"frmPriceDiffOff"  + this.tabIndex}>
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
                            {/* Barkod Ekleme */}
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
    
                                                        this.grdDiffOff.devGrid.beginUpdate()
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            await this.addItem(data[i],null)
                                                        }
                                                        this.grdDiffOff.devGrid.endUpdate()
                                                    }
                                                }
                                                this.pg_txtBarcode.setVal(this.txtBarcode.value)
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
                                        this.txtBarcode.value = ''
                                        return
                                    }
                                    let tmpQuery = 
                                    {   
                                        query : "SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE STATUS = 1 AND (BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER))",
                                        param : ['CODE:string|50','CUSTOMER:string|50'],
                                        value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length > 0)
                                    {
                                        this.msgQuantity.tmpData = tmpData.result.recordset[0]
                                        await this.msgQuantity.show()
                                        await this.addItem(tmpData.result.recordset[0],null,this.txtPopQteUnitQuantity.value)
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
                                                    await this.addItem(data[0],null,this.txtPopQteUnitQuantity.value)
                                                    this.txtBarcode.focus()
                                                }
                                                else if(data.length > 1)
                                                {
                                                    this.grdDiffOff.devGrid.beginUpdate()
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        await this.addItem(data[i],null)
                                                    }
                                                    this.grdDiffOff.devGrid.endUpdate()
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
                            <Item>
                                <Button icon="add"
                                    validationGroup={"frmDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.docObj.docDemand.dt()[0] != 'undefined')
                                            {
                                                if(this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1].ITEM_CODE == '')
                                                {
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        this.customerControl = true
                                                        this.customerClear = false
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        
                                                        this.grdDiffOff.devGrid.beginUpdate()
                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            await this.addItem(data[i],null)
                                                        }
                                                        this.grdDiffOff.devGrid.endUpdate()
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
                                                
                                                this.grdDiffOff.devGrid.beginUpdate()
                                                for (let i = 0; i < data.length; i++) 
                                                {
                                                    await this.addItem(data[i],null)
                                                }
                                                this.grdDiffOff.devGrid.endUpdate()
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
                                        if(typeof this.docObj.docDemand.dt()[0] != 'undefined')
                                        {
                                            if(this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1].ITEM_CODE == '')
                                            {
                                                this.pg_service.onClick = async(data) =>
                                                {
                                                    this.customerControl = true
                                                    this.customerClear = false
                                                    this.combineControl = true
                                                    this.combineNew = false
                                                    
                                                    this.grdDiffOff.devGrid.beginUpdate()
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        await this.addItem(data[i],null)
                                                    }
                                                    this.grdDiffOff.devGrid.endUpdate()
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
                                            
                                            this.grdDiffOff.devGrid.beginUpdate()
                                            for (let i = 0; i < data.length; i++) 
                                            {
                                                await this.addItem(data[i],null)
                                            }
                                            this.grdDiffOff.devGrid.endUpdate()
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
                                        if( typeof this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1] != 'undefined' && this.docObj.docDemand.dt()[this.docObj.docDemand.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grdDiffOff.devGrid.deleteRow(this.docObj.docDemand.dt().length - 1)
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
                                    <NdGrid parent={this} id={"grdDiffOff"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'400'} 
                                    width={'100%'}
                                    dbApply={false}
                                    sorting={{mode:'none'}}
                                    onRowPrepared={(e) =>
                                    {
                                        if(e.rowType == 'data' && e.data.ITEM_TYPE == 1)
                                        {
                                            e.rowElement.style.color ="#feaa2b"
                                        }
                                    }}
                                    onRowUpdated={async(e)=>
                                    {
                                    
                                        if(typeof e.data.PRICE_AGREED != 'undefined' || typeof e.data.INVOICED_PRICE != 'undefined')
                                        {
                                            e.key.PRICE = Number(e.key.INVOICED_PRICE - e.key.PRICE_AGREED).toFixed(3)
                                        }
                                        if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                        {
                                            e.key.DISCOUNT = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE,4)
                                            e.key.DISCOUNT_1 = Number(e.key.PRICE * e.key.QUANTITY).rateInc(e.data.DISCOUNT_RATE,4)
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
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"msgDiscount.msg"}</div>)
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
                                        e.key.VAT = parseFloat(((((e.key.TOTALHT) - (parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                        e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)
                                    
                                        let tmpMargin = (e.key.TOTAL - e.key.VAT) - (e.key.COST_PRICE * e.key.QUANTITY)
                                        let tmpMarginRate = (tmpMargin /(e.key.TOTAL - e.key.VAT)) * 100
                                        e.key.MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
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
                                        await this.grdDiffOff.dataRefresh({source:this.docObj.docDemand.dt('DOC_DEMAND')});
                                    }}
                                    >
                                        <StateStoring enabled={true} type="localStorage" storageKey={this.props.data.id + "_grdDiffOff"}/>
                                        <ColumnChooser enabled={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.ftr_02_004")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} allowEditing={false} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdDiffOff.clmCreateDate")} width={80} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdDiffOff.clmCuser")} width={90} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdDiffOff.clmItemCode")} width={90} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdDiffOff.clmMulticode")} width={90} />
                                        <Column dataField="ITEM_NAME" caption={this.t("grdDiffOff.clmItemName")} width={200}/>
                                        <Column dataField="PRICE_AGREED" caption={this.t("grdDiffOff.clmPriceAgreed")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={70}/>
                                        <Column dataField="INVOICED_PRICE" caption={this.t("grdDiffOff.clmInvoicedPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={70}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdDiffOff.clmQuantity")} dataType={'number'} width={70} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="PRICE" caption={this.t("grdDiffOff.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={70}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdDiffOff.clmDiscount")} dataType={'number'} editCellRender={this._cellRoleRender} format={{ style: "currency", currency: "EUR",precision: 2}} width={60} allowHeaderFiltering={false}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdDiffOff.clmDiscountRate")} dataType={'number'} width={60} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdDiffOff.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 3}} width={90} allowEditing={false}/>
                                        <Column dataField="VAT" caption={this.t("grdDiffOff.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} width={75} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdDiffOff.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTALHT" caption={this.t("grdDiffOff.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdDiffOff.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} width={100} allowEditing={false}/>
                                        <Column dataField="CONNECT_REF" caption={this.t("grdDiffOff.clmInvNo")}  width={80} allowEditing={false}/>
                                        <Column dataField="CONNECT_DOC_DATE" caption={this.t("grdDiffOff.clmInvDate")} width={80} allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdDiffOff.clmDescription")} width={80} />
                                    </NdGrid>
                                    <ContextMenu dataSource={this.rightItems}
                                    width={200}
                                    target="#grdDiffOff"
                                    onItemClick={(async(e)=>
                                    {
                                        if(e.itemData.text == this.t("getContract"))
                                        {
                                            this._getContract()
                                        }
                                        else if(e.itemData.text == this.t("getProforma"))
                                        {
                                            this.getProforma()
                                        }
                                        
                                    }).bind(this)} />
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
                                            onClick:async()=>
                                            {
                                                await this.popDiscount.show()
                                                if(this.docObj.dt()[0].DISCOUNT > 0 )
                                                {
                                                    this.txtDiscountPercent1.value  = Number(this.docObj.dt()[0].AMOUNT).rate2Num(this.docObj.docDemand.dt().sum("DISCOUNT_1",3),3)
                                                    this.txtDiscountPrice1.value = this.docObj.docDemand.dt().sum("DISCOUNT_1",2)
                                                    this.txtDiscountPercent2.value  = Number(this.docObj.dt()[0].AMOUNT-parseFloat(this.docObj.docDemand.dt().sum("DISCOUNT_1",3))).rate2Num(this.docObj.docDemand.dt().sum("DISCOUNT_2",3),3)
                                                    this.txtDiscountPrice2.value = this.docObj.docDemand.dt().sum("DISCOUNT_2",2)
                                                    this.txtDiscountPercent3.value  = Number(this.docObj.dt()[0].AMOUNT-(parseFloat(this.docObj.docDemand.dt().sum("DISCOUNT_1",3))+parseFloat(this.docObj.docDemand.dt().sum("DISCOUNT_2",3)))).rate2Num(this.docObj.docDemand.dt().sum("DISCOUNT_3",3),3)
                                                    this.txtDiscountPrice3.value = this.docObj.docDemand.dt().sum("DISCOUNT_3",2)
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
                                            onClick:async()=>
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
                                                await this.popVatRate.show()
                                                this.vatRate.clear()
                                                for (let i = 0; i < this.docObj.docDemand.dt().groupBy('VAT_RATE').length; i++) 
                                                {
                                                    let tmpTotalHt  =  parseFloat(this.docObj.docDemand.dt().where({'VAT_RATE':this.docObj.docDemand.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("TOTALHT",2))
                                                    let tmpVat = parseFloat(this.docObj.docDemand.dt().where({'VAT_RATE':this.docObj.docDemand.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                    let tmpData = {"RATE":this.docObj.docDemand.dt().groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat,"TOTALHT":tmpTotalHt}
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
                                data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '101'"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                >
                                    <Validator validationGroup={"frmPrintPop" + this.tabIndex}>
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
                                        <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrintPop" + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM DOC_DEMAND_VW_01 WHERE DOC_GUID = @DOC_GUID ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25'],                        
                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",async(pResult) => 
                                                {
                                                    if(pResult.split('|')[0] != 'ERR')
                                                    {
                                                        let tmpLastSignature = await this.nf525.signatureDocDuplicate(this.docObj.dt()[0])
                                                        let tmpExtra = {...this.extraObj.empty}
                                                        tmpExtra.DOC = this.docObj.dt()[0].GUID
                                                        tmpExtra.DESCRIPTION = ''
                                                        tmpExtra.TAG = 'PRINT'
                                                        tmpExtra.SIGNATURE = tmpLastSignature.SIGNATURE
                                                        tmpExtra.SIGNATURE_SUM = tmpLastSignature.SIGNATURE_SUM
                                                        this.extraObj.addEmpty(tmpExtra);
                                                        this.extraObj.save()
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
                                                    query: "SELECT * FROM DOC_DEMAND_VW_01 WHERE DOC_GUID = @DOC_GUID ORDER BY LINE_NO " ,
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
                                                    let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"facture.pdf",attachData:tmpAttach,text:""}
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
                <div>{super.render()}</div>
            </ScrollView>
        )
    }
    
}