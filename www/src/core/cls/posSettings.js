import { core,dataset,datatable } from "../core.js";
import moment from 'moment';

export class deviceCls
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
            param : ['GUID:string|50','CODE:string|25']
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
}