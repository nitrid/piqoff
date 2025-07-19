import React from 'react';
import App from '../../lib/app.js';
import { datatable } from '../../../core/core.js'
import { docCls, docExtraCls } from '../../../core/cls/doc.js'

import NbButton from '../../../core/react/bootstrap/button.js';
import NdTextBox from '../../../core/react/devex/textbox.js';
import NdSelectBox from '../../../core/react/devex/selectbox.js';
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../core/react/devex/popgrid.js';
import NdNumberBox from '../../../core/react/devex/numberbox.js';
import NdPopUp from '../../../core/react/devex/popup.js';
import NdGrid,{ Column, Editing, Paging, Scrolling, KeyboardNavigation } from '../../../core/react/devex/grid.js';
import { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label.js';

import { PageBar } from '../../tools/pageBar.js';
import { PageView,PageContent } from '../../tools/pageView.js';
import moment from 'moment';
export default class salesPairing extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.itemDt = new datatable();
        this.unitDt = new datatable();
        this.priceDt = new datatable();     
        this.orderDetailDt = new datatable();        
        
        this.orderGuid = ''

        this.itemDt.selectCmd = 
        {
            query : `SELECT 
                    ITEMS.GUID AS GUID, 
                    ITEMS.TYPE AS TYPE,  
                    ITEMS.SPECIAL AS SPECIAL,  
                    ITEMS.CODE AS CODE,  
                    ITEMS.NAME AS NAME,  
                    ITEMS.COST_PRICE AS COST_PRICE,  
                    ITEMS.STATUS AS STATUS,  
                    ITEMS.MAIN_GRP  AS MIAN_GRP,  
                    ITEMS.MAIN_GRP_NAME AS MAIN_GRP_NAME,  
                    ITEMS.LOT_CODE AS LOT_CODE,  
                    ITEMS.PARTILOT AS PARTILOT,  
                    ITEMS.PARTILOT_GUID AS PARTILOT_GUID,  
                    ORDERS.UNIT AS UNIT_GUID, 
                    (BARCODE) AS BARCODE,  
                    ITEMS.UNIT_FACTOR AS UNIT_FACTOR,  
                    ORDERS.GUID AS ORDER_LINE_GUID,  
                    ORDERS.DOC_GUID AS ORDER_DOC_GUID,  
                    ORDERS.QUANTITY AS QUANTITY,  
                    CASE WHEN '${this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value}' = 'true' THEN (ORDERS.APPROVED_QUANTITY - ORDERS.COMP_QUANTITY) ELSE (ORDERS.QUANTITY - ORDERS.COMP_QUANTITY) END AS PEND_QUANTITY,  
                    ORDERS.PRICE AS PRICE,  
                    ORDERS.DISCOUNT_1 AS DISCOUNT_1,  
                    ORDERS.DISCOUNT_2 AS DISCOUNT_2,  
                    ORDERS.DISCOUNT_3 AS DISCOUNT_3,  
                    ORDERS.DOC_DISCOUNT_1 AS DOC_DISCOUNT_1,  
                    ORDERS.DOC_DISCOUNT_2 AS DOC_DISCOUNT_2,  
                    ORDERS.DOC_DISCOUNT_3 AS DOC_DISCOUNT_3,  
                    ORDERS.VAT AS VAT,  
                    ORDERS.VAT_RATE AS VAT_RATE  
                    FROM ITEMS_BARCODE_MULTICODE_VW_01 AS ITEMS   
                    INNER JOIN DOC_ORDERS AS ORDERS ON ITEMS.GUID = ORDERS.ITEM AND ORDERS.CLOSED = 0  
                    WHERE ORDERS.DOC_GUID = @DOC_GUID AND (CODE = @CODE OR BARCODE = @CODE) OR (@CODE = '') ORDER BY LOT_CODE ASC`,
            param : ['DOC_GUID:string|50','CODE:string|50'],
        }
        this.unitDt.selectCmd = 
        {
            query : `SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1  ORDER BY TYPE ASC`,
            param : ['ITEM_GUID:string|50'],
        }
        this.priceDt.selectCmd = 
        {
            query : `SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE`,
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
        }
        this.orderDetailDt.selectCmd = 
        {
            query : `SELECT GUID,ITEM_NAME,ITEM_CODE,UNIT_NAME,(PEND_QUANTITY/UNIT_FACTOR) AS PEND_QUANTITY, LINE_NO AS LINE_NO FROM 
                    (SELECT GUID, 
                    ITEM_NAME, 
                    ITEM_CODE, 
                    LINE_NO, 
                    CASE WHEN '${this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value}' = 'true' THEN (APPROVED_QUANTITY - COMP_QUANTITY) ELSE (QUANTITY - COMP_QUANTITY) END AS PEND_QUANTITY , 
                    ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE ITEM_UNIT.GUID = DOC_ORDERS_VW_01.UNIT),1) AS UNIT_FACTOR , 
                    ISNULL((SELECT SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.GUID = DOC_ORDERS_VW_01.UNIT),'U') AS UNIT_NAME 
                    FROM DOC_ORDERS_VW_01 WHERE DOC_GUID = @DOC_GUID AND CLOSED = 0) AS TMP  ORDER BY LINE_NO ASC`,
            param : ['DOC_GUID:string|50'],
        }

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'auto',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
    }
    createModernAlert(type, title, message, icon = null) 
    {
        const alertTypes = 
        {
            success: 
            {
                color: '#28a745',
                bgColor: '#d4edda',
                borderColor: '#c3e6cb',
                iconDefault: 'fa-solid fa-check-circle'
            },
            error: 
            {
                color: '#dc3545',
                bgColor: '#f8d7da',
                borderColor: '#f5c6cb',
                iconDefault: 'fa-solid fa-exclamation-triangle'
            },
            warning: 
            {
                color: '#ffc107',
                bgColor: '#fff3cd',
                borderColor: '#ffeaa7',
                iconDefault: 'fa-solid fa-exclamation-triangle'
            },
            info: 
            {
                color: '#007bff',
                bgColor: '#d1ecf1',
                borderColor: '#bee5eb',
                iconDefault: 'fa-solid fa-info-circle'
            }
        };

        const alertStyle = alertTypes[type] || alertTypes.info;
        const finalIcon = icon || alertStyle.iconDefault;

        return (
            <div style={{background: `linear-gradient(135deg, ${alertStyle.bgColor} 0%, #ffffff 100%)`,borderRadius: '12px',padding: '24px',boxShadow: '0 8px 32px rgba(0,0,0,0.1)',border: `2px solid ${alertStyle.borderColor}`,position: 'relative',overflow: 'hidden'}}>
                <div style={{position: 'absolute',top: '0',left: '0',right: '0',height: '4px',background: `linear-gradient(135deg, ${alertStyle.color} 0%, ${alertStyle.color}aa 100%)`}}></div>
                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center',marginBottom: '16px'}}>
                    <i className={finalIcon} style={{fontSize: '32px',color: alertStyle.color,marginRight: '12px',filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}></i>
                    <h3 style={{margin: '0',fontSize: '18px',fontWeight: '600',color: alertStyle.color}}>
                        {title}
                    </h3>
                </div>
                <div style={{textAlign: 'center',fontSize: '16px',lineHeight: '1.5',color: '#495057',fontWeight: '500',padding: '8px 16px',backgroundColor: 'rgba(255,255,255,0.7)',borderRadius: '8px',border: `1px solid ${alertStyle.borderColor}50`}}>
                    {message}
                </div>
                <div style={{position: 'absolute',bottom: '-10px',right: '-10px',width: '60px',height: '60px',background: `linear-gradient(135deg, ${alertStyle.color}20 0%, transparent 70%)`,borderRadius: '50%'}}></div>
            </div>
        );
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()
        this.dtFirstDate.value = moment(new Date())
        this.dtLastDate.value = moment(new Date())

        this.dtDocDate.value = moment(new Date())

        await this.cmbDepot.dataRefresh({source:{select:{query : `SELECT * FROM DEPOT_VW_01`},sql:this.core.sql}});

        let tmpDoc = {...this.docObj.empty}

        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 40
        tmpDoc.REF = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'txtRef'}).getValue().value
        tmpDoc.OUTPUT = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value

        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false
        this.cmbDepot.readOnly = false
        this.dtDocDate.readOnly = false

        this.clearEntry();

        this.txtRef.props.onChange(tmpDoc.REF)

        await this.grdList.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
        await this.cmbUnit.dataRefresh({source : this.unitDt})
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.pageView.activePage('Main')
        this.init()
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.unitDt.clear();
        this.priceDt.clear();   

        this.lblItemName.value = ""
        this.lblOrderName.value = ""
        this.lblDepotQuantity.value = 0
        this.txtPendQuantity.value = 0
        this.txttotalQuantity.value = 0
        this.txtFactor.value = 0
        this.txtQuantity.value = 0
        this.cmbUnit.setData([])
        this.txtBarcode.focus()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:40});
        
        this.txtRef.readOnly = true
        this.txtRefNo.readOnly = true
        this.cmbDepot.readOnly = true
        this.dtDocDate.readOnly = true
    }
    async getOrders()
    {
        let tmpSource =
        {
            source : 
            {
                select : 
                {
                    query : `SELECT REF,REF_NO,DOC_GUID,DOC_DATE,(SELECT TOP 1 VAT_ZERO FROM DOC WHERE DOC.GUID = DOC_ORDERS_VW_01.DOC_GUID) AS VAT_ZERO,INPUT AS CUSTOMER,INPUT_CODE AS CUSTOMER_CODE,INPUT_NAME AS CUSTOMER_NAME, 
                            OUTPUT_CODE AS DEPOT_CODE,OUTPUT_NAME AS DEPOT_NAME,OUTPUT AS DEPOT 
                            FROM DOC_ORDERS_VW_01 
                            WHERE CLOSED = 0 AND CASE WHEN '${this.sysParam.filter({ID:'onlyApprovedPairing',USERS:this.user.CODE}).getValue()?.value}' = 'true' THEN (DOC_ORDERS_VW_01.APPROVED_QUANTITY - DOC_ORDERS_VW_01.COMP_QUANTITY) ELSE DOC_ORDERS_VW_01.COMP_QUANTITY END > 0 AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = ''))
                            GROUP BY REF,REF_NO,DOC_GUID,DOC_DATE,INPUT,INPUT_CODE,INPUT_NAME,OUTPUT_CODE,OUTPUT_NAME,OUTPUT`,
                    param : ['FIRST_DATE:date','LAST_DATE:date','INPUT_CODE:string|50'],
                    value : [this.dtFirstDate.value,this.dtLastDate.value,this.docObj.dt()[0].INPUT_CODE]
                },
                sql : this.core.sql
            }
        }
        await this.grdOrderList.dataRefresh(tmpSource)
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [this.orderGuid,pCode]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME               

                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh()
                this.cmbUnit.setData(this.unitDt)

                if(this.unitDt.length > 0)
                {
                    if(this.itemDt[0].UNIT_GUID != '00000000-0000-0000-0000-000000000000')
                    {
                        this.cmbUnit.value = this.itemDt[0].UNIT_GUID
                        this.txtFactor.value = this.unitDt.where({GUID:this.itemDt[0].UNIT_GUID})[0].FACTOR
                    }
                    else
                    {
                        this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                        this.txtFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                    }
                   
                    this.txtFactor.props.onValueChanged()
                }

                this.txtPendQuantity.value = this.itemDt[0].PEND_QUANTITY / this.txtFactor.value
                this.txtBarcode.value = ""
                this.txtQuantity.focus();
            }
            else
            {                               
                document.getElementById("Sound").play(); 
                
                this.alertContent.content = this.createModernAlert('error', this.t("msgAlert.BarcodeError"), this.t("msgAlert.msgBarcodeNotFound"), 'fa-solid fa-barcode')
                await dialog(this.alertContent);
                
                this.txtBarcode.value = ""
                this.txtBarcode.focus();
            }
            resolve();
        });
    }
    async calcEntry() 
    {
        if(this.itemDt.length == 0)
        {
            return
        }

        if (this.txtFactor.value !== 0 || this.txtQuantity.value !== 0) 
        {
            this.txtPendQuantity.value = this.itemDt[0].PEND_QUANTITY / this.txtFactor.value
            this.txttotalQuantity.value = this.txtFactor.value * this.txtQuantity.value;

            if (this.txttotalQuantity.value > this.itemDt[0].PEND_QUANTITY) 
            {
                this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.QuantityWarning"), this.t("msgAlert.msgCompQuantityError"), 'fa-solid fa-exclamation-triangle');
                document.getElementById("Sound").play(); 
                await dialog(this.alertContent);
                this.txtQuantity.value = 0;
                this.txttotalQuantity.value = 0;
            }
        }
    }
    async addItem()
    {
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.BarcodeCheck"), this.t("msgAlert.msgBarcodeCheck"), 'fa-solid fa-barcode')
            await dialog(this.alertContent);
            return
        }

        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0 || (this.txttotalQuantity.value > (this.txtPendQuantity.value * this.txtFactor.value )))
        {
            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.QuantityCheck"), this.t("msgAlert.msgQuantityCheck"), 'fa-solid fa-calculator')
            document.getElementById("Sound").play(); 
            await dialog(this.alertContent);
            return
        }

        if(this.txtQuantity.value > 15000000)
        {
            this.alertContent.content = this.createModernAlert('error', this.t("msgAlert.LimitExceeded"), this.t("msgAlert.msgQuantityCheck"), 'fa-solid fa-exclamation-circle')
            document.getElementById("Sound").play(); 
            await dialog(this.alertContent);
            return
        }

        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value

        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                let tmpQuantity = this.txttotalQuantity.value
                this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + tmpQuantity
                this.docObj.docItems.dt()[i].VAT = parseFloat((this.docObj.docItems.dt()[i].VAT + (this.docObj.docItems.dt()[i].PRICE * (this.docObj.docItems.dt()[i].VAT_RATE / 100)) * tmpQuantity).toFixed(3))
                this.docObj.docItems.dt()[i].AMOUNT = parseFloat((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE).toFixed(3))
                this.docObj.docItems.dt()[i].TOTAL = parseFloat((((this.docObj.docItems.dt()[i].QUANTITY * this.docObj.docItems.dt()[i].PRICE) - this.docObj.docItems.dt()[i].DISCOUNT) + this.docObj.docItems.dt()[i].VAT).toFixed(3))
                
                this.clearEntry()
                await this.save()
            }

            for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
            {
                if(this.docObj.docItems.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
                {
                    if(prmRowMerge == 2)
                    {
                        document.getElementById("Sound2").play(); 

                        let tmpConfObj = 
                        {
                            id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'auto',
                            button:[{id:"btn01",caption:this.lang.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCombineItem.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCombineItem.msg")}</div>)
                        }

                        let pResult = await dialog(tmpConfObj);
                        
                        if(pResult == 'btn01')
                        {                   
                            tmpFnMergeRow(i)
                            return
                        }
                        else
                        {
                            break
                        }
                    }
                    else
                    {
                        tmpFnMergeRow(i)
                        return
                    }
                }
            }
        }

        let tmpDocItems = {...this.docObj.docItems.empty}

        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
        tmpDocItems.UNIT = this.cmbUnit.value
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.txttotalQuantity.value
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT_RATE
        tmpDocItems.PRICE = this.itemDt[0].PRICE
        tmpDocItems.AMOUNT = (this.txttotalQuantity.value) * this.itemDt[0].PRICE
        tmpDocItems.DISCOUNT_1 = Number(((this.itemDt[0].DISCOUNT_1) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT_2 = Number(((this.itemDt[0].DISCOUNT_2) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT_3 = Number(((this.itemDt[0].DISCOUNT_3) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value).round(2)
        tmpDocItems.DISCOUNT = (tmpDocItems.DISCOUNT_1 + tmpDocItems.DISCOUNT_2 + tmpDocItems.DISCOUNT_3)
        tmpDocItems.DOC_DISCOUNT_1 = ((this.itemDt[0].DOC_DISCOUNT_1) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT_2 = ((this.itemDt[0].DOC_DISCOUNT_2) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT_3 = ((this.itemDt[0].DOC_DISCOUNT_3) / this.itemDt[0].QUANTITY) * this.txttotalQuantity.value
        tmpDocItems.DOC_DISCOUNT = (tmpDocItems.DOC_DISCOUNT_1 + tmpDocItems.DOC_DISCOUNT_2 + tmpDocItems.DOC_DISCOUNT_3)
        tmpDocItems.TOTALHT = Number(tmpDocItems.AMOUNT - (tmpDocItems.DISCOUNT + tmpDocItems.DOC_DISCOUNT)).round(2)
        tmpDocItems.VAT = Number(tmpDocItems.TOTALHT).rateInc(tmpDocItems.VAT_RATE, 4);
        tmpDocItems.TOTAL = tmpDocItems.TOTALHT + tmpDocItems.VAT
        tmpDocItems.ORDER_LINE_GUID = this.itemDt[0].ORDER_LINE_GUID
        tmpDocItems.ORDER_DOC_GUID = this.itemDt[0].ORDER_DOC_GUID
        tmpDocItems.PARTILOT_GUID = this.itemDt[0].PARTILOT_GUID
        tmpDocItems.LOT_CODE = this.itemDt[0].LOT_CODE

        if(this.itemDt[0].PARTILOT == 1)
        {
            if(tmpDocItems.PARTILOT_GUID == '00000000-0000-0000-0000-000000000000')
            {
                let tmpSource =
                {
                    source:
                    {
                        select:
                        {
                            query : `SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL) AND ITEM = '${tmpDocItems.ITEM}'`,
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                }
                
                await this.pg_partiLot.setSource(tmpSource)
                this.pg_partiLot.onClick = async(data) =>
                {
                    tmpDocItems.PARTILOT_GUID = data[0].GUID  
                    tmpDocItems.LOT_CODE = data[0].LOT_CODE
                    this.docObj.docItems.addEmpty(tmpDocItems)
                    this.orderDetailDt.clear();
                    this.orderDetailDt.selectCmd.value = [this.orderGuid]

                    await this.orderDetailDt.refresh();  
                    await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});
                    this.clearEntry()
            
                    await this.save()
                }
                await this.pg_partiLot.show()
            }
            else
            {
                this.docObj.docItems.addEmpty(tmpDocItems)
                this.orderDetailDt.clear();
                this.orderDetailDt.selectCmd.value = [this.orderGuid]
                await this.orderDetailDt.refresh();  
                await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});
                this.clearEntry()
        
                await this.save()
            }
        }
        else
        {
            this.docObj.docItems.addEmpty(tmpDocItems)
            this.orderDetailDt.clear();
            this.orderDetailDt.selectCmd.value = [this.orderGuid]
            
            await this.orderDetailDt.refresh();  
            await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});

            this.clearEntry()
            await this.save()
        }
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            if(this.docObj.dt().length > 0)
            {
                let tmpVat = 0

                for (let i = 0; i < this.docObj.docItems.dt().groupBy('VAT_RATE').length; i++) 
                {
                    tmpVat = tmpVat + parseFloat(this.docObj.docItems.dt().where({'VAT_RATE':this.docObj.docItems.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
                }

                this.docObj.dt()[0].AMOUNT = this.docObj.docItems.dt().sum("AMOUNT",2)
                this.docObj.dt()[0].DISCOUNT = Number(parseFloat(this.docObj.docItems.dt().sum("AMOUNT",2)) - parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2))).round(2)
                this.docObj.dt()[0].DOC_DISCOUNT_1 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_1",4)
                this.docObj.dt()[0].DOC_DISCOUNT_2 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_2",4)
                this.docObj.dt()[0].DOC_DISCOUNT_3 = this.docObj.docItems.dt().sum("DOC_DISCOUNT_3",4)
                this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
                this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
                this.docObj.dt()[0].SUBTOTAL = parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2))
                this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.docObj.docItems.dt().sum("TOTALHT",2)) - parseFloat(this.docObj.docItems.dt().sum("DOC_DISCOUNT",2))).round(2)
                this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)
            }
            
            if((await this.docObj.save()) != 0)
            {
                let tmpConfObj1 =
                {
                    id:'msgSaveResult',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'350px',height:'auto',
                    button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("msgSaveResult.msgFailed")}</div>)
                }
                await dialog(tmpConfObj1);
            }

            this.getOrderName()
            resolve()
        })
    }
    async deleteAll()
    {
        this.docObj.dt('DOC').removeAt(0)
        await this.docObj.dt('DOC').delete();
        this.init()
        this.pageView.activePage('Main')
    }
    async onClickBarcodeShortcut()
    {
        if(this.docObj.dt()[0].OUTPUT == '')
        {
            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.DepotSelection"), this.t("msgAlert.msgDepot"), 'fa-solid fa-warehouse')
            await dialog(this.alertContent);
            return
        }

        if(this.docObj.dt()[0].INPUT == '')
        {
            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.CustomerSelection"), this.t("msgAlert.msgCustomer"), 'fa-solid fa-user')
            await dialog(this.alertContent);
            return
        }

        this.getOrderName()
        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.docObj.dt("DOC_ITEMS").length == 0)
        {
            this.alertContent.content = this.createModernAlert('info', this.t("msgAlert.ProcessCheck"), this.t("msgAlert.msgProcess"), 'fa-solid fa-file-lines')
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    async onClickOrdersShortcut()
    {
        this.txtOrderRef.value = ''
        this.pageView.activePage('Orders')
        this.txtOrderRef.focus()
    }
    async ordersSelect(pGuid)
    {
        if(typeof pGuid == 'undefined')
        {
            pGuid = this.grdOrderList.getSelectedData()[0].DOC_GUID
        }

        if(this.docObj.docItems.dt().length > 0)
        {
            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.Info"), this.t("msgAlert.msgOrderSelected"), 'fa-solid fa-list-check')
            await dialog(this.alertContent);
            return
        }

        if(typeof pGuid != 'undefined')
        {
            if(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'GetOldDispatch'}).getValue())
            {
                let tmpQuery = 
                {
                    query : `SELECT * FROM DOC_CONNECT_VW_01 WHERE DOC_FROM = @GUID`,
                    param : ['GUID:string|50'],
                    value : [pGuid]
                }

                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    await this.getDoc(tmpData.result.recordset[0].DOC_TO,'',-1)
                    this.orderGuid = pGuid
                    this.onClickBarcodeShortcut()
                    return
                }
            }

            let tmpQuery = 
            {
                query : `SELECT *,(SELECT ISNULL(MAX(DOC.REF_NO) + 1,1) FROM DOC WHERE DOC.TYPE = 1 AND DOC.DOC_TYPE = 40 AND REF = @REF) AS NEW_REF_NO  FROM DOC_VW_01 WHERE GUID = @GUID `,
                param : ['GUID:string|50','REF:string|25'],
                value : [pGuid,this.txtRef.value]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                this.docObj.dt()[0].OUTPUT = tmpData.result.recordset[0].OUTPUT,
                this.docObj.dt()[0].INPUT_CODE = tmpData.result.recordset[0].INPUT_CODE
                this.docObj.dt()[0].INPUT_NAME = tmpData.result.recordset[0].INPUT_NAME
                this.docObj.dt()[0].INPUT = tmpData.result.recordset[0].INPUT
                this.docObj.dt()[0].VAT_ZERO = tmpData.result.recordset[0].VAT_ZERO
                this.orderGuid = tmpData.result.recordset[0].GUID
                this.txtRefNo.value = tmpData.result.recordset[0].NEW_REF_NO
                this.onClickBarcodeShortcut()
            }
        } 
        else if(this.grdOrderList.getSelectedData().length)
        {
            this.docObj.dt()[0].OUTPUT = this.grdOrderList.getSelectedData()[0].DEPOT,
            this.docObj.dt()[0].INPUT_CODE = this.grdOrderList.getSelectedData()[0].CUSTOMER_CODE
            this.docObj.dt()[0].INPUT_NAME = this.grdOrderList.getSelectedData()[0].CUSTOMER_NAME
            this.docObj.dt()[0].INPUT = this.grdOrderList.getSelectedData()[0].CUSTOMER

            if(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'refForCustomerCode'}).getValue())
            {
                this.docObj.dt()[0].REF = this.grdOrderList.getSelectedData()[0].CUSTOMER_CODE
            }

            this.docObj.dt()[0].VAT_ZERO = this.grdOrderList.getSelectedData()[0].VAT_ZERO
            this.orderGuid = this.grdOrderList.getSelectedData()[0].DOC_GUID
            
            let tmpQuery = 
            {
                query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF `,
                param : ['REF:string|25'],
                value : [typeof e.component == 'undefined' ? e : this.txtRef.value]
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
            }

            this.onClickBarcodeShortcut()
        }
        this.docObj.dt()[0].DOC_DATE = moment(new Date())
    }
    async getOrderName()
    {
        if(this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'showOrderLine'}).getValue() == true)
        {
            this.orderDetailDt.selectCmd.value = [this.orderGuid]
            await this.orderDetailDt.refresh();  
            this.lblOrderName.value = this.orderDetailDt.where({PEND_QUANTITY:{'>':'0'}}).orderBy('LINE_NO',"asc")[0].ITEM_NAME
        }
    }
    async getOrderList()
    {
        this.orderDetailDt.clear();
        this.orderDetailDt.selectCmd.value = [this.orderGuid]
        
        await this.orderDetailDt.refresh();  
        await this.grdOrderDetail.dataRefresh({source:this.orderDetailDt});
        
        this.pageView.activePage('OrderDetail')
    }
    async orderComplated()
    {
        let tmpConfObj = 
        {
            id:'msgOrderComplated',showTitle:true,title:this.lang.t("msgOrderComplated.title"),showCloseButton:true,width:'350px',height:'auto',
            button:[{id:"btn01",caption:this.lang.t("msgOrderComplated.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgOrderComplated.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderComplated.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj);
        
        if(pResult == 'btn01')
        {              
            for (let i = 0; i < this.orderDetailDt.length; i++) 
            {
                if(this.orderDetailDt[i].PEND_QUANTITY > 0)
                {
                    let tmpQuery = 
                    {
                        query : `UPDATE DOC_ORDERS SET CLOSED = 1 WHERE GUID = @GUID `,
                        param : ['GUID:string|50'],
                        value : [this.orderDetailDt[i].GUID]
                    }

                    await this.core.sql.execute(tmpQuery) 
                }
            }
            this.init()
        }
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.kar_01")} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :
                            [
                                {
                                    icon : "fa-file",
                                    text : this.lang.t("btnNewDoc"),
                                    onClick : ()=>
                                    {
                                        this.init()
                                    }
                                },
                                {
                                    icon : "fa-trash",
                                    text : this.lang.t("btnDocDelete"),
                                    onClick : ()=>
                                    {
                                        if(this.docObj.dt().length > 0)
                                        {
                                            this.deleteAll();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            menu :
                            [
                                {
                                    icon : "fa-percent",
                                    text : this.lang.t("btnLineDisc"),
                                    onClick : ()=>
                                    {
                                        this.popDiscount.show()
                                    }
                                }
                            ],
                            shortcuts :
                            [
                                {icon : "fa-file-lines",onClick : this.onClickProcessShortcut.bind(this)}
                            ]
                        },
                        {
                            name : 'Process',isBack : true,isTitle : false,
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                            ]
                        },
                        {
                            name : 'Orders',isBack : true,isTitle : false,
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickOrdersShortcut.bind(this)}
                            ]
                        },
                        {
                            name : 'OrderDetail',isBack : true,isTitle : false,
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                            ]
                        }
                    ]}
                    onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'1px',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} onActivePage={(e)=>{this.pageBar.activePage(e)}}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    🔖 {this.t("lblRef")}
                                                </label>
                                                <div className='row'>
                                                    <div className='col-4'>
                                                        <div style={{position: 'relative'}}>
                                                            <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '2px'}}
                                                            onChange={(async(e)=>
                                                            {
                                                                try 
                                                                {
                                                                    let tmpQuery = 
                                                                    {
                                                                        query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF `,
                                                                        param : ['REF:string|25'],
                                                                        value : [typeof e.component == 'undefined' ? e : this.txtRef.value]
                                                                    }

                                                                    let tmpData = await this.core.sql.execute(tmpQuery) 

                                                                    if(tmpData.result.recordset.length > 0)
                                                                    {
                                                                        this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
                                                                    }
                                                                }
                                                                catch (error) 
                                                                {
                                                                    console.log("Error: ", error);
                                                                }
                                                            }).bind(this)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='col-8'>
                                                        <div style={{position: 'relative'}}>
                                                            <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '2px'}}
                                                            button={[
                                                                {
                                                                    id:'01',
                                                                    icon:'more',
                                                                    onClick:async()=>
                                                                    {
                                                                        this.popDoc.show()
                                                                        this.popDoc.onClick = (data) =>
                                                                        {
                                                                            if(data.length > 0)
                                                                            {
                                                                                this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    id:'02',
                                                                    icon:'arrowdown',
                                                                    onClick:()=>
                                                                    {
                                                                        this.txtRefNo.value = Math.floor(Date.now() / 1000)
                                                                    }
                                                                }
                                                            ]}/>
                                                            {/*EVRAK SEÇİM */}
                                                            <NdPopGrid id={"popDoc"} parent={this} container={"#root"}
                                                            selection={{mode:"single"}}
                                                            visible={false}
                                                            position={{of:'#root'}} 
                                                            showTitle={true} 
                                                            showBorders={true}
                                                            width={'100%'}
                                                            height={'100%'}
                                                            title={this.t("popDoc.title")} 
                                                            data = 
                                                            {{
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : `SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 ORDER BY DOC_DATE DESC`
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            }}
                                                            >
                                                                <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                                <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                                <Column dataField="DOC_DATE_CONVERT" caption={this.t("popDoc.clmDate")} width={100}  />
                                                                <Column dataField="INPUT_NAME" caption={this.t("popDoc.clmInputName")} width={200}  />
                                                                <Column dataField="INPUT_CODE" caption={this.t("popDoc.clmInputCode")} width={150}  />
                                                            </NdPopGrid>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card modern-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    🏢 {this.t("lblDepot")}
                                                </label>
                                                <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '2px'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerCode")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}
                                            dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                            button={[
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:async()=>
                                                    {
                                                        this.popCustomer.show()
                                                        this.popCustomer.onClick = async(data) =>
                                                        { 
                                                            if(data.length > 0)
                                                            {
                                                                this.docObj.dt()[0].INPUT = data[0].GUID
                                                                this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                                this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                            
                                                                if(this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue() ==  true)
                                                                {
                                                                    this.txtRef.value = data[0].CODE;
                                                                    this.txtRef.props.onChange(data[0].CODE)
                                                                }

                                                                if(this.cmbDepot.value != '' && this.docLocked == false)
                                                                {
                                                                    this.frmdocOrders.option('disabled',false)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]}/>
                                            {/*CARI SECIMI POPUP */}
                                            <NdPopGrid id={"popCustomer"} parent={this} container={"#root"}
                                            selection={{mode:"single"}}
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'100%'}
                                            height={'100%'}
                                            title={this.lang.t("popCustomer.title")} 
                                            search={true}
                                            data = 
                                            {{
                                                source:
                                                {
                                                    select:
                                                    {
                                                        query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                                                        param : ['VAL:string|50']
                                                    },
                                                    sql:this.core.sql
                                                }
                                            }}
                                            >
                                                <Column dataField="CODE" caption={this.lang.t("popCustomer.clmCode")} width={150} />
                                                <Column dataField="TITLE" caption={this.lang.t("popCustomer.clmTitle")} width={500} defaultSortOrder="asc" />
                                                <Column dataField="TYPE_NAME" caption={this.lang.t("popCustomer.clmTypeName")} width={100} />
                                                <Column dataField="GENUS_NAME" caption={this.lang.t("popCustomer.clmGenusName")} width={100} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerName")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-6 pe-1'>
                                            <div className='card action-card' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(102,126,234,0.2)',border: 'none',height: '50px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.onClickOrdersShortcut.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-list"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnOrderSelect")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                        <div className='col-6 ps-1'>
                                            <div className='card action-card' style={{background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,180,219,0.2)',border: 'none',height: '50px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.onClickProcessShortcut.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-file-lines"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnProcessLines")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-6 pe-1'>
                                            <div className='card action-card' style={{background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,123,255,0.2)',border: 'none',height: '50px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-barcode"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnBarcodeEntry")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                        <div className='col-6 ps-1'>
                                            <div className='card action-card' style={{background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(40,167,69,0.2)',border: 'none',height: '50px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-success btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.orderComplated.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-check"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnOrderComplated")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <style>
                            {`
                                .modern-card 
                                {
                                    transition: all 0.3s ease;
                                    position: relative;
                                    overflow: hidden;
                                }
                                .action-card:hover 
                                {
                                    transform: translateY(-1px);
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                }
                            `}
                            </style>
                        </PageContent>
                        <PageContent id={"Entry"} onActive={()=>{this.txtBarcode.focus()}}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Sipariş Adı */}
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <NbLabel id="lblOrderName" parent={this} value={""}/>
                                        </div>
                                    </div>
                                    {/* Barkod Giriş Kartı */}
                                    <div className='card entry-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                        style={{borderRadius: '6px',border: '1px solid #ced4da',fontSize: '14px',padding: '6px',backgroundColor: '#ffffff'}}
                                        placeholder={this.t("lblBarcode")}
                                        onKeyUp={(async(e)=>
                                        {
                                            if(e.event.key == 'Enter')
                                            {
                                                await this.getItem(this.txtBarcode.value)
                                            }
                                        }).bind(this)}
                                        button={[
                                            {
                                                id:'02',
                                                icon:'photo',
                                                onClick:()=>
                                                {
                                                    if(typeof cordova == "undefined")
                                                    {
                                                        return;
                                                    }
                                                    cordova.plugins.barcodeScanner.scan(
                                                        async function (result) 
                                                        {
                                                            if(result.cancelled == false)
                                                            {
                                                                this.txtBarcode.value = result.text;
                                                                this.getItem(result.text)
                                                            }
                                                        }.bind(this),
                                                        function (error) 
                                                        {
                                                            
                                                        },
                                                        {
                                                            prompt : "Scan",
                                                            orientation : "portrait"
                                                        }
                                                    );
                                                }
                                            }
                                        ]}/>
                                        {/*STOK SEÇİM */}
                                        <NdPopGrid id={"popItem"} parent={this} container={"#root"}
                                        selection={{mode:"single"}}
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'100%'}
                                        height={'100%'}
                                        search={true}
                                        title={this.lang.t("popItem.title")} 
                                        data = 
                                        {{
                                            source:
                                            {
                                                select:
                                                {
                                                    query : `SELECT GUID,CODE,NAME,STATUS,(SELECT TOP 1 BARCODE FROM ITEM_BARCODE_VW_01 WHERE 
                                                            ITEM_BARCODE_VW_01.ITEM_GUID = ITEMS_VW_01.GUID AND STATUS=1 ) AS BARCODE FROM 
                                                            ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
                                                    param : ['VAL:string|50']
                                                },
                                                sql:this.core.sql
                                            }
                                        }}
                                        >
                                            <Column dataField="CODE" caption={this.lang.t("popItem.clmCode")} width={120} />
                                            <Column dataField="NAME" caption={this.lang.t("popItem.clmName")} width={100} />
                                        </NdPopGrid>
                                        {/* PARTILOT SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_partiLot"} parent={this} container={"#root"} 
                                        visible={false}
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={this.t("pg_partiLot.title")} 
                                        selection={{mode:"single"}}
                                        search={true}
                                        >
                                            <Column dataField="LOT_CODE" caption={this.t("pg_partiLot.clmLotCode")} width={'20%'} />
                                            <Column dataField="SKT" caption={this.t("pg_partiLot.clmSkt")} width={'50%'} dataType="date" format={"dd/MM/yyyy"} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </div>
                                    {/* Sipariş Listesi Butonu */}
                                    <div style={{display: 'flex',gap: '8px',marginBottom: '12px'}}>
                                        <div style={{flex: '1',background: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(111,66,193,0.2)'}}>
                                            <NbButton className="form-group btn btn-primary btn-block" style={{height: "45px",width: "100%",background: "transparent",border: "none",fontSize: "14px",fontWeight: "600",color: "white"}} 
                                            onClick={this.getOrderList.bind(this)}>
                                                📋 {this.t("lblOrderList")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    {/* Ürün Bilgileri */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',marginBottom: '8px'}}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                📦 {this.t("lblItemName")}
                                            </span>
                                            <span style={{fontSize: '13px', color: '#6c757d'}}>
                                                {this.t("lblDepotQuantity")}: <strong><NbLabel id="lblDepotQuantity" parent={this} value={0}/></strong>
                                            </span>
                                        </div>
                                        <div style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6',textAlign: 'center',minHeight: '30px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                                            <NbLabel id="lblItemName" parent={this} value={""} style={{fontSize: '14px', fontWeight: '500', color: '#495057'}}/>
                                        </div>
                                    </div>
                                    {/* Miktar ve Fiyat */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        {/* Birim */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblUnit")}</label>
                                            </div>
                                            <div className='col-8'>
                                                <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', fontSize: '13px'}}
                                                onValueChanged={(e)=>
                                                {
                                                    if(e.value != null && e.value != "")
                                                    {
                                                        let tmpFactor = this.unitDt.where({GUID:e.value});
                                                        if(tmpFactor.length > 0)
                                                        {
                                                            this.txtFactor.value = tmpFactor[0].FACTOR
                                                            this.txtFactor.props.onValueChanged()
                                                        }
                                                    }
                                                }}/>
                                            </div>
                                        </div>
                                        {/* Bekleyen Miktar */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblPendQuantity")}</label>
                                            </div>
                                            <div className='col-8'>
                                                <NdNumberBox id="txtPendQuantity" parent={this} simple={true} maxLength={32} readOnly={true} style={{borderRadius: '6px', border: '1px solid #ced4da', fontSize: '13px'}}/>
                                            </div>
                                        </div>
                                        {/* Miktar */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblQuantity")}</label>
                                            </div>
                                            <div className='col-3'>
                                                <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onValueChanged={this.calcEntry.bind(this)}
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', textAlign: 'center', fontSize: '13px'}}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                            <div className='col-2 d-flex align-items-center justify-content-center'>
                                                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#6c757d'}}>×</span>
                                            </div>
                                            <div className='col-3'>
                                                <NdNumberBox id="txtQuantity" parent={this} simple={true} maxLength={32}
                                                style={{borderRadius: '6px', border: '2px solid #007bff', textAlign: 'center', fontSize: '13px'}}
                                                onValueChanged={this.calcEntry.bind(this)}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                        </div>
                                        {/* Toplam Miktar */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblTotalQuantity")}</label>
                                            </div>
                                            <div className='col-8'>
                                                <NdNumberBox id="txttotalQuantity" parent={this} simple={true} maxLength={32} readOnly={true}
                                                style={{borderRadius: '6px', border: '2px solid #28a745', fontSize: '13px', fontWeight: 'bold'}}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ekleme Butonu */}
                                    <div style={{background: '#28a745',borderRadius: '8px',boxShadow: '0 2px 8px rgba(40,167,69,0.2)'}}>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" 
                                        style={{height: "45px",width: "100%",background: "transparent",border: "none",fontSize: "16px",fontWeight: "600",color: "white"}} 
                                        onClick={this.addItem.bind(this)}>
                                            ➕ {this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            {/* İNDİRİM POPUP */}
                            <NdPopUp parent={this} id={"popDiscount"} 
                            visible={false}                        
                            showCloseButton={false}
                            showTitle={true}
                            title={this.lang.t("popDiscount.title")}
                            container={"#root"} 
                            width={"250"}
                            height={"190"}
                            position={{of:"#root"}}
                            >
                                <div className='row p-1'>
                                    <div className='col-4 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDiscount.lblPopDisc")}</label>                                            
                                    </div>
                                    <div className='col-8'>
                                        <NdTextBox id="txtPopDisc" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={() =>
                                        {
                                            this.txtPopDiscRate.value = Number(this.txtQuantity.value * this.txtFactor.value).rate2Num(this.txtPopDisc.value)
                                        }}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDiscount.lblPopDiscRate")}</label>                                            
                                    </div>
                                    <div className='col-8'>
                                        <NdTextBox id="txtPopDiscRate" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={() =>
                                        {
                                            this.txtPopDisc.value = Number(this.txtQuantity.value * this.txtFactor.value).rateInc(this.txtPopDiscRate.value,4)
                                        }}/>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-12'>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                        onClick={(() =>
                                        {
                                            this.calcEntry()
                                            this.popDiscount.hide()
                                        }).bind(this)
                                        }>
                                            {this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </NdPopUp>
                        </PageContent>
                        <PageContent id={"Process"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                   {/* Grid Başlık Kartı */}
                                    <NdGrid parent={this} id={"grdList"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    headerFilter = {{visible:false}}
                                    height={'250px'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowRemoving={async (e)=>
                                    {
                                        if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                        {
                                            e.cancel = true
                                            
                                            this.alertContent.content = this.createModernAlert('error', this.t("msgAlert.DeleteError"), this.t("msgAlert.msgRowNotDelete"), 'fa-solid fa-trash')
                                            await dialog(this.alertContent);
                                            
                                            e.component.cancelEditData()
                                        }
                                    }}
                                    onRowRemoved={async (e)=>
                                    {
                                        if(this.docObj.docItems.dt().length == 0)
                                        {
                                            this.deleteAll()
                                        }
                                        else
                                        {
                                            await this.save()
                                        }
                                    }}
                                    onRowUpdating={async (e)=>
                                    {
                                        if(e.key.INVOICE_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                        {
                                            e.cancel = true

                                            this.alertContent.content = this.createModernAlert('error', this.t("msgAlert.UpdateError"), this.t("msgAlert.msgRowNotUpdate"), 'fa-solid fa-edit')
                                            await dialog(this.alertContent);
                                            
                                            e.component.cancelEditData()
                                        }
                                    }}
                                    onRowUpdated={async(e)=>
                                    {
                                        if(typeof e.data.QUANTITY != 'undefined')
                                        {
                                            e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                            await this.save()
                                        }

                                        if(typeof e.data.PRICE != 'undefined')
                                        {
                                            e.key.SUB_PRICE = e.data.PRICE / e.key.SUB_FACTOR
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
                                            this.alertContent.content = this.createModernAlert('warning', this.t("msgAlert.DiscountError"), this.t("msgAlert.msgDiscount"), 'fa-solid fa-percent')
                                            await dialog(this.alertContent);
                                            
                                            e.key.DISCOUNT = 0 
                                            e.key.DISCOUNT_1 = 0
                                            e.key.DISCOUNT_2 = 0
                                            e.key.DISCOUNT_3 = 0
                                            e.key.DISCOUNT_RATE = 0
                                            return
                                        }
    
                                        e.key.VAT = parseFloat(((((e.key.PRICE * e.key.QUANTITY) - (parseFloat(e.key.DISCOUNT) + parseFloat(e.key.DOC_DISCOUNT))) * (e.key.VAT_RATE) / 100))).round(6);
                                        e.key.AMOUNT = parseFloat((e.key.PRICE * e.key.QUANTITY).toFixed(3)).round(2)
                                        e.key.TOTALHT = Number((parseFloat((e.key.PRICE * e.key.QUANTITY)) - (parseFloat(e.key.DISCOUNT)))).round(2)
                                        e.key.TOTAL = Number(((e.key.TOTALHT - e.key.DOC_DISCOUNT) + e.key.VAT)).round(2)

                                        if(e.key.DISCOUNT > 0)
                                        {
                                            e.key.DISCOUNT_RATE = parseFloat((100 - ((((e.key.PRICE * e.key.QUANTITY) - e.key.DISCOUNT) / (e.key.PRICE * e.key.QUANTITY)) * 100)).toFixed(4))
                                        }
                                        await this.save()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="standart" />
                                        <Paging defaultPageSize={10} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdList.clmItemName")} width={150} />
                                        <Column dataField="LOT_CODE" caption={this.t("grdList.clmLotCode")} width={150} />
                                        <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} dataType={'number'} width={40}/>
                                        <Column dataField="PRICE" caption={this.t("grdList.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={60}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdList.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdList.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdList.clmDiscountRate")} dataType={'number'} width={80}/>
                                        <Column dataField="VAT" caption={this.t("grdList.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={80}/>
                                        <Column dataField="TOTAL" caption={this.t("grdList.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={100}/>
                                    </NdGrid>
                                    {/* Modern Tutar Kartları */}
                                    <div className='card' style={{background: '#ffffff',borderRadius: '12px',boxShadow: '0 4px 16px rgba(0,0,0,0.08)',border: '1px solid #e9ecef',padding: '2px'}}>
                                        {/* Ara Toplam */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#f8f9fa',borderRadius: '8px',marginBottom: '2px',border: '1px solid #dee2e6'}}>
                                            <span style={{fontSize: '13px',fontWeight: '600',color: '#495057',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                💵 {this.t("lblAmount")}
                                            </span>
                                            <div style={{minWidth:'100px'}}>
                                                <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32} 
                                                style={{textAlign: 'right',fontWeight: '600',backgroundColor: 'transparent',border: 'none'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}/>
                                            </div>
                                        </div>
                                        {/* İndirim */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#fff3cd',borderRadius: '8px',marginBottom: '2px',border: '1px solid #ffeaa7'}}>
                                            <span style={{fontSize: '13px',fontWeight: '600',color: '#856404',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                🏷️ {this.t("lblDiscount")}
                                            </span>
                                            <div style={{minWidth:'100px'}}>
                                                <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{textAlign: 'right',fontWeight: '600',backgroundColor: 'transparent',border: 'none',color: '#856404'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}/>
                                            </div>
                                        </div>
                                        {/* Evrak İndirimi */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#fdeaa7',borderRadius: '8px',marginBottom: '2px',border: '1px solid #fdd835'}}>
                                            <span style={{fontSize: '13px',fontWeight: '600',color: '#7d4e00',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                📄 {this.t("lblDocDiscount")}
                                            </span>
                                            <div style={{minWidth:'100px'}}>
                                                <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{textAlign: 'right',fontWeight: '600',backgroundColor: 'transparent',border: 'none',color: '#7d4e00'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
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
                                                        }
                                                    ]
                                                }/>
                                            </div>
                                        </div>
                                        {/* Ara Toplam HT */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#e3f2fd',borderRadius: '8px',marginBottom: '2px',border: '1px solid #bbdefb'}}>
                                            <span style={{fontSize: '13px',fontWeight: '600',color: '#0d47a1',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                📊 {this.t("lblTotalHt")}
                                            </span>
                                            <div style={{minWidth:'100px'}}>
                                                <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{textAlign: 'right',fontWeight: '600',backgroundColor: 'transparent',border: 'none',color: '#0d47a1'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}/>
                                            </div>
                                        </div>
                                        {/* KDV */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#f3e5f5',borderRadius: '8px',marginBottom: '2px',border: '1px solid #e1bee7'}}>
                                            <span style={{fontSize: '13px',fontWeight: '600',color: '#4a148c',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                🏛️ {this.t("lblVat")}
                                            </span>
                                            <div style={{minWidth:'100px'}}>
                                                <NdTextBox id="txtDocVat" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{textAlign: 'right',fontWeight: '600',backgroundColor: 'transparent',border: 'none',color: '#4a148c'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"VAT"}}/>
                                            </div>
                                        </div>
                                        {/* Genel Toplam */}
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',padding: '2px',backgroundColor: '#e8f5e8',borderRadius: '8px',marginBottom: '2px',border: '2px solid #4caf50',marginTop: '2px'}}>
                                            <span style={{fontSize: '15px',fontWeight: '700',color: '#1b5e20',display: 'flex',alignItems: 'center',gap: '2px'}}>
                                                💰 {this.t("lblGenAmount")}
                                            </span>
                                            <div style={{minWidth:'120px'}}>
                                                <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{textAlign: 'right',fontWeight: '700',fontSize: '16px',backgroundColor: 'transparent',border: 'none',color: '#1b5e20'}}
                                                dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}/>
                                            </div>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                            {/*Evrak İndirim PopUp */}
                            <NdPopUp parent={this} id={"popDocDiscount"} 
                            visible={false}                        
                            showCloseButton={false}
                            showTitle={true}
                            title={this.t("popDocDiscount.title")}
                            container={"#root"} 
                            width={"300"}
                            height={"400"}
                            position={{of:"#root"}}
                            >
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent1.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice1.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if(this.txtDocDiscountPercent2.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice2.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent2.value,2)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice2.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent2.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice2.value)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Percent3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent3.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice3.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent3.value,2)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("popDocDiscount.Price3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice3.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent3.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice3.value)
                                        }).bind(this)}
                                        onEnterKey={{}}/>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-12'>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                        onClick={(async () =>
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
                                                    tmpDocData.VAT = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) * (tmpDocData.VAT_RATE / 100)).toFixed(6))
                                                }
                                                tmpDocData.TOTAL = parseFloat(((tmpDocData.TOTALHT - tmpDocData.DOC_DISCOUNT) + tmpDocData.VAT)).round(2)
                                                tmpDocData.DISCOUNT_RATE = Number((tmpDocData.PRICE * tmpDocData.QUANTITY)).rate2Num((tmpDocData.DISCOUNT_1 + tmpDocData.DISCOUNT_2 + tmpDocData.DISCOUNT_3),2)
                                            }

                                            await this.save()
                                            this.popDocDiscount.hide()
                                        }).bind(this)}>
                                            {this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </NdPopUp> 
                        </PageContent>
                        <PageContent id={"Orders"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Filtre Kartı */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div style={{marginBottom: '12px',fontSize: '13px',fontWeight: '600',color: '#495057'}}>
                                            🔍 {this.t("lblOrderFilter")}
                                        </div>
                                        {/* Başlangıç Tarihi */}
                                        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between',marginBottom: '8px'}}>
                                            <span style={{fontSize:'13px',fontWeight:'600',color:'#6c757d',minWidth:'80px'}}>
                                                📅 {this.t("lblStartDate")}
                                            </span>
                                            <div style={{flex:'1',marginLeft:'8px'}}>
                                                <NdDatePicker simple={true} parent={this} id={"dtFirstDate"} pickerType={"rollers"}
                                                style={{fontSize: '13px',borderRadius: '4px',border: '1px solid #ced4da'}}/>
                                            </div>
                                        </div>
                                        {/* Bitiş Tarihi */}
                                        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between',marginBottom: '8px'}}>
                                            <span style={{fontSize:'13px',fontWeight:'600',color:'#6c757d',minWidth:'80px'}}>
                                                📅 {this.t("lblEndDate")}
                                            </span>
                                            <div style={{flex:'1',marginLeft:'8px'}}>
                                                <NdDatePicker simple={true} parent={this} id={"dtLastDate"} pickerType={"rollers"}
                                                style={{fontSize: '13px',borderRadius: '4px',border: '1px solid #ced4da'}}/>
                                            </div>
                                        </div>
                                        {/* Sipariş Ref */}
                                        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between'}}>
                                            <span style={{fontSize:'13px',fontWeight:'600',color:'#6c757d',minWidth:'80px'}}>
                                                🔖 {this.t("lblOrderRef")}
                                            </span>
                                            <div style={{flex:'1',marginLeft:'8px'}}>
                                                <NdTextBox simple={true} parent={this} id="txtOrderRef" style={{fontSize: '13px',borderRadius: '4px',border: '1px solid #ced4da'}}
                                                onKeyUp={(async(e)=>
                                                {
                                                    if(e.event.key == 'Enter')
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query : `SELECT GUID FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 AND REF +'-'+ CONVERT(NVARCHAR,REF_NO) = @REF `,
                                                            param : ['REF:string|100'],
                                                            value : [this.txtOrderRef.value]
                                                        }
                                            
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 

                                                        if(tmpData.result.recordset.length > 0)
                                                        {
                                                            this.ordersSelect(tmpData.result.recordset[0].GUID)
                                                        }
                                                        else
                                                        {
                                                            document.getElementById("Sound").play(); 
                                                            this.alertContent.content = this.createModernAlert('error', this.t("msgAlert.OrderNotFound"), this.t("msgAlert.msgOrderNotFound"), 'fa-solid fa-search')
                                                            await dialog(this.alertContent);
                                                        }
                                                    }
                                                }).bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Aksiyon Butonları */}
                                    <div style={{display:'flex',gap:'4px',marginBottom:'6px'}}>
                                        <div style={{flex: '1',background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,123,255,0.2)'}}>
                                            <NbButton className="form-group btn btn-primary btn-block" style={{height: "45px",width: "100%",background: "transparent",border: "none",fontSize: "14px",fontWeight: "600",color: "white"}} 
                                            onClick={this.getOrders.bind(this)}>
                                                📋 {this.t("lblList")}
                                            </NbButton>
                                        </div>
                                        <div style={{flex: '1',background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(40,167,69,0.2)'}}>
                                            <NbButton className="form-group btn btn-success btn-block" 
                                            style={{height: "45px",width: "100%",background: "transparent",border: "none",fontSize: "14px",fontWeight: "600",color: "white"}} 
                                            onClick={this.ordersSelect.bind(this)}>
                                                ✅ {this.t("lblSelect")}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOrderList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            selection={{mode:"single"}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="REF" caption={this.t("grdList.clmRef")} width={150} />
                                                <Column dataField="REF_NO" caption={this.t("grdList.clmRefNo")} dataType={'number'} width={80}/>
                                                <Column dataField="DOC_DATE" caption={this.t("grdList.clmDate")} allowEditing={false} dataType={"datetime"} format={"dd-MM-yyyy"} defaultSortOrder="desc"/>
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdList.clmCustomerName")} width={150}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"OrderDetail"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Seçim Butonu */}
                                    <div style={{background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',borderRadius: '8px',boxShadow: '0 2px 8px rgba(23,162,184,0.3)',marginBottom: '12px'}}>
                                        <NbButton className="form-group btn btn-info btn-block" style={{height: "50px",width: "100%",background: "transparent",border: "none",fontSize: "16px",fontWeight: "600",color: "white"}} 
                                        onClick={(async () =>
                                        {   
                                            this.onClickBarcodeShortcut()
                                            await this.getItem(this.grdOrderDetail.getSelectedData()[0].ITEM_CODE)
                                        }).bind(this)}>
                                            🎯 {this.t("lblSelect")}
                                        </NbButton>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOrderDetail"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            selection={{mode:"single"}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onRowPrepared={(e) =>
                                            {
                                                if(e.rowType == 'data' && e.data.PEND_QUANTITY == '0')
                                                {
                                                    e.rowElement.style.backgroundColor ="green"
                                                    e.rowElement.style.color = "white"
                                                }
                                            }}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                                <Column dataField="ITEM_NAME" caption={this.t("grdOrderDetail.clmItemName")} width={250} />
                                                <Column dataField="PEND_QUANTITY" caption={this.t("grdOrderDetail.clmQuantity")} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_NAME}} dataType={'number'} width={160}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}