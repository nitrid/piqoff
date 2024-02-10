import { core,dataset,datatable } from "../core.js";
import moment from 'moment';
import { jsPDF } from "jspdf";
import "jspdf-barcode";

export class posCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            FIRM : '00000000-0000-0000-0000-000000000000',
            DEVICE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            TYPE_NAME : 'VENTE',
            DOC_TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            REF : 0,
            FACT_REF :0,
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_TYPE : 0,
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CUSTOMER_TAX_NO : '',
            CUSTOMER_ADRESS : '',
            CUSTOMER_ZIPCODE : '',
            CUSTOMER_COUNTRY : '',
            CUSTOMER_CITY : '',
            CUSTOMER_POINT : 0,
            CUSTOMER_POINT_PASSIVE : false,
            CUSTOMER_MAIL: '',
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            TOTAL : 0,
            TICKET : '', //İADE ALINAN TICKET
            REBATE_CHEQPAY : '', //İADE CEKİ
            STATUS : 0,
            DELETED : false,            
            DESCRIPTION : '',
            CERTIFICATE : '',
            ORDER_GUID : '00000000-0000-0000-0000-000000000000',
            SIGNATURE : '',
            SIGNATURE_SUM : ''
        }

        this.posSale = new posSaleCls();
        this.posPay = new posPaymentCls();
        this.posExtra = new posExtraCls();
        
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50'],
            local : 
            {
                type : "select",
                query : "SELECT * FROM POS_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND DELETED = ?;",
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@FIRM = @PFIRM, " +
                    "@DEVICE = @PDEVICE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +  
                    "@DOC_TYPE = @PDOC_TYPE, " +                       
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@REF = @PREF, " +
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@TICKET = @PTICKET, " + 
                    "@STATUS = @PSTATUS, " +
                    "@CERTIFICATE = @PCERTIFICATE, " +
                    "@ORDER_GUID = @PORDER_GUID, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PFIRM:string|50','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_TYPE:int','PDOC_DATE:date','PREF:int',
                     'PCUSTOMER:string|50','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int',
                     'PCERTIFICATE:string|250','PORDER_GUID:string|50','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','FIRM','DEVICE','DEPOT_GUID','TYPE','DOC_TYPE','DOC_DATE','REF','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET',
                       'STATUS','CERTIFICATE','ORDER_GUID','SIGNATURE','SIGNATURE_SUM'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, FIRM, DEVICE, DEPOT_GUID, DEPOT_CODE, DEPOT_NAME, TYPE, TYPE_NAME, DOC_TYPE, 
                        DOC_DATE, REF, CUSTOMER_GUID, CUSTOMER_TYPE, CUSTOMER_CODE, CUSTOMER_NAME, CUSTOMER_TAX_NO, CUSTOMER_ADRESS, CUSTOMER_ZIPCODE, CUSTOMER_COUNTRY, CUSTOMER_CITY, 
                        CUSTOMER_POINT, FAMOUNT, AMOUNT, DISCOUNT, LOYALTY, VAT, TOTAL, TICKET, REBATE_CHEQPAY, STATUS, DESCRIPTION, DELETED, CERTIFICATE, ORDER_GUID, SIGNATURE, SIGNATURE_SUM)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                values : [{GUID : {map:'GUID'},CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        LUSER_NAME : {map:'LUSER_NAME'},FIRM : {map:'FIRM'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},TYPE_NAME : {map:'TYPE_NAME'},
                        DOC_TYPE : {map:'DOC_TYPE'},DOC_DATE : {map:'DOC_DATE',type:'date_time'},REF : {map:'REF'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_TYPE : {map:'CUSTOMER_TYPE'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},
                        CUSTOMER_NAME : {map:'CUSTOMER_NAME'},CUSTOMER_TAX_NO : {map:'CUSTOMER_TAX_NO'},CUSTOMER_ADRESS : {map:'CUSTOMER_ADRESS'},CUSTOMER_ZIPCODE : {map:'CUSTOMER_ZIPCODE'},CUSTOMER_COUNTRY : {map:'CUSTOMER_COUNTRY'},
                        CUSTOMER_CITY : {map:'CUSTOMER_CITY'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},
                        VAT : {map:'VAT'},TOTAL : {map:'TOTAL'},TICKET : {map:'TICKET'},REBATE_CHEQPAY : {map:'REBATE_CHEQPAY'},STATUS : {map:'STATUS'},DESCRIPTION : {map:'DESCRIPTION'},DELETED:0,
                        CERTIFICATE : {map:'CERTIFICATE'},ORDER_GUID : {map:'ORDER_GUID'},SIGNATURE : {map:'SIGNATURE'},SIGNATURE_SUM : {map:'SIGNATURE_SUM'}}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@DEVICE = @PDEVICE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +  
                    "@DOC_TYPE = @PDOC_TYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@REF = @PREF, " +
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@FAMOUNT = @PFAMOUNT, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@TICKET = @PTICKET, " + 
                    "@STATUS = @PSTATUS, " +
                    "@CERTIFICATE = @PCERTIFICATE, " +
                    "@ORDER_GUID = @PORDER_GUID, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PFIRM:string|50','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_TYPE:int','PDOC_DATE:date','PREF:int',
                     'PCUSTOMER:string|50','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int',
                     'PCERTIFICATE:string|250','PORDER_GUID:string|50','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','FIRM','DEVICE','DEPOT_GUID','TYPE','DOC_TYPE','DOC_DATE','REF','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET',
                       'STATUS','CERTIFICATE','ORDER_GUID','SIGNATURE','SIGNATURE_SUM'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_VW_01 SET CDATE = ?, CUSER = ?, CUSER_NAME = ?, LDATE = ?, LUSER = ?, LUSER_NAME = ?, DEVICE = ?, DEPOT_GUID = ?, DEPOT_CODE = ?, DEPOT_NAME = ?, 
                        TYPE = ?, TYPE_NAME = ?, DOC_TYPE = ?, DOC_DATE = ?, REF = ?, CUSTOMER_GUID = ?, CUSTOMER_TYPE = ?, CUSTOMER_CODE = ?, CUSTOMER_NAME = ?, CUSTOMER_TAX_NO = ?, 
                        CUSTOMER_ADRESS = ?, CUSTOMER_ZIPCODE = ?, CUSTOMER_COUNTRY = ?, CUSTOMER_CITY = ?, CUSTOMER_POINT = ?, FAMOUNT = ?, AMOUNT = ?, DISCOUNT = ?, LOYALTY = ?, 
                        VAT = ?, TOTAL = ?, TICKET = ?, REBATE_CHEQPAY = ?, STATUS = ?, DESCRIPTION = ?, DELETED = ?, CERTIFICATE = ?, ORDER_GUID = ?, SIGNATURE = ?, SIGNATURE_SUM = ? WHERE GUID = ?;`,
                values :[{CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        LUSER_NAME : {map:'LUSER_NAME'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},TYPE_NAME : {map:'TYPE_NAME'},
                        DOC_TYPE : {map:'DOC_TYPE'},DOC_DATE : {map:'DOC_DATE',type:'date_time'},REF : {map:'REF'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_TYPE : {map:'CUSTOMER_TYPE'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},
                        CUSTOMER_NAME : {map:'CUSTOMER_NAME'},CUSTOMER_TAX_NO : {map:'CUSTOMER_TAX_NO'},CUSTOMER_ADRESS : {map:'CUSTOMER_ADRESS'},CUSTOMER_ZIPCODE : {map:'CUSTOMER_ZIPCODE'},CUSTOMER_COUNTRY : {map:'CUSTOMER_COUNTRY'},
                        CUSTOMER_CITY : {map:'CUSTOMER_CITY'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},
                        VAT : {map:'VAT'},TOTAL : {map:'TOTAL'},TICKET : {map:'TICKET'},REBATE_CHEQPAY : {map:'REBATE_CHEQPAY'},STATUS : {map:'STATUS'},DESCRIPTION : {map:'DESCRIPTION'},DELETED:0,
                        CERTIFICATE : {map:'CERTIFICATE'},ORDER_GUID : {map:'ORDER_GUID'},SIGNATURE : {map:'SIGNATURE'},SIGNATURE_SUM : {map:'SIGNATURE_SUM'},GUID : {map:'GUID'}}],
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            [{
                type : "update",
                query : `UPDATE POS_VW_01 SET DELETED = ? WHERE GUID = ?;`,
                values : [{DELETED:1,GUID : {map:'GUID'}}],
            },
            {
                type : "update",
                query : `UPDATE POS_SALE_VW_01 SET DELETED = ? WHERE POS_GUID = ?;`,
                values : [{DELETED:1,POS_GUID : {map:'GUID'}}]
            },
            {
                type : "update",
                query : `UPDATE POS_PAYMENT_VW_01 SET DELETED = ? WHERE POS_GUID = ?;`,
                values : [{DELETED:1,POS_GUID : {map:'GUID'}}]
            }]
        }

        this.ds.add(tmpDt);
        this.ds.add(this.posSale.dt('POS_SALE'))
        this.ds.add(this.posPay.dt('POS_PAYMENT'))
        this.ds.add(this.posExtra.dt('POS_EXTRA'))
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            
            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('POS').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,0]
                          
            await this.ds.get('POS').refresh();
            
            if(this.ds.get('POS').length > 0)
            {
                await this.posSale.load({POS_GUID:this.ds.get('POS')[0].GUID})
                await this.posPay.load({POS_GUID:this.ds.get('POS')[0].GUID})
                await this.posExtra.load({POS_GUID:this.ds.get('POS')[0].GUID})
            }
            resolve(this.ds.get('POS'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
            this.posSale.subTotalBuild();
        });
    }
}
export class posSaleCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {            
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            LDATE : moment(new Date()).utcOffset(0, true),
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',            
            LINE_NO : 0,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            ITEM_SNAME : '',
            TICKET_REST : false,
            WEIGHING : false,
            COST_PRICE : 0,
            MIN_PRICE : 0,
            MAX_PRICE : 0,
            INPUT : '',
            BARCODE_GUID : '00000000-0000-0000-0000-000000000000',
            BARCODE : '',
            UNIT_GUID : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_SHORT : '',
            UNIT_FACTOR : 0,
            QUANTITY : 0,
            PRICE : 0,
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            VAT_RATE : 0,
            VAT_TYPE : '',
            TOTAL : 0,
            SUBTOTAL : 0,
            PROMO_TYPE : 0,
            GRAND_AMOUNT : 0,
            GRAND_DISCOUNT : 0,
            GRAND_LOYALTY : 0,
            GRAND_VAT : 0,
            GRAND_TOTAL : 0,
            STATUS : 0,
            NO : 0,
            DELETED : false,
            ORDER_GUID : '00000000-0000-0000-0000-000000000000',
            SCALE_MANUEL : false
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_SALE');            
        tmpDt.selectCmd = 
        {
            query : `SELECT ROW_NUMBER() OVER (ORDER BY LDATE ASC) AS NO,* FROM [dbo].[POS_SALE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000')) ORDER BY LDATE DESC`,
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                query : `SELECT * FROM POS_SALE_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND 
                        ((POS_GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND DELETED = ? ORDER BY LDATE DESC;`,
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CDATE = @PCDATE, " + 
                    "@LDATE = @PLDATE, " + 
                    "@POS = @PPOS, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +  
                    "@INPUT = @PINPUT, " +                      
                    "@BARCODE = @PBARCODE, " + 
                    "@UNIT = @PUNIT, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@SUBTOTAL = @PSUBTOTAL, " + 
                    "@PROMO_TYPE = @PPROMO_TYPE, " +
                    "@ORDER_GUID = @PORDER_GUID, " + 
                    "@SCALE_MANUEL = @PSCALE_MANUEL ",  
            param : ['PGUID:string|50','PCUSER:string|25','PCDATE:datetime','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                    'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int','PORDER_GUID:string|50',
                    'PSCALE_MANUEL:bit'],
            dataprm : ['GUID','CUSER','LDATE','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT',
                    'TOTAL','SUBTOTAL','PROMO_TYPE','ORDER_GUID','SCALE_MANUEL'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_SALE_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, POS_GUID, DEVICE, DEPOT_GUID, DEPOT_CODE, DEPOT_NAME, TYPE, DOC_DATE, CUSTOMER_GUID, CUSTOMER_CODE, 
                        CUSTOMER_NAME, LINE_NO, ITEM_GUID, ITEM_CODE, ITEM_NAME, ITEM_SNAME, ITEM_GRP_CODE, ITEM_GRP_NAME, COST_PRICE, MIN_PRICE, MAX_PRICE, TICKET_REST, INPUT, BARCODE_GUID, BARCODE, UNIT_GUID, 
                        UNIT_NAME, UNIT_FACTOR, UNIT_SHORT, QUANTITY, PRICE, FAMOUNT, AMOUNT, DISCOUNT, LOYALTY, VAT, VAT_RATE, VAT_TYPE, TOTAL, SUBTOTAL, PROMO_TYPE, GRAND_AMOUNT, GRAND_DISCOUNT, GRAND_LOYALTY, GRAND_VAT, GRAND_TOTAL, STATUS, REBATE_TICKET, DELETED, ORDER_GUID)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                values : [{GUID : {map:'GUID'},CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                        DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},LINE_NO : {map:'LINE_NO'},
                        ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},ITEM_SNAME : {map:'ITEM_SNAME'},ITEM_GRP_CODE : {map:'ITEM_GRP_CODE'},ITEM_GRP_NAME : {map:'ITEM_GRP_NAME'},
                        COST_PRICE : {map:'COST_PRICE'},MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},TICKET_REST : {map:'TICKET_REST'},INPUT : {map:'INPUT'},BARCODE_GUID : {map:'BARCODE_GUID'},
                        BARCODE : {map:'BARCODE'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},UNIT_SHORT : {map:'UNIT_SHORT'},QUANTITY : {map:'QUANTITY'},
                        PRICE : {map:'PRICE'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},VAT_RATE : {map:'VAT_RATE'},VAT_TYPE : {map:'VAT_TYPE'},
                        TOTAL : {map:'TOTAL'},SUBTOTAL : {map:'SUBTOTAL'},PROMO_TYPE : {map:'PROMO_TYPE'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},
                        GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},REBATE_TICKET : {map:'REBATE_TICKET'},DELETED:false,ORDER_GUID : {map:'ORDER_GUID'}}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@LDATE = @PLDATE, " + 
                    "@POS = @PPOS, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " + 
                    "@INPUT = @PINPUT, " +                   
                    "@BARCODE = @PBARCODE, " + 
                    "@UNIT = @PUNIT, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " + 
                    "@FAMOUNT = @PFAMOUNT, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@SUBTOTAL = @PSUBTOTAL, " + 
                    "@PROMO_TYPE = @PPROMO_TYPE, " +
                    "@ORDER_GUID = @PORDER_GUID, " +
                    "@SCALE_MANUEL = @PSCALE_MANUEL " ,  
            param : ['PGUID:string|50','PCUSER:string|25','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                     'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int','PORDER_GUID:string|50',
                     'PSCALE_MANUEL:bit'],
            dataprm : ['GUID','CUSER','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY',
                    'VAT','TOTAL','SUBTOTAL','PROMO_TYPE','ORDER_GUID','SCALE_MANUEL'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_SALE_VW_01 
                        SET CDATE = ?, CUSER = ?, CUSER_NAME = ?, LDATE = ?, LUSER = ?, LUSER_NAME = ?, POS_GUID = ?, DEVICE = ?, DEPOT_GUID = ?, DEPOT_CODE = ?, DEPOT_NAME = ?, TYPE = ?, DOC_DATE = ?, 
                        CUSTOMER_GUID = ?, CUSTOMER_CODE = ?, CUSTOMER_NAME = ?, LINE_NO = ?, ITEM_GUID = ?, ITEM_CODE = ?, ITEM_NAME = ?, ITEM_SNAME = ?, ITEM_GRP_CODE = ?, ITEM_GRP_NAME = ?, 
                        COST_PRICE = ?, MIN_PRICE = ?, MAX_PRICE = ?, TICKET_REST = ?, INPUT = ?, BARCODE_GUID = ?, BARCODE = ?, UNIT_GUID = ?, UNIT_NAME = ?, UNIT_FACTOR = ?, UNIT_SHORT = ?, 
                        QUANTITY = ?, PRICE = ?, FAMOUNT = ?, AMOUNT = ?, DISCOUNT = ?, LOYALTY = ?, VAT = ?, VAT_RATE = ?, VAT_TYPE = ?, TOTAL = ?, SUBTOTAL = ?, PROMO_TYPE = ?, GRAND_AMOUNT = ?, 
                        GRAND_DISCOUNT = ?, GRAND_LOYALTY = ?, GRAND_VAT = ?, GRAND_TOTAL = ?, STATUS = ?, REBATE_TICKET = ?, DELETED = ?, ORDER_GUID = ?
                        WHERE GUID = ?;`,
                values : [{CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                        DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},LINE_NO : {map:'LINE_NO'},
                        ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},ITEM_SNAME : {map:'ITEM_SNAME'},ITEM_GRP_CODE : {map:'ITEM_GRP_CODE'},ITEM_GRP_NAME : {map:'ITEM_GRP_NAME'},
                        COST_PRICE : {map:'COST_PRICE'},MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},TICKET_REST : {map:'TICKET_REST'},INPUT : {map:'INPUT'},BARCODE_GUID : {map:'BARCODE_GUID'},
                        BARCODE : {map:'BARCODE'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},UNIT_SHORT : {map:'UNIT_SHORT'},QUANTITY : {map:'QUANTITY'},
                        PRICE : {map:'PRICE'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},VAT_RATE : {map:'VAT_RATE'},VAT_TYPE : {map:'VAT_TYPE'},
                        TOTAL : {map:'TOTAL'},SUBTOTAL : {map:'SUBTOTAL'},PROMO_TYPE : {map:'PROMO_TYPE'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},
                        GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},REBATE_TICKET : {map:'REBATE_TICKET'},DELETED:0,ORDER_GUID : {map:'ORDER_GUID'},GUID : {map:'GUID'}}]
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_SALE_VW_01 SET DELETED = ? WHERE GUID = ?;`,
                values : [{DELETED:1,GUID : {map:'GUID'}}]
            }
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS_SALE') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_SALE').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',POS_GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_SALE').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('POS_SALE').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.POS_GUID,tmpPrm.POS_GUID,0]
            
            await this.ds.get('POS_SALE').refresh();
            
            resolve(this.ds.get('POS_SALE'));    
            this.subTotalBuild();
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
            this.subTotalBuild();
        }); 
    }
    subTotalBuild()
    {
        let tmpData = arguments.length == 0 ? this.ds.get('POS_SALE') : arguments[0]
        let tmpArr = [];
        let tmpSubIndex = -1;

        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpData[i].GUID == '00000000-0000-0000-0000-000000000000')
            {
                tmpData.splice(i, 1); 
            }
        }
        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpSubIndex != tmpData[i].SUBTOTAL)
            {
                tmpSubIndex = tmpData[i].SUBTOTAL;
                if(tmpData[i].SUBTOTAL > 0)
                { 
                    let tmpItem = {...this.empty};
                    tmpItem.LDATE = tmpData.where({SUBTOTAL:tmpSubIndex}).max('LDATE');
                    tmpItem.ITEM_NAME = "SUB TOTAL";
                    tmpItem.ITEM_SNAME = "SUB TOTAL";
                    tmpItem.SUBTOTAL = tmpSubIndex;
                    tmpItem.AMOUNT = Number(tmpData.where({SUBTOTAL:tmpSubIndex}).sum('AMOUNT',2));

                    tmpArr.push(tmpItem)
                }
            }
            tmpArr.push(tmpData[i])
        }
        tmpData.splice(0,tmpData.length)
        tmpData.import(tmpArr)
    }
}
export class posPaymentCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            PAY_TYPE : 0,
            PAY_TYPE_NAME : '',
            LINE_NO : 0,
            AMOUNT : 0,
            CHANGE : 0,
            TICKET_PLUS : 0,
            GRAND_AMOUNT : 0,
            GRAND_DISCOUNT : 0,
            GRAND_LOYALTY : 0,
            GRAND_VAT : 0,
            GRAND_TOTAL : 0,
            STATUS : 0,
            DELETED : false
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_PAYMENT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_PAYMENT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                query : `SELECT * FROM POS_PAYMENT_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND DELETED = ?;`,
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_PAYMENT_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, POS_GUID, DEVICE, DEPOT_GUID, DEPOT_CODE, DEPOT_NAME, TYPE, DOC_DATE, CUSTOMER_GUID, 
                        CUSTOMER_CODE, CUSTOMER_NAME, PAY_TYPE, PAY_TYPE_NAME, LINE_NO, AMOUNT, CHANGE, TICKET_PLUS, GRAND_AMOUNT, GRAND_DISCOUNT, GRAND_LOYALTY, GRAND_VAT, GRAND_TOTAL, STATUS, DELETED)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                values : [{GUID : {map:'GUID'},CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                        DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},PAY_TYPE : {map:'PAY_TYPE'},
                        PAY_TYPE_NAME : {map:'PAY_TYPE_NAME'},LINE_NO : {map:'LINE_NO'},AMOUNT : {map:'AMOUNT'},CHANGE : {map:'CHANGE'},TICKET_PLUS : {map:'TICKET_PLUS'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},
                        GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},DELETED:0}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_PAYMENT_VW_01 SET CDATE = ?, CUSER = ?, CUSER_NAME = ?, LDATE = ?, LUSER = ?, LUSER_NAME = ?, POS_GUID = ?, DEVICE = ?, DEPOT_GUID = ?, DEPOT_CODE = ?, DEPOT_NAME = ?, 
                        TYPE = ?, DOC_DATE = ?, CUSTOMER_GUID = ?, CUSTOMER_CODE = ?, CUSTOMER_NAME = ?, PAY_TYPE = ?, PAY_TYPE_NAME = ?, LINE_NO = ?, AMOUNT = ?, CHANGE = ?, TICKET_PLUS = ?, GRAND_AMOUNT = ?, 
                        GRAND_DISCOUNT = ?, GRAND_LOYALTY = ?, GRAND_VAT = ?, GRAND_TOTAL = ?, STATUS = ?, DELETED = ? WHERE GUID = ?;`,
                values : [{CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                         LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                         DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},PAY_TYPE : {map:'PAY_TYPE'},
                         PAY_TYPE_NAME : {map:'PAY_TYPE_NAME'},LINE_NO : {map:'LINE_NO'},AMOUNT : {map:'AMOUNT'},CHANGE : {map:'CHANGE'},TICKET_PLUS : {map:'TICKET_PLUS'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},
                         GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},DELETED:0,
                         GUID : {map:'GUID'}}]
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_PAYMENT_VW_01 SET DELETED = ? WHERE GUID = ?;`,
                values : [{DELETED:1,GUID : {map:'GUID'}}]
            }
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS_PAYMENT') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_PAYMENT').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',POS_GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }            
                 
            this.ds.get('POS_PAYMENT').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('POS_PAYMENT').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.POS_GUID,tmpPrm.POS_GUID,0]

            await this.ds.get('POS_PAYMENT').refresh();
            
            resolve(this.ds.get('POS_PAYMENT'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posPluCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            TYPE : 0,
            TYPE_NAME : '',
            NAME : '',
            LINK : '00000000-0000-0000-0000-000000000000',
            LINK_CODE : '',
            LINK_NAME : '',
            LOCATION : 0,
            GROUP_INDEX : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PLU');            
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[PLU_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CUSER = @CUSER) OR (@CUSER = '')) AND 
                    ((TYPE = @TYPE) OR (@TYPE = -1)) ORDER BY LOCATION ASC`,
            param : ['GUID:string|50','CUSER:string|25','TYPE:int'],
            local : 
            {
                type : "select",
                query : `SELECT * FROM PLU_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND ((CUSER = ?) OR (? = '')) AND 
                        ((TYPE = ?) OR (? = -1)) ORDER BY LOCATION ASC;`,
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " +
                    "@NAME = @PNAME, " +
                    "@LINK = @PLINK, " +
                    "@QUANTITY = @PQUANTITY, " +
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PQUANTITY:float','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','QUANTITY','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO PLU (GUID, CUSER, TYPE, NAME, LINK,QUANTITY = ?, LOCATION, GROUP_INDEX) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TYPE : {map:'TYPE'},
                        NAME : {map:'NAME'},
                        LINK : {map:'LINK'},
                        QUANTITY : {map:'QUANTITY'},
                        LOCATION : {map:'LOCATION'},
                        GROUP_INDEX : {map:'GROUP_INDEX'}
                    }
                ]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " +
                    "@NAME = @PNAME, " +
                    "@LINK = @PLINK, " +
                    "@QUANTITY = @PQUANTITY, " +
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PQUANTITY:float','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','QUANTITY','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "update",
                query : `UPDATE PLU SET CUSER = ?, TYPE = ?, NAME = ?, LINK = ?,QUANTITY = ?, LOCATION = ?, GROUP_INDEX = ? WHERE GUID = ?;`,
                values : 
                [{
                    CUSER : {map:'CUSER'},
                    TYPE : {map:'TYPE'},
                    NAME : {map:'NAME'},
                    LINK : {map:'LINK'},
                    QUANTITY : {map:'QUANTITY'},
                    LOCATION : {map:'LOCATION'},
                    GROUP_INDEX : {map:'GROUP_INDEX'},
                    GUID : {map:'GUID'}
                }],
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@TYPE = @PTYPE ", 
            param : ['PCUSER:string|25','PGUID:string|50','PTYPE:int'],
            dataprm : ['CUSER','GUID','TYPE'],
            local : 
            {
                type : "delete",
                query : "DELETE FROM PLU WHERE CUSER = ? AND GUID = ? AND TYPE = ?;",
                values : 
                [{
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'},
                    TYPE : {map:'TYPE'}
                }]
            }
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('PLU') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('PLU').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',CUSER:'',TYPE:-1}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',CUSER:'',TYPE:-1}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CUSER = typeof arguments[0].CUSER == 'undefined' ? '' : arguments[0].CUSER;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
            }

            this.ds.get('PLU').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('PLU').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.CUSER,tmpPrm.CUSER,tmpPrm.TYPE,tmpPrm.TYPE]
            
            await this.ds.get('PLU').refresh();
            resolve(this.ds.get('PLU'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posExtraCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            TAG : '',
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            LINE_GUID : '00000000-0000-0000-0000-000000000000',
            DATA : '',
            APP_VERSION : this.core.appInfo.version,
            DESCRIPTION : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_EXTRA');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_EXTRA_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                query : "SELECT * FROM POS_EXTRA_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000'));",
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TAG = @PTAG, " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_GUID = @PLINE_GUID, " +
                    "@DATA =@PDATA, " +
                    "@APP_VERSION = @PAPP_VERSION, " +
                    "@DESCRIPTION = @PDESCRIPTION ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|50','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_GUID','DATA','APP_VERSION','DESCRIPTION'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_EXTRA_VW_01 (GUID, CUSER, TAG, POS_GUID, LINE_GUID, DATA, APP_VERSION, DESCRIPTION) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TAG : {map:'TAG'},
                        POS_GUID : {map:'POS_GUID'},
                        LINE_GUID : {map:'LINE_GUID'},
                        DATA : {map:'DATA'},
                        APP_VERSION : {map:'APP_VERSION'},
                        DESCRIPTION : {map:'DESCRIPTION'}
                    }
                ]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TAG = @PTAG, " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_GUID = @PLINE_GUID, " +
                    "@DATA =@PDATA, " +
                    "@APP_VERSION = @PAPP_VERSION, " +
                    "@DESCRIPTION = @PDESCRIPTION ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|50','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_GUID','DATA','APP_VERSION','DESCRIPTION'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_EXTRA_VW_01 SET CUSER = ?, TAG = ?, POS_GUID = ?, LINE_GUID = ?, DATA = ?, APP_VERSION = ?, DESCRIPTION = ? WHERE GUID = ?;`,
                values : 
                [{
                    CUSER : {map:'CUSER'},
                    TAG : {map:'TAG'},
                    POS_GUID : {map:'POS_GUID'},
                    LINE_GUID : {map:'LINE_GUID'},
                    DATA : {map:'DATA'},
                    APP_VERSION : {map:'APP_VERSION'},
                    DESCRIPTION : {map:'DESCRIPTION'},
                    GUID : {map:'GUID'}
                }]
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID " , 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            {
                type : "delete",
                query : "DELETE FROM POS_EXTRA_VW_01 WHERE CUSER = ? AND GUID = ?;",
                values : 
                [{
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'}
                }]
            }
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS_EXTRA') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_EXTRA').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',POS_GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_EXTRA').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('POS_EXTRA').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.POS_GUID,tmpPrm.POS_GUID]

            await this.ds.get('POS_EXTRA').refresh();
            
            resolve(this.ds.get('POS_EXTRA'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posDeviceCls
{
    constructor()
    {
        if(core.instance.util.isElectron())
        {
            this.escpos = global.require('escpos');
            this.escpos.Serial = global.require('escpos-serialport');
            this.escpos.Screen = global.require('escpos-screen');
            this.escpos.USB = global.require('escpos-usb');
            this.path = global.require('path')
            this.serialport = global.require('serialport');
            this.net = global.require('net')
        }

        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : '',
            LDATE : moment(new Date()).format("YYYY-MM-DD"),
            LUSER : this.core.auth.data.CODE,
            LUSER_NAME : '',
            CODE : '',
            NAME : '',
            LCD_PORT: '',
            SCALE_PORT : '',
            PAY_CARD_PORT : '',
            PRINT_DESING : '',
            SCANNER_PORT : '',
            PRINTER_PORT : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_NAME : 'GENERAL',
            MACID : '',
        }
        this.listeners = Object();
        this.payPort = null;
        this.scannerPort = null;
        this.version = "v.1.0.1"

        this._initDs();
    }
    //#region  "EVENT"
    on(pEvt, pCallback) 
    {
        if (!this.listeners.hasOwnProperty(pEvt))
            this.listeners[pEvt] = Array();
            this.listeners[pEvt].push(pCallback); 
    }
    emit(pEvt, pParams)
    {
        if (pEvt in this.listeners) 
        {
            let callbacks = this.listeners[pEvt];
            for (var x in callbacks)
            {
                callbacks[x](pParams);
            }
        } 
    }
    //#endregion
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_DEVICE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_DEVICE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25'],
            local : 
            {
                type : "select",
                query : "SELECT * FROM POS_DEVICE_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND ((CODE = ?) OR (? = ''));",
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@LCD_PORT = @PLCD_PORT, " +
                    "@SCALE_PORT = @PSCALE_PORT, " +
                    "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
                    "@PRINT_DESING = @PPRINT_DESING, " +
                    "@SCANNER_PORT = @PSCANNER_PORT, " +
                    "@PRINTER_PORT = @PPRINTER_PORT, " +
                    "@MACID = @PMACID, " + 
                    "@DEPOT = @PDEPOT " ,
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50',
                    'PPRINT_DESING:string|50','PSCANNER_PORT:string|50','PPRINTER_PORT:string|50','PMACID:string|250','PDEPOT:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING','SCANNER_PORT','PRINTER_PORT','MACID','DEPOT_GUID'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_DEVICE_VW_01 (GUID, CDATE, CUSER, LDATE, LUSER, CODE, NAME, LCD_PORT, SCALE_PORT, PAY_CARD_PORT, SCANNER_PORT, PRINTER_PORT, PRINT_DESING, MACID, DEPOT)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                values : [{GUID : {map:'GUID'},CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        LUSER : {map:'LUSER'},CODE : {map:'CODE'},NAME : {map:'NAME'},LCD_PORT : {map:'LCD_PORT'},SCALE_PORT : {map:'SCALE_PORT'},PAY_CARD_PORT : {map:'PAY_CARD_PORT'},
                        SCANNER_PORT : {map:'SCANNER_PORT'},PRINTER_PORT : {map:'PRINTER_PORT'},PRINT_DESING : {map:'PRINT_DESING'},MACID : {map:'MACID'},DEPOT : {map:'DEPOT_GUID'}}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@LCD_PORT = @PLCD_PORT, " +
                    "@SCALE_PORT = @PSCALE_PORT, " +
                    "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
                    "@PRINT_DESING = @PPRINT_DESING, " +
                    "@SCANNER_PORT = @PSCANNER_PORT, " +
                    "@PRINTER_PORT = @PPRINTER_PORT, " +
                    "@MACID = @PMACID, " +
                    "@DEPOT = @PDEPOT " ,
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50','PPRINT_DESING:string|50',
                    'PSCANNER_PORT:string|50','PPRINTER_PORT:string|50','PMACID:string|250','PDEPOT:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING','SCANNER_PORT','PRINTER_PORT','MACID','DEPOT_GUID'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_DEVICE_VW_01 
                        SET CDATE = ?, CUSER = ?, LDATE = ?, LUSER = ?, CODE = ?, NAME = ?, LCD_PORT = ?, SCALE_PORT = ?, PAY_CARD_PORT = ?, SCANNER_PORT = ?, PRINTER_PORT = ?, PRINT_DESING = ?, MACID = ?, DEPOT = ? WHERE GUID = ?;`,
                values : [{CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),CUSER : {map:'CUSER'},LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),LUSER : {map:'LUSER'},
                        CODE : {map:'CODE'},NAME : {map:'NAME'},LCD_PORT : {map:'LCD_PORT'},SCALE_PORT : {map:'SCALE_PORT'},PAY_CARD_PORT : {map:'PAY_CARD_PORT'},SCANNER_PORT : {map:'SCANNER_PORT'},
                        PRINTER_PORT : {map:'PRINTER_PORT'},PRINT_DESING : {map:'PRINT_DESING'},MACID : {map:'MACID'},DEPOT : {map:'DEPOT_GUID'},GUID : {map:'GUID'}}]
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS_DEVICE') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_DEVICE').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ.
        return new Promise(async resolve => 
        {
            let tmpPrm = 
            {
                GUID : '00000000-0000-0000-0000-000000000000',
                CODE : '',
                MACID : ''
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
                tmpPrm.MACID = typeof arguments[0].MACID == 'undefined' ? '' : arguments[0].MACID;
            }

            this.ds.get('POS_DEVICE').selectCmd.value = Object.values(tmpPrm)
            this.ds.get('POS_DEVICE').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.CODE,tmpPrm.CODE]

            await this.ds.get('POS_DEVICE').refresh();
            resolve(this.ds.get('POS_DEVICE'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
    detectPort()
    {
        return new Promise(async(resolve) =>
        {
            if(!core.instance.util.isElectron())
            {
                resolve({isElectron:false})
                return
            }
    
            let tmpPorts = await this.serialport.list();
    
            if(this.dt().length > 0)
            {
                let tmpLcdCheck = this.dt()[0].LCD_PORT == "" ? true : typeof tmpPorts.find(e => e.path == this.dt()[0].LCD_PORT) == 'undefined' ? false : true
                let tmpPayCheck = this.dt()[0].PAY_CARD_PORT == "" ? true : this.dt()[0].PAY_CARD_PORT.indexOf('COM') > -1 && typeof tmpPorts.find(e => e.path == this.dt()[0].PAY_CARD_PORT) == 'undefined' ? false : true
                let tmpScaleCheck = this.dt()[0].SCALE_PORT == "" ? true : typeof tmpPorts.find(e => e.path == this.dt()[0].SCALE_PORT) == 'undefined' ? false : true
                let tmpScanCheck = this.dt()[0].SCANNER_PORT == "" ? true : typeof tmpPorts.find(e => e.path == this.dt()[0].SCANNER_PORT) == 'undefined' ? false : true
                
                resolve({isElectron:true,isData:true,isLcdPort:tmpLcdCheck,isPayPort:tmpPayCheck,isScalePort:tmpScaleCheck,isScanPort:tmpScanCheck})
            }
            else
            {
                resolve({isElectron:true,isData:false})
            }
        })
    }
    caseOpen()
    {
        return new Promise((resolve) =>
        {
            try
            {
                if(!core.instance.util.isElectron())
                {
                    resolve()
                    return
                }
                let device = undefined;
                if(this.dt()[0].PRINTER_PORT != '' && this.dt()[0].PRINTER_PORT != 'USB')
                {
                    device = new this.escpos.Serial(this.dt()[0].PRINTER_PORT,{baudRate: 38400,stopBits:1,dataBits:8, autoOpen: false})
                }
                else if(this.dt()[0].PRINTER_PORT == 'USB')
                {
                    device = new this.escpos.USB();
                }
                
                let options = { encoding: "GB18030" /* default */ }
                let printer = new this.escpos.Printer(device, options);
                
                device.open(async function(error)
                {
                    printer.cashdraw(2);
                    printer.close();
                    await core.instance.util.waitUntil(500)
                    resolve()
                })
            }
            catch(err)
            {
                resolve()
            }
        });
    }
    async cardPayment(pAmount,pType) //pType = (0 => İade) 
    {
        let tmpSerialPort = null
        if(!core.instance.util.isElectron())
        {
            return
        }
        else
        {
            tmpSerialPort = global.require('serialport');
        }

        if(this.dt()[0].PAY_CARD_PORT.indexOf('COM') == -1)
        {
            return new Promise(async (resolve) =>
            {
                let isOpened = false
                const client = new this.net.Socket();
                client.connect(this.dt()[0].PAY_CARD_PORT.split(':')[1], this.dt()[0].PAY_CARD_PORT.split(':')[0], () => 
                {
                    client.write('01' + ('0000000' + (pAmount * 100).toFixed(0)).substr(-8) + "01" + (typeof pType != 'undefined' && pType == 0 ? '1' : '0'));
    
                    client.on('data', (data) => 
                    {
                        isOpened = true
                        resolve({tag:"response",msg:JSON.stringify({transaction_result:data.toString().substring(2,3)})});
                    });
    
                    client.on('close', () => 
                    {
                        if(!isOpened)
                        {
                            resolve({tag:"net_error"});
                        }
                    });
                });
            })
        }
        else
        {
            let ack = false;
            let payMethod = "card";
            
            if(this.payPort != null && this.payPort.isOpen)
            {
                await this.core.util.waitUntil(2000)
            }
            
            let generate_lrc = function(real_msg_with_etx)
            {
                let lrc = 0,text = real_msg_with_etx.split('');
                
                for (let i in text)
                {
                    if(typeof text[i].charCodeAt != 'undefined')
                    {
                        lrc ^= text[i].charCodeAt(0);
                    }
                }
    
                console.log('lrc => ', lrc);
                return lrc;
            }
            let checkSum = (pCode,pData) =>
            {
                for (let i = 0; i < pData.length; i++) 
                {
                    if(String.fromCharCode(pData[i]) == String.fromCharCode(pCode))
                    {
                        return true
                    }
                }
                return false
            }
            return new Promise(async (resolve) =>
            {
                await this.core.util.waitUntil(100);
                this.core.util.writeLog("signal : 1")
                if(this.payPort == null || !this.payPort.isOpen)
                {
                    this.payPort = new tmpSerialPort(this.dt().length > 0 ? this.dt()[0].PAY_CARD_PORT : "",{baudRate: 9600,dataBits: 7,parity:'odd',parser: new this.serialport.parsers.Readline()});
                }
                this.core.util.writeLog("signal : 2")
                this.payPort.write(String.fromCharCode(5)); //ENQ
    
                this.payPort.on('data',async(data) =>
                {
                    this.core.util.writeLog("signal : 3")
                    this.core.util.writeLog("full data : " + data.toString())                
    
                    if((!ack && String.fromCharCode(6) == String.fromCharCode(data[0])) || String.fromCharCode(21) == String.fromCharCode(data[0]))
                    {   
                        await this.core.util.waitUntil(100);
                        this.core.util.writeLog("signal : 4")
                        let tmpData = 
                        {
                            'pos_number': '01',
                            'amount_msg': ('0000000' + (pAmount * 100).toFixed(0)).substr(-8),
                            'answer_flag': '0',
                            'payment_mode': payMethod  == 'check' ? 'C' : '1',  
                            'transaction_type': typeof pType != 'undefined' && pType == 0 ? '1' : '0',
                            'currency_numeric': 978, 
                            'private': '          ',
                            'delay': 'A010',
                            'auto': 'B010'
                        };
                        
                        let msg = Object.keys(tmpData).map( k => tmpData[k] ).join('');
                        if (msg.length > 34) 
                        {
                            await this.payPort.close();
                            resolve({tag:"response",msg:"error"});                 
                            console.log('ERR. : failed data > 34 characters.', msg);
                            return
                        }
                        let real_msg_with_etx = msg.toString().concat(String.fromCharCode(3));//ETX
                        
                        let lrc = generate_lrc(real_msg_with_etx);
                        //STX + msg + lrc
                        let tpe_msg = (String.fromCharCode(2)).concat(real_msg_with_etx).concat(String.fromCharCode(lrc));
                        this.payPort.write(tpe_msg)
                        ack = true
                        
                        this.core.util.writeLog("send data : " + tpe_msg)
                    }
                    else if(ack && String.fromCharCode(6) == String.fromCharCode(data[0]))
                    {
                        await this.core.util.waitUntil(100);
                        this.core.util.writeLog("send eot")
                        this.payPort.write(String.fromCharCode(4))
                    }
                    else if(String.fromCharCode(5) == String.fromCharCode(data[0]))
                    {
                        await this.core.util.waitUntil(100);
                        this.core.util.writeLog("send ack")
                        this.payPort.write(String.fromCharCode(6))
                    }                
                    else if(data.length >= 25)
                    {
                        await this.core.util.waitUntil(100);
                        let str = "";
                        if(String.fromCharCode(data[0]) == String.fromCharCode(2))
                        {
                            str = data.toString().substr(1, data.toString().length-3);    
                        }
                        else
                        {
                            str = data.toString().substr(0, data.toString().length-3);
                        }
                        
                        let response = 
                        {
                            'pos_number'        : str.substr(0, 2),
                            'transaction_result': str.charAt(2),
                            'amount_msg'        : str.substr(3, 8),
                            'payment_mode'      : str.charAt(11),
                            'currency_numeric'  : str.substr(12, 3),
                            'private'           : str.substr(15, 11)
                        };
                        this.core.util.writeLog("response : " + JSON.stringify(response))
                        // setTimeout(async() => 
                        // {
                        //     if(this.payPort.isOpen)
                        //     {
                        //         await this.payPort.close(); 
                        //     }
                        // }, 3000);
                        
                        resolve({tag:"response",msg:JSON.stringify(response)});   
                    }
                    else if(checkSum(4,data))
                    {
                        await this.core.util.waitUntil(100);
                        this.core.util.writeLog("signal : 8")
                        if(this.payPort.isOpen)
                        {
                            this.core.util.writeLog("signal : 9")
                            await this.payPort.close(); 
                        }
                    }
                })
            });
        }
    }
    escPrinter(pData)
    {    
        return new Promise(async resolve => 
        {
            if(!core.instance.util.isElectron())
            {
                resolve()
                return
            }

            let device = undefined;
            if(this.dt()[0].PRINTER_PORT != '' && this.dt()[0].PRINTER_PORT != 'USB')
            {
                device = new this.escpos.Serial(this.dt()[0].PRINTER_PORT,{baudRate: 38400,stopBits:1,dataBits:8, autoOpen: false})
            }
            else if(this.dt()[0].PRINTER_PORT == 'USB')
            {
                device = new this.escpos.USB();
            }

            let options = { encoding: "GB18030" /* default */ }
            let printer = new this.escpos.Printer(device, options);
    
            let imgLoad = (imgPath) => 
            {
                return new Promise((mresolve) =>
                {
                    this.escpos.Image.load(imgPath, function(image)
                    {
                        mresolve(image)
                    });
                });
            }
            
            device.open(async function(error)
            {   
                let tmpArr = [];
                for (let i = 0; i < pData.length; i++) 
                {
                    let tmpObj = pData[i]
                    if(typeof pData[i] == 'function')
                    {
                        tmpObj = pData[i]()
                    }
                    if(Array.isArray(tmpObj))
                    {
                        tmpArr.push(...tmpObj)
                    }
                    else if(typeof tmpObj == 'object')
                    {
                        tmpArr.push(tmpObj)
                    }
                }
                
                for (let i = 0; i < tmpArr.length; i++) 
                {
                    if(typeof tmpArr[i].barcode != 'undefined')
                    {
                        printer.align(tmpArr[i].align).barcode(tmpArr[i].barcode,'CODE39',tmpArr[i].options);                    
                    }
                    else if(typeof tmpArr[i].logo != 'undefined')
                    {
                        let image = await imgLoad(tmpArr[i].logo);
                        printer.align(tmpArr[i].align)
                        .image(image, 's8')
                        .then(() => 
                        { 
                            //printer.cut().close(); 
                        });
                    }
                    else
                    {                   
                        printer.size(0,0);
                        printer.font(tmpArr[i].font);
                        printer.align(tmpArr[i].align);
    
                        if(typeof tmpArr[i].style != 'undefined')
                        {
                            printer.style(tmpArr[i].style);
                        }
                        else
                        {
                            printer.style("normal");
                        }
                        
                        if(typeof tmpArr[i].size != 'undefined')
                        {
                            printer.size(tmpArr[i].size[0],tmpArr[i].size[1]);
                        }
                        printer.text(tmpArr[i].data,'857');
                    }                
                }                      
                
                printer.cut().close(function()
                {
                    resolve();
                });
            });  
        });
    }
    scanner()
    {
        if(!core.instance.util.isElectron())
        {
            return
        }
        if(this.scannerPort == null || !this.scannerPort.isOpen)
        {
            this.scannerPort = new this.serialport(this.dt().length > 0 ? this.dt()[0].SCANNER_PORT : "")    
        }
        else
        {
            return
        }
        
        let tmpSerialCount = 0;
        let tmpBarcode = "";

        this.scannerPort.on('data',(data) =>
        {
            if(data.toString("utf8").substring(0,1) == 'F' || data.toString("utf8").substring(0,1) == 'A')
            {
                tmpSerialCount = 0
            }
            tmpSerialCount++;

            tmpBarcode = tmpBarcode + data.toString("utf8")

            if(tmpSerialCount == 2)
            {
                if(tmpBarcode.length == 11)
                {
                    tmpBarcode = tmpBarcode.substring(2,10)
                }
                else
                {
                    tmpBarcode = tmpBarcode.substring(1,14)
                }
                
                this.emit('scanner',tmpBarcode);
                
                tmpSerialCount = 0;
                tmpBarcode = "";            
            }
        })
    }
    pdfPrint(pData,pMail)
    {
        return new Promise(async resolve => 
        {
            let tmpArr = [];
            for (let i = 0; i < pData.length; i++) 
            {
                let tmpObj = pData[i]
                if(typeof pData[i] == 'function')
                {
                    tmpObj = pData[i]()
                }
                if(Array.isArray(tmpObj))
                {
                    tmpArr.push(...tmpObj)
                }
                else if(typeof tmpObj == 'object')
                {
                    tmpArr.push(tmpObj)
                }
            }
            
            let tmpY = 5
            let docPdf = new jsPDF('p','mm',[103,tmpArr.length * 10])
            for (let i = 0; i < tmpArr.length; i++) 
            {
                if(typeof tmpArr[i].barcode != 'undefined')
                {
                    docPdf.barcode(tmpArr[i].barcode, 
                    {
                        fontSize: 25,
                        textColor: "#000000",
                        x: 26,
                        y: tmpY+2,
                        options: {align:"center"}
                    })
                    tmpY += 7
                }
                else if(typeof tmpArr[i].logo != 'undefined')
                {
                    let img = new Image()
                    img.src = tmpArr[i].logo
                    docPdf.addImage(img, 'png', 15, tmpY, undefined, undefined)
                    tmpY += 20
                }
                else
                {
                    let  tmpAlign = '' 
                    let tmpX = 0
                    let tmpCharSpace = 0

                    if(tmpArr[i].align == 'ct')
                    {
                        tmpAlign = 'center'
                        tmpX = docPdf.internal.pageSize.getWidth() / 2
                    }
                    else if(tmpArr[i].align == 'lt')
                    {
                        tmpAlign = 'left'
                        tmpX = 3
                    }
                    else  if(tmpArr[i].align == 'rt')
                    {
                        tmpAlign = 'right'
                        tmpX = docPdf.internal.pageSize.getWidth() - 3
                    }

                    let tmpStyle = 'normal'
                    if(tmpArr[i].style == 'bu')
                    {
                        docPdf.line(tmpX,tmpY,tmpX + 103,tmpY)
                    }
                    else if(tmpArr[i].style == 'b')
                    {
                        tmpStyle = 'bold'
                    }

                    let tmpFontSize = 12
                    if(tmpArr[i].font == 'a')
                    {
                        tmpFontSize = 12
                    }
                    else if(tmpArr[i].font == 'b')
                    {
                        tmpFontSize = 9
                    }                    

                    if(typeof tmpArr[i].size != 'undefined' && Array.isArray(tmpArr[i].size))
                    {
                        if(tmpArr[i].size[0] == 1 && tmpArr[i].size[1] == 1)
                        {
                            tmpFontSize = 20
                        }
                        else if(tmpArr[i].size[0] == 1 && tmpArr[i].size[1] == 0)
                        {
                            tmpFontSize = 12
                        }
                    }

                    if(typeof tmpArr[i].pdf != 'undefined')
                    {
                        if(typeof tmpArr[i].pdf.fontSize != 'undefined')
                        {
                            tmpFontSize = tmpArr[i].pdf.fontSize
                        }
                        if(typeof tmpArr[i].pdf.charSpace != 'undefined')
                        {
                            tmpCharSpace = tmpArr[i].pdf.charSpace
                        }                        
                    }

                    docPdf.setFont('helvetica',tmpStyle)
                    docPdf.setFontSize(tmpFontSize)

                    if(typeof tmpArr[i].pdf != 'undefined' && typeof tmpArr[i].pdf.grid != 'undefined')
                    {
                        for (let x = 0; x < tmpArr[i].pdf.grid.length; x++) 
                        {
                            let tmpGrid = tmpArr[i].pdf.grid[x]
                            let tmpGrdData = tmpArr[i].data.toString().substring(tmpGrid.charS,tmpGrid.charE)
                            
                            if(typeof tmpGrid.align != 'undefined')
                            {
                                tmpAlign = tmpGrid.align
                            }
                            else
                            {
                                if(tmpArr[i].align == 'ct')
                                {
                                    tmpAlign = 'center'
                                }
                                else if(tmpArr[i].align == 'lt')
                                {
                                    tmpAlign = 'left'
                                }
                                else if(tmpArr[i].align == 'rt')
                                {
                                    tmpAlign = 'right'
                                }
                            }
                            docPdf.text(tmpGrdData,tmpGrid.x,tmpY,{align: tmpAlign,charSpace:tmpCharSpace})
                        }
                    }
                    else
                    {
                        if(typeof tmpArr[i].data != 'undefined')
                        {
                            docPdf.text(tmpArr[i].data,tmpX,tmpY,{align: tmpAlign,charSpace:tmpCharSpace})
                        }
                    }

                    tmpY += 8
                }
            }           

            let tmpText = "Bonjour Cher Client, \n" + 
            " \n "+
           "Merci pour votre achat dans notre magasin. \n" +
           "Ci-joint votre ticket de caisse. \n" +
           "Ceci est un e-mail automatique,veuillez ne pas y répondre! \n"+
           "Pour toute information, vous pouvez nous joindre sur les coordonnées indiquées sur votre ticket de caisse. \n"+
           " \n"+
           " \n"+
           " \n"+
           " \n"+
           "Cordialment \n"+
           "P&P Supermarche & Boucherie \n" + 
           " \n"+
           " \n"+ 
           "Ce message est confidentiel. Toute publication, utilisation ou diffusion,même partielle, doit être autorisée préalablement. Si vous n'êtes pas destinataire de ce message, merci d'en avertir immédiatement l'expéditeur et de procéder à sa destruction. \n" +
           " \n"+
           " \n"+
           "This message is confidential. Any unauthorised disclosure, use or dissemination, either whole or partial, is prohibited. If you are not the intended recipient of the message, please notify the sender immediatly and delete the message. Thank you. "
            let tmpHtml = ''
            let tmpAttach = btoa(docPdf.output())
            let tmpMailData = {html:tmpHtml,subject:"Votre Ticket De Caisse",sendMail:pMail,attachName:"ticket de vente.pdf",attachData:tmpAttach,text:tmpText}
            this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
            {
                console.log(pResult1)
            });

            //docPdf.save('test.pdf')
            resolve()
        });
    }
}
export class posPromoCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            APP_TYPE : 0,
            APP_AMOUNT : 0,
            PROMO_GUID : '00000000-0000-0000-0000-000000000000',
            PROMO_CODE : '',
            PROMO_NAME : '',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            START_DATE : moment(new Date()).format("YYYY-MM-DD"),
            FINISH_DATE : moment(new Date()).format("YYYY-MM-DD"),
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            POS_SALE_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            PRICE : 0,
            QUANTITY : 0, 
            AMOUNT : 0, 
            FAMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            TOTAL : 0,
            PROMO_TYPE : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_PROMO');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_PROMO_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND " +
                    "((PROMO = @PROMO) OR (@PROMO = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50','PROMO:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                query : `SELECT * FROM POS_PROMO_VW_01 WHERE ((GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND 
                        ((PROMO = ?) OR (? = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = ?) OR (? = '00000000-0000-0000-0000-000000000000'));`,
                values : []
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PROMO_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@APP_TYPE = @PAPP_TYPE, " +
                    "@APP_AMOUNT = @PAPP_AMOUNT, " +
                    "@PROMO = @PPROMO, " +
                    "@POS = @PPOS, " +                      
                    "@POS_SALE = @PPOS_SALE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PAPP_TYPE:string|25','PAPP_AMOUNT:float','PPROMO:string|50','PPOS:string|50','PPOS_SALE:string|50'],
            dataprm : ['GUID','CUSER','APP_TYPE','APP_AMOUNT','PROMO_GUID','POS_GUID','POS_SALE_GUID'],
            local : 
            {
                type : "insert",
                query : `INSERT INTO POS_PROMO_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, APP_TYPE, APP_AMOUNT, PROMO_GUID, POS_GUID, POS_SALE_GUID) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                LUSER_NAME : {map:'LUSER_NAME'},APP_TYPE : {map:'APP_TYPE'},APP_AMOUNT : {map:'APP_AMOUNT'},PROMO_GUID : {map:'PROMO_GUID'},POS_GUID : {map:'POS_GUID'},POS_SALE_GUID : {map:'POS_SALE_GUID'}}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PROMO_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@APP_TYPE = @PAPP_TYPE, " +
                    "@APP_AMOUNT = @PAPP_AMOUNT, " +
                    "@PROMO = @PPROMO, " +
                    "@POS = @PPOS, " +                      
                    "@POS_SALE = @PPOS_SALE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PAPP_TYPE:string|25','PAPP_AMOUNT:float','PPROMO:string|50','PPOS:string|50','PPOS_SALE:string|50'],
            dataprm : ['GUID','CUSER','APP_TYPE','APP_AMOUNT','PROMO_GUID','POS_GUID','POS_SALE_GUID'],
            local : 
            {
                type : "update",
                query : `UPDATE POS_PROMO_VW_01 SET GUID = ?, CDATE = ?, CUSER = ?, CUSER_NAME = ?, LDATE = ?, LUSER = ?, LUSER_NAME = ?, APP_TYPE = ?, APP_AMOUNT = ?, PROMO_GUID = ?, POS_GUID = ?, POS_SALE_GUID = ?;`,
                values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                         LUSER_NAME : {map:'LUSER_NAME'},APP_TYPE : {map:'APP_TYPE'},APP_AMOUNT : {map:'APP_AMOUNT'},PROMO_GUID : {map:'PROMO_GUID'},POS_GUID : {map:'POS_GUID'},POS_SALE_GUID : {map:'POS_SALE_GUID'}}]
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PROMO_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            [{
                type : "update",
                query : "UPDATE POS_PROMO_VW_01 SET DELETED = 1 WHERE GUID = ?;",
                values : [{DELETED:true,GUID : {map:'GUID'}}]
            }]
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('POS_PROMO') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_PROMO').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.PROMO = typeof arguments[0].PROMO == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].PROMO;
                tmpPrm.POS = typeof arguments[0].POS == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS;
            }

            this.ds.get('POS_PROMO').selectCmd.value = Object.values(tmpPrm);
            this.ds.get('POS_PROMO').selectCmd.local.values = [tmpPrm.GUID,tmpPrm.GUID,tmpPrm.PROMO,tmpPrm.PROMO,tmpPrm.POS,tmpPrm.POS]
              
            await this.ds.get('POS_PROMO').refresh();

            resolve(this.ds.get('POS_PROMO'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posEnddayCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CDATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSER_NAME : '',
            CASH : 0,
            CREDIT : 0,
            CHECK : 0,
            TICKET: 0,
            ADVANCE : 0,
            SAFE: '00000000-0000-0000-0000-000000000000',
            SAFE_NAME : '',
            SAFE_CODE : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ENDDAY_DATE');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM ENDDAY_DATA_VW_01 WHERE ((GUID= @GUID) OR (@GUID =  '00000000-0000-0000-0000-000000000000')) ",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ENDDAY_DATA_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CDATE = @PCDATE, " + 
                    "@CASH =@PCASH, " +
                    "@CREDIT = @PCREDIT, " +
                    "@CHECK = @PCHECK , " +
                    "@TICKET = @PTICKET , " +
                    "@ADVANCE = @PADVANCE , " +
                    "@SAFE = @PSAFE ",
            param : ['PGUID:string|50','PCUSER:string|25','PCDATE:date','PCASH:string|25','PCREDIT:float','PCHECK:float','PTICKET:float','PADVANCE:float','PSAFE:string|50'],
            dataprm : ['GUID','CUSER','CDATE','CASH','CREDIT','CHECK','TICKET','ADVANCE','SAFE']
          
        } 

        this.ds.add(tmpDt);
    }
    //#endregion
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0]);
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('ENDDAY_DATE') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('ENDDAY_DATE').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            
            this.ds.get('ENDDAY_DATE').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('ENDDAY_DATE').refresh();

            resolve(this.ds.get('ENDDAY_DATE'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posUsbTSECls
{
    constructor()
    {
        this.ws = null;
        this.connected = false;
        this.serviceInfo = undefined;
        this.deviceInfo = undefined;
        this.deviceData = undefined;
        this.deviceStatus = undefined;
        this.deviceId = "";
        this.status = false;
        this.lastTransaction = undefined;
        this.listeners = Object();
    }
    //#region  "EVENT"
    on(pEvt, pCallback) 
    {
        if (!this.listeners.hasOwnProperty(pEvt))
            this.listeners[pEvt] = Array();
            this.listeners[pEvt].push(pCallback); 
    }
    emit(pEvt, pParams)
    {
        if (pEvt in this.listeners) 
        {
            let callbacks = this.listeners[pEvt];
            for (var x in callbacks)
            {
                callbacks[x](pParams);
            }
        } 
    }
    //#endregion
    init()
    {
        this.ws = new WebSocket("ws://127.0.0.1:10001")
        this.ioEvents()
    }
    ioEvents()
    {
        this.ws.onopen = async()=>
        {
            this.connected = true
            this.serviceInfo = await this.command('{"Command":"GetServiceInfo"}')
            this.deviceInfo = await this.command('{"Command":"GetDeviceInfo"}')
            this.deviceData = await this.command('{"Command":"GetDeviceData","Name":"SerialNumber"}')
            this.deviceStatus = await this.command('{"Command":"GetDeviceStatus"}')
            
            if(typeof this.deviceStatus != 'undefined' && typeof this.deviceInfo != 'undefined' && this.deviceStatus.Status == "ok" && this.deviceInfo.Status == "ok" && this.deviceStatus.MFC.FiscalMode)
            {
                this.status = true
                this.emit('status',this.status)
                console.log("TSE Connected")
            }
            else
            {
                this.status = false
                this.emit('status',this.status)
            }
        }
        this.ws.onerror = ()=>
        {
            this.connected = false
            this.serviceInfo = undefined;
            this.deviceInfo = undefined;
            this.deviceData = undefined;
            this.deviceStatus = undefined;
            this.status = false
            this.emit('status',this.status)
            console.log("TSE Connect Error")
        }
        this.ws.onclose = ()=>
        {
            this.connected = false
            this.serviceInfo = undefined;
            this.deviceInfo = undefined;
            this.deviceData = undefined;
            this.deviceStatus = undefined;
            this.status = false
            console.log("TSE Connect Closed")
            this.emit('status',this.status)
        }
    }
    async event(pObj)
    {
        if(pObj.Event == 'DeviceStatus')
        {
            if(pObj.DeviceStatus == 'idle')
            {
                this.deviceStatus = await this.command('{"Command":"GetDeviceStatus"}')
                if(typeof this.deviceStatus != 'undefined' && this.deviceStatus.Status == "ok" && this.deviceStatus.MFC.FiscalMode)
                {
                    this.status = true
                    this.emit('status',this.status)
                }
                else
                {
                    this.status = false
                    this.emit('status',this.status)
                }
            }
            else if(pObj.DeviceStatus == 'error')
            {
                this.status = false
                this.emit('status',this.status)
            }
        }    
    }
    command(pParam)
    {
        return new Promise(async resolve => 
        {
            if(!this.connected)
            {
                console.log("Process Command : Connection status failed")
                resolve()
                return
            }
            this.ws.send('\x02' + pParam + '\x03')
            this.ws.onmessage = async(e)=>
            {
                if(e.data != '')
                {
                    try
                    {
                        let tmpStr = e.data.toString().replace('\x02','').toString().replace('\x03','')
                        let tmpJson = JSON.parse(tmpStr)

                        if(typeof tmpJson.Event != 'undefined')
                        {
                            this.event(tmpJson)
                        }
                        else
                        {
                            if(tmpJson.Status == 'ok')
                            {
                                resolve(tmpJson)
                                return
                            }
                            else
                            {
                                console.log(tmpJson)
                                resolve();
                                return
                            }
                        }
                    } 
                    catch (e) 
                    {
                        console.log("Process Command : Could not be converted to object")
                        resolve();
                        return
                    }
                }
                else
                {
                    console.log("Process Command : Data value is empty")
                    resolve()
                    return
                }
            }
        })
    }
    transaction(pData)
    {
        this.lastTransaction = undefined;
        return new Promise(async resolve => 
        {
            if(this.status)
            {
                let tmpStartT = await this.command('{"Command":"StartTransaction","ClientID":"POS' + this.deviceId + '","Data64":"' + btoa(pData) + '","Password":"MTIzNDU="}')
                if(typeof tmpStartT.Status != 'undefined' && tmpStartT.Status == "ok")
                {
                    let tmpFinishT = await this.command('{"Command":"FinishTransaction","ClientID":"POS' + this.deviceId + '","TransactionNumber":' + tmpStartT.TransactionNumber + ',"Data64":"' + btoa(pData) + '","Password":"MTIzNDU="}')
                 
                    if(typeof tmpFinishT.Status != 'undefined' && tmpFinishT.Status == "ok")
                    {
                        this.lastTransaction = 
                        {
                            status:true,
                            fLogTime:tmpStartT.LogTime,
                            sLogTime:tmpFinishT.LogTime,
                            signature:tmpFinishT.Signature,
                            signatureCounter:tmpFinishT.SignatureCounter,
                            transactionNumber:tmpStartT.TransactionNumber,
                            serialNumber:tmpStartT.SerialNumber
                        }

                        resolve(this.lastTransaction)
                    }
                    else
                    {
                        this.lastTransaction = {status:false}
                        resolve(this.lastTransaction)
                    }
                }
                else
                {
                    this.lastTransaction = {status:false}
                    resolve(this.lastTransaction)
                }
            }
            else
            {
                this.lastTransaction = {status:false}
                resolve(this.lastTransaction)
            }
        });
    }
}