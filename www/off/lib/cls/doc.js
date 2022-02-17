import { core,dataset,datatable } from "../../../core/core.js";

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
            LOCKED : 0
        }

        this.docItems = new docItemsCls();
        this.docCustomer = new docCustomerCls();

        this._initDs();
    }
    // #region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC')
        tmpDt.selectCmd =
        {
            query : "SELECT * FROM DOC_vW_01 WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) AND ((TYPE = @TYPE) OR (@TYPE = -1)) ",
            param : ['GUID:string|50','REF:string|25','REF_NO:int','TYPE:int','DOC_TYPE:int']
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
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0,TYPE:-1,DOC_TYPE: -1}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? -1 : arguments[0].REF_NO;
            }
            this.ds.get('DOC').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC').refresh()

            if(this.ds.get('DOC').length > 0)
            {  
                await this.docItems.load({GUID:this.ds.get('DOC')[0].GUID})
                await this.docCustomer.load({GUID:this.ds.get('DOC')[0].GUID})
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
            ITEM_NAME : '',
            LINE_NO : 0,
            QUANTITY : 1,
            PRICE : 0,
            DISCOUNT : 0,
            VAT: 0,
            AMOUNT : 0,
            DESCRIPTION : '',
            VAT_RATE : 0 ,
            DISCOUNT_RATE : 0,
        }

        this._initDs();
    }
    //#region private
    _initDs()
    {
        let tmpDt = new datatable('DOC_ITEMS');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_ITEMS_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int']
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
                    "@DESCRIPTION  = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','DESCRIPTION']
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
                    "@DESCRIPTION  = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PSHIPMENT_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PITEM:string|50','PITEM_NAME:string|50','PLINE_NO:int','PQUANTITY:float','PPRICE:float','PDISCOUNT:float','PVAT:float','PAMOUNT:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','SHIPMENT_DATE','INPUT','OUTPUT','ITEM','ITEM_NAME','LINE_NO','QUANTITY','PRICE','DISCOUNT','VAT','AMOUNT','DESCRIPTION']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_DOC_ITEMS_DELETE] " + 
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
        tmp.GUID = datatable.uuidv4()
        this.dt('DOC_ITEMS').push(tmp)
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
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? '' : arguments[0].REF_NO;
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
            TYPE: -1,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            DOC_TYPE : -1,
            REBATE : -1,
            REF : '',
            REF_NO : 0,
            DOC_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            INPUT : '00000000-0000-0000-0000-000000000000',
            OUTPUT : '00000000-0000-0000-0000-000000000000',
            PAY_TYPE : -1,
            AMOUNT : 0,
            DESCRIPTION : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC_CUSTOMER');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DOC_CUSTOMER_VW_01] WHERE ((DOC_GUID = @DOC_GUID) OR (@DOC_GUID = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['DOC_GUID:string|50','REF:string|25','REF_NO:int']
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
                    "@DESCRIPTION  = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION']
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
                    "@DESCRIPTION  = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PTYPE:int','PDOC_TYPE:int','PREBATE:int','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PINPUT:string|50',
                        'POUTPUT:string|50','PPAY_TYPE:int','PAMOUNT:float','PDESCRIPTION:string|100'],
            dataprm : ['GUID','CUSER','DOC_GUID','TYPE','DOC_TYPE','REBATE','REF','REF_NO','DOC_DATE','INPUT','OUTPUT','PAY_TYPE','AMOUNT','DESCRIPTION']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_DOC_CUSTOMER_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID " + 
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
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',REF:'',REF_NO:0}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? '' : arguments[0].REF_NO;
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
            resolve(await this.ds.update()); 
        });
    }
}