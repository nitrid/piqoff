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
                //service: 'imap.ionos.fr',
                host: 'smtp.office365.com',
                port: 587,
                secureConnection: false,
                auth: 
                {
                  user: "vente.prointer-montagneverte@outlook.fr",
                  pass: "PIQSOFT2023"
                },
                tls : { rejectUnauthorized: false, ciphers:'SSLv3' }
              });
              var mailOptions = {
                from: "vente.prointer-montagneverte@outlook.fr",
                to: pData.sendMail,
                subject: pData.subject,
                html:pData.html,
                text:pData.text,
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

