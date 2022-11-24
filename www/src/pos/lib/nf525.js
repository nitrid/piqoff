import { core,dataset,datatable } from '../../core/core.js';
import moment from 'moment';
import rsa from 'jsrsasign';
import { pem } from '../../../../pem.js';

export class nf525Cls
{
    constructor()
    {
        this.core = core.instance;
    }
    generatePem()
    {
        let keyObj = rsa.KEYUTIL.generateKeypair("EC", "secp256r1");

        let cert = new rsa.KJUR.asn1.x509.Certificate(
        {
            version: 1,
            serial: {int: 1},
            issuer: {str: "/CN=NF525"},
            notbefore: "202231235959Z",
            notafter:  "222231235959Z",
            subject: {str: "/CN=NF525"},
            sbjpubkey: keyObj.pubKeyObj, // can specify public key object or PEM string
            ext: [
              {extname: "basicConstraints", cA: false},
              {extname: "keyUsage", critical: true, names:["digitalSignature"]},
              {extname: "cRLDistributionPoints",
               array: [{fulluri: 'http://example.com/a.crl'}]}
            ],
            sigalg: "SHA256withECDSA",
            cakey: keyObj.prvKeyObj // can specify private key object or PEM string
          });
        
        return {
            private : rsa.KEYUTIL.getPEM(keyObj.prvKeyObj, "PKCS1PRV"),
            public : rsa.KEYUTIL.getPEM(keyObj.pubKeyObj),
            certificate : cert.getPEM()
        }
    }
    sign(pData)
    {
        return rsa.KJUR.jws.JWS.sign("ES256", JSON.stringify({alg: "ES256"}),pData, pem.private)
    }
    verify(pJWS)
    {
        return rsa.KJUR.jws.JWS.verify(pJWS, pem.public, ["ES256"])
    }
    getParseSign(pJWS)
    {
        //İMZALANMIŞ DATANIN DECRYPTE İŞLEMİ.
        return rsa.KJUR.jws.JWS.parse(pJWS)
    }
    async lastSaleSignData(pData)
    {
        return new Promise(async resolve => 
        {
            if(!this.core.offline)
            {
                let tmpLastRef = 0
                let tmpLastSignature = ''
    
                let tmpQuery = 
                {
                    query : "SELECT TOP 1 * FROM [dbo].[POS_VW_01] WHERE DEVICE = @DEVICE AND GUID <> @GUID AND STATUS = 1 ORDER BY LDATE DESC",
                    param : ['DEVICE:string|25','GUID:string|50'],
                    value : [pData.DEVICE,pData.GUID]
                }
                
                let tmpResult = await this.core.sql.execute(tmpQuery)
    
                if(typeof tmpResult.result.err == 'undefined' && tmpResult.result.recordset.length > 0)
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
                localStorage.setItem('REF_SALE',tmpLastRef)
                localStorage.setItem('SIG_SALE',this.sign(tmpLastSignature))
            }
            
            resolve (
            {
                REF : typeof localStorage.getItem('REF_SALE') == 'undefined' ? 1 : localStorage.getItem('REF_SALE'),
                LAST_SIGN : typeof localStorage.getItem('SIG_SALE') == 'undefined' ? '' : localStorage.getItem('SIG_SALE')
            })
        })
    }
    signatureSale(pData,pSaleData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastData = await this.lastSaleSignData(pData)
            let tmpSignature = ''

            if(pSaleData.length > 0)
            {
                let tmpVatLst = pSaleData.where({GUID:{'<>':'00000000-0000-0000-0000-000000000000'}}).groupBy('VAT_RATE');
                    
                for (let i = 0; i < tmpVatLst.length; i++) 
                {
                    tmpSignature = tmpSignature + parseInt(Number(tmpVatLst[i].VAT_RATE) * 100).toString().padStart(4,'0') + ":" + parseInt(Number(pSaleData.where({VAT_TYPE:tmpVatLst[i].VAT_TYPE}).sum('TOTAL',2)) * 100).toString() + "|"
                }
                
                tmpSignature = tmpSignature.toString().substring(0,tmpSignature.length - 1)
                tmpSignature = tmpSignature + "," + parseInt(Number(Number(pData.TOTAL).toFixed(2)) * 100).toString()
                tmpSignature = tmpSignature + "," + moment(pData.LDATE).format("YYYYMMDDHHmmss")
                tmpSignature = tmpSignature + "," + pData.DEVICE + "" + (Number(tmpLastData.REF) + 1).toString().padStart(8,'0') 
                tmpSignature = tmpSignature + "," + pData.TYPE_NAME
                tmpSignature = tmpSignature + "," + (tmpLastData.LAST_SIGN == "" ? "N" : "O")

                localStorage.setItem('REF_SALE',Number(tmpLastData.REF) + 1)
                localStorage.setItem('SIG_SALE',this.sign(tmpSignature))

                tmpSignature = tmpSignature + "," + tmpLastData.LAST_SIGN
            }

            resolve({REF:Number(tmpLastData.REF) + 1,SIGNATURE:this.sign(tmpSignature)})
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
            
            resolve(this.sign(tmpLastSignature))
        })
    }
}