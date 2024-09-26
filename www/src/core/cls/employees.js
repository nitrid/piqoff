import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class employeesCls
{
    constructor()
    {
        this.core = core.instance;
        this.ds = new dataset();
        this.empty = {
            GUID : '00000000-0000-0000-0000-000000000000',
            CODE : '',
            CUSER : this.core.auth.data.CODE,
            TITLE : '',
            TYPE : 0,
            NAME : '',
            LAST_NAME : '',
            PHONE1 : '',
            PHONE2 : '',
            GSM_PHONE : '',
            OTHER_PHONE : '',
            EMAIL : '',
            AGE : '',
            INSURANCE_NO : '',
            GENDER : '',
            MARIAL_STATUS : '',
            WAGE : '',
        }

       
        this.employeeAdress = new employeeAdressCls();
        this.employeeAttendance = new employeeAttendanceCls();

        this._initDs();
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('EMPLOYEE');
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[EMPLOYEE_VW_01] WHERE ((CODE = @CODE) OR (@CODE = '')) AND ((GUID = @GUID) OR (@GUID = '00000000-0000-0000-0000-000000000000'))",
            param : ['CODE:string|50','GUID:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_INSERT] " +
                    "@GUID = @PGUID, " +
                    "@CODE = @PCODE, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +                   
                    "@NAME = @PNAME, " +
                    "@LAST_NAME = @PLAST_NAME, " +
                    "@PHONE1 = @PPHONE1, " +
                    "@PHONE2 = @PPHONE2, " +
                    "@GSM_PHONE = @PGSM_PHONE, " +
                    "@OTHER_PHONE = @POTHER_PHONE, " +
                    "@EMAIL = @PEMAIL, " +
                    "@AGE = @PAGE, " +
                    "@INSURANCE_NO = @PINSURANCE_NO, " +
                    "@GENDER = @PGENDER, " +
                    "@MARIAL_STATUS = @PMARIAL_STATUS,  " +
                    "@WAGE = @PWAGE " ,
                    
            param : ['PGUID:string|50','PCODE:string|25','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLAST_NAME:string|50',
                    'PPHONE1:string|50','PPHONE2:string|50','PGSM_PHONE:string|50','POTHER_PHONE:string|50','PEMAIL:string|100'
                    ,'PAGE:string|10','PINSURANCE_NO:string|100','PGENDER:string|10','PMARIAL_STATUS:string|10','PWAGE:string|10'],
            dataprm : ['GUID','CODE','CUSER','TYPE','NAME','LAST_NAME','PHONE1','PHONE2','GSM_PHONE','OTHER_PHONE','EMAIL','AGE','INSURANCE_NO','GENDER','MARIAL_STATUS','WAGE']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_UPDATE] " +
                    "@GUID = @PGUID, " +
                    "@CODE = @PCODE, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +                   
                    "@NAME = @PNAME, " +
                    "@LAST_NAME = @PLAST_NAME, " +
                    "@PHONE1 = @PPHONE1, " +
                    "@PHONE2 = @PPHONE2, " +
                    "@GSM_PHONE = @PGSM_PHONE, " +
                    "@OTHER_PHONE = @POTHER_PHONE, " +
                    "@EMAIL = @PEMAIL, " +
                    "@AGE = @PAGE, " +
                    "@INSURANCE_NO = @PINSURANCE_NO, " +
                    "@GENDER = @PGENDER, " +
                    "@MARIAL_STATUS = @PMARIAL_STATUS,  " +
                    "@WAGE = @PWAGE " ,
                    
                    
            param : ['PGUID:string|50','PCODE:string|50','PCUSER:string|25','PTYPE:int','PNAME:string|50','PLAST_NAME:string|50',
                    'PPHONE1:string|50','PPHONE2:string|50','PGSM_PHONE:string|50','POTHER_PHONE:string|50','PEMAIL:string|100'
                    ,'PAGE:string|10','PINSURANCE_NO:string|50','PGENDER:string|10','PMARIAL_STATUS:string|10','PWAGE:string|10'],
            dataprm : ['GUID','CODE','CUSER','TYPE','NAME','LAST_NAME','PHONE1','PHONE2','GSM_PHONE','OTHER_PHONE','EMAIL','AGE','INSURANCE_NO','GENDER','MARIAL_STATUS','WAGE']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_EMPLOYEE_DELETE] " + 
                    "@CUSER = @PCUSER, " + 
                    "@UPDATE = 1, " + 
                    "@GUID = @PGUID ", 
            param : ['PCUSER:string|25','PGUID:string|50'],
            dataprm : ['CUSER','GUID']
        }

        this.ds.add(tmpDt);
        this.ds.add(this.employeeAdress.dt('EMPLOYEE_ADRESS'))
        this.ds.add(this.employeeAttendance.dt('EMPLOYEE_ATTENDANCE'))

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
        if(typeof this.dt('EMPLOYEE') == 'undefined')
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
        this.dt('EMPLOYEE').push(tmp)
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
            let tmpPrm = {CODE:'',GUID:'00000000-0000-0000-0000-000000000000'}
            if(arguments.length > 0)
            {
                tmpPrm.CODE = typeof arguments[0].CODE == 'undefined' ? '' : arguments[0].CODE;
                tmpPrm.GUID = typeof arguments[0].GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].GUID;
            }

            this.ds.get('EMPLOYEE').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('EMPLOYEE').refresh()

            if(this.ds.get('EMPLOYEE').length > 0)
            {  
                await this.employeeAdress.load({EMPLOYEE:this.ds.get('EMPLOYEE')[0].GUID})
                await this.employeeAttendance.load({EMPLOYEE_GUID:this.ds.get('EMPLOYEE')[0].GUID})
            }
            resolve(this.ds.get('EMPLOYEE'))
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
export class employeeAdressCls
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
            EMPLOYEE : '00000000-0000-0000-0000-000000000000',
            ADRESS : '',
            ZIPCODE : '',
            CITY : '',
            COUNTRY : '',
            ADRESS_NO : 0
        }

        this._initDs()
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('EMPLOYEE_ADRESS')
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[EMPLOYEE_ADRESS_VW_01] WHERE ((EMPLOYEE = @EMPLOYEE) OR (@EMPLOYEE = '00000000-0000-0000-0000-000000000000')) ",
            param : ['EMPLOYEE:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_ADRESS_INSERT] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@EMPLOYEE = @PEMPLOYEE, " +
                    "@ADRESS = @PADRESS, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@CITY = @PCITY, " +
                    "@COUNTRY = @PCOUNTRY, " +
                    "@ADRESS_NO = @PADRESS_NO ",
            param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PEMPLOYEE:string|50','PADRESS:string|500','PZIPCODE:string|25','PCITY:string|100','PCOUNTRY:string|5','PADRESS_NO:int'],
            dataprm : ['GUID','CUSER','TYPE','EMPLOYEE','ADRESS','ZIPCODE','CITY','COUNTRY','ADRESS_NO']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_ADRESS_UPDATE] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@EMPLOYEE = @PEMPLOYEE, " +
                    "@ADRESS = @PADRESS, " +
                    "@ZIPCODE = @PZIPCODE, " +
                    "@CITY = @PCITY, " +
                    "@COUNTRY = @PCOUNTRY, " +
                    "@ADRESS_NO = @PADRESS_NO ",
            param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PEMPLOYEE:string|50','PADRESS:string|500','PZIPCODE:string|25','PCITY:string|100','PCOUNTRY:string|5','PADRESS_NO:int'],
            dataprm : ['GUID','CUSER','TYPE','EMPLOYEE','ADRESS','ZIPCODE','CITY','COUNTRY','ADRESS_NO']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_EMPLOYEE_ADRESS_DELETE] " + 
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
         if(typeof this.dt('EMPLOYEE_ADRESS') == 'undefined')
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
         this.dt('EMPLOYEE_ADRESS').push(tmp)
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
                EMPLOYEE : '00000000-0000-0000-0000-000000000000',
                TYPE : 0
            }

            if(arguments.length > 0)
            {
                tmpPrm.EMPLOYEE = typeof arguments[0].EMPLOYEE == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].EMPLOYEE;
                tmpPrm.TYPE = typeof arguments[0].TYPE == 'undefined' ? 0 : arguments[0].TYPE
            }

            this.ds.get('EMPLOYEE_ADRESS').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('EMPLOYEE_ADRESS').refresh();
            
            resolve(this.ds.get('EMPLOYEE_ADRESS'));
            
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
export class employeeAttendanceCls
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
            EMPLOYEE_GUID : '00000000-0000-0000-0000-000000000000',
            ATTENDANCE_DATE :  moment(new Date(0)).format("YYYY-MM-DD"),
            CHECK_IN_TIME :  moment(new Date(0)).format("YYYY-MM-DD"),
            CHECK_OUT_TIME :  moment(new Date(0)).format("YYYY-MM-DD"),
            IS_ABSENT : 0 ,
            ABSENCE_REASON : ''
        }

        this._initDs()
    }
    //#region Private
    _initDs()
    {
        let tmpDt = new datatable('EMPLOYEE_ATTENDANCE')
        tmpDt.selectCmd = 
        {
            query : "SELECT * FROM [dbo].[EMPLOYEE_ATTENDANCE_VW_01] WHERE ((EMPLOYEE_GUID = @EMPLOYEE_GUID) OR (@EMPLOYEE_GUID = '00000000-0000-0000-0000-000000000000')) ",
            param : ['EMPLOYEE_GUID:string|50']
        }
        tmpDt.insertCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_ATTENDANCE_INSERT] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@EMPLOYEE_GUID = @PEMPLOYEE_GUID, " +
                    "@ATTENDANCE_DATE = @PATTENDANCE_DATE, " +
                    "@CHECK_IN_TIME = @PCHECK_IN_TIME, " +
                    "@CHECK_OUT_TIME = @PCHECK_OUT_TIME, " +
                    "@IS_ABSENT = @PIS_ABSENT, " +
                    "@ABSENCE_REASON = @PABSENCE_REASON ",
            param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PEMPLOYEE_GUID:string|50','PATTENDANCE_DATE:date','PCHECK_IN_TIME:datetime','PCHECK_OUT_TIME:datetime','PIS_ABSENT:int','PABSENCE_REASON:string|25'],
            dataprm : ['GUID','CUSER','TYPE','EMPLOYEE_GUID','ATTENDANCE_DATE','CHECK_IN_TIME','CHECK_OUT_TIME','IS_ABSENT','ABSENCE_REASON']
        }
        tmpDt.updateCmd = 
        {
            query : "EXEC [dbo].[PRD_EMPLOYEE_ATTENDANCE_UPDATE] " +
                    "@GUID =@PGUID, " +
                    "@CUSER = @PCUSER, " +
                    "@TYPE = @PTYPE, " +
                    "@EMPLOYEE_GUID = @PEMPLOYEE_GUID, " +
                    "@ATTENDANCE_DATE = @PATTENDANCE_DATE, " +
                    "@CHECK_IN_TIME = @PCHECK_IN_TIME, " +
                    "@CHECK_OUT_TIME = @PCHECK_OUT_TIME, " +
                    "@IS_ABSENT = @PIS_ABSENT, " +
                    "@ABSENCE_REASON = @PABSENCE_REASON ",
                    param : ['PGUID:string|50','PCUSER:string|50','PTYPE:int','PEMPLOYEE_GUID:string|50','PATTENDANCE_DATE:date','PCHECK_IN_TIME:datetime','PCHECK_OUT_TIME:datetime','PIS_ABSENT:int','PABSENCE_REASON:string|25'],
                    dataprm : ['GUID','CUSER','TYPE','EMPLOYEE_GUID','ATTENDANCE_DATE','CHECK_IN_TIME','CHECK_OUT_TIME','IS_ABSENT','ABSENCE_REASON']
        }
        tmpDt.deleteCmd = 
        {
            query : "[dbo].[PRD_EMPLOYEE_ATTENDANCE_DELETE] " + 
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
         if(typeof this.dt('EMPLOYEE_ATTENDANCE') == 'undefined')
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
         this.dt('EMPLOYEE_ATTENDANCE').push(tmp)
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
                EMPLOYEE_GUID : '00000000-0000-0000-0000-000000000000',
            }

            if(arguments.length > 0)
            {
                tmpPrm.EMPLOYEE_GUID = typeof arguments[0].EMPLOYEE_GUID == 'undefined' ? '00000000-0000-0000-0000-000000000000' : arguments[0].EMPLOYEE_GUID;
            }

            this.ds.get('EMPLOYEE_ATTENDANCE').selectCmd.value = Object.values(tmpPrm);

            await this.ds.get('EMPLOYEE_ATTENDANCE').refresh();
            
            resolve(this.ds.get('EMPLOYEE_ATTENDANCE'));
            
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
