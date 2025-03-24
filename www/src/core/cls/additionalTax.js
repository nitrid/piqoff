import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class additionalTax
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            TYPE:  -1,
            NAME : '',
            JSON : '',
            STATUS : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ADDITIONAL_TAXES');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[ADDITIONAL_TAXES] WHERE TYPE = @TYPE",
            param : ['TYPE:int']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ADDITIONAL_TAXES_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@NAME = @PNAME, " + 
                    "@JSON = @PJSON, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|25','PJSON:string|max',
                     'PSTATUS:bit',],
            dataprm : ['GUID','CUSER','TYPE','NAME','JSON','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ADDITIONAL_TAXES_UPDATE]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@NAME = @PNAME, " + 
                    "@JSON = @PJSON, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|25','PJSON:string|max',
                     'PSTATUS:int',],
            dataprm : ['GUID','CUSER','TYPE','NAME','JSON','STATUS']
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
        if(typeof this.dt('ADDITIONAL_TAXES') == 'undefined')
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
        this.dt('ADDITIONAL_TAXES').push(tmp)
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
                TYPE : -1
            }          

            if(arguments.length > 0)
            {
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1: arguments[0].TYPE;
            }
            this.ds.get('ADDITIONAL_TAXES').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ADDITIONAL_TAXES').refresh();
            resolve(this.ds.get('ADDITIONAL_TAXES'));    
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
export class taxSugarCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            TYPE:  0,
            CDATE_FORMAT : moment(new Date()).format("YYYY-MM-DD - HH:mm:ss"),
            NAME : '',
            JSON : '',
            STATUS : 0,
            MIN_VALUE : 0,
            MAX_VALUE : 0,
            RATE : 0,
            PRICE : 0,
            START_DATE : moment(new Date()).format("YYYY-MM-DD"),
            END_DATE : moment(new Date()).format("YYYY-MM-DD"),
            STATUS : 0,

        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('TAX_SUGAR_TABLE');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[TAX_SUGAR_TABLE_VW_01] WHERE TYPE = @TYPE ",
            param : ['TYPE:int']
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
        if(typeof this.dt('TAX_SUGAR_TABLE') == 'undefined')
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
        this.dt('TAX_SUGAR_TABLE').push(tmp)
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
                TYPE : -1
            }          

            if(arguments.length > 0)
            {
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1: arguments[0].TYPE;
            }
            this.ds.get('TAX_SUGAR_TABLE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('TAX_SUGAR_TABLE').refresh();
            resolve(this.ds.get('TAX_SUGAR_TABLE'));    
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
export class interfelCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CDATE_FORMAT : moment(new Date()).format("YYYY-MM-DD - HH:mm:ss"),
            FR : 0,
            NOTFR : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('INTERFEL_TABLE');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[INTERFEL_TABLE_VW_01] ",
            param : ['TYPE:int']
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
        if(typeof this.dt('INTERFEL_TABLE') == 'undefined')
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
        this.dt('INTERFEL_TABLE').push(tmp)
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
                TYPE : -1
            }          

            if(arguments.length > 0)
            {
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1: arguments[0].TYPE;
            }
            this.ds.get('INTERFEL_TABLE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('INTERFEL_TABLE').refresh();
            resolve(this.ds.get('INTERFEL_TABLE'));    
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
