import {core} from 'gensrv'
import moment from 'moment'
import * as xlsx from 'xlsx'
import fs from 'fs'
import rsa from 'jsrsasign'
import { pem } from '../pem.js'
import nodemailer from  'nodemailer'
class mailer
{
    constructor()
    {
        this.socket = null;
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
    }

    connEvt(pSocket)
    {
        pSocket.on('mailer',async (pParam,pCallback) =>
        {
            pCallback(await this.mailSend(pParam))
        })
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
            console.log(tmpResult)
            let transporter = nodemailer.createTransport(
            {

                //service: 'imap.ionos.fr',
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
              var mailOptions = {
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
        })
    }
}

export const _mailer = new mailer()