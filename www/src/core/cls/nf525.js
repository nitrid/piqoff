import { core,dataset,datatable } from '../core.js';
import moment from 'moment';
import rsa from 'jsrsasign';
import { pem } from '../../../../pem.js';

export class nf525Cls
{
    constructor()
    {
        this.core = core.instance;
        //console.log(this.generatePem())
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
            private : rsa.KEYUTIL.getPEM(keyObj.prvKeyObj),
            public : rsa.KEYUTIL.getPEM(keyObj.pubKeyObj),
            certificate : cert.getPEM()
        }
    }
    sign(pData)
    {
        let sig = new rsa.KJUR.crypto.Signature({"alg": "SHA256withECDSA", "prov": "cryptojs/jsrsa"});
        sig.init(pem.private);
        sig.updateString(pData);
        let sigValueHex = rsa.hextob64u(sig.sign());
        // console.log(pData)
        // console.log(sigValueHex)
        // console.log(rsa.hextob64u(sigValueHex))
        // console.log(rsa.b64tohex(rsa.hextob64u(sigValueHex)))
        // this.verify(pData,rsa.b64tohex(rsa.hextob64u(sigValueHex)))
        return sigValueHex
    }
    verify(pData,pSig)
    {
        let sig = new rsa.KJUR.crypto.Signature({'alg':'SHA256withECDSA', "prov": "cryptojs/jsrsa"});
        sig.init(pem.public);
        sig.updateString(pData);
        let isValid = sig.verify(rsa.b64tohex(pSig));
        return isValid
    }
    async lastDocSignData(pData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastRef = 0
            let tmpLastSignature = ''

            let tmpQuery = 
            {
                query : "SELECT TOP 1 * FROM DOC_VW_01 WHERE DOC_TYPE IN (20,21) AND GUID <> @GUID AND TYPE = 1 AND SIGNATURE <> '' ORDER BY CDATE DESC",
                param : ['GUID:string|50'],
                value : [pData.GUID]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)

            if(typeof tmpResult.result.err == 'undefined' && tmpResult.result.recordset.length > 0)
            {
                if(tmpResult.result.recordset[0].REF_NO != null)
                {
                    tmpLastRef = tmpResult.result.recordset[0].REF_NO
                }
                if(tmpResult.result.recordset[0].SIGNATURE != null)
                {
                    tmpLastSignature = tmpResult.result.recordset[0].SIGNATURE
                }
            }

            resolve (
            {
                REF : tmpLastRef,
                LAST_SIGN : tmpLastSignature
            })
        })
    }
    signatureDoc(pData,pSaleData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastData = await this.lastDocSignData(pData)
            let tmpSignature = ''
            let tmpSignatureSum = ''
            
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
                tmpSignature = tmpSignature + "," + (Number(tmpLastData.REF) + 1).toString().padStart(8,'0') 
                tmpSignature = tmpSignature + "," + pData.TYPE_NAME
                tmpSignature = tmpSignature + "," + pData.INPUT_NAME
                tmpSignature = tmpSignature + "," + pData.ZIPCODE
                tmpSignature = tmpSignature + "," + pData.TAX_NO
                tmpSignature = tmpSignature + "," + (tmpLastData.LAST_SIGN == "" ? "N" : "O")
                tmpSignature = tmpSignature + "," + tmpLastData.LAST_SIGN
                tmpSignatureSum = tmpSignature
                tmpSignature = this.sign(tmpSignature)
            }

            resolve({REF:Number(tmpLastData.REF) + 1,SIGNATURE:tmpSignature,SIGNATURE_SUM:tmpSignatureSum})
        })
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
                        tmpLastSignature = tmpResult.result.recordset[0].SIGNATURE
                    }
                }
                localStorage.setItem('REF_SALE',tmpLastRef)
                localStorage.setItem('SIG_SALE',tmpLastSignature)
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
            let tmpSignatureSum = ''
            
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
                tmpSignature = tmpSignature + "," + tmpLastData.LAST_SIGN
                tmpSignatureSum = tmpSignature
                tmpSignature = this.sign(tmpSignature)
                
                localStorage.setItem('REF_SALE',Number(tmpLastData.REF) + 1)
                localStorage.setItem('SIG_SALE',tmpSignature)
            }

            resolve({REF:Number(tmpLastData.REF) + 1,SIGNATURE:tmpSignature,SIGNATURE_SUM:tmpSignatureSum})
        })
    }
    signaturePosDuplicate(pData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastSignature = ''
            let tmpSignature = ''
            let tmpPrintCount = 0

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
                value : [pData.GUID]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)
            
            if(tmpResult.result.recordset.length > 0)
            {
                if(tmpResult.result.recordset[0].PRINT_NO != null)
                {
                    tmpPrintCount = tmpResult.result.recordset[0].PRINT_NO
                }
                if(tmpResult.result.recordset[0].SIGNATURE != null)
                {
                    tmpLastSignature = tmpResult.result.recordset[0].SIGNATURE
                }
            }
            
            tmpSignature = pData.GUID
            tmpSignature = tmpSignature + "," + pData.TYPE_NAME
            tmpSignature = tmpSignature + "," + tmpPrintCount + 1
            tmpSignature = tmpSignature + "," + pData.LUSER
            tmpSignature = tmpSignature + "," + moment(pData.LDATE).format("YYYYMMDDHHmmss")
            tmpSignature = tmpSignature + "," + pData.DEVICE + "" + pData.REF.toString().padStart(8,'0') 
            tmpSignature = tmpSignature + "," + (tmpLastSignature == "" ? "N" : "O")
            tmpSignature = tmpSignature + "," + tmpLastSignature

            resolve(this.sign(tmpSignature))
        })
    }
    signatureDocDuplicate(pData)
    {
        return new Promise(async resolve => 
        {
            let tmpLastSignature = ''
            let tmpSignature = ''
            let tmpPrintCount = 0

            let tmpQuery = 
            {
                query : "SELECT TOP 1 " +
                        "NF203.FAC_DUP_NID AS GUID, " +
                        "NF203.FAC_DUP_ORI_NUM AS DOC, " +
                        "NF203.FAC_DUP_PRN_NUM AS PRINT_NO, " +
                        "NF203.FAC_DUP_OPS_NID AS LUSER, " +
                        "NF203.FAC_DUP_HOR_GDH AS LDATE, " +
                        "NF203.FAC_DUP_SIG AS SIGNATURE, " +
                        "NF203.FAC_DUP_VER AS APP_VERSION, " +
                        "NF203.FAC_DUP_TYP AS TYPE_NAME " +
                        "FROM NF203_DOC_DUPLICATE_VW_01 AS NF203 " +
                        "WHERE NF203.FAC_DUP_ORI_NUM = @DOC ORDER BY NF203.FAC_DUP_PRN_NUM DESC",
                param : ['POS:string|50'],
                value : [pData.GUID]
            }
            
            let tmpResult = await this.core.sql.execute(tmpQuery)
            
            if(tmpResult.result.recordset.length > 0)
            {
                if(tmpResult.result.recordset[0].PRINT_NO != null)
                {
                    tmpPrintCount = tmpResult.result.recordset[0].PRINT_NO
                }
                if(tmpResult.result.recordset[0].SIGNATURE != null)
                {
                    tmpLastSignature = tmpResult.result.recordset[0].SIGNATURE
                }
            }
            
            tmpSignature = pData.GUID
            tmpSignature = tmpSignature + "," + pData.TYPE_NAME
            tmpSignature = tmpSignature + "," + tmpPrintCount + 1
            tmpSignature = tmpSignature + "," + pData.LUSER
            tmpSignature = tmpSignature + "," + moment(pData.LDATE).format("YYYYMMDDHHmmss")
            tmpSignature = tmpSignature + "," + pData.FAC_DUP_NID
            tmpSignature = tmpSignature + "," + (tmpLastSignature == "" ? "N" : "O")
            tmpSignature = tmpSignature + "," + tmpLastSignature

            resolve(this.sign(tmpSignature))
        })
    }
}