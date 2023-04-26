import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,docExtraCls} from '../../../../core/cls/doc.js';
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

import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class purchaseDispatch extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.tabIndex = props.data.tabkey

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
        this._getItems = this._getItems.bind(this)
        this._getBarcodes = this._getBarcodes.bind(this)

        this.frmDocItems = undefined;
        this.docLocked = false;   
        this.customerControl = true
        this.customerClear = false
        this.combineControl = true
        this.combineNew = false

        
        this.multiItemData = new datatable
        this.newPrice = new datatable
        this.newPriceDate = new datatable
        this.updatePriceData = new datatable
        this.vatRate =  new datatable
        this.rightItems = [{ text: this.t("getOrders")}]

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
        this.newPrice.clear()
        this.newPriceDate.clear()

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
                this.btnCopy.setState({disabled:false});
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
                this.btnCopy.setState({disabled:false});
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
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.dtDocDate.value = moment(new Date())
        this.dtShipDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 40
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.docLocked = false
        
        this.frmDocItems.option('disabled',true)
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});
        await this.grdNewPrice.dataRefresh({source:this.newPrice})
        await this.grdNewPriceDate.dataRefresh({source:this.newPriceDate})
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        App.instance.setState({isExecute:true})
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:40});
        App.instance.setState({isExecute:false})

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        if(this.docObj.dt()[0].DELETED != 0)
        {
            console.log(111)
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
            this.frmDocItems.option('disabled',true)
        }
        else
        {
            this.docLocked = false
            this.frmDocItems.option('disabled',false)
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
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:40});

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
        for (let i = 0; i < this.docObj.docItems.dt().groupBy('VAT_RATE').length; i++) 
        {
            tmpVat = tmpVat + parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
        }
        this.docObj.dt()[0].AMOUNT = this.docObj.docItems.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docItems.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].TOTAL = Number(parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
        this.docObj.dt()[0].TOTALHT = this.docObj.docItems.dt().sum("TOTALHT",2)
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
                    this.grdPurcDispatch.devGrid.cellValue(e.rowIndex,"QUANTITY",r.component._changedValue)
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
                                        this.txtUnitPrice.value = e.data.PRICE / e.data.UNIT_FACTOR
                                    }
                                    else
                                    {
                                        this.txtUnitQuantity.value = e.data.QUANTITY / e.data.UNIT_FACTOR
                                        this.txtUnitPrice.value = e.data.PRICE * e.data.UNIT_FACTOR
                                    }
                                }
                                await this.msgUnit.show().then(async () =>
                                {
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
                                    e.data.QUANTITY = this.txtTotalQuantity.value
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(4));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(4))
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
                    this.grdPurcDispatch.devGrid.cellValue(e.rowIndex,"DISCOUNT",r.component._changedValue)
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
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(3));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(3))
                                    e.data.TOTAL = Number((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) +e.data.VAT)).round(2)
                                    e.data.TOTALHT = Number(((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT)).round(2)
                                    e.data.DISCOUNT_RATE = Number(e.data.AMOUNT).rate2Num(e.data.DISCOUNT,2)
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
                    this.grdPurcDispatch.devGrid.cellValue(e.rowIndex,"DISCOUNT_RATE",r.component._changedValue)
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
                                    e.data.VAT = parseFloat(((((e.data.PRICE * e.data.QUANTITY) - e.data.DISCOUNT) * (e.data.VAT_RATE) / 100)).toFixed(4));
                                    e.data.AMOUNT = parseFloat((e.data.PRICE * e.data.QUANTITY).toFixed(4))
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
        if(e.column.dataField == "ORIGIN")
        {
            return (
                <NdTextBox id={"txtGrdOrigins"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                this.cmbOrigin.value = e.data.ORIGIN
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
    async addItem(pData,pIndex,pQuantity)
    {
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
            this.docObj.docItems.dt()[pIndex].ORIGIN = tmpGrpData.result.recordset[0].ORGINS
            this.docObj.docItems.dt()[pIndex].SUB_FACTOR = tmpGrpData.result.recordset[0].SUB_FACTOR
            this.docObj.docItems.dt()[pIndex].SUB_SYMBOL = tmpGrpData.result.recordset[0].SUB_SYMBOL
            this.docObj.docItems.dt()[pIndex].UNIT_SHORT = tmpGrpData.result.recordset[0].UNIT_SHORT
        }
        App.instance.setState({isExecute:true})
        if(typeof pQuantity == 'undefined')
        {
            pQuantity = 1
        }
        if(this.customerControl == true)
        {
            let tmpCheckQuery = 
            {
                query :"SELECT MULTICODE,(SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM_GUID,CUSTOMER_GUID,@QUANTITY,GETDATE())) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID",
                param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                value : [pData.CODE,this.docObj.dt()[0].OUTPUT,pQuantity]
            }
            let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
            if(tmpCheckData.result.recordset.length == 0)
            {   
                let tmpCustomerBtn = ''
                if(this.customerClear == true)
                {
                    await this.grdPurcDispatch.devGrid.deleteRow(0)
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
                        await this.grdPurcDispatch.devGrid.deleteRow(0)
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
                            this.docObj.docItems.dt()[i].SUB_QUANTITY = this.docObj.docItems.dt()[i].SUB_QUANTITY * this.docObj.docItems.dt()[i].SUB_FACTOR
                            this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100) * pQuantity)).toFixed(4))
                            this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(4))
                            this.docObj.docItems.dt()[i].TOTAL = Number((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT)).round(2)
                            this.docObj.docItems.dt()[i].TOTALHT =  Number((this.docObj.docItems.dt()[i].AMOUNT - this.docObj.docItems.dt()[i].DISCOUNT)).round(2)
                            this._calculateTotal()
                            await this.grdPurcDispatch.devGrid.deleteRow(0)
                            //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                            await this.itemRelated(pData.GUID,this.docObj.docItems.dt()[i].QUANTITY)
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
                    this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + pQuantity
                    this.docObj.docItems.dt()[i].SUB_QUANTITY = this.docObj.docItems.dt()[i].SUB_QUANTITY * this.docObj.docItems.dt()[i].SUB_FACTOR
                    this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100) * pQuantity)).toFixed(4))
                    this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(4))
                    this.docObj.docItems.dt()[i].TOTAL = Number((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT)).round(2)
                    this.docObj.docItems.dt()[i].TOTALHT =  Number((this.docObj.docItems.dt()[i].AMOUNT - this.docObj.docItems.dt()[i].DISCOUNT)).round(2)
                    this._calculateTotal()
                    await this.grdPurcDispatch.devGrid.deleteRow(0)
                    //BAĞLI ÜRÜN İÇİN YAPILDI *****************/
                    await this.itemRelated(pData.GUID,this.docObj.docItems.dt()[i].QUANTITY)
                    //*****************************************/
                    App.instance.setState({isExecute:false})
                    return
                }
            }
        }
        this.docObj.docItems.dt()[pIndex].ITEM_CODE = pData.CODE
        this.docObj.docItems.dt()[pIndex].ITEM = pData.GUID
        this.docObj.docItems.dt()[pIndex].VAT_RATE = pData.VAT
        this.docObj.docItems.dt()[pIndex].ITEM_NAME = pData.NAME
        this.docObj.docItems.dt()[pIndex].UNIT = pData.UNIT
        this.docObj.docItems.dt()[pIndex].COST_PRICE = pData.COST_PRICE
        this.docObj.docItems.dt()[pIndex].DISCOUNT = 0
        this.docObj.docItems.dt()[pIndex].DISCOUNT_RATE = 0
        this.docObj.docItems.dt()[pIndex].QUANTITY = pQuantity
        this.docObj.docItems.dt()[pIndex].SUB_QUANTITY = pQuantity * this.docObj.docItems.dt()[pIndex].SUB_FACTOR

        let tmpQuery = 
        {
            query :"SELECT (SELECT [dbo].[FN_CUSTOMER_PRICE](ITEM_GUID,CUSTOMER_GUID,@QUANTITY,GETDATE())) AS PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_CODE = @ITEM_CODE AND CUSTOMER_GUID = @CUSTOMER_GUID ORDER BY LDATE DESC",
            param : ['ITEM_CODE:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
            value : [pData.CODE,this.docObj.dt()[0].OUTPUT,pQuantity]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {
            this.docObj.docItems.dt()[pIndex].CUSTOMER_PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
            this.docObj.docItems.dt()[pIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
            this.docObj.docItems.dt()[pIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (pData.VAT / 100) * pQuantity).toFixed(2))
            this.docObj.docItems.dt()[pIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2) * pQuantity)
            this.docObj.docItems.dt()[pIndex].TOTAL = parseFloat(((tmpData.result.recordset[0].PRICE * pQuantity) + this.docObj.docItems.dt()[pIndex].VAT).toFixed(2))
            this.docObj.docItems.dt()[pIndex].TOTALHT =  parseFloat((this.docObj.docItems.dt()[pIndex].AMOUNT - this.docObj.docItems.dt()[pIndex].DISCOUNT).toFixed(2))
            this.docObj.docItems.dt()[pIndex].SUB_PRICE = Number(parseFloat((tmpData.result.recordset[0].PRICE).toFixed(4)) / this.docObj.docItems.dt()[pIndex].SUB_FACTOR).round(2)
            this._calculateTotal()
        }
        else
        {
            this.docObj.docItems.dt()[pIndex].PRICE =0
            this.docObj.docItems.dt()[pIndex].VAT = 0
            this.docObj.docItems.dt()[pIndex].AMOUNT = 0
            this.docObj.docItems.dt()[pIndex].TOTAL = 0
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
                        await this.addItem(tmpRelatedItemData.result.recordset[0],this.docObj.docItems.dt().length-1,tmpRelatedQt)
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
                for (let x = 0; x < this.docObj.docItems.dt().length; x++) 
                {
                    if(this.docObj.docItems.dt()[x].ITEM_CODE == tmpRelatedData.result.recordset[i].RELATED_CODE)
                    {                
                        let tmpRelatedQt = Math.floor(pQuantity / tmpRelatedData.result.recordset[i].ITEM_QUANTITY) * tmpRelatedData.result.recordset[i].RELATED_QUANTITY
                        
                        if(tmpRelatedQt > 0)
                        {
                            this.docObj.docItems.dt()[x].QUANTITY = tmpRelatedQt
                            this.docObj.docItems.dt()[x].VAT = parseFloat((this.docObj.docItems.dt()[x].VAT + (this.docObj.docItems.dt()[x].PRICE * (this.docObj.docItems.dt()[x].VAT_RATE / 100) * pQuantity)).toFixed(4))
                            this.docObj.docItems.dt()[x].AMOUNT = parseFloat((this.docObj.docItems.dt()[x].QUANTITY * this.docObj.docItems.dt()[x].PRICE).toFixed(4))
                            this.docObj.docItems.dt()[x].TOTAL = Number((((this.docObj.docItems.dt()[x].QUANTITY * this.docObj.docItems.dt()[x].PRICE) - this.docObj.docItems.dt()[x].DISCOUNT) + this.docObj.docItems.dt()[x].VAT)).round(2)
                            this.docObj.docItems.dt()[x].TOTALHT =  Number((this.docObj.docItems.dt()[x].AMOUNT - this.docObj.docItems.dt()[x].DISCOUNT)).round(2)
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
                    query : "SELECT GUID,CODE,NAME,VAT,UNIT,STATUS," + 
                    "ISNULL((SELECT TOP 1 CUSTOMER_PRICE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.docObj.dt()[0].OUTPUT+"'),COST_PRICE) AS PURC_PRICE,COST_PRICE,"+
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
            await this.addItem(this.multiItemData[i],this.docObj.docItems.dt().length-1,this.multiItemData[i].QUANTITY)
            this.popMultiItem.hide()
        }
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
                for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                {

                    if(this.docObj.docItems.dt()[i].ITEM_TYPE == 0)
                    {
                        if(this.docObj.docItems.dt()[i].COST_PRICE != this.docObj.docItems.dt()[i].PRICE && this.docObj.docItems.dt()[i].COST_PRICE != 0)
                        {
                            let tmpQuery = 
                            {
                                query : "SELECT TOP 1 PRICE_SALE_GUID AS PRICE_GUID,PRICE_SALE AS SALE_PRICE,CUSTOMER_PRICE_GUID AS CUSTOMER_PRICE_GUID FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE  GUID = @ITEM AND CUSTOMER_GUID = @CUSTOMER",
                                param : ['ITEM:string|50','CUSTOMER:string|50'],
                                value : [this.docObj.docItems.dt()[i].ITEM,this.docObj.docItems.dt()[i].OUTPUT]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery)
                            if(tmpData.result.recordset.length > 0)
                            {
                                let tmpItemData = [{...this.docObj.docItems.dt()[i]}]
                                tmpItemData[0].SALE_PRICE_GUID = tmpData.result.recordset[0].PRICE_GUID
                                tmpItemData[0].SALE_PRICE = tmpData.result.recordset[0].SALE_PRICE
                                let tmpExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].VAT_RATE / 100) + 1)
                                let tmpMargin = tmpExVat - tmpItemData[0].PRICE;
                                let tmpMarginRate = ((tmpMargin / tmpItemData[0].PRICE)) * 100
                                tmpItemData[0].PRICE_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
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
            
                        if(e == 'btn01')
                        {
                            
                        }
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
                                // let tmpMulticodeObj = new itemMultiCodeCls()
                                // await tmpMulticodeObj.load({ITEM_CODE:this.grdNewPrice.getSelectedData()[i].ITEM_CODE,CUSTOMER_CODE:this.grdNewPrice.getSelectedData()[i].CUSTOMER_CODE});
                                // tmpMulticodeObj.dt()[0].CUSTOMER_PRICE = this.grdNewPrice.getSelectedData()[i].PRICE
                                // tmpMulticodeObj.save()
                                // let tmpQuery = 
                                // {
                                //     query : "EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] " +
                                //             "@GUID = @PGUID, " +
                                //             "@CUSER = @PCUSER, " +
                                //             "@PRICE = @PPRICE" ,
                                //     param : ['PGUID:string|50','PCUSER:string|25','PPRICE:float'],
                                //     value : [this.grdNewPrice.getSelectedData()[i].SALE_PRICE_GUID,this.user.CODE,this.grdNewPrice.getSelectedData()[i].SALE_PRICE]
                                // }
                                // await this.core.sql.execute(tmpQuery)
                            }
                            await this.updatePriceData.update()
                            App.instance.setState({isExecute:false})
                            this.updatePriceData.clear()
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
                            if(this.docObj.docItems.dt()[i].COST_PRICE == this.docObj.docItems.dt()[i].PRICE && this.docObj.docItems.dt()[i].COST_PRICE != 0)
                            {
                                let tmpQuery = 
                                {
                                    query : "SELECT TOP 1 PRICE_SALE_GUID AS PRICE_GUID,PRICE_SALE AS SALE_PRICE,CUSTOMER_PRICE_GUID AS CUSTOMER_PRICE_GUID,VAT AS VAT_RATE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE  GUID = @ITEM AND CUSTOMER_GUID = @CUSTOMER",
                                    param : ['ITEM:string|50','CUSTOMER:string|50'],
                                    value : [this.docObj.docItems.dt()[i].ITEM,this.docObj.docItems.dt()[i].OUTPUT]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery)
                                if(tmpData.result.recordset.length > 0)
                                {
                                    console.log(tmpData.result.recordset)
                                    let tmpItemData = [{...this.docObj.docItems.dt()[i]}]
                                    tmpItemData[0].SALE_PRICE_GUID = tmpData.result.recordset[0].PRICE_GUID
                                    tmpItemData[0].SALE_PRICE = tmpData.result.recordset[0].SALE_PRICE
                                    let tmpExVat = tmpData.result.recordset[0].SALE_PRICE / ((tmpItemData[0].VAT_RATE / 100) + 1)
                                    let tmpMargin = tmpExVat - tmpItemData[0].PRICE;
                                    let tmpMarginRate = ((tmpMargin / tmpItemData[0].PRICE)) * 100
                                    tmpItemData[0].PRICE_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
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
    async checkRow()
    {
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.docItems.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docItems.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docItems.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docItems.dt()[i].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.docObj.docItems.dt()[i].REF = this.docObj.dt()[0].REF
            this.docObj.docItems.dt()[i].REF_NO = this.docObj.dt()[0].REF_NO
        }
    }
    async _getOrders()
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
                query : "SELECT *,REF + '-' + CONVERT(VARCHAR,REF_NO) AS REFERANS FROM DOC_ORDERS_VW_01 WHERE OUTPUT = @OUTPUT AND SHIPMENT_LINE_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND DOC_TYPE IN(60)",
                param : ['OUTPUT:string|50'],
                value : [this.docObj.dt()[0].OUTPUT]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {   
                await this.pg_ordersGrid.setData(tmpData.result.recordset)
            }
            else
            {
                await this.pg_ordersGrid.setData([])
            }
    
            this.pg_ordersGrid.show()
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
                    tmpDocItems.QUANTITY = data[i].QUANTITY
                    tmpDocItems.VAT = data[i].VAT
                    tmpDocItems.AMOUNT = data[i].AMOUNT
                    tmpDocItems.TOTAL = data[i].TOTAL
                    tmpDocItems.DESCRIPTION = data[i].DESCRIPTION
                    tmpDocItems.VAT_RATE = data[i].VAT_RATE
                    tmpDocItems.DISCOUNT_RATE = data[i].DISCOUNT_RATE
                    tmpDocItems.ORDER_LINE_GUID = data[i].GUID
                    tmpDocItems.ORDER_DOC_GUID = data[i].DOC_GUID
                    tmpDocItems.SUB_FACTOR = data[i].SUB_FACTOR
                    tmpDocItems.SUB_PRICE = data[i].SUB_PRICE
                    tmpDocItems.SUB_QUANTITY = data[i].SUB_QUANTITY
                    tmpDocItems.SUB_SYMBOL = data[i].SUB_SYMBOL
                    tmpDocItems.UNIT_SHORT = data[i].UNIT_SHORT

                    await this.docObj.docItems.addEmpty(tmpDocItems)
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
                query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 40 AND REBATE = 0 AND DOC_DATE > GETDATE()-30 ORDER BY DOC_DATE DESC"
            }
        }
        else
        {
            tmpQuery = 
            {
                query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 40 AND REBATE = 0 ORDER BY DOC_DATE DESC"
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPurcDispatch"  + this.tabIndex}
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
                                            await this.grdPurcDispatch.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                        {
                                            if(this.docObj.docItems.dt()[i].INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')   
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
                                            if(this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcDispatch.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
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
                            <Form colCount={3} id={"frmPurcDispatch"  + this.tabIndex}>
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
                                               
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                    query : "SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = 0 AND DOC_TYPE = 40",
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
                                            <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
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
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDate")} width={300}  />
                                        <Column dataField="OUTPUT_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} />
                                        <Column dataField="OUTPUT_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} />
                                        
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
                                                this.frmDocItems.option('disabled',false)
                                            }
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN(0,2)"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
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
                                                    this.pg_txtCustomerCode.onClick = (data) =>
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
                                                                this.frmDocItems.option('disabled',false)
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
                                        <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
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
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                        
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
                                        <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
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
                                        <Validator validationGroup={"frmPurcDispatch"  + this.tabIndex}>
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
                                                        this.txtBarcode.value = ''
                                                        return
                                                    }
                                                  
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.value = ''
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
                                        let tmpQuery = 
                                        {  
                                            query :"SELECT GUID,CODE,NAME,COST_PRICE,UNIT_GUID AS UNIT,VAT,MULTICODE,CUSTOMER_NAME,BARCODE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE = @CODE OR CODE = @CODE OR (MULTICODE = @CODE AND CUSTOMER_GUID = @CUSTOMER)",
                                            param : ['CODE:string|50','CUSTOMER:string|50'],
                                            value : [this.txtBarcode.value,this.docObj.dt()[0].OUTPUT]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.txtPopQuantity.value = 1
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
                                            await this.pg_txtItemsCode.setVal(this.txtBarcode.value)
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
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
                                                this.customerControl = true
                                                this.customerClear = false
                                                this.combineControl = true
                                                this.combineNew = false
                                                if(data.length > 0)
                                                {
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
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmPurcDispatch"  + this.tabIndex}
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
                                                        this.customerControl = true
                                                        this.customerClear = false
                                                        this.combineControl = true
                                                        this.combineNew = false
                                                        if(data.length > 0)
                                                        {
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
                                                    return
                                                }
                                            }
                                           
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
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
                                                this.customerControl = true
                                                this.customerClear = false
                                                this.combineControl = true
                                                this.combineNew = false
                                                if(data.length > 0)
                                                {
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
                                     validationGroup={"frmPurcDispatch"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.multiItemData.clear
                                            this.popMultiItem.show()
                                            if( typeof this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1] != 'undefined' && this.docObj.docItems.dt()[this.docObj.docItems.dt().length - 1].ITEM_CODE == '')
                                            {
                                                await this.grdPurcDispatch.devGrid.deleteRow(this.docObj.docItems.dt().length - 1)
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
                                    <NdGrid parent={this} id={"grdPurcDispatch"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'450'} 
                                    width={'100%'}
                                    dbApply={false}
                                    sorting={false}
                                    filterRow={{visible:true}}
                                    onCellPrepared={(e) =>
                                        {
                                            if(e.rowType === "data" && e.column.dataField === "DIFF_PRICE" && e.data.ITEM_TYPE == 0)
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
                                        if(e.key.INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')
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
                                            e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                            let tmpQuery = 
                                            {
                                                query :"SELECT [dbo].[FN_CUSTOMER_PRICE](@ITEM_GUID,@CUSTOMER_GUID,@QUANTITY,GETDATE()) AS PRICE",
                                                param : ['ITEM_GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
                                                value : [e.key.ITEM,this.docObj.dt()[0].OUTPUT,e.data.QUANTITY]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                e.key.PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(3))
                                                e.key.SUB_PRICE = Number(((tmpData.result.recordset[0].PRICE).toFixed(3)) / e.key.SUB_FACTOR).round(2)
                                                
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
                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) * (e.key.VAT_RATE) / 100)).toFixed(4));
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(4))
                                        e.key.TOTAL = Number((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) + e.key.VAT)).round(2)
                                        e.key.TOTALHT = Number((e.key.AMOUNT - e.key.DISCOUNT)).round(2)
                                        e.key.DIFF_PRICE = e.key.PRICE - e.key.CUSTOMER_PRICE
                                       
                                        if(e.key.DISCOUNT == 0)
                                        {
                                            e.key.DISCOUNT_RATE = 0
                                            e.key.DISCOUNT_1 = 0
                                            e.key.DISCOUNT_2 = 0
                                            e.key.DISCOUNT_3 = 0
                                        }
                                        this._calculateTotal()
                                    }}
                                    onRowRemoved={async (e)=>{
                                        this._calculateTotal()
                                    }}
                                    onReady={async()=>
                                    {
                                        await this.grdPurcDispatch.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
                                    }}
                                    >
                                        <StateStoring enabled={true} type="localStorage" storageKey={this.props.data.id + "_grdPurcDispatch"}/>
                                        <ColumnChooser enabled={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.irs_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} allowEditing={false} defaultSortOrder="desc"/>
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcDispatch.clmCreateDate")} width={80} allowEditing={false}/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdPurcDispatch.clmCuser")} width={90} allowEditing={false}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdPurcDispatch.clmItemCode")} width={105} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="MULTICODE" caption={this.t("grdPurcDispatch.clmMulticode")} width={105} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdPurcDispatch.clmItemName")} width={330} />
                                        <Column dataField="ORIGIN" caption={this.t("grdPurcDispatch.clmOrigin")} width={60} allowEditing={true} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdPurcDispatch.clmQuantity")} width={65} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                        <Column dataField="SUB_FACTOR" caption={this.t("grdPurcDispatch.clmSubFactor")} width={65} allowEditing={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="SUB_QUANTITY" caption={this.t("grdPurcDispatch.clmSubQuantity")} dataType={'number'} width={65} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + " / " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="PRICE" caption={this.t("grdPurcDispatch.clmPrice")} width={65} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                        <Column dataField="SUB_PRICE" caption={this.t("grdPurcDispatch.clmSubPrice")} dataType={'number'} format={'€#,##0.000'} width={65} allowHeaderFiltering={false} cellRender={(e)=>{return e.value + "€/ " + e.data.SUB_SYMBOL}}/>
                                        <Column dataField="CUSTOMER_PRICE" caption={this.t("grdPurcDispatch.clmCustomerPrice")} dataType={'number'} format={'€#,##0.000'} width={70} allowHeaderFiltering={false} allowEditing={false}/>
                                        <Column dataField="DIFF_PRICE" caption={this.t("grdPurcDispatch.clmDiffPrice")} dataType={'number'} format={'€#,##0.000'} width={70} allowHeaderFiltering={false} allowEditing={false}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdPurcDispatch.clmAmount")} width={90} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdPurcDispatch.clmDiscount")} width={60} editCellRender={this._cellRoleRender} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdPurcDispatch.clmDiscountRate")} width={60} dataType={'number'} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="VAT" caption={this.t("grdPurcDispatch.clmVat")} width={75} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="VAT_RATE" caption={this.t("grdPurcDispatch.clmVatRate")} width={50} allowEditing={false}/>
                                        <Column dataField="TOTALHT" caption={this.t("grdPurcDispatch.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                        <Column dataField="TOTAL" caption={this.t("grdPurcDispatch.clmTotal")} width={110} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="ORDER_REF" caption={this.t("grdPurcDispatch.clmOrder")} width={110}  allowEditing={false}/>
                                        <Column dataField="DESCRIPTION" caption={this.t("grdPurcDispatch.clmDescription")} width={100} />
                                    </NdGrid>
                                    <ContextMenu
                                    dataSource={this.rightItems}
                                    width={200}
                                    target="#grdPurcDispatch"
                                    onItemClick={(async(e)=>
                                    {
                                        if(e.itemData.text == this.t("getOrders"))
                                        {
                                            this._getOrders()
                                        }
                                    }).bind(this)} />
                                 </React.Fragment>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} parent={this} id={"frmPurcDispatch"  + this.tabIndex}>
                                {/* Ara Toplam */}
                                <EmptyItem colSpan={3}/>
                                <Item>
                                    <Form colCount={5}>
                                        <Item colSpan={3}>
                                            <Label text={this.t("txtAmount")} alignment="right" />
                                            <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                            maxLength={32}
                                        
                                            ></NdTextBox>
                                        </Item>
                                        <Item colSpan={2}>
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
                                    </Form> 
                                </Item>
                                {/* İndirim */}
                                <EmptyItem colSpan={3}/>
                                <Item>
                                    <Label text={this.t("txtTotalHt")} alignment="right" />
                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}
                                    maxLength={32}
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
                                                icon:'more',
                                                onClick:async ()  =>
                                                {
                                                    this.vatRate.clear()
                                                    for (let i = 0; i < this.docObj.docItems.dt().groupBy('VAT_RATE').length; i++) 
                                                    {
                                                        let tmpVat = parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                                                        let tmpData = {"RATE":this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE,"VAT":tmpVat}
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
                                                
                                                for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                {
                                                    let tmpDocData = this.docObj.docItems.dt()[i]

                                                    if(this.chkFirstDiscount.value == false)
                                                    {
                                                        tmpDocData.DISCOUNT_1 = Number(tmpDocData.PRICE * tmpDocData.QUANTITY).rateInc(this.txtDiscountPercent1.value,4)
                                                    }
                                                    tmpDocData.DISCOUNT_2 = Number(((tmpDocData.PRICE * tmpDocData.QUANTITY) - tmpDocData.DISCOUNT_1)).rateInc(this.txtDiscountPercent2.value,4)

                                                    tmpDocData.DISCOUNT_3 =  Number(((tmpDocData.PRICE * tmpDocData.QUANTITY)-(tmpDocData.DISCOUNT_1+tmpDocData.DISCOUNT_2))).rateInc(this.txtDiscountPercent3.value,4)
                                                    
                                                    tmpDocData.DISCOUNT = parseFloat((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3).toFixed(4))
                                                    tmpDocData.TOTALHT = Number((Number((tmpDocData.PRICE * tmpDocData.QUANTITY)) - (Number(tmpDocData.DISCOUNT_1) + Number(tmpDocData.DISCOUNT_2) + Number(tmpDocData.DISCOUNT_3)))).round(2)
                                                    if(tmpDocData.VAT > 0)
                                                    {
                                                        tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT) * (tmpDocData.VAT_RATE / 100)).toFixed(4))
                                                    }
                                                    tmpDocData.TOTAL = Number((tmpDocData.TOTALHT + tmpDocData.VAT)).round(2)
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
                                                    this.frmDocItems.option('disabled',false)
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
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="MULTICODE" caption={this.t("pg_txtItemsCode.clmMulticode")} width={150}/>
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                        <Column dataField="PURC_PRICE" caption={this.t("pg_txtItemsCode.clmPrice")} width={300}  />
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
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '11'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcOrderPrint" + this.tabIndex}>
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
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM  [dbo].[FN_DOC_ITEMS_FOR_PRINT](@DOC_GUID) ORDER BY LINE_NO " ,
                                                    param:  ['DOC_GUID:string|50','DESIGN:string|25'],
                                                    value:  [this.docObj.dt()[0].GUID,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                            console.log(JSON.stringify(tmpData.result.recordset)) // BAK
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
                            <div className='row'>
                        
                            </div>
                        
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
                            <div className='row'>
                        
                            </div>
                        
                    </NdDialog>  
                    {/* Yeni Fiyat Dialog  */}
                    <NdDialog id={"msgNewPrice"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgNewPrice.title")} 
                    showCloseButton={false}
                    width={"1000px"}
                    height={"800PX"}
                    button={[{id:"btn01",caption:this.t("msgNewPrice.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewPrice.btn02"),location:'after'}]}
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
                                    onRowRemoved={async (e)=>{
                                    }}
                                    onRowUpdated={async(e)=>{

                                        let tmpMargin = e.key.SALE_PRICE - e.key.PRICE
                                        let tmpMarginRate = (tmpMargin /(e.key.SALE_PRICE)) * 100
                                        e.key.PRICE_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
                                        
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdNewPrice.clmCode")} width={100} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdNewPrice.clmName")} width={180}  allowEditing={false}/>
                                        <Column dataField="CUSTOMER_PRICE" caption={this.t("grdNewPrice.clmPrice")} width={130}   allowEditing={false}/>
                                        <Column dataField="PRICE" caption={this.t("grdNewPrice.clmPrice2")} dataType={'number'} width={70}  allowEditing={false}/>
                                        <Column dataField="SALE_PRICE" caption={this.t("grdNewPrice.clmSalePrice")} dataType={'number'} width={80}  format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="PRICE_MARGIN" caption={this.t("grdNewPrice.clmMargin")}width={100}  allowEditing={false}/>
                                    </NdGrid>
                                    </Item>
                                </Form>
                            </div>
                        </div>
                        <div className='row'>
                    
                        </div>
                    </NdDialog>  
                    {/* Yeni Fiyat Dialog  */}
                    <NdDialog id={"msgNewPriceDate"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={this.t("msgNewPriceDate.title")} 
                    showCloseButton={false}
                    width={"1000px"}
                    height={"800PX"}
                    button={[{id:"btn01",caption:this.t("msgNewPriceDate.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewPriceDate.btn02"),location:'after'}]}
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
                                    onRowRemoved={async (e)=>{
                                    }}
                                    onRowUpdated={async(e)=>{
                                        let tmpExVat = e.key.SALE_PRICE / ((e.key.VAT_RATE / 100) + 1)
                                        let tmpMargin = tmpExVat -  e.key.PRICE;
                                        let tmpMarginRate = ((tmpMargin /  e.key.PRICE)) * 100
                                        e.key.PRICE_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standart" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={false} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdNewPriceDate.clmCode")} width={100} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdNewPriceDate.clmName")} width={180}  allowEditing={false}/>
                                        <Column dataField="COST_PRICE" caption={this.t("grdNewPriceDate.clmCostPrice")} width={130}   allowEditing={false}/>
                                        <Column dataField="CUSTOMER_PRICE" caption={this.t("grdNewPriceDate.clmPrice")} width={130}   allowEditing={false}/>
                                    </NdGrid>
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
                    {/* Sipariş Grid */}
                    <NdPopGrid id={"pg_ordersGrid"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    selection={{mode:"multiple"}}
                    title={this.t("pg_ordersGrid.title")} //
                    >
                        <Paging defaultPageSize={22} />
                        <Column dataField="REFERANS" caption={this.t("pg_ordersGrid.clmReferans")} width={200} defaultSortOrder="asc"/>
                        <Column dataField="ITEM_CODE" caption={this.t("pg_ordersGrid.clmCode")} width={200}/>
                        <Column dataField="ITEM_NAME" caption={this.t("pg_ordersGrid.clmName")} width={500} />
                        <Column dataField="QUANTITY" caption={this.t("pg_ordersGrid.clmQuantity")} width={200} />
                        <Column dataField="PRICE" caption={this.t("pg_ordersGrid.clmPrice")} width={200} format={{ style: "currency", currency: "EUR",precision: 2}} />
                        <Column dataField="TOTAL" caption={this.t("pg_ordersGrid.clmTotal")} width={200} format={{ style: "currency", currency: "EUR",precision: 2}} />
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
                                    <Form colCount={2}>
                                        <Item>
                                            <Label text={this.t("txtUnitFactor")} alignment="right" />
                                            <NdNumberBox id="txtUnitFactor" parent={this} simple={true}
                                            readOnly={true}
                                            maxLength={32}
                                            >
                                            </NdNumberBox>
                                        </Item>
                                        <Item>
                                            <NdButton id="btnFactorSave" parent={this} text={this.t("msgUnit.btnFactorSave")} type="default"
                                            onClick={async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"EXEC [dbo].[PRD_ITEM_UNIT_UPDATE] " +
                                                            "@GUID = @PGUID, " + 
                                                            "@CUSER = @PCUSER, " +
                                                            "@FACTOR = @PFACTOR ", 
                                                    param : ['PGUID:string|50','PCUSER:string|25','PFACTOR:float'],
                                                    value : [this.cmbUnit.value,this.user.CODE,this.txtUnitFactor.value]
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
                                            }}/>
                                        </Item>
                                    </Form>
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
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                        {
                                            this.txtUnitFactor.value = Number((this.txtUnitQuantity.value / this.txtTotalQuantity.value).toFixed(3))
                                        }
                                        else
                                        {
                                            this.txtUnitFactor.value = Number((this.txtTotalQuantity.value / this.txtUnitQuantity.value).toFixed(3))
                                        }
                                    }).bind(this)}
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
                                                    for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                    {
                                                        this.docObj.docItems.dt()[i].VAT = 0  
                                                        this.docObj.docItems.dt()[i].VAT_RATE = 0
                                                        this.docObj.docItems.dt()[i].TOTAL = (this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) - this.docObj.docItems.dt()[i].DISCOUNT
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
                </ScrollView>                
            </div>
        )
    }
}