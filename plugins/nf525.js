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
                    NAME:'Arret du terminal, deconnexion, fermeture de session.',
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
        })
        pSocket.on('nf525ArchiveFileVerify',async(pParam,pCallback)=>
        {
            pCallback(await this.archiveFileVerify(pParam))
        })
    }
    async processRun()
    {
        cron.schedule('0 2 * * *', async () => 
        {
            await this.processGrandTotal()
            await this.processArchive()
            await this.processSignatureVerify()
            await this.checkAnomaly()
        })
    }
    async processGrandTotal()
    {       
        return new Promise(async resolve =>
        {
            try
            {
                // POS İÇİN NF525
                core.instance.log.msg("Grand total transfer started","Nf525");
                let tmpResult = await this.getNF525GrandTotalData(0)
                // DAY
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF525GrandTotal(0,tmpResult[i])
                }    
                // MONTH
                tmpResult = await this.getNF525GrandTotalData(1)
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF525GrandTotal(1,tmpResult[i])
                } 
                // YEAR
                tmpResult = await this.getNF525GrandTotalData(2)
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF525GrandTotal(2,tmpResult[i])
                }
                // FATURA İÇİN NF203
                tmpResult = await this.getNF203GrandTotalData(0)
                // DAY
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF203GrandTotal(0,tmpResult[i])
                }    
                // MONTH
                tmpResult = await this.getNF203GrandTotalData(1)
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF203GrandTotal(1,tmpResult[i])
                } 
                // YEAR
                tmpResult = await this.getNF203GrandTotalData(2)
                for (let i = 0; i < tmpResult.length; i++) 
                {
                    await this.insertNF203GrandTotal(2,tmpResult[i])
                }
                core.instance.log.msg("Grand total transfer completed","Nf525");
    
                resolve();                
            }
            catch (err) 
            {
                console.log(err);
                resolve();
            } 
        }); 
    }
    async processArchive()
    {
        return new Promise(async resolve =>
        {
            try
            {
                core.instance.log.msg("Archive started","Nf525");
                for (let i = -60; i < 0; i++) 
                {
                    this.folder = moment().add(i,'day').format("YYYYMMDD") + "_archivej"

                    if(!fs.existsSync(this.core.root_path + '/archiveFiscal/' + this.folder + '.zip'))
                    {
                        let tmpFirstDate = moment().add(i,'day').format("YYYYMMDD")
                        let tmpLastDate = moment().add(i + 1,'day').format("YYYYMMDD")
        
                        await this.archiveJet(tmpFirstDate,tmpLastDate)
                        await this.archiveNF525GrandTotal(0,tmpLastDate)
                        await this.archiveNF525GrandTotal(1,tmpLastDate)
                        await this.archiveNF525GrandTotal(2,tmpLastDate)
                        await this.archiveNF203GrandTotal(0,tmpLastDate)
                        await this.archiveNF203GrandTotal(1,tmpLastDate)
                        await this.archiveNF203GrandTotal(2,tmpLastDate)
                        await this.archiveDuplicatePos(tmpFirstDate,tmpLastDate)
                        await this.archiveDuplicatePosFact(tmpFirstDate,tmpLastDate)
                        await this.archiveDuplicateFact(tmpFirstDate,tmpLastDate)
                        await this.archiveDayTicket(tmpFirstDate,tmpLastDate)
                        await this.archiveDayFact(tmpFirstDate,tmpLastDate)
                        await this.archiveDayProfFact(tmpFirstDate,tmpLastDate)
                        
                        let zip = new AdmZip()
                        zip.addLocalFolder(this.core.root_path + '/archiveFiscal/' + this.folder);
                        zip.writeZip(this.core.root_path + '/archiveFiscal/' + this.folder + '.zip');
                        fs.rmdirSync(this.core.root_path + '/archiveFiscal/' + this.folder, { recursive: true })
    
                        let buff = fs.readFileSync(this.core.root_path + '/archiveFiscal/' + this.folder + '.zip');
                        let hash = createHash("sha256").update(buff).digest("hex")
                        
                        fs.writeFileSync(this.core.root_path + '/archiveFiscal/' + this.folder + '.txt',moment().format("DD/MM/YYYY HH:mm:ss") + " - " + this.sign(hash))
                    }
                }
                core.instance.log.msg("Archive completed","Nf525");

                resolve()
            }
            catch (err) 
            {
                console.log(err);
                resolve()
            }            
        })
    }
    async processSignatureVerify()
    {
        return new Promise(async resolve =>
        {
            try
            {
                core.instance.log.msg("Signature verify started","Nf525");
                await this.grandTotalNf203SignatureVerify()
                await this.grandTotalNf525SignatureVerify()
                await this.ticketNf525SignatureVerify()
                await this.factureNf203SignatureVerify()
                await this.dupFactureNf203SignatureVerify()
                await this.dupPosNf525SignatureVerify()
                await this.jetSignatureVerify()
                await this.archiveFileVerify()
                core.instance.log.msg("Signature verify completed","Nf525");

                resolve()
            }
            catch (err) 
            {
                console.log(err);
                resolve()
            }
        })
    }
    async grandTotalNf203SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF203_GRAND_TOTAL"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Grand total erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async grandTotalNf525SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_GRAND_TOTAL"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Grand total erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async ticketNf525SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM POS WHERE LDATE >= GETDATE() - 2 AND LDATE <= GETDATE() - 1 ORDER BY LDATE DESC"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Ticket erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async factureNf203SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM DOC WHERE LDATE >= GETDATE() - 2 AND LDATE <= GETDATE() - 1 ORDER BY LDATE DESC"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Facture erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async dupFactureNf203SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM DOC_EXTRA WHERE CDATE >= GETDATE() - 2 AND CDATE <= GETDATE() - 1 AND TAG = 'PRINT' ORDER BY CDATE DESC"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Facture duplicate erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async dupPosNf525SignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM POS_EXTRA WHERE CDATE >= GETDATE() - 2 AND CDATE <= GETDATE() - 1 AND TAG IN ('REPRINT','REPRINTFACT') ORDER BY CDATE DESC"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].DATA != '' && tmpResult[i].DATA_EXTRA1 != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].DATA_EXTRA1,tmpResult[i].DATA)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Pos duplicate erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async jetSignatureVerify()
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_JET WHERE CDATE >= GETDATE() - 2 AND CDATE <= GETDATE() + 2 ORDER BY CDATE DESC"
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            
            for (let i = 0; i < tmpResult.length; i++) 
            {
                if(tmpResult[i].SIGNATURE != '' && tmpResult[i].SIGNATURE_SUM != null)
                {
                    let tmpVerify = this.verify(tmpResult[i].SIGNATURE_SUM,tmpResult[i].SIGNATURE)
                    
                    if(!tmpVerify)
                    {
                        await this.insertJet(
                        {
                            CUSER:'System Auto',            
                            DEVICE:'',
                            CODE:'90',
                            NAME:"Erreur integrite.",
                            DESCRIPTION:'Jet erreur verify',
                            APP_VERSION:this.appInfo.version
                        })
                    }
                }
            }

            resolve()
        })
    }
    async archiveFileVerify()
    {
        return new Promise(async resolve =>
        {
            if(arguments.length == 0)
            {
                for (let i = -60; i < 0; i++) 
                {
                    let tmpFileName = moment().add(i,'day').format("YYYYMMDD") + "_archivej"
    
                    if(fs.existsSync(this.core.root_path + '/archiveFiscal/' + tmpFileName + '.zip') && fs.existsSync(this.core.root_path + '/archiveFiscal/' + tmpFileName + '.txt'))
                    {
                        let tmpTxtSign = fs.readFileSync(this.core.root_path + '/archiveFiscal/' + tmpFileName + '.txt')
                        tmpTxtSign = tmpTxtSign.toString()
                        tmpTxtSign = tmpTxtSign.substring(tmpTxtSign.indexOf('-') + 2,tmpTxtSign.length)
                        let buff = fs.readFileSync(this.core.root_path + '/archiveFiscal/' + tmpFileName + '.zip');
                        let hash = createHash("sha256").update(buff).digest("hex")
                        
                        let tmpVerify = this.verify(hash,tmpTxtSign)
                        if(!tmpVerify)
                        {
                            await this.insertJet(
                            {
                                CUSER:'System Auto',            
                                DEVICE:'',
                                CODE:'90',
                                NAME:"Erreur integrite.",
                                DESCRIPTION:'Archive file verify - filename : ' + tmpFileName,
                                APP_VERSION:this.appInfo.version
                            })
                        }
                    }
                }

                resolve()
            }
            else
            {
                let hash = createHash("sha256").update(arguments[0].buffer).digest("hex")
                        
                let tmpVerify = this.verify(hash,arguments[0].sign)
                resolve(tmpVerify)
                return
            }
        })
    }
    async archiveNF203GrandTotal(pType)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF203_ARCHIVE_GRAND_TOTAL_VW_01 WHERE TYPE = @TYPE ORDER BY FAC_GTP_HOR_GDH ASC",
                param : ['TYPE:int','LAST_DATE:string|10'],
                value : [pType]
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                let tmpFName = ""
                if(pType == 0)
                {
                    tmpFName = "NF203_DAY_GRAND_TOTAL"
                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'20',
                        NAME:"Archivage fiscal period jour.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                else if(pType == 1)
                {
                    tmpFName = "NF203_MONTH_GRAND_TOTAL"
                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'20',
                        NAME:"Archivage fiscal period mois.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                else if(pType == 2)
                {
                    tmpFName = "NF203_YEAR_GRAND_TOTAL"

                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'30',
                        NAME:"Archivage fiscal d'annee ou d'exercice.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                this.exportExcel(tmpResult,tmpFName,"DATA",this.folder)
            }
            resolve()
        });
    }
    async archiveNF525GrandTotal(pType)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_ARCHIVE_GRAND_TOTAL_VW_01 WHERE TYPE = @TYPE ORDER BY ENC_GTP_HOR_GDH ASC",
                param : ['TYPE:int'],
                value : [pType]
            }
            
            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                let tmpFName = ""
                if(pType == 0)
                {
                    tmpFName = "NF525_DAY_GRAND_TOTAL"
                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'20',
                        NAME:"Archivage fiscal period jour.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                else if(pType == 1)
                {
                    tmpFName = "NF525_MONTH_GRAND_TOTAL"
                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'20',
                        NAME:"Archivage fiscal period mois.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                else if(pType == 2)
                {
                    tmpFName = "NF525_YEAR_GRAND_TOTAL"

                    await this.insertJet(
                    {
                        CUSER:'System Auto',            
                        DEVICE:'',
                        CODE:'30',
                        NAME:"Archivage fiscal d'annee ou d'exercice.", //BAK
                        DESCRIPTION:'',
                        APP_VERSION:this.appInfo.version
                    })
                }
                this.exportExcel(tmpResult,tmpFName,"DATA",this.folder)
            }
            resolve()
        });
    }
    async archiveJet(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_ARCHIVE_JET_VW_01 WHERE JET_GDH >= @FIRST_DATE AND JET_GDH <= @LAST_DATE ORDER BY JET_GDH ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                this.exportExcel(tmpResult,"JET","JET",this.folder)
            }
            resolve()
        });
    }
    async archiveDuplicatePos(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_POS_DUPLICATE_VW_01 " +
                        "WHERE LDATE >= @FIRST_DATE AND " +
                        "LDATE <= @LAST_DATE AND REPRINT_NO <> 0 " +
                        "ORDER BY LDATE ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                this.exportExcel(tmpResult,"NF525_POS_DUPLICATE","DUPLICATE",this.folder)
            }
            resolve()
        });
    }
    async archiveDuplicatePosFact(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF525_POS_FACT_DUPLICATE_VW_01 " +
                        "WHERE LDATE >= @FIRST_DATE AND " +
                        "LDATE <= @LAST_DATE AND PRINT_NO > 1 " +
                        "ORDER BY LDATE ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                this.exportExcel(tmpResult,"NF525_POS_FACT_DUPLICATE","DUPLICATE",this.folder)
            }
            resolve()
        });
    }
    async archiveDuplicateFact(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM NF203_DOC_DUPLICATE_VW_01 " +
                        "WHERE FAC_DUP_HOR_GDH >= @FIRST_DATE AND " +
                        "FAC_DUP_HOR_GDH <= @LAST_DATE AND FAC_DUP_PRN_NUM > 1 " +
                        "ORDER BY FAC_DUP_HOR_GDH ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }

            let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
            if(tmpResult.length > 0)
            {
                this.exportExcel(tmpResult,"NF203_FACT_DUPLICATE","DUPLICATE",this.folder)
            }
            resolve()
        });
    }
    archiveDayTicket(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpFileName = "TICKET_" + pFirst

            let tmpMasterQuery = 
            {
                query : "SELECT * FROM NF525_ARCHIVE_DONNES_DENTETE_VW_01 WHERE ENC_TIK_HOR_GDH >= @FIRST_DATE AND ENC_TIK_HOR_GDH <= @LAST_DATE ORDER BY ENC_TIK_NUM,ENC_TIK_CAI_NID ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }
            
            let tmpMasterResult = (await core.instance.sql.execute(tmpMasterQuery)).result.recordset
            if(tmpMasterResult.length > 0)
            {
                this.exportExcel(tmpMasterResult,tmpFileName,"DENTETE",this.folder)

                let tmpLineQuery = 
                {
                    query : "SELECT * FROM NF525_ARCHIVE_DONNES_DES_LIGNES_VW_01 WHERE ENC_TIK_LIG_HOR_GDH >= @FIRST_DATE AND ENC_TIK_LIG_HOR_GDH <= @LAST_DATE ORDER BY ENC_TIK_ORI_NUM,ENC_TIK_LIG_CAI_NID ASC",
                    param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                    value : [pFirst,pLast]
                }
                
                let tmpLineResult = (await core.instance.sql.execute(tmpLineQuery)).result.recordset
                
                let tmpRepQuery = 
                {
                    query : "SELECT * FROM NF525_ARCHIVE_DONNES_RECUPITULATIVES_VW_01 WHERE ENC_TIK_HOR_GDH >= @FIRST_DATE AND ENC_TIK_HOR_GDH <= @LAST_DATE ORDER BY ENC_TIK_ORI_NUM,ENC_TIK_CAI_NID ASC",
                    param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                    value : [pFirst,pLast]
                }
                
                let tmpRepResult = (await core.instance.sql.execute(tmpRepQuery)).result.recordset
                
                this.exportExcel({DENTETE:tmpMasterResult,LIGNES:tmpLineResult,RECUP:tmpRepResult},tmpFileName,'',this.folder)
            }
            resolve()
        })
    }
    archiveDayFact(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpFileName = "FACTURE_" + pFirst

            let tmpMasterQuery = 
            {
                query : "SELECT * FROM NF203_ARCHIVE_DONNES_DENTETE_VW_01 WHERE FAC_DAT >= @FIRST_DATE AND FAC_DAT <= @LAST_DATE AND FAC_TYP IN ('FAC','FAC-DIF','FAC-AVOIR') ORDER BY FAC_NUM,FAC_OPS_NID ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }
            
            let tmpMasterResult = (await core.instance.sql.execute(tmpMasterQuery)).result.recordset
            if(tmpMasterResult.length > 0)
            {
                this.exportExcel(tmpMasterResult,tmpFileName,"DENTETE",this.folder)

                let tmpLineQuery = 
                {
                    query : "SELECT * FROM NF203_ARCHIVE_DONNES_LIGNES_VW_01 WHERE FAC_DAT >= @FIRST_DATE AND FAC_DAT <= @LAST_DATE AND FAC_TYP IN ('FAC','FAC-DIF','FAC-AVOIR') ORDER BY FAC_NUM,FAC_LIG_NUM ASC",
                    param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                    value : [pFirst,pLast]
                }
                
                let tmpLineResult = (await core.instance.sql.execute(tmpLineQuery)).result.recordset
                
                this.exportExcel({DENTETE:tmpMasterResult,LIGNES:tmpLineResult},tmpFileName,'',this.folder)
            }
            resolve()
        })
    }
    archiveDayProfFact(pFirst,pLast)
    {
        return new Promise(async resolve =>
        {
            let tmpFileName = "FACTURE_PROF_" + pFirst

            let tmpMasterQuery = 
            {
                query : "SELECT * FROM NF203_ARCHIVE_DONNES_DENTETE_VW_01 WHERE FAC_DAT >= @FIRST_DATE AND FAC_DAT <= @LAST_DATE AND FAC_TYP IN ('FAC-PROF') ORDER BY FAC_NUM,FAC_OPS_NID ASC",
                param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                value : [pFirst,pLast]
            }
            
            let tmpMasterResult = (await core.instance.sql.execute(tmpMasterQuery)).result.recordset
            if(tmpMasterResult.length > 0)
            {
                this.exportExcel(tmpMasterResult,tmpFileName,"DENTETE",this.folder)

                let tmpLineQuery = 
                {
                    query : "SELECT * FROM NF203_ARCHIVE_DONNES_LIGNES_VW_01 WHERE FAC_DAT >= @FIRST_DATE AND FAC_DAT <= @LAST_DATE AND FAC_TYP IN ('FAC-PROF') ORDER BY FAC_NUM,FAC_LIG_NUM ASC",
                    param : ['FIRST_DATE:string|10','LAST_DATE:string|10'],
                    value : [pFirst,pLast]
                }
                
                let tmpLineResult = (await core.instance.sql.execute(tmpLineQuery)).result.recordset
                
                this.exportExcel({DENTETE:tmpMasterResult,LIGNES:tmpLineResult},tmpFileName,'',this.folder)
            }
            resolve()
        })
    }
    exportExcel(pData,pFileName,pSheetName,pFolder)
    {
        fs.mkdirSync(this.core.root_path + '/archiveFiscal', { recursive: true })

        if(typeof pFolder != 'undefined')
        {
            fs.mkdirSync(this.core.root_path + '/archiveFiscal/' + pFolder, { recursive: true })
        }
        
        let workBook = xlsx.utils.book_new();

        if(Array.isArray(pData))
        {
            let xlsxData = xlsx.utils.json_to_sheet(pData);
            xlsx.utils.book_append_sheet(workBook,xlsxData,pSheetName)
        }
        else
        {
            for (let i = 0; i < Object.keys(pData).length; i++) 
            {
                let tmpObjName = Object.keys(pData)[i]
                let xlsxData = xlsx.utils.json_to_sheet(pData[tmpObjName]);
                xlsx.utils.book_append_sheet(workBook,xlsxData,tmpObjName)
            }
        }
        
        if(typeof pFolder != 'undefined')
        {
            xlsx.writeFile(workBook,this.core.root_path + '/archiveFiscal/' + pFolder + '/' + pFileName + '.xlsx')
        }
        else
        {
            xlsx.writeFile(workBook,this.core.root_path + '/archiveFiscal/' + pFileName + '.xlsx')
        }
    }
    async insertJet(pData)
    {
        return new Promise(async resolve =>
        {
            let tmpNo = 0

            let tmpLastQuery =
            {
                query : "SELECT TOP 1 * FROM NF525_JET ORDER BY CDATE DESC"
            }

            let tmpLastData = (await this.core.sql.execute(tmpLastQuery)).result.recordset
            
            if(typeof tmpLastData != 'undefined' && tmpLastData.length > 0)
            {
                tmpNo = tmpLastData[0].NO
            }
            else
            {
                tmpLastData = []
            }

            let tmpSignature = this.signatureJet(pData,tmpLastData.length > 0 ? tmpLastData[0].SIGNATURE : '')

            let tmpInsertQuery = 
            {
                query : "EXEC [dbo].[PRD_NF525_JET_INSERT] " + 
                        "@CUSER = @PCUSER, " + 
                        "@CDATE = @PCDATE, " + 
                        "@NO = @PNO, " +
                        "@DEVICE = @PDEVICE, " +
                        "@CODE = @PCODE, " +
                        "@NAME = @PNAME, " +
                        "@DESCRIPTION = @PDESCRIPTION, " +  
                        "@APP_VERSION = @PAPP_VERSION, " +                       
                        "@SIGNATURE = @PSIGNATURE, " +
                        "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
                param : ['PCUSER:string|25','PCDATE:datetime','PNO:int','PDEVICE:string|25','PCODE:string|50','PNAME:string|250','PDESCRIPTION:string|max','PAPP_VERSION:string|10','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
                value : [pData.CUSER,typeof pData.CDATE == 'undefined' ? moment(new Date()).format("YYYY-MM-DD HH:mm:ss") : pData.CDATE,tmpNo + 1,pData.DEVICE,pData.CODE,pData.NAME,pData.DESCRIPTION,pData.APP_VERSION,tmpSignature.SIGNATURE,tmpSignature.SIGNATURE_SUM]
            }
            await this.core.sql.execute(tmpInsertQuery)
            resolve()
        });
    }
    getNF203GrandTotalData(pType)
    {
        return new Promise(async resolve =>
        {
            if(pType == 0) //day
            {
                let tmpPeriodQuery = 
                {
                    query : "SELECT TOP 1 CONVERT(NVARCHAR(10),PERIOD) AS PERIOD FROM NF203_GRAND_TOTAL WHERE TYPE = 0 ORDER BY PERIOD DESC"
                }
                let tmpPeriodResult = (await core.instance.sql.execute(tmpPeriodQuery)).result.recordset
                
                let tmpQuery = 
                {
                    query : "SELECT " +
                            "YEAR(DOC_DATE) AS YEAR, " +
                            "CONVERT(NVARCHAR(10),DOC_DATE,112) AS PERIOD, " +
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
                            "DOC AS DOC, " +
                            "DOC_DATE AS DOC_DATE, " +
                            "VAT_RATE_A AS VAT_RATE_A, " +
                            "CASE WHEN TYPE = 1 THEN HT_A ELSE HT_A * -1 END AS HT_A, " +
                            "CASE WHEN TYPE = 1 THEN TTC_A ELSE TTC_A * -1 END AS TTC_A, " +
                            "VAT_RATE_B AS VAT_RATE_B, " +
                            "CASE WHEN TYPE = 1 THEN HT_B ELSE HT_B * -1 END AS HT_B, " +
                            "CASE WHEN TYPE = 1 THEN TTC_B ELSE TTC_B * -1 END AS TTC_B, " +
                            "VAT_RATE_C AS VAT_RATE_C, " +
                            "CASE WHEN TYPE = 1 THEN HT_C ELSE HT_C * -1 END AS HT_C, " +
                            "CASE WHEN TYPE = 1 THEN TTC_C ELSE TTC_C * -1 END AS TTC_C, " +
                            "VAT_RATE_D AS VAT_RATE_D, " +
                            "CASE WHEN TYPE = 1 THEN HT_D ELSE HT_D * -1 END AS HT_D, " +
                            "CASE WHEN TYPE = 1 THEN TTC_D ELSE TTC_D * -1 END AS TTC_D, " +
                            "CASE WHEN TYPE = 1 THEN AMOUNT ELSE AMOUNT * -1 END AS FAMOUNT, " +
                            "CASE WHEN TYPE = 1 THEN TOTAL ELSE TOTAL * -1 END AS TOTAL " +
                            "FROM DOC_VAT_VW_01 AS DOC_VAT " +
                            "WHERE {0} AND DOC_DATE <= CONVERT(NVARCHAR(10),GETDATE()-1,112) AND TYPE = 1 AND DOC_TYPE IN (20,21) " +
                            ") AS TMP " +
                            "GROUP BY DOC_DATE ORDER BY DOC_DATE"
                }
                
                if(tmpPeriodResult.length > 0)
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= '" + tmpPeriodResult[0].PERIOD + "'")
                }
                else
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= CONVERT(NVARCHAR(10),GETDATE() - 120,112)")
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
                            "[YEAR] AS [YEAR], " +
                            "MONTH(CONVERT(NVARCHAR(10),MAX(PERIOD),112)) AS PERIOD, " +
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
                            "FROM NF203_GRAND_TOTAL WHERE TYPE = 0 " +
                            "GROUP BY MONTH(CONVERT(NVARCHAR(10),PERIOD,112)),[YEAR] " +
                            "HAVING MAX(PERIOD) < CONVERT(INTEGER,CONVERT(NVARCHAR(10),GETDATE(),112)) " +
                            "ORDER BY [YEAR],MONTH(CONVERT(NVARCHAR(10),MAX(PERIOD),112)) ASC"
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
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
                            "[YEAR] AS [YEAR], " +
                            "[YEAR] AS PERIOD, " +
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
                            "FROM NF203_GRAND_TOTAL WHERE TYPE = 1 AND YEAR < YEAR(GETDATE()) " +
                            "GROUP BY [YEAR] ORDER BY [YEAR] ASC"
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
    
                if(typeof tmpResult != 'undefined' &&  tmpResult.length > 0)
                {
                    resolve(tmpResult)          
                }
                
                resolve([])  
            }
        });
    }
    getNF203LastGrandTotal(pType,pPeriod,pYear)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT TOP 1 * FROM NF203_GRAND_TOTAL WHERE TYPE = @TYPE AND " + 
                        "CONVERT(NVARCHAR(4),YEAR) + REPLACE(STR(PERIOD, 8), SPACE(1), '0') < CONVERT(NVARCHAR(4),@YEAR) + REPLACE(STR(@PERIOD, 8), SPACE(1), '0') " + 
                        "ORDER BY CONVERT(NVARCHAR(4),YEAR) + REPLACE(STR(PERIOD, 8), SPACE(1), '0') DESC",
                param : ['TYPE:int','PERIOD:int','YEAR:int'],
                value : [pType,pPeriod,pYear]
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
    insertNF203GrandTotal(pType,pData)
    {
        return new Promise(async resolve =>
        {
            if(pType == 0)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'50',
                    NAME:"Cloture de periode jour.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
            else if(pType == 1)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'50',
                    NAME:"Cloture de periode mois.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
            else if(pType == 2)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'60',
                    NAME:"Cloture annuelle.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
            
            let tmpCtrlQuery = 
            {
                query : "SELECT TOP 1 PERIOD FROM NF203_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = @PERIOD AND YEAR = @YEAR",
                param : ['TYPE:int','PERIOD:int','YEAR:int'],
                value : [pType,pData.PERIOD,pData.YEAR]
            }

            let tmpCtrlResult = await core.instance.sql.execute(tmpCtrlQuery)
    
            if(tmpCtrlResult.result.recordset.length == 0)
            {            
                let tmpLastData = await this.getNF203LastGrandTotal(pType,pData.PERIOD,pData.YEAR)
                let tmpLastTotal = 0
    
                if(typeof tmpLastData != 'undefined')
                {
                    tmpLastTotal = tmpLastData.GTPCA != null ? tmpLastData.GTPCA : 0
                }
                
                let tmpSign = await this.signatureGrandTotal(pData,typeof tmpLastData == 'undefined' ? '' : tmpLastData.SIGNATURE,tmpLastTotal)
                
                let tmpInsertQuery = 
                {
                    query : "INSERT INTO [dbo].[NF203_GRAND_TOTAL] ( " + 
                            " [CDATE] " + 
                            ",[TYPE] " + 
                            ",[YEAR] " +
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
                            ",[SIGNATURE_SUM] " + 
                            ") VALUES ( " + 
                            " GETDATE() " + 
                            ",@TYPE " + 
                            ",@YEAR " + 
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
                            ",@SIGNATURE_SUM " + 
                            ")",
                    param : ['TYPE:int','YEAR:int','PERIOD:int','HT_A:float','TTC_A:float','HT_B:float','TTC_B:float',
                            'HT_C:float','TTC_C:float','HT_D:float','TTC_D:float','TOTAL_HT:float','TOTAL_TTC:float','GTPCA:float',
                            'SIGNATURE:string|max','SIGNATURE_SUM:string|max'],
                    value : [pType,pData.YEAR,pData.PERIOD,pData.HT_A.toFixed(2),pData.TTC_A.toFixed(2),pData.HT_B.toFixed(2),pData.TTC_B.toFixed(2),pData.HT_C.toFixed(2),
                            pData.TTC_C.toFixed(2),pData.HT_D.toFixed(2),pData.TTC_D.toFixed(2),pData.TOTAL_HT.toFixed(2),pData.TOTAL_TTC.toFixed(2),
                            (pData.TOTAL_TTC + tmpLastTotal).toFixed(2),tmpSign.SIGNATURE,tmpSign.SIGNATURE_SUM]
                }
                await core.instance.sql.execute(tmpInsertQuery)
            }  
            resolve()   
        });
    }
    getNF525GrandTotalData(pType)
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
                            "YEAR(DOC_DATE) AS YEAR, " +
                            "CONVERT(NVARCHAR(10),DOC_DATE,112) AS PERIOD, " +
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
                            "FROM POS_VAT_VW_01 AS NF525 " +
                            "WHERE {0} AND DOC_DATE <= CONVERT(NVARCHAR(10),GETDATE()-1,112) AND DOC_TYPE = 0 " +
                            ") AS TMP " +
                            "GROUP BY DOC_DATE ORDER BY DOC_DATE ASC"
                }
                
                if(tmpPeriodResult.length > 0)
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= '" + tmpPeriodResult[0].PERIOD + "'")
                }
                else
                {
                    tmpQuery.query = tmpQuery.query.replace("{0}","DOC_DATE >= CONVERT(NVARCHAR(10),GETDATE() - 120,112)")
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
                            "[YEAR] AS [YEAR], " +
                            "MONTH(CONVERT(NVARCHAR(10),MAX(PERIOD),112)) AS PERIOD, " +
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
                            "FROM NF525_GRAND_TOTAL WHERE TYPE = 0 " +
                            "GROUP BY MONTH(CONVERT(NVARCHAR(10),PERIOD,112)),[YEAR] " +
                            "HAVING MAX(PERIOD) < CONVERT(INTEGER,CONVERT(NVARCHAR(10),GETDATE(),112)) " +
                            "ORDER BY [YEAR],MONTH(CONVERT(NVARCHAR(10),MAX(PERIOD),112)) ASC"
                }

                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
                if(typeof tmpResult != 'undefined' && tmpResult.length > 0)
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
                            "[YEAR] AS [YEAR], " +
                            "[YEAR] AS PERIOD, " +
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
                            "FROM NF525_GRAND_TOTAL WHERE TYPE = 1 AND YEAR < YEAR(GETDATE()) " +
                            "GROUP BY [YEAR] ORDER BY [YEAR] ASC"
                }
    
                let tmpResult = (await core.instance.sql.execute(tmpQuery)).result.recordset
    
                if(typeof tmpResult != 'undefined' &&  tmpResult.length > 0)
                {
                    resolve(tmpResult)          
                }
                
                resolve([])  
            }
        });
    }
    getNF525LastGrandTotal(pType,pPeriod,pYear)
    {
        return new Promise(async resolve =>
        {
            let tmpQuery = 
            {
                query : "SELECT TOP 1 * FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND " + 
                        "CONVERT(NVARCHAR(4),YEAR) + REPLACE(STR(PERIOD, 8), SPACE(1), '0') < CONVERT(NVARCHAR(4),@YEAR) + REPLACE(STR(@PERIOD, 8), SPACE(1), '0') " + 
                        "ORDER BY CONVERT(NVARCHAR(4),YEAR) + REPLACE(STR(PERIOD, 8), SPACE(1), '0') DESC",
                param : ['TYPE:int','PERIOD:int','YEAR:int'],
                value : [pType,pPeriod,pYear]
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
    insertNF525GrandTotal(pType,pData)
    {
        return new Promise(async resolve =>
        {
            if(pType == 0)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'50',
                    NAME:"Cloture de periode jour.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
            else if(pType == 1)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'50',
                    NAME:"Cloture de periode mois.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }
            else if(pType == 2)
            {
                await this.insertJet(
                {
                    CUSER:'System Auto',            
                    DEVICE:'',
                    CODE:'60',
                    NAME:"Cloture annuelle.", //BAK
                    DESCRIPTION:'',
                    APP_VERSION:this.appInfo.version
                })
            }

            let tmpCtrlQuery = 
            {
                query : "SELECT TOP 1 PERIOD FROM NF525_GRAND_TOTAL WHERE TYPE = @TYPE AND PERIOD = @PERIOD AND YEAR = @YEAR",
                param : ['TYPE:int','PERIOD:int','YEAR:int'],
                value : [pType,pData.PERIOD,pData.YEAR]
            }

            let tmpCtrlResult = await core.instance.sql.execute(tmpCtrlQuery)
    
            if(tmpCtrlResult.result.recordset.length == 0)
            {            
                let tmpLastData = await this.getNF525LastGrandTotal(pType,pData.PERIOD,pData.YEAR)
                let tmpLastTotal = 0
                
                if(typeof tmpLastData != 'undefined')
                {
                    tmpLastTotal = tmpLastData.GTPCA != null ? tmpLastData.GTPCA : 0
                }
                
                let tmpSign = await this.signatureGrandTotal(pData,typeof tmpLastData == 'undefined' ? '' : tmpLastData.SIGNATURE,tmpLastTotal)

                let tmpInsertQuery = 
                {
                    query : "INSERT INTO [dbo].[NF525_GRAND_TOTAL] ( " + 
                            " [CDATE] " + 
                            ",[TYPE] " + 
                            ",[YEAR] " +
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
                            ",[SIGNATURE_SUM] " + 
                            ") VALUES ( " + 
                            " GETDATE() " + 
                            ",@TYPE " + 
                            ",@YEAR " + 
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
                            ",@SIGNATURE_SUM " + 
                            ")",
                    param : ['TYPE:int','YEAR:int','PERIOD:int','HT_A:float','TTC_A:float','HT_B:float','TTC_B:float',
                            'HT_C:float','TTC_C:float','HT_D:float','TTC_D:float','TOTAL_HT:float','TOTAL_TTC:float','GTPCA:float',
                            'SIGNATURE:string|max','SIGNATURE_SUM:string|max'],
                    value : [pType,pData.YEAR,pData.PERIOD,pData.HT_A.toFixed(2),pData.TTC_A.toFixed(2),pData.HT_B.toFixed(2),pData.TTC_B.toFixed(2),pData.HT_C.toFixed(2),
                            pData.TTC_C.toFixed(2),pData.HT_D.toFixed(2),pData.TTC_D.toFixed(2),pData.TOTAL_HT.toFixed(2),pData.TOTAL_TTC.toFixed(2),
                            (pData.TOTAL_TTC + tmpLastTotal).toFixed(2),tmpSign.SIGNATURE,tmpSign.SIGNATURE_SUM]
                }
                await core.instance.sql.execute(tmpInsertQuery)
            }  
            resolve()   
        });
    }
    async signatureGrandTotal(pData,pLastSignature,pLastGTPCA)
    {
        let tmpSignature = ""
        let tmpSignatureSum = ""
        
        if(typeof pData != 'undefined')
        {
            tmpSignatureSum = "0000:" + parseInt(Number(Number(pData.TTC_A).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "|" + "0550:" + parseInt(Number(Number(pData.TTC_B).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "|" + "1000:" + parseInt(Number(Number(pData.TTC_C).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "|" + "2000:" + parseInt(Number(Number(pData.TTC_D).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "," + parseInt(Number(Number(pData.TOTAL_TTC).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "," + parseInt(Number(Number(pData.TOTAL_TTC + pLastGTPCA).toFixed(2)) * 100).toString()
            tmpSignatureSum = tmpSignatureSum + "," + moment(pData.CDATE).format("YYYYMMDDHHmmss")
            tmpSignatureSum = tmpSignatureSum + "," + (pLastSignature == "" ? "N" : "O")
            tmpSignatureSum = tmpSignatureSum + "," + pLastSignature
            
            tmpSignature = this.sign(tmpSignatureSum)
        }

        return {SIGNATURE:tmpSignature,SIGNATURE_SUM:tmpSignatureSum}
    }
    signatureJet(pData,pLastSignature)
    {
        let tmpSignature = ""
        let tmpSignatureSum = ""

        if(typeof pData != 'undefined')
        {
            tmpSignatureSum = tmpSignatureSum + pData.CODE
            tmpSignatureSum = tmpSignatureSum + ",Recuperation Logiciel " + pData.APP_VERSION
            tmpSignatureSum = tmpSignatureSum + "," + moment(pData.CDATE).format("YYYYMMDDHHmmss")
            tmpSignatureSum = tmpSignatureSum + "," + pData.CUSER
            tmpSignatureSum = tmpSignatureSum + "," + pData.DEVICE
            tmpSignatureSum = tmpSignatureSum + "," + (pLastSignature == "" ? "N" : "O")
            tmpSignatureSum = tmpSignatureSum + "," + pLastSignature

            tmpSignature = this.sign(tmpSignatureSum)
        }
        return {SIGNATURE : tmpSignature,SIGNATURE_SUM : tmpSignatureSum}
    }
    sign(pData)
    {
        let sig = new rsa.KJUR.crypto.Signature({"alg": "SHA256withECDSA", "prov": "cryptojs/jsrsa"});
        sig.init(pem.private);
        sig.updateString(pData);
        let sigValueHex = rsa.hextob64u(sig.sign());
        
        return sigValueHex
    }
    verify(pData,pSig)
    {
        let sig = new rsa.KJUR.crypto.Signature({'alg':'SHA256withECDSA', "prov": "cryptojs/jsrsa"});
        sig.init(pem.certificate);
        sig.updateString(pData);
        let isValid = sig.verify(rsa.b64utohex(pSig));
        return isValid
    }
    checkAnomaly()
    {
        return new Promise(async resolve =>
        {
            let tmpMailText = ""
            try
            {
                let tmpDeviceQuery = 
                {
                    query : "SELECT CODE FROM POS_DEVICE_VW_01 ORDER BY CODE ASC"
                }

                let tmpDeviceDt = await core.instance.sql.execute(tmpDeviceQuery)

                for (let i = 0; i < tmpDeviceDt.result.recordset.length; i++) 
                {
                    let tmpPosQuery = 
                    {
                        query : "SELECT GUID,DEVICE,TYPE_NAME,DOC_TYPE,DOC_DATE,REF,FAMOUNT,AMOUNT,DISCOUNT,LOYALTY,VAT,TOTAL,CERTIFICATE,SIGNATURE,SIGNATURE_SUM " + 
                                "FROM POS_VW_01 WHERE DEVICE = @DEVICE AND DOC_DATE = CONVERT(NVARCHAR(10),GETDATE() - 1,112) AND STATUS = 1 ORDER BY REF ASC",
                        param : ['DEVICE:string|50'],
                        value : [tmpDeviceDt.result.recordset[i].CODE]
                    }    
                    let tmpPosSaleQuery = 
                    {
                        query : "SELECT POS_GUID,SUM(TOTAL) AS TOTAL FROM POS_SALE_VW_01 WHERE DEVICE = @DEVICE AND DOC_DATE = CONVERT(NVARCHAR(10),GETDATE() - 1,112) AND STATUS = 1 GROUP BY POS_GUID",
                        param : ['DEVICE:string|50'],
                        value : [tmpDeviceDt.result.recordset[i].CODE]
                    }
                    let tmpPosPayQuery = 
                    {
                        query : "SELECT POS_GUID,SUM(AMOUNT-CHANGE) AS TOTAL FROM POS_PAYMENT_VW_01 WHERE DEVICE = @DEVICE AND DOC_DATE = CONVERT(NVARCHAR(10),GETDATE() - 1,112) AND STATUS = 1 GROUP BY POS_GUID",
                        param : ['DEVICE:string|50'],
                        value : [tmpDeviceDt.result.recordset[i].CODE]
                    }
                    
                    let tmpPosDt = await core.instance.sql.execute(tmpPosQuery)
                    let tmpPosSaleDt = await core.instance.sql.execute(tmpPosSaleQuery)
                    let tmpPosPayDt = await core.instance.sql.execute(tmpPosPayQuery)
                    
                    for (let x = 0; x < tmpPosDt.result.recordset.length; x++) 
                    {
                        let tmpLastPos = undefined
                        if(x > 0)
                        {
                            tmpLastPos = tmpPosDt.result.recordset[x - 1]
                        }

                        let tmpPosSaleTotal = 0
                        let tmpPosPayTotal = 0
                        if(tmpPosSaleDt.result.recordset.length > 0)
                        {
                            let tmpPosSaleFilter = tmpPosSaleDt.result.recordset.filter(item => item.POS_GUID === tmpPosDt.result.recordset[x].GUID)
                            if(tmpPosSaleFilter.length > 0)
                            {
                                tmpPosSaleTotal = Number(Number(tmpPosSaleFilter[0].TOTAL).toFixed(2))
                            }
                        }
                        if(tmpPosPayDt.result.recordset.length > 0)
                        {
                            let tmpPosPayFilter = tmpPosPayDt.result.recordset.filter(item => item.POS_GUID === tmpPosDt.result.recordset[x].GUID)
                            if(tmpPosPayFilter.length > 0)
                            {
                                tmpPosPayTotal = Number(Number(tmpPosPayFilter[0].TOTAL).toFixed(2))
                            }
                        }
                        //SATIŞ TUTARI KONTROLÜ
                        if(Number(tmpPosDt.result.recordset[x].TOTAL).toFixed(2) != tmpPosSaleTotal)
                        {
                            tmpMailText = tmpMailText + "Satış Tutarı Uyumsuz - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }
                        //ÖDEME TUTARI KONTROLÜ
                        if(Number(tmpPosDt.result.recordset[x].TOTAL).toFixed(2) != tmpPosPayTotal)
                        {
                            tmpMailText = tmpMailText + "Ödeme Tutarı Uyumsuz - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }
                        //REF NO SIFIR MI KONTROLÜ
                        if(tmpPosDt.result.recordset[x].REF == 0)
                        {
                            tmpMailText = tmpMailText + "Ref No Sıfır - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }
                        //İMZALANMIŞ MI KONTROLÜ
                        if(tmpPosDt.result.recordset[x].SIGNATURE == '')
                        {
                            tmpMailText = tmpMailText + "İmza Boş - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }

                        //AYNI REF NO DAN BAŞKA BİR KAYIT VARMI KONTROLÜ
                        let tmpPosRefQuery = 
                        {
                            query : "SELECT REF FROM POS WHERE REF = @REF AND STATUS = 1 AND DEVICE = @DEVICE AND GUID <> @GUID",
                            param : ['REF:int','DEVICE:string|50','GUID:string|50'],
                            value : [tmpPosDt.result.recordset[x].REF,tmpPosDt.result.recordset[x].DEVICE,tmpPosDt.result.recordset[x].GUID]
                        }
                        let tmpPosRefDt = await core.instance.sql.execute(tmpPosRefQuery)

                        if(tmpPosRefDt.result.recordset.length > 0)
                        {
                            tmpMailText = tmpMailText + "Duplicate Ref No - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }
                        //******************************************** */
                        //İMZA DOĞRULUK KONTROLÜ
                        let tmpSign = tmpPosDt.result.recordset[x].SIGNATURE_SUM.toString()
                        if(typeof tmpLastPos != 'undefined' && tmpLastPos.SIGNATURE != tmpSign.substring(tmpSign.lastIndexOf(',') + 1,tmpSign.length))
                        {
                            tmpMailText = tmpMailText + "İmza doğru değil - DEVICE : " + tmpPosDt.result.recordset[x].DEVICE + " - REF : " + tmpPosDt.result.recordset[x].REF + "\n"
                        }
                        //******************************************** */
                    }
                }
            }
            catch(err)
            {
                tmpMailText = err.toString()
            }
            
            if(tmpMailText == '')
            {
                tmpMailText = 'NF525 Anomali Success'
            }

            if(tmpMailText != '')
            {
                let tmpMailData =
                {
                    sendMail : "alikemal@piqsoft.com,zengin.m@ppholding.fr",
                    subject : "NF525 Anomali Control",
                    text : tmpMailText
                }
                this.core.plugins._mailer.mailSend(tmpMailData)
            }
            
            resolve()
        })
    }
}
export const _nf525 = new nf525()