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

                //service: 'imap.ionos.fr',
                host: 'ssl0.ovh.net',
                port: 465,
                secure: true,
                auth: 
                {
                  user: "info@g2gourmet.fr",
                  pass: "Sivas2022+"
                },
                tls : { rejectUnauthorized: false, ciphers:'SSLv3' }
              });
              var mailOptions = {
                from: "info@g2gourmet.fr",
                to: pData.sendMail,
                subject: pData.subject,
                html:pData.html,
                text:pData.text,
                attachments: tmpAttach
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
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