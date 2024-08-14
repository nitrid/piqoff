import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class restOrderCls
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
            ZONE : '00000000-0000-0000-0000-000000000000',
            ZONE_CODE : '',
            ZONE_NAME : '',
            REF : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            VAT : 0,
            TOTAL : 0,
            ORDER_COMPLATE_COUNT : 0,
            ORDER_COUNT : 0,
            DELIVERED : 0,
            DELETED : 0
        }

        this.restOrderDetail = new restOrderDetailCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('REST_ORDER');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[REST_ORDER_VW_01] WHERE ((ZONE = @ZONE) OR (@ZONE = '00000000-0000-0000-0000-000000000000')) AND ((REF = @REF) OR (@REF = 0))",
            param : ['ZONE:string|50','REF:int'],
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ZONE = @PZONE, " +
                    "@REF = @PREF, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL ",
            param : ['PGUID:string|50','PCUSER:string|25','PZONE:string|50','PREF:int','PDOC_DATE:date','PFAMOUNT:float','PAMOUNT:float',
                     'PDISCOUNT:float','PVAT:float','PTOTAL:float'],
            dataprm : ['GUID','CUSER','ZONE','REF','DOC_DATE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ZONE = @PZONE, " +
                    "@REF = @PREF, " +
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " +
                    "@DELETED = @PDELETED ", 
            param : ['PGUID:string|50','PCUSER:string|25','PZONE:string|50','PREF:int','PDOC_DATE:date','PFAMOUNT:float','PAMOUNT:float',
                        'PDISCOUNT:float','PVAT:float','PTOTAL:float','PDELETED:bit'],
            dataprm : ['GUID','CUSER','ZONE','REF','DOC_DATE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL','DELETED']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_DELETE] @CUSER = @PCUSER, @UPDATE = 1, @GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.restOrderDetail.dt('REST_ORDER_DETAIL'))
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
        if(typeof this.dt('REST_ORDER') == 'undefined')
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
        this.dt('REST_ORDER').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {ZONE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {ZONE:'',REF:0}
            if(arguments.length > 0)
            {
                tmpPrm.ZONE = typeof arguments[0].ZONE == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ZONE;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? 0 : arguments[0].REF;
            }
            
            this.ds.get('REST_ORDER').selectCmd.value = Object.values(tmpPrm);
                          
            await this.ds.get('REST_ORDER').refresh();
            
            if(this.ds.get('REST_ORDER').length > 0)
            {
                await this.restOrderDetail.load({REST_GUID:this.ds.get('REST_ORDER')[0].GUID})
            }
            resolve(this.ds.get('REST_ORDER'));    
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
export class restOrderDetailCls
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
            ZONE : '00000000-0000-0000-0000-000000000000',
            ZONE_CODE : '',
            ZONE_NAME : '',
            REF : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            REST_GUID : '00000000-0000-0000-0000-000000000000',
            LINE_NO : 0,
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            QUANTITY : 0,
            PRICE : 0,
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            VAT : 0,
            TOTAL : 0,
            PROPERTY : '',
            DESCRIPTION : '',
            STATUS : 0,
            WAIT_STATUS : 0,
            WAITING : false,
            POS : '00000000-0000-0000-0000-000000000000',
            POS_SALE : '00000000-0000-0000-0000-000000000000'
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('REST_ORDER_DETAIL');            
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[REST_ORDER_DETAIL_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((REST_GUID = @REST_GUID) OR (@REST_GUID = '00000000-0000-0000-0000-000000000000')) ORDER BY LDATE DESC`,
            param : ['GUID:string|50','REST_GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_DETAIL_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@REST = @PREST, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +  
                    "@ITEM_NAME = @PITEM_NAME, " +  
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@PROPERTY = @PPROPERTY, " + 
                    "@DESCRIPTION = @PDESCRIPTION, " + 
                    "@STATUS = @PSTATUS, " +
                    "@WAIT_STATUS = @PWAIT_STATUS, " +
                    "@POS = @PPOS, " + 
                    "@POS_SALE = @PPOS_SALE ",
            param : ['PGUID:string|50','PCUSER:string|25','PREST:string|50','PLINE_NO:int','PITEM:string|50','PITEM_NAME:string|250','PQUANTITY:float',
                     'PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PPROPERTY:string|max','PDESCRIPTION:string|max',
                     'PSTATUS:int','PWAIT_STATUS:int','PPOS:string|50','PPOS_SALE:string|50'],
            dataprm : ['GUID','CUSER','REST_GUID','LINE_NO','ITEM','ITEM_NAME','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL','PROPERTY','DESCRIPTION',
                       'STATUS','WAIT_STATUS','POS','POS_SALE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_DETAIL_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@REST = @PREST, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +  
                    "@ITEM_NAME = @PITEM_NAME, " +  
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@PROPERTY = @PPROPERTY, " + 
                    "@DESCRIPTION = @PDESCRIPTION, " + 
                    "@STATUS = @PSTATUS, " +
                    "@WAIT_STATUS = @PWAIT_STATUS, " +
                    "@POS = @PPOS, " + 
                    "@POS_SALE = @PPOS_SALE ",
            param : ['PGUID:string|50','PCUSER:string|25','PREST:string|50','PLINE_NO:int','PITEM:string|50','PITEM_NAME:string|250','PQUANTITY:float',
                     'PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PPROPERTY:string|max','PDESCRIPTION:string|max',
                     'PSTATUS:int','PWAIT_STATUS:int','PPOS:string|50','PPOS_SALE:string|50'],
            dataprm : ['GUID','CUSER','REST_GUID','LINE_NO','ITEM','ITEM_NAME','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL','PROPERTY','DESCRIPTION',
                       'STATUS','WAIT_STATUS','POS','POS_SALE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_ORDER_DETAIL_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@REST_GUID = @PREST_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PREST_GUID:string|50'],
            dataprm : ['CUSER','GUID','REST_GUID']
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
        if(typeof this.dt('REST_ORDER_DETAIL') == 'undefined')
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
        this.dt('REST_ORDER_DETAIL').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',REST_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',REST_GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.REST_GUID = typeof arguments[0].REST_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].REST_GUID;
            }

            this.ds.get('REST_ORDER_DETAIL').selectCmd.value = Object.values(tmpPrm);
            
            await this.ds.get('REST_ORDER_DETAIL').refresh();
            
            resolve(this.ds.get('REST_ORDER_DETAIL'));
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
export class restTableCls
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
            CODE : '',
            NAME : '',
            DELETED : 0
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('REST_TABLE');            
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[REST_TABLE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((CODE = @CODE) OR (@CODE = '')) ORDER BY LDATE DESC`,
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_TABLE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_TABLE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_TABLE_DELETE] " + 
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
        if(typeof this.dt('REST_TABLE') == 'undefined')
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
        this.dt('REST_TABLE').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',REST_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CODE;
            }

            this.ds.get('REST_TABLE').selectCmd.value = Object.values(tmpPrm);
            
            await this.ds.get('REST_TABLE').refresh();
            
            resolve(this.ds.get('REST_TABLE'));
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
export class restPropertyCls
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
            CODE : '',
            NAME : '',
            SELECTION : 0,
            PROPERTY : '',
            DELETED : 0
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('REST_PROPERTY');
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[REST_PROPERTY] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((CODE = @CODE) OR (@CODE = '')) AND DELETED = 0 ORDER BY LDATE DESC`,
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PROPERTY_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME, " +
                    "@SELECTION = @PSELECTION, " +
                    "@PROPERTY = @PPROPERTY ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50','PSELECTION:int','PPROPERTY:string|max'],
            dataprm : ['GUID','CUSER','CODE','NAME','SELECTION','PROPERTY']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PROPERTY_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME, " +
                    "@SELECTION = @PSELECTION, " +
                    "@PROPERTY = @PPROPERTY ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50','PSELECTION:int','PPROPERTY:string|max'],
            dataprm : ['GUID','CUSER','CODE','NAME','SELECTION','PROPERTY']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PROPERTY_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);

        let tmpItemProp = new datatable('REST_ITEM_PROPERTY');

        tmpItemProp.selectCmd = 
        {
            query : `SELECT *, 
                    ISNULL((SELECT TOP 1 NAME FROM ITEMS WHERE GUID = ITEM),'') AS ITEM_NAME
                    FROM REST_ITEM_PROPERTY WHERE PROPERTY = @PROPERTY AND DELETED = 0`,
            param : ['PROPERTY:string|50'],
        }
        tmpItemProp.insertCmd = 
        {
            query : `INSERT INTO [dbo].[REST_ITEM_PROPERTY] ([GUID],[CDATE],[CUSER],[LDATE],[LUSER],[ITEM],[PROPERTY],[DELETED]
                    ) VALUES (
                    NEWID(),GETDATE(),@CUSER,GETDATE(),@LUSER,@ITEM,@PROPERTY,0)`,
            param : ['CUSER:string|25','LUSER:string|25','ITEM:string|50','PROPERTY:string|50'],
            dataprm : ['CUSER','LUSER','ITEM','PROPERTY']
        }
        tmpItemProp.updateCmd = 
        {
            query : `UPDATE [dbo].[REST_ITEM_PROPERTY] SET [LDATE] = GETDATE(),[LUSER] = @LUSER,[ITEM] = @ITEM,[PROPERTY] = @PROPERTY
                    WHERE GUID = @GUID`,
            param : ['LUSER:string|25','ITEM:string|50','PROPERTY:string|50','GUID:string|50'],
            dataprm : ['LUSER','ITEM','PROPERTY','GUID']
        }
        tmpItemProp.deleteCmd = 
        {
            query : `UPDATE [dbo].[REST_ITEM_PROPERTY] SET DELETED = 1 WHERE GUID = @GUID`,
            param : ['GUID:string|50'],
            dataprm : ['GUID']
        }

        this.ds.add(tmpItemProp);
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
        if(typeof this.dt('REST_PROPERTY') == 'undefined')
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
        this.dt('REST_PROPERTY').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',REST_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CODE;
            }

            this.ds.get('REST_PROPERTY').selectCmd.value = Object.values(tmpPrm);
            
            await this.ds.get('REST_PROPERTY').refresh();
            
            if(this.ds.get('REST_PROPERTY').length > 0)
            {
                this.ds.get('REST_ITEM_PROPERTY').selectCmd.value = [this.ds.get('REST_PROPERTY')[0].GUID]
                await this.ds.get('REST_ITEM_PROPERTY').refresh()
            }

            resolve(this.ds.get('REST_PROPERTY'));
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
export class restPrinterCls
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
            CODE : '',
            NAME : '',
            DESIGN_PATH : '',
            PRINTER_PATH : '',
            LANG : '',
            DELETED : 0
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('REST_PRINTER');
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[REST_PRINTER] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((CODE = @CODE) OR (@CODE = '')) AND DELETED = 0 ORDER BY LDATE DESC`,
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PRINTER_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME, " +
                    "@DESIGN_PATH = @PDESIGN_PATH, " +
                    "@PRINTER_PATH = @PPRINTER_PATH, " +
                    "@LANG = @PLANG ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50','PDESIGN_PATH:string|max','PPRINTER_PATH:string|max','PLANG:string|10'],
            dataprm : ['GUID','CUSER','CODE','NAME','DESIGN_PATH','PRINTER_PATH','LANG']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PRINTER_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CODE = @PCODE, " +
                    "@NAME = @PNAME, " +
                    "@DESIGN_PATH = @PDESIGN_PATH, " +
                    "@PRINTER_PATH = @PPRINTER_PATH, " +
                    "@LANG = @PLANG ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|50','PDESIGN_PATH:string|max','PPRINTER_PATH:string|max','PLANG:string|10'],
            dataprm : ['GUID','CUSER','CODE','NAME','DESIGN_PATH','PRINTER_PATH','LANG']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_REST_PRINTER_DELETE] @CUSER = @PCUSER, @UPDATE = 1, @GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);

        let tmpItemPrinter = new datatable('REST_PRINT_ITEM');

        tmpItemPrinter.selectCmd = 
        {
            query : `SELECT *, 
                    ISNULL((SELECT TOP 1 NAME FROM ITEMS WHERE GUID = ITEM),'') AS ITEM_NAME
                    FROM REST_PRINT_ITEM WHERE PRINTER = @PRINTER`,
            param : ['PRINTER:string|50'],
        }
        tmpItemPrinter.insertCmd = 
        {
            query : `INSERT INTO [dbo].[REST_PRINT_ITEM] ([GUID],[CDATE],[CUSER],[LDATE],[LUSER],[ITEM],[PRINTER]
                    ) VALUES (
                    NEWID(),GETDATE(),@CUSER,GETDATE(),@LUSER,@ITEM,@PRINTER)`,
            param : ['CUSER:string|25','LUSER:string|25','ITEM:string|50','PRINTER:string|50'],
            dataprm : ['CUSER','LUSER','ITEM','PRINTER']
        }
        tmpItemPrinter.updateCmd = 
        {
            query : `UPDATE [dbo].[REST_PRINT_ITEM] SET [LDATE] = GETDATE(),[LUSER] = @LUSER,[ITEM] = @ITEM,[PRINTER] = @PRINTER
                    WHERE GUID = @GUID`,
            param : ['LUSER:string|25','ITEM:string|50','PRINTER:string|50','GUID:string|50'],
            dataprm : ['LUSER','ITEM','PRINTER','GUID']
        }
        tmpItemPrinter.deleteCmd = 
        {
            query : `DELETE FROM [dbo].[REST_PRINT_ITEM] WHERE GUID = @GUID`,
            param : ['GUID:string|50'],
            dataprm : ['GUID']
        }

        this.ds.add(tmpItemPrinter);
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
        if(typeof this.dt('REST_PRINTER') == 'undefined')
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
        this.dt('REST_PRINTER').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',REST_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CODE;
            }

            this.ds.get('REST_PRINTER').selectCmd.value = Object.values(tmpPrm);
            
            await this.ds.get('REST_PRINTER').refresh();
            
            if(this.ds.get('REST_PRINTER').length > 0)
            {
                this.ds.get('REST_PRINT_ITEM').selectCmd.value = [this.ds.get('REST_PRINTER')[0].GUID]
                await this.ds.get('REST_PRINT_ITEM').refresh()
            }

            resolve(this.ds.get('REST_PRINTER'));
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