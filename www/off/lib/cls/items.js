import { core,dataset,datatable } from "../../../core/core.js";

export class itemsCls
{
    constructor()
    {
        this.core = core.instance;
        this.data = new dataset();
    }
    getItems()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {CODE:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm = arguments[0]
            }

            let tmpItemDt = new datatable('ITEMS');            
            tmpItemDt.selectCmd = 
            {
                query : "SELECT * FROM [dbo].[ITEMS_VW_01] WHERE ((CODE = @CODE) OR (@CODE = ''))",
                param : ['CODE:string|25'],
                value : [tmpPrm.CODE]
            }
              
            await tmpItemDt.refresh();
                                    
            this.data.add(tmpItemDt);
            resolve(tmpItemDt);    
        });
    }
}