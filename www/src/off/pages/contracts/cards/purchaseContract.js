import React from 'react';
import App from '../../../lib/app.js';
import {contractCls} from '../../../../core/cls/contract.js'

import {NdForm,NdItem,NdLabel,NdEmptyItem} from '../../../../core/react/devex/form.js';
import {NdToast} from '../../../../core/react/devex/toast.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import { Button } from 'devextreme-react/button';
import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Pager,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTagBox from '../../../../core/react/devex/tagbox.js';
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
        this.isUnmounted = false; // Unmount durumunu takip etmek iç

        //this._cellRoleRender = this._cellRoleRender.bind(this)
        this.getItems = this.getItems.bind(this)
        this.multiItemData = new datatable
        this.checkboxReset = this.checkboxReset.bind(this)
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
            if(pData.stat == 'new' )
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
        tmpEmpty.TYPE = 1,
        tmpEmpty.CODE = '',
        tmpEmpty.NAME = '',
        tmpEmpty.VAT_TYPE = 0
        this.contractObj.addEmpty(tmpEmpty);

        this.cmbDepot.value = ''
        this.txtCustomerCode.value = ''
        this.txtCustomerName.value = ''
        this.txtCode.value = ''
        this.txtName.value = ''

        this.startDate.value = ''
        this.finishDate.value = ''
        await this.grdContracts.dataRefresh({source:this.contractObj.dt('ITEM_PRICE')});
        await this.grdMultiItem.dataRefresh({source:this.multiItemData});

        this.getItems()
    }
    async getItems()
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
        App.instance.setState({isExecute:true})
        
        let tmpEmpty = {...this.contractObj.itemPrice.empty};
        
        tmpEmpty.TYPE = 1,
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
            query :"SELECT CODE AS MULTICODE,(SELECT dbo.FN_PRICE(ITEM,@QUANTITY,dbo.GETDATE(),CUSTOMER,'00000000-0000-0000-0000-000000000000',0,1,0)) AS PRICE FROM ITEM_MULTICODE WHERE ITEM = @ITEM AND CUSTOMER = @CUSTOMER",
            param : ['ITEM:string|50','CUSTOMER:string|50','QUANTITY:float'],
            value : [pData.GUID,this.txtCustomerCode.GUID,1]
        }

        let tmpCheckData = await this.core.sql.execute(tmpCheckQuery) 
        if(tmpCheckData.result.recordset.length > 0)
        {  
            tmpEmpty.PRICE = tmpCheckData.result.recordset[0].PRICE
        }
        else
        {
            let tmpQuery = 
            {
                query :"SELECT COST_PRICE,VAT FROM ITEMS WHERE ITEMS.GUID = @GUID",
                param : ['GUID:string|50'],
                value : [pData.GUID]
            }
            let tmpData = await this.core.sql.execute(tmpQuery) 
            if(tmpData.result.recordset.length > 0)
            {  
                tmpEmpty.PRICE = tmpData.result.recordset[0].COST_PRICE
            }
        }
        
        // Eğer bileşen hala mount durumundaysa ekle
        if(!this.isUnmounted)
        {
            this.contractObj.itemPrice.addEmpty(tmpEmpty);
        }
    }
    async checkboxReset()
    {
        if(typeof this.customerControl != 'undefined')
        {
            this.customerControl = true
            this.customerClear = false
        }
        if(typeof this.combineControl != 'undefined')
        {
            this.combineControl = true
            this.combineNew = false 
        }
    }
    async multiItemAdd()
    {
        let tmpMissCodes = []
        let tmpCounter = 0
        if(this.multiItemData.length > 0)
        {
            let tmpConfObj =
            {
                id:'msgMultiData',showTitle:true,title:this.t("msgMultiData.title"),showCloseButton:true,width:'500px',height:'auto',
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
                    query : "SELECT GUID,CODE,NAME,VAT,1 AS QUANTITY," + 
                            "ISNULL((SELECT TOP 1 MULTICODE FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS_VW_01.GUID AND CUSTOMER_GUID = '"+this.txtCustomerCode.GUID+"'),'') AS MULTICODE " +
                            "FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VALUE) OR UPPER(NAME) LIKE UPPER(@VALUE) " ,
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
            this.toast.show({type:"warning",message:this.t("msgMissItemCode.msg") + ' ' +tmpMissCodes})
        }
        this.toast.show({type:"warning",message:this.t("msgMultiCodeCount.msg") + ' ' +tmpCounter})
    }
    async multiItemSave()
    {
        this.checkboxReset()
        
        // Sıralı olarak ekle - await kullanarak her birini beklet
        for (let i = 0; i < this.multiItemData.length; i++) 
        {                        
            await this.addItem(this.multiItemData[i])
            // Her ekleme arasında kısa bir bekleme
            await this.core.util.waitUntil(50)
        }
        
        this.popMultiItem.hide()
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    {/* Toolbar */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                    onClick={async()=>
                                    {
                                        await this.contractObj.load({CODE:this.txtCode.value,TYPE:0});
                                        this.txtCustomerCode.GUID = this.contractObj.itemPrice.dt()[0].CUSTOMER_GUID
                                        this.getItems()
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
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.contractObj.save()) == 0)
                                                {                                                    
                                                    this.toast.show({type:"success",message:this.t("msgSaveValid.msgSuccess")})
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
                                            this.toast.show({type:"warning",message:this.t("validItemPrice")})
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
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
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    {/* Form */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmHeader">
                                {/* txtCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
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
                                                            await this.contractObj.load({CODE:data[0].CODE,TYPE:1});
                                                            this.txtCustomerCode.GUID = this.contractObj.itemPrice.dt()[0].CUSTOMER_GUID
                                                            this.getItems()
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
                                        <Validator validationGroup={"frmPurcOrder"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator> 
                                    </NdTextBox>                                    
                                    {/*EVRAK SEÇİM */}
                                    <NdPopGrid id={"pg_Docs"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}}
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
                                </NdItem>
                                {/* txtName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtName" parent={this} simple={true} dt={{data:this.contractObj.dt('CONTRACT'),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </NdItem>
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01 WHERE TYPE IN (0,2) AND STATUS = 1"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                    </NdSelectBox>
                                </NdItem>
                                {/* txtCustomerCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
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
                                                    
                                                    this.getItems()
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
                                                            
                                                            this.getItems()
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
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}}
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
                                </NdItem> 
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"CUSTOMER_NAME"}}
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </NdItem> 
                                {/* docDate */}
                                <NdItem>
                                    <NdLabel text={this.t("docDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"docDate"} dt={{data:this.contractObj.dt('CONTRACT'),field:"DOC_DATE"}} />
                                </NdItem>
                                {/* startDate */}
                                <NdItem>
                                    <NdLabel text={this.t("startDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"startDate"}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"START_DATE"}}
                                    onValueChanged={(async(e)=>
                                    {
                                    }).bind(this)}
                                    >
                                    <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validDocDate")} />
                                    </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* finishDate */}
                                <NdItem>
                                    <NdLabel text={this.t("finishDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"finishDate"}
                                    dt={{data:this.contractObj.dt('CONTRACT'),field:"FINISH_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                    }).bind(this)}
                                    >
                                    <Validator validationGroup={"frmPurcContract"  + this.tabIndex}>
                                        <RequiredRule message={this.t("validDocDate")} />
                                    </Validator> 
                                    </NdDatePicker>
                                </NdItem>
                                {/* cmbVatType */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbVatType.title")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVatType" height='fit-content' dt={{data:this.contractObj.dt(),field:"VAT_TYPE"}}
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,NAME:this.t("cmbVatType.vatInc")},{ID:1,NAME:this.t("cmbVatType.vatExt")}]}}
                                    param={this.param.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbVatType',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={1} onInitialized={(e)=>
                            {
                                this.frmPurcContract = e.component
                            }}>
                                <NdItem location="after">
                                    <Button icon="add"
                                    validationGroup={"frmPurcContract"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            this.pg_txtPopItemsCode.show()
                                            this.pg_txtPopItemsCode.onClick = async(data) =>
                                            {
                                                this.checkboxReset()
                                                if(data.length == 1)
                                                {
                                                    await this.addItem(data[0])
                                                }
                                                else if(data.length > 1)
                                                {
                                                    let tmpCounter = 0
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

                                                        if(data[i].MULTICODE == '')
                                                        {
                                                            tmpCounter = tmpCounter +1
                                                        }
                                                    }

                                                    if(tmpCounter > 0)
                                                    {
                                                        this.toast.show({type:"warning",message:tmpCounter + this.t("msgNotCustomerCount.msg")})
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            this.toast.show({type:"warning",message:this.t("msgContractValid.msg")})
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
                                            this.toast.show({type:"warning",message:this.t("msgDocValid.msg")})
                                        }
                                    }}/>
                                </NdItem>
                                 <NdItem>
                                    <NdGrid parent={this} id={"grdContracts"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    filterRow={{visible:true}}
                                    headerFilter={{visible:true}}
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
                                    }}
                                    onRowRemoved={async (e)=>{
                                    }}
                                    >
                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Paging defaultPageSize={20} />
                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                        <Export fileName={this.lang.t("menuOff.cnt_02_001")} enabled={true} allowExportSelectedData={true} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdContracts.clmItemCode")} width={250} allowEditing={false}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdContracts.clmItemName")} width={600} allowEditing={false}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdContracts.clmQuantity")} width={100} dataType={'number'}/>
                                        <Column dataField="PRICE" caption={this.t("grdContracts.clmPrice")} dataType={'number'} allowEditing={true} width={100} format={{ style: "currency", currency:Number.money.code,precision: 2}}/>
                                    </NdGrid>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    {/* STOK POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popItems"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popItems.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'450'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.txtPopItemsCode")} alignment="right" />
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
                                    
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.txtPopItemsName")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsName"} parent={this} simple={true} editable={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.txtPopItemsPrice")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsPrice"} parent={this} simple={true} >
                                    <Validator validationGroup={"frmPurcContItems"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validItemPrice")} />
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                                    <NdTextBox id={"txtPopItemsQuantity"} parent={this} simple={true} />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.dtPopStartDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopStartDate"}/>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popItems.dtPopEndDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtPopEndDate"}/>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="success" stylingMode="contained" width={'100%'} validationGroup={"frmPurcContItems"  + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    await this.addItem()
                                                    this.popItems.hide();
                                                    this.toast.show({type:"success",message:this.t("msgSaveValid.msgSuccess")})
                                                }                              
                                                else
                                                {
                                                    this.toast.show({type:"error",message:this.t("validItemPrice")})
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
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
                    {/* Stok Grid */}
                    <NdPopGrid id={"pg_txtPopItemsCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}  
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtPopItemsCode.title")} //
                    search={true}
                    >           
                    <Paging defaultPageSize={22} />
                    <Column dataField="CODE" caption={this.t("pg_txtPopItemsCode.clmCode")} width={150} />
                    <Column dataField="MULTICODE" caption={this.t("pg_txtPopItemsCode.clmMulticode")} width={150}/>
                    <Column dataField="NAME" caption={this.t("pg_txtPopItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Dizayn Seçim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'250'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                        displayExpr="DESIGN_NAME"                       
                                        valueExpr="TAG"
                                        value=""
                                        searchEnabled={true}
                                        onValueChanged={(async()=>
                                            {
                                            }).bind(this)}
                                        data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '30'"},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                        >
                                            <Validator validationGroup={"frmPurcOrderPrint"  + this.tabIndex}>
                                                <RequiredRule message={this.t("validDesign")} />
                                            </Validator> 
                                        </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.lang")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                            displayExpr="VALUE"                       
                                            valueExpr="ID"
                                            value={localStorage.getItem('lang').toUpperCase()}
                                            searchEnabled={true}
                                            onValueChanged={(async()=>
                                                {
                                                }).bind(this)}
                                           data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                            
                                        ></NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnPrint")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                let tmpQuery = 
                                                {
                                                    query: "SELECT *,ISNULL((SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN),'') AS PATH FROM CONTRACT_VW_01 WHERE CODE = @CODE AND TYPE  = 0 ORDER BY CDATE " ,
                                                    param:  ['CODE:string|50','DESIGN:string|25'],
                                                    value:  [this.docObj.dt()[0].CODE,this.cmbDesignList.value]
                                                }
                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
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
                                </NdItem>
                            </NdForm>
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
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'900'}
                    height={'700'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    >
                        <NdForm colCount={2} height={'fit-content'}>
                        <NdItem colSpan={2}>
                            <NdLabel  alignment="right" />
                                <NdTagBox id="tagItemCode" parent={this} simple={true} value={[]} placeholder={this.t("tagItemCodePlaceholder")}
                                />
                        </NdItem>
                        <NdEmptyItem />       
                        <NdItem>
                            <NdLabel text={this.t("cmbMultiItemType.title")} alignment="right" />
                            <NdSelectBox simple={true} parent={this} id="cmbMultiItemType" height='fit-content' 
                            displayExpr="VALUE"                       
                            valueExpr="ID"
                            value={0}
                            data={{source:[{ID:0,VALUE:this.t("cmbMultiItemType.customerCode")},{ID:1,VALUE:this.t("cmbMultiItemType.ItemCode")}]}}
                            />
                        </NdItem>   
                        <NdEmptyItem />   
                        <NdItem>
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
                        </NdItem>
                        <NdItem colSpan={2} >
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
                        </NdItem>
                        <NdEmptyItem />   
                        <NdItem>
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
                        </NdItem>
                        </NdForm>
                    </NdPopUp>
                    <NdToast id={"toast"} parent={this} displayTime={3000} position={{at:"top center",offset:'0px 110px'}}/>
                </div> 
            </div>
        )
    }
}
