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
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: "receeep7@gmail.com",
                  pass: "hkinpyynhwfvswyd"
                },
                tls : { rejectUnauthorized: false }
              });
              var mailOptions = {
                from: pData.mail,
                to: 'rcpgs1905@gmail.com',
                subject: pData.subject,
                html:pData.html
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    resolve(error);
                } else {
                    resolve(0);
                }
              });
        })
    }
}

export const _mailer = new mailer()

