import {core} from 'gensrv'
import cron from 'node-cron';
import nodemailer from  'nodemailer'
class prodorDailyPosMail
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
      
    }

    async processRun()
    {

       
        // cron.schedule('0 21 * * *', async () => 
        // {
            let tmpOrderReport =
            {
                query : `SELECT  FORMAT(CONVERT(MONEY, CAST(ISNULL(SUM(TOTAL),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'TOTAL VENTE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'TOTAL TICKET', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1
                        UNION ALL
                        SELECT FORMAT(CONVERT(MONEY, CAST(ISNULL(AVG(TOTAL),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'PANIER MOYEN', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'CHANGEMENT PRIX', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_EXTRA  WHERE TAG = 'PRICE DESC' AND  CONVERT(nvarchar,CDATE,112) = CONVERT(nvarchar,GETDATE(),112)
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'LIGNE SUPPRIMEE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_EXTRA  WHERE TAG = 'ROW DELETE' AND  CONVERT(nvarchar,CDATE,112) = CONVERT(nvarchar,GETDATE(),112)
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'TICKET SUPPRIMEE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_EXTRA  WHERE TAG = 'FULL DELETE' AND  CONVERT(nvarchar,CDATE,112) = CONVERT(nvarchar,GETDATE(),112)
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'TOTAL TICKET RETOUR', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 1 AND STATUS = 1
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'TICKET AVEC CARTE FIDELITE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1 AND CUSTOMER_GUID <> '00000000-0000-0000-0000-000000000000'
                        UNION ALL
                        SELECT   FORMAT(CONVERT(MONEY, CAST(ISNULL(SUM(LOYALTY),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'MONTANT POINT UTILISES', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1 
                        UNION ALL
                        SELECT   FORMAT(CONVERT(MONEY, CAST(ISNULL(SUM(DISCOUNT),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'MONTANT REMISES', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  POS_VW_01 WHERE  DOC_DATE = CONVERT(nvarchar,GETDATE(),112) AND TYPE = 0 AND STATUS = 1 
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'CREER A LA BOUCHERIE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  BALANCE_COUNTER WHERE  TICKET_DATE = CONVERT(nvarchar,GETDATE(),112) 
                        UNION ALL
                        SELECT  CONVERT(NVARCHAR,ROUND(ISNULL(COUNT(GUID),0),2)) AS VAL , TAG = 'VENTE BOUCHERIE', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  BALANCE_COUNTER WHERE  TICKET_DATE = CONVERT(nvarchar,GETDATE(),112)  AND STATUS = 1
                        UNION ALL
                        SELECT   FORMAT(CONVERT(MONEY, CAST(ISNULL(SUM(QUANTITY * PRICE),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'CREER A LA BOUCHERIE TOTAL', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  BALANCE_COUNTER WHERE  TICKET_DATE = CONVERT(nvarchar,GETDATE(),112)  AND FREE = 0
                        UNION ALL
                        SELECT  FORMAT(CONVERT(MONEY, CAST(ISNULL(SUM(QUANTITY * PRICE),0)  AS NUMERIC(18,4))), '###,###.##') + ' €' AS VAL , TAG = 'VENTE BOUCHERIE TOTAL', CONVERT(nvarchar,GETDATE(),104) AS DOC_DATE, ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = '555'),'') AS PATH FROM  BALANCE_COUNTER WHERE  TICKET_DATE = CONVERT(nvarchar,GETDATE(),112)  AND STATUS = 1 AND FREE = 0
                        `,              
            }
            let tmpOrderResult = await core.instance.sql.execute(tmpOrderReport)
            let pResult = await this.core.plugins._devprint.print('{"TYPE":"REVIEW","PATH":"' + tmpOrderResult.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpOrderResult.result.recordset) + '}')
          
            let tmpAttach = pResult.split('|')[1]
            let tmpHtml = ''
            if(pResult.split('|')[0] != 'ERR')
            {
            }
            let tmpMail = 'receeep7@gmail.com'
            let tmpMailData = {html:tmpHtml,subject:'Report',sendMail:tmpMail,attachName:"Pos Report.pdf",attachData:tmpAttach,text:""}
            this.core.plugins._mailer.mailSend(tmpMailData)
        // });
       
    }
}

export const _prodorDailyPosMail = new prodorDailyPosMail()