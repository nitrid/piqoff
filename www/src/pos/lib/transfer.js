import { core,dataset,datatable } from "../../core/core.js";
import moment from 'moment';

export default class transferCls
{
    static dbName = ''
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
        transferCls.dbName = pDbName
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
                query : `CREATE TABLE IF NOT EXISTS USERS (GUID TEXT PRIMARY KEY, CDATE DATETIME, CUSER TEXT, LDATE DATETIME, LUSER TEXT, CODE TEXT, NAME TEXT, PWD TEXT, ROLE TEXT, SHA TEXT, CARDID TEXT, STATUS INTEGER);`
            },
            //ACCESS
            {
                name : "ACCESS",
                query : `CREATE TABLE IF NOT EXISTS ACCESS (GUID TEXT PRIMARY KEY, ID TEXT, VALUE TEXT, SPECIAL TEXT, USERS TEXT, PAGE TEXT, ELEMENT TEXT, APP TEXT);`           
            },
            //PARAM
            {
                name : "PARAM",
                query : `CREATE TABLE IF NOT EXISTS PARAM (GUID TEXT PRIMARY KEY,TYPE INTEGER,ID TEXT,VALUE TEXT,SPECIAL TEXT,USERS TEXT,PAGE TEXT,ELEMENT TEXT,APP TEXT);`
            },
            //ITEMS_VW_01
            {
                name : "ITEMS_VW_01",
                query : `CREATE TABLE IF NOT EXISTS ITEMS_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        TYPE TEXT,
                        SPECIAL TEXT,
                        CODE TEXT,
                        NAME TEXT,
                        SNAME TEXT,
                        VAT REAL,
                        COST_PRICE REAL,
                        MIN_PRICE REAL,
                        MAX_PRICE REAL,
                        STATUS INTEGER,
                        SUGAR_RATE REAL,
                        MAIN_GRP TEXT,
                        MAIN_GRP_NAME TEXT,
                        SUB_GRP TEXT,
                        ORGINS TEXT,
                        ORGINS_NAME TEXT,
                        RAYON TEXT,
                        SHELF TEXT,
                        SECTOR TEXT,
                        SALE_JOIN_LINE INTEGER,
                        TICKET_REST INTEGER,
                        WEIGHING INTEGER,
                        PRICE REAL);`
            },
            //ITEMS_POS_VW_01
            {
                name :  "ITEMS_POS_VW_01",
                query : `CREATE TABLE IF NOT EXISTS ITEMS_POS_VW_01 (
                        DBGUID INTEGER PRIMARY KEY AUTOINCREMENT,
                        GUID TEXT,
                        SPECIAL TEXT,
                        CODE TEXT,
                        NAME TEXT,
                        SNAME TEXT,
                        VAT NUMERIC,
                        VAT_TYPE TEXT,
                        COST_PRICE NUMERIC,
                        MIN_PRICE NUMERIC,
                        MAX_PRICE NUMERIC,
                        SALE_JOIN_LINE INTEGER,
                        TICKET_REST INTEGER,
                        WEIGHING INTEGER,
                        BARCODE TEXT,
                        BARCODE_GUID TEXT,
                        UNIT_GUID TEXT,
                        UNIT_ID TEXT,
                        UNIT_NAME TEXT,
                        UNIT_SHORT TEXT,
                        UNIT_FACTOR NUMERIC,
                        UNIQ_CODE TEXT,
                        UNIQ_QUANTITY NUMERIC,
                        UNIQ_PRICE NUMERIC,
                        STATUS INTEGER,
                        PRICE NUMERIC,
                        INPUT TEXT);`
            },
            //ITEMS_BARCODE_MULTICODE_VW_01
            {
                name : "ITEMS_BARCODE_MULTICODE_VW_01",
                query : `CREATE TABLE IF NOT EXISTS ITEMS_BARCODE_MULTICODE_VW_01 (
                        DBGUID INTEGER PRIMARY KEY AUTOINCREMENT,
                        GUID TEXT,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        TYPE TEXT,
                        SPECIAL TEXT,
                        CODE TEXT,
                        NAME TEXT,
                        SNAME TEXT,
                        VAT REAL,
                        COST_PRICE REAL,
                        MIN_PRICE REAL,
                        MAX_PRICE REAL,
                        STATUS INTEGER,
                        MAIN_GRP TEXT,
                        MAIN_GRP_NAME TEXT,
                        SUB_GRP TEXT,
                        ORGINS TEXT,
                        ITEMS_GRP_GUID TEXT,
                        ORGINS_NAME TEXT,
                        RAYON TEXT,
                        SHELF TEXT,
                        SECTOR TEXT,
                        SALE_JOIN_LINE INTEGER,
                        TICKET_REST INTEGER,
                        WEIGHING INTEGER,
                        BARCODE TEXT,
                        BARCODE_GUID TEXT,
                        UNIT_ID TEXT,
                        UNIT_NAME TEXT,
                        UNIT_FACTOR REAL,
                        MULTICODE TEXT,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        CUSTOMER_PRICE REAL,
                        CUSTOMER_PRICE_GUID TEXT,
                        PRICE_SALE REAL,
                        PRICE_SALE_GUID TEXT);`
            },
            //CHEQPAY_VW_01
            {
                name : "CHEQPAY_VW_01",
                query : `CREATE TABLE IF NOT EXISTS CHEQPAY_VW_01 (
                        GUID TEXT PRIMARY KEY, 
                        CDATE DATETIME, 
                        CUSER TEXT, 
                        CUSER_NAME TEXT, 
                        LDATE DATETIME,
                        LUSER TEXT, 
                        LUSER_NAME TEXT, 
                        TYPE INTEGER,
                        DOC TEXT, 
                        CODE TEXT, 
                        AMOUNT REAL, 
                        STATUS INTEGER, 
                        REFERENCE TEXT, 
                        RANDOM1 TEXT, 
                        PRICE TEXT, 
                        TICKET_TYPE TEXT, 
                        TICKET_NAME TEXT, 
                        RANDOM2 TEXT, 
                        YEAR TEXT, 
                        EXDAY INTEGER,
                        TRANSFER INTEGER);`
            },
            //COMPANY_VW_01
            {
                name : "COMPANY_VW_01",
                query : `CREATE TABLE IF NOT EXISTS COMPANY_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CUSER TEXT,
                        LUSER TEXT,
                        NAME TEXT,
                        ADDRESS1 TEXT,
                        ADDRESS2 TEXT,
                        ZIPCODE TEXT,
                        COUNTRY TEXT,
                        CITY TEXT,
                        TEL TEXT,
                        MAIL TEXT,
                        SIRET_ID TEXT,
                        APE_CODE TEXT,
                        TAX_OFFICE TEXT,
                        TAX_NO TEXT,
                        INT_VAT_NO TEXT,
                        OFFICIAL_NAME TEXT,
                        OFFICIAL_SURNAME TEXT,
                        COMPANY_TYPE TEXT,
                        SIREN_NO TEXT,
                        RCS TEXT,
                        CAPITAL REAL,
                        COUNTRY_NAME TEXT);`
            },
            //CUSTOMER_VW_02
            {
                name : "CUSTOMER_VW_02",
                query : `CREATE TABLE IF NOT EXISTS CUSTOMER_VW_02 (
                        GUID TEXT PRIMARY KEY, 
                        CDATE DATETIME, 
                        CUSER TEXT, 
                        CUSER_NAME TEXT, 
                        LDATE DATETIME, 
                        LUSER TEXT, 
                        LUSER_NAME TEXT, 
                        CODE TEXT, 
                        TITLE TEXT, 
                        TYPE_NAME TEXT, 
                        GENUS_NAME TEXT, 
                        CUSTOMER_TYPE INTEGER, 
                        GENUS INTEGER, 
                        CUSTOMER_GRP TEXT, 
                        WEB TEXT, 
                        NOTE TEXT, 
                        SIRET_ID TEXT, 
                        APE_CODE TEXT, 
                        TAX_OFFICE TEXT, 
                        TAX_NO TEXT, 
                        INT_VAT_NO TEXT, 
                        TAX_TYPE INTEGER, 
                        ADRESS TEXT, 
                        ZIPCODE TEXT, 
                        COUNTRY TEXT, 
                        CITY TEXT, 
                        NAME TEXT, 
                        LAST_NAME TEXT, 
                        PHONE1 TEXT, 
                        PHONE2 TEXT, 
                        GSM_PHONE TEXT, 
                        OTHER_PHONE INTEGER, 
                        EMAIL TEXT, 
                        IBAN TEXT, 
                        CUSTOMER_POINT INTEGER);`
            },
            //PROMO_VW_01
            {
                name : "PROMO_VW_01",
                query : `CREATE TABLE IF NOT EXISTS PROMO_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        TYPE INTEGER,
                        CODE TEXT,
                        NAME TEXT,
                        START_DATE TEXT,
                        FINISH_DATE TEXT,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        DEPOT_GUID TEXT,
                        DEPOT_CODE TEXT,
                        DEPOT_NAME TEXT,
                        STATUS INTEGER);`
            },
            //PROMO_CONDITION_VW_01
            {
                name : "PROMO_CONDITION_VW_01",
                query : `CREATE TABLE IF NOT EXISTS PROMO_CONDITION_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        PROMO TEXT,
                        TYPE INTEGER,
                        TYPE_NAME TEXT,
                        ITEM_GUID TEXT,
                        ITEM_CODE TEXT,
                        ITEM_NAME TEXT,
                        QUANTITY INTEGER,
                        AMOUNT REAL,
                        WITHAL REAL,
                        SECTOR TEXT);`
            },
            //PROMO_APPLICATION_VW_01
            {
                name : "PROMO_APPLICATION_VW_01",
                query : `CREATE TABLE IF NOT EXISTS PROMO_APPLICATION_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        PROMO TEXT,
                        TYPE INTEGER,
                        TYPE_NAME TEXT,
                        ITEM_GUID TEXT,
                        ITEM_CODE TEXT,
                        ITEM_NAME TEXT,
                        QUANTITY INTEGER,
                        AMOUNT NUMERIC,
                        WITHAL INTEGER,
                        SECTOR TEXT);`
            },
            //POS_VW_01
            {
                name : "POS_VW_01",
                query : `CREATE TABLE IF NOT EXISTS POS_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        FIRM TEXT,
                        DEVICE TEXT,
                        DEPOT_GUID TEXT,
                        DEPOT_CODE TEXT,
                        DEPOT_NAME TEXT,
                        TYPE INTEGER,
                        TYPE_NAME TEXT,
                        DOC_TYPE INTEGER,
                        DOC_DATE DATETIME,
                        REF INTEGER,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_TYPE INTEGER,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        CUSTOMER_TAX_NO TEXT,
                        CUSTOMER_ADRESS TEXT,
                        CUSTOMER_ZIPCODE TEXT,
                        CUSTOMER_COUNTRY TEXT,
                        CUSTOMER_CITY TEXT,
                        CUSTOMER_POINT INTEGER,
                        FAMOUNT NUMERIC,
                        AMOUNT NUMERIC,
                        DISCOUNT NUMERIC,
                        LOYALTY NUMERIC,
                        VAT NUMERIC,
                        TOTAL NUMERIC,
                        TICKET TEXT,
                        REBATE_CHEQPAY TEXT,
                        STATUS INTEGER,
                        DELETED INTEGER,
                        DESCRIPTION TEXT,
                        CERTIFICATE TEXT,
                        ORDER_GUID TEXT,
                        SIGNATURE TEXT,
                        SIGNATURE_SUM TEXT);`
            },
            //POS_SALE_VW_01
            {
                name : "POS_SALE_VW_01",
                query : `CREATE TABLE IF NOT EXISTS POS_SALE_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        POS_GUID TEXT,
                        DEVICE TEXT,
                        DEPOT_GUID TEXT,
                        DEPOT_CODE TEXT,
                        DEPOT_NAME TEXT,
                        TYPE INTEGER,
                        DOC_DATE DATETIME,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        LINE_NO INTEGER,
                        ITEM_GUID TEXT,
                        ITEM_CODE TEXT,
                        ITEM_NAME TEXT,
                        ITEM_SNAME TEXT,
                        ITEM_GRP_CODE TEXT,
                        ITEM_GRP_NAME TEXT,
                        COST_PRICE REAL,
                        MIN_PRICE REAL,
                        MAX_PRICE REAL,
                        TICKET_REST INTEGER,
                        INPUT TEXT,
                        BARCODE_GUID TEXT,
                        BARCODE TEXT,
                        UNIT_GUID TEXT,
                        UNIT_NAME TEXT,
                        UNIT_FACTOR REAL,
                        UNIT_SHORT TEXT,
                        QUANTITY REAL,
                        PRICE REAL,
                        FAMOUNT REAL,
                        AMOUNT REAL,
                        DISCOUNT REAL,
                        LOYALTY REAL,
                        VAT REAL,
                        VAT_RATE REAL,
                        VAT_TYPE TEXT,
                        TOTAL REAL,
                        SUBTOTAL REAL,
                        PROMO_TYPE INTEGER,
                        GRAND_AMOUNT REAL,
                        GRAND_DISCOUNT REAL,
                        GRAND_LOYALTY REAL,
                        GRAND_VAT REAL,
                        GRAND_TOTAL REAL,
                        STATUS INTEGER,
                        REBATE_TICKET TEXT,
                        DELETED INTEGER,
                        ORDER_GUID TEXT);`
            },
            //POS_PAYMENT_VW_01
            {
                name : "POS_PAYMENT_VW_01",
                query : `CREATE TABLE IF NOT EXISTS POS_PAYMENT_VW_01 (
                        DBID INTEGER PRIMARY KEY AUTOINCREMENT,
                        GUID TEXT,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        POS_GUID TEXT,
                        DEVICE TEXT,
                        DEPOT_GUID TEXT,
                        DEPOT_CODE TEXT,
                        DEPOT_NAME TEXT,
                        TYPE INTEGER,
                        DOC_DATE DATETIME,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        PAY_TYPE INTEGER,
                        PAY_TYPE_NAME TEXT,
                        LINE_NO INTEGER,
                        AMOUNT REAL,
                        CHANGE REAL,
                        TICKET_PLUS REAL,
                        GRAND_AMOUNT REAL,
                        GRAND_DISCOUNT REAL,
                        GRAND_LOYALTY REAL,
                        GRAND_VAT REAL,
                        GRAND_TOTAL REAL,
                        STATUS INTEGER,
                        DELETED INTEGER);`
            },
            //POS_PROMO_VW_01
            {
                name : "POS_PROMO_VW_01",
                query : `CREATE TABLE IF NOT EXISTS POS_PROMO_VW_01 (
                        DBID INTEGER PRIMARY KEY AUTOINCREMENT,
                        GUID TEXT,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        LUSER_NAME TEXT,
                        APP_TYPE INTEGER,
                        APP_AMOUNT REAL,
                        PROMO_GUID TEXT,
                        PROMO_CODE TEXT,
                        PROMO_NAME TEXT,
                        CUSTOMER_GUID TEXT,
                        CUSTOMER_CODE TEXT,
                        CUSTOMER_NAME TEXT,
                        START_DATE DATETIME,
                        FINISH_DATE DATETIME,
                        POS_GUID TEXT,
                        DOC_DATE DATETIME,
                        POS_SALE_GUID TEXT,
                        ITEM_CODE TEXT,
                        ITEM_NAME TEXT,
                        PRICE REAL,
                        QUANTITY REAL,
                        AMOUNT REAL,
                        FAMOUNT REAL,
                        DISCOUNT REAL,
                        LOYALTY REAL,
                        VAT REAL,
                        TOTAL REAL,
                        PROMO_TYPE INTEGER);`
            },
            //PLU_VW_01
            {
                name: "PLU_VW_01",
                query: `CREATE TABLE IF NOT EXISTS PLU_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        TYPE INTEGER,
                        TYPE_NAME TEXT,
                        NAME TEXT,
                        LINK TEXT,
                        LINK_CODE TEXT,
                        LINK_NAME TEXT,
                        LOCATION INTEGER,
                        GROUP_INDEX INTEGER);`
            },
            //PLU_IMAGE_VW_01
            {
                name: "PLU_IMAGE_VW_01",
                query: `CREATE TABLE IF NOT EXISTS PLU_IMAGE_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        MAIN_GUID TEXT,
                        MAIN_CODE TEXT,
                        MAIN_NAME TEXT,
                        ORGINS_CODE TEXT,
                        ORGINS_NAME TEXT,
                        ITEM_GUID TEXT,
                        ITEM_CODE TEXT,
                        ITEM_NAME TEXT,
                        PRICE INTEGER,
                        IMAGE TEXT);`
            },
            //POS_EXTRA_VW_01
            {
                name: "POS_EXTRA_VW_01",
                query: `CREATE TABLE IF NOT EXISTS POS_EXTRA_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        CUSER_NAME TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        TAG TEXT,
                        POS_GUID TEXT,
                        LINE_GUID TEXT,
                        DATA TEXT,
                        DESCRIPTION TEXT,
                        APP_VERSION TEXT);`
            },
            //POS_DEVICE_VW_01
            {
                name: "POS_DEVICE_VW_01",
                query: `CREATE TABLE IF NOT EXISTS POS_DEVICE_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        CODE TEXT,
                        NAME TEXT,
                        LCD_PORT TEXT,
                        SCALE_PORT TEXT,
                        PAY_CARD_PORT TEXT,
                        SCANNER_PORT TEXT,
                        PRINT_DESING TEXT,
                        SAFE_GUID TEXT,
                        MACID TEXT);`
            },
            //CUSTOMER_POINT_VW_01
            {
                name: "CUSTOMER_POINT_VW_01",
                query: `CREATE TABLE IF NOT EXISTS CUSTOMER_POINT_VW_01 (
                        GUID TEXT PRIMARY KEY,
                        CDATE DATETIME,
                        CUSER TEXT,
                        LDATE DATETIME,
                        LUSER TEXT,
                        TYPE INTEGER,
                        CUSTOMER TEXT,
                        DOC TEXT,
                        POINT INTEGER,
                        DESCRIPTION TEXT);`
            },
            //NF525_JET
            {
                name: "NF525_JET",
                query: `CREATE TABLE IF NOT EXISTS NF525_JET (
                        GUID TEXT PRIMARY KEY,
                        CUSER TEXT,
                        CDATE DATETIME,
                        DEVICE TEXT,
                        CODE TEXT,
                        NAME TEXT,
                        DESCRIPTION TEXT,
                        APP_VERSION TEXT,
                        SIGNATURE TEXT);`
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
                name : "USERS",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM USERS WHERE STATUS = 1 ORDER BY CODE ASC`,
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO USERS (GUID,CDATE,CUSER,LDATE,LUSER,CODE,NAME,PWD,ROLE,SHA,CARDID,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},CODE : {map:'CODE'},NAME : {map:'NAME'},
                    PWD : {map:'PWD'},ROLE : {map:'ROLE'},SHA : {map:'SHA'},CARDID : {map:'CARDID'},STATUS : {map:'STATUS'}}]
                },
            },
            //ACCESS
            {
                name : "ACCESS",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM ACCESS`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO ACCESS (GUID,ID,VALUE,SPECIAL,USERS,PAGE,ELEMENT,APP) VALUES (?,?,?,?,?,?,?,?)`,
                    values : [{GUID : {map:'GUID'},ID : {map:'ID'},VALUE : {map:'VALUE'},SPECIAL : {map:'SPECIAL'},USERS : {map:'USERS'},PAGE : {map:'PAGE'},ELEMENT : {map:'ELEMENT'},APP : {map:'APP'}}]
                }
            },
            //PARAM
            {
                name : "PARAM",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM PARAM`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PARAM (GUID, TYPE, ID, VALUE, SPECIAL, USERS, PAGE, ELEMENT, APP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},TYPE : {map:'TYPE'},ID : {map:'ID'},VALUE : {map:'VALUE'},SPECIAL : {map:'SPECIAL'},USERS : {map:'USERS'},PAGE : {map:'PAGE'},ELEMENT : {map:'ELEMENT'},APP : {map:'APP'}}]
                },
            },
            //ITEMS_VW_01
            {
                name : "ITEMS_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT *,dbo.FN_PRICE_SALE(GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEMS_VW_01 {0}`,
                    where : `WHERE LDATE >= GETDATE() - 10`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO ITEMS_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, SPECIAL, CODE, 
                            NAME, SNAME, VAT, COST_PRICE, MIN_PRICE, MAX_PRICE, STATUS, SUGAR_RATE, MAIN_GRP, MAIN_GRP_NAME, SUB_GRP, ORGINS, 
                            ORGINS_NAME, RAYON, SHELF, SECTOR, SALE_JOIN_LINE, TICKET_REST, WEIGHING, PRICE) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},SPECIAL : {map:'SPECIAL'},CODE : {map:'CODE'},NAME : {map:'NAME'},SNAME : {map:'SNAME'},VAT : {map:'VAT'},COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},STATUS : {map:'STATUS'},SUGAR_RATE : {map:'SUGAR_RATE'},MAIN_GRP : {map:'MAIN_GRP'},MAIN_GRP_NAME : {map:'MAIN_GRP_NAME'},
                    SUB_GRP : {map:'SUB_GRP'},ORGINS : {map:'ORGINS'},ORGINS_NAME : {map:'ORGINS_NAME'},RAYON : {map:'RAYON'},SHELF : {map:'SHELF'},SECTOR : {map:'SECTOR'},SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},
                    TICKET_REST : {map:'TICKET_REST'},WEIGHING : {map:'WEIGHING'},PRICE : {map:'PRICE'}}]
                },
            },
            //ITEMS_POS_VW_01
            {
                name : "ITEMS_POS_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT *,dbo.FN_PRICE_SALE(GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE 
                            FROM ITEMS_POS_VW_01 {0}`,
                    where : `WHERE LDATE >= GETDATE() - 10`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO ITEMS_POS_VW_01 (GUID, SPECIAL, CODE, NAME, SNAME, VAT, VAT_TYPE, COST_PRICE, MIN_PRICE, MAX_PRICE, 
                            SALE_JOIN_LINE, TICKET_REST, WEIGHING, BARCODE, BARCODE_GUID, UNIT_GUID, UNIT_ID, UNIT_NAME, UNIT_SHORT, UNIT_FACTOR, UNIQ_CODE, 
                            UNIQ_QUANTITY, UNIQ_PRICE, STATUS, PRICE, INPUT) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    values : [{GUID : {map:'GUID'},SPECIAL : {map:'SPECIAL'},CODE : {map:'CODE'},NAME : {map:'NAME'},SNAME : {map:'SNAME'},VAT : {map:'VAT'},VAT_TYPE : {map:'VAT_TYPE'},COST_PRICE : {map:'COST_PRICE'},
                    MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},SALE_JOIN_LINE : {map:'SALE_JOIN_LINE'},TICKET_REST : {map:'TICKET_REST'},WEIGHING : {map:'WEIGHING'},BARCODE : {map:'BARCODE'},
                    BARCODE_GUID : {map:'BARCODE_GUID'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_ID : {map:'UNIT_ID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_SHORT : {map:'UNIT_SHORT'},UNIT_FACTOR : {map:'UNIT_FACTOR'},
                    UNIQ_CODE : {map:'UNIQ_CODE'},UNIQ_QUANTITY : {map:'UNIQ_QUANTITY'},UNIQ_PRICE : {map:'UNIQ_PRICE'},STATUS : {map:'STATUS'},PRICE : {map:'PRICE'},INPUT : ''}]
                }
            },
            //ITEMS_BARCODE_MULTICODE_VW_01
            {
                name : "ITEMS_BARCODE_MULTICODE_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 {0}`,
                    where : `WHERE LDATE >= GETDATE() - 10`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO ITEMS_BARCODE_MULTICODE_VW_01 (
                            GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, SPECIAL, CODE, NAME, SNAME, VAT, COST_PRICE, MIN_PRICE, MAX_PRICE, STATUS, MAIN_GRP,
                            MAIN_GRP_NAME, SUB_GRP, ORGINS, ITEMS_GRP_GUID, ORGINS_NAME, RAYON, SHELF, SECTOR, SALE_JOIN_LINE, TICKET_REST, WEIGHING, BARCODE, BARCODE_GUID, UNIT_ID,
                            UNIT_NAME, UNIT_FACTOR, MULTICODE, CUSTOMER_GUID, CUSTOMER_CODE, CUSTOMER_NAME, CUSTOMER_PRICE, CUSTOMER_PRICE_GUID, PRICE_SALE, PRICE_SALE_GUID) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                name : "CHEQPAY_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT *,DATEDIFF(DAY,CDATE,GETDATE()) AS EXDAY FROM CHEQPAY_VW_01 WHERE [YEAR] = 2 {0}`,
                    where : "AND LDATE >= GETDATE() - 10"
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO CHEQPAY_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, DOC, CODE, AMOUNT, STATUS, REFERENCE, RANDOM1, PRICE, 
                            TICKET_TYPE, TICKET_NAME, RANDOM2, YEAR, EXDAY, TRANSFER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},DOC : {map:'DOC'},CODE : {map:'CODE'},AMOUNT : {map:'AMOUNT'},STATUS : {map:'STATUS'},REFERENCE : {map:'REFERENCE'},RANDOM1 : {map:'RANDOM1'},
                    PRICE : {map:'PRICE'},TICKET_TYPE : {map:'TICKET_TYPE'},TICKET_NAME : {map:'TICKET_NAME'},RANDOM2 : {map:'RANDOM2'},YEAR : {map:'YEAR'},EXDAY : {map:'EXDAY'},TRANSFER : 0}]
                }
            },
            //COMPANY_VW_01
            {
                name : "COMPANY_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM COMPANY_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO COMPANY_VW_01 (GUID, CUSER, LUSER, NAME, ADDRESS1, ADDRESS2, ZIPCODE, COUNTRY, CITY, TEL, MAIL, SIRET_ID, APE_CODE, TAX_OFFICE, 
                            TAX_NO, INT_VAT_NO, OFFICIAL_NAME, OFFICIAL_SURNAME, COMPANY_TYPE, SIREN_NO, RCS, CAPITAL, COUNTRY_NAME) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    values : [{GUID : {map:'GUID'},CUSER : {map:'CUSER'},LUSER : {map:'LUSER'},NAME : {map:'NAME'},ADDRESS1 : {map:'ADDRESS1'},ADDRESS2 : {map:'ADDRESS2'},ZIPCODE : {map:'ZIPCODE'},
                    COUNTRY : {map:'COUNTRY'},CITY : {map:'CITY'},TEL : {map:'TEL'},MAIL : {map:'MAIL'},SIRET_ID : {map:'SIRET_ID'},APE_CODE : {map:'APE_CODE'},TAX_OFFICE : {map:'TAX_OFFICE'},
                    TAX_NO : {map:'TAX_NO'},INT_VAT_NO : {map:'INT_VAT_NO'},OFFICIAL_NAME : {map:'OFFICIAL_NAME'},OFFICIAL_SURNAME : {map:'OFFICIAL_SURNAME'},COMPANY_TYPE : {map:'COMPANY_TYPE'},
                    SIREN_NO : {map:'SIREN_NO'},RCS : {map:'RCS'},CAPITAL : {map:'CAPITAL'},COUNTRY_NAME : {map:'COUNTRY_NAME'}}]
                },               
            },
            //PLU_VW_01
            {
                name : "PLU_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM PLU_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PLU_VW_01 (GUID, CDATE, CUSER, LDATE, LUSER, TYPE, TYPE_NAME, NAME, LINK, LINK_CODE, LINK_NAME, LOCATION, GROUP_INDEX)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},TYPE : {map:'TYPE'},
                    TYPE_NAME : {map:'TYPE_NAME'},NAME : {map:'NAME'},LINK : {map:'LINK'},LINK_CODE : {map:'LINK_CODE'},LINK_NAME : {map:'LINK_NAME'},LOCATION : {map:'LOCATION'},
                    GROUP_INDEX : {map:'GROUP_INDEX'}}]
                },
            },
            //PLU_IMAGE_VW_01
            {
                name : "PLU_IMAGE_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM PLU_IMAGE_VW_01 {0}`,
                    where : `WHERE LDATE >= GETDATE() - 10`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PLU_IMAGE_VW_01 (GUID, MAIN_GUID, MAIN_CODE, MAIN_NAME, ORGINS_CODE, ORGINS_NAME, ITEM_GUID, ITEM_CODE, ITEM_NAME, PRICE, IMAGE)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},MAIN_GUID : {map:'MAIN_GUID'},MAIN_CODE : {map:'MAIN_CODE'},MAIN_NAME : {map:'MAIN_NAME'},ORGINS_CODE : {map:'ORGINS_CODE'},ORGINS_NAME : {map:'ORGINS_NAME'},
                    ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},PRICE : {map:'PRICE'},IMAGE : {map:'IMAGE'}}]
                }
            },
            //POS_DEVICE_VW_01
            {
                name : "POS_DEVICE_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM POS_DEVICE_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO POS_DEVICE_VW_01 (GUID, CDATE, CUSER, LDATE, LUSER, CODE, NAME, LCD_PORT, SCALE_PORT, PAY_CARD_PORT, SCANNER_PORT, PRINT_DESING, SAFE_GUID, MACID)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    CODE : {map:'CODE'},NAME : {map:'NAME'},LCD_PORT : {map:'LCD_PORT'},SCALE_PORT : {map:'SCALE_PORT'},PAY_CARD_PORT : {map:'PAY_CARD_PORT'},SCANNER_PORT : {map:'SCANNER_PORT'},
                    PRINT_DESING : {map:'PRINT_DESING'},SAFE_GUID : {map:'SAFE_GUID'},MACID : {map:'MACID'}}]
                }
            },
            //PROMO_VW_01
            {
                name : "PROMO_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM PROMO_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PROMO_VW_01 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, TYPE, CODE, NAME, START_DATE, FINISH_DATE, CUSTOMER_GUID, CUSTOMER_CODE, 
                            CUSTOMER_NAME, DEPOT_GUID, DEPOT_CODE, DEPOT_NAME, STATUS)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},TYPE : {map:'TYPE'},CODE : {map:'CODE'},NAME : {map:'NAME'},START_DATE : {map:'START_DATE',type:'date_time'},FINISH_DATE : {map:'FINISH_DATE',type:'date_time'},
                    CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},
                    DEPOT_NAME : {map:'DEPOT_NAME'},STATUS : {map:'STATUS'}}]
                }
            },
            //PROMO_CONDITION_VW_01
            {
                name : "PROMO_CONDITION_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT *,'COND' AS SECTOR FROM PROMO_CONDITION_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PROMO_CONDITION_VW_01 (GUID, PROMO, TYPE, TYPE_NAME, ITEM_GUID, ITEM_CODE, ITEM_NAME, QUANTITY, AMOUNT, WITHAL, SECTOR)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},PROMO : {map:'PROMO'},TYPE : {map:'TYPE'},TYPE_NAME : {map:'TYPE_NAME'},ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},
                    ITEM_NAME : {map:'ITEM_NAME'},QUANTITY : {map:'QUANTITY'},AMOUNT : {map:'AMOUNT'},WITHAL : {map:'WITHAL'},SECTOR : {map:'SECTOR'}}]
                }
            },
            //PROMO_APPLICATION_VW_01
            {
                name : "PROMO_APPLICATION_VW_01",
                from : 
                {
                    type : "select",
                    query : `SELECT *,'APP' AS SECTOR FROM PROMO_APPLICATION_VW_01`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO PROMO_APPLICATION_VW_01 (GUID, PROMO, TYPE, TYPE_NAME, ITEM_GUID, ITEM_CODE, ITEM_NAME, QUANTITY, AMOUNT, WITHAL, SECTOR)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values : [{GUID : {map:'GUID'},PROMO : {map:'PROMO'},TYPE : {map:'TYPE'},TYPE_NAME : {map:'TYPE_NAME'},ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},
                    ITEM_NAME : {map:'ITEM_NAME'},QUANTITY : {map:'QUANTITY'},AMOUNT : {map:'AMOUNT'},WITHAL : {map:'WITHAL'},SECTOR : {map:'SECTOR'}}]
                }
            },
            //CUSTOMER_VW_02
            {
                name : "CUSTOMER_VW_02",
                from : 
                {
                    type : "select",
                    query : `SELECT * FROM CUSTOMER_VW_02 {0}`,
                    where : `WHERE LDATE >= GETDATE() - 10`
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO CUSTOMER_VW_02 (GUID, CDATE, CUSER, CUSER_NAME, LDATE, LUSER, LUSER_NAME, CODE, TITLE, TYPE_NAME, GENUS_NAME, CUSTOMER_TYPE, GENUS, CUSTOMER_GRP, WEB, NOTE, SIRET_ID, 
                             APE_CODE, TAX_OFFICE, TAX_NO, INT_VAT_NO, TAX_TYPE, ADRESS, ZIPCODE, COUNTRY, CITY, NAME, LAST_NAME, PHONE1, PHONE2, GSM_PHONE, OTHER_PHONE, EMAIL, IBAN, CUSTOMER_POINT) 
                             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                    LUSER_NAME : {map:'LUSER_NAME'},CODE : {map:'CODE'},TITLE : {map:'TITLE'},TYPE_NAME : {map:'TYPE_NAME'},GENUS_NAME : {map:'GENUS_NAME'},CUSTOMER_TYPE : {map:'CUSTOMER_TYPE'},
                    GENUS : {map:'GENUS'},CUSTOMER_GRP : {map:'CUSTOMER_GRP'},WEB : {map:'WEB'},NOTE : {map:'NOTE'},SIRET_ID : {map:'SIRET_ID'},APE_CODE : {map:'APE_CODE'},TAX_OFFICE : {map:'TAX_OFFICE'},
                    TAX_NO : {map:'TAX_NO'},INT_VAT_NO : {map:'INT_VAT_NO'},TAX_TYPE : {map:'TAX_TYPE'},ADRESS : {map:'ADRESS'},ZIPCODE : {map:'ZIPCODE'},COUNTRY : {map:'COUNTRY'},CITY : {map:'CITY'},
                    NAME : {map:'NAME'},LAST_NAME : {map:'LAST_NAME'},PHONE1 : {map:'PHONE1'},PHONE2 : {map:'PHONE2'},GSM_PHONE : {map:'GSM_PHONE'},OTHER_PHONE : {map:'OTHER_PHONE'},EMAIL : {map:'EMAIL'},
                    IBAN : {map:'IBAN'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'}}]
                },
            },
        ]
        return tmpSchema
    }
    sendSchema()
    {
        let tmpSchema = 
        [
            //POS_VW_01
            {
                from : 
                {
                    name : "POS_VW_01",
                    type : "select",
                    query : "SELECT * FROM POS_VW_01"
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_POS_INSERT] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@FIRM = @PFIRM, " +
                                "@DEVICE = @PDEVICE, " +
                                "@DEPOT = @PDEPOT, " +
                                "@TYPE = @PTYPE, " +  
                                "@DOC_TYPE = @PDOC_TYPE, " +                       
                                "@DOC_DATE = @PDOC_DATE, " + 
                                "@REF = @PREF, " +
                                "@CUSTOMER = @PCUSTOMER, " + 
                                "@FAMOUNT = @PFAMOUNT, " + 
                                "@AMOUNT = @PAMOUNT, " + 
                                "@DISCOUNT = @PDISCOUNT, " + 
                                "@LOYALTY = @PLOYALTY, " + 
                                "@VAT = @PVAT, " + 
                                "@TOTAL = @PTOTAL, " + 
                                "@TICKET = @PTICKET, " + 
                                "@STATUS = @PSTATUS, " +
                                "@CERTIFICATE = @PCERTIFICATE, " +
                                "@ORDER_GUID = @PORDER_GUID, " +
                                "@SIGNATURE = @PSIGNATURE, " +
                                "@SIGNATURE_SUM = @PSIGNATURE_SUM, " +
                                "@DELETED = @PDELETED ",
                        param : ['PGUID:string|50','PCUSER:string|25','PFIRM:string|50','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_TYPE:int','PDOC_DATE:date','PREF:int',
                                'PCUSTOMER:string|50','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int',
                                'PCERTIFICATE:string|250','PORDER_GUID:string|50','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max','PDELETED:bit'],
                        dataprm : ['GUID','CUSER','FIRM','DEVICE','DEPOT_GUID','TYPE','DOC_TYPE','DOC_DATE','REF','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET',
                                'STATUS','CERTIFICATE','ORDER_GUID','SIGNATURE','SIGNATURE_SUM','DELETED'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@DEVICE = @PDEVICE, " +
                                "@DEPOT = @PDEPOT, " +
                                "@TYPE = @PTYPE, " +  
                                "@DOC_TYPE = @PDOC_TYPE, " +                      
                                "@DOC_DATE = @PDOC_DATE, " + 
                                "@REF = @PREF, " +
                                "@CUSTOMER = @PCUSTOMER, " + 
                                "@FAMOUNT = @PFAMOUNT, " +
                                "@AMOUNT = @PAMOUNT, " + 
                                "@DISCOUNT = @PDISCOUNT, " + 
                                "@LOYALTY = @PLOYALTY, " + 
                                "@VAT = @PVAT, " + 
                                "@TOTAL = @PTOTAL, " + 
                                "@TICKET = @PTICKET, " + 
                                "@STATUS = @PSTATUS, " +
                                "@CERTIFICATE = @PCERTIFICATE, " +
                                "@ORDER_GUID = @PORDER_GUID, " +
                                "@SIGNATURE = @PSIGNATURE, " +
                                "@SIGNATURE_SUM = @PSIGNATURE_SUM, " +
                                "@DELETED = @PDELETED ",
                        param : ['PGUID:string|50','PCUSER:string|25','PFIRM:string|50','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_TYPE:int','PDOC_DATE:date','PREF:int',
                                'PCUSTOMER:string|50','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int',
                                'PCERTIFICATE:string|250','PORDER_GUID:string|50','PSIGNATURE:string|max','PSIGNATURE_SUM:string|max','PDELETED:bit'],
                        dataprm : ['GUID','CUSER','FIRM','DEVICE','DEPOT_GUID','TYPE','DOC_TYPE','DOC_DATE','REF','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET',
                                'STATUS','CERTIFICATE','ORDER_GUID','SIGNATURE','SIGNATURE_SUM','DELETED'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[POS] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //POS_SALE_VW_01
            {
                from : 
                {
                    name : "POS_SALE_VW_01",
                    type : "select",
                    query : "SELECT * FROM POS_SALE_VW_01"
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_POS_SALE_INSERT] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " +
                                "@CDATE = @PCDATE, " + 
                                "@LDATE = @PLDATE, " + 
                                "@POS = @PPOS, " +
                                "@LINE_NO = @PLINE_NO, " +
                                "@ITEM = @PITEM, " +  
                                "@INPUT = @PINPUT, " +                      
                                "@BARCODE = @PBARCODE, " + 
                                "@UNIT = @PUNIT, " + 
                                "@QUANTITY = @PQUANTITY, " + 
                                "@PRICE = @PPRICE, " + 
                                "@FAMOUNT = @PFAMOUNT, " + 
                                "@AMOUNT = @PAMOUNT, " + 
                                "@DISCOUNT = @PDISCOUNT, " + 
                                "@LOYALTY = @PLOYALTY, " + 
                                "@VAT = @PVAT, " + 
                                "@TOTAL = @PTOTAL, " + 
                                "@SUBTOTAL = @PSUBTOTAL, " + 
                                "@PROMO_TYPE = @PPROMO_TYPE, " +
                                "@ORDER_GUID = @PORDER_GUID, " +
                                "@DELETED = @PDELETED ",  
                        param : ['PGUID:string|50','PCUSER:string|25','PCDATE:datetime','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                                'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int','PORDER_GUID:string|50',
                                'PDELETED:bit'],
                        dataprm : ['GUID','CUSER','LDATE','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT',
                                'TOTAL','SUBTOTAL','PROMO_TYPE','ORDER_GUID','DELETED'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_POS_SALE_UPDATE] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@LDATE = @PLDATE, " + 
                                "@POS = @PPOS, " +
                                "@LINE_NO = @PLINE_NO, " +
                                "@ITEM = @PITEM, " + 
                                "@INPUT = @PINPUT, " +                   
                                "@BARCODE = @PBARCODE, " + 
                                "@UNIT = @PUNIT, " + 
                                "@QUANTITY = @PQUANTITY, " + 
                                "@PRICE = @PPRICE, " + 
                                "@FAMOUNT = @PFAMOUNT, " +
                                "@AMOUNT = @PAMOUNT, " + 
                                "@DISCOUNT = @PDISCOUNT, " + 
                                "@LOYALTY = @PLOYALTY, " + 
                                "@VAT = @PVAT, " + 
                                "@TOTAL = @PTOTAL, " + 
                                "@SUBTOTAL = @PSUBTOTAL, " + 
                                "@PROMO_TYPE = @PPROMO_TYPE, " +
                                "@ORDER_GUID = @PORDER_GUID, " +
                                "@DELETED = @PDELETED ",  
                        param : ['PGUID:string|50','PCUSER:string|25','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                                'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int','PORDER_GUID:string|50',
                                'PDELETED:bit'],
                        dataprm : ['GUID','CUSER','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY',
                                'VAT','TOTAL','SUBTOTAL','PROMO_TYPE','ORDER_GUID','DELETED'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[POS_SALE] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //POS_PAYMENT_VW_01
            {
                from : 
                {
                    name : "POS_PAYMENT_VW_01",
                    type : "select",
                    query : "SELECT * FROM POS_PAYMENT_VW_01"
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@POS = @PPOS, " +
                                "@TYPE = @PTYPE, " +
                                "@LINE_NO = @PLINE_NO, " +
                                "@AMOUNT = @PAMOUNT, " + 
                                "@CHANGE = @PCHANGE, " +
                                "@DELETED = @PDELETED ",  
                        param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float','PDELETED:bit'],
                        dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE','DELETED'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@POS = @PPOS, " +
                                "@TYPE = @PTYPE, " +
                                "@LINE_NO = @PLINE_NO, " +
                                "@AMOUNT = @PAMOUNT, " + 
                                "@CHANGE = @PCHANGE, " +
                                "@DELETED = @PDELETED ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float','PDELETED:bit'],
                        dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE','DELETED'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[POS_PAYMENT] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //POS_EXTRA_VW_01
            {
                from : 
                {
                    name : "POS_EXTRA_VW_01",
                    type : "select",
                    query : "SELECT * FROM POS_EXTRA_VW_01"
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@TAG = @PTAG, " +
                                "@POS_GUID = @PPOS_GUID, " +
                                "@LINE_GUID = @PLINE_GUID, " +
                                "@DATA =@PDATA, " +
                                "@APP_VERSION =@PAPP_VERSION, " +
                                "@DESCRIPTION = @PDESCRIPTION ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|50','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                        dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_GUID','DATA','APP_VERSION','DESCRIPTION'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_POS_EXTRA_UPDATE] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@TAG = @PTAG, " +
                                "@POS_GUID = @PPOS_GUID, " +
                                "@LINE_GUID = @PLINE_GUID, " +
                                "@DATA =@PDATA, " +
                                "@APP_VERSION =@PAPP_VERSION, " +
                                "@DESCRIPTION = @PDESCRIPTION ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_GUID:string|50','PDATA:string|50','PAPP_VERSION:string|25','PDESCRIPTION:string|max'],
                        dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_GUID','DATA','APP_VERSION','DESCRIPTION'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[POS_EXTRA] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //CUSTOMER_POINT_VW_01
            {
                from : 
                {
                    name : "CUSTOMER_POINT_VW_01",
                    type : "select",
                    query : "SELECT * FROM CUSTOMER_POINT_VW_01"
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_CUSTOMER_POINT_INSERT] " + 
                                "@GUID = @PGUID, " + 
                                "@CUSER = @PCUSER, " + 
                                "@TYPE = @PTYPE, " +     
                                "@CUSTOMER = @PCUSTOMER, " +                  
                                "@DOC = @PDOC, " + 
                                "@POINT = @PPOINT, " + 
                                "@DESCRIPTION = @PDESCRIPTION ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                        dataprm : ['GUID','CUSER','TYPE','CUSTOMER','DOC','POINT','DESCRIPTION'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_CUSTOMER_POINT_UPDATE] " + 
                                "@GUID = @PGUID, " + 
                                "@CUSER = @PCUSER, " + 
                                "@TYPE = @PTYPE, " +     
                                "@CUSTOMER = @PCUSTOMER, " +                  
                                "@DOC = @PDOC, " + 
                                "@POINT = @PPOINT, " + 
                                "@DESCRIPTION = @PDESCRIPTION ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PDOC:string|50','PPOINT:float','PDESCRIPTION:string|250'],
                        dataprm : ['GUID','CUSER','TYPE','CUSTOMER','DOC','POINT','DESCRIPTION'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[CUSTOMER_POINT_VW_01] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //CHEQPAY_VW_01
            {
                from : 
                {
                    name : "CHEQPAY_VW_01",
                    type : "select",
                    query : "SELECT * FROM CHEQPAY_VW_01 WHERE TRANSFER = 1;",
                },
                to : 
                {
                    insert : 
                    {
                        query : "EXEC [dbo].[PRD_CHEQPAY_INSERT] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@TYPE = @PTYPE, " +                      
                                "@DOC = @PDOC, " + 
                                "@CODE = @PCODE, " + 
                                "@AMOUNT = @PAMOUNT, " + 
                                "@STATUS = @PSTATUS ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC:string|50','PCODE:string|25','PAMOUNT:float','PSTATUS:int'],
                        dataprm : ['GUID','CUSER','TYPE','DOC','CODE','AMOUNT','STATUS'],
                    },
                    update : 
                    {
                        query : "EXEC [dbo].[PRD_CHEQPAY_UPDATE] " + 
                                "@GUID = @PGUID, " +
                                "@CUSER = @PCUSER, " + 
                                "@TYPE = @PTYPE, " +                      
                                "@DOC = @PDOC, " + 
                                "@CODE = @PCODE, " + 
                                "@AMOUNT = @PAMOUNT, " + 
                                "@STATUS = @PSTATUS ", 
                        param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PDOC:string|50','PCODE:string|25','PAMOUNT:float','PSTATUS:int'],
                        dataprm : ['GUID','CUSER','TYPE','DOC','CODE','AMOUNT','STATUS'],
                    },
                    control :
                    {
                        query : "SELECT * FROM [dbo].[CHEQPAY_VW_01] WHERE GUID = @GUID",
                        param : ['GUID:string|50'],
                        dataprm : ['GUID'],
                    }
                }
            },
            //POS_DEVICE_VW_01
            // {
            //     from : 
            //     {
            //         name : "POS_DEVICE_VW_01",
            //         type : "select",
            //         query : "SELECT * FROM POS_DEVICE_VW_01"
            //     },
            //     to : 
            //     {
            //         insert : 
            //         {
            //             query : "EXEC [dbo].[PRD_POS_DEVICE_INSERT] " + 
            //                     "@GUID = @PGUID, " +
            //                     "@CUSER = @PCUSER, " + 
            //                     "@CODE = @PCODE, " + 
            //                     "@NAME = @PNAME, " + 
            //                     "@LCD_PORT = @PLCD_PORT, " +
            //                     "@SCALE_PORT = @PSCALE_PORT, " +
            //                     "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
            //                     "@PRINT_DESING = @PPRINT_DESING, " +
            //                     "@SCANNER_PORT = @PSCANNER_PORT " ,
            //             param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50','PPRINT_DESING:string|50','PSCANNER_PORT:string|50'],
            //             dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING','SCANNER_PORT']
            //         },
            //         update : 
            //         {
            //             query : "EXEC [dbo].[PRD_POS_DEVICE_UPDATE] " + 
            //                     "@GUID = @PGUID, " +
            //                     "@CUSER = @PCUSER, " + 
            //                     "@CODE = @PCODE, " + 
            //                     "@NAME = @PNAME, " + 
            //                     "@LCD_PORT = @PLCD_PORT, " +
            //                     "@SCALE_PORT = @PSCALE_PORT, " +
            //                     "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
            //                     "@PRINT_DESING = @PPRINT_DESING, " +
            //                     "@SCANNER_PORT = @PSCANNER_PORT " ,
            //             param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50','PPRINT_DESING:string|50','PSCANNER_PORT:string|50'],
            //             dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING','SCANNER_PORT']
            //         },
            //         control :
            //         {
            //             query : "SELECT * FROM [dbo].[POS_DEVICE_VW_01] WHERE GUID = @GUID",
            //             param : ['GUID:string|50'],
            //             dataprm : ['GUID'],
            //         }
            //     }
            // },
        ]
        return tmpSchema
    }
    //SQL DEN LOCAL E GETİR 
    fetchToSql(pTemp,pClear)
    {
        return new Promise(async resolve => 
        {
            if(typeof pClear != 'undefined' && pClear == true)
            {
                await this.clearTbl(pTemp.name)
            }

            let tmpCount = 0
            let tmpPageLimit = 1000
            let tmpPageCount = 0
            let tmpStartPage = 0
            let tmpEndPage = 0

            let tmpDataQuery = {...pTemp.from}
            tmpDataQuery.query = tmpDataQuery.query.toString().replace('{0}',pClear ? '' : typeof tmpDataQuery.where == 'undefined' ? '' : tmpDataQuery.where)
            tmpDataQuery.buffer = true;
            
            let tmpBuf = await this.core.sql.execute(tmpDataQuery)
            if(typeof tmpBuf.result.err == 'undefined')
            {
                tmpCount = tmpBuf.result.count
                tmpPageCount = Math.ceil(tmpCount / tmpPageLimit) 

                for (let m = 0; m < tmpPageCount; m++) 
                {   
                    tmpStartPage = tmpPageLimit * m
                    tmpEndPage = tmpStartPage + tmpPageLimit
                    let tmpData = await this.core.sql.buffer({start : tmpStartPage,end : tmpEndPage,bufferId : tmpBuf.result.bufferId})                    
                    let tmpInserts = {querys:[],values:[]}
                    
                    if(typeof tmpData.result.err == 'undefined')
                    {                                
                        tmpData = tmpData.result.recordset 
                        
                        for (let i = 0; i < tmpData.length; i++) 
                        {   
                            let tmpValues = []
                            let tmpLocQuery = JSON.parse(JSON.stringify(pTemp.to))
                            tmpInserts.querys.push(tmpLocQuery.query)
                            
                            Object.values(tmpLocQuery.values[0]).map(tmpMap => 
                            {
                                if (typeof tmpMap.map !== 'undefined') 
                                {
                                    if (typeof tmpMap.type !== 'undefined' && tmpMap.type == 'date_time') 
                                    {
                                        tmpValues.push(moment(new Date(tmpData[i][tmpMap.map])).format('YYYY-MM-DD HH:mm:ss'))
                                    }
                                    else 
                                    {
                                        tmpValues.push(tmpData[i][tmpMap.map])
                                    }
                                }
                                else 
                                {
                                    tmpValues.push(tmpMap);
                                }
                            });

                            tmpInserts.values.push(tmpValues);
                        }

                        if(tmpInserts.querys.length > 0)
                        {
                            this.core.local.db.serialize(() => 
                            {
                                this.core.local.db.run('BEGIN TRANSACTION;');
                                for (let i = 0; i < tmpInserts.querys.length; i++) 
                                {
                                    this.core.local.db.run(tmpInserts.querys[i], typeof tmpInserts.values[i] == 'undefined' ? [] : tmpInserts.values[i],(err) => 
                                    {
                                        if (err) 
                                        {
                                            console.log(err.message + " - " + pTemp.name)
                                        }
                                    });
                                }
                                this.core.local.db.run('COMMIT;');
                            })
                        }
                    }
                    tmpInserts = null;
                    tmpData = null;
                    this.emit('onState',{tag:'progress',count:tmpCount,index:tmpEndPage})                
                }
                //SQL DEKI BUFFER TEMIZLENIYOR.
                this.core.sql.bufferRemove({bufferId : tmpBuf.result.bufferId})
            }
            this.emit('onState',{tag:'progress',count:0,index:0})
            resolve()
        });
    }
    //LOCAL DEN SQL E GÖNDER
    sendToSql(pTemp)
    {
        return new Promise(async resolve => 
        {
            let tmpData = await this.core.local.select(pTemp.from)
            
            if(typeof tmpData.result.err == 'undefined')
            {
                tmpData = tmpData.result.recordset 
                for (let i = 0; i < tmpData.length; i++) 
                {
                    let tmpCtrlQuery = JSON.parse(JSON.stringify(pTemp.to.control))
                    tmpCtrlQuery.value = this.setSqlValues(tmpCtrlQuery,tmpData[i])
                    
                    let tmpCtrlData = await this.core.sql.execute(tmpCtrlQuery)
                    
                    if(typeof tmpCtrlData.result.err == 'undefined')
                    {
                        if(tmpCtrlData.result.recordset.length > 0)
                        {               
                            let tmpQuery = JSON.parse(JSON.stringify(pTemp.to.update))
                            tmpQuery.value = this.setSqlValues(tmpQuery,tmpData[i])
                            
                            let tmpResult = await this.core.sql.execute(tmpQuery)
                            if(typeof tmpResult.result.err != 'undefined')
                            {
                                console.log(tmpResult.result.err)
                                resolve(false)
                                return
                            }
                        }
                        else
                        {                        
                            let tmpQuery = JSON.parse(JSON.stringify(pTemp.to.insert))
                            tmpQuery.value = this.setSqlValues(tmpQuery,tmpData[i])
                            
                            let tmpResult = await this.core.sql.execute(tmpQuery)
                            if(typeof tmpResult.result.err != 'undefined')
                            {
                                console.log(tmpResult.result.err)
                                resolve(false)
                                return
                            }
                        }
                    }
                    else
                    {
                        console.log(tmpCtrlData.result.err)
                        resolve(false)
                    }
                    
                } 
            }
            resolve(true)
        });
    }
    //SQL DEN LOCAL E ŞEMA AKTARIMI.
    transferSql(pClear)
    {
        return new Promise(async resolve => 
        {
            let tmpSchema = this.fetchSchema()
            for (let i = 0; i < tmpSchema.length; i++) 
            {                
                this.emit('onState',{tag:'',text: tmpSchema[i].name})
                await this.fetchToSql(tmpSchema[i],pClear)             
            }
            resolve()
        });
    }
    //LOCAL DEN SQL E ŞEMA AKTARIMI.
    transferLocal()
    {
        return new Promise(async resolve => 
        {
            let tmpSchema = this.sendSchema()
            for (let i = 0; i < tmpSchema.length; i++) 
            {
                this.emit('onState',{tag:'',text: tmpSchema[i].from.name})
                let tmpResult = await this.sendToSql(tmpSchema[i])
                if(!tmpResult)
                {
                    resolve(false)
                    return
                }
            }
            let tmpData = await this.core.local.select({from : "NF525_JET"})
            for (let i = 0; i < tmpData.result.length; i++) 
            {
                let tmpJetData =
                {
                    CUSER:tmpData.result[i].CUSER,    
                    CDATE:tmpData.result[i].CDATE,            
                    DEVICE:tmpData.result[i].DEVICE,  
                    CODE:tmpData.result[i].CODE,
                    NAME:tmpData.result[i].NAME,
                    DESCRIPTION:tmpData.result[i].DESCRIPTION,
                    APP_VERSION:tmpData.result[i].APP_VERSION,
                }
                this.core.socket.emit('nf525',{cmd:"jet",data:tmpJetData})
            }
            await this.clearTbl("NF525_JET")
            resolve(true)
        });
    }
    //SQL İÇİN DATA İLE SORGUDAKİ PARAMETRELER EŞLEŞTİRİLİYOR GERİ DÖNÜŞ OLARAK VALUES DİZİSİ DÖNDÜRÜLÜYOR.
    setSqlValues(pQuery,pData)
    {
        let tmpArr = []
        if(typeof pQuery != 'undefined' && typeof pQuery.param != 'undefined')
        {
            for (let i = 0;i < pQuery.param.length; i++) 
            {         
                if(typeof pQuery.dataprm == 'undefined')
                {
                    tmpArr.push(pData[pQuery.param[i].split(':')[0]]);
                }
                else
                {
                    tmpArr.push(pData[pQuery.dataprm[i]]);
                }                                                       
            }
        }
        return tmpArr;
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
    clearTbl(pTblName)
    {
        return new Promise(async resolve => 
        {
            await this.core.local.clearTbl(pTblName)
            resolve()
        });
    }
}