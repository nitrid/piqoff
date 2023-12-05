import { core,dataset,datatable } from "../core.js";
import moment from 'moment';
import { itemPriceCls } from "./items";

export class contractCls
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
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CODE : '',
            NAME : '',
            VAT_TYPE : 0
        }
        
        this.itemPrice = new itemPriceCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CONTRACT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[CONTRACT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = '')) AND ((NAME = @NAME) OR (@NAME = '')) AND TYPE = @TYPE",
            param : ['GUID:string|50','CODE:string|25','NAME:string|250','TYPE:int']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CONTRACT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@VAT_TYPE = @PVAT_TYPE ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_DATE:date','PCODE:string|25','PNAME:string|250','PVAT_TYPE:int'],
            dataprm : ['GUID','CUSER','TYPE','DOC_DATE','CODE','NAME','VAT_TYPE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CONTRACT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " + 
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " +
                    "@VAT_TYPE = @PVAT_TYPE ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC_DATE:date','PCODE:string|25','PNAME:string|250','PVAT_TYPE:int'],
            dataprm : ['GUID','CUSER','TYPE','DOC_DATE','CODE','NAME','VAT_TYPE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_CONTRACT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID " ,
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.itemPrice.dt())
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
        if(typeof this.dt('CONTRACT') == 'undefined')
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
        this.dt('CONTRACT').push(tmp)
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
                NAME : '',
                TYPE : 0
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? '' : arguments[0].NAME;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? 0 : arguments[0].TYPE;
            }
            this.ds.get('CONTRACT').selectCmd.value = Object.values(tmpPrm)
            
            await this.ds.get('CONTRACT').refresh();

            if(this.ds.get('CONTRACT').length > 0)
            {
                await this.itemPrice.load({CONTRACT_GUID:this.ds.get('CONTRACT')[0].GUID})
            }

            resolve(this.ds.get('CONTRACT'));    
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