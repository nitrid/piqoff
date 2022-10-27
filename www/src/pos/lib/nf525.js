import { core,dataset,datatable } from '../../core/core.js';
import moment from 'moment';

export class nf525Cls
{
    constructor()
    {
        this.core = core.instance;
    }
    signatureSale(pData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastRef = 0
            let tmpLastSignature = ''

            let tmpQuery = 
            {
                query : "SELECT TOP 1 * FROM [dbo].[POS_VW_01] WHERE DEVICE = @DEVICE AND GUID <> @GUID ORDER BY LDATE DESC",
                param : ['DEVICE:string|25','GUID:string|50'],
                value : [pData.DEVICE,pData.GUID]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)

            if(tmpResult.result.recordset.length > 0)
            {
                if(tmpResult.result.recordset[0].REF != null)
                {
                    tmpLastRef = tmpResult.result.recordset[0].REF
                }
                
                if(tmpResult.result.recordset[0].SIGNATURE != null)
                {
                    let tmpDt = new datatable()
                    tmpDt.selectCmd = 
                    {
                        query : "SELECT * FROM [dbo].[POS_SALE_VW_01] WHERE POS_GUID = @POS_GUID",
                        param : ['POS_GUID:string|50'],
                        value : [tmpResult.result.recordset[0].GUID]
                    }
                    
                    await tmpDt.refresh()
                    
                    if(tmpDt.length > 0)
                    {
                        let tmpVatLst = tmpDt.where({GUID:{'<>':'00000000-0000-0000-0000-000000000000'}}).groupBy('VAT_RATE');
                        
                        for (let i = 0; i < tmpVatLst.length; i++) 
                        {
                            tmpLastSignature = tmpLastSignature + parseInt(Number(tmpVatLst[i].VAT_RATE) * 100).toString().padStart(4,'0') + ":" + parseInt(Number(tmpDt.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('TOTAL',2)) * 100).toString() + "|"
                        }
                        
                        tmpLastSignature = tmpLastSignature.toString().substring(0,tmpLastSignature.length - 1)
                        tmpLastSignature = tmpLastSignature + "," + parseInt(Number(Number(tmpResult.result.recordset[0].TOTAL).toFixed(2)) * 100).toString()
                        tmpLastSignature = tmpLastSignature + "," + moment(tmpResult.result.recordset[0].LDATE).format("YYYYMMDDHHmmss")
                        tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].DEVICE + "" + tmpResult.result.recordset[0].REF.toString().padStart(8,'0') 
                        tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].TYPE_NAME
                        tmpLastSignature = tmpLastSignature + "," + (tmpResult.result.recordset[0].SIGNATURE == "" ? "N" : "O")
                    }
                }
            }

            resolve({REF:tmpLastRef + 1,SIGNATURE:btoa(tmpLastSignature)})
        })
    }
    signatureDuplicate(pGuid)
    {
        return new Promise(async resolve => 
        {
            let tmpLastSignature = ''

            let tmpQuery = 
            {
                query : "SELECT TOP 1 " +
                        "NF525.GUID, " +
                        "NF525.POS, " +
                        "NF525.PRINT_NO, " +
                        "NF525.LUSER, " +
                        "NF525.LDATE, " +
                        "NF525.SIGNATURE, " +
                        "NF525.APP_VERSION, " +
                        "NF525.DESCRIPTION, " +
                        "POS.REF, " +
                        "POS.TYPE_NAME, " +
                        "POS.DEVICE " +
                        "FROM NF525_POS_DUPLICATE_VW_01 AS NF525 " +
                        "INNER JOIN POS_VW_01 AS POS ON " +
                        "NF525.POS = POS.GUID " +
                        "WHERE NF525.POS = @POS ORDER BY NF525.PRINT_NO DESC",
                param : ['POS:string|50'],
                value : [pGuid]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)
            console.log(tmpResult)
            console.log(tmpQuery)
            if(tmpResult.result.recordset.length > 0)
            {
                if(tmpResult.result.recordset[0].SIGNATURE != null)
                {
                    tmpLastSignature = tmpResult.result.recordset[0].GUID
                    tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].TYPE_NAME
                    tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].PRINT_NO
                    tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].LUSER
                    tmpLastSignature = tmpLastSignature + "," + moment(tmpResult.result.recordset[0].LDATE).format("YYYYMMDDHHmmss")
                    tmpLastSignature = tmpLastSignature + "," + tmpResult.result.recordset[0].DEVICE + "" + tmpResult.result.recordset[0].REF.toString().padStart(8,'0') 
                    tmpLastSignature = tmpLastSignature + "," + (tmpResult.result.recordset[0].SIGNATURE == "" ? "N" : "O")
                }
            }
            console.log(btoa(tmpLastSignature))
            resolve(btoa(tmpLastSignature))
        })
    }
}