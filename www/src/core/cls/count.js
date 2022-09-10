import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class itemCountCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CDATE_FORMAT :  moment(new Date()).format("YYYY-MM-DD"),
            REF:  '',
            REF_NO : '',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            LINE_NO : 0,
            DEPOT : '',
            DEPOT_NAME : '',
            ITEM : '00000000-0000-0000-0000-000000000000',
            ITEM_NAME : '',
            ITEM_CODE : '',
            QUANTITY : 0,
            CUSTOMER_NAME : '',
            TOTAL_COST :0,
            COST_PRICE : 0,
            MULTICODE : '',
            BARCODE : '',
            LOCKED : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_COUNT');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[ITEM_COUNT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))  "+ 
            " AND ((REF =  @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['GUID:string|50','REF:string|15','REF_NO:int']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_COUNT_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +
                    "@QUANTITY = @PQUANTITY, " +
                    "@LOCKED = @PLOCKED " ,
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDOC_DATE:date',
                     'PDEPOT:string|50','PLINE_NO:int','PITEM:string|50','PQUANTITY:float','PLOCKED:int'],
            dataprm : ['GUID','CUSER','REF','REF_NO','DOC_DATE','DEPOT','LINE_NO','ITEM','QUANTITY','LOCKED']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_COUNT_UPDATE]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@LINE_NO = @PLINE_NO, " +
                    "@ITEM = @PITEM, " +
                    "@LOCKED = @PLOCKED " ,
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDOC_DATE:date',
                        'PDEPOT:string|50','PLINE_NO:int','PITEM:string|50','PQUANTITY:float','PLOCKED:int'],
            dataprm : ['GUID','CUSER','REF','REF_NO','DOC_DATE','DEPOT','LINE_NO','ITEM','QUANTITY','LOCKED']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_COUNT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID, " + 
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO ",
            param : ['PCUSER:string|25','PGUID:string|50','PREF:string|15','PREF_NO:int'],
            dataprm : ['CUSER','GUID','REF','REF_NO']
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
        if(typeof this.dt('ITEM_COUNT') == 'undefined')
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
        this.dt('ITEM_COUNT').push(tmp)
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
                REF : '',
                REF_NO : 0
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.REF = typeof arguments[0].REF == 'undefined' ? '' : arguments[0].REF;
                tmpPrm.REF_NO = typeof arguments[0].REF_NO == 'undefined' ? 0 : arguments[0].REF_NO;
            }
            this.ds.get('ITEM_COUNT').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_COUNT').refresh();
            resolve(this.ds.get('ITEM_COUNT'));    
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