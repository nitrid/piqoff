import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls,itemLogPriceCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import {  Chart, Series, CommonSeriesSettings,  Format, Legend, Export } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Button as grdbutton} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class itemCard extends React.PureComponent
{
    constructor(props)
    {
        console.log("1 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
        super(props)                
        this.state = {underPrice : 0,isItemGrpForOrginsValid : false,isItemGrpForMinMaxAccess : false,isTaxSugar : false}
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.itemsObj = new itemsCls();
        this.itemsPriceSupply = new itemPriceCls();   
        this.itemsPriceLogObj = new itemLogPriceCls();    
        this.salesPriceLogObj = new datatable()
        this.salesPriceLogObj.selectCmd =
        {
            query :"SELECT * FROM [ITEM_PRICE_LOG_VW_01] WHERE ITEM_GUID = @ITEM_GUID AND TYPE = 0 ORDER BY LDATE DESC ",
            param : ['ITEM_GUID:string|50']
        }
        this.salesContractObj = new datatable()
        this.salesContractObj.selectCmd =
        {
            query :"SELECT * FROM [CONTRACT_Vw_01] WHERE ITEM = @ITEM_GUID AND TYPE = 1 AND START_DATE <= GETDATE() AND FINISH_DATE >= GETDATE()   ORDER BY LDATE DESC ",
            param : ['ITEM_GUID:string|50']
        }
        this.otherShopObj = new datatable()
        this.otherShopObj.selectCmd =
        {
            query :"SELECT  " +
            "(CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 104) + ' ' + CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 24)) AS DATE, " + 
            "OTHER_SHOP.CODE, " +
            "OTHER_SHOP.NAME, " +
            "MAX(OTHER_SHOP.BARCODE) AS BARCODE, " +
            "OTHER_SHOP.MULTICODE, " +
            "OTHER_SHOP.SALE_PRICE, " +
            "OTHER_SHOP.CUSTOMER, " +
            "OTHER_SHOP.CUSTOMER_PRICE, " +
            "OTHER_SHOP.SHOP " +
            "FROM ITEM_BARCODE_VW_01 AS BARCODE " +
            "INNER JOIN OTHER_SHOP_ITEMS AS OTHER_SHOP " +
            "ON BARCODE.BARCODE = OTHER_SHOP.BARCODE " +
            "WHERE BARCODE.ITEM_GUID = @ITEM_GUID " +
            "GROUP BY OTHER_SHOP.CODE,OTHER_SHOP.NAME, OTHER_SHOP.MULTICODE, OTHER_SHOP.SALE_PRICE, OTHER_SHOP.CUSTOMER_PRICE, OTHER_SHOP.CUSTOMER,OTHER_SHOP.SHOP,OTHER_SHOP.UPDATE_DATE " ,
            param : ['ITEM_GUID:string|50']
        }
        
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this._onItemRendered = this._onItemRendered.bind(this)
        this.taxSugarCalculate = this.taxSugarCalculate.bind(this)
        this._cellRoleRender = this._cellRoleRender.bind(this)


        this.extraCostData = new datatable
    }    
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        if(typeof this.pagePrm != 'undefined')
        {
            await this.init(); 
            this.getItem(this.pagePrm.CODE)
        }
        else
        {
            this.init(); 
        }
        console.log("2 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
    }    
    async init()
    {  
        this.prevCode = ""
        this.itemsObj.clearAll();

        this.itemsPriceSupply.clearAll();     
        this.itemsPriceLogObj.clearAll();     
        this.salesPriceLogObj.clear()   
        this.salesContractObj.clear()   
        this.otherShopObj.clear()

        this.itemsObj.ds.on('onAddRow',(pTblName,pData) =>
        {            
            if(pData.stat == 'new')
            {
                if(this.prevCode != '')
                {
                    this.btnNew.setState({disabled:true});
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:false});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
            }
            //ALT BİRİM FİYAT HESAPLAMASI
            this.underPrice();
            //MARGIN HESAPLAMASI
            this.grossMargin()                 
            this.netMargin()                 
            this.taxSugarValidCheck()
            this.taxSugarCalculate()
        })
        this.itemsObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
                this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSER = this.user.CODE
            }    
            if(pTblName == 'ITEM_PRICE' || pTblName == 'ITEM_UNIT')
            {
                // //ALT BİRİM FİYAT HESAPLAMASI
                this.underPrice();  
                // //MARGIN HESAPLAMASI
                this.grossMargin()                 
                this.netMargin() 
            }
                           
        })
        this.itemsObj.ds.on('onRefresh',(pTblName) =>
        {        
            this.prevCode = this.itemsObj.dt('ITEMS').length > 0 ? this.itemsObj.dt('ITEMS')[0].CODE : '';
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            //ALT BİRİM FİYAT HESAPLAMASI
            this.underPrice()
            //MARGIN HESAPLAMASI
            this.grossMargin()                 
            this.netMargin()                 
        })
        this.itemsObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })        

        this.itemsObj.addEmpty();
        
        this.txtRef.value = Math.floor(Date.now() / 1000)
        this.txtCustomer.value = "";
        this.txtCustomer.displayValue = "";   
        this.txtBarcode.readOnly = true;   
        this.imgFile.value = ""; 
        
        let tmpUnit = new unitCls();
        await tmpUnit.load()
        
        if(typeof this.itemsObj.dt()[0] != 'undefined')
        {
            let tmpMainUnitObj = {...this.itemsObj.itemUnit.empty}
            tmpMainUnitObj.TYPE = 0
            tmpMainUnitObj.TYPE_NAME = this.t("mainUnitName")   
            tmpMainUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
            
            if(tmpUnit.dt(0).length > 0)
            {
                tmpMainUnitObj.ID = tmpUnit.dt(0)[0].ID
            }
            
            let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
            tmpUnderUnitObj.TYPE = 1,
            tmpUnderUnitObj.TYPE_NAME = this.t("underUnitName")   
            tmpUnderUnitObj.ID  = this.cmbUnderUnit.value
            tmpUnderUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID    
            tmpUnderUnitObj.FACTOR = 0
            
            let tmpBarcodeObj = {...this.itemsObj.itemBarcode.empty}
            tmpBarcodeObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
            this.itemsObj.itemBarcode.addEmpty(tmpBarcodeObj);     
    
            this.itemsObj.itemUnit.addEmpty(tmpMainUnitObj);
            this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);
        }

        this.core.util.logPath = "\\www\\log\\off_" + this.core.auth.data.CODE + ".txt"

        this.itemGrpForOrginsValidCheck();   
        this.itemGrpForMinMaxAccessCheck();  
        this.taxSugarValidCheck()                      
    }
    async getItem(pCode)
    {
        console.log("11 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
        App.instance.setState({isExecute:true})
        this.itemsObj.clearAll();
        this.txtRef.value = Math.floor(Date.now() / 1000)
        this.txtCustomer.value = "";
        this.txtCustomer.displayValue = "";   
        this.txtBarcode.readOnly = true;   
        this.imgFile.value = ""; 
        await this.itemsObj.load({CODE:pCode});
        //TEDARİKÇİ FİYAT GETİR İŞLEMİ.  
        await this.itemsPriceSupply.load({ITEM_GUID:this.itemsObj.dt()[0].GUID,TYPE:1})  
        await this.itemsPriceLogObj.load({ITEM_GUID:this.itemsObj.dt()[0].GUID})
        if(this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length > 0 && this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length == 1)
        {
            this.txtLastBuyPrice.value = this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_PRICE
        }
        else if(this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length > 0)
        {
            this.txtLastBuyPrice.value = this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[1].CUSTOMER_PRICE
        }        

        this.txtBarcode.readOnly = true;

        this.salesPriceLogObj.selectCmd.value = [this.itemsObj.dt()[0].GUID]
        await this.salesPriceLogObj.refresh();
        this.salesContractObj.selectCmd.value = [this.itemsObj.dt()[0].GUID]
        await this.salesContractObj.refresh();
        this.otherShopObj.selectCmd.value = [this.itemsObj.dt()[0].GUID]
        await this.otherShopObj.refresh();

        if(this.salesPriceLogObj.length > 0)
        {
            this.txtLastSalePrice.value = this.salesPriceLogObj[0].PRICE
        }
       
        App.instance.setState({isExecute:false})
        if(typeof this.txtSalePrice != 'undefined')
        {
            let tmpQuery = 
            {
                query :"SELECT [dbo].[FN_PRICE_SALE](@GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE",
                param : ['GUID:string|50'],
                value : [this.itemsObj.dt()[0].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.txtSalePrice.value = tmpData.result.recordset[0].PRICE
                this.txtSalePrice.setState({value:tmpData.result.recordset[0].PRICE})
                console.log(this.txtSalePrice)
            }
            else
            {
                this.txtSalePrice.value = 0
                this.txtSalePrice.setState({value:0})
            }
        }
        this.prevCode = this.itemsObj.dt('ITEMS').length > 0 ? this.itemsObj.dt('ITEMS')[0].CODE : '';
        console.log("12 - " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss SSS"))
        console.log({data:this.itemsObj.dt('ITEM_IMAGE'),field:"IMAGE"})
        if(typeof this.itemsObj.dt('ITEM_IMAGE')[0] != 'undefined')
        {
            this.imgFile.value = this.itemsObj.dt('ITEM_IMAGE')[0].IMAGE
        }
        this.itemGrpForOrginsValidCheck();   
    }
    async checkItem(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                App.instance.setState({isExecute:true})
                let tmpData = await new itemsCls().load({CODE:pCode});
                App.instance.setState({isExecute:false})
                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:this.t("msgRef.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgRef.btn01"),location:'before'},{id:"btn02",caption:this.t("msgRef.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgRef.msg")}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(pCode)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemBarcodeCls().load({BARCODE:pCode});

                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgBarcode',
                        showTitle:true,
                        title:this.t("msgBarcode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgBarcode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgBarcode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcode.msg")}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(tmpData[0].ITEM_CODE)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }   
    async checkMultiCode(pCode,pSupply)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemMultiCodeCls().load({MULTICODE:pCode,CUSTOMER_CODE:pSupply});
                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'msgCustomer',
                        showTitle:true,
                        title:this.t("msgCustomer.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCustomer.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCustomer.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomer.msg")}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(tmpData[0].ITEM_CODE)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
                }
                else
                {
                    // SANAL DATA DA MÜŞTERİ KODU KONTROLÜ
                    if(this.itemsObj.itemMultiCode.dt().where({CUSTOMER_CODE:pSupply}).length > 0)
                    {
                        let tmpConfObj =
                        {
                            id:'msgCheckCustomerCode',showTitle:true,title:this.t("msgCheckCustomerCode.title"),showCloseButton:true,width:'500px',height:'200px',
                            button:[{id:"btn01",caption:this.t("msgCheckCustomerCode.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCheckCustomerCode.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        resolve(3)
                    }
                    //*********************************** */
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitlePrice"))
        {        
            await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
        }
        else if(e.itemData.title == this.t("tabTitleUnit"))
        {
            await this.grdUnit.dataRefresh({source:this.itemsObj.itemUnit.dt('ITEM_UNIT')});
        }
        else if(e.itemData.title == this.t("tabTitleBarcode"))
        {
            await this.grdBarcode.dataRefresh({source:this.itemsObj.itemBarcode.dt('ITEM_BARCODE')});
        }
        else if(e.itemData.title == this.t("tabTitleCustomer"))
        {
            await this.grdCustomer.dataRefresh({source:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')});
            await this.grdOtherShop.dataRefresh({source:this.otherShopObj});
        }
        else if(e.itemData.title == this.t("tabTitleCustomerPrice"))
        {
            await this.grdCustomerPrice.dataRefresh({source:this.itemsPriceLogObj.dt()});
        }
        else if(e.itemData.title == this.t("tabTitleSalesPriceHistory"))
        {
            await this.grdSalesPrice.dataRefresh({source:this.salesPriceLogObj});
        }
        else if(e.itemData.title == this.t("tabTitleSalesContract"))
        {
            await this.grdSalesContract.dataRefresh({source:this.salesContractObj});
        }
        else if(e.itemData.title == this.t("tabExtraCost"))
        {
            await this.grdExtraCost.dataRefresh({source:this.extraCostData});
        }
        else if(e.itemData.title == this.t("tabTitleInfo"))
        {
            console.log(this.itemsObj.dt())
            await this.grdItemInfo.dataRefresh({source:this.itemsObj.dt()});
        }
        else if(e.itemData.title == this.t("tabTitleOtherShop"))
        {
            let tmpQuery = 
            {
                query :"SELECT [dbo].[FN_PRICE_SALE](@GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE",
                param : ['GUID:string|50'],
                value : [this.itemsObj.dt()[0].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.txtSalePrice.value = tmpData.result.recordset[0].PRICE
                this.txtSalePrice.setState({value:tmpData.result.recordset[0].PRICE})
                console.log(this.txtSalePrice)
            }
            else
            {
                this.txtSalePrice.value = 0
                this.txtSalePrice.setState({value:0})
            }
            this.txtTabCostPrice.value = this.txtCostPrice.value 
            this.txtTabCostPrice.setState({value:this.txtCostPrice.value})
            await this.grdOtherShop.dataRefresh({source:this.otherShopObj});
        }
    }
    underPrice()
    {
        if(typeof this.itemsObj.itemUnit.dt().find(x => x.TYPE == 0) != 'undefined')
        {
            let tmpPrice = typeof this.itemsObj.itemPrice.dt().find(x => x.TYPE == 0 && x.QUANTITY == 1) != 'undefined' ? this.itemsObj.itemPrice.dt().find(x => x.TYPE == 0 && x.QUANTITY == 1).PRICE : 0;
            let tmpFactor = typeof this.itemsObj.itemUnit.dt().find(x => x.TYPE == 1) != 'undefined' ? this.itemsObj.itemUnit.dt().find(x => x.TYPE == 1).FACTOR : 0;
            this.setState({underPrice: (tmpPrice / tmpFactor).toFixed(2)});
        }
    }
    async grossMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE / ((this.itemsObj.dt("ITEMS")[0].VAT / 100) + 1)
            let tmpMargin = tmpExVat - this.txtCostPrice.value;
            let tmpMarginRate = ((tmpMargin / this.txtCostPrice.value)) * 100
            this.itemsObj.itemPrice.dt()[i].VAT_EXT = tmpExVat
            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2);                 
            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2);     
        }
        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
    }
    async netMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE / ((this.itemsObj.dt("ITEMS")[0].VAT / 100) + 1)
            let tmpMargin = (tmpExVat - this.txtCostPrice.value) / 1.15;
            let tmpMarginRate = (((tmpMargin / this.txtCostPrice.value) )) * 100
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2); 
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN_RATE = tmpMarginRate.toFixed(2);    
        }
        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});

    }   
    itemGrpForOrginsValidCheck()
    {
        let tmpData = this.prmObj.filter({ID:'ItemGrpForOrginsValidation'}).getValue()
        console.log(tmpData)
        if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.cmbItemGrp.value) != 'undefined')
        {
            console.log(1)
            this.setState({isItemGrpForOrginsValid:true})
        }
        else
        {
            console.log(2)
            this.setState({isItemGrpForOrginsValid:false})
        }
    }
    itemGrpForMinMaxAccessCheck()
    {
        let tmpData = this.prmObj.filter({ID:'ItemGrpForMinMaxAccess'}).getValue()
        if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.cmbItemGrp.value) != 'undefined')
        {
            this.setState({isItemGrpForMinMaxAccess:true})
        }
        else
        {
            this.setState({isItemGrpForMinMaxAccess:false})
        }
    }
    async taxSugarValidCheck()
    {
        let tmpData = this.prmObj.filter({ID:'taxSugarGroupValidation'}).getValue()
        if((typeof this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0] != 'undefined') && (typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.cmbItemGrp.value) != 'undefined'))
        {
            
            for (let i = 0; i < this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length; i++) 
            {
                let tmpQuery = 
                {
                    query :"SELECT TAX_SUCRE FROM CUSTOMERS WHERE CODE = @CODE ",
                    param : ['CODE:string|50'],
                    value : [this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_CODE]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(tmpData.result.recordset[0].TAX_SUCRE == 1)
                    {
                        this.setState({isTaxSugar:true})
                        this.txtTaxSugar.readOnly = false
                        return
                    }
                }
            }
            this.setState({isTaxSugar:false})
            this.txtTaxSugar.readOnly = true
        }
        else
        {
            this.setState({isTaxSugar:false})
            this.txtTaxSugar.readOnly = true
            if(typeof this.itemsObj.itemMultiCode.dt()[0] != 'undefined')
            {
                this.txtTaxSugar.value = 0
            }
        }
        this.taxSugarCalculate()
    }
    async taxSugarCalculate()
    {
        if(typeof this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0] != 'undefined')
        {
            let tmpCheckQuery = 
            {
                query :"SELECT TAX_SUCRE FROM CUSTOMERS WHERE CODE = @CODE ",
                param : ['CODE:string|50'],
                value : [this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_CODE]
            }
            let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
            if(tmpCheckData.result.recordset.length > 0)
            {
                if(tmpCheckData.result.recordset[0].TAX_SUCRE == 1)
                {
                    let tmpQuery = 
                    {
                        query :"SELECT RATE,PRICE FROM TAX_SUGAR_TABLE_VW_01 WHERE MIN_VALUE <= @VALUE AND MAX_VALUE >= @VALUE AND TYPE =0 ",
                        param : ['VALUE:float'],
                        value : [this.txtTaxSugar.value]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length > 0)
                    {
                        let tmpUnit = this.txtUnderUnit.value / 100
                        let tmpTaxSucre = tmpUnit * tmpData.result.recordset[0].PRICE
                        this.taxSugarPrice = Number(tmpTaxSucre.toFixed(3))
                        if(this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length > 0)
                        {
                          
                        }
                    }
                    this.extraCostCalculate()
                }
                else
                {
                    this.taxSugarPrice = 0
                    this.extraCostCalculate()
                }
            }
        }
       
    }
    async extraCostCalculate()
    {
        this.extraCostData.clear()
        if(this.txtTaxSugar.value > 0)
        {
            if(this.extraCostData.where({TYPE_NAME:this.t("clmtaxSugar")}).length > 0)
            {
                this.extraCostData.where({TYPE_NAME:this.t("clmtaxSugar")})[0].PRICE = this.taxSugarPrice
            }
            else
            {
                this.extraCostData.push({TYPE_NAME:this.t("clmtaxSugar"),PRICE:this.taxSugarPrice,CUSTOMER:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_NAME,CUSTOMER_PRICE:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_PRICE})
            }
        }
        if(this.sysParam.filter({ID:'costForInvoıces',USERS:this.user.CODE}).getValue().value)
        {
            let tmpQuery = 
            {
                query : "SELECT TOP 1 DOC_GUID FROM DOC_ITEMS_VW_01 WHERE ITEM = @ITEM AND ISNULL((SELECT TOP 1 ITEM_TYPE FROM DOC_ITEMS WHERE ((DOC_ITEMS.DOC_GUID = DOC_ITEMS_VW_01.DOC_GUID) OR (DOC_ITEMS.DOC_GUID = DOC_ITEMS_VW_01.INVOICE_LINE_GUID)) AND ITEM_TYPE = 1),0) = 1 ORDER BY DOC_DATE DESC",
                param : ['ITEM:string|50'],
                value : [this.itemsObj.dt()[0].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length >0)
            {
                console.log(tmpData.result.recordset[0].DOC_GUID)
                let tmpItemQuery = 
                {
                    query : "SELECT * FROM DOC_ITEMS_VW_01 WHERE (DOC_GUID = @DOC_GUID OR INVOICE_LINE_GUID = @DOC_GUID) OR DOC_GUID IN (SELECT INVOICE_LINE_GUID FROM DOC_ITEMS_VW_01 WHERE DOC_GUID = @DOC_GUID)",
                    param : ['DOC_GUID:string|50'],
                    value : [tmpData.result.recordset[0].DOC_GUID]
                }
                let tmpItemData = await this.core.sql.execute(tmpItemQuery)
                console.log(tmpItemData)
                if(tmpItemData.result.recordset.length >0)
                {
                    let tmpServices = []
                    for (let i = 0; i < tmpItemData.result.recordset.length; i++) 
                    {
                        if(tmpItemData.result.recordset[i].ITEM_TYPE == 1)
                        {
                            tmpServices.push(tmpItemData.result.recordset[i])
                        }
                    }
                    console.log(tmpServices)
                    for (let x = 0; x < tmpServices.length; x++) 
                    {
                        let tmpQuantity = 0
                        for (let i = 0; i < tmpItemData.result.recordset.length; i++) 
                        {
                            if(tmpItemData.result.recordset[i].ITEM_TYPE == 0)
                            {
                                tmpQuantity = tmpQuantity + tmpItemData.result.recordset[i].QUANTITY
                            }
                        }
                        console.log(tmpServices[x].AMOUNT+'-'+tmpQuantity)
                        let tmpTotal = parseFloat(Number(tmpServices[x].AMOUNT / tmpQuantity).toFixed(3))
                        console.log(tmpTotal)
                        if(this.extraCostData.where({DESCRIPTION:tmpServices[x].ITEM_NAME}).length > 0)
                        {
                            this.extraCostData.where({DESCRIPTION:tmpServices[x].ITEM_NAME})[0].PRICE = tmpTotal
                            this.extraCostData.where({DESCRIPTION:tmpServices[x].ITEM_NAME})[0].CUSTOMER = tmpServices[x].OUTPUT_NAME
                        }
                        else
                        {
                            this.extraCostData.push({TYPE_NAME:this.t("clmInvoiceCost"),DESCRIPTION:tmpServices[x].ITEM_NAME,PRICE:tmpTotal,CUSTOMER:tmpServices[x].OUTPUT_NAME,CUSTOMER_PRICE:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_PRICE})
                        }

                    }
                }

            }
        }


        if(this.extraCostData.length > 0)
        {
            let tmpTotal = parseFloat((this.extraCostData.sum("PRICE",3)))
            this.txtTotalExtraCost.setState({value:tmpTotal})
            this.txtCostPrice.value = this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_PRICE + parseFloat((this.extraCostData.sum("PRICE",3)))
        }
        else
        {
            this.txtTotalExtraCost.setState({value:0})
        }

        this.netMargin()
        this.grossMargin()
    }
    _cellRoleRender(e)
    {
        if(e.column.name == "CUSTOMER_PRICE_DATE")
        {
            return (
                <NdTextBox id={"txtGrdDate"+e.rowIndex} parent={this} simple={true} readOnly={true}
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'revert',
                            onClick:async()  =>
                            {
                                this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[e.rowIndex].CUSTOMER_PRICE_DATE = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
                                this.txtCostPrice.value = e.data.CUSTOMER_PRICE
                                console.log(e)
                                let tmpQuery = 
                                {
                                    query : "UPDATE ITEM_PRICE SET CHANGE_DATE = GETDATE() WHERE GUID =@PRICE_GUID ",
                                    param : ['PRICE_GUID:string|50'],
                                    value : [e.data.CUSTOMER_PRICE_GUID]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                // Min ve Max Fiyat 
                                let tmpMinData = this.prmObj.filter({ID:'ItemMinPricePercent'}).getValue()
                                let tmpMinPrice = e.data.CUSTOMER_PRICE + (e.data.CUSTOMER_PRICE * tmpMinData) /100
                                this.txtMinSalePrice.value = Number((tmpMinPrice).toFixed(2))
                                let tmpMaxData = this.prmObj.filter({ID:'ItemMaxPricePercent'}).getValue()
                                let tmpMAxPrice = e.data.CUSTOMER_PRICE + (e.data.CUSTOMER_PRICE * tmpMaxData) /100
                                this.txtMaxSalePrice.value = Number((tmpMAxPrice).toFixed(2))
                                this.taxSugarValidCheck()
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    render()
    {           
        return (
            <React.Fragment>                
                <ScrollView>                    
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={()=>
                                    {
                                        if(this.prevCode != '')
                                        {
                                            this.getItem(this.prevCode); 
                                        }
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmItems" + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        this.core.util.writeLog("Kaydet butonuna basıldı. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME)
                                        if(e.validationGroup.validate().status == "valid")
                                        {                                            
                                            if(typeof this.itemsObj.itemBarcode.dt()[0] != 'undefined')
                                            {
                                                if(this.itemsObj.itemBarcode.dt()[0].BARCODE == '')
                                                {
                                                    this.itemsObj.itemBarcode.clearAll()
                                                }
                                            }
                                           
                                            //FIYAT GİRMEDEN KAYIT EDİLEMEZ KONTROLÜ
                                            let tmpData = this.prmObj.filter({ID:'ItemGrpForNotPriceSave'}).getValue()
                                            if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.cmbItemGrp.value) != 'undefined')
                                            {
                                                
                                            }
                                            else
                                            {
                                                if(this.itemsObj.dt('ITEM_PRICE').length == 0)
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPriceSave',showTitle:true,title:this.t("msgPriceSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPriceSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPriceSave.msg")}</div>)
                                                    }
                                                    
                                                    await dialog(tmpConfObj);
    
                                                    return;
                                                }
                                            }
                                            //************************************ */
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.itemsObj.save()) == 0)
                                                {         
                                                    this.core.util.writeLog("Kaydet başarılı. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME)                                           
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    this.core.util.writeLog("Kaydet başarısız. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME) 
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                            else
                                            {
                                                this.core.util.writeLog("Kayıtdan vazgeçildi. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME) 
                                            }
                                        }                              
                                        else
                                        {
                                            this.core.util.writeLog("Kaydet validasyon başarısız. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME) 
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
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query : "SELECT TOP 1 * FROM POS_SALE_VW_01 WHERE ITEM_GUID = @CODE ",
                                            param : ['CODE:string|50'],
                                            value : [this.itemsObj.dt()[0].GUID]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        console.log(tmpData)
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgNotDelete',showTitle:true,title:this.t("msgNotDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgNotDelete.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNotDelete.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj); 
                                            return
                                        }
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.itemsObj.dt('ITEMS').removeAt(0)
                                            await this.itemsObj.dt('ITEMS').delete();
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={async()=>
                                    {
                                        
                                        let tmpItem = {...this.itemsObj.dt()[0]}
                                        this.itemsObj.clearAll();

                                        this.txtRef.value = Math.floor(Date.now() / 1000)
                                        this.txtCustomer.value = "";
                                        this.txtCustomer.displayValue = "";   
                                        this.txtBarcode.displayValue = ""; 
                                        this.txtBarcode.value = ""; 
                                        this.txtBarcode.readOnly = true;   
                                        this.imgFile.value = ""; 
                                        this.itemsPriceSupply.clearAll();     
                                        this.itemsPriceLogObj.clearAll();     
                                        this.salesPriceLogObj.clear()   
                                        this.salesContractObj.clear()   
                                        this.otherShopObj.clear()

                                        this.core.util.waitUntil(0)
                                        this.itemsObj.addEmpty(); 
                                        this.itemsObj.dt()[0].VAT = tmpItem.VAT
                                        this.itemsObj.dt()[0].NAME = tmpItem.NAME
                                        this.itemsObj.dt()[0].MAIN_GRP = tmpItem.MAIN_GRP
                                        this.itemsObj.dt()[0].MAIN_GUID = tmpItem.MAIN_GUID
                                        this.itemsObj.dt()[0].TYPE = tmpItem.TYPE
                                        this.itemsObj.dt()[0].CODE= Math.floor(Date.now() / 1000)
                                        this.itemsObj.dt()[0].WEIGHING = tmpItem.WEIGHING
                                        this.itemsObj.dt()[0].SALE_JOIN_LINE = tmpItem.SALE_JOIN_LINE
                                        this.itemsObj.dt()[0].TICKET_REST = tmpItem.TICKET_REST
                                        this.itemsObj.dt()[0].SNAME = tmpItem.SNAME
                                        let tmpUnit = new unitCls();
                                        await tmpUnit.load()
                                        
                                        let tmpMainUnitObj = {...this.itemsObj.itemUnit.empty}
                                        tmpMainUnitObj.TYPE = 0
                                        tmpMainUnitObj.TYPE_NAME = this.t("mainUnitName")   
                                        tmpMainUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                        
                                        if(tmpUnit.dt(0).length > 0)
                                        {
                                            tmpMainUnitObj.ID = tmpUnit.dt(0)[0].ID
                                        }
                                        
                                        let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
                                        tmpUnderUnitObj.TYPE = 1,
                                        tmpUnderUnitObj.TYPE_NAME =this.t("underUnitName")   
                                        tmpUnderUnitObj.ID  = this.cmbUnderUnit.value
                                        tmpUnderUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID    
                                        tmpUnderUnitObj.FACTOR = 0
                                        
                                        let tmpBarcodeObj = {...this.itemsObj.itemBarcode.empty}
                                        tmpBarcodeObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                        this.itemsObj.itemBarcode.addEmpty(tmpBarcodeObj);     
                                
                                        this.itemsObj.itemUnit.addEmpty(tmpMainUnitObj);
                                        this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);
                                
                                        this.itemGrpForOrginsValidCheck();   
                                        this.itemGrpForMinMaxAccessCheck();  
                                        this.taxSugarValidCheck()

                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnAnalysis" parent={this} icon="chart" type="default"
                                    onClick={async ()=>
                                    {
                                        App.instance.setState({isExecute:true})
                                        let tmpQuery = 
                                        {
                                            query :"SELECT SUM(QUANTITY) AS QUANTITY,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE FROM POS_SALE_VW_01 " +
                                                    "WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999' " +
                                                    "GROUP BY DOC_DATE,ITEM_CODE ",
                                            param : ['CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                                            value : [this.txtRef.value,this.dtDate.startDate,this.dtDate.endDate]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.setState({dataSource:tmpData.result.recordset})
                                        }
                                        else
                                        {
                                            this.setState({dataRefresh:{0:{QUANTITY:0,DOC_DATE:''}}})
                                        }
                                        App.instance.setState({isExecute:false})
                                        this.popAnalysis.show()
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
                    <div className="row px-2 pt-2">                        
                        <div className="col-9">
                            <Form colCount={2} id={"frmItems" + this.tabIndex}>
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRef.show()
                                                    this.pg_txtRef.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getItem(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtRef.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkItem(this.txtRef.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtRef.value = "";
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}     
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        [
                                            {
                                                id:'tst',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    console.log(1111)
                                                }
                                            }
                                        ]
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                {/* cmbItemGrp */}
                                <Item>
                                    <Label text={this.t("cmbItemGrp")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGrp" tabIndex={this.tabIndex}
                                    dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GUID",display:"MAIN_GRP_NAME"}}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true} 
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh={true}
                                    param={this.param.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                                    data={{source:{select:{query : "SELECT CODE,NAME,GUID FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                    {
                                        this.itemGrpForOrginsValidCheck()
                                        this.taxSugarValidCheck()
                                        this.itemGrpForMinMaxAccessCheck()
                                    }}
                                    />
                                </Item>
                                {/* txtCustomer */}
                                <Item>
                                    <Label text={this.t("txtCustomer")} alignment="right" />
                                    <NdTextBox id="txtCustomer" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemsObj.dt('ITEM_MULTICODE'),field:"CUSTOMER_NAME",display:"CUSTOMER_NAME"}}
                                    readOnly={true}
                                    //displayValue={""}
                                    button={[
                                    {
                                        id:'001',
                                        icon:'add',
                                        onClick:()=>
                                        {
                                            this.txtPopCustomerCode.value = "";
                                            this.txtPopCustomerName.value = "";
                                            this.txtPopCustomerItemCode.value = "";
                                            this.txtPopCustomerPrice.value = 0;
                                            this.popCustomer.show();
                                            setTimeout(async () => 
                                            {
                                               this.txtPopCustomerCode.focus()
                                            }, 600)
                                        }
                                    }]}
                                    param={this.param.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}>
                                    </NdTextBox>
                                </Item>
                                {/* cmbItemGenus */}
                                <Item>
                                    <Label text={this.t("cmbItemGenus")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGenus" dt={{data:this.itemsObj.dt('ITEMS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:"0",VALUE:this.t("cmbItemGenusData.item")},{ID:"1",VALUE:this.t("cmbItemGenusData.service")},{ID:"2",VALUE:this.t("cmbItemGenusData.deposit")}]}}
                                    param={this.param.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* txtBarcode */}
                                <Item>
                                    <Label text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemsObj.dt('ITEM_BARCODE'),field:"BARCODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:async()=>
                                                {
                                                    await this.cmbPopBarUnit.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})})
                                                    this.txtPopBarcode.value = "";
                                                    this.cmbPopBarType.value = "0";
                                                    this.cmbPopBarUnit.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''
                                                    this.popBarcode.show();
                                                    setTimeout(async () => 
                                                    {
                                                        this.txtPopBarcode.focus()
                                                    }, 600);
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        await this.checkBarcode(this.txtBarcode.value)
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>  
                                {/* cmbTax */}
                                <Item>
                                    <Label text={this.t("cmbTax")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbTax" height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"VAT"}}
                                    displayExpr="VAT"                       
                                    valueExpr="VAT"
                                    data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbTax',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbTax',USERS:this.user.CODE})}
                                    />
                                </Item>                              
                                {/* cmbMainUnit */}
                                <Item>
                                    <Label text={this.t("cmbMainUnit")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbMainUnit" height='fit-content' 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:0}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbMainUnit',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbMainUnit',USERS:this.user.CODE})}
                                            />
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdNumberBox id="txtMainUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            showSpinButtons={true} step={1.0} format={"###.000"}
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:0}}}
                                            param={this.param.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                    </div>
                                </Item>     
                                {/* cmbOrigin */}
                                <Item>
                                    <Label text={this.t("cmbOrigin")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                    dt={{data:this.itemsObj.dt('ITEMS'),field:"ORGINS",display:"ORGINS_NAME"}}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value=""
                                    searchEnabled={true} showClearButton={true}
                                    param={this.param.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    onValueChanged={(e)=>
                                        {
                                            this.btnSave.setState({disabled:false});
                                            this.taxSugarValidCheck()
                                        }}
                                    >
                                        <Validator validationGroup={this.state.isItemGrpForOrginsValid ? "frmItems" + this.tabIndex : ''}>
                                            <RequiredRule message={this.t("validOrigin")}   
                                            />
                                        </Validator>
                                    </NdSelectBox>                                    
                                </Item>                           
                                {/* cmbUnderUnit */}
                                <Item>
                                    <Label text={this.t("cmbUnderUnit")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbUnderUnit" height='fit-content' 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:1}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbUnderUnit',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbUnderUnit',USERS:this.user.CODE})}
                                            />
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdNumberBox id="txtUnderUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            showSpinButtons={true} step={0.1} format={"##0.000"}
                                            dt={{id:"txtUnderUnit",data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:1}}}
                                            param={this.param.filter({ELEMENT:'txtUnderUnit',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtUnderUnit',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className="col-3 pe-0">
                                            <div className="dx-field-label" style={{width:"100%"}}>{this.state.underPrice} €</div>
                                        </div>
                                    </div>                                     
                                </Item>   
                                {/* TaxSugar */}
                                <Item>
                                    <Label text={this.t("txtTaxSugar")} alignment="right" />
                                    <NdNumberBox id="txtTaxSugar" parent={this} simple={true} readOnly={true}
                                     showSpinButtons={true} step={1.0} format={"###.00"} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                    dt={{data:this.itemsObj.dt('ITEMS'),field:"SUGAR_RATE"}} 
                                    param={this.param.filter({ELEMENT:'txtTaxSugar',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTaxSugar',USERS:this.user.CODE})}
                                    onChange={()=>
                                    {
                                        this.taxSugarCalculate()
                                    }}>
                                       <Validator validationGroup={this.state.isTaxSugar ? "frmItems" + this.tabIndex : ''}>
                                            <RangeRule min={4.001} message={this.t("validTaxSucre")}   
                                             />
                                        </Validator>
                                    </NdNumberBox>
                                </Item>                          
                                {/* txtItemName */}
                                <Item>
                                    <Label text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}}
                                    param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value.length <= 32)
                                            this.txtShortName.value = e.value.toUpperCase()
                                    }}>
                                        <Validator validationGroup={"frmItems" + this.tabIndex}>
                                            <RequiredRule message={this.t("validName")}   
                                             />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                {/* txtShortName */}
                                <Item>
                                    <Label text={this.t("txtShortName")} alignment="right" />
                                        <NdTextBox id="txtShortName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"SNAME"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}
                                        />
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile" parent={this} dt={{data:this.itemsObj.dt('ITEM_IMAGE'),field:"IMAGE"}}
                                    onValueChanged={(e)=>
                                    {
                                        if(this.itemsObj.dt('ITEM_IMAGE').length == 0)
                                        {
                                            this.itemsObj.itemImage.addEmpty();                             
                                        }

                                        this.itemsObj.dt('ITEM_IMAGE')[0].CUSER = this.core.auth.data.CODE,  
                                        this.itemsObj.dt('ITEM_IMAGE')[0].ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                        this.itemsObj.dt('ITEM_IMAGE')[0].IMAGE = e
                                    }
                                    }/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                            <div className='col-6'>
                                    <NdButton id="btnNewImg" parent={this} icon="add" type="default" width='100%'
                                    />
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={()=>
                                    {
                                        if(this.prevCode != '')
                                        {
                                            this.itemsObj.dt('ITEM_IMAGE')[0].IMAGE = "" 
                                        }
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={6} id={"frmChkBox" + this.tabIndex}>
                                {/* chkActive */}
                                <Item>
                                    <Label text={this.t("chkActive")} alignment="right" />
                                    <NdCheckBox id="chkActive" parent={this} defaultValue={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"STATUS"}}
                                    param={this.param.filter({ELEMENT:'chkActive',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkActive',USERS:this.user.CODE})}/>
                                </Item>
                                {/* chkCaseWeighed */}
                                <Item>
                                    <Label text={this.t("chkCaseWeighed")} alignment="right" />
                                    <NdCheckBox id="chkCaseWeighed" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"WEIGHING"}}
                                    param={this.param.filter({ELEMENT:'chkCaseWeighed',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkCaseWeighed',USERS:this.user.CODE})}/>
                                </Item>
                                {/* chkLineMerged */}
                                <Item>
                                    <Label text={this.t("chkLineMerged")} alignment="right" />
                                    <NdCheckBox id="chkLineMerged" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}
                                    //param={this.param.filter({ELEMENT:'chkLineMerged',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'chkLineMerged',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* chkTicketRest */}
                                <Item>
                                    <Label text={this.t("chkTicketRest")} alignment="right" />
                                    <NdCheckBox id="chkTicketRest" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"TICKET_REST"}}
                                    param={this.param.filter({ELEMENT:'chkTicketRest',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkTicketRest',USERS:this.user.CODE})}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <TabPanel height="100%" onItemRendered={this._onItemRendered}>
                                <Item title={this.t("tabTitlePrice")}>
                                    {/* FİYAT PANELI */}
                                    <div className='row px-2 py-2'>
                                        <div className='col-1'>
                                            <NdNumberBox id="txtCostPrice" parent={this} title={this.t("txtCostPrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}} readOnly={true}
                                            format={"#,##0.000"} step={0.1}
                                            param={this.param.filter({ELEMENT:'txtCostPrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtCostPrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>                                        
                                        <div className='col-1'>
                                            <NdNumberBox id="txtTotalExtraCost" parent={this} title={this.t("txtTotalExtraCost")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            format={"#,##0.000"} readOnly={true}
                                            param={this.param.filter({ELEMENT:'txtTotalExtraCost',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtTotalExtraCost',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-1'>
                                            <NdNumberBox id="txtMinSalePrice" parent={this} title={this.t("txtMinSalePrice")} titleAlign={"top"} tabIndex={this.tabIndex}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"MIN_PRICE"}}
                                            format={"#,##0.000"} step={0.1}
                                            editable={this.state.isItemGrpForMinMaxAccess}
                                            param={this.param.filter({ELEMENT:'txtMinSalePrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMinSalePrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-1'>
                                            <NdNumberBox id="txtMaxSalePrice" parent={this} title={this.t("txtMaxSalePrice")} titleAlign={"top"} tabIndex={this.tabIndex}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"MAX_PRICE"}}
                                            format={"#,##0.000"} step={0.1}
                                            editable={this.state.isItemGrpForMinMaxAccess}
                                            param={this.param.filter({ELEMENT:'txtMaxSalePrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMaxSalePrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-1'>
                                            <NdNumberBox id="txtLastBuyPrice" parent={this} title={this.t("txtLastBuyPrice")} titleAlign={"top"} readOnly={true}
                                            format={"#,##0.000"} step={0.1}
                                            param={this.param.filter({ELEMENT:'txtLastBuyPrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtLastBuyPrice',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className='col-1'>
                                            <NdNumberBox id="txtLastSalePrice" parent={this} title={this.t("txtLastSalePrice")} titleAlign={"top"}
                                            format={"#,##0.000"} step={0.1} readOnly={true}
                                            param={this.param.filter({ELEMENT:'txtLastSalePrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtLastSalePrice',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className='col-1 offset-5 py-3'>
                                            <Toolbar>
                                                <Item location="after">
                                                        <Button icon="add"
                                                        text={this.t("sellPriceAdd")}
                                                        onClick={()=>
                                                        {                                                        
                                                            this.dtPopPriStartDate.value = "1970-01-01"
                                                            this.dtPopPriEndDate.value = "1970-01-01"
                                                            this.txtPopPriQuantity.value = 1
                                                            this.txtPopPriPrice.value = 0

                                                            this.popPrice.show();
                                                            setTimeout(async () => 
                                                            {
                                                               this.txtPopPriPrice.focus()
                                                            }, 600)
                                                        }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdPrice"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onCellPrepared={(e) =>
                                            {
                                                if(e.rowType === "data" && e.column.dataField === "GROSS_MARGIN")
                                                {
                                                    e.cellElement.style.color = e.data.GROSS_MARGIN_RATE < 30 ? "red" : "blue";
                                                }
                                                if(e.rowType === "data" && e.column.dataField === "NET_MARGIN")
                                                {
                                                    e.cellElement.style.color = e.data.NET_MARGIN_RATE < 30 ? "red" : "blue";
                                                }
                                            }}
                                            onRowUpdating={async(e)=>
                                            {
                                                if(typeof e.newData.PRICE != 'undefined')
                                                {
                                                    //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                                    if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.txtCostPrice.value != 0 && this.txtCostPrice.value >= e.newData.PRICE)
                                                    {
                                                        e.cancel = true;
                                                        e.component.cancelEditData()  
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgCostPriceValid',showTitle:true,title:this.t("msgCostPriceValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCostPriceValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCostPriceValid.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);  
                                                    }
                                                    //********************************** */
                                                }
                                            }}
                                            >
                                                <Paging defaultPageSize={6} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption={this.t("grdPrice.clmType")} allowEditing={false}/>
                                                <Column dataField="DEPOT_NAME" caption={this.t("grdPrice.clmDepot")} allowEditing={false}/>
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdPrice.clmCustomerName")} visible={false} allowEditing={false}/>
                                                <Column dataField="START_DATE" caption={this.t("grdPrice.clmStartDate")} dataType="date" 
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="FINISH_DATE" caption={this.t("grdPrice.clmFinishDate")} dataType="date"
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="QUANTITY" caption={this.t("grdPrice.clmQuantity")}/>
                                                <Column dataField="VAT_EXT" caption={this.t("grdPrice.clmVatExt")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>                                                
                                                <Column dataField="PRICE" caption={this.t("grdPrice.clmPrice")} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="GROSS_MARGIN" caption={this.t("grdPrice.clmGrossMargin")} dataType="string" allowEditing={false}/>
                                                <Column dataField="NET_MARGIN" caption={this.t("grdPrice.clmNetMargin")} dataType="string" format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleUnit")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtUnderUnitFiyat" parent={this} title={this.t("underUnitPrice")} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-10'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {                                                        
                                                        this.cmbPopUnitType.value = "2"
                                                        this.cmbPopUnitName.value = "001"
                                                        this.txtPopUnitFactor.value = "0"
                                                        this.txtPopUnitWeight.value = "0"
                                                        this.txtPopUnitVolume.value = "0";
                                                        this.txtPopUnitWidth.value = "0";
                                                        this.txtPopUnitHeight.value = "0"
                                                        this.txtPopUnitSize.value = "0"

                                                        this.popUnit.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdUnit"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption={this.t("grdUnit.clmType")} width={250} allowEditing={false}/>
                                                <Column dataField="NAME" caption={this.t("grdUnit.clmName")} allowEditing={false}/>
                                                <Column dataField="FACTOR" caption={this.t("grdUnit.clmFactor")}/>
                                                <Column dataField="WEIGHT" caption={this.t("grdUnit.clmWeight")}/>
                                                <Column dataField="VOLUME" caption={this.t("grdUnit.clmVolume")}/>
                                                <Column dataField="WIDTH" caption={this.t("grdUnit.clmWidth")}/>
                                                <Column dataField="HEIGHT" caption={this.t("grdUnit.clmHeight")}/>
                                                <Column dataField="SIZE" caption={this.t("grdUnit.clmSize")}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleBarcode")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={async ()=>
                                                    {
                                                        await this.cmbPopBarUnit.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:{'in':[0,2]}})})
                                                        this.txtPopBarcode.value = "";
                                                        this.cmbPopBarType.value = "0";
                                                        this.cmbPopBarUnit.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''
                                                        this.popBarcode.show();
                                                        setTimeout(async () => 
                                                        {
                                                           this.txtPopBarcode.focus()
                                                        }, 600);
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBarcode"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="BARCODE" caption={this.t("grdBarcode.clmBarcode")} allowEditing={false}/>
                                                <Column dataField="UNIT_NAME" caption={this.t("grdBarcode.clmUnit")} allowEditing={false}/>
                                                <Column dataField="TYPE_NAME" caption={this.t("grdBarcode.clmType")}allowEditing={false}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>                                
                                <Item title={this.t("tabTitleCustomer")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinAlisFiyat" parent={this} title={this.t("minBuyPrice")} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxAlisFiyat" parent={this} title={this.t("maxBuyPrice")} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-8'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {
                                                        
                                                        this.txtPopCustomerItemCode.value = "";
                                                        this.txtPopCustomerPrice.value = 0;
                                                        this.popCustomer.show();
                                                        setTimeout(async () => 
                                                        {
                                                           this.txtPopCustomerCode.focus()
                                                        }, 600);
                                                    }}/>                                                                                                            
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomer"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            selection={{mode:"single"}} 
                                            onRowUpdating={async(e)=>
                                            {
                                                this.btnSave.setState({disabled:false});
                                                if(typeof e.newData.CUSTOMER_PRICE != 'undefined')
                                                {
                                                    let tmpSalePriceData = this.itemsObj.itemPrice.dt().where({START_DATE:new Date('1970-01-01').toISOString()}).where({FINISH_DATE:new Date('1970-01-01').toISOString()}).where({TYPE:0}).where({QUANTITY:1})
                                                    //TEDARİKÇİ FİYATI SATIŞ FİYATINDAN YÜKSEK OLAMAZ KONTROLÜ
                                                    if(this.prmObj.filter({ID:'SalePriceToCustomerPriceCtrl'}).getValue() && tmpSalePriceData.length > 0 && e.newData.CUSTOMER_PRICE >= tmpSalePriceData[0].PRICE)
                                                    {
                                                        e.cancel = true;
                                                        e.component.cancelEditData()  
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgSalePriceToCustomerPrice',showTitle:true,title:this.t("msgSalePriceToCustomerPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgSalePriceToCustomerPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSalePriceToCustomerPrice.msg")}</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);  
                                                    }
                                                    else
                                                    {
                                                        this.txtCostPrice.value = e.newData.CUSTOMER_PRICE
                                                        // Min ve Max Fiyat 
                                                        let tmpMinData = this.prmObj.filter({ID:'ItemMinPricePercent'}).getValue()
                                                        let tmpMinPrice = e.newData.CUSTOMER_PRICE + (e.newData.CUSTOMER_PRICE * tmpMinData) /100
                                                        this.txtMinSalePrice.value = Number((tmpMinPrice).toFixed(2))
                                                        let tmpMaxData = this.prmObj.filter({ID:'ItemMaxPricePercent'}).getValue()
                                                        let tmpMAxPrice = e.newData.CUSTOMER_PRICE + (e.newData.CUSTOMER_PRICE * tmpMaxData) /100
                                                        this.txtMaxSalePrice.value = Number((tmpMAxPrice).toFixed(2))
                                                        this.taxSugarValidCheck()
                                                    }
                                                }
                                            }}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdCustomer.clmCode")} allowEditing={false}/>
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdCustomer.clmName")} allowEditing={false}/>
                                                <Column dataField="LUSER_NAME" caption={this.t("grdCustomer.clmPriceUserName")} allowEditing={false}/>
                                                <Column dataField="CUSTOMER_PRICE_DATE" caption={this.t("grdCustomer.clmPriceDate")} editCellRender={this._cellRoleRender}/>
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdCustomer.clmPrice")} dataType="number" format={'€#,##0.000'}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdCustomer.clmMulticode")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOtherShop"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="NAME" caption={this.t("grdOtherShop.clmName")}  width={247}/>
                                                <Column dataField="CUSTOMER" caption={this.t("grdOtherShop.clmCustomer")} width={247} />
                                                <Column dataField="SHOP" caption={this.t("grdOtherShop.clmShop")}  width={247}/>
                                                <Column dataField="DATE" caption={this.t("grdOtherShop.clmDate")}  width={247}/>
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdOtherShop.clmCustomerPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}} width={247}/>
                                                <Column dataField="SALE_PRICE" caption={this.t("grdOtherShop.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}  width={247}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdOtherShop.clmMulticode")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleCustomerPrice")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomerPrice"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false}  />
                                                <Column dataField="CUSER_NAME" caption={this.t("grdCustomerPrice.clmUser")} />
                                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdCustomerPrice.clmCode")} />
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdCustomerPrice.clmName")} />
                                                <Column dataField="CHANGE_DATE" caption={this.t("grdCustomerPrice.clmDate")} allowEditing={false} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                                <Column dataField="PRICE" caption={this.t("grdCustomerPrice.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdCustomerPrice.clmMulticode")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleSalesPriceHistory")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdSalesPrice"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} />
                                                <Column dataField="CUSER_NAME" caption={this.t("grdSalesPrice.clmUser")} />
                                                <Column dataField="CHANGE_DATE" caption={this.t("grdSalesPrice.clmDate")} allowEditing={false} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                                <Column dataField="PRICE" caption={this.t("grdSalesPrice.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleSalesContract")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdSalesContract"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="CUSER_NAME" caption={this.t("grdSalesContract.clmUser")} />
                                                <Column dataField="CUSTOMER_CODE" caption={this.t("grdSalesContract.clmCode")} />
                                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdSalesContract.clmName")} />
                                                <Column dataField="PRICE" caption={this.t("grdSalesContract.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabExtraCost")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdExtraCost"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="CUSTOMER" caption={this.t("grdExtraCost.clmCustomer")} />
                                                <Column dataField="TYPE_NAME" caption={this.t("grdExtraCost.clmTypeName")} />
                                                <Column dataField="DESCRIPTION" caption={this.t("grdExtraCost.clmDescription")} />
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdExtraCost.clmCustomerPrice")} format={"#,##0.000 €"}/>
                                                <Column dataField="PRICE" caption={this.t("grdExtraCost.clmPrice")} format={"#,##0.000 €"}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item> 
                                <Item title={this.t("tabTitleInfo")}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdItemInfo"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="CDATE" caption={this.t("grdItemInfo.cDate")} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ssZ"}/>
                                                <Column dataField="CUSER_NAME" caption={this.t("grdItemInfo.cUser")} />
                                                <Column dataField="LDATE" caption={this.t("grdItemInfo.lDate")} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ssZ"}/>
                                                <Column dataField="LUSER_NAME" caption={this.t("grdItemInfo.lUser")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleOtherShop")}>
                                <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtTabCostPrice" parent={this} title={this.t("txtCostPrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}} readOnly={true}
                                            format={"#,##0.000"} step={0.1}>
                                            </NdNumberBox>
                                        </div>                                        
                                        <div className='col-2'>
                                            <NdNumberBox id="txtSalePrice" parent={this} title={this.t("txtSalePrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            format={"#,##0.000"} readOnly={true}>
                                            </NdNumberBox>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdOtherShop"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} />
                                                <Column dataField="DATE" caption={this.t("grdOtherShop.clmDate")} />
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdOtherShop.clmCustomerPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="SALE_PRICE" caption={this.t("grdOtherShop.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdOtherShop.clmMulticode")} />
                                                <Column dataField="CUSTOMER" caption={this.t("grdOtherShop.clmCustomer")} />
                                                <Column dataField="NAME" caption={this.t("grdOtherShop.clmName")}  width={250}/>
                                                <Column dataField="CODE" caption={this.t("grdOtherShop.clmCode")} />
                                                <Column dataField="BARCODE" caption={this.t("grdOtherShop.clmBarcode")} />
                                                <Column dataField="SHOP" caption={this.t("grdOtherShop.clmShop")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                            </TabPanel>
                        </div>
                    </div>                   
                    {/* FİYAT POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popPrice"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popPrice.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                                <Item>
                                    <Label text={this.t("popPrice.dtPopPriStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopPriStartDate"}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popPrice.dtPopPriEndDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopPriEndDate"}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popPrice.txtPopPriQuantity")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriQuantity"} parent={this} simple={true}>
                                        <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                            <RequiredRule message={this.t("validQuantity")}  
                                             />
                                        </Validator>
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popPrice.txtPopPriPrice")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriPrice"} parent={this} simple={true}>
                                        <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                            <RequiredRule message={this.t("validPrice")}
                                             />
                                            <RangeRule min={0.001} message={this.t("validPriceFloat")}
                                             />
                                        </Validator> 
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPrice" + this.tabIndex}
                                            onClick={async (e)=>
                                            {
                                                if(e.validationGroup.validate().status == "valid")
                                                {     
                                                    // BENZER FİYAT KAYIT KONTROLÜ                                               
                                                    let tmpCheckData = this.itemsObj.itemPrice.dt('ITEM_PRICE').where({START_DATE:new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()})
                                                    tmpCheckData = tmpCheckData.where({FINISH_DATE:new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()})
                                                    tmpCheckData = tmpCheckData.where({TYPE:0})
                                                    tmpCheckData = tmpCheckData.where({QUANTITY:this.txtPopPriQuantity.value})
                                                    
                                                    if(tmpCheckData.length > 0)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgCheckPrice',showTitle:true,title:this.t("msgCheckPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCheckPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCheckPrice.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    //*********************************** */
                                                    //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                                    if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.txtCostPrice.value != 0 && this.txtCostPrice.value >= this.txtPopPriPrice.value)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgCostPriceValid',showTitle:true,title:this.t("msgCostPriceValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgCostPriceValid.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCostPriceValid.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return;
                                                    }
                                                    //********************************** */
                                                    let tmpEmpty = {...this.itemsObj.itemPrice.empty};
                                                
                                                    tmpEmpty.TYPE = 0
                                                    tmpEmpty.TYPE_NAME = 'Standart'
                                                    tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                    tmpEmpty.DEPOT = '00000000-0000-0000-0000-000000000000'
                                                    tmpEmpty.START_DATE = new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpEmpty.FINISH_DATE = new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpEmpty.PRICE = this.txtPopPriPrice.value
                                                    tmpEmpty.QUANTITY = this.txtPopPriQuantity.value

                                                    this.itemsObj.itemPrice.addEmpty(tmpEmpty); 
                                                    this.popPrice.hide();
                                                }                              
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPriceAdd',showTitle:true,title:this.t("msgPriceAdd.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPriceAdd.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPriceAdd.msg")}</div>)
                                                    }
                                                    
                                                    await dialog(tmpConfObj);
                                                }                                                 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popPrice.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BİRİM POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popUnit"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popUnit.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'510'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popUnit.cmbPopUnitType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopUnitType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="2"
                                    data={{source:[{ID:"2",VALUE:"Üst Birim"}]}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.cmbPopUnitName")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopUnitName"
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value="001"
                                    data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitFactor")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitFactor"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitWeight")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitWeight"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitVolume")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitVolume"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitWidth")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitWidth"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitHeight")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitHeight"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popUnit.txtPopUnitSize")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitSize"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemUnit.empty};
                                                
                                                tmpEmpty.TYPE = this.cmbPopUnitType.value
                                                tmpEmpty.TYPE_NAME = this.cmbPopUnitType.displayValue
                                                tmpEmpty.ID = this.cmbPopUnitName.value
                                                tmpEmpty.NAME = this.cmbPopUnitName.displayValue
                                                tmpEmpty.FACTOR = this.txtPopUnitFactor.value
                                                tmpEmpty.WEIGHT = this.txtPopUnitWeight.value
                                                tmpEmpty.VOLUME = this.txtPopUnitVolume.value
                                                tmpEmpty.WIDTH = this.txtPopUnitWidth.value
                                                tmpEmpty.HEIGHT = this.txtPopUnitHeight.value
                                                tmpEmpty.SIZE = this.txtPopUnitSize.value
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                this.itemsObj.itemUnit.addEmpty(tmpEmpty); 
                                                this.popUnit.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popUnit.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BARKOD POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBarcode"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBarcode.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'275'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popBarcode.txtPopBarcode")} alignment="right" />
                                    <NdTextBox id={"txtPopBarcode"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async()=>
                                    {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};
                                                let tmpEmptyStat = true
                                                
                                                if(typeof this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '') != 'undefined')
                                                {
                                                    tmpEmptyStat = false;
                                                    tmpEmpty = this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '')
                                                }
                                                
                                                tmpEmpty.BARCODE = this.txtPopBarcode.value
                                                tmpEmpty.TYPE = this.cmbPopBarType.value
                                                tmpEmpty.UNIT_GUID = this.cmbPopBarUnit.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarUnit.displayValue
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                let tmpResult = await this.checkBarcode(this.txtPopBarcode.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popBarcode.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    if(tmpEmptyStat)
                                                    {
                                                        this.itemsObj.itemBarcode.addEmpty(tmpEmpty);    
                                                    }
                                                    this.popBarcode.hide(); 
                                                }
                                    })}
                                    onValueChanged={(e)=>
                                    {
                                        if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                        {
                                            this.cmbPopBarType.value = "2"
                                            return;
                                        }
                                        if(e.value.length == 8)
                                        {                                            
                                            this.cmbPopBarType.value = "0"
                                        }
                                        else if(e.value.length == 13)
                                        {
                                            this.cmbPopBarType.value = "1"
                                        }
                                        else
                                        {
                                            this.cmbPopBarType.value = "2"
                                        }
                                    }}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popBarcode.cmbPopBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarUnit" displayExpr="NAME" valueExpr="GUID"/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popBarcode.cmbPopBarType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};
                                                let tmpEmptyStat = true
                                                
                                                if(typeof this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '') != 'undefined')
                                                {
                                                    tmpEmptyStat = false;
                                                    tmpEmpty = this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '')
                                                }
                                                
                                                tmpEmpty.BARCODE = this.txtPopBarcode.value
                                                tmpEmpty.TYPE = this.cmbPopBarType.value
                                                tmpEmpty.UNIT_GUID = this.cmbPopBarUnit.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarUnit.displayValue
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                let tmpResult = await this.checkBarcode(this.txtPopBarcode.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popBarcode.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    if(tmpEmptyStat)
                                                    {
                                                        this.itemsObj.itemBarcode.addEmpty(tmpEmpty);    
                                                    }
                                                    this.popBarcode.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBarcode.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* TEDARİKÇİ POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popCustomer"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCustomer.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'} id={"frmItemCustomer" + + this.tabIndex}>
                                <Item>
                                    <Label text={this.t("popCustomer.txtPopCustomerCode")} alignment="right" />
                                    <NdTextBox id={"txtPopCustomerCode"} parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                      onEnterKey={(async(e)=>
                                        {
                                            await this.pg_txtPopCustomerCode.setVal(this.txtPopCustomerCode.value)
                                            this.pg_txtPopCustomerCode.show()
                                            this.pg_txtPopCustomerCode.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.txtPopCustomerCode.GUID = data[0].GUID
                                                    this.txtPopCustomerCode.value = data[0].CODE;
                                                    this.txtPopCustomerName.value = data[0].TITLE;
                                                }
                                            }
                                        }).bind(this)}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {                                                
                                                    this.pg_txtPopCustomerCode.show()
                                                    this.pg_txtPopCustomerCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopCustomerCode.GUID = data[0].GUID
                                                            this.txtPopCustomerCode.value = data[0].CODE;
                                                            this.txtPopCustomerName.value = data[0].TITLE;
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'add',
                                                onClick:()=>
                                                {                                                
                                                   
                                                }
                                            }
                                        ]
                                    }>                                        
                                    </NdTextBox>
                                    <NdPopGrid id={"pg_txtPopCustomerCode"} parent={this} container={".dx-multiview-wrapper"} 
                                    position={{of:'#page'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtPopCustomerCode.title")} 
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2) AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >           
                                    <Scrolling mode="standart" />                         
                                    <Column dataField="TITLE" caption={this.t("pg_txtPopCustomerCode.clmName")} width={650} defaultSortOrder="asc" />
                                    <Column dataField="CODE" caption={this.t("pg_txtPopCustomerCode.clmCode")} width={150} />
                                    </NdPopGrid>
                                </Item>
                                <Item>
                                    <Label text={this.t("popCustomer.txtPopCustomerName")} alignment="right" />
                                    <NdTextBox id={"txtPopCustomerName"} parent={this} simple={true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} >
                                    <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")}
                                             />
                                    </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popCustomer.txtPopCustomerItemCode")} alignment="right" />
                                    <NdTextBox id={"txtPopCustomerItemCode"} parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} >
                                    <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")}
                                             />
                                    </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popCustomer.txtPopCustomerPrice")} alignment="right" />
                                    <NdNumberBox id={"txtPopCustomerPrice"} parent={this} simple={true} >
                                    <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validPrice")}   
                                             />
                                            <RangeRule min={0.001} message={this.t("validPriceFloat")}   
                                             />
                                        </Validator> 
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmItemCustomer" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpEmptyMulti = {...this.itemsObj.itemMultiCode.empty};
                                                    
                                                    tmpEmptyMulti.CUSER = this.core.auth.data.CODE,  
                                                    tmpEmptyMulti.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                    tmpEmptyMulti.CUSTOMER_GUID = this.txtPopCustomerCode.GUID                              
                                                    tmpEmptyMulti.CUSTOMER_CODE = this.txtPopCustomerCode.value
                                                    tmpEmptyMulti.CUSTOMER_NAME = this.txtPopCustomerName.value
                                                    tmpEmptyMulti.MULTICODE = this.txtPopCustomerItemCode.value
                                                    tmpEmptyMulti.CUSTOMER_PRICE = this.txtPopCustomerPrice.value
                                                    tmpEmptyMulti.CUSTOMER_PRICE_DATE = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")

                                                    let tmpResult = await this.checkMultiCode(this.txtPopCustomerItemCode.value,this.txtPopCustomerCode.value)
                                                    if(tmpResult == 2) //KAYIT VAR
                                                    {
                                                        this.popCustomer.hide(); 
                                                    }
                                                    else if(tmpResult == 1) //KAYIT YOK
                                                    {
                                                        this.txtCostPrice.value = this.txtPopCustomerPrice.value
                                                        this.itemsObj.itemMultiCode.addEmpty(tmpEmptyMulti);
                                                        this.popCustomer.hide(); 
                                                    }
                                                    // Min ve Max Fiyat 
                                                    let tmpMinData = this.prmObj.filter({ID:'ItemMinPricePercent'}).getValue()
                                                    let tmpMinPrice = this.txtPopCustomerPrice.value + (this.txtPopCustomerPrice.value * tmpMinData) /100
                                                    this.txtMinSalePrice.value = Number((tmpMinPrice).toFixed(2))
                                                    let tmpMaxData = this.prmObj.filter({ID:'ItemMaxPricePercent'}).getValue()
                                                    let tmpMAxPrice = this.txtPopCustomerPrice.value + (this.txtPopCustomerPrice.value * tmpMaxData) /100
                                                    this.txtMaxSalePrice.value = Number((tmpMAxPrice).toFixed(2))
                                                    this.taxSugarValidCheck()
                                                }                              
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPriceAdd',showTitle:true,title:this.t("msgPriceAdd.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgPriceAdd.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPriceAdd.msg")}</div>)
                                                    }
                                                    
                                                    await dialog(tmpConfObj);
                                                }     
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>      
                    {/* İstatistik POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popAnalysis"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAnalysis.title")}
                        container={"#root"} 
                        width={'1200'}
                        height={'700'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={3} height={'fit-content'}>
                                <Item colSpan={2}>
                                <div className="col-12">
                                    <NbDateRange id={"dtDate"} parent={this} startDate={ moment().startOf('month')} endDate={moment(new Date())}/>
                                </div>
                                </Item>
                                <Item >
                                <NdButton id="btnGet" parent={this} text={this.t("btnGet")} type="default" width='100%'
                                    onClick={async()=>
                                    {
                                        App.instance.setState({isExecute:true})
                                        if(this.chkDayAnalysis.value == true)
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT SUM(QUANTITY) AS QUANTITY,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE FROM POS_SALE_VW_01 " +
                                                        "WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999' " +
                                                        "GROUP BY DOC_DATE,ITEM_CODE ",
                                                param : ['CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                                                value : [this.txtRef.value,this.dtDate.startDate,this.dtDate.endDate]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.setState({dataSource:tmpData.result.recordset})
                                            }
                                            else
                                            {
                                                this.setState({dataRefresh:{0:{QUANTITY:0,DOC_DATE:''}}})
                                            }
                                        }
                                        else if(this.chkMountAnalysis.value == true)
                                        {
                                            let tmpQuery = 
                                            {
                                                query :"SELECT SUM(QUANTITY) AS QUANTITY,MONTH(DOC_DATE) AS DOC_DATE FROM POS_SALE_VW_01 " +
                                                        "WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999' " +
                                                        "GROUP BY MONTH(DOC_DATE),ITEM_CODE ",
                                                param : ['CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                                                value : [this.txtRef.value,this.dtDate.startDate,this.dtDate.endDate]
                                            }
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.setState({dataSource:tmpData.result.recordset})
                                            }
                                            else
                                            {
                                                this.setState({dataRefresh:{0:{QUANTITY:0,DOC_DATE:''}}})
                                            }
                                        }
                                        App.instance.setState({isExecute:false})

                                       
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("chkDayAnalysis")} alignment="right" />
                                    <NdCheckBox id="chkDayAnalysis" parent={this} defaultValue={true} value={true}
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value == true)
                                        {
                                            this.chkMountAnalysis.value = false
                                        }
                                    }}/>
                                </Item>  
                                <Item>
                                    <Label text={this.t("chkMountAnalysis")} alignment="right" />
                                    <NdCheckBox id="chkMountAnalysis" parent={this} defaultValue={false} 
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value == true)
                                        {
                                            this.chkDayAnalysis.value = false
                                        }
                                    }}/>
                                </Item>
                                <EmptyItem/>
                                <Item colSpan={3}>
                                    <Chart id="chart" dataSource={this.state.dataSource}>
                                    <CommonSeriesSettings
                                        argumentField="state"
                                        type="bar"
                                        hoverMode="allArgumentPoints"
                                        selectionMode="allArgumentPoints"
                                        >
                                        <Label visible={true}>
                                            <Format type="fixedPoint" precision={0} />
                                        </Label>
                                        </CommonSeriesSettings>
                                        <Series
                                        valueField="QUANTITY"
                                        argumentField="DOC_DATE"
                                        name="Şatış"
                                        type="bar"
                                        color="#008000" />
                                    </Chart>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>                                
                </ScrollView>
            </React.Fragment>
        )
    }
}