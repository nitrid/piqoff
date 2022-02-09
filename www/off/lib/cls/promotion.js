import { core,dataset,datatable } from "../../../core/core.js";

export class promotionCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE : moment(new Date(0)).format("DD/MM/YYYY"),
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : '',
            LDATE : moment(new Date(0)).format("DD/MM/YYYY"),
            LUSER : this.core.auth.data.CODE,
            LUSER_NAME : '',
            CODE : '',
            NAME : '',
            START_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
            FINISH_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            PRM_T : 0,
            PRM_T_NAME : '',
            PRM_V : '',
            PRM_CODE : '',
            PRM_NAME : '',
            PRM_Q : 0,
            RST_T : 0,
            RST_T_NAME : '',
            RST_V : '',
            RST_CODE : '',
            RST_NAME : '',
            RST_ITEM_T : 0,
            RST_ITEM_T_NAME : '',
            RST_ITEM_V: ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PROMOTION');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[PROMOTION_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMOTION_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@PRM_T = @PPRM_T, " + 
                    "@PRM_V = @PPRM_V, " + 
                    "@PRM_Q = @PPRM_Q, " + 
                    "@RST_T = @PRST_T, " + 
                    "@RST_V = @PRST_V, " + 
                    "@RST_Q = @PRST_Q, " + 
                    "@RST_ITEM_T = @PRST_ITEM_T, " + 
                    "@RST_ITEM_V = @PRST_ITEM_V ", 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date',
                     'PCUSTOMER:string|50','PDEPOT:string|50','PPRM_T:int','PPRM_V:string|max','PPRM_Q:float','PRST_T:int',
                     'PRST_V:string|max','PRST_Q:float','PRST_ITEM_T:int','PRST_ITEM_V:string|max'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','CUSTOMER','DEPOT','PRM_T','PRM_V','PRM_Q','RST_T',
                       'RST_V','RST_Q','RST_ITEM_T','RST_ITEM_V']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMOTION_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@PRM_T = @PPRM_T, " + 
                    "@PRM_V = @PPRM_V, " + 
                    "@PRM_Q = @PPRM_Q, " + 
                    "@RST_T = @PRST_T, " + 
                    "@RST_V = @PRST_V, " + 
                    "@RST_Q = @PRST_Q, " + 
                    "@RST_ITEM_T = @PRST_ITEM_T, " + 
                    "@RST_ITEM_V = @PRST_ITEM_V ", 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PSTART_DATE:date','PFINISH_DATE:date',
                    'PCUSTOMER:string|50','PDEPOT:string|50','PPRM_T:int','PPRM_V:string|max','PPRM_Q:float','PRST_T:int',
                    'PRST_V:string|max','PRST_Q:float','PRST_ITEM_T:int','PRST_ITEM_V:string|max'],
            dataprm : ['GUID','CUSER','CODE','NAME','START_DATE','FINISH_DATE','CUSTOMER','DEPOT','PRM_T','PRM_V','PRM_Q','RST_T',
                       'RST_V','RST_Q','RST_ITEM_T','RST_ITEM_V']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PROMOTION_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@CODE = @PCODE ", 
            param : ['PCUSER:string|25','PGUID:string|50','PCODE:string|25'],
            dataprm : ['CUSER','GUID','CODE']
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
        if(typeof this.dt('PROMOTION') == 'undefined')
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
        this.dt('PROMOTION').push(tmp)
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
                CODE : ''
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }
            this.ds.get('PROMOTION').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('PROMOTION').refresh();
            resolve(this.ds.get('PROMOTION'));    
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