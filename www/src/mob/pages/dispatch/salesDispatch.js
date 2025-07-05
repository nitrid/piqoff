import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import {docCls,docExtraCls} from '../../../core/cls/doc.js'
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdDatePicker from '../../../core/react/devex/datepicker';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdNumberBox from '../../../core/react/devex/numberbox';
import NdPopUp from '../../../core/react/devex/popup';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class salesDispatch extends React.PureComponent
{
    // Helper function to create styled dialog content
    createStyledDialog(type, title, message, iconClass) {
        const typeStyles = {
            error: {
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                contentBg: '#fff5f5',
                contentBorder: '#fed7d7'
            },
            warning: {
                background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                contentBg: '#fff8e1',
                contentBorder: '#ffecb3'
            },
            info: {
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                contentBg: '#e7f3ff',
                contentBorder: '#b3d9ff'
            },
            success: {
                background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                contentBg: '#d4edda',
                contentBorder: '#c3e6cb'
            }
        };

        const style = typeStyles[type] || typeStyles.info;

        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        background: style.background,
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                    }}>
                        <i style={{color: '#ffffff', fontSize: '20px'}} className={iconClass}></i>
                    </div>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#2c3e50'
                    }}>
                        {title}
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    color: '#495057',
                    lineHeight: '1.5',
                    padding: '12px',
                    background: style.contentBg,
                    borderRadius: '8px',
                    border: `1px solid ${style.contentBorder}`
                }}>
                    {message}
                </div>
            </div>
        );
    }

    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.itemDt = new datatable();
        this.unitDt = new datatable();
        this.priceDt = new datatable();        
        this.orderDt = new datatable();

        this.itemDt.selectCmd = 
        {
            query :  "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE) OR (@CODE = '') ORDER BY LOT_CODE ASC",
            param : ['CODE:string|25'],
        }
        this.unitDt.selectCmd = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1 ORDER BY TYPE ASC",
            param : ['ITEM_GUID:string|50'],
        }
        this.priceDt.selectCmd = 
        {
            query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,'00000000-0000-0000-0000-000000000000',1,0,0) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
        }

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'200px',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()

        this.dtDocDate.value = moment(new Date())

        await this.cmbDepot.dataRefresh({source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}});

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

        console.log(this.grdList)
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
        this.orderDt.clear();

        this.orderDt.push({UNIT:"",FACTOR:0,QUANTITY:0,PRICE:0,AMOUNT:0,DISCOUNT:0,DISCOUNT_RATE:0,VAT:0,SUM_AMOUNT:0})

        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.cmbUnit.setData([])
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
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode]
            
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME

                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh()
                this.cmbUnit.setData(this.unitDt)

                if(this.unitDt.length > 0)
                {
                    this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                    this.txtFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                    this.txtFactor.props.onValueChanged()
                }

                this.txtBarcode.value = ""
                this.txtQuantity.focus();
                this.txtQuantity.value = 1
                this.calcEntry()
            }
            else
            {                               
                document.getElementById("Sound").play(); 
                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeNotFound")}</div>)
                await dialog(this.alertContent);
                this.txtBarcode.value = ""
                this.txtBarcode.focus();
            }
            resolve();
        });
    }
    getPrice(pGuid,pQuantity,pCustomer)
    {
        return new Promise(async resolve => 
        {
            this.priceDt.selectCmd.value = [pGuid,pQuantity,(pCustomer == '' ? '00000000-0000-0000-0000-000000000000' : pCustomer)]
            await this.priceDt.refresh()
            if(this.priceDt.length > 0)
            {
                resolve(this.priceDt[0].PRICE)
            }
            resolve(0)
        });
    }
    async calcEntry() 
    {
        // Vérifie si l'une des propriétés a une valeur différente de zéro
        if (this.txtFactor.value !== 0 || this.txtQuantity.value !== 0 || this.txtPrice.value !== 0) {
            
            // Calcule la quantité temporaire en multipliant txtFactor par txtQuantity
            let tmpQuantity = this.txtFactor.value * this.txtQuantity.value;
     
            // Récupère la limite de quantité depuis les paramètres système
            let prmLimitQuantity = this.sysParam.filter({ USERS: this.user.CODE, ID: 'limitQuantity' }).getValue()?.value;
    
            // Vérifie si la quantité temporaire dépasse la limite définie
            if (tmpQuantity > prmLimitQuantity) {
                // Affiche un message d'alerte et limite la valeur de txtQuantity à la limite définie
                this.alertContent.content = (
                    <div style={{ textAlign: "center", fontSize: "20px" }}>
                        {this.t("msgAlert.msgLimitQuantityCheck")}
                    </div>
                );
                await dialog(this.alertContent);
                this.txtQuantity.value = prmLimitQuantity;
                return; // Sort de la fonction si la quantité est limitée
            }
    
            // Si des arguments sont passés ou si aucun argument n'est passé, met à jour la valeur de txtPrice en appelant une fonction asynchrone getPrice
            if ((arguments.length > 0 && arguments[0]) || arguments.length === 0) {
                this.txtPrice.value = Number(
                    (await this.getPrice(this.itemDt[0].GUID, tmpQuantity, this.docObj.dt()[0].OUTPUT))
                ).round(2);
            }

            console.log('txtPrice',this.txtPrice.value)
    
            // Calcule les autres valeurs en fonction de txtPrice et de la quantité temporaire
            this.txtEntryAmount.value = Number(this.txtPrice.value * tmpQuantity).round(2);
            console.log('txtEntryAmount',this.txtEntryAmount.value)
            this.txtEntryVat.value = Number(this.txtEntryAmount.value - this.txtEntryDiscount.value).rateInc(this.itemDt[0].VAT, 2);
            this.txtEntrySumAmount.value = Number(this.txtEntryAmount.value - this.txtEntryDiscount.value).rateExc(this.itemDt[0].VAT, 2);
        }
    }
    async addItem()
    {
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0 || this.txtQuantity.value > 15000000 || this.txtPrice.value > 15000000)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgQuantityCheck")}</div>)
            await dialog(this.alertContent);
            return
        }

        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value

        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                let tmpQuantity = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
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
                            id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
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
        tmpDocItems.UNIT = this.orderDt[0].UNIT
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.DISCOUNT = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_1 = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_RATE = this.orderDt[0].DISCOUNT_RATE
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT
        tmpDocItems.PRICE = this.orderDt[0].PRICE
        tmpDocItems.VAT = this.orderDt[0].VAT
        tmpDocItems.AMOUNT = this.orderDt[0].AMOUNT
        tmpDocItems.TOTALHT = Number(this.orderDt[0].AMOUNT - this.orderDt[0].DISCOUNT).round(2)
        tmpDocItems.TOTAL = this.orderDt[0].SUM_AMOUNT
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
                            query : "SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE UPPER(LOT_CODE) LIKE UPPER(@VAL) AND ITEM = '" + tmpDocItems.ITEM + "'",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                }
                await this.pg_partiLot.setSource(tmpSource)
                this.pg_partiLot.onClick = (data) =>
                {
                    tmpDocItems.PARTILOT_GUID = data[0].GUID  
                    tmpDocItems.LOT_CODE = data[0].LOT_CODE
                    this.docObj.docItems.addEmpty(tmpDocItems)
                }
                await this.pg_partiLot.show()
            }
            else
            {
                this.docObj.docItems.addEmpty(tmpDocItems)
            }
        }
        else
        {
            this.docObj.docItems.addEmpty(tmpDocItems)
        }
        this.clearEntry()

        await this.save()
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
            
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'after'}],
            }
            
            if((await this.docObj.save()) == 0)
            {                                                    
               
            }
            else
            {
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("msgSaveResult.msgFailed")}</div>)
                await dialog(tmpConfObj1);
            }
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
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDepot")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(this.docObj.dt()[0].INPUT == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgCustomer")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        console.log(this.docObj.dt("DOC"))
        if(this.docObj.dt("DOC_ITEMS").length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        // Calculate totals for display in Process page
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

        this.pageView.activePage('Process')
    }
    render()
    {
        return(
            <div>
                <div>
                <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.irs_02")} content=
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
                    }
                ]}
                onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '6px'
                                    }}>
                                        
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    🔖 {this.t("lblRef")}
                                                </label>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <div style={{position: 'relative'}}>
                                                    <NdTextBox id="txtRef" parent={this} simple={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                        style={{
                                                            borderRadius: '4px',
                                                            border: '1px solid #ced4da',
                                                            fontSize: '12px',
                                                            padding: '4px'
                                                        }}
                                                    onChange={(async(e)=>
                                                    {
                                                        try 
                                                        {
                                                            let tmpQuery = 
                                                            {
                                                                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 40 AND REF = @REF ",
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
                                                        style={{
                                                            borderRadius: '4px',
                                                            border: '1px solid #ced4da',
                                                            fontSize: '12px',
                                                            padding: '2px'
                                                        }}
                                                    button=
                                                    {
                                                        [
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
                                                        ]
                                                    }/>
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
                                                                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 40 AND REBATE = 0 ORDER BY DOC_DATE DESC"
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
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '6px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    🏢 {this.t("lblDepot")}
                                                </label>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px'
                                                }}
                                            dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}/>
                                        </div>
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '6px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    👤 {this.t("lblCustomerCode")}
                                                </label>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '4px'
                                                }}
                                            dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}} 
                                            button=
                                            {
                                                [
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
                                                ]
                                            }/>
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
                                                        query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
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
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '6px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    👥 {this.t("lblCustomerName")}
                                                </label>
                                                <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '4px'
                                                }}/>
                                    </div>
                                            
                                            <div className='form-group mb-0' style={{
                                                background: '#f8f9fa',
                                                padding: '6px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    📅 {this.t("lblDate")}
                                                </label>
                                                <NdDatePicker simple={true} parent={this} id={"dtDocDate"} pickerType={"rollers"} dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px'
                                                }}/>
                                        </div>
                                    </div>
                                        </div>
                                    
                                    <div className='row pb-1'>
                                        <div className='col-6 pe-1'>
                                            <div className='card action-card' style={{
                                                background: '#007bff',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                                                border: 'none',
                                                height: '50px',
                                                transition: 'all 0.3s ease'
                                            }}>
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
                                            <div className='card action-card' style={{
                                                background: '#28a745',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(40,167,69,0.2)',
                                                border: 'none',
                                                height: '50px',
                                                transition: 'all 0.3s ease'
                                            }}>
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
                            </div>
                            </div>

                        </PageContent>
                        <PageContent id={"Entry"} onActive={()=>
                        {
                            this.txtBarcode.focus();
                        }}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Barkod Giriş Kartı */}
                                    <div className='card entry-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '6px'
                                    }}>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                        style={{
                                            borderRadius: '6px',
                                            border: '1px solid #ced4da',
                                            fontSize: '14px',
                                            padding: '6px',
                                            backgroundColor: '#ffffff'
                                        }}
                                            placeholder={this.t("lblBarcode")}
                                            onKeyUp={(async(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    await this.getItem(this.txtBarcode.value)

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
                                                            this.popItem.show()
                                                            this.popItem.onClick = (data) =>
                                                            {
                                                                if(data.length > 0)
                                                                {
                                                                    this.getItem( data[0].CODE)
                                                                }
                                                            }
                                                        }
                                                    },
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
                                                ]
                                            }>
                                            </NdTextBox>
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
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'tst',
                                                        icon:'more',
                                                        onClick:()=>
                                                        {

                                                        }
                                                    }
                                                ]
                                            }
                                            >
                                            <Column dataField="LOT_CODE" caption={this.t("pg_partiLot.clmLotCode")} width={'20%'} />
                                            <Column dataField="SKT" caption={this.t("pg_partiLot.clmSkt")} width={'50%'} dataType="date" format={"dd/MM/yyyy"} defaultSortOrder="asc" />
                                            </NdPopGrid>
                                        </div>

                                    {/* Ürün Bilgileri */}
                                    <div className='card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '6px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                📦 {this.t("lblItemName")}
                                            </span>
                                            <span style={{fontSize: '13px', color: '#6c757d'}}>
                                                {this.t("lblDepotQuantity")}: <strong><NbLabel id="lblDepotQuantity" parent={this} value={0}/></strong>
                                            </span>
                                    </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '6px',
                                            borderRadius: '6px',
                                            border: '1px solid #dee2e6',
                                            textAlign: 'center',
                                            minHeight: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <NbLabel id="lblItemName" parent={this} value={""} 
                                            style={{fontSize: '14px', fontWeight: '500', color: '#495057'}}/>
                                        </div>
                                    </div>

                                    {/* Miktar ve Fiyat */}
                                    <div className='card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '6px'
                                    }}>
                                        {/* Birim */}
                                        <div className='row mb-2'>
                                        <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblUnit")}</label>
                                            </div>
                                            <div className='col-8'>
                                            <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', fontSize: '13px'}}
                                             dt={{data:this.orderDt,field:"UNIT"}}
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
                                        
                                        {/* Miktar */}
                                        <div className='row mb-2'>
                                        <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblQuantity")}</label>
                                            </div>
                                            <div className='col-3'>
                                            <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onValueChanged={this.calcEntry.bind(this)} dt={{data:this.orderDt,field:"FACTOR"}}
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
                                                dt={{data:this.orderDt,field:"QUANTITY"}}
                                            onEnterKey={this.addItem.bind(this)}/>
                                        </div>
                                    </div>
                                        
                                        {/* Fiyat */}
                                        <div className='row mb-2'>
                                        <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblPrice")}</label>
                                            </div>
                                            <div className='col-8'>
                                            <NdNumberBox id="txtPrice" parent={this} simple={true} maxLength={32} onValueChanged={this.calcEntry.bind(this,false)} dt={{data:this.orderDt,field:"PRICE"}} 
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', fontSize: '13px'}}
                                            onEnterKey={this.addItem.bind(this)}/>
                                        </div>
                                    </div>
                                        
                                        {/* Hesaplanan Değerler */}
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #dee2e6'
                                        }}>
                                            <div className='row mb-1'>
                                                <div className='col-6'>
                                                    <span style={{fontSize: '12px', color: '#6c757d'}}>{this.t("lblAmount")}:</span>
                                        </div>
                                                <div className='col-6'>
                                                    <NdTextBox id="txtEntryAmount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"AMOUNT"}}
                                                    style={{borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#ffffff', fontSize: '12px', padding: '4px'}}/>
                                        </div>
                                    </div>
                                            <div className='row mb-1'>
                                                <div className='col-6'>
                                                    <span style={{fontSize: '12px', color: '#6c757d'}}>{this.t("lblDiscount")}:</span>
                                        </div>
                                                <div className='col-6'>
                                                    <NdTextBox id="txtEntryDiscount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"DISCOUNT"}}
                                                    style={{borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#ffffff', fontSize: '12px', padding: '4px'}}/>
                                        </div>
                                    </div>
                                            <div className='row mb-1'>
                                                <div className='col-6'>
                                                    <span style={{fontSize: '12px', color: '#6c757d'}}>{this.t("lblVat")}:</span>
                                        </div>
                                                <div className='col-6'>
                                                    <NdTextBox id="txtEntryVat" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"VAT"}}
                                                    style={{borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#ffffff', fontSize: '12px', padding: '4px'}}/>
                                        </div>
                                    </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <span style={{fontSize: '13px', color: '#495057', fontWeight: 'bold'}}>{this.t("lblSumAmount")}:</span>
                                        </div>
                                                <div className='col-6'>
                                                    <NdTextBox id="txtEntrySumAmount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"SUM_AMOUNT"}}
                                                    style={{borderRadius: '4px', border: '2px solid #28a745', backgroundColor: '#ffffff', fontSize: '13px', padding: '4px', fontWeight: 'bold'}}/>
                                        </div>
                                    </div>
                                        </div>
                                    </div>

                                    {/* Ekleme Butonu */}
                                    <div style={{
                                        background: '#28a745',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(40,167,69,0.2)'
                                    }}>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{
                                            height: "35px",
                                            width: "100%",
                                            background: "transparent",
                                            border: "none",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "white"
                                        }} 
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
                                            this.txtPopDiscRate.value = Number(this.txtPrice.value * this.txtQuantity.value).rate2Num(this.txtPopDisc.value)
                                        }} 
                                        dt={{data:this.orderDt,field:"DISCOUNT"}}/>
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
                                            this.txtPopDisc.value = Number(this.txtPrice.value * this.txtQuantity.value).rateInc(this.txtPopDiscRate.value,4)
                                        }}
                                        dt={{data:this.orderDt,field:"DISCOUNT_RATE"}}/>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-12'>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={(() =>
                                            {
                                                
                                                this.calcEntry(false)
                                                this.popDiscount.hide()
                                            }).bind(this)
                                        }>{this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </NdPopUp>
                        </PageContent>
                        <PageContent id={"Process"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Grid Container */}
                                    <div className='card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '2px'
                                    }}>
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'250'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onRowRemoving={async (e)=>
                                            {
                                                if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                                {
                                                    e.cancel = true
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotDelete")}</div>)
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
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotUpdate")}</div>)
                                                    await dialog(this.alertContent);
                                                    e.component.cancelEditData()
                                                }
                                            }}
                                            onRowUpdated={async(e)=>
                                            {
                                                if(typeof e.data.QUANTITY != 'undefined')
                                                {
                                                    e.key.SUB_QUANTITY =  e.data.QUANTITY * e.key.SUB_FACTOR
                                                    e.key.PRICE = Number((await this.getPrice(e.key.ITEM,e.data.QUANTITY,this.docObj.dt()[0].INPUT))).round(2)
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
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDiscount")}</div>)
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
                                                <Scrolling mode="standard" />
                                                <Paging defaultPageSize={10} />
                                                {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
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
                                        </div>
                                    {/* Summary Section */}
                                    <div className='card' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '2px'
                                    }}>
                                        <div className='summary-container' style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '2px'
                                        }}>
                                            {/* Amount Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 4px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    margin: '0'
                                                }}>
                                                    📊 {this.t("lblAmount")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '1px solid #ced4da',
                                                        fontSize: '12px',
                                                        padding: '2px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right'
                                                    }}/>
                                    </div>
                                        </div>

                                            {/* Discount Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 4px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    margin: '0'
                                                }}>
                                                    🏷️ {this.t("lblDiscount")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '1px solid #ced4da',
                                                        fontSize: '12px',
                                                        padding: '2px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right'
                                                    }}/>
                                        </div>
                                    </div>

                                            {/* Doc Discount Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 4px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    margin: '0'
                                                }}>
                                                    📋 {this.t("lblDocDiscount")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                            <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DOC_DISCOUNT"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '1px solid #ced4da',
                                                        fontSize: '12px',
                                                        padding: '2px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right'
                                                    }}
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

                                            {/* Total HT Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 4px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    margin: '0'
                                                }}>
                                                    💰 {this.t("lblTotalHt")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"TOTALHT"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '1px solid #ced4da',
                                                        fontSize: '12px',
                                                        padding: '2px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right'
                                                    }}/>
                                        </div>
                                        </div>

                                            {/* VAT Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '2px 4px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    margin: '0'
                                                }}>
                                                    📈 {this.t("lblVat")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                                    <NdTextBox id="txtDocVat" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '1px solid #ced4da',
                                                        fontSize: '12px',
                                                        padding: '2px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right'
                                                    }}/>
                                    </div>
                                        </div>

                                            {/* Total Row */}
                                            <div className='summary-row' style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '4px 6px',
                                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                borderRadius: '6px',
                                                border: '2px solid #28a745',
                                                boxShadow: '0 2px 8px rgba(40,167,69,0.2)'
                                            }}>
                                                <label style={{
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    color: '#ffffff',
                                                    margin: '0'
                                                }}>
                                                    💎 {this.t("lblGenAmount")}
                                                </label>
                                                <div style={{width: '120px'}}>
                                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                                    style={{
                                                        borderRadius: '4px',
                                                        border: '2px solid #ffffff',
                                                        fontSize: '14px',
                                                        padding: '1px',
                                                        backgroundColor: '#ffffff',
                                                        textAlign: 'right',
                                                        fontWeight: 'bold',
                                                        color: '#28a745'
                                                    }}/>
                                        </div>
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
                            title={this.lang.t("popDocDiscount.title")}
                            container={"#root"} 
                            width={"300"}
                            height={"400"}
                            position={{of:"#root"}}
                            >
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Percent1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent1.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPercent.title"), this.t("msgDiscountPercent.msg"), 'fa-solid fa-percent')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent1.value = 0;
                                                this.txtDocDiscountPrice1.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice1.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent1.value,2)
                                        }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Price1")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice1" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice1.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPrice.title"), this.t("msgDiscountPrice.msg"), 'fa-solid fa-dollar-sign')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent1.value = 0;
                                                this.txtDocDiscountPrice1.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent1.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice1.value)
                                        }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Percent2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if(this.txtDocDiscountPercent2.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPercent.title"), this.t("msgDiscountPercent.msg"), 'fa-solid fa-percent')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice2.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent2.value,2)
                                        }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Price2")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice2" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice2.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPrice.title"), this.t("msgDiscountPrice.msg"), 'fa-solid fa-dollar-sign')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent2.value = 0;
                                                this.txtDocDiscountPrice2.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent2.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice2.value)
                                        }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Percent3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPercent3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPercent3.value > 100)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPercent.title"), this.t("msgDiscountPercent.msg"), 'fa-solid fa-percent')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }

                                            this.txtDocDiscountPrice3.value =  Number(this.docObj.dt()[0].SUBTOTAL).rateInc(this.txtDocDiscountPercent3.value,2)
                                        }).bind(this)}/>
                                    </div>
                                </div>
                                <div className='row p-1'>
                                    <div className='col-4 offset-2 d-flex align-items-center justify-content-end'>
                                        <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.lang.t("popDocDiscount.Price3")}</label>                                            
                                    </div>
                                    <div className='col-6'>
                                        <NdTextBox id="txtDocDiscountPrice3" parent={this} simple={true} maxLength={32} 
                                        onValueChanged={(async()=>
                                        {
                                            if( this.txtDocDiscountPrice3.value > this.docObj.dt()[0].SUBTOTAL)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'450px',height:'280px',
                                                    button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                    content: this.createStyledDialog('error', this.t("msgDiscountPrice.title"), this.t("msgDiscountPrice.msg"), 'fa-solid fa-dollar-sign')
                                                }
                                    
                                                await dialog(tmpConfObj);
                                                this.txtDocDiscountPercent3.value = 0;
                                                this.txtDocDiscountPrice3.value = 0;
                                                return
                                            }
                                            
                                            this.txtDocDiscountPercent3.value = Number(this.docObj.dt()[0].SUBTOTAL).rate2Num(this.txtDocDiscountPrice3.value)
                                        }).bind(this)}/>
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
                                            }).bind(this)
                                        }>{this.t("lblAdd")}
                                        </NbButton>
                                    </div>
                                </div>
                            </NdPopUp> 
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}