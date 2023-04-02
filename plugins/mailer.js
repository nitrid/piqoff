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
    mailSend(pData)
    {
        return new Promise(resolve =>
        {
            var transporter = nodemailer.createTransport({
                service: 'hotmail',
                //host: 'smtp.gmail.com',
                port: 465,
                //secure: true,
                auth: 
                {
                  user: "",
                  pass: ""
                },
                //tls : { rejectUnauthorized: false }
              });
              var mailOptions = {
                from: "",
                to: pData.sendMail,
                subject: pData.subject,
                html:pData.html,
                attachments: [
                    {  
                        filename: pData.attachName,
                        content: pData.attachData,
                        encoding: 'base64'
                    },
                  
                ]
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error)
                    resolve(error);
                } else {
                    resolve(0);
                }
              });
        })
    }
}

export const _mailer = new mailer()

