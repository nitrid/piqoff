import {core} from 'gensrv'
import moment from 'moment'
import * as xlsx from 'xlsx'
import fs from 'fs'

class nf525
{
    constructor()
    {
        this.socket = null;
        this.core = core.instance;

        this.connEvt = this.connEvt.bind(this)
        this.core.socket.on('connection',this.connEvt)
        this.core.on('onSqlConnected',this.onSqlConnected)
    }
    async onSqlConnected(pStatus)
    {
        // let x = 
        // [
        //     {
        //         adi : "ali kemal",
        //         soyadi : "karaca",
        //         yas : 42
        //     }
        // ]
        // let m = xlsx.utils.json_to_sheet(x)
        // let file = await xlsx.readFile('./test.xlsx')
        // let myWorkBook = xlsx.utils.book_new();
        // xlsx.utils.book_append_sheet(myWorkBook,m,"Sheet3")
        // xlsx.writeFile(myWorkBook,'test.xlsx')
        // const buf = fs.readFileSync('test.xlsx');
        // const workbook = xlsx.read(buf);
        // console.log(workbook)

        // console.log(1)
        // let tmpResult = await getGrandTotalData(0)
        // console.log(tmpResult.length)
        // // DAY
        // for (let i = 0; i < tmpResult.length; i++) 
        // {
        //     await insertGrandTotal(0,tmpResult[i])
        // }    
        // // MONTH
        // tmpResult = await getGrandTotalData(1)
        // for (let i = 0; i < tmpResult.length; i++) 
        // {
        //     await insertGrandTotal(1,tmpResult[i])
        // } 
        // //console.log(tmpResult)
        // // YEAR
        // tmpResult = await getGrandTotalData(2)
        // for (let i = 0; i < tmpResult.length; i++) 
        // {
        //     await insertGrandTotal(2,tmpResult[i])
        // }
    }
    connEvt(pSocket)
    {
        pSocket.on('nf525',async (pParam,pCallback) =>
        {
            if(pParam.cmd == 'jet')
            {
                await this.insertJet(pParam.data)
            }
        })
        pSocket.on('disconnect',async() => 
        {
            if(typeof pSocket.userInfo != 'undefined' && pSocket.userInfo.APP == 'POS')
            {
                await this.insertJet(
                {
                    CUSER:pSocket.userInfo.CODE,            
                    DEVICE:'',
                    CODE:'40',
                    NAME:'Kasa ile bağlantı kesildi.',
                    DESCRIPTION:'',
                    APP_VERSION:'1.0.0'
                })
            }
        })
    }
    async insertJet(pData)
    {
        return new Promise(async resolve =>
        {
            let tmpNo = 0
            let tmpSignature = ''

            let tmpLastQuery =
            {
                query : "SELECT TOP 1 * FROM NF525_JET ORDER BY CDATE DESC"
            }

            let tmpLastData = (await this.core.sql.execute(tmpLastQuery)).result.recordset
            
            if(typeof tmpLastData != 'undefined' && tmpLastData.length > 0)
            {
                tmpNo = tmpLastData[0].NO
                tmpSignature = this.signatureJet(tmpLastData[0])
            }
            
            let tmpInsertQuery = 
            {
                query : "EXEC [dbo].[PRD_NF525_JET_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@NO = @PNO, " +
                        "@DEVICE = @PDEVICE, " +
                        "@CODE = @PCODE, " +
                        "@NAME = @PNAME, " +
                        "@DESCRIPTION = @PDESCRIPTION, " +  
                        "@APP_VERSION = @PAPP_VERSION, " +                       
                        "@SIGNATURE = @PSIGNATURE ",
                param : ['PCUSER:string|25','PNO:int','PDEVICE:string|25','PCODE:string|50','PNAME:string|250','PDESCRIPTION:string|max','PAPP_VERSION:string|10','PSIGNATURE:string|max'],
                value : [pData.CUSER,tmpNo + 1,pData.DEVICE,pData.CODE,pData.NAME,pData.DESCRIPTION,pData.APP_VERSION,tmpSignature]
            }
            await this.core.sql.execute(tmpInsertQuery)
            resolve()
        });
    }
    getGrandTotalData(pType)
    {
        return new Promise(async resolve =>
        {
            if(pType == 0) //day
            {
                let tmpPeriodQuery = 
                {
                    query : "SELECT TOP 1 CONVERT(NVARCHAR(10),PERIOD) AS PERIOD FROM NF525_GRAND_TOTAL WHERE TYPE = 0 ORDER BY PERIOD DESC"
                }
                let tmpPeriodResult = (await core.instance.sql.execute(tmpPeriodQuery)).result.recordset
                
                let tmpQuery = 
                {
                    query : "SELECT " +
                            "DOC_DATE AS DOC_DATE, " +
                            "MAX(VAT_RATE_A) AS VAT_RATE_A, " +
                            "SUM(HT_A) AS HT_A, " +
                            "SUM(TTC_A) AS TTC_A, " +
                            "MAX(VAT_RATE_B) AS VAT_RATE_B, " +
                            "SUM(HT_B) AS HT_B, " +
                            "SUM(TTC_B) AS TTC_B, " +
                            "MAX(VAT_RATE_C) AS VAT_RATE_C, " +
                            "SUM(HT_C) AS HT_C, " +
                            "SUM(TTC_C) AS TTC_C, " +
                            "MAX(VAT_RATE_D) AS VAT_RATE_D, " +
                            "SUM(HT_D) AS HT_D, " +
                            "SUM(TTC_D) AS TTC_D, " +
                            "SUM(FAMOUNT) AS TOTAL_HT, " +
                            "SUM(TOTAL) AS TOTAL_TTC " +
                            "FROM (SELECT " +
                            "POS AS POS, " +
                            "DOC_DATE AS DOC_DATE, " +
                            "NF525.VAT_RATE_A AS VAT_RATE_A, " +
                            "CASE WHEN TYPE = 0 THEN HT_A ELSE HT_A * -1 END AS HT_A, " +
                            "CASE WHEN TYPE = 0 THEN TTC_A ELSE TTC_A * -1 END AS TTC_A, " +
                            "NF525.VAT_RATE_B AS VAT_RATE_B, " +
                            "CASE WHEN TYPE = 0 THEN HT_B ELSE HT_B * -1 END AS HT_B, " +
                            "CASE WHEN TYPE = 0 THEN TTC_B ELSE TTC_B * -1 END AS TTC_B, " +
                            "NF525.VAT_RATE_C AS VAT_RATE_C, " +
                            "CASE WHEN TYPE = 0 THEN HT_C ELSE HT_C * -1 END AS HT_C, " +
                            "CASE WHEN TYPE = 0 THEN TTC_C ELSE TTC_C * -1 END AS TTC_C, " +
                            "NF525.VAT_RATE_D AS VAT_RATE_D, " +
                            "CASE WHEN TYPE = 0 THEN HT_D ELSE HT_D * -1 END AS HT_D, " +
                            "CASE WHEN TYPE = 0 THEN TTC_D ELSE TTC_D * -1 END AS TTC_D, " +
                            "CASE WHEN TYPE = 0 THEN FAMOUNT ELSE FAMOUNT * -1 END AS FAMOUNT, " +
                            "CASE WHEN TYPE = 0 THEN TOTAL ELSE TOTAL * -1 END AS TOTAL " +
                            "FROM NF525_POS_VAT_VW_02 AS NF525 " +
                            "WHERE {0} AND DOC_DATE <= '20220930' AND DOC_TYPE = 0 " +
                            ") AS TMP " +
                            "GROUP BY DOC_DATE ORDER BY DOC_DATE"
                }
    
                if(tmpPeriodResult.length > 0)
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= '" + tmpPeriodResult[0].PERIOD + "'")
                }
                else
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= CONVERT(NVARCHAR(10),GETDATE() - 1,112)")
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                if(typeof tmpResult == 'undefined')
                {
                    tmpResult = []
                }
                resolve(tmpResult)            
            }
            else if(pType == 1) //month
            {
                let tmpQuery = 
                {
                    query : "SELECT " +
                            "MAX(PERIOD) AS DOC_DATE, " +
                            "SUM(HT_A) AS HT_A, " +
                            "SUM(TTC_A) AS TTC_A, " +
                            "SUM(HT_B) AS HT_B, " +
                            "SUM(TTC_B) AS TTC_B, " +
                            "SUM(HT_C) AS HT_C, " +
                            "SUM(TTC_C) AS TTC_C, " +
                            "SUM(HT_D) AS HT_D, " +
                            "SUM(TTC_D) AS TTC_D, " +
                            "SUM(TOTAL_HT) AS TOTAL_HT, " +
                            "SUM(TOTAL_TTC) AS TOTAL_TTC " +
                            "FROM NF525_GRAND_TOTAL WHERE PERIOD >= CONVERT(NVARCHAR(10),DATEADD(MONTH, DATEDIFF(MONTH, 0, DATEADD(MONTH, -1,GETDATE())),0),112) AND " +
                            "PERIOD <= CONVERT(NVARCHAR(10),EOMONTH(DATEADD(MONTH, -1,GETDATE())),112) AND TYPE = 0" +
                            "HAVING YEAR(GETDATE()) = YEAR(CONVERT(NVARCHAR(10),MAX(PERIOD),112))"
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                if(typeof tmpResult != 'undefined' && tmpResult.length > 0 && tmpResult[0].DOC_DATE != null)
                {
                    resolve(tmpResult)          
                }
                
                resolve([])          
            }
            else if(pType == 2) //year
            {
                let tmpQuery = 
                {
                    query : "SELECT " +
                            "MAX(CDATE) AS DOC_DATE, " +
                            "SUM(HT_A) AS HT_A, " +
                            "SUM(TTC_A) AS TTC_A, " +
                            "SUM(HT_B) AS HT_B, " +
                            "SUM(TTC_B) AS TTC_B, " +
                            "SUM(HT_C) AS HT_C, " +
                            "SUM(TTC_C) AS TTC_C, " +
                            "SUM(HT_D) AS HT_D, " +
                            "SUM(TTC_D) AS TTC_D, " +
                            "SUM(TOTAL_HT) AS TOTAL_HT, " +
                            "SUM(TOTAL_TTC) AS TOTAL_TTC " +
                            "FROM NF525_GRAND_TOTAL WHERE PERIOD >= 1 AND PERIOD <= 12 AND TYPE = 1 AND " +
                            "YEAR(CDATE) = YEAR(GETDATE()) - 1"
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
    
                if(typeof tmpResult != 'undefined' &&  tmpResult.length > 0 && tmpResult[0].DOC_DATE != null)
                {
                    resolve(tmpResult)          
                }
                
                resolve([])  
            }
        });
    }
    getLastGrandTotal(pType,pDocDate)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = {}
    
            if(pType == 0)
            {
                tmpQuery = 
                {
                    query : "SELECT TOP 1 * FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = CONVERT(NVARCHAR(10),DATEADD(DD, -1, @DOC_DATE),112) AND YEAR(CDATE) = YEAR(@DOC_DATE)",
                    param : ['TYPE:int','DOC_DATE:string|10'],
                    value : [pType,moment(pDocDate).format("YYYYMMDD")]
                }
            }
            else if(pType == 1)
            {
                tmpQuery = 
                {
                    query : "SELECT TOP 1 * FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = MONTH(DATEADD(MM, -1, @DOC_DATE)) AND YEAR(CDATE) = YEAR(@DOC_DATE)",
                    param : ['TYPE:int','DOC_DATE:string|10'],
                    value : [pType,moment(pDocDate,"YYYYMMDD").format("YYYYMMDD")]
                }
            }
            else if(pType == 2)
            {
                tmpQuery = 
                {
                    query : "SELECT TOP 1 * FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = YEAR(DATEADD(YYYY, -1, @DOC_DATE))",
                    param : ['TYPE:int','DOC_DATE:string|10'],
                    value : [pType,moment(pDocDate,"YYYYMMDD").format("YYYYMMDD")]
                }
            }
    
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
            {
                resolve(tmpResult[0])
            }
            else
            {
                resolve()
            }
        });
    }
    insertGrandTotal(pType,pData)
    {
        return new Promise(async resolve =>
        {
            let tmpPeriod = 0
            if(pType == 0)
            {
                tmpPeriod = Number(moment(pData.DOC_DATE).format("YYYYMMDD"))
            }
            else if(pType == 1)
            {
                tmpPeriod = Number(moment(pData.DOC_DATE,"YYYYMMDD").format("MM"))
            }
            else if(pType == 2)
            {
                tmpPeriod = Number(moment(pData.DOC_DATE,"YYYYMMDD").format("YYYY"))
            }
            
            let tmpCtrlQuery = {}
            if(pType < 2)
            {
                tmpCtrlQuery = 
                {
                    query : "SELECT TOP 1 PERIOD FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = @PERIOD AND YEAR(CDATE) = YEAR(@DOC_DATE)",
                    param : ['TYPE:int','PERIOD:int','DOC_DATE:string|10'],
                    value : [pType,tmpPeriod,moment(pData.DOC_DATE,"YYYYMMDD").format("YYYYMMDD")]
                }
            }
            else
            {
                tmpCtrlQuery = 
                {
                    query : "SELECT TOP 1 PERIOD FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = @PERIOD",
                    param : ['TYPE:int','PERIOD:int'],
                    value : [pType,tmpPeriod]
                }
    
            }
    
            let tmpCtrlResult = await core.instance.sql.execute(tmpCtrlQuery)
    
            if(tmpCtrlResult.result.recordset.length == 0)
            {            
                let tmpLastData = await getLastGrandTotal(pType,pData.DOC_DATE)
                let tmpLastTotal = 0
    
                if(typeof tmpLastData != 'undefined')
                {
                    tmpLastTotal = tmpLastData.GTPCA != null ? tmpLastData.GTPCA : 0
                }
    
                let tmpInsertQuery = 
                {
                    query : "INSERT INTO [dbo].[NF525_GRAND_TOTAL] ( " + 
                            " [CDATE] " + 
                            ",[TYPE] " + 
                            ",[PERIOD] " + 
                            ",[HT_A] " + 
                            ",[TTC_A] " + 
                            ",[HT_B] " + 
                            ",[TTC_B] " + 
                            ",[HT_C] " + 
                            ",[TTC_C] " + 
                            ",[HT_D] " + 
                            ",[TTC_D] " + 
                            ",[TOTAL_HT] " + 
                            ",[TOTAL_TTC] " + 
                            ",[GTPCA] " + 
                            ",[SIGNATURE] " + 
                            ") VALUES ( " + 
                            " GETDATE() " + 
                            ",@TYPE " + 
                            ",@PERIOD " + 
                            ",@HT_A " + 
                            ",@TTC_A " + 
                            ",@HT_B " + 
                            ",@TTC_B " + 
                            ",@HT_C " + 
                            ",@TTC_C " + 
                            ",@HT_D " + 
                            ",@TTC_D " + 
                            ",@TOTAL_HT " + 
                            ",@TOTAL_TTC " + 
                            ",@GTPCA " + 
                            ",@SIGNATURE " + 
                            ")",
                    param : ['TYPE:int','PERIOD:int','HT_A:float','TTC_A:float','HT_B:float','TTC_B:float',
                            'HT_C:float','TTC_C:float','HT_D:float','TTC_D:float','TOTAL_HT:float','TOTAL_TTC:float','GTPCA:float',
                            'SIGNATURE:string|max'],
                    value : [pType,tmpPeriod,pData.HT_A.toFixed(2),pData.TTC_A.toFixed(2),pData.HT_B.toFixed(2),pData.TTC_B.toFixed(2),pData.HT_C.toFixed(2),
                                pData.TTC_C.toFixed(2),pData.HT_D.toFixed(2),pData.TTC_D.toFixed(2),pData.TOTAL_HT.toFixed(2),pData.TOTAL_TTC.toFixed(2),
                                (pData.TOTAL_TTC + tmpLastTotal).toFixed(2),signatureGrandTotal(tmpLastData)]
                }
                await core.instance.sql.execute(tmpInsertQuery)
            }  
            resolve()   
        });
    }
    signatureGrandTotal(pData)
    {
        let tmpSignature = ""

        if(typeof pData != 'undefined')
        {
            tmpSignature = "0000:" + parseInt(Number(Number(pData.TTC_A).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "|" + "0550:" + parseInt(Number(Number(pData.TTC_B).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "|" + "1000:" + parseInt(Number(Number(pData.TTC_C).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "|" + "2000:" + parseInt(Number(Number(pData.TTC_D).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "," + parseInt(Number(Number(pData.TOTAL_TTC).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "," + parseInt(Number(Number(pData.GTPCA).toFixed(2)) * 100).toString()
            tmpSignature = tmpSignature + "," + moment(pData.CDATE).format("YYYYMMDDHHmmss")
            tmpSignature = tmpSignature + "," + pData.GUID
            tmpSignature = tmpSignature + "," + (pData.SIGNATURE == "" ? "N" : "O")

            return btoa(tmpSignature)
        }
        else
        {
            return tmpSignature
        }
    }
    signatureJet(pData)
    {
        let tmpSignature = ""

        if(typeof pData != 'undefined')
        {
            tmpSignature = pData.GUID
            tmpSignature = tmpSignature + "," + pData.CODE
            tmpSignature = tmpSignature + ",Recuperation Logiciel " + pData.APP_VERSION
            tmpSignature = tmpSignature + "," + moment(pData.CDATE).format("YYYYMMDDHHmmss")
            tmpSignature = tmpSignature + "," + pData.CUSER
            tmpSignature = tmpSignature + "," + pData.DEVICE
            tmpSignature = tmpSignature + "," + (pData.SIGNATURE == "" ? "N" : "O")

            return btoa(tmpSignature)
        }
        else
        {
            return tmpSignature
        }
    }
}

export const _nf525 = new nf525()