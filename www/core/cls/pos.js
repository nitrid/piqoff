import { core,dataset,datatable } from "../core.js";

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
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : '0',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            TOTAL : 0,
            STATUS : 0
        }

        this.posSale = new posSaleCls();
        this.posPayment = new posPaymentCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = ''))",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@SAFE = @PSAFE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PSAFE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                     'PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSTATUS:int'],
            dataprm : ['GUID','CUSER','SAFE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@SAFE = @PSAFE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PSAFE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                     'PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSTATUS:int'],
            dataprm : ['GUID','CUSER','SAFE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.posSale.dt('POS_SALE'))
        this.ds.add(this.posPayment.dt('POS_PAYMENT'))
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
        if(typeof arguments.length > 0)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }

            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('POS').refresh();
            
            if(this.ds.get('POS').length > 0)
            {
                await this.posSale.load({POS:this.ds.get('POS')[0].GUID})
                await this.posPayment.load({POS:this.ds.get('POS')[0].GUID,TYPE:0})
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
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : '0',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            LINE_NO : 0,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            BARCODE_GUID : '00000000-0000-0000-0000-000000000000',
            BARCODE : '',
            UNIT_GUID : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_FACTOR : 0,
            QUANTITY : 0,
            PRICE : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            TOTAL : 0,
            SUBTOTAL : 0,
            GRAND_AMOUNT : 0,
            GRAND_DISCOUNT : 0,
            GRAND_LOYALTY : 0,
            GRAND_VAT : 0,
            GRAND_TOTAL : 0,
            STATUS : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_SALE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_SALE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = ''))",
            param : ['GUID:string|50','POS_GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +                      
                    "@BARCODE = @PBARCODE, " + 
                    "@UNIT = @PUNIT, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@SUBTOTAL = @PSUBTOTAL ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PBARCODE:string|50','PUNIT:string|50',
                     'PQUANTITY:float','PPRICE:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int'],
            dataprm : ['GUID','CUSER','POS_GUID','LINE_NO','ITEM','BARCODE','UNIT','QUANTITY','PRICE','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','SUBTOTAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@SAFE = @PSAFE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PSAFE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                     'PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSTATUS:int'],
            dataprm : ['GUID','CUSER','SAFE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.posSale.dt('POS_SALE'))
        this.ds.add(this.posPayment.dt('POS_PAYMENT'))
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
        if(typeof arguments.length > 0)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }

            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('POS').refresh();
            
            if(this.ds.get('POS').length > 0)
            {
                await this.posSale.load({POS:this.ds.get('POS')[0].GUID})
                await this.posPayment.load({POS:this.ds.get('POS')[0].GUID,TYPE:0})
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
        });
    }
}