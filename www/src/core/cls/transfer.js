import { core,dataset,datatable } from "../core.js";
import { itemsCls } from "./items.js";

export class transferCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.tmpItems = new itemsCls()
        this.tmpItems.transfer('get');
    }
    //#region Private
    _tblItemSchema()
    {
        return {
            name : "ITEMS",
            columns : 
            {
                GUID : {dataType:"string"},
                CDATE : {dataType:"date_time"},
                CUSER : {dataType:"string"},
                LDATE : {dataType:"date_time"},
                LUSER : {dataType:"string"},
                TYPE : {dataType:"string"},
                SPECIAL : {dataType:"string"},
                CODE : {dataType:"string"},
                NAME : {dataType:"string"},
                SNAME : {dataType:"string"},
                VAT : {dataType:"number"},
                COST_PRICE : {dataType:"number"},
                MIN_PRICE : {dataType:"number"},
                MAX_PRICE : {dataType:"number"},
                STATUS : {dataType:"boolean"},
                MAIN_GRP : {dataType:"string"},
                MAIN_GRP_NAME : {dataType:"string"},
                SUB_GRP : {dataType:"string"},
                ORGINS : {dataType:"string"},
                ORGINS_NAME : {dataType:"string"},
                SECTOR : {dataType:"string"},
                RAYON : {dataType:"string"},
                SHELF : {dataType:"string"},
                WEIGHING : {dataType:"boolean"},
                SALE_JOIN_LINE : {dataType:"boolean"},
                TICKET_REST: {dataType:"boolean"},
            } 
        }
    }
    //#endregion
    initDb()
    {

    }
}