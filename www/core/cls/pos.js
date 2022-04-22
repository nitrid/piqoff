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
            DEVICE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
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
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@DEVICE = @PDEVICE, " +
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
            param : ['PGUID:string|50','PCUSER:string|25','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                     'PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSTATUS:int'],
            dataprm : ['GUID','CUSER','DEVICE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@DEVICE = @PDEVICE, " +
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
            param : ['PGUID:string|50','PCUSER:string|25','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                     'PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSTATUS:int'],
            dataprm : ['GUID','CUSER','DEVICE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','STATUS']
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
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }

            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
              
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
            TYPE : 0,
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
            VAT_RATE : 0,
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
            query : "SELECT * FROM [dbo].[POS_SALE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
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
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
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
            query : "SELECT * FROM [dbo].[POS_PAYMENT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
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
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
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
            LINE_NO : 0,
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
                from : "POS_EXTRA",
                where : {GUID : "",POS_GUID : ""}
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TAG = @PTAG, " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@DESCRIPTION = @PDESCRIPTION ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_NO:int','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_NO','DESCRIPTION'],
            local : 
            {
                type : "insert",
                into : "POS_EXTRA",
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TAG : {map:'TAG'},
                        POS_GUID : {map:'POS_GUID'},
                        LINE_NO : {map:'LINE_NO'},
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
                    "@LINE_NO = @PLINE_NO, " +
                    "@DESCRIPTION = @PDESCRIPTION ",  
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_NO:int','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_NO','DESCRIPTION'],
            local : 
            {
                type : "update",
                in : "POS_EXTRA",
                set : 
                {
                    CUSER : {map:'CUSER'},
                    TAG : {map:'TAG'},
                    POS_GUID : {map:'POS_GUID'},
                    LINE_NO : {map:'LINE_NO'},
                    DESCRIPTION : {map:'DESCRIPTION'}
                },
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " , 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            {
                type : "delete",
                from : "POS_EXTRA",
                where : 
                {
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'}
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
        if(typeof this.dt('POS_EXTRA') == 'undefined')
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
        if(typeof require != 'undefined')
        {
            this.escpos = require('escpos');
            this.escpos.Serial = require('escpos-serialport');
            this.escpos.Screen = require('escpos-screen');
            this.escpos.USB = require('escpos-usb');
            this.path = require('path')
            this.serialport = require('serialport');
        }

        this.lcdPort = "";
        this.scalePort = "";
        this.payCardPort = "";
    }
    lcdPrint(pData)
    {
        if(typeof require == 'undefined')
        {
            return
        }

        let device  = new this.escpos.Serial(this.lcdPort, { baudRate: 9600, autoOpen: false });
        let options = { encoding: "GB18030" /* default */ }
        let usbScreen = new this.escpos.Screen(device,options);

        device.open(function(error)
        {
            usbScreen.blink(pData.blink);
            usbScreen.clear();
            usbScreen.text(pData.text).close();
        });
    }
    lcdClear()
    {
        if(typeof require == 'undefined')
        {
            return
        }

        let device  = new this.escpos.Serial(this.LCDPort, { baudRate: 9600, autoOpen: false });
        let options = { encoding: "GB18030" /* default */ }
        let usbScreen = new this.escpos.Screen(device,options);

        device.open(function(error)
        {
            usbScreen.clear();
        });
    }
    caseOpen()
    {
        if(typeof require == 'undefined')
        {
            return
        }
        let device  = new this.escpos.USB();
        let options = { encoding: "GB18030" /* default */ }
        let printer = new this.escpos.Printer(device, options);
        device.open(function(error)
        {
            printer.cashdraw(2);
            printer.close();
        })
    }
    mettlerScaleSend(pPrice)
    {
        if(typeof require == 'undefined')
        {
            return
        }

        let toHex = (pStr) =>
        {
            let result = '';
            for (let i = 0; i < pStr.length; i++) 
            {
                result += pStr.charCodeAt(i).toString(16);
            }
            return result;
        }
        let Ror16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData >> pDistance) | (pData << (16 - pDistance));
        }
        let Rol16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData << pDistance) | (pData >> (16 - pDistance));
        }

        return new Promise((resolve) =>
        {
            let port = new this.serialport(this.scalePort,{baudRate:9600,dataBits:7,parity:'odd',stopBits:1});
            let TmpPrice = parseInt(pPrice * 100).toString().padStart(6,'0');
            //TERAZİYE FİYAT GÖNDERİLİYOR.
            port.write('01' + TmpPrice +'');
            let ReciveBuffer = '';

            //TERAZİDEN DÖNEN DEĞERLERİN OKUNMASI
            port.on('data',line =>
            {         
                //TERAZİDEN ONAY GELDİĞİNDE..
                if(toHex(line.toString()) == "6")
                {
                    port.write('')
                }
                //TERAZİDEN ONAY GELMEDİĞİNDE
                else if(toHex(line.toString()) == "15")
                {
                    //TEKRAR FİYAT GÖNDERİLİYOR.
                    port.write('01' + TmpPrice +'');
                }
                //VALİDASYON İŞLEMİ BAŞLANGIÇ
                if(line.toString().substring(1,3) == "11")
                {
                    //VALİDASYON İÇİN GEREKLİ OLAN RANDOM NUMARA
                    if(line.toString().substring(4,5) == "2")
                    {      
                        //RANDOM NUMARA BİT ÇEVİRİM İŞLEMİ      
                        let cs = ("000" + parseInt(Rol16(0x2C3C, line.toString().substring(5,6)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                        let kw = ("000" + parseInt(Ror16(0xFA07, line.toString().substring(6,7)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                        let cskw = cs + kw;
                        //VALİDASYON CS VE KW GÖNDERİLİYOR 
                        port.write('10'+ cskw.toString() + '')
                    }
                    else if(line.toString().substring(4,5) == "0")
                    {
                        //VALİDASYON BAŞARISIZ DURUMU
                        //console.log("Validasyon Başarısız");
                        port.write('01' + TmpPrice +'');
                    }
                    else if(line.toString().substring(4,5) == "1")
                    {
                        //VALİDASYON BAŞARILI DURUMU
                        console.log("Validasyon Başarılı");
                        let TmpResult = 
                        {
                            Type: "01",
                            Result :
                            {
                                Msg : "Validasyon Başarılı"
                            }                            
                        }
                        resolve(TmpResult);
                        port.close();
                    }
                }
                //TERAZİ SONUÇ DÖNDÜĞÜNDE
                if(line.toString().substring(1,3) == "02" || ReciveBuffer.substring(1,3) == "02")
                {
                    ReciveBuffer += line.toString()
                    if(ReciveBuffer.length >= 26)
                    {
                        let TmpScale = ReciveBuffer.substring(6,11)
                        let TmpPrice = ReciveBuffer.substring(12,18)
                        let TmpAmount = ReciveBuffer.substring(19,25)
                        
                        let TmpResult = 
                        {
                            Type: "02",
                            Result :
                            {
                                Scale : TmpScale / 1000,
                                Price : TmpPrice / 100,
                                Amount : TmpAmount / 100
                            }
                        }

                        resolve(TmpResult);
                        ReciveBuffer = '';
                        port.close();
                    }
                }
            })

            setTimeout(()=>
            { 
                if(port.isOpen)
                {
                    port.close(); 
                }
            }, 20000);

            return port.on("close", resolve)
        });
    }
    cardPayment(pAmount)
    {
        if(typeof require == 'undefined')
        {
            return
        }

        let ack = false;
        let oneShoot = false;
        let payMethod = "card"

        let generate_lrc = function(real_msg_with_etx)
        {
            let lrc = 0, text = real_msg_with_etx.split('');
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

        return new Promise((resolve) =>
        {
            let port = new this.serialport(this.payCardPort);
            port.on('data',(data)=> 
            {
                if(String.fromCharCode(data[0]) == String.fromCharCode(6))
                {
                    if(ack == false)
                    {
                        oneShoot = false;
                        let tmpData = 
                        {
                            'pos_number': '01',
                            'amount_msg': ('0000000' + (pAmount * 100).toFixed(0)).substr(-8),
                            'answer_flag': '0',
                            'payment_mode': payMethod  == 'check' ? 'C' : '1', 
                            'transaction_type': '0',
                            'currency_numeric': 978, 
                            'private': '          ',
                            'delay': 'A010',
                            'auto': 'B010'
                        };
                        
                        let msg = Object.keys(tmpData).map( k => tmpData[k] ).join('');
                        if (msg.length > 34) return console.log('ERR. : failed data > 34 characters.', msg);
                        let real_msg_with_etx = msg.toString().concat(String.fromCharCode(3));//ETX
                        
                        let lrc = generate_lrc(real_msg_with_etx);
                        //STX + msg + lrc
                        let tpe_msg = (String.fromCharCode(2)).concat(real_msg_with_etx).concat(String.fromCharCode(lrc));
                        port.write(tpe_msg)
    
                        ack = true;
                    }
                }
                else if(String.fromCharCode(data[0]) == String.fromCharCode(6))
                {
                    port.write(String.fromCharCode(4))
                }
                else if(String.fromCharCode(data[0]) == String.fromCharCode(5))
                {
                    port.write(String.fromCharCode(6))
                }
                else if(data.length >= 25)
                {
                    if(oneShoot)
                    {
                        return;
                    }
    
                    oneShoot = true;
                    let str = "";
                    if(isNaN(data.toString().substr(1)))
                    {
                        str = data.toString().substr(1).substr(0, data.toString().length-3);
                    }
                    else
                    {
                        str = data.toString().substr(0, data.toString().length-3);;
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

                    resolve({tag:"response",msg:JSON.stringify(response)});   
                }
            });
            port.write(String.fromCharCode(5));
        });
        
    }
}