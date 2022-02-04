import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls} from '../../../lib/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class itemCard extends React.Component
{
    constructor()
    {
        super()                
        this.state = {underPrice : 0,isItemGrpForOrginsValid : false,isItemGrpForMinMaxAccess : false}
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.itemsObj = new itemsCls();
        this.itemsPriceSupply = new itemPriceCls();        
        this.prevCode = "";
        
        this._onItemRendered = this._onItemRendered.bind(this)
    }    
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }    
    async init()
    {  
        this.prevCode = ""
        this.itemsObj.clearAll();  
        this.itemsPriceSupply.clearAll();             

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
                    this.btnBack.setState({disabled:true});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
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
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }    
            //ALT BİRİM FİYAT HESAPLAMASI
            this.underPrice();  
            //MARGIN HESAPLAMASI
            this.grossMargin()                 
            this.netMargin()                 
        })
        this.itemsObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.itemsObj.dt('ITEMS').length > 0 ? this.itemsObj.dt('ITEMS')[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
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
            this.btnPrint.setState({disabled:false});
        })

        this.itemsObj.addEmpty();

        this.txtRef.value = Math.floor(Date.now() / 1000)
        this.txtCustomer.value = "";
        this.txtCustomer.displayValue = "";   
        this.txtBarcode.readOnly = false;   
        this.imgFile.value = ""; 
        
        let tmpUnit = new unitCls();
        await tmpUnit.load()

        let tmpMainUnitObj = {...this.itemsObj.itemUnit.empty}
        tmpMainUnitObj.TYPE = 0
        tmpMainUnitObj.TYPE_NAME = 'Ana Birim'
        tmpMainUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
        if(tmpUnit.dt(0).length > 0)
        {
            tmpMainUnitObj.ID = tmpUnit.dt(0)[0].ID
        }
        
        let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
        tmpUnderUnitObj.TYPE = 1,
        tmpUnderUnitObj.TYPE_NAME = 'Alt Birim'
        tmpUnderUnitObj.ITEM_GUID = this.itemsObj.dt()[0].GUID         
        if(tmpUnit.dt(0).length > 0)
        {
            tmpUnderUnitObj.ID = tmpUnit.dt(0)[0].ID
        }
        
        let tmpBarcodeObj = {...this.itemsObj.itemBarcode.empty}
        tmpBarcodeObj.ITEM_GUID = this.itemsObj.dt()[0].GUID 
        this.itemsObj.itemBarcode.addEmpty(tmpBarcodeObj);     

        this.itemsObj.itemUnit.addEmpty(tmpMainUnitObj);
        this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);

        this.itemGrpForOrginsValidCheck();   
        this.itemGrpForMinMaxAccessCheck();                        
    }
    async getItem(pCode)
    {
        this.itemsObj.clearAll();
        await this.itemsObj.load({CODE:pCode});
        //TEDARİKÇİ FİYAT GETİR İŞLEMİ.                
        await this.itemsPriceSupply.load({ITEM_CODE:pCode,TYPE:1})    
        this.txtBarcode.readOnly = true;
    }
    async checkItem(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemsCls().load({CODE:pCode});
    
                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'txtRef',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz stok sistem de kayıtlı !</div>)
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
                        id:'txtBarcode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz barkod sistem de kayıtlı !</div>)
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
                        id:'txtBarcode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz tedarikçi stok kodu sistem de kayıtlı !</div>)
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
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == "Fiyat")
        {        
            await this.grdFiyat.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
        }
        else if(e.itemData.title == "Birim")
        {
            await this.grdBirim.dataRefresh({source:this.itemsObj.itemUnit.dt('ITEM_UNIT')});
        }
        else if(e.itemData.title == "Barkod")
        {
            await this.grdBarkod.dataRefresh({source:this.itemsObj.itemBarcode.dt('ITEM_BARCODE')});
        }
        else if(e.itemData.title == "Tedarikçi")
        {
            await this.grdTedarikci.dataRefresh({source:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')});
        }
        else if(e.itemData.title == "Tedarikçi Fiyat")
        {
            await this.grdTedarikciFiyat.dataRefresh({source:this.itemsPriceSupply.dt()});
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
    grossMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE / ((this.itemsObj.dt("ITEMS")[0].VAT / 100) + 1)
            let tmpMargin = tmpExVat - this.itemsObj.dt("ITEMS")[0].COST_PRICE;
            let tmpMarginRate = ((tmpExVat - this.itemsObj.dt("ITEMS")[0].COST_PRICE) / tmpExVat) * 100
            this.itemsObj.itemPrice.dt()[i].VAT_EXT = tmpExVat
            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2);                 
            this.itemsObj.itemPrice.dt()[i].GROSS_MARGIN_RATE = tmpMarginRate.toFixed(2);                 
        }
    }
    netMargin()
    {
        for (let i = 0; i < this.itemsObj.itemPrice.dt().length; i++) 
        {
            let tmpExVat = this.itemsObj.itemPrice.dt()[i].PRICE / ((this.itemsObj.dt("ITEMS")[0].VAT / 100) + 1)
            let tmpMargin = (tmpExVat - this.itemsObj.dt("ITEMS")[0].COST_PRICE) / 1.12;
            let tmpMarginRate = (((tmpExVat - this.itemsObj.dt("ITEMS")[0].COST_PRICE) / 1.12) / tmpExVat) * 100
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2); 
            this.itemsObj.itemPrice.dt()[i].NET_MARGIN_RATE = tmpMarginRate.toFixed(2);                 
        }
    }   
    itemGrpForOrginsValidCheck()
    {
        let tmpData = this.prmObj.filter({ID:'ItemGrpForOrginsValidation'}).getValue()
        if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.txtItemGrp.value) != 'undefined')
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
        if(typeof tmpData != 'undefined' && Array.isArray(tmpData) && typeof tmpData.find(x => x == this.txtItemGrp.value) != 'undefined')
        {
            this.setState({isItemGrpForMinMaxAccess:true})
        }
        else
        {
            this.setState({isItemGrpForMinMaxAccess:false})
        }
    }
    render()
    {   
        return (
            <div>                
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmItems"
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            //FIYAT GİRMEDEN KAYIT EDİLEMEZ KONTROLÜ
                                            if(this.itemsObj.dt('ITEM_PRICE').length == 0)
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'diaSave3',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>Lütfen fiyat giriniz !</div>)
                                                }
                                                
                                                await dialog(tmpConfObj);

                                                return;
                                            }
                                            //************************************ */
                                            let tmpConfObj =
                                            {
                                                id:'diaSave1',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:'Tamam',location:'before'},{id:"btn02",caption:'Vazgeç',location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt etmek istediğinize eminmisiniz !</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'diaSave2',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                }
                                                
                                                if((await this.itemsObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt işleminiz başarılı !</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt işleminiz başarısız !</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'diaSave3',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>Lütfen gerekli alanları doldurunuz !</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'diaSave1',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:'Tamam',location:'before'},{id:"btn02",caption:'Vazgeç',location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>Kaydı silmek istediğinize eminmisiniz ?</div>)
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
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">                        
                        <div className="col-9">
                            <Form colCount={2} id="frmItems">
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} 
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
                                    title={'Stok Seçim'} 
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM ITEMS_VW_01"},sql:this.core.sql}}}
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
                                        <Column dataField="CODE" caption="CODE" width={150} />
                                        <Column dataField="NAME" caption="NAME" width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* txtItemGrp */}
                                <Item>
                                    <Label text={this.t("txtItemGrp")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtItemGrp" showClearButton={true} 
                                    dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GRP",display:"MAIN_GRP_NAME"}}                                    
                                    param={this.param.filter({ELEMENT:'txtItemGrp',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemGrp',USERS:this.user.CODE})}
                                    displayValue={""}
                                    readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {                                                    
                                                    this.pg_txtItemGrp.show()
                                                    this.pg_txtItemGrp.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtItemGrp.value = data[0].CODE
                                                            this.txtItemGrp.displayValue = data[0].NAME
                                                            this.itemGrpForOrginsValidCheck();
                                                            this.itemGrpForMinMaxAccessCheck();
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    >
                                    </NdTextBox>
                                    {/* ÜRÜN GRUP SEÇİM POPUP */}
                                    <div>
                                        <NdPopGrid id={"pg_txtItemGrp"} parent={this} container={"#root"} 
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={'Ürün Grubu Seçim'} 
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                        >
                                            <Column dataField="CODE" caption="CODE" width={150} />
                                            <Column dataField="NAME" caption="NAME" width={650} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </div>
                                </Item>
                                {/* txtCustomer */}
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                    <NdTextBox id="txtCustomer" parent={this} simple={true}
                                    dt={{data:this.itemsObj.dt('ITEM_MULTICODE'),field:"CUSTOMER_CODE",display:"CUSTOMER_NAME"}}
                                    readOnly={true}
                                    displayValue={""}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:()=>
                                                {
                                                    this.txtPopTedKodu.value = "";
                                                    this.txtPopTedAdi.value = "";
                                                    this.txtPopTedStokKodu.value = "";
                                                    this.txtPopTedFiyat.value = "0";
                                                    this.popTedarikci.show();
                                                }
                                            }
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomer',USERS:this.user.CODE})}>
                                    </NdTextBox>
                                </Item>
                                {/* cmbItemGenus */}
                                <Item>
                                    <Label text={"Ürün Cinsi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbItemGenus" dt={{data:this.itemsObj.dt('ITEMS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:{select:{query:"SELECT ID,VALUE FROM ITEM_TYPE ORDER BY ID ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbItemGenus',USERS:this.user.CODE})}
                                    />
                                </Item>
                                {/* txtBarcode */}
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true}
                                    dt={{data:this.itemsObj.dt('ITEM_BARCODE'),field:"BARCODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:async()=>
                                                {
                                                    await this.cmbPopBarBirim.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})})
                                                    this.txtPopBarkod.value = "";
                                                    this.cmbPopBarTip.value = "0";
                                                    this.cmbPopBarBirim.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''
                                                    this.popBarkod.show();
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
                                    <Label text={"Vergi "} alignment="right" />
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
                                    <Label text={"Ana Birim "} alignment="right" />
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
                                            <NdNumberBox id="txtMainUnit" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            showSpinButtons={true} step={1.0} format={"###.000"}
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:0}}}
                                            param={this.param.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMainUnit',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                    </div>
                                </Item>     
                                {/* txtOrigin */}
                                <Item>
                                    <Label text={"Menşei "} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtOrigin" showClearButton={true} 
                                    dt={{data:this.itemsObj.dt('ITEMS'),field:"ORGINS",display:"ORGINS_NAME"}}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'txtOrigin',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtOrigin',USERS:this.user.CODE})}
                                    displayValue={""}
                                    readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtOrigin.show()
                                                    this.pg_txtOrigin.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtOrigin.value = data[0].CODE
                                                            this.txtOrigin.displayValue = data[0].NAME
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }>
                                        <Validator validationGroup={this.state.isItemGrpForOrginsValid ? "frmItems" : ""}>
                                            <RequiredRule message="Menşei boş geçemezsiniz !" />
                                        </Validator>
                                    </NdTextBox>                                    
                                    {/* MENŞEİ SEÇİM POPUP */}
                                    <div>
                                        <NdPopGrid id={"pg_txtOrigin"} parent={this} container={"#root"} 
                                        position={{of:'#root'}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={'Menşei Seçim'} 
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                        >
                                            <Column dataField="CODE" caption="CODE" width={150} />
                                            <Column dataField="NAME" caption="NAME" width={650} defaultSortOrder="asc" />
                                        </NdPopGrid>
                                    </div>
                                </Item>                           
                                {/* cmbUnderUnit */}
                                <Item>
                                    <Label text={"Alt Birim "} alignment="right" />
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
                                            <NdNumberBox id="txtUnderUnit" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
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
                                {/* Boş */}
                                <Item> </Item>                             
                                {/* txtItemName */}
                                <Item>
                                    <Label text={"Ürün Adı "} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}}
                                    param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})}
                                    onValueChanged={(e)=>
                                        {
                                            if(e.value.length <= 32)
                                                this.txtShortName.value = e.value
                                        }
                                    }/>
                                </Item>
                                {/* txtShortName */}
                                <Item>
                                    <Label text={"Kısa Adı "} alignment="right" />
                                        <NdTextBox id="txtShortName" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"SNAME"}}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtShortName',USERS:this.user.CODE})}/>
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
                                <div className='col-12'>
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
                            <Form colCount={6} id="frmChkBox">
                                {/* chkActive */}
                                <Item>
                                    <Label text={"Aktif "} alignment="right" />
                                    <NdCheckBox id="chkActive" parent={this} defaultValue={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"STATUS"}}
                                    param={this.param.filter({ELEMENT:'chkActive',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkActive',USERS:this.user.CODE})}/>
                                </Item>
                                {/* chkCaseWeighed */}
                                <Item>
                                    <Label text={"Kasada Tartılsın "} alignment="right" />
                                    <NdCheckBox id="chkCaseWeighed" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"WEIGHING"}}
                                    param={this.param.filter({ELEMENT:'chkCaseWeighed',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkCaseWeighed',USERS:this.user.CODE})}/>
                                </Item>
                                {/* chkLineMerged */}
                                <Item>
                                    <Label text={"Satış da Satır Birleştir "} alignment="right" />
                                    <NdCheckBox id="chkLineMerged" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}
                                    param={this.param.filter({ELEMENT:'chkLineMerged',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'chkLineMerged',USERS:this.user.CODE})}/>
                                </Item>
                                {/* chkTicketRest */}
                                <Item>
                                    <Label text={"Ticket Rest. "} alignment="right" />
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
                                <Item title="Fiyat">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtCostPrice" parent={this} title={"Maliyet Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}}
                                            format={"#,##0.000"} step={0.1}
                                            param={this.param.filter({ELEMENT:'txtCostPrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtCostPrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtMinSalePrice" parent={this} title={"Min. Satış Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"MIN_PRICE"}}
                                            format={"#,##0.000"} step={0.1}
                                            editable={this.state.isItemGrpForMinMaxAccess}
                                            param={this.param.filter({ELEMENT:'txtMinSalePrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMinSalePrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtMaxSalePrice" parent={this} title={"Max. Satış Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"MAX_PRICE"}}
                                            format={"#,##0.000"} step={0.1}
                                            editable={this.state.isItemGrpForMinMaxAccess}
                                            param={this.param.filter({ELEMENT:'txtMaxSalePrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtMaxSalePrice',USERS:this.user.CODE})}>
                                            </NdNumberBox>
                                        </div>
                                        <div className='col-2'>
                                            <NdNumberBox id="txtLastBuyPrice" parent={this} title={"Son Alış Fiyatı"} titleAlign={"top"}
                                            format={"#,##0.000"} step={0.1}
                                            param={this.param.filter({ELEMENT:'txtLastBuyPrice',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtLastBuyPrice',USERS:this.user.CODE})}/>
                                        </div>
                                        <div className='col-4'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {                                                        
                                                        this.dtPopFiyBasTarih.value = "1970-01-01"
                                                        this.dtPopFiyBitTarih.value = "1970-01-01"
                                                        this.txtPopFiyMiktar.value = 0
                                                        this.txtPopFiyFiyat.value = 0

                                                        this.popFiyat.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdFiyat"} 
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
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="DEPOT" caption="Depo" />
                                                <Column dataField="CUSTOMER_NAME" caption="Cari"/>
                                                <Column dataField="START_DATE" caption="Baş.Tarih" dataType="date" 
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="FINISH_DATE" caption="Bit.Tarih" dataType="date"
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="QUANTITY" caption="Miktar"/>
                                                <Column dataField="VAT_EXT" caption="Vergi Hariç" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>                                                
                                                <Column dataField="PRICE" caption="Fiyat" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="GROSS_MARGIN" caption="Brüt Marj" dataType="string"/>
                                                <Column dataField="NET_MARGIN" caption="Net Marj" dataType="string" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Birim">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtUnderUnitFiyat" parent={this} title={"Alt Birim Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-10'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {                                                        
                                                        this.cmbPopBirimTip.value = "2"
                                                        this.cmbPopBirimAdi.value = "001"
                                                        this.txtPopBirimKatsayi.value = "0"
                                                        this.txtPopBirimAgirlik.value = "0"
                                                        this.txtPopBirimHacim.value = "0";
                                                        this.txtPopBirimEn.value = "0";
                                                        this.txtPopBirimBoy.value = "0"
                                                        this.txtPopBirimYukseklik.value = "0"

                                                        this.popBirim.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBirim"} 
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
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="NAME" caption="Adı" />
                                                <Column dataField="FACTOR" caption="Katsayı"/>
                                                <Column dataField="WEIGHT" caption="Ağırlık"/>
                                                <Column dataField="VOLUME" caption="Hacim"/>
                                                <Column dataField="WIDTH" caption="En"/>
                                                <Column dataField="HEIGHT" caption="Boy"/>
                                                <Column dataField="SIZE" caption="Yükseklik"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Barkod">
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={async ()=>
                                                    {
                                                        await this.cmbPopBarBirim.dataRefresh({source : this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})})
                                                        this.txtPopBarkod.value = "";
                                                        this.cmbPopBarTip.value = "0";
                                                        this.cmbPopBarBirim.value = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0}).length > 0 ? this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].GUID : ''
                                                        this.popBarkod.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBarkod"} 
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
                                                <Column dataField="BARCODE" caption="Barkod" />
                                                <Column dataField="UNIT_NAME" caption="Birim" />
                                                <Column dataField="TYPE_NAME" caption="Tip"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>                                
                                <Item title="Tedarikçi">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinAlisFiyat" parent={this} title={"Min. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxAlisFiyat" parent={this} title={"Max. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-8'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {
                                                        this.txtPopTedStokKodu.value = "";
                                                        this.txtPopTedFiyat.value = "0";
                                                        this.popTedarikci.show();
                                                    }}/>                                                                                                            
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdTedarikci"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="CUSTOMER_CODE" caption="Kodu" />
                                                <Column dataField="CUSTOMER_NAME" caption="Adı" />
                                                <Column dataField="CUSTOMER_PRICE_USER_NAME" caption="Kullanıcı" />
                                                <Column dataField="CUSTOMER_PRICE_DATE" caption="Son Fiyat Tarih" allowEditing={false} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                                <Column dataField="CUSTOMER_PRICE" caption="Fiyat" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption="Tedarikçi Stok Kodu" />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Tedarikçi Fiyat">
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdTedarikciFiyat"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="CUSER" caption="Kullanıcı" />
                                                <Column dataField="CUSTOMER_CODE" caption="Kodu" />
                                                <Column dataField="CUSTOMER_NAME" caption="Adı" />
                                                <Column dataField="CHANGE_DATE" caption="Son Fiyat Tarih" allowEditing={false} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"}/>
                                                <Column dataField="PRICE" caption="Fiyat" allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption="Tedarikçi Stok Kodu" />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Bilgi"></Item>
                            </TabPanel>
                        </div>
                    </div>                   
                    {/* FİYAT POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popFiyat"} 
                        visible={false}                        
                        showCloseButton={true}
                        showTitle={true}
                        title={"Fiyat Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'} id="frmPrice">
                                <Item>
                                    <Label text={"Baş.Tarih "} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id="dtPopFiyBasTarih"/>
                                </Item>
                                <Item>
                                    <Label text={"Bit.Tarih "} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id="dtPopFiyBitTarih"/>
                                </Item>
                                <Item>
                                    <Label text={"Miktar "} alignment="right" />
                                    <NdNumberBox id={"txtPopFiyMiktar"} parent={this} simple={true}>
                                        <Validator validationGroup={"frmPrice"}>
                                            <RequiredRule message="Miktar'ı boş geçemezsiniz !" />
                                            <NumericRule message="Miktar'a sayısal değer giriniz !" />
                                        </Validator>
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={"Fiyat "} alignment="right" />
                                    <NdNumberBox id={"txtPopFiyFiyat"} parent={this} simple={true}>
                                        <Validator validationGroup={"frmPrice"}>
                                            <RequiredRule message="Fiyat'ı boş geçemezsiniz !" />
                                            <NumericRule message="Fiyat'a sayısal değer giriniz !" />
                                            <RangeRule min={0.001} message={"Fiyat sıfırdan küçük olamaz !"} />
                                        </Validator> 
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} validationGroup="frmPrice"
                                            onClick={async (e)=>
                                            {
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    //FİYAT GİRERKEN MALİYET FİYAT KONTROLÜ
                                                    if(this.txtCostPrice.value != 0 && this.txtCostPrice.value >= this.txtPopFiyFiyat.value)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'diaSave3',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>Lütfen alış fiyatından yüksek fiyat giriniz !</div>)
                                                        }
                                                        
                                                        await dialog(tmpConfObj);

                                                        return;
                                                    }
                                                    //********************************** */
                                                    let tmpEmpty = {...this.itemsObj.itemPrice.empty};
                                                
                                                    tmpEmpty.TYPE = 0
                                                    tmpEmpty.TYPE_NAME = 'Standart'
                                                    tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                    tmpEmpty.DEPOT = "0"
                                                    tmpEmpty.START_DATE = this.dtPopFiyBasTarih.value
                                                    tmpEmpty.FINISH_DATE = this.dtPopFiyBitTarih.value
                                                    tmpEmpty.PRICE = this.txtPopFiyFiyat.value
                                                    tmpEmpty.QUANTITY = this.txtPopFiyMiktar.value

                                                    this.itemsObj.itemPrice.addEmpty(tmpEmpty); 
                                                    this.popFiyat.hide();
                                                }                              
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'diaSave3',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Lütfen gerekli alanları doldurunuz !</div>)
                                                    }
                                                    
                                                    await dialog(tmpConfObj);
                                                }                                                 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popFiyat.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BİRİM POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBirim"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Birim Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'510'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Tip "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBirimTip"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="2"
                                    data={{source:[{ID:"2",VALUE:"Üst Birim"}]}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Birim Adı "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBirimAdi"
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value="001"
                                    data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Katsayı "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimKatsayi"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Ağırlık "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimAgirlik"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Hacim "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimHacim"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"En "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimEn"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Boy "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimBoy"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Yükseklik "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimYukseklik"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemUnit.empty};
                                                
                                                tmpEmpty.TYPE = this.cmbPopBirimTip.value
                                                tmpEmpty.TYPE_NAME = this.cmbPopBirimTip.displayValue
                                                tmpEmpty.ID = this.cmbPopBirimAdi.value
                                                tmpEmpty.NAME = this.cmbPopBirimAdi.displayValue
                                                tmpEmpty.FACTOR = this.txtPopBirimKatsayi.value
                                                tmpEmpty.WEIGHT = this.txtPopBirimAgirlik.value
                                                tmpEmpty.VOLUME = this.txtPopBirimHacim.value
                                                tmpEmpty.WIDTH = this.txtPopBirimEn.value
                                                tmpEmpty.HEIGHT = this.txtPopBirimBoy.value
                                                tmpEmpty.SIZE = this.txtPopBirimYukseklik.value
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                this.itemsObj.itemUnit.addEmpty(tmpEmpty); 
                                                this.popBirim.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBirim.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BARKOD POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBarkod"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Barkod Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'275'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Barkodu "} alignment="right" />
                                    <NdTextBox id={"txtPopBarkod"} parent={this} simple={true} 
                                    onValueChanged={(e)=>
                                    {
                                        if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                        {
                                            this.cmbPopBarTip.value = "2"
                                            return;
                                        }
                                        if(e.value.length == 8)
                                        {                                            
                                            this.cmbPopBarTip.value = "0"
                                        }
                                        else if(e.value.length == 13)
                                        {
                                            this.cmbPopBarTip.value = "1"
                                        }
                                        else
                                        {
                                            this.cmbPopBarTip.value = "2"
                                        }
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={"Birim "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarBirim"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Tip "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarTip"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};
                                                let tmpEmptyStat = true
                                                
                                                if(typeof this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '') != 'undefined')
                                                {
                                                    tmpEmptyStat = false;
                                                    tmpEmpty = this.itemsObj.itemBarcode.dt().find(x => x.BARCODE == '')
                                                }
                                                
                                                tmpEmpty.BARCODE = this.txtPopBarkod.value
                                                tmpEmpty.TYPE = this.cmbPopBarTip.value
                                                tmpEmpty.UNIT_GUID = this.cmbPopBarBirim.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarBirim.displayValue
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 

                                                let tmpResult = await this.checkBarcode(this.txtPopBarkod.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popBarkod.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    if(tmpEmptyStat)
                                                    {
                                                        this.itemsObj.itemBarcode.addEmpty(tmpEmpty);    
                                                    }
                                                    this.popBarkod.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBarkod.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* TEDARİKÇİ POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popTedarikci"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Tedarikçi Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Kodu "} alignment="right" />
                                    <NdTextBox id={"txtPopTedKodu"} parent={this} simple={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {                                                
                                                    this.pg_txtPopTedKodu.show()
                                                    this.pg_txtPopTedKodu.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopTedKodu.GUID = data[0].GUID
                                                            this.txtPopTedKodu.value = data[0].CODE;
                                                            this.txtPopTedAdi.value = data[0].NAME;
                                                            console.log(this.txtPopTedKodu.GUID);
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
                                    <NdPopGrid id={"pg_txtPopTedKodu"} parent={this} container={".dx-multiview-wrapper"} 
                                    position={{of:'#page'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={'Tedarikçi Seçim'} 
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    data={{source:{select:{query:"SELECT GUID,CODE,TITLE FROM CUSTOMER_VW_01 WHERE TYPE = 1 "},sql:this.core.sql}}}
                                    >           
                                    <Scrolling mode="virtual" />                         
                                    <Column dataField="TITLE" caption="NAME" width={650} defaultSortOrder="asc" />
                                    <Column dataField="CODE" caption="CODE" width={150} />
                                    </NdPopGrid>
                                </Item>
                                <Item>
                                    <Label text={"Adı "} alignment="right" />
                                    <NdTextBox id={"txtPopTedAdi"} parent={this} simple={true} editable={true}/>
                                </Item>
                                <Item>
                                    <Label text={"Stok Kodu "} alignment="right" />
                                    <NdTextBox id={"txtPopTedStokKodu"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Fiyat "} alignment="right" />
                                    <NdTextBox id={"txtPopTedFiyat"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpEmptyMulti = {...this.itemsObj.itemMultiCode.empty};
                                                
                                                tmpEmptyMulti.CUSER = this.core.auth.data.CODE,  
                                                tmpEmptyMulti.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                tmpEmptyMulti.CUSTOMER_GUID = this.txtPopTedKodu.GUID                              
                                                tmpEmptyMulti.CUSTOMER_CODE = this.txtPopTedKodu.value
                                                tmpEmptyMulti.CUSTOMER_NAME = this.txtPopTedAdi.value
                                                tmpEmptyMulti.MULTICODE = this.txtPopTedStokKodu.value
                                                tmpEmptyMulti.CUSTOMER_PRICE = this.txtPopTedFiyat.value
                                                tmpEmptyMulti.CUSTOMER_PRICE_DATE = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")

                                                let tmpResult = await this.checkMultiCode(this.txtPopTedStokKodu.value,this.txtPopTedKodu.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popTedarikci.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    this.txtCostPrice.value = this.txtPopTedFiyat.value
                                                    this.itemsObj.itemMultiCode.addEmpty(tmpEmptyMulti);
                                                    this.popTedarikci.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popTedarikci.hide();  
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