import React from 'react';
import App from '../../../lib/app.js';
import DocBase from '../../../tools/DocBase.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import { NdForm,NdItem,NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import {NdToast} from '../../../../core/react/devex/toast.js';

export default class rebatePurcDispatch extends DocBase
{
    constructor(props)
    {
        super(props)
        
        this.type = 0;
        this.docType = 40;
        this.rebate = 1;

        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.onGridToolbarPreparing = this.onGridToolbarPreparing.bind(this)
        this.getRebate = this.getRebate.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)

        this.frmDocItems = undefined;
        this.docLocked = false;
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false        

        this.rightItems = [{ text: this.t("getRebate"), }]
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            setTimeout(() => {
                this.getDoc(this.pagePrm.GUID,'',-1)
            }, 1000);
        }
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdRebtDispatchState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdRebtDispatchState',USERS:this.user.CODE,PAGE:this.props.data.id,APP:"OFF"})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    async init()
    {
        await super.init()
        
        this.grid = this["grdRebtDispatch"+this.tabIndex]
        this.grid.devGrid.clearFilter("row")

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmDocItems.option('disabled',true)

        if(this.sysParam.filter({ID:'randomRefNo',USERS:this.user.CODE}).getValue() == true)
        {
            this.txtRefno.value = Math.floor(Date.now() / 1000)
        }

        this.pg_txtItemsCode.on('showing',()=>
        {
            this.pg_txtItemsCode.setSource(
            {
                source:
                {
                    select:
                    {
                        query : `SELECT GUID,CODE,NAME,VAT,UNIT,STATUS,(SELECT [dbo].[FN_PRICE](GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,0)) AS PRICE FROM ITEMS_VW_04 WHERE STATUS = 1 AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
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
                    {   
                        query : `SELECT ITEMS_VW_04.GUID,CODE,NAME,COST_PRICE,ITEMS_VW_04.VAT,BARCODE,PARTILOT, ITEMS_VW_04.UNIT,ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS_VW_04.GUID AND ITEM_MULTICODE.CUSTOMER = '${this.docObj.dt()[0].OUTPUT}' AND DELETED = 0 ORDER BY LDATE DESC),'') AS MULTICODE, 
                                ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_MULTICODE_VW_01.ITEM_GUID = ITEMS_VW_04.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME 
                                FROM ITEMS_VW_04 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_04.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE  ITEMS_VW_04.STATUS = 1 AND (ITEM_BARCODE_VW_01.BARCODE LIKE  '%' + @BARCODE)`,
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
                        query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],VAT_ZERO,[GENUS_NAME] FROM CUSTOMER_VW_03 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            })
        })
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        App.instance.loading.show()
        await super.getDoc(pGuid,pRef,pRefno);
        App.instance.loading.hide()

        this.calculateMargin()
        this.calculateTotalMargin()

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    cellRoleRender(e)
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
                        this.checkboxReset()
                        this.pg_txtItemsCode.onClick = async(data) =>
                        {
                            this.checkboxReset()

                            this.grid.devGrid.beginUpdate()
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                            this.grid.devGrid.endUpdate()
                        }
                        await this.pg_txtItemsCode.setVal(e.value)
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
                            query : `SELECT ITEMS_VW_04.GUID,CODE,NAME,ITEMS_VW_04.VAT,COST_PRICE,ITEMS_VW_04.UNIT FROM ITEMS_VW_04 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_04.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE`,
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }

                        let tmpData = await this.core.sql.execute(tmpQuery) 

                        if(tmpData.result.recordset.length > 0)
                        {
                            this.checkboxReset()
                            await this.addItem(tmpData.result.recordset[0],e.rowIndex)
                        }
                        else
                        {
                            this.toast.show({message:this.t("msgItemNotFound.msg"),type:'warning',displayTime:2000})
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
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.checkboxReset()

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
                                await this.msgUnit.show()
                                
                                e.key.UNIT = this.cmbUnit.value
                                e.key.UNIT_FACTOR = this.txtUnitFactor.value

                                if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                {
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value * this.txtUnitFactor.value).toFixed(4))
                                }
                                else
                                {
                                    e.data.PRICE = parseFloat((this.txtUnitPrice.value / this.txtUnitFactor.value).toFixed(4))
                                }

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

                                e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(4))
                                e.data.TOTALHT = parseFloat(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT).toFixed(4))
                                e.data.TOTAL = parseFloat((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT).toFixed(4))
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

                                    if(this.docObj.dt()[0].VAT_ZERO != 1)
                                    {
                                        e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(6));

                                    }
                                    else
                                    {
                                        e.data.VAT = 0
                                        e.data.VAT_RATE = 0
                                    }

                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(3))
                                    e.data.TOTAL = parseFloat((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT).toFixed(3))
                                    e.data.TOTALHT = parseFloat(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT).toFixed(4))
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,2)
                                    this.calculateTotal()
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
                                this.txtDiscountPer1.value = Number(e.data.QUANTITY*e.data.PRICE).rate2Num(e.data.DISCOUNT_1,4)
                                this.txtDiscountPer2.value = Number((e.data.QUANTITY*e.data.PRICE)-e.data.DISCOUNT_1).rate2Num(e.data.DISCOUNT_2,4)
                                this.txtDiscountPer3.value = Number((e.data.QUANTITY*e.data.PRICE)-((e.data.DISCOUNT_1+e.data.DISCOUNT_2))).rate2Num(e.data.DISCOUNT_3,4)
                                await this.msgDiscountPerEntry.show().then(async () =>
                                {
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

                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(4))
                                    e.data.TOTALHT = parseFloat(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT).toFixed(4))
                                    e.data.TOTAL = parseFloat((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT).toFixed(4))
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,4)
                                    this.calculateTotal()
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
    addItem(pData,pIndex,pQuantity,pPrice)
    {
        return new Promise(async resolve =>
        {
            App.instance.loading.show()
    
            this.txtRef.readOnly = true
            this.txtRefno.readOnly = true
    
            if(typeof pQuantity == 'undefined')
            {
                pQuantity = 1
            }
            console.log('pData iade irs 1 ',pData)
            
            //GRID DE AYNI ÜRÜNDEN OLUP OLMADIĞI KONTROL EDİLİYOR VE KULLANICIYA SORULUYOR,CEVAP A GÖRE SATIR BİRLİŞTERİLİYOR.
            if(pData.ITEM_TYPE == 0 || typeof pData.ITEM_TYPE == 'undefined')
            {
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
                    App.instance.loading.hide()
                    resolve()
                    return
                }
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
                this.docObj.docItems.addEmpty(tmpDocItems)
                pIndex = this.docObj.docItems.dt().length - 1
            }
    
            let tmpGrpQuery = 
            {
                query : `SELECT ORGINS,UNIT_SHORT,PARTILOT,ISNULL((SELECT top 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_GRP_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),1) AS SUB_FACTOR, 
                        ISNULL((SELECT top 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_GRP_VW_01.GUID AND ITEM_UNIT_VW_01.TYPE = 1),'') AS SUB_SYMBOL FROM ITEMS_GRP_VW_01 WHERE GUID = @GUID `,
                param : ['GUID:string|50'],
                value : [pData.GUID]
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
            this.docObj.docItems.dt()[pIndex].VAT_RATE = pData.VAT
            this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME
            this.docObj.docItems.dt()[pIndex].COST_PRICE = pData.COST_PRICE
            this.docObj.docItems.dt()[pIndex].UNIT = pData.UNIT
            this.docObj.docItems.dt()[pIndex].DISCOUNT = 0
            this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = 0
            this.docObj.docItems.dt()[pIndex].QUANTITY = pQuantity
            this.docObj.docItems.dt()[pIndex].SUB_QUANTITY = pQuantity * this.docObj.docItems.dt()[pIndex].SUB_FACTOR
            if(typeof pPrice == 'undefined')
            {
                let tmpQuery = 
                {
                    query : `SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE`,
                    param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
                    value : [pData.GUID,pQuantity,this.docObj.dt()[0].OUTPUT]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
                    this.docObj.docItems.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100)).toFixed(6))
                    this.docObj.docItems.dt()[pIndex].AMOUNT = Number(tmpData.result.recordset[0].PRICE  * pQuantity).round(2)
                    this.docObj.docItems.dt()[pIndex].TOTAL = Number(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docItems.dt()[pIndex].VAT)).round(2)
                    this.docObj.docItems.dt()[pIndex].TOTALHT = Number((this.docObj.docItems.dt()[pIndex].AMOUNT - this.docObj.docItems.dt()[pIndex].DISCOUNT)).round(2)
                    this.docObj.docItems.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) / this.docObj.docItems.dt()[pIndex].SUB_FACTOR).round(2)
                    this.calculateTotal()
                }
            }
            else
            {
                this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((pPrice).toFixed(4))
                this.docObj.docItems.dt()[pIndex].VAT = parseFloat((((pPrice * pQuantity) - this.docObj.docItems.dt()[pIndex].DISCOUNT) * (this.docObj.docItems.dt()[pIndex].VAT_RATE / 100)).toFixed(6))
                this.docObj.docItems.dt()[pIndex].AMOUNT = parseFloat((pPrice  * pQuantity)).round(2)
                this.docObj.docItems.dt()[pIndex].TOTALHT = Number(((pPrice  * pQuantity) - this.docObj.docItems.dt()[pIndex].DISCOUNT)).round(2)
                this.docObj.docItems.dt()[pIndex].TOTAL = Number((this.docObj.docItems.dt()[pIndex].TOTALHT + this.docObj.docItems.dt()[pIndex].VAT)).round(2)
                this.calculateTotal()
            }
            
            if(this.docObj.dt()[0].VAT_ZERO == 1)
            {
                this.docObj.docItems.dt()[pIndex].VAT = 0
                this.docObj.docItems.dt()[pIndex].VAT_RATE = 0
            }
            
            if(typeof pData.PARTILOT_GUID != 'undefined')
            {
                this.docObj.docItems.dt()[pIndex].PARTILOT_GUID = pData.PARTILOT_GUID
                this.docObj.docItems.dt()[pIndex].LOT_CODE = pData.LOT_CODE
            }
            
            if (typeof tmpGrpData.result.recordset[0] != 'undefined' && tmpGrpData.result.recordset[0].PARTILOT == 1 && this.docObj.docItems.dt()[pIndex].PARTILOT_GUID == '00000000-0000-0000-0000-000000000000')
            {
                let tmpSource =
                {
                    source:
                    {
                        select:
                        {
                            query : `SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL) AND ITEM = '${pData.GUID}'`,
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                }
                this.pg_partiLot.setSource(tmpSource)
                this.pg_partiLot.onClick = async(data) =>
                {
                    this.docObj.docItems.dt()[pIndex].PARTILOT_GUID = data[0].GUID  
                    this.docObj.docItems.dt()[pIndex].LOT_CODE = data[0].LOT_CODE
                }
                this.pg_partiLot.show()
            }
            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
            await this.itemRelated(pData.GUID,pQuantity)
            //*****************************************/
            App.instance.loading.hide()
            resolve()
        })
    }
    async getRebate()
    {
        await this.pg_RebateGrid.show()
        let tmpQuery = 
        {
            query : `SELECT *,[dbo].[FN_DEPOT_QUANTITY]([ITEM_GUID],@DEPOT,dbo.GETDATE()) AS QUANTITY FROM ITEM_MULTICODE_VW_01 WHERE [dbo].[FN_DEPOT_QUANTITY]([ITEM_GUID],@DEPOT,dbo.GETDATE()) > 0 AND CUSTOMER_GUID = @CUSTOMER`,
            param : ['DEPOT:string|50','CUSTOMER:string|50'],
            value : [this.docObj.dt()[0].INPUT,this.docObj.dt()[0].OUTPUT]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        
        if(tmpData.result.recordset.length > 0)
        {   
            await this.pg_RebateGrid.setData(tmpData.result.recordset)
        }
        else
        {
            this.pg_RebateGrid.setData([])
        }
        
        this.pg_RebateGrid.onClick = async(data) =>
        {
            for (let i = 0; i < data.length; i++) 
            {
                let tmpDocItems = {...this.docObj.docItems.empty}
                tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                tmpDocItems.REF = this.docObj.dt()[0].REF
                tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                tmpDocItems.ITEM = data[i].ITEM_GUID
                tmpDocItems.ITEM_CODE = data[i].ITEM_CODE
                tmpDocItems.ITEM_NAME = data[i].ITEM_NAME
                tmpDocItems.PRICE = data[i].CUSTOMER_PRICE
                tmpDocItems.QUANTITY = data[i].QUANTITY
                tmpDocItems.AMOUNT = parseFloat((data[i].CUSTOMER_PRICE * data[i].QUANTITY).toFixed(3))
                tmpDocItems.TOTAL = parseFloat((data[i].CUSTOMER_PRICE * data[i].QUANTITY).toFixed(3))

                await this.docObj.docItems.addEmpty(tmpDocItems)
                await this.core.util.waitUntil(100)
            }
            this.docObj.docItems.dt().emit('onRefresh')
            this.calculateTotal()
        }
       
    }
    onGridToolbarPreparing(e)
    {
        e.toolbarOptions.items.push({
            location: 'before',
            locateInMenu: 'auto',
            widget: 'dxButton',
            options:
            {
                icon: 'add',
                validationGroup: 'frmRebateDis' + this.tabIndex,
                onClick: (async (c)=>
                {
                    if(c.validationGroup.validate().status == "valid")
                    {
                        if(typeof this.docObj.docItems.dt()[0] != 'undefined')
                        {
                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                            {
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    this.checkboxReset()

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
                            this.checkboxReset()

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
                        this.toast.show({message:this.t("msgDocValid.msg"),type:'warning',displayTime:2000})
                    }
                }).bind(this)
            }
        })
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.props.data.tabkey}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-1">
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmRebateDis"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.docLocked == true)
                                        {
                                            this.toast.show({message:this.t("msgDocLocked.msg"),type:'warning',displayTime:2000})
                                            return
                                        }
        
                                        if(typeof this.docObj.docItems.dt()[0] == 'undefined')
                                        {
                                            this.toast.show({message:this.t("msgNotRow.msg"),type:'warning',displayTime:2000})
                                            return
                                        }
        
                                        if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                        {
                                            await this.grid.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
                                        }
        
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
        
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.docObj.save()) == 0)
                                                {                                                    
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success',displayTime:2000})
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
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:'warning',displayTime:2000})
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
                                            this.toast.show({message:this.t("msgGetLocked.msg"),type:'warning',displayTime:2000})
                                            return
                                        }
        
                                        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                        {
                                            if(this.docObj.docItems.dt()[i].INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')   
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgdocNotDelete',showTitle:true,title:this.t("msgdocNotDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgdocNotDelete.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgdocNotDelete.msg")}</div>)
                                                }
                                            
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                        }
        
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
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
        
                                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grid.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
                                            }
        
                                            if((await this.docObj.save()) == 0)
                                            {                                                    
                                                this.toast.show({message:this.t("msgLocked.msg"),type:'success',displayTime:2000})
                                                this.frmDocItems.option('disabled',true)
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 1)
                                        {
                                            await this.popPassword.show()
                                            this.txtPassword.value = ''
                                        }
                                        else if(this.docObj.dt()[0].LOCKED == 2)
                                        {
                                            this.toast.show({message:this.t("msgLockedType2.msg"),type:'warning',displayTime:2000})
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
 />
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async()=>
                                    {
                                        if(this.docObj.isSaved == false)
                                        {
                                            this.toast.show({message:this.t("isMsgSave.msg"),type:'warning',displayTime:2000})
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
                    {/* Form */}
                    <div className="row px-2 pt-1" style={{height: '120px'}}>
                        <div className="col-12">
                            <NdForm colCount={3} id={"frmRebateDis"  + this.tabIndex}>
                                {/* txtRef-Refno */}
                                <NdItem>
                                    <NdLabel text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-6 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                if(this.sysParam.filter({ID:'randomRefNo',USERS:this.user.CODE}).getValue() == false)
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 40 AND REF = @REF AND REBATE = 1`,
                                                        param : ['REF:string|25'],
                                                        value : [this.txtRef.value]
                                                    }

                                                    let tmpData = await this.core.sql.execute(tmpQuery) 

                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                    }
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            </NdTextBox>
                                        </div>
                                        <div className="col-6 ps-0">
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
                                                            this.checkRow()
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = 0 AND DOC_TYPE = 40 AND REBATE = 1`,
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
                                                            id:'msgDocDeleted',showTitle:true,title:this.lang.t("msgDocDeleted.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                            <Validator validationGroup={"frmRebateDis"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                    <RangeRule min={1} message={this.t("validRefNo")}/>
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                </NdItem>
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                    dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                        if(this.cmbDepot.value != '' && this.docLocked == false)
                                        {
                                            this.frmDocItems.option('disabled',false)
                                        }
                                    }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmRebateDis"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                {/* DOC_NO */}
                                <NdItem>
                                    <NdLabel text={this.t("txtDocNo")} alignment="right" />
                                    <NdTextBox id="txtDocNo" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_NO"}} 
                                    readOnly={false}
                                    onFocusOut={()=>
                                    {
                                        this.checkDocNo(this.txtDocNo.value)
                                    }}
                                    />
                                </NdItem>
                                {/* txtCustomerCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} 
                                    onEnterKey={(async()=>
                                    {
                                        if(this.docObj.docItems.dt().length > 0)
                                        {
                                            this.toast.show({message:this.t("msgCustomerLock.msg"),type:'warning',displayTime:2000})
                                            return;
                                        }
                                        
                                        this.pg_txtCustomerCode.onClick = async(data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                {
                                                    this.frmDocItems.option('disabled',false)
                                                }
                                     
                                                this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                this.docObj.dt()[0].VAT_ZERO = data[0].VAT_ZERO
                                     
                                                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                     
                                                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                {
                                                    this.txtRef.value = data[0].CODE;
                                                    this.txtRef.props.onChange()
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
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
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
                                                        this.toast.show({message:this.t("msgCustomerLock.msg"),type:'warning',displayTime:2000})
                                                        return;
                                                    }
                                     
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmDocItems.option('disabled',false)
                                                            }
                                     
                                                            this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                            this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                            this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                            this.docObj.dt()[0].VAT_ZERO = data[0].VAT_ZERO
                                     
                                                            let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                     
                                                            if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                            {
                                                                this.txtRef.value = data[0].CODE;
                                                                this.txtRef.props.onChange()
                                                            }
                                     
                                                            if(this.txtCustomerCode.value != '' && this.cmbDepot.value != '' && this.docLocked == false)
                                                            {
                                                                this.frmDocItems.option('disabled',false)
                                                            }
                                     
                                                            let tmpQuery = 
                                                            {
                                                                query : `SELECT * FROM CUSTOMER_ADRESS_VW_01 WHERE CUSTOMER = @CUSTOMER`,
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
                                                    this.pg_txtCustomerCode.show()
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmRebateDis"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                </NdItem> 
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}} 
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    />
                                </NdItem> 
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* dtDocDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmRebateDis"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* dtShipDate */}
                                <NdItem>
                                    <NdLabel text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"}
                                    dt={{data:this.docObj.dt('DOC'),field:"SHIPMENT_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmRebateDis"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* Boş */}
                                <NdEmptyItem />
                                {/* BARKOD EKLEME */}
                                <NdItem>
                                    <NdLabel text={this.t("txtBarcode")} alignment="right" />
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
                                                        this.toast.show({message:this.t("msgDocValid.msg"),type:'warning',displayTime:2000})
                                                        this.txtBarcode.setState({value:""})
                                                        return
                                                    }
                                                  
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.setState({value:""})
                                                        if(data.length > 0)
                                                        {
                                                            this.checkboxReset()
        
                                                            this.grid.devGrid.beginUpdate()
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                await this.addItem(data[i],null)
                                                            }
                                                            this.grid.devGrid.endUpdate()
                                                        }
                                                    }
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        if(this.cmbDepot.value == '')
                                        {
                                            this.toast.show({message:this.t("msgDocValid.msg"),type:'warning',displayTime:2000})
                                            this.txtBarcode.setState({value:""})
                                            return
                                        }
                                    
                                        let tmpQuery = 
                                        {   
                                            query :`SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE,PARTILOT_GUID,LOT_CODE 
                                                     FROM ITEMS_BARCODE_MULTICODE_VW_01 
                                                     WHERE STATUS = 1 AND (BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER)) ORDER BY PARTILOT_GUID ASC`,
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                        }
                                    
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                    
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.msgQuantity.tmpData = tmpData.result.recordset[0]
                                            await this.msgQuantity.show()
                                            this.addItem(tmpData.result.recordset[0],null,this.txtPopQteUnitQuantity.value,this.txtPopQteUnitPrice.value)
                                            this.txtBarcode.focus()
                                        }
                                        else
                                        {
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                this.checkboxReset()

                                                this.grid.devGrid.beginUpdate()
                                                for (let i = 0; i < data.length; i++) 
                                                {
                                                    await this.addItem(data[i],null)
                                                }
                                                this.grid.devGrid.endUpdate()
                                            }
                                            await this.pg_txtItemsCode.setVal(this.txtBarcode.value)
                                        }
                                        this.txtBarcode.value = ''
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdForm colCount={1} onInitialized={(e)=>
                            {
                                this.frmDocItems = e.component
                            }}>
                                <NdItem>
                                    <React.Fragment>
                                        <NdGrid parent={this} id={"grdRebtDispatch"+this.tabIndex} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        filterRow={{visible:true}}
                                        height={'590px'} 
                                        onToolbarPreparing={this.onGridToolbarPreparing}
                                        width={'100%'}
                                        dbApply={false}
                                        sorting={{mode:'none'}}
                                        onRowPrepared={(e) =>
                                        {
                                            if(e.rowType == 'data' && e.data.INVOICE_LINE_GUID  != '00000000-0000-0000-0000-000000000000')
                                            {
                                                e.rowElement.style.color ="Silver"
                                            }
                                        }}
                                        onRowUpdating={async (e)=>
                                        {
                                            if(e.key.INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                            {
                                                e.cancel = true
                                                let tmpConfObj =
                                                {
                                                    id:'msgRowNotUpdate',showTitle:true,title:this.t("msgRowNotUpdate.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                            if(e.key.INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                            {
                                                e.cancel = true
                                                let tmpConfObj =
                                                {
                                                    id:'msgRowNotDelete',showTitle:true,title:this.t("msgRowNotDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgRowNotDelete.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRowNotDelete.msg")}</div>)
                                                }
                                            
                                                dialog(tmpConfObj);
                                                e.component.cancelEditData()
                                            }
                                        }}
                                        onRowUpdated={async(e)=>
                                        {
                                            if(typeof e.data.DISCOUNT_RATE != 'undefined')
                                            {
                                                e.key.DISCOUNT = parseFloat((((e.key.AMOUNT * e.data.DISCOUNT_RATE) / 100)).toFixed(2))
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
                                            
                                            if(typeof e.data.QUANTITY != 'undefined')
                                            {
                                                e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                            }
                                            
                                            if(typeof e.data.SUB_QUANTITY != 'undefined')
                                            {
                                                e.key.QUANTITY = e.data.SUB_QUANTITY * e.key.SUB_FACTOR
                                            }
                                            
                                            if(typeof e.data.SUB_FACTOR != 'undefined')
                                            {
                                                e.key.QUANTITY = e.key.SUB_QUANTITY * e.data.SUB_FACTOR
                                            }
                                            
                                            if(typeof e.data.PRICE != 'undefined')
                                            {
                                                e.key.SUB_PRICE = e.data.PRICE / e.key.SUB_FACTOR
                                            }
                                            
                                            if(typeof e.data.SUB_PRICE != 'undefined')
                                            {
                                                e.key.PRICE = e.data.SUB_PRICE * e.key.SUB_FACTOR
                                            }
        
                                            e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)) - (parseFloat(e.key.DISCOUNT)))).round(2)
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
                                            this.grid = this["grdRebtDispatch"+this.tabIndex]
                                            await this["grdRebtDispatch"+this.tabIndex].dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
                                        }}
                                        >
                                            <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdRebtDispatch"}/>
                                            <ColumnChooser enabled={true} />
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                            {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                            <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                            <Export fileName={this.lang.t("menuOff.irs_02_003")} enabled={true} allowExportSelectedData={true} />
                                            <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} allowEditing={false} defaultSortOrder="desc"/>
                                            <Column dataField="CDATE_FORMAT" caption={this.t("grdRebtDispatch.clmCreateDate")} width={75} allowEditing={false}/>
                                            <Column dataField="CUSER_NAME" caption={this.t("grdRebtDispatch.clmCuser")} width={70} allowEditing={false}/>
                                            <Column dataField="ITEM_CODE" caption={this.t("grdRebtDispatch.clmItemCode")} width={75} editCellRender={this.cellRoleRender}/>
                                            <Column dataField="MULTICODE" caption={this.t("grdRebtDispatch.clmMulticode")} width={100} allowEditing={false}/>
                                            <Column dataField="ITEM_NAME" caption={this.t("grdRebtDispatch.clmItemName")} width={240} />
                                            <Column dataField="ITEM_BARCODE" caption={this.t("grdRebtDispatch.clmBarcode")} width={100} allowEditing={false}/>
                                            <Column dataField="QUANTITY" caption={this.t("grdRebtDispatch.clmQuantity")} width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}} editCellRender={this.cellRoleRender}/>
                                            <Column dataField="SUB_FACTOR" caption={this.t("grdRebtDispatch.clmSubFactor")} width={70} allowEditing={true} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="SUB_QUANTITY" caption={this.t("grdRebtDispatch.clmSubQuantity")} dataType={'number'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="PRICE" caption={this.t("grdRebtDispatch.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                            <Column dataField="SUB_PRICE" caption={this.t("grdRebtDispatch.clmSubPrice")} dataType={'number'} format={Number.money.sign + '#,##0.000'} width={70} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + Number.money.sign + " / " + e.data.SUB_SYMBOL}}/>
                                            <Column dataField="AMOUNT" caption={this.t("grdRebtDispatch.clmAmount")} width={80} allowEditing={false} format={{ style: "currency", currency: Number.money.code,precision: 3}}/>
                                            <Column dataField="VAT" caption={this.t("grdRebtDispatch.clmVat")} width={70} format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                            <Column dataField="TOTALHT" caption={this.t("grdRebtDispatch.clmTotalHt")} format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                            <Column dataField="TOTAL" caption={this.t("grdRebtDispatch.clmTotal")} width={100} format={{ style: "currency", currency: Number.money.code,precision: 3}} allowEditing={false}/>
                                            <Column dataField="INVOICE_REF" caption={this.t("grdRebtDispatch.clmInvoiceRef")} width={100} />
                                            <Column dataField="LOT_CODE" caption={this.t("grdRebtDispatch.clmPartiLot")} width={100} allowEditing={false} visible={false}/>
                                            <Column dataField="DESCRIPTION" caption={this.t("grdRebtDispatch.clmDescription")} width={100}  headerFilter={{visible:true}}/>
                                        </NdGrid>
                                        <ContextMenu
                                        dataSource={this.rightItems}
                                        width={200}
                                        target={"#grdRebtDispatch"+this.tabIndex}
                                        onItemClick={(async(e)=>
                                        {
                                            this.getRebate()
                                        }).bind(this)} />
                                    </React.Fragment> 
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-1" style={{height: '160px'}}>
                        <div className="col-12">
                            <Form colCount={4} parent={this} id={"frmPurcInv"  + this.tabIndex}>
                                {/* Ara Toplam */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                    maxLength={32}
                                    />
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
                                                onClick:async() =>
                                                {
                                                    await this.popDiscount.show()
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
                                    />
                                </Item>
                                {/* İndirim */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtSubTotal")} alignment="right" />
                                    <NdTextBox id="txtSubTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"SUBTOTAL"}}
                                    maxLength={32}
                                    />
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
                                                onClick:async() =>
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
                                    />
                                </Item>
                                {/* KDV */}
                                <EmptyItem colSpan={2}/>
                                <Item>
                                    <Label text={this.t("txtTotalHt")} alignment="right" />
                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}
                                    maxLength={32}
                                    />
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
                                    />
                                </Item>
                                {/* KDV */}
                                <EmptyItem colSpan={3}/>
                                
                                <Item>
                                    <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* İrsaliye Grid */}
                    <div>
                        <NdPopGrid id={"pg_RebateGrid"} parent={this} container={"#" + this.props.data.id + this.props.data.tabkey}
                        visible={false}
                        position={{of:'#' + this.props.data.id + this.props.data.tabkey}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        selection={{mode:"multiple"}}
                        title={this.t("pg_RebateGrid.title")}
                        deferRendering={true}
                        >
                            <Column dataField="ITEM_CODE" caption={this.t("pg_RebateGrid.clmCode")} width={200}/>
                            <Column dataField="ITEM_NAME" caption={this.t("pg_RebateGrid.clmName")} width={300} />
                            <Column dataField="QUANTITY" caption={this.t("pg_RebateGrid.clmQuantity")} width={300} />
                        </NdPopGrid>
                    </div>
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
                        deferRendering={true}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '13'`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPrintPop"  + this.tabIndex}>
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
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY LINE_NO ` ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        this.core.socket.emit('piqXInvoiceInsert',
                                                            {
                                                                fromUser : tmpData.result.recordset[0].LUSER,
                                                                toUser : '',
                                                                docGuid : tmpData.result.recordset[0].DOC_GUID,
                                                                docDate : tmpData.result.recordset[0].DOC_DATE,
                                                                fromTax : tmpData.result.recordset[0].TAX_NO,
                                                                toTax : tmpData.result.recordset[0].CUSTOMER_TAX_NO,
                                                                fromType: tmpData.result.recordset[0].DOC_TYPE,
                                                                fromRebate: tmpData.result.recordset[0].REBATE,
                                                                json : JSON.stringify(tmpData.result.recordset),
                                                                pdf : "data:application/pdf;base64," + pResult.split('|')[1]
                                                            },
                                                            (pData) =>
                                                            {
                                                                console.log(pData)
                                                            })
                                                            
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
                                            <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO ` ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }

                                                    App.instance.loading.show()
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.loading.hide()

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
                                            <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query : `SELECT EMAIL FROM CUSTOMER_OFFICAL WHERE CUSTOMER = @GUID AND DELETED = 0`,
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                        {/* Mail Send PopUp */}
                        <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={"#" + this.props.data.id + this.props.data.tabkey} 
                        width={'600'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.props.data.tabkey}}
                        deferRendering={true}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMailAddress"
                                    displayExpr="MAIL_ADDRESS"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : `SELECT GUID,MAIL_ADDRESS FROM [dbo].[MAIL_SETTINGS]`},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbMailAddress',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbMailAddress',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                <NdLabel text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={128}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}/>
                                </NdItem>
                                <NdItem>
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
                                                        query: `SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID,@LANG)ORDER BY DOC_DATE,LINE_NO ` ,
                                                        param:  ['DOC_GUID:string|50','DESIGN:string|25','LANG:string|10'],
                                                        value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value,this.cmbDesignLang.value]
                                                    }

                                                    App.instance.loading.show()
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.loading.hide()

                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        App.instance.loading.show()
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
                                                            App.instance.loading.hide()
                                                            let tmpConfObj1 =
                                                            {
                                                                id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                                button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                            }
                                                            
                                                            if((pResult1) == 0)
                                                            {  
                                                                this.toast.show({message:this.t("msgMailSendResult.msgSuccess"),type:'success',displayTime:2000})
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    <div>{super.render()}</div>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>                
            </div>
        )
    }
}