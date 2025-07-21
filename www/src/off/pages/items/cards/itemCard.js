import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls,itemLogPriceCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';
import {  Chart, Series, CommonSeriesSettings,  Format, Legend, Export, Label } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Button as GrdButton,StateStoring,ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdTextArea from '../../../../core/react/devex/textarea.js';
import NdTabPanel from '../../../../core/react/devex/tabpanel';
import NdAccessEdit from '../../../../core/react/devex/accesEdit.js';
import { NdLayout,NdLayoutItem } from '../../../../core/react/devex/layout';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
import { datatable } from '../../../../core/core.js';

export default class itemCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)                
        this.state = 
        {
            underPrice : "",
            isItemGrpForOrginsValid : false,
            isItemGrpForMinMaxAccess : false,
            isTaxSugar : false,
            isPromotion : false,
            // SuperSonic Analytics States
            chartMode: 'quantity',
            quantityChartData: null,
            priceChartData: null,
            stockChartData: null,
            linearRegressionData: null,
            monteCarloPredictionData: null,
            stockPredictionData: null,
            totalSalesStats: null,
            azurePricePrediction: null,
            reorderRecommendation: null,
            dataSource: null,

        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.itemsObj = new itemsCls();
        this.itemsPriceLogObj = new itemLogPriceCls();  
        this.salesPriceLogObj = new datatable()

        this.salesPriceLogObj.selectCmd =
        {
            query : `SELECT CUSER_NAME,FISRT_PRICE,CONVERT(NVARCHAR, CDATE ,104) + '-' + CONVERT(NVARCHAR, CDATE ,108) AS DATE FROM [PRICE_HISTORY_VW_01] 
                    WHERE ITEM = @ITEM_GUID AND TYPE = 0 AND FISRT_PRICE <> 0 ORDER BY CDATE DESC `,
            param : ['ITEM_GUID:string|50']
        }
        this.salesContractObj = new datatable()
        this.salesContractObj.selectCmd =
        {
            query : `SELECT CUSER_NAME,CUSTOMER_CODE,CUSTOMER_NAME,PRICE FROM [CONTRACT_Vw_01] WHERE ITEM = @ITEM_GUID AND TYPE = 1 AND START_DATE <= dbo.GETDATE() AND FINISH_DATE >= dbo.GETDATE() ORDER BY LDATE DESC `,
            param : ['ITEM_GUID:string|50']
        }
        this.otherShopObj = new datatable()
        this.otherShopObj.selectCmd =
        {
            query : `SELECT 
                    (CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 104) + ' ' + CONVERT(NVARCHAR, OTHER_SHOP.UPDATE_DATE, 24)) AS DATE, 
                    OTHER_SHOP.CODE, 
                    OTHER_SHOP.NAME, 
                    MAX(OTHER_SHOP.BARCODE) AS BARCODE, 
                    OTHER_SHOP.MULTICODE, 
                    OTHER_SHOP.SALE_PRICE, 
                    OTHER_SHOP.CUSTOMER, 
                    OTHER_SHOP.CUSTOMER_PRICE, 
                    OTHER_SHOP.SHOP 
                    FROM ITEM_BARCODE_VW_01 AS BARCODE 
                    INNER JOIN OTHER_SHOP_ITEMS AS OTHER_SHOP 
                    ON BARCODE.BARCODE = OTHER_SHOP.BARCODE 
                    WHERE BARCODE.ITEM_GUID = @ITEM_GUID 
                    GROUP BY OTHER_SHOP.CODE,OTHER_SHOP.NAME, OTHER_SHOP.MULTICODE, OTHER_SHOP.SALE_PRICE, OTHER_SHOP.CUSTOMER_PRICE, OTHER_SHOP.CUSTOMER,OTHER_SHOP.SHOP,OTHER_SHOP.UPDATE_DATE `,
            param : ['ITEM_GUID:string|50']
        }
        
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.onItemRendered = this.onItemRendered.bind(this)
        this.taxSugarCalculate = this.taxSugarCalculate.bind(this)
        this.cellRoleRender = this.cellRoleRender.bind(this)
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)


        this.extraCostData = new datatable
    }    
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        if(typeof this.pagePrm != 'undefined')
        {
            await this.init(); 
            //ELECTRONJS DE BURASI PROBLEM OLUYOR. STOK LISTESINDEN ÜRÜNE ÇİFT TIKLAYIP STOK KARTINI AÇMAYA ÇALIŞTIĞINDA ÜRÜN AD BOŞ GELİYOR. ONUN İÇİN SETTIMEOUT EKLEDİK.(AQ)
            setTimeout(() => 
            {
                this.getItem(this.pagePrm.CODE)    
            }, 1000);
        }
        else
        {
            this.init(); 
        }
    }    
    async init()
    {  
        this.prevCode = ""
        this.itemsObj.clearAll();

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
            if(pTblName == 'ITEM_MULTICODE')
            {
                this.taxSugarValidCheck()
            }
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

        this.itemsObj.dt()[0].GENRE = this.prmObj.filter({ID:'txtGenre'}).getValue().value
        this.itemGrpForOrginsValidCheck();   
        this.itemGrpForMinMaxAccessCheck();  
        this.taxSugarValidCheck()
        
        this.setState({isPromotion:false})     
        this.txtCostPrice.readOnly = this.sysParam.filter({ID:'costPriceReadOnly',USERS:this.user.CODE}).getValue()
        this.chkTaxSugarControl.value = this.param.filter({ELEMENT:'chkTaxSugarControl',USERS:this.user.CODE}).getValue().value
        this.setState({isTaxSugar:this.chkTaxSugarControl.value})
    }
    async getItem(pCode)
    {
        App.instance.setState({isExecute:true})
        this.itemsObj.clearAll();
        this.txtRef.value = Math.floor(Date.now() / 1000)
        this.txtCustomer.value = "";
        this.txtCustomer.displayValue = "";   
        this.txtBarcode.readOnly = true;   
        this.imgFile.value = ""; 
        await this.itemsObj.load({CODE:pCode});
        //TEDARİKÇİ FİYAT GETİR İŞLEMİ.  
        this.itemsPriceLogObj.load({ITEM_GUID:this.itemsObj.dt()[0].GUID})
        if(typeof this.itemsObj.itemBarcode.dt()[0] == 'undefined')
        {
            this.txtBarcode.value = "";
        }
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
        this.salesPriceLogObj.refresh().then(()=>
        {
            if(this.salesPriceLogObj.length > 0)
            {
                this.txtLastSalePrice.value = this.salesPriceLogObj[0].FISRT_PRICE
            }
        })
        this.salesContractObj.selectCmd.value = [this.itemsObj.dt()[0].GUID]
        this.salesContractObj.refresh();
        this.otherShopObj.selectCmd.value = [this.itemsObj.dt()[0].GUID]
        this.otherShopObj.refresh();
        //ÜRÜN PROMOSYON DURUMU GETİRME İŞLEMİ
        let tmpPromoQuery = 
        {
            query : `SELECT TOP 1 GUID FROM PROMO_COND_APP_VW_01 
                    WHERE START_DATE <= dbo.GETDATE() AND FINISH_DATE >= dbo.GETDATE() AND COND_TYPE = 0 AND COND_ITEM_GUID = @COND_ITEM_GUID`,
            param : ['COND_ITEM_GUID:string|50'],
            value : [this.itemsObj.dt()[0].GUID]
        }
        let tmpPromoData = await this.core.sql.execute(tmpPromoQuery)
        
        if(tmpPromoData.result.recordset.length > 0)
        {
            this.setState({isPromotion:true})
        }
        else
        {
            this.setState({isPromotion:false})
        }
        //*************************************** */
        App.instance.setState({isExecute:false})
        if(typeof this.txtSalePrice != 'undefined')
        {
            let tmpQuery = 
            {
                query : `SELECT [dbo].[FN_PRICE](@GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1) AS PRICE`,
                param : ['GUID:string|50'],
                value : [this.itemsObj.dt()[0].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.txtSalePrice.value = tmpData.result.recordset[0].PRICE
                this.txtSalePrice.setState({value:tmpData.result.recordset[0].PRICE})
            }
            else
            {
                this.txtSalePrice.value = 0
                this.txtSalePrice.setState({value:0})
            }
        }
        this.prevCode = this.itemsObj.dt('ITEMS').length > 0 ? this.itemsObj.dt('ITEMS')[0].CODE : '';

        if(typeof this.itemsObj.dt('ITEM_IMAGE')[0] != 'undefined')
        {
            this.imgFile.value = this.itemsObj.dt('ITEM_IMAGE')[0].IMAGE
        }
        this.itemGrpForOrginsValidCheck();   
        this.extraCostCalculate()
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
                        height:'auto',
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
                        height:'auto',
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
                        height:'auto',
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
                        this.toast.show({message:this.t("msgCheckCustomerCode.msg"),type:'warning'})
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
    async onItemRendered(e)
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
            await this.grdItemInfo.dataRefresh({source:this.itemsObj.dt()});
        }
        else if(e.itemData.title == this.t("tabTitleOtherShop"))
        {
            let tmpQuery = 
            {
                query : `SELECT [dbo].[FN_PRICE](@GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1) AS PRICE`,
                param : ['GUID:string|50'],
                value : [this.itemsObj.dt()[0].GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                this.txtSalePrice.value = tmpData.result.recordset[0].PRICE
                this.txtSalePrice.setState({value:tmpData.result.recordset[0].PRICE})
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
        else if(e.itemData.title == this.t("tabTitleDetail"))
        {
            await this.grdSubGrp.dataRefresh({source:this.itemsObj.itemSubGrp.dt()});
            await this.grdProperty.dataRefresh({source:this.itemsObj.itemProperty.dt()})
        }
    }
    underPrice()
    {
        if(typeof this.itemsObj.itemUnit.dt().find(x => x.TYPE == 0) != 'undefined')
        {
            let tmpPrice = typeof this.itemsObj.itemPrice.dt().find(x => x.TYPE == 0 && x.QUANTITY == 1) != 'undefined' ? this.itemsObj.itemPrice.dt().find(x => x.TYPE == 0 && x.QUANTITY == 1).PRICE : 0;
            let tmpFactor = typeof this.itemsObj.itemUnit.dt().find(x => x.TYPE == 1) != 'undefined' ? this.itemsObj.itemUnit.dt().find(x => x.TYPE == 1).FACTOR : 0;
            let tmpExVat = Number(tmpPrice).rateInNum(this.itemsObj.dt("ITEMS")[0].VAT,2)

            if(tmpPrice > 0 && tmpFactor > 0)
            {
                this.setState({underPrice: (tmpExVat / tmpFactor).toFixed(2) + Number.money.sign + " HT / " + (tmpPrice / tmpFactor).toFixed(2) + Number.money.sign + " TTC"});
            }
            else
            {
                this.setState({underPrice: "0 " + Number.money.sign + " HT / 0 " + Number.money.sign + " TTC" });
            }
        }
    }
    async grossMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE_HT
            let tmpMargin = tmpExVat - this.txtCostPrice.value;
            let tmpMarginRate = ((tmpMargin / this.txtCostPrice.value)) * 100
            
            if(this.itemsObj.itemPrice.dt()[i].LIST_VAT_TYPE == 0)
            {
                this.itemsObj.itemPrice.dt()[i].VAT_EXT = tmpExVat
            }
            else
            {
                this.itemsObj.itemPrice.dt()[i].VAT_EXT = this.itemsObj.itemPrice.dt()[i].PRICE
            }

            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN = tmpMargin.toFixed(2) + Number.money.sign + " / %" +  tmpMarginRate.toFixed(2);                 
            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2);     
            this.itemsObj.itemPrice.dt()[i].MARGIN =  tmpMarginRate.toFixed(2); 

        }
        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
    }
    async netMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE_HT
            let tmpMargin = (tmpExVat - this.txtCostPrice.value) / 1.15;
            let tmpMarginRate = (((tmpMargin / this.txtCostPrice.value) )) * 100
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN = tmpMargin.toFixed(2)  + Number.money.sign +  " / %" +  tmpMarginRate.toFixed(2); 
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN_RATE = tmpMarginRate.toFixed(2);    
        }
        await this.grdPrice.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
    }   
    itemGrpForOrginsValidCheck()
    {
        let tmpData = this.prmObj.filter({ID:'ItemGrpForOrginsValidation'}).getValue()
        if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.cmbItemGrp.value) != 'undefined')
        {
            this.setState({isItemGrpForOrginsValid:true})
        }
        else
        {
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
        if (!this.chkTaxSugarControl.value) 
        {
            this.setState({isTaxSugar: false});
            this.txtTaxSugar.readOnly = true;
            return;
        }
        else
        {
            this.setState({isTaxSugar: true});
            this.txtTaxSugar.readOnly = false;
        }
        if((typeof this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0] != 'undefined'))
        {
            for (let i = 0; i < this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE').length; i++) 
            {
                let tmpQuery = 
                {
                    query : `SELECT TAX_SUCRE FROM CUSTOMERS WHERE CODE = @CODE `,
                    param : ['CODE:string|50'],
                    value : [this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_CODE]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    if(tmpData.result.recordset[0].TAX_SUCRE == 1)
                    {
                        this.setState({isTaxSugar:true})
                        this.taxSugarCalculate()
                        return
                    }
                }
            }
        }
    }
    async taxSugarCalculate()
    {
        if(typeof this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0] != 'undefined' && this.state.isTaxSugar)
        {
            let tmpCheckQuery = 
            {
                query : `SELECT TAX_SUCRE FROM CUSTOMERS WHERE CODE = @CODE `,
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
                        query : `SELECT RATE,PRICE FROM TAX_SUGAR_TABLE_VW_01 
                                WHERE MIN_VALUE <= @VALUE AND MAX_VALUE >= @VALUE AND TYPE = 0 ORDER BY END_DATE DESC `,
                        param : ['VALUE:float'],
                        value : [this.txtTaxSugar.value]
                    }
                    let tmpData = await this.core.sql.execute(tmpQuery) 
                    if(tmpData.result.recordset.length > 0)
                    {
                        let tmpUnit = this.txtUnderUnit.value / 100
                        let tmpTaxSucre = tmpUnit * tmpData.result.recordset[0].PRICE
                        this.taxSugarPrice = Number(tmpTaxSucre.toFixed(3))
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
        if(this.sysParam.filter({ID:'costForInvoıces',USERS:this.user.CODE}).getValue() && typeof this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0] != 'undefined')
        {
            let tmpQuery = 
            {
                query : `SELECT TOP 1 DOC_GUID FROM DOC_ITEMS_VW_01 
                        WHERE ITEM = @ITEM AND REBATE = 0 AND OUTPUT = @OUTPUT ORDER BY DOC_DATE DESC`,
                param : ['ITEM:string|50', 'OUTPUT:string|50'],
                value : [this.itemsObj.dt()[0].GUID,this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')[0].CUSTOMER_GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            
            if(tmpData.result.recordset.length >0)
            {
                let tmpItemQuery = 
                {
                    query : `SELECT ITEM_TYPE,QUANTITY FROM DOC_ITEMS_VW_01 WHERE (DOC_GUID = @DOC_GUID OR INVOICE_DOC_GUID = @DOC_GUID)`,
                    param : ['DOC_GUID:string|50'],
                    value : [tmpData.result.recordset[0].DOC_GUID]
                }
                let tmpItemData = await this.core.sql.execute(tmpItemQuery)
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
                        let tmpTotal = parseFloat(Number(tmpServices[x].AMOUNT / tmpQuantity).toFixed(3))
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
    cellRoleRender(e)
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
                                let tmpQuery = 
                                {
                                    query : `UPDATE ITEM_PRICE SET CHANGE_DATE = dbo.GETDATE() WHERE GUID = @PRICE_GUID`,
                                    param : ['PRICE_GUID:string|50'],
                                    value : [e.data.CUSTOMER_PRICE_GUID]
                                }
                                await this.core.sql.execute(tmpQuery) 
                                // Min ve Max Fiyat 
                                let tmpMinData = this.prmObj.filter({ID:'ItemMinPricePercent'}).getValue()
                                let tmpMinPrice = e.data.CUSTOMER_PRICE + (e.data.CUSTOMER_PRICE * tmpMinData) /100
                                this.txtMinSalePrice.value = Number((tmpMinPrice).toFixed(2))
                                let tmpMaxData = this.prmObj.filter({ID:'ItemMaxPricePercent'}).getValue()
                                let tmpMAxPrice = e.data.CUSTOMER_PRICE + (e.data.CUSTOMER_PRICE * tmpMaxData) /100
                                this.txtMaxSalePrice.value = Number((tmpMAxPrice).toFixed(2))
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        if(e.column.dataField == "FACTOR")
        {
            return (
                <NdTextBox id={"txtGrdFactor"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                    this.grdUnit.devGrid.cellValue(e.rowIndex,"FACTOR",r.component._changedValue)
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                await this.msgUnit.show().then(async () =>
                                {
                                    this.grdUnit.devGrid.cellValue(e.rowIndex,"FACTOR",this.txtUnitFactor.value)
                                });  
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    stringControle(pString)
    {
        const punctuationKeyCodes = [' ','.',',', ';', ':', '/', '?', '%', ']', '[', '{', '}'];
    
        if (punctuationKeyCodes.includes(pString)) 
        {
           return true
        }
        else
        {
            return false
        }
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdPriceState',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdPriceState',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    render()
    {           
        return (
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>                    
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnEdit" parent={this} icon="edit" type="default"
                                    onClick={async()=>
                                    {
                                        if(!this.accesComp.editMode)
                                        {
                                            this.accesComp.openEdit()
                                        }
                                        else
                                        {
                                            this.accesComp.closeEdit()
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={async()=>
                                    {
                                        if(this.prevCode != '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgItemBack',showTitle:true,title:this.t("msgItemBack.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgItemBack.btn01"),location:'before'},{id:"btn02",caption:this.t("msgItemBack.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemBack.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn02')
                                            {
                                                return;
                                            }    
                                            this.getItem(this.prevCode); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgNewItem',showTitle:true,title:this.t("msgNewItem.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgNewItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNewItem.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgNewItem.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn02')
                                        {
                                            return;
                                        }    
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmItems" + this.tabIndex}
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
                                                    this.toast.show({message:this.t("msgPriceSave.msg"),type:'warning'})
                                                    return;
                                                }
                                            }
                                            //************************************ */
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                if((await this.itemsObj.save()) == 0)
                                                {         
                                                    this.core.util.writeLog("Kaydet başarılı. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME)                                           
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success'})
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
                                                    this.core.util.writeLog("Kaydet başarısız. " + this.itemsObj.dt()[0].CODE + " " + this.itemsObj.dt()[0].NAME) 
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    }
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
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:'warning'})
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query : "SELECT TOP 1 TYPE FROM POS_SALE_VW_01 WHERE ITEM_GUID = @CODE ",
                                            param : ['CODE:string|50'],
                                            value : [this.itemsObj.dt()[0].GUID]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.toast.show({message:this.t("msgNotDelete.msg"),type:'warning'})
                                            return
                                        }
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                    <NdButton id="btnSuperSonic" parent={this} icon="chart" type="info" text="🚀 Analytics"
                                    onClick={async()=>
                                    {
                                        if(this.txtRef.value && this.txtRef.value.trim() !== '')
                                        {
                                            await this.popSuperSonicAnalytics.show();
                                        }
                                        else
                                        {
                                            this.toast.show({message:"Lütfen önce bir ürün seçin!",type:'warning'})
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
                                        this.itemsObj.dt()[0].INTERFEL = tmpItem.INTERFEL
                                        this.itemsObj.dt()[0].TICKET_REST = tmpItem.TICKET_REST
                                        this.itemsObj.dt()[0].SNAME = tmpItem.SNAME
                                        this.itemsObj.dt()[0].TAX_SUGAR = tmpItem.TAX_SUGAR 
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
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto"
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
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
                    <div className="row px-2 pt-2">
                        <div className="col-10 pe-0">                        
                            <NdLayout parent={this} id={"frmItems" + this.tabIndex} rowHeight={42} margin={[2,2]} cols={2}>
                                {/* txtRefLy */}
                                <NdLayoutItem key={"txtRefLy"} id={"txtRefLy"} parent={this} data-grid={{x:0,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtRefLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtRef") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtRef" parent={this} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} simple={true}
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
                                            selectAll={true}/>      
                                            {/* STOK SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtRef"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                            visible={false}
                                            position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                        query : `SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                                        param : ['VAL:string|50']
                                                    },
                                                    sql:this.core.sql
                                                }
                                            }}
                                            >
                                                <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                                <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbItemGrpLy */}
                                <NdLayoutItem key={"cmbItemGrpLy"} id={"cmbItemGrpLy"} parent={this} data-grid={{x:1,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbItemGrpLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbItemGrp") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdSelectBox parent={this} id="cmbItemGrp" tabIndex={this.tabIndex} simple={true}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GUID",display:"MAIN_GRP_NAME"}}
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true} 
                                            showClearButton={true}
                                            pageSize ={50}
                                            notRefresh={true}
                                            param={this.param.filter({ELEMENT:'cmbItemGrp',USERS:this.user.CODE})}
                                            data={{source:{select:{query : `SELECT CODE,NAME,GUID FROM ITEM_GROUP WHERE STATUS = 1 ORDER BY NAME ASC`},sql:this.core.sql}}}
                                            onValueChanged={(e)=>
                                            {
                                                this.itemGrpForOrginsValidCheck()
                                                this.taxSugarValidCheck()
                                                this.itemGrpForMinMaxAccessCheck()
                                            }}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtCustomerLy */}
                                <NdLayoutItem key={"txtCustomerLy"} id={"txtCustomerLy"} parent={this} data-grid={{x:0,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'txtCustomerLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtCustomer") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtCustomer" parent={this} simple={true}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            dt={{data:this.itemsObj.dt('ITEM_MULTICODE'),field:"CUSTOMER_NAME",display:"CUSTOMER_NAME"}}
                                            readOnly={true}
                                            button={[
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:async ()=>
                                                {                                            
                                                    await this.popCustomer.show();
                                                    this.txtPopCustomerCode.value = "";
                                                    this.txtPopCustomerName.value = "";
                                                    this.txtPopCustomerItemCode.value = "";
                                                    this.txtPopCustomerPrice.value = 0;
                                                    setTimeout(async () => 
                                                    {
                                                    this.txtPopCustomerCode.focus()
                                                    }, 600)
                                                }
                                            }]}
                                            param={this.param.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbItemGenusLy */}
                                <NdLayoutItem key={"cmbItemGenusLy"} id={"cmbItemGenusLy"} parent={this} data-grid={{x:1,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbItemGenusLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbItemGenus") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdSelectBox parent={this} id="cmbItemGenus" dt={{data:this.itemsObj.dt('ITEMS'),field:"TYPE"}} simple={true}
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:"0",VALUE:this.t("cmbItemGenusData.item")},{ID:"1",VALUE:this.t("cmbItemGenusData.service")},{ID:"2",VALUE:this.t("cmbItemGenusData.deposit")}]}}
                                            param={this.param.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtBarcodeLy */}
                                <NdLayoutItem key={"txtBarcodeLy"} id={"txtBarcodeLy"} parent={this} data-grid={{x:0,y:2,h:1,w:1}} access={this.access.filter({ELEMENT:'txtBarcodeLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1 '>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtBarcode") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
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
                                                            
                                                            await this.popBarcode.show();
                                                            await this.cmbPopBarUnit.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})})
                                                            this.txtPopBarcode.value = "";
                                                            this.cmbPopBarType.value = "0";
                                                            this.cmbPopBarUnit.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''

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
                                            param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbTaxLy */}
                                <NdLayoutItem key={"cmbTaxLy"} id={"cmbTaxLy"} parent={this} data-grid={{x:1,y:2,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbTaxLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbTax") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdSelectBox parent={this} id="cmbTax" height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"VAT"}} simple={true}
                                            displayExpr="VAT"                       
                                            valueExpr="VAT"
                                            data={{source:{select:{query:`SELECT VAT FROM VAT ORDER BY ID ASC`},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbTax',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbMainUnitLy */}
                                <NdLayoutItem key={"cmbMainUnitLy"} id={"cmbMainUnitLy"} parent={this} data-grid={{x:0,y:3,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbMainUnitLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbMainUnit") + " :"}</label>
                                        </div>
                                        <div className="col-4 p-0">
                                            <NdSelectBox parent={this} id="cmbMainUnit" height='fit-content' simple={true}
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:0}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:`SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC`},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbMainUnit',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className="col-4 p-0">
                                            <NdNumberBox id="txtMainUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            showSpinButtons={true} step={1.0} format={"###.000"}
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:0}}}
                                            param={this.param.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbOriginLy */}
                                <NdLayoutItem key={"cmbOriginLy"} id={"cmbOriginLy"} parent={this} data-grid={{x:1,y:3,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbOriginLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbOrigin") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbOrigin"
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"ORGINS",display:"ORGINS_NAME"}}
                                            displayExpr="NAME"                       
                                            valueExpr="CODE"
                                            value=""
                                            searchEnabled={true} showClearButton={true}
                                            param={this.param.filter({ELEMENT:'cmbOrigin',USERS:this.user.CODE})}
                                            data={{source:{select:{query:`SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC`},sql:this.core.sql}}}
                                            onValueChanged={(e)=>
                                            {
                                                this.btnSave.setState({disabled:false});
                                                this.taxSugarValidCheck()
                                            }}
                                            >
                                                <Validator validationGroup={this.state.isItemGrpForOrginsValid ? "frmItems" + this.tabIndex : ''}>
                                                    <RequiredRule message={this.t("validOrigin")}/>
                                                </Validator>
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* cmbUnderUnitLy */}
                                <NdLayoutItem key={"cmbUnderUnitLy"} id={"cmbUnderUnitLy"} parent={this} data-grid={{x:0,y:4,h:1,w:1}} access={this.access.filter({ELEMENT:'cmbUnderUnitLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbUnderUnit") + " :"}</label>
                                        </div>
                                        <div className="col-3 p-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbUnderUnit" height='fit-content' 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:1}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:`SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC`},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbUnderUnit',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className="col-2 p-0">
                                            <NdNumberBox id="txtUnderUnit" parent={this} simple={true} tabIndex={this.tabIndex} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            showSpinButtons={true} step={0.1} format={"##0.000"}
                                            dt={{id:"txtUnderUnit",data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:1}}}
                                            param={this.param.filter({ELEMENT:'txtUnderUnit',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className="col-3 pe-0">
                                            <div className="dx-field-label" style={{width:"100%"}}>{this.state.underPrice}</div>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtTaxSugarLy */}
                                <NdLayoutItem key={"txtTaxSugarLy"} id={"txtTaxSugarLy"} parent={this} data-grid={{x:1,y:4,h:1,w:1}} access={this.access.filter({ELEMENT:'txtTaxSugarLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtTaxSugar") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdNumberBox id="txtTaxSugar" parent={this} simple={true} readOnly={true}
                                            showSpinButtons={true} step={1.0} format={"###.00"} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"SUGAR_RATE"}} 
                                            param={this.param.filter({ELEMENT:'txtTaxSugar',USERS:this.user.CODE})}
                                            onChange={()=>
                                            {
                                                this.taxSugarCalculate()
                                            }}>
                                                <Validator validationGroup={(this.state.isTaxSugar) ? "frmItems" + this.tabIndex : ''}>
                                                    <RangeRule min={0.9999} message={this.t("validTaxSucre")} />
                                                </Validator>
                                            </NdNumberBox>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtItemNameLy */}
                                <NdLayoutItem key={"txtItemNameLy"} id={"txtItemNameLy"} parent={this} data-grid={{x:0,y:5,h:1,w:1}} access={this.access.filter({ELEMENT:'txtItemNameLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtItemName") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtItemName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}}
                                            param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            onValueChanged={(e)=>
                                            {
                                                if(e.value.length <= 32)
                                                    this.txtShortName.value = e.value.toUpperCase()
                                            }}
                                            button={[
                                            {
                                                id:'001',
                                                icon:'more',
                                                onClick:async()=>
                                                {
                                                    await this.popDescription.show()
                                                    this.txtDescription.value = this.itemsObj.dt()[0].DESCRIPTION
                                                    await this.grdLang.dataRefresh({source:this.itemsObj.itemLang.dt('ITEM_LANG')});
                                                }
                                            }]}>
                                                <Validator validationGroup={"frmItems" + this.tabIndex}>
                                                    <RequiredRule message={this.t("validName")}/>
                                                </Validator> 
                                            </NdTextBox>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtShortName */}
                                <NdLayoutItem key={"txtShortNameLy"} id={"txtShortNameLy"} parent={this} data-grid={{x:1,y:5,h:1,w:1}} access={this.access.filter({ELEMENT:'txtShortNameLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtShortName") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtShortName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"SNAME"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            maxLength={32}
                                            param={this.param.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                            </NdLayout>
                        </div>
                        <div className="col-2">
                            <div style={{display:this.state.isPromotion ? 'block' : 'none',backgroundColor:'red',marginBottom:'5px',color:'white',textAlign:'center',borderRadius:'10px'}}>PROMOTION</div>
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile" parent={this} dt={{data:this.itemsObj.dt('ITEM_IMAGE'),field:"IMAGE"}} imageWidth={"120"} buttonTrigger={"#btnNewImg"}
                                    onValueChanged={async (e)=>
                                    {
                                        if(this.itemsObj.dt('ITEM_IMAGE').length == 0)
                                        {
                                            this.itemsObj.itemImage.addEmpty();                             
                                        }
                                        let tmpResolution = await this.imgFile.getResolution()
                                        this.itemsObj.dt('ITEM_IMAGE')[0].CUSER = this.core.auth.data.CODE,  
                                        this.itemsObj.dt('ITEM_IMAGE')[0].ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                        this.itemsObj.dt('ITEM_IMAGE')[0].IMAGE = e
                                        this.itemsObj.dt('ITEM_IMAGE')[0].SORT = 0
                                        this.itemsObj.dt('ITEM_IMAGE')[0].WIDTH = tmpResolution.width
                                        this.itemsObj.dt('ITEM_IMAGE')[0].HEIGHT = tmpResolution.height
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnNewImg" parent={this} icon="add" type="default" width='100%'/>
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
                            <NdLayout parent={this} id={"frmChkBox" + this.tabIndex} cols={9}>
                                {/* chkActive */}
                                <NdLayoutItem key={"chkActiveLy"} id={"chkActiveLy"} parent={this} data-grid={{x:0,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkActiveLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("chkActive") + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkActive" parent={this} defaultValue={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"STATUS"}}
                                            param={this.param.filter({ELEMENT:'chkActive',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkCaseWeighedLy */}
                                <NdLayoutItem key={"chkCaseWeighedLy"} id={"chkCaseWeighedLy"} parent={this} data-grid={{x:1,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkCaseWeighedLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("chkCaseWeighed") + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkCaseWeighed" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"WEIGHING"}}
                                            param={this.param.filter({ELEMENT:'chkCaseWeighed',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkLineMerged */}
                                <NdLayoutItem key={"chkLineMergedLy"} id={"chkLineMergedLy"} parent={this} data-grid={{x:2,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkLineMergedLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("chkLineMerged") + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkLineMerged" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}
                                            param={this.param.filter({ELEMENT:'chkLineMerged',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkTicketRestLy */}
                                <NdLayoutItem key={"chkTicketRestLy"} id={"chkTicketRestLy"} parent={this} data-grid={{x:3,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkTicketRestLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("chkTicketRest") + " :"}</label>
                                        </div>
                                        <div className="col-1 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkTicketRest" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"TICKET_REST"}}
                                            param={this.param.filter({ELEMENT:'chkTicketRest',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkTaxSugarControlLy */}
                                <NdLayoutItem key={"chkTaxSugarControlLy"} id={"chkTaxSugarControlLy"} parent={this} data-grid={{x:4,y:0,h:1,w:1}}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("chkTaxSugarControl") + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkTaxSugarControl" parent={this}  
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"TAX_SUGAR"}}
                                            onValueChanged={(e) => 
                                            {
                                                this.taxSugarValidCheck();
                                            }}
                                            param={this.param.filter({ELEMENT:'chkTaxSugarControl',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                 {/* chkPiqPoidLy */}
                                 <NdLayoutItem key={"chkPiqPoidLy"} id={"chkPiqPoidLy"} parent={this} data-grid={{x:5,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkPiqPoidLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{"Piq Poid" + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkPiqPoid" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"PIQPOID"}}
                                            param={this.param.filter({ELEMENT:'chkPiqPoid',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkFavori */}
                                <NdLayoutItem key={"chkFavoriLy"} id={"chkFavoriLy"} parent={this} data-grid={{x:6,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkFavoriLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{"Favori" + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkFavori" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"FAVORI"}}
                                            param={this.param.filter({ELEMENT:'chkFavori',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* chkCatalog */}
                                <NdLayoutItem key={"chkCatalogLy"} id={"chkCatalogLy"} parent={this} data-grid={{x:7,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'chkCatalogLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-10 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{"Catalog" + " :"}</label>
                                        </div>
                                        <div className="col-2 p-0 d-flex align-items-center">
                                            <NdCheckBox id="chkCatalog" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"CATALOG"}}
                                            param={this.param.filter({ELEMENT:'chkCatalog',USERS:this.user.CODE})}/>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                            </NdLayout>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <NdTabPanel id={"tabPanel"} parent={this} height="100%" onItemRendered={this.onItemRendered}
                            access={this.access.filter({ELEMENT:'tabPanel',USERS:this.user.CODE})} editMode={false}>
                                <Item title={this.t("tabTitlePrice")} text={"tbPrice"}>
                                    {/* FİYAT PANELI */}
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdLayout parent={this} id={"frmTabPrice" + this.tabIndex} rowHeight={30} cols={10}>
                                                {/* txtCostPriceLy */}
                                                <NdLayoutItem key={"txtCostPriceLy"} id={"txtCostPriceLy"} parent={this} data-grid={{x:0,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtCostPriceLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtCostPrice" parent={this} title={this.t("txtCostPrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}} readOnly={true}
                                                        format={"#,##0.000"} step={0.1}
                                                        param={this.param.filter({ELEMENT:'txtCostPrice',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* txtTotalExtraCostLy */}
                                                <NdLayoutItem key={"txtTotalExtraCostLy"} id={"txtTotalExtraCostLy"} parent={this} data-grid={{x:1,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtTotalExtraCostLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtTotalExtraCost" parent={this} title={this.t("txtTotalExtraCost")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                                        format={"#,##0.000"} readOnly={true}
                                                        param={this.param.filter({ELEMENT:'txtTotalExtraCost',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* txtMinSalePriceLy */}
                                                <NdLayoutItem key={"txtMinSalePriceLy"} id={"txtMinSalePriceLy"} parent={this} data-grid={{x:2,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtMinSalePriceLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtMinSalePrice" parent={this} title={this.t("txtMinSalePrice")} titleAlign={"top"} tabIndex={this.tabIndex}
                                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"MIN_PRICE"}}
                                                        format={"#,##0.000"} step={0.1}
                                                        editable={this.state.isItemGrpForMinMaxAccess}
                                                        param={this.param.filter({ELEMENT:'txtMinSalePrice',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* txtMaxSalePriceLy */}
                                                <NdLayoutItem key={"txtMaxSalePriceLy"} id={"txtMaxSalePriceLy"} parent={this} data-grid={{x:3,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtMaxSalePriceLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtMaxSalePrice" parent={this} title={this.t("txtMaxSalePrice")} titleAlign={"top"} tabIndex={this.tabIndex}
                                                        dt={{data:this.itemsObj.dt('ITEMS'),field:"MAX_PRICE"}}
                                                        format={"#,##0.000"} step={0.1}
                                                        editable={this.state.isItemGrpForMinMaxAccess}
                                                        param={this.param.filter({ELEMENT:'txtMaxSalePrice',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* txtLastBuyPriceLy */}
                                                <NdLayoutItem key={"txtLastBuyPriceLy"} id={"txtLastBuyPriceLy"} parent={this} data-grid={{x:4,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtLastBuyPriceLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtLastBuyPrice" parent={this} title={this.t("txtLastBuyPrice")} titleAlign={"top"} readOnly={true}
                                                        format={"#,##0.000"} step={0.1}
                                                        param={this.param.filter({ELEMENT:'txtLastBuyPrice',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* txtLastSalePriceLy */}
                                                <NdLayoutItem key={"txtLastSalePriceLy"} id={"txtLastSalePriceLy"} parent={this} data-grid={{x:5,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtLastSalePriceLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <NdNumberBox id="txtLastSalePrice" parent={this} title={this.t("txtLastSalePrice")} titleAlign={"top"}
                                                        format={"#,##0.000"} step={0.1} readOnly={true}
                                                        param={this.param.filter({ELEMENT:'txtLastSalePrice',USERS:this.user.CODE})}/>
                                                    </div>
                                                </NdLayoutItem>
                                                {/* sellPriceAddLy */}
                                                <NdLayoutItem key={"sellPriceAddLy"} id={"sellPriceAddLy"} parent={this} data-grid={{x:10,y:0,h:1,w:2}} access={this.access.filter({ELEMENT:'sellPriceAddLy',USERS:this.user.CODE})}>
                                                    <div>
                                                        <Button icon="add"
                                                        text={this.t("sellPriceAdd")}
                                                        onClick={async()=>
                                                        {   
                                                            await this.popPrice.show();

                                                            this.cmbPopPriListNo.value = 1
                                                            this.dtPopPriStartDate.value = "1970-01-01"
                                                            this.dtPopPriEndDate.value = "1970-01-01"
                                                            this.txtPopPriQuantity.value = 1
                                                            this.txtPopPriPrice.value = 0
                                                            this.txtPopPriHT.value = 0
                                                            this.txtPopPriTTC.value = 0
                                                            this.txtPopPriceMargin.value = 0
                                                            this.cmbPopPriDepot.value = "00000000-0000-0000-0000-000000000000"

                                                            setTimeout(async () => 
                                                            {
                                                                this.txtPopPriPrice.focus()
                                                            }, 600)
                                                        }}/>
                                                    </div>
                                                </NdLayoutItem>
                                            </NdLayout>
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
                                                let tmpCancel = false
                                                
                                                if(typeof e.newData.FINISH_DATE != 'undefined')
                                                {
                                                    let tmpFinish = e.newData.FINISH_DATE
                                                    let numbersFinish = tmpFinish.match(/[0-9]/g); 
                                                    if(numbersFinish.length > 17)
                                                    {
                                                        tmpCancel = true
                                                    }
                                                }
                                                if(typeof e.newData.START_DATE != 'undefined')
                                                {
                                                    let tmpStart = e.newData.START_DATE
                                                    let numbersStart = tmpStart.match(/[0-9]/g); 
                                                    if(numbersStart.length > 17)
                                                    {
                                                        tmpCancel = true
                                                    }
                                                }

                                                if (tmpCancel) 
                                                {
                                                    e.cancel = true;
                                                    e.component.cancelEditData()  
                                                    this.toast.show({message:this.t("msgDateInvalid.msg"),type:'warning'})
                                                }
                                                if(typeof e.newData.PRICE != 'undefined')
                                                {
                                                    //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                                    if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.txtCostPrice.value != 0 && this.txtCostPrice.value >= e.newData.PRICE && e.newData.PRICE != 0)
                                                    {
                                                        e.cancel = true;
                                                        e.component.cancelEditData()
                                                        this.toast.show({message:this.t("msgCostPriceValid.msg"),type:'warning'})
                                                    }
                                                    //********************************** */
                                                }
                                            }}
                                            onRowUpdated={async(e)=>
                                            {
                                                if(typeof e.data.PRICE != 'undefined')
                                                {
                                                    if(e.key.LIST_VAT_TYPE == 0)
                                                    {
                                                        e.key.PRICE_TTC = e.data.PRICE
                                                        e.key.PRICE_HT = Number(e.data.PRICE).rateInNum(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                                    }
                                                    else
                                                    {
                                                        e.key.PRICE_HT = e.data.PRICE
                                                        e.key.PRICE_TTC =  Number(e.data.PRICE).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                                    }
                                                    e.key.MARGIN =  Number(((e.key.PRICE_HT  / this.txtCostPrice.value)) * 100).round(2)
                                                }
                                                if(typeof e.data.MARGIN != 'undefined')
                                                {
                                                    if(e.key.LIST_VAT_TYPE == 0)
                                                    {
                                                        e.key.PRICE_HT =   Number(this.txtCostPrice.value * (1 + (e.data.MARGIN / 100) )).round(3);
                                                        e.key.PRICE_TTC =  Number(e.key.PRICE_HT).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                                        e.key.PRICE =  e.key.PRICE_TTC
                                                    }
                                                    else
                                                    {
                                                        e.key.PRICE_HT =  Number(this.txtCostPrice.value * (1 + (e.data.MARGIN / 100))).round(3);
                                                        e.key.PRICE_TTC = Number(e.key.PRICE_HT).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                                        e.key.PRICE =  e.key.PRICE_HT
                                                    }
                                                }
                                            }}
                                            >
                                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPrice"}/>                                
                                                <ColumnChooser enabled={true} />  
                                                <Paging defaultPageSize={6} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="LIST_NO" caption={this.t("grdPrice.clmListNo")} width={60} allowEditing={false}/>
                                                <Column dataField="LIST_NAME" caption={this.t("grdPrice.clmListName")} allowEditing={false}/>
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
                                                <Column dataField="PRICE" caption={this.t("grdPrice.clmPrice")} dataType="number" format={Number.money.sign +"##0.000"}/>
                                                <Column dataField="PRICE_HT" caption={this.t("grdPrice.clmPriceHT")} dataType="number" format={Number.money.sign +"##0.000"} allowEditing={false}/>
                                                <Column dataField="PRICE_TTC" caption={this.t("grdPrice.clmPriceTTC")} dataType="number" format={Number.money.sign +"##0.000"} allowEditing={false}/>
                                                <Column dataField="GROSS_MARGIN" caption={this.t("grdPrice.clmGrossMargin")} dataType="string" allowEditing={false}/>
                                                <Column dataField="NET_MARGIN" caption={this.t("grdPrice.clmNetMargin")} dataType="string" format={{ style: "currency", currency: Number.money.code,precision: 2}} allowEditing={false}/>
                                                <Column dataField="MARGIN" caption={this.t("grdPrice.clmMargin")} dataType="number" format={"##0.00"} allowEditing={true}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleUnit")} text={"tbUnit"}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtUnderUnitFiyat" parent={this} title={this.t("underUnitPrice")} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-10'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={async()=>
                                                    {                                                        
                                                        await this.popUnit.show();

                                                        this.cmbPopUnitType.value = "2"
                                                        this.cmbPopUnitName.value = "001"
                                                        this.txtPopUnitFactor.value = "0"
                                                        this.txtPopUnitWeight.value = "0"
                                                        this.txtPopUnitVolume.value = "0";
                                                        this.txtPopUnitWidth.value = "0";
                                                        this.txtPopUnitHeight.value = "0"
                                                        this.txtPopUnitSize.value = "0"
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
                                            onRowRemoving={async (e)=>
                                            {
                                                if(e.key.TYPE != 2)
                                                {
                                                    e.cancel = true
                                                    this.toast.show({message:this.t("msgUnitRowNotDelete.msg"),type:'warning'})
                                                    e.component.cancelEditData()
                                                }
                                            }}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption={this.t("grdUnit.clmType")} width={250} allowEditing={false}/>
                                                <Column dataField="NAME" caption={this.t("grdUnit.clmName")} allowEditing={false}/>
                                                <Column dataField="FACTOR" caption={this.t("grdUnit.clmFactor")} editCellRender={this.cellRoleRender}/>
                                                <Column dataField="WEIGHT" caption={this.t("grdUnit.clmWeight")}/>
                                                <Column dataField="VOLUME" caption={this.t("grdUnit.clmVolume")}/>
                                                <Column dataField="WIDTH" caption={this.t("grdUnit.clmWidth")}/>
                                                <Column dataField="HEIGHT" caption={this.t("grdUnit.clmHeight")}/>
                                                <Column dataField="SIZE" caption={this.t("grdUnit.clmSize")}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleBarcode")} text={"tbBarcode"}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={async ()=>
                                                    {                                                        
                                                        await this.popBarcode.show();
                                                        await this.cmbPopBarUnit.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:{'in':[0,2]}})})
                                                        this.txtPopBarcode.value = "";
                                                        this.cmbPopBarType.value = "0";
                                                        this.cmbPopBarUnit.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''

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
                                <Item title={this.t("tabTitleCustomer")} text={"tbCustomer"}>
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
                                                    onClick={async()=>
                                                    {
                                                        await this.popCustomer.show();
                                                        this.txtPopCustomerItemCode.value = "";
                                                        this.txtPopCustomerPrice.value = 0;

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
                                                        this.toast.show({message:this.t("msgSalePriceToCustomerPrice.msg"),type:'warning'})
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
                                                <Column dataField="CUSTOMER_PRICE_DATE" caption={this.t("grdCustomer.clmPriceDate")} editCellRender={this.cellRoleRender}/>
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdCustomer.clmPrice")} dataType="number" format={Number.money.sign + '#,##0.000'}/>
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
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdOtherShop.clmCustomerPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}} width={247}/>
                                                <Column dataField="SALE_PRICE" caption={this.t("grdOtherShop.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}  width={247}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdOtherShop.clmMulticode")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleCustomerPrice")} text={"tbCustomPrice"}>
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
                                                <Column dataField="DATE" caption={this.t("grdCustomerPrice.clmDate")}allowEditing={false} />
                                                <Column dataField="FISRT_PRICE" caption={this.t("grdCustomerPrice.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                                <Column dataField="MULTICODE" caption={this.t("grdCustomerPrice.clmMulticode")} />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleSalesPriceHistory")} text={"tbSalePriceHistory"}>
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
                                                <Column dataField="DATE" caption={this.t("grdSalesPrice.clmDate")} allowEditing={false}/>
                                                <Column dataField="FISRT_PRICE" caption={this.t("grdSalesPrice.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabTitleSalesContract")} text={"tbSaleContract"}>
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
                                                <Column dataField="PRICE" caption={this.t("grdSalesContract.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title={this.t("tabExtraCost")} text={"tbExtraCost"}>
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
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdExtraCost.clmCustomerPrice")} format={"#,##0.000 " + Number.money.sign}/>
                                                <Column dataField="PRICE" caption={this.t("grdExtraCost.clmPrice")} format={"#,##0.000 " + Number.money.sign }/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item> 
                                <Item title={this.t("tabTitleDetail")} text={"tbDetail"}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-6'>
                                            <NdForm colCount={2} >
                                                {/* txtGenus */}
                                                <NdItem>                                    
                                                    <NdLabel text={this.t("txtGenus")} alignment="right" />
                                                    <NdTextBox id="txtGenus" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"GENRE"}} 
                                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} readOnly={true}
                                                    param={this.param.filter({ELEMENT:'txtGenus',USERS:this.user.CODE})}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.pg_txtGenre.show()
                                                                    this.pg_txtGenre.onClick = (data) =>
                                                                    {
                                                                        if(data.length > 0)
                                                                        {
                                                                            this.itemsObj.dt()[0].GENRE = data[0].CODE
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    selectAll={true}/>     
                                                    {/*CİNS KODU POPUP */}
                                                    <NdPopGrid id={"pg_txtGenre"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                                    visible={false}
                                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                                    showTitle={true} 
                                                    showBorders={true}
                                                    width={'90%'}
                                                    height={'90%'}
                                                    title={this.t("pg_txtGenre.title")} 
                                                    selection={{mode:"single"}}
                                                    data={{source:{select:{query:`SELECT CODE,NAME FROM ITEM_GENRE_VW_01`},sql:this.core.sql}}}
                                                    >
                                                        <Column dataField="CODE" caption={this.t("pg_txtGenre.clmCode")} width={'20%'} />
                                                        <Column dataField="NAME" caption={this.t("pg_txtGenre.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                    </NdPopGrid>
                                                </NdItem>
                                                {/* txtCustoms */}
                                                <NdItem>                                    
                                                    <NdLabel text={this.t("txtCustoms")} alignment="right" />
                                                    <NdTextBox id="txtCustoms" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"CUSTOMS_CODE"}} 
                                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} 
                                                    onValueChanged={async (e)=>
                                                    {
                                                        let tmpControl = this.stringControle(e.value)
                                                        if(tmpControl)
                                                        {
                                                            this.txtCustoms.value = e.previousValue
                                                        }
                                                    }}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.pg_customsCode.show()
                                                                    this.pg_customsCode.onClick = (data) =>
                                                                    {
                                                                        if(data.length > 0)
                                                                        {
                                                                            this.itemsObj.dt()[0].CUSTOMS_CODE = data[0].CODE
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    selectAll={true}                           
                                                    >     
                                                        <Validator validationGroup={"frmItems" + this.tabIndex}>
                                                            <StringLengthRule message={this.t("validOriginMax8")} max={8} min={8} ignoreEmptyValue={true}/>
                                                        </Validator>
                                                    </NdTextBox>
                                                    {/*GÜMRÜK KODU POPUP */}
                                                    <NdPopGrid id={"pg_customsCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                                    visible={false}
                                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                                    showTitle={true} 
                                                    showBorders={true}
                                                    width={'90%'}
                                                    height={'90%'}
                                                    title={this.t("pg_customsCode.title")} 
                                                    selection={{mode:"single"}}
                                                    data={{source:{select:{query:`SELECT CODE,NAME FROM CUSTOMS_CODE`},sql:this.core.sql}}}
                                                    >
                                                        <Column dataField="CODE" caption={this.t("pg_customsCode.clmCode")} width={'20%'} />
                                                        <Column dataField="NAME" caption={this.t("pg_customsCode.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                    </NdPopGrid>
                                                </NdItem>
                                                 {/* txtRayon */}
                                                 <NdItem>                                    
                                                    <NdLabel text={this.t("txtRayon")} alignment="right" />
                                                    <NdTextBox id="txtRayon" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.itemsObj.dt('ITEMS'),field:"RAYON_NAME"}} 
                                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} 
                                                    onValueChanged={async (e)=>
                                                    {
                                                        let tmpControl = this.stringControle(e.value)
                                                        if(tmpControl)
                                                        {
                                                            this.txtRayon.value = e.previousValue
                                                        }
                                                    }}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.pg_rayonCode.show()
                                                                    this.pg_rayonCode.onClick = (data) =>
                                                                    {
                                                                        if(data.length > 0)
                                                                        {
                                                                            this.itemsObj.dt()[0].RAYON_GUID = data[0].GUID
                                                                            this.itemsObj.dt()[0].RAYON_CODE = data[0].CODE
                                                                            this.itemsObj.dt()[0].RAYON_NAME = data[0].NAME
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        ]
                                                    }
                                                    selectAll={true}/>     
                                                    {/*RAYON KODU POPUP */}
                                                    <NdPopGrid id={"pg_rayonCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                                    visible={false}
                                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                                    showTitle={true} 
                                                    showBorders={true}
                                                    width={'90%'}
                                                    height={'90%'}
                                                    title={this.t("pg_rayonCode.title")} 
                                                    selection={{mode:"single"}}
                                                    data={{source:{select:{query:`SELECT GUID,CODE,NAME FROM RAYON WHERE DELETED = 0`},sql:this.core.sql}}}
                                                    >
                                                        <Column dataField="CODE" caption={this.t("pg_rayonCode.clmCode")} width={'30%'} />
                                                        <Column dataField="NAME" caption={this.t("pg_rayonCode.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                    </NdPopGrid>
                                                </NdItem>
                                                {/* chkPartiLot */}
                                                <NdItem>
                                                    <NdLabel text ={this.t("chkPartiLot")} alignment="right"/>
                                                    <NdCheckBox id="chkPartiLot" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"PARTILOT"}}
                                                    param={this.param.filter({ELEMENT:'chkPartiLot',USERS:this.user.CODE})}/>
                                                </NdItem>
                                            </NdForm>
                                        </div>
                                        <div className='col-3'>
                                            <div className='row'>
                                                <div className='col-12 ps-0'>
                                                    <NdGrid parent={this} id={"grdProperty"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    height={'280px'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    >
                                                        <Editing mode="cell" allowDeleting={true}/>
                                                        <Column dataField="PROPERTY_NAME" caption={this.t("grdProperty.clmProperty")}/>
                                                        <Column dataField="VALUE" caption={this.t("grdProperty.clmValue")}/>
                                                        <Column type="buttons" width={"50"}>
                                                            <GrdButton name="delete" icon="trash"/>
                                                        </Column>
                                                    </NdGrid>
                                                </div>
                                                <div className='row pe-0'>
                                                    <div className='col-12 p-0'>
                                                        <NdButton text={this.t("btnProperty")} type="normal" stylingMode="contained" width={'100%'}
                                                        onClick={async()=>
                                                        {
                                                            await this.propertyPopup.show()
                                                        }}/>
                                                        <NdPopUp id={"propertyPopup"} parent={this} 
                                                        visible={false}
                                                        showTitle={true}
                                                        title={this.t("propertyPopup.title")}
                                                        container={'#' + this.props.data.id + this.tabIndex}
                                                        width={'500'}
                                                        height={'auto'}
                                                        showCloseButton={true}
                                                        position={{of:'#' + this.props.data.id + this.tabIndex}}>
                                                            <NdForm colCount={1} height={'fit-content'}>
                                                                <NdItem>
                                                                    <NdLabel text={this.t("propertyPopup.property")} alignment="right"/>
                                                                    <NdSelectBox id="cmbProperty" parent={this} 
                                                                    simple={true}
                                                                    height='fit-content' 
                                                                    displayExpr="NAME"                       
                                                                    valueExpr="GUID"
                                                                    data={{source:{select:{query:`SELECT GUID,NAME FROM PROPERTY_VW_01`},sql:this.core.sql}}}/>
                                                                </NdItem>
                                                                <NdItem>
                                                                    <NdLabel text={this.t("propertyPopup.value")} alignment="right"/>
                                                                    <NdTextBox id="txtPropertyValue" parent={this} simple={true} height='fit-content'/>
                                                                </NdItem>
                                                                <NdItem>
                                                                    <NdButton text={this.t("propertyPopup.add")} type="normal" stylingMode="contained" width={'100%'}
                                                                    onClick={async()=>
                                                                    {
                                                                        if(this.cmbProperty.value != '' && this.txtPropertyValue.value != '')
                                                                        {
                                                                            let tmpObj = 
                                                                            {
                                                                                ITEM:this.itemsObj.dt()[0].GUID,
                                                                                PROPERTY:this.cmbProperty.value,
                                                                                PROPERTY_NAME:this.cmbProperty.displayValue,
                                                                                VALUE:this.txtPropertyValue.value
                                                                            }
                                                                            this.itemsObj.itemProperty.addEmpty(tmpObj)
                                                                            await this.grdProperty.dataRefresh({source:this.itemsObj.itemProperty.dt()})
                                                                            this.propertyPopup.hide()
                                                                            this.cmbProperty.value = ''
                                                                            this.txtPropertyValue.value = ''
                                                                        }
                                                                    }}/>
                                                                </NdItem>
                                                            </NdForm>
                                                        </NdPopUp>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-3'>
                                            <div className='row'>
                                                <div className='col-12 ps-0'>
                                                    <NdGrid parent={this} id={"grdSubGrp"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    showColumnHeaders={false}
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    height={'280px'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    >
                                                        <Editing mode="cell" allowDeleting={true}/>
                                                        <Column dataField="SUB_NAME"/>
                                                        <Column type="buttons" width={"50"}>
                                                            <GrdButton name="delete" icon="trash"/>
                                                        </Column>
                                                    </NdGrid>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-12 ps-0'>
                                                    <NdButton text={this.t("btnSubGroup")} type="normal" stylingMode="contained" width={'100%'}
                                                    onClick={async()=>
                                                    {
                                                        await this.pg_subGroup.show()
                                                        
                                                        let tmpQuery = {}

                                                        if(this.grdSubGrp.data.datatable && this.grdSubGrp.data.datatable.length > 0)
                                                        {
                                                            let tmpGuid = this.grdSubGrp.data.datatable[this.grdSubGrp.data.datatable.length - 1].SUB_GUID
                                                            let tmpVal = this.grdSubGrp.data.datatable.map(item => `'${item.SUB_GUID}'`).join(', ')
                                                            
                                                            tmpQuery = 
                                                            {
                                                                query : `SELECT NAME FROM ITEM_SUB_GROUP_VW_01 WHERE PARENT = '${tmpGuid}' AND GUID NOT IN (${tmpVal})`,
                                                            }
                                                        }
                                                        else
                                                        {
                                                            tmpQuery = 
                                                            {
                                                                query : `SELECT NAME FROM ITEM_SUB_GROUP_VW_01 WHERE PARENT = '00000000-0000-0000-0000-000000000000'`,
                                                            }
                                                        }
                                                        
                                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                                        
                                                        if(tmpData.result.recordset.length > 0)
                                                        {
                                                            this.pg_subGroup.setData(tmpData.result.recordset)
                                                        }
                                                        else
                                                        {
                                                            if(this.grdSubGrp.data.datatable && this.grdSubGrp.data.datatable.length > 0)
                                                            {
                                                                let tmpVal = this.grdSubGrp.data.datatable.map(item => `'${item.SUB_GUID}'`).join(', ')
                                                                tmpQuery = 
                                                                {
                                                                    query : `SELECT NAME FROM ITEM_SUB_GROUP_VW_01 WHERE PARENT = '00000000-0000-0000-0000-000000000000' AND GUID NOT IN (${tmpVal})`,
                                                                }
                                                            }
                                                            else
                                                            {
                                                                tmpQuery = 
                                                                {
                                                                    query : `SELECT NAME FROM ITEM_SUB_GROUP_VW_01 WHERE PARENT = '00000000-0000-0000-0000-000000000000'`,
                                                                }
                                                            }

                                                            tmpData = await this.core.sql.execute(tmpQuery)
                                                            
                                                            if(tmpData.result.recordset.length > 0)
                                                            {
                                                                this.pg_subGroup.setData(tmpData.result.recordset)
                                                            }
                                                        }

                                                        this.pg_subGroup.onClick = async(e) =>
                                                        {
                                                            this.itemsObj.itemSubGrp.addEmpty()
                                                            
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].ITEM_GUID = this.itemsObj.dt()[0].GUID
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].ITEM_CODE = this.itemsObj.dt()[0].CODE
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].ITEM_NAME = this.itemsObj.dt()[0].NAME
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].ITEM_SUB_RANK = this.itemsObj.itemSubGrp.dt().length - 1
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].SUB_GUID = e[0].GUID
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].SUB_CODE = e[0].CODE
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].SUB_NAME = e[0].NAME
                                                            this.itemsObj.itemSubGrp.dt()[this.itemsObj.itemSubGrp.dt().length - 1].SUB_GRP_RANK = e[0].RANK
                                                        }
                                                    }}/>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ALT GRUP SEÇİM POPUP */}
                                        <NdPopGrid id={"pg_subGroup"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={this.t("pg_subGroup.title")} 
                                        search={false}
                                        >
                                            <Column dataField="NAME" caption={this.t("pg_subGroup.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </div>                                    
                                </Item>
                                <Item title={this.t("tabTitleInfo")} text={"tbInfo"}>
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
                                <Item title={this.t("tabTitleOtherShop")} text={"tbOtherShop"}>
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtTabCostPrice" parent={this} title={this.t("txtCostPrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}} readOnly={true}
                                            format={"#,##0.000"} step={0.1}/>
                                        </div>                                        
                                        <div className='col-2'>
                                            <NdNumberBox id="txtSalePrice" parent={this} title={this.t("txtSalePrice")}  titleAlign={"top"} tabIndex={this.tabIndex}
                                            format={"#,##0.000"} readOnly={true}/>
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
                                                <Column dataField="CUSTOMER_PRICE" caption={this.t("grdOtherShop.clmCustomerPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
                                                <Column dataField="SALE_PRICE" caption={this.t("grdOtherShop.clmPrice")} allowEditing={false} dataType="number" format={{ style: "currency", currency: Number.money.code,precision: 2}}/>
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
                            </NdTabPanel>
                        </div>
                    </div>                   
                    {/* FİYAT POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popPrice"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popPrice.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'600'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={2} height={'fit-content'} id={"frmPrice" + this.tabIndex}>
                                {/* cmbPopPriListNo */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.cmbPopPriListNo")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopPriListNo" tabIndex={this.tabIndex}
                                    displayExpr="NAME"                       
                                    valueExpr="NO"
                                    value=""
                                    searchEnabled={true} 
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh={true}
                                    data={{source:{select:{query:`SELECT NO,NAME,VAT_TYPE FROM ITEM_PRICE_LIST_VW_01`},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                {/* dtPopPriStartDate */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.dtPopPriStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopPriStartDate"}/>
                                </NdItem>
                                {/* dtPopPriEndDate */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.dtPopPriEndDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopPriEndDate"}/>
                                </NdItem>
                                {/* txtPopPriQuantity */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.txtPopPriQuantity")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriQuantity"} parent={this} simple={true}>
                                        <Validator validationGroup={"frmPrice" + this.tabIndex}>
                                            <RequiredRule message={this.t("validQuantity")}/>
                                        </Validator>
                                    </NdNumberBox>
                                </NdItem>
                                {/* cmbPopPriDepot */}
                                <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.cmbPopPriDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopPriDepot" tabIndex={this.tabIndex}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true} 
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh={true}
                                    data={{source:{select:{query:`SELECT '00000000-0000-0000-0000-000000000000' AS GUID, 'GENERAL' AS NAME UNION ALL SELECT GUID,NAME FROM DEPOT_VW_01 WHERE STATUS = 1 ORDER BY NAME ASC`},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                {/* txtPopPriPrice */}
                                <NdItem>
                                    <NdLabel text={this.t("popPrice.txtPopPriPrice")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriPrice"} parent={this} simple={true}  format={"##0.000"}
                                    onValueChanged={async (e)=>
                                    {
                                        let tmpDt = this.cmbPopPriListNo.data.datatable.where({'NO':this.cmbPopPriListNo.value})
                                        if(tmpDt[0].VAT_TYPE == 0)
                                        {
                                            this.txtPopPriTTC.value = this.txtPopPriPrice.value
                                            this.txtPopPriHT.value = Number(this.txtPopPriPrice.value).rateInNum(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                        }
                                        else
                                        {
                                            this.txtPopPriTTC.value = Number(this.txtPopPriPrice.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                            this.txtPopPriHT.value = this.txtPopPriPrice.value
                                        }
                                        this.txtPopPriceMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                        this.txtPopPriceGrossMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                        this.txtPopPriceNetMargin.value = Number((((((this.txtPopPriHT.value - this.txtCostPrice.value) / 1.15) / this.txtCostPrice.value) )) * 100).round(2)
                                    }}/>
                                </NdItem>
                                {/* txtPopPriceMargin */}
                                <NdItem>
                                    <NdLabel text={this.t("popPrice.txtPopPriceMargin")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriceMargin"} parent={this} simple={true}  format={"##0.00"}
                                    onValueChanged={async (e)=>
                                    {
                                        let tmpDt = this.cmbPopPriListNo.data.datatable.where({'NO':this.cmbPopPriListNo.value})
                                        if(tmpDt[0].VAT_TYPE == 0)
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceMargin.value / 100))).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,2)
                                            this.txtPopPriPrice.value = this.txtPopPriTTC.value
                                        }
                                        else
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceMargin.value / 100))).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                            this.txtPopPriPrice.value = this.txtPopPriHT.value
                                        }
                                        this.txtPopPriceGrossMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                        this.txtPopPriceNetMargin.value = Number((((((this.txtPopPriHT.value - this.txtCostPrice.value) / 1.15) / this.txtCostPrice.value) )) * 100).round(2)
                                    }}/>
                                </NdItem>
                                {/* txtPopPriceGrossMargin */}
                                <NdItem>
                                    <NdLabel text={this.t("popPrice.txtPopPriceGrossMargin")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriceGrossMargin"} parent={this} simple={true}  format={"##0.00"}
                                    onValueChanged={async (e)=>
                                    {
                                        let tmpDt = this.cmbPopPriListNo.data.datatable.where({'NO':this.cmbPopPriListNo.value})
                                        if(tmpDt[0].VAT_TYPE == 0)
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceGrossMargin.value / 100))).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,2)
                                            this.txtPopPriPrice.value = this.txtPopPriTTC.value
                                        }
                                        else
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceGrossMargin.value / 100))).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                            this.txtPopPriPrice.value = this.txtPopPriHT.value
                                        }
                                        this.txtPopPriceMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                        this.txtPopPriceNetMargin.value = Number((((((this.txtPopPriHT.value - this.txtCostPrice.value) / 1.15) / this.txtCostPrice.value) )) * 100).round(2)
                                    }}/>
                                </NdItem>
                                {/* txtPopPriceNetMargin */}
                                <NdItem>
                                    <NdLabel text={this.t("popPrice.txtPopPriceNetMargin")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriceNetMargin"} parent={this} simple={true}  format={"##0.00"}
                                    onValueChanged={async (e)=>
                                    {
                                        let tmpDt = this.cmbPopPriListNo.data.datatable.where({'NO':this.cmbPopPriListNo.value})

                                        if(tmpDt[0].VAT_TYPE == 0)
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceNetMargin.value / 100) * 1.15)).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,2)
                                            this.txtPopPriPrice.value = this.txtPopPriTTC.value
                                        }
                                        else
                                        {
                                            this.txtPopPriHT.value =  Number(this.txtCostPrice.value * (1 + (this.txtPopPriceNetMargin.value / 100) * 1.15)).round(3);
                                            this.txtPopPriTTC.value = Number(this.txtPopPriHT.value).rateExc(this.itemsObj.dt("ITEMS")[0].VAT,3)
                                            this.txtPopPriPrice.value = this.txtPopPriHT.value
                                        }
                                        this.txtPopPriceMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                        this.txtPopPriceGrossMargin.value = Number((((this.txtPopPriHT.value - this.txtCostPrice.value) / this.txtCostPrice.value)) * 100).round(2)
                                    }}/>
                                </NdItem>
                                 {/* txtPopPriHT */}
                                 <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.txtPopPriHT")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriHT"} parent={this} simple={true} readOnly={true} format={"##0.000"}/>
                                </NdItem>
                                 {/* txtPopPriTTC */}
                                 <NdItem colSpan={2}>
                                    <NdLabel text={this.t("popPrice.txtPopPriTTC")} alignment="right" />
                                    <NdNumberBox id={"txtPopPriTTC"} parent={this} simple={true} readOnly={true} format={"##0.000"}/>
                                </NdItem>
                                <NdItem>
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
                                                    tmpCheckData = tmpCheckData.where({DEPOT:this.cmbPopPriDepot.value})
                                                    tmpCheckData = tmpCheckData.where({LIST_NO:this.cmbPopPriListNo.value})
                                                    
                                                    if(tmpCheckData.length > 0)
                                                    {
                                                        this.toast.show({message:this.t("msgCheckPrice.msg"),type:'warning'})
                                                        return
                                                    }
                                                    //*********************************** */
                                                    //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                                    if(this.prmObj.filter({ID:'SalePriceCostCtrl'}).getValue() && this.txtCostPrice.value != 0 && this.txtCostPrice.value >= this.txtPopPriPrice.value)
                                                    {
                                                        this.toast.show({message:this.t("msgCostPriceValid.msg"),type:'warning'})
                                                        return;
                                                    }
                                                    //********************************** */
                                                    let tmpEmpty = {...this.itemsObj.itemPrice.empty};
                                                
                                                    tmpEmpty.TYPE = 0
                                                    tmpEmpty.LIST_NO = this.cmbPopPriListNo.value
                                                    tmpEmpty.LIST_NAME = this.cmbPopPriListNo.displayValue
                                                    tmpEmpty.TYPE_NAME = 'Satis'
                                                    tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                    tmpEmpty.DEPOT = this.cmbPopPriDepot.value
                                                    tmpEmpty.START_DATE = new Date(moment(this.dtPopPriStartDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpEmpty.FINISH_DATE = new Date(moment(this.dtPopPriEndDate.value).format("YYYY-MM-DD")).toISOString()
                                                    tmpEmpty.PRICE = this.txtPopPriPrice.value
                                                    tmpEmpty.PRICE_TTC = this.txtPopPriTTC.value
                                                    tmpEmpty.PRICE_HT = this.txtPopPriHT.value
                                                    tmpEmpty.QUANTITY = this.txtPopPriQuantity.value
                                                    tmpEmpty.LIST_VAT_TYPE = this.cmbPopPriListNo.data.datatable.where({'NO':this.cmbPopPriListNo.value})[0].VAT_TYPE

                                                    this.itemsObj.itemPrice.addEmpty(tmpEmpty); 
                                                    this.popPrice.hide();
                                                }                              
                                                else
                                                {
                                                    this.toast.show({message:this.t("msgPriceAdd.msg"),type:'warning'})
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    {/* BİRİM POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popUnit"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popUnit.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'510'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.cmbPopUnitType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopUnitType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="2"
                                    data={{source:[{ID:"2",VALUE:"Condition"}]}}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.cmbPopUnitName")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopUnitName"
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value="001"
                                    data={{source:{select:{query:`SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC`},sql:this.core.sql}}} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitFactor")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitFactor"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitWeight")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitWeight"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitVolume")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitVolume"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitWidth")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitWidth"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitHeight")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitHeight"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popUnit.txtPopUnitSize")} alignment="right" />
                                    <NdTextBox id={"txtPopUnitSize"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    {/* BARKOD POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBarcode"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popBarcode.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'275'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popBarcode.txtPopBarcode")} alignment="right" />
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
                                        else if(tmpResult == 3 && tmpEmptyStat == false)
                                        {
                                            this.itemsObj.itemBarcode.dt()[0].BARCODE = ''
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
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popBarcode.cmbPopBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarUnit" displayExpr="NAME" valueExpr="GUID"/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popBarcode.cmbPopBarType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarType"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}} />
                                </NdItem>
                                <NdItem>
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
                                                else if(tmpResult == 3 && tmpEmptyStat == false)
                                                {
                                                    this.itemsObj.itemBarcode.dt()[0].BARCODE = ''
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
                    {/* TEDARİKÇİ POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popCustomer"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popCustomer.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'} id={"frmItemCustomer" + + this.tabIndex}>
                                <NdItem>
                                    <NdLabel text={this.t("popCustomer.txtPopCustomerCode")} alignment="right" />
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
                                    }/>                                        
                                    <NdPopGrid id={"pg_txtPopCustomerCode"} parent={this} 
                                    container={'#' + this.props.data.id + this.tabIndex} 
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
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
                                                query : `SELECT GUID,CODE,TITLE FROM CUSTOMER_VW_01 WHERE GENUS IN(1,2,3) AND (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL))`,
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
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popCustomer.txtPopCustomerName")} alignment="right" />
                                    <NdTextBox id={"txtPopCustomerName"} parent={this} simple={true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}>
                                        <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")}/>
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popCustomer.txtPopCustomerItemCode")} alignment="right" />
                                    <NdTextBox id={"txtPopCustomerItemCode"} parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} >
                                        <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")}/>
                                        </Validator> 
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popCustomer.txtPopCustomerPrice")} alignment="right" />
                                    <NdNumberBox id={"txtPopCustomerPrice"} parent={this} simple={true} >
                                        <Validator validationGroup={"frmItemCustomer" + this.tabIndex}>
                                            <RequiredRule message={this.t("validPrice")}/>
                                            <RangeRule min={0.001} message={this.t("validPriceFloat")}/>
                                        </Validator> 
                                    </NdNumberBox>
                                </NdItem>
                                <NdItem>
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
                                                    this.toast.show({message:this.t("msgPriceAdd.msg"),type:'warning'})
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>      
                    {/* İSTATİSTİK POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popAnalysis"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAnalysis.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'1200'}
                        height={'700'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={3} height={'fit-content'}>
                                <NdItem colSpan={2}>
                                    <div className="col-12">
                                        <NbDateRange id={"dtDate"} parent={this} startDate={ moment().startOf('month')} endDate={moment(new Date())}/>
                                    </div>
                                </NdItem>
                                <NdItem>
                                    <NdButton id="btnGet" parent={this} text={this.t("btnGet")} type="default" width='100%'
                                    onClick={async()=>
                                    {
                                        App.instance.setState({isExecute:true})
                                        if(this.cmbAnlysType.value == 0)
                                        {
                                            if(this.chkDayAnalysis.value == true)
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT SUM(QUANTITY) AS QUANTITY,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE FROM POS_SALE_VW_01 
                                                            WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999'
                                                            GROUP BY DOC_DATE,ITEM_CODE`,
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
                                                    this.setState({dataRefresh:{}})
                                                }
                                            }
                                            else if(this.chkMountAnalysis.value == true)
                                            {
                                                let tmpQuery = 
                                                {
                                                    query : `SELECT SUM(QUANTITY) AS QUANTITY,MONTH(DOC_DATE) AS DOC_DATE FROM POS_SALE_VW_01 
                                                            WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND DEVICE <> '9999' 
                                                            GROUP BY MONTH(DOC_DATE),ITEM_CODE`,
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
                                        }
                                        else if(this.cmbAnlysType.value == 1)
                                        {
                                            if(this.chkDayAnalysis.value == true)
                                            {
                                                let tmpFacQuery = 
                                                {
                                                    query : `SELECT SUM(QUANTITY) AS QUANTITY,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE FROM DOC_ITEMS_VW_01 
                                                            WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE AND TYPE = 1 AND ((DOC_TYPE = 20) OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID != '00000000-0000-0000-0000-000000000000')) 
                                                            GROUP BY DOC_DATE,ITEM_CODE`,
                                                    param : ['CODE:string|50','FIRST_DATE:date','LAST_DATE:date'],
                                                    value : [this.txtRef.value,this.dtDate.startDate,this.dtDate.endDate]
                                                }
                                                let tmpFacData = await this.core.sql.execute(tmpFacQuery) 
                                                if(tmpFacData.result.recordset.length > 0)
                                                {
                                                    this.setState({dataSource:tmpFacData.result.recordset})
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
                                                    query : `SELECT SUM(QUANTITY) AS QUANTITY,MONTH(DOC_DATE) AS DOC_DATE FROM DOC_ITEMS_VW_01 
                                                            WHERE ITEM_CODE = @CODE AND DOC_DATE >= @FIRST_DATE AND DOC_DATE <= @LAST_DATE  AND TYPE = 1 AND ((DOC_TYPE = 20) OR (DOC_TYPE = 40 AND INVOICE_DOC_GUID != '00000000-0000-0000-0000-000000000000')) 
                                                            GROUP BY MONTH(DOC_DATE),ITEM_CODE`,
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
                                        } 
                                        App.instance.setState({isExecute:false})
                                    }}/>
                                </NdItem>
                                {/* cmbAnlysType */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbAnlysType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbAnlysType" height='fit-content'
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:this.t("cmbAnlysTypeData.pos")},{ID:1,VALUE:this.t("cmbAnlysTypeData.invoice")}]}}
                                    onValueChanged={(async(e)=>
                                    {
                                        
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'cmbAnlysType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbAnlysType',USERS:this.user.CODE})}
                                    />
                                </NdItem>       
                                <NdItem>
                                    <NdLabel text={this.t("chkDayAnalysis")} alignment="right" />
                                    <NdCheckBox id="chkDayAnalysis" parent={this} defaultValue={true} value={true}
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value == true)
                                        {
                                            this.chkMountAnalysis.value = false
                                        }
                                    }}/>
                                </NdItem>  
                                <NdItem>
                                    <NdLabel text={this.t("chkMountAnalysis")} alignment="right" />
                                    <NdCheckBox id="chkMountAnalysis" parent={this} defaultValue={false} 
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value == true)
                                        {
                                            this.chkDayAnalysis.value = false
                                        }
                                    }}/>
                                </NdItem>
                                <NdItem colSpan={3}>
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
                                            name="Vente"
                                            type="bar"
                                            color="#008000" />
                                    </Chart>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>    
                    {/* BİRİM POPUP */}
                    <div>
                        <NdDialog parent={this} id={"msgUnit"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("msgUnit.title")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        button={[{id:"btn01",caption:this.t("msgUnit.btn01"),location:'after'}]}
                        >
                            <div className='row py-2'>
                                <div className='col-5'>
                                    <NdNumberBox id="txtUnitQuantity" parent={this} simple={true} maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.txtUnitFactor.value = parseFloat((this.txtUnitQuantity.value / this.txtUnitQuantity2.value).toFixed(6))
                                    }).bind(this)}/>
                                </div>
                                <div className='col-1'><h5>/</h5></div>
                                <div className='col-6'>
                                    <NdNumberBox id="txtUnitQuantity2" parent={this} simple={true}  
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                        this.txtUnitFactor.value = parseFloat((this.txtUnitQuantity.value / this.txtUnitQuantity2.value).toFixed(6))
                                    }).bind(this)}/>
                                </div>
                            </div>
                            <NdForm colCount={2} height={'fit-content'}>
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("txtUnitFactor")} alignment="right" />
                                    <NdTextBox id="txtUnitFactor" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                </NdItem>
                            </NdForm>
                        </NdDialog>
                    </div>     
                    {/* AÇIKLAMA POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popDescription"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDescription.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'800'}
                        height={'auto'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <div className='col-12'>
                                        <Toolbar>
                                            <Item location="after">
                                                <Button icon="add"
                                                onClick={async()=>
                                                {                                                        
                                                    await this.popItemLang.show();
                                                }}/>
                                            </Item>
                                        </Toolbar>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdLang"} 
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
                                                <Column dataField="ITEM_LANGUAGE" caption={this.t("grdLang.clmLang")} width={250} allowEditing={false}/>
                                                <Column dataField="TRANSLATED_NAME" caption={this.t("grdLang.clmName")} allowEditing={false}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </NdItem>    
                                <NdItem>
                                    <NdLabel  text={this.t("popDescription.label")} alignment="right" />
                                </NdItem>
                                <NdItem>
                                    <NdTextArea simple={true} parent={this} id="txtDescription" height='100px' dt={{data:this.itemsObj.dt('ITEMS'),field:"DESCRIPTION"}}
                                    param={this.param.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtDescription',USERS:this.user.CODE})}
                                    />
                                </NdItem> 
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={async (e)=>
                                            {       
                                               this.itemsObj.dt()[0].DESCRIPTION = this.txtDescription.value
                                               this.popDescription.hide()
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popDescription.hide()
                                            }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    {/* URUN DILI POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popItemLang"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popItemLang.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popItemLang.cmbPopItemLanguage")} alignment="right" />
                                    <div className="col-8 p-0">
                                        <NdSelectBox simple={true} parent={this} id="cmbPopItemLanguage"
                                        displayExpr="NAME"                       
                                        valueExpr="CODE"
                                        value=""
                                        searchEnabled={true} showClearButton={true}
                                        data={{source:{select:{query:`SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC`},sql:this.core.sql}}}/>
                                    </div>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItemLang.cmbPopItemLangName")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="cmbPopItemLangName" value=""
                                    data={{source:{select:{query:`SELECT TRANSLATED_NAME FROM ITEM_LANG`},sql:this.core.sql}}}/>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemLang.empty};
                                                
                                                tmpEmpty.ITEM_LANGUAGE = this.cmbPopItemLanguage.value
                                                tmpEmpty.TRANSLATED_NAME = this.cmbPopItemLangName.value
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                this.itemsObj.itemLang.addEmpty(tmpEmpty); 
                                                this.popItemLang.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popItemLang.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>
                    {/* SuperSonic Analytics Popup */}
                    <div>
                        <NdPopUp parent={this} id={"popSuperSonicAnalytics"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"🚀 Analytics - " + this.t("popAnalysis.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'1400'}
                        height={'900'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        onShown={async()=>
                        {
                            setTimeout(async () => 
                            {
                                await this.loadSuperSonicAnalytics()
                            }, 50)
                        }}
                        >
                            <div style={{padding: '20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
                                <div style={{marginBottom: '20px', textAlign: 'center', padding: '15px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                    <h3 style={{color: '#007acc', margin: '0', marginBottom: '10px'}}>🚀 {this.lang.t("analyticsDashboard")}</h3>
                                    <p style={{color: '#666', margin: '5px 0'}}>{this.lang.t("item")}: <strong style={{color: '#007acc'}}>{this.txtRef?.value || 'Seçili Değil'}</strong> | 
                                    {this.lang.t("data")}: <strong style={{color: '#007acc'}}>{this.state.dataSource?.length || 0}</strong> {this.lang.t("record")}</p>
                                </div>

                                <div style={{marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                    <h5 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>🚀 Analytics Control Panel</h5>
                                    <div className="row">
                                        <div className="col-3">
                                            <button className={`btn ${this.state.chartMode === 'quantity' ? 'btn-success' : 'btn-secondary'}`} style={{width: '100%', fontSize: '12px'}} onClick={() => {
                                                this.setState({chartMode: 'quantity'})
                                            }}>📊 {this.lang.t("quantityChart.title")}</button>
                                        </div>
                                        <div className="col-3">
                                            <button className={`btn ${this.state.chartMode === 'price' ? 'btn-success' : 'btn-info'}`} style={{width: '100%', fontSize: '12px'}} onClick={() => {
                                                this.setState({chartMode: 'price'})
                                            }}>💰 {this.lang.t("priceChart.title")}</button>
                                        </div>
                                        <div className="col-3">
                                            <button className={`btn ${this.state.chartMode === 'stock' ? 'btn-success' : 'btn-dark'}`} style={{width: '100%', fontSize: '12px'}} onClick={() => {
                                                this.setState({chartMode: 'stock'})
                                            }}>📦 {this.lang.t("stockChart.title")}</button>
                                        </div>
                                        <div className="col-3">
                                            <button className="btn btn-warning" style={{width: '100%', fontSize: '12px'}} onClick={() => this.exportAnalytics()}>💾 Export</button>
                                        </div>
                                    </div>
                                </div>

                                <NdForm colCount={3} height={'fit-content'}>
                                    <NdItem colSpan={2}>
                                        <div className="col-12" style={{padding: '10px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                                            <label style={{color: '#007acc', fontWeight: 'bold', marginBottom: '10px', display: 'block'}}>📅 {this.lang.t("dateRange")}</label>
                                            <NbDateRange id={"dtDate"} parent={this} startDate={ moment().startOf('month')} endDate={moment(new Date())}/>
                                        </div>
                                    </NdItem>
                                    <NdItem>
                                        <div style={{padding: '10px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                                            <label style={{color: '#007acc', fontWeight: 'bold', marginBottom: '10px', display: 'block'}}>🔄 {this.lang.t("refreshData")}</label>
                                            <NdButton id="btnGet" parent={this} text={"🚀 " + this.t("btnGet")} type="success" width='100%'
                                            onClick={async()=>
                                            {
                                                App.instance.setState({isExecute:true})

                                                try 
                                                {
                                                    await this.loadSuperSonicAnalytics()
                                                } 
                                                catch (err) 
                                                {
                                                    console.error(err)
                                                }
                                                App.instance.setState({isExecute:false})
                                            }}/>
                                        </div>
                                    </NdItem>
                                    <NdItem>
                                        <div style={{padding: '10px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                                            <NdLabel text={"📊 " + this.t("cmbAnlysType")} alignment="right" />
                                            <NdSelectBox simple={true} parent={this} id="cmbAnlysType" height='fit-content'
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            data={{source:[{ID:0,VALUE:"🛒 " + this.t("cmbAnlysTypeData.pos")},{ID:1,VALUE:"📄 " + this.t("cmbAnlysTypeData.invoice")}]}}
                                            onValueChanged={(async(e)=>
                                            {
                                                if(e.value !== e.previousValue && e.previousValue !== undefined) 
                                                {
                                                    App.instance.setState({isExecute:true})
                                                    
                                                    this.setState({
                                                        quantityChartData: null,
                                                        priceChartData: null,
                                                        stockChartData: null,
                                                        linearRegressionData: null,
                                                        monteCarloPredictionData: null,
                                                        stockPredictionData: null,
                                                        totalSalesStats: null,
                                                        azurePricePrediction: null,
                                                        reorderRecommendation: null,
                                                        dataSource: null
                                                    }, async () => 
                                                    {
                                                        this.forceUpdate()
                                                        await this.loadSuperSonicAnalytics()

                                                        App.instance.setState({isExecute:false}) 
                                                    })
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'cmbAnlysType',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbAnlysType',USERS:this.user.CODE})}
                                            />
                                        </div>
                                    </NdItem>       
                                
                                    {/* Grafikler */}
                                    <NdItem colSpan={3}>
                                        <div style={{padding: '15px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '10px'}}>
                                            <h6 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>📊 {this.lang.t("analyticsChart.title")}</h6>
                                            
                                            {/* Miktar Grafiği */}
                                            {this.state.chartMode === 'quantity' && this.state.quantityChartData && this.state.quantityChartData.length > 0 && (
                                                console.log('📊 Rendering quantity chart with data:', this.state.quantityChartData),
                                                <div style={{marginBottom: '20px'}}>
                                                    <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>📊 {this.lang.t("quantityChart.title")}</h6>
                                                    
                                                    {/* Ana Miktar Grafiği */}
                                                    <Chart id="quantityChart" dataSource={this.state.quantityChartData} height={300}>
                                                        <CommonSeriesSettings
                                                            argumentField="DOC_DATE_STR"
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
                                                            argumentField="DOC_DATE_STR"
                                                            name={this.lang.t("quantityChart.sales")}
                                                            type="bar"
                                                            color="#4ecdc4" />
                                                    </Chart>
                                                    
                                                    {/* Miktar Analiz Detayları */}
                                                    {this.state.totalSalesStats && (
                                                        <div style={{marginTop: '15px', padding: '15px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '10px'}}>
                                                            <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>📈 {this.lang.t("quantityChart.analysis")}</h6>
                                                            <div className="row">
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#4ecdc4'}}>{parseFloat(this.state.totalSalesStats.totalQuantity || 0).toFixed(0)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("quantityChart.totalSales")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b'}}>{parseFloat(this.state.totalSalesStats.avgDaily || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("quantityChart.avgDaily")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#feca57'}}>{parseFloat(this.state.totalSalesStats.maxDaily || 0).toFixed(0)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("quantityChart.maxDaily")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#667eea'}}>{parseFloat(this.state.totalSalesStats.totalDays || 0).toFixed(0)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("quantityChart.totalDays")}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Fiyat Grafiği */}
                                            {this.state.chartMode === 'price' && this.state.priceChartData && this.state.priceChartData.length > 0 && (
                                                console.log('💰 Rendering price chart with data:', this.state.priceChartData),
                                                <div style={{marginBottom: '20px'}}>
                                                    <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>💰 {this.lang.t("priceChart.title")}</h6>
                                                    
                                                    {/* Ana Fiyat Grafiği */}
                                                    <Chart id="priceChart" dataSource={this.state.priceChartData} height={300}>
                                                        <CommonSeriesSettings
                                                            argumentField="DOC_DATE_STR"
                                                            type="line"
                                                            hoverMode="allArgumentPoints"
                                                            selectionMode="allArgumentPoints"
                                                        >
                                                            <Label visible={true}>
                                                                <Format type="fixedPoint" precision={2} />
                                                            </Label>
                                                        </CommonSeriesSettings>
                                                        
                                                        {/* Satış Fiyatı */}
                                                        <Series
                                                            valueField="AVG_PRICE"
                                                            argumentField="DOC_DATE_STR"
                                                            name={this.lang.t("priceChart.salePrice")}
                                                            type="line"
                                                            color="#ff6b6b" />
                                                        
                                                        {/* Maliyet Fiyatı */}
                                                        <Series
                                                            valueField="AVG_COST"
                                                            argumentField="DOC_DATE_STR"
                                                            name={this.lang.t("priceChart.costPrice")}
                                                            type="line"
                                                            color="#667eea" />
                                                        
                                                        {/* Linear Regression Tahmini */}
                                                        {this.state.linearRegressionData && this.state.linearRegressionData.length > 0 && (
                                                            <Series
                                                                valueField="LINEAR_PREDICTION"
                                                                argumentField="DOC_DATE_STR"
                                                                name={this.lang.t("priceChart.linearRegression")}
                                                                type="line"
                                                                color="#4ecdc4" />
                                                        )}
                                                        
                                                        {/* Monte Carlo Tahmini */}
                                                        {this.state.monteCarloPredictionData && this.state.monteCarloPredictionData.length > 0 && (
                                                            <Series
                                                                valueField="MONTECARLO_PREDICTION"
                                                                argumentField="DOC_DATE_STR"
                                                                name={this.lang.t("priceChart.monteCarlo")}
                                                                type="line"
                                                                color="#feca57" />
                                                        )}
                                                        
                                                        {/* ARIMA Tahmini */}
                                                        {this.state.arimaPredictionData && this.state.arimaPredictionData.length > 0 && (
                                                            <Series
                                                                valueField="ARIMA_PREDICTION"
                                                                argumentField="DOC_DATE_STR"
                                                                name={this.lang.t("priceChart.arima")}
                                                                type="line"
                                                                color="#a8e6cf" />
                                                        )}
                                                    </Chart>
                                                    
                                                    {/* Fiyat Analiz Detayları */}
                                                    {this.state.azurePricePrediction && (
                                                        <div style={{marginTop: '15px', padding: '15px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '10px'}}>
                                                            <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>📊 {this.lang.t("priceChart.analysis")}</h6>
                                                            <div className="row">
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b'}}>€{parseFloat(this.state.azurePricePrediction.currentSalePrice || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.currentPrice")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#667eea'}}>€{parseFloat(this.state.azurePricePrediction.currentCost || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.currentCost")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#4ecdc4'}}>€{parseFloat(this.state.azurePricePrediction.suggestedPrice || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.suggestedPrice")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#feca57'}}>%{parseFloat(this.state.azurePricePrediction.margin || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.margin")}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#a8e6cf'}}>{this.state.azurePricePrediction.priceTrend || 'N/A'}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.trend")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#ff9a9e'}}>€{parseFloat(this.state.azurePricePrediction.profit || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.profit")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#7fcdcd'}}>€{parseFloat(this.state.azurePricePrediction.optimalPrice || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("priceChart.optimalPrice")}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Stok Grafiği */}
                                            {this.state.chartMode === 'stock' && this.state.stockChartData && this.state.stockChartData.length > 0 && (
                                                <div style={{marginBottom: '20px'}}>
                                                    <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>📦 {this.lang.t("stockChart.title")}</h6>
                                                    
                                                    {/* Ana Stok Grafiği */}
                                                    <Chart id="stockChart" dataSource={this.state.stockChartData} height={300}>
                                                        <CommonSeriesSettings
                                                            argumentField="DOC_DATE_STR"
                                                            type="area"
                                                            hoverMode="allArgumentPoints"
                                                            selectionMode="allArgumentPoints"
                                                        >
                                                            <Label visible={true}>
                                                                <Format type="fixedPoint" precision={0} />
                                                            </Label>
                                                        </CommonSeriesSettings>
                                                        <Series
                                                            valueField="STOCK_LEVEL"
                                                            argumentField="DOC_DATE_STR"
                                                            name={this.lang.t("stockChart.stock")}
                                                            type="area"
                                                            color="#feca57" />
                                                        {this.state.stockPredictionData && this.state.stockPredictionData.length > 0 && (
                                                            <Series
                                                                dataSource={this.state.stockPredictionData}
                                                                valueField="predictedStock"
                                                                argumentField="date"
                                                                name={this.lang.t("stockChart.prediction")}
                                                                type="line"
                                                                color="#a8e6cf" />
                                                        )}
                                                    </Chart>
                                                    
                                                    {/* Stok Analiz Detayları */}
                                                    {this.state.reorderRecommendation && (
                                                        <div style={{marginTop: '15px', padding: '15px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: '10px'}}>
                                                            <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>📦 {this.lang.t("stockChart.analysis")}</h6>
                                                            <div className="row">
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#feca57'}}>{parseFloat(this.state.reorderRecommendation.currentStock || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.currentStock")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#4ecdc4'}}>{parseFloat(this.state.reorderRecommendation.avgDailySales || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.avgDailySales")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b'}}>{parseFloat(this.state.reorderRecommendation.suggestedOrder || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.suggestedOrder")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '16px', fontWeight: 'bold', color: '#667eea'}}>{parseFloat(this.state.reorderRecommendation.daysUntilStockout || 0).toFixed(0)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.daysUntilStockout")}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#a8e6cf'}}>{this.state.reorderRecommendation.status || 'N/A'}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.status")}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div style={{textAlign: 'center', padding: '10px'}}>
                                                                        <div style={{fontSize: '14px', fontWeight: 'bold', color: '#7fcdcd'}}>{parseFloat(this.state.reorderRecommendation.safetyStock || 0).toFixed(2)}</div>
                                                                        <div style={{fontSize: '12px', color: '#666'}}>{this.lang.t("stockChart.safetyStock")}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Veri yoksa mesaj göster */}
                                            {(!this.state.dataSource || this.state.dataSource.length === 0) && (
                                                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                                    <div style={{fontSize: '48px', marginBottom: '10px'}}>📊</div>
                                                    <div style={{fontSize: '18px', fontWeight: 'bold'}}>{this.lang.t("analyticsChart.noData")}</div>
                                                    <div style={{fontSize: '14px', marginTop: '5px'}}>{this.lang.t("analyticsChart.noDataFound")}</div>
                                                </div>
                                            )}
                                        </div>
                                    </NdItem>
                                </NdForm>
                            
                            <div style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div style={{flex: 1, padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white', textAlign: 'center'}}>
                                        <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '5px'}}>€{parseFloat(this.state.azurePricePrediction?.currentCost || 0).toFixed(2)}</div>
                                        <div style={{fontSize: '14px', opacity: 0.9}}>💰 {this.lang.t("analyticsChart.costPrice")}</div>
                                    </div>
                                    <div style={{flex: 1, padding: '20px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', borderRadius: '15px', color: 'white', textAlign: 'center'}}>
                                        <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '5px'}}>€{parseFloat(this.state.azurePricePrediction?.currentSalePrice || 0).toFixed(2)}</div>
                                        <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.7}}>{this.lang.t("analyticsChart.salePrice")}</div>
                                    </div>
                                </div>
                                
                                {/* Analiz Bilgileri */}
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{parseFloat(this.state.reorderRecommendation?.avgDailySales || 0).toFixed(2)}</div>
                                        <div style={{fontSize: '12px'}}>📈 {this.lang.t("analyticsChart.avgDailySales")}</div>
                                    </div>
                                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{parseFloat(this.state.reorderRecommendation?.currentStock || 0).toFixed(2)}</div>
                                        <div style={{fontSize: '12px'}}>📦 {this.lang.t("analyticsChart.currentStock")}</div>
                                    </div>
                                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>%{parseFloat(this.state.azurePricePrediction?.margin || 0).toFixed(2)}</div>
                                        <div style={{fontSize: '12px'}}>💹 {this.lang.t("analyticsChart.margin")}</div>
                                    </div>
                                </div>
                                
                                {this.renderDetailPanel()}

                            </div>
                        </div>
                    </NdPopUp>
                    
                    </div>
                    <div>
                        <NdAccessEdit id={"accesComp"} parent={this}/>
                    </div>                            
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }

    // SuperSonic Analytics Matematik Fonksiyonları
    async mathematicalPriceAnalysis() 
    {
        try 
        {
            let currentPrice = this.itemsObj.dt('ITEM_PRICE')[0]?.PRICE || 0;
            let currentSalePrice = this.txtSalePrice?.value || currentPrice;

            let currentCost = 0;
            try 
            {
                let costQuery = 
                {
                    query: `SELECT COST_PRICE FROM ITEMS_VW_04 WHERE CODE = @CODE`,
                    param: ['CODE:string|50'],
                    value: [this.txtRef?.value]
                };

                let costData = await this.core.sql.execute(costQuery);

                if (costData.result.recordset.length > 0) 
                {
                    currentCost = costData.result.recordset[0].COST_PRICE || 0;
                }
            } 
            catch (error) 
            {
                currentCost = this.itemsObj.dt('ITEM_PRICE')[0]?.COST || 0;
            }
            
            let margin = currentSalePrice > 0 ? ((currentSalePrice - currentCost) / currentSalePrice * 100) : 0;
            let profit = currentSalePrice - currentCost;

            let suggestedPrice = this.calculateOptimalPrice(currentCost, currentSalePrice, this.state.dataSource);
            let optimalPrice = this.calculateOptimalPrice(currentCost, currentSalePrice, this.state.dataSource, 0.30);
            let priceVolatility = this.calculatePriceVolatility(this.state.dataSource);
            
            let priceTrend = this.analyzePriceTrend(this.state.dataSource);

            let elasticity = this.calculatePriceElasticity(this.state.dataSource);
            
            let priceAnalysis = {
                currentPrice: currentPrice,
                currentCost: currentCost,
                currentSalePrice: currentSalePrice,
                margin: margin,
                profit: profit,
                suggestedPrice: suggestedPrice,
                optimalPrice: optimalPrice,
                priceTrend: priceTrend.direction,
                priceVolatility: priceVolatility,
                elasticity: elasticity,
                trendStrength: priceTrend.strength,
                confidenceLevel: priceTrend.confidence
            };
            
            this.setState({azurePricePrediction: priceAnalysis});
            return priceAnalysis;
        } 
        catch (error) 
        {
            console.error('❌ Mathematical price analysis error:', error)
        }
    }

    calculateOptimalPrice(cost, currentPrice, salesData, targetMargin = 0.30) 
    {
        if (!salesData || salesData.length === 0) 
        {
            return cost * (1 + targetMargin);
        }
        
        let priceQuantityPairs = salesData.map(item => (
        {
            price: item.PRICE || currentPrice,
            quantity: item.QUANTITY || 0
        }))
        .filter(pair => pair.quantity > 0);
        
        if (priceQuantityPairs.length === 0) 
        {
            return cost * (1 + targetMargin);
        }
        
        let correlation = this.calculatePriceQuantityCorrelation(priceQuantityPairs);
        
        let elasticity = Math.abs(correlation);
        let optimalMargin = elasticity > 1 ? targetMargin * 0.8 : targetMargin * 1.2;
        
        return cost * (1 + optimalMargin);
    }

    calculatePriceVolatility(salesData) 
    {
        if (!salesData || salesData.length < 2) 
        {
            return 0;
        }
        
        let prices = salesData.map(item => item.PRICE || 0).filter(price => price > 0);

        if (prices.length < 2) 
        {
            return 0;
        }
        
        let mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        let variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        
        return Math.sqrt(variance) / mean;
    }

    analyzePriceTrend(salesData) 
    {
        if (!salesData || salesData.length < 3) 
        {
            return { direction: this.lang.t("analyticsChart.stable"), strength: this.lang.t("analyticsChart.low"), confidence: 0.5 };
        }

        let timeSeries = salesData
            .sort((a, b) => new Date(a.DOC_DATE) - new Date(b.DOC_DATE))
            .map(item => item.PRICE || 0)
            .filter(price => price > 0);
        
        if (timeSeries.length < 3) 
        {
            return { direction: this.lang.t("analyticsChart.stable"), strength: this.lang.t("analyticsChart.low"), confidence: 0.5 };
        }
        
        let trend = this.calculateLinearRegression(timeSeries);
        
        let direction = trend.slope > 0.01 ? this.lang.t("analyticsChart.rising") : trend.slope < -0.01 ? this.lang.t("analyticsChart.falling") : this.lang.t("analyticsChart.stable");
        let strength = Math.abs(trend.slope) > 0.05 ? this.lang.t("analyticsChart.high") : Math.abs(trend.slope) > 0.02 ? this.lang.t("analyticsChart.medium") : this.lang.t("analyticsChart.low");
        let confidence = Math.min(trend.rSquared, 0.95);
        
        return { direction, strength, confidence };
    }

    calculatePriceElasticity(salesData) 
    {
        if (!salesData || salesData.length < 4) 
        {
            return 0;
        }
        
        let changes = [];
        
        for (let i = 1; i < salesData.length; i++) 
        {
            let prev = salesData[i-1];
            let curr = salesData[i];
            
            if (prev.PRICE && curr.PRICE && prev.QUANTITY && curr.QUANTITY) 
            {
                let priceChange = (curr.PRICE - prev.PRICE) / prev.PRICE;
                let quantityChange = (curr.QUANTITY - prev.QUANTITY) / prev.QUANTITY;
                
                if (priceChange !== 0) 
                {
                    changes.push(quantityChange / priceChange);
                }
            }
        }
        
        if (changes.length === 0) 
        {
            return 0;
        }
        
        return changes.reduce((sum, change) => sum + change, 0) / changes.length;
    }

    calculatePriceQuantityCorrelation(priceQuantityPairs) 
    {
        if (priceQuantityPairs.length < 2) 
        {
            return 0;
        }
        
        let prices = priceQuantityPairs.map(pair => pair.price);
        let quantities = priceQuantityPairs.map(pair => pair.quantity);
        
        let meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        let meanQuantity = quantities.reduce((sum, qty) => sum + qty, 0) / quantities.length;
        
        let numerator = 0;
        let denominatorPrice = 0;
        let denominatorQuantity = 0;
        
        for (let i = 0; i < prices.length; i++) 
        {
            let priceDiff = prices[i] - meanPrice;
            let quantityDiff = quantities[i] - meanQuantity;
            
            numerator += priceDiff * quantityDiff;
            denominatorPrice += priceDiff * priceDiff;
            denominatorQuantity += quantityDiff * quantityDiff;
        }
        
        let denominator = Math.sqrt(denominatorPrice * denominatorQuantity);
        return denominator !== 0 ? numerator / denominator : 0;
    }

    async calculateReorderRecommendation() 
    {
        try 
        {
            let currentStock = 0;
            let depotStocks = [];
            
            try {
                let stockQuery = 
                {
                    
                    source : 
                    {
                        select : 
                        {
                            query : `SELECT NAME,CODE,UNIT_NAME,
                                    ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM_BARCODE.ITEM = ITEMS_VW_01.GUID ORDER BY LDATE DESC),'') AS BARCODE,
                                    [dbo].[FN_DEPOT_QUANTITY](GUID,@DEPOT,dbo.GETDATE()) AS QUANTITY FROM ITEMS_VW_01 
                                    WHERE ((NAME like @NAME + '%') OR (@NAME = ''))`,
                            param : ['CODE:string|50','DEPOT:string|50'],
                            value : [this.txtRef?.value,this.cmbPopPriDepot.value]
                        },
                        sql : this.core.sql
                    }
                };
                
                let stockData = await this.core.sql.execute(stockQuery);
                console.log('this.cmbPopPriDepot.value',this.cmbPopPriDepot.value);
                console.log('stockData',stockData);
                
                if (stockData.result.recordset.length > 0) 
                {
                    depotStocks = stockData.result.recordset;
                    currentStock = depotStocks.reduce((sum, depot) => sum + (depot.QUANTITY || 0), 0);
                } 
                else 
                {
                    return
                }
            } 
            catch (error) 
            {
                console.log(error)
            }
            
            let avgDailySales = 0; // Varsayılan değer

            if (this.state.dataSource && this.state.dataSource.length > 0) 
            {
                let totalQuantity = this.state.dataSource.reduce((sum, item) => sum + (parseFloat(item.QUANTITY) || 0), 0);
                let totalDays = this.state.dataSource.length;

                avgDailySales = totalDays > 0 ? totalQuantity / totalDays : 10;
            }
            
            // Sabit parametreler
            let leadTime = 7; // Tedarik süresi (gün) BAAAAK
            let safetyStock = avgDailySales * 2; // Güvenlik stoku BAAAK
            
            let reorderPoint = (avgDailySales * leadTime) + safetyStock;
            let suggestedOrder = reorderPoint - currentStock;
            
            // Stok tükenme günü hesaplama
            let daysUntilStockout = currentStock > 0 && avgDailySales > 0 ? Math.floor(currentStock / avgDailySales) : 0;
            
            // Durum belirleme
            let status = this.lang.t("analyticsChart.stockStatus");
            
            if (currentStock <= 0) 
            {
                status = this.lang.t("analyticsChart.stockStatus1");
            } 
            else if (currentStock < safetyStock) 
            {
                status = this.lang.t("analyticsChart.stockStatus2");
            } 
            else if (currentStock < reorderPoint) 
            {
                status = this.lang.t("analyticsChart.stockStatus3");
            } 
            else if (daysUntilStockout <= 7) 
            {
                status = this.lang.t("analyticsChart.stockStatus4");
            }

           let reorderRecommendation = 
            {
                currentStock: parseFloat(currentStock.toFixed(2)),
                avgDailySales: parseFloat(avgDailySales.toFixed(2)),
                leadTime: leadTime,
                safetyStock: parseFloat(safetyStock.toFixed(2)),
                reorderPoint: parseFloat(reorderPoint.toFixed(2)),
                suggestedOrder: parseFloat((suggestedOrder > 0 ? suggestedOrder : 0).toFixed(2)),
                status: status,
                daysUntilStockout: daysUntilStockout,
                depotStocks: depotStocks
            };
            
            this.setState({reorderRecommendation: reorderRecommendation});
            return reorderRecommendation;
        } 
        catch (error) 
        {
            console.error(error)
        }
    }

    calculateLinearRegression(data) 
    {
        if (!data || data.length < 2) 
        {
            return { slope: 0, intercept: 0, rSquared: 0 };
        }
        
        let n = data.length;
        let xValues = Array.from({length: n}, (_, i) => i + 1);
        
        // Ortalama hesaplama
        let meanX = xValues.reduce((sum, x) => sum + x, 0) / n;
        let meanY = data.reduce((sum, y) => sum + y, 0) / n;
        
        // Slope ve intercept hesaplama
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < n; i++) {
            numerator += (xValues[i] - meanX) * (data[i] - meanY);
            denominator += Math.pow(xValues[i] - meanX, 2);
        }
        
        let slope = denominator !== 0 ? numerator / denominator : 0;
        let intercept = meanY - slope * meanX;
        
        // R-squared hesaplama
        let predictedValues = xValues.map(x => slope * x + intercept);
        let ssRes = data.reduce((sum, y, i) => sum + Math.pow(y - predictedValues[i], 2), 0);
        let ssTot = data.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
        let rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
        
        let result = { slope, intercept, rSquared };
        
        return result;
    }

    calculateMonteCarloPrediction(data, days) 
    {
        if (!data || data.length === 0) 
        {
            return [];
        }
        
        let mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        let stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
        
        // 1000 deneme yap (sabit değer)
        let allPredictions = [];
        
        for (let simulation = 0; simulation < 1000; simulation++) 
        {
            let predictions = [];
            let currentValue = mean;
            
            for (let day = 1; day <= days; day++) 
            {
                // Random walk with drift
                let randomChange = (Math.random() - 0.5) * stdDev * 0.1;
                let trendComponent = mean * 0.01; // Küçük trend bileşeni

                currentValue = Math.max(0, currentValue + randomChange + trendComponent);
                
                predictions.push(
                {
                    day: day,
                    predictedValue: Math.round(currentValue * 100) / 100
                });
            }
            allPredictions.push(predictions);
        }
        
        // Ortalama tahminleri hesapla
        let averagePredictions = [];
        for (let day = 1; day <= days; day++) 
        {
            let dayPredictions = allPredictions.map(sim => sim[day - 1]?.predictedValue || 0);
            let averageValue = dayPredictions.reduce((sum, val) => sum + val, 0) / dayPredictions.length;
            
            averagePredictions.push(
            {
                day: day,
                predictedValue: Math.round(averageValue * 100) / 100
            });
        }
        
        return averagePredictions;
    }

    calculateMonteCarloPredictionWithDates(data, xValues) 
    {
        if (!data || data.length === 0 || !xValues || xValues.length !== data.length) 
        {
            return [];
        }
        
        let mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        let stdDev = Math.sqrt(data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length);
        
        // 1000 deneme yap (sabit değer)
        let allPredictions = [];
        
        for (let simulation = 0; simulation < 1000; simulation++) 
        {
            let predictions = [];
            let currentValue = mean;
            
            for (let i = 0; i < xValues.length; i++) 
            {
                let day = xValues[i];
                // Random walk with drift (tarih bazlı)
                let randomChange = (Math.random() - 0.5) * stdDev * 0.1;
                let trendComponent = mean * 0.01 * (day / 30); // Gün bazlı trend

                currentValue = Math.max(0, currentValue + randomChange + trendComponent);
                
                predictions.push(
                {
                    day: day,
                    predictedValue: Math.round(currentValue * 100) / 100
                });
            }
            allPredictions.push(predictions);
        }
        
        // Ortalama tahminleri hesapla
        let averagePredictions = [];

        for (let i = 0; i < xValues.length; i++) 
        {
            let day = xValues[i];
            let dayPredictions = allPredictions.map(sim => sim[i]?.predictedValue || 0);
            let averageValue = dayPredictions.reduce((sum, val) => sum + val, 0) / dayPredictions.length;
            
            averagePredictions.push(
            {
                day: day,
                predictedValue: Math.round(averageValue * 100) / 100
            });
        }
        
        return averagePredictions;
    }

    calculateARIMAPrediction(data) {
        if (!data || data.length < 3) 
        {
            return [];
        }
        
        // ARIMA(1,1,1) modeli - Basit implementasyon
        let n = data.length;
        let predictions = [];
        
        // İlk değer için ortalama kullan
        predictions.push(
        {
            day: 1,
            predictedValue: data[0]
        });
        
        // ARIMA(1,1,1) hesaplama
        // Y_t = Y_{t-1} + φ(Y_{t-1} - Y_{t-2}) + θ*ε_{t-1}
        // φ (AR parametresi) = 0.3, θ (MA parametresi) = 0.2
        let phi = 0.3; // AR parametresi
        let theta = 0.2; // MA parametresi
        
        for (let i = 1; i < n; i++) 
        {
            let predictedValue;
            
            if (i === 1) 
            {
                // İkinci değer için basit trend
                let trend = data[1] - data[0];
                predictedValue = data[0] + trend;
            } 
            else 
            {
                // ARIMA(1,1,1) formülü
                let diff = data[i-1] - data[i-2]; // Birinci fark
                let arComponent = phi * diff; // AR bileşeni
                let maComponent = theta * (data[i-1] - predictions[i-1].predictedValue); // MA bileşeni
                predictedValue = data[i-1] + arComponent + maComponent;
            }
            
            predictions.push(
            {
                day: i + 1,
                predictedValue: Math.round(Math.max(0, predictedValue) * 100) / 100
            });
        }
        
        return predictions;
    }

    async loadSuperSonicAnalytics() 
    {
        try 
        {
            
            // Temel ürün bilgilerini yükle
            await this.loadBasicProductInfo();
            
            // Analiz tipine göre veri yükle
            let analysisType = this.cmbAnlysType?.value || 0;
            
            if (analysisType === 0) 
            {
                // POS analizi
                await this.loadPOSAnalytics();
            } 
            else 
            {
                // Invoice analizi
                await this.loadInvoiceAnalytics();
            }
            
            // Matematiksel analizleri çalıştır
            await this.mathematicalPriceAnalysis();
            await this.calculateReorderRecommendation();
            
            // Güvenli erişim - this.state.dataSource undefined olabilir
            let dataSource = this.state.dataSource || [];
            await this.calculateStockPrediction(dataSource);
            
        } 
        catch (error) 
        {
            console.error('❌ SuperSonic Analytics hatası:', error);
        }
    }

    async loadBasicProductInfo() 
    {
        try 
        {
            let itemCode = this.txtRef?.value;

            if (!itemCode) 
            {
                return;
            }
            
            // Güvenli erişim - this.itemsObj.dt() undefined olabilir
            let itemsData = this.itemsObj?.dt?.() || [];
            let itemPriceData = this.itemsObj?.dt?.('ITEM_PRICE') || [];
            let itemStockData = this.itemsObj?.dt?.('ITEM_STOCK') || [];
            
            // Ürün temel bilgilerini al
            let basicInfo = 
            {
                code: itemCode,
                name: itemsData[0]?.NAME || 'Bilinmeyen Ürün',
                currentPrice: itemPriceData[0]?.PRICE || 0,
                currentCost: itemPriceData[0]?.COST || 0,
                currentStock: itemStockData[0]?.QUANTITY || 0
            };
            
            return basicInfo;
        } 
        catch (error) 
        {
            console.error('❌ Basic product info error:', error);
            // Hata durumunda varsayılan değerler döndür
            return {
                code: itemCode,
                name: 'Bilinmeyen Ürün',
                currentPrice: 0,
                currentCost: 0,
                currentStock: 0
            };
        }
    }

    async loadPOSAnalytics() 
    {
        try 
        {
            let itemCode = this.txtRef?.value;
            let startDate = this.dtDate?.startDate;
            let endDate = this.dtDate?.endDate;
            
            if (!itemCode || !startDate || !endDate) {
                return;
            }
            
            // POS satış verilerini çek - ITEMS_VW_04'ten maliyet fiyatı ile
            let posQuery = {
                query: `SELECT 
                            SUM(POS.QUANTITY) AS QUANTITY, 
                            CONVERT(NVARCHAR, POS.DOC_DATE, 104) AS DOC_DATE,
                            AVG(POS.PRICE) AS PRICE,
                            AVG(ITEMS.COST_PRICE) AS COST,
                            SUM(POS.QUANTITY * POS.PRICE) AS TOTAL_SALES,
                            SUM(POS.QUANTITY * ITEMS.COST_PRICE) AS TOTAL_COST
                        FROM POS_SALE_VW_01 POS
                        INNER JOIN ITEMS_VW_04 ITEMS ON POS.ITEM_CODE = ITEMS.CODE
                        WHERE POS.ITEM_CODE = @CODE AND POS.DOC_DATE >= @FIRST_DATE AND POS.DOC_DATE <= @LAST_DATE 
                        AND POS.DEVICE <> '9999'
                        GROUP BY POS.DOC_DATE, POS.ITEM_CODE
                        ORDER BY POS.DOC_DATE`,
                param: ['CODE:string|50', 'FIRST_DATE:date', 'LAST_DATE:date'],
                value: [itemCode, startDate, endDate]
            };
            
            let posData = await this.core.sql.execute(posQuery);
            
            if (posData.result.recordset.length > 0) {
                
                // Günlük satış verilerini grupla
                let dailyData = this.groupSalesByDate(posData.result.recordset);
                console.log('🛒 POS Analytics - Daily data:', dailyData);

                // Chart verilerini hazırla
                let quantityChartData = this.prepareQuantityChartData(dailyData);
                let stockChartData = this.prepareStockChartData(dailyData);

                // Linear regression verilerini hazırla
                let priceChartData = this.preparePriceChartData(dailyData);
                let linearRegressionData = this.prepareLinearRegressionData(priceChartData);
                let monteCarloPredictionData = this.prepareMonteCarloPredictionData(priceChartData);
                let arimaPredictionData = this.prepareARIMAPredictionData(priceChartData);
            
                // Fiyat chart verisini tahminlerle birlikte hazırla
                let priceChartDataWithPredictions = this.preparePriceChartDataWithPredictions(dailyData, linearRegressionData, monteCarloPredictionData, arimaPredictionData);

                this.setState(
                {
                    dataSource: posData.result.recordset,
                    quantityChartData: quantityChartData,
                    priceChartData: priceChartDataWithPredictions,
                    stockChartData: stockChartData,
                    linearRegressionData: linearRegressionData,
                    monteCarloPredictionData: monteCarloPredictionData,
                    arimaPredictionData: arimaPredictionData,
                    totalSalesStats: this.calculateTotalSalesStats(dailyData, startDate, endDate)
                });

            } 
            else 
            {
                // Veri yoksa boş array set et
                this.setState({
                    dataSource: [],
                    quantityChartData: [],
                    priceChartData: [],
                    stockChartData: [],
                    linearRegressionData: [],
                    monteCarloPredictionData: [],
                    arimaPredictionData: [],
                    totalSalesStats: null
                });
            }
        } 
        catch (error) 
        {
            console.error(error)
        }
    }

    async loadInvoiceAnalytics() 
    {
        try 
        {
            let itemCode = this.txtRef?.value;
            let startDate = this.dtDate?.startDate;
            let endDate = this.dtDate?.endDate;
            
            if (!itemCode || !startDate || !endDate) {
                return;
            }
            
            // Invoice satış verilerini çek - ITEMS_VW_04'ten maliyet fiyatı ile
            let invoiceQuery = {
                query: `SELECT 
                            SUM(DOC.QUANTITY) AS QUANTITY, 
                            CONVERT(NVARCHAR, DOC.DOC_DATE, 104) AS DOC_DATE,
                            AVG(DOC.PRICE) AS PRICE,
                            AVG(ITEMS.COST_PRICE) AS COST,
                            SUM(DOC.QUANTITY * DOC.PRICE) AS TOTAL_SALES,
                            SUM(DOC.QUANTITY * ITEMS.COST_PRICE) AS TOTAL_COST
                        FROM DOC_ITEMS_VW_01 DOC
                        INNER JOIN ITEMS_VW_04 ITEMS ON DOC.ITEM_CODE = ITEMS.CODE
                        WHERE DOC.ITEM_CODE = @CODE AND DOC.DOC_DATE >= @FIRST_DATE AND DOC.DOC_DATE <= @LAST_DATE 
                        AND DOC.TYPE = 1 AND ((DOC.DOC_TYPE = 20) OR (DOC.DOC_TYPE = 40 AND DOC.INVOICE_DOC_GUID != '00000000-0000-0000-0000-000000000000'))
                        GROUP BY DOC.DOC_DATE, DOC.ITEM_CODE
                        ORDER BY DOC.DOC_DATE`,
                param: ['CODE:string|50', 'FIRST_DATE:date', 'LAST_DATE:date'],
                value: [itemCode, startDate, endDate]
            };
            
            let invoiceData = await this.core.sql.execute(invoiceQuery);
            
            if (invoiceData.result.recordset.length > 0) {
                
                // Günlük satış verilerini grupla
                let dailyData = this.groupSalesByDate(invoiceData.result.recordset);
                
                // Chart verilerini hazırla
                let quantityChartData = this.prepareQuantityChartData(dailyData);
                let priceChartData = this.preparePriceChartData(dailyData);
                let stockChartData = this.prepareStockChartData(dailyData);

                // Linear regression verilerini hazırla
                let linearRegressionData = this.prepareLinearRegressionData(priceChartData);
                let monteCarloPredictionData = this.prepareMonteCarloPredictionData(priceChartData);
                let arimaPredictionData = this.prepareARIMAPredictionData(priceChartData);
                
                // Fiyat chart verisini tahminlerle birlikte hazırla
                let priceChartDataWithPredictions = this.preparePriceChartDataWithPredictions(dailyData, linearRegressionData, monteCarloPredictionData, arimaPredictionData);
                

                this.setState(
                {
                    dataSource: invoiceData.result.recordset,
                    quantityChartData: quantityChartData,
                    priceChartData: priceChartDataWithPredictions,
                    stockChartData: stockChartData,
                    linearRegressionData: linearRegressionData,
                    monteCarloPredictionData: monteCarloPredictionData,
                    arimaPredictionData: arimaPredictionData,
                    totalSalesStats: this.calculateTotalSalesStats(dailyData, startDate, endDate)
                });

            } 
            
        } 
        catch (error) 
        {
            console.error(error)
        }
    }

    exportAnalytics() 
    {
        try 
        {
            // PDF oluştur
            let jsPDF = require('jspdf').jsPDF;
            let doc = new jsPDF();
            
            // Başlık
            doc.setFontSize(20);
            doc.setTextColor(0, 122, 204);
            doc.text(this.lang.t("analyticsChart.title"), 20, 30);
            
            // Ürün bilgileri
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);

            // Güvenli erişim
            let itemsData = this.itemsObj?.dt?.() || [];
            let itemName = itemsData[0]?.NAME || 'Bilinmeyen Ürün';

            doc.text(`${this.lang.t("analyticsChart.productCode")}: ${this.txtRef?.value || 'N/A'}`, 20, 50);
            doc.text(`${this.lang.t("analyticsChart.productName")}: ${itemName}`, 20, 60);
            doc.text(`${this.lang.t("analyticsChart.reportDate")}: ${new Date().toLocaleDateString('fr-FR')}`, 20, 70);
            
            // Fiyat analizi
            if (this.state.azurePricePrediction)
            {
                doc.setFontSize(16);
                doc.setTextColor(0, 122, 204);

                doc.text(this.lang.t("analyticsChart.priceAnalysis"), 20, 90);
                
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);

                doc.text(`${this.lang.t("analyticsChart.costPrice")}: €${parseFloat(this.state.azurePricePrediction?.currentCost || 0).toFixed(2)}`, 20, 105);
                doc.text(`${this.lang.t("analyticsChart.salePrice")}: €${parseFloat(this.state.azurePricePrediction?.currentSalePrice || 0).toFixed(2)}`, 20, 115);
                doc.text(`${this.lang.t("analyticsChart.suggestedPrice")}: €${parseFloat(this.state.azurePricePrediction?.suggestedPrice || 0).toFixed(2)}`, 20, 125);
                doc.text(`${this.lang.t("analyticsChart.profitMargin")}: %${parseFloat(this.state.azurePricePrediction?.margin || 0).toFixed(2)}`, 20, 135);
            }
            
            // Stok analizi
            if (this.state.reorderRecommendation)
            {
                doc.setFontSize(16);
                doc.setTextColor(0, 122, 204);
                doc.text(this.lang.t("analyticsChart.stockAnalysis"), 20, 155);
                
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);

                doc.text(`${this.lang.t("analyticsChart.avgDailySales")}: ${parseFloat(this.state.reorderRecommendation?.avgDailySales || 0).toFixed(2)}`, 20, 170);
                doc.text(`${this.lang.t("analyticsChart.currentStock")}: ${parseFloat(this.state.reorderRecommendation?.currentStock || 0).toFixed(2)}`, 20, 180);
                doc.text(`${this.lang.t("analyticsChart.suggestedOrder")}: ${parseFloat(this.state.reorderRecommendation?.suggestedOrder || 0).toFixed(2)}`, 20, 190);
                doc.text(`${this.lang.t("analyticsChart.daysUntilStockout")}: ${parseFloat(this.state.reorderRecommendation?.daysUntilStockout || 0).toFixed(2)}`, 20, 200);
            }
            
            // Satış istatistikleri
            if (this.state.totalSalesStats)
            {
                doc.setFontSize(16);
                doc.setTextColor(0, 122, 204);
                doc.text('📊 Statistiques de Ventes', 20, 220);
                
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);

                doc.text(`${this.lang.t("analyticsChart.totalSales")}: ${this.state.totalSalesStats.totalQuantity}`, 20, 235);
                doc.text(`${this.lang.t("analyticsChart.totalDays")}: ${this.state.totalSalesStats.totalDays}`, 20, 245);
                doc.text(`${this.lang.t("analyticsChart.avgDaily")}: ${this.state.totalSalesStats.avgDaily}`, 20, 255);
                doc.text(`${this.lang.t("analyticsChart.maxDaily")}: ${this.state.totalSalesStats.maxDaily}`, 20, 265);
            }
            
            // Grafik verileri
            if (this.state.dataSource && this.state.dataSource.length > 0) 
            {
                doc.setFontSize(16);
                doc.setTextColor(0, 122, 204);
                doc.text(this.lang.t("analyticsChart.graphData"), 20, 285);
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);

                let yPos = 300;
                let count = 0;
                
                this.state.dataSource.slice(0, 10).forEach((item, index) => 
                {
                    if (yPos > 270) { // Sayfa sonu kontrolü
                        doc.addPage();
                        yPos = 20;
                    }

                    doc.text(`${index + 1}. ${item.DOC_DATE}: ${item.QUANTITY} unités - €${parseFloat(item.PRICE || 0).toFixed(2)}`, 20, yPos);
                    yPos += 10;
                    count++;
                });
                
                if (this.state.dataSource.length > 10) 
                {
                    doc.text(`... et ${this.state.dataSource.length - 10} enregistrements supplémentaires`, 20, yPos + 5);
                }
            }
            
            // PDF'i indir
            let fileName = `${this.lang.t("analyticsChart.title")}_${this.txtRef?.value}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            doc.save(fileName);
            
        } 
        catch (error) 
        {
            console.error( error);
            
            // Fallback: JSON export
            try {
                let itemsData = this.itemsObj?.dt?.() || [];
                let itemName = itemsData[0]?.NAME || 'Bilinmeyen Ürün';
                
                let exportData =
                {
                    itemCode: this.txtRef?.value,
                    itemName: itemName,
                    analysisDate: new Date().toLocaleDateString('fr-FR'),
                    priceAnalysis: this.state.azurePricePrediction,
                    reorderRecommendation: this.state.reorderRecommendation,
                    salesData: this.state.dataSource
                };
                
                let dataStr = JSON.stringify(exportData, null, 2);
                let dataBlob = new Blob([dataStr], {type: 'application/json'});
                
                let link = document.createElement('a');

                link.href = URL.createObjectURL(dataBlob);
                link.download = `${this.lang.t("analyticsChart.title")}_${this.txtRef?.value}_${new Date().toISOString().split('T')[0]}.json`;
                link.click();

            } 
            catch (fallbackError) 
            {
                console.error(fallbackError);
            }
        }
    }

    renderDetailPanel() 
    {
        // Grafikler artık ayrı bir kısımda render ediliyor
        // Bu fonksiyon sadece detay paneli için kullanılıyor
        return (
            <div style={{padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                <h5 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>📊 {this.lang.t("analyticsChart.title")}</h5>
                <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                    <div style={{fontSize: '24px', marginBottom: '10px'}}>📈</div>
                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{this.lang.t("analyticsChart.loading")}</div>
                    <div style={{fontSize: '14px', marginTop: '5px'}}>{this.lang.t("analyticsChart.dataSource")}: {this.state.dataSource?.length || 0} {this.lang.t("analyticsChart.record")}</div>
                </div>
            </div>
        );
    }

    renderQuantityDetails() 
    {
        if (!this.state.totalSalesStats) 
        {
            return null;
        }
        
        let stats = this.state.totalSalesStats;
        
        return (
            <div style={{padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                <h5 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>📊 {this.lang.t("analyticsChart.salesQuantity")}</h5>
                <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '24px', fontWeight: 'bold'}}>{parseFloat(stats.totalQuantity).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>📦 {this.lang.t("analyticsChart.sales")}</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '24px', fontWeight: 'bold'}}>{parseFloat(stats.avgDaily).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>📈 Moyenne Quotidienne</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '24px', fontWeight: 'bold'}}>{parseFloat(stats.maxDaily).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>🔥 {this.lang.t("analyticsChart.maxSales")}</div>
                    </div>
                </div>
                <div style={{display: 'flex', gap: '15px', marginTop: '15px'}}>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{stats.totalDaysInRange}</div>
                        <div style={{fontSize: '12px'}}>📅 Total Days</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{stats.salesDays}</div>
                        <div style={{fontSize: '12px'}}>📊 Sales Days</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{parseFloat(stats.avgDailySalesDays).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>📈 Avg Sales Days</div>
                    </div>
                </div>
            </div>
        );
    }

    renderPriceAnalysisDetails() 
    {
        if (!this.state.azurePricePrediction) 
        {
            return null;
        }
        
        return (
            <div style={{padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                <h5 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>💰 {this.lang.t("analyticsChart.priceAnalysis")}</h5>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto'}}>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>€{parseFloat(this.state.azurePricePrediction.currentSalePrice || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Mevcut Fiyat</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>€{parseFloat(this.state.azurePricePrediction.currentCost || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Mevcut Maliyet</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>€{parseFloat(this.state.azurePricePrediction.suggestedPrice || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Önerilen Fiyat</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>%{parseFloat(this.state.azurePricePrediction.margin || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Kar Marjı</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>{this.state.azurePricePrediction.priceTrend || 'N/A'}</div>
                        <div style={{fontSize: '10px'}}>Fiyat Trendi</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>€{parseFloat(this.state.azurePricePrediction.profit || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Kar</div>
                    </div>
                    <div style={{flex: '0 0 auto', minWidth: '120px', padding: '10px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>€{parseFloat(this.state.azurePricePrediction.optimalPrice || 0).toFixed(2)}</div>
                        <div style={{fontSize: '10px'}}>Optimal Fiyat</div>
                    </div>
                </div>
            </div>
        );
    }

    renderStockAnalysisDetails() 
    {
        if (!this.state.reorderRecommendation) 
        {
            return null;
        }
        
        return (
            <div style={{padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                <h5 style={{color: '#007acc', marginBottom: '15px', textAlign: 'center'}}>📦 {this.lang.t("analyticsChart.stockAnalysis")}</h5>
                <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{parseFloat(this.state.reorderRecommendation.suggestedOrder || 0).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>📦 {this.lang.t("analyticsChart.suggestedOrder")}</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{parseFloat(this.state.reorderRecommendation.daysUntilStockout || 0).toFixed(2)}</div>
                        <div style={{fontSize: '12px'}}>⏰ {this.lang.t("analyticsChart.daysUntilStockout")}</div>
                    </div>
                    <div style={{flex: 1, padding: '15px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', borderRadius: '10px', color: 'white', textAlign: 'center'}}>
                        <div style={{fontSize: '20px', fontWeight: 'bold'}}>{this.state.reorderRecommendation.status || 'N/A'}</div>
                        <div style={{fontSize: '12px'}}>📊 {this.lang.t("analyticsChart.stockStatus")}</div>
                    </div>
                </div>
                
                {/* Depo Stokları */}
                {this.state.reorderRecommendation.depotStocks && this.state.reorderRecommendation.depotStocks.length > 0 && (
                    <div style={{marginTop: '15px'}}>
                        <h6 style={{color: '#007acc', marginBottom: '10px', textAlign: 'center'}}>🏢 Depo Stokları</h6>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            {this.state.reorderRecommendation.depotStocks.map((depot, index) => (
                                <div key={index} style={{flex: '1', minWidth: '200px', padding: '10px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)', borderRadius: '8px', color: 'white', textAlign: 'center'}}>
                                    <div style={{fontSize: '16px', fontWeight: 'bold'}}>{depot.DEPOT_NAME}</div>
                                    <div style={{fontSize: '14px'}}>📦 {parseFloat(depot.QUANTITY || 0).toFixed(2)}</div>
                                    <div style={{fontSize: '10px', opacity: 0.8}}>{depot.DOC_DATE}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    groupSalesByDate(salesData) 
    {
        // Güvenli erişim - salesData undefined olabilir
        if (!salesData || !Array.isArray(salesData) || salesData.length === 0) 
        {
            return [];
        }
        
        let grouped = {};
        
        salesData.forEach(item => 
        {
            if (!item || !item.DOC_DATE) return; // Güvenli erişim
            
            const date = item.DOC_DATE;
            
            if (!grouped[date]) 
            {
                grouped[date] = 
                {
                    DOC_DATE: date,
                    DOC_DATE_STR: date, // Tarih formatını koru
                    QUANTITY: 0,
                    TOTAL_SALES: 0,
                    TOTAL_COST: 0,
                    AVG_PRICE: 0,
                    AVG_COST: 0,
                    DAILY_SALES: 0,
                    priceSum: 0,
                    costSum: 0,
                    priceCount: 0,
                    costCount: 0
                };
            }
            
            grouped[date].QUANTITY += parseFloat(item.QUANTITY) || 0;
            grouped[date].TOTAL_SALES += parseFloat(item.TOTAL_SALES) || 0;
            grouped[date].TOTAL_COST += parseFloat(item.TOTAL_COST) || 0;
            grouped[date].DAILY_SALES += parseFloat(item.QUANTITY) || 0;
            grouped[date].priceSum += parseFloat(item.PRICE) || 0;
            grouped[date].costSum += parseFloat(item.COST) || 0;
            grouped[date].priceCount += 1;
            grouped[date].costCount += 1;
        });

        // Ortalama fiyat ve maliyet hesapla
        Object.values(grouped).forEach(day => 
        {
            day.AVG_PRICE = day.priceCount > 0 ? day.priceSum / day.priceCount : 0;
            day.AVG_COST = day.costCount > 0 ? day.costSum / day.costCount : 0;
            day.WEIGHTED_PRICE = day.QUANTITY > 0 ? day.TOTAL_SALES / day.QUANTITY : 0;
            day.WEIGHTED_COST = day.QUANTITY > 0 ? day.TOTAL_COST / day.QUANTITY : 0;
            day.MARGIN = day.WEIGHTED_PRICE > 0 ? ((day.WEIGHTED_PRICE - day.WEIGHTED_COST) / day.WEIGHTED_PRICE * 100) : 0;
        });

        let result = Object.values(grouped).sort((a, b) => new Date(a.DOC_DATE) - new Date(b.DOC_DATE));
        return result;
    }

    prepareQuantityChartData(dailyData) 
    {
        let result = dailyData.map(day => (
        {
            DOC_DATE_STR: day.DOC_DATE_STR,
            QUANTITY: parseFloat((day.QUANTITY || 0).toFixed(2))
        }));

        return result;
    }

    preparePriceChartData(dailyData) 
    {
        console.log('💰 preparePriceChartData - dailyData:', dailyData);
        
        let result = dailyData.map(day => (
        {
            DOC_DATE_STR: day.DOC_DATE_STR,
            SALE_PRICE: parseFloat((day.WEIGHTED_PRICE || 0).toFixed(2)),
            COST_PRICE: parseFloat((day.WEIGHTED_COST || 0).toFixed(2)),
            WEIGHTED_PRICE: parseFloat((day.WEIGHTED_PRICE || 0).toFixed(2)),
            AVG_PRICE: parseFloat((day.AVG_PRICE || 0).toFixed(2)),
            WEIGHTED_COST: parseFloat((day.WEIGHTED_COST || 0).toFixed(2)),
            AVG_COST: parseFloat((day.AVG_COST || 0).toFixed(2)),
            MARGIN: parseFloat((day.MARGIN || 0).toFixed(2))
        }));
        
        console.log('💰 preparePriceChartData - result:', result);
        return result;
    }

    preparePriceChartDataWithPredictions(dailyData, linearRegressionData, monteCarloData, arimaData) 
    {
        console.log('🔮 preparePriceChartDataWithPredictions - inputs:', {
            dailyData: dailyData?.length || 0,
            linear: linearRegressionData?.length || 0,
            monteCarlo: monteCarloData?.length || 0,
            arima: arimaData?.length || 0
        });
        
        let baseData = this.preparePriceChartData(dailyData);
        
        // Tahmin verilerini ekle
        let result = baseData.map((item, index) => 
        {
            let linearPrediction = linearRegressionData?.[index]?.PREDICTED_PRICE || item.WEIGHTED_PRICE;
            let monteCarloPrediction = monteCarloData?.[index]?.PREDICTED_PRICE || item.WEIGHTED_PRICE;
            let arimaPrediction = arimaData?.[index]?.PREDICTED_PRICE || item.WEIGHTED_PRICE;
            
            return {
                ...item,
                LINEAR_PREDICTION: parseFloat(linearPrediction.toFixed(2)),
                MONTECARLO_PREDICTION: parseFloat(monteCarloPrediction.toFixed(2)),
                ARIMA_PREDICTION: parseFloat(arimaPrediction.toFixed(2))
            };
        });
        
        return result;
    }

    prepareStockChartData(dailyData) 
    {
        let result = dailyData.map(day => (
        {
            DOC_DATE_STR: day.DOC_DATE_STR,
            STOCK_LEVEL: parseFloat((day.DAILY_SALES || 0).toFixed(2)),
            DAILY_SALES: parseFloat((day.DAILY_SALES || 0).toFixed(2))
        }));
        return result;
    }

    calculateTotalSalesStats(dailyData, startDate, endDate) 
    {
        if (!dailyData || dailyData.length === 0) 
        {
            return null;
        }

        let totalQuantity = dailyData.reduce((sum, day) => sum + day.QUANTITY, 0);
        
        // Tüm tarih aralığındaki gün sayısını hesapla (satış olmayan günler dahil)
        let start = new Date(startDate);
        let end = new Date(endDate);
        let totalDaysInRange = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        // Satış yapılan gün sayısı
        let salesDays = dailyData.length;
        
        // Gerçek günlük ortalama: toplam satış / tüm günler
        let avgDaily = totalDaysInRange > 0 ? totalQuantity / totalDaysInRange : 0;
        
        // Satış yapılan günlerdeki ortalama
        let avgDailySalesDays = salesDays > 0 ? totalQuantity / salesDays : 0;
        
        let maxDaily = Math.max(...dailyData.map(day => day.QUANTITY));

        return {
            totalQuantity: totalQuantity,
            totalDaysInRange: totalDaysInRange, // Tüm tarih aralığındaki gün sayısı
            salesDays: salesDays, // Satış yapılan gün sayısı
            avgDaily: Math.round(avgDaily * 100) / 100, // Gerçek günlük ortalama
            avgDailySalesDays: Math.round(avgDailySalesDays * 100) / 100, // Satış günlerindeki ortalama
            maxDaily: maxDaily
        };
    }

    prepareLinearRegressionData(priceChartData) 
    {
        if (!priceChartData || priceChartData.length < 2) 
        {
            return [];
        }
        
        // Fiyat verilerini al
        let prices = priceChartData.map(item => parseFloat(item.WEIGHTED_PRICE) || 0).filter(price => price > 0);
        
        if (prices.length < 2) 
        {
            return [];
        }
        // Linear regression hesapla
        let regression = this.calculateLinearRegression(prices);
        
        // Tahmin verilerini hazırla
        let result = priceChartData.map((item, index) => 
        {
            let predictedPrice = regression.slope * (index + 1) + regression.intercept;

            return {
                DOC_DATE_STR: item.DOC_DATE_STR,
                PREDICTED_PRICE: parseFloat(Math.max(0, predictedPrice).toFixed(2))
            };
        });
        
        return result;
    }

    prepareMonteCarloPredictionData(priceChartData) 
    {
        if (!priceChartData || priceChartData.length === 0) 
        {
            return [];
        }
        
        // Fiyat verilerini al
        let prices = priceChartData.map(item => parseFloat(item.WEIGHTED_PRICE) || 0).filter(price => price > 0);
        
        if (prices.length === 0) 
        {
            return [];
        }
        
        // Monte Carlo tahmini yap
        let predictions = this.calculateMonteCarloPrediction(prices, priceChartData.length);
        
        // Tahmin verilerini hazırla
        let result = priceChartData.map((item, index) => 
        {
            let predictedPrice = predictions[index]?.predictedValue || item.WEIGHTED_PRICE;

            return {
                DOC_DATE_STR: item.DOC_DATE_STR,
                PREDICTED_PRICE: parseFloat(Math.max(0, predictedPrice).toFixed(2))
            };
        });
        
        return result;
    }

    prepareARIMAPredictionData(priceChartData) 
    {
        if (!priceChartData || priceChartData.length < 3) 
        {
            return [];
        }
        
        // Fiyat verilerini al
        let prices = priceChartData.map(item => parseFloat(item.WEIGHTED_PRICE) || 0).filter(price => price > 0);
        
        if (prices.length < 3) 
        {
            return [];
        }
        
        // ARIMA tahmini yap (ARIMA(1,1,1) modeli)
        let predictions = this.calculateARIMAPrediction(prices);
        
        // Tahmin verilerini hazırla
        let result = priceChartData.map((item, index) => 
        {
            let predictedPrice = predictions[index]?.predictedValue || item.WEIGHTED_PRICE;
            
            return {
                DOC_DATE_STR: item.DOC_DATE_STR,
                PREDICTED_PRICE: parseFloat(Math.max(0, predictedPrice).toFixed(2))
            };
        });
        
        return result;
    }

    async calculateStockPrediction(data) 
    {
        try 
        {
            if (!data || data.length === 0) 
            {
                return null;
            }
            
            // Güvenli erişim
            let itemStockData = this.itemsObj?.dt?.('ITEM_STOCK') || [];
            let currentStock = itemStockData[0]?.QUANTITY || 0;
            let avgDailySales = 10; // Ortalama günlük satış
            
            // 30 günlük stok tahmini (sabit değer)
            let predictions = [];
            let predictedStock = currentStock;
            
            for (let day = 1; day <= 30; day++) 
            {
                predictedStock -= avgDailySales;
                
                // Negatif değerleri koru - gerçek stok durumunu göster
                predictions.push(
                {
                    day: day,
                    predictedStock: predictedStock, // Negatif değerleri koru
                    date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
                });
            }
            
            let stockPrediction = 
            {
                currentStock: currentStock,
                avgDailySales: avgDailySales,
                predictions: predictions,
                daysUntilStockout: currentStock > 0 && avgDailySales > 0 ? Math.floor(currentStock / avgDailySales) : 0,
                recommendedReorderDay: Math.max(0, Math.floor(currentStock / avgDailySales) - 7)
            };
            
            this.setState({stockPredictionData: predictions});

            return stockPrediction;
        } 
        catch (error) 
        {
            console.error(error);
            // Hata durumunda varsayılan değerler döndür
            let defaultPrediction = 
            {
                currentStock: 0,
                avgDailySales: 0,
                predictions: [],
                daysUntilStockout: 0,
                recommendedReorderDay: 0
            };
            this.setState({stockPredictionData: []});
            return defaultPrediction;
        }
    }
}