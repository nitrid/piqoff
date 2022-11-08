import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class userCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CODE : '',
            NAME  :'',
            PWD : '',
            ROLE : '',
            SHA: '',
            CARDID: '',
            STATUS : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('USERS');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM USERS WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_USERS_INSERT] " + 
            "@GUID = @PGUID, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " + 
            "@LAST_NAME = @PLAST_NAME, " + 
            "@PWD = @PPWD, " + 
            "@ROLE = @PROLE, " + 
            "@CARDID = @CARDID, " + 
            "@SHA = @PSHA, " +
            "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCODE:string|25','PNAME:string|50','PLAST_NAME:string|50','PPWD:string|50','PROLE:string|25','CARDID:string|25','PSHA:string|200','PSTATUS:bit'],
            dataprm : ['GUID','CODE','NAME','LAST_NAME','PWD','ROLE','CARDID','SHA','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_USERS_UPDATE] " + 
            "@GUID = @PGUID, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " + 
            "@LAST_NAME = @PLAST_NAME, " + 
            "@PWD = @PPWD, " + 
            "@ROLE = @PROLE, " + 
            "@CARDID = @CARDID, " + 
            "@SHA = @PSHA, " +
            "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCODE:string|25','PNAME:string|50','PLAST_NAME:string|50','PPWD:string|50','PROLE:string|25','CARDID:string|25','PSHA:string|200','PSTATUS:bit'],
            dataprm : ['GUID','CODE','NAME','LAST_NAME','PWD','ROLE','CARDID','SHA','STATUS']
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
        if(typeof this.dt('USERS') == 'undefined')
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
        this.dt('USERS').push(tmp)
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
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            this.ds.get('USERS').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('USERS').refresh();
            resolve(this.ds.get('USERS'));    
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