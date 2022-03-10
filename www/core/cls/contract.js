import { core,dataset,datatable } from "../core.js";

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
            TYPE_NAME : '',
            START_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            FINISH_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            DEPOT : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            QUANTITY : 0,
            PRICE : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('SALES_CONTRACT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[SALES_CONTRACT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CUSTOMER = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) AND TYPE = @TYPE",
            param : ['GUID:string|50','CUSTOMER:string|50','TYPE:int']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_SALES_CONTRACT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " +
                    "@ITEM = @PITEM, " +
                    "@QUANTITY = @PQUANTITY, " +
                    "@PRICE = @PPRICE ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PSTART_DATE:date','PFINISH_DATE:date',
                     'PCUSTOMER:string|50','PDEPOT:string|50','PITEM:string|50','PQUANTITY:float','PPRICE:float'],
            dataprm : ['GUID','CUSER','TYPE','START_DATE','FINISH_DATE','CUSTOMER','DEPOT','ITEM','QUANTITY','PRICE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_SALES_CONTRACT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@DEPOT = @PDEPOT, " +
                    "@ITEM = @PITEM, " +
                    "@QUANTITY = @PQUANTITY, " +
                    "@PRICE = @PPRICE ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PSTART_DATE:date','PFINISH_DATE:date',
                    'PCUSTOMER:string|50','PDEPOT:string|50','PITEM:string|50','PQUANTITY:float','PPRICE:float'],
            dataprm : ['GUID','CUSER','TYPE','START_DATE','FINISH_DATE','CUSTOMER','DEPOT','ITEM','QUANTITY','PRICE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_SALES_CONTRACT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID " ,
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
        if(typeof this.dt('SALES_CONTRACT') == 'undefined')
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
        this.dt('SALES_CONTRACT').push(tmp)
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
                CUSTOMER : '00000000-0000-0000-0000-000000000000',
                TYPE : 0
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CUSTOMER = typeof arguments[0].CUSTOMER == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? 0 : arguments[0].TYPE;
            }
            this.ds.get('SALES_CONTRACT').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('SALES_CONTRACT').refresh();
            resolve(this.ds.get('SALES_CONTRACT'));    
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