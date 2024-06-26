import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class companyCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            BRAND_NAME : '',
            ADRESS1 : '',
            ADRESS2 : '',
            ZIPCODE : '',
            COUNTRY : '',
            CIYT : '',
            TEL : '',
            MAIL : '',
            WEB : '',
            SIRET_ID : '',
            APE_CODE : '',
            TAX_OFFICE : '',
            TAX_NO : '',
            INT_VAT_NO : '',
            OFFICIAL_NAME : '',
            OFFICIAL_SURNAME : '',
            COMPANY_TYPE : '',
            SIREN_NO : '',
            RCS : '',
            CAPITAL : 0,
            COUNTRY_NAME : '',
            PRINT_DESCRIPTION : '',
            BANK_INFO : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('COMPANY');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM COMPANY WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_COMPANY_INSERT] " + 
                    "@GUID  = @PGUID," +
                    "@CUSER = @PCUSER, " +
                    "@NAME = @PNAME, " +
                    "@BRAND_NAME = @PBRAND_NAME, " +
                    "@ADDRESS1 = @PADDRESS1, " +
                    "@ADDRESS2 = @PADDRESS2, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@COUNTRY = @PCOUNTRY, " +
                    "@CITY = @PCITY, " +
                    "@TEL = @PTEL, " +
                    "@MAIL = @PMAIL, " +
                    "@WEB = @PWEB, " +
                    "@SIRET_ID = @PSIRET_ID, " +
                    "@APE_CODE = @PAPE_CODE, " +
                    "@TAX_OFFICE = @PTAX_OFFICE, " +
                    "@TAX_NO = @PTAX_NO, " +
                    "@INT_VAT_NO = @PINT_VAT_NO, " +
                    "@OFFICIAL_NAME = @POFFICIAL_NAME, " +
                    "@OFFICIAL_SURNAME = @POFFICIAL_SURNAME, " +
                    "@COMPANY_TYPE = @PCOMPANY_TYPE, " +
                    "@SIREN_NO = @PSIREN_NO, " +
                    "@RCS = @PRCS, " +
                    "@CAPITAL  = @PCAPITAL, " +
                    "@PRINT_DESCRIPTION  =@PPRINT_DESCRIPTION, " +
                    "@BANK_CODE  = @PBANK_CODE, " +
                    "@ACCOUNT_NO  = @PACCOUNT_NO, " +
                    "@BIC  = @PBIC, " +
                    "@IBAN  = @PIBAN " ,
            param : ['PGUID:string|50','PCUSER:string|50','PNAME:string|50','PBRAND_NAME:string|50','PADDRESS1:string|50','PADDRESS2:string|50','PZIPCODE:string|50','PCOUNTRY:string|50','PCITY:string|50',
                     'PTEL:string|50','PMAIL:string|50','PWEB:string|50','PSIRET_ID:string|50','PAPE_CODE:string|50','PTAX_OFFICE:string|50','PTAX_NO:string|50','PINT_VAT_NO:string|50','POFFICIAL_NAME:string|50',
                     'POFFICIAL_SURNAME:string|50','PCOMPANY_TYPE:string|50','PSIREN_NO:string|50','PRCS:string|50','PCAPITAL:float','PPRINT_DESCRIPTION:string|max','PBANK_CODE:string|50','PACCOUNT_NO:string|50','PBIC:string|50','PIBAN:string|max'],
            dataprm : ['GUID','CUSER','NAME','BRAND_NAME','ADDRESS1','ADDRESS2','ZIPCODE','COUNTRY','CITY','TEL','MAIL','WEB','SIRET_ID','APE_CODE','TAX_OFFICE','TAX_NO','INT_VAT_NO','OFFICIAL_NAME',
                       'OFFICIAL_SURNAME','COMPANY_TYPE','SIREN_NO','RCS','CAPITAL','PRINT_DESCRIPTION','BANK_CODE','ACCOUNT_NO','BIC','IBAN']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_COMPANY_UPDATE] " + 
                    "@GUID  = @PGUID," +
                    "@CUSER = @PCUSER, " +
                    "@NAME = @PNAME, " +
                    "@BRAND_NAME = @PBRAND_NAME, " +
                    "@ADDRESS1 = @PADDRESS1, " +
                    "@ADDRESS2 = @PADDRESS2, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@COUNTRY = @PCOUNTRY, " +
                    "@CITY = @PCITY, " +
                    "@TEL = @PTEL, " +
                    "@MAIL = @PMAIL, " +
                    "@WEB = @PWEB, " +
                    "@SIRET_ID = @PSIRET_ID, " +
                    "@APE_CODE = @PAPE_CODE, " +
                    "@TAX_OFFICE = @PTAX_OFFICE, " +
                    "@TAX_NO = @PTAX_NO, " +
                    "@INT_VAT_NO = @PINT_VAT_NO, " +
                    "@OFFICIAL_NAME = @POFFICIAL_NAME, " +
                    "@OFFICIAL_SURNAME = @POFFICIAL_SURNAME, " +
                    "@COMPANY_TYPE = @PCOMPANY_TYPE, " +
                    "@SIREN_NO = @PSIREN_NO, " +
                    "@RCS = @PRCS, " +
                    "@CAPITAL  =@PCAPITAL, " +
                    "@PRINT_DESCRIPTION  =@PPRINT_DESCRIPTION, " +
                    "@BANK_CODE  = @PBANK_CODE, " +
                    "@ACCOUNT_NO  = @PACCOUNT_NO, " +
                    "@BIC  = @PBIC, " +
                    "@IBAN  = @PIBAN " ,
            param : ['PGUID:string|50','PCUSER:string|50','PNAME:string|50','PBRAND_NAME:string|50','PADDRESS1:string|50','PADDRESS2:string|50','PZIPCODE:string|50','PCOUNTRY:string|50','PCITY:string|50',
                     'PTEL:string|50','PMAIL:string|50','PWEB:string|50','PSIRET_ID:string|50','PAPE_CODE:string|50','PTAX_OFFICE:string|50','PTAX_NO:string|50','PINT_VAT_NO:string|50','POFFICIAL_NAME:string|50',
                     'POFFICIAL_SURNAME:string|50','PCOMPANY_TYPE:string|50','PSIREN_NO:string|50','PRCS:string|50','PCAPITAL:float','PPRINT_DESCRIPTION:string|max','PBANK_CODE:string|50','PACCOUNT_NO:string|50','PBIC:string|50','PIBAN:string|max'],
            dataprm : ['GUID','CUSER','NAME','BRAND_NAME','ADDRESS1','ADDRESS2','ZIPCODE','COUNTRY','CITY','TEL','MAIL','WEB','SIRET_ID','APE_CODE','TAX_OFFICE','TAX_NO','INT_VAT_NO','OFFICIAL_NAME',
                       'OFFICIAL_SURNAME','COMPANY_TYPE','SIREN_NO','RCS','CAPITAL','PRINT_DESCRIPTION','BANK_CODE','ACCOUNT_NO','BIC','IBAN']
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
        if(typeof this.dt('COMPANY') == 'undefined')
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
        this.dt('COMPANY').push(tmp)
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
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            this.ds.get('COMPANY').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('COMPANY').refresh();
            resolve(this.ds.get('COMPANY'));    
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
export class supportCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = 
        {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            SUBJECT : '',
            HTML : '',
            PROCESS : '',
            PROCESS_USER : '',
            REPLY_MAIL : ''
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('SUPPORT_DETAIL');            
        tmpDt.selectCmd = 
        {
            query :"SELECT * FROM SUPPORT_DETAIL_VW_01 WHERE ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['GUID:string|50']
        } 
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_SUPPORT_DETAIL_INSERT] " + 
                    "@GUID  = @PGUID," +
                    "@CUSER = @PCUSER, " +
                    "@SUBJECT = @PSUBJECT, " +
                    "@HTML = @PHTML, " +
                    "@PROCESS = @PPROCESS, " +
                    "@PROCESS_USER = @PPROCESS_USER, " +
                    "@REPLY_MAIL = @PREPLY_MAIL " ,
            param : ['PGUID:string|50','PCUSER:string|50','PSUBJECT:string|100','PHTML:string|max','PPROCESS:string|max','PPROCESS_USER:string|50','PREPLY_MAIL:string|50'],
            dataprm : ['GUID','CUSER','SUBJECT','HTML','PROCESS','PROCESS_USER','REPLY_MAIL']
        } 
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_SUPPORT_DETAIL_UPDATE] " + 
                    "@GUID  = @PGUID," +
                    "@CUSER = @PCUSER, " +
                    "@SUBJECT = @PSUBJECT, " +
                    "@HTML = @PHTML, " +
                    "@PROCESS = @PPROCESS, " +
                    "@PROCESS_USER = @PPROCESS_USER, " +
                    "@REPLY_MAIL = @PREPLY_MAIL " ,
            param : ['PGUID:string|50','PCUSER:string|50','PSUBJECT:string|100','PHTML:string|max','PPROCESS:string|max','PPROCESS_USER:string|50','PREPLY_MAIL:string|50'],
            dataprm : ['GUID','CUSER','SUBJECT','HTML','PROCESS','PROCESS_USER','REPLY_MAIL']
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
        if(typeof this.dt('SUPPORT_DETAIL') == 'undefined')
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
        this.dt('SUPPORT_DETAIL').push(tmp)
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
            }          

            if(arguments.length > 0)
            {
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }
            this.ds.get('SUPPORT_DETAIL').selectCmd.value = Object.values(tmpPrm)

            await this.ds.get('SUPPORT_DETAIL').refresh();
            resolve(this.ds.get('SUPPORT_DETAIL'));    
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