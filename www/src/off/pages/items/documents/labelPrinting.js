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
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class labelPrinting extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.lblObj = new labelCls();
        this.mainLblObj = new labelMainCls()
        this.pageCount = 0;

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
        tmpLbl.REF = this.user.CODE
        this.mainLblObj.addEmpty(tmpLbl);
        
        this.txtSer.readOnly = false
        this.txtRefno.readOnly = false
        this.dtSelectChange.value =  moment(new Date()).format("YYYY-MM-DD"),
        this.txtSer.readOnly = true
        this.calculateCount()
        
        
        await this.grdLabelQueue.dataRefresh({source:this.lblObj.dt('LABEL_QUEUE')});

        this.txtSer.props.onChange()
    }
    async getDoc(pGuid)
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()
        await this.lblObj.load({GUID:pGuid});
        this.mainLblObj.load({GUID:pGuid});

        this.txtSer.readOnly = true
        this.txtRefno.readOnly = true
    }
    async getDocs(pType)
    {
        let tmpQuery = 
        {
            query : "SELECT GUID,REF,REF_NO FROM LABEL_QUEUE WHERE STATUS IN("+pType+") AND REF = '" +this.txtSer.value+"' " 
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
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID)
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
                "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE (SELECT TOP 1 LDATE FROM LABEL_QUEUE ORDER BY LDATE DESC) < (SELECT TOP 1 LDATE FROM ITEM_PRICE WHERE TYPE = 0  AND ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC) OR  (SELECT TOP 1 LDATE FROM LABEL_QUEUE ORDER BY LDATE DESC) < ITEMS_VW_01.LDATE) AS TMP ", 
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(0)
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
                "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE @DATE < (SELECT TOP 1 LDATE FROM ITEM_PRICE WHERE TYPE = 0  AND ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC) OR @DATE < ITEMS_VW_01.LDATE) AS TMP ", 
                param : ['DATE:date'],
                value : [this.dtSelectChange.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(0)
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
                "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE  MAIN_GRP = @GROUP) AS TMP ", 
                param : ['GROUP:string|25'],
                value : [this.cmbGroup.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(0)
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
                "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                "WHERE  ISNULL((SELECT TOP 1 [CODE] FROM ITEM_MULTICODE WHERE ITEM = ITEMS_VW_01.GUID AND CUSTOMER = @CUSTOMER),'') <> '') AS TMP ", 
                param : ['CUSTOMER:string|50'],
                value : [this.cmbCustomer.value]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(0)
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
                "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                "END AS UNDER_UNIT_PRICE " +
                "FROM  (  SELECT GUID,   " +
                "CDATE, " +
                "CODE,   " +
                "NAME,   " +
                "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                "MAIN_GRP AS ITEM_GRP,   " +
                "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                "FROM ITEMS_VW_01  " +
                " ) AS TMP ", 
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                for (let i = 0; i < tmpData.result.recordset.length; i++) 
                {
                    this.addAutoItem(tmpData.result.recordset[i])
                }
                await this.grdLabelQueue.devGrid.deleteRow(0)
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
                               "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                               "END AS UNDER_UNIT_PRICE " +
                               "FROM (  SELECT GUID,  " +
                               "CODE,  " +
                               "NAME,  " +
                               "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,  " +
                               "MAIN_GRP AS ITEM_GRP,  " +
                               "MAIN_GRP_NAME AS ITEM_GRP_NAME,  " +
                               "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  ," +
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
        for (let i = 0; i < this.lblObj.dt().length; i++) 
        {
            if(this.lblObj.dt()[i].CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                   
                    await this.grdLabelQueue.devGrid.deleteRow(pIndex)
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        this.lblObj.dt()[pIndex].CODE = pData.CODE
        this.lblObj.dt()[pIndex].BARCODE = pData.BARCODE
        this.lblObj.dt()[pIndex].NAME = pData.NAME
        this.lblObj.dt()[pIndex].ITEM_GRP = pData.ITEM_GRP
        this.lblObj.dt()[pIndex].ITEM_GRP_NAME = pData.ITEM_GRP_NAME
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].UNDER_UNIT_VALUE = pData.UNDER_UNIT_VALUE
        this.lblObj.dt()[pIndex].UNDER_UNIT_PRICE = pData.UNDER_UNIT_PRICE
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].LINE_NO = pIndex + 1
        this.calculateCount()
    }
    async addAutoItem(pData)
    {
        let tmpDocItems = {...this.lblObj.empty}
        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
        tmpDocItems.CODE = pData.CODE
        tmpDocItems.BARCODE = pData.BARCODE
        tmpDocItems.NAME = pData.NAME
        tmpDocItems.ITEM_GRP = pData.ITEM_GRP
        tmpDocItems.ITEM_GRP_NAME = pData.ITEM_GRP_NAME
        tmpDocItems.PRICE = pData.PRICE
        tmpDocItems.UNDER_UNIT_VALUE = pData.UNDER_UNIT_VALUE
        tmpDocItems.UNDER_UNIT_PRICE = pData.UNDER_UNIT_PRICE
        tmpDocItems.PRICE = pData.PRICE
        tmpDocItems.LINE_NO = this.lblObj.dt().length + 1
        this.lblObj.addEmpty(tmpDocItems)
        this.calculateCount()
    }
    calculateCount()
    {
        this.txtPage.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        if(this.txtPage.value == '')
        {
            this.txtPage.value = 'Lütfen Dizayn Seçiniz'
        }
        if(this.pageCount == 0)
        {
            this.txtFreeLabel.value = 'Lütfen Dizayn Seçiniz'
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" 
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
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                                this.btnSave.setState({disabled:true});
                                                this.btnNew.setState({disabled:false});
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default" validationGroup="frmLabelQeueu"
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
                                                value:  [this.lblObj.dt()[0].GUID,this.cmbDesignList.value]
                                            }

                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            console.log(tmpData)
                                            this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" +  JSON.stringify(tmpData.result.recordset)+ "}",(pResult) => 
                                            {
                                                console.log(pResult)
                                                if(pResult.split('|')[0] != 'ERR')
                                                {
                                                    console.log(11)
                                                    var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                    mywindow.onload = async function() 
                                                    {
                                                        mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"  
                                                        
                                                    }   
                                                   
                                                }
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
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={3} id="frmLabelQeueu">
                                {/* txtSer-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtSer" parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF"}}
                                            readOnly={true}
                                            maxLength={32}
                                            onChange={(async()=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM LABEL_QUEUE WHERE  REF = @REF ",
                                                    param : ['REF:string|25'],
                                                    value : [this.txtSer.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                if(tmpData.result.recordset.length > 0)
                                                {
                                                    this.txtRefno.setState({value:tmpData.result.recordset[0].REF_NO})
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtSer',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtSer',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmLabelQeueu"}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF_NO"}}
                                            readOnly={true}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            if(typeof this.btnSave.state.disabled != 'undefined')
                                                            {
                                                                if(this.btnSave.state.disabled == false)
                                                                {
                                                                    let tmpConfObj =
                                                                    {
                                                                        id:'msgNotSave',showTitle:true,title:this.t("msgNotSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                                        button:[{id:"btn01",caption:this.t("msgNotSave.btn01"),location:'after'}],
                                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotSave.msg")}</div>)
                                                                    }
                                                        
                                                                    await dialog(tmpConfObj);
                                                                    return
                                                                }
                                                            }
                                                           
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
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtSer.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmLabelQeueu"}>
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
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* txtPage */}
                                <Item>
                                    <Label text={this.t("txtPage")} alignment="right" />
                                    <NdTextBox id="txtPage" parent={this} simple={true}  
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* Boş */}
                                <EmptyItem />
                                <Item>
                                    <Label text={this.t("design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"DESING"}}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
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
                                        <Validator validationGroup={"frmLabelQeueu"}>
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
                                    onEnterKey={(async(e)=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query :"SELECT  *, " +
                                            "CASE WHEN UNDER_UNIT_VALUE =0 " +
                                            "THEN 0 " +
                                            "ELSE " +
                                            "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                                            "END AS UNDER_UNIT_PRICE " +
                                            "FROM ( SELECT ITEMS.GUID,    " +
                                            "ITEM_BARCODE.CDATE, " +
                                            "ITEMS.CODE,    " +
                                            "ITEMS.NAME,    " +
                                            "ITEM_BARCODE.BARCODE,    " +
                                            "MAIN_GRP AS ITEM_GRP,    " +
                                            "MAIN_GRP_NAME AS ITEM_GRP_NAME,    " +
                                            "(SELECT [dbo].[FN_PRICE_SALE](ITEMS.GUID,1,GETDATE())) AS PRICE  ,  " +
                                            "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS.GUID),0) AS UNDER_UNIT_VALUE   " +
                                            "FROM ITEMS_VW_01 AS ITEMS INNER JOIN ITEM_BARCODE ON ITEMS.GUID = ITEM_BARCODE.ITEM  " +
                                            "WHERE ((ITEMS.CODE = @CODE) OR (ITEM_BARCODE.BARCODE = @CODE))  " +
                                            " ) AS TMP ORDER BY CDATE DESC ",
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
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmOutwas = e.component
                            }}>
                               
                                 <Item>
                                    <NdGrid parent={this} id={"grdLabelQueue"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'600'} 
                                    width={'100%'}
                                    dbApply={false}
                                    loadPanel={{enabled:true}}
                                    onRowUpdated={async(e)=>{
                                        if(typeof e.data.PRICE != 'undefined' || typeof e.data.UNDER_UNIT_VALUE != 'undefined')
                                        {
                                            e.key.UNDER_UNIT_PRICE = parseFloat(((e.key.PRICE * (e.key.UNDER_UNIT_VALUE *100)) / 100).toFixed(3))
                                        }
                                    }}
                                    onRowRemoved={(e)=>{
                                        this.calculateCount()
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                        <Scrolling mode="standard" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                        <Export fileName={this.lang.t("menu.stk_02_004")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CODE" caption={this.t("grdLabelQueue.clmItemCode")} width={150} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="BARCODE" caption={this.t("grdLabelQueue.clmBarcode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("grdLabelQueue.clmItemName")} width={550} />
                                        <Column dataField="ITEM_GRP_NAME" caption={this.t("grdLabelQueue.clmItemGrpName")}  width={200}/>
                                        <Column dataField="PRICE" caption={this.t("grdLabelQueue.clmPrice")} width={70}/>
                                        <Column dataField="UNDER_UNIT_VALUE" caption={this.t("grdLabelQueue.clmUnderUnit")} width={80}/>
                                        <Column dataField="UNDER_UNIT_PRICE" caption={this.t("grdLabelQueue.clmUnderUnitPrice")}width={70} />
                                        <Column dataField="DESCRIPTION" caption={this.t("grdLabelQueue.clmDescription")} />
                                    </NdGrid>
                                </Item>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup="frmLabelQeueu"
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
                                            this.txtSer.readOnly = true
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
                                        "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                                        "END AS UNDER_UNIT_PRICE " +
                                        "FROM  (  SELECT GUID,   " +
                                        "CODE,   " +
                                        "NAME,   " +
                                        "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                        "MAIN_GRP AS ITEM_GRP,   " +
                                        "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                                        "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                        "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'') <> '') AS TMP " +
                                        "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
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
                                        this.chkSelectChange.setState({value:false});
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
                                            this.chkLastChange.setState({value:false});
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
                                    <NdCheckBox id="chkGroup" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkGroup',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkGroup',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                        {
                                            this.chkLastChange.setState({value:false});
                                            this.chkSelectChange.setState({value:false});
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
                                    onValueChanged={(async()=>
                                        {
                                           
                                        }).bind(this)}
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
                                            this.chkLastChange.setState({value:false});
                                            this.chkSelectChange.setState({value:false});
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
                                    onValueChanged={(async()=>
                                        {
                                           
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT GUID,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2)"},sql:this.core.sql}}}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <NdCheckBox id="chkAllItems" parent={this} defaultValue={false} 
                                    param={this.param.filter({ELEMENT:'chkAllItems',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkAllItems',USERS:this.user.CODE})}
                                    onValueChanged={(async()=>
                                        {
                                            this.chkLastChange.setState({value:false});
                                            this.chkSelectChange.setState({value:false});
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
                </ScrollView>                
            </div>
        )
    }
}