//BU PLUGIN SAYAC TERAZILER İÇİN YAPILDI.
import posDoc from "../pages/posDoc.js";
import moment from "moment";
import { datatable } from "../../core/core.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import React from "react";

const orgCalcGrandTotal = posDoc.prototype.calcGrandTotal
const orgGetItem = posDoc.prototype.getItem

posDoc.prototype.calcGrandTotal = async function(pSave)
{
    await orgCalcGrandTotal.call(this,pSave)

    let tmpQuery = 
    {
        query : "SELECT COUNT(REF) AS TICKET_COUNT FROM POS_VW_01 WHERE DOC_DATE = CONVERT(NVARCHAR(10),GETDATE(),112) AND STATUS = 1 AND TYPE = 0 ", 
    }
    let tmpResult = await this.core.sql.execute(tmpQuery)
    if(tmpResult.result.recordset.length > 0)
    {
        this.customerPoint.value = tmpResult.result.recordset[0].TICKET_COUNT
    }
}
posDoc.prototype.getItem = async function(pCode)
{
    //SATIŞ İÇERİSİNDE ÜRÜN BUL
    if(this.btnItemSearch.lock)
    {
        let tmpItemSrcData = this.posObj.posSale.dt().where({INPUT:pCode})

        if(tmpItemSrcData.length > 0)
        {
            this.grdList.devGrid.navigateToRow(tmpItemSrcData[0])
            await this.core.util.waitUntil(200)
            this.grdList.devGrid.selectRowsByIndexes(this.grdList.devGrid.getRowIndexByKey(tmpItemSrcData[0]))    
        }

        this.txtBarcode.value = "";
        this.btnItemSearch.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"70px",width:"100%"})
        return
    }
    
    getBarPattern = getBarPattern.bind(this)

    this.txtBarcode.value = ""; 
    let tmpQuantity = 1
    let tmpPrice = 0          
    if(pCode.replace(/^\s+/, '').replace(/\s+$/, '') == '')
    {
       return
    }      
    //PARAMETREDE TANIMLI ÜRÜNLER İÇİN UYARI.
    await this.getItemWarning(pCode)
    
    if(pCode == '')
    {
        return
    }
    if(pCode.substring(0,1) == 'F')
    {
        pCode = pCode.substring(1,pCode.length)
    }
    
    //EĞER CARİ SEÇ BUTONUNA BASILDIYSA CARİ BARKODDAN SEÇİLECEK.
    if(this.btnGetCustomer.lock)
    {       
        //PRODORPLUS İÇİN YAPILDI. #CUSTOM1453# 
        // if(pCode.toString().substring(0,6) == "202012")
        // {
        //     pCode = pCode.toString().substring(0,6) + pCode.toString().substring(7,pCode.toString().length -1) 
        // }
        //************************ */

        let tmpCustomerDt = new datatable(); 
        tmpCustomerDt.selectCmd = 
        {
            query : "SELECT GUID,CUSTOMER_TYPE,NAME,LAST_NAME,CODE,TITLE,ADRESS,ZIPCODE,CITY,COUNTRY_NAME,STATUS,CUSTOMER_POINT,EMAIL,POINT_PASSIVE,PHONE1, " +
                    "ISNULL((SELECT COUNT(TYPE) FROM CUSTOMER_POINT WHERE TYPE = 0 AND CUSTOMER = CUSTOMER_VW_02.GUID AND CONVERT(DATE,LDATE) = CONVERT(DATE,GETDATE())),0) AS POINT_COUNT " + 
                    "FROM [dbo].[CUSTOMER_VW_02] WHERE CODE LIKE SUBSTRING(@CODE,0,14) + '%' AND STATUS = 1",
            param : ['CODE:string|50'],
            local : 
            {
                type : "select",
                query : "SELECT * FROM CUSTOMER_VW_02 WHERE CODE LIKE SUBSTR(?, 0, 15) || '%' LIMIT 1;",
                values : [pCode]
            }
        }
        tmpCustomerDt.selectCmd.value = [pCode]
        await tmpCustomerDt.refresh();

        if(tmpCustomerDt.length > 0)
        {
            if(tmpCustomerDt[0].POINT_COUNT > 3)
            {
                let tmpConfObj =
                {
                    id:'msgCustomerPointCount',showTitle:true,title:this.lang.t("msgCustomerPointCount.title"),showCloseButton:true,width:'450px',height:'250px',
                    button:[{id:"btn01",caption:this.lang.t("msgCustomerPointCount.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCustomerPointCount.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerPointCount.msg")}</div>)
                }
                let tmpConfResult = await dialog(tmpConfObj)
                if(tmpConfResult == 'btn01')
                {
                    let tmpResult = await acsDialog({id:"AcsDialog",parent:this,type:0})

                    if(!tmpResult)
                    {
                        return
                    }
                }
                else
                {
                    return
                }
            }
            this.posObj.dt()[0].CUSTOMER_GUID = tmpCustomerDt[0].GUID
            this.posObj.dt()[0].CUSTOMER_TYPE = tmpCustomerDt[0].CUSTOMER_TYPE
            this.posObj.dt()[0].CUSTOMER_CODE = tmpCustomerDt[0].CODE
            this.posObj.dt()[0].CUSTOMER_NAME = tmpCustomerDt[0].TITLE
            this.posObj.dt()[0].CUSTOMER_ADRESS = tmpCustomerDt[0].ADRESS
            this.posObj.dt()[0].CUSTOMER_ZIPCODE = tmpCustomerDt[0].ZIPCODE
            this.posObj.dt()[0].CUSTOMER_CITY = tmpCustomerDt[0].CITY
            this.posObj.dt()[0].CUSTOMER_COUNTRY = tmpCustomerDt[0].COUNTRY_NAME
            this.posObj.dt()[0].CUSTOMER_POINT = tmpCustomerDt[0].CUSTOMER_POINT
            this.posObj.dt()[0].CUSTOMER_POINT_PASSIVE = tmpCustomerDt[0].POINT_PASSIVE
            this.posObj.dt()[0].CUSTOMER_MAIL = tmpCustomerDt[0].EMAIL

            if(this.prmObj.filter({ID:'mailControl',TYPE:0}).getValue() == true)
            {
                if(this.posObj.dt()[0].CUSTOMER_MAIL == '')
                {
                    await this.popAddMail.show()
                    this.txtNewCustomerName.value = tmpCustomerDt[0].NAME,
                    this.txtNewCustomerLastName.value = tmpCustomerDt[0].LAST_NAME,
                    this.txtNewPhone.value = tmpCustomerDt[0].PHONE1
                    this.txtNewMail.value = ''
                }
            }

            let tmpLotteryDt = new datatable(); 
            tmpLotteryDt.selectCmd = 
            {
                query : "SELECT * FROM " +
                        "(SELECT *, " +
                        "ISNULL((SELECT CUSTOMER_CODE FROM POS_VW_01 WHERE GUID = POS_GUID),'') AS CODE " +
                        "FROM POS_EXTRA_VW_01 WHERE TAG = 'LOTTERY') AS TMP " +
                        "WHERE CODE = @CODE AND DESCRIPTION = '' " ,
                param : ['CODE:string|50'],
                value : [this.posObj.dt()[0].CUSTOMER_CODE]
            }
            tmpLotteryDt.updateCmd = 
            {
                query : "UPDATE POS_EXTRA SET DESCRIPTION = @DESCRIPTION WHERE GUID = @GUID",
                param : ['DESCRIPTION:string|10','GUID:string|50'],
                dataprm : ['DESCRIPTION','GUID']
            }
            
            await tmpLotteryDt.refresh()
            if(tmpLotteryDt.length > 0)
            {
                let tmpConfObj =
                {
                    id:'msgPreLottery',showTitle:true,title:this.lang.t("msgPreLottery.title"),showCloseButton:true,width:'450px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgPreLottery.btn01"),location:'before'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPreLottery.msg")}</div>)
                }
                let tmpConfObjResult = await dialog(tmpConfObj)
                if(tmpConfObjResult == 'btn01')
                {
                    let tmpConfObj =
                    {
                        id:'msgPostLottery',showTitle:true,title:this.lang.t("msgPostLottery.title"),showCloseButton:true,width:'450px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgPostLottery.btn01"),location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px", color:"red"}}>{this.lang.t("msgPostLottery.msg")}</div>)
                    }                       
                    await dialog(tmpConfObj)         
                }
                tmpLotteryDt[0].DESCRIPTION = '1'
                await tmpLotteryDt.update()
            }
            //PROMOSYON GETİR.
            await this.getPromoDb()
            this.promoApply()
            //***************************************************/

            this.core.util.writeLog("calcGrandTotal : 03")
            await this.calcGrandTotal(true);
            this.btnGetCustomer.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"70px",width:"100%"})
        }
        else
        {
            let tmpConfObj =
            {
                id:'msgCustomerNotFound',
                showTitle:true,
                title:this.lang.t("msgCustomerNotFound.title"),
                showCloseButton:true,
                width:'500px',
                height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgCustomerNotFound.btn01"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCustomerNotFound.msg")}</div>)
            }
            
            await dialog(tmpConfObj);
        }
        return;
    }
    //******************************************************** */
    //BARKOD X MİKTAR İŞLEMİ.
    if(pCode.indexOf("*") != -1)
    {
        if(pCode.split("*")[0] == "" || pCode.split("*")[0] == 0)
        {
            document.getElementById("Sound").play();
            let tmpConfObj =
            {
                id:'msgZeroValidation',
                showTitle:true,
                title:this.lang.t("msgZeroValidation.title"),
                showCloseButton:true,
                width:'500px',
                height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgZeroValidation.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgZeroValidation.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return
        }
        tmpQuantity = pCode.split("*")[0];
        pCode = pCode.split("*")[1];

        if(pCode.substring(0,1) == 'F')
        {
            pCode = pCode.substring(1,pCode.length)
        }
    }
    //******************************************************** */
    //BARKOD DESENİ
    let tmpBarPattern = getBarPattern(pCode)
    tmpPrice = typeof tmpBarPattern.price == 'undefined' || tmpBarPattern.price == 0 ? tmpPrice : tmpBarPattern.price
    tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' || tmpBarPattern.quantity == 0 ? tmpQuantity : tmpBarPattern.quantity
    pCode = tmpBarPattern.barcode     
    //console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))    
    this.loading.current.instance.show()
    //ÜRÜN GETİRME    
    let tmpItemsDt = await this.getItemDb(pCode)
    if(tmpItemsDt.length > 0)
    {     
        //TERAZİ DEN VERİ GELMEZ İSE KULLANICI ELLE MİKTAR GİRDİĞİNİ TUTAN ALAN
        tmpItemsDt[0].SCALE_MANUEL = false;
        //*********************************************************/
        //UNIQ BARKODU
        if(tmpItemsDt[0].UNIQ_CODE == tmpItemsDt[0].INPUT)
        {
            tmpQuantity = tmpItemsDt[0].UNIQ_QUANTITY
            tmpPrice = tmpItemsDt[0].UNIQ_PRICE
        }
        //*********************************************************/
        //FIYAT GETİRME
        let tmpPriceDt = new datatable()
        tmpPriceDt.selectCmd = 
        {
            query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,GETDATE(),@CUSTOMER,@DEPOT,@LIST_NO,0,1) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','LIST_NO:int'],
            local : 
            {
                type : "select",
                query : "SELECT * FROM ITEMS_POS_VW_01 WHERE GUID = ? LIMIT 1;",
                values : [tmpItemsDt[0].GUID]
            }
        }
        
        tmpPriceDt.selectCmd.value = [tmpItemsDt[0].GUID,tmpQuantity * tmpItemsDt[0].UNIT_FACTOR,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].DEPOT_GUID,this.pricingListNo]
        await tmpPriceDt.refresh();  
        
        if(tmpPriceDt.length > 0 && tmpPrice == 0)
        {
            tmpPrice = tmpPriceDt[0].PRICE
            //FİYAT GÖR
            if(this.btnInfo.lock)
            {
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:this.lang.t("info"),
                    showCloseButton:true,
                    width:'500px',
                    height:'250px',
                    button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}],
                    content:(<div><h3 className="text-primary text-center">{tmpItemsDt[0].NAME}</h3><h3 className="text-danger text-center">{tmpPrice + " EUR"}</h3></div>)
                }
                await dialog(tmpConfObj);
                this.btnInfo.setUnLock({backgroundColor:"#0dcaf0",borderColor:"#0dcaf0",height:"70px",width:"100%"})
                this.loading.current.instance.hide()
                return;
            }
            //**************************************************** */
        }
        //**************************************************** */
        //EĞER ÜRÜN TERAZİLİ İSE
        if(tmpItemsDt[0].WEIGHING)
        {
            this.loading.current.instance.hide()
            if(tmpPrice > 0)
            {
                //TERAZİYE İSTEK YAPILIYOR.
                let tmpWResult = await this.getWeighing(tmpPrice)
                if(typeof tmpWResult != 'undefined')
                {
                    if(typeof tmpWResult.Result == 'undefined')
                    {
                        tmpItemsDt[0].SCALE_MANUEL = true;
                        tmpQuantity = tmpWResult;
                    }
                    else
                    {
                        if(tmpWResult.Type == "02")
                        {
                            if(tmpWResult.Result.Scale > 0)
                            {
                                tmpQuantity = tmpWResult.Result.Scale
                            }
                            else
                            {
                                document.getElementById("Sound").play();
                                let tmpConfObj =
                                {
                                    id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                    button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                                }
                                await dialog(tmpConfObj);
                                return
                            }
                        }
                        else
                        {
                            document.getElementById("Sound").play();
                            let tmpConfObj =
                            {
                                id:'msgNotWeighing',showTitle:true,title:this.lang.t("msgNotWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgNotWeighing.btn01"),location:'before'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotWeighing.msg")}</div>)
                            }
                            await dialog(tmpConfObj);
                            return
                        }
                    }
                }
                else
                {
                    return
                }
            }
            else
            {   
                //EĞER OKUTULAN BARKODUN FİYAT SIFIR İSE KULLANICIYA FİYAT 
                let tmpResult = await this.popNumber.show(this.lang.t("price"),0)
                if(typeof tmpResult != 'undefined' && tmpResult != '')
                {
                    //FIYAT DURUM KONTROLÜ
                    if(!(await this.priceCheck(tmpItemsDt[0],tmpResult)))
                    {
                        
                        return
                    }

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
        //*****************************************************/
        //FİYAT TANIMSIZ YADA SIFIR İSE
        //*****************************************************/
        if(tmpPrice == 0)
        {
            this.loading.current.instance.hide()
            
            let tmpResult = await this.popNumber.show(this.lang.t("price"),0)
            if(typeof tmpResult != 'undefined' && tmpResult != '')
            {
                if(tmpResult == 0)
                {
                    
                    return
                }
                //FIYAT DURUM KONTROLÜ
                if(!(await this.priceCheck(tmpItemsDt[0],tmpResult)))
                {
                    
                    return
                }
                tmpPrice = tmpResult
            }
            else
            {
                //
                return
            }
        }
        //*****************************************************/
        tmpItemsDt[0].QUANTITY = tmpQuantity
        tmpItemsDt[0].PRICE = tmpPrice
        this.loading.current.instance.hide()
        this.saleAdd(tmpItemsDt[0])
    }
    else
    {
        this.loading.current.instance.hide()
        document.getElementById("Sound").play(); 
        let tmpConfObj =
        {
            id:'msgBarcodeNotFound',
            showTitle:true,
            title:this.lang.t("msgBarcodeNotFound.title"),
            showCloseButton:true,
            width:'500px',
            height:'200px',
            button:[{id:"btn01",caption:this.lang.t("msgBarcodeNotFound.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBarcodeNotFound.msg")}</div>)
        }
        await dialog(tmpConfObj);
    }
    //*********************************************************/
}
function getBarPattern(pBarcode)
{
    pBarcode = pBarcode.toString().trim()
    let tmpPrm = this.prmObj.filter({ID:'BarcodePattern',TYPE:0}).getValue();
    
    if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
    {            
        return {barcode:pBarcode}
    }
    //201234012550 0211234012550
    for (let i = 0; i < tmpPrm.length; i++) 
    {
        let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('N'))
        if(tmpPrm[i].indexOf('X') > -1)
        {
            tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('X'))
        }
        
        if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag)
        {
            let tmpMoney = pBarcode.substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
            let tmpMoneyFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
            let tmpCent = pBarcode.substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
            let tmpCentFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
            let tmpKg = pBarcode.substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
            let tmpKgFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
            let tmpGram = pBarcode.substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
            let tmpGramFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)

            let tmpSumFlag = ""
            if(tmpPrm[i].indexOf('F') > -1)
            {
                tmpSumFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('F'),tmpPrm[i].lastIndexOf('F') + 1)
            }
            else if(tmpPrm[i].indexOf('E') > -1)
            {
                tmpSumFlag = tmpPrm[i].substring(tmpPrm[i].indexOf('E'),tmpPrm[i].lastIndexOf('E') + 1)
            }
            
            let tmpFactory = 1
            if(tmpSumFlag == 'F')
            {
                tmpFactory =  this.prmObj.filter({ID:'ScalePriceFactory',TYPE:0}).getValue()
            }

            if(pBarcode.substring(0,tmpFlag.length) == '24')
            {
                return {
                    barcode : "24XXXXX" + tmpMoneyFlag + tmpCentFlag + tmpKgFlag + tmpGramFlag + tmpSumFlag,
                    price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)) * tmpFactory,
                    quantity : parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
                }
            }

            return {
                barcode : pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1) + tmpMoneyFlag + tmpCentFlag + tmpKgFlag + tmpGramFlag + tmpSumFlag,
                price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)) * tmpFactory,
                quantity : parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
            }
        }
    }

    return {barcode : pBarcode}
}