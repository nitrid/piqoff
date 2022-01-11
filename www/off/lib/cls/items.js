import { core,dataset,datatable } from "../../../core/core.js";

export class itemsCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
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
            SALE_JOIN_LINE : false,
            TICKET_REST: false
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
            param : ['CODE:string|25']
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
                    "@TICKET_REST = @PTICKET_REST ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:string|25','PSPECIAL:string|50','PCODE:string|25','PNAME:string|250','PSNAME:string|50','PVAT:float',
                     'PCOST_PRICE:float','PMIN_PRICE:float','PMAX_PRICE:float','PSTATUS:bit','PMAIN:string|50','PSUB:string|50',
                     'PORGINS:string|50','PSECTOR:string|50','PRAYON:string|50','PSHELF:string|50','PWEIGHING:bit','PSALE_JOIN_LINE:bit','PTICKET_REST:bit'],
            dataprm : ['GUID','CUSER','TYPE','SPECIAL','CODE','NAME','SNAME','VAT','COST_PRICE','MIN_PRICE','MAX_PRICE','STATUS','MAIN_GRP','SUB_GRP','ORGINS','SECTOR','RAYON',
                       'SHELF','WEIGHING','SALE_JOIN_LINE','TICKET_REST']
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
                    "@TICKET_REST = @PTICKET_REST ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:string|25','PSPECIAL:string|50','PCODE:string|25','PNAME:string|250','PSNAME:string|50','PVAT:float',
                     'PCOST_PRICE:float','PMIN_PRICE:float','PMAX_PRICE:float','PSTATUS:bit','PMAIN:string|50','PSUB:string|50',
                     'PORGINS:string|50','PSECTOR:string|50','PRAYON:string|50','PSHELF:string|50','PWEIGHING:bit','PSALE_JOIN_LINE:bit','PTICKET_REST:bit'],
            dataprm : ['GUID','CUSER','TYPE','SPECIAL','CODE','NAME','SNAME','VAT','COST_PRICE','MIN_PRICE','MAX_PRICE','STATUS','MAIN_GRP','SUB_GRP','ORGINS',
                       'SECTOR','RAYON','SHELF','WEIGHING','SALE_JOIN_LINE','TICKET_REST']
        } 

        this.ds.add(tmpDt);
        this.ds.add(this.itemUnit.dt('ITEM_UNIT'))
        this.ds.add(this.itemPrice.dt('ITEM_PRICE'))
        this.ds.add(this.itemBarcode.dt('ITEM_BARCODE'))
        this.ds.add(this.itemMultiCode.dt('ITEM_MULTICODE'))
        this.ds.add(this.itemImage.dt('ITEM_IMAGE'))
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
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            TYPE : 0,
            TYPE_NAME : '',
            ID : '0',
            NAME : 'Unité',
            FACTOR : 0,
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
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            TYPE : 0,
            TYPE_NAME : '',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            DEPOT : '0',
            START_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
            FINISH_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
            PRICE : '0',
            QUANTITY : '0',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CHANGE_DATE : moment(new Date(0)).format("DD/MM/YYYY HH:mm:ss"),
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
                    "((DEPOT = @DEPOT) OR (@DEPOT = '')) AND " +
                    "((START_DATE >= @START_DATE) OR (CONVERT(NVARCHAR(10),@START_DATE,112) = '19700101')) AND " +
                    "((FINISH_DATE <= @FINISH_DATE) OR (CONVERT(NVARCHAR(10),@FINISH_DATE,112) = '19700101')) AND " + 
                    "((QUANTITY = @QUANTITY) OR (@QUANTITY = -1)) AND " +
                    "((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND " + 
                    "((CUSTOMER_GUID = @CUSTOMER_GUID) OR (@CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['ITEM_GUID:string|50','ITEM_CODE:string|25','TYPE:int','DEPOT:string|25','START_DATE:date','FINISH_DATE:date',
                     'QUANTITY:float','CUSTOMER_CODE:string|25','CUSTOMER_GUID:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@PRICE = @PPRICE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@CUSTOMER = @PCUSTOMER ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PDEPOT:string|25','PSTART_DATE:date','PFINISH_DATE:date',
                     'PPRICE:float','PQUANTITY:float','PCUSTOMER:string|50'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','DEPOT','START_DATE','FINISH_DATE','PRICE','QUANTITY','CUSTOMER_GUID']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_PRICE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@ITEM = @PITEM, " + 
                    "@DEPOT = @PDEPOT, " + 
                    "@START_DATE = @PSTART_DATE, " + 
                    "@FINISH_DATE = @PFINISH_DATE, " + 
                    "@PRICE = @PPRICE, " + 
                    "@QUANTITY = @PQUANTITY, " + 
                    "@CUSTOMER = @PCUSTOMER ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PITEM:string|50','PDEPOT:string|25','PSTART_DATE:date','PFINISH_DATE:date',
                     'PPRICE:float','PQUANTITY:float','PCUSTOMER:string|50'],
            dataprm : ['GUID','CUSER','TYPE','ITEM_GUID','DEPOT','START_DATE','FINISH_DATE','PRICE','QUANTITY','CUSTOMER_GUID']
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
                DEPOT : '',
                START_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
                FINISH_DATE : moment(new Date(0)).format("DD/MM/YYYY"),
                QUANTITY : -1,
                CUSTOMER_CODE : '',
                CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            }          

            if(arguments.length > 0)
            {
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.DEPOT = typeof arguments[0].DEPOT == 'undefined' ? '' : arguments[0].DEPOT;
                tmpPrm.START_DATE = typeof arguments[0].START_DATE == 'undefined' ? moment(new Date(0)).format("DD/MM/YYYY")  : arguments[0].START_DATE;
                tmpPrm.FINISH_DATE = typeof arguments[0].FINISH_DATE == 'undefined' ? moment(new Date(0)).format("DD/MM/YYYY")  : arguments[0].FINISH_DATE;
                tmpPrm.QUANTITY = typeof arguments[0].QUANTITY == 'undefined' ? -1 : arguments[0].QUANTITY;
                tmpPrm.CUSTOMER_CODE = typeof arguments[0].CUSTOMER_CODE == 'undefined' ? '' : arguments[0].CUSTOMER_CODE;
                tmpPrm.CUSTOMER_GUID = typeof arguments[0].CUSTOMER_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER_GUID;
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
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            BARCODE : '',
            TYPE : 0,
            TYPE_NAME : 'EAN13',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            UNIT_GUID : '00000000-0000-0000-0000-000000000000',
            UNIT_ID : '001',
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
                    "WHERE ((BARCODE = @BARCODE) OR (@BARCODE = '')) AND " + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) AND " + 
                    "((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '00000000-0000-0000-0000-000000000000')) AND " + 
                    "((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = ''))",
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
           
            if(arguments.length > 0)
            {
                tmpPrm.BARCODE = typeof arguments[0].BARCODE == 'undefined' ? '' : arguments[0].BARCODE;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;                                
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
        this.empty = {
            GUID:'00000000-0000-0000-0000-000000000000',
            CUSER: this.core.auth.data.CODE,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',            
            CUSTOMER_CODE : '',            
            CUSTOMER_NAME : '',
            MULTICODE : '',
            CUSTOMER_PRICE_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_PRICE : '0',
            CUSTOMER_PRICE_DATE : moment(new Date(0)).format("DD/MM/YYYY HH:mm:ss"),
            CUSTOMER_PRICE_USER_NAME : this.core.auth.data.NAME
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
                    "((MULTICODE = @MULTICODE) OR (@MULTICODE = ''))",
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
            CUSER: this.core.auth.data.CODE,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            IMAGE : ''
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
                    "@IMAGE = @PIMAGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PIMAGE:string|max'],
            dataprm : ['GUID','CUSER','ITEM_GUID','IMAGE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_ITEM_IMAGE_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@ITEM = @PITEM, " + 
                    "@IMAGE = @PIMAGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PITEM:string|50','PIMAGE:string|max'],
            dataprm : ['GUID','CUSER','ITEM_GUID','IMAGE']
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
