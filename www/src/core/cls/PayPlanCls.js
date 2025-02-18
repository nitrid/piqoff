import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class payPlanCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CDATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSER : this.core.auth.data.CODE,
            LDATE : moment(new Date()).format("YYYY-MM-DD"),
            LUSER : this.core.auth.data.CODE,
            DOC_GUID : '00000000-0000-0000-0000-000000000000',
            DOC_DATE : moment(new Date()).format("YYYY-MM-DD"),
            CUSTOMER_GUID : '00000000-0000-0000-0000-000000000000',
            REF : '',
            REF_NO : 0,
            FAC_GUID : '00000000-0000-0000-0000-000000000000',
            INSTALLMENT_NO : 0,
            INSTALLMENT_DATE : moment(new Date()).format("YYYY-MM-DD"),
            AMOUNT : 0,
            TOTAL : 0,
            STATUS : 0,
            DELETED : 0
        }   

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('DOC_INSTALLMENT');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM DOC_INSTALLMENT_VW_01 WHERE FAC_GUID = @FAC_GUID",
            param : ['FAC_GUID:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " +
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@CUSTOMER_GUID = @PCUSTOMER_GUID, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@INSTALLMENT_NO = @PINSTALLMENT_NO, " +
                    "@INSTALLMENT_DATE = @PINSTALLMENT_DATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@STATUS = @PSTATUS, " +
                    "@DELETED = @PDELETED ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PDOC_DATE:date','PCUSTOMER_GUID:string|50','PREF:string|50','PREF_NO:int','PFAC_GUID:string|50','PINSTALLMENT_NO:int','PINSTALLMENT_DATE:date','PAMOUNT:float','PTOTAL:float','PSTATUS:int','PDELETED:int'],
            dataprm : ['GUID','CUSER','DOC_GUID','DOC_DATE','CUSTOMER_GUID','REF','REF_NO','FAC_GUID','INSTALLMENT_NO','INSTALLMENT_DATE','AMOUNT','TOTAL','STATUS','DELETED']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@DOC_GUID = @PDOC_GUID, " +    
                    "@DOC_DATE = @PDOC_DATE, " +
                    "@CUSTOMER_GUID = @PCUSTOMER_GUID, " +
                    "@REF = @PREF, " +
                    "@REF_NO = @PREF_NO, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@INSTALLMENT_NO = @PINSTALLMENT_NO, " +
                    "@INSTALLMENT_DATE = @PINSTALLMENT_DATE, " +
                    "@AMOUNT = @PAMOUNT, " +
                    "@TOTAL = @PTOTAL, " +
                    "@STATUS = @PSTATUS, " +
                    "@DELETED = @PDELETED ",
            param : ['PGUID:string|50','PCUSER:string|25','PDOC_GUID:string|50','PDOC_DATE:date','PCUSTOMER_GUID:string|50','PREF:string|50','PREF_NO:int','PFAC_GUID:string|50','PINSTALLMENT_NO:int','PINSTALLMENT_DATE:date','PAMOUNT:float','PTOTAL:float','PSTATUS:int','PDELETED:int'],
            dataprm : ['GUID','CUSER','DOC_GUID','DOC_DATE','CUSTOMER_GUID','REF','REF_NO','FAC_GUID','INSTALLMENT_NO','INSTALLMENT_DATE','AMOUNT','TOTAL','STATUS','DELETED']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_DOC_INSTALLMENT_DELETE] " +
                    "@CUSER = @PCUSER, " +
                    "@FAC_GUID = @PFAC_GUID, " +
                    "@UPDATE = 1 " ,
            param : ['PCUSER:string|25','PFAC_GUID:string|50'],
            dataprm : ['CUSER','FAC_GUID']
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

        return this.ds.get(0);
    }
    addEmpty()
    {
        if(typeof this.dt('DOC_INSTALLMENT') == 'undefined')
        {
            return;
        }
        let tmp = {};
        if(arguments.length > 0)
        {
            tmp = {...arguments[0]}
        }
        else        
        {
            tmp = {...this.empty}
        }
        tmp.GUID = datatable.uuidv4();
        this.dt('DOC_INSTALLMENT').push(tmp);
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear();
        }
    }
    load()
    {
        return new Promise(async resolve => 
        {
            let tmpPrm = {FAC_GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.FAC_GUID = typeof arguments[0].FAC_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].FAC_GUID;
            }
            this.ds.get('DOC_INSTALLMENT').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('DOC_INSTALLMENT').refresh();
            resolve(this.ds.get('DOC_INSTALLMENT'));
        });
    }   
    save()
    {
        return new Promise(async resolve => 
        {
            this.ds.delete();
            resolve(await this.ds.update());
        });
    }
}