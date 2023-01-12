import React from 'react';
import App from '../../../lib/app.js';
import {priceListCls} from '../../../../core/cls/contract.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class salePriceList extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.priceListObj = new priceListCls();
        this.tabIndex = props.data.tabkey

        this.multiItemData = new datatable

        
    } 
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.priceListObj.clearAll();
        this.txtCode.value = '',
        this.txtName.value = '',

        this.priceListObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.priceListObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.priceListObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.priceListObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
             
        await this.grpPriceList.dataRefresh({source:this.priceListObj.dt('PRICE_LIST')});
    }
    async addItem(pData)
    {
        let tmpEmpty = {...this.priceListObj.empty};
                                                    
        tmpEmpty.CUSER = this.core.auth.data.CODE,  
        tmpEmpty.CUSER_NAME = this.core.auth.data.NAME,
        tmpEmpty.TYPE = 0,  
        tmpEmpty.ITEM = pData.GUID
        tmpEmpty.ITEM_CODE = pData.CODE
        tmpEmpty.ITEM_NAME =pData.NAME
        tmpEmpty.UNIT =pData.UNIT
        tmpEmpty.CODE = this.txtCode.value
        tmpEmpty.NAME = this.txtName.value
        tmpEmpty.VAT_RATE = pData.VAT
        let tmpCheckQuery = 
        {
            query :"SELECT dbo.FN_PRICE_SALE_VAT_EXT(@GUID,@QUANTITY,GETDATE(),@CUSTOMER) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
            value : [pData.GUID,1,'00000000-0000-0000-0000-000000000000']
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
        if(tmpCheckData.result.recordset.length > 0)
        {  
            tmpEmpty.PRICE_VAT_EXT = tmpCheckData.result.recordset[0].PRICE
        }
        else
        {
            tmpEmpty.PRICE_VAT_EXT= 0
        }
        let tmpPriceQuery = 
        {
            query :"SELECT [dbo].[FN_PRICE_SALE](@GUID,@QUANTITY,GETDATE(),@CUSTOMER) AS PRICE",
            param : ['GUID:string|50','QUANTITY:float','CUSTOMER:string|50'],
            value : [pData.GUID,1,'00000000-0000-0000-0000-000000000000']
        }
        let tmpPriceData = await this.core.sql.execute(tmpPriceQuery) 
        if(tmpPriceData.result.recordset.length > 0)
        {  
            tmpEmpty.PRICE = tmpPriceData.result.recordset[0].PRICE
        }
        else
        {
            tmpEmpty.PRICE = 0
        }
        
        this.priceListObj.addEmpty(tmpEmpty);
    }
    async multiItemAdd()
    {
        let tmpMissCodes = []
        let tmpCounter = 0
        if(this.multiItemData.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMultiData',showTitle:true,title:this.t("msgMultiData.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgMultiData.btn01"),location:'before'},{id:"btn02",caption:this.t("msgMultiData.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiData.msg")}</div>)
            }

            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                this.multiItemData.clear()
            }
        }
        for (let i = 0; i < this.tagItemCode.value.length; i++) 
        {
            let tmpQuery = 
            {
                query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.txtCustomerCode.GUID+"'),'') AS MULTICODE"+
                " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VALUE) OR UPPER(NAME) LIKE UPPER(@VALUE) " ,
                param : ['VALUE:string|50'],
                value : [this.tagItemCode.value[i]]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {
                if(typeof this.multiItemData.where({'CODE':tmpData.result.recordset[0].CODE})[0] == 'undefined')
                {
                    this.multiItemData.push(tmpData.result.recordset[0])
                    tmpCounter = tmpCounter + 1
                }
            }
            else
            {
                tmpMissCodes.push("'" +this.tagItemCode.value[i] + "'")
            }            
        }
        if(tmpMissCodes.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMissItemCode',showTitle:true,title:this.t("msgMissItemCode.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.t("msgMissItemCode.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",wordWrap:"break-word",fontSize:"20px"}}>{this.t("msgMissItemCode.msg") + ' ' +tmpMissCodes}</div>)
            }
        
            await dialog(tmpConfObj);
        }
        let tmpConfObj =
        {
            id:'msgMultiCodeCount',showTitle:true,title:this.t("msgMultiCodeCount.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgMultiCodeCount.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgMultiCodeCount.msg") + ' ' +tmpCounter}</div>)
        }
    
         await dialog(tmpConfObj);

    }
    async multiItemSave()
    {
        for (let i = 0; i < this.multiItemData.length; i++) 
        {                        
            let tmpEmpty = {...this.priceListObj.empty};
            
            tmpEmpty.CUSER = this.core.auth.data.CODE,  
            tmpEmpty.TYPE = 1,  
            tmpEmpty.CODE = '',  
            tmpEmpty.NAME = '',  
            tmpEmpty.ITEM = this.multiItemData[i].GUID
            tmpEmpty.ITEM_CODE = this.multiItemData[i].CODE
            tmpEmpty.ITEM_NAME = this.multiItemData[i].NAME
            tmpEmpty.PRICE = this.multiItemData[i].PRICE
            this.priceListObj.addEmpty(tmpEmpty);
        }
        this.popMultiItem.hide()
    }
    async getPriceList(pCode)
    {
        await this.priceListObj.load({CODE:pCode,TYPE:0});
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmSalePriceList"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
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
                                                
                                                if((await this.priceListObj.save()) == 0)
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
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            let tmpDelete = {...this.priceListObj.dt('PRICE_LIST')}
                                            for (let i = 0; i < tmpDelete.length; i++) 
                                            {
                                                this.priceListObj.dt('PRICE_LIST').removeAt(0)
                                            }
                                            await this.priceListObj.dt('PRICE_LIST').delete();
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
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
                            <Form colCount={3} id="frmHeader">
                                {/* txtCode */}
                                <Item>                                    
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.priceListObj.dt(),field:"CODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCode.show()
                                                    this.pg_txtCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getPriceList(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtCode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.cehckPriceList(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})} 
                                    >     
                                        <Validator validationGroup={"frmSalePriceList"  + this.tabIndex}>
                                            <RequiredRule />
                                        </Validator>  
                                    </NdTextBox>  
                                    {/* FİYAT LİSTE SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM PRICE_LIST_VW_01 WHERE TYPE = 0 GROUP BY CODE,NAME"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_Docs.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_Docs.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>    
                                </Item>
                                {/* txtName */}
                                <Item colSpan={2}>                                    
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.priceListObj.dt(),field:"NAME"}}
                                    >
                                        <Validator validationGroup={"frmSalePriceList"  + this.tabIndex}>
                                            <RequiredRule />
                                        </Validator>  
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
                                this.frmSalePriceList = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmSalePriceList"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.pg_txtPopItemsCode.show()
                                            this.pg_txtPopItemsCode.onClick = async(data) =>
                                            {
                                                if(data.length == 1)
                                                {
                                                    await this.addItem(data[0])
                                                }
                                                else if(data.length > 1)
                                                {
                                                    for (let i = 0; i < data.length; i++) 
                                                    {
                                                        if(i == 0)
                                                        {
                                                            await this.addItem(data[i])
                                                        }
                                                        else
                                                        {
                                                            this.txtRef.readOnly = true
                                                            this.txtRefno.readOnly = true
                                                            await this.core.util.waitUntil(100)
                                                            await this.addItem(data[i])
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
                                      <Button icon="increaseindent" text={this.lang.t("collectiveItemAdd")}
                                    validationGroup={"frmSalePriceList"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.multiItemData.clear
                                            this.popMultiItem.show()
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
                                    <NdGrid parent={this} id={"grpPriceList"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    height={'650'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                        if(typeof e.data.PRICE != 'undefined')
                                        {
                                            e.key.PRICE_VAT_EXT = parseFloat((e.key.PRICE / ((e.key.VAT_RATE / 100) + 1)).toFixed(2))
                                        }
                                        if(typeof e.data.PRICE_VAT_EXT != 'undefined')
                                        {
                                            e.key.PRICE = parseFloat((e.key.PRICE_VAT_EXT + ((e.key.PRICE_VAT_EXT * e.key.VAT_RATE) / 100)).toFixed(2))
                                        }
                                    }}
                                    onRowRemoved={async (e)=>{
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Export fileName={this.lang.t("menu.cnt_02_003")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grpPriceList.clmCreateDate")} allowEditing={false} width={200}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grpPriceList.clmItemCode")} width={150} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grpPriceList.clmItemName")} width={350} allowEditing={false}/>
                                        <Column dataField="PRICE" caption={this.t("grpPriceList.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="PRICE_VAT_EXT" caption={this.t("grpPriceList.clmVatExtPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                     {/* STOK POPUP */}
                     <div>
                        <NdPopUp parent={this} id={"popItems"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popItems.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'450'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsCode")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsCode"} parent={this} simple={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                   onEnterKey={(async()=>
                                        {
                                            
                                                await this.pg_txtPopItemsCode.setVal(this.txtPopItemsCode.value)
                                                this.pg_txtPopItemsCode.show()
                                                this.pg_txtPopItemsCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtPopItemsCode.GUID = data[0].GUID
                                                        this.txtPopItemsCode.value = data[0].CODE;
                                                        this.txtPopItemsName.value = data[0].NAME;
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
                                                                              
                                                    this.pg_txtPopItemsCode.show()
                                                    this.pg_txtPopItemsCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopItemsCode.GUID = data[0].GUID
                                                            this.txtPopItemsCode.value = data[0].CODE;
                                                            this.txtPopItemsName.value = data[0].NAME;
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }>       
                                    <Validator validationGroup={"frmPurcContItems"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validItemsCode")} />
                                    </Validator>                                 
                                    </NdTextBox>
                                    
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsName")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsName"} parent={this} simple={true} editable={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsPrice")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsPrice"} parent={this} simple={true} >
                                    <Validator validationGroup={"frmPurcContItems"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validItemPrice")} />
                                        </Validator>
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsQuantity"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.dtPopStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopStartDate"}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popItems.dtPopEndDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopEndDate"}/>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} validationGroup={"frmPurcContItems"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                   await this.addItem()
                                                    this.popItems.hide();
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
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popItems.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* Stok Grid */}
                    <NdPopGrid id={"pg_txtPopItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtPopItemsCode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT GUID,CODE,NAME,STATUS,VAT,UNIT FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >           
                    <Paging defaultPageSize={22} />
                    <Column dataField="CODE" caption={this.t("pg_txtPopItemsCode.clmCode")} width={150} />
                    <Column dataField="NAME" caption={this.t("pg_txtPopItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Dizayn Seçim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popDesign.design")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                        displayExpr="DESIGN_NAME"                       
                                        valueExpr="TAG"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async()=>
                                            {
                                            }).bind(this)}
                                        data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '31'"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmPurcOrderPrint"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validDesign")} />
                                            </Validator> 
                                        </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popDesign.lang")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            value=""
                                            searchEnabled={true}
                                            onValueChanged={(async()=>
                                                {
                                                }).bind(this)}
                                            data={{source:[{ID:"FR",VALUE:"FR"},{ID:"TR",VALUE:"TR"}]}}
                                            
                                        ></NdSelectBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM SALES_CONTRACT_VW_01 WHERE REF = @REF AND REF_NO = @REF_NO AND TYPE  = 1 ORDER BY CDATE " ,
                                                    param:  ['REF:string|50','REF_NO:int','DESIGN:string|25'],
                                                    value:  [this.docObj.dt()[0].REF,this.docObj.dt()[0].REF_NO,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                console.log(JSON.stringify(tmpData.result.recordset)) //BAK
                                                this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
                                                {
                                                    if(pResult.split('|')[0] != 'ERR')
                                                    {
                                                        var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         

                                                        mywindow.onload = function() 
                                                        {
                                                            mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                        } 
                                                        // let mywindow = window.open('','_blank',"width=900,height=1000,left=500");
                                                        // mywindow.document.write("<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' default-src='self' width='100%' height='100%'></iframe>");
                                                    }
                                                });
                                                this.popDesign.hide();  
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popDesign.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>    
                </ScrollView>
                {/* Toplu Stok PopUp */}
                <div>
                    <NdPopUp parent={this} id={"popMultiItem"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popMultiItem.title")}
                    container={"#root"} 
                    width={'900'}
                    height={'700'}
                    position={{of:'#root'}}
                    >
                        <Form colCount={2} height={'fit-content'}>
                        <Item colSpan={2}>
                            <Label  alignment="right" />
                                <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}
                                />
                        </Item>
                        <EmptyItem />       
                        <Item>
                            <Label text={this.t("cmbMultiItemType.title")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="cmbMultiItemType" height='fit-content' 
                            displayExpr="VALUE"                       
                            valueExpr="ID"
                            value={0}
                            data={{source:[{ID:0,VALUE:this.t("cmbMultiItemType.customerCode")},{ID:1,VALUE:this.t("cmbMultiItemType.ItemCode")}]}}
                            />
                        </Item>   
                        <EmptyItem />   
                        <Item>
                            <div className='row'>
                                <div className='col-6'>
                                    <NdButton text={this.t("popMultiItem.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                    onClick={async (e)=>
                                    {       
                                        this.multiItemAdd()
                                    }}/>
                                </div>
                                <div className='col-6'>
                                    <NdButton text={this.t("popMultiItem.btnClear")} type="normal" stylingMode="contained" width={'100%'}
                                    onClick={()=>
                                    {
                                        this.multiItemData.clear()
                                    }}/>
                                </div>
                            </div>
                        </Item>
                        <Item colSpan={2} >
                        <NdGrid parent={this} id={"grdMultiItem"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                headerFilter={{visible:true}}
                                filterRow = {{visible:true}}
                                height={400} 
                                width={'100%'}
                                dbApply={false}
                                onRowRemoved={async (e)=>{
                                    
                                }}
                                >
                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                    <Column dataField="CODE" caption={this.t("grdMultiItem.clmCode")} width={150} allowEditing={false} />
                                    <Column dataField="MULTICODE" caption={this.t("grdMultiItem.clmMulticode")} width={150} allowEditing={false} />
                                    <Column dataField="NAME" caption={this.t("grdMultiItem.clmName")} width={300}  headerFilter={{visible:true}} allowEditing={false} />
                                    <Column dataField="QUANTITY" caption={this.t("grdMultiItem.clmQuantity")} dataType={'number'} width={100} headerFilter={{visible:true}}/>
                                    <Column dataField="PRICE" caption={this.t("grdMultiItem.clmPrice")} dataType={'number'} width={100} headerFilter={{visible:true}}/>
                            </NdGrid>
                        </Item>
                        <EmptyItem />   
                        <Item>
                            <div className='row'>
                                <div className='col-6'>
                                    
                                </div>
                                <div className='col-6'>
                                    <NdButton text={this.t("popMultiItem.btnSave")} type="normal" stylingMode="contained" width={'100%'}
                                    onClick={()=>
                                    {
                                        this.multiItemSave()
                                    }}/>
                                </div>
                            </div>
                        </Item>
                        </Form>
                    </NdPopUp>
                </div> 
                {/* Birim PopUp */}
                <div>
                        <NdDialog parent={this} id={"msgUnit"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("msgUnit.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'400'}
                        position={{of:'#root'}}
                        button={[{id:"btn01",caption:this.t("msgUnit.btn01"),location:'after'}]}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <NdSelectBox simple={true} parent={this} id="cmbUnit"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async(e)=>
                                    {
                                        // this.txtUnitFactor.setState({value:this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].FACTOR});
                                        this.txtTotalQuantity.value = Number(this.txtUnitQuantity.value * this.txtUnitFactor.value);
                                    }).bind(this)}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtUnitFactor")} alignment="right" />
                                    <NdNumberBox id="txtUnitFactor" parent={this} simple={true}
                                    readOnly={true}
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtUnitQuantity")} alignment="right" />
                                    <NdNumberBox id="txtUnitQuantity" parent={this} simple={true}
                                    maxLength={32}
                                    onValueChanged={(async(e)=>
                                    {
                                       this.txtTotalQuantity.value = Number(this.txtUnitQuantity.value * this.txtUnitFactor.value)
                                    }).bind(this)}
                                    >
                                    </NdNumberBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("txtTotalQuantity")} alignment="right" />
                                    <NdNumberBox id="txtTotalQuantity" parent={this} simple={true}  readOnly={true}
                                    maxLength={32}
                                    >
                                    </NdNumberBox>
                                </Item>
                            </Form>
                        </NdDialog>
                    </div>  
            </div>
        )
    }
}
