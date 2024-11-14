import {core} from 'gensrv'
import moment from 'moment'
import * as xlsx from 'xlsx'
import fs from 'fs'
import rsa from 'jsrsasign'
import { pem } from '../pem.js'
import cron from 'node-cron';
import nodemailer from  'nodemailer'
class piqService
{
    constructor()
    {
        this.socket = null;
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)

        this.processRun()
    }

    connEvt(pSocket)
    {
        // Mail Gönderimi
        pSocket.on('mailer',async (pParam,pCallback) =>
        {
            pCallback(await this.mailSend(pParam))
        })
        // Kasalara mesaj gönderimi
        pSocket.on('msgService',(pParam,pCallback) =>
        {
            if(pParam.tag == 'msgPosDevice')
            {
                this.core.socket.emit('msgService',pParam)
            }
        })
    }

    async processRun()
    {
        // Şubat ayında Müşteri puan sıfırlaması 
        cron.schedule('0 1 1 2 *', async () => 
        {
            try
            {
                let tmpCustomerQuery = 
                {
                    query : "SELECT GUID FROM CUSTOMERS WHERE DELETED = 0"
                }

                let tmpResultCustomer = await core.instance.sql.execute(tmpCustomerQuery)

                if(typeof tmpResultCustomer.result.err == 'undefined' && tmpResultCustomer.result.recordset.length > 0)
                {
                    for (let i = 0; i < tmpResultCustomer.result.recordset.length; i++) 
                    {
                        let tmpQuery = 
                        {
                            query : "SELECT ISNULL(SUM(CASE WHEN TYPE = 0 THEN POINT ELSE POINT * -1 END),0) AS POINT FROM CUSTOMER_POINT WHERE CUSTOMER = '" + tmpResultCustomer.result.recordset[i].GUID + "' AND DELETED = 0 " +
                                    "UNION ALL " +
                                    "SELECT ISNULL(SUM(CASE WHEN TYPE = 0 THEN POINT ELSE POINT * -1 END),0) AS POINT FROM CUSTOMER_POINT WHERE CUSTOMER = '" + tmpResultCustomer.result.recordset[i].GUID + "' AND TYPE = 0 AND " +
                                    "CDATE >= CONVERT(NVARCHAR(4),YEAR(dbo.GETDATE())) + '0101' AND CDATE <= CONVERT(NVARCHAR(4),YEAR(dbo.GETDATE())) + '0131' AND DELETED = 0",
                        }
        
                        let tmpResult = await core.instance.sql.execute(tmpQuery)
                        
                        if(typeof tmpResult.result.err == 'undefined' && tmpResult.result.recordset.length > 0)
                        {
                            if(tmpResult.result.recordset[0].POINT > tmpResult.result.recordset[1].POINT)
                            {
                                let uuidv4 = ()=>
                                {
                                    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                                      ).toString().toUpperCase();
                                }
                                
                                let tmpInsertQuery = 
                                {
                                    query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                                            "@GUID = @PGUID, " + 
                                            "@CUSER = @PCUSER, " + 
                                            "@TYPE = @PTYPE, " +     
                                            "@CUSTOMER = @PCUSTOMER, " +                  
                                            "@DOC = @PDOC, " + 
                                            "@POINT = @PPOINT, " + 
                                            "@DESCRIPTION = @PDESCRIPTION ", 
                                    param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                                    value : [uuidv4(),'Admin',1,tmpResultCustomer.result.recordset[i].GUID,'00000000-0000-0000-0000-000000000000',Number(tmpResult.result.recordset[0].POINT) - Number(tmpResult.result.recordset[1].POINT),'TRANSFER'],
                                }
                                await core.instance.sql.execute(tmpInsertQuery)

                                let tmpUpdateQuery = 
                                {
                                    query : "UPDATE CUSTOMERS SET POINT = (SELECT dbo.FN_CUSTOMER_TOTAL_POINT(GUID,dbo.GETDATE())) WHERE GUID = @CUSTOMER", 
                                    param : ['CUSTOMER:string|50'],
                                    value : [tmpResultCustomer.result.recordset[i].GUID],
                                }
                                await core.instance.sql.execute(tmpUpdateQuery)
                            }
                        }
                    }
                }
            }
            catch (err) 
            {
                console.log(err);
            }
        });
        // Pos Satışlarının günlük aktarımı 
        cron.schedule('0 23 * * *', async () => 
        {

            let tmpPosDataQuerty = 
            {  
                query : " SELECT     " +
                        "ITEM_GUID,    " +
                        "DEPOT_GUID,    " +
                        "SUM(QUANTITY)  AS QUANTITY    " +
                        "FROM (SELECT ITEM_CODE,ITEM_GUID,CASE WHEN TYPE = 0 THEN QUANTITY WHEN TYPE = 1 THEN (QUANTITY * -1) END AS QUANTITY,DEPOT_GUID from POS_SALE_VW_01 WHERE STATUS = 1 AND DOC_DATE = CONVERT(nvarchar,GETDATE(),110)) " +
                        "AS TMP GROUP BY ITEM_GUID,DEPOT_GUID  ",
            }

            let tmpPosData = (await core.instance.sql.execute(tmpPosDataQuerty)).result.recordset
            
            for (let i = 0; i < tmpPosData.length; i++) 
            {
                let tmpQuantityUpdateQuery = 
                {
                    query : "EXEC  [dbo].[PRD_POS_ITEM_QUANTITY_UPDATE] " + 
                            "@ITEM = @PITEM, "  + 
                            "@DEPOT = @PDEPOT, " + 
                            "@QUANTITY = @PQUANTITY ",
                    param : ['PITEM:string|50','PDEPOT:string|50','PQUANTITY:float'],
                    value : [tmpPosData[i].ITEM_GUID,tmpPosData[i].DEPOT_GUID,tmpPosData[i].QUANTITY],
                }
                await core.instance.sql.execute(tmpQuantityUpdateQuery)
            }
        
        });

        // Depo Miktar güncellenmesi - Cari Bakiye güncellemesi
        cron.schedule('0 4 * * *', async () => 
        {

            let tmpQuantityUpdateQuery = 
            {
                query : "UPDATE ITEM_QUANTITY SET QUANTITY = (SELECT dbo.FN_DEPOT_QUANTITY2(ITEM,DEPOT,dbo.dbo.GETDATE())) ",
            }

            await core.instance.sql.execute(tmpQuantityUpdateQuery)
            
            let tmpBalanceUpdateQuery = 
            {
                query : "UPDATE ACCOUNT_BALANCE SET BALANCE = (SELECT [dbo].[FN_CUSTOMER_BALANCE](ACCOUNT_GUID,dbo.dbo.GETDATE())) ",
            }
        
            await core.instance.sql.execute(tmpBalanceUpdateQuery)
        
        });
       
    }

    async mailSend(pData)
    {
        return new Promise(async resolve =>
        {
            let tmpAttach = [];
            if(typeof pData.attachName != 'undefined')
            {
                tmpAttach = 
                [
                    {
                        filename: pData.attachName,
                        content: pData.attachData,
                        encoding: 'base64'
                    }
                ]
            }

            let tmpQuery
            if(typeof pData.mailGuid != 'undefined' || pData.mailGuid == '')
            {
                tmpQuery = 
                {
                    query : "SELECT * FROM MAIL_SETTINGS WHERE GUID = @GUID ",
                    param : ['GUID:string|50'],
                    value : [pData.mailGuid]
                }
            }
            else
            {
                tmpQuery = 
                {
                    query : "SELECT * FROM MAIL_SETTINGS WHERE MASTER = 1 ",
                }
            }
           

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(typeof tmpResult[0] != 'undefined')
            {
                let tmpservice = ''
                if(tmpResult[0].MAIL_SERVICE == 'gmail')
                {
                    tmpservice = 'gmail'
                }
                let transporter = nodemailer.createTransport(
                {
                    service: tmpservice,
                    host: tmpResult[0].MAIL_SMTP,
                    port: tmpResult[0].MAIL_PORT,
                    secure: true,
                    auth: 
                    {
                    user: tmpResult[0].MAIL_ADDRESS,
                    pass: tmpResult[0].MAIL_PASSWORD
                    },
                    //tls : { rejectUnauthorized: false }
                });
                var mailOptions = 
                {
                    from: tmpResult[0].MAIL_ADDRESS,
                    to: pData.sendMail,
                    subject: pData.subject,
                    html:pData.html,
                    text:pData.text,
                    attachments: tmpAttach
                };
                transporter.sendMail(mailOptions, function(error, info)
                {
                    if (error) 
                    {
                        console.log(error)
                        resolve(error);
                    }
                    else
                    {
                        resolve(0);
                    }
                });
            }
            else
            {
                resolve(1);
            }
        })
    }
}

export const _piqService = new piqService()