import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class itemsCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            TYPE : '0',
            SPECIAL : '',
            CODE : '',
            NAME : '',
            SNAME : '',
            VAT : 5.5,
            COST_PRICE : 0,
            MIN_PRICE : 0,
            MAX_PRICE : 0,
            STATUS : true,
            MAIN_GUID: '00000000-0000-0000-0000-000000000000',
            MAIN_GRP : '',
            MAIN_GRP_NAME : '',
            SUB_GRP : '',
            ORGINS : '',
            ORGINS_NAME : '',
            SECTOR : '',
            RAYON : '',
            SHELF : '',
            WEIGHING : false,
            SALE_JOIN_LINE : false,
            TICKET_REST: false,
            SUGAR_RATE: 0,
            INTERFEL: false,
            DESCRIPTION : '',
            CUSTOMS_CODE: '',
            GENRE : ''
        }

        this.itemUnit = new itemUnitCls();
        this.itemPrice = new itemPriceCls();
        this.itemBarcode = new itemBarcodeCls();
        this.itemMultiCode = new itemMultiCodeCls();
        this.itemImage = new itemImageCls();

        this._initDs();
    }    
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEMS');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEMS_VW_01] WHERE ((CODE = @CODE) OR (@CODE = ''))",
            param : ['CODE:string|25'],
            local : 
            {
                type : "select",
                from : "ITEMS",
                where : {CODE : ""}
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEMS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@SPECIAL = @PSPECIAL, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@SNAME = @PSNAME, " + 
                    "@VAT = @PVAT, " + 
                    "@COST_PRICE = @PCOST_PRICE, " + 
                    "@MIN_PRICE = @PMIN_PRICE, " + 
                    "@MAX_PRICE = @PMAX_PRICE, " + 
                    "@STATUS = @PSTATUS, " + 
                    "@MAIN = @PMAIN, " + 
                    "@SUB = @PSUB, " + 
                    "@ORGINS = @PORGINS, " + 
                    "@SECTOR = @PSECTOR, " + 
                    "@RAYON = @PRAYON, " + 
                    "@SHELF = @PSHELF, " + 
                    "@WEIGHING = @PWEIGHING, " +
                    "@SALE_JOIN_LINE = @PSALE_JOIN_LINE, " +                     
                    "@TICKET_REST = @PTICKET_REST, " +
                    "@SUGAR_RATE = @PSUGAR_RATE, " +
                    "@INTERFEL = @PINTERFEL, " + 
                    "@DESCRIPTION = @PDESCRIPTION, " + 
                    "@CUSTOMS_CODE = @PCUSTOMS_CODE, " +
                    "@GENRE = @PGENRE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:string|25','PSPECIAL:string|50','PCODE:string|25','PNAME:string|250','PSNAME:string|50','PVAT:float',
                     'PCOST_PRICE:float','PMIN_PRICE:float','PMAX_PRICE:float','PSTATUS:bit','PMAIN:string|50','PSUB:string|50',
                     'PORGINS:string|50','PSECTOR:string|50','PRAYON:string|50','PSHELF:string|50','PWEIGHING:bit','PSALE_JOIN_LINE:bit','PTICKET_REST:bit','PSUGAR_RATE:float','PINTERFEL:bit','PDESCRIPTION:string|max','PCUSTOMS_CODE:string|50','PGENRE:string|25'],
            dataprm : ['GUID','CUSER','TYPE','SPECIAL','CODE','NAME','SNAME','VAT','COST_PRICE','MIN_PRICE','MAX_PRICE','STATUS','MAIN_GUID','SUB_GRP','ORGINS','SECTOR','RAYON',
                       'SHELF','WEIGHING','SALE_JOIN_LINE','TICKET_REST','SUGAR_RATE','INTERFEL','DESCRIPTION','CUSTOMS_CODE','GENRE'],
            local : 
            {
                type : "insert",
                into : "ITEMS",
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TYPE : {map:'TYPE'},
                        SPECIAL : {map:'SPECIAL'},
                        CODE : {map:'CODE'},
                        NAME : {map:'NAME'},
                        SNAME : {map:'SNAME'},
                        VAT : {map:'VAT'},
                        COST_PRICE : {map:'COST_PRICE'},
                        MIN_PRICE : {map:'MIN_PRICE'},
                        MAX_PRICE : {map:'MAX_PRICE'},
                        STATUS : {map:'STATUS'},
                        MAIN_GRP : {map:'MAIN_GRP'},
                        SUB_GRP : {map:'SUB_GRP'},
                        ORGINS : {map:'ORGINS'},
                        SECTOR : {map:'SECTOR'},
                        RAYON : {map:'RAYON'},
                        SHELF : {map:'SHELF'},
                        WEIGHING : {map:'WEIGHING'},
                        SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},
                        TICKET_REST : {map:'TICKET_REST'}
                    }
                ]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEMS_UPDATE] " + 
                    "@GUID = @PGUID, " + 
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@SPECIAL = @PSPECIAL, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@SNAME = @PSNAME, " + 
                    "@VAT = @PVAT, " + 
                    "@COST_PRICE = @PCOST_PRICE, " + 
                    "@MIN_PRICE = @PMIN_PRICE, " + 
                    "@MAX_PRICE = @PMAX_PRICE, " + 
                    "@STATUS = @PSTATUS, " + 
                    "@MAIN = @PMAIN, " + 
                    "@SUB = @PSUB, " + 
                    "@ORGINS = @PORGINS, " + 
                    "@SECTOR = @PSECTOR, " + 
                    "@RAYON = @PRAYON, " + 
                    "@SHELF = @PSHELF, " + 
                    "@WEIGHING = @PWEIGHING, " +
                    "@SALE_JOIN_LINE = @PSALE_JOIN_LINE, " +                     
                    "@TICKET_REST = @PTICKET_REST, " +
                    "@SUGAR_RATE = @PSUGAR_RATE, " +
                    "@INTERFEL = @PINTERFEL, " + 
                    "@DESCRIPTION = @PDESCRIPTION, " + 
                    "@CUSTOMS_CODE = @PCUSTOMS_CODE, " +
                    "@GENRE = @PGENRE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:string|25','PSPECIAL:string|50','PCODE:string|25','PNAME:string|250','PSNAME:string|50','PVAT:float',
                     'PCOST_PRICE:float','PMIN_PRICE:float','PMAX_PRICE:float','PSTATUS:bit','PMAIN:string|50','PSUB:string|50',
                     'PORGINS:string|50','PSECTOR:string|50','PRAYON:string|50','PSHELF:string|50','PWEIGHING:bit','PSALE_JOIN_LINE:bit','PTICKET_REST:bit','PSUGAR_RATE:float','PINTERFEL:bit','PDESCRIPTION:string|max','PCUSTOMS_CODE:string|50','PGENRE:string|25'],
            dataprm : ['GUID','CUSER','TYPE','SPECIAL','CODE','NAME','SNAME','VAT','COST_PRICE','MIN_PRICE','MAX_PRICE','STATUS','MAIN_GUID','SUB_GRP','ORGINS',
                       'SECTOR','RAYON','SHELF','WEIGHING','SALE_JOIN_LINE','TICKET_REST','SUGAR_RATE','INTERFEL','DESCRIPTION','CUSTOMS_CODE','GENRE'],
            local : 
            {
                type : "update",
                in : "ITEMS",
                set : 
                {
                    CUSER : {map:'CUSER'},
                    TYPE  : {map:'TYPE'},
                    SPECIAL : {map:'SPECIAL'},
                    CODE : {map:'CODE'},
                    NAME : {map:'NAME'},
                    SNAME : {map:'SNAME'},
                    VAT : {map:'VAT'},
                    COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},
                    MAX_PRICE : {map:'MAX_PRICE'},
                    STATUS : {map:'STATUS'},
                    MAIN : {map:'MAIN'},
                    SUB : {map:'SUB'},
                    ORGINS : {map:'ORGINS'},
                    SECTOR : {map:'SECTOR'},
                    RAYON : {map:'RAYON'},
                    SHELF : {map:'SHELF'},
                    WEIGHING : {map:'WEIGHING'},
                    SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},
                    TICKET_REST : {map:'TICKET_REST'}
                },
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEMS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            {
                type : "delete",
                from : "ITEMS",
                where : {GUID : {map:'GUID'}}
            }
        }

        this.ds.add(tmpDt);
        this.ds.add(this.itemUnit.dt('ITEM_UNIT'))
        this.ds.add(this.itemPrice.dt('ITEM_PRICE'))
        this.ds.add(this.itemBarcode.dt('ITEM_BARCODE'))
        this.ds.add(this.itemMultiCode.dt('ITEM_MULTICODE'))
        this.ds.add(this.itemImage.dt('ITEM_IMAGE'))

        this.ds.get('ITEMS').noColumnEdit = ['GROSS_MARGIN','SNAME','CUSER','MAIN_GRP_NAME','VAT_EXT','GROSS_MARGIN_RATE','NET_MARGIN','NET_MARGIN_RATE']
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
        if(typeof this.dt('ITEMS') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('ITEMS').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }
            //LOCALDB İÇİN YAPILDI. ALI KEMAL KARACA 26.02.2022
            if(typeof this.ds.get('ITEMS').selectCmd.local != 'undefined')
            {
                this.ds.get('ITEMS').selectCmd.local.where.CODE = tmpPrm.CODE
            }

            this.ds.get('ITEMS').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('ITEMS').refresh();
            
            if(this.ds.get('ITEMS').length > 0)
            {
                await this.itemUnit.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID})
                await this.itemPrice.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID,TYPE:0})
                await this.itemBarcode.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID})
                await this.itemMultiCode.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID})
                await this.itemImage.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID})
            }
            resolve(this.ds.get('ITEMS'));    
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
export class itemUnitCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
            TYPE : 0,
            TYPE_NAME : '',
            ID : '0',
            NAME : 'Unité',
            FACTOR : 1,
            WEIGHT : '0',
            VOLUME : '0',
            WIDTH : '0',
            HEIGHT : '0',
            SIZE : '0',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
        }

        this._initDs();
    }    
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_UNIT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_UNIT_VW_01] WHERE ((NAME = @NAME) OR (@NAME = '')) AND ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND ((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = ''))",
            param : ['NAME:string|50','ITEM_GUID:string|50','ITEM_CODE:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_UNIT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@ID = @PID, " + 
                    "@FACTOR = @PFACTOR, " + 
                    "@WEIGHT = @PWEIGHT, " + 
                    "@VOLUME = @PVOLUME, " + 
                    "@WIDTH = @PWIDTH, " + 
                    "@HEIGHT = @PHEIGHT, " + 
                    "@SIZE = @PSIZE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PID:string|25','PFACTOR:float','PWEIGHT:float',
                     'PVOLUME:float','PWIDTH:float','PHEIGHT:float','PSIZE:float'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','ID','FACTOR','WEIGHT','VOLUME','WIDTH','HEIGHT','SIZE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_UNIT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@ID = @PID, " + 
                    "@FACTOR = @PFACTOR, " + 
                    "@WEIGHT = @PWEIGHT, " + 
                    "@VOLUME = @PVOLUME, " + 
                    "@WIDTH = @PWIDTH, " + 
                    "@HEIGHT = @PHEIGHT, " + 
                    "@SIZE = @PSIZE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PID:string|25','PFACTOR:float','PWEIGHT:float',
                     'PVOLUME:float','PWIDTH:float','PHEIGHT:float','PSIZE:float'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','ID','FACTOR','WEIGHT','VOLUME','WIDTH','HEIGHT','SIZE']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_UNIT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
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
        if(typeof this.dt('ITEM_UNIT') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('ITEM_UNIT').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {NAME:'',ITEM_GUID:'00000000-0000-0000-0000-000000000000',ITEM_CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {NAME:'',ITEM_GUID:'00000000-0000-0000-0000-000000000000',ITEM_CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? '' : arguments[0].NAME;
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;
            }

            this.ds.get('ITEM_UNIT').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('ITEM_UNIT').refresh();
            
            resolve(this.ds.get('ITEM_UNIT'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class itemPriceCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
            TYPE : 0,
            TYPE_NAME : '',
            LIST_NO : 0,
            LIST_VAT_TYPE : 0,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            DEPOT : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            START_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            FINISH_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
            PRICE : 0,
            PRICE_TTC : 0,
            PRICE_HT : 0,
            QUANTITY : 0,
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CHANGE_DATE : moment(new Date(0)).format("DD/MM/YYYY HH:mm:ss"),
            CDATE_FORMAT : '',
            CONTRACT_GUID : '00000000-0000-0000-0000-000000000000'
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_PRICE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_PRICE_VW_01] " + 
                    "WHERE ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = '')) AND " + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) AND " + 
                    "((DEPOT = @DEPOT) OR (@DEPOT = '00000000-0000-0000-0000-000000000000')) AND " +
                    "((START_DATE >= @START_DATE) OR (CONVERT(NVARCHAR(10),@START_DATE,112) = '19700101')) AND " +
                    "((FINISH_DATE <= @FINISH_DATE) OR (CONVERT(NVARCHAR(10),@FINISH_DATE,112) = '19700101')) AND (FINISH_DATE > GETDATE()-2 OR FINISH_DATE = '19700101') AND" + 
                    "((QUANTITY = @QUANTITY) OR (@QUANTITY = -1)) AND " +
                    "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND " + 
                    "((CUSTOMER_GUID = @CUSTOMER_GUID) OR (@CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000')) AND " +
                    "((CONTRACT_GUID = @CONTRACT_GUID) OR (@CONTRACT_GUID = '00000000-0000-0000-0000-000000000000')) ORDER BY CDATE DESC",
            param : ['ITEM_GUID:string|36','ITEM_CODE:string|25','TYPE:int','DEPOT:string|36','START_DATE:date','FINISH_DATE:date',
                     'QUANTITY:float','CUSTOMER_CODE:string|25','CUSTOMER_GUID:string|36','CONTRACT_GUID:string|36']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@LIST_NO = @PLIST_NO, " + 
                    "@ITEM = @PITEM, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@PRICE = @PPRICE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@CONTRACT = @PCONTRACT ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PLIST_NO:int','PITEM:string|50','PDEPOT:string|50','PSTART_DATE:date','PFINISH_DATE:date',
                     'PPRICE:float','PQUANTITY:float','PCUSTOMER:string|50','PCONTRACT:string|50'],
            dataprm : ['GUID','CUSER','TYPE','LIST_NO','ITEM_GUID','DEPOT','START_DATE','FINISH_DATE','PRICE','QUANTITY','CUSTOMER_GUID','CONTRACT_GUID']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@LIST_NO = @PLIST_NO, " + 
                    "@ITEM = @PITEM, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@PRICE = @PPRICE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@CONTRACT = @PCONTRACT ",  
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PLIST_NO:int','PITEM:string|50','PDEPOT:string|50','PSTART_DATE:date','PFINISH_DATE:date',
                     'PPRICE:float','PQUANTITY:float','PCUSTOMER:string|50','PCONTRACT:string|50'],
            dataprm : ['GUID','CUSER','TYPE','LIST_NO','ITEM_GUID','DEPOT','START_DATE','FINISH_DATE','PRICE','QUANTITY','CUSTOMER_GUID','CONTRACT_GUID']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }
        tmpDt.noColumnEdit = ['VAT_EXT','GROSS_MARGIN','GROSS_MARGIN_RATE','NET_MARGIN','NET_MARGIN_RATE']

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
        if(typeof this.dt('ITEM_PRICE') == 'undefined')
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
        this.dt('ITEM_PRICE').push(tmp)
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
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
                ITEM_CODE : '',
                TYPE : -1,
                DEPOT : '00000000-0000-0000-0000-000000000000',
                START_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
                FINISH_DATE : moment(new Date(0)).format("YYYY-MM-DD"),
                QUANTITY : -1,
                CUSTOMER_CODE : '',
                CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
                CONTRACT_GUID : '00000000-0000-0000-0000-000000000000',
            }         

            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.DEPOT = typeof arguments[0].DEPOT == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].DEPOT;
                tmpPrm.START_DATE = typeof arguments[0].START_DATE == 'undefined' ? moment(new Date(0)).format("YYYY-MM-DD")  : arguments[0].START_DATE;
                tmpPrm.FINISH_DATE = typeof arguments[0].FINISH_DATE == 'undefined' ? moment(new Date(0)).format("YYYY-MM-DD")  : arguments[0].FINISH_DATE;
                tmpPrm.QUANTITY = typeof arguments[0].QUANTITY == 'undefined' ? -1 : arguments[0].QUANTITY;
                tmpPrm.CUSTOMER_CODE = typeof arguments[0].CUSTOMER_CODE == 'undefined' ? '' : arguments[0].CUSTOMER_CODE;
                tmpPrm.CUSTOMER_GUID = typeof arguments[0].CUSTOMER_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER_GUID;
                tmpPrm.CONTRACT_GUID = typeof arguments[0].CONTRACT_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CONTRACT_GUID;
            }
            this.ds.get('ITEM_PRICE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_PRICE').refresh();
            resolve(this.ds.get('ITEM_PRICE'));    
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
export class itemPricingListCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
            NO : 0,
            NAME : '',
            VAT_TYPE : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_PRICE_LIST');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_PRICE_LIST_VW_01] WHERE ((NO = @NO) OR (@NO IS NULL)) AND ((NAME = @NAME) OR (@NAME IS NULL))",
            param : ['NO:int','NAME:string|100']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_LIST_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@NO = @PNO, " + 
                    "@NAME = @PNAME, " + 
                    "@VAT_TYPE = @PVAT_TYPE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PNO:int','PNAME:string|100','PVAT_TYPE:int'],
            dataprm : ['GUID','CUSER','NO','NAME','VAT_TYPE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_LIST_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@NO = @PNO, " + 
                    "@NAME = @PNAME, " + 
                    "@VAT_TYPE = @PVAT_TYPE ",
            param : ['PGUID:string|50','PCUSER:string|25','PNO:int','PNAME:string|100','PVAT_TYPE:int'],
            dataprm : ['GUID','CUSER','NO','NAME','VAT_TYPE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_LIST_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@NO = @PNO ", 
            param : ['PCUSER:string|25','PNO:int'],
            dataprm : ['CUSER','NO']
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
        if(typeof this.dt('ITEM_PRICE_LIST') == 'undefined')
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
        this.dt('ITEM_PRICE_LIST').push(tmp)
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
                NO : null,
                NAME : null
            }         

            if(arguments.length > 0)
            {
                tmpPrm.NO = typeof arguments[0].NO == 'undefined' ? null : arguments[0].NO;
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? null : arguments[0].NAME;
            }
            this.ds.get('ITEM_PRICE_LIST').selectCmd.value = Object.values(tmpPrm)
            
            await this.ds.get('ITEM_PRICE_LIST').refresh();
            resolve(this.ds.get('ITEM_PRICE_LIST'));    
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
export class itemBarcodeCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
            BARCODE : '',
            TYPE : 0,
            TYPE_NAME : 'EAN13',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            UNIT_GUID : '00000000-0000-0000-0000-000000000000',
            UNIT_ID : '001',
            UNIT_TYPE : 0,
            UNIT_NAME : 'UNIT',
            UNIT_FACTOR : '0',
            UNIT_SYMBOL : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_BARCODE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_BARCODE_VW_01] " + 
                    "WHERE {0}" + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) AND " + 
                    "((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) ",
            param : ['BARCODE:string|50','TYPE:int','ITEM_GUID:string|50','ITEM_CODE:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_BARCODE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@BARCODE = @PBARCODE, " + 
                    "@UNIT = @PUNIT ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PBARCODE:string|50','PUNIT:string|50'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','BARCODE','UNIT_GUID']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_BARCODE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@BARCODE = @PBARCODE, " + 
                    "@UNIT = @PUNIT ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PBARCODE:string|50','PUNIT:string|50'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','BARCODE','UNIT_GUID']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_BARCODE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
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
        if(typeof this.dt('ITEM_BARCODE') == 'undefined')
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
        this.dt('ITEM_BARCODE').push(tmp)
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
                BARCODE : '',
                TYPE : -1,
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
                ITEM_CODE : '',
            }
           
            this.ds.get('ITEM_BARCODE').selectCmd =
            {
                query : "SELECT * FROM [dbo].[ITEM_BARCODE_VW_01] " + 
                    "WHERE {0}" + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) AND " + 
                    "((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) ",
                param : ['BARCODE:string|50','TYPE:int','ITEM_GUID:string|50','ITEM_CODE:string|25']
            }
            if(arguments.length > 0)
            {
                tmpPrm.BARCODE = typeof arguments[0].BARCODE == 'undefined' ? '' : arguments[0].BARCODE;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;                                
            }
            
            if(tmpPrm.BARCODE != '')
            {
                this.ds.get('ITEM_BARCODE').selectCmd.query = this.ds.get('ITEM_BARCODE').selectCmd.query.replaceAll("{0}", "BARCODE = @BARCODE AND ")
            }
            else if(tmpPrm.ITEM_CODE != '')
            {
                this.ds.get('ITEM_BARCODE').selectCmd.query = this.ds.get('ITEM_BARCODE').selectCmd.query.replaceAll("{0}", "ITEM_CODE = @ITEM_CODE AND")
            }
            else
            {
                this.ds.get('ITEM_BARCODE').selectCmd.query = this.ds.get('ITEM_BARCODE').selectCmd.query.replaceAll("{0}", " ")
            }
            this.ds.get('ITEM_BARCODE').selectCmd.value = Object.values(tmpPrm)
            await this.ds.get('ITEM_BARCODE').refresh();
            resolve(this.ds.get('ITEM_BARCODE'));    
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
export class itemMultiCodeCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            CUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            LUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',            
            CUSTOMER_CODE : '',            
            CUSTOMER_NAME : '',
            MULTICODE : '',
            CUSTOMER_PRICE_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_PRICE : '0',
            CUSTOMER_PRICE_DATE :'',
            CUSTOMER_PRICE_USER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
        }
        
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_MULTICODE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_MULTICODE_VW_01] " + 
                    "WHERE ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = '')) AND " + 
                    "((ITEM_NAME = @ITEM_NAME) OR (@ITEM_NAME = '')) AND " + 
                    "((CUSTOMER_GUID = @CUSTOMER_GUID) OR (@CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND " + 
                    "((CUSTOMER_NAME = @CUSTOMER_NAME) OR (@CUSTOMER_NAME = '')) AND " + 
                    "((MULTICODE = @MULTICODE) OR (@MULTICODE = '')) ORDER BY CHANGE_PRICE_DATE DESC",
            param : ['ITEM_GUID:string|50','ITEM_CODE:string|25','ITEM_NAME:string|250','CUSTOMER_GUID:string|50',
                     'CUSTOMER_CODE:string|25','CUSTOMER_NAME:string|250','MULTICODE:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_MULTICODE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@CODE = @PCODE, " + 
                    "@PRICE_GUID = @PPRICE_GUID, " + 
                    "@PRICE = @PPRICE ",
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PCUSTOMER:string|50','PCODE:string|25','PPRICE_GUID:string|50','PPRICE:float'],
            dataprm : ['GUID','CUSER','ITEM_GUID','CUSTOMER_GUID','MULTICODE','CUSTOMER_PRICE_GUID','CUSTOMER_PRICE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_MULTICODE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@CODE = @PCODE, " + 
                    "@PRICE_GUID = @PPRICE_GUID, " + 
                    "@PRICE = @PPRICE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PCUSTOMER:string|50','PCODE:string|25','PPRICE_GUID:string|50','PPRICE:float'],
            dataprm : ['GUID','CUSER','ITEM_GUID','CUSTOMER_GUID','MULTICODE','CUSTOMER_PRICE_GUID','CUSTOMER_PRICE']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_MULTICODE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
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
        if(typeof this.dt('ITEM_MULTICODE') == 'undefined')
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
        tmp.CUSTOMER_PRICE_GUID = datatable.uuidv4();
        this.dt('ITEM_MULTICODE').push(tmp)
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
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
                ITEM_CODE : '',
                ITEM_NAME : '',
                CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
                CUSTOMER_CODE : '',
                CUSTOMER_NAME : '',
                MULTICODE : ''
            }
           
            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;  
                tmpPrm.ITEM_NAME = typeof arguments[0].ITEM_NAME == 'undefined' ? '' : arguments[0].ITEM_NAME;
                tmpPrm.CUSTOMER_GUID = typeof arguments[0].CUSTOMER_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER_GUID;  
                tmpPrm.CUSTOMER_CODE = typeof arguments[0].CUSTOMER_CODE == 'undefined' ? '' : arguments[0].CUSTOMER_CODE;
                tmpPrm.CUSTOMER_NAME = typeof arguments[0].CUSTOMER_NAME == 'undefined' ? '' : arguments[0].CUSTOMER_NAME;  
                tmpPrm.MULTICODE = typeof arguments[0].MULTICODE == 'undefined' ? '' : arguments[0].MULTICODE;
            }
            
            this.ds.get('ITEM_MULTICODE').selectCmd.value = Object.values(tmpPrm)
              
            await this.ds.get('ITEM_MULTICODE').refresh();
            resolve(this.ds.get('ITEM_MULTICODE'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class itemImageCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            CUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            IMAGE : '',
            SORT : 0,
            WIDTH : 0,
            HEIGHT : 0
        }
        
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_IMAGE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_IMAGE_VW_01] " + 
                    "WHERE ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = '')) AND " + 
                    "((ITEM_NAME = @ITEM_NAME) OR (@ITEM_NAME = '')) " ,
            param : ['ITEM_GUID:string|50','ITEM_CODE:string|25','ITEM_NAME:string|250']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_IMAGE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@IMAGE = @PIMAGE, " + 
                    "@SORT = @PSORT, " +
                    "@WIDTH = @PWIDTH, " +
                    "@HEIGHT = @PHEIGHT ",  
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PIMAGE:string|max','PSORT:int','PWIDTH:int','PHEIGHT:int'],
            dataprm : ['GUID','CUSER','ITEM_GUID','IMAGE','SORT','WIDTH','HEIGHT']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_IMAGE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@IMAGE = @PIMAGE, " + 
                    "@SORT = @PSORT, " +
                    "@WIDTH = @PWIDTH, " +
                    "@HEIGHT = @PHEIGHT ",  
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PIMAGE:string|max','PSORT:int','PWIDTH:int','PHEIGHT:int'],
            dataprm : ['GUID','CUSER','ITEM_GUID','IMAGE','SORT','WIDTH','HEIGHT']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_IMAGE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@GUID = @PGUID ", 
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
        if(typeof this.dt('ITEM_IMAGE') == 'undefined')
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
        this.dt('ITEM_IMAGE').push(tmp)
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
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
                ITEM_CODE : '',
                ITEM_NAME : ''
            }
           
            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;  
                tmpPrm.ITEM_NAME = typeof arguments[0].ITEM_NAME == 'undefined' ? '' : arguments[0].ITEM_NAME;
            }
            
            this.ds.get('ITEM_IMAGE').selectCmd.value = Object.values(tmpPrm)
              
            await this.ds.get('ITEM_IMAGE').refresh();
            resolve(this.ds.get('ITEM_IMAGE'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class unitCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            ID : '',            
            NAME : '',
            SYMBOL : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('UNIT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM UNIT WHERE ((ID = @ID) OR (@ID = '')) AND " + 
                    "((NAME = @NAME) OR (@NAME = '')) AND ((SYMBOL = @SYMBOL) OR (@SYMBOL = '')) ORDER BY ID ASC ",
            param : ['ID:string|25','NAME:string|50','SYMBOL:string|10']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_UNIT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ID = @PID, " + 
                    "@NAME = @PNAME, " +
                    "@SYMBOL = @PSYMBOL " , 
            param : ['PGUID:string|50','PCUSER:string|25','PID:string|25','PNAME:string|50','PSYMBOL:string|10'],
            dataprm : ['GUID','CUSER','ID','NAME','SYMBOL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_UNIT_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@ID = @PID, " + 
            "@NAME = @PNAME, " +
            "@SYMBOL = @PSYMBOL " , 
            param : ['PGUID:string|50','PCUSER:string|25','PID:string|25','PNAME:string|50','PSYMBOL:string|10'],
            dataprm : ['GUID','CUSER','ID','NAME','SYMBOL']
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
        if(typeof this.dt('UNIT') == 'undefined')
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
        this.dt('UNIT').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {ID:'',NAME:'',SYMBOL:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {ID:'',NAME:'',SYMBOL:''}
           
            if(arguments.length > 0)
            {
                tmpPrm.ID = typeof arguments[0].ID == 'undefined' ? '' : arguments[0].ID;
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? '' : arguments[0].NAME;  
                tmpPrm.SYMBOL = typeof arguments[0].SYMBOL == 'undefined' ? '' : arguments[0].SYMBOL;
            }
            
            this.ds.get('UNIT').selectCmd.value = Object.values(tmpPrm)
            
            await this.ds.get('UNIT').refresh();
            resolve(this.ds.get('UNIT'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class editItemCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            TYPE : '0',
            SPECIAL : '',
            CODE : '',
            NAME : '',
            SNAME : '',
            VAT : 5.5,
            COST_PRICE : 0,
            MIN_PRICE : 0,
            MAX_PRICE : 0,
            STATUS : true,
            MAIN_GRP : '',
            MAIN_GRP_NAME : '',
            SUB_GRP : '',
            ORGINS : '',
            ORGINS_NAME : '',
            SECTOR : '',
            RAYON : '',
            SHELF : '',
            WEIGHING : false,
            SALE_JOIN_LINE : true,
            TICKET_REST: false,
            BARCODE : '',
            UNIT_NAME : '',
            UNIT_FACTOR : '',
            CUSTOMER: '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            WEIGHING : false
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_EDIT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT *,MAIN_UNIT_NAME AS UNIT_NAME," + 
                    "CASE WHEN PRICE_SALE <> 0 THEN " +
                    "CONVERT(nvarchar,ROUND((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE,2)) + '/ %' + CONVERT(nvarchar,ROUND((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                    "ELSE '0'  " +
                    "END AS MARGIN, " +
                    "CASE WHEN PRICE_SALE <> 0 THEN " +
                    "CONVERT(nvarchar,ROUND(((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12,2)) + '/ %' + CONVERT(nvarchar,ROUND(((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                    "ELSE '0' " +
                    "END AS NETMARGIN " +
                    "FROM ITEMS_EDIT_VW_01 " +
                    "WHERE {0} " +
                    "((NAME LIKE @NAME +'%') OR (@NAME = '')) AND " +
                    "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                    "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) ORDER BY NAME",
            param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_COLLECTIVE_ITEMS_EDIT] " + 
                    "@GUID = @PGUID, " + 
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@VAT = @PVAT, " + 
                    "@COST_PRICE = @PCOST_PRICE, " + 
                    "@WEIGHING = @PWEIGHING, " + 
                    "@STATUS = @PSTATUS, " + 
                    "@ORGINS = @PORGINS, " + 
                    "@BARCODE = @PBARCODE, " +
                    "@BARCODE_GUID = @PBARCODE_GUID, " +
                    "@MULTICODE = @PMULTICODE, " +
                    "@CUSTOMER_PRICE = @PCUSTOMER_PRICE, " +
                    "@PRICE_SALE = @PPRICE_SALE, " +
                    "@CUSTOMER_GUID = @PCUSTOMER_GUID, " +
                    "@CUSTOMER_PRICE_GUID = @PCUSTOMER_PRICE_GUID, " +
                    "@PRICE_SALE_GUID = @PPRICE_SALE_GUID, " +
                    "@UNDER_UNIT_GUID = @PUNDER_UNIT_GUID, " +
                    "@MAIN_UNIT_ID = @PMAIN_UNIT_ID, " +
                    "@UNDER_FACTOR = @PUNDER_FACTOR, " +
                    "@UNDER_UNIT_ID = @PUNDER_UNIT_ID, " +
                    "@UNDER_UNIT_NAME = @PUNDER_UNIT_NAME ",
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|25','PNAME:string|250','PVAT:float',
                     'PCOST_PRICE:float','PWEIGHING:bit','PSTATUS:bit','PORGINS:string|50','PBARCODE:string|50','PBARCODE_GUID:string|50','PMULTICODE:string|50','PCUSTOMER_PRICE:string|50',
                    'PPRICE_SALE:float','PCUSTOMER_GUID:string|50','PCUSTOMER_PRICE_GUID:string|50','PPRICE_SALE_GUID:string|50','PUNDER_UNIT_GUID:string|50','PMAIN_UNIT_ID:string|25',
                    'PUNDER_FACTOR:float','PUNDER_UNIT_ID:string|50','PUNDER_UNIT_NAME:string|25'],
            dataprm : ['GUID','CUSER','CODE','NAME','VAT','COST_PRICE','WEIGHING','STATUS','ORGINS',
                       'BARCODE','BARCODE_GUID','MULTICODE','CUSTOMER_PRICE','PRICE_SALE','CUSTOMER_GUID','CUSTOMER_PRICE_GUID','PRICE_SALE_GUID',
                        'UNDER_UNIT_GUID','MAIN_UNIT_ID','UNDER_FACTOR','UNDER_UNIT_ID','UNDER_UNIT_NAME'],
        } 

        this.ds.add(tmpDt);

        this.ds.get('ITEM_EDIT').noColumnEdit = ['NET_MARGIN','NET_MARGIN_RATE','GROSS_MARGIN','GROSS_MARGIN_RATE']
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
        if(typeof this.dt('ITEM_EDIT') == 'undefined')
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
        this.dt('ITEM_EDIT').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {ID:'',NAME:'',SYMBOL:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {NAME:'%',MAIN_GRP:'',CUSTOMER_CODE:'',QUERY:''}
           
            if(arguments.length > 0)
            {
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? '%' : arguments[0].NAME;
                tmpPrm.MAIN_GRP = typeof arguments[0].MAIN_GRP == 'undefined' ? '' : arguments[0].MAIN_GRP;
                tmpPrm.CUSTOMER_CODE = typeof arguments[0].CUSTOMER_CODE == 'undefined' ? '' : arguments[0].CUSTOMER_CODE;
                
                this.ds.get('ITEM_EDIT').selectCmd =
                {
                    query : "SELECT *,MAIN_UNIT_NAME AS UNIT_NAME," + 
                            "CASE WHEN PRICE_SALE <> 0 THEN " +
                            "CONVERT(nvarchar,ROUND((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE,2)) + '/ %' + CONVERT(nvarchar,ROUND((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                            "ELSE '0'  " +
                            "END AS MARGIN, " +
                            "CASE WHEN PRICE_SALE <> 0 THEN " +
                            "CONVERT(nvarchar,ROUND(((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12,2)) + '/ %' + CONVERT(nvarchar,ROUND(((((PRICE_SALE / ((VAT / 100) + 1)) - COST_PRICE) / 1.12) / (PRICE_SALE / ((VAT / 100) + 1))) * 100,2)) " +
                            "ELSE '0' " +
                            "END AS NETMARGIN " +
                            "FROM ITEMS_EDIT_VW_01 " +
                            "WHERE {0} " +
                            "((NAME LIKE @NAME +'%') OR (@NAME = '')) AND " +
                            "((MAIN_GRP = @MAIN_GRP) OR (@MAIN_GRP = '')) AND " +
                            "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = ''))",
                    param : ['NAME:string|250','MAIN_GRP:string|25','CUSTOMER_CODE:string|25'],
                }
                
                if(typeof arguments[0].QUERY == 'undefined' || (typeof arguments[0].QUERY != 'undefined' && arguments[0].QUERY == ''))
                {
                    
                    this.ds.get('ITEM_EDIT').selectCmd.query = this.ds.get('ITEM_EDIT').selectCmd.query.replaceAll("{0}", "")
                }
                else
                {
                    this.ds.get('ITEM_EDIT').selectCmd.query = this.ds.get('ITEM_EDIT').selectCmd.query.replaceAll("{0}", arguments[0].QUERY)
                }
                            
                this.ds.get('ITEM_EDIT').selectCmd.value = Object.values(tmpPrm)
                await this.ds.get('ITEM_EDIT').refresh();
                resolve(this.ds.get('ITEM_EDIT'));   
            }
 
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class depotCls
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
            TYPE : 0,
            STATUS : true,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DEPOT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[DEPOT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPOT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@TYPE = @PTYPE, "  +
                    "@STATUS = @PSTATUS " ,
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PTYPE:int','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','TYPE','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPOT_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " + 
            "@TYPE = @PTYPE, "  +
            "@STATUS = @PSTATUS " ,
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PTYPE:int','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','TYPE','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DEPOT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
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
        if(typeof this.dt('DEPOT') == 'undefined')
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
        this.dt('DEPOT').push(tmp)
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
            this.ds.get('DEPOT').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('DEPOT').refresh();
            resolve(this.ds.get('DEPOT'));    
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

export class itemLogPriceCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data == null ? '' : this.core.auth.data.NAME,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            PRICE : 0,
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CHANGE_DATE : moment(new Date(0)).format("DD/MM/YYYY HH:mm:ss"),
            CDATE_FORMAT : '',
            MULTICODE : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PRICE_HISTORY');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [PRICE_HISTORY_VW_01] WHERE ITEM = @ITEM_GUID AND TYPE = 1 AND FISRT_PRICE <> 0 ORDER BY CDATE DESC",
            param : ['ITEM_GUID:string|50',]
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
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            }         

            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
            }
            this.ds.get('PRICE_HISTORY').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('PRICE_HISTORY').refresh();
            resolve(this.ds.get('PRICE_HISTORY'));    
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
export class itemExpDateCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            CUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            REF :'',
            REF_NO : 0,
            DOC_DATE :moment(new Date()).format("YYYY-MM-DD"),
            DEPOT : '00000000-0000-0000-0000-000000000000',          
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            QUANTITY : 0,
            EXP_DATE : moment(new Date()).format("YYYY-MM-DD"),
            DESCRIPTION : '',            
        }
        
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_EXPDATE');     
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM [dbo].[ITEM_EXPDATE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))  "+ 
            " AND ((REF =  @REF) OR (@REF = '')) AND ((REF_NO = @REF_NO) OR (@REF_NO = 0))",
            param : ['GUID:string|50','REF:string|15','REF_NO:int']
        }  
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_EXPDATE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@ITEM_GUID = @PITEM_GUID, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@EXP_DATE = @PEXP_DATE, " +
                    "@DESCRIPTION = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PDEPOT:string|50','PITEM_GUID:string|50','PQUANTITY:float',
            'PEXP_DATE:date','PDESCRIPTION:string|250'],
            dataprm : ['GUID','CUSER','REF','REF_NO','DOC_DATE','DEPOT','ITEM_GUID','QUANTITY','EXP_DATE','DESCRIPTION']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_EXPDATE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@REF = @PREF, " + 
                    "@REF_NO = @PREF_NO, " + 
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@ITEM_GUID = @PITEM_GUID, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@EXP_DATE = @PEXP_DATE, " +
                    "@DESCRIPTION = @PDESCRIPTION ",
            param : ['PGUID:string|50','PCUSER:string|25','PREF:string|25','PREF_NO:int','PDOC_DATE:date','PDEPOT:string|50','PITEM_GUID:string|50','PQUANTITY:float',
            'PEXP_DATE:date','PDESCRIPTION:string|250'],
            dataprm : ['GUID','CUSER','REF','REF_NO','DOC_DATE','DEPOT','ITEM_GUID','QUANTITY','EXP_DATE','DESCRIPTION']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_EXPDATE_DELETE] " + 
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
        if(typeof this.dt('ITEM_EXPDATE') == 'undefined')
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
        this.dt('ITEM_EXPDATE').push(tmp)
    }
    clearAll()
    {
        for (let i = 0; i < this.ds.length; i++) 
        {
            this.dt(i).clear()
        }
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
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
            this.ds.get('ITEM_EXPDATE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_EXPDATE').refresh();
            resolve(this.ds.get('ITEM_EXPDATE'));    
        });
    }
}
export class servicesItemCls
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
            VAT : 0,
            STATUS : true,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('SERVICE_ITEMS');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[SERVICE_ITEMS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_SERVICE_ITEMS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " +
                    "@VAT = @PVAT, " + 
                    "@STATUS = @PSTATUS " , 

            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PVAT:float','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','VAT','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_SERVICE_ITEMS_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " +
            "@VAT = @PVAT, " + 
            "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PVAT:float','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','VAT','STATUS']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_SERVICE_ITEMS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
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
        if(typeof this.dt('SERVICE_ITEMS') == 'undefined')
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
        this.dt('SERVICE_ITEMS').push(tmp)
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
            this.ds.get('SERVICE_ITEMS').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('SERVICE_ITEMS').refresh();
            resolve(this.ds.get('SERVICE_ITEMS'));    
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
export class itemGroupCls
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
            CODE : '',
            NAME : '',
            STATUS : true,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_GROUP');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_GROUP] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_GROUP_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " +
                    "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_GROUP_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " +
            "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','STATUS']
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
        if(typeof this.dt('ITEM_GROUP') == 'undefined')
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
        this.dt('ITEM_GROUP').push(tmp)
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
            this.ds.get('ITEM_GROUP').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_GROUP').refresh();
            resolve(this.ds.get('ITEM_GROUP'));    
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
export class itemSubGroupCls
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
            CODE : '',
            NAME : '',
            MAIN_GRP : '',
            ATTACH_SUB : '',
            STATUS : true,
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_SUB_GROUP');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_SUB_GROUP_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC  [dbo].[PRD_ITEM_SUB_GROUP_INSERT]  " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " +
                    "@MAIN_GRP = @PMAIN_GRP, " +
                    "@ATTACH_SUB = @PATTACH_SUB, " +
                    "@STATUS = @PSTATUS " , 

            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PMAIN_GRP:string|50','PATTACH_SUB:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','MAIN_GRP','ATTACH_SUB','STATUS']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC  [dbo].[PRD_ITEM_SUB_GROUP_UPDATE]  " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " +
            "@MAIN_GRP = @PMAIN_GRP, " +
            "@ATTACH_SUB = @PATTACH_SUB, " +
            "@STATUS = @PSTATUS " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PMAIN_GRP:string|50','PATTACH_SUB:string|50','PSTATUS:bit'],
            dataprm : ['GUID','CUSER','CODE','NAME','MAIN_GRP','ATTACH_SUB','STATUS']
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
        if(typeof this.dt('ITEM_SUB_GROUP') == 'undefined')
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
        this.dt('ITEM_SUB_GROUP').push(tmp)
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
            this.ds.get('ITEM_SUB_GROUP').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_SUB_GROUP').refresh();
            resolve(this.ds.get('ITEM_SUB_GROUP'));    
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
export class vatCls 
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            ID : '',            
            VAT : 0,
            TYPE : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('VAT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM VAT WHERE ID = @ID ",
            param : ['ID:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_VAT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@ID = @PID, " + 
                    "@VAT = @PVAT, " +
                    "@TYPE = @PTYPE " , 
            param : ['PGUID:string|50','PID:string|25','PVAT:float','PTYPE:string|10'],
            dataprm : ['GUID','ID','VAT','TYPE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_VAT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@ID = @PID, " + 
                    "@VAT = @PVAT, " +
                    "@TYPE = @PTYPE " , 
            param : ['PGUID:string|50','PID:string|25','PVAT:float','PTYPE:string|10'],
            dataprm : ['GUID','ID','VAT','TYPE']
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
        if(typeof this.dt('VAT') == 'undefined')
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
        this.dt('VAT').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {ID:'',NAME:'',SYMBOL:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {ID:''}
           
            if(arguments.length > 0)
            {
                tmpPrm.ID = typeof arguments[0].ID == 'undefined' ? '' : arguments[0].ID;
            }
            
            this.ds.get('VAT').selectCmd.value = Object.values(tmpPrm)
            
            await this.ds.get('VAT').refresh();
            resolve(this.ds.get('VAT'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            resolve(await this.ds.update()); 
        });
    }
}
export class itemRelatedCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID:'00000000-0000-0000-0000-000000000000',
            CUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            LUSER: this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            ITEM_QUANTITY : 1,
            RELATED_GUID : '00000000-0000-0000-0000-000000000000',            
            RELATED_CODE : '',            
            RELATED_NAME : '',
            RELATED_QUANTITY : 1
        }
        
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_RELATED');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_RELATED_VW_01] " + 
                    "WHERE ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = '')) AND " + 
                    "((ITEM_NAME = @ITEM_NAME) OR (@ITEM_NAME = '')) AND " + 
                    "((RELATED_GUID = @RELATED_GUID) OR (@RELATED_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((RELATED_CODE = @RELATED_CODE) OR (@RELATED_CODE = '')) AND " + 
                    "((RELATED_NAME = @RELATED_NAME) OR (@RELATED_NAME = ''))",
            param : ['ITEM_GUID:string|50','ITEM_CODE:string|25','ITEM_NAME:string|250','RELATED_GUID:string|50',
                     'RELATED_CODE:string|25','RELATED_NAME:string|250']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_RELATED_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@ITEM_QUANTITY = @PITEM_QUANTITY, " + 
                    "@RELATED = @PRELATED, " +
                    "@RELATED_QUANTITY = @PRELATED_QUANTITY",
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PITEM_QUANTITY:float','PRELATED:string|50','PRELATED_QUANTITY:float'],
            dataprm : ['GUID','CUSER','ITEM_GUID','ITEM_QUANTITY','RELATED_GUID','RELATED_QUANTITY']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_RELATED_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@ITEM_QUANTITY = @PITEM_QUANTITY, " + 
                    "@RELATED = @PRELATED, " +
                    "@RELATED_QUANTITY = @PRELATED_QUANTITY",
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PITEM_QUANTITY:float','PRELATED:string|50','PRELATED_QUANTITY:float'],
            dataprm : ['GUID','CUSER','ITEM_GUID','ITEM_QUANTITY','RELATED_GUID','RELATED_QUANTITY']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_RELATED_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
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
        if(typeof this.dt('ITEM_RELATED') == 'undefined')
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
        this.dt('ITEM_RELATED').push(tmp)
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
                ITEM_GUID : '00000000-0000-0000-0000-000000000000',
                ITEM_CODE : '',
                ITEM_NAME : '',
                RELATED_GUID : '00000000-0000-0000-0000-000000000000',
                RELATED_CODE : '',
                RELATED_NAME : ''
            }
           
            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;  
                tmpPrm.ITEM_NAME = typeof arguments[0].ITEM_NAME == 'undefined' ? '' : arguments[0].ITEM_NAME;
                tmpPrm.RELATED_GUID = typeof arguments[0].RELATED_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].RELATED_GUID;  
                tmpPrm.RELATED_CODE = typeof arguments[0].RELATED_CODE == 'undefined' ? '' : arguments[0].RELATED_CODE;
                tmpPrm.RELATED_NAME = typeof arguments[0].RELATED_NAME == 'undefined' ? '' : arguments[0].RELATED_NAME;  
            }
            
            this.ds.get('ITEM_RELATED').selectCmd.value = Object.values(tmpPrm)
              
            await this.ds.get('ITEM_RELATED').refresh();
            resolve(this.ds.get('ITEM_RELATED'));    
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
export class genreCls
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
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_GENRE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_GENRE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_GENRE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_GENRE_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME " , 
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_GENRE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
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
        if(typeof this.dt('ITEM_GENRE') == 'undefined')
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
        this.dt('ITEM_GENRE').push(tmp)
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
            this.ds.get('ITEM_GENRE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_GENRE').refresh();
            resolve(this.ds.get('ITEM_GENRE'));    
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
