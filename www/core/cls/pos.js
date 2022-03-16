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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
            }

            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('POS').refresh();
            
            if(this.ds.get('POS').length > 0)
            {
                await this.posSale.load({POS_GUID:this.ds.get('POS')[0].GUID})
                await this.posPayment.load({POS_GUID:this.ds.get('POS')[0].GUID,TYPE:0})
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
            dataprm : ['GUID','CUSER','POS_GUID','LINE_NO','ITEM_GUID','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','SUBTOTAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_UPDATE] " + 
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
            dataprm : ['GUID','CUSER','POS_GUID','LINE_NO','ITEM_GUID','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','SUBTOTAL']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
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
        if(typeof arguments.length > 0)
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
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_SALE').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('POS_SALE').refresh();
            
            resolve(this.ds.get('POS_SALE'));    
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
            TYPE : '0',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            PAY_TYPE : 0,
            LINE_NO : 0,
            AMOUNT : 0,
            CHANGE : 0,
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
        let tmpDt = new datatable('POS_PAYMENT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_PAYMENT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = ''))",
            param : ['GUID:string|50','POS_GUID:string|50']
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
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
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
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
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
        if(typeof arguments.length > 0)
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
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_PAYMENT').selectCmd.value = Object.values(tmpPrm);
              
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
            query : "SELECT * FROM [dbo].[PLU_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CUSER = @CUSER) OR (@CUSER = '')) AND " + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) ORDER BY LOCATION ASC",
            param : ['GUID:string|50','CUSER:string|25','TYPE:int'],
            local : 
            {
                type : "select",
                from : "PLU",
                where : {GUID : "",CUSER : "",TYPE : 0}
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
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "insert",
                into : "PLU",
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TYPE : {map:'TYPE'},
                        NAME : {map:'NAME'},
                        LINK : {map:'LINK'},
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
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "update",
                in : "PLU",
                set : 
                {
                    CUSER : {map:'CUSER'},
                    TYPE : {map:'TYPE'},
                    NAME : {map:'NAME'},
                    LINK : {map:'LINK'},
                    LOCATION : {map:'LOCATION'},
                    GROUP_INDEX : {map:'GROUP_INDEX'}
                },
                where : {GUID : {map:'GUID'}}
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
                from : "PLU",
                where : 
                {
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'},
                    TYPE : {map:'TYPE'}
                }
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
        if(typeof arguments.length > 0)
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