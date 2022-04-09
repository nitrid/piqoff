import React from "react";
import App from "../lib/app.js";

import Form, { Label,Item } from "devextreme-react/form";
import { ButtonGroup } from "devextreme-react/button-group";

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from "../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NbNumberboard from "../tools/numberboard.js";
import NbKeyboard from "../tools/keyboard.js";
import NbCalculator from "../tools/calculator.js";
import NbPopUp from "../../core/react/bootstrap/popup.js";
import NdDatePicker from "../../core/react/devex/datepicker.js";
import NdSelectBox from "../../core/react/devex/selectbox.js";
import NbPluButtonGrp from "../tools/plubuttongrp.js";
import NbPopNumber from "../tools/popnumber.js";
import NbRadioButton from "../../core/react/bootstrap/radiogroup.js";
import NbPosPopGrid from "../tools/pospopgrid.js";
import NbPopDescboard from "../tools/popdescboard.js";
import { dialog } from "../../core/react/devex/dialog.js";

import { posCls,posSaleCls,posPaymentCls,posPluCls,posDeviceCls } from "../../core/cls/pos.js";
import { itemsCls } from "../../core/cls/items.js";
import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

export default class posDoc extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core
        this.lang = App.instance.lang
        this.t = App.instance.lang.getFixedT(null,null,"pos")
        this.user = this.core.auth.data
        this.prmObj = new param(prm)
        this.posObj = new posCls()
        this.posDevice = new posDeviceCls();
        
        this.state =
        {
            time:"00:00:00",
            date:"00.00.0000",
            isPluEdit:false,
            isBtnGetCustomer:false,
            isBtnInfo:false,
            customerName:'',
            customerPoint:0,
            totalRowCount:0,
            totalItemCount:0,
            totalLoyalty:0,
            totalTicRest:0,
            totalSub:0,
            totalVat:0,
            totalDiscount:0,
            totalGrand:0,
            payTotal:0,
            payChange:0,
            payRest:0,
            discountBefore:0,
            discountAfter:0
        }      
        document.onkeydown = (e) =>
        {
            //EĞER TXTBARCODE ELEMENT HARİCİNDE BAŞKA BİR İNPUT A FOKUSLANILMIŞSA FONKSİYONDAN ÇIKILIYOR.
            if(document.activeElement.type == 'text' && document.activeElement.parentElement.parentElement.parentElement.id != 'txtBarcode')
            {
                return
            }
            
            this.txtBarcode.focus()
            if(e.which == 38) //UP
            {
                
            }
            else if(e.which == 40) //DOWN
            {
                
            }
            else if(e.which == 123) //F12
            {
                
            }
        }     
        this.init()
    }
    async init()
    {                
        this.posObj.clearAll()
        await this.prmObj.load({PAGE:"pos",APP:'POS'})

        this.posObj.addEmpty()
        this.posObj.dt()[this.posObj.dt().length - 1].DEVICE = '001'

        this.posDevice.lcdPort = this.prmObj.filter({ID:'LCDPort',TYPE:0,SPECIAL:"001"}).getValue()
        this.posDevice.scalePort = this.prmObj.filter({ID:'ScalePort',TYPE:0,SPECIAL:"001"}).getValue()
        this.posDevice.payCardPort = this.prmObj.filter({ID:'PayCardPort',TYPE:0,SPECIAL:"001"}).getValue()

        console.log(this.posDevice)
        this.posDevice.caseOpen()
        await this.grdList.dataRefresh({source:this.posObj.posSale.dt()});
        await this.grdPay.dataRefresh({source:this.posObj.posPay.dt()});

        setInterval(()=>
        {
            this.setState({time:moment(new Date(),"HH:mm:ss").format("HH:mm:ss"),date:new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' })})
        },1000) 

        await this.calcGrandTotal(false)       
    }
    async getDoc(pGuid)
    {
        await this.posObj.load({GUID:pGuid})
        await this.calcGrandTotal()
    }
    getItemDb(pCode)
    {
        return new Promise(async resolve => 
        {
            let tmpDt = new datatable(); 
            tmpDt.selectCmd = 
            {
                query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE CODE = @CODE OR BARCODE = @CODE OR MULTICODE = @CODE",
                param : ['CODE:string|25'],
                value: [pCode]
            }
            await tmpDt.refresh();
            resolve(tmpDt)
        });
    }
    async getItem(pCode)
    {
        let tmpQuantity = 1
        let tmpPrice = 0
        if(pCode == '')
        {
            return
        }
        //EĞER CARİ SEÇ BUTONUNA BASILDIYSA CARİ BARKODDAN SEÇİLECEK.
        if(this.state.isBtnGetCustomer)
        {
            //TICKET REST. SADAKAT PUAN KULLANIMI PARAMETRESI
            if(this.prmObj.filter({ID:'UseTicketRestLoyalty',TYPE:0}).getValue() == true)
            {
                //#BAK
            }
            let tmpCustomerDt = new datatable(); 
            tmpCustomerDt.selectCmd = 
            {
                query : "SELECT GUID,CODE,TITLE,ADRESS,0 AS CUSTOMER_POINT FROM [dbo].[CUSTOMER_VW_02] WHERE CODE = @CODE",
                param : ['CODE:string|50']
            }
            tmpCustomerDt.selectCmd.value = [pCode]
            await tmpCustomerDt.refresh();

            if(tmpCustomerDt.length > 0)
            {
                this.posObj.dt().CUSTOMER_GUID = tmpCustomerDt[0].GUID
                this.posObj.dt().CUSTOMER_CODE = tmpCustomerDt[0].CODE
                this.posObj.dt().CUSTOMER_NAME = tmpCustomerDt[0].TITLE
                
                this.setState({customerName:tmpCustomerDt[0].TITLE,customerPoint:tmpCustomerDt[0].CUSTOMER_POINT})
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Dikkat",
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'before'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Müşteri bulunamadı !"}</div>)
                }
                
                await dialog(tmpConfObj);
            }
            this.setState({isBtnGetCustomer:false})
            this.txtBarcode.value = ""; 
            return;
        }
        //******************************************************** */
        //BARKOD X MİKTAR İŞLEMİ.
        if(pCode.indexOf("*") != -1)
        {
            if(pCode.split("*")[0] == "")
            {
                document.getElementById("Sound").play();
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Uyarı",
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Miktar sıfır giremezsiniz !"}</div>)
                }
                await dialog(tmpConfObj);
                this.txtBarcode.value = "";
                return
            }
            tmpQuantity = pCode.split("*")[0];
            pCode = pCode.split("*")[1];
        }
        //******************************************************** */
        //BARKOD DESENİ
        let tmpBarPattern = this.getBarPattern(pCode)
        tmpPrice = typeof tmpBarPattern.price == 'undefined' || tmpBarPattern.price == 0 ? tmpPrice : tmpBarPattern.price
        tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' || tmpBarPattern.quantity == 0 ? tmpQuantity : tmpBarPattern.quantity
        pCode = tmpBarPattern.barcode
        //******************************************************** */
        //UNIQ BARKODU
        //#BAK
        //******************************************************** */
        //ÜRÜN GETİRME
        let tmpItemsDt = await this.getItemDb(pCode)
        if(tmpItemsDt.length > 0)
        {            
            //FIYAT GETİRME
            let tmpPriceDt = new datatable()
            tmpPriceDt.selectCmd = 
            {
                query : "SELECT dbo.FN_PRICE_SALE(@GUID,@QUANTITY,GETDATE()) AS PRICE",
                param : ['GUID:string|50','QUANTITY:float']
            }
            tmpPriceDt.selectCmd.value = [tmpItemsDt[0].GUID,tmpQuantity]
            await tmpPriceDt.refresh();
            if(tmpPriceDt.length > 0 && tmpPrice == 0)
            {
                tmpPrice = tmpPriceDt[0].PRICE
                //FİYAT GÖR
                if(this.state.isBtnInfo)
                {
                    let tmpConfObj =
                    {
                        id:'msgAlert',
                        showTitle:true,
                        title:"Bilgi",
                        showCloseButton:true,
                        width:'500px',
                        height:'250px',
                        button:[{id:"btn01",caption:"Tamam",location:'after'}],
                        content:(<div><h3 className="text-primary text-center">{tmpItemsDt[0].NAME}</h3><h3 className="text-danger text-center">{tmpPrice + " EUR"}</h3></div>)
                    }
                    await dialog(tmpConfObj);
                    this.txtBarcode.value = "";
                    this.setState({isBtnInfo:false})
                    return;
                }
                //**************************************************** */
            }
            //**************************************************** */
            //EĞER ÜRÜN TERAZİLİ İSE
            if(tmpItemsDt[0].WEIGHING)
            {
                if(tmpPrice > 0)
                {
                    //TERAZİYE İSTEK YAPILIYOR.
                    let tmpWResult = await this.getWeighing()
                    if(typeof tmpWResult != 'undefined')
                    {
                        tmpQuantity = tmpWResult
                    }
                    else
                    {
                        this.txtBarcode.value = "";
                        return
                    }
                }
                else
                {   
                    //EĞER OKUTULAN BARKODUN FİYAT SIFIR İSE KULLANICIYA FİYAT 
                    let tmpResult = await this.popNumber.show('Fiyat',0)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        tmpPrice = tmpResult
                        //FİYAT GİRİLMİŞ İSE TERAZİYE İSTEK YAPILIYOR.
                        let tmpWResult = await this.getWeighing()
                        if(typeof tmpWResult != 'undefined')
                        {
                            tmpQuantity = tmpWResult
                        }
                        else
                        {
                            this.txtBarcode.value = "";
                            return
                        }
                    }
                    else
                    {
                        //POPUP KAPATILMIŞ İSE YADA FİYAT BOŞ GİRİLMİŞ İSE...
                        this.txtBarcode.value = "";
                        return
                    }
                }
            }
            //**************************************************** */
            //FİYAT TANIMSIZ YADA SIFIR İSE
            //**************************************************** */
            if(tmpPrice == 0)
            {
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Uyarı",
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:"Evet",location:'before'},{id:"btn02",caption:"Hayır",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Ürünün fiyat bilgisi tanımsız ! Devam etmek istermisiniz ?"}</div>)
                }
                let tmpMsgResult = await dialog(tmpConfObj);
                if(tmpMsgResult == 'btn02')
                {
                    this.txtBarcode.value = ""
                    return
                }
            }
            //**************************************************** */
            tmpItemsDt[0].QUANTITY = tmpQuantity
            tmpItemsDt[0].PRICE = tmpPrice
            this.saleAdd(tmpItemsDt[0])
            this.txtBarcode.value = ""
        }
        else
        {
            document.getElementById("Sound").play(); 
            let tmpConfObj =
            {
                id:'msgAlert',
                showTitle:true,
                title:"Uyarı",
                showCloseButton:true,
                width:'500px',
                height:'200px',
                button:[{id:"btn01",caption:"Tamam",location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Okuttuğunuz Barkod Sistemde Bulunamadı !"}</div>)
            }
            await dialog(tmpConfObj);
            this.txtBarcode.value = "";
        }
        //******************************************************** */        
    }
    getWeighing()
    {
        //#BAK BURAYA TERAZİ ENTEGRASYONU EKLENECEK
        return new Promise(async resolve => 
        {
            let tmpConfObj =
            {
                id:'msgAlert',
                showTitle:true,
                title:"Uyarı",
                showCloseButton:true,
                width:'500px',
                height:'200px',
                button:[{id:"btn01",caption:"Miktar Giriş",location:'before'},{id:"btn02",caption:"Vazgeç",location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Teraziden cevap bekleniyor."}</div>)
            }
            let tmpResult = await dialog(tmpConfObj);
            if(tmpResult == 'btn01')
            {
                let tmpResult = await this.popNumber.show('Miktar',0)
                if(typeof tmpResult != 'undefined' && tmpResult != '')
                {
                    resolve(tmpResult)
                }
                else
                {
                    resolve()
                }
            }
            else if(tmpResult == 'btn02')
            {
                resolve()
            }
        });
    }
    getBarPattern(pBarcode)
    {
        let tmpPrm = this.prmObj.filter({ID:'BarcodePattern',TYPE:0}).getValue();
        
        if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
        {            
            return {barcode:pBarcode}
        }
        //201234012550 0211234012550
        for (let i = 0; i < tmpPrm.length; i++) 
        {
            let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('N'))

            if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag)
            {
                let tmpMoney = pBarcode.substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
                let tmpCent = pBarcode.substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
                let tmpKg = pBarcode.substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
                let tmpGram = pBarcode.substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
                
                return {
                    barcode : pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1),
                    price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)),
                    quantity : parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
                }
            }
        }

        return {barcode : pBarcode}
    }
    async calcGrandTotal(pSave)
    {
        return new Promise(async resolve => 
        {
            if(this.posObj.dt().length > 0)
            {
                this.posObj.dt()[this.posObj.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.posSale.dt().sum('AMOUNT',2)).toFixed(2))
                this.posObj.dt()[this.posObj.dt().length - 1].DISCOUNT = Number(parseFloat(this.posObj.posSale.dt().sum('DISCOUNT',2)).toFixed(2))
                this.posObj.dt()[this.posObj.dt().length - 1].LOYALTY = Number(parseFloat(this.posObj.posSale.dt().sum('LOYALTY',2)).toFixed(2))
                this.posObj.dt()[this.posObj.dt().length - 1].VAT = Number(parseFloat(this.posObj.posSale.dt().sum('VAT',2)).toFixed(2))
                this.posObj.dt()[this.posObj.dt().length - 1].TOTAL = Number(parseFloat(this.posObj.posSale.dt().sum('TOTAL',2)).toFixed(2))
                
                this.state.payChange = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) >= 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)) * -1
                this.state.payRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)); 
                
                this.setState(
                    {
                        totalRowCount:this.posObj.posSale.dt().length,
                        totalItemCount:this.posObj.posSale.dt().sum('QUANTITY',2),
                        totalLoyalty:this.posObj.dt()[0].LOYALTY,
                        totalTicRest:0,
                        totalSub:this.posObj.dt()[0].AMOUNT,
                        totalVat:this.posObj.dt()[0].VAT,
                        totalDiscount:this.posObj.dt()[0].DISCOUNT,
                        totalGrand:this.posObj.dt()[0].TOTAL,
                        payTotal:this.posObj.posPay.dt().sum('AMOUNT',2),
                        payChange:this.state.payChange,
                        payRest:this.state.payRest
                    }
                )
                
                this.txtPopTotal.value = parseFloat(this.state.payRest).toFixed(2)
                this.txtPopCardPay.value = parseFloat(this.state.payRest).toFixed(2)
                this.txtPopCashPay.value = parseFloat(this.state.payRest).toFixed(2)            
            }
    
            if(typeof pSave == 'undefined' || pSave)
            {
                await this.posObj.save()
            }

            resolve()
        });
    }    
    isRowMerge(pType,pData)
    {
        if(pType == 'SALE')
        {
            let tmpData = this.posObj.posSale.dt().where({ITEM_GUID:pData.GUID})
            //BURAYA SUBTOTAL KONTROLÜ DE EKLENECEK
            if(tmpData.length > 0)
            {
                if(pData.SALE_JOIN_LINE == 1 && pData.WEIGHING == 0)
                {
                    return tmpData[0]
                }
            }
        }
        else if(pType == "PAY")
        {
            let tmpData = this.posObj.posPay.dt().where({TYPE:pData.TYPE})
            if(tmpData.length > 0)
            {
                return tmpData[0]
            }
        }

        return
    }
    async saleAdd(pItemData)
    {
        let tmpRowData = this.isRowMerge('SALE',pItemData)
        //SATIR BİRLEŞTİR        
        if(typeof tmpRowData != 'undefined')
        {
            pItemData.QUANTITY = Number(parseFloat((pItemData.QUANTITY * pItemData.UNIT_FACTOR) + tmpRowData.QUANTITY).toFixed(3))
            this.saleRowUpdate(tmpRowData,pItemData)
        }
        else
        {
            pItemData.QUANTITY = Number(parseFloat(pItemData.QUANTITY * pItemData.UNIT_FACTOR).toFixed(3))
            this.saleRowAdd(pItemData)
        }        
        //HER EKLEME İŞLEMİNDEN SONRA İLK SATIR SEÇİLİYOR.
        setTimeout(() => 
        {
            this.grdList.devGrid.selectRowsByIndexes(0)
        }, 100);
    }
    async saleRowAdd(pItemData)
    {           
        pItemData.AMOUNT = Number(parseFloat(pItemData.PRICE * pItemData.QUANTITY).toFixed(2))
        pItemData.VAT_AMOUNT = Number(parseFloat(pItemData.AMOUNT *  Number(parseFloat(pItemData.VAT / 100).toFixed(3))).toFixed(2))
        pItemData.TOTAL = Number(parseFloat(pItemData.AMOUNT + pItemData.VAT_AMOUNT).toFixed(2))

        this.posObj.posSale.addEmpty()
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].SAFE = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_GUID = '00000000-0000-0000-0000-000000000000'
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_CODE = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DEPOT_NAME = ''
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TYPE = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_GUID = this.posObj.dt()[0].CUSTOMER_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_CODE = this.posObj.dt()[0].CUSTOMER_CODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].CUSTOMER_NAME = this.posObj.dt()[0].CUSTOMER_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LINE_NO = this.posObj.posSale.dt().length
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_GUID = pItemData.GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_CODE = pItemData.CODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_NAME = pItemData.NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE_GUID = pItemData.BARCODE_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE = pItemData.BARCODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_GUID = '00000000-0000-0000-0000-000000000000'
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_NAME = pItemData.UNIT_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_FACTOR = pItemData.UNIT_FACTOR
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].QUANTITY = pItemData.QUANTITY
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].PRICE = pItemData.PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].AMOUNT = pItemData.AMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DISCOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LOYALTY = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT = pItemData.VAT_AMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT_RATE = pItemData.VAT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TOTAL = pItemData.TOTAL
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].SUBTOTAL = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_AMOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_DISCOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_LOYALTY = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_VAT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GRAND_TOTAL = 0

        await this.calcGrandTotal();
    }
    async saleRowUpdate(pRowData,pItemData)
    {
        let tmpAmount = Number(parseFloat(pItemData.PRICE * pItemData.QUANTITY).toFixed(2))
        let tmpVat = Number(parseFloat(tmpAmount *  Number(parseFloat(pRowData.VAT_RATE / 100).toFixed(3))).toFixed(2))
        let tmpTotal = Number(parseFloat(tmpAmount + tmpVat).toFixed(2))
        
        pRowData.QUANTITY = pItemData.QUANTITY
        pRowData.PRICE = pItemData.PRICE
        pRowData.AMOUNT = tmpAmount
        pRowData.VAT = tmpVat
        pRowData.TOTAL = tmpTotal

        await this.calcGrandTotal();
    }
    async payAdd(pType,pAmount)
    {
        if(this.state.payRest > 0)
        {
            //KREDİ KARTI İSE
            if(pType == 1)
            {
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Uyarı",
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:"Tekrar",location:'before'},{id:"btn02",caption:"Vazgeç",location:'center'},{id:"btn03",caption:"Zorla",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Kart cihazından cevap bekleniyor."}</div>)
                }
                let tmpResult = await dialog(tmpConfObj);
                if(tmpResult == 'btn01')
                {
                    
                }
                else if(tmpResult == 'btn02')
                {
                    return
                }
            }
            let tmpRowData = this.isRowMerge('PAY',{TYPE:pType})
            //SATIR BİRLEŞTİR        
            if(typeof tmpRowData != 'undefined')
            {
                await this.payRowUpdate(tmpRowData,{AMOUNT:Number(parseFloat(Number(pAmount) + tmpRowData.AMOUNT).toFixed(2)),CHANGE:0})
            }
            else
            {
                await this.payRowAdd({PAY_TYPE:pType,AMOUNT:pAmount,CHANGE:0})
            }            
        }    
        
        if(this.state.payRest == 0)
        {
            this.posObj.dt()[0].STATUS = 1
            await this.calcGrandTotal()
            this.popTotal.hide()

            if(this.state.payChange > 0)
            {
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Bilgi",
                    showCloseButton:true,
                    width:'500px',
                    height:'250px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div><h3 className="text-danger text-center">{this.state.payChange + " EUR"}</h3><h3 className="text-primary text-center">Para üstü veriniz.</h3></div>)
                }
                await dialog(tmpConfObj);
            }
            
            this.init()
        }
    }
    payRowAdd(pPayData)
    {
        return new Promise(async resolve => 
        {
            let tmpTypeName = ""
            if(pPayData.PAY_TYPE == 0)
                tmpTypeName = "ESC"
            else if(pPayData.PAY_TYPE == 1)
                tmpTypeName = "CB"
            else if(pPayData.PAY_TYPE == 2)
                tmpTypeName = "CHQ"
            
            this.posObj.posPay.addEmpty()
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = pPayData.PAY_TYPE
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = tmpTypeName
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(pPayData.AMOUNT).toFixed(2))
            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = pPayData.CHANGE
    
            await this.calcGrandTotal();
            resolve()
        });
    }
    payRowUpdate(pRowData,pPayData)
    {
        return new Promise(async resolve => 
        {
            pRowData.AMOUNT = pPayData.AMOUNT
            pRowData.CHANGE = pPayData.CHANGE
    
            await this.calcGrandTotal();
            resolve()
        });
    }
    descSave(pTag,pDesc,pLineNo)
    {
        return new Promise(async resolve => 
        {
            let tmpDt = this.posObj.posExtra.dt().where({TAG:pTag})
            if(tmpDt.length > 0)
            {
                tmpDt[0].DESCRIPTION = pDesc
            }
            else
            {
                this.posObj.posExtra.addEmpty()
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].TAG = pTag
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].POS_GUID = this.posObj.dt()[this.posObj.dt().length - 1].GUID
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].LINE_NO = pLineNo
                this.posObj.posExtra.dt()[this.posObj.posExtra.dt().length - 1].DESCRIPTION = pDesc
            }
            await this.posObj.save()
            resolve()
        });
    }
    async delete()
    {
        this.posObj.dt().removeAt(0)
        await this.posObj.save()
        this.init()
    }
    async rowDelete()
    {
        if(this.posObj.posSale.dt().length > 1)
        {
            if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
            {
                this.grdList.devGrid.deleteRow(this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]))
            }
            await this.calcGrandTotal()
        }
        else
        {
            this.delete()
        }
    }
    render()
    {
        return(
            <div>                
                <div className="top-bar row">
                    <div className="col-12">                    
                        <div className="row m-2">
                            <div className="col-1">
                                <img src="./css/img/logo2.png" width="50px" height="50px"/>
                            </div>
                            <div className="col-1">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-white fa-solid fa-user p-2"></i>
                                        <span className="text-white">{this.user.CODE}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-tv p-2"></i>
                                        <span className="text-light">004</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                
                                        <i className="text-white fa-solid fa-circle-user p-2"></i>
                                        <span className="text-white">{this.state.customerName}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-user-plus p-2"></i>
                                        <span className="text-light">{this.state.customerPoint}</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-white fa-solid fa-calendar p-2"></i>
                                        <span className="text-white">{this.state.date}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-clock p-2"></i>
                                        <span className="text-light">{this.state.time}</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-1 offset-3 px-1">
                                <NbButton id={"btnRefresh"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    document.location.reload()
                                }}>
                                    <i className="text-white fa-solid fa-arrows-rotate" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 px-1">
                                <NbButton id={"btnPluEdit"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {       
                                    if(this.pluBtnGrp.edit)
                                    {
                                        this.pluBtnGrp.edit = false
                                        this.pluBtnGrp.save()                   
                                    }                              
                                    else
                                    {
                                        this.pluBtnGrp.edit = true
                                    }                   
                                    this.setState({isPluEdit:this.pluBtnGrp.edit})
                                }}>
                                    <i className={this.state.isPluEdit == true ? "text-white fa-solid fa-lock-open" : "text-white fa-solid fa-lock"} style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 ps-1 pe-3">
                                <NbButton id={"btnClose"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    
                                }}>
                                    <i className="text-white fa-solid fa-power-off" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="row p-2">
                    {/* Left Column */}
                    <div className="col-6">
                        {/* txtBarcode */}
                        <div className="row">
                            <div className="col-12">
                                <NdTextBox id="txtBarcode" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:"01",
                                            icon:"more",
                                            onClick:()=>
                                            {
                                                this.popItemList.show()
                                            }
                                        },
                                        {
                                            id:"02",
                                            icon:"arrowdown",
                                            onClick:async ()=>
                                            {
                                                if(this.txtBarcode.value != '')
                                                {
                                                    let tmpDt = new datatable(); 
                                                    tmpDt.selectCmd = 
                                                    {
                                                        query : "SELECT BARCODE,NAME,PRICE_SALE FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE BARCODE LIKE '%' + @BARCODE",
                                                        param : ['BARCODE:string|25']
                                                    }
                                                    tmpDt.selectCmd.value = [this.txtBarcode.value]
                                                    await tmpDt.refresh();
                                                    
                                                    await this.grdBarcodeList.dataRefresh({source:tmpDt});
                                                    this.popBarcodeList.show()
                                                    this.txtBarcode.value = ""
                                                }
                                            }
                                        }
                                    ]
                                }
                                onKeyDown={(async(e)=>
                                {                                    
                                    if(e.event.key == 'Enter')
                                    {
                                        this.getItem(this.txtBarcode.value)
                                    }
                                }).bind(this)} 
                                >     
                                </NdTextBox>  
                            </div>                            
                        </div>
                        {/* grdList */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"156px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";                                        
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onCellClick={async (e)=>
                                {
                                    if(e.column.dataField == "QUANTITY")
                                    {
                                        if(this.prmObj.filter({ID:'QuantityEdit',TYPE:0}).getValue() == true)
                                        {                                            
                                            let tmpResult = await this.popNumber.show('Miktar',e.value)
                                            if(typeof tmpResult != 'undefined' && tmpResult != '')
                                            {
                                                let tmpData = {QUANTITY:tmpResult,PRICE:e.key.PRICE}
                                                this.saleRowUpdate(e.key,tmpData)
                                            }
                                        }
                                    }
                                    if(e.column.dataField == "PRICE")
                                    {
                                        if(this.prmObj.filter({ID:'PriceEdit',TYPE:0}).getValue() == true)
                                        {
                                            let tmpResult = await this.popNumber.show('Fiyat',e.value)
                                            if(typeof tmpResult != 'undefined' && tmpResult != '')
                                            {
                                                let tmpData = {QUANTITY:e.key.QUANTITY,PRICE:tmpResult}
                                                this.saleRowUpdate(e.key,tmpData)
                                            }
                                        }
                                    }
                                }}
                                >
                                    <Editing confirmDelete={false}/>
                                    <Column dataField="LINE_NO" caption={"NO"} width={40} alignment={"center"} defaultSortOrder="desc"/>
                                    <Column dataField="ITEM_NAME" caption={"ADI"} width={350} />
                                    <Column dataField="QUANTITY" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="PRICE" caption={"FIYAT"} width={100}/>
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-3">
                                        <p className="text-primary text-start m-0">T.Satır : <span className="text-dark">{this.state.totalRowCount}</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">T.Ürün Mik.: <span className="text-dark">{this.state.totalItemCount}</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Sadakat İndirim : <span className="text-dark">{parseFloat(this.state.totalLoyalty).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Ticket Rest.: <span className="text-dark">{parseFloat(this.state.totalTicRest).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Ara Toplam : <span className="text-dark">{parseFloat(this.state.totalSub).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Kdv : <span className="text-dark">{parseFloat(this.state.totalVat).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">İndirim : <span className="text-dark">{parseFloat(this.state.totalDiscount).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-2 fw-bold text-center m-0">{parseFloat(this.state.totalGrand).toFixed(2)} €</p>
                            </div>
                        </div>
                        {/* Button Console */}
                        <div className="row">
                            <div className="col-12">
                                {/* Line 1 */}
                                <div className="row px-2">
                                    {/* Total */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnTotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.posObj.posSale.dt().length == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Satış işlemi yapmadan tahsilat giremezsiniz !"}</div>)
                                                }
                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            }                 
                                            this.rbtnPayType.value = 0                                                                       
                                            this.popTotal.show();
                                        }}>
                                            <i className="text-white fa-solid fa-euro-sign" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Credit Card */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCreditCard"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {                  
                                            if(this.posObj.posSale.dt().length == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Satış işlemi yapmadan tahsilat giremezsiniz !"}</div>)
                                                }
                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            }                                       
                                            this.popCardPay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-credit-card" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey7"} parent={this} keyBtn={{textbox:"txtBarcode",key:"7"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-7" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 8 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey8"} parent={this} keyBtn={{textbox:"txtBarcode",key:"8"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-8" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 9 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey9"} parent={this} keyBtn={{textbox:"txtBarcode",key:"9"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-9" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Check */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCheck"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className="row px-2">
                                    {/* Safe Open */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnSafeOpen"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {                             
                                            this.popAccessPass.show();                                            
                                        }}
                                        >
                                            <i className="text-white fa-solid fa-inbox" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Cash */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCash"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {           
                                            if(this.posObj.posSale.dt().length == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Satış işlemi yapmadan tahsilat giremezsiniz !"}</div>)
                                                }
                                                let tmpMsgResult = await dialog(tmpConfObj);
                                                if(tmpMsgResult == 'btn01')
                                                {
                                                    return
                                                }
                                            }                   
                                            this.popCashPay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-money-bill-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey4"} parent={this} keyBtn={{textbox:"txtBarcode",key:"4"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-4" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey5"} parent={this} keyBtn={{textbox:"txtBarcode",key:"5"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-5" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey6"} parent={this} keyBtn={{textbox:"txtBarcode",key:"6"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-6" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Backspace */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyBs"} parent={this} keyBtn={{textbox:"txtBarcode",key:"Backspace"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 3 */}
                                <div className="row px-2">
                                    {/* Discount */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnDiscount"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {   
                                            this.rbtnDisType.value = 0
                                            this.rbtnDisType._onClick(0)
                                            this.popDiscount.show()
                                        }}>
                                            <i className="text-white fa-solid fa-percent" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Ticket */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnTicket"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popTicket.show();
                                        }}>
                                            <i className="text-white fa-solid fa-ticket" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey1"} parent={this} keyBtn={{textbox:"txtBarcode",key:"1"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey2"} parent={this} keyBtn={{textbox:"txtBarcode",key:"2"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-2" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey3"} parent={this} keyBtn={{textbox:"txtBarcode",key:"3"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-3" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* X */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyX"} parent={this} keyBtn={{textbox:"txtBarcode",key:"*"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 4 */}
                                <div className="row px-2">
                                    {/* Calculator */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCalculator"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.Calculator.show();
                                        }}>
                                            <i className="text-white fa-solid fa-calculator" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Info */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnInfo"} parent={this} className={this.state.isBtnInfo == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.state.isBtnInfo)
                                            {
                                                this.setState({isBtnInfo:false})
                                            }
                                            else
                                            {
                                                this.setState({isBtnInfo:true})
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-info" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* . */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyDot"} parent={this} keyBtn={{textbox:"txtBarcode",key:"."}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"26pt"}}>.</NbButton>
                                    </div>
                                    {/* 0 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey0"} parent={this} keyBtn={{textbox:"txtBarcode",key:"0"}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-0" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* -1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnNegative1"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}
                                        onClick={async ()=>
                                        {
                                            if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                            {
                                                if(this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY > 1)
                                                {
                                                    let tmpData = 
                                                    {
                                                        QUANTITY:this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY - 1,
                                                        PRICE:this.grdList.devGrid.getSelectedRowsData()[0].PRICE
                                                    }
                                                    this.saleRowUpdate(this.grdList.devGrid.getSelectedRowsData()[0],tmpData)
                                                }
                                            }
                                        }}>-1</NbButton>
                                    </div>
                                    {/* +1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnPlus1"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}
                                        onClick={async ()=>
                                        {
                                            if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                            {
                                                let tmpData = 
                                                {
                                                    QUANTITY:this.grdList.devGrid.getSelectedRowsData()[0].QUANTITY + 1,
                                                    PRICE:this.grdList.devGrid.getSelectedRowsData()[0].PRICE
                                                }
                                                this.saleRowUpdate(this.grdList.devGrid.getSelectedRowsData()[0],tmpData)
                                            }
                                        }}>+1</NbButton>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-6">
                        {/* Button Console */}
                        <div className="row">
                            <div className="col-12">
                                {/* Line 1-2-3-4 */}
                                <div className="row px-2">
                                    <div className="col-2">
                                        {/* Up */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnUp"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        let tmpRowIndex = this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                                        if(tmpRowIndex > 0)
                                                        {
                                                            this.grdList.devGrid.selectRowsByIndexes(tmpRowIndex - 1)
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-arrow-up" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Down */}
                                        <div className="row">
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnDown"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        let tmpRowIndex = this.grdList.devGrid.getRowIndexByKey(this.grdList.devGrid.getSelectedRowKeys()[0]);
                                                        if(tmpRowIndex < (this.grdList.devGrid.totalCount() - 1))
                                                        {
                                                            this.grdList.devGrid.selectRowsByIndexes(tmpRowIndex + 1)
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-arrow-down" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnDelete"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={async()=>
                                                {
                                                    if(this.posObj.posSale.dt().length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:"Tamam",location:'before'},{id:"btn02",caption:"İptal",location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Evrakı iptal etmek istediğinize eminmisiniz ?"}</div>)
                                                        }
                                                        let tmpResult = await dialog(tmpConfObj);
                                                        if(tmpResult == "btn01")
                                                        {
                                                            this.popDeleteDesc.show()
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Line Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btnLineDelete"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                                onClick={async ()=>
                                                {
                                                    if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:"Tamam",location:'before'},{id:"btn02",caption:"İptal",location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Satırı iptal etmek istediğinize eminmisiniz ?"}</div>)
                                                        }
                                                        let tmpResult = await dialog(tmpConfObj);
                                                        if(tmpResult == "btn01")
                                                        {
                                                            this.popRowDeleteDesc.show()
                                                        }
                                                    }
                                                }}>
                                                    <i className="text-white fa-solid fa-outdent" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-10">
                                        <NbPluButtonGrp id="pluBtnGrp" parent={this} 
                                        onSelection={(pItem)=>
                                        {
                                            this.txtBarcode.value = pItem;
                                            this.getItem(pItem)
                                        }}/>
                                    </div>
                                </div>  
                                {/* Line 5 */}
                                <div className="row px-2">
                                    {/* Item Return */}
                                    <div className="col px-1">
                                        <NbButton id={"btnItemReturn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="col px-1">
                                        <NbButton id={"btnSubtotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-plus-minus" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 6 */}
                                <div className="row px-2">
                                    {/* Park List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnParkList"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {            
                                            let tmpParkDt = new datatable()
                                            tmpParkDt.selectCmd =
                                            {
                                                query : "SELECT GUID,LUSER_NAME,LDATE,TOTAL, " + 
                                                        "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_GUID = POS_VW_01.GUID AND TAG = 'PARK DESC'),'') AS DESCRIPTION " +
                                                        "FROM POS_VW_01 WHERE STATUS = 0",
                                            }
                                            await tmpParkDt.refresh();
                                            await this.grdPopParkList.dataRefresh({source:tmpParkDt});             
                                            this.popParkList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-arrow-up-right-from-square" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Advance */}
                                    <div className="col px-1">
                                        <NbButton id={"btnAdvance"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-circle-dollar-to-slot" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 7 */}
                                <div className="row px-2">
                                    {/* Park */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPark"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.posObj.posSale.dt().length > 0)
                                            {
                                                this.popParkDesc.show()
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-arrow-right-to-bracket" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer Point */}
                                    <div className="col px-1">
                                        <NbButton id={"btnCustomerPoint"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-gift" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 8 */}
                                <div className="row px-2">
                                    {/* Get Customer */}
                                    <div className="col px-1">
                                        <NbButton id={"btnGetCustomer"} parent={this} className={this.state.isBtnGetCustomer == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.state.isBtnGetCustomer)
                                            {
                                                this.setState({isBtnGetCustomer:false})
                                            }
                                            else
                                            {
                                                this.setState({isBtnGetCustomer:true})
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-user" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer List */}
                                    <div className="col px-1">
                                        <NbButton id={"btnCustomerList"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                             
                                            this.popCustomerList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-users" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Print */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPrint"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popLastSaleList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>       
                            </div>
                        </div>
                    </div>
                </div>
                {/* Total Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ara Toplam"}
                    container={"#root"} 
                    width={"600"}
                    height={"590"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-12">
                                {/* Top Total Indicator */}
                                <div className="row">
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">{parseFloat(this.state.totalGrand).toFixed(2)} €</span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">{parseFloat(this.state.payRest).toFixed(2)} €</span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Para Üstü : <span className="text-dark">{parseFloat(this.state.payChange).toFixed(2)}€</span></p>    
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2 pe-1">
                                        <NbRadioButton id={"rbtnPayType"} parent={this} 
                                        button={
                                            [
                                                {
                                                    id:"btn01",

                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-money-bill-1",
                                                    text:"ESC"
                                                },
                                                {
                                                    id:"btn02",
                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-credit-card",
                                                    text:"CB"
                                                },
                                                {
                                                    id:"btn03",
                                                    style:{height:'66px',width:'100%'},
                                                    icon:"fa-rectangle-list",
                                                    text:"CHQ"
                                                }
                                            ]
                                        }/>
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-7">
                                        <div className="row">
                                            <div className="col-12">
                                                <NdGrid parent={this} id={"grdPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={"138px"} 
                                                width={"100%"}
                                                dbApply={false}
                                                selection={{mode:"single"}}
                                                onRowPrepared={(e)=>
                                                {
                                                    e.rowElement.style.fontSize = "13px";
                                                }}
                                                onRowRemoved={async (e) =>
                                                {
                                                    await this.calcGrandTotal();
                                                }}
                                                >
                                                    <Column dataField="PAY_TYPE_NAME" width={100} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" width={40}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <NdTextBox id="txtPopTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div>                                        
                                    </div>
                                    {/* Cash Button Group */}
                                    <div className="col-3">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,1)}}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,2)}}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,5)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    {/* Number Board */}
                                    <div className="col-6">
                                        <NbNumberboard id={"numPopTotal"} parent={this} textobj="txtPopTotal" span={1} buttonHeight={"60px"}/>
                                    </div>
                                    <div className="col-6">
                                        <div className="row pb-1">
                                            {/* T.R Detail */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                                    T.R Detay
                                                </NbButton>
                                            </div>
                                            {/* 10 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,10)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Line Delete */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>
                                                {
                                                    if(this.grdPay.devGrid.getSelectedRowKeys().length > 0)
                                                    {
                                                        this.grdPay.devGrid.deleteRow(this.grdPay.devGrid.getRowIndexByKey(this.grdPay.devGrid.getSelectedRowKeys()[0]))
                                                    }
                                                }}>
                                                    Satır İptal
                                                </NbButton>
                                            </div>
                                            {/* 20 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,20)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Cancel */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>{this.popTotal.hide()}}>
                                                    Vazgeç
                                                </NbButton>
                                            </div>
                                            {/* 50 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,50)}}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Okey */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                                onClick={()=>{this.payAdd(this.rbtnPayType.value,this.txtPopTotal.value)}}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            {/* 100 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.rbtnPayType.value = 0;this.payAdd(0,100)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Card Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCardPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Kart Ödeme"}
                    container={"#root"} 
                    width={"300"}
                    height={"510"}
                    position={{of:"#root"}}
                    >
                        {/* Top Total Indicator */}
                        <div className="row">
                            <div className="col-12">
                               <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">{parseFloat(this.state.totalGrand).toFixed(2)} €</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">{parseFloat(this.state.payRest).toFixed(2)} €</span></p>    
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {/* txtPopCardPay */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCardPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopCardPay */}
                        <div className="row pt-2">                            
                            <div className="col-12">
                                <NbNumberboard id={"numPopCardPay"} parent={this} textobj="txtPopCardPay" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopCardPaySend */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopCardPaySend"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>{this.payAdd(1,this.txtPopCardPay.value)}}>
                                    Gönder
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Cash Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCashPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Nakit Ödeme"}
                    container={"#root"} 
                    width={"600"}
                    height={"570"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-9">
                                {/* Top Total Indicator */}
                                <div className="row pb-3">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">{parseFloat(this.state.totalGrand).toFixed(2)} €</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">{parseFloat(this.state.payRest).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                                {/* txtPopCashPay */}
                                <div className="row pt-5">
                                    <div className="col-12">
                                        <NdTextBox id="txtPopCashPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                        </NdTextBox> 
                                    </div>
                                </div>
                                {/* numPopCashPay */}
                                <div className="row pt-2">                            
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopCashPay"} parent={this} textobj="txtPopCashPay" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                {/* numPopCashPay */}
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopCashPayOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={()=>{this.payAdd(0,this.txtPopCashPay.value)}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row">
                                    <div className="col-12">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,1)}}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,2)}}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,5)}}/>
                                            </div>
                                        </div>
                                        {/* 10 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,10)}}/>
                                            </div>
                                        </div>
                                        {/* 20 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,20)}}/>
                                            </div>
                                        </div>
                                        {/* 50 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,50)}}/>
                                            </div>
                                        </div>
                                        {/* 100 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>{this.payAdd(0,100)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                                
                    </NdPopUp>
                </div>
                {/* Access Pass Popup */}
                <div>
                    <NdPopUp parent={this} id={"popAccessPass"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Yetkili Şifresi Giriniz"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopAccessPass" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row pt-2">
                            {/* Number Board */}
                            <div className="col-12">
                                <NbNumberboard id={"numPopAccessPass"} parent={this} textobj="txtPopAccessPass" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopAccessPass"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Number Popup */}
                <div>
                    <NbPopNumber id={"popNumber"} parent={this}/>
                </div>
                {/* Price Popup */}
                <div>
                    <NdPopUp parent={this} id={"popPrice"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Fiyat"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopPrice */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopPrice" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* numPopPrice */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbNumberboard id={"numPopPrice"} parent={this} textobj="txtPopPrice" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopPriceOk */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopPriceOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>  
                {/* Customer List Popup */}
                <div>
                    <NbPosPopGrid id={"popCustomerList"} parent={this} width={"900"} height={"650"} position={"#root"} title={"Müşteri Listesi"}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,TITLE,ADRESS,0 AS CUSTOMER_POINT FROM [dbo].[CUSTOMER_VW_02] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.posObj.dt().CUSTOMER_GUID = pData[0].GUID
                            this.posObj.dt().CUSTOMER_CODE = pData[0].CODE
                            this.posObj.dt().CUSTOMER_NAME = pData[0].TITLE
                            
                            this.setState({customerName:pData[0].TITLE,customerPoint:pData[0].CUSTOMER_POINT})
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="TITLE" caption={"NAME"} width={250} />
                        <Column dataField="ADRESS" caption={"ADRESS"} width={350}/>
                        <Column dataField="CUSTOMER_POINT" caption={"POINT"} width={100}/>
                    </NbPosPopGrid>
                </div>
                {/* Item List Popup */}
                <div>
                    <NbPosPopGrid id={"popItemList"} parent={this} width={"900"} height={"650"} position={"#root"} title={"Ürün Listesi"}
                    data={{source:
                    {
                        select:
                        {
                            query : "SELECT CODE,NAME FROM [dbo].[ITEMS_VW_01] WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }}}
                    onSelection={(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            this.txtBarcode.value = pData[0].CODE;
                            this.getItem(pData[0].CODE)
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={100} />
                        <Column dataField="NAME" caption={"NAME"} width={250} />
                    </NbPosPopGrid>
                </div>
                {/* Barcode List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popBarcodeList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Barkod Listesi"}
                    container={"#root"} 
                    width={"600"}
                    height={"400"}
                    position={{of:"#root"}}
                    >
                        {/* grdBarcodeList */}
                        <div className="row">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdBarcodeList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"305px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";                                        
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                onSelectionChanged={(e)=>
                                {
                                    this.txtBarcode.value = e.currentSelectedRowKeys[0].BARCODE
                                    this.getItem(e.currentSelectedRowKeys[0].BARCODE)
                                    this.popBarcodeList.hide()
                                }}
                                >
                                    <Column dataField="BARCODE" caption={"BARCODE"} width={100}/>
                                    <Column dataField="NAME" caption={"NAME"} width={350} />
                                    <Column dataField="PRICE" caption={"PRICE"} width={100}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NdPopUp>    
                </div>
                {/* Park List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popParkList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Park daki İşlemler"}
                    container={"#root"} 
                    width={"900"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        {/* grdPopParkList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopParkList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"425px"} 
                                width={"100%"}
                                dbApply={false}
                                selection={{mode:"single"}}
                                onRowPrepared={(e)=>
                                {
                                    if(e.rowType == "header")
                                    {
                                        e.rowElement.style.fontWeight = "bold";    
                                    }
                                    e.rowElement.style.fontSize = "13px";
                                }}
                                onCellPrepared={(e)=>
                                {
                                    e.cellElement.style.padding = "4px"
                                }}
                                >
                                    <Column dataField="LUSER_NAME" caption={"USER"} width={120} alignment={"center"}/>
                                    <Column dataField="LDATE" caption={"DATE"} width={150} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"} />
                                    <Column dataField="TOTAL" caption={"AMOUNT"} width={100}/>
                                    <Column dataField="DESCRIPTION" caption={"DESCRIPTION"} width={400}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* btnPopParkListSelect */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopParkListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={()=>
                                {
                                    if(this.grdPopParkList.devGrid.getSelectedRowsData().length > 0)
                                    {
                                        this.getDoc(this.grdPopParkList.devGrid.getSelectedRowsData()[0].GUID)
                                        this.popParkList.hide()
                                    }
                                }}>Seç</NbButton> 
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Ticket Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTicket"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ticket Giriş"}
                    container={"#root"} 
                    width={"900"}
                    height={"585"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopTicket */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopTicket" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* grdPopTicketList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopTicketList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"280px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Last Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Son Okutulan : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                        {/* Total Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Toplam Okutulan : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                        {/* Rest */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Kalan Ödeme : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Calculator Popup */}
                <div>
                    <NbCalculator parent={this} id={"Calculator"}></NbCalculator>
                </div>
                {/* Discount Popup */}     
                <div>
                    <NdPopUp parent={this} id={"popDiscount"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"İskonto"}
                    container={"#root"} 
                    width={"600"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        {/* Discount Header */}
                        <div className="row pb-1">
                            <div className="col-4">
                                <NbRadioButton id={"rbtnDisType"} parent={this} 
                                button={
                                [
                                    {
                                        id:"btn01",

                                        style:{height:'40px',width:'100%'},
                                        text:"Evrak"
                                    },
                                    {
                                        id:"btn02",
                                        style:{height:'40px',width:'100%'},
                                        text:"Satır"
                                    }
                                ]}
                                onClick={(e)=>
                                {
                                    let tmpData = {}
                                    if(e == 0) //EVRAK SEÇİLİ İSE
                                    {
                                        tmpData = this.posObj.dt()[0]
                                    }
                                    else if(e == 1) //SATIR SEÇİLİ İSE
                                    {
                                        if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                        {
                                            tmpData = this.grdList.devGrid.getSelectedRowsData()[0]
                                        }
                                    }

                                    let tmpDiscount = Number(parseFloat(tmpData.DISCOUNT).toFixed(2))
                                    let tmpBefore = Number(parseFloat(tmpData.AMOUNT).toFixed(2));
                                    let tmpAfter = Number(parseFloat(tmpData.AMOUNT - tmpData.DISCOUNT).toFixed(2))
                                    
                                    this.setState({discountBefore:tmpBefore,discountAfter:tmpAfter})       
                                    
                                    this.txtPopDiscountPercent.value = parseFloat((tmpDiscount / tmpBefore) * 100).toFixed(2)
                                    this.txtPopDiscountAmount.value = parseFloat(tmpDiscount).toFixed(2)    
                                }}/>
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-danger text-center">Öncesi</h3>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-primary text-center">{parseFloat(this.state.discountBefore).toFixed(2)} €</h3>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-danger text-center">Sonrası</h3>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-primary text-center">{parseFloat(this.state.discountAfter).toFixed(2)} €</h3>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Discount Input */}
                        <div className="row py-1">
                            {/* txtPopDiscountPercent */}
                            <div className="col-6">
                                <NdTextBox id="txtPopDiscountPercent" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                onFocusIn={()=>{this.numPopDiscount.textobj = "txtPopDiscountPercent"}}
                                onValueChanged={(e)=>
                                {
                                    if(this.numPopDiscount.textobj == "txtPopDiscountPercent")
                                    {
                                        this.txtPopDiscountAmount.value = parseFloat(this.state.discountBefore * Number(e.value / 100)).toFixed(2)
                                    }
                                }}>     
                                </NdTextBox> 
                            </div>
                            {/* txtPopDiscountAmount */}
                            <div className="col-6">
                                <NdTextBox id="txtPopDiscountAmount" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                onFocusIn={()=>{this.numPopDiscount.textobj = "txtPopDiscountAmount"}}
                                onValueChanged={(e)=>
                                {
                                    if(this.numPopDiscount.textobj == "txtPopDiscountAmount")
                                    {
                                        this.txtPopDiscountPercent.value = parseFloat(Number(parseFloat(e.value / this.state.discountBefore).toFixed(3)) * 100).toFixed(2)
                                    }
                                }}>     
                                </NdTextBox> 
                            </div>                            
                        </div>
                        {/* Discount Number Board */}
                        <div className="row py-1">
                            <div className="col-9">
                                {/* numPopDiscount */}
                                <div className="row pb-1">
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopDiscount"} parent={this} textobj="txtPopDiscountPercent" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    {/* btnPopDiscountDel */}
                                    <div className="col-4 pe-1">
                                        <NbButton id={"btnPopDiscountDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                            {
                                                let tmpAmount = Number(parseFloat(this.posObj.posSale.dt()[i].AMOUNT - this.posObj.posSale.dt()[i].LOYALTY).toFixed(2))
                                                
                                                let tmpVat = Number(parseFloat(this.posObj.posSale.dt()[i].AMOUNT * (this.posObj.posSale.dt()[i].VAT_RATE / 100)))
                                                let tmpTotal = Number(parseFloat(tmpAmount + tmpVat).toFixed(2))
                                                
                                                this.posObj.posSale.dt()[i].DISCOUNT = 0
                                                this.posObj.posSale.dt()[i].VAT = tmpVat
                                                this.posObj.posSale.dt()[i].TOTAL = tmpTotal
                                            }
                                            await this.calcGrandTotal()
                                            this.popDiscount.hide()
                                        }}>
                                            <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopDiscountOk */}
                                    <div className="col-8 ps-1">
                                        <NbButton id={"btnPopDiscountOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.posObj.posPay.dt().length > 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'before'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"İndirim Yapmadan Önce Lütfen Tüm Ödemeleri Siliniz !"}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                            if(this.txtPopDiscountAmount.value <= 0 || this.txtPopDiscountPercent <= 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'before'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Sıfır İskonto Yapılamaz !"}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }
                                            if(this.state.discountAfter < 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'before'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Tutardan Fazla İskonto Yapılamaz.!"}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return;
                                            }

                                            if(this.rbtnDisType.value == 0) //EVRAK İSKONTO
                                            {                                                                                                
                                                for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                                {
                                                    let tmpDiscountRate = Number(parseFloat(this.txtPopDiscountPercent.value / 100).toFixed(3))                                                    
                                                    let tmpDiscount = Number(parseFloat(this.posObj.posSale.dt()[i].AMOUNT * tmpDiscountRate).toFixed(2))
                                                    let tmpAmount = Number(parseFloat(this.posObj.posSale.dt()[i].AMOUNT - (tmpDiscount + this.posObj.posSale.dt()[i].LOYALTY)).toFixed(2))
                                                    
                                                    let tmpVat = Number(parseFloat(tmpAmount * (this.posObj.posSale.dt()[i].VAT_RATE / 100)))
                                                    let tmpTotal = Number(parseFloat(tmpAmount + tmpVat).toFixed(2))
                                                    
                                                    this.posObj.posSale.dt()[i].DISCOUNT = tmpDiscount
                                                    this.posObj.posSale.dt()[i].VAT = tmpVat
                                                    this.posObj.posSale.dt()[i].TOTAL = tmpTotal
                                                }                                                
                                            }
                                            else if(this.rbtnDisType.value == 1) //SATIR İSKONTO
                                            {
                                                if(this.grdList.devGrid.getSelectedRowsData().length > 0)
                                                {
                                                    let tmpData = this.grdList.devGrid.getSelectedRowsData()[0]

                                                    let tmpDiscountRate = Number(parseFloat(this.txtPopDiscountPercent.value / 100).toFixed(3))                                                    
                                                    let tmpDiscount = Number(parseFloat(tmpData.AMOUNT * tmpDiscountRate).toFixed(2))
                                                    let tmpAmount = Number(parseFloat(tmpData.AMOUNT - (tmpDiscount + tmpData.LOYALTY)).toFixed(2))
                                                    
                                                    let tmpVat = Number(parseFloat(tmpAmount * (tmpData.VAT_RATE / 100)))
                                                    let tmpTotal = Number(parseFloat(tmpAmount + tmpVat).toFixed(2))
                                                    
                                                    tmpData.DISCOUNT = tmpDiscount
                                                    tmpData.VAT = tmpVat
                                                    tmpData.TOTAL = tmpTotal
                                                }
                                            }
                                            await this.calcGrandTotal()
                                            this.popDiscount.hide()
                                        }}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                {/* btnPopDiscount10 */}
                                <div className="row pb-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount10"} parent={this} className="form-group btn btn-primary btn-block" 
                                        onClick={()=>{this.txtPopDiscountPercent.value = 10}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 10
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount20 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount20"} parent={this} className="form-group btn btn-primary btn-block" 
                                        onClick={()=>{this.txtPopDiscountPercent.value = 20}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 20
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount30 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount30"} parent={this} className="form-group btn btn-primary btn-block" 
                                        onClick={()=>{this.txtPopDiscountPercent.value = 30}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 30
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount40 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount40"} parent={this} className="form-group btn btn-primary btn-block" 
                                        onClick={()=>{this.txtPopDiscountPercent.value = 40}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 40
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount50 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount50"} parent={this} className="form-group btn btn-primary btn-block" 
                                        onClick={()=>{this.txtPopDiscountPercent.value = 50}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 50
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Last Sale List Popup */} 
                <div>
                    <NbPopUp id="popLastSaleList" parent={this} title={"Son Satış Listesi"}>
                        {/* Tool Button Group */} 
                        <div className="row pb-1">
                            <div className="offset-10 col-2">
                                <div className="row px-2">
                                    {/* btnPopLastSaleTRest */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSaleTRest"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-utensils" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSaleFile */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSaleFile"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-file-lines" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSalePrint */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSalePrint"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Filter */}
                        <div className="row py-1">
                            {/* dtPopLastSaleStartDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true}  parent={this} id={"dtPopLastSaleStartDate"}/>
                            </div>
                            {/* dtPopLastSaleFinishDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true}  parent={this} id={"dtPopLastSaleFinishDate"}/>
                            </div>
                            {/* cmbPopLastSalePayType */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbPopLastSalePayType"/>
                            </div>
                            {/* btnPopLastSaleSearch */} 
                            <div className="col-1">
                                <NbButton id={"btnPopLastSaleSearch"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"36px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-magnifying-glass" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                        {/* grdLastSale */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdLastSale"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"TARIH"} width={100}/>
                                    <Column dataField="X11" caption={"SAAT"} width={100}/>    
                                    <Column dataField="XX2" caption={"SERI"} width={40}/>
                                    <Column dataField="XX3" caption={"SIRA"} width={40}/> 
                                    <Column dataField="XX4" caption={"SATIR"} width={40}/>
                                    <Column dataField="XX5" caption={"MÜŞTERİ"} width={200}/> 
                                    <Column dataField="XX6" caption={"KULLANICI"} width={100}/>
                                    <Column dataField="XX7" caption={"INDIRIM"} width={100}/> 
                                    <Column dataField="XX8" caption={"SADAKAT"} width={100}/>
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={100}/>                                             
                                </NdGrid>
                            </div>
                        </div>
                        <div className="row py-1">
                            {/* grdLastSaleItem */}
                            <div className="col-6">
                                <NdGrid parent={this} id={"grdLastSaleItem"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"BARKOD"} width={120}/>
                                    <Column dataField="XX2" caption={"NAME"} width={200}/>    
                                    <Column dataField="XX3" caption={"MIKTAR"} width={50}/>
                                    <Column dataField="XX4" caption={"FIYAT"} width={50}/> 
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={100}/>
                                </NdGrid>
                            </div>
                            {/* grdLastSalePay */}
                            <div className="col-6">
                                <NdGrid parent={this} id={"grdLastSalePay"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"TIP"} width={200}/>
                                    <Column dataField="XX2" caption={"AMOUNT"} width={100}/>    
                                    <Column dataField="XX3" caption={"CHANGE"} width={100}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NbPopUp>
                </div>
                {/* Park Description Popup */} 
                <div>
                    <NbPopDescboard id={"popParkDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"Park Açıklaması"} title={"Lütfen Açıklama Giriniz"}
                    button={
                    [
                        {
                            id:"btn01",
                            text:"Yetersiz Ödeme"
                        },
                        {
                            id:"btn02",
                            text:"Ek Alış Veriş"
                        },
                        {
                            id:"btn03",
                            text:"Mağaza Personeli"
                        },
                        {
                            id:"btn04",
                            text:"K.Kartı Geçmedi"
                        }
                    ]}
                    onClick={async (e)=>
                    {
                        await this.descSave("PARK DESC",e,0)
                        this.init()
                    }}></NbPopDescboard>
                </div>
                {/* Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popDeleteDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"Silme İşlemi Açıklaması"} title={"Lütfen Silme Nedeninizi Giriniz"}
                    button={
                    [
                        {
                            id:"btn01",
                            text:"Alış Verişten Vazgeçti"
                        },
                        {
                            id:"btn02",
                            text:"Yetersiz Ödeme"
                        },
                        {
                            id:"btn03",
                            text:"K.Karti Yetersiz Bakiye"
                        },
                        {
                            id:"btn04",
                            text:"Test Amaçlı"
                        }
                    ]}
                    onClick={async (e)=>
                    {
                        await this.descSave("FULL DELETE",e,0)
                        this.delete()
                    }}></NbPopDescboard>
                </div>
                {/* Row Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popRowDeleteDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"Satır Silme İşlemi Açıklaması"} title={"Lütfen Silme Nedeninizi Giriniz"}
                    button={
                    [
                        {
                            id:"btn01",
                            text:"Üründen Vazgeçti"
                        },
                        {
                            id:"btn02",
                            text:"Fiyat Hatalı"
                        },
                        {
                            id:"btn03",
                            text:"Hatalı Ürün"
                        },
                        {
                            id:"btn04",
                            text:"Test Amaçlı Okutma"
                        }
                    ]}
                    onClick={async (e)=>
                    {
                        await this.descSave("ROW DELETE",e,this.grdList.devGrid.getSelectedRowKeys()[0].LINE_NO)
                        this.rowDelete()
                    }}></NbPopDescboard>
                </div>
            </div>
        )
    }
}