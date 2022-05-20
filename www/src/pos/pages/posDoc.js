import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import Form, { Label,Item } from "devextreme-react/form";
import { ButtonGroup } from "devextreme-react/button-group";
import { LoadPanel } from 'devextreme-react/load-panel';

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
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import NbLabel from "../../core/react/bootstrap/label.js";

import { posCls,posSaleCls,posPaymentCls,posPluCls,posDeviceCls } from "../../core/cls/pos.js";
import { itemsCls } from "../../core/cls/items.js";
import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

export default class posDoc extends React.PureComponent
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
        this.parkDt = new datatable();
        this.cheqDt = new datatable();
        this.barcode = "";

        this.state =
        {
            date:"00.00.0000",
            isPluEdit:false,
            isBtnGetCustomer:false,
            isBtnInfo:false,
            isLoading:false,
            customerName:'',
            customerPoint:0,
            payTotal:0,
            payChange:0,
            payRest:0,
            discountBefore:0,
            discountAfter:0,
            cheqCount:0,
            cheqTotalAmount:0,
            cheqLastAmount:0
        }   

        document.onkeydown = (e) =>
        {
            //EĞER FORMUN ÖNÜNDE POPUP YADA LOADING PANEL VARSA BARCODE TEXTBOX ÇALIŞMIYOR.
            if(document.getElementsByClassName("dx-overlay-wrapper").length > 0)
            {
                // if(e.key == "Enter")
                // {
                //     document.getElementById("Sound").play();
                // }
                return
            }

            if(!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey)
            {
                if(e.key == "Enter")
                {
                    this.txtBarcode.value = this.barcode
                    this.barcode = ""
                    this.txtBarcode.props.onEnterKey()
                }
                else
                {
                    this.barcode = this.barcode + e.key
                }
            }
            
            //this.txtBarcode.focus()
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

        this.init();        
    }
    async init()
    {       
        setInterval(()=>
        {
            this.lblTime.value = moment(new Date(),"HH:mm:ss").format("HH:mm:ss")
            this.lblDate.value = new Date().toLocaleDateString('tr-TR',{ year: 'numeric', month: 'numeric', day: 'numeric' })
        },1000)

        this.posObj.clearAll()
        await this.prmObj.load({PAGE:"pos",APP:'POS'})

        this.posObj.addEmpty()
        this.posObj.dt()[this.posObj.dt().length - 1].DEVICE = '001'

        this.posDevice.lcdPort = this.prmObj.filter({ID:'LCDPort',TYPE:0,SPECIAL:"001"}).getValue()
        this.posDevice.scalePort = this.prmObj.filter({ID:'ScalePort',TYPE:0,SPECIAL:"001"}).getValue()
        this.posDevice.payCardPort = this.prmObj.filter({ID:'PayCardPort',TYPE:0,SPECIAL:"001"}).getValue()
        
        await this.grdList.dataRefresh({source:this.posObj.posSale.dt()});
        await this.grdPay.dataRefresh({source:this.posObj.posPay.dt()});

        this.cheqDt.selectCmd = 
        {
            query : "SELECT * FROM CHEQPAY_VW_01 WHERE DOC = @DOC",
            param : ['DOC:string|50'], 
            value : [this.posObj.dt()[0].GUID]           
        }
        await this.cheqDt.refresh();         

        this.parkDt.selectCmd =
        {
            query : "SELECT GUID,LUSER_NAME,LDATE,TOTAL, " + 
                    "ISNULL((SELECT TOP 1 DESCRIPTION FROM POS_EXTRA WHERE POS_GUID = POS_VW_01.GUID AND TAG = 'PARK DESC'),'') AS DESCRIPTION " +
                    "FROM POS_VW_01 WHERE STATUS = 0 ORDER BY LDATE DESC",
        }
        await this.parkDt.refresh();     

        setTimeout(() => 
        {
            this.posDevice.lcdPrint
            ({
                blink : 0,
                text :  "Bonjour".space(20) + moment(new Date()).format("DD.MM.YYYY").space(20)
            })    
        }, 1000);
        
        await this.calcGrandTotal(false) 

        for (let i = 0; i < this.parkDt.length; i++) 
        {
            if(this.parkDt[i].DESCRIPTION == '')
            {
                this.cheqDt.selectCmd.value = [this.parkDt[i].GUID] 
                await this.cheqDt.refresh();  

                await this.getDoc(this.parkDt[i].GUID)                
                return
            }
        }           
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
            console.log("11 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
            let tmpDt = new datatable(); 
            tmpDt.selectCmd = 
            {
                query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE CODE = @CODE OR BARCODE = @CODE",
                param : ['CODE:string|25'],
                value: [pCode]
            }
            console.log("12 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
            await tmpDt.refresh();
            console.log("13 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
            //UNIQ BARKOD
            if(tmpDt.length == 0)
            {
                tmpDt.selectCmd = 
                {
                    query : "SELECT TOP 1 *,@CODE AS INPUT FROM ITEMS_POS_VW_01 WHERE UNIQ_CODE = @CODE",
                    param : ['CODE:string|25'],
                    value: [pCode]
                }

                await tmpDt.refresh();
            }
            console.log("14 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
            resolve(tmpDt)
        });
    }
    async getItem(pCode)
    {        
        console.log("0 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
        this.txtBarcode.value = ""; 
        let tmpQuantity = 1
        let tmpPrice = 0        

        if(pCode == '')
        {
            return
        }
        if(pCode.substring(0,1) == 'F')
        {
            pCode = pCode.substring(1,pCode.length)
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
        console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))    
        //ÜRÜN GETİRME        
        let tmpItemsDt = await this.getItemDb(pCode)
        console.log("2 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
        if(tmpItemsDt.length > 0)
        {                             
            //******************************************************** */
            //UNIQ BARKODU
            if(tmpItemsDt[0].UNIQ_CODE == tmpItemsDt[0].INPUT)
            {
                tmpQuantity = tmpItemsDt[0].UNIQ_QUANTITY
                tmpPrice = tmpItemsDt[0].UNIQ_PRICE
            }
            //******************************************************** */
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
                    let tmpWResult = await this.getWeighing(tmpPrice)
                    if(typeof tmpWResult != 'undefined')
                    {
                        tmpQuantity = tmpWResult.Result.Scale
                    }
                    else
                    {
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
                            return
                        }
                    }
                    else
                    {
                        //POPUP KAPATILMIŞ İSE YADA FİYAT BOŞ GİRİLMİŞ İSE...
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
                    return
                }
            }
            //**************************************************** */
            tmpItemsDt[0].QUANTITY = tmpQuantity
            tmpItemsDt[0].PRICE = tmpPrice
            this.saleAdd(tmpItemsDt[0])
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
        }
        //******************************************************** */    
    }
    getWeighing(pPrice)
    {
        return new Promise(async resolve => 
        {                        
            this.msgWeighing.show().then(async (e) =>
            {
                if(e == 'btn01')
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
                else if(e == 'btn02')
                {
                    resolve()
                }
            })

            let tmpWeigh = await this.posDevice.mettlerScaleSend(pPrice)
            
            if(typeof tmpWeigh != 'undefined' && tmpWeigh != null)
            {
                this.msgWeighing.hide()
                resolve(tmpWeigh)
            } 
            else
            {
                this.msgWeighing.hide()
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

                this.totalRowCount.value = this.posObj.posSale.dt().length
                this.totalItemCount.value = this.posObj.posSale.dt().sum('QUANTITY',2)
                this.totalLoyalty.value = parseFloat(this.posObj.dt()[0].LOYALTY).toFixed(2) + "€"
                this.totalSub.value = parseFloat(this.posObj.dt()[0].AMOUNT).toFixed(2) + "€"
                this.totalVat.value = parseFloat(this.posObj.dt()[0].VAT).toFixed(2) + "€"
                this.totalDiscount.value = parseFloat(this.posObj.dt()[0].DISCOUNT).toFixed(2) + "€"
                this.totalGrand.value = parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2) + "€"
                this.popTotalGrand.value = parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2) + "€"
                this.popCardTotalGrand.value = parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2) + "€"
                this.popCashTotalGrand.value = parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2) + "€"

                this.state.payChange = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) >= 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)) * -1
                this.state.payRest = (this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)) < 0 ? 0 : Number(parseFloat(this.posObj.dt()[0].TOTAL - this.posObj.posPay.dt().sum('AMOUNT',2)).toFixed(2)); 
                
                this.txtPopTotal.value = parseFloat(this.state.payRest).toFixed(2)
                this.txtPopCardPay.value = parseFloat(this.state.payRest).toFixed(2)
                this.txtPopCashPay.value = parseFloat(this.state.payRest).toFixed(2)   
                
                this.setState(
                {
                    payTotal:this.posObj.posPay.dt().sum('AMOUNT',2),
                    payChange:this.state.payChange,
                    payRest:this.state.payRest,
                    cheqCount:this.cheqDt.length,
                    cheqLastAmount:this.cheqDt.length > 0 ? this.cheqDt[0].AMOUNT : 0,
                    cheqTotalAmount:this.cheqDt.sum('AMOUNT',2)
                })       
                if(this.posObj.posSale.dt().length > 0)
                {
                    this.posDevice.lcdPrint
                    ({
                        blink : 0,
                        text :  this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_NAME.toString().space(11) + " " + 
                                (parseFloat(this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].PRICE).toFixed(2) + "EUR").space(8,"s") +
                                "TOTAL : " + (parseFloat(this.state.payRest).toFixed(2) + "EUR").space(12,"s")
                    })
                }
            }
            console.log("100 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
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
            let tmpData = this.posObj.posSale.dt().where({ITEM_GUID:pData.GUID}).where({SUBTOTAL:0})
            if(tmpData.length > 0)
            {
                //UNIQ ÜRÜN İÇİN pData.INPUT == pData.UNIQ_CODE
                if(pData.SALE_JOIN_LINE == 0 && pData.WEIGHING == 0 && pData.INPUT != pData.UNIQ_CODE)
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
            pItemData.QUANTITY = Number(parseFloat((pItemData.QUANTITY * pItemData.UNIT_FACTOR) + Number(tmpRowData.QUANTITY)).toFixed(3))
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

        let tmpMaxLine = this.posObj.posSale.dt().where({SUBTOTAL:{'<>':-1}}).max('LINE_NO')
        
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
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LINE_NO = tmpMaxLine + 1
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_GUID = pItemData.GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_CODE = pItemData.CODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].ITEM_NAME = pItemData.NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].TICKET_REST = pItemData.TICKET_REST
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].INPUT = pItemData.INPUT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE_GUID = pItemData.BARCODE_GUID
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].BARCODE = pItemData.BARCODE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_GUID = '00000000-0000-0000-0000-000000000000'
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_NAME = pItemData.UNIT_NAME
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_SHORT = pItemData.UNIT_SHORT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].UNIT_FACTOR = pItemData.UNIT_FACTOR
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].QUANTITY = pItemData.QUANTITY
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].PRICE = pItemData.PRICE
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].AMOUNT = pItemData.AMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].DISCOUNT = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].LOYALTY = 0
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT = pItemData.VAT_AMOUNT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT_RATE = pItemData.VAT
        this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].VAT_TYPE = pItemData.VAT_TYPE
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
                this.popCardPay.hide()
                this.msgCardPayment.show().then(async (e) =>
                {
                    if(e == 'btn01')
                    {
                        if((await this.payCard(pAmount)))
                        {
                            this.msgCardPayment.hide()
                        }
                        else
                        {
                            this.msgCardPayment.hide()
                            return
                        }
                    }
                    else if(e == 'btn02')
                    {
                        return
                    }
                })
                
                if((await this.payCard(pAmount)))
                {
                    this.msgCardPayment.hide()
                }
                else
                {
                    this.msgCardPayment.hide()
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
            this.posDevice.lcdPrint
            ({
                blink : 0,
                text :  "A tres bientot".space(20)
            })

            this.posObj.dt()[0].STATUS = 1
            await this.calcGrandTotal()
            this.popTotal.hide()
            this.popCheqpay.hide();
            
            if(this.state.payChange > 0)
            {
                if(pType == 4)
                {
                    this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);
                    await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.state.payChange,0,1);
                }
                else if(this.posObj.posPay.dt().where({TYPE:0}).length > 0)
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
            }
            
            this.init()
        }

        this.print()
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
    payCard(pAmount)
    {
        return new Promise(async resolve => 
        {
            let tmpCardPay = await this.posDevice.cardPayment(pAmount)

            if(typeof tmpCardPay != 'undefined')
            {
                if(tmpCardPay.tag == "response")
                {
                    if(JSON.parse(tmpCardPay.msg).transaction_result != 0)
                    {
                        this.msgCardPayment.hide()
                        let tmpConfObj =
                        {
                            id:'msgAlert',showTitle:true,title:"Bilgi",showCloseButton:true,width:'500px',height:'250px',
                            button:[{id:"btn01",caption:"Tamam",location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Ödeme gerçekleşmedi !"}</div>)
                        }
                        await dialog(tmpConfObj);
                        resolve(false)
                    }
                    else
                    {
                        resolve(true)
                    }
                }
                else
                {
                    resolve(false)
                }
            }
            else
            {
                resolve(false)
            }
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
    async cheqpayAdd(pCode)
    {
        let tmpDt = new datatable();
        let tmpType = 0
        let tmpStatus = 0
        let tmpAmount = 0
        let tmpPayType = 0;

        if(pCode == "")
        {
            return;
        }
        
        if(pCode.substring(0,1) == 'Q')         
        {
            tmpType = 1
            tmpStatus = 1
            tmpPayType = 4
            tmpAmount = Number(parseFloat(pCode.substring(7,12) / 100).toFixed(2))

            if(this.posObj.posPay.dt().where({TYPE:0}).length > 0)
            {
                this.txtPopCheqpay.value = "";
                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Bon d'avoir girmeden önce girili tahsilatları temizleyiniz !"}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }
        }
        else if(pCode.length >= 20 && pCode.length <= 24)
        {   
            tmpType = 0
            tmpStatus = 0            
            tmpPayType = 3

            let tmpTicket = pCode.substring(11,16)
            let tmpYear = pCode.substring(pCode.length - 1, pCode.length);
            let tmpCtrlCode = pCode.substring(16,17)
            
            if(tmpCtrlCode != '1' && tmpCtrlCode != '2' && tmpCtrlCode != '3' && tmpCtrlCode != '4')
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 

                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz ticket."}</div>)
                }
                await dialog(tmpConfObj);
                return
            }

            if(pCode.length == 22)
            {
                tmpTicket = pCode.substring(9,14)
            }    

            tmpAmount = Number(parseFloat(tmpTicket / 100).toFixed(2))
            tmpYear = (parseInt(parseFloat(moment(new Date(),"YY").format("YY")) / 10) * 10) + parseInt(tmpYear)                                            
            if(moment(new Date()).diff(moment('20' + tmpYear + '0101'),"day") > 395)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 

                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz ticket."}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }

            if(tmpAmount > 21)
            {
                this.txtPopCheqpay.value = "";
                document.getElementById("Sound").play(); 

                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz ticket."}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }

            tmpDt.selectCmd = 
            {
                query : "SELECT * FROM CHEQPAY_VW_01 WHERE REFERENCE = @REFERENCE AND TYPE = 0",
                param : ['REFERENCE:string|50'],
                value : [pCode.substring(0,9)]
            }                                            
        }
        else
        {
            this.txtPopCheqpay.value = "";
            document.getElementById("Sound").play(); 

            let tmpConfObj =
            {
                id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:"Tamam",location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz ticket."}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }
        
        await tmpDt.refresh()

        if(tmpDt.length > 0)
        {
            if(tmpDt[0].STATUS == '2')
            {
                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Çalıntı Ticket !"}</div>)
                }
                await dialog(tmpConfObj);
                return;
            }
            else if((tmpDt[0].STATUS == '0' && tmpDt[0].TYPE == '0') || (tmpDt.where({STATUS:'1'}).length > 0 && tmpDt[0].TYPE == '1'))
            {
                let tmpConfObj =
                {
                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Daha önce kullanılmıştır !"}</div>)
                }
                await dialog(tmpConfObj);
                return;                                                
            }
        }

        await this.cheqpaySave(pCode,tmpAmount,tmpStatus,tmpType)
        await this.cheqDt.refresh()

        this.payAdd(tmpPayType,tmpAmount)
        
        this.txtPopCheqpay.value = "";
    }
    async cheqpaySave(pCode,pAmount,pStatus,pType)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : "EXEC [dbo].[PRD_CHEQPAY_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@TYPE = @PTYPE, " +                      
                        "@DOC = @PDOC, " + 
                        "@CODE = @PCODE, " + 
                        "@AMOUNT = @PAMOUNT, " + 
                        "@STATUS = @PSTATUS ", 
                param : ['PCUSER:string|25','PTYPE:int','PDOC:string|50','PCODE:string|25','PAMOUNT:float','PSTATUS:int'],
                value : [this.core.auth.data.CODE,pType,this.posObj.dt()[0].GUID,pCode,pAmount,pStatus]
            }
            await this.core.sql.execute(tmpQuery)
            resolve()
        });
    }
    print()
    {
        let prmPrint = this.prmObj.filter({ID:'PrintDesign',TYPE:0}).getValue()
        
        import("../meta/print/" + prmPrint).then((e)=>
        {
            let tmpData = 
            {
                pos : this.posObj.dt(),
                possale : this.posObj.posSale.dt(),
                pospay : this.posObj.posPay.dt(),
                special : {type:'Fis',safe:'001',ticketCount:5,reprint:false,repas:"0"}
            }
            let x = e.print(tmpData)
            this.posDevice.escPrinter(x)
        })
    }
    render()
    {
        return(
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={this.state.isLoading}
                showIndicator={false}
                shading={true}
                showPane={false}
                message={""}
                />               
                <div className="top-bar row">
                    <div className="col-12">                    
                        <div className="row m-2">
                            <div className="col-1">
                                <img src="./css/img/logo.png" width="50px" height="50px"/>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-user pe-2"></i>{this.user.CODE}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <span className="text-light"><i className="text-light fa-solid fa-tv pe-2"></i>004</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-circle-user pe-2"></i>{this.state.customerName}</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-light"><i className="text-light fa-solid fa-user-plus pe-2"></i>{this.state.customerPoint}</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-white"><i className="text-white fa-solid fa-calendar pe-2"></i><NbLabel id="lblDate" parent={this} value={"00.00.0000"}/></span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                        
                                        <span className="text-light"><i className="text-light fa-solid fa-clock pe-2"></i><NbLabel id="lblTime" parent={this} value={"00:00:00"}/></span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-1 offset-2 px-1">
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
                                    this.core.auth.logout()
                                    window.location.reload()
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
                                button={
                                [
                                    {
                                        id:"01",
                                        icon:"fa-solid fa-magnifying-glass-plus",
                                        onClick:()=>
                                        {
                                            this.popItemList.show()
                                        }
                                    },
                                    {
                                        id:"02",
                                        icon:"fa-solid fa-barcode",
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
                                ]}
                                onEnterKey={(async(e)=>
                                {      
                                    console.log("21 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS")) 
                                    this.getItem(this.txtBarcode.dev.option("text"))                                  
                                    // if(e.event.key == 'Enter')
                                    // {
                                    //     console.log("11 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
                                    //     this.getItem(this.txtBarcode.dev.option("text"))
                                    // }
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
                                loadPanel={{enabled:false}}
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
                                    <Column dataField="ITEM_NAME" caption={"ADI"} width={250} />
                                    <Column dataField="QUANTITY" caption={"MIKTAR"} width={60}/>
                                    <Column dataField="PRICE" caption={"FIYAT"} width={60}/>
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={60}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">T.Satır : <span className="text-dark"><NbLabel id="totalRowCount" parent={this} value={"0"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">T.Mik.: <span className="text-dark"><NbLabel id="totalItemCount" parent={this} value={"0"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Sadakat İndirim : <span className="text-dark"><NbLabel id="totalLoyalty" parent={this} value={"0.00 €"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Ticket Rest.: <span className="text-dark">{this.state.cheqCount + '/' + parseFloat(this.state.cheqTotalAmount).toFixed(2)} €</span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Ara Toplam : <span className="text-dark"><NbLabel id="totalSub" parent={this} value={"0.00 €"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Kdv : <span className="text-dark"><NbLabel id="totalVat" parent={this} value={"0.00 €"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">İndirim : <span className="text-dark"><NbLabel id="totalDiscount" parent={this} value={"0.00 €"}/></span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-2 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00 €"}/></p>
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
                                            this.txtPopTotal.newStart = true;
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
                                            this.txtPopCardPay.newStart = true;
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
                                            this.posDevice.caseOpen();
                                            //this.popAccessPass.show();                                            
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
                                            this.txtPopCashPay.newStart = true;
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
                                    {/* Cheqpay */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnCheqpay"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            //TICKET REST. SADAKAT PUAN KULLANIMI PARAMETRESI
                                            if(this.prmObj.filter({ID:'UseTicketRestLoyalty',TYPE:0}).getValue() == true)
                                            {
                                                if(this.state.customerName != '')
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Ticket Rest. ile yapılan ödemelerde sadakat puanı veremezsiniz. Lütfen seçili müşteriden çıkınız !"}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                    return
                                                }
                                            }

                                            if(this.posObj.posSale.dt().length == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Satış olmadan ödeme alamazsınız !"}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                                return
                                            }
                                            
                                            await this.cheqDt.refresh();
                                            await this.grdPopCheqpayList.dataRefresh({source:this.cheqDt});
                                            this.calcGrandTotal(false);

                                            this.popCheqpay.show();
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
                                                    else
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Lütfen silmek istediğiniz satırı seçiniz !"}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
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
                                        <NbButton id={"btnItemReturn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={async ()=>
                                        {
                                            if(this.posObj.posSale.dt().length > 0)
                                            {
                                                await this.msgItemReturnTicket.show().then(async (e) =>
                                                {
                                                    if(e == 'btn01')
                                                    {
                                                        if(this.txtItemReturnTicket.value != "")
                                                        {
                                                            let tmpDt = new datatable();
                                                            tmpDt.selectCmd = 
                                                            {
                                                                query : "SELECT * FROM POS_SALE_VW_01 WHERE SUBSTRING(CONVERT(NVARCHAR(50),POS_GUID),25,12) = @GUID",
                                                                param : ['GUID:string|12'], 
                                                                value : [this.txtItemReturnTicket.value] 
                                                            }
                                                            await tmpDt.refresh();
                                                            
                                                            if(tmpDt.length > 0)
                                                            {
                                                                for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                                                {
                                                                    let tmpItem = tmpDt.where({ITEM_CODE:this.posObj.posSale.dt()[i].ITEM_CODE})
                                                                    if(tmpItem.length > 0 && this.posObj.posSale.dt()[i].QUANTITY >= tmpItem[0].QUANTITY)
                                                                    {
                                                                        this.msgItemReturnTicket.hide()
                                                                        this.popItemReturnDesc.show()
                                                                        return
                                                                    }
                                                                }

                                                                let tmpConfObj =
                                                                {
                                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Okutmuş olduğunuz ticket daki ürünler yada miktar uyuşmuyor !"}</div>)
                                                                }
                                                                await dialog(tmpConfObj);
                                                            }
                                                            else
                                                            {
                                                                let tmpConfObj =
                                                                {
                                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz ticket !"}</div>)
                                                                }
                                                                await dialog(tmpConfObj);
                                                            }
                                                        }
                                                    }
                                                })                                                
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="col px-1">
                                        <NbButton id={"btnSubtotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            let tmpData = this.posObj.posSale.dt().where({SUBTOTAL:0})
                                            let tmpMaxSub = this.posObj.posSale.dt().where({SUBTOTAL:{'<>':-1}}).max('SUBTOTAL') + 1
                                            for (let i = 0; i < tmpData.length; i++) 
                                            {
                                                tmpData[i].SUBTOTAL = tmpMaxSub
                                                console.log(tmpData[i].SUBTOTAL)
                                            }
                                            this.calcGrandTotal()
                                        }}>
                                            <i className="text-white fa-solid fa-square-root-variable" style={{fontSize: "24px"}} />
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
                                            await this.parkDt.refresh();
                                            await this.grdPopParkList.dataRefresh({source:this.parkDt});             
                                            this.popParkList.show();
                                        }}>
                                            <span className="text-white" style={{fontWeight: 'bold'}}><i className="text-white fa-solid fa-arrow-up-right-from-square pe-2" style={{fontSize: "24px"}} />{this.parkDt.length}</span>                                            
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
                                    {/* Diffrent Price */}
                                    <div className="col px-1">
                                        <NbButton id={"btnPriceDiff"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                                        onClick={async()=>
                                        {          
                                            if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
                                            {
                                                this.txtPopDiffPriceQ.value = this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY < 0 ? this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY * -1 : this.grdList.devGrid.getSelectedRowKeys()[0].QUANTITY;
                                                this.txtPopDiffPriceP.value = this.grdList.devGrid.getSelectedRowKeys()[0].PRICE;
                                                this.popDiffPrice.show();
                                            }
                                            else
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'msgAlert',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Lütfen satır seçiniz !"}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                            }
                                        }}>
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
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark"><NbLabel id="popTotalGrand" parent={this} value={"0.00 €"}/></span></p>    
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
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark"><NbLabel id="popCardTotalGrand" parent={this} value={"0.00 €"}/></span></p>    
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
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark"><NbLabel id="popCashTotalGrand" parent={this} value={"0.00 €"}/></span></p>    
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
                {/* Cheqpay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCheqpay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Cheqpay Giriş"}
                    container={"#root"} 
                    width={"900"}
                    height={"585"}
                    position={{of:"#root"}}
                    onShowed={()=>
                    {
                        this.txtPopCheqpay.value = ""
                        setTimeout(() => 
                        {
                            this.txtPopCheqpay.focus()
                        }, 500);
                    }}
                    >
                        {/* txtPopCheqpay */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCheqpay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}
                                onKeyDown={(async(e)=>
                                {    
                                    if(e.event.key == 'Enter')
                                    {   
                                        this.cheqpayAdd(this.txtPopCheqpay.value)                                        
                                    }
                                }).bind(this)}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* grdPopCheqpayList */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdPopCheqpayList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"280px"} 
                                width={"100%"}
                                dbApply={false}
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
                                    <Column dataField="CODE" caption={"CODE"} width={550} />
                                    <Column dataField="AMOUNT" caption={"AMOUNT"} width={100}/>
                                </NdGrid>
                            </div>
                        </div>
                        {/* Last Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Son Okutulan : <span className="text-dark">{parseFloat(this.state.cheqLastAmount).toFixed(2)} €</span></h3>    
                            </div>
                        </div>
                        {/* Total Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Toplam Okutulan : <span className="text-dark">{parseFloat(this.state.cheqTotalAmount).toFixed(2)} €</span></h3>    
                            </div>
                        </div>
                        {/* Rest */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Kalan Ödeme : <span className="text-dark">{parseFloat(this.state.payRest).toFixed(2)} €</span></h3>    
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
                    <NbPopUp id="popLastSaleList" parent={this} title={"Son Satış Listesi"} fullscreen={true}>
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
                    <NbPopDescboard id={"popParkDesc"} parent={this} width={"900"} height={"610"} position={"#root"} head={"Park Açıklaması"} title={"Lütfen Açıklama Giriniz"}
                    button={this.prmObj.filter({ID:'ParkDelDescription',TYPE:0}).getValue().buttons}
                    onClick={async (e)=>
                    {
                        await this.descSave("PARK DESC",e,0)
                        this.init()
                    }}></NbPopDescboard>
                </div>
                {/* Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popDeleteDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"Silme İşlemi Açıklaması"} title={"Lütfen Silme Nedeninizi Giriniz"}
                    button={this.prmObj.filter({ID:'DocDelDescription',TYPE:0}).getValue().buttons}
                    onClick={async (e)=>
                    {
                        await this.descSave("FULL DELETE",e,0)
                        this.delete()
                    }}></NbPopDescboard>
                </div>
                {/* Row Delete Description Popup */} 
                <div>
                    <NbPopDescboard id={"popRowDeleteDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"Satır Silme İşlemi Açıklaması"} title={"Lütfen Silme Nedeninizi Giriniz"}
                    button={this.prmObj.filter({ID:'DocRowDelDescription',TYPE:0}).getValue().buttons}
                    onClick={async (e)=>
                    {
                        await this.descSave("ROW DELETE",e,this.grdList.devGrid.getSelectedRowKeys()[0].LINE_NO)
                        this.rowDelete()
                    }}></NbPopDescboard>
                </div>
                {/* Item Return Description Popup */} 
                <div>
                    <NbPopDescboard id={"popItemReturnDesc"} parent={this} width={"900"} height={"540"} position={"#root"} head={"İade Açıklaması"} title={"Lütfen İade Nedenini Giriniz"}
                    button={
                    [
                        {
                            id:"btn01",
                            text:"Ürün Barkodu Çift Okutulmuş"
                        },
                        {
                            id:"btn02",
                            text:"Ürün Arızalı Yada Defolu"
                        },
                        {
                            id:"btn03",
                            text:"Müşteri Ürünü Beğenmedi"
                        },
                        {
                            id:"btn04",
                            text:"Müşteri Yanlış Ürünü Aldı"
                        }
                    ]}
                    onClick={async (e)=>
                    {                        
                        let tmpResult = await this.msgItemReturnType.show();
                        
                        if(tmpResult == 'btn01') //Nakit
                        {
                            this.posObj.posPay.addEmpty()
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 0
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = 'ESC'
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2))
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0
                        }
                        else if(tmpResult == 'btn02') //İade Çeki
                        {
                            this.posObj.posPay.addEmpty()
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].POS_GUID = this.posObj.dt()[0].GUID
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE = 2
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].PAY_TYPE_NAME = 'CHQ'
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].LINE_NO = this.posObj.posPay.dt().length
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].AMOUNT = Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2))
                            this.posObj.posPay.dt()[this.posObj.posPay.dt().length - 1].CHANGE = 0

                            this.posObj.dt()[0].REBATE_CHEQPAY = 'Q' + new Date().toISOString().substring(2, 10).replace('-','').replace('-','') + Math.round(Number(parseFloat(this.posObj.dt()[0].TOTAL).toFixed(2)) * 100).toString().padStart(5,'0') + Date.now().toString().substring(7,12);

                            await this.cheqpaySave(this.posObj.dt()[0].REBATE_CHEQPAY,this.posObj.dt()[0].TOTAL,0,1);
                        }

                        if(this.txtItemReturnTicket.value != "")
                        {
                            this.posObj.dt()[0].TICKET = this.txtItemReturnTicket.value;
                        }
                        this.posObj.dt()[0].TYPE = 1;
                        this.posObj.dt()[0].STATUS = 1;
                        
                        await this.descSave("REBATE",e,0);                        
                        await this.calcGrandTotal();

                        this.init()
                    }}></NbPopDescboard>
                </div>
                {/* Item Return Ticket Dialog  */}
                <div>
                    <NdDialog id={"msgItemReturnTicket"} container={"#root"} parent={this}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        title={"Dikkat"} 
                        showCloseButton={false}
                        width={"500px"}
                        height={"250px"}
                        button={[{id:"btn01",caption:"Tamam",location:'before'},{id:"btn02",caption:"İptal",location:'after'}]}
                        onShowed={()=>
                        {
                            this.txtItemReturnTicket.value = ""
                            setTimeout(() => 
                            {
                                this.txtItemReturnTicket.focus()
                            }, 500);
                        }}
                        >
                            <div className="row">
                                <div className="col-12 py-2">
                                    <div style={{textAlign:"center",fontSize:"20px"}}>{"İade Alınan Ticketı Okutunuz !"}</div>
                                </div>
                                <div className="col-12 py-2">
                                <Form>
                                    {/* txtItemReturnTicket */}
                                    <Item>
                                        <NdTextBox id="txtItemReturnTicket" parent={this} simple={true} />
                                    </Item>
                                </Form>
                            </div>
                            </div>
                    </NdDialog>
                </div>
                {/* Alert Item Return Type Popup */} 
                <div>
                    <NdDialog id={"msgItemReturnType"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={"Uyarı"} 
                    showCloseButton={true}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:"Espece",location:'before'},{id:"btn02",caption:"Bon D'avoir",location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{"İade Tipini Seçiniz !"}</div>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Alert Weighing Popup */} 
                <div>
                    <NdDialog id={"msgWeighing"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={"Uyarı"} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:"Miktar Giriş",location:'before'},{id:"btn02",caption:"Vazgeç",location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{"Teraziden cevap bekleniyor."}</div>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Alert Card Payment Popup */} 
                <div>
                    <NdDialog id={"msgCardPayment"} container={"#root"} parent={this}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    title={"Uyarı"} 
                    showCloseButton={false}
                    width={"500px"}
                    height={"200px"}
                    button={[{id:"btn01",caption:"Tekrar",location:'before'},{id:"btn02",caption:"Vazgeç",location:'center'},{id:"btn03",caption:"Zorla",location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{"Kart cihazından cevap bekleniyor."}</div>
                            </div>
                        </div>
                    </NdDialog>
                </div>
                {/* Diffrent Price Popup */}
                <div>
                <NdPopUp parent={this} id={"popDiffPrice"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={"Fiyat Farkı"}
                container={"#root"} 
                width={"300"}
                height={"515"}
                // onHiding={()=> {this._onClick('close')}}
                position={{of:"#root"}}
                >
                    {/* txtPopDiffPriceQ */}
                    <div className="row pt-1">
                        <div className="col-12">
                            <NdTextBox id={"txtPopDiffPriceQ"} parent={this} simple={true} onFocusIn={()=>
                            {
                                this.numPopDiffPrice.textobj = "txtPopDiffPriceQ"
                            }}>     
                            </NdTextBox> 
                        </div>
                    </div> 
                    {/* txtPopDiffPriceP */}
                    <div className="row pt-1">
                        <div className="col-12">
                            <NdTextBox id={"txtPopDiffPriceP"} parent={this} simple={true} onFocusIn={()=>
                            {
                                this.numPopDiffPrice.textobj = "txtPopDiffPriceP"
                            }}>     
                            </NdTextBox> 
                        </div>
                    </div> 
                    {/* numPopDiffPrice */}
                    <div className="row pt-2">                        
                        <div className="col-12">
                            <NbNumberboard id={"numPopDiffPrice"} parent={this} textobj={"txtPopDiffPriceQ"} span={1} buttonHeight={"60px"}/>
                        </div>
                    </div>
                    {/* btnPopDiffPrice */}
                    <div className="row pt-2">
                        <div className="col-12">
                            <NbButton id={"btnPopDiffPrice"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                            onClick={()=>
                            {
                                let tmpData = {QUANTITY:this.txtPopDiffPriceQ.value * -1,PRICE:this.txtPopDiffPriceP.value};
                                this.saleRowUpdate(this.grdList.devGrid.getSelectedRowKeys()[0],tmpData);
                                this.popDiffPrice.hide();
                            }}>
                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                    </div>
                </NdPopUp>
                </div>
            </div>
        )
    }
}