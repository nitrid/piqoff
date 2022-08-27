import { core,dataset,datatable } from "../../core/core.js";

export default class transferCls
{
    constructor()
    {
        this.core = core.instance
        this.listeners = Object();
    }
    //#region  "EVENT"
    on(pEvt, pCallback) 
    {
        if (!this.listeners.hasOwnProperty(pEvt))
            this.listeners[pEvt] = Array();
            this.listeners[pEvt].push(pCallback); 
    }
    emit(pEvt, pParams)
    {
        if (pEvt in this.listeners) 
        {
            let callbacks = this.listeners[pEvt];
            for (var x in callbacks)
            {
                callbacks[x](pParams);
            }
        } 
    }
    //#endregion
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
            //USERS
            {
                name : "USERS",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
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
            },
            //ACCESS
            {
                name : "ACCESS",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
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
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
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
            },
            //ITEMS_VW_01
            {
                name : "ITEMS_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    TYPE : {dataType: "string"},
                    SPECIAL : {dataType: "string"},
                    CODE : {dataType: "string"},
                    NAME : {dataType: "string"},
                    SNAME : {dataType: "string"},
                    VAT : {dataType: "number"},
                    COST_PRICE : {dataType: "number"},
                    MIN_PRICE : {dataType: "number"},
                    MAX_PRICE : {dataType: "number"},
                    STATUS : {dataType: "boolean"},
                    SUGAR_RATE : {dataType: "number"},
                    MAIN_GRP : {dataType: "string"},
                    MAIN_GRP_NAME : {dataType: "string"},
                    SUB_GRP : {dataType: "string"},
                    ORGINS : {dataType: "string"},
                    ORGINS_NAME : {dataType: "string"},
                    RAYON : {dataType: "string"},
                    SHELF : {dataType: "string"},
                    SECTOR : {dataType: "string"},
                    SALE_JOIN_LINE : {dataType: "boolean"},
                    TICKET_REST : {dataType: "boolean"},
                    WEIGHING : {dataType: "boolean"},
                    PRICE : {dataType: "number"},
                }
            },
            //ITEMS_POS_VW_01
            {
                name : "ITEMS_POS_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    SPECIAL : {dataType: "string"},
                    CODE : {dataType: "string"},
                    NAME : {dataType: "string"},
                    SNAME : {dataType: "string"},
                    VAT : {dataType: "number"},
                    VAT_TYPE : {dataType: "string"},
                    COST_PRICE : {dataType: "number"},
                    MIN_PRICE : {dataType: "number"},
                    MAX_PRICE : {dataType: "number"},
                    SALE_JOIN_LINE : {dataType: "boolean"},
                    TICKET_REST : {dataType: "boolean"},
                    WEIGHING : {dataType: "boolean"},
                    BARCODE : {dataType: "string"},
                    BARCODE_GUID : {dataType: "string"},
                    UNIT_GUID : {dataType: "string"},
                    UNIT_ID : {dataType: "string"},
                    UNIT_NAME : {dataType: "string"},
                    UNIT_SHORT : {dataType: "string"},
                    UNIT_FACTOR : {dataType: "number"},
                    UNIQ_CODE : {dataType: "string"},
                    UNIQ_QUANTITY : {dataType: "number"},
                    UNIQ_PRICE : {dataType: "number"},
                    STATUS : {dataType: "boolean"},
                    PRICE : {dataType: "number"},
                    INPUT : {dataType: "string"},
                }
            },
            //ITEMS_BARCODE_MULTICODE_VW_01
            {
                name : "ITEMS_BARCODE_MULTICODE_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    TYPE : {dataType: "string"},
                    SPECIAL : {dataType: "string"},
                    CODE : {dataType: "string"},
                    NAME : {dataType: "string"},
                    SNAME : {dataType: "string"},
                    VAT : {dataType: "number"},
                    COST_PRICE : {dataType: "number"},
                    MIN_PRICE : {dataType: "number"},
                    MAX_PRICE : {dataType: "number"},
                    STATUS : {dataType: "boolean"},
                    MAIN_GRP : {dataType: "string"},
                    MAIN_GRP_NAME : {dataType: "string"},
                    SUB_GRP : {dataType: "string"},
                    ORGINS : {dataType: "string"},
                    ITEMS_GRP_GUID : {dataType: "string"},
                    ORGINS_NAME : {dataType: "string"},
                    RAYON : {dataType: "string"},
                    SHELF : {dataType: "string"},
                    SECTOR : {dataType: "string"},
                    SALE_JOIN_LINE : {dataType: "boolean"},
                    TICKET_REST : {dataType: "boolean"},
                    WEIGHING : {dataType: "boolean"},
                    BARCODE : {dataType: "string"},
                    BARCODE_GUID : {dataType: "string"},
                    UNIT_ID : {dataType: "string"},
                    UNIT_NAME : {dataType: "string"},
                    UNIT_FACTOR : {dataType: "number"},
                    MULTICODE : {dataType: "string"},
                    CUSTOMER_GUID : {dataType: "string"},
                    CUSTOMER_CODE : {dataType: "string"},
                    CUSTOMER_NAME : {dataType: "string"},
                    CUSTOMER_PRICE : {dataType: "number"},
                    CUSTOMER_PRICE_GUID : {dataType: "string"},
                    PRICE_SALE : {dataType: "number"},
                    PRICE_SALE_GUID : {dataType: "string"},
                }
            },
            //CHEQPAY_VW_01
            {
                name : "CHEQPAY_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    TYPE : {dataType: "number"},
                    DOC : {dataType: "string"},
                    CODE : {dataType: "string"},
                    AMOUNT : {dataType: "number"},
                    STATUS : {dataType: "number"},
                    REFERENCE : {dataType: "string"},
                    RANDOM1 : {dataType: "string"},
                    PRICE : {dataType: "string"},
                    TICKET_TYPE : {dataType: "string"},
                    TICKET_NAME : {dataType: "string"},
                    RANDOM2 : {dataType: "string"},
                    YEAR : {dataType: "string"},
                    EXDAY : {dataType: "number"},
                }
            },
            //CUSTOMER_VW_02
            {
                name : "CUSTOMER_VW_02",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string",primaryKey: true},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    CODE : {dataType: "string"},
                    TITLE : {dataType: "string"},
                    TYPE_NAME : {dataType: "string"},
                    GENUS_NAME : {dataType: "string"},
                    CUSTOMER_TYPE : {dataType: "number"},
                    GENUS : {dataType: "number"},
                    CUSTOMER_GRP : {dataType: "string"},
                    WEB : {dataType: "string"},
                    NOTE : {dataType: "string"},
                    SIRET_ID : {dataType: "string"},
                    APE_CODE : {dataType: "string"},
                    TAX_OFFICE : {dataType: "string"},
                    TAX_NO : {dataType: "string"},
                    INT_VAT_NO : {dataType: "string"},
                    TAX_TYPE : {dataType: "number"},
                    ADRESS : {dataType: "string"},
                    ZIPCODE : {dataType: "string"},
                    COUNTRY : {dataType: "string"},
                    CITY : {dataType: "string"},
                    NAME : {dataType: "string"},
                    LAST_NAME : {dataType: "string"},
                    PHONE1 : {dataType: "string"},
                    PHONE2 : {dataType: "string"},
                    GSM_PHONE : {dataType: "string"},
                    OTHER_PHONE : {dataType: "string"},
                    EMAIL : {dataType: "string"},
                    IBAN : {dataType: "string"},
                    CUSTOMER_POINT : {dataType: "number"},
                }
            },
            //POS_VW_01
            {
                name : "POS_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    DEVICE : {dataType: "string"},
                    DEPOT_GUID : {dataType: "string"},
                    DEPOT_CODE : {dataType: "string"},
                    DEPOT_NAME : {dataType: "string"},
                    TYPE : {dataType: "number"},
                    DOC_DATE : {dataType: "date_time"},
                    CUSTOMER_GUID : {dataType: "string"},
                    CUSTOMER_CODE : {dataType: "string"},
                    CUSTOMER_NAME : {dataType: "string"},
                    CUSTOMER_POINT : {dataType: "number"},
                    FAMOUNT : {dataType: "number"},
                    AMOUNT : {dataType: "number"},
                    DISCOUNT : {dataType: "number"},
                    LOYALTY : {dataType: "number"},
                    VAT : {dataType: "number"},
                    TOTAL : {dataType: "number"},
                    TICKET : {dataType: "string"},
                    REBATE_CHEQPAY : {dataType: "string"},
                    STATUS : {dataType: "number"},
                    DESCRIPTION : {dataType: "string"},
                    REF : {dataType: "string"},
                    DELETED : {dataType: "boolean"},
                }
            },
            //POS_SALE_VW_01
            {
                name : "POS_SALE_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    POS_GUID : {dataType: "string"},
                    DEVICE : {dataType: "string"},
                    DEPOT_GUID : {dataType: "string"},
                    DEPOT_CODE : {dataType: "string"},
                    DEPOT_NAME : {dataType: "string"},
                    TYPE : {dataType: "number"},
                    DOC_DATE : {dataType: "date_time"},
                    CUSTOMER_GUID : {dataType: "string"},
                    CUSTOMER_CODE : {dataType: "string"},
                    CUSTOMER_NAME : {dataType: "string"},
                    LINE_NO : {dataType: "number"},
                    ITEM_GUID : {dataType: "string"},
                    ITEM_CODE : {dataType: "string"},
                    ITEM_NAME : {dataType: "string"},
                    ITEM_SNAME : {dataType: "string"},
                    ITEM_GRP_CODE : {dataType: "string"},
                    ITEM_GRP_NAME : {dataType: "string"},
                    COST_PRICE : {dataType: "number"},
                    MIN_PRICE : {dataType: "number"},
                    MAX_PRICE : {dataType: "number"},
                    TICKET_REST : {dataType: "boolean"},
                    INPUT : {dataType: "string"},
                    BARCODE_GUID : {dataType: "string"},
                    BARCODE : {dataType: "string"},
                    UNIT_GUID : {dataType: "string"},
                    UNIT_NAME : {dataType: "string"},
                    UNIT_FACTOR : {dataType: "number"},
                    UNIT_SHORT : {dataType: "string"},
                    QUANTITY : {dataType: "number"},
                    PRICE : {dataType: "number"},
                    FAMOUNT : {dataType: "number"},
                    AMOUNT : {dataType: "number"},
                    DISCOUNT : {dataType: "number"},
                    LOYALTY : {dataType: "number"},
                    VAT : {dataType: "number"},
                    VAT_RATE : {dataType: "number"},
                    VAT_TYPE : {dataType: "string"},
                    TOTAL : {dataType: "number"},
                    SUBTOTAL : {dataType: "number"},
                    PROMO_TYPE : {dataType: "number"},
                    GRAND_AMOUNT : {dataType: "number"},
                    GRAND_DISCOUNT : {dataType: "number"},
                    GRAND_LOYALTY : {dataType: "number"},
                    GRAND_VAT : {dataType: "number"},
                    GRAND_TOTAL : {dataType: "number"},
                    STATUS : {dataType: "number"},
                    REBATE_TICKET : {dataType: "string"},
                    DELETED : {dataType: "boolean"},
                }
            },
            //POS_PAYMENT_VW_01
            {
                name : "POS_PAYMENT_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    LUSER_NAME : {dataType: "string"},
                    POS_GUID : {dataType: "string"},
                    DEVICE : {dataType: "string"},
                    DEPOT_GUID : {dataType: "string"},
                    DEPOT_CODE : {dataType: "string"},
                    DEPOT_NAME : {dataType: "string"},
                    TYPE : {dataType: "number"},
                    DOC_DATE : {dataType: "date_time"},
                    CUSTOMER_GUID : {dataType: "string"},
                    CUSTOMER_CODE : {dataType: "string"},
                    CUSTOMER_NAME : {dataType: "string"},
                    PAY_TYPE : {dataType: "number"},
                    PAY_TYPE_NAME : {dataType: "string"},
                    LINE_NO : {dataType: "number"},
                    AMOUNT : {dataType: "number"},
                    CHANGE : {dataType: "number"},
                    TICKET_PLUS : {dataType: "number"},
                    GRAND_AMOUNT : {dataType: "number"},
                    GRAND_DISCOUNT : {dataType: "number"},
                    GRAND_LOYALTY : {dataType: "number"},
                    GRAND_VAT : {dataType: "number"},
                    GRAND_TOTAL : {dataType: "number"},
                    STATUS : {dataType: "number"},
                    DELETED : {dataType: "boolean"},
                }
            },
            //PLU_VW_01
            {
                name : "PLU_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    TYPE : {dataType: "number"},
                    TYPE_NAME : {dataType: "string"},
                    NAME : {dataType: "string"},
                    LINK : {dataType: "string"},
                    LINK_CODE : {dataType: "string"},
                    LINK_NAME : {dataType: "string"},
                    LOCATION : {dataType: "number"},
                    GROUP_INDEX : {dataType: "number"},
                }
            },
            //PLU_IMAGE_VW_01
            {
                name : "PLU_IMAGE_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    MAIN_CODE : {dataType: "string"},
                    MAIN_NAME : {dataType: "string"},
                    ORGINS_CODE : {dataType: "string"},
                    ORGINS_NAME : {dataType: "string"},
                    ITEM_GUID : {dataType: "string"},
                    ITEM_CODE : {dataType: "string"},
                    ITEM_NAME : {dataType: "string"},
                    PRICE : {dataType: "number"},
                    IMAGE : {dataType: "string"},
                }
            },
            //POS_EXTRA_VW_01
            {
                name : "POS_EXTRA_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    CUSER_NAME : {dataType: "string"},
                    TAG : {dataType: "string"},
                    POS_GUID : {dataType: "string"},
                    LINE_NO : {dataType: "number"},
                    DESCRIPTION : {dataType: "string"},
                }
            },
            //POS_DEVICE_VW_01
            {
                name : "POS_DEVICE_VW_01",
                columns :
                {
                    DBID : {dataType:"number",primaryKey: true, autoIncrement: true},
                    GUID : {dataType: "string"},
                    CDATE : {dataType: "date_time"},
                    CUSER : {dataType: "string"},
                    LDATE : {dataType: "date_time"},
                    LUSER : {dataType: "string"},
                    CODE : {dataType: "string"},
                    NAME : {dataType: "string"},
                    LCD_PORT : {dataType: "string"},
                    SCALE_PORT : {dataType: "string"},
                    PAY_CARD_PORT : {dataType: "string"},
                    PRINT_DESING : {dataType: "string"},
                    SAFE_GUID : {dataType: "string"},
                }
            }
        ]

        return tmpTbl
    }
    fetchSchema()
    {
        let tmpSchema = 
        [
            //USER
            {
                from : 
                {
                    query : "SELECT * FROM USERS"
                },
                to : 
                {
                    into : "USERS",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},CODE : {map:'CODE'},NAME : {map:'NAME'},
                    PWD : {map:'PWD'},ROLE : {map:'ROLE'},SHA : {map:'SHA'},CARDID : {map:'CARDID'},STATUS : {map:'STATUS'}}]
                }
            },
            //ACCESS
            {
                from : 
                {
                    query : "SELECT * FROM ACCESS"
                },
                to : 
                {
                    into : "ACCESS",
                    values : [{GUID : {map:'GUID'},ID : {map:'ID'},VALUE : {map:'VALUE'},SPECIAL : {map:'SPECIAL'},USERS : {map:'USERS'},PAGE : {map:'PAGE'},ELEMENT : {map:'ELEMENT'},APP : {map:'APP'}}]
                }
            },
            //PARAM
            {
                from : 
                {
                    query : "SELECT * FROM PARAM"
                },
                to : 
                {
                    into : "PARAM",
                    values : [{GUID : {map:'GUID'},TYPE : {map:'TYPE'},ID : {map:'ID'},VALUE : {map:'VALUE'},SPECIAL : {map:'SPECIAL'},USERS : {map:'USERS'},PAGE : {map:'PAGE'},ELEMENT : {map:'ELEMENT'},APP : {map:'APP'}}]
                }
            },
            //ITEMS_VW_01
            {
                from : 
                {
                    query : "SELECT *,dbo.FN_PRICE_SALE(GUID,1,GETDATE()) AS PRICE FROM ITEMS_VW_01"
                },
                to : 
                {
                    into : "ITEMS_VW_01",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},SPECIAL : {map:'SPECIAL'},CODE : {map:'CODE'},NAME : {map:'NAME'},SNAME : {map:'SNAME'},VAT : {map:'VAT'},COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},STATUS : {map:'STATUS'},SUGAR_RATE : {map:'SUGAR_RATE'},MAIN_GRP : {map:'MAIN_GRP'},MAIN_GRP_NAME : {map:'MAIN_GRP_NAME'},
                    SUB_GRP : {map:'SUB_GRP'},ORGINS : {map:'ORGINS'},ORGINS_NAME : {map:'ORGINS_NAME'},RAYON : {map:'RAYON'},SHELF : {map:'SHELF'},SECTOR : {map:'SECTOR'},SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},
                    TICKET_REST : {map:'TICKET_REST'},WEIGHING : {map:'WEIGHING'},PRICE : {map:'PRICE'}}]
                }
            },
            //ITEMS_POS_VW_01
            {
                from : 
                {
                    query : "SELECT *,dbo.FN_PRICE_SALE(GUID,1,GETDATE()) AS PRICE FROM ITEMS_POS_VW_01"
                },
                to : 
                {
                    into : "ITEMS_POS_VW_01",
                    values : [{GUID : {map:'GUID'},SPECIAL : {map:'SPECIAL'},CODE : {map:'CODE'},NAME : {map:'NAME'},SNAME : {map:'SNAME'},VAT : {map:'VAT'},VAT_TYPE : {map:'VAT_TYPE'},COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},TICKET_REST : {map:'TICKET_REST'},WEIGHING : {map:'WEIGHING'},BARCODE : {map:'BARCODE'},
                    BARCODE_GUID : {map:'BARCODE_GUID'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_ID : {map:'UNIT_ID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_SHORT : {map:'UNIT_SHORT'},UNIT_FACTOR : {map:'UNIT_FACTOR'},
                    UNIQ_CODE : {map:'UNIQ_CODE'},UNIQ_QUANTITY : {map:'UNIQ_QUANTITY'},UNIQ_PRICE : {map:'UNIQ_PRICE'},STATUS : {map:'STATUS'},PRICE : {map:'PRICE'},INPUT : ''}]
                }
            },
            //ITEMS_BARCODE_MULTICODE_VW_01
            {
                from : 
                {
                    query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01"
                },
                to : 
                {
                    into : "ITEMS_BARCODE_MULTICODE_VW_01",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},SPECIAL : {map:'SPECIAL'},CODE : {map:'CODE'},NAME : {map:'NAME'},SNAME : {map:'SNAME'},VAT : {map:'VAT'},COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},STATUS : {map:'STATUS'},MAIN_GRP : {map:'MAIN_GRP'},MAIN_GRP_NAME : {map:'MAIN_GRP_NAME'},SUB_GRP : {map:'SUB_GRP'},
                    ORGINS : {map:'ORGINS'},ITEMS_GRP_GUID : {map:'ITEMS_GRP_GUID'},ORGINS_NAME : {map:'ORGINS_NAME'},RAYON : {map:'RAYON'},SHELF : {map:'SHELF'},SECTOR : {map:'SECTOR'},
                    SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},TICKET_REST : {map:'TICKET_REST'},WEIGHING : {map:'WEIGHING'},BARCODE : {map:'BARCODE'},BARCODE_GUID : {map:'BARCODE_GUID'},UNIT_ID : {map:'UNIT_ID'},
                    UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},MULTICODE : {map:'MULTICODE'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},
                    CUSTOMER_NAME : {map:'CUSTOMER_NAME'},CUSTOMER_PRICE : {map:'CUSTOMER_PRICE'},CUSTOMER_PRICE_GUID : {map:'CUSTOMER_PRICE_GUID'},PRICE_SALE : {map:'PRICE_SALE'},PRICE_SALE_GUID : {map:'PRICE_SALE_GUID'}}]
                }
            },
            //CHEQPAY_VW_01
            {
                from : 
                {
                    query : "SELECT *,DATEDIFF(DAY,CDATE,GETDATE()) AS EXDAY FROM CHEQPAY_VW_01"
                },
                to : 
                {
                    into : "CHEQPAY_VW_01",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},DOC : {map:'DOC'},CODE : {map:'CODE'},AMOUNT : {map:'AMOUNT'},STATUS : {map:'STATUS'},REFERENCE : {map:'REFERENCE'},RANDOM1 : {map:'RANDOM1'},
                    PRICE : {map:'PRICE'},TICKET_TYPE : {map:'TICKET_TYPE'},TICKET_NAME : {map:'TICKET_NAME'},RANDOM2 : {map:'RANDOM2'},YEAR : {map:'YEAR'},EXDAY : {map:'EXDAY'}}]
                }
            },
            //CUSTOMER_VW_02
            {
                from : 
                {
                    query : "SELECT *,dbo.FN_CUSTOMER_TOTAL_POINT(GUID,GETDATE()) AS CUSTOMER_POINT FROM CUSTOMER_VW_02"
                },
                to : 
                {
                    into : "CUSTOMER_VW_02",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},CODE : {map:'CODE'},TITLE : {map:'TITLE'},TYPE_NAME : {map:'TYPE_NAME'},GENUS_NAME : {map:'GENUS_NAME'},CUSTOMER_TYPE : {map:'CUSTOMER_TYPE'},
                    GENUS : {map:'GENUS'},CUSTOMER_GRP : {map:'CUSTOMER_GRP'},WEB : {map:'WEB'},NOTE : {map:'NOTE'},SIRET_ID : {map:'SIRET_ID'},APE_CODE : {map:'APE_CODE'},TAX_OFFICE : {map:'TAX_OFFICE'},
                    TAX_NO : {map:'TAX_NO'},INT_VAT_NO : {map:'INT_VAT_NO'},TAX_TYPE : {map:'TAX_TYPE'},ADRESS : {map:'ADRESS'},ZIPCODE : {map:'ZIPCODE'},COUNTRY : {map:'COUNTRY'},CITY : {map:'CITY'},
                    NAME : {map:'NAME'},LAST_NAME : {map:'LAST_NAME'},PHONE1 : {map:'PHONE1'},PHONE2 : {map:'PHONE2'},GSM_PHONE : {map:'GSM_PHONE'},OTHER_PHONE : {map:'OTHER_PHONE'},EMAIL : {map:'EMAIL'},
                    IBAN : {map:'IBAN'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'}}]
                }
            },
            //PLU_VW_01
            {
                from : 
                {
                    query : "SELECT * FROM PLU_VW_01"
                },
                to : 
                {
                    into : "PLU_VW_01",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},TYPE : {map:'TYPE'},
                    TYPE_NAME : {map:'TYPE_NAME'},NAME : {map:'NAME'},LINK : {map:'LINK'},LINK_CODE : {map:'LINK_CODE'},LINK_NAME : {map:'LINK_NAME'},LOCATION : {map:'LOCATION'},
                    GROUP_INDEX : {map:'GROUP_INDEX'}}]
                }
            },
            //PLU_IMAGE_VW_01
            {
                from : 
                {
                    query : "SELECT * FROM PLU_IMAGE_VW_01"
                },
                to : 
                {
                    into : "PLU_IMAGE_VW_01",
                    values : [{GUID : {map:'GUID'},MAIN_CODE : {map:'MAIN_CODE'},MAIN_NAME : {map:'MAIN_NAME'},ORGINS_CODE : {map:'ORGINS_CODE'},ORGINS_NAME : {map:'ORGINS_NAME'},
                    ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},PRICE : {map:'PRICE'},IMAGE : {map:'IMAGE'}}]
                }
            },
            //POS_DEVICE_VW_01
            {
                from : 
                {
                    query : "SELECT * FROM POS_DEVICE_VW_01"
                },
                to : 
                {
                    into : "POS_DEVICE_VW_01",
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    CODE : {map:'CODE'},NAME : {map:'NAME'},LCD_PORT : {map:'LCD_PORT'},SCALE_PORT : {map:'SCALE_PORT'},PAY_CARD_PORT : {map:'PAY_CARD_PORT'},
                    PRINT_DESING : {map:'PRINT_DESING'},SAFE_GUID : {map:'SAFE_GUID'}}]
                }
            }
        ]
        return tmpSchema
    }
    //SQL DEN LOCAL E GETİR 
    fetchToSql(pTemp)
    {
        return new Promise(async resolve => 
        {
            let tmpValues = [];
            let tmpData = await this.core.sql.execute(pTemp.from)
            
            if(typeof tmpData.result.err == 'undefined')
            {
                await this.core.local.clearTbl(pTemp.to.into)
                tmpData = tmpData.result.recordset 

                for (let i = 0; i < tmpData.length; i++) 
                {
                    let tmpLocQuery = JSON.parse(JSON.stringify(pTemp.to))

                    for (let x = 0; x < Object.keys(tmpLocQuery.values[0]).length; x++) 
                    {
                        let tmpKey = Object.keys(tmpLocQuery.values[0])[x]
                        let tmpMap = Object.values(tmpLocQuery.values[0])[x]
                        if(typeof tmpMap.map != 'undefined')
                        {
                            if(typeof tmpMap.type != 'undefined' && tmpMap.type == 'date_time')
                            {
                                tmpLocQuery.values[0][tmpKey] = new Date(tmpData[i][tmpMap.map])
                            }
                            else
                            {
                                tmpLocQuery.values[0][tmpKey] = tmpData[i][tmpMap.map]    
                            }
                        }                        
                    }
                    tmpValues.push(tmpLocQuery.values[0])
                } 
                pTemp.to.values = tmpValues
                await this.core.local.insert(pTemp.to)
            }
            resolve()
        });
    }
    //LOCAL DEN SQL E GÖNDER
    sendToSql()
    {
        return new Promise(async resolve => 
        {

        });
    }
    //SQL DEN LOCAL E ŞEMA AKTARIMI.
    transferSql()
    {
        return new Promise(async resolve => 
        {
            let tmpSchema = this.fetchSchema()
            for (let i = 0; i < tmpSchema.length; i++) 
            {
                this.emit('onState',{tag:'',text: tmpSchema[i].to.into})
                await this.fetchToSql(tmpSchema[i])
            }
            resolve()
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