import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'
import cron from 'node-cron';

class pricerApi
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        // this.connEvt = this.connEvt.bind(this)
        this.promoSocket = this.promoSocket.bind(this)
        // this.core.socket.on('connection',this.connEvt)
        this.core.socket.on('connection',this.promoSocket)
        this.active = false

    }
    async promoSocket(pSocket)
    {
        pSocket.on('allPromoSend',async (pParam,pCallback) =>
        {
          
            this.processPromoSend()
        })
    }
    async itemUpdate(pData)
    {   
        if(typeof pData != 'undefined')
        {
            fetch('http://http://demo.piqpos.com:3000/integration/createOrders', 
            {
                method: 'POST',
                headers:  
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                [
                    {
                        "name": pData.NAME,
                        "surname": pData.LAST_NAME,
                        "email": pData.EMAIL,
                        "mobilePhoneCountryCode": "",
                        "mobilePhone": pData.GSM_PHONE,
                        "transferId": "6bbb6e2c-108a-4ef7-892a-4eab7a558d6b",
                        "sellerVkn": "15230490262",
                        "cardId": "65ddf4eb460a390aa5fb2067",
                        "point": 27
                    },
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
    async processPromoClear()
    {
        let tmpQuery = 
        {
            query : " SELECT * FROM CUSTOMERS_VW_01 "
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        for (let i = 0; i < tmpResult.length; i++) 
        {
            await this.itemUpdate(tmpResult[i])
        }
    }
}

export const _pricerApi = new pricerApi()