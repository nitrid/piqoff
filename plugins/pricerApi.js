import {spawn} from 'child_process'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'

//"{TYPE:'REVIEW',PATH:'C:\\\\Users\\\\A.K.K\\\\Desktop\\\\DevPrint\\\\test.repx',DATA:[{KODU:'001'}]}"
class devprint
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
    }
    connEvt(pSocket)
    {
        pSocket.on('sql',async (pParam,pCallback) =>
        {
            return
            if(typeof pParam.length != 'undefined')
            {
                for (let i = 0; i < pParam.length; i++) 
                {
                    if(pParam[i].query.indexOf('ITEM_PRICE_UPDATE') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('ITEM_PRICE_INSERT') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.ITEM_GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('ITEMS_INSERT') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('ITEMS_UPDATE') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('ITEM_UNIT_INSERT') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('ITEM_UNIT_UPDATE') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.GUID)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('PRD_INVOICE_PRICE_UPDATE') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.ITEM)
                        }, 5000);
                    }
                    else if(pParam[i].query.indexOf('PRD_COLLECTIVE_ITEMS_EDIT') > -1)
                    {
                        setTimeout(() => {
                            this.itemUpdate(pParam[i].rowData.ITEM)
                        }, 5000);
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
        
        fetch('192.168.1.84:3333/api/public/core/v1/items', 
        {
            method: 'PATCH',
            headers:  {Authorization: 'Basic ' + Buffer.from('config' + ":" + 'config').toString('base64')},
            body: 
            [
                {
                  "itemId": tmpResult[0].GUID,
                  "itemName": pParam[0].NAME,
                  "price": pParam[0].PRICE_SALE,
                  "sics": [
                  ],
                  "properties": 
                  {
                    "BARCODE": pParam[0].BARCODE,
                    "UNIT_PRICE": pParam[0].UNIT_PRICE,
                    "SALES_UNIT": "",
                    "UNIT_CODE":pParam[0].UNIT_SYMBOL,
                    "DISCOUNT_PRICE":"",
                    "DISCOUNT_FLAG":"",
                    "STRIKE_FLAG":"",
                    "VAT":pParam[0].VAT,
                    "VARIETY":"",
                    "SIZE":"",
                    "CATEGORY":"",
                    "ORIGIN":"",
                    "STOCK":"",
                    "NEXT_DELIVERY_DATE":"",
                    "ORDER_IN_PROGRESS":""
                  }
                }
            ]
        })
        .then(response => 
        {
            App.instance.setState({isExecute:false})
            if (!response.ok) 
            {
                throw new Error('yükleme başarısız. HTTP Hata: ' + response.status);
            }
            return response.json();
        })
        .then(data => 
        {
            App.instance.setState({isExecute:false})
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
            App.instance.setState({isExecute:false})
            console.error('Hata:', error.message);
        });
    }
}

export const _devprint = new devprint()