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
        // this.processCustomerSend('00000000-0000-0000-0000-000000000000')
    }
    async connEvt(pSocket)
    {
        if(this.active == true)
        {
            let tmpQuery = 
            {
                query : " SELECT TOP 1 * FROM COMPANY_VW_01",
            }
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
    
            this.selletVkn = tmpResult[0].TAX_NO
            pSocket.on('posSaleClosed',async (pParam,pCallback) =>
            {
                this.processPosSaleSend(pParam)
            })
        }
      
    }
    async processPosSaleSend(pData)
    {
        if(this.active == true)
        {
            let tmpSaleLine = []
            for (let i = 0; i < pData[0].possale.length; i++) 
            {
                let tmpLineEdit = {
                    "productName": pData[0].possale[i].ITEM_NAME,
                    "productId": pData[0].possale[i].ITEM_CODE,
                    "lineNo": pData[0].possale[i].LINE_NO,
                    "quantity": Number(pData[0].possale[i].QUANTITY),
                    "price": pData[0].possale[i].PRICE,
                    "famount": pData[0].possale[i].FAMOUNT,
                    "amount": pData[0].possale[i].AMOUNT,
                    "discount": pData[0].possale[i].DISCOUNT,
                    "loyalty": pData[0].possale[i].LOYALTY,
                    "vat": pData[0].possale[i].VAT,
                    "total": pData[0].possale[i].TOTAL,
                    "subTotal":pData[0].possale[i].FAMOUNT,
                    "transferId": pData[0].possale[i].GUID
                }
                tmpSaleLine.push(tmpLineEdit)
            }

            let tmpSale = {
                "userEmail": pData[0].pos[0].CUSTOMER_MAIL,
                "sellerVkn": this.selletVkn,
                "point": Number(pData[0].special.customerPoint),
                "pos": 
                {
                    "vat": pData[0].pos[0].VAT,
                    "discount": pData[0].pos[0].DISCOUNT,
                    "famount": pData[0].pos[0].FAMOUNT,
                    "amount": pData[0].pos[0].AMOUNT,
                    "total": pData[0].pos[0].TOTAL,
                    "loyalty": pData[0].pos[0].LOYALTY,
                    "point": Number(pData[0].special.customerPoint),
                    "transferId": pData[0].pos[0].GUID,
                    "documentDate": pData[0].pos[0].DOC_DATE
                },
                "posSale": tmpSaleLine,
                "pdf": "data:image/png;base64," + pData[1]
            }
            console.log(JSON.stringify([tmpSale]))
            if(typeof pData != 'undefined')
            {
                fetch('http://demo.piqpos.com:3000/integration/createOrders', 
                {
                    method: 'POST',
                    headers:  
                    {
                        'x-api-key': '1453', 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([tmpSale])
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
    async allCustomerSocket(pSocket)
    {
        if(this.active == true)
        {
            pSocket.on('allCustomerSend',async (pParam,pCallback) =>
            {
                this.processCustomerSend('00000000-0000-0000-0000-000000000000')
            })
        }
    }
    async customerUpdateSocket(pSocket)
    {
        if(this.active == true)
        {
            pSocket.on('customerUpdate',async (pParam,pCallback) =>
            {          
                this.processCustomerSend(pParam)
            })
        }
    }
    async customerUpdate(pData)
    {   

        if(this.active == true)
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
      
    }
    async processCustomerSend(pGuid)
    {
        if(this.active == true)
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
}

export const _pricerApi = new pricerApi()