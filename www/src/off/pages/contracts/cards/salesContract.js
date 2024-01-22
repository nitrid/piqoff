import React from 'react';
import App from '../../../lib/app.js';
import {contractCls} from '../../../../core/cls/contract.js'
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
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export, ColumnChooser} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';

export default class salesContract extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.contractObj = new contractCls();
        this.tabIndex = props.data.tabkey
        
        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._getItems = this._getItems.bind(this)
        this.multiItemData = new datatable
    } 
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.contractObj.clearAll();

        this.contractObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.contractObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.contractObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.contractObj.ds.on('onDelete',(pTblName) =>
        {
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })

        let tmpEmpty = {...this.contractObj.empty};
        tmpEmpty.CUSER = this.core.auth.data.CODE,  
        tmpEmpty.CUSER_NAME = this.core.auth.data.NAME,
        tmpEmpty.TYPE = 0,
        tmpEmpty.CODE = '',
        tmpEmpty.NAME = '',
        tmpEmpty.VAT_TYPE = 0
        this.contractObj.addEmpty(tmpEmpty);

        this.cmbDepot.value = ''
        this.txtCustomerCode.value = ''
        this.txtCustomerName.value = ''
        this.txtCustomerCode.GUID = '00000000-0000-0000-0000-000000000000'
        this.txtCode.value = ''
        this.txtName.value = ''
        this.txtCode.readOnly = false
        this.txtName.readOnly = false

        this.docDate.value = moment(new Date()).format("YYYY-MM-DD")
        this.startDate.value = moment(new Date(0)).format("YYYY-MM-DD")
        this.finishDate.value = moment(new Date(0)).format("YYYY-MM-DD")
        await this.grdContracts.dataRefresh({source:this.contractObj.dt('ITEM_PRICE')});
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});

        this._getItems()        
    }
    async _getItems()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME,VAT,MAIN_GRP_NAME, " + 
                            "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '" + this.txtCustomerCode.GUID + "'),'') AS MULTICODE "+
                            "FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                    param : ['VAL:string|50']
                },
                sql:this.core.sql
            }
        }
        this.pg_txtPopItemsCode.setSource(tmpSource)
    }
    async addItem(pData)
    {
        App.instance.setState({isExecute:true})
        let tmpEmpty = {...this.contractObj.itemPrice.empty};
                                                    
        tmpEmpty.TYPE = 0,
        tmpEmpty.LIST_NO = 0,
        tmpEmpty.ITEM_GUID = pData.GUID
        tmpEmpty.ITEM_CODE = pData.CODE
        tmpEmpty.ITEM_NAME = pData.NAME

        if(this.cmbDepot.value != '')
        {
            tmpEmpty.DEPOT = this.cmbDepot.value 
            tmpEmpty.DEPOT_NAME = this.cmbDepot.displayExpr 
        }  

        tmpEmpty.START_DATE = this.startDate.value
        tmpEmpty.FINISH_DATE = this.finishDate.value
        tmpEmpty.CUSTOMER_GUID = this.txtCustomerCode.GUID
        tmpEmpty.CUSTOMER_CODE = this.txtCustomerCode.value
        tmpEmpty.CUSTOMER_NAME = this.txtCustomerName.value
        tmpEmpty.QUANTITY = 1
        tmpEmpty.CONTRACT_GUID = this.contractObj.dt()[0].GUID

        let tmpCheckQuery = 
        {
            query :"SELECT COST_PRICE,VAT,PRICE_SALE AS PRICE,UNIT_GUID,UNIT_NAME,UNIT_FACTOR,MAIN_GRP_NAME,ORGINS_NAME FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE ITEMS_BARCODE_MULTICODE_VW_01.GUID = @GUID",
            param : ['GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
            value : [pData.GUID,this.txtCustomerCode.GUID,1]
        }
        
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 

        if(tmpCheckData.result.recordset.length > 0)
        {  
            tmpEmpty.PRICE = tmpCheckData.result.recordset[0].PRICE
        }
        else
        {
            tmpEmpty.PRICE = 0
        }
        
        this.contractObj.itemPrice.addEmpty(tmpEmpty);
        this._calculateMargin()
        App.instance.setState({isExecute:false})
        this.btnSave.setState({disabled:false});
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
            if(this.cmbMultiItemType.value == 0)
            {
                let tmpQuery = 
                {
                    query : "SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                            "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '" + this.txtCustomerCode.GUID + "'),'') AS MULTICODE "+
                            "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '" + this.txtCustomerCode.GUID + "'),'') = @VALUE " ,
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
            else if (this.cmbMultiItemType.value == 1)
            {
                let tmpQuery = 
                {
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '" + this.txtCustomerCode.GUID + "'),'') AS MULTICODE"+
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
            this.addItem(this.multiItemData[i])
        }
        this.popMultiItem.hide()
    }
    async _calculateMargin()
    {
        for(let  i= 0; i < this.contractObj.dt().length; i++)
        {
            let tmpMargin = (this.contractObj.dt()[i].PRICE_VAT_EXT) - (this.contractObj.dt()[i].COST_PRICE)
            let tmpMarginRate = Number(this.contractObj.dt()[i].COST_PRICE).rate2Num(tmpMargin,2) //(tmpMargin ) * 100
            this.contractObj.dt()[i].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
        }
    }
    async checkRow()
    {
        for (let i = 0; i < this.contractObj.dt().length; i++) 
        {
            this.contractObj.dt()[i].INPUT = this.contractObj.dt()[0].INPUT
            this.contractObj.dt()[i].OUTPUT = this.contractObj.dt()[0].OUTPUT
            this.contractObj.dt()[i].DOC_DATE = this.contractObj.dt()[0].DOC_DATE
            this.contractObj.dt()[i].SHIPMENT_DATE = this.contractObj.dt()[0].SHIPMENT_DATE
        }
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == "UNIT_NAME")
        {
            return (
                <NdTextBox id={"txtGrdUnitName"+e.rowIndex} parent={this} simple={true} 
                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                value={e.value}
                onChange={(r)=>
                {
                }}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:async ()  =>
                            {
                                let tmpQuery = 
                                {
                                    query: "SELECT GUID,ISNULL((SELECT NAME FROM UNIT WHERE UNIT.ID = ITEM_UNIT.ID),'') AS NAME,FACTOR,TYPE FROM ITEM_UNIT WHERE DELETED = 0 AND ITEM = @ITEM ORDER BY TYPE" ,
                                    param:  ['ITEM:string|50'],
                                    value:  [e.data.ITEM]
                                }
                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                if(tmpData.result.recordset.length > 0)
                                {   
                                    this.cmbUnit.setData(tmpData.result.recordset)
                                    this.cmbUnit.value = e.data.UNIT
                                    this.txtUnitFactor.value = e.data.UNIT_FACTOR
                                    this.txtTotalQuantity.value = e.data.QUANTITY
                                    this.txtUnitQuantity.value = e.data.QUANTITY / e.data.UNIT_FACTOR
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                    {
                                        this.txtUnitPrice.value = parseFloat((e.data.PRICE_VAT_EXT / e.data.UNIT_FACTOR).toFixed(3))
                                    }
                                    else
                                    {
                                        this.txtUnitPrice.value = parseFloat((e.data.PRICE_VAT_EXT * e.data.UNIT_FACTOR).toFixed(3))
                                    }
                                   
                                }
                                await this.msgUnit.show().then(async () =>
                                {
                                    e.key.UNIT = this.cmbUnit.value
                                    e.key.UNIT_NAME = this.cmbUnit.displayValue
                                    e.key.UNIT_FACTOR = this.txtUnitFactor.value
                                    e.key.UNIT_PRICE = this.txtUnitPrice.value
                                    if(this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].TYPE == 1)
                                    {
                                        e.data.PRICE = parseFloat(((this.txtUnitPrice.value * this.txtUnitFactor.value) * ((e.data.VAT_RATE / 100) + 1)))
                                        e.data.PRICE_VAT_EXT = parseFloat((this.txtUnitPrice.value * this.txtUnitFactor.value))

                                    }
                                    else
                                    {
                                        e.data.PRICE = parseFloat(((this.txtUnitPrice.value / this.txtUnitFactor.value) * ((e.data.VAT_RATE / 100) + 1)))
                                        e.data.PRICE_VAT_EXT = parseFloat((this.txtUnitPrice.value / this.txtUnitFactor.value))
                                    }
                                    e.data.QUANTITY = 1 //this.txtTotalQuantity.value
                                    this.btnSave.setState({disabled:false});
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
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={async()=>
                                    {
                                        await this.contractObj.load({CODE:this.txtCode.value,TYPE:1});
                                        this.txtCustomerCode.GUID = this.contractObj.itemPrice.dt()[0].CUSTOMER_GUID
                                        this._getItems()
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmPurcContract"  + this.tabIndex}
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
                                                
                                                if((await this.contractObj.save()) == 0)
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
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
                                            this.contractObj.dt().removeAll()
                                            this.contractObj.itemPrice.dt().removeAll()
                                            await this.contractObj.dt().delete();
                                            await this.contractObj.itemPrice.dt().delete();
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
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.contractObj.dt('CONTRACT'),field:"CODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_Docs.show()
                                                    this.pg_Docs.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            await this.contractObj.load({CODE:data[0].CODE,TYPE:0});
                                                            this.txtCustomerCode.GUID = this.contractObj.itemPrice.dt()[0].CUSTOMER_GUID
                                                            this._getItems()
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
                                        // let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtCode.value)
                                        // if(tmpResult == 3)
                                        // {
                                        //     this.txtCode.value = "";
                                        // }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator> 
                                    </NdTextBox>                                
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_Docs.title")} 
                                    data={{source:{select:{query : "SELECT CODE,NAME,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME FROM CONTRACT_VW_01 WHERE TYPE = 0 GROUP BY CODE,NAME,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_Docs.clmCode")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="NAME" caption={this.t("pg_Docs.clmName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item>
                                {/* txtName */}
                                <Item>                                
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} dt={{data:this.contractObj.dt('CONTRACT'),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                            this.checkRow()
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN (0,2) AND STATUS = 1"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"CUSTOMER_CODE"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async()=>
                                    {
                                        await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                        this.pg_txtCustomerCode.show()
                                        this.pg_txtCustomerCode.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.txtCustomerCode.GUID = data[0].GUID
                                                this.txtCustomerCode.value = data[0].CODE;
                                                this.txtCustomerName.value = data[0].TITLE;
                                                
                                                this._getItems()
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
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtCustomerCode.GUID = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE;
                                                            this.txtCustomerName.value = data[0].TITLE;
                                                            
                                                            this._getItems()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomerCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150}/>
                                        
                                    </NdPopGrid>
                                </Item> 
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"CUSTOMER_NAME"}}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* docDate */}
                                <Item>
                                    <Label text={this.t("docDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"docDate"} dt={{data:this.contractObj.dt('CONTRACT'),field:"DOC_DATE"}} 
                                     onValueChanged={(async()=>
                                        {
                                            this.checkRow()
                                        }).bind(this)}
                                    />
                                </Item>
                                {/* startDate */}
                                <Item>
                                    <Label text={this.t("startDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"startDate"}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"START_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        < Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDate")} />
                                        </Validator>  
                                    </NdDatePicker>
                                </Item>
                                {/* finishDate */}
                                <Item>
                                    <Label text={this.t("finishDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"finishDate"}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"FINISH_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        this.checkRow()
                                    }).bind(this)}
                                    >
                                        < Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDate")} />
                                        </Validator>  
                                    </NdDatePicker>
                                </Item>
                                {/* cmbVatType */}
                                <Item>
                                    <Label text={this.t("cmbVatType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVatType" height='fit-content' dt={{data:this.contractObj.dt(),field:"VAT_TYPE"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,NAME:this.t("cmbVatType.vatInc")},{ID:1,NAME:this.t("cmbVatType.vatExt")}]}}
                                    param={this.param.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    />
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmPurcContract = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmPurcContract"  + this.tabIndex}
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
                                                            this.txtCode.readOnly = true
                                                            this.txtName.readOnly = true
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
                                                id:'msgContractValid',showTitle:true,title:this.t("msgContractValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgContractValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgContractValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }
                                    }}/>
                                      <Button icon="increaseindent" text={this.lang.t("collectiveItemAdd")}
                                    validationGroup={"frmPurcContract"  + this.tabIndex}
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
                                    <NdGrid parent={this} id={"grdContracts"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    headerFilter={{visible:true}}
                                    height={'700'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onRowUpdated={async(e)=>
                                    {
                                        if(typeof e.data.PRICE != 'undefined')
                                        {
                                            e.key.PRICE_VAT_EXT = (e.key.PRICE / ((e.key.VAT_RATE / 100) + 1))
                                        }
                                        if(typeof e.data.PRICE_VAT_EXT != 'undefined')
                                        {
                                            e.key.PRICE = (e.key.PRICE_VAT_EXT + ((e.key.PRICE_VAT_EXT * e.key.VAT_RATE) / 100))
                                        }
                                        this._calculateMargin()
                                    }}
                                    onRowPrepared={async (e)=>
                                    {
                                        this._calculateMargin()
                                    }}
                                    >
                                        <ColumnChooser enabled={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Export fileName={this.lang.t("menu.cnt_04_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdContracts.clmItemCode")} width={250} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdContracts.clmItemName")} width={600} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdContracts.clmQuantity")} width={100} dataType={'number'}/>
                                        <Column dataField="PRICE" caption={this.t("grdContracts.clmPrice")} dataType={'number'} allowEditing={true} width={100} format={{ style: "currency", currency: "EUR",precision: 2}}/>
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
                                            <NdButton text={this.lang.t("btnSave")} type="success" stylingMode="contained" width={'100%'} validationGroup={"frmPurcContItems"  + this.tabIndex}
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
                    >           
                        <Paging defaultPageSize={22} />
                        <Column dataField="CODE" caption={this.t("pg_txtPopItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtPopItemsCode.clmName")} width={200} defaultSortOrder="asc" />
                        <Column dataField="MAIN_GRP_NAME" caption={this.t("pg_txtPopItemsCode.clmGrpName")} width={100} />
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
                        height={'280'}
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
                                   data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
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
                                                    query: "SELECT *,CONVERT(NVARCHAR(10),PRICE) AS PRICES,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM CONTRACT_VW_01 WHERE CODE = @CODE AND TYPE  = 1 ORDER BY CDATE " ,
                                                    param:  ['CODE:string|25','DESIGN:string|25'],
                                                    value:  [this.contractObj.dt()[0].CODE,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                console.log(JSON.stringify(tmpData.result.recordset)) //BAK
                                                this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
                                                {
                                                    if(pResult.split('|')[0] != 'ERR')
                                                    {
                                                        if(window.navigator.platform == "MacIntel")
                                                        {
                                                            var a = document.createElement('a');
                                                            a.href = "data:application/pdf;base64," + pResult.split('|')[1];
                                                            a.setAttribute('target', '_blank');
                                                            a.click()
                                                        }
                                                        else
                                                        {
                                                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");                                                         
                                                            mywindow.onload = function() 
                                                            {
                                                                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                            } 
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
                                    <div className='row py-2'>
                                        <div className='col-6'>
                                            
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmSalesInvPrint" + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                this.popMailSend.show()
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* Mail Send PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popMailSend"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popMailSend.title")}
                        container={"#root"} 
                        width={'600'}
                        height={'600'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                    <NdTextBox id="txtMailSubject" parent={this} simple={true}
                                    maxLength={32}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                <Label text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                    <NdTextBox id="txtSendMail" parent={this} simple={true}
                                    maxLength={32}
                                    >
                                        <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                            <RequiredRule message={this.t("validMail")} />
                                        </Validator> 
                                    </NdTextBox>
                                </Item>
                                <Item>
                                    <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}/>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                            validationGroup={"frmMailsend"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,CONVERT(NVARCHAR(10),PRICE) AS PRICES,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM CONTRACT_VW_01 WHERE CODE = @CODE AND TYPE  = 1 ORDER BY CDATE " ,
                                                    param:  ['CODE:string|25','DESIGN:string|25'],
                                                    value:  [this.contractObj.dt()[0].CODE,this.cmbDesignList.value]
                                                }
                                                
                                                App.instance.setState({isExecute:true})
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                App.instance.setState({isExecute:false})
                                                this.core.socket.emit('devprint',"{TYPE:'REVIEW',PATH:'" + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + "',DATA:" + JSON.stringify(tmpData.result.recordset) + "}",(pResult) => 
                                                {
                                                    App.instance.setState({isExecute:true})
                                                    let tmpAttach = pResult.split('|')[1]
                                                    let tmpHtml = this.htmlEditor.value
                                                    if(this.htmlEditor.value.length == 0)
                                                    {
                                                        tmpHtml = ''
                                                    }
                                                    if(pResult.split('|')[0] != 'ERR')
                                                    {
                                                    }
                                                    let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName: this.cmbDesignList.displayValue + ".pdf",attachData:tmpAttach,text:""}
                                                    this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                    {
                                                        App.instance.setState({isExecute:false})
                                                        let tmpConfObj1 =
                                                        {
                                                            id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                        }
                                                        
                                                        if((pResult1) == 0)
                                                        {  
                                                            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgMailSendResult.msgSuccess")}</div>)
                                                            await dialog(tmpConfObj1);
                                                            this.htmlEditor.value = '',
                                                            this.txtMailSubject.value = '',
                                                            this.txtSendMail.value = ''
                                                            this.popMailSend.hide();  

                                                        }
                                                        else
                                                        {
                                                            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMailSendResult.msgFailed")}</div>)
                                                            await dialog(tmpConfObj1);
                                                            this.popMailSend.hide(); 
                                                        }
                                                    });
                                                }); 
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popMailSend.hide();  
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
                                    <NdButton text={this.t("popMultiItem.btnSave")} type="success" stylingMode="contained" width={'100%'}
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
                                    this.txtUnitFactor.setState({value:this.cmbUnit.data.datatable.where({'GUID':this.cmbUnit.value})[0].FACTOR});
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
                            <Item>
                                <Label text={this.t("txtUnitPrice")} alignment="right" />
                                <NdNumberBox id="txtUnitPrice" parent={this} simple={true} 
                                maxLength={32}
                                onEnterKey={(async(e)=>
                                    {
                                        this.msgUnit._onClick()
                                    }).bind(this)}
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
