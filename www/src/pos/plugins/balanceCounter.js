//BU PLUGIN SAYAC TERAZILER İÇİN YAPILDI.
import posDoc from "../pages/posDoc.js";
import moment from "moment";
import { datatable } from "../../core/core.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import React from "react";

const orgGetItem = posDoc.prototype.getItem

posDoc.prototype.getItem = async function(pCode)
{
    getBarPattern = getBarPattern.bind(this)
    getBalanceCounter = getBalanceCounter.bind(this)

    let tmpTicketNo = getBarPattern(pCode)

    if(typeof tmpTicketNo != 'undefined')
    {
        this.txtBarcode.value = "";
        this.loading.current.instance.show()
        let tmpBalanceDt = await getBalanceCounter(tmpTicketNo)
        
        if(tmpBalanceDt.length > 0)
        {
            //ÜRÜN KONTROL EDİLİYOR
            for (let i = 0; i < tmpBalanceDt.length; i++) 
            {
                let tmpItemsDt = await this.getItemDb(tmpBalanceDt[i].ITEM_CODE)
                if(tmpItemsDt.length == 0)
                {
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
                    this.loading.current.instance.hide()
                    return
                }
            }

            for (let i = 0; i < tmpBalanceDt.length; i++) 
            {
                let tmpItemsDt = await this.getItemDb(tmpBalanceDt[i].ITEM_CODE)
                
                if(tmpItemsDt.length > 0)
                {
                    //TERAZİ DEN VERİ GELMEZ İSE KULLANICI ELLE MİKTAR GİRDİĞİNİ TUTAN ALAN
                    tmpItemsDt[0].SCALE_MANUEL = false;
                    
                    tmpItemsDt[0].QUANTITY = tmpBalanceDt[i].QUANTITY
                    tmpItemsDt[0].PRICE = tmpBalanceDt[i].PRICE
                    this.saleAdd(tmpItemsDt[0])
                    //BALANCE COUNTER STATUS UPDATE İŞLEMİ
                    let tmpUpdateQuery = 
                    {
                        query : "EXEC [dbo].[PRD_BALANCE_COUNTER_UPDATE] " + 
                                "@GUID = @PGUID, " + 
                                "@LUSER = @PLUSER, " + 
                                "@LDATE = @PLDATE, " +
                                "@POS = @PPOS, " +
                                "@STATUS = @PSTATUS ", 
                        param : ['PGUID:string|50','PLUSER:string|25','PLDATE:datetime','PPOS:string|50','PSTATUS:bit'],
                        value : [tmpBalanceDt[i].GUID,this.posObj.dt()[0].LUSER,new Date(),this.posObj.dt()[0].GUID,1]
                    }
                    await this.core.sql.execute(tmpUpdateQuery)
                }
            }    
        }
        else
        {
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
        this.loading.current.instance.hide()
    }
    else
    {
        orgGetItem.call(this,pCode)
    }
}
function getBarPattern(pBarcode)
{
    pBarcode = pBarcode.toString().trim()
    let tmpPrm = this.prmObj.filter({ID:'BarcodePattern',TYPE:0}).getValue();
    
    if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
    {            
        return
    }

    for (let i = 0; i < tmpPrm.length; i++) 
    {
        let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('X'))
        if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag && tmpPrm[i].indexOf('X') > -1)
        {
            return pBarcode.substring(tmpPrm[i].indexOf('X'),tmpPrm[i].lastIndexOf('X') + 1)
        }
    }

    return
}
function getBalanceCounter(pTicketNo)
{
    return new Promise(async resolve => 
    {
        let tmpDt = new datatable(); 
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM BALANCE_COUNTER_VW_01 WHERE TICKET_NO = @TICKET_NO AND CONVERT(NVARCHAR(10),TICKET_DATE,112) >= @TICKET_DATE AND STATUS = 0 ORDER BY TICKET_DATE DESC",
            param : ['TICKET_NO:int','TICKET_DATE:datetime'],
            value: [Number(pTicketNo),new Date(moment().subtract(3,'days').format('YYYY-MM-DD'))]
        }
        await tmpDt.refresh();   
        resolve(tmpDt)
    })
}