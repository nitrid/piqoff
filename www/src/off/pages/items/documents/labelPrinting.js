import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class labelPrinting extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.lblObj = new labelCls();
        this.mainLblObj = new labelMainCls()
        this.pageCount = 0;
        this.tabIndex = props.data.tabkey

        this._cellRoleRender = this._cellRoleRender.bind(this)

        this.frmOutwas = undefined;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()

        this.lblObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.lblObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.lblObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnPrint.setState({disabled:false});          
        })
        this.lblObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        let tmpLbl = {...this.lblObj.empty}
        tmpLbl.REF = this.user.NAME
        this.mainLblObj.addEmpty(tmpLbl);
        
        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.dtSelectChange.value =  moment(new Date()).format("YYYY-MM-DD HH:mm"),
        this.dtSelectPriceChange.value =  moment(new Date()).format("YYYY-MM-DD HH:mm"),
        this.txtRef.readOnly = true
        this.calculateCount()
        
        await this.grdLabelQueue.dataRefresh({source:this.lblObj.dt('LABEL_QUEUE')});

        this.txtRef.props.onChange()
    }
    async getDoc(pGuid)
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()

        App.instance.setState({isExecute:true})
        await this.lblObj.load({GUID:pGuid});
        this.mainLblObj.load({GUID:pGuid});
        App.instance.setState({isExecute:false})

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    async getDocs(pType)
    {
        let tmpQuery = 
        {
            query : "SELECT GUID,CASE STATUS WHEN 1 THEN 'OK' WHEN 0 THEN 'X' END AS STATUS,REF,REF_NO,CONVERT(NVARCHAR,CDATE,104) AS DOC_DATE_CONVERT,ISNULL((SELECT COUNT(CODE) FROM ITEM_LABEL_QUEUE_VW_01 WHERE ITEM_LABEL_QUEUE_VW_01.GUID = LABEL_QUEUE.GUID),0) AS COUNT FROM LABEL_QUEUE WHERE STATUS IN("+pType+") AND REF <> 'SPECIAL' " 
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        await this.pg_Docs.setData(tmpRows)
     
        this.pg_Docs.show()
        this.pg_Docs.onClick = (data) =>
        {
            console.log(data)
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID)
            }
        }
    }
    async getDocsCombine(pType)
    {
        let tmpQuery = 
        {
            query : "SELECT GUID,CASE STATUS WHEN 1 THEN 'OK' WHEN 0 THEN 'X' END AS STATUS,REF,REF_NO,CONVERT(NVARCHAR,CDATE,104) AS DOC_DATE_CONVERT,ISNULL((SELECT COUNT(CODE) FROM ITEM_LABEL_QUEUE_VW_01 WHERE ITEM_LABEL_QUEUE_VW_01.GUID = LABEL_QUEUE.GUID),0) AS COUNT FROM LABEL_QUEUE WHERE STATUS IN("+pType+") AND REF <> 'SPECIAL' " 
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }

        await this.pg_DocsCombine.setData(tmpRows)   

        this.pg_DocsCombine.show()
        this.pg_DocsCombine.onClick = async (data)  =>
        {
            if(data.length > 0)
            {
                for (let i = 0; i < data.length; i++) 
                {
                    let lblCombineObj = new labelCls();
                    await lblCombineObj.load({GUID:data[i].GUID});
                    let updateQuery = 
                    {
                        query:  "UPDATE LABEL_QUEUE SET STATUS = 1 WHERE GUID = @GUID",
                        param:  ['GUID:string|50'],
                        value:  [data[i].GUID]
                    }
                    await this.core.sql.execute(updateQuery) 
                    for (let i = 0; i < lblCombineObj.dt().length; i++) 
                    {
                        let tmpDocItems = {...this.lblObj.empty}
                        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                        tmpDocItems.LINE_NO = this.lblObj.dt().length
                        this.lblObj.addEmpty(tmpDocItems)
                        await this.addItem(lblCombineObj.dt()[i],this.lblObj.dt().length - 1)
                    }
                }
            }
        }
    }
    async AddWizardItems()
    {
        if(this.chkLastChange.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE (SELECT TOP 1 LDATE FROM LABEL_QUEUE ORDER BY LDATE DESC) < (SELECT TOP 1 LDATE FROM ITEM_PRICE WHERE TYPE = 0  AND ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC) OR  (SELECT TOP 1 LDATE FROM LABEL_QUEUE ORDER BY LDATE DESC) < ITEMS_VW_01.LDATE AND STATUS = 1) AS TMP   " ,
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkSelectChange.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE @DATE < (SELECT TOP 1 LDATE FROM ITEM_PRICE WHERE TYPE = 0  AND ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC) OR @DATE < ITEMS_VW_01.LDATE AND STATUS = 1) AS TMP ", 
                param : ['DATE:datetime'],
                value : [this.dtSelectChange.value]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()      
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkSelectPriceChange.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID),'') AS CUSTOMER_NAME, " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_SYMBOL, " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE @DATE < (SELECT TOP 1 LDATE FROM ITEM_PRICE WHERE TYPE = 0  AND ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC) AND STATUS = 1) AS TMP ", 
                param : ['DATE:datetime'],
                value : [this.dtSelectPriceChange.value]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            console.log(tmpData)
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkGroup.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE, " +
                "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_SYMBOL " +
                "FROM ITEMS_VW_01  " +
                "WHERE  MAIN_GRP = @GROUP AND STATUS = 1) AS TMP ", 
                param : ['GROUP:string|25'],
                value : [this.cmbGroup.value]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide() 
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkCustomer.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE  ISNULL((SELECT TOP 1 [CODE] FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID AND CUSTOMER = @CUSTOMER),'') <> '' AND STATUS = 1) AS TMP ", 
                param : ['CUSTOMER:string|50'],
                value : [this.cmbCustomer.value]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkPromotionItems.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT *,  " +
                "CASE WHEN UNDER_UNIT_VALUE =0    " +
                "THEN 0   " +
                "ELSE   " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) END AS UNDER_UNIT_PRICE FROM   " +
                "(SELECT   " +
                "COND_ITEM_GUID AS GUID,  " +
                "CDATE AS CDATE,  " +
                "COND_ITEM_CODE AS CODE,  " +
                "COND_ITEM_NAME AS NAME,  " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = [PROMO_COND_APP_VW_01].COND_ITEM_GUID ORDER BY CDATE DESC),'') AS BARCODE,  " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = [PROMO_COND_APP_VW_01].COND_ITEM_GUID ORDER BY LDATE DESC),COND_ITEM_CODE) AS MULTICODE,    " +
                "ISNULL((SELECT MAIN_GRP FROM ITEMS_VW_01 WHERE ITEMS_VW_01.GUID =  [PROMO_COND_APP_VW_01].COND_ITEM_GUID), '' ) AS ITEM_GRP,  " +
                "ISNULL((SELECT MAIN_GRP_NAME FROM ITEMS_VW_01 WHERE ITEMS_VW_01.GUID =  [PROMO_COND_APP_VW_01].COND_ITEM_GUID), '' ) AS ITEM_GRP_NAME,  " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = (SELECT ORGINS FROM ITEMS_VW_01 WHERE ITEMS_VW_01.GUID =  [PROMO_COND_APP_VW_01].COND_ITEM_GUID)),'') AS ORGINS,  " +
                "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = [PROMO_COND_APP_VW_01].COND_ITEM_GUID),'') AS UNDER_UNIT_SYMBOL, " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = [PROMO_COND_APP_VW_01].COND_ITEM_GUID),0) AS UNDER_UNIT_VALUE,  " +
                "CASE APP_TYPE WHEN 5 THEN APP_AMOUNT WHEN 0 THEN ROUND((SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) - (SELECT [dbo].[FN_PRICE](COND_ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ((APP_AMOUNT / 100)),2) END AS PRICE " +
                "FROM [dbo].[PROMO_COND_APP_VW_01]  WHERE COND_TYPE = 0 AND APP_TYPE IN(0,5) AND START_DATE >= @FIRST_DATE AND FINISH_DATE <= @LAST_DATE) AS TMP",
                param : ['FIRST_DATE:date','LAST_DATE:date'],
                value : [this.dtDate.startDate,this.dtDate.endDate]
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()  
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }   
                await dialog(tmpConfObj);
            }
        }
        else if(this.chkAllItems.value == true)
        {
            let tmpQuery = 
            {
                query :"SELECT  *, " + 
                "CASE WHEN UNDER_UNIT_VALUE =0  " +
                "THEN 0 " +
                "ELSE " +
                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  WHERE STATUS = 1" +
                " ) AS TMP ", 
            }
            App.instance.setState({isExecute:true})
            let tmpData = await this.core.sql.execute(tmpQuery) 
            App.instance.setState({isExecute:false})
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                this.popWizard.hide()   
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
        }
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == "CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onKeyDown={async(k)=>
                    {
                        if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                        {
                            await this.pg_txtItemsCode.setVal(e.value)
                            this.pg_txtItemsCode.onClick = async(data) =>
                            {
                                if(data.length == 1)
                                {
                                    this.addItem(data[0],e.rowIndex)
                                }
                                else if(data.length > 1)
                                {
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        if(i == 0)
                                        {
                                            this.addItem(data[i],e.rowIndex)
                                        }
                                        else
                                        {
                                            let tmpDocItems = {...this.lblObj.empty}
                                            tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                            this.lblObj.addEmpty(tmpDocItems)
                                            this.addItem(data[i],this.lblObj.dt().length - 1)
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    onValueChanged={(v)=>
                    {
                        e.value = v.value
                    }}
                    onChange={(async(r)=>
                    {
                        if(typeof r.event.isTrusted == 'undefined')
                        {
                            let tmpQuery = 
                            {
                                query :"SELECT  *, " +
                                "CASE WHEN UNDER_UNIT_VALUE =0 " +
                                "THEN 0 " +
                                "ELSE " +
                                "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                                "END AS UNDER_UNIT_PRICE " +
                                "FROM (  SELECT GUID,  " +
                                "CODE,  " +
                                "NAME,  " +
                                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,  " +
                                "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                                "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ORGINS),'') AS ORGINS, " +
                                "MAIN_GRP AS ITEM_GRP,  " +
                                "MAIN_GRP_NAME AS ITEM_GRP_NAME,  " +
                                "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  ," +
                                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'') <> '') AS TMP WHERE CODE = @CODE  ",
                                param : ['CODE:string|50'],
                                value : [r.component._changedValue]
                            }
                            let tmpData = await this.core.sql.execute(tmpQuery) 
                            if(tmpData.result.recordset.length > 0)
                            {
                                
                                this.addItem(tmpData.result.recordset[0],e.rowIndex)
                            }
                            else
                            {
                                let tmpConfObj =
                                {
                                    id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                                    button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                                }
                                await dialog(tmpConfObj);
                            }
                        }
                    }).bind(this)}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    if(data.length == 1)
                                    {
                                        this.addItem(data[0],e.rowIndex)
                                    }
                                    else if(data.length > 1)
                                    {
                                        for (let i = 0; i < data.length; i++) 
                                        {
                                            if(i == 0)
                                            {
                                                this.addItem(data[i],e.rowIndex)
                                            }
                                            else
                                            {
                                                let tmpDocItems = {...this.lblObj.empty}
                                                tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                this.lblObj.addEmpty(tmpDocItems)
                                                this.addItem(data[i],this.lblObj.dt().length -1)
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    async addItem(pData,pIndex)
    {
        App.instance.setState({isExecute:true})
        for (let i = 0; i < this.lblObj.dt().length; i++) 
        {
            if(this.lblObj.dt()[i].CODE == pData.CODE)
            {
                App.instance.setState({isExecute:false})
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                    await this.grdLabelQueue.devGrid.deleteRow(0)
                    return
                }
                else
                {
                    break
                }  
            }
        }
        this.lblObj.dt()[pIndex].CODE = pData.CODE
        this.lblObj.dt()[pIndex].MULTICODE = pData.MULTICODE
        this.lblObj.dt()[pIndex].BARCODE = pData.BARCODE
        this.lblObj.dt()[pIndex].NAME = pData.NAME
        this.lblObj.dt()[pIndex].ITEM_GRP = pData.ITEM_GRP
        this.lblObj.dt()[pIndex].ITEM_GRP_NAME = pData.ITEM_GRP_NAME
        this.lblObj.dt()[pIndex].CUSTOMER_NAME = pData.CUSTOMER_NAME
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].UNDER_UNIT_VALUE = pData.UNDER_UNIT_VALUE
        this.lblObj.dt()[pIndex].UNDER_UNIT_PRICE = pData.UNDER_UNIT_PRICE
        this.lblObj.dt()[pIndex].UNDER_UNIT_SYMBOL = pData.UNDER_UNIT_SYMBOL
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].ORGINS =pData.ORGINS
        this.calculateCount()
        App.instance.setState({isExecute:false})
    }
    async addAutoItem(pData)
    {
        App.instance.setState({isExecute:true})
        let tmpDocItems = {...this.lblObj.empty}
        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
        tmpDocItems.CODE = pData.CODE
        tmpDocItems.BARCODE = pData.BARCODE
        tmpDocItems.NAME = pData.NAME
        tmpDocItems.ITEM_GRP = pData.ITEM_GRP
        tmpDocItems.ITEM_GRP_NAME = pData.ITEM_GRP_NAME
        tmpDocItems.CUSTOMER_NAME = pData.CUSTOMER_NAME
        tmpDocItems.PRICE = pData.PRICE
        tmpDocItems.UNDER_UNIT_VALUE = pData.UNDER_UNIT_VALUE
        tmpDocItems.UNDER_UNIT_PRICE = pData.UNDER_UNIT_PRICE
        tmpDocItems.UNDER_UNIT_SYMBOL = pData.UNDER_UNIT_SYMBOL
        tmpDocItems.PRICE = pData.PRICE
        tmpDocItems.ORGINS = pData.ORGINS
        tmpDocItems.LINE_NO = this.lblObj.dt().length
        this.lblObj.addEmpty(tmpDocItems)
        this.calculateCount()
        App.instance.setState({isExecute:false})
    }
    calculateCount()
    {
        this.txtPage.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        if(this.txtPage.value == '')
        {
            this.txtPage.value = this.t("validDesign")
        }
        if(this.pageCount == 0)
        {
            this.txtPage.value = this.t("validDesign")
            this.txtFreeLabel.value = this.t("validDesign")
        }
        else
        {
            this.txtFreeLabel.value = this.pageCount - (this.lblObj.dt().length % this.pageCount)
        }
        this.txtLineCount.value = this.lblObj.dt().length
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnWizard" parent={this} icon="tips" type="default"
                                        onClick={()=>
                                        {
                                            this.popWizard.show()
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            this.getDoc(this.lblObj.dt()[0].GUID)
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init();
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" 
                                    onClick={async(e)=>
                                    {
                                        if(this.lblObj.dt()[this.lblObj.dt().length - 1].CODE == '')
                                        {
                                            await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                                        }

                                        let tmpConfObj =
                                        {
                                            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                        }
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            let Data = {data:this.lblObj.dt().toArray()}
                                            this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)

                                            let tmpConfObj1 =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                            }
                                            
                                            if((await this.mainLblObj.save()) == 0)
                                            {                       
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.btnSave.setState({disabled:true});
                                                this.btnNew.setState({disabled:false});
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="danger" validationGroup={"frmLabelQeueu" + this.tabIndex}
                                    onClick={async(e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpQuery = 
                                            {
                                                query:  "SELECT *, " +
                                                        "ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH " +
                                                        "FROM  ITEM_LABEL_QUEUE_VW_01 WHERE GUID  = @GUID" ,
                                                param:  ['GUID:string|50','DESIGN:string|25'],
                                                value:  [this.mainLblObj.dt()[0].GUID,this.cmbDesignList.value]
                                            }
                                            App.instance.setState({isExecute:true})
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            App.instance.setState({isExecute:false})
                                            console.log(JSON.stringify(tmpData.result.recordset))
                                            this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' +  JSON.stringify(tmpData.result.recordset)+ '}',(pResult) => 
                                            {                
                                                App.instance.setState({isExecute:true})                                
                                                if(pResult.split('|')[0] != 'ERR')
                                                {
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                    mywindow.onload = function() 
                                                    {
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                    } 
                                                }
                                                App.instance.setState({isExecute:false})
                                            });
                                            let updateQuery = 
                                            {
                                                query:  "UPDATE LABEL_QUEUE SET STATUS = 1 WHERE GUID = @GUID",
                                                param:  ['GUID:string|50'],
                                                value:  [this.mainLblObj.dt()[0].GUID]
                                            }
                                            await this.core.sql.execute(updateQuery)                                           
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }                                      
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmLabelQeueu">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM LABEL_QUEUE WHERE  REF = @REF ",
                                                    param : ['REF:string|25'],
                                                    value : [this.txtRef.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmLabelQeueu" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                            </Validator>
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno"  parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF_NO"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            readOnly={true}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            this.getDocs(0)   
                                                        }
                                                    },
                                                    {
                                                        id:'02',
                                                        icon:'arrowdown',
                                                        onClick:()=>
                                                        {
                                                            this.txtRefno.value = Math.floor(Date.now() / 1000)
                                                        }
                                                    }
                                                ]
                                            }
                                            onChange={(async()=>
                                            {
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmLabelQeueu" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRefNo")} />
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                   this.pg_Docs.hide()
                                                   this.getDocs('0,1')
                                                }
                                            }
                                        ]     
                                    }
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={150} defaultSortOrder="asc" />
                                        <Column dataField="COUNT" caption={this.t("pg_Docs.clmCount")} width={150} />
                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDocDate")} width={250} />
                                        <Column dataField="STATUS" caption={this.t("pg_Docs.clmPrint")} width={150} />
                                    </NdPopGrid>
                                </Item>
                                {/* txtPage */}
                                <Item>
                                    <Label text={this.t("txtPage")} alignment="right" />
                                    <NdTextBox id="txtPage" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* Boş */}
                                <EmptyItem/>
                                <Item>
                                    <Label text={this.t("design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList"
                                    dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"DESING"}}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize={50}
                                    notRefresh={true}
                                    onValueChanged={(async(e)=>
                                        {
                                           for (let i = 0; i < this.cmbDesignList.data.datatable.length; i++) 
                                           {
                                               if(this.cmbDesignList.data.datatable[i].TAG == e.value)
                                               {
                                                   this.pageCount = this.cmbDesignList.data.datatable[i].PAGE_COUNT
                                               }
                                           }
                                           this.calculateCount()
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME,PAGE_COUNT FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '01'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmLabelQeueu" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* txtFreeLabel */}
                                <Item>
                                    <Label text={this.t("txtFreeLabel")} alignment="right" />
                                    <NdTextBox id="txtFreeLabel" parent={this} simple={true}  
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                {/* txtBarcode */}
                                <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}  
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:"fa-solid fa-barcode",
                                                onClick:async(e)=>
                                                {
                                                    await this.pg_txtBarcode.setVal(this.txtBarcode.value)
                                                    this.pg_txtBarcode.show()
                                                    this.pg_txtBarcode.onClick = async(data) =>
                                                    {
                                                        this.txtBarcode.setState({value:""})
                                                        let tmpDocItems = {...this.lblObj.empty}
                                                        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                        tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                        this.lblObj.addEmpty(tmpDocItems)
                                                        
                                                        this.addItem(tmpData.result.recordset[0],this.lblObj.dt().length - 1)
                                                        this.txtBarcode.focus()

                                                        if(data.length > 0)
                                                        {
                                                            this.customerControl = true
                                                            this.customerClear = false
                                                            this.combineControl = true
                                                            this.combineNew = false
        
                                                            if(data.length == 1)
                                                            {
                                                                this.addItem(tmpData.result.recordset[0],this.lblObj.dt().length - 1)
                                                            }
                                                            else if(data.length > 1)
                                                            {
                                                                for (let i = 0; i < data.length; i++) 
                                                                {
                                                                    if(i == 0)
                                                                    {
                                                                        this.addItem(tmpData.result.recordset[0],this.lblObj.dt().length - 1)
                                                                    }
                                                                    else
                                                                    {
                                                                        let tmpDocItems = {...this.lblObj.empty}
                                                                        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                                        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                                        tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                                        this.lblObj.addEmpty(tmpDocItems)
                                                                        
                                                                        this.addItem(tmpData.result.recordset[0],this.lblObj.dt().length - 1)
                                                                        this.txtBarcode.focus()
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    onEnterKey={(async(e)=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query :"SELECT  *, " +
                                            "CASE WHEN UNDER_UNIT_VALUE =0 " +
                                            "THEN 0 " +
                                            "ELSE " +
                                            "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                                            "END AS UNDER_UNIT_PRICE " +
                                            "FROM ( SELECT ITEMS.GUID, " +
                                            "ITEM_BARCODE.CDATE, " +
                                            "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID ORDER BY LDATE DESC),ITEMS.CODE) AS MULTICODE,   " +
                                            "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ITEMS.ORGINS),'') AS ORGINS, " +
                                            "ITEMS.CODE, " +
                                            "ITEMS.NAME, " +
                                            "ITEM_BARCODE.BARCODE, " +
                                            "ITEMS.MAIN_GRP AS ITEM_GRP, " +
                                            "ITEMS.MAIN_GRP_NAME AS ITEM_GRP_NAME, " +
                                            "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS.GUID),'') AS CUSTOMER_NAME, " +
                                            "(SELECT [dbo].[FN_PRICE](ITEMS.GUID,ISNULL(ITEM_BARCODE.UNIT_FACTOR,1),GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ISNULL(ITEM_BARCODE.UNIT_FACTOR,1) AS PRICE  ,  " +
                                            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS.GUID),0) AS UNDER_UNIT_VALUE, " +
                                            "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS.GUID),0) AS UNDER_UNIT_SYMBOL " +
                                            "FROM ITEMS_VW_01 AS ITEMS LEFT OUTER  JOIN ITEM_BARCODE_VW_01 AS ITEM_BARCODE ON ITEMS.GUID = ITEM_BARCODE.ITEM_GUID  " +
                                            "WHERE ((ITEMS.CODE = @CODE) OR (ITEM_BARCODE.BARCODE = @CODE)) AND ITEMS.STATUS = 1 " +
                                            " ) AS TMP ORDER BY CDATE DESC " ,
                                            param : ['CODE:string|50'],
                                            value : [this.txtBarcode.value]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        this.txtBarcode.setState({value:""})
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            if(typeof this.lblObj.dt()[this.lblObj.dt().length - 1] == 'undefined' || this.lblObj.dt()[this.lblObj.dt().length - 1].CODE != '')
                                            {
                                                let tmpDocItems = {...this.lblObj.empty}
                                                tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                this.lblObj.addEmpty(tmpDocItems)
                                            }
                                            this.addItem(tmpData.result.recordset[0],this.lblObj.dt().length - 1)
                                            this.txtBarcode.focus()
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgItemNotFound',showTitle:true,title:this.t("msgItemNotFound.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgItemNotFound.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemNotFound.msg")}</div>)
                                            }                               
                                            await dialog(tmpConfObj);
                                        }
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* txtLineCount */}
                                <Item>
                                    <Label text={this.t("txtLineCount")} alignment="right" />
                                    <NdTextBox id="txtLineCount" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>{this.frmOutwas = e.component}}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmLabelQeueu" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            if(typeof this.lblObj.dt()[0] != 'undefined')
                                            {
                                                if(this.lblObj.dt()[this.lblObj.dt().length - 1].CODE == '')
                                                {
                                                    this.pg_txtItemsCode.show()
                                                    this.pg_txtItemsCode.onClick = async(data) =>
                                                    {
                                                        if(data.length == 1)
                                                        {
                                                            this.addItem(data[0],this.lblObj.dt().length - 1)
                                                        }
                                                        else if(data.length > 1)
                                                        {
                                                            for (let i = 0; i < data.length; i++) 
                                                            {
                                                                if(i == 0)
                                                                {
                                                                    this.addItem(data[i],this.lblObj.dt().length - 1)
                                                                }
                                                                else
                                                                {
                                                                    let tmpDocItems = {...this.lblObj.empty}
                                                                    tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                                    tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                                    tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                                    this.lblObj.addEmpty(tmpDocItems)
                                                                    this.addItem(data[i],this.lblObj.dt().length -1)
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return
                                                }
                                            }
                                            let tmpDocItems = {...this.lblObj.empty}
                                            tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                            tmpDocItems.LINE_NO = this.lblObj.dt().length
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.lblObj.addEmpty(tmpDocItems)
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                if(data.length == 1)
                                                {
                                                    this.addItem(data[0],this.lblObj.dt().length - 1)
                                                }
                                                else if(data.length > 1)
                                                {
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        if(i == 0)
                                                        {
                                                            this.addItem(data[i],this.lblObj.dt().length - 1)
                                                        }
                                                        else
                                                        {
                                                            let tmpDocItems = {...this.lblObj.empty}
                                                            tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                            tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                            tmpDocItems.LINE_NO = this.lblObj.dt().length
                                                            this.lblObj.addEmpty(tmpDocItems)
                                                            this.addItem(data[i],this.lblObj.dt().length -1)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                    <Button text={this.t("btnLabelCombine")}
                                    validationGroup={"frmLabelQeueu" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.getDocsCombine(0)
                                        }
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgDocValid',showTitle:true,title:this.t("msgDocValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgDocValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDocValid.msg")}</div>)
                                            }
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                </Item>
                                <Item>
                                    <NdGrid parent={this} id={"grdLabelQueue"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}} 
                                    paging={{enabled:false}}
                                    height={'600'} 
                                    width={'100%'}
                                    dbApply={false}
                                    loadPanel={{enabled:true}}
                                    onRowUpdated={async(e)=>{
                                        if(typeof e.data.PRICE != 'undefined' || typeof e.data.UNDER_UNIT_VALUE != 'undefined')
                                        {
                                            e.key.UNDER_UNIT_PRICE = parseFloat(((Number(e.key.PRICE) / Number(e.key.UNDER_UNIT_VALUE )) ).toFixed(3))
                                        }
                                        if(this.lblObj.dt()[this.lblObj.dt().length - 1].CODE == '')
                                        {
                                            await this.grdLabelQueue.devGrid.deleteRow(this.lblObj.dt().length - 1)
                                        }
                                        let Data = {data:this.lblObj.dt().toArray()}
                                        this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)
                                        setTimeout(() => 
                                        {
                                            this.mainLblObj.save()
                                        }, 500);
                                    }}
                                    onRowRemoved={(e)=>{
                                        this.calculateCount()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Scrolling mode="standard" />
                                        <Paging defaultPageSize={20}/>
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menuOff.stk_02_004")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="LINE_NO" caption={this.t("LINE_NO")} visible={false} width={50} dataType={'number'} allowEditing={false} defaultSortOrder="desc"/>
                                        <Column dataField="CUSER_NAME" caption={this.t("grdLabelQueue.clmCuser")} width={100} allowEditing={false}/>
                                        <Column dataField="CODE" caption={this.t("grdLabelQueue.clmItemCode")} width={110} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="BARCODE" caption={this.t("grdLabelQueue.clmBarcode")} width={130} allowEditing={false} />
                                        <Column dataField="NAME" caption={this.t("grdLabelQueue.clmItemName")} width={450} />
                                        <Column dataField="ITEM_GRP_NAME" caption={this.t("grdLabelQueue.clmItemGrpName")} allowEditing={false}  width={180}/>
                                        <Column dataField="ORGINS" caption={this.t("grdLabelQueue.clmOrgins")}   width={180}/>
                                        <Column dataField="PRICE" caption={this.t("grdLabelQueue.clmPrice")} width={70}/>
                                        <Column dataField="UNDER_UNIT_VALUE" caption={this.t("grdLabelQueue.clmUnderUnit")} width={80}/>
                                        <Column dataField="UNDER_UNIT_PRICE" caption={this.t("grdLabelQueue.clmUnderUnitPrice")}width={80} />
                                        <Column dataField="DESCRIPTION" caption={this.t("grdLabelQueue.clmDescription")} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT  *,  " +
                                        "CASE WHEN UNDER_UNIT_VALUE =0  " +
                                        "THEN 0 " +
                                        "ELSE " +
                                        "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                                        "END AS UNDER_UNIT_PRICE " +
                                        "FROM  (  SELECT GUID,   " +
                                        "CODE,   " +
                                        "NAME,   " +
                                        "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                        "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),ITEMS_VW_01.CODE) AS MULTICODE,   " +
                                        "MAIN_GRP AS ITEM_GRP,   " +
                                        "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ITEMS_VW_01.ORGINS),'') AS ORGINS, " +
                                        "MAIN_GRP_NAME AS ITEM_GRP_NAME, " +
                                        "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID),'') AS CUSTOMER_NAME, " +
                                        "(SELECT [dbo].[FN_PRICE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) AS PRICE  , " +
                                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE, " +
                                        "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_SYMBOL " +
                                        "FROM ITEMS_VW_01 WHERE  STATUS = 1) AS TMP " +
                                        "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    <NdPopGrid id={"pg_DocsCombine"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_DocsCombine.title")}
                    button=
                    {
                        [
                            {
                                id:'01',
                                icon:'more',
                                onClick:()=>
                                {
                                   this.pg_DocsCombine.hide()
                                   this.getDocsCombine('0,1')
                                }
                            }
                        ]
                    }
                    >
                        <Column dataField="REF" caption={this.t("pg_DocsCombine.clmRef")} width={150} defaultSortOrder="asc"/>
                        <Column dataField="REF_NO" caption={this.t("pg_DocsCombine.clmRefNo")} width={300} defaultSortOrder="asc" />
                        <Column dataField="COUNT" caption={this.t("pg_Docs.clmCount")} width={300} />
                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("pg_Docs.clmDocDate")} width={300} />
                    </NdPopGrid>
                    {/* popWizard */}
                    <div>
                        <NdPopUp parent={this} id={"popWizard"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popWizard.title")}
                        container={"#root"} 
                        width={'50%'}
                        height={'50%'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={2} height={'fit-content'}>
                                <Item  colSpan={2}>
                                    <NdCheckBox id="chkLastChange" parent={this} defaultValue={true} 
                                    param={this.param.filter({ELEMENT:'chkLastChange',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkLastChange',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                    {
                                        this.chkPromotionItems.setState({value:false});
                                        this.chkSelectChange.setState({value:false});
                                        this.chkSelectPriceChange.setState({value:false});
                                        this.chkGroup.setState({value:false});
                                        this.chkCustomer.setState({value:false});
                                        this.chkAllItems.setState({value:false});
                                    }).bind(this)}
                                    />
                                    <Label text={this.t("chkLastChange")} alignment="right" />
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkSelectChange" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkSelectChange',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkSelectChange',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                        {
                                            this.chkPromotionItems.setState({value:false});
                                            this.chkLastChange.setState({value:false});
                                            this.chkSelectPriceChange.setState({value:false});
                                            this.chkGroup.setState({value:false});
                                            this.chkCustomer.setState({value:false});
                                            this.chkAllItems.setState({value:false});
                                        }).bind(this)}
                                    />
                                    <Label text={this.t("chkSelectChange")} alignment="right" />
                                </Item>
                                <Item>
                                <NdDatePicker simple={true}  parent={this} id={"dtSelectChange"} type={'datetime'}/>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkSelectPriceChange" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkSelectPriceChange',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkSelectPriceChange',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                        {
                                            this.chkPromotionItems.setState({value:false});
                                            this.chkLastChange.setState({value:false});
                                            this.chkSelectChange.setState({value:false});
                                            this.chkGroup.setState({value:false});
                                            this.chkCustomer.setState({value:false});
                                            this.chkAllItems.setState({value:false});
                                        }).bind(this)}
                                    />
                                    <Label text={this.t("chkSelectPriceChange")} alignment="right" />
                                </Item>
                                <Item>
                                <NdDatePicker simple={true}  parent={this} id={"dtSelectPriceChange"} type={'datetime'}/>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkGroup" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkGroup',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkGroup',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                    {
                                        this.chkPromotionItems.setState({value:false});
                                        this.chkLastChange.setState({value:false});
                                        this.chkSelectChange.setState({value:false});
                                        this.chkSelectPriceChange.setState({value:false});
                                        this.chkCustomer.setState({value:false});
                                        this.chkAllItems.setState({value:false});
                                    }).bind(this)}
                                    />
                                    <Label text={this.t("chkGroup")} alignment="right" />
                                </Item>
                                <Item>
                                    <NdSelectBox simple={true} parent={this} id="cmbGroup" notRefresh = {true}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP"},sql:this.core.sql}}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkCustomer" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkCustomer',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkCustomer',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                    {
                                        this.chkPromotionItems.setState({value:false});
                                        this.chkLastChange.setState({value:false});
                                        this.chkSelectChange.setState({value:false});
                                        this.chkSelectPriceChange.setState({value:false});
                                        this.chkGroup.setState({value:false});
                                        this.chkAllItems.setState({value:false});
                                    }).bind(this)}
                                    />
                                    <Label text={this.t("chkCustomer")} alignment="right" />
                                </Item>
                                <Item>
                                    <NdSelectBox simple={true} parent={this} id="cmbCustomer" notRefresh = {true}
                                    displayExpr="TITLE"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT GUID,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2)"},sql:this.core.sql}}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkPromotionItems" parent={this} defaultValue={false} 
                                    onValueChanged={(async()=>
                                    {
                                        this.chkLastChange.setState({value:false});
                                        this.chkSelectChange.setState({value:false});
                                        this.chkGroup.setState({value:false});
                                        this.chkSelectPriceChange.setState({value:false});
                                        this.chkCustomer.setState({value:false});
                                        this.chkAllItems.setState({value:false});
                                    }).bind(this)}
                                    />
                                    <Label text={this.t("chkPromotionItems")} alignment="right" />
                                </Item>
                                <Item>
                                <div className="col-12">
                                    <NbDateRange id={"dtDate"} parent={this} startDate={moment(new Date())} endDate={moment(new Date())}/>
                                </div>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkAllItems" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkAllItems',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkAllItems',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                    {
                                        this.chkPromotionItems.setState({value:false});
                                        this.chkLastChange.setState({value:false});
                                        this.chkSelectChange.setState({value:false});
                                        this.chkSelectPriceChange.setState({value:false});
                                        this.chkGroup.setState({value:false});
                                        this.chkCustomer.setState({value:false});
                                    }).bind(this)}
                                    />
                                    <Label text={this.t("chkAllItems")} alignment="right" />
                                </Item>
                                <EmptyItem></EmptyItem>
                                <Item colSpan={2}>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("AddItems")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpConfObj =
                                                {
                                                    id:'msgAddItems',showTitle:true,title:this.t("msgAddItems.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgAddItems.btn01"),location:'before'},{id:"btn02",caption:this.t("msgAddItems.btn02"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAddItems.msg")}</div>)
                                                }
                                                let pResult = await dialog(tmpConfObj);
                                                if(pResult == 'btn01')
                                                {
                                                    this.AddWizardItems()
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popWizard.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pg_txtBarcode.title")} //
                        search={true}
                        data = 
                        {{
                            source:
                            {
                                select:
                                {
                                    query : "SELECT  *, " +
                                            "CASE WHEN UNDER_UNIT_VALUE = 0 " +
                                            "THEN 0 " +
                                            "ELSE " +
                                            "ROUND((PRICE / UNDER_UNIT_VALUE),2) " +
                                            "END AS UNDER_UNIT_PRICE " +
                                            "FROM ( SELECT ITEMS.GUID, " +
                                            "ITEM_BARCODE.CDATE, " +
                                            "ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID ORDER BY LDATE DESC),ITEMS.CODE) AS MULTICODE,   " +
                                            "ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ITEMS.ORGINS),'') AS ORGINS, " +
                                            "ITEMS.CODE, " +
                                            "ITEMS.NAME, " +
                                            "ITEM_BARCODE.BARCODE, " +
                                            "ITEMS.MAIN_GRP AS ITEM_GRP, " +
                                            "ITEMS.MAIN_GRP_NAME AS ITEM_GRP_NAME, " +
                                            "ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS.GUID),'') AS CUSTOMER_NAME, " +
                                            "(SELECT [dbo].[FN_PRICE](ITEMS.GUID,ITEM_BARCODE.UNIT_FACTOR,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ISNULL(ITEM_BARCODE.UNIT_FACTOR,1) AS PRICE  ,  " +
                                            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS.GUID),0) AS UNDER_UNIT_VALUE, " +
                                            "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS.GUID),0) AS UNDER_UNIT_SYMBOL " +
                                            "FROM ITEMS_VW_01 AS ITEMS LEFT OUTER  JOIN ITEM_BARCODE_VW_01 AS ITEM_BARCODE ON ITEMS.GUID = ITEM_BARCODE.ITEM_GUID  " +
                                            "WHERE  ITEM_BARCODE.BARCODE LIKE '%' + @BARCODE AND ITEMS.STATUS = 1  " +
                                            " ) AS TMP ORDER BY CDATE DESC " ,
                                    param : ['BARCODE:string|50']
                                },
                                sql:this.core.sql
                            }
                        }}
                        >
                            <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                            <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                            <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                        </NdPopGrid>
                </ScrollView>                
            </div>
        )
    }
}