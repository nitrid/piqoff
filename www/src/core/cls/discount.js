import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class discountCls
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
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            STATUS : 1
        }

        this.cond = new discCondCls()
        this.app = new discAppCls()

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DISCOUNT');            
        tmpDt.selectCmd = 
        {
            query : `SELECT * FROM [dbo].[DISCOUNT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((DEPOT_GUID = @DEPOT_GUID) OR (@DEPOT_GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((START_DATE <= @START_DATE) OR (@START_DATE = '19700101')) AND ((FINISH_DATE >= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) AND STATUS = 1`,
            param : ['GUID:string|50','CODE:string|25','START_DATE:date','FINISH_DATE:date','DEPOT_GUID:string|50'],
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date','PDEPOT:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','DEPOT_GUID','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date','PDEPOT:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','DEPOT_GUID','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_DELETE] " + 
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
        if(typeof this.dt('DISCOUNT') == 'undefined')
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
        this.dt('DISCOUNT').push(tmp)
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
                DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                if(typeof arguments[0].CODE == 'undefined')
                {
                    tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                    tmpPrm.START_DATE = typeof arguments[0].START_DATE == 'undefined' ? '19700101' : arguments[0].START_DATE;
                    tmpPrm.FINISH_DATE = typeof arguments[0].FINISH_DATE == 'undefined' ? '19700101' : arguments[0].FINISH_DATE;
                    tmpPrm.DEPOT_GUID = typeof arguments[0].DEPOT_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DEPOT_GUID;
                }
                else
                {
                    tmpPrm = {CODE:arguments[0].CODE}
                    this.ds.get('DISCOUNT').selectCmd.query = "SELECT * FROM [dbo].[DISCOUNT_VW_01] WHERE ((CODE = @CODE) OR (@CODE = '')) AND STATUS = 1"
                    this.ds.get('DISCOUNT').selectCmd.param = ['CODE:string|25']
                }
            }
            
            this.ds.get('DISCOUNT').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('DISCOUNT').refresh();
            
            let tmpGuids = ''
            for (let i = 0; i < this.ds.get('DISCOUNT').length; i++) 
            {
                tmpGuids = tmpGuids + this.ds.get('DISCOUNT')[i].GUID + ","
            }

            if(tmpGuids != '')
            {
                await this.cond.load({DISCOUNT:tmpGuids.substring(0,tmpGuids.length - 1)})
                await this.app.load({DISCOUNT:tmpGuids.substring(0,tmpGuids.length - 1)})
            }

            resolve(this.ds.get('DISCOUNT'));    
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
export class discCondCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            DISCOUNT : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            LINK_GUID : '00000000-0000-0000-0000-000000000000',
            LINK_CODE : '',
            LINK_NAME : '',
            WITHAL : 0,
            SECTOR : 'COND'
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DISC_CONDITION');            
        tmpDt.selectCmd = 
        {
            query : `SELECT *,'COND' AS SECTOR FROM [dbo].[DISCOUNT_CONDITION_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((DISCOUNT IN (SELECT value FROM STRING_SPLIT(@DISCOUNT,','))) OR (@DISCOUNT = '')) ORDER BY WITHAL ASC`,
            param : ['GUID:string|50','DISCOUNT:string|max'],
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_CONDITION_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@TYPE = @PTYPE, " + 
                    "@LINK = @PLINK, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PDISCOUNT:string|50','PTYPE:int','PLINK:string|50','PWITHAL:int'],
            dataprm : ['GUID','DISCOUNT','TYPE','LINK_GUID','WITHAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_CONDITION_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@TYPE = @PTYPE, " + 
                    "@LINK = @PLINK, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PDISCOUNT:string|50','PTYPE:int','PLINK:string|50','PWITHAL:int'],
            dataprm : ['GUID','DISCOUNT','TYPE','LINK_GUID','WITHAL']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_CONDITION_DELETE] " + 
                    "@UPDATE = 1, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@GUID = @PGUID ", 
            param : ['PDISCOUNT:string|50','PGUID:string|50'],
            dataprm : ['DISCOUNT','GUID']
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

        if(typeof this.dt('DISC_CONDITION') == 'undefined')
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
        
        this.dt('DISC_CONDITION').push(tmp)
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
                DISCOUNT : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.DISCOUNT = typeof arguments[0].DISCOUNT == 'undefined' ? '' : arguments[0].DISCOUNT;
            }
            this.ds.get('DISC_CONDITION').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('DISC_CONDITION').refresh();
            resolve(this.ds.get('DISC_CONDITION'));    
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
export class discAppCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            DISCOUNT : '00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            AMOUNT : 0,
            WITHAL : 0,
            SECTOR : 'APP'
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DISC_APPLICATION');            
        tmpDt.selectCmd = 
        {
            query : `SELECT *,'APP' AS SECTOR FROM [dbo].[DISCOUNT_APPLICATION_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND 
                    ((DISCOUNT IN (SELECT value FROM STRING_SPLIT(@DISCOUNT,','))) OR (@DISCOUNT = '')) ORDER BY WITHAL ASC`,
            param : ['GUID:string|50','DISCOUNT:string|max']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_APPLICATION_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@TYPE = @PTYPE, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PDISCOUNT:string|50','PTYPE:int','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','DISCOUNT','TYPE','AMOUNT','WITHAL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_APPLICATION_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@TYPE = @PTYPE, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@WITHAL = @PWITHAL " ,
            param : ['PGUID:string|50','PDISCOUNT:string|50','PTYPE:int','PAMOUNT:float','PWITHAL:int'],
            dataprm : ['GUID','DISCOUNT','TYPE','AMOUNT','WITHAL']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DISCOUNT_APPLICATION_DELETE] " + 
                    "@UPDATE = 1, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@GUID = @PGUID ", 
            param : ['PDISCOUNT:string|50','PGUID:string|50'],
            dataprm : ['DISCOUNT','GUID']
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
        if(typeof this.dt('DISC_APPLICATION') == 'undefined')
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
        this.dt('DISC_APPLICATION').push(tmp)
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
                DISCOUNT : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.DISCOUNT = typeof arguments[0].DISCOUNT == 'undefined' ? '' : arguments[0].DISCOUNT;
            }

            this.ds.get('DISC_APPLICATION').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('DISC_APPLICATION').refresh();
            
            resolve(this.ds.get('DISC_APPLICATION'));    
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