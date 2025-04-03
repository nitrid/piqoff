//BU PLUGIN SAYAC TERAZILER İÇİN YAPILDI.
import posDoc from "../pages/posDoc.js";
import moment from "moment";
import { datatable } from "../../core/core.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import React from "react";

const orgGetItem = posDoc.prototype.getItem
const orgDelete = posDoc.prototype.delete
const orgRowDelete = posDoc.prototype.rowDelete
const orgGetBarPattern = posDoc.prototype.getBarPattern

posDoc.prototype.rowDelete = async function()
{
    if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl)
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
    if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl)
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
    //MÜŞTER KARTI BARKODUNU OKUTMAK İÇİN BUTONA BASILMIŞ İSE TERAZİ KONTROLÜNE GİRME.
    if(this.btnGetCustomer.lock)
    {
        orgGetItem.call(this,pCode)
        return
    }
    
    getBarPattern = getBarPattern.bind(this)
    getBalanceCounter = getBalanceCounter.bind(this)
    
    let tmpTicketNo = getBarPattern(pCode)
    if(typeof tmpTicketNo != 'undefined')
    {
        if(!this.loading.current.instance.option('visible'))
        {
            this.txtBarcode.value = "";
            this.loading.current.instance.show()
            let tmpBalanceDt = await getBalanceCounter(tmpTicketNo,pCode)

            if(tmpBalanceDt.length > 0)
            {
                //TERAZİYE TOPLAM MİKTAR EŞLEŞMESİ
                if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().active && typeof tmpBalanceDt[0].STATUS != 'undefined')
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
                        let resultQuantity = Number((tmpDQuantity) - (tmpQuantity)).round(3)
                        if(tmpQuantity >= Number(tmpDQuantity) - Number(tmpTolerans) && tmpQuantity <= Number(tmpDQuantity) + Number(tmpTolerans))
                        {
                            let tmpLangMsg = this.lang.t("msgBarcodeWeighing.msg")
                            tmpLangMsg = tmpLangMsg.replace('{0}',tmpBalanceDt.length)
                            tmpLangMsg = tmpLangMsg.replace('{1}',Number(tmpBalanceDt.sum('AMOUNT')).round(2))
                            
                            let tmpConfObj =
                            {
                                id:'msgBarcodeWeighing',showTitle:true,title:this.lang.t("msgBarcodeWeighing.title"),showCloseButton:true,width:'400px',height:'200px',
                                button:[{id:"btn01",caption:this.lang.t("msgBarcodeWeighing.btn01"),location:'before'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{tmpLangMsg} {Number.money.sign}</div>)
                            }
                            await dialog(tmpConfObj);
                        }
                        else
                        {
                            document.getElementById("Sound").play(); 
                            let tmpConfObj =
                            {
                                id:'msgNotBarcodeWeighing',showTitle:true,title:this.lang.t("msgNotBarcodeWeighing.title"),showCloseButton:true,width:'650px',height:'350px',
                                button:[{id:"btn02",caption:this.lang.t("msgNotBarcodeWeighing.btn02"),location:'after'},{id:"btn01",caption:this.lang.t("msgNotBarcodeWeighing.btn01"),location:'before'}],
                                content:
                                (
                                    <div style={{textAlign:"center",fontSize:"20px"}}>
                                        <div className="row">
                                            <div className="col-12">
                                                {this.lang.t("msgNotBarcodeWeighing.msg")}
                                            </div>
                                        </div>
                                        <div className="row" style={{textAlign:"center",fontSize:"20px"}}>
                                            <div className="col-12" style={{ padding: "5px" }}>
                                                <span style={{fontWeight: tmpQuantity > tmpDQuantity ? "bold" : "normal" }}>{this.lang.t("msgNotBarcodeWeighing.msgTicket")}{tmpQuantity} kg</span>
                                            </div>
                                        </div>
                                        <div className="row" style={{textAlign:"center",fontSize:"20px"}}>
                                            <div className="col-12"style={{padding:"5px"}}>{this.lang.t("msgNotBarcodeWeighing.msgBarkod")}{tmpDQuantity} kg</div>
                                        </div>
                                        <div className="row" style={{textAlign:"center",fontSize:"20px"}}>
                                            <div className="col-12">
                                                <span style={{color: resultQuantity > tmpTolerans ? "red" : "red"}}>{this.lang.t("msgNotBarcodeWeighing.msgDifference")}{resultQuantity} kg</span>
                                            </div>
                                        </div>
                                        <div className="row" style={{textAlign:"center",fontSize:"20px"}}>
                                            <div className="col-12">
                                                <span>{this.lang.t("msgNotBarcodeWeighing.msgTotalAmount")} {Number(tmpBalanceDt.sum('AMOUNT')).round(2)} €</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            let tmpConfResult = await dialog(tmpConfObj)
                            if(tmpConfResult == 'btn01')
                            {
                                this.loading.current.instance.hide()
                                return
                            }
                            else
                            {
                                let tmpBalResult = await this.popBalanceCounterDesc.show()
                                if(typeof tmpBalResult != 'undefined')
                                {
                                    await this.descSave("BALANCE COUNTER",tmpBalResult,"00000000-0000-0000-0000-000000000000")
                                }
                                else
                                {
                                    this.loading.current.instance.hide()
                                    return
                                }
                            }
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
                        tmpItemsDt[0].DISCOUNT = 0

                        if(tmpBalanceDt[i].FREE)
                        {
                            //FIYAT GETİRME
                            let tmpPriceDt = new datatable()
                            tmpPriceDt.selectCmd = 
                            {
                                query : "SELECT dbo.FN_PRICE(@GUID,@QUANTITY,dbo.GETDATE(),@CUSTOMER,@DEPOT,@LIST_NO,0,1) AS PRICE ",
                                param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50','DEPOT:string|50','LIST_NO:int'],
                                local : 
                                {
                                    type : "select",
                                    query : "SELECT * FROM ITEMS_POS_VW_01 AS ITEM " + 
                                            "WHERE ITEM.GUID = ? LIMIT 1;",
                                    values : [tmpItemsDt[0].GUID]
                                }
                            }
                            tmpPriceDt.selectCmd.value = [tmpItemsDt[0].GUID,tmpItemsDt[0].QUANTITY * tmpItemsDt[0].UNIT_FACTOR,this.posObj.dt()[0].CUSTOMER_GUID,this.posObj.dt()[0].DEPOT_GUID,1]
                            await tmpPriceDt.refresh();  
                            
                            if(tmpPriceDt.length > 0)
                            {
                                tmpItemsDt[0].PRICE = tmpPriceDt[0].PRICE
                                tmpBalanceDt[i].PRICE = tmpPriceDt[0].PRICE
                            }

                            tmpItemsDt[0].DISCOUNT = Number(tmpItemsDt[0].QUANTITY * tmpItemsDt[0].PRICE).round(2)
                            tmpItemsDt[0].PROMO_TYPE = 1
                        }

                        this.saleAdd(tmpItemsDt[0])

                        console.log(this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl)
                        if(typeof this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl != 'undefined' && this.prmObj.filter({ID:'ScaleBarcodeControl',TYPE:0}).getValue().dbControl)
                        {
                            console.log(tmpBalanceDt[0].STATUS)
                            if(typeof tmpBalanceDt[0].STATUS == 'undefined')
                            {
                                //BALANCE COUNTER STATUS INSERT İŞLEMİ
                                let tmpInsertQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_BALANCE_COUNTER_INSERT] " + 
                                            "@GUID = @PGUID, " + 
                                            "@CUSER = 'Admin', " + 
                                            "@LUSER = 'Admin', " + 
                                            "@ITEM = @PITEM, " +
                                            "@POS = @PPOS, " +
                                            "@TICKET_NO = @PTICKET_NO, " +
                                            "@QUANTITY = @PQUANTITY, " +
                                            "@PRICE = @PPRICE, " +
                                            "@STATUS = 1, " + 
                                            "@FREE = @PFREE ",
                                    param : ['PGUID:string|50','PITEM:string|50','PPOS:string|50','PTICKET_NO:int','PQUANTITY:float','PPRICE:float','PFREE:bit'],
                                    value : [tmpBalanceDt[i].GUID,tmpItemsDt[0].GUID,this.posObj.dt()[0].GUID,tmpTicketNo,tmpBalanceDt[i].QUANTITY,tmpBalanceDt[i].PRICE,tmpBalanceDt[i].FREE]
                                }
                                await this.core.sql.execute(tmpInsertQuery)
                            }
                            else
                            {
                                //BALANCE COUNTER STATUS UPDATE İŞLEMİ
                                let tmpUpdateQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_BALANCE_COUNTER_UPDATE] " + 
                                            "@GUID = @PGUID, " + 
                                            "@LUSER = @PLUSER, " + 
                                            "@LDATE = @PLDATE, " +
                                            "@POS = @PPOS, " +
                                            "@STATUS = 1, " +
                                            "@FREE = @PFREE ", 
                                    param : ['PGUID:string|50','PLUSER:string|25','PLDATE:datetime','PPOS:string|50','PFREE:bit'],
                                    value : [tmpBalanceDt[i].GUID,this.posObj.dt()[0].LUSER,new Date(),this.posObj.dt()[0].GUID,tmpBalanceDt[i].FREE]
                                }
                                await this.core.sql.execute(tmpUpdateQuery)
                            }
                        }
                    }
                }    
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgBarcodeBalanceNotFound',
                    showTitle:true,
                    title:this.lang.t("msgBarcodeBalanceNotFound.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgBarcodeBalanceNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBarcodeBalanceNotFound.msg")}</div>)
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
    
    console.log(pBarcode)
    if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
    {            
        return
    }
    
    for (let i = 0; i < tmpPrm.length; i++) 
    {
        let tmpFlag = tmpPrm[i].substring(0,2)
        if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag && tmpPrm[i].indexOf('X') > -1)
        {
            return pBarcode.substring(tmpPrm[i].indexOf('X'),tmpPrm[i].lastIndexOf('X') + 1)
        }
    }

    return
}
function getBalanceCounter(pTicketNo,pCode)
{
    return new Promise(async resolve => 
    {
        let tmpDt = new datatable(); 

        tmpDt.selectCmd = 
        {
            query : `SELECT *,ISNULL((SELECT VALUE FROM PARAM WHERE APP = 'POID' AND USERS = SCALE_CODE AND ID = 'SaleType'),0) AS SALE_TYPE 
                    FROM BALANCE_COUNTER_VW_01 WHERE TICKET_NO = @TICKET_NO AND 
                    (CONVERT(NVARCHAR(10),TICKET_DATE,112) >= @TICKET_DATE OR TICKET_DATE = '19700101') 
                    ORDER BY TICKET_DATE,LDATE DESC`,
            param : ['TICKET_NO:int','TICKET_DATE:datetime'],
            value: [Number(pTicketNo),new Date(moment().subtract(3,'days').format('YYYY-MM-DD'))]
        }
        await tmpDt.refresh();

        if(tmpDt.length > 0)
        {
            if(tmpDt[0].SALE_TYPE == 0)
            {
                let tmpData = new datatable();
                if(typeof tmpDt.where({STATUS:false})[0] != 'undefined')
                {
                    tmpData.push(tmpDt.where({STATUS:false})[0])
                }
                resolve(tmpData)
            }
            else
            {
                resolve(tmpDt.where({STATUS:false}))
            }   
        }
        else
        {
            let tmpBar = this.getBarPattern(pCode)
            if(typeof tmpBar.code != 'undefined' && typeof tmpBar.price != 'undefined' && typeof tmpBar.quantity != 'undefined')
            {
                tmpDt.push(
                    {
                        GUID : datatable.uuidv4(),
                        ITEM_CODE : "B" + tmpBar.code,
                        QUANTITY : tmpBar.quantity,
                        PRICE : tmpBar.price,
                        FREE : typeof tmpBar.isDiscount == 'undefined' ? false : tmpBar.isDiscount
                    }
                )

                resolve(tmpDt)
            }
            else
            {
                resolve(tmpDt)
            }
        }
    })
}