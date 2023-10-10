//BU PLUGIN SAYAC TERAZILER İÇİN YAPILDI.
import posDoc from "../pages/posDoc.js";
import moment from "moment";
import { datatable } from "../../core/core.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import React from "react";

const orgGetItem = posDoc.prototype.getItem
const orgDelete = posDoc.prototype.delete
const orgRowDelete = posDoc.prototype.rowDelete

posDoc.prototype.rowDelete = async function()
{
    if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active)
    {
        if(this.posObj.posSale.dt().length > 1)
        {
            if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
            {                
                let tmpDt = new datatable(); 
                tmpDt.selectCmd = 
                {
                    query : "SELECT * FROM BALANCE_COUNTER_VW_01 WHERE POS_GUID = @POS_GUID AND ITEM_CODE = @ITEM_CODE",
                    param : ['POS_GUID:string|50','ITEM_CODE:string|25'],
                    value: [this.grdList.devGrid.getSelectedRowKeys()[0].POS_GUID,this.grdList.devGrid.getSelectedRowKeys()[0].ITEM_CODE]
                }
                tmpDt.updateCmd =
                {
                    query : "EXEC [dbo].[PRD_BALANCE_COUNTER_UPDATE] " + 
                            "@GUID = @PGUID, " + 
                            "@CUSER = @PCUSER, " + 
                            "@LUSER = @PLUSER, " + 
                            "@POS = @PPOS, " + 
                            "@STATUS = @PSTATUS",
                    param : ['PGUID:string|50','PCUSER:string|25','PLUSER:string|25','PPOS:string|50','PSTATUS:int'],
                    dataprm : ['GUID','CUSER','LUSER','POS','STATUS'],
                }
                
                await tmpDt.refresh()
    
                if(tmpDt.length > 0)
                {
                    tmpDt[0].POS = '00000000-0000-0000-0000-000000000000'
                    tmpDt[0].STATUS = 0
                }
                tmpDt.update()
            }
        }
    }
    
    orgRowDelete.call(this)
}
posDoc.prototype.delete = async function()
{
    if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active)
    {
        let tmpDt = new datatable(); 
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM BALANCE_COUNTER_VW_01 WHERE POS_GUID = @POS_GUID",
            param : ['POS_GUID:string|50'],
            value: [this.posObj.dt()[0].GUID]
        }
        tmpDt.updateCmd =
        {
            query : "EXEC [dbo].[PRD_BALANCE_COUNTER_UPDATE] " + 
                    "@GUID = @PGUID, " + 
                    "@CUSER = @PCUSER, " + 
                    "@LUSER = @PLUSER, " + 
                    "@POS = @PPOS, " + 
                    "@STATUS = @PSTATUS",
            param : ['PGUID:string|50','PCUSER:string|25','PLUSER:string|25','PPOS:string|50','PSTATUS:int'],
            dataprm : ['GUID','CUSER','LUSER','POS','STATUS'],
        }
        
        await tmpDt.refresh()
    
        for (let i = 0; i < tmpDt.length; i++) 
        {
            tmpDt[i].POS = '00000000-0000-0000-0000-000000000000'
            tmpDt[i].STATUS = 0
        }
        tmpDt.update()
    }
    
    orgDelete.call(this)
}
posDoc.prototype.getItem = async function(pCode)
{
    getBarPattern = getBarPattern.bind(this)
    getBalanceCounter = getBalanceCounter.bind(this)

    let tmpTicketNo = getBarPattern(pCode)

    if(typeof tmpTicketNo != 'undefined')
    {
        if(!this.loading.current.instance.option('visible'))
        {
            this.txtBarcode.value = "";
            this.loading.current.instance.show()
            let tmpBalanceDt = await getBalanceCounter(tmpTicketNo)
            
            if(tmpBalanceDt.length > 0)
            {
                //TERAZİYE TOPLAM MİKTAR EŞLEŞMESİ
                if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active)
                {
                    //ETIKET İÇERİSİNDE ADET ÜRÜN KONTROL EDİLİYOR
                    if(tmpBalanceDt.where({UNIT:'U'}).length == 0)
                    {
                        let tmpQuantity = 0
                        let tmpTolerans = 0
                        let tmpDQuantity = Number(tmpBalanceDt.sum('QUANTITY')).round(3)
                        if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().tolerans != 'undefined')
                        {
                            tmpTolerans = this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().tolerans
                        }
                        //TERAZİYE İSTEK YAPILIYOR.
                        let tmpWResult = await this.getWeighing(0.1)
                        if(typeof tmpWResult != 'undefined')
                        {
                            if(typeof tmpWResult.Result == 'undefined')
                            {
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
                                }
                            }
                        }
        
                        if(tmpQuantity == 0)
                        {
                            this.loading.current.instance.hide()
                            return
                        }
                        
                        if(tmpQuantity >= Number(tmpDQuantity) - Number(tmpTolerans) && tmpQuantity <= Number(tmpDQuantity) + Number(tmpTolerans))
                        {
                            let tmpLangMsg = this.lang.t("msgBarcodeWeighing.msg")
                            tmpLangMsg = tmpLangMsg.replace('{0}',tmpBalanceDt.length)
                            tmpLangMsg = tmpLangMsg.replace('{1}',Number(tmpBalanceDt.sum('AMOUNT')).round(2))
                            
                            let tmpConfObj =
                            {
                                id:'msgBarcodeWeighing',showTitle:true,title:this.lang.t("msgBarcodeWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgBarcodeWeighing.btn01"),location:'before'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{tmpLangMsg}</div>)
                            }
                            await dialog(tmpConfObj);
                        }
                        else
                        {
                            document.getElementById("Sound").play(); 
                            let tmpConfObj =
                            {
                                id:'msgNotBarcodeWeighing',showTitle:true,title:this.lang.t("msgNotBarcodeWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgNotBarcodeWeighing.btn01"),location:'before'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgNotBarcodeWeighing.msg")}</div>)
                            }
                            await dialog(tmpConfObj);
                            this.loading.current.instance.hide()
                            return
                        }
                    }
                    else
                    {
                        let tmpConfObj =
                        {
                            id:'msgBarcodeWeighingUnit',showTitle:true,title:this.lang.t("msgBarcodeWeighingUnit.title"),showCloseButton:true,width:'400px',height:'230px',
                            button:[{id:"btn01",caption:this.lang.t("msgBarcodeWeighingUnit.btn01"),location:'before'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBarcodeWeighingUnit.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                    }
                }
                //**************************************************************************************** */
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
            value: [Number(pTicketNo),new Date(moment().subtract(1,'days').format('YYYY-MM-DD'))]
        }
        await tmpDt.refresh();   
        resolve(tmpDt)
    })
}