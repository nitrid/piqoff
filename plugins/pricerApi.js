import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'

class pricerApi
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.active = false
    }
    async connEvt(pSocket)
    {
        // let tmpQuery = 
        // {
        //     query : "SELECT * FROM ITEMS WHERE DELETED = 0 AND STATUS = 1  ",
        // }
        // let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        // for (let i = 0; i < tmpResult.length; i++) 
        // {
        //     await this.itemUpdate(tmpResult[i].GUID)
        //     console.log(tmpResult[i].GUID)
        // }

        pSocket.on('sql',async (pParam,pCallback) =>
        {
            if(this.active == true)
            {
                if(typeof pParam.length != 'undefined')
                {
                    for (let i = 0; i < pParam.length; i++) 
                    {
                        if(pParam[i].query.indexOf('ITEM_PRICE_UPDATE') > -1)
                        { 
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('ITEM_PRICE_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('ITEMS_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('ITEMS_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('ITEM_UNIT_INSERT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('ITEM_UNIT_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM_GUID != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_INVOICE_PRICE_UPDATE') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM)
                                }, 5000);
                            }
                        }
                        else if(pParam[i].query.indexOf('PRD_COLLECTIVE_ITEMS_EDIT') > -1)
                        {
                            if(typeof pParam[i].rowData.ITEM != 'undefined')
                            {
                                setTimeout(() => {
                                    this.itemUpdate(pParam[i].rowData.ITEM)
                                }, 5000);
                            }
                        }
                    }
                }
            }
           
        })
    }
    async itemUpdate(pGuid)
    {
        let tmpQuery = 
        {
            query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_02 WHERE GUID = @GUID ",
            param : ['GUID:string|50'],
            value : [pGuid]
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
        
        if(typeof tmpResult.length != 'undefined')
        {
            let tmpBarcodes =[]
            for (let i = 0; i < tmpResult.length; i++) 
            {
                tmpBarcodes.push(tmpResult[i].BARCODE)
            }
            fetch('http://192.168.1.84:3333/api/public/core/v1/items', 
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
                      "price": tmpResult[0].PRICE_SALE,
                      "sics":tmpBarcodes,
                      "properties": 
                      {
                        "BARCODE": tmpResult[0].BARCODE,
                        "UNIT_PRICE": tmpResult[0].UNIT_PRICE,
                        "SALES_UNIT": "",
                        "UNIT_CODE":tmpResult[0].UNIT_SYMBOL,
                        "DISCOUNT_PRICE":"",
                        "DISCOUNT_FLAG":"",
                        "STRIKE_FLAG":"",
                        "VAT":tmpResult[0].VAT,
                        "VARIETY":"",
                        "SIZE":"",
                        "CATEGORY":"",
                        "ORIGIN":"",
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
                    console.log(data.result)
                }
                else
                {
                    console.log(data.message, typeof data.error == 'undefined' ? '' : data.error)
                }
            })
            .catch(error => 
            {
                console.error('Hata:', error.message);
            });
        }
      
    }
}

export const _pricerApi = new pricerApi()