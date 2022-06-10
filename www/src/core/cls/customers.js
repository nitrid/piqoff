import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class customersCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            TITLE : '',
            TYPE : 0,
            GENUS : 0,
            CUSTOMER_GRP : '',
            WEB : '',
            NOTE : '',
            SIRET_ID : '',
            APE_CODE : '',
            TAX_OFFICE : '',
            TAX_NO : '',
            INT_VAT_NO : '',
            TAX_TYPE : 0,
            REBATE : 0
        }

        this.customerOffical = new customerOfficalCls();
        this.customerAdress = new customerAdressCls();
        this.customerBank = new customerBankCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CUSTOMERS')
        tmpDt.selectCmd =
        {
            query : "SELECT * FROM CUSTOMER_VW_01 WHERE ((CODE = @CODE) OR (@CODE = ''))",
            param : ['CODE:string|25']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMERS_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@TITLE = @PTITLE, " +
                    "@CODE = @PCODE, " +
                    "@GENUS = @PGENUS, " +
                    "@CUSTOMER_GRP = @PCUSTOMER_GRP, " +
                    "@WEB = @PWEB, " +
                    "@NOTE = @PNOTE, " +
                    "@SIRET_ID = @PSIRET_ID, " +
                    "@APE_CODE = @PAPE_CODE, " +
                    "@TAX_OFFICE =@PTAX_OFFICE, " +
                    "@TAX_NO = @PTAX_NO, " +
                    "@INT_VAT_NO = @PINT_VAT_NO, " +
                    "@TAX_TYPE = @PTAX_TYPE, " +
                    "@REBATE = @PREBATE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PTITLE:string|50','PCODE:string|50','PGENUS:int','PCUSTOMER_GRP:string|25','PWEB:string|100','PNOTE:string|1500',
                        'PSIRET_ID:string|25','PAPE_CODE:string|50','PTAX_OFFICE:string|25','PTAX_NO:string|25','PINT_VAT_NO:string|50','PTAX_TYPE:int','PREBATE:bit'],
            dataprm : ['GUID','CUSER','TYPE','TITLE','CODE','GENUS','CUSTOMER_GRP','WEB','NOTE','SIRET_ID','APE_CODE','TAX_OFFICE','TAX_NO','INT_VAT_NO','TAX_TYPE','REBATE']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMERS_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " + 
                    "@TYPE = @PTYPE, " + 
                    "@TITLE = @PTITLE, " +
                    "@CODE = @PCODE, " +
                    "@GENUS = @PGENUS, " +
                    "@CUSTOMER_GRP = @PCUSTOMER_GRP, " +
                    "@WEB = @PWEB, " +
                    "@NOTE = @PNOTE, " +
                    "@SIRET_ID = @PSIRET_ID, " +
                    "@APE_CODE = @PAPE_CODE, " +
                    "@TAX_OFFICE =@PTAX_OFFICE, " +
                    "@TAX_NO = @PTAX_NO, " +
                    "@INT_VAT_NO = @PINT_VAT_NO, " +
                    "@TAX_TYPE = @PTAX_TYPE, " +
                    "@REBATE = @PREBATE " ,
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PTITLE:string|50','PCODE:string|50','PGENUS:int','PCUSTOMER_GRP:string|25','PWEB:string|100','PNOTE:string|1500',
                    'PSIRET_ID:string|25','PAPE_CODE:string|50','PTAX_OFFICE:string|25','PTAX_NO:string|25','PINT_VAT_NO:string|50','PTAX_TYPE:int','PREBATE:bit'],
            dataprm : ['GUID','CUSER','TYPE','TITLE','CODE','GENUS','CUSTOMER_GRP','WEB','NOTE','SIRET_ID','APE_CODE','TAX_OFFICE','TAX_NO','INT_VAT_NO','TAX_TYPE','REBATE']
        }
        tmpDt.deleteCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMERS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.customerOffical.dt('CUSTOMER_OFFICAL'))
        this.ds.add(this.customerAdress.dt('CUSTOMER_ADRESS'))
        this.ds.add(this.customerBank.dt('CUSTOMER_BANK'))
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
        if(typeof this.dt('CUSTOMERS') == 'undefined')
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
        this.dt('CUSTOMERS').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR ÖRN: {CODE:''}
        return new Promise(async resolve =>
        {
            let tmpPrm = {CODE:''}
            if(arguments.length > 0)
            {
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
            }

            this.ds.get('CUSTOMERS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('CUSTOMERS').refresh()

            if(this.ds.get('CUSTOMERS').length > 0)
            {  
                await this.customerAdress.load({CUSTOMER:this.ds.get('CUSTOMERS')[0].GUID})
                await this.customerOffical.load({CUSTOMER:this.ds.get('CUSTOMERS')[0].GUID})
                await this.customerBank.load({CUSTOMER:this.ds.get('CUSTOMERS')[0].GUID})
            }
            resolve(this.ds.get('CUSTOMERS'))
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
export class customerOfficalCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds =  new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            TYPE : 0,
            CUSTOMER :  '00000000-0000-0000-0000-000000000000',
            NAME : '',
            LAST_NAME : '',
            PHONE1 : '',
            PHONE2 : '',
            GSM_PHONE : '',
            OTHER_PHONE : '',
            EMAIL : '',
        }

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CUSTOMER_OFFICAL');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[CUSTOMER_OFFICAL_VW_01] WHERE ((CUSTOMER = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) ",
            param : ['CUSTOMER:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_OFFICAL_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@NAME = @PNAME, " +
                    "@LAST_NAME = @PLAST_NAME, " +
                    "@PHONE1 = @PPHONE1, " +
                    "@PHONE2 = @PPHONE2, " +
                    "@GSM_PHONE = @PGSM_PHONE, " +
                    "@OTHER_PHONE = @POTHER_PHONE, " +
                    "@EMAIL = @PEMAIL ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PNAME:string|50','PLAST_NAME:string|50',
                    'PPHONE1:string|50','PPHONE2:string|50','PGSM_PHONE:string|50','POTHER_PHONE:string|50','PEMAIL:string|50'],
            dataprm : ['GUID','CUSER','TYPE','CUSTOMER','NAME','LAST_NAME','PHONE1','PHONE2','GSM_PHONE','OTHER_PHONE','EMAIL']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_OFFICAL_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@CUSTOMER = @PCUSTOMER, " + 
                    "@NAME = @PNAME, " +
                    "@LAST_NAME = @PLAST_NAME, " +
                    "@PHONE1 = @PPHONE1, " +
                    "@PHONE2 = @PPHONE2, " +
                    "@GSM_PHONE = @PGSM_PHONE, " +
                    "@OTHER_PHONE = @POTHER_PHONE, " +
                    "@EMAIL = @PEMAIL ",
            param : ['PGUID:string|50','PCUSER:string|25','PTYPE:int','PCUSTOMER:string|50','PNAME:string|50','PLAST_NAME:string|50',
                    'PPHONE1:string|50','PPHONE2:string|50','PGSM_PHONE:string|50','POTHER_PHONE:string|50','PEMAIL:string|50'],
            dataprm : ['GUID','CUSER','TYPE','CUSTOMER','NAME','LAST_NAME','PHONE1','PHONE2','GSM_PHONE','OTHER_PHONE','EMAIL']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_CUSTOMER_OFFICAL_DELETE] " + 
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
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('CUSTOMER_OFFICAL') == 'undefined')
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
        tmp.GUID = datatable.uuidv4()
        this.dt('CUSTOMER_OFFICAL').push(tmp)
    }
    clearAll()
    {
        for(let i = 0; i < this.ds.length; i++)
        {
            this.dt(i).clear()
        }
    }
    load()
    {
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = 
            {
                CUSTOMER : '00000000-0000-0000-0000-000000000000',
                TYPE : 0
            }

            if(arguments.length > 0)
            {
                tmpPrm.CUSTOMER = typeof arguments[0].CUSTOMER == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? 0 : arguments[0].TYPE
            }

            this.ds.get('CUSTOMER_OFFICAL').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('CUSTOMER_OFFICAL').refresh();

            resolve(this.ds.get('CUSTOMER_OFFICAL'));
            
        });
    }
    save()
    {
        return new Promise(async resolve =>
        {
            this.ds.delete()
            resolve(await this.ds.update())
        });
    }
}
export class customerAdressCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            TYPE : 0,
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            ADRESS : '',
            ZIPCODE : '',
            CIYT : '',
            COUNTRY : ''
        }

        this._initDs()
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CUSTOMER_ADRESS')
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[CUSTOMER_ADRESS_VW_01] WHERE ((CUSTOMER = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) ",
            param : ['CUSTOMER:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_ADRESS_INSERT] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@ADRESS = @PADRESS, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@CITY = @PCITY, " +
                    "@COUNTRY = @PCOUNTRY ",
            param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PCUSTOMER:string|50','PADRESS:string|500','PZIPCODE:string|10','PCITY:string|25','PCOUNTRY:string|5'],
            dataprm : ['GUID','CUSER','TYPE','CUSTOMER','ADRESS','ZIPCODE','CITY','COUNTRY']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_ADRESS_UPDATE] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@ADRESS = @PADRESS, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@CITY = @PCITY, " +
                    "@COUNTRY = @PCOUNTRY ",
            param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PCUSTOMER:string|50','PADRESS:string|500','PZIPCODE:string|10','PCITY:string|25','PCOUNTRY:string|5'],
            dataprm : ['GUID','CUSER','TYPE','CUSTOMER','ADRESS','ZIPCODE','CITY','COUNTRY']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_CUSTOMER_ADRESS_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
    }
    //#regionend
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('CUSTOMER_ADRESS') == 'undefined')
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
        tmp.GUID = datatable.uuidv4()
        this.dt('CUSTOMER_ADRESS').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = 
            {
                CUSTOMER : '00000000-0000-0000-0000-000000000000',
                TYPE : 0
            }

            if(arguments.length > 0)
            {
                tmpPrm.CUSTOMER = typeof arguments[0].CUSTOMER == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? 0 : arguments[0].TYPE
            }

            this.ds.get('CUSTOMER_ADRESS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('CUSTOMER_ADRESS').refresh();
            
            resolve(this.ds.get('CUSTOMER_ADRESS'));
            
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
export class customerBankCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset()
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CUSER : this.core.auth.data.CODE,
            CUSER_NAME : this.core.auth.data.NAME,
            CUSTOMER : '00000000-0000-0000-0000-000000000000',
            NAME : '',
            IBAN : '',
            OFFICE : '',
            SWIFT : ''
        }

        this._initDs()
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('CUSTOMER_BANK')
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[CUSTOMER_BANK_VW_01] WHERE ((CUSTOMER = @CUSTOMER) OR (@CUSTOMER = '00000000-0000-0000-0000-000000000000')) ",
            param : ['CUSTOMER:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_BANK_INSERT] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@NAME = @PNAME, " +
                    "@IBAN = @PIBAN, " +
                    "@OFFICE = @POFFICE, " +
                    "@SWIFT = @PSWIFT ",
            param : ['PGUID:string|50','PCUSER:string|50','PCUSTOMER:string|50','PNAME:string|50','PIBAN:string|50','POFFICE:string|50','PSWIFT:string|25'],
            dataprm : ['GUID','CUSER','CUSTOMER','NAME','IBAN','OFFICE','SWIFT']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_CUSTOMER_BANK_UPDATE] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@CUSTOMER = @PCUSTOMER, " +
                    "@NAME = @PNAME, " +
                    "@IBAN = @PIBAN, " +
                    "@OFFICE = @POFFICE, " +
                    "@SWIFT = @PSWIFT ",
            param : ['PGUID:string|50','PCUSER:string|50','PCUSTOMER:string|50','PNAME:string|50','PIBAN:string|50','POFFICE:string|50','PSWIFT:string|25'],
            dataprm : ['GUID','CUSER','CUSTOMER','NAME','IBAN','OFFICE','SWIFT']
        }
        tmpDt.deleteCmd = 
        {
            query : " [dbo].[PRD_CUSTOMER_BANK_DELETE] " + 
                    " @CUSER = @PCUSER, " + 
                    " @UPDATE = 1, " + 
                    " @GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
    }
    //#regionend
    dt()
    {
        if(arguments.length > 0)
        {
            return this.ds.get(arguments[0])
        }

        return this.ds.get(0)
    }
    addEmpty()
    {
        if(typeof this.dt('CUSTOMER_BANK') == 'undefined')
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
        tmp.GUID = datatable.uuidv4()
        this.dt('CUSTOMER_BANK').push(tmp)
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
        //PARAMETRE OLARAK OBJE GÖNDERİLİR YADA PARAMETRE BOŞ İSE TÜMÜ GETİRİLİR.
        return new Promise(async resolve =>
        {
            let tmpPrm = 
            {
                CUSTOMER : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.CUSTOMER = typeof arguments[0].CUSTOMER == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].CUSTOMER;
            }

            this.ds.get('CUSTOMER_BANK').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('CUSTOMER_BANK').refresh();
            
            resolve(this.ds.get('CUSTOMER_BANK'));
            
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