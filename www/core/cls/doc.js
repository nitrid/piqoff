import { core,dataset,datatable } from "../core.js";

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
            VAT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            LOCKED : 0,
            MARGIN : 0,
            PAYMENT_DOC_GUID : '00000000-0000-0000-0000-000000000000',
        }

        this.docItems = new docItemsCls();
        this.docCustomer = new docCustomerCls();
        this.checkCls = new checkCls();
        this.docOrders = new docOrdersCls();

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
            "((PAYMENT_DOC_GUID = @PAYMENT_DOC_GUID) OR (@PAYMENT_DOC_GUID = '00000000-0000-0000-0000-000000000000')) " ,
            param : ['GUID:string|50','REF:string|25','REF_NO:int','TYPE:int','DOC_TYPE:int','PAYMENT_DOC_GUID:string|50']
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
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " +
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@AMOUNT  = @PAMOUNT, " +
                    "@DISCOUNT  = @PDISCOUNT, " +
                    "@VAT  = @PVAT, " +
                    "@TOTAL  = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@LOCKED  = @PLOCKED ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PDESCRIPTION:string|100','PLOCKED:int'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','VAT','TOTAL','DESCRIPTION','LOCKED']
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
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@SHIPMENT_DATE = @PSHIPMENT_DATE, " +
                    "@INPUT = @PINPUT, " +
                    "@OUTPUT = @POUTPUT, " +
                    "@AMOUNT  = @PAMOUNT, " +
                    "@DISCOUNT  = @PDISCOUNT, " +
                    "@VAT  = @PVAT, " +
                    "@TOTAL  = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@LOCKED  = @PLOCKED ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date',
                    'PINPUT:string|50','POUTPUT:string|50','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PDESCRIPTION:string|100','PLOCKED:int'],
            dataprm : ['GUID','CUSER','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','AMOUNT','DISCOUNT','VAT','TOTAL','DESCRIPTION','LOCKED']
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
        //PARAMETRE OLARAK OBJE G??NDER??L??R YADA PARAMETRE BO?? ??SE T??M?? GET??R??L??R ??RN: {CODE:''}
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
            }
            this.ds.get('DOC').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC').refresh()

            if(this.ds.get('DOC').length > 0)
            {  
                await this.docItems.load({DOC_GUID:this.ds.get('DOC')[0].GUID,INVOICE_GUID:tmpPrm.INVOICE_GUID})
                await this.docCustomer.load({GUID:this.ds.get('DOC')[0].GUID})
                await this.docOrders.load({DOC_GUID:this.ds.get('DOC')[0].GUID})
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
            REBATE : -1,
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
            LINE_NO : 0,
            QUANTITY : 1,
            PRICE : 0,
            DISCOUNT : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            INVOICE_GUID : '00000000-0000-0000-0000-000000000000',
            VAT_RATE : 0 ,
            DISCOUNT_RATE : 0,
            CONNECT_REF : '',
            CONNECT_DOC_DATE : '',
            COST_PRICE : 0,
            MARGIN : 0,
        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_ITEMS');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_ITEMS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND (((DOC_GUID = @DOC_GUID) OR (INVOICE_GUID = @DOC_GUID)) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000'))  AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
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
                    "@LINE_NO  = @PLINE_NO, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT = @PDISCOUNT, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_GUID  = @PINVOICE_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','TOTAL','DESCRIPTION','INVOICE_GUID']
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
                    "@LINE_NO  = @PLINE_NO, " +
                    "@QUANTITY  = @PQUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT = @PDISCOUNT, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@INVOICE_GUID  = @PINVOICE_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','TOTAL','DESCRIPTION','INVOICE_GUID']
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
    addEmpty()
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
        //PARAMETRE OLARAK OBJE G??NDER??L??R YADA PARAMETRE BO?? ??SE T??M?? GET??R??L??R.
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
            INVOICE_GUID : '00000000-0000-0000-0000-000000000000'
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
                    "@INVOICE_GUID = @PINVOICE_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION','INVOICE_GUID']
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
                    "@INVOICE_GUID = @PINVOICE_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100','PINVOICE_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION','INVOICE_GUID']
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
        //PARAMETRE OLARAK OBJE G??NDER??L??R YADA PARAMETRE BO?? ??SE T??M?? GET??R??L??R.
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
        //PARAMETRE OLARAK OBJE G??NDER??L??R YADA PARAMETRE BO?? ??SE T??M?? GET??R??L??R.
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
            QUANTITY : 1,
            COMP_QUANTITY : 0,
            PRICE : 0,
            DISCOUNT : 0,
            VAT: 0,
            AMOUNT : 0,
            TOTAL : 0,
            DESCRIPTION : '',
            SHIPMENT_GUID : '00000000-0000-0000-0000-000000000000',
            VAT_RATE : 0 ,
            DISCOUNT_RATE : 0,
            COST_PRICE : 0,
            MARGIN : 0,
            MULTICODE : '',
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
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT = @PDISCOUNT, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@SHIPMENT_GUID  = @PSHIPMENT_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PCOMP_QUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PSHIPMENT_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','COMP_QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','TOTAL','DESCRIPTION','SHIPMENT_GUID']
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
                    "@QUANTITY  = @PQUANTITY, " +
                    "@COMP_QUANTITY  = @PCOMP_QUANTITY, " +
                    "@PRICE  = @PPRICE, " +
                    "@DISCOUNT = @PDISCOUNT, " +
                    "@VAT = @PVAT, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@DESCRIPTION  = @PDESCRIPTION, " +
                    "@SHIPMENT_GUID  = @PSHIPMENT_GUID ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PCOMP_QUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PTOTAL:float','PDESCRIPTION:string|100','PSHIPMENT_GUID:string|50'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','COMP_QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','TOTAL','DESCRIPTION','SHIPMENT_GUID']
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
        //PARAMETRE OLARAK OBJE G??NDER??L??R YADA PARAMETRE BO?? ??SE T??M?? GET??R??L??R.
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
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}