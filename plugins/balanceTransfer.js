import {core} from 'gensrv'
import moment from 'moment'
import * as xlsx from 'xlsx'
import fs from 'fs'
import rsa from 'jsrsasign'
import { pem } from '../pem.js'
import AdmZip from 'adm-zip'
import { createHash } from 'crypto'
import cron from 'node-cron';

class nf525
{
    constructor()
    {
        this.core = core.instance;
        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)

        this.appInfo = JSON.parse(fs.readFileSync(this.core.root_path + '/www/package.json', 'utf8'))
        
        this.processRun()
    }
    connEvt(pSocket)
    {       

    }
    async processRun()
    {
        cron.schedule('*/2 * * * *', async () => 
        {
            this.getBalanceData()
        })
    }
    async getBalanceData()
    {
        let tmpQuery = {
            query :"SELECT *,CASE WHEN unit = 'kg' THEN netKg ELSE AMOUNT END AS QUANTITY FROM [CEOPOS].[dbo].[report] WHERE remark <> 'OK' ",
        }
        let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

        for (let i = 0; i < tmpResult.length; i++) 
        {
            await this.DataInsert(tmpResult[i])
        }
    }
    async DataInsert(pData)
    {
        let tmpFor = (4 - pData.indexx.length)
        let tmpCode = pData.indexx
        for (let i = 0; i < tmpFor; i++) 
        {
            tmpCode = "0" + tmpCode
        }
        return new Promise(async resolve =>
        {
            let tmpQuery = {
                query :"EXEC [dbo].[PRD_BALANCE_TRASFER] " +
                        "@T_CUSER = @P_CUSER, " + 
                        "@T_CODE = @P_CODE, " +
                        "@T_TICKET_NO = @P_TICKET_NO, " +
                        "@T_TICKET_DATE = @P_TICKET_DATE, " +
                        "@T_UNIT = @P_UNIT, " +
                        "@T_QUANTITY = @P_QUANTITY, " +
                        "@T_PRICE = @P_PRICE ",
                param : ['P_CUSER:string|50','P_CODE:string|50','P_TICKET_NO:int','P_TICKET_DATE:date','P_UNIT:string|50','P_QUANTITY:float','P_PRICE:float'],
                value : [pData.salesmanName,tmpCode,Number(pData.SID),pData.packDate,pData.unit,Number(pData.QUANTITY),Number(pData.unitPrice)]
            }
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset

            resolve()
        })
    

    }

}
export const _nf525 = new nf525()