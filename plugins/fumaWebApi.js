import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {core} from 'gensrv'
import cron from 'node-cron';
import fetch from 'node-fetch';
import moment from 'moment'

class fumaWebApi
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.active = false
        this.sellerVkn = ''

        this.getVkn()
        this.processEndDay()
    }
    async connEvt(pSocket)
    {
        if(this.active == true)
        {
            pSocket.on('posSaleClosed',async (pParam,pCallback) =>
            {
                this.processPosSaleSend(pParam)
            })
            pSocket.on('customerUpdate',async (pParam,pCallback) =>
            {          
                this.processCustomerSend(pParam)
            })
            pSocket.on('allCustomerSend',async (pParam,pCallback) =>
            {
                this.processCustomerSend('00000000-0000-0000-0000-000000000000')
            })
        }
    }
    async getVkn()
    {
        let tmpQuery = 
        {
            query : " SELECT TOP 1 * FROM COMPANY_VW_01",
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        this.sellerVkn = tmpResult[0].TAX_NO
    }
    async processEndDay()
    {
        cron.schedule('0 4 * * *', async () => 
        {
            try
            {
                let tmpData = []
                let tmpQuery = 
                {
                    query : "SELECT GUID FROM POS_VW_01 WHERE STATUS = 1 AND DOC_DATE >= @FIRST AND DOC_DATE <= @LAST AND CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000'",
                    param : ['FIRST:date','LAST:date'],
                    value : [moment().add(-1,'day').format("YYYYMMDD"),moment().add(-1,'day').format("YYYYMMDD")]
                }
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
                {
                    for (let i = 0; i < tmpResult.length; i++) 
                    {
                        let tmpPosQuery = 
                        {
                            query : "SELECT * FROM POS_VW_01 WHERE GUID = @GUID",
                            param : ['GUID:string|50'],
                            value : [tmpResult[i].GUID]
                        }
                        let tmpPosResult = (await core.instance.sql.execute(tmpPosQuery)).result.recordset
    
                        if(typeof tmpPosResult != 'undefined' && tmpPosResult.length > 0)
                        {
                            let tmpPosSaleQuery = 
                            {
                                query : "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @POS_GUID",
                                param : ['POS_GUID:string|50'],
                                value : [tmpResult[0].GUID]
                            }
                            let tmpPosSaleResult = (await core.instance.sql.execute(tmpPosSaleQuery)).result.recordset
    
                            if(typeof tmpPosSaleResult != 'undefined' && tmpPosSaleResult.length > 0)
                            {
                                tmpData.push(
                                {
                                    pos : tmpPosResult,
                                    possale : tmpPosSaleResult,
                                    special : {customerPoint:tmpPosResult[0].CUSTOMER_POINT}
                                })
                            }
                        }
                    }
                    this.processPosSaleSend({list:tmpData})
                }
            }
            catch(err)
            {
                console.log(err)
            }
        })
    }
    async processPosSaleSend(pData)
    {
        if(this.active == true)
        {
            let tmpSale = []
            
            if(typeof pData.list != 'undefined')
            {
                for (let m = 0; m < pData.list.length; m++) 
                {
                    let tmpSaleLine = []
                    for (let i = 0; i < pData.list[m].possale.length; i++) 
                    {
                        let tmpLineEdit = 
                        {
                            "productName": pData.list[m].possale[i].ITEM_NAME,
                            "productId": pData.list[m].possale[i].ITEM_CODE,
                            "lineNo": pData.list[m].possale[i].LINE_NO,
                            "quantity": Number(pData.list[m].possale[i].QUANTITY),
                            "price": pData.list[m].possale[i].PRICE,
                            "famount": pData.list[m].possale[i].FAMOUNT,
                            "amount": pData.list[m].possale[i].AMOUNT,
                            "discount": pData.list[m].possale[i].DISCOUNT,
                            "loyalty": pData.list[m].possale[i].LOYALTY,
                            "vat": pData.list[m].possale[i].VAT,
                            "total": pData.list[m].possale[i].TOTAL,
                            "subTotal":pData.list[m].possale[i].FAMOUNT,
                            "transferId": pData.list[m].possale[i].GUID
                        }
                        tmpSaleLine.push(tmpLineEdit)
                    }
                    
                    let tmpDto = 
                    {
                        "sellerVkn": this.sellerVkn,
                        "userInfo" : 
                        {
                            "transferId" : pData.list[m].pos[0].CUSTOMER_CODE,
                            "cardId" : pData.list[m].pos[0].CUSTOMER_CODE,
                            "email": pData.list[m].pos[0].CUSTOMER_MAIL,
                            "sellerVkn": this.sellerVkn,
                            "point": Number(pData.list[m].special.customerPoint),
                        },
                        "pos": 
                        {
                            "vat": pData.list[m].pos[0].VAT,
                            "discount": pData.list[m].pos[0].DISCOUNT,
                            "famount": pData.list[m].pos[0].FAMOUNT,
                            "amount": pData.list[m].pos[0].AMOUNT,
                            "total": pData.list[m].pos[0].TOTAL,
                            "loyalty": pData.list[m].pos[0].LOYALTY,
                            "point": parseInt(pData.list[m].pos[0].TOTAL * 1),
                            "transferId": pData.list[m].pos[0].GUID,
                            "documentDate": pData.list[m].pos[0].LDATE
                        },
                        "posSale": tmpSaleLine,
                        "pdf": ""
                    }

                    tmpSale.push(tmpDto)
                }
            }
            else
            {
                let tmpSaleLine = []
                for (let i = 0; i < pData[0].possale.length; i++) 
                {
                    let tmpLineEdit = 
                    {
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
    
                tmpSale = 
                [{
                    "sellerVkn": this.sellerVkn,
                    "userInfo" : 
                    {
                        "transferId" : pData[0].pos[0].CUSTOMER_CODE,
                        "cardId" : pData[0].pos[0].CUSTOMER_CODE,
                        "email": pData[0].pos[0].CUSTOMER_MAIL,
                        "sellerVkn": this.sellerVkn,
                        "point": Number(pData[0].special.customerPoint),
                    },
                    "pos": 
                    {
                        "vat": pData[0].pos[0].VAT,
                        "discount": pData[0].pos[0].DISCOUNT,
                        "famount": pData[0].pos[0].FAMOUNT,
                        "amount": pData[0].pos[0].AMOUNT,
                        "total": pData[0].pos[0].TOTAL,
                        "loyalty": pData[0].pos[0].LOYALTY,
                        "point": parseInt(pData[0].pos[0].TOTAL * (pData[0].special.customerPointFactory / 100)),
                        "transferId": pData[0].pos[0].GUID,
                        "documentDate": pData[0].pos[0].LDATE
                    },
                    "posSale": tmpSaleLine,
                    "pdf": typeof pData[1] == 'undefined' ? "" : "data:image/png;base64," + pData[1]
                }]
            }
            //console.log(JSON.stringify(tmpSale))
            if(typeof pData != 'undefined')
            {
                fetch('http://20.19.32.36:3000/integration/createOrders', 
                {
                    method: 'POST',
                    headers:  
                    {
                        'x-api-key': '1453', 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tmpSale)
                })
                .then(response => 
                {
                    if (!response.ok) 
                    {
                        throw new Error('FumaApi - processPosSaleSend : Yükleme başarısız. HTTP Hata: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => 
                {
                    if(data.success)
                    {
                        //console.log("FumaApi - processPosSaleSend : Gönderim başarılı")
                    }
                    else
                    {
                        console.log(data.message, typeof data.error == 'undefined' ? '' : 'FumaApi - processPosSaleSend : ' + data.error)
                    }
                })
                .catch(error => 
                {
                    console.error('FumaApi - processPosSaleSend Hata:', error.message);
                });
            }
        }
    }
    async customerUpdate(pData)
    {   
        if(this.active == true)
        {
            if(typeof pData != 'undefined')
            {
                fetch('http://20.19.32.36:3000/integration/createUsers', 
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
                        throw new Error(JSON.stringify(response));
                    }
                    return response.json();
                })
                .then(data => 
                {
                    if(data.success)
                    {
                        //console.log("FumaApi - customerUpdate : Gönderim başarılı")
                    }
                    else
                    {
                        console.log(data.message, typeof data.error == 'undefined' ? '' : 'FumaApi - customerUpdate : ' + data.error)
                    }
                })
                .catch(error => 
                {
                    console.error('FumaApi - customerUpdate Hata:', error.message);
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
                        "sellerVkn":this.sellerVkn,
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

export const _fumaWebApi = new fumaWebApi()