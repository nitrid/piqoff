import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'
import cron from 'node-cron';
import fetch from 'node-fetch';
import moment from 'moment';


class pricerApi
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.active = false

        this.processRun()
    }
    async connEvt(pSocket)
    {
        pSocket.on('sql',async (pParam,pCallback) =>
        {
            if(this.active == true)
            {
                if(typeof pParam.length != 'undefined')
                {
                    for (let i = 0; i < pParam.length; i++) 
                    {
                        if(pParam[i].query.indexOf('PRD_ITEM_PRICE_UPDATE') > -1)
                        { 
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_PRICE_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEMS_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.GUID)
                                }, 7000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEMS_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.GUID)
                                }, 7000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_UNIT_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_UNIT_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_INVOICE_PRICE_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_COLLECTIVE_ITEMS_EDIT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_BARCODE_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_ITEM_BARCODE_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_APPLICATION_INSERT') > -1)
                        {
                            console.log(pParam[i].rowData)
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.PROMO)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_APPLICATION_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.PROMO)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_CONDITION_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.PROMO)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_CONDITION_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.PROMO != 'undefined')
                            {
                                setTimeout(() => 
                                {
                                    this.processPromoSend(pParam[i].rowData.PROMO)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_DELETE') > -1)
                        {
                            this.promoDelete()
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_APPLICATION_DELETE') > -1)
                        {
                            this.promoDelete()
                        }
                        else if(pParam[i].query.indexOf('PRD_PROMO_CONDITION_DELETE') > -1)
                        {
                            this.promoDelete()
                        }
                    }
                }
            }
           
        })
        pSocket.on('allPromoSend',async (pParam,pCallback) =>
        {
            this.processPromoSend()
        })
        pSocket.on('priceAllItemSend',async (pParam,pCallback) =>
        {
            this.allItemSend()
        })
        pSocket.on('priceDateItemSend',async (pParam,pCallback) =>
        {
            this.dateItemSend(arguments[0],arguments[1])
        })
    }
    async itemUpdate(pGuid)
    {
        let tmpQuery = 
        {
            query : "SELECT *, (ROUND(PRICE_SALE,2) * 100) AS CENTIM_PRICE,ROUND(UNIT_PRICE,2) AS UNIT_PRICES FROM ITEMS_BARCODE_MULTICODE_VW_02 WHERE GUID = @GUID ",
            param : ['GUID:string|50'],
            value : [pGuid]
        }

        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
        
        if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
        {
           
            if(tmpResult[0].PROMO_GUID != '00000000-0000-0000-0000-000000000000')
            {
                this.processPromoSend(tmpResult[0].PROMO_GUID)
                return
            }
            let tmpBarcodes =[]
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].UNIT_FACTOR == 1)
                {
                    tmpBarcodes.push(tmpResult[i].BARCODE)
                }
                else
                {
                    this.itemUnitUpdate(tmpResult[i].GUID,tmpResult[i].UNIT_ID)
                }
            }
            
            fetch('http://localhost:3333/api/public/core/v1/items', 
            {
                method: 'PATCH',
                headers:  
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa('config' + ":" + 'config')
                },
                body: JSON.stringify(
                [
                    {
                      "itemId": tmpResult[0].GUID,
                      "itemName": tmpResult[0].NAME,
                      "price": Math.round(tmpResult[0].CENTIM_PRICE),
                      "sics":tmpBarcodes,
                      "properties": 
                      {
                        "BARCODE": tmpResult[0].BARCODE,
                        "PACKAGE_SIZE":tmpResult[0].UNIT_FACTOR ,
                        "PACKAGE_UNIT" : tmpResult[0].UNIT_NAME,
                        "UNIT_PRICE": tmpResult[0].UNIT_PRICES,
                        "UNIT_CODE":tmpResult[0].UNIT_SYMBOL2,
                        "DISCOUNT_PRICE":"",
                        "DISCOUNT_FLAG":"0",
                        "STRIKE_FLAG":"",
                        "VAT":tmpResult[0].VAT,
                        "VARIETY":"",
                        "SIZE":"",
                        "CATEGORY":"",
                        "ORIGIN":tmpResult[0].ORGINS_NAME,
                        "TRAITEMENT" : "",
                        "STOCK":"",
                        "NEXT_DELIVERY_DATE":"",
                        "ORDER_IN_PROGRESS":""
                      }
                    }
                ])
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error('yükleme başarısız. HTTP Hata: ' + response.status);
                }
                return response.json();
            })
            .then(data => 
            {
                if(data.success)
                {
                    //console.log(data.result)
                }
                else
                {
                    //console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                }
            })
            .catch(error => 
            {
                console.error('Hata:', error.message);
            });
        }
      
    }
    async itemUnitUpdate(pGuid,pUnitId)
    {
        let tmpQuery = 
        {
            query : "SELECT *, (ROUND(PRICE_SALE,2) * 100) AS CENTIM_PRICE,ROUND(UNIT_PRICE,2) AS UNIT_PRICES FROM ITEMS_BARCODE_MULTICODE_VW_02 WHERE GUID = @GUID AND UNIT_ID = @UNIT_ID",
            param : ['GUID:string|50','UNIT_ID:string|50'],
            value : [pGuid,pUnitId]
        }

        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
        
        if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
        {
           
            
            let tmpBarcodes =[]
            for (let i = 0; i < tmpResult.length; i++) 
            {
                tmpBarcodes.push(tmpResult[i].BARCODE)
            }
            
            fetch('http://localhost:3333/api/public/core/v1/items', 
            {
                method: 'PATCH',
                headers:  
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa('config' + ":" + 'config')
                },
                body: JSON.stringify(
                [
                    {
                      "itemId": tmpResult[0].GUID + '-' +tmpResult[0].UNIT_ID ,
                      "itemName": tmpResult[0].NAME +' * ' +tmpResult[0].UNIT_FACTOR,
                      "price": Math.round(tmpResult[0].CENTIM_PRICE),
                      "sics":tmpBarcodes,
                      "properties": 
                      {
                        "BARCODE": tmpResult[0].BARCODE,
                        "PACKAGE_SIZE":tmpResult[0].UNIT_FACTOR ,
                        "PACKAGE_UNIT" : tmpResult[0].UNIT_NAME,
                        "UNIT_PRICE": tmpResult[0].UNIT_PRICES,
                        "UNIT_CODE":tmpResult[0].UNIT_SYMBOL2,
                        "DISCOUNT_PRICE":"",
                        "DISCOUNT_FLAG":"0",
                        "STRIKE_FLAG":"",
                        "VAT":tmpResult[0].VAT,
                        "VARIETY":"",
                        "SIZE":"",
                        "CATEGORY":"",
                        "ORIGIN":tmpResult[0].ORGINS_NAME,
                        "TRAITEMENT" : "",
                        "STOCK":"",
                        "NEXT_DELIVERY_DATE":"",
                        "ORDER_IN_PROGRESS":""
                      }
                    }
                ])
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error('yükleme başarısız. HTTP Hata: ' + response.status);
                }
                return response.json();
            })
            .then(data => 
            {
                if(data.success)
                {
                    //console.log(data.result)
                }
                else
                {
                    //console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                }
            })
            .catch(error => 
            {
                console.error('Hata:', error.message);
            });
        }
      
    }
    async allItemSend()
    {
        let tmpQuery = 
        {
            query : "SELECT * FROM ITEMS_VW_01 WHERE STATUS = 1 ",
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        for (let i = 0; i < tmpResult.length; i++) 
        {
            await this.itemUpdate(tmpResult[i].GUID)
        }
    }
    async dateItemSend(pFirstDate,pLastDate)
    {
        let tmpQuery = 
        {
            query : "SELECT * FROM ITEMS_VW_01 WHERE STATUS = 1 AND CONVERT(nvarchar,LDATE,110) >= @FISRT_DATE AND CONVERT(nvarchar,LDATE,110) <= @LAST_DATE",
            param : ['FISRT_DATE:date','LAST_DATE:date'],
            value : [pFirstDate,pLastDate]
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        for (let i = 0; i < tmpResult.length; i++) 
        {
            console.log(tmpResult[i].GUID)
            await this.itemUpdate(tmpResult[i].GUID)
        }
    }
    async processRun()
    {
        if(this.active == true)
        {

            cron.schedule('0 3 * * *', async () => 
            {
                await this.processPromoSend()
                await this.processPromoClear()
            })      
        }
    }
    async processPromoSend(pGuid)
    {
        if(typeof pGuid == 'undefined')
        {
            let tmpQuery = 
            {
                query : "SELECT CASE APP_TYPE WHEN 5 THEN APP_AMOUNT " + 
                " WHEN 0 THEN ROUND((SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) - (SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ((APP_AMOUNT / 100)),2) END AS PRICE,COND_ITEM_GUID AS ITEM, " +
                " START_DATE,FINISH_DATE+1 AS FINISH_DATE " + 
                " FROM PROMO_COND_APP_VW_01  WHERE  APP_TYPE IN(5,0) AND START_DATE <= CONVERT(nvarchar,GETDATE(),112) AND FINISH_DATE >= CONVERT(nvarchar,GETDATE(),112) AND COND_QUANTITY <= 1 AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000'",
            }
            
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

            for (let i = 0; i < tmpResult.length; i++) 
            {
              
                await this.itemPromoUpdate(tmpResult[i].ITEM,tmpResult[i].PRICE)
            }
        }
        else
        {
            let tmpQuery = 
            {
                query : "SELECT CASE APP_TYPE WHEN 5 THEN APP_AMOUNT " + 
                " WHEN 0 THEN ROUND((SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) - (SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ((APP_AMOUNT / 100)),2) END AS PRICE,COND_ITEM_GUID AS ITEM, " +
                " START_DATE,FINISH_DATE+1 AS FINISH_DATE " + 
                " FROM PROMO_COND_APP_VW_01  WHERE  APP_TYPE IN(5,0) AND GUID = @GUID AND COND_QUANTITY <= 1 AND START_DATE <= CONVERT(nvarchar,GETDATE(),112) AND FINISH_DATE >= CONVERT(nvarchar,GETDATE(),112) AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000'",
                param : ['GUID:string|50'],
                value : [pGuid]
            }
            
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

            for (let i = 0; i < tmpResult.length; i++) 
            {
                await this.itemPromoUpdate(tmpResult[i].ITEM,tmpResult[i].PRICE)
            }
        }

    }
    async itemPromoUpdate(pGuid,pPrice)
    {
        let tmpQuery = 
        {
            query : "SELECT *, (ROUND(PRICE_SALE,2) * 100) AS CENTIM_PRICE,ROUND(UNIT_PRICE,2) AS UNIT_PRICES FROM ITEMS_BARCODE_MULTICODE_VW_02 WHERE GUID = @GUID ",
            param : ['GUID:string|50'],
            value : [pGuid]
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
        
        if(tmpResult.length > 0)
        {
            let tmpBarcodes =[]
            for (let i = 0; i < tmpResult.length; i++) 
            {
                tmpBarcodes.push(tmpResult[i].BARCODE)
            }
            
            fetch('http://localhost:3333/api/public/core/v1/items', 
            {
                method: 'PATCH',
                headers:  
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa('config' + ":" + 'config')
                },
                body: JSON.stringify(
                [
                    {
                      "itemId": tmpResult[0].GUID,
                      "itemName": tmpResult[0].NAME,
                      "price": Math.round(pPrice * 100),
                      "sics":tmpBarcodes,
                      "properties": 
                      {
                        "BARCODE": tmpResult[0].BARCODE,
                        "PACKAGE_SIZE":tmpResult[0].UNIT_FACTOR ,
                        "PACKAGE_UNIT" : tmpResult[0].UNIT_NAME,
                        "UNIT_PRICE": tmpResult[0].UNIT_PRICES,
                        "UNIT_CODE":tmpResult[0].UNIT_SYMBOL2,
                        "DISCOUNT_FLAG":"1",
                        "STRIKE_PRICE":Math.round(tmpResult[0].CENTIM_PRICE),
                        "VAT":tmpResult[0].VAT,
                        "VARIETY":"",
                        "SIZE":"",
                        "CATEGORY":"",
                        "ORIGIN":tmpResult[0].ORGINS_NAME,
                        "TRAITEMENT" : "",
                        "STOCK":"",
                        "NEXT_DELIVERY_DATE":"",
                        "ORDER_IN_PROGRESS":""
                      }
                    }
                ])
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error('yükleme başarısız. HTTP Hata: ' + response.status);
                }
                return response.json();
            })
            .then(data => 
            {
                if(data.success)
                {
                    //console.log(data.result)
                }
                else
                {
                    //console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                }
            })
            .catch(error => 
            {
                console.error('Hata:', error.message);
            });
        }
      
    }
    async promoDelete()
    {
        console.log(111)
        let tmpCleanQuery = 
        {
            query : " SELECT *,(SELECT START_DATE FROM PROMO WHERE PROMO.GUID = PROMO_CONDITION.PROMO),(SELECT FINISH_DATE FROM PROMO WHERE PROMO.GUID = PROMO_CONDITION.PROMO) FROM PROMO_CONDITION WHERE  (SELECT FINISH_DATE FROM PROMO WHERE PROMO.GUID = PROMO_CONDITION.PROMO) >= CONVERT(nvarchar,GETDATE(),112) AND DELETED = 1 ",
        }
        let tmpCleanResult = (await core.instance.sql.execute(tmpCleanQuery)).result.recordset
        for (let i = 0; i < tmpCleanResult.length; i++) 
        {
            await this.itemUpdate(tmpCleanResult[i].ITEM)
        }
    }
    async processPromoClear()
    {
        let tmpQuery = 
        {
            query : "SELECT COND_ITEM_GUID AS ITEM " +
            " FROM PROMO_COND_APP_VW_01  WHERE  APP_TYPE IN(5,0) AND  FINISH_DATE <= CONVERT(nvarchar,GETDATE(),112) AND FINISH_DATE >= CONVERT(nvarchar,GETDATE()-3,112)  ",
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        for (let i = 0; i < tmpResult.length; i++) 
        {
            await this.itemUpdate(tmpResult[i].ITEM)
        }
    }
   
}

export const _pricerApi = new pricerApi()