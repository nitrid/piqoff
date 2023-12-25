import { core,dataset,datatable } from "../core.js";
import moment from 'moment';
import React from "react";
import ReactDOM from 'react-dom';
import NdPopUp from "../react/devex/popup.js";
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,Summary,TotalItem} from '../react/devex/grid.js';
import NdButton from "../react/devex/button.js";
import NbDateRange from '../react/bootstrap/daterange.js';
import NdCheckBox from '../react/devex/checkbox.js';

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
            TRANSPORT_TYPE : '',
            PRICE_LIST_NO : 1,
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
        this.isSaved = false
        this.docItems = new docItemsCls();
        this.docCustomer = new docCustomerCls();
        this.checkCls = new checkCls();
        this.docOrders = new docOrdersCls();
        this.docOffers = new docOffersCls();
        this.docDemand = new docDemandCls();
        this._initDs();
    }
    // #region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC')
        tmpDt.selectCmd =
        {
            query : "SELECT * FROM DOC_VW_01 WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) AND" +
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
                    "@AMOUNT = @PAMOUNT, " +
                    "@DISCOUNT = @PDISCOUNT, " +
                    "@DOC_DISCOUNT_1 = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT_2 = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT_3 = @PDOC_DISCOUNT_3, " +
                    "@INTERFEL = @PINTERFEL, " +
                    "@VAT = @PVAT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION = @PDESCRIPTION, " +
                    "@ADDRESS = @PADDRESS, " +
                    "@TRANSPORT_TYPE = @PTRANSPORT_TYPE, " +
                    "@PRICE_LIST_NO = @PPRICE_LIST_NO, " +
                    "@LOCKED = @PLOCKED, " +
                    "@CERTIFICATE = @PCERTIFICATE, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_NO:string|50','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                    'POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PINTERFEL:float','PVAT:float','PTOTAL:float',
                    'PDESCRIPTION:string|500','PADDRESS:int','PTRANSPORT_TYPE:string|25','PPRICE_LIST_NO:int','PLOCKED:int','PCERTIFICATE:string|250','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','DOC_DISCOUNT_1','DOC_DISCOUNT_2',
                      'DOC_DISCOUNT_3','INTERFEL','VAT','TOTAL','DESCRIPTION','ADDRESS','TRANSPORT_TYPE','PRICE_LIST_NO','LOCKED','CERTIFICATE','SIGNATURE','SIGNATURE_SUM']
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
                    "@TRANSPORT_TYPE  = @PTRANSPORT_TYPE, " +
                    "@PRICE_LIST_NO = @PPRICE_LIST_NO, " +
                    "@LOCKED  = @PLOCKED, " +
                    "@SIGNATURE = @PSIGNATURE, " +
                    "@SIGNATURE_SUM = @PSIGNATURE_SUM ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_NO:string|50','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                    'POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PINTERFEL:float','PVAT:float','PTOTAL:float',
                    'PDESCRIPTION:string|500','PADDRESS:int','PTRANSPORT_TYPE:string|25','PPRICE_LIST_NO:int','PLOCKED:int','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3',
                      'INTERFEL','VAT','TOTAL','DESCRIPTION','ADDRESS','TRANSPORT_TYPE','PRICE_LIST_NO','LOCKED','SIGNATURE','SIGNATURE_SUM']
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
        this.ds.add(this.docDemand.dt('DOC_DEMAND'))

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
            this.isSaved = false
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR ÖRN: {CODE:''}
        return new Promise(async resolve =>
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0,TYPE:-1,DOC_TYPE: -1,PAYMENT_DOC_GUID:'00000000-0000-0000-0000-000000000000',DOC_DATE:'19700101',SUB_FACTOR:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.DOC_TYPE = typeof arguments[0].DOC_TYPE == 'undefined' ? -1 : arguments[0].DOC_TYPE;
                tmpPrm.PAYMENT_DOC_GUID = typeof arguments[0].PAYMENT_DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].PAYMENT_DOC_GUID;
                tmpPrm.DOC_DATE = typeof arguments[0].DOC_DATE == 'undefined' ? '19700101' : arguments[0].DOC_DATE;
                tmpPrm.SUB_FACTOR = typeof arguments[0].SUB_FACTOR == 'undefined' ? '' : arguments[0].SUB_FACTOR;
            }
            this.ds.get('DOC').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC').refresh()

            if(this.ds.get('DOC').length > 0)
            {  
                this.isSaved = true
                await this.docItems.load({DOC_GUID:this.ds.get('DOC')[0].GUID,SUB_FACTOR:tmpPrm.SUB_FACTOR})
                await this.docCustomer.load({GUID:this.ds.get('DOC')[0].GUID})
                await this.docOrders.load({DOC_GUID:this.ds.get('DOC')[0].GUID,SUB_FACTOR:tmpPrm.SUB_FACTOR})
                await this.docOffers.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
                await this.docDemand.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
            }
            resolve(this.ds.get('DOC'))
        });
    }
    save()
    {     
        return new Promise(async resolve => 
        {
            this.isSaved = true
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
            TOTAL_COST : 0,
            MARGIN : 0,
            DEPOT_QUANTITY : 0,
            ITEM_BARCODE : '',
            ORIGIN : '',
        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_ITEMS');
        tmpDt.selectCmd = 
        {  
            query : "SELECT *, " +
            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ITEMS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_FACTOR, " +
            "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ITEMS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),'') AS SUB_SYMBOL, " +
            "QUANTITY / ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ITEMS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_QUANTITY, " + 
            "PRICE * ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ITEMS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_PRICE " + 
            "FROM [dbo].[DOC_ITEMS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND (((DOC_GUID = @DOC_GUID) OR (INVOICE_DOC_GUID = @DOC_GUID AND " + 
            "DOC_TYPE IN(40,42))) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000'))  AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['GUID:string|50','DOC_GUID:string|50','REF:string|25','REF_NO:int','SUB_FACTOR:string|50']
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
                    "@VAT_RATE = @PVAT_RATE, " +
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
                    "@PROFORMA_DOC_GUID  = @PPROFORMA_DOC_GUID, "  +
                    "@ORIGINS = @PORIGINS " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PITEM_TYPE:int','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PPRICE:float','PDISCOUNT1:float','PDISCOUNT2:float','PDISCOUNT3:float',
                        'PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float','PVAT_RATE:float',
                        'PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_LINE_GUID:string|50','PINVOICE_DOC_GUID:string|50','PORDER_LINE_GUID:string|50','PORDER_DOC_GUID:string|50',
                        'POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50','PPROFORMA_LINE_GUID:string|50','PPROFORMA_DOC_GUID:string|50','PORIGINS:string|10'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','ITEM_TYPE','LINE_NO','UNIT','QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','INVOICE_LINE_GUID','INVOICE_DOC_GUID','ORDER_LINE_GUID','ORDER_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID','PROFORMA_LINE_GUID','PROFORMA_DOC_GUID','ORIGIN']
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
                    "@VAT_RATE = @PVAT_RATE, " +
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
                    "@PROFORMA_DOC_GUID  = @PPROFORMA_DOC_GUID, "  +
                    "@ORIGINS = @PORIGINS " ,
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|500','PITEM_TYPE:int','PLINE_NO:int','PUNIT:string|50','PQUANTITY:float','PPRICE:float','PDISCOUNT1:float','PDISCOUNT2:float','PDISCOUNT3:float',
                        'PDOC_DISCOUNT1:float','PDOC_DISCOUNT2:float','PDOC_DISCOUNT3:float','PVAT:float','PVAT_RATE:float',
                        'PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_LINE_GUID:string|50','PINVOICE_DOC_GUID:string|50','PORDER_LINE_GUID:string|50','PORDER_DOC_GUID:string|50',
                        'POFFER_LINE_GUID:string|50','POFFER_DOC_GUID:string|50','PPROFORMA_LINE_GUID:string|50','PPROFORMA_DOC_GUID:string|50','PORIGINS:string|10'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','ITEM_TYPE','LINE_NO','UNIT','QUANTITY','PRICE',
                        'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','INVOICE_LINE_GUID','INVOICE_DOC_GUID','ORDER_LINE_GUID','ORDER_DOC_GUID','OFFER_LINE_GUID','OFFER_DOC_GUID','PROFORMA_LINE_GUID','PROFORMA_DOC_GUID','ORIGIN']
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
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0,SUB_FACTOR:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.SUB_FACTOR = typeof arguments[0].SUB_FACTOR == 'undefined' ? '' : arguments[0].SUB_FACTOR;
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
        this.empty = 
        {
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
                    "((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0)) AND ((INVOICE_GUID = @INVOICE_GUID) OR (@INVOICE_GUID = '00000000-0000-0000-0000-000000000000'))",
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
            query : "SELECT *,  " +
            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ORDERS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_FACTOR,  " +
            "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ORDERS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),'') AS SUB_SYMBOL,  " +
            "QUANTITY / ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ORDERS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_QUANTITY, " + 
            "PRICE * ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = DOC_ORDERS_VW_01.ITEM AND ITEM_UNIT_VW_01.ID = @SUB_FACTOR),1) AS SUB_PRICE " + 
            " FROM [dbo].[DOC_ORDERS_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int','SUB_FACTOR:string|10']
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
        this.ds.get('DOC_ORDERS').noColumnEdit = ['MARGIN','CUSER']
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
            let tmpPrm = {DOC_GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0,SUB_FACTOR:''}
            if(arguments.length > 0)
            {
                tmpPrm.DOC_GUID = typeof arguments[0].DOC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DOC_GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.SUB_FACTOR = typeof arguments[0].SUB_FACTOR == 'undefined' ? '' : arguments[0].SUB_FACTOR;
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
export class transportTypeCls
{
    constructor()
    {
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
            TYPE_NO : '',
            TYPE_NAME : '',           
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('TRANSPORT_TYPE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[TRANSPORT_TYPE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((TYPE_NO = @CODE) OR (@TYPE_NO = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_TRANSPORT_TYPE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE_NO = @PTYPE_NO, " + 
                    "@TYPE_NAME = @PTYPE_NAME " , 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE_NO:string|50','PTYPE_NAME:string|50'],
            dataprm : ['GUID','CUSER','TYPE_NO','TYPE_NAME']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_TRANSPORT_TYPE_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@TYPE_NO = @PTYPE_NO, " + 
            "@TYPE_NAME = @PTYPE_NAME " , 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE_NO:string|50','PTYPE_NAME:string|50'],
            dataprm : ['GUID','CUSER','TYPE_NO','TYPE_NAME']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_TRANSPORT_TYPE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
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
        if(typeof this.dt('TRANSPORT_TYPE') == 'undefined')
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
        this.dt('TRANSPORT_TYPE').push(tmp)
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
                TYPE_NO : ''
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.TYPE_NO = typeof arguments[0].TYPE_NO == 'undefined' ? '' : arguments[0].TYPE_NO;
            }
            this.ds.get('TRANSPORT_TYPE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('TRANSPORT_TYPE').refresh();
            resolve(this.ds.get('TRANSPORT_TYPE'));    
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
export class deptCreditMatchingCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            PAID_DOC : '00000000-0000-0000-0000-000000000000',
            PAYING_DOC : '00000000-0000-0000-0000-000000000000',
            PAYING_DAY : 0,
            PAID_AMOUNT : 0,
            PAYING_AMOUNT : 0
        }
        this.lang = undefined;
        this.type = 0; //0 = ÖDEME, 1 = TAHSİLAT
        this.popUpList = new datatable()
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DEPT_CREDIT_MATCHING');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM DEPT_CREDIT_MATCHING WHERE PAID_DOC = @PAID_DOC OR PAYING_DOC = @PAYING_DOC",
            param : ['PAID_DOC:string|50','PAYING_DOC:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPT_CREDIT_MATCHING_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@TYPE = @PTYPE, " +
                    "@DATE = @PDATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@PAID_DOC = @PPAID_DOC, " +
                    "@PAYING_DOC = @PPAYING_DOC, " +
                    "@PAYING_DAY = @PPAYING_DAY, " +
                    "@PAID_AMOUNT = @PPAID_AMOUNT, " +
                    "@PAYING_AMOUNT = @PPAYING_AMOUNT ",
            param : ['PGUID:string|50','PTYPE:int','PDATE:date','PCUSTOMER:string|50','PPAID_DOC:string|50','PPAYING_DOC:string|50','PPAYING_DAY:int','PPAID_AMOUNT:float','PPAYING_AMOUNT:float'],
            dataprm : ['GUID','TYPE','DATE','CUSTOMER','PAID_DOC','PAYING_DOC','PAYING_DAY','PAID_AMOUNT','PAYING_AMOUNT']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPT_CREDIT_MATCHING_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@TYPE = @PTYPE, " +
                    "@DATE = @PDATE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@PAID_DOC = @PPAID_DOC, " +
                    "@PAYING_DOC = @PPAYING_DOC, " +
                    "@PAYING_DAY = @PPAYING_DAY, " +
                    "@PAID_AMOUNT = @PPAID_AMOUNT, " +
                    "@PAYING_AMOUNT = @PPAYING_AMOUNT ",
            param : ['PGUID:string|50','PTYPE:int','PPAID_DOC:string|50','PPAYING_DOC:string|50','PPAYING_DAY:int','PPAID_AMOUNT:float','PPAYING_AMOUNT:float'],
            dataprm : ['GUID','TYPE','DATE','CUSTOMER','PAID_DOC','PAYING_DOC','PAYING_DAY','PAID_AMOUNT','PAYING_AMOUNT']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_DEPT_CREDIT_MATCHING_DELETE] " + 
                    "@GUID = @PGUID, " + 
                    "@PAID_DOC = @PPAID_DOC, " + 
                    "@PAYING_DOC = @PPAYING_DOC ",
            param : ['PGUID:string|50','PPAID_DOC:string|50','PPAYING_DOC:string|50'],
            dataprm : ['GUID','PAID_DOC','PAYING_DOC']
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
        if(typeof this.dt('DEPT_CREDIT_MATCHING') == 'undefined')
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
        this.dt('DEPT_CREDIT_MATCHING').push(tmp)
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
            let tmpPrm = {PAID_DOC:'00000000-0000-0000-0000-000000000000',PAYING_DOC:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.PAID_DOC = typeof arguments[0].PAID_DOC == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].PAID_DOC;
                tmpPrm.PAYING_DOC = typeof arguments[0].PAYING_DOC == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].PAYING_DOC;
            }

            this.ds.get('DEPT_CREDIT_MATCHING').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DEPT_CREDIT_MATCHING').refresh();

            resolve(this.ds.get('DEPT_CREDIT_MATCHING'));
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
    matching(pData)
    {
        return new Promise(async resolve =>
        {
            let tmpPaidDt = pData.where({TYPE : 1}).orderBy('LDATE',"asc")
            let tmpPayingDt = pData.where({TYPE : 0}).orderBy('LDATE',"asc")
            
            for (let i = 0; i < tmpPaidDt.length; i++) 
            {
                for (let x = 0; x < tmpPayingDt.length; x++) 
                {
                    if(tmpPaidDt[i].REMAINDER != 0 && tmpPayingDt[x].REMAINDER != 0)
                    {
                        let tmpPaying = Number((Number(tmpPaidDt[i].REMAINDER).round(2) + Number(tmpPayingDt[x].REMAINDER).round(2)) >= 0 ? tmpPayingDt[x].REMAINDER * -1 : tmpPaidDt[i].REMAINDER).round(2)                    

                        let tmpDeptCredit = {...this.empty}
                        tmpDeptCredit.TYPE = tmpPaidDt[i].TYPE
                        tmpDeptCredit.DATE = tmpPaidDt[i].DOC_DATE
                        tmpDeptCredit.CUSTOMER = tmpPaidDt[i].CUSTOMER_GUID
                        tmpDeptCredit.PAID_DOC = tmpPaidDt[i].DOC
                        tmpDeptCredit.PAID_DOC = tmpPaidDt[i].DOC
                        tmpDeptCredit.PAYING_DOC = tmpPayingDt[x].DOC
                        tmpDeptCredit.PAYING_DAY = 0
                        tmpDeptCredit.PAID_AMOUNT = Number(tmpPaidDt[i].REMAINDER).round(2)
                        tmpDeptCredit.PAYING_AMOUNT = tmpPaying
                        this.addEmpty(tmpDeptCredit)

                        tmpDeptCredit = {...this.empty}
                        tmpDeptCredit.TYPE = tmpPayingDt[x].TYPE
                        tmpDeptCredit.DATE = tmpPayingDt[x].DOC_DATE
                        tmpDeptCredit.CUSTOMER = tmpPayingDt[x].CUSTOMER_GUID
                        tmpDeptCredit.PAID_DOC = tmpPayingDt[x].DOC
                        tmpDeptCredit.PAYING_DOC = tmpPaidDt[i].DOC
                        tmpDeptCredit.PAYING_DAY = 0
                        tmpDeptCredit.PAID_AMOUNT = Number(tmpPayingDt[x].REMAINDER * -1).round(2)
                        tmpDeptCredit.PAYING_AMOUNT = tmpPaying
                        this.addEmpty(tmpDeptCredit)

                        tmpPaidDt[i].REMAINDER = Number(tmpPaidDt[i].REMAINDER - tmpPaying).round(2)
                        tmpPayingDt[x].REMAINDER = Number(tmpPayingDt[x].REMAINDER + tmpPaying).round(2)
                        // tmpPaidDt[i].PAYING_AMOUNT = Number(tmpPaidDt[i].PAYING_AMOUNT + tmpPaying).round(2)
                        // tmpPayingDt[x].PAYING_AMOUNT = Number(tmpPayingDt[x].PAYING_AMOUNT + tmpPaying).round(2)
                    }
                }
            }
            resolve()
        })
    }
    async showPopUp(pCustomer)
    {
        this.popUpList = new datatable()
        let tmpJsx = 
        (
            <div>
                <NdPopUp parent={this} id={"popDeptCreditList"} 
                visible={false}
                showCloseButton={true}
                showTitle={true}
                title={this.lang.t("popDeptCreditList.title")}
                container={"#root"} 
                width={'90%'}
                height={'90%'}
                position={{of:'#root'}}
                >
                    <div className="row p-2">
                        <div className="col-10">
                            <NbDateRange id={"dtPopDeptCreditListDate"} parent={this} startDate={moment().add(-15, 'days')} endDate={moment().add(15, 'days')}
                            onApply={()=>
                            {
                                gridRefresh()
                            }}/>
                        </div>
                        <div className="col-2">
                            <NdCheckBox id="chkPopDeptCreditList" parent={this} text={this.lang.t("popDeptCreditList.chkPopDeptCreditList")} value={false}
                            onValueChanged={(e)=>
                            {
                                gridRefresh()
                            }}
                            ></NdCheckBox>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col-12">
                            <NdButton parent={this} id={"btnPopDeptCreditListSelection"} text={this.lang.t('popDeptCreditList.btnPopDeptCreditListSelection')} width={'100%'} type={"default"}
                            onClick={()=>
                            {
                                if(this.grdPopDeptCreditList.getSelectedData().length > 0)
                                {
                                    this.popDeptCreditList.hide()
                                    this.popDeptCreditList.onClick(this.grdPopDeptCreditList.getSelectedData())
                                }
                            }}
                            />
                        </div>
                    </div>
                    <div className="row p-2" style={{height:"85%"}}>
                        <div className="col-12">
                            <NdGrid parent={this} id={"grdPopDeptCreditList"} 
                            height={'100%'} 
                            width={'100%'}
                            showBorders={true}
                            selection={{mode:"multiple"}}
                            onSelectionChanged={(e)=>
                            {
                                e.component.refresh(true);
                            }}
                            onRowRemoved={async(e)=>
                            {
                                let tmpDeptCreditMatchingObj = new deptCreditMatchingCls()
                                await tmpDeptCreditMatchingObj.load({PAID_DOC:e.data.DOC,PAYING_DOC:e.data.DOC})
                                tmpDeptCreditMatchingObj.dt().removeAll()
                                await tmpDeptCreditMatchingObj.dt().delete()
                                gridRefresh()
                            }}
                            >
                                <Editing mode="row" allowDeleting={true} useIcons={true}/>
                                <Column dataField="DOC_REF" caption={this.lang.t("popDeptCreditList.clmRef")} width={80}/>
                                <Column dataField="DOC_REF_NO" caption={this.lang.t("popDeptCreditList.clmRefNo")} width={100}/>
                                <Column dataField="TYPE_NAME" caption={this.lang.t("popDeptCreditList.clmTypeName")} width={100}/>
                                <Column dataField="CUSTOMER_NAME" caption={this.lang.t("popDeptCreditList.clmCustomer")} width={300}/>
                                <Column dataField="DOC_DATE" caption={this.lang.t("popDeptCreditList.clmDate")} width={100} dataType={"date"} defaultSortOrder="asc"/>
                                <Column dataField="PAID_AMOUNT" caption={this.lang.t("popDeptCreditList.clmTotal")} width={100} />
                                <Column dataField="PAYING_AMOUNT" caption={this.lang.t("popDeptCreditList.clmClosed")} width={100} />
                                <Column dataField="REMAINDER" caption={this.lang.t("popDeptCreditList.clmBalance")} width={100} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                <Summary calculateCustomSummary={(options) =>
                                {
                                    if (options.name === 'SelectedRowsSummary') 
                                    {
                                        if (options.summaryProcess === 'start') 
                                        {
                                            options.totalValue = 0;
                                        } 
                                        else if (options.summaryProcess === 'calculate') 
                                        {
                                            if (options.component.isRowSelected(options.value)) 
                                            {
                                                options.totalValue += Number(options.value.REMAINDER).round(2);
                                            }
                                        }
                                    }
                                }}>
                                    <TotalItem name="SelectedRowsSummary" summaryType="custom" valueFormat={{ style: "currency", currency: "EUR",precision: 3}} displayFormat="Sum: {0}" showInColumn="REMAINDER" />
                                </Summary>
                            </NdGrid>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )

        if(typeof this.popDeptCreditList == 'undefined')
        {
            ReactDOM.render(tmpJsx,document.body.appendChild(document.createElement('div',{id:'popDeptCreditMatching'})));
        }

        let gridRefresh = async()=>
        {
            let tmpQuery = 
            {
                query : "SELECT *, " + 
                        "CASE WHEN TYPE = 1 THEN BALANCE WHEN TYPE = 0 THEN BALANCE * -1 END AS REMAINDER, " +
                        "(SELECT TOP 1 VALUE FROM DB_LANGUAGE WHERE TAG = (SELECT [dbo].[FN_DOC_TYPE_NAME](TYPE,DOC_TYPE,REBATE)) AND LANG = @LANG) AS TYPE_NAME " + 
                        "FROM DEPT_CREDIT_MATCHING_VW_02 WHERE CUSTOMER_GUID = @CUSTOMER_GUID AND TYPE IN (0,1) AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE {0} " + 
                        "ORDER BY DOC_DATE ASC,LDATE ASC",
                param : ['CUSTOMER_GUID:string|50','LANG:string|50','FIRST_DATE:date','LAST_DATE:date'],
                value : [pCustomer,this.lang.language.toUpperCase(),this.dtPopDeptCreditListDate.startDate,this.dtPopDeptCreditListDate.endDate]
            }
            
            if(this.chkPopDeptCreditList.value == false)
            {
                tmpQuery.query = tmpQuery.query.replace('{0}','AND BALANCE <> 0')
            }
            else
            {
                tmpQuery.query = tmpQuery.query.replace('{0}','')
            }

            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(tmpData.result.recordset.length > 0)
            {
                await this.grdPopDeptCreditList.dataRefresh({source:tmpData.result.recordset})
            }
            else
            {
                await this.grdPopDeptCreditList.dataRefresh({source:[]})
            }
        }
        
        gridRefresh()

        return new Promise(async resolve =>
        {
            this.popDeptCreditList.show()
            this.popDeptCreditList.onClick = async(data) =>
            {
                let tmpInvDt = new datatable()
                tmpInvDt.import(data)
                if(this.type == 0)
                {
                    if(tmpInvDt.sum('REMAINDER') < 0)
                    {
                        let tmpDeptCreditMatchingObj = new deptCreditMatchingCls()
                        await tmpDeptCreditMatchingObj.matching(tmpInvDt)
                        await tmpDeptCreditMatchingObj.save()
                        this.popUpList = tmpInvDt
                        resolve(tmpInvDt)
                    }
                    else
                    {
                        resolve(this.popUpList)
                    }
                }
                else
                {
                    if(tmpInvDt.sum('REMAINDER') > 0)
                    {
                        let tmpDeptCreditMatchingObj = new deptCreditMatchingCls()
                        await tmpDeptCreditMatchingObj.matching(tmpInvDt)
                        await tmpDeptCreditMatchingObj.save()
                        this.popUpList = tmpInvDt
                        resolve(tmpInvDt)
                    }
                    else
                    {
                        resolve(this.popUpList)
                    }
                }
            }
        })
    }
}
export class docDemandCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            TYPE : -1,
            DOC_TYPE : -1,
            REF : '',
            REF_NO : 0,
            PRICE_AGREED: 0,
            INVOICED_PRICE:0,
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
            DISCOUNT_RATE : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTAL : 0,
            TOTALHT : 0,
            DESCRIPTION : '',
            INVOICE_DOC_GUID : '00000000-0000-0000-0000-000000000000',
            INVOICE_LINE_GUID : '00000000-0000-0000-0000-000000000000',
            CONNECT_REF : '',
            CONNECT_DOC_DATE : '',
            VAT_RATE : 0 ,
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
        let tmpDt = new datatable('DOC_DEMAND');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_DEMAND_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_DEMAND_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@PRICE_AGREED = @PPRICE_AGREED, " +
                    "@INVOICED_PRICE = @PINVOICED_PRICE, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT1 = @PDISCOUNT_1, " +
                    "@DISCOUNT2 = @PDISCOUNT_2, " +
                    "@DISCOUNT3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT_3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_DOC_GUID = @PINVOICE_DOC_GUID, " +
                    "@INVOICE_LINE_GUID = @PINVOICE_LINE_GUID," +
                    "@DELETED  = @PDELETED ",
        param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PPRICE_AGREED:float','PINVOICED_PRICE:float','PDOC_DATE:date','PINPUT:string|50',
                    'POUTPUT:string|50','PITEM:string|50','PLINE_NO:int','PITEM_NAME:string|500','PUNIT:string|50','PQUANTITY:float','PPRICE:float',
                    'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_DOC_GUID:string|50',
                    'PINVOICE_LINE_GUID:string|50','PDELETED:int'],
        dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','PRICE_AGREED','INVOICED_PRICE','DOC_DATE','INPUT','OUTPUT','ITEM','LINE_NO','ITEM_NAME','UNIT','QUANTITY','PRICE',
                    'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','INVOICE_DOC_GUID','INVOICE_LINE_GUID','DELETED']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_DEMAND_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " + 
                    "@TYPE = @PTYPE, " +
                    "@DOC_TYPE = @PDOC_TYPE, " +
                    "@REBATE = @PREBATE, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@PRICE_AGREED = @PPRICE_AGREED, " +
                    "@INVOICED_PRICE = @PINVOICED_PRICE, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@ITEM  = @PITEM, " +
                    "@LINE_NO  = @PLINE_NO, " +
                    "@ITEM_NAME  = @PITEM_NAME, " +
                    "@UNIT  = @PUNIT, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT1 = @PDISCOUNT_1, " +
                    "@DISCOUNT2 = @PDISCOUNT_2, " +
                    "@DISCOUNT3 = @PDISCOUNT_3, " +
                    "@DOC_DISCOUNT1 = @PDOC_DISCOUNT_1, " +
                    "@DOC_DISCOUNT2 = @PDOC_DISCOUNT_2, " +
                    "@DOC_DISCOUNT3 = @PDOC_DISCOUNT_3, " +
                    "@VAT = @PVAT, " +
                    "@VAT_RATE = @PVAT_RATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_DOC_GUID = @PINVOICE_DOC_GUID, " +
                    "@INVOICE_LINE_GUID = @PINVOICE_LINE_GUID," +
                    "@DELETED  = @PDELETED ",
        param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PPRICE_AGREED:float','PINVOICED_PRICE:float','PDOC_DATE:date','PINPUT:string|50',
                    'POUTPUT:string|50','PITEM:string|50','PLINE_NO:int','PITEM_NAME:string|500','PUNIT:string|50','PQUANTITY:float','PPRICE:float',
                    'PDISCOUNT_1:float','PDISCOUNT_2:float','PDISCOUNT_3:float','PDOC_DISCOUNT_1:float','PDOC_DISCOUNT_2:float','PDOC_DISCOUNT_3:float','PVAT:float','PVAT_RATE:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_DOC_GUID:string|50',
                    'PINVOICE_LINE_GUID:string|50','PDELETED:int'],
        dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','PRICE_AGREED','INVOICED_PRICE','DOC_DATE','INPUT','OUTPUT','ITEM','LINE_NO','ITEM_NAME','UNIT','QUANTITY','PRICE',
                    'DISCOUNT_1','DISCOUNT_2','DISCOUNT_3','DOC_DISCOUNT_1','DOC_DISCOUNT_2','DOC_DISCOUNT_3','VAT','VAT_RATE','AMOUNT','TOTAL','DESCRIPTION','INVOICE_DOC_GUID','INVOICE_LINE_GUID','DELETED']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_DEMAND_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
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
        if(typeof this.dt('DOC_DEMAND') == 'undefined')
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
        this.dt('DOC_DEMAND').push(tmp,arguments[1])
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

            this.ds.get('DOC_DEMAND').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_DEMAND').refresh();

            resolve(this.ds.get('DOC_DEMAND'));
            
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