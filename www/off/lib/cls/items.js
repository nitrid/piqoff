import { core,dataset,datatable } from "../../../core/core.js";

export class itemsCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            CUSER : '',
            TYPE : '0',
            SPECIAL : '',
            CODE : '',
            NAME : '',
            SNAME : '',
            VAT : 5.5,
            COST_PRICE : '0',
            MIN_PRICE : '0',
            MAX_PRICE : '0',
            STATUS : true,
            MAIN_GRP : '',
            SUB_GRP : '',
            ORGINS_GRP : '',
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
        this.ds.add(tmpDt);
        this.ds.add(this.itemUnit.dt('ITEM_UNIT'))
        this.ds.add(this.itemPrice.dt('ITEM_PRICE'))
        this.ds.add(this.itemBarcode.dt('ITEM_BARCODE'))
        this.ds.add(this.itemMultiCode.dt('ITEM_MULTICODE'))
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

        if(typeof arguments.length > 0)
        {
            this.dt('ITEMS').push({...arguments[0]})
        }
        else
        {
            this.dt('ITEMS').push({...this.empty})
        }
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
            }
            resolve(this.ds.get('ITEMS'));    
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
            GUID:'00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            ID : '0',
            NAME : 'Unité',
            FACTOR : '0',
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

        if(arguments.length > 0)
        {
            this.dt('ITEM_UNIT').push({...arguments[0]})
        }
        else
        {
            this.dt('ITEM_UNIT').push({...this.empty})
        }
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
}
export class itemPriceCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID:'00000000-0000-0000-0000-000000000000',
            TYPE : 0,
            TYPE_NAME : '',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            DEPOT : '0',
            START_DATE : moment(new Date(0)).format("DD.MM.YYYY"),
            FINISH_DATE : moment(new Date(0)).format("DD.MM.YYYY"),
            PRICE : '0',
            QUANTITY : '0',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CHANGE_DATE : moment(new Date(0)).format("DD.MM.YYYY"),
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_PRICE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_PRICE_VW_02] " + 
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

        if(arguments.length > 0)
        {
            this.dt('ITEM_PRICE').push({...arguments[0]})
        }
        else
        {
            this.dt('ITEM_PRICE').push({...this.empty})
        }
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
                START_DATE : moment(new Date(0)).format("DD.MM.YYYY"),
                FINISH_DATE : moment(new Date(0)).format("DD.MM.YYYY"),
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
                tmpPrm.START_DATE = typeof arguments[0].START_DATE == 'undefined' ? moment(new Date(0)).format("DD.MM.YYYY")  : arguments[0].START_DATE;
                tmpPrm.FINISH_DATE = typeof arguments[0].FINISH_DATE == 'undefined' ? moment(new Date(0)).format("DD.MM.YYYY")  : arguments[0].FINISH_DATE;
                tmpPrm.QUANTITY = typeof arguments[0].QUANTITY == 'undefined' ? -1 : arguments[0].QUANTITY;
                tmpPrm.CUSTOMER_CODE = typeof arguments[0].CUSTOMER_CODE == 'undefined' ? '' : arguments[0].CUSTOMER_CODE;
                tmpPrm.CUSTOMER_GUID = typeof arguments[0].CUSTOMER_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER_GUID;
            }
            this.ds.get('ITEM_PRICE').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('ITEM_PRICE').refresh();
            resolve(this.ds.get('ITEM_PRICE'));    
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
            GUID:'00000000-0000-0000-0000-000000000000',
            BARCODE : '',
            TYPE : 0,
            TYPE_NAME : '',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            UNIT_NAME : '',
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

        if(arguments.length > 0)
        {
            this.dt('ITEM_BARCODE').push({...arguments[0]})
        }
        else
        {
            this.dt('ITEM_BARCODE').push({...this.empty})
        }
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
}
export class itemMultiCodeCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID:'00000000-0000-0000-0000-000000000000',
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',            
            ITEM_CODE : '',            
            ITEM_NAME : '',
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',            
            CUSTOMER_CODE : '',            
            CUSTOMER_NAME : '',
            MULTICODE : '',
            CUSTOMER_ITEM_PRICE : '0',
            CUSTOMER_ITEM_PRICE_DATE : moment(new Date(0)).format("DD.MM.YYYY")
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

        if(arguments.length > 0)
        {
            this.dt('ITEM_MULTICODE').push({...arguments[0]})
        }
        else
        {
            this.dt('ITEM_MULTICODE').push({...this.empty})
        }
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

        if(arguments.length > 0)
        {
            this.dt('UNIT').push({...arguments[0]})
        }
        else
        {
            this.dt('UNIT').push({...this.empty})
        }
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
}
