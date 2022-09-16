import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class promoCls
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
            CODE : '',
            NAME : '',
            START_DATE : moment(new Date()).format("YYYY-MM-DD"),
            FINISH_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            STATUS : 1
        }

        this.cond = new promoCondCls()
        this.app = new promoAppCls()

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PROMO');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[PROMO_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = '')) AND " + 
                    "((CUSTOMER_GUID = @CUSTOMER_GUID) OR (@CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000')) AND ((DEPOT_GUID = @DEPOT_GUID) OR (@DEPOT_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((START_DATE <= @START_DATE) OR (@START_DATE = '19700101')) AND ((FINISH_DATE >= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) AND STATUS = 1",
            param : ['GUID:string|50','CODE:string|25','START_DATE:date','FINISH_DATE:date','CUSTOMER_GUID:string|50','DEPOT_GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date',
                     'PCUSTOMER:string|50','PDEPOT:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','CUSTOMER_GUID','DEPOT_GUID','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date',
                    'PCUSTOMER:string|50','PDEPOT:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','CUSTOMER_GUID','DEPOT_GUID','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@CODE = @PCODE ", 
            param : ['PCUSER:string|25','PGUID:string|50','PCODE:string|25'],
            dataprm : ['CUSER','GUID','CODE']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.cond.dt())
        this.ds.add(this.app.dt())
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
    async addEmpty()
    {
        await this.core.util.waitUntil(0)
        if(typeof this.dt('PROMO') == 'undefined')
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
        this.dt('PROMO').push(tmp)
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
                START_DATE : '19700101',
                FINISH_DATE : '19700101',
                CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
                DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
                tmpPrm.START_DATE = typeof arguments[0].START_DATE == 'undefined' ? '19700101' : arguments[0].START_DATE;
                tmpPrm.FINISH_DATE = typeof arguments[0].FINISH_DATE == 'undefined' ? '19700101' : arguments[0].FINISH_DATE;
                tmpPrm.CUSTOMER_GUID = typeof arguments[0].CUSTOMER_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER_GUID;
                tmpPrm.DEPOT_GUID = typeof arguments[0].DEPOT_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DEPOT_GUID;
            }
            this.ds.get('PROMO').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('PROMO').refresh();

            let tmpGuids = ''
            for (let i = 0; i < this.ds.get('PROMO').length; i++) 
            {
                tmpGuids = tmpGuids + this.ds.get('PROMO')[i].GUID + ","
            }
            
            await this.cond.load({PROMO:tmpGuids.substring(0,tmpGuids.length - 1)})
            await this.app.load({PROMO:tmpGuids.substring(0,tmpGuids.length - 1)})

            resolve(this.ds.get('PROMO'));    
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
export class promoCondCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            PROMO : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            QUANTITY : 0,
            AMOUNT : 0,
            WITHAL : 0,
            SECTOR : 'COND'
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PROMO_CONDITION');            
        tmpDt.selectCmd = 
        {
            query : "SELECT *,'COND' AS SECTOR FROM [dbo].[PROMO_CONDITION_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((PROMO IN (SELECT value FROM STRING_SPLIT(@PROMO,','))) OR (@PROMO = '')) ORDER BY WITHAL ASC",
            param : ['GUID:string|50','PROMO:string|max']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_CONDITION_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@PROMO = @PPROMO, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM_CODE = @PITEM_CODE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PCUSER:string|25','PPROMO:string|50','PTYPE:int','PITEM_CODE:string|25','PQUANTITY:float','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','CUSER','PROMO','TYPE','ITEM_CODE','QUANTITY','AMOUNT','WITHAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_CONDITION_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@PROMO = @PPROMO, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM_CODE = @PITEM_CODE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PCUSER:string|25','PPROMO:string|50','PTYPE:int','PITEM_CODE:string|25','PQUANTITY:float','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','CUSER','PROMO','TYPE','ITEM_CODE','QUANTITY','AMOUNT','WITHAL']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_CONDITION_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 0, " + 
                    "@PROMO = @PPROMO, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PPROMO:string|50','PGUID:string|50'],
            dataprm : ['CUSER','PROMO','GUID']
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
    async addEmpty()
    {
        await this.core.util.waitUntil(0)

        if(typeof this.dt('PROMO_CONDITION') == 'undefined')
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
        
        this.dt('PROMO_CONDITION').push(tmp)
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
                PROMO : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.PROMO = typeof arguments[0].PROMO == 'undefined' ? '' : arguments[0].PROMO;
            }
            this.ds.get('PROMO_CONDITION').selectCmd.value = Object.values(tmpPrm)
            await this.ds.get('PROMO_CONDITION').refresh();
            resolve(this.ds.get('PROMO_CONDITION'));    
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
export class promoAppCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            PROMO : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            QUANTITY : 0,
            AMOUNT : 0,
            WITHAL : 0,
            SECTOR : 'APP'
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PROMO_APPLICATION');            
        tmpDt.selectCmd = 
        {
            query : "SELECT *,'APP' AS SECTOR FROM [dbo].[PROMO_APPLICATION_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((PROMO IN (SELECT value FROM STRING_SPLIT(@PROMO,','))) OR (@PROMO = '')) ORDER BY WITHAL ASC",
            param : ['GUID:string|50','PROMO:string|max']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_APPLICATION_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@PROMO = @PPROMO, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM_CODE = @PITEM_CODE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PCUSER:string|25','PPROMO:string|50','PTYPE:int','PITEM_CODE:string|25','PQUANTITY:float','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','CUSER','PROMO','TYPE','ITEM_CODE','QUANTITY','AMOUNT','WITHAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_APPLICATION_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@PROMO = @PPROMO, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM_CODE = @PITEM_CODE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PCUSER:string|25','PPROMO:string|50','PTYPE:int','PITEM_CODE:string|25','PQUANTITY:float','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','CUSER','PROMO','TYPE','ITEM_CODE','QUANTITY','AMOUNT','WITHAL']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMO_APPLICATION_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 0, " + 
                    "@PROMO = @PPROMO, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PPROMO:string|50','PGUID:string|50'],
            dataprm : ['CUSER','PROMO','GUID']
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
    async addEmpty()
    {
        await this.core.util.waitUntil(0)
        if(typeof this.dt('PROMO_APPLICATION') == 'undefined')
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
        this.dt('PROMO_APPLICATION').push(tmp)
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
                PROMO : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.PROMO = typeof arguments[0].PROMO == 'undefined' ? '' : arguments[0].PROMO;
            }
            this.ds.get('PROMO_APPLICATION').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('PROMO_APPLICATION').refresh();
            resolve(this.ds.get('PROMO_APPLICATION'));    
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