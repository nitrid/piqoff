import moment from 'moment';
import React from 'react';
import App from '../../../lib/app.js';
import {productRecipeCls} from '../../../../core/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import NdButton from '../../../../core/react/devex/button.js';
import { NdLayout,NdLayoutItem } from '../../../../core/react/devex/layout';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Button as grdbutton} from '../../../../core/react/devex/grid.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdAccessEdit from '../../../tools/NdAccesEdit.js';

export default class productRecipeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.productObj = new productRecipeCls();

        this._cellRoleRender = this._cellRoleRender.bind(this)
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }
    async init()
    {
        this.prevCode = ""
        this.productObj.clearAll();

        this.txtItemCode.GUID = ''
        this.txtItemCode.value = ''
        this.txtItemName.value = ''
        this.dtDate.value = moment(new Date()).format("YYYY-MM-DD")
        this.txtQuantity.value = 0

        this.productObj.ds.on('onAddRow',(pTblName,pData) =>
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
        })
        this.productObj.ds.on('onEdit',(pTblName,pData) =>
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
        })
        this.productObj.ds.on('onRefresh',(pTblName) =>
        {        
            this.prevCode = this.productObj.dt().length > 0 ? this.productObj.dt()[0].PRODUCED_ITEM_CODE : '';
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })
        this.productObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })        

        // this.productObj.addEmpty();
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == "RAW_ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode" + e.rowIndex} parent={this} simple={true}
                value={e.value}
                onKeyDown={async(k)=>
                {
                    if(k.event.key == 'F10' || k.event.key == 'ArrowRight')
                    {
                        this.pg_txtItemCode.onClick = async(data) =>
                        {
                            this.grdList.devGrid.beginUpdate()
                            for (let i = 0; i < data.length; i++) 
                            {
                                await this.addItem(data[i],e.rowIndex)
                            }
                            this.grdList.devGrid.endUpdate()
                        }
                        this.pg_txtItemCode.setVal(e.value)
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
                            query :"SELECT ITEMS_VW_01.GUID,CODE,NAME,VAT,COST_PRICE,ITEMS_VW_01.UNIT FROM ITEMS_VW_01 INNER JOIN ITEM_BARCODE_VW_01 ON ITEMS_VW_01.GUID = ITEM_BARCODE_VW_01.ITEM_GUID WHERE CODE = @CODE OR ITEM_BARCODE_VW_01.BARCODE = @CODE",
                            param : ['CODE:string|50'],
                            value : [r.component._changedValue]
                        }
                        let tmpData = await this.core.sql.execute(tmpQuery) 
                        if(tmpData.result.recordset.length > 0)
                        {
                            this.combineControl = true
                            this.combineNew = false
                            await this.addItem(tmpData.result.recordset[0],e.rowIndex)
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
                            onClick:async()  =>
                            {
                                this.pg_txtItemCode.onClick = async(data) =>
                                {
                                    this.combineControl = true
                                    this.combineNew = false
                                    
                                    this.grdList.devGrid.beginUpdate()
                                    for (let i = 0; i < data.length; i++) 
                                    {
                                        await this.addItem(data[i],e.rowIndex)
                                    }
                                    this.grdList.devGrid.endUpdate()
                                }
                                this.pg_txtItemCode.show()
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            let tmpQuery = 
            {
                query : "SELECT * FROM ITEMS_VW_01 WHERE CODE = @CODE",
                param : ['CODE:string|25'],
                value : [pCode]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 

            if(typeof tmpData.result.err == 'undefined' && tmpData.result.recordset.length > 0)
            {
                resolve(tmpData.result.recordset)
            }
        })
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
                                                id:'msgItemBack',showTitle:true,title:this.t("msgItemBack.title"),showCloseButton:true,width:'500px',height:'200px',
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
                                            id:'msgNewItem',showTitle:true,title:this.t("msgNewItem.title"),showCloseButton:true,width:'500px',height:'200px',
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmHeader" + this.tabIndex}
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
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
                        <div className="col-12 pe-0">
                            <NdLayout parent={this} id={"frmHeader" + this.tabIndex} cols={2}>
                                {/* txtItemCodeLy */}
                                <NdLayoutItem key={"txtItemCodeLy"} id={"txtItemCodeLy"} parent={this} data-grid={{x:0,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtItemCodeLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtItemCode") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtItemCode" parent={this} tabIndex={this.tabIndex} simple={true}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            button={
                                            [
                                                {
                                                    id:'01',
                                                    icon:'more',
                                                    onClick:()=>
                                                    {
                                                        this.pg_txtItemCode.show()
                                                        this.pg_txtItemCode.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.txtItemCode.GUID = data[0].GUID
                                                                this.txtItemCode.value = data[0].CODE
                                                                this.txtItemName.value = data[0].NAME
                                                            }
                                                        }
                                                    }
                                                }
                                            ]}
                                            param={this.param.filter({ELEMENT:'txtItemCode',USERS:this.user.CODE})} 
                                            selectAll={true}                           
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validItemCode")} />
                                                </Validator>
                                            </NdTextBox>      
                                            {/* STOK SEÇİM POPUP */}
                                            <NdPopGrid id={"pg_txtItemCode"} parent={this} container={"#root"} 
                                            visible={false}
                                            position={{of:'#root'}} 
                                            showTitle={true} 
                                            showBorders={true}
                                            width={'90%'}
                                            height={'90%'}
                                            title={this.t("pg_txtItemCode.title")} 
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
                                            deferRendering={true}
                                            >
                                                <Column dataField="CODE" caption={this.t("pg_txtItemCode.clmCode")} width={'20%'} />
                                                <Column dataField="NAME" caption={this.t("pg_txtItemCode.clmName")} width={'70%'} defaultSortOrder="asc" />
                                                <Column dataField="STATUS" caption={this.t("pg_txtItemCode.clmStatus")} width={'10%'} />
                                            </NdPopGrid>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtItemNameLy */}
                                <NdLayoutItem key={"txtItemNameLy"} id={"txtItemNameLy"} parent={this} data-grid={{x:1,y:0,h:1,w:1}} access={this.access.filter({ELEMENT:'txtItemNameLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtItemName") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtItemName" parent={this} tabIndex={this.tabIndex} readOnly={true} simple={true}
                                            param={this.param.filter({ELEMENT:'txtItemName',USERS:this.user.CODE})} 
                                            selectAll={true}
                                            >
                                            </NdTextBox>      
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* dtDateLy */}
                                <NdLayoutItem key={"dtDateLy"} id={"dtDateLy"} parent={this} data-grid={{x:0,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'dtDateLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("dtDate") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdDatePicker parent={this} id={"dtDate"} tabIndex={this.tabIndex} simple={true}
                                            onValueChanged={(async()=>
                                            {
                                                this.docObj.docCustomer.dt()[0].DOC_DATE = this.dtDocDate.value 
                                            }).bind(this)}
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validDate")} />
                                                </Validator> 
                                            </NdDatePicker>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* txtQuantityLy */}
                                <NdLayoutItem key={"txtQuantityLy"} id={"txtQuantityLy"} parent={this} data-grid={{x:1,y:1,h:1,w:1}} access={this.access.filter({ELEMENT:'txtQuantityLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-4 p-0 pe-1'>
                                            <label className="col-form-label d-flex justify-content-end">{this.t("txtQuantity") + " :"}</label>
                                        </div>
                                        <div className="col-8 p-0">
                                            <NdTextBox id="txtQuantity" parent={this} tabIndex={this.tabIndex} simple={true}
                                            param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})} 
                                            selectAll={true}
                                            >
                                                <Validator validationGroup={"frmHeader"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validQuantity")} />
                                                </Validator>
                                            </NdTextBox>      
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* ButtonBar */}
                                <NdLayoutItem key={"ButtonBarLy"} id={"ButtonBarLy"} parent={this} data-grid={{x:0,y:2,h:1,w:2}} access={this.access.filter({ELEMENT:'ButtonBarLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3">
                                        <div className='col-1 p-0 pe-1'>
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
                                        </div>
                                    </div>
                                </NdLayoutItem>
                                {/* grdListLy */}
                                <NdLayoutItem key={"grdListLy"} id={"grdListLy"} parent={this} data-grid={{x:0,y:3,h:13,w:2}} access={this.access.filter({ELEMENT:'grdListLy',USERS:this.user.CODE})}>
                                    <div className="row pe-3" style={{height:'100%'}}>
                                        <div className="col-12 p-0">
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onReady={async()=>
                                            {
                                                await this.grdList.dataRefresh({source:this.productObj.dt()});
                                            }}
                                            >
                                                <Paging defaultPageSize={6} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="RAW_ITEM_CODE" caption={this.t("grdList.clmCode")} allowEditing={true} width={'30%'} editCellRender={this._cellRoleRender}/>
                                                <Column dataField="RAW_ITEM_NAME" caption={this.t("grdList.clmName")} allowEditing={false} width={'60%'}/>
                                                <Column dataField="RAW_QTY" caption={this.t("grdList.clmQuantity")} visible={true} allowEditing={true} width={'10%'}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </NdLayoutItem>
                            </NdLayout>
                        </div>
                    </div>
                    {/* ACCESS COMPONENT */}
                    <div>
                        <NdAccessEdit id={"accesComp"} parent={this}/>
                    </div>                            
                </ScrollView>
            </React.Fragment>
        )
    }
}