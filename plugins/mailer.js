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
        console.log(5)
        pSocket.on('mailer',async (pParam,pCallback) =>
        {
            pCallback(await this.mailSend(pParam))
        })
    }

    mailSend(pData)
    {
        console.log(6)
       
        return new Promise(resolve =>
        {
            console.log(pData)
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
            console.log(pData)
            let transporter = nodemailer.createTransport(
            {

                //service: pData.service,
                host:  pData.host,
                port: pData.port,
                secure: true,
                auth: 
                {
                    user:  pData.userMail,
                    pass: pData.password,
                },
                //tls : { rejectUnauthorized: false }
            });
            var mailOptions =
            {
                from: pData.userMail,
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