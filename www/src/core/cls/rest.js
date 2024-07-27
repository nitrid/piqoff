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
            STATUS : 0
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
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREST:string|50','PLINE_NO:int','PITEM:string|50','PITEM_NAME:string|250','PQUANTITY:float',
                     'PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PPROPERTY:string|max','PDESCRIPTION:string|max',
                     'PSTATUS:int'],
            dataprm : ['GUID','CUSER','REST_GUID','LINE_NO','ITEM','ITEM_NAME','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL','PROPERTY','DESCRIPTION','STATUS']
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
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREST:string|50','PLINE_NO:int','PITEM:string|50','PITEM_NAME:string|250','PQUANTITY:float',
                     'PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PVAT:float','PTOTAL:float','PPROPERTY:string|max','PDESCRIPTION:string|max',
                     'PSTATUS:int'],
            dataprm : ['GUID','CUSER','REST_GUID','LINE_NO','ITEM','ITEM_NAME','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','VAT','TOTAL','PROPERTY','DESCRIPTION','STATUS']
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