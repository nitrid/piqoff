import { core, datatable } from "../../../core/core.js";

export class itemsCls
{
    constructor()
    {
        this.core = core.instance;
        this.data = new datatable(this.core.sql)
    }
    load(pCode)
    {
        return new Promise(async resolve => 
        {
            this.data.selectCmd = 
            {
                query : "SELECT * FROM [dbo].[ITEMS_VW_01] WHERE ((CODE = @CODE) OR (@CODE = ''))",
                param : ['CODE:string|25'],
                value : [pCode]
            }
            
            await this.data.refresh();
            resolve();    
        });
    }
}