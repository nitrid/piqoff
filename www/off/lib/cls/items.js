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
    }
    //#endregion
    dt(pName)
    {
        return this.ds.get(pName);
    }
    addEmpty()
    {
        if(typeof this.dt('ITEMS') == 'undefined')
        {
            return;
        }

        if(typeof arguments.length > 0)
        {
            this.dt('ITEMS').push(arguments[0])
        }
        else
        {
            this.dt('ITEMS').push(this.empty)
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
                tmpPrm = arguments[0]
            }

            this.ds.get('ITEMS').selectCmd.value = [tmpPrm.CODE]
              
            await this.ds.get('ITEMS').refresh();
            
            if(this.ds.get('ITEMS').length > 0)
            {
                await this.itemUnit.load({ITEM_GUID:this.ds.get('ITEMS')[0].GUID})
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
            TYPE : 0,
            ITEM : '',
            NAME : 'Unité',
            FACTOR : '0',
            WEIGHT : '0',
            VOLUME : '0',
            WIDTH : '0',
            HEIGHT : '0',
            SIZE : '0'
        }

        this._initDs();
    }    
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('ITEM_UNIT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[ITEM_UNIT_VW_01] WHERE ((NAME = @NAME) OR (@NAME = '')) AND ((ITEM_GUID = @ITEM_GUID) OR (@ITEM_GUID = '')) AND ((ITEM_CODE = @ITEM_CODE) OR (@ITEM_CODE = ''))",
            param : ['NAME:string|50','ITEM_GUID:string|50','ITEM_CODE:string|25']
        }

        this.ds.add(tmpDt);
    }
    //#endregion
    dt(pName)
    {
        return this.ds.get(pName);
    }
    addEmpty()
    {
        if(typeof this.dt('ITEM_UNIT') == 'undefined')
        {
            return;
        }

        if(arguments.length > 0)
        {
            this.dt('ITEM_UNIT').push(arguments[0])
        }
        else
        {
            this.dt('ITEM_UNIT').push(this.empty)
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {NAME:'',ITEM_GUID:'',ITEM_CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {NAME:'',ITEM_GUID:'',ITEM_CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.NAME = typeof arguments[0].NAME == 'undefined' ? '' : arguments[0].NAME;
                tmpPrm.ITEM_GUID = typeof arguments[0].ITEM_GUID == 'undefined' ? '' : arguments[0].ITEM_GUID;
                tmpPrm.ITEM_CODE = typeof arguments[0].ITEM_CODE == 'undefined' ? '' : arguments[0].ITEM_CODE;
            }

            this.ds.get('ITEM_UNIT').selectCmd.value = [tmpPrm.NAME,tmpPrm.ITEM_GUID,tmpPrm.ITEM_CODE]
              
            await this.ds.get('ITEM_UNIT').refresh();
            
            resolve(this.ds.get('ITEM_UNIT'));    
        });
    }
}