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
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class purchaseContract extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
               
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.contractObj = new contractCls();
        this.tabIndex = props.data.tabkey

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
                
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.contractObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.contractObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.contractObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
             
        this.cmbDepot.value = ''
        this.txtRef.value =this.user.CODE
        this.txtCustomerCode.value = ''
        this.txtCustomerName.value = ''
        this.startDate.value = moment(new Date(0)).format("YYYY-MM-DD")
        this.finishDate.value = moment(new Date(0)).format("YYYY-MM-DD")
        await this.grdContracts.dataRefresh({source:this.contractObj.dt('SALES_CONTRACT')});
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});
        this.txtRef.props.onChange()
    }
    async _getItems()
    {
        let tmpSource =
        {
            source:
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME,VAT," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.txtCustomerCode.GUID+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                    param : ['VAL:string|50']
                },
                sql:this.core.sql
            }
        }
        this.pg_txtPopItemsCode.setSource(tmpSource)
    }
    async addItem(pData)
    {
       
        let tmpEmpty = {...this.contractObj.empty};
                                                    
        tmpEmpty.CUSER = this.core.auth.data.CODE,  
        tmpEmpty.CUSER_NAME = this.core.auth.data.NAME,
        tmpEmpty.REF = this.txtRef.value
        tmpEmpty.REF_NO = this.txtRefno.value
        tmpEmpty.TYPE = 1,  
        tmpEmpty.ITEM = pData.GUID
        tmpEmpty.ITEM_CODE = pData.CODE
        tmpEmpty.ITEM_NAME =pData.NAME
        tmpEmpty.CUSTOMER = this.txtCustomerCode.GUID
        tmpEmpty.CUSTOMER_CODE = this.txtCustomerCode.value
        tmpEmpty.CUSTOMER_NAME = this.txtCustomerName.value
        tmpEmpty.QUANTITY = 1
        tmpEmpty.START_DATE = this.startDate.value
        tmpEmpty.FINISH_DATE = this.finishDate.value
        if(this.cmbDepot.value != '')
        {
            tmpEmpty.DEPOT = this.cmbDepot.value 
            tmpEmpty.DEPOT_NAME = this.cmbDepot.displayExpr 
        }   
        let tmpCheckQuery = 
        {
            query :"SELECT COST_PRICE,VAT,(SELECT [dbo].[FN_PRICE_SALE](@GUID,1,GETDATE(),@CUSTOMER_GUID)) AS PRICE FROM ITEMS WHERE ITEMS.GUID = @GUID",
            param : ['GUID:string|50','CUSTOMER_GUID:string|50','QUANTITY:float'],
            value : [pData.GUID,this.txtCustomerCode.GUID,1]
        }
        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
        if(tmpCheckData.result.recordset.length > 0)
        {  
            tmpEmpty.PRICE= tmpCheckData.result.recordset[0].PRICE
            tmpEmpty.COST_PRICE = tmpCheckData.result.recordset[0].COST_PRICE
            tmpEmpty.PRICE_VAT_EXT = (tmpCheckData.result.recordset[0].PRICE / ((tmpCheckData.result.recordset[0].VAT / 100) + 1))
            tmpEmpty.VAT_RATE = tmpCheckData.result.recordset[0].VAT
        }
        else
        {
            tmpEmpty.PRICE= 0
        }
        
        this.contractObj.addEmpty(tmpEmpty);
        this._calculateMargin()
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
                    query :"SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                    "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.txtCustomerCode.GUID+"'),'') AS MULTICODE"+
                    " FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.txtCustomerCode.GUID+"'),'') = @VALUE " ,
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
            let tmpEmpty = {...this.contractObj.empty};
            
            tmpEmpty.CUSER = this.core.auth.data.CODE,  
            tmpEmpty.REF = this.txtRef.value
            tmpEmpty.REF_NO = this.txtRefno.value
            tmpEmpty.TYPE = 1,  
            tmpEmpty.ITEM = this.multiItemData[i].GUID
            tmpEmpty.ITEM_CODE = this.multiItemData[i].CODE
            tmpEmpty.ITEM_NAME = this.multiItemData[i].NAME
            tmpEmpty.COST_PRICE = this.multiItemData[i].COST_PRICE
            tmpEmpty.CUSTOMER = this.txtCustomerCode.GUID
            tmpEmpty.CUSTOMER_CODE = this.txtCustomerCode.value
            tmpEmpty.CUSTOMER_NAME = this.txtCustomerName.value
            tmpEmpty.QUANTITY = this.multiItemData[i].QUANTITY
            tmpEmpty.PRICE = this.multiItemData[i].PRICE
            tmpEmpty.START_DATE = this.startDate.value
            tmpEmpty.FINISH_DATE = this.finishDate.value
            if(this.cmbDepot.value != '')
            {
                tmpEmpty.DEPOT = this.cmbDepot.value 
                tmpEmpty.DEPOT_NAME = this.cmbDepot.displayExpr 
            }   
            this.contractObj.addEmpty(tmpEmpty);
        }
        this.popMultiItem.hide()
    }
    async _calculateMargin()
    {
        for(let  i= 0; i < this.contractObj.dt().length; i++)
        {
            let tmpMargin = (this.contractObj.dt()[i].PRICE_VAT_EXT) - (this.contractObj.dt()[i].COST_PRICE )
            let tmpMarginRate = (tmpMargin ) * 100
            this.contractObj.dt()[i].MARGIN = tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2)
            console.log(tmpMargin.toFixed(2) + "€ / %" +  tmpMarginRate.toFixed(2))
            console.log( tmpMarginRate.toFixed(2))
            console.log(this.contractObj.dt()[i].MARGIN)
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmPurcContract"  + this.tabIndex}
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
                                            this.contractObj.dt().removeAt(0)
                                            await this.contractObj.dt().delete();
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
                                  {/* txtRef-Refno */}
                                  <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"REF"}}
                                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                            maxLength={32}
                                            onChange={(async(e)=>
                                            {
                                                let tmpQuery = 
                                                {
                                                    query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM SALES_CONTRACT WHERE TYPE = 1  AND REF = @REF ",
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
                                            <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"REF_NO"}}
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
                                                                    await this.contractObj.load({REF:data[0].REF,REF_NO:data[0].REF_NO,TYPE:1});
                                                                    this.txtCustomerCode.GUID = this.contractObj.dt()[0].CUSTOMER
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
                                            <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
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
                                    data={{source:{select:{query : "SELECT REF,REF_NO,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME FROM SALES_CONTRACT_VW_01 WHERE TYPE = 1 GROUP BY REF,REF_NO,CUSTOMER,CUSTOMER_CODE,CUSTOMER_NAME"},sql:this.core.sql}}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                   
                                                }
                                            }
                                        ]
                                        
                                    }
                                    >
                                        <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_NAME" caption={this.t("pg_Docs.clmOutputName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="CUSTOMER_CODE" caption={this.t("pg_Docs.clmOutputCode")} width={300} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
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
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN (0,2) AND STATUS = 1"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </Item>
                                {/* Boş */}
                                <EmptyItem />
                                 {/* txtCustomerCode */}
                                 <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"CUSTOMER_CODE"}}
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
                                        <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
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
                                    dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"CUSTOMER_NAME"}}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                                {/* Boş */}
                                <EmptyItem />
                                {/* startDate */}
                                <Item>
                                    <Label text={this.t("startDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"startDate"}
                                    dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"START_DATE"}}
                                    onValueChanged={(async()=>
                                        {
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
                                    dt={{data:this.contractObj.dt('SALES_CONTRACT'),field:"FINISH_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                    >
                                        < Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validDate")} />
                                        </Validator>  
                                    </NdDatePicker>
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
                                    height={'650'} 
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
                                    onRowRemoved={async (e)=>{
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={10} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Export fileName={this.lang.t("menu.cnt_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="CDATE_FORMAT" caption={this.t("grdContracts.clmCreateDate")} allowEditing={false} width={200}/>
                                        <Column dataField="ITEM_CODE" caption={this.t("grdContracts.clmItemCode")} width={150} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdContracts.clmItemName")} width={350} allowEditing={false}/>
                                        <Column dataField="COST_PRICE" caption={this.t("grdContracts.clmCostPrice")} width={80} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false}/>
                                        <Column dataField="PRICE" caption={this.t("grdContracts.clmPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                        <Column dataField="PRICE_VAT_EXT" caption={this.t("grdContracts.clmVatExtPrice")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} />
                                        <Column dataField="QUANTITY" caption={this.t("grdContracts.clmQuantity")} dataType={'number'}/>
                                        <Column dataField="MARGIN" caption={this.t("grdContracts.clmMargin")} allowEditing={false}/>
                                        <Column dataField="START_DATE" caption={this.t("grdContracts.clmStartDate")} dataType={'date'}
                                        editorOptions={{value:null}}
                                        cellRender={(e) => 
                                        {
                                            if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                            {
                                                return e.text
                                            }
                                            
                                            return
                                        }}/>
                                        <Column dataField="FINISH_DATE" caption={this.t("grdContracts.clmFinishDate")} dataType={'date'}
                                         editorOptions={{value:null}}
                                         cellRender={(e) => 
                                         {
                                             if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                             {
                                                 return e.text
                                             }
                                             
                                             return
                                         }}/>
                                        <Column dataField="DEPOT_NAME" caption={this.t("grdContracts.clmDepotName")} allowEditing={false}/>
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
            </div>
        )
    }
}
