import { core,dataset,datatable } from "../../core/core.js";
import * as JsStore from 'jsstore';

export default class transferCls
{
    constructor()
    {
        core.instance.local.init({name:'POS',tables: this.tableSchema()})
        
    }
    tableSchema()
    {
        let UserTbl =
        {
            name : "USER",
            columns :
            {
                GUID : {dataType: "string"},
                CDATE : {dataType: "date_time"},
                CUSER : {dataType: "string"},
                LDATE : {dataType: "date_time"},
                LUSER : {dataType: "string"},
                CODE : {dataType: "string"},
                NAME : {dataType: "string"},
                PWD : {dataType: "string"},
                ROLE : {dataType: "string"},
                SHA : {dataType: "string"},
                CARDID : {dataType: "string"},
                STATUS : {dataType: "boolean"},
            }
        }     
        let AccessTbl =
        {
            name : "ACCESS",
            columns :
            {
                GUID : {dataType: "string"},
                ID : {dataType: "string"},
                VALUE : {dataType: "string"},
                SPECIAL : {dataType: "string"},
                USERS : {dataType: "string"},
                PAGE : {dataType: "string"},
                ELEMENT : {dataType: "string"},
                APP : {dataType: "string"},
            }
        }  
        let ParamTbl =
        {
            name : "PARAM",
            columns :
            {
                GUID : {dataType: "string"},
                TYPE : {dataType: "number"},
                ID : {dataType: "string"},
                VALUE : {dataType: "string"},
                SPECIAL : {dataType: "string"},
                USERS : {dataType: "string"},
                PAGE : {dataType: "string"},
                ELEMENT : {dataType: "string"},
                APP : {dataType: "string"},
            }
        }

        return [UserTbl,AccessTbl,ParamTbl]
    }
    async dropDb()
    {
        await core.instance.local.dropDb()
    }
}