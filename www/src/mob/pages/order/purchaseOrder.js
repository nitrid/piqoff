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
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class purchaseOrder extends React.PureComponent
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
        this.orderDt = new datatable();
        
        this.itemDt.selectCmd = 
        {
            query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE OR MULTICODE = @CODE) OR (@CODE = '')",
            param : ['CODE:string|25'],
        }
        this.unitDt.selectCmd = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1 ORDER BY TYPE ASC",
            param : ['ITEM_GUID:string|50'],
        }
        this.priceDt.selectCmd = 
        {
            query : "SELECT dbo.FN_PRICE_SALE_VAT_EXT(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,'') AS PRICE",
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

        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        tmpDoc.REF = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'txtRef'}).getValue().value
        tmpDoc.INPUT = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value

        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false
        this.cmbDepot.readOnly = false
        this.dtDocDate.readOnly = false        

        this.clearEntry();

        this.txtRef.props.onChange(tmpDoc.REF)

        await this.grdList.dataRefresh({source:this.docObj.docOrders.dt('DOC_ORDERS')});
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
        this.orderDt.clear();

        this.orderDt.push({UNIT:"",FACTOR:0,QUANTITY:0,PRICE:0,AMOUNT:0,DISCOUNT:0,VAT:0,SUM_AMOUNT:0})

        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.cmbUnit.setData([])
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:0,DOC_TYPE:60});
        
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
                    this.txtFactor.props.onChange()
                }

                this.txtBarcode.value = ""
                this.txtQuantity.focus();
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
        if(this.txtFactor.value != 0 || this.txtQuantity.value != 0 || this.txtPrice.value != 0)
        {
            let tmpQuantity = this.txtFactor.value * this.txtQuantity.value;
            this.txtPrice.value = Number((await this.getPrice(this.itemDt[0].GUID,tmpQuantity,this.docObj.dt()[0].OUTPUT))).round(2)
            this.txtAmount.value = Number(this.txtPrice.value * tmpQuantity).round(2)
            this.txtVat.value = Number(this.txtAmount.value).rateInc(this.itemDt[0].VAT,2)
            this.txtSumAmount.value =  Number(this.txtAmount.value).rateExc(this.itemDt[0].VAT,2)
        }
    }
    async addItem(pQuantity)
    {
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgQuantityCheck")}</div>)
            await dialog(this.alertContent);
            return
        }

        // for (let i = 0; i < this.docObj.docOrders.dt().length; i++) 
        // {
        //     if(this.docObj.docOrders.dt()[i].ITEM_CODE == this.barcode.code)
        //     {
        //         document.getElementById("Sound2").play(); 
        //         let tmpConfObj = 
        //         {
        //             id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
        //             button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
        //             content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
        //         }
        //         let pResult = await dialog(tmpConfObj);
        //         if(pResult == 'btn01')
        //         {                   
        //             this.docObj.docOrders.dt()[i].QUANTITY = this.docObj.docOrders.dt()[i].QUANTITY + pQuantity
        //             this.docObj.docOrders.dt()[i].VAT = parseFloat((this.docObj.docOrders.dt()[i].VAT + (this.docObj.docOrders.dt()[i].PRICE * (this.docObj.docOrders.dt()[i].VAT_RATE / 100)) * pQuantity).toFixed(3))
        //             this.docObj.docOrders.dt()[i].AMOUNT = parseFloat((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE).toFixed(3))
        //             this.docObj.docOrders.dt()[i].TOTAL = parseFloat((((this.docObj.docOrders.dt()[i].QUANTITY * this.docObj.docOrders.dt()[i].PRICE) - this.docObj.docOrders.dt()[i].DISCOUNT) + this.docObj.docOrders.dt()[i].VAT).toFixed(3))
        //             this._calculateTotal()
        //             this.barcodeReset()
        //             return
        //         }
        //         else
        //         {
        //             break
        //         }
                
        //     }
        // }
        let tmpDocItems = {...this.docObj.docOrders.empty}

        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docOrders.dt().length
        tmpDocItems.UNIT = this.orderDt[0].UNIT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT
        tmpDocItems.PRICE = this.orderDt[0].PRICE
        tmpDocItems.VAT = this.orderDt[0].VAT
        tmpDocItems.AMOUNT = this.orderDt[0].AMOUNT
        tmpDocItems.TOTAL = this.orderDt[0].SUM_AMOUNT

        this.docObj.docOrders.addEmpty(tmpDocItems)
        this.clearEntry()

        this.save()
    }
    async save()
    {
        this.docObj.dt()[0].AMOUNT = this.docObj.docOrders.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = this.docObj.docOrders.dt().sum("DISCOUNT",2)
        this.docObj.dt()[0].VAT = this.docObj.docOrders.dt().sum("VAT",2)
        this.docObj.dt()[0].TOTAL = this.docObj.docOrders.dt().sum("TOTAL",2)
        await this.docObj.save()
    }
    async onClickBarcodeShortcut()
    {
        // if(this.docObj.dt()[0].INPUT == '')
        // {
        //     this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDepot")}</div>)
        //     await dialog(this.alertContent);
        //     return
        // }
        // if(this.docObj.dt()[0].OUTPUT == '')
        // {
        //     this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgCustomer")}</div>)
        //     await dialog(this.alertContent);
        //     return
        // }

        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        // if(this.docObj.dt("DOC_ORDERS").length == 0)
        // {
        //     this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
        //     await dialog(this.alertContent);
        //     return
        // }

        this.pageView.activePage('Process')
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={"Alış Siparişi"} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :
                            [
                                {
                                    icon : "fa-file",
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        this.init()
                                    }
                                },
                                {
                                    icon : "fa-trash",
                                    text : "Evrak Sil",
                                    onClick : ()=>
                                    {
                                        
                                    }
                                }
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            menu :
                            [
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    }
                                },
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
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
                            // menu :
                            // [
                            //     {
                            //         text : "Yeni Evrak",
                            //         onClick : ()=>
                            //         {
                                        
                            //         }
                            //     },
                            //     {
                            //         text : "Yeni Evrak",
                            //         onClick : ()=>
                            //         {
                                        
                            //         }
                            //     }
                            // ],
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                            ]
                        }
                    ]}
                    onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'50px',height:'100%'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblRef")}</div>
                                        <div className='col-9'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                    onChange={(async(e)=>
                                                    {
                                                        let tmpQuery = 
                                                        {
                                                            query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 0 AND DOC_TYPE = 60 AND REF = @REF ",
                                                            param : ['REF:string|25'],
                                                            value : [e]
                                                        }
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        
                                                        if(tmpData.result.recordset.length > 0)
                                                        {
                                                            this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
                                                        }
                                                    }).bind(this)}
                                                    />
                                                </div>
                                                <div className='col-8'>
                                                    <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                                query : "SELECT GUID,REF,REF_NO,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 0 AND DOC_TYPE = 60 AND REBATE = 0 ORDER BY DOC_DATE DESC"
                                                            },
                                                            sql:this.core.sql
                                                        }
                                                    }}
                                                    >
                                                        <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                        <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("popDoc.clmDate")} width={100}  />
                                                        <Column dataField="OUTPUT_NAME" caption={this.t("popDoc.clmOutputName")} width={200}  />
                                                        <Column dataField="OUTPUT_CODE" caption={this.t("popDoc.clmOutputCode")} width={150}  />
                                                    </NdPopGrid>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDepot")}</div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                            dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerCode")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}
                                            dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_CODE"}} 
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
                                                                    this.docObj.dt()[0].OUTPUT = data[0].GUID
                                                                    this.docObj.dt()[0].OUTPUT_CODE = data[0].CODE
                                                                    this.docObj.dt()[0].OUTPUT_NAME = data[0].TITLE
                                                                
                                                                    if(this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()?.value ==  true)
                                                                    {
                                                                        this.txtRef.value = data[0].CODE;
                                                                        this.txtRef.props.onChange()
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
                                            title={this.t("popCustomer.title")} 
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
                                                <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={150} />
                                                <Column dataField="TITLE" caption={this.t("popCustomer.clmTitle")} width={500} defaultSortOrder="asc" />
                                                <Column dataField="TYPE_NAME" caption={this.t("popCustomer.clmTypeName")} width={100} />
                                                <Column dataField="GENUS_NAME" caption={this.t("popCustomer.clmGenusName")} width={100} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblCustomerName")}</div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"OUTPUT_NAME"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-barcode"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>Barkod Giriş</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickProcessShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-file-lines"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>İşlem Satırları</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
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
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
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
                                                            this.popDoc.show()
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'photo',
                                                        onClick:()=>
                                                        {

                                                        }
                                                    }
                                                ]
                                            }>
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <h6 style={{height:'60px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <div style={{fontSize:'14px',fontWeight:'bold'}}>
                                                <label className='text-purple-light'>{this.t("lblDepotQuantity")}</label>
                                                <NbLabel id="lblDepotQuantity" parent={this} value={0}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblUnit")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                             dt={{data:this.orderDt,field:"UNIT"}}
                                            onValueChanged={(e)=>
                                            {
                                                if(e.value != null && e.value != "")
                                                {
                                                    let tmpFactor = this.unitDt.where({GUID:e.value});
                                                    if(tmpFactor.length > 0)
                                                    {
                                                        this.txtFactor.value = tmpFactor[0].FACTOR
                                                        this.txtFactor.props.onChange()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblQuantity")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onChange={this.calcEntry.bind(this)} dt={{data:this.orderDt,field:"FACTOR"}}/>
                                        </div>
                                        <div className='col-1 d-flex align-items-center justify-content-center'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>X</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtQuantity" parent={this} simple={true} maxLength={32} onChange={this.calcEntry.bind(this)} dt={{data:this.orderDt,field:"QUANTITY"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblPrice")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtPrice" parent={this} simple={true} maxLength={32} onChange={this.calcEntry.bind(this)} dt={{data:this.orderDt,field:"PRICE"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtAmount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"AMOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblDiscount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtDiscount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"DISCOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblVat")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtVat" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"VAT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblSumAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtSumAmount" parent={this} simple={true} maxLength={32} readOnly={true} dt={{data:this.orderDt,field:"SUM_AMOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.addItem.bind(this)}>
                                                Ekle
                                            </NbButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Process"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                <Column dataField="ITEM_NAME" caption={this.t("grdList.clmItemName")} width={150} />
                                                <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} dataType={'number'} width={40}/>
                                                <Column dataField="PRICE" caption={this.t("grdList.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={60}/>
                                                <Column dataField="AMOUNT" caption={this.t("grdList.clmAmount")} allowEditing={false} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                                <Column dataField="DISCOUNT" caption={this.t("grdList.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}} width={80}/>
                                                <Column dataField="DISCOUNT_RATE" caption={this.t("grdList.clmDiscountRate")} dataType={'number'} width={80}/>
                                                <Column dataField="VAT" caption={this.t("grdList.clmVat")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={80}/>
                                                <Column dataField="TOTAL" caption={this.t("grdList.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 3}} allowEditing={false} width={100}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblDiscount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblVat")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}/>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblGenAmount")}</label>                                            
                                        </div>
                                        <div className='col-4'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}/>
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