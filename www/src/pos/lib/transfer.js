import { core,dataset,datatable } from "../../core/core.js";
import * as JsStore from 'jsstore';

export default class transferCls
{
    constructor()
    {
        this.core = core.instance
    }
    init(pDbName)
    {
        return new Promise(async resolve => 
        {
            await this.core.local.init({name:pDbName,tables: this.tableSchema()})       
            resolve()
        });
    }
    tableSchema()
    {
        let tmpTbl =
        [
            //USER
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
                    ZTATUS : {dataType: "boolean"},
                }
            },
            //ACCESS
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
            },
            //PARAM
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
        ]

        return tmpTbl
    }
    fetchToSql()
    {
        return new Promise(async resolve => 
        {
            let tmpValues = [];
            let tmpData = await this.core.sql.execute({query : "SELECT * FROM PARAM"})
            let tmpQuery =
            {
                type : "insert",
                into : "PARAM",
                values : 
                [
                    {
                        GUID : "{map:'GUID'}",
                        // TYPE : {map:'TYPE'},
                        // ID : {map:'ID'},
                        // VALUE : {map:'VALUE'},
                        // SPECIAL : {map:'SPECIAL'},
                        // USERS : {map:'USERS'},
                        // PAGE : {map:'PAGE'},
                        // ELEMENT : {map:'ELEMENT'},
                        // APP : {map:'APP'},
                    }
                ]
            }
            await this.core.local.insert(tmpQuery)
            // if(typeof tmpData.result.err == 'undefined')
            // {
            //     tmpData = tmpData.result.recordset                
            //     for (let i = 0; i < tmpData.length; i++) 
            //     {
            //         let tmpLocQuery = JSON.parse(JSON.stringify(tmpQuery))
            //         for (let x = 0; x < Object.keys(tmpLocQuery.values[0]).length; x++) 
            //         {
            //             let tmpKey = Object.keys(tmpLocQuery.values[0])[x]
            //             let tmpMap = Object.values(tmpLocQuery.values[0])[x]
            //             if(typeof tmpMap.map != 'undefined')
            //             {
            //                 tmpLocQuery.values[0][tmpKey] = tmpData[i][tmpMap.map]
            //             }
            //             tmpValues.push(tmpLocQuery)
            //         }
            //     } 
            // }
            // console.log(tmpValues)
            // tmpQuery.values = tmpValues
            // await this.core.local.insert(tmpQuery)

            resolve()
        });
    }
    sendToSql()
    {
        return new Promise(async resolve => 
        {

        });
    }
    dropDb(pDbName)
    {
        return new Promise(async resolve => 
        {
            await this.core.local.dropDb()    
            await this.core.local.init({name:pDbName,tables: this.tableSchema()})
            resolve()
        });
    }
}