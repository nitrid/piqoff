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
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class salesContract extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.tabIndex = props.data.tabkey
        this.grdData = new datatable()

        this.cellRoleRender = this.cellRoleRender.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();
    }
    async init()
    {
        this.txtCode.value = ""
        this.docDate.value = moment(new Date()).format("YYYY-MM-DD")
        this.grdData = new datatable()
        await this.grdContracts.dataRefresh({source:this.grdData});

        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME,VAT,MAIN_GRP_NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                    param : ['VAL:string|50']
                },
                sql:this.core.sql
            }
        }
        this.pg_txtPopItemsCode.setSource(tmpSource)
    }
    async btnGetContracts()
    {
        let tmpContDt = new datatable()

        for (let i = 0; i < this.txtCode.value.split(',').length; i++)
        {            
            tmpContDt.selectCmd = 
            {
                query : "SELECT " +
                        "GUID AS GUID," +
                        "DOC_DATE AS DOC_DATE," +
                        "CODE AS CODE," +
                        "NAME AS NAME," +
                        "START_DATE AS START_DATE," +
                        "FINISH_DATE AS FINISH_DATE," +
                        "CUSTOMER AS CUSTOMER," +
                        "DEPOT AS DEPOT," +
                        "ITEM AS ITEM," +
                        "ITEM_CODE AS ITEM_CODE," +
                        "ITEM_NAME AS ITEM_NAME," +
                        "VAT_RATE AS VAT_RATE," +
                        "ORGINS_NAME AS ORGINS_NAME," +
                        "QUANTITY AS QUANTITY," +
                        "PRICE AS PRICE," +
                        "PRICE_VAT_EXT AS PRICE_VAT_EXT," +
                        "MAIN_GRP_NAME AS MAIN_GRP_NAME," +
                        "UNIT AS UNIT," +
                        "UNIT_NAME AS UNIT_NAME," +
                        "UNIT_FACTOR AS UNIT_FACTOR," +
                        "UNIT_PRICE AS UNIT_PRICE," +
                        "UNIT_SYMBOL AS UNIT_SYMBOL, " +
                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = CONTRACT_VW_01.ITEM AND TYPE = 1),1) AS UNDER_UNIT_FACTOR, " +
                        "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = CONTRACT_VW_01.ITEM AND TYPE = 1),1) AS UNDER_UNIT_SYMBOL " +
                        "FROM CONTRACT_VW_01 WHERE CODE = @CODE AND TYPE = 1" +
                        "ORDER BY ITEM_CODE ASC" ,
                param : ['CODE:string|50'],
                value : [this.txtCode.code.split(',')[i]]
            } 
            await tmpContDt.refresh()
            
            for (let x = 0; x < tmpContDt.length; x++) 
            {
                this.docDate.value = moment(tmpContDt[0].DOC_DATE).format("YYYY-MM-DD")

                if(this.grdData.where({ITEM_CODE : tmpContDt[x].ITEM_CODE}).length == 0)
                {
                    tmpContDt[x]["P" + i] = Number(tmpContDt[x].PRICE_VAT_EXT).round(2)
                    tmpContDt[x]["PA" + i] = Number(tmpContDt[x].PRICE_VAT_EXT / tmpContDt[x].UNDER_UNIT_FACTOR).round(2)
                    this.grdData.push(tmpContDt[x],false)
                }
                else
                {
                    this.grdData.where({ITEM_CODE : tmpContDt[x].ITEM_CODE})[0]["P" + i] = Number(tmpContDt[x].PRICE_VAT_EXT).round(2)
                    this.grdData.where({ITEM_CODE : tmpContDt[x].ITEM_CODE})[0]["PA" + i] = Number(tmpContDt[x].PRICE_VAT_EXT / tmpContDt[x].UNDER_UNIT_FACTOR).round(2)
                }
            }
        }
        
        await this.grdContracts.dataRefresh({source:this.grdData});
    }
    async addItem(pData)
    {
        App.instance.setState({isExecute:true})
        let tmpCheckQuery = 
        {
            query :"SELECT CODE,NAME,VAT,PRICE_SALE AS PRICE,UNIT_GUID,UNIT_NAME,UNIT_FACTOR,MAIN_GRP_NAME,ORGINS_NAME, " + 
                   "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_BARCODE_MULTICODE_VW_01.GUID AND TYPE = 1),1) AS UNDER_UNIT_FACTOR, " +
                   "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_UNIT_VW_01.ITEM_GUID = ITEMS_BARCODE_MULTICODE_VW_01.GUID AND TYPE = 1),1) AS UNDER_UNIT_SYMBOL " +
                   "FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE ITEMS_BARCODE_MULTICODE_VW_01.GUID = @GUID",
            param : ['GUID:string|50'],
            value : [pData.GUID]
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 

        if(this.grdData.length > 0 && tmpCheckData.result.recordset.length > 0)
        {            
            let tmpEmpty = 
            {
                CODE : this.grdData[0].CODE,
                NAME : this.grdData[0].NAME,
                START_DATE : this.grdData[0].START_DATE,
                FINISH_DATE : this.grdData[0].FINISH_DATE,
                CUSTOMER : this.grdData[0].CUSTOMER,
                DEPOT : this.grdData[0].DEPOT,
                ITEM : pData.GUID,
                ITEM_CODE : tmpCheckData.result.recordset[0].CODE,
                ITEM_NAME : tmpCheckData.result.recordset[0].NAME,               
                VAT_RATE : tmpCheckData.result.recordset[0].VAT,
                ORGINS_NAME : tmpCheckData.result.recordset[0].ORGINS_NAME,
                QUANTITY : 1,
                PRICE_VAT_EXT : tmpCheckData.result.recordset[0].PRICE,
                MAIN_GRP_NAME : tmpCheckData.result.recordset[0].MAIN_GRP_NAME,
                UNIT : tmpCheckData.result.recordset[0].UNIT_GUID,
                UNIT_NAME : tmpCheckData.result.recordset[0].UNIT_NAME,
                UNIT_FACTOR : tmpCheckData.result.recordset[0].UNIT_FACTOR,
                UNIT_PRICE : parseFloat((tmpCheckData.result.recordset[0].PRICE / tmpCheckData.result.recordset[0].UNIT_FACTOR).toFixed(3)),
                UNIT_SYMBOL : "",
                UNDER_UNIT_FACTOR : tmpCheckData.result.recordset[0].UNDER_UNIT_FACTOR,
                UNDER_UNIT_SYMBOL : tmpCheckData.result.recordset[0].UNDER_UNIT_SYMBOL
            }

            for (let i = 0; i < this.txtCode.value.split(',').length; i++)
            {
                tmpEmpty.NAME = this.txtCode.value.split(',')[i]
                tmpEmpty["P" + i] = Number(tmpCheckData.result.recordset[0].PRICE).round(2)
                tmpEmpty["PA" + i] = Number(tmpCheckData.result.recordset[0].PRICE / tmpCheckData.result.recordset[0].UNDER_UNIT_FACTOR).round(2)
            } 
            this.grdData.push(tmpEmpty)
        }
        await this.grdContracts.dataRefresh({source:this.grdData});
        App.instance.setState({isExecute:false})
    }
    async save()
    {
        App.instance.setState({isExecute:true})
        this.grdContracts.devGrid.saveEditData()
        for (let i = 0; i < this.txtCode.value.split(',').length; i++)
        {
            for (let x = 0; x < this.grdData.length; x++) 
            {
                let tmpPrice = this.grdData[x]["P" + i] * ((this.grdData[x].VAT_RATE / 100) + 1)
                let tmpInsUpQuery = 
                {
                    query : "DECLARE @TMPGUID AS NVARCHAR(50) " +
                            "SELECT @TMPGUID = ISNULL(GUID,'00000000-0000-0000-0000-000000000000') FROM [dbo].[CONTRACT_VW_01] WHERE CODE = @PCODE AND ITEM = @PITEM AND TYPE = 1 " +
                            "IF @TMPGUID <> '00000000-0000-0000-0000-000000000000' " +
                            "BEGIN " +
                            "EXEC [dbo].[PRD_CONTRACT_UPDATE] @GUID = @TMPGUID, @DOC_DATE = @PDOC_DATE, @PRICE = @PPRICE, @UNIT = @PUNIT, @QUANTITY = @PQUANTITY " +
                            "END " +
                            "ELSE " +
                            "BEGIN " +
                            "EXEC [dbo].[PRD_CONTRACT_INSERT] " +
                            "@CUSER = @PCUSER, " +
                            "@DOC_DATE = @PDOC_DATE, " +
                            "@CODE = @PCODE, " +
                            "@NAME = @PNAME, " +
                            "@TYPE = @PTYPE, " +
                            "@START_DATE = @PSTART_DATE, " +
                            "@FINISH_DATE = @PFINISH_DATE, " +
                            "@CUSTOMER = @PCUSTOMER, " +
                            "@DEPOT = @PDEPOT, " +
                            "@ITEM = @PITEM, " +
                            "@QUANTITY = @PQUANTITY, " +
                            "@PRICE = @PPRICE, " +
                            "@UNIT = @PUNIT " +
                            "END",
                    param : ['PCUSER:string|25','PDOC_DATE:date','PCODE:string|25','PNAME:string|250','PTYPE:int','PSTART_DATE:date','PFINISH_DATE:date',
                            'PCUSTOMER:string|50','PDEPOT:string|50','PITEM:string|50','PQUANTITY:float','PPRICE:float','PUNIT:string|50'],
                    value : [this.core.auth.data.CODE,this.docDate.value,this.txtCode.code.split(',')[i],this.txtCode.value.split(',')[i],1,
                            this.grdData[x].START_DATE,this.grdData[x].FINISH_DATE,this.grdData[x].CUSTOMER,this.grdData[x].DEPOT,this.grdData[x].ITEM,
                            this.grdData[x].QUANTITY,tmpPrice,this.grdData[x].UNIT]
                }
                await this.core.sql.execute(tmpInsUpQuery) 
            }            
        } 

        App.instance.setState({isExecute:false})

        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
            content : (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
        }
        await dialog(tmpConfObj1);        
    }
    cellRoleRender(e)
    {
        if(e.column.dataField == "UNIT_NAME")
        {
            return (
                <NdTextBox id={"txtGrdUnitName"+e.rowIndex} parent={this} simple={true} 
                value={e.value}
                button={
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
                                e.data.QUANTITY = 1; //this.txtTotalQuantity.value
                                this.btnSave.setState({disabled:false});
                            });  
                        }
                    },
                ]}
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmContract"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        this.save();
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
                                    <NdTextBox id="txtCode" parent={this} simple={true}
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
                                                        this.txtCode.value = ""
                                                        this.txtCode.code = ""

                                                        for (let i = 0; i < data.length; i++) 
                                                        {
                                                            this.txtCode.value = (i == (data.length - 1)) ?  this.txtCode.value + data[i].NAME : this.txtCode.value + data[i].NAME + ","
                                                            this.txtCode.code = (i == (data.length - 1)) ?  this.txtCode.code + data[i].CODE : this.txtCode.code + data[i].CODE + ","
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >                                       
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
                                    data={{source:{select:{query : "SELECT CODE,NAME,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME FROM CONTRACT_VW_01 WHERE TYPE = 1 GROUP BY CODE,NAME,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME"},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_Docs.clmCode")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="NAME" caption={this.t("pg_Docs.clmName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* docDate */}
                                <Item>
                                    <Label text={this.t("docDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"docDate"} />
                                </Item>
                                {/* btnGet */}
                                <Item >
                                    <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetContracts.bind(this)}></NdButton>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={1} onInitialized={(e)=>
                            {
                                this.frmContract = e.component
                            }}>
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup={"frmContract"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        this.pg_txtPopItemsCode.show()
                                        this.pg_txtPopItemsCode.onClick = async(data) =>
                                        {
                                            for (let i = 0; i < data.length; i++) 
                                            {
                                                await this.core.util.waitUntil(100)
                                                await this.addItem(data[i])
                                            }
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
                                        if(typeof e.data.P0 != 'undefined')
                                        {
                                            e.key.PA0 = Number(e.data.P0 / e.key.UNDER_UNIT_FACTOR).round(2)
                                        }
                                        if(typeof e.data.PA0 != 'undefined')
                                        {
                                            e.key.P0 = Number(e.data.PA0 * e.key.UNDER_UNIT_FACTOR).round(2)
                                        }
                                        if(typeof e.data.P1 != 'undefined')
                                        {
                                            e.key.PA1 = Number(e.data.P1 / e.key.UNDER_UNIT_FACTOR).round(2)
                                        }
                                        if(typeof e.data.PA1 != 'undefined')
                                        {
                                            e.key.P1 = Number(e.data.PA1 * e.key.UNDER_UNIT_FACTOR).round(2)
                                        }

                                        await this.grdContracts.dataRefresh({source:this.grdData});
                                    }}
                                    onRowRemoved={async (e)=>
                                    {
                                        for (let i = 0; i < this.txtCode.value.split(',').length; i++)
                                        {
                                            let tmpDelQuery = 
                                            {
                                                query : "DECLARE @TMPGUID AS NVARCHAR(50) " +
                                                        "SELECT @TMPGUID = ISNULL(GUID,'00000000-0000-0000-0000-000000000000') FROM [dbo].[CONTRACT_VW_01] WHERE CODE = @PCODE AND ITEM = @PITEM AND TYPE = 1 " +
                                                        "IF @TMPGUID <> '00000000-0000-0000-0000-000000000000' " + 
                                                        "BEGIN " +
                                                        "EXEC [dbo].[PRD_CONTRACT_DELETE] @CUSER = @PCUSER, @UPDATE = 1, @GUID = @TMPGUID " +
                                                        "END" ,
                                                param : ['PCUSER:string|25','PCODE:string|25','PITEM:string|50'],
                                                value : [this.core.auth.data.CODE,this.txtCode.code.split(',')[i],e.data.ITEM]
                                            }
    
                                            await this.core.sql.execute(tmpDelQuery)
                                        }
                                    }}
                                    onReady={async()=>
                                    {
                                        await this.grdContracts.dataRefresh({source:this.grdData});
                                    }}
                                    >
                                        <StateStoring enabled={true} type="localStorage" storageKey={this.props.data.id + "grdContracts"}/>
                                        <ColumnChooser enabled={true} />
                                        <ColumnChooser enabled={true} />
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="batch" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Export fileName={this.lang.t("menu.cnt_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdContracts.clmItemCode")} width={150} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdContracts.clmItemName")} width={300} allowEditing={false}/>
                                        <Column dataField="ORGINS_NAME" caption={this.t("grdContracts.clmOrgins")} width={110} allowEditing={false}/>
                                        <Column dataField="MAIN_GRP_NAME" caption={this.t("grdContracts.clmGrpName")} width={150} allowEditing={false}/>
                                        <Column dataField="P0" caption={this.t("grdContracts.clmPrice1")} width={80} allowEditing={true} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="PA0" caption={this.t("grdContracts.clmUnderPrice1")} width={80} allowEditing={true} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}
                                        cellRender={(e)=>{return "€" + e.value + " / " + e.data.UNDER_UNIT_SYMBOL}}
                                        />
                                        <Column dataField="P1" caption={this.t("grdContracts.clmPrice2")} width={80} allowEditing={true} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="PA1" caption={this.t("grdContracts.clmUnderPrice2")} width={80} allowEditing={true} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}
                                        cellRender={(e)=>{return "€" + e.value + " / " + e.data.UNDER_UNIT_SYMBOL}}/>
                                        <Column dataField="UNIT_NAME" caption={this.t("grdContracts.clmUnit")} width={100} editCellRender={this.cellRoleRender}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdContracts.clmQuantity")} width={80} dataType={'number'}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                </ScrollView>
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
                                />
                            </Item>
                            <Item>
                                <Label text={this.t("msgUnit.txtUnitFactor")} alignment="right" />
                                <NdNumberBox id="txtUnitFactor" parent={this} simple={true} readOnly={true} maxLength={32} />
                            </Item>
                            <Item>
                                <Label text={this.t("msgUnit.txtUnitQuantity")} alignment="right" />
                                <NdNumberBox id="txtUnitQuantity" parent={this} simple={true}
                                maxLength={32}
                                onValueChanged={(async(e)=>
                                {
                                    this.txtTotalQuantity.value = Number(this.txtUnitQuantity.value * this.txtUnitFactor.value)
                                }).bind(this)}
                                />
                            </Item>
                            <Item>
                                <Label text={this.t("msgUnit.txtTotalQuantity")} alignment="right" />
                                <NdNumberBox id="txtTotalQuantity" parent={this} simple={true}  readOnly={true} maxLength={32}/>
                            </Item>
                            <Item>
                                <Label text={this.t("msgUnit.txtUnitPrice")} alignment="right" />
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
            </div>
        )
    }
}