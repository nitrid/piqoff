import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { core } from 'gensrv'
import cron from 'node-cron';
import axios from 'axios';
class fumaWebApi
{
    constructor()
    {
        this.core = core.instance;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.connEvt = this.connEvt.bind(this);
        this.core.socket.on('connection',this.connEvt);
        this.active = true;
        this.sellerVkn = '';

        this.getVkn();
        this.processEndDay();
    }
    async connEvt(pSocket)
    {
        try 
        {
            if(this.active == true)
            {
                pSocket.on('posSaleClosed',async (pParam,pCallback) =>
                {
                    if (pParam[0]?.pos[0]?.CUSTOMER_CODE && pParam[0]?.pos[0]?.CUSTOMER_CODE != "")
                    {
                        const sendData = [];
                        const posSale = [];
                        const fullName = pParam[0]?.pos[0]?.CUSTOMER_NAME || '';
                        const [firstName = '', lastName = ''] = fullName.trim().split(' ');
    
                        const userData = 
                        {
                            "sellerVkn": this.sellerVkn,
                            "userTransferId": pParam[0]?.pos[0]?.GUID,
                            "cardId": pParam[0]?.pos[0]?.CUSTOMER_CODE,
                            "name": firstName,
                            "surname": lastName,
                            "point": parseInt(pParam[0]?.special.customerPoint),
                            "cardTransferId": pParam[0]?.pos[0]?.GUID,
                            "email": pParam[0]?.pos[0]?.CUSTOMER_MAIL
                        };
                        const posData = 
                        {
                            vat: pParam[0]?.pos[0]?.VAT,
                            discount: pParam[0]?.pos[0]?.DISCOUNT,
                            famount: pParam[0]?.pos[0]?.FAMOUNT,
                            amount: pParam[0]?.pos[0]?.AMOUNT,
                            total: pParam[0]?.pos[0]?.TOTAL,
                            loyalty: pParam[0]?.pos[0]?.LOYALTY,
                            orderTransferId: pParam[0]?.pos[0]?.GUID,
                            documentDate: pParam[0]?.pos[0]?.DOC_DATE,
                            userTransferId: pParam[0]?.pos[0]?.CUSTOMER_GUID == "00000000-0000-0000-0000-000000000000" ? null : pParam[0]?.pos[0]?.CUSTOMER_GUID,
                            email: pParam[0]?.pos[0]?.CUSTOMER_MAIL,
                            name: pParam[0]?.pos[0]?.CUSTOMER_NAME,
                            surname: pParam[0]?.pos[0]?.CUSTOMER_NAME,
                            cardId: pParam[0]?.pos[0]?.CUSTOMER_CODE,
                            cardTransferId: pParam[0]?.pos[0]?.CUSTOMER_GUID == "00000000-0000-0000-0000-000000000000" ? null : pParam[0]?.pos[0]?.CUSTOMER_GUID,
                            winPoint: parseInt(pParam[0]?.special.customerPoint) - parseInt(pParam[0]?.special.customerGrowPoint),
                            lostPoint: parseInt(pParam[0]?.special.customerUsePoint)
                        };
                        const posSaleData = pParam[0]?.possale;
    
                        for (let i = 0; i < posSaleData.length; i++) 
                        {
                            posSale.push
                            ({
                                transferId: posSaleData[i]?.GUID,
                                orderTransferId: posSaleData[i]?.GUID,
                                productName: posSaleData[i]?.ITEM_NAME,
                                productId: posSaleData[i]?.ITEM_CODE,
                                productTransferId: posSaleData[i]?.ITEM_GUID,
                                lineNo: posSaleData[i]?.LINE_NO,
                                quantity: Number(posSaleData[i]?.QUANTITY),
                                price: posSaleData[i]?.PRICE,
                                famount: posSaleData[i]?.FAMOUNT,
                                amount: posSaleData[i]?.AMOUNT,
                                discount: posSaleData[i]?.DISCOUNT,
                                loyalty: posSaleData[i]?.LOYALTY,
                                vat: posSaleData[i]?.VAT,
                                total: posSaleData[i]?.TOTAL,
                                subTotal: posSaleData[i]?.SUBTOTAL
                            });
                        }
    
                        sendData.push
                        ({ 
                            sellerVkn: this.sellerVkn, 
                            pos: posData, 
                            posSale: posSale, 
                            userInfo: userData, 
                            pdf: pParam[1]
                        });

                        this.sendOrder(sendData);

                        //Eğer satışta puan işlem gördüyse;
                        if (posData.winPoint > 0 || posData.lostPoint > 0)
                        {
                            //this.pointAction(posData);
                            this.pointProcess();
                        }
                    }
                });
                pSocket.on('customerUpdate',async (pParam,pCallback) =>
                {    
                    //this.customerProcess();
                });
            }
        } 
        catch (error) 
        {
            console.log("Fuma Web Socket Process Error:"+ error)    
        }
    }
    async getVkn()
    {
        try
        {
            let tmpQuery = 
            {
                query : " SELECT TOP 1 * FROM COMPANY_VW_01",
            }
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
    
            if(typeof tmpResult[0] != 'undefined')
            {
                this.sellerVkn = tmpResult[0].TAX_NO
            }
        }
        catch (error) 
        {
            console.log("Fuma getVkn error" + error);
        }
    }
    async processEndDay()
    {
        cron.schedule('0 4 * * *', async () => 
        {
            try 
            {
                await this.orderProcess();
                await this.customerProcess();
                await this.pointProcess();
            } 
            catch (error) 
            {
                console.log("CronJob error" + error);
            }
        });
    }
    async pointAction(posData)
    {
        const sendData = [];

        if (posData.winPoint > 0)
        {
            const winData = 
            {
                sellerVkn: this.sellerVkn,
                orderId: posData.orderTransferId,
                description: "",
                documentDate: posData.documentDate,
                type: 0,
                point: posData.winPoint,
                transferId: posData.orderTransferId,
                cardTransferId: posData.cardTransferId,
                cardId: posData.cardId
            }
            
            sendData.push(winData);
        }

        if (posData.lostPoint > 0)
        {
            const winData = 
            {
                sellerVkn: this.sellerVkn,
                orderId: posData.orderTransferId,
                description: "",
                documentDate: posData.documentDate,
                type: 1,
                point: posData.lostPoint,
                transferId: posData.orderTransferId,
                cardTransferId: posData.cardTransferId,
                cardId: posData.cardId
            }
            
            sendData.push(winData);
        }

        this.sendPoint(sendData);
    }
    async orderProcess()
    {
        let sendData = [];
        let posQuery = 
        {
            query : `SELECT
                        ROUND(POS.VAT, 4) AS vat,
                        ROUND(POS.DISCOUNT, 4) AS discount,
                        ROUND(POS.FAMOUNT, 4) AS famount,
                        ROUND(POS.AMOUNT, 4) AS amount,
                        ROUND(POS.TOTAL, 4) AS total,
                        ROUND(POS.LOYALTY, 4) AS loyalty,
                        POS.GUID AS orderTransferId,
                        POS.LDATE AS documentDate,
                        POS.CUSTOMER_GUID AS userTransferId,
                        LOWER(POS.CUSTOMER_MAIL) AS email,
                        POS.CUSTOMER_PHONE AS mobilePhone,
                        POS.CUSTOMER_FIRST_NAME AS name,
                        POS.CUSTOMER_LAST_NAME AS surname,
                        POS.CUSTOMER_CODE AS cardId,
                        POS.CUSTOMER_GUID AS cardTransferId,
                        CAST(ISNULL(CUST.POINT, 0) AS INT) AS point,
                        CAST(ISNULL(WIN_POINT.POINT, 0) AS INT) AS winPoint,
                        CAST(ISNULL(LOST_POINT.POINT, 0) AS INT) AS lostPoint,
                        ISNULL(AUDIT_LOG.STATUS, 0) AS STATUS
                    FROM
                        FUMA_VW_01 AS POS
                    LEFT JOIN
                        CUSTOMERS AS CUST ON POS.CUSTOMER_GUID = CUST.GUID
                    LEFT JOIN
                        (SELECT CUSTOMER, DOC, POINT FROM CUSTOMER_POINT WHERE TYPE = 0) AS WIN_POINT 
                        ON POS.CUSTOMER_GUID = WIN_POINT.CUSTOMER AND POS.GUID = WIN_POINT.DOC
                    LEFT JOIN
                        (SELECT CUSTOMER, DOC, POINT FROM CUSTOMER_POINT WHERE TYPE = 1) AS LOST_POINT 
                        ON POS.CUSTOMER_GUID = LOST_POINT.CUSTOMER AND POS.GUID = LOST_POINT.DOC
                    LEFT JOIN
                        AUDIT_LOG ON POS.GUID = AUDIT_LOG.DOC AND AUDIT_LOG.TYPE = 'POS'
                    WHERE
                        ISNULL(AUDIT_LOG.STATUS, 0) = 0
                        AND POS.STATUS = 1
                        AND POS.CUSTOMER_CODE <> ''
                        AND AUDIT_LOG.DOC IS NULL `
        }
        
        let posData = (await core.instance.sql.execute(posQuery)).result.recordset;
        
        if(posData.length > 0)
        {
            const orderTransferIds = posData.map(row => `'${row.orderTransferId}'`).join(',');

            let posSaleQuery = 
            {
                query : `SELECT 
                        GUID AS transferId,
                        POS_GUID AS orderTransferId,
                        ITEM_NAME AS productName,
                        ITEM_CODE AS productId,
                        ITEM_GUID AS productTransferId,
                        LINE_NO AS 'lineNo',
                        QUANTITY AS quantity,
                        ROUND(PRICE,4) AS price,
                        ROUND(FAMOUNT,4) AS famount,
                        ROUND(AMOUNT,4) AS amount,
                        ROUND(DISCOUNT,4) AS discount,
                        ROUND(LOYALTY,4) AS loyalty,
                        ROUND(VAT,4) AS vat,
                        ROUND(TOTAL,4) AS total,
                        ROUND(FAMOUNT,4) AS subTotal
                        FROM FUMA_VW_02 
                        WHERE POS_GUID IN (${orderTransferIds})`,
            }
        
            const posSaleData = (await core.instance.sql.execute(posSaleQuery)).result.recordset;
        
            // posSaleData'yı orderTransferId'ye göre gruplandıralım.
            const groupedPosSaleData = posSaleData.reduce((acc, item) => 
            {
                if (!acc[item.orderTransferId]) {
                    acc[item.orderTransferId] = [];
                }
                acc[item.orderTransferId].push(item);
                return acc;
            }, {});
        
            for (let i = 0; i < posData.length; i++) 
            {
                const userInfo = 
                {
                    "sellerVkn": this.sellerVkn,
                    "userTransferId": posData[i].userTransferId,
                    "cardId": posData[i].cardId,
                    "name": posData[i].name,
                    "surname": posData[i].surname,
                    "mobilePhone": posData[i].mobilePhone,
                    "point": parseInt(posData[i].point),
                    "cardTransferId": posData[i].cardTransferId,
                    "email": posData[i].email
                };

                sendData.push({ sellerVkn: this.sellerVkn, pos: posData[i], posSale: groupedPosSaleData[posData[i].orderTransferId], userInfo: userInfo, pdf: ""});
            }

            await this.sendOrder(sendData);
        }
    }
    async customerProcess()
    {
        let sendData = [];
        let customerQuery = 
        {
            query : `WITH FumaGrouped AS (
                        SELECT
                            MAX(FUMA.NAME) AS name,
                            MAX(FUMA.LAST_NAME) AS surname,
                            LOWER(MAX(FUMA.EMAIL)) AS email,
                            MAX(FUMA.PHONE1) AS mobilePhone,
                            MAX(FUMA.GUID) AS userTransferId,
                            MAX(FUMA.CODE) AS cardId,
                            MAX(FUMA.GUID) AS cardTransferId,
                            MAX(FUMA.CUSTOMER_POINT) AS point
                        FROM
                            FUMA_VW_03 AS FUMA
                        WHERE
                            FUMA.CODE <> ''
                        GROUP BY
                            FUMA.CODE
                    )
                    SELECT
                        FumaGrouped.*,
                        ISNULL(AUDIT_LOG.STATUS, 0) AS STATUS
                    FROM
                        FumaGrouped
                    LEFT JOIN
                        AUDIT_LOG ON FumaGrouped.userTransferId = AUDIT_LOG.DOC AND AUDIT_LOG.TYPE = 'USER'
                    WHERE
                        ISNULL(AUDIT_LOG.STATUS, 0) = 0
                        AND AUDIT_LOG.DOC IS NULL
                    `,
        }
        
        let customerData = (await core.instance.sql.execute(customerQuery)).result.recordset;

        if (customerData.length)
        {
            for (let i = 0; i < customerData.length; i++) 
            {
                const userInfo = 
                {
                    "sellerVkn": this.sellerVkn,
                    "userTransferId": customerData[i].userTransferId,
                    "cardId": customerData[i].cardId,
                    "name": customerData[i].name,
                    "surname": customerData[i].surname,
                    "mobilePhone": customerData[i].mobilePhone,
                    "point": parseInt(customerData[i].point),
                    "pointLast": parseInt(customerData[i].point),
                    "cardTransferId": customerData[i].cardTransferId,
                    "email": customerData[i].email
                };
                
                sendData.push(userInfo);
            }

            await this.sendCustomer(sendData);
        }
    }
    async pointProcess()
    {
        let sendData = [];
        let pointQuery = 
        {
            query : `SELECT
                        POINT.DOC AS orderId,
                        POINT.DESCRIPTION AS description,
                        POINT.LDATE AS documentDate,
                        POINT.TYPE AS type,
                        POINT.POINT AS point,
                        POINT.GUID AS transferId,
                        CUST.GUID AS cardTransferId,
                        ISNULL(CUST.CODE, '') AS cardId,
                        ISNULL(AUDIT_LOG.STATUS, 0) AS STATUS
                    FROM
                        CUSTOMER_POINT AS POINT
                    LEFT JOIN
                        CUSTOMER_VW_01 AS CUST ON POINT.CUSTOMER = CUST.GUID
                    LEFT JOIN
                        AUDIT_LOG ON POINT.GUID = AUDIT_LOG.DOC AND AUDIT_LOG.TYPE = 'POINT'
                    WHERE
                        CUST.CODE IS NOT NULL AND
                        ISNULL(AUDIT_LOG.STATUS, 0) = 0 AND
                        POINT.DELETED = 0 AND
                        AUDIT_LOG.DOC IS NULL;`,
        };
        
        let pointData = (await core.instance.sql.execute(pointQuery)).result.recordset;

        if (pointData.length)
        {
            for (let i = 0; i < pointData.length; i++) 
            {
                const cardInfo = 
                {
                    "sellerVkn": this.sellerVkn,
                    "orderId": pointData[i].orderId,
                    "description": pointData[i].description,
                    "documentDate": pointData[i].documentDate,
                    "type": pointData[i].type,
                    "point": Math.trunc(Number(pointData[i].point)),
                    "transferId": pointData[i].transferId,
                    "cardTransferId": pointData[i].cardTransferId,
                    "cardId": pointData[i].cardId
                };
                
                sendData.push(cardInfo);
            }

            await this.sendPoint(sendData);
        }
    }
    async sendOrder(orderData) 
    {
        console.log("[sendOrder]-Start total data: " + orderData.length);

        const chunkSize = 1000;
        let index = 0;
        
        const config = 
        {
            headers: 
            {
                "x-api-key": "1453",
                "Content-Type": "application/json"
            }
        };
    
        while (index < orderData.length) 
        {
            const chunk = orderData.slice(index, index + chunkSize);
            index += chunkSize;

            try 
            {
                console.log(`[sendOrder]-sendData: ` + chunk.length);

                const response = await axios.post('http://fuma.piqsoft.net:3090/integration/createOrders', chunk, config);

                if (response.data && response.data.success)
                {
                    const insertValue = chunk.map(data => `(GETDATE(), 'POS', '${data.pos.orderTransferId}', 1)`);
                    await this.insertAuditLog(insertValue);
                }
            } 
            catch (error) 
            {
                console.error('[sendOrder] - Error sending order:', JSON.stringify(error));
            }
        }

        console.log("[sendOrder]-end");
    }
    async sendCustomer(customerData) 
    {
        console.log("[sendCustomer]-Start total data: " + customerData.length);

        const chunkSize = 1000;
        let index = 0;
        
        const config = 
        {
            headers: 
            {
                "x-api-key": "1453",
                "Content-Type": "application/json"
            }
        };
    
        while (index < customerData.length) 
        {
            const chunk = customerData.slice(index, index + chunkSize);
            index += chunkSize;

            try 
            {
                console.log(`[sendCustomer]-sendData: ` + chunk.length);

                const response = await axios.post('http://fuma.piqsoft.net:3090/integration/createUsers', chunk, config);

                if (response.data && response.data.success)
                {
                    const insertValue = chunk.map(data => `(GETDATE(), 'USER', '${data.userTransferId}', 1)`);
                    await this.insertAuditLog(insertValue);
                }
            }
            catch (error) 
            {
                console.error('[sendCustomer] - Error sending order:', JSON.stringify(error));
            }
        }

        console.log("[sendCustomer]-end");
    }
    async sendPoint(pointData) 
    {
        console.log("[sendPoint]-Start total data: " + pointData.length);

        const chunkSize = 1000;
        let index = 0;
        
        const config = 
        {
            headers: 
            {
                "x-api-key": "1453",
                "Content-Type": "application/json"
            }
        };
    
        while (index < pointData.length) 
        {
            const chunk = pointData.slice(index, index + chunkSize);
            index += chunkSize;

            try 
            {
                console.log(`[sendPoint]-sendData: ` + chunk.length);

                const response = await axios.post('http://fuma.piqsoft.net:3090/integration/creatUserPointLog', chunk, config);

                if (response.data && response.data.success)
                {
                    const insertValue = chunk.map(data => `(GETDATE(), 'POINT', '${data.transferId}', 1)`);
                    await this.insertAuditLog(insertValue);
                }
            } 
            catch (error) 
            {
                console.error('[sendPoint]-Error sending order:', JSON.stringify(error));
            }
        }

        console.log("[sendPoint]-end");
    }
    async insertAuditLog(insertData)
    {
        let insertQuery = 
        {
            query : `INSERT INTO [dbo].[AUDIT_LOG]
                    ([CDATE]
                    ,[TYPE]
                    ,[DOC]
                    ,[STATUS])
                VALUES ${insertData.join(",")}`
        }

        await core.instance.sql.execute(insertQuery);
    }
}

export const _fumaWebApi = new fumaWebApi()