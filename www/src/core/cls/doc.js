import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class docCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            TYPE: -1,
            DOC_TYPE : -1,
            REBATE : 0,
            REF : '',
            REF_NO : 0,
            DOC_NO : '',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            SHIPMENT_DATE : moment(new Date()).format("YYYY-MM-DD"),
            INPUT : '',
            INPUT_CODE : '',
            INPUT_NAME : '',
            OUTPUT : '',
            OUTPUT_CODE : '',
            OUTPUT_NAME : '',
            AMOUNT : 0,
            DISCOUNT : 0,
            DOC_DISCOUNT : 0,
            DOC_DISCOUNT_1 : 0,
            DOC_DISCOUNT_2 : 0,
            DOC_DISCOUNT_3 : 0,
            INTERFEL : 0,
            VAT : 0,
            TOTAL : 0,
            TOTALHT : 0,
            SUBTOTAL : 0,
            DESCRIPTION : '',
            ADDRESS : 0,
            LOCKED : 0,
            MARGIN : '',
            PAYMENT_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            CERTIFICATE : this.core.appInfo.name + " version : " + this.core.appInfo.version,
            SIGNATURE : '',
            SIGNATURE_SUM : '',
            TYPE_NAME: '',
            TAX_NO : '',
            ZIPCODE : '',
        }

        this.docItems = new docItemsCls();
        this.docCustomer = new docCustomerCls();
        this.checkCls = new checkCls();
        this.docOrders = new docOrdersCls();
        this.docOffers = new docOffersCls();
        this._initDs();
    }
    // #region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC')
        tmpDt.selectCmd =
        {
            query : "SELECT * FROM DOC_VW_01 WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
            " ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) AND" +
            "((DOC_TYPE = @DOC_TYPE) OR (@DOC_TYPE = -1)) AND " +
            "((PAYMENT_DOC_GUID = @PAYMENT_DOC_GUID) OR (@PAYMENT_DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((DOC_DATE = @DOC_DATE) OR (@DOC_DATE ='19700101'))" ,
            param : ['GUID:string|50','REF:string|25','REF_NO:int','TYPE:int','DOC_TYPE:int','PAYMENT_DOC_GUID:string|50','DOC_DATE:date']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_NO = @PDOC_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " +
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@AMOUNT  = @PAMOUNT, " +
                    "@DISCOUNT  = @PDISCOUNT, " +
                    "@DOC_DISCOUNT_1  = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT_2  = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT_3  = @PDOC_DISCOUNT_3, " +
                    "@INTERFEL  = @PINTERFEL, " +
                    "@VAT  = @PVAT, " +
                    "@TOTAL  = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@ADDRESS  = @PADDRESS, " +
                    "@LOCKED  = @PLOCKED, " +
                    "@CERTIFICATE = @PCERTIFICATE, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_NO:string|50','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PINTERFEL:float','PVAT:float','PTOTAL:float','PDESCRIPTION:string|100','PADDRESS:int','PLOCKED:int','PCERTIFICATE:string|250',
                        'PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','INTERFEL','VAT','TOTAL','DESCRIPTION','ADDRESS',
                        'LOCKED','CERTIFICATE','SIGNATURE','SIGNATURE_SUM']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_NO = @PDOC_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " +
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@AMOUNT  = @PAMOUNT, " +
                    "@DISCOUNT  = @PDISCOUNT, " +
                    "@DOC_DISCOUNT_1  = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT_2  = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT_3  = @PDOC_DISCOUNT_3, " +
                    "@INTERFEL  = @PINTERFEL, " +
                    "@VAT  = @PVAT, " +
                    "@TOTAL  = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@ADDRESS  = @PADDRESS, " +
                    "@LOCKED  = @PLOCKED, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_NO:string|50','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PINTERFEL:float','PVAT:float','PTOTAL:float','PDESCRIPTION:string|100','PADDRESS:int','PLOCKED:int',
                        'PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','INTERFEL','VAT','TOTAL','DESCRIPTION','ADDRESS',
                        'LOCKED','SIGNATURE','SIGNATURE_SUM']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.docItems.dt('DOC_ITEMS'))
        this.ds.add(this.docCustomer.dt('DOC_CUSTOMER'))
        this.ds.add(this.checkCls.dt('CHECK'))
        this.ds.add(this.docOrders.dt('DOC_ORDERS'))
        this.ds.add(this.docOffers.dt('DOC_OFFERS'))

        this.ds.get('DOC').noColumnEdit = ['MARGIN']
        this.ds.get('DOC_ITEMS').noColumnEdit = ['MARGIN']
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
        if(typeof this.dt('DOC') == 'undefined')
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
        this.dt('DOC').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR ÖRN: {CODE:''}
        return new Promise(async resolve =>
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0,TYPE:-1,DOC_TYPE: -1,PAYMENT_DOC_GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.DOC_TYPE = typeof arguments[0].DOC_TYPE == 'undefined' ? -1 : arguments[0].DOC_TYPE;
                tmpPrm.PAYMENT_DOC_GUID = typeof arguments[0].PAYMENT_DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].PAYMENT_DOC_GUID;
                tmpPrm.DOC_DATE = typeof arguments[0].DOC_DATE == 'undefined' ? '19700101' : arguments[0].DOC_DATE;
            }
            this.ds.get('DOC').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC').refresh()

            if(this.ds.get('DOC').length > 0)
            {  
                await this.docItems.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
                await this.docCustomer.load({GUID:this.ds.get('DOC')[0].GUID})
                await this.docOrders.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
                await this.docOffers.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
            }
            resolve(this.ds.get('DOC'))
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
export class docItemsCls
{
    
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : -1,
            DOC_TYPE : -1,
            REBATE : 0,
            REF : '',
            REF_NO : 0,
            DOC_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            SHIPMENT_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            INPUT : '00000000-0000-0000-0000-000000000000',
            INPUT_CODE : '',
            INPUT_NAME : '',
            OUTPUT : '00000000-0000-0000-0000-000000000000',
            OUTPUT_CODE : '',
            OUTPUT_NAME : '',
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            ITEM_TYPE : 0,
            LINE_NO : 0,
            UNIT : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_FACTOR : 1,
            UNIT_SHORT : '',
            QUANTITY : 1,
            SUB_QUANTITY : 1,
            PRICE : 0,
            SUB_PRICE : 0,
            SUB_FACTOR : 1,
            SUB_SYMBOL : '',
            CUSTOMER_PRICE : 0,
            DIFF_PRICE : 0,
            DISCOUNT : 0,
            DISCOUNT_1 : 0,
            DISCOUNT_2 : 0,
            DISCOUNT_3 : 0,
            DOC_DISCOUNT : 0,
            DOC_DISCOUNT_1 : 0,
            DOC_DISCOUNT_2 : 0,
            DOC_DISCOUNT_3 : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTALHT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            ORIGIN: '',
            INVOICE_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            INVOICE_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            ORDER_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            ORDER_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            OFFER_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            OFFER_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            PROFORMA_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            PROFORMA_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            VAT_RATE : 0 ,
            OLD_VAT : 0,
            DISCOUNT_RATE : 0,
            CONNECT_REF : '',
            CONNECT_DOC_DATE : '',
            COST_PRICE : 0,
            MARGIN : 0,
            DEPOT_QUANTITY : 0,
            ITEM_BARCODE : '',
        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_ITEMS');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_ITEMS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND (((DOC_GUID = @DOC_GUID) OR (INVOICE_DOC_GUID = @DOC_GUID AND DOC_TYPE IN(40,42))) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000'))  AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['GUID:string|50','DOC_GUID:string|50','REF:string|25','REF_NO:int']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ITEMS_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " +
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@ITEM_TYPE  = @PITEM_TYPE, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT1 = @PDISCOUNT1, " +
                    "@DISCOUNT2 = @PDISCOUNT2, " +
                    "@DISCOUNT3 = @PDISCOUNT3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT3, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_LINE_GUID  = @PINVOICE_LINE_GUID, " +
                    "@INVOICE_DOC_GUID  = @PINVOICE_DOC_GUID, " +
                    "@ORDER_LINE_GUID  = @PORDER_LINE_GUID, " +
                    "@ORDER_DOC_GUID  = @PORDER_DOC_GUID, " +
                    "@OFFER_LINE_GUID  = @POFFER_LINE_GUID, " +
                    "@OFFER_DOC_GUID  = @POFFER_DOC_GUID, " +
                    "@PROFORMA_LINE_GUID  = @PPROFORMA_LINE_GUID, "  +
                    "@PROFORMA_DOC_GUID  = @PPROFORMA_DOC_GUID " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PITEM_TYPE:int','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PPRICE:float','PDISCOUNT1:float','PDISCOUNT2:float','PDISCOUNT3:float',
                        'PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float',
                        'PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_LINE_GUID:string|50','PINVOICE_DOC_GUID:string|50','PORDER_LINE_GUID:string|50','PORDER_DOC_GUID:string|50',
                        'POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50','PPROFORMA_LINE_GUID:string|50','PPROFORMA_DOC_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','ITEM_TYPE','LINE_NO','UNIT','QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','AMOUNT','TOTAL','DESCRIPTION','INVOICE_LINE_GUID','INVOICE_DOC_GUID','ORDER_LINE_GUID','ORDER_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID','PROFORMA_LINE_GUID','PROFORMA_DOC_GUID']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ITEMS_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@ITEM_TYPE  = @PITEM_TYPE, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT1 = @PDISCOUNT1, " +
                    "@DISCOUNT2 = @PDISCOUNT2, " +
                    "@DISCOUNT3 = @PDISCOUNT3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT3, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_LINE_GUID  = @PINVOICE_LINE_GUID, " +
                    "@INVOICE_DOC_GUID  = @PINVOICE_DOC_GUID, " +
                    "@ORDER_LINE_GUID  = @PORDER_LINE_GUID, " +
                    "@ORDER_DOC_GUID  = @PORDER_DOC_GUID, " +
                    "@OFFER_LINE_GUID  = @POFFER_LINE_GUID, " +
                    "@OFFER_DOC_GUID  = @POFFER_DOC_GUID, " +
                    "@PROFORMA_LINE_GUID  = @PPROFORMA_LINE_GUID, "  +
                    "@PROFORMA_DOC_GUID  = @PPROFORMA_DOC_GUID " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PITEM_TYPE:int','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PPRICE:float','PDISCOUNT1:float','PDISCOUNT2:float','PDISCOUNT3:float',
                        'PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float',
                        'PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_LINE_GUID:string|50','PINVOICE_DOC_GUID:string|50','PORDER_LINE_GUID:string|50','PORDER_DOC_GUID:string|50',
                        'POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50','PPROFORMA_LINE_GUID:string|50','PPROFORMA_DOC_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','ITEM_TYPE','LINE_NO','UNIT','QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','AMOUNT','TOTAL','DESCRIPTION','INVOICE_LINE_GUID','INVOICE_DOC_GUID','ORDER_LINE_GUID','ORDER_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID','PROFORMA_LINE_GUID','PROFORMA_DOC_GUID']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ITEMS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@DOC_GUID = @PDOC_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PDOC_GUID:string|50'],
            dataprm : ['CUSER','GUID','DOC_GUID']
        }

        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    async addEmpty()
    {
        if(typeof this.dt('DOC_ITEMS') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        if(typeof arguments[1] == 'undefined' || arguments[1] == true)
        {
            tmp.GUID = datatable.uuidv4()
        }
        this.dt('DOC_ITEMS').push(tmp,arguments[1])
        
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
            }

            this.ds.get('DOC_ITEMS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_ITEMS').refresh();

            resolve(this.ds.get('DOC_ITEMS'));
            
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
export class docCustomerCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            TYPE: 0,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            DOC_TYPE : 0,
            REBATE : 0,
            REF : '',
            REF_NO : 0,
            DOC_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            INPUT : '00000000-0000-0000-0000-000000000000',
            INPUT_CODE : '',
            INPUT_NAME : '',
            OUTPUT : '00000000-0000-0000-0000-000000000000',
            OUTPUT_CODE : '',
            OUTPUT_NAME : '',
            PAY_TYPE : -1,
            PAY_TYPE_NAME : '',
            AMOUNT : 0,
            DESCRIPTION : '',
            INVOICE_GUID : '00000000-0000-0000-0000-000000000000',
            INVOICE_REF : '',
            INVOICE_DATE : '',
            EXPIRY_DATE :  moment(new Date()).format("YYYY-MM-DD"),
            EXPIRY_FEE : 0,
            INPUT_BALANCE  : 0,
            OUTPUT_BALANCE  : 0,
            ROUND : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC_CUSTOMER');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_CUSTOMER_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((DOC_TYPE = @DOC_TYPE) OR (@DOC_TYPE = -1)) AND " +
            " ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0)) AND ((INVOICE_GUID = @INVOICE_GUID) OR (@INVOICE_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['DOC_GUID:string|50','DOC_TYPE:int','REF:string|25','REF_NO:int','INVOICE_GUID:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_CUSTOMER_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@PAY_TYPE = @PPAY_TYPE, " +
                    "@AMOUNT = @PAMOUNT, "+
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_GUID = @PINVOICE_GUID, "+
                    "@EXPIRY_DATE = @PEXPIRY_DATE, "+
                    "@EXPIRY_FEE = @PEXPIRY_FEE, " +
                    "@ROUND = @PROUND",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50','PEXPIRY_DATE:date','PEXPIRY_FEE:float','PROUND:float'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION','INVOICE_GUID','EXPIRY_DATE','EXPIRY_FEE','ROUND']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_CUSTOMER_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@PAY_TYPE = @PPAY_TYPE, " +
                    "@AMOUNT = @PAMOUNT, "+
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_GUID = @PINVOICE_GUID, "+
                    "@EXPIRY_DATE = @PEXPIRY_DATE, "+
                    "@EXPIRY_FEE = @PEXPIRY_FEE, " +
                    "@ROUND = @PROUND",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50','PEXPIRY_DATE:date','PEXPIRY_FEE:float','PROUND:float'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION','INVOICE_GUID','EXPIRY_DATE','EXPIRY_FEE','ROUND']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_DOC_CUSTOMER_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@DOC_GUID = @PDOC_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PDOC_GUID:string|50'],
            dataprm : ['CUSER','GUID','DOC_GUID']
        }

        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_CUSTOMER') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4()
        this.dt('DOC_CUSTOMER').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',DOC_TYPE:-1,REF:'',REF_NO:0,INVOICE_GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.DOC_TYPE = typeof arguments[0].DOC_TYPE == 'undefined' ? -1 : arguments[0].DOC_TYPE;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.INVOICE_GUID = typeof arguments[0].INVOICE_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].INVOICE_GUID;
            }

            this.ds.get('DOC_CUSTOMER').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_CUSTOMER').refresh();

            resolve(this.ds.get('DOC_CUSTOMER'));
            
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
export class checkCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            REF : '',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CHECK_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            AMOUNT : 0,
            SAFE : '00000000-0000-0000-0000-000000000000',
            BREAK : 0,
            BREAK_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CHECK');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[CHECK_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) ",
            param : ['DOC_GUID:string|50','REF:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CHECK_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@REF = @PREF, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CHECK_DATE = @PCHECK_DATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@SAFE = @PSAFE, "+
                    "@BREAK = @PBREAK, "+
                    "@BREAK_DATE  = @PBREAK_DATE ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PREF:string|25','PDOC_DATE:date','PCHECK_DATE:date','PCUSTOMER:string|50',
                        'PAMOUNT:float','PSAFE:string|50','PBREAK:string|50','PBREAK_DATE:date'],
            dataprm : ['GUID','CUSER','DOC_GUID','REF','DOC_DATE','CHECK_DATE','CUSTOMER','AMOUNT','SAFE','BREAK','BREAK_DATE']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CHECK_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@REF = @PREF, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CHECK_DATE = @PCHECK_DATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@SAFE = @PSAFE, "+
                    "@BREAK = @PBREAK, "+
                    "@BREAK_DATE  = @PBREAK_DATE ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PREF:string|25','PDOC_DATE:date','PCHECK_DATE:date','PCUSTOMER:string|50',
                        'PAMOUNT:float','PSAFE:string|50','PBREAK:string|50','PBREAK_DATE:date'],
            dataprm : ['GUID','CUSER','DOC_GUID','REF','DOC_DATE','CHECK_DATE','CUSTOMER','AMOUNT','SAFE','BREAK','BREAK_DATE']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_CHECK_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID " ,
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('CHECK') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4()
        this.dt('CHECK').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
            }

            this.ds.get('CHECK').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('CHECK').refresh();

            resolve(this.ds.get('CHECK'));
            
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
export class docOrdersCls
{
    
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : -1,
            DOC_TYPE : -1,
            REF : '',
            REF_NO : 0,
            DOC_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            INPUT : '00000000-0000-0000-0000-000000000000',
            INPUT_CODE : '',
            INPUT_NAME : '',
            OUTPUT : '00000000-0000-0000-0000-000000000000',
            OUTPUT_CODE : '',
            OUTPUT_NAME : '',
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            LINE_NO : 0,
            UNIT : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_FACTOR : 1,
            UNIT_SHORT : '',
            QUANTITY : 1,
            SUB_QUANTITY : 1,
            PRICE : 0,
            SUB_PRICE : 0,
            SUB_FACTOR : 1,
            SUB_SYMBOL : '',
            ORIGIN : '',
            COMP_QUANTITY : 0,
            CLOSED : 0,
            DISCOUNT : 0,
            DISCOUNT_1 : 0,
            DISCOUNT_2 : 0,
            DISCOUNT_3 : 0,
            DOC_DISCOUNT : 0,
            DOC_DISCOUNT_1 : 0,
            DOC_DISCOUNT_2 : 0,
            DOC_DISCOUNT_3 : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTALHT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            SHIPMENT_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            SHIPMENT_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            OFFER_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            OFFER_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            VAT_RATE : 0 ,
            DISCOUNT_RATE : 0,
            COST_PRICE : 0,
            MARGIN : 0,
            MULTICODE : '',
            ITEM_BARCODE : '',
            OFFER_REF : '',
        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_ORDERS');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_ORDERS_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ORDERS_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@CLOSED  = @PCLOSED, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT_1 = @PDISCOUNT_1, " +
                    "@DISCOUNT_2 = @PDISCOUNT_2, " +
                    "@DISCOUNT_3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@SHIPMENT_LINE_GUID  = @PSHIPMENT_LINE_GUID, " +
                    "@SHIPMENT_DOC_GUID  = @PSHIPMENT_DOC_GUID, " +
                    "@OFFER_LINE_GUID  = @POFFER_LINE_GUID, " +
                    "@OFFER_DOC_GUID  = @POFFER_DOC_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PCOMP_QUANTITY:float','PCLOSED:int','PPRICE:float',
                        'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PSHIPMENT_LINE_GUID:string|50','PSHIPMENT_DOC_GUID:string|50','POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','UNIT','QUANTITY','COMP_QUANTITY','CLOSED','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','SHIPMENT_LINE_GUID','SHIPMENT_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ORDERS_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@CLOSED  = @PCLOSED, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT_1 = @PDISCOUNT_1, " +
                    "@DISCOUNT_2 = @PDISCOUNT_2, " +
                    "@DISCOUNT_3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@SHIPMENT_LINE_GUID  = @PSHIPMENT_LINE_GUID, " +
                    "@SHIPMENT_DOC_GUID  = @PSHIPMENT_DOC_GUID, " +
                    "@OFFER_LINE_GUID  = @POFFER_LINE_GUID, " +
                    "@OFFER_DOC_GUID  = @POFFER_DOC_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PCOMP_QUANTITY:float','PCLOSED:int','PPRICE:float',
                        'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PSHIPMENT_LINE_GUID:string|50','PSHIPMENT_DOC_GUID:string|50','POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','UNIT','QUANTITY','COMP_QUANTITY','CLOSED','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','SHIPMENT_LINE_GUID','SHIPMENT_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_ORDERS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@DOC_GUID = @PDOC_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PDOC_GUID:string|50'],
            dataprm : ['CUSER','GUID','DOC_GUID']
        }

        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_ORDERS') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        if(typeof arguments[1] == 'undefined' || arguments[1] == true)
        {
            tmp.GUID = datatable.uuidv4()
        }
        this.dt('DOC_ORDERS').push(tmp,arguments[1])
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = {DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
            }

            this.ds.get('DOC_ORDERS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_ORDERS').refresh();

            resolve(this.ds.get('DOC_ORDERS'));
            
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            console.log(this.ds)
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class docOffersCls
{
    
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : -1,
            DOC_TYPE : -1,
            REF : '',
            REF_NO : 0,
            DOC_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            INPUT : '00000000-0000-0000-0000-000000000000',
            INPUT_CODE : '',
            INPUT_NAME : '',
            OUTPUT : '00000000-0000-0000-0000-000000000000',
            OUTPUT_CODE : '',
            OUTPUT_NAME : '',
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            LINE_NO : 0,
            UNIT : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_FACTOR : 1,
            UNIT_SHORT : '',
            QUANTITY : 1,
            COMP_QUANTITY : 0,
            PRICE : 0,
            DISCOUNT : 0,
            DISCOUNT_1 : 0,
            DISCOUNT_2 : 0,
            DISCOUNT_3 : 0,
            DOC_DISCOUNT : 0,
            DOC_DISCOUNT_1 : 0,
            DOC_DISCOUNT_2 : 0,
            DOC_DISCOUNT_3 : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            SHIPMENT_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            SHIPMENT_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            ORDER_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            ORDER_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            VAT_RATE : 0 ,
            DISCOUNT_RATE : 0,
            COST_PRICE : 0,
            MARGIN : 0,
            MULTICODE : '',
            ITEM_BARCODE : '',

        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_OFFERS');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_OFFERS_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_OFFERS_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT_1 = @PDISCOUNT_1, " +
                    "@DISCOUNT_2 = @PDISCOUNT_2, " +
                    "@DISCOUNT_3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT_3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PCOMP_QUANTITY:float','PPRICE:float',
                        'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','UNIT','QUANTITY','COMP_QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_OFFERS_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT_1 = @PDISCOUNT_1, " +
                    "@DISCOUNT_2 = @PDISCOUNT_2, " +
                    "@DISCOUNT_3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT_3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PCOMP_QUANTITY:float','PPRICE:float',
                        'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','UNIT','QUANTITY','COMP_QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_OFFERS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@DOC_GUID = @PDOC_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PDOC_GUID:string|50'],
            dataprm : ['CUSER','GUID','DOC_GUID']
        }

        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_OFFERS') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        if(typeof arguments[1] == 'undefined' || arguments[1] == true)
        {
            tmp.GUID = datatable.uuidv4()
        }
        this.dt('DOC_OFFERS').push(tmp,arguments[1])
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = {DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
            }

            this.ds.get('DOC_OFFERS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_OFFERS').refresh();

            resolve(this.ds.get('DOC_OFFERS'));
            
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
export class quickDescCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            DESCRIPTION : '00000000-0000-0000-0000-000000000000',
            PAGE : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('QUICK_DESCRIPTION');
      
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_QUICK_DESCRIPTION_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DESCRIPTION = @PDESCRIPTION, " + 
                    "@PAGE = @PPAGE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDESCRIPTION:string|500','PPAGE:string|25'],
            dataprm : ['GUID','CUSER','DESCRIPTION','PAGE']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_QUICK_DESCRIPTION_UPDATE] " +
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " +
            "@DESCRIPTION = @PDESCRIPTION, " + 
            "@PAGE = @PPAGE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDESCRIPTION:string|500','PPAGE:string|25'],
            dataprm : ['GUID','CUSER','DESCRIPTION','PAGE']
        }
        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('QUICK_DESCRIPTION') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4()
        this.dt('QUICK_DESCRIPTION').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
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
export class docExtraCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            TAG : '',
            DOC : '00000000-0000-0000-0000-000000000000',
            DESCRIPTION : '00000000-0000-0000-0000-000000000000',
            SIGNATURE : '',
            SIGNATURE_SUM : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC_EXTRA');
      
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_EXTRA_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TAG = @PTAG, " +
                    "@DOC = @PDOC, " +
                    "@DESCRIPTION = @PDESCRIPTION, " +
                    "@SIGNATURE = @PSIGNATURE, " + 
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PDOC:string|50','PDESCRIPTION:string|500','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','TAG','DOC','DESCRIPTION','SIGNATURE','SIGNATURE_SUM']
        }
        this.ds.add(tmpDt);
    }
    //#region
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_EXTRA') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4()
        this.dt('DOC_EXTRA').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
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