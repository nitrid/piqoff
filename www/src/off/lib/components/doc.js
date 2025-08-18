import moment from 'moment';
import React from 'react';
import App from '../app.js';
import { docCls,docExtraCls } from '../../../core/cls/doc.js';
import { discountCls } from '../../../core/cls/discount.js'
import { nf525Cls } from '../../../core/cls/nf525.js';

import NdPopGrid from '../../../core/react/devex/popgrid.js';
import NdGrid,{ Column } from '../../../core/react/devex/grid.js';
import { NdToast } from '../../../core/react/devex/toast.js';
import { dialog } from '../../../core/react/devex/dialog.js';
import customer from './customer.js';
import item from './item.js';

export default class doc
{
    constructor(props)
    {
        this.core = App.instance.core;
        this.parent = props.parent;
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.nf525 = new nf525Cls();
        this.discObj = new discountCls();
        this.customer = new customer({page:this.parent,doc:this});
        this.item = new item({page:this.parent,doc:this});
        this.tabIndex = this.parent.tabkey
        this.type = 0;
        this.docType = 0;
        this.rebate = 0;
        this.grid = undefined;
        this.frmDocItems = undefined;
        this.locked = false;
    }
    get detail()
    {
        if((this.docType >= 20 && this.docType <= 59) || (this.docType >= 120 && this.docType <= 129))
        {
            return this.docObj.docItems
        }
        else if(this.docType == 60 || this.docType == 62)
        {
            return this.docObj.docOrders
        }
        else if(this.docType == 61)
        {
            return this.docObj.docOffers
        }
        else if(this.docType == 63)
        {
            return this.docObj.docDemand
        }
    }
    set detail(pVal)
    {
        if((this.docType >= 20 && this.docType <= 59) || (this.docType >= 120 && this.docType <= 129))
        {
            this.docObj.docItems = pVal
        }
        else if(this.docType == 60 && this.docType == 62)
        {
            this.docObj.docOrders = pVal
        }
        else if(this.docType == 61)
        {
            this.docObj.docOffers = pVal
        }
        else if(this.docType == 63)
        {
            return this.docObj.docDemand
        }
    }
    init()
    {
        return new Promise(async resolve =>
        {
            this.docObj.clearAll()
            this.extraObj.clearAll()

            this.docObj.ds.on('onAddRow',(pTblName,pData) =>
            {
                console.log(1453,pTblName,pData)
                if(pData.stat == 'new')
                {
                    this.btnNew?.setState({disabled:false});
                    this.btnBack?.setState({disabled:false});
                    this.btnNew?.setState({disabled:false});
                    this.btnBack?.setState({disabled:true});
                    this.btnSave?.setState({disabled:false});
                    this.btnPrint?.setState({disabled:false});
                    this.btnDelete?.setState({disabled:false});
                    
                    this.frmDocItems?.option('disabled',true)
                }
                
                if(pTblName == 'DOC_ITEMS' || pTblName == 'DOC_ORDERS' || pTblName == 'DOC_OFFERS' || pTblName == 'DOC_DEMAND')
                {
                    this.calculateRow?.(pData.rowIndex)
                    this.calculateTotal?.()
                }
            })
            this.docObj.ds.on('onEdit',(pTblName,pData) =>
            {         
                console.log(1454,pTblName,pData)
                if(pData.rowData.stat == 'edit')
                {
                    // docType 61 (Offers) için button state değişimlerini engelle
                    if(this.docType !== 61)
                    {
                        this.btnBack?.setState({disabled:false});
                        this.btnNew?.setState({disabled:true});
                    }
                    this.btnSave?.setState({disabled:false});
                    this.btnPrint?.setState({disabled:false});
                    this.btnDelete?.setState({disabled:false});
                    
                    pData.rowData.CUSER = this.parent.user.CODE
                }                 

                let tmpData = pData.rowData
                if((tmpData.OUTPUT != '' && tmpData.OUTPUT != '00000000-0000-0000-0000-000000000000') && 
                (tmpData.INPUT != '' && tmpData.INPUT != '00000000-0000-0000-0000-000000000000') && !this.locked)
                {
                    this.frmDocItems?.option('disabled',false)
                }
                else
                {
                    this.frmDocItems?.option('disabled',true)
                }
                
                if(pTblName == 'DOC_ITEMS' || pTblName == 'DOC_ORDERS' || pTblName == 'DOC_OFFERS' || pTblName == 'DOC_DEMAND')
                {
                    this.calculateRow?.(pData.rowIndex)
                    this.calculateTotal?.()
                }
            })
            this.docObj.ds.on('onRefresh',(pTblName) =>
            {  
                console.log(1455,pTblName)
                // docType 61 (Offers) için button state değişimlerini engelle
                if(this.docType !== 61)
                {
                    this.btnBack?.setState({disabled:true});
                    this.btnNew?.setState({disabled:false});
                }
                this.btnSave?.setState({disabled:true});
                this.btnPrint?.setState({disabled:false});  
                this.btnDelete?.setState({disabled:false});

                if(pTblName == 'DOC_ITEMS' || pTblName == 'DOC_ORDERS' || pTblName == 'DOC_OFFERS' || pTblName == 'DOC_DEMAND')
                {
                    this.calculateRow?.()
                    this.calculateTotal?.()
                }
                
                this.frmDocItems?.option('disabled',false)
            })      
            this.docObj.ds.on('onDelete',(pTblName) =>
            {            
                this.btnBack?.setState({disabled:false});
                this.btnNew?.setState({disabled:false});
                this.btnSave?.setState({disabled:false});
                this.btnPrint?.setState({disabled:false});
                this.btnDelete?.setState({disabled:false});
            })

            resolve()
        })
    }
    addDocEmpty()
    {
        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = this.type
        tmpDoc.DOC_TYPE = this.docType
        tmpDoc.REBATE = this.rebate
        tmpDoc.TRANSPORT_TYPE = this.parent.sysParam.filter({ID:'DocTrasportType',USERS:this.parent.user.CODE}).getValue()
        this.docObj.addEmpty(tmpDoc);
    }
    addDocCustomerEmpty()
    {
        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
        tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
        tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
        tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        this.docObj.docCustomer.addEmpty(tmpDocCustomer);
    }
    async getPopDoc(pType)
    {
        let tmpQuery = {}
     
        if(pType == 0)
        {
            if(this.type == 0)
            {
                tmpQuery = 
                {
                    query : `SELECT GUID,REF,REF_NO,CLOSED,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = ${this.type} AND DOC_TYPE = ${this.docType} AND REBATE = ${this.rebate} AND DOC_DATE > dbo.GETDATE() - 30 ORDER BY DOC_DATE DESC,REF_NO DESC`
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : `SELECT GUID,REF,REF_NO,CLOSED,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = ${this.type} AND DOC_TYPE = ${this.docType} AND REBATE = ${this.rebate} AND DOC_DATE > dbo.GETDATE() - 30 ORDER BY DOC_DATE DESC,REF_NO DESC`
                }
            }
        }
        else
        {
            if(this.type == 0)
            {
                tmpQuery = 
                {
                    query : `SELECT GUID,REF,REF_NO,CLOSED,OUTPUT_CODE,OUTPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = ${this.type} AND DOC_TYPE = ${this.docType} AND REBATE = ${this.rebate} ORDER BY DOC_DATE DESC,REF_NO DESC`
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : `SELECT GUID,REF,REF_NO,CLOSED,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT,TOTAL FROM DOC_VW_01 WHERE TYPE = ${this.type} AND DOC_TYPE = ${this.docType} AND REBATE = ${this.rebate} ORDER BY DOC_DATE DESC,REF_NO DESC`
                }
            }
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
     
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        
        this.popDoc.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
            }
        }
     
        await this.popDoc.show()
        await this.popDoc.setData(tmpRows)
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        return new Promise(async resolve =>
        {
            this.docObj.clearAll()
            await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:this.type,DOC_TYPE:this.docType});

            if(this.docObj.dt().length == 0)
            {
                resolve()
                return
            }

            if(this.docObj.dt()[0].LOCKED != 0)
            {
                this.locked = true
                this.docToast.show({message:this.parent.lang.t("msgGetLocked"),type:'warning',displayTime:2000})
            }
            else
            {
                this.locked = false
                
            }

            for(let i = 0; i < this.detail.dt().length; i++)
            {
                this.detail.dt()[i].PURC_PRICE = this.detail.dt()[i].CUSTOMER_PRICE + this.detail.dt()[i].PRICE
                this.detail.dt()[i].DIFF_PRICE = this.detail.dt()[i].PRICE - this.detail.dt()[i].CUSTOMER_PRICE
            }
            resolve()
        })
    }
    /**
     * Evrakın var olup olmadığını kontrol eder.
     * @param {*} pVal {ref:string,refNo:int,docNo:string,deleted:boolean}
     * docNo değeri verilirse Belge numarası kontrol edilir.
     * ref ve refNo değerleri verilirse Ref ve Ref No kontrol edilir.
     * deleted değeri true ise silinmiş evraklardan kontrol edilir.
     * @returns 2: Kayıt var evrak a git , 3: Kayıt var evraka gitme, 0: Kayıt yok
     */
    async checkDoc(pVal)
    {
        return new Promise(async resolve =>
        {
            let tmpRef = pVal.ref
            let tmpRefNo = pVal.refNo
            let tmpDocNo = pVal.docNo
            let tmpDeleted = pVal.deleted
            
            if(tmpDeleted)
            {
                let tmpQuery = 
                {
                    query : `SELECT DELETED FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE AND REBATE = @REBATE`,
                    param : ['REF:string|50','REF_NO:int','TYPE:int','DOC_TYPE:int','REBATE:bit'],
                    value : [tmpRef,tmpRefNo,this.type,this.docType,this.rebate]
                }

                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0 && tmpData.result.recordset[0].DELETED == 1)
                {   
                    this.docToast.show({message:this.parent.lang.t("msgDocDeleted.msg"),type:'warning',displayTime:2000})
                    resolve(0)
                    return
                }
            }
            else if(tmpDocNo)
            {
                if(this.parent.prmObj.filter({ID:'checkDocNo',USERS:this.parent.user.CODE}).getValue() && tmpDocNo != '')
                {
                    let tmpQuery = 
                    {
                        query : `SELECT DOC_NO FROM DOC WHERE DOC_NO = @DOC_NO AND TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE AND REBATE = @REBATE AND DELETED = 0`,
                        param : ['DOC_NO:string|50','TYPE:int','DOC_TYPE:int','REBATE:bit'],
                        value : [tmpDocNo,this.type,this.docType,this.rebate]
                    }
                    
                    let tmpData = await this.core.sql.execute(tmpQuery) 

                    if(tmpData.result.recordset.length > 0)
                    {
                        this.docToast.show({message:this.parent.lang.t("msgCheckDocNo"),type:'warning',displayTime:2000})
                        resolve(0)
                        return
                    }
                }
                
            }

            let tmpQuery = 
            {
                query : `SELECT REF FROM DOC WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE = @TYPE AND DOC_TYPE = @DOC_TYPE AND REBATE = @REBATE`,
                param : ['REF:string|50','REF_NO:int','TYPE:int','DOC_TYPE:int','REBATE:bit'],
                value : [tmpRef,tmpRefNo,this.type,this.docType,this.rebate]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                let tmpConfObj = 
                {
                    id: 'msgCode',
                    showTitle:true,
                    title:this.parent.t("msgCode.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'auto',
                    button:[{id:"btn01",caption:this.parent.t("msgCode.btn01"),location:'before'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.parent.t("msgCode.msg")}</div>)
                }

                let pResult = await dialog(tmpConfObj);
        
                if(pResult == 'btn01')
                {
                    this.getDoc('00000000-0000-0000-0000-000000000000',tmpRef,tmpRefNo)
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
        });
    }
    async updateDoc()
    {
        for (let i = 0; i < this.detail.dt().length; i++) 
        {
            this.detail.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.detail.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.detail.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.detail.dt()[i].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.detail.dt()[i].REF = this.docObj.dt()[0].REF
            this.detail.dt()[i].REF_NO = this.docObj.dt()[0].REF_NO
        }

        if(this.docType >= 20 && this.docType <= 39 && this.docObj.docCustomer.dt().length > 0)
        {
            this.docObj.docCustomer.dt()[0].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docCustomer.dt()[0].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docCustomer.dt()[0].DOC_DATE = this.docObj.dt()[0].DOC_DATE
            this.docObj.docCustomer.dt()[0].SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
            this.docObj.docCustomer.dt()[0].REF = this.docObj.dt()[0].REF
            this.docObj.docCustomer.dt()[0].REF_NO = this.docObj.dt()[0].REF_NO
        }
        // MÜŞTERİ INDIRIM İ GETİRMEK İÇİN....
        let tmpDepot = this.type == 0 ? this.docObj.dt()[0].INPUT : this.docObj.dt()[0].OUTPUT
       
        await this.discObj.loadDocDisc(
        {
            DEPOT : tmpDepot == '' ? '00000000-0000-0000-0000-000000000000' : tmpDepot, 
            START_DATE : moment(this.docObj.dt()[0].DOC_DATE).format("YYYY-MM-DD"), 
            FINISH_DATE : moment(this.docObj.dt()[0].DOC_DATE).format("YYYY-MM-DD"),
        })
    }
    async calculateTotal()
    {
        let tmpVat = 0
       
        for (let i = 0; i < this.docDetailObj.dt().groupBy('VAT_RATE').length; i++) 
        {
            if(this.docObj.dt()[0].VAT_ZERO != 1)
            {
                tmpVat = tmpVat + parseFloat(this.docDetailObj.dt().where({'VAT_RATE':this.docDetailObj.dt().groupBy('VAT_RATE')[i].VAT_RATE}).sum("VAT",2))
            }
        }

        this.docObj.dt()[0].AMOUNT = this.detail.dt().sum("AMOUNT",2)
        this.docObj.dt()[0].DISCOUNT = Number(parseFloat(this.detail.dt().sum("AMOUNT",2)) - parseFloat(this.detail.dt().sum("TOTALHT",2))).round(2)
        this.docObj.dt()[0].DOC_DISCOUNT_1 = this.detail.dt().sum("DOC_DISCOUNT_1",4)
        this.docObj.dt()[0].DOC_DISCOUNT_2 = this.detail.dt().sum("DOC_DISCOUNT_2",4)
        this.docObj.dt()[0].DOC_DISCOUNT_3 = this.detail.dt().sum("DOC_DISCOUNT_3",4)
        this.docObj.dt()[0].DOC_DISCOUNT = Number((parseFloat(this.detail.dt().sum("DOC_DISCOUNT_1",4)) + parseFloat(this.detail.dt().sum("DOC_DISCOUNT_2",4)) + parseFloat(this.detail.dt().sum("DOC_DISCOUNT_3",4)))).round(2)
        this.docObj.dt()[0].VAT = Number(tmpVat).round(2)
        this.docObj.dt()[0].SUBTOTAL = parseFloat(this.detail.dt().sum("TOTALHT",2))
        this.docObj.dt()[0].TOTALHT = parseFloat(parseFloat(this.detail.dt().sum("TOTALHT",2)) - parseFloat(this.detail.dt().sum("DOC_DISCOUNT",2))).round(2)
        this.docObj.dt()[0].TOTAL = Number((parseFloat(this.docObj.dt()[0].TOTALHT)) + parseFloat(this.docObj.dt()[0].VAT)).round(2)


    }
    async calculateRow(pIndex)
    {
        if(typeof pIndex == 'undefined')
        {
            for(let i = 0; i < this.detail.dt().length; i++)
            {
                await this.calculateRow(i)
            }
        }
        else
        {
            let tmpRow = this.detail.dt()[pIndex]
            
            tmpRow.AMOUNT = parseFloat((tmpRow.PRICE * tmpRow.QUANTITY).toFixed(3)).round(2)
            tmpRow.TOTALHT = Number(Number(parseFloat((tmpRow.PRICE * tmpRow.QUANTITY)) - (parseFloat(tmpRow.DISCOUNT))).toFixed(3)).round(2)

            if(this.docObj.dt()[0].VAT_ZERO != 1)
            {
                tmpRow.VAT = parseFloat(((((tmpRow.TOTALHT) - (parseFloat(tmpRow.DOC_DISCOUNT))) * (tmpRow.VAT_RATE) / 100))).round(6);
            }
            else
            {
                tmpRow.VAT = 0
                tmpRow.VAT_RATE = 0
            }

            tmpRow.TOTAL = Number(((tmpRow.TOTALHT - tmpRow.DOC_DISCOUNT) + tmpRow.VAT)).round(2)

            let tmpMargin = (tmpRow.TOTAL - tmpRow.VAT) - (tmpRow.COST_PRICE * tmpRow.QUANTITY)
            let tmpMarginRate = (tmpMargin /(tmpRow.TOTAL - tmpRow.VAT)) * 100

            tmpRow.MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2)
        }
    }
    async priceListChange()
    {
        if(this.detail.dt().length == 0)
        {
            return
        }

        let tmpConfObj1 =
        {
            id:'msgPriceListChange',showTitle:true,title:this.parent.lang.t("msgPriceListChange.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.parent.lang.t("msgPriceListChange.btn01"),location:'before'},{id:"btn02",caption:this.parent.lang.t("msgPriceListChange.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.parent.lang.t("msgPriceListChange.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj1);

        if(pResult == 'btn01')
        {
            let tmpDepot = '00000000-0000-0000-0000-000000000000'
            let tmpCustomer = '00000000-0000-0000-0000-000000000000'
            let tmpListNo = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].PRICE_LIST_NO : 1
            let priceType = 0

            if(this.type == 0)
            {
                tmpDepot = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].INPUT : '00000000-0000-0000-0000-000000000000'
                tmpCustomer = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].OUTPUT : '00000000-0000-0000-0000-000000000000'
            }
            else
            {
                tmpDepot = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].OUTPUT : '00000000-0000-0000-0000-000000000000'
                tmpCustomer = typeof this.docObj != 'undefined' && typeof this.docObj.dt() != 'undefined' && this.docObj.dt().length > 0 ? this.docObj.dt()[0].INPUT : '00000000-0000-0000-0000-000000000000'
            }

            if(this.docObj.dt()[0].REBATE == 0)
            {
                priceType = this.type == 0 ? 1 : 0
            }
            else
            {
                priceType = this.type == 0 ? 0 : 1
            }

            for (let i = 0; i < this.detail.dt().length; i++) 
            {
                this.detail.dt()[i].PRICE = await this.item.getPrice(this.detail.dt()[i].ITEM,this.detail.dt()[i].QUANTITY,tmpCustomer,tmpDepot,tmpListNo,priceType,0)
            }
        }
    }
    render()
    {
        return(
            <React.Fragment>
                {/* Evrak Seçim PopUp*/}
                <div>
                    <NdPopGrid id={"popDoc"} parent={this} container={'#' + this.parent.props.data.id + this.tabIndex}
                    lang={this.parent.lang}
                    visible={false}
                    position={{of:'#' + this.parent.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.parent.lang.t("popDoc.title")} 
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'more',
                                onClick:()=>
                                {
                                    this.popDoc.hide()
                                    this.getPopDoc(1)
                                }
                            }
                        ]
                    }
                    deferRendering={true}>
                    {(()=>
                    {
                        if(this.type == 0)
                        {
                            let tmpArr = []
                            tmpArr.push(<Column key={"REF"} dataField="REF" caption={this.parent.lang.t("popDoc.clmRef")} width={150}/>)
                            tmpArr.push(<Column key={"REF_NO"} dataField="REF_NO" caption={this.parent.lang.t("popDoc.clmRefNo")} width={120} />)
                            tmpArr.push(<Column key={"DOC_DATE_CONVERT"} dataField="DOC_DATE_CONVERT" caption={this.parent.lang.t("popDoc.clmDate")} width={300} />)
                            tmpArr.push(<Column key={"OUTPUT_NAME"} dataField="OUTPUT_NAME" caption={this.parent.lang.t("popDoc.clmOutputName")} width={300} />)
                            tmpArr.push(<Column key={"OUTPUT_CODE"} dataField="OUTPUT_CODE" caption={this.parent.lang.t("popDoc.clmOutputCode")} width={300} />)
                            tmpArr.push(<Column key={"TOTAL"} dataField="TOTAL" format={{ style: "currency", currency: Number.money.code,precision: 2}} caption={this.parent.lang.t("popDoc.clmTotal")} width={200} />)
                            return tmpArr
                        }
                        else if(this.type == 1)
                        {
                            let tmpArr = []
                            tmpArr.push(<Column key={"REF"} dataField="REF" caption={this.parent.lang.t("popDoc.clmRef")} width={150}/>)
                            tmpArr.push(<Column key={"REF_NO"} dataField="REF_NO" caption={this.parent.lang.t("popDoc.clmRefNo")} width={120} />)
                            tmpArr.push(<Column key={"DOC_DATE_CONVERT"} dataField="DOC_DATE_CONVERT" caption={this.parent.lang.t("popDoc.clmDate")} width={300} />)
                            tmpArr.push(<Column key={"INPUT_NAME"} dataField="INPUT_NAME" caption={this.parent.lang.t("popDoc.clmInputName")} width={300} />)
                            tmpArr.push(<Column key={"INPUT_CODE"} dataField="INPUT_CODE" caption={this.parent.lang.t("popDoc.clmInputCode")} width={300} />)
                            if(this.docType==62)
                            {
                                tmpArr.push(<Column key={"CLOSED"} dataField="CLOSED" caption={this.parent.lang.t("popDoc.clmClosed")} width={100} 
                                cellRender={(data) => { return data.value == 2 ? '✓' : 'X'; }} />)
                            }
                            tmpArr.push(<Column key={"TOTAL"} dataField="TOTAL" format={{ style: "currency", currency: Number.money.code,precision: 2}} caption={this.parent.lang.t("popDoc.clmTotal")} width={200} />)
                            return tmpArr
                        }
                    })()}
                    </NdPopGrid>
                </div>
                {/* Müşteri İşlemleri */}
                {this.customer.render()}
                {/* Toast */}
                <NdToast id={"docToast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
            </React.Fragment>
        )
    }
}