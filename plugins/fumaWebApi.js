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
        this.connEvt = this.connEvt.bind(this)
        this.allCustomerSocket = this.allCustomerSocket.bind(this)
        this.customerUpdateSocket = this.customerUpdateSocket.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.core.socket.on('connection',this.allCustomerSocket)
        this.core.socket.on('connection',this.customerUpdateSocket)
        this.active = false
        this.selletVkn = ''
        this.processCustomerSend('00000000-0000-0000-0000-000000000000')
    }
    async connEvt(pSocket)
    {
        let tmpQuery = 
        {
            query : " SELECT TOP 1 * FROM COMPANY_VW_01",
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        this.selletVkn = tmpResult[0].TAX_NO
        pSocket.on('posSaleClosed',async (pParam,pCallback) =>
        {
          
            this.processPosSaleSend()
        })
    }
    async processPosSaleSend()
    {
        
    }
    async allCustomerSocket(pSocket)
    {
        pSocket.on('allCustomerSend',async (pParam,pCallback) =>
        {
          
            this.processCustomerSend('00000000-0000-0000-0000-000000000000')
        })
    }
    async customerUpdateSocket(pSocket)
    {
        pSocket.on('customerUpdate',async (pParam,pCallback) =>
        {          
            this.processCustomerSend(pParam)
        })
    }
    async customerUpdate(pData)
    {   

        if(typeof pData != 'undefined')
        {
            fetch('http://demo.piqpos.com:3000/integration/createUsers', 
            {
                method: 'POST',
                headers:  
                {
                    'x-api-key': '1453', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pData)
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    console.log(JSON.stringify(pData))

                    throw new Error(JSON.stringify(response));
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
    async processCustomerSend(pGuid)
    {
        let tmpQuery = 
        {
            query : " SELECT *, LOWER(EMAIL) AS MAIL FROM CUSTOMER_VW_02 WHERE EMAIL LIKE  '%@%' AND ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50'],
            value : [pGuid]
        }
        let tmpResult = (await this.core.sql.execute(tmpQuery)).result.recordset

        let tmpCount = tmpResult.length
        let tmpPageCount = Math.ceil(tmpCount / 1000)
        let tmpCounter = 0
        for (let i = 0; i < tmpPageCount; i++) 
        {
            let tmpLength = tmpCounter + 1000
           
            let  slicedArray = tmpResult.slice(tmpCounter, tmpLength)

            let tmpArray = []
            for (let x = 0; x < slicedArray.length; x++) 
            {
                let tmpJson = {
                    "name": slicedArray[x].NAME,
                    "surname": slicedArray[x].LAST_NAME,
                    "email": slicedArray[x].MAIL,
                    "mobilePhoneCountryCode": "",
                    "mobilePhone": slicedArray[x].GSM_PHONE,
                    "transferId": slicedArray[x].GUID,
                    "sellerVkn":this.selletVkn,
                    "cardId": slicedArray[x].CODE,
                    "point": slicedArray[x].CUSTOMER_POINT
                }
                tmpArray.push(tmpJson)
            }

            await this.customerUpdate(tmpArray)
            tmpCounter = tmpLength
        }
    }
}

export const _pricerApi = new pricerApi()