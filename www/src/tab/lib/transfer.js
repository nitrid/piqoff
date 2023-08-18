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
            //ITEMS_VW_02
            {
                name : "ITEMS_VW_02",
                query : `CREATE TABLE IF NOT EXISTS ITEMS_VW_02 (
                        GUID TEXT PRIMARY KEY,
                        CODE TEXT,
                        NAME TEXT,
                        VAT REAL,
                        PRICE REAL,
                        IMAGE TEXT,
                        UNIT TEXT,
                        UNIT_NAME TEXT,
                        UNIT_FACTOR REAL,
                        MAIN_GRP TEXT,
                        MAIN_GRP_NAME TEXT);`
            }
        ]

        return tmpTbl
    }
    fetchSchema()
    {
        let tmpSchema = 
        [
            //ITEMS_VW_02
            {
                name : "ITEMS_VW_02",
                from : 
                {
                    type : "select",
                    query : `SELECT GUID,CODE,NAME,VAT,PRICE,IMAGE,UNIT,UNIT_NAME,UNIT_FACTOR,MAIN_GRP,MAIN_GRP_NAME FROM ITEMS_VW_02 WHERE STATUS = 1`,
                },
                to : 
                {
                    type : "insert",
                    query : `INSERT OR REPLACE INTO ITEMS_VW_02 (GUID, CODE, NAME, VAT, PRICE, IMAGE, UNIT, UNIT_NAME, UNIT_FACTOR, MAIN_GRP, MAIN_GRP_NAME) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    values :[{GUID : {map:'GUID'},CODE : {map:'CODE'},NAME : {map:'NAME'},VAT : {map:'VAT'},PRICE : {map:'PRICE'},IMAGE : {map:'IMAGE'},
                            UNIT : {map:'UNIT'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},MAIN_GRP : {map:'MAIN_GRP'},
                            MAIN_GRP_NAME : {map:'MAIN_GRP_NAME'}}]
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
                            if(this.core.local.platform == 'cordova')
                            {
                                let tmpArr = []
                                for (let i = 0; i < tmpInserts.querys.length; i++) 
                                {
                                    tmpArr.push([tmpInserts.querys[i],tmpInserts.values[i]])
                                }

                                this.core.local.db.sqlBatch(tmpArr, 
                                () => 
                                {
                                    console.log('Tab is now populated.');
                                },
                                (error) => 
                                {
                                    console.log('Populate table error: ' + error.message);
                                })
                            }
                            else if(this.core.local.platform == 'electron')
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