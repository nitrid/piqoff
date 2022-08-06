import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class posCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            DEVICE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            CUSTOMER_POINT : 0,
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            TOTAL : 0,
            TICKET : '', //İADE ALINAN TICKET
            REBATE_CHEQPAY : '', //İADE CEKİ
            STATUS : 0
        }

        this.posSale = new posSaleCls();
        this.posPay = new posPaymentCls();
        this.posExtra = new posExtraCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50'],
            local : 
            {
                type : "select",
                from : "POS_VW_01",
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@DEVICE = @PDEVICE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@FAMOUNT = @PFAMOUNT, " + 
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@TICKET = @PTICKET, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                    'PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int'],
            dataprm : ['GUID','CUSER','DEVICE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET','STATUS'],
            local : 
            {
                type : "insert",
                into : "POS_VW_01",
                values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                LUSER_NAME : {map:'LUSER_NAME'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'},
                FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},TOTAL : {map:'TOTAL'},TICKET : {map:'TICKET'},
                REBATE_CHEQPAY : {map:'REBATE_CHEQPAY'},STATUS : {map:'STATUS'},DESCRIPTION : {map:'DESCRIPTION'},REF : {map:'REF'}}]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@DEVICE = @PDEVICE, " +
                    "@DEPOT = @PDEPOT, " +
                    "@TYPE = @PTYPE, " +                      
                    "@DOC_DATE = @PDOC_DATE, " + 
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@FAMOUNT = @PFAMOUNT, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@DISCOUNT = @PDISCOUNT, " + 
                    "@LOYALTY = @PLOYALTY, " + 
                    "@VAT = @PVAT, " + 
                    "@TOTAL = @PTOTAL, " + 
                    "@TICKET = @PTICKET, " + 
                    "@STATUS = @PSTATUS ", 
            param : ['PGUID:string|50','PCUSER:string|25','PDEVICE:string|25','PDEPOT:string|50','PTYPE:int','PDOC_DATE:date','PCUSTOMER:string|50',
                    'PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PTICKET:string|50','PSTATUS:int'],
            dataprm : ['GUID','CUSER','DEVICE','DEPOT_GUID','TYPE','DOC_DATE','CUSTOMER_GUID','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT','TOTAL','TICKET','STATUS'],
            local : 
            {
                type : "update",
                in : "POS_VW_01",
                set : {CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                LUSER_NAME : {map:'LUSER_NAME'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},CUSTOMER_POINT : {map:'CUSTOMER_POINT'},
                FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},TOTAL : {map:'TOTAL'},TICKET : {map:'TICKET'},
                REBATE_CHEQPAY : {map:'REBATE_CHEQPAY'},STATUS : {map:'STATUS'},DESCRIPTION : {map:'DESCRIPTION'},REF : {map:'REF'}},
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.posSale.dt('POS_SALE'))
        this.ds.add(this.posPay.dt('POS_PAYMENT'))
        this.ds.add(this.posExtra.dt('POS_EXTRA'))
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
        if(typeof this.dt('POS') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            
            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('POS').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm

            this.ds.get('POS').selectCmd.value = Object.values(tmpPrm);
              
            await this.ds.get('POS').refresh();
            
            if(this.ds.get('POS').length > 0)
            {
                await this.posSale.load({POS_GUID:this.ds.get('POS')[0].GUID})
                await this.posPay.load({POS_GUID:this.ds.get('POS')[0].GUID})
                await this.posExtra.load({POS_GUID:this.ds.get('POS')[0].GUID})
            }
            resolve(this.ds.get('POS'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
            this.posSale.subTotalBuild();
        });
    }
}
export class posSaleCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            LDATE : moment(new Date()).utcOffset(0, true),
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',            
            LINE_NO : 0,
            ITEM_GUID : '00000000-0000-0000-0000-000000000000',
            ITEM_CODE : '',
            ITEM_NAME : '',
            ITEM_SNAME : '',
            TICKET_REST : 0,
            COST_PRICE : 0,
            MIN_PRICE : 0,
            MAX_PRICE : 0,
            INPUT : '',
            BARCODE_GUID : '00000000-0000-0000-0000-000000000000',
            BARCODE : '',
            UNIT_GUID : '00000000-0000-0000-0000-000000000000',
            UNIT_NAME : '',
            UNIT_SHORT : '',
            UNIT_FACTOR : 0,
            QUANTITY : 0,
            PRICE : 0,
            FAMOUNT : 0,
            AMOUNT : 0,
            DISCOUNT : 0,
            LOYALTY : 0,
            VAT : 0,
            VAT_RATE : 0,
            VAT_TYPE : '',
            TOTAL : 0,
            SUBTOTAL : 0,
            PROMO_TYPE : 0,
            GRAND_AMOUNT : 0,
            GRAND_DISCOUNT : 0,
            GRAND_LOYALTY : 0,
            GRAND_VAT : 0,
            GRAND_TOTAL : 0,
            STATUS : 0
        }
        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_SALE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_SALE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000')) ORDER BY LINE_NO DESC",
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                from : "POS_SALE_VW_01",
            }
        } 
        tmpDt.insertCmd = 
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
                    "@PROMO_TYPE = @PPROMO_TYPE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PCDATE:datetime','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                    'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int'],
            dataprm : ['GUID','CUSER','LDATE','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY','VAT',
                    'TOTAL','SUBTOTAL','PROMO_TYPE'],
            local : 
            {
                type : "insert",
                into : "POS_SALE_VW_01",
                values : [{GUID : {map:'GUID'},CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},LINE_NO : {map:'LINE_NO'},
                ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},ITEM_SNAME : {map:'ITEM_SNAME'},ITEM_GRP_CODE : {map:'ITEM_GRP_CODE'},ITEM_GRP_NAME : {map:'ITEM_GRP_NAME'},
                COST_PRICE : {map:'COST_PRICE'},MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},TICKET_REST : {map:'TICKET_REST'},INPUT : {map:'INPUT'},BARCODE_GUID : {map:'BARCODE_GUID'},
                BARCODE : {map:'BARCODE'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},UNIT_SHORT : {map:'UNIT_SHORT'},QUANTITY : {map:'QUANTITY'},
                PRICE : {map:'PRICE'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},VAT_RATE : {map:'VAT_RATE'},VAT_TYPE : {map:'VAT_TYPE'},
                TOTAL : {map:'TOTAL'},SUBTOTAL : {map:'SUBTOTAL'},PROMO_TYPE : {map:'PROMO_TYPE'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},
                GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},REBATE_TICKET : {map:'REBATE_TICKET'}}]
            }
        } 
        tmpDt.updateCmd = 
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
                    "@PROMO_TYPE = @PPROMO_TYPE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PLDATE:datetime','PPOS:string|50','PLINE_NO:int','PITEM:string|50','PINPUT:string|25','PBARCODE:string|50','PUNIT:string|50',
                     'PQUANTITY:float','PPRICE:float','PFAMOUNT:float','PAMOUNT:float','PDISCOUNT:float','PLOYALTY:float','PVAT:float','PTOTAL:float','PSUBTOTAL:int','PPROMO_TYPE:int'],
            dataprm : ['GUID','CUSER','LDATE','POS_GUID','LINE_NO','ITEM_GUID','INPUT','BARCODE_GUID','UNIT_GUID','QUANTITY','PRICE','FAMOUNT','AMOUNT','DISCOUNT','LOYALTY',
                    'VAT','TOTAL','SUBTOTAL','PROMO_TYPE'],
            local : 
            {
                type : "update",
                in : "POS_SALE_VW_01",
                set : {CDATE : {map:'CDATE',type:'date_time'},CUSER : {map:'CUSER'},CUSER_NAME : {map:'CUSER_NAME'},LDATE : {map:'LDATE',type:'date_time'},LUSER : {map:'LUSER'},
                LUSER_NAME : {map:'LUSER_NAME'},POS_GUID : {map:'POS_GUID'},DEVICE : {map:'DEVICE'},DEPOT_GUID : {map:'DEPOT_GUID'},DEPOT_CODE : {map:'DEPOT_CODE'},DEPOT_NAME : {map:'DEPOT_NAME'},TYPE : {map:'TYPE'},
                DOC_DATE : {map:'DOC_DATE',type:'date_time'},CUSTOMER_GUID : {map:'CUSTOMER_GUID'},CUSTOMER_CODE : {map:'CUSTOMER_CODE'},CUSTOMER_NAME : {map:'CUSTOMER_NAME'},LINE_NO : {map:'LINE_NO'},
                ITEM_GUID : {map:'ITEM_GUID'},ITEM_CODE : {map:'ITEM_CODE'},ITEM_NAME : {map:'ITEM_NAME'},ITEM_SNAME : {map:'ITEM_SNAME'},ITEM_GRP_CODE : {map:'ITEM_GRP_CODE'},ITEM_GRP_NAME : {map:'ITEM_GRP_NAME'},
                COST_PRICE : {map:'COST_PRICE'},MIN_PRICE : {map:'MIN_PRICE'},MAX_PRICE : {map:'MAX_PRICE'},TICKET_REST : {map:'TICKET_REST'},INPUT : {map:'INPUT'},BARCODE_GUID : {map:'BARCODE_GUID'},
                BARCODE : {map:'BARCODE'},UNIT_GUID : {map:'UNIT_GUID'},UNIT_NAME : {map:'UNIT_NAME'},UNIT_FACTOR : {map:'UNIT_FACTOR'},UNIT_SHORT : {map:'UNIT_SHORT'},QUANTITY : {map:'QUANTITY'},
                PRICE : {map:'PRICE'},FAMOUNT : {map:'FAMOUNT'},AMOUNT : {map:'AMOUNT'},DISCOUNT : {map:'DISCOUNT'},LOYALTY : {map:'LOYALTY'},VAT : {map:'VAT'},VAT_RATE : {map:'VAT_RATE'},VAT_TYPE : {map:'VAT_TYPE'},
                TOTAL : {map:'TOTAL'},SUBTOTAL : {map:'SUBTOTAL'},PROMO_TYPE : {map:'PROMO_TYPE'},GRAND_AMOUNT : {map:'GRAND_AMOUNT'},GRAND_DISCOUNT : {map:'GRAND_DISCOUNT'},GRAND_LOYALTY : {map:'GRAND_LOYALTY'},
                GRAND_VAT : {map:'GRAND_VAT'},GRAND_TOTAL : {map:'GRAND_TOTAL'},STATUS : {map:'STATUS'},REBATE_TICKET : {map:'REBATE_TICKET'}},
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_SALE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
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
        if(typeof this.dt('POS_SALE') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_SALE').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',POS_GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_SALE').selectCmd.value = Object.values(tmpPrm);
            
            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('POS_SALE').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm

            await this.ds.get('POS_SALE').refresh();
            
            resolve(this.ds.get('POS_SALE'));    
            this.subTotalBuild();
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
            this.subTotalBuild();
        }); 
    }
    subTotalBuild()
    {
        let tmpData = this.ds.get('POS_SALE');
        let tmpArr = [];
        let tmpSubIndex = -1;

        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpData[i].GUID == '00000000-0000-0000-0000-000000000000')
            {
                tmpData.splice(i, 1); 
            }
        }
        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpSubIndex != tmpData[i].SUBTOTAL)
            {
                tmpSubIndex = tmpData[i].SUBTOTAL;
                if(tmpData[i].SUBTOTAL > 0)
                { 
                    let tmpItem = {...this.empty};
                    tmpItem.LDATE = tmpData.where({SUBTOTAL:tmpSubIndex}).max('LDATE');
                    tmpItem.ITEM_NAME = "SUB TOTAL";
                    tmpItem.ITEM_SNAME = "SUB TOTAL";
                    tmpItem.SUBTOTAL = tmpSubIndex;
                    tmpItem.AMOUNT = tmpData.where({SUBTOTAL:tmpSubIndex}).sum('AMOUNT',2);

                    tmpArr.push(tmpItem)
                }
            }
            tmpArr.push(tmpData[i])
        }
        tmpData.splice(0,tmpData.length)
        tmpData.import(tmpArr)
    }
}
export class posPaymentCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            SAFE : '',
            DEPOT_GUID : '00000000-0000-0000-0000-000000000000',
            DEPOT_CODE : '',
            DEPOT_NAME : '',
            TYPE : 0,
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            CUSTOMER_CODE : '',
            CUSTOMER_NAME : '',
            PAY_TYPE : 0,
            PAY_TYPE_NAME : '',
            LINE_NO : 0,
            AMOUNT : 0,
            CHANGE : 0,
            TICKET_PLUS : 0,
            GRAND_AMOUNT : 0,
            GRAND_DISCOUNT : 0,
            GRAND_LOYALTY : 0,
            GRAND_VAT : 0,
            GRAND_TOTAL : 0,
            STATUS : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_PAYMENT');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_PAYMENT_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                from : "POS_PAYMENT_VW_01",
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@POS = @PPOS, " +
                    "@TYPE = @PTYPE, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@AMOUNT = @PAMOUNT, " + 
                    "@CHANGE = @PCHANGE ", 
            param : ['PGUID:string|50','PCUSER:string|25','PPOS:string|50','PTYPE:int','PLINE_NO:int','PAMOUNT:float','PCHANGE:float'],
            dataprm : ['GUID','CUSER','POS_GUID','PAY_TYPE','LINE_NO','AMOUNT','CHANGE']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_PAYMENT_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@POS_GUID = @PPOS_GUID ", 
            param : ['PCUSER:string|25','PGUID:string|50','PPOS_GUID:string|50'],
            dataprm : ['CUSER','GUID','POS_GUID']
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
        if(typeof this.dt('POS_PAYMENT') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_PAYMENT').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'',POS_GUID:''}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }            
                 
            this.ds.get('POS_PAYMENT').selectCmd.value = Object.values(tmpPrm);

            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('POS_PAYMENT').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm
              
            await this.ds.get('POS_PAYMENT').refresh();
            
            resolve(this.ds.get('POS_PAYMENT'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posPluCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            TYPE : 0,
            TYPE_NAME : '',
            NAME : '',
            LINK : '00000000-0000-0000-0000-000000000000',
            LINK_CODE : '',
            LINK_NAME : '',
            LOCATION : 0,
            GROUP_INDEX : 0
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('PLU');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[PLU_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CUSER = @CUSER) OR (@CUSER = '')) AND " + 
                    "((TYPE = @TYPE) OR (@TYPE = -1)) ORDER BY LOCATION ASC",
            param : ['GUID:string|50','CUSER:string|25','TYPE:int'],
            local : 
            {
                type : "select",
                from : "PLU_VW_01",
                order: 
                {
                    by: "LOCATION",
                    type: "asc"
                }
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " +
                    "@NAME = @PNAME, " +
                    "@LINK = @PLINK, " +
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "insert",
                into : "PLU",
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TYPE : {map:'TYPE'},
                        NAME : {map:'NAME'},
                        LINK : {map:'LINK'},
                        LOCATION : {map:'LOCATION'},
                        GROUP_INDEX : {map:'GROUP_INDEX'}
                    }
                ]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " +
                    "@NAME = @PNAME, " +
                    "@LINK = @PLINK, " +
                    "@LOCATION = @PLOCATION, " + 
                    "@GROUP_INDEX = @PGROUP_INDEX ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLINK:string|50','PLOCATION:int','PGROUP_INDEX:int'],
            dataprm : ['GUID','CUSER','TYPE','NAME','LINK','LOCATION','GROUP_INDEX'],
            local : 
            {
                type : "update",
                in : "PLU",
                set : 
                {
                    CUSER : {map:'CUSER'},
                    TYPE : {map:'TYPE'},
                    NAME : {map:'NAME'},
                    LINK : {map:'LINK'},
                    LOCATION : {map:'LOCATION'},
                    GROUP_INDEX : {map:'GROUP_INDEX'}
                },
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_PLU_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID, " + 
                    "@TYPE = @PTYPE ", 
            param : ['PCUSER:string|25','PGUID:string|50','PTYPE:int'],
            dataprm : ['CUSER','GUID','TYPE'],
            local : 
            {
                type : "delete",
                from : "PLU",
                where : 
                {
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'},
                    TYPE : {map:'TYPE'}
                }
            }
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
        if(typeof this.dt('PLU') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('PLU').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',CUSER:'',TYPE:-1}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',CUSER:'',TYPE:-1}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CUSER = typeof arguments[0].CUSER == 'undefined' ? '' : arguments[0].CUSER;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? -1 : arguments[0].TYPE;
            }

            this.ds.get('PLU').selectCmd.value = Object.values(tmpPrm);
            
            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('PLU').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm 
            
            await this.ds.get('PLU').refresh();
            resolve(this.ds.get('PLU'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posExtraCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            LUSER : this.core.auth.data.CODE,
            TAG : '',
            POS_GUID : '00000000-0000-0000-0000-000000000000',
            LINE_NO : 0,
            DESCRIPTION : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_EXTRA');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_EXTRA_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((POS_GUID = @POS_GUID) OR (@POS_GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50','POS_GUID:string|50'],
            local : 
            {
                type : "select",
                from : "POS_EXTRA_VW_01",
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TAG = @PTAG, " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@DESCRIPTION = @PDESCRIPTION ", 
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_NO:int','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_NO','DESCRIPTION'],
            local : 
            {
                type : "insert",
                into : "POS_EXTRA",
                values : 
                [
                    {
                        GUID : {map:'GUID'},
                        CUSER : {map:'CUSER'},
                        TAG : {map:'TAG'},
                        POS_GUID : {map:'POS_GUID'},
                        LINE_NO : {map:'LINE_NO'},
                        DESCRIPTION : {map:'DESCRIPTION'}
                    }
                ]
            }
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_UPDATE] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TAG = @PTAG, " +
                    "@POS_GUID = @PPOS_GUID, " +
                    "@LINE_NO = @PLINE_NO, " +
                    "@DESCRIPTION = @PDESCRIPTION ",  
            param : ['PGUID:string|50','PCUSER:string|25','PTAG:string|25','PPOS_GUID:string|50','PLINE_NO:int','PDESCRIPTION:string|max'],
            dataprm : ['GUID','CUSER','TAG','POS_GUID','LINE_NO','DESCRIPTION'],
            local : 
            {
                type : "update",
                in : "POS_EXTRA",
                set : 
                {
                    CUSER : {map:'CUSER'},
                    TAG : {map:'TAG'},
                    POS_GUID : {map:'POS_GUID'},
                    LINE_NO : {map:'LINE_NO'},
                    DESCRIPTION : {map:'DESCRIPTION'}
                },
                where : {GUID : {map:'GUID'}}
            }
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_EXTRA_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " +
                    "@GUID = @PGUID " , 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID'],
            local : 
            {
                type : "delete",
                from : "POS_EXTRA",
                where : 
                {
                    CUSER : {map:'CUSER'},
                    GUID : {map:'GUID'}
                }
            }
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
        if(typeof this.dt('POS_EXTRA') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(typeof arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_EXTRA').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİ ÖRN: {GUID:'',POS_GUID:''}
        return new Promise(async resolve => 
        {
            let tmpPrm = {GUID:'00000000-0000-0000-0000-000000000000',POS_GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.POS_GUID = typeof arguments[0].POS_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].POS_GUID;
            }

            this.ds.get('POS_EXTRA').selectCmd.value = Object.values(tmpPrm);
            
            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('POS_EXTRA').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm

            await this.ds.get('POS_EXTRA').refresh();
            
            resolve(this.ds.get('POS_EXTRA'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
}
export class posDeviceCls
{
    constructor()
    {
        if(core.instance.util.isElectron())
        {
            this.escpos = global.require('escpos');
            this.escpos.Serial = global.require('escpos-serialport');
            this.escpos.Screen = global.require('escpos-screen');
            this.escpos.USB = global.require('escpos-usb');
            this.path = global.require('path')
            this.serialport = global.require('serialport');
        }

        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : '',
            LDATE : moment(new Date()).format("YYYY-MM-DD"),
            LUSER : this.core.auth.data.CODE,
            LUSER_NAME : '',
            CODE : '',
            NAME : '',
            LCD_PORT: '',
            SCALE_PORT : '',
            PAY_CARD_PORT : '',
            PRINT_DESING : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('POS_DEVICE');            
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[POS_DEVICE_VW_01] WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000')) AND ((CODE = @CODE) OR (@CODE = ''))",
            param : ['GUID:string|50','CODE:string|25'],
            local : 
            {
                type : "select",
                from : "POS_DEVICE_VW_01",
            }
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_INSERT] " + 
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@CODE = @PCODE, " + 
                    "@NAME = @PNAME, " + 
                    "@LCD_PORT = @PLCD_PORT, " +
                    "@SCALE_PORT = @PSCALE_PORT, " +
                    "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
                    "@PRINT_DESING = @PPRINT_DESING " ,
                   
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50','PPRINT_DESING:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_UPDATE] " + 
            "@GUID = @PGUID, " +
            "@CUSER = @PCUSER, " + 
            "@CODE = @PCODE, " + 
            "@NAME = @PNAME, " + 
            "@LCD_PORT = @PLCD_PORT, " +
            "@SCALE_PORT = @PSCALE_PORT, " +
            "@PAY_CARD_PORT = @PPAY_CARD_PORT, " +
            "@PRINT_DESING = @PPRINT_DESING " ,
           
            param : ['PGUID:string|50','PCUSER:string|25','PCODE:string|50','PNAME:string|50','PLCD_PORT:string|50','PSCALE_PORT:string|50','PPAY_CARD_PORT:string|50','PPRINT_DESING:string|50'],
            dataprm : ['GUID','CUSER','CODE','NAME','LCD_PORT','SCALE_PORT','PAY_CARD_PORT','PRINT_DESING']
        } 
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_POS_DEVICE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ",
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
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
        if(typeof this.dt('POS_DEVICE') == 'undefined')
        {
            return;
        }
        let tmp = {}
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}            
        }
        else
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('POS_DEVICE').push(tmp)
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
                GUID : '00000000-0000-0000-0000-000000000000',
                CODE : ''
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }
            this.ds.get('POS_DEVICE').selectCmd.value = Object.values(tmpPrm)

            Object.keys(tmpPrm).forEach(key =>
            {
                if (tmpPrm[key] === undefined || tmpPrm[key] == '00000000-0000-0000-0000-000000000000' || tmpPrm[key] == '' || tmpPrm[key] == -1) 
                {
                    delete tmpPrm[key];
                }
            })

            this.ds.get('POS_DEVICE').selectCmd.local.where = Object.keys(tmpPrm).length == 0 ? undefined : tmpPrm

            await this.ds.get('POS_DEVICE').refresh();
            resolve(this.ds.get('POS_DEVICE'));    
        });
    }
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete()
            resolve(await this.ds.update()); 
        });
    }
    lcdPrint(pData)
    {
        if(!core.instance.util.isElectron())
        {
            return
        }
        
        let device  = new this.escpos.Serial(this.dt().length > 0 ? this.dt()[0].LCD_PORT : "", { baudRate: 9600, autoOpen: false });
        let options = { encoding: "GB18030" /* default */ }
        let usbScreen = new this.escpos.Screen(device,options);

        device.open(function(error)
        {
            usbScreen.blink(pData.blink);
            usbScreen.clear();
            usbScreen.text(pData.text).close();
        });
    }
    lcdClear()
    {
        if(!core.instance.util.isElectron())
        {
            return
        }

        let device  = new this.escpos.Serial(this.dt().length > 0 ? this.dt()[0].LCD_PORT : "", { baudRate: 9600, autoOpen: false });
        let options = { encoding: "GB18030" /* default */ }
        let usbScreen = new this.escpos.Screen(device,options);

        device.open(function(error)
        {
            usbScreen.clear();
        });
    }
    caseOpen()
    {
        if(!core.instance.util.isElectron())
        {
            return
        }
        let device  = new this.escpos.USB();
        let options = { encoding: "GB18030" /* default */ }
        let printer = new this.escpos.Printer(device, options);
        device.open(function(error)
        {
            printer.cashdraw(2);
            printer.close();
        })
    }
    mettlerScaleSend(pPrice)
    {
        if(!core.instance.util.isElectron())
        {
            return
        }

        let toHex = (pStr) =>
        {
            let result = '';
            for (let i = 0; i < pStr.length; i++) 
            {
                result += pStr.charCodeAt(i).toString(16);
            }
            return result;
        }
        let Ror16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData >> pDistance) | (pData << (16 - pDistance));
        }
        let Rol16 = (pData,pDistance) =>
        {
            pDistance &= 15;
            pData &= 0xFFFF;
            return (pData << pDistance) | (pData >> (16 - pDistance));
        }

        return new Promise((resolve) =>
        {
            let port = new this.serialport(this.dt().length > 0 ? this.dt()[0].PAY_CARD_PORT : "",{baudRate:9600,dataBits:7,parity:'odd',stopBits:1});
            let TmpPrice = parseInt(pPrice * 100).toString().padStart(6,'0');
            //TERAZİYE FİYAT GÖNDERİLİYOR.
            port.write('01' + TmpPrice +'');
            let ReciveBuffer = '';

            //TERAZİDEN DÖNEN DEĞERLERİN OKUNMASI
            port.on('data',line =>
            {         
                //TERAZİDEN ONAY GELDİĞİNDE..
                if(toHex(line.toString()) == "6")
                {
                    port.write('')
                }
                //TERAZİDEN ONAY GELMEDİĞİNDE
                else if(toHex(line.toString()) == "15")
                {
                    //TEKRAR FİYAT GÖNDERİLİYOR.
                    port.write('01' + TmpPrice +'');
                }
                //VALİDASYON İŞLEMİ BAŞLANGIÇ
                if(line.toString().substring(1,3) == "11")
                {
                    //VALİDASYON İÇİN GEREKLİ OLAN RANDOM NUMARA
                    if(line.toString().substring(4,5) == "2")
                    {      
                        //RANDOM NUMARA BİT ÇEVİRİM İŞLEMİ      
                        let cs = ("000" + parseInt(Rol16(0x2C3C, line.toString().substring(5,6)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                        let kw = ("000" + parseInt(Ror16(0xFA07, line.toString().substring(6,7)) & 0xFFFF).toString(16)).slice(-4).toString().toUpperCase();
                        let cskw = cs + kw;
                        //VALİDASYON CS VE KW GÖNDERİLİYOR 
                        port.write('10'+ cskw.toString() + '')
                    }
                    else if(line.toString().substring(4,5) == "0")
                    {
                        //VALİDASYON BAŞARISIZ DURUMU
                        //console.log("Validasyon Başarısız");
                        port.write('01' + TmpPrice +'');
                    }
                    else if(line.toString().substring(4,5) == "1")
                    {
                        //VALİDASYON BAŞARILI DURUMU
                        console.log("Validasyon Başarılı");
                        let TmpResult = 
                        {
                            Type: "01",
                            Result :
                            {
                                Msg : "Validasyon Başarılı"
                            }                            
                        }
                        resolve(TmpResult);
                        port.close();
                    }
                }
                //TERAZİ SONUÇ DÖNDÜĞÜNDE
                if(line.toString().substring(1,3) == "02" || ReciveBuffer.substring(1,3) == "02")
                {
                    ReciveBuffer += line.toString()
                    if(ReciveBuffer.length >= 26)
                    {
                        let TmpScale = ReciveBuffer.substring(6,11)
                        let TmpPrice = ReciveBuffer.substring(12,18)
                        let TmpAmount = ReciveBuffer.substring(19,25)
                        
                        let TmpResult = 
                        {
                            Type: "02",
                            Result :
                            {
                                Scale : TmpScale / 1000,
                                Price : TmpPrice / 100,
                                Amount : TmpAmount / 100
                            }
                        }

                        resolve(TmpResult);
                        ReciveBuffer = '';
                        port.close();
                    }
                }
            })

            setTimeout(()=>
            { 
                if(port.isOpen)
                {
                    port.close(); 
                }
            }, 20000);

            return port.on("close", resolve)
        });
    }
    cardPayment(pAmount)
    {
        if(!core.instance.util.isElectron())
        {
            return
        }
        
        let ack = false;
        let oneShoot = false;
        let payMethod = "card";

        let generate_lrc = function(real_msg_with_etx)
        {
            let lrc = 0, text = real_msg_with_etx.split('');
            for (let i in text)
            {
                if(typeof text[i].charCodeAt != 'undefined')
                {
                    lrc ^= text[i].charCodeAt(0);
                }
            }

            console.log('lrc => ', lrc);
            return lrc;
        }

        return new Promise((resolve) =>
        {
            let port = new this.serialport(this.dt().length > 0 ? this.dt()[0].LCD_PORT : "");
            port.on('data',(data)=> 
            {
                if(String.fromCharCode(data[0]) == String.fromCharCode(6))
                {
                    if(ack == false)
                    {
                        oneShoot = false;
                        let tmpData = 
                        {
                            'pos_number': '01',
                            'amount_msg': ('0000000' + (pAmount * 100).toFixed(0)).substr(-8),
                            'answer_flag': '0',
                            'payment_mode': payMethod  == 'check' ? 'C' : '1', 
                            'transaction_type': '0',
                            'currency_numeric': 978, 
                            'private': '          ',
                            'delay': 'A010',
                            'auto': 'B010'
                        };
                        
                        let msg = Object.keys(tmpData).map( k => tmpData[k] ).join('');
                        if (msg.length > 34) 
                        {
                            resolve({tag:"response",msg:"error"});                 
                            port.close();               
                            console.log('ERR. : failed data > 34 characters.', msg);
                            return
                        }
                        let real_msg_with_etx = msg.toString().concat(String.fromCharCode(3));//ETX
                        
                        let lrc = generate_lrc(real_msg_with_etx);
                        //STX + msg + lrc
                        let tpe_msg = (String.fromCharCode(2)).concat(real_msg_with_etx).concat(String.fromCharCode(lrc));
                        port.write(tpe_msg)
                        ack = true;
                    }
                }
                else if(String.fromCharCode(data[0]) == String.fromCharCode(6))
                {
                    port.write(String.fromCharCode(4))
                }
                else if(String.fromCharCode(data[0]) == String.fromCharCode(5))
                {
                    port.write(String.fromCharCode(6));
                }
                else if(data.length >= 25)
                {
                    if(oneShoot)
                    {
                        port.close();
                        resolve({tag:"response",msg:"error"});   
                        return;
                    }
    
                    oneShoot = true;
                    let str = "";
                    if(isNaN(data.toString().substr(1)))
                    {
                        str = data.toString().substr(1).substr(0, data.toString().length-3);
                    }
                    else
                    {
                        str = data.toString().substr(0, data.toString().length-3);;
                    }
                    let response = 
                    {
                        'pos_number'        : str.substr(0, 2),
                        'transaction_result': str.charAt(2),
                        'amount_msg'        : str.substr(3, 8),
                        'payment_mode'      : str.charAt(11),
                        'currency_numeric'  : str.substr(12, 3),
                        'private'           : str.substr(15, 11)
                    };

                    resolve({tag:"response",msg:JSON.stringify(response)});   
                    port.close();
                }
            });

            port.write(String.fromCharCode(5));

            setTimeout(()=>
            { 
                if(port.isOpen)
                {
                    port.close(); 
                }
            }, 65000);

            return port.on("close", resolve)
        });
    }
    escPrinter(pData)
    {    
        return new Promise(async resolve => 
        {
            if(!core.instance.util.isElectron())
            {
                resolve()
                return
            }
    
            let device  = new this.escpos.USB();
            let options = { encoding: "GB18030" /* default */ }
            let printer = new this.escpos.Printer(device, options);
    
            let imgLoad = (imgPath) => 
            {
                return new Promise((mresolve) =>
                {
                    this.escpos.Image.load(imgPath, function(image)
                    {
                        mresolve(image)
                    });
                });
            }
            device.open(async function(error)
            {   
                if(error != null)
                {
                    console.log(error)
                }
    
                let tmpArr = [];
                for (let i = 0; i < pData.length; i++) 
                {
                    let tmpObj = pData[i]
                    if(typeof pData[i] == 'function')
                    {
                        tmpObj = pData[i]()
                    }
                    if(Array.isArray(tmpObj))
                    {
                        tmpArr.push(...tmpObj)
                    }
                    else if(typeof tmpObj == 'object')
                    {
                        tmpArr.push(tmpObj)
                    }
                }
                
                for (let i = 0; i < tmpArr.length; i++) 
                {
                    if(typeof tmpArr[i].barcode != 'undefined')
                    {
                        printer.align(tmpArr[i].align).barcode(tmpArr[i].barcode,'CODE39',tmpArr[i].options);                    
                    }
                    else if(typeof tmpArr[i].logo != 'undefined')
                    {
                        let image = await imgLoad(tmpArr[i].logo);
                        printer.align(tmpArr[i].align)
                        .image(image, 's8')
                        .then(() => 
                        { 
                            //printer.cut().close(); 
                        });
                    }
                    else
                    {                   
                        printer.size(0,0);
                        printer.font(tmpArr[i].font);
                        printer.align(tmpArr[i].align);
    
                        if(typeof tmpArr[i].style != 'undefined')
                        {
                            printer.style(tmpArr[i].style);
                        }
                        else
                        {
                            printer.style("normal");
                        }
                        
                        if(typeof tmpArr[i].size != 'undefined')
                        {
                            printer.size(tmpArr[i].size[0],tmpArr[i].size[1]);
                        }
                        printer.text(tmpArr[i].data,'857');
                    }                
                }                      
                
                printer.cut().close(function()
                {
                    resolve();
                });
            });  
        });
    }
}