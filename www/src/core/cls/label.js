import { core,dataset,datatable } from "../core.js";

export class labelCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            REF:  '',
            REF_NO : '',
            DATA : '',
            PRINT_COUNT : 1,
            STATUS : 0,
            CODE : '',
            MULTICODE : '',
            BARCODE : '',
            NAME : '',
            ITEM_GRP : '',
            ITEM_GRP_NAME : '',
            CUSTOMER_NAME : '',
            PRICE : 0,
            FACTOR : '',
            UNDER_UNIT_VALUE : '' ,
            UNDER_UNIT_PRICE : 0,
            UNDER_UNIT_SYMBOL : '',
            DESCRIPTION : '',
            LINE_NO : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('LABEL_QUEUE');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[ITEM_LABEL_QUEUE_VW_01] WHERE GUID = @GUID",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_LABEL_QUEUE_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DATA = @PDATA, " + 
                    "@PRINT_COUNT = @PPRINT_COUNT, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDATA:string|max',
                     'PPRINT_COUNT:int','PSTATUS:int',],
            dataprm : ['GUID','CUSER','REF','REF_NO','DATA','PRINT_COUNT','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_LABEL_QUEUE_UPDATE]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DATA = @PDATA, " + 
                    "@PRINT_COUNT = @PPRINT_COUNT, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDATA:string|max',
                     'PPRINT_COUNT:int','PSTATUS:int',],
            dataprm : ['GUID','CUSER','REF','REF_NO','DATA','PRINT_COUNT','STATUS']
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
        if(typeof this.dt('LABEL_QUEUE') == 'undefined')
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
        this.dt('LABEL_QUEUE').push(tmp)
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
            this.ds.get('LABEL_QUEUE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('LABEL_QUEUE').refresh();
            resolve(this.ds.get('LABEL_QUEUE'));    
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
export class labelMainCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            REF:  '',
            REF_NO : '',
            DATA : '',
            PRINT_COUNT : 1,
            DESING : '',
            STATUS : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('MAIN_LABEL_QUEUE');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[LABEL_QUEUE] WHERE GUID = @GUID",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_LABEL_QUEUE_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DATA = @PDATA, " + 
                    "@PRINT_COUNT = @PPRINT_COUNT, " + 
                    "@DESING = @PDESING, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDATA:string|max',
                     'PPRINT_COUNT:int','PDESING:string|25','PSTATUS:int',],
            dataprm : ['GUID','CUSER','REF','REF_NO','DATA','PRINT_COUNT','DESING','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_LABEL_QUEUE_UPDATE]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DATA = @PDATA, " + 
                    "@PRINT_COUNT = @PPRINT_COUNT, " + 
                    "@DESING = @PDESING, " + 
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDATA:string|max',
                     'PPRINT_COUNT:int','PDESING:string|25','PSTATUS:int',],
            dataprm : ['GUID','CUSER','REF','REF_NO','DATA','PRINT_COUNT','DESING','STATUS']
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
        if(typeof this.dt('MAIN_LABEL_QUEUE') == 'undefined')
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
        this.dt('MAIN_LABEL_QUEUE').push(tmp)
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
            this.ds.get('MAIN_LABEL_QUEUE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('MAIN_LABEL_QUEUE').refresh();
            resolve(this.ds.get('MAIN_LABEL_QUEUE'));    
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
export class priLabelObj
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
            ITEM : '00000000-0000-0000-0000-000000000000',
            NAME : '',
            QUANTITY : 1,
            PRICE : 0,
            DESCRIPTION : '',
            STATUS : 0,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_UNIQ');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[ITEM_UNIQ_VW_01] WHERE GUID = @GUID",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_UNIQ_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@ITEM = @PITEM, " + 
                    "@NAME = @PNAME, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " +
                    "@DESCRIPTION = @PDESCRIPTION, " +
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PITEM:string|50','PNAME:string|50',
                     'PQUANTITY:float','PPRICE:float','PDESCRIPTION:string|50','PSTATUS:int'],
            dataprm : ['GUID','CUSER','CODE','ITEM','NAME','QUANTITY','PRICE','DESCRIPTION','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_UNIQ_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@ITEM = @PITEM, " + 
                    "@NAME = @PNAME, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@PRICE = @PPRICE, " +
                    "@DESCRIPTION = @PDESCRIPTION, " +
                    "@STATUS = @PSTATUS ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PITEM:string|50','PNAME:string|50',
                     'PQUANTITY:float','PPRICE:float','PDESCRIPTION:string|50','PSTATUS:int'],
            dataprm : ['GUID','CUSER','CODE','ITEM','NAME','QUANTITY','PRICE','DESCRIPTION','STATUS']
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
        if(typeof this.dt('ITEM_UNIQ') == 'undefined')
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
        this.dt('ITEM_UNIQ').push(tmp)
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
            this.ds.get('ITEM_UNIQ').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_UNIQ').refresh();
            resolve(this.ds.get('ITEM_UNIQ'));    
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