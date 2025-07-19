import React from 'react';
import App from '../../../lib/app.js';
import {itemExpDateCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class expdateEntry extends React.Component
{
    constructor()
    {
        super()
        
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.tabIndex = props.data.tabkey
        
        this.expObj = new itemExpDateCls();
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.expObj.clearAll()
        this.expObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:true});
                this.btnDelete.setState({disabled:false});
            }
        })
        this.expObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnPrint.setState({disabled:true});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.expObj.ds.on('onRefresh',(pTblName) =>
        {           
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnPrint.setState({disabled:true});       
            this.btnDelete.setState({disabled:false});   
        })
        this.expObj.ds.on('onDelete',(pTblName) =>
        {
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnPrint.setState({disabled:true});
            this.btnDelete.setState({disabled:true});
        })

        this.btnSave.setState({disabled:true});
        this.btnNew.setState({disabled:false});
        this.txtRef.setState({value:this.user.CODE})
        this.dtDocDate.value =  moment(new Date()).format("YYYY-MM-DD"),

        this.txtPopQuantity.value = 1;
        this.dtPopDate.value = moment(new Date()).format("YYYY-MM-DD")
        await this.grdExpDate.dataRefresh({source:this.expObj.dt('ITEM_EXPDATE')});
        this.txtRef.props.onChange()
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.expObj.clearAll()
        await this.expObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno});
        this.btnPrint.setState({disabled:false});
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    async addItem(pData,pIndex,pQuantity,pDate)
    {
        if(pData.CODE  == '')
        {
            return
        }

        for (let i = 0; i < this.expObj.dt().length; i++) 
        {
            if(this.expObj.dt()[i].ITEM_CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'auto',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }

                let pResult = await dialog(tmpConfObj);
                
                if(pResult == 'btn01')
                {
                    await this.grdExpDate.devGrid.deleteRow(0)
                    return
                }
                else
                {
                    break
                }
            }
        }
        this.expObj.dt()[pIndex].ITEM_GUID = pData.GUID 
        this.expObj.dt()[pIndex].ITEM_CODE = pData.CODE 
        this.expObj.dt()[pIndex].ITEM_NAME = pData.NAME 
        this.expObj.dt()[pIndex].QUANTITY = pQuantity
        this.expObj.dt()[pIndex].EXP_DATE = pDate

        if(this.cmbDepot.value !=  '')
        {
            this.expObj.dt()[pIndex].DEPOT = this.cmbDepot.value
        }
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
                                    <NdButton id="btnNew" parent={this} icon="file" type="default" onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" 
                                    onClick={async(e)=>
                                    {
                                        if(this.expObj.dt()[this.expObj.dt().length - 1].CODE == '')
                                        {
                                            await this.grdExpDate.devGrid.deleteRow(this.expObj.dt().length - 1)
                                        }

                                        let tmpConfObj =
                                        {
                                            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);

                                        if(pResult == 'btn01')
                                        {
                                            if((await this.expObj.save()) == 0)
                                            {
                                                this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                this.btnSave.setState({disabled:true});
                                                this.btnNew.setState({disabled:false});
                                                this.btnPrint.setState({disabled:false});
                                            }
                                            else
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                }
                                                await dialog(tmpConfObj1);
                                            }
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default" onClick={()=>{this.popDesign.show()}}/>
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
                                            let tmpDelete = {...this.expObj.dt('ITEM_EXPDATE')}

                                            for (let i = 0; i < tmpDelete.length; i++) 
                                            {
                                                this.expObj.dt('ITEM_EXPDATE').removeAt(0)
                                            }

                                            await this.expObj.dt('ITEM_EXPDATE').delete();
                                            this.init(); 
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
                        <div className="row px-2 pt-2">
                            <div className="col-12">
                                <NdForm colCount={3} id="frmExpDate">
                                    {/* txtRef-Refno */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtRefRefno")} alignment="right" />
                                        <div className="row">
                                            <div className="col-6 pe-0">
                                                <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"REF"}}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                                readOnly={true}
                                                maxLength={32}
                                                onChange={(async(e)=>
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM ITEM_EXPDATE_VW_01 WHERE REF = @REF ",
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
                                                    <Validator validationGroup={"frmExpDate" + this.tabIndex}>
                                                        <RequiredRule message={this.t("validRef")} />
                                                    </Validator>  
                                                </NdTextBox>
                                            </div>
                                            <div className="col-6 ps-0">
                                                <NdTextBox id="txtRefno" mode="number" parent={this} simple={true} dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"REF_NO"}}
                                                readOnly={true}
                                                button=
                                                {
                                                    [
                                                        {
                                                            id:'01',
                                                            icon:'more',
                                                            onClick:()=>
                                                            {
                                                                this.pg_Docs.show()
                                                                this.pg_Docs.onClick = (data) =>
                                                                {
                                                                    if(data.length > 0)
                                                                    {
                                                                        this.getDoc('00000000-0000-0000-0000-000000000000',data[0].REF,data[0].REF_NO)
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
                                                    <Validator validationGroup={"frmExpDate" + this.tabIndex}>
                                                        <RequiredRule message={this.t("validRefNo")} />
                                                    </Validator> 
                                                </NdTextBox>
                                            </div>
                                        </div>
                                        {/*EVRAK SEÇİM */}
                                        <NdPopGrid id={"pg_Docs"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                        visible={false}
                                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                        showTitle={true} 
                                        showBorders={true}
                                        width={'90%'}
                                        height={'90%'}
                                        title={this.t("pg_Docs.title")} 
                                        data={{source:{select:{query : "SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE  FROM ITEM_EXPDATE_VW_01 GROUP BY REF,REF_NO,DOC_DATE ORDER BY DOC_DATE DESC"},sql:this.core.sql}}}
                                        button={[{id:'01',icon:'more',onClick:()=>{}}]}
                                        >
                                            <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={70} />
                                            <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={70}  />                                        
                                            <Column dataField="DOC_DATE" caption={this.t("pg_Docs.clmDate")} width={100}  />
                                        </NdPopGrid>
                                    </NdItem>
                                    {/* Boş */}
                                    <NdEmptyItem />
                                    {/* Boş */}
                                    <NdEmptyItem />
                                    {/* cmbDepot */}
                                    <NdItem>
                                        <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                        dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"DEPOT"}}  
                                        displayExpr="NAME"                       
                                        valueExpr="GUID"
                                        searchEnabled={true}
                                        notRefresh = {true}
                                        data={{source:{select:{query:`SELECT GUID,NAME FROM DEPOT_VW_01`},sql:this.core.sql}}}
                                        param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                        />
                                    </NdItem>
                                    {/* dtDocDate */}
                                    <NdItem>
                                        <NdLabel text={this.t("dtDocDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                        dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"DOC_DATE"}}
                                        >
                                            <Validator validationGroup={"frmExpDate" + this.tabIndex}>
                                                <RequiredRule message={this.t("validDocDate")} />
                                            </Validator> 
                                        </NdDatePicker>
                                    </NdItem>
                                    {/* Boş */}
                                    <NdEmptyItem />
                                    {/* Barkod Ekleme */}
                                    <NdItem>
                                        <NdLabel text={this.t("txtBarcode")} alignment="right" />
                                        <NdTextBox id="txtBarcode" parent={this} simple={true}  
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        button=
                                        {
                                            [
                                                {
                                                    id:'01',
                                                    icon:"fa-solid fa-barcode",
                                                    onClick:async(e)=>
                                                    {
                                                        await this.pg_txtBarcode.setVal(this.txtBarcode.value)

                                                        this.pg_txtBarcode.show()
                                                        this.pg_txtBarcode.onClick = async(data) =>
                                                        {
                                                            let tmpExpItems = {...this.expObj.empty}
                                                            tmpExpItems.REF = this.txtRef.value
                                                            tmpExpItems.REF_NO = this.txtRefno.value
                                                            tmpExpItems.DOC_DATE = this.dtDocDate.value
                                                            this.txtRef.readOnly = true
                                                            this.txtRefno.readOnly = true
                                                            this.expObj.addEmpty(tmpExpItems)
                    
                                                            await this.core.util.waitUntil(100)

                                                            if(data.length > 0)
                                                            {
                                                                this.customerControl = true
                                                                this.customerClear = false
                                                                this.combineControl = true
                                                                this.combineNew = false

                                                                if(data.length == 1)
                                                                {
                                                                    this.txtMsgQuantity.value =  1
                                                                    this.dtMsgDate.value =  moment(new Date()).format("YYYY-MM-DD"),
                                                                    setTimeout(async () => 
                                                                    {
                                                                        this.txtMsgQuantity.focus()
                                                                    }, 500);
                                                                    await this.msgQuantity.show().then(async (e) =>
                                                                    {
                                                                        if(typeof this.expObj.dt()[this.expObj.dt().length - 1] == 'undefined' || this.expObj.dt()[this.expObj.dt().length - 1].CODE != '')
                                                                        {
                                                                            let tmpExpItems = {...this.expObj.empty}
                                                                            tmpExpItems.REF = this.txtRef.value
                                                                            tmpExpItems.REF_NO = this.txtRefno.value
                                                                            tmpExpItems.DOC_DATE = this.dtDocDate.value
                                                                            this.txtRef.readOnly = true
                                                                            this.txtRefno.readOnly = true
                                                                            this.expObj.addEmpty(tmpExpItems)
                                                                        }
                                                                    
                                                                        this.addItem(data[0],this.expObj.dt().length -1,this.txtMsgQuantity.value,this.dtMsgDate.value)
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                        onEnterKey={(async(e)=>
                                        {
                                            let tmpQuery = 
                                            {   
                                                query : `SELECT 
                                                        ITEMS.GUID,
                                                        ITEMS.CODE,
                                                        ITEMS.NAME,
                                                        ITEMS.VAT,
                                                        ITEMS.COST_PRICE,
                                                        ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE,  
                                                        ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME 
                                                        FROM ITEMS_VW_04 AS ITEMS  
                                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID WHERE CODE = @CODE OR BARCODE.BARCODE = @CODE`,
                                                param : ['CODE:string|50'],
                                                value : [this.txtBarcode.value]
                                            }
                                            
                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                            this.txtBarcode.setState({value:""})

                                            if(tmpData.result.recordset.length > 0)
                                            {
                                                this.txtMsgQuantity.value =  1
                                                this.dtMsgDate.value =  moment(new Date()).format("YYYY-MM-DD"),
                                                setTimeout(async () => {this.txtMsgQuantity.focus()}, 500);

                                                await this.msgQuantity.show().then(async (e) =>
                                                {
                                                    if(typeof this.expObj.dt()[this.expObj.dt().length - 1] == 'undefined' || this.expObj.dt()[this.expObj.dt().length - 1].CODE != '')
                                                    {
                                                        let tmpExpItems = {...this.expObj.empty}
                                                        tmpExpItems.REF = this.txtRef.value
                                                        tmpExpItems.REF_NO = this.txtRefno.value
                                                        tmpExpItems.DOC_DATE = this.dtDocDate.value
                                                        this.txtRef.readOnly = true
                                                        this.txtRefno.readOnly = true
                                                        this.expObj.addEmpty(tmpExpItems)
                                                    }
                                                
                                                    this.addItem(tmpData.result.recordset[0],this.expObj.dt().length - 1,this.txtMsgQuantity.value,this.dtMsgDate.value)
                                                })
                                            }
                                            else
                                            {
                                                this.toast.show({message:this.t("msgItemNotFound.msg"),type:"error"})
                                            }
                                            
                                        }).bind(this)}
                                        param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}
                                        >
                                        </NdTextBox>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                        <NdForm colCount={1}>
                            <NdItem location="after">
                                <NdButton icon="add"
                                onClick={async (e)=>
                                {
                                    await this.core.util.waitUntil(100)
                                    this.popItems.show()
                                }}/>
                            </NdItem>
                            <NdItem>
                                <NdGrid parent={this} id={"grdExpDate"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                filterRow={{visible:true}} 
                                height={'600'} 
                                width={'100%'}
                                dbApply={false}
                                >
                                    <Scrolling mode="standart" />
                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                    <Column dataField="CUSER_NAME" caption={this.t("grdExpDate.clmCuser")} width={100} allowEditing={false}/>
                                    <Column dataField="ITEM_NAME" caption={this.t("grdExpDate.clmName")} width={250} />
                                    <Column dataField="ITEM_CODE" caption={this.t("grdExpDate.clmCode")} width={150}/>
                                    <Column dataField="QUANTITY" caption={this.t("grdExpDate.clmQuantity")} width={150}/>
                                    <Column dataField="EXP_DATE" caption={this.t("grdExpDate.clmDate")} width={250}dataType="date"
                                    editorOptions={{value:null}}
                                    cellRender={(e) => 
                                    {
                                        if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                        {
                                            return e.text
                                        }
                                        return
                                    }}/>
                                    <Column dataField="DESCRIPTION" caption={this.t("grdExpDate.clmDescription")} width={150}/>
                                </NdGrid>
                            </NdItem>
                        </NdForm>
                        {/* Stok Popup*/}
                        <div>
                            <NdPopUp parent={this} id={"popItems"} 
                            visible={false}
                            showCloseButton={true}
                            showTitle={true}
                            title={this.t("popItems.title")}
                            container={'#' + this.props.data.id + this.tabIndex} 
                            width={'500'}
                            height={'auto'}
                            position={{of:'#' + this.props.data.id + this.tabIndex}}
                            >
                                <NdForm colCount={1} height={'fit-content'}>
                                    <NdItem>
                                        <NdLabel text={this.t("popItems.txtPopItemsCode")} alignment="right" />
                                        <NdTextBox id={"txtPopItemsCode"} parent={this} simple={true}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        onEnterKey={(async()=>
                                        {
                                            await this.popItemsCode.setVal(this.txtPopItemsCode.value)
                                            this.popItemsCode.show()
                                            this.popItemsCode.onClick = (data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.PopGrdItemData = data;
                                                    this.txtPopQuantity.focus()
                                                
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
                                                        this.popItemsCode.show()
                                                        this.popItemsCode.onClick = (data) =>
                                                        {
                                                            if(data.length > 0)
                                                            {
                                                                this.PopGrdItemData = data;
                                                                this.txtPopQuantity.focus()

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
                                        <NdLabel text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                                        <NdTextBox id="txtPopQuantity" parent={this} simple={true}/>
                                    </NdItem>
                                    <NdItem>
                                        <NdLabel text={this.t("popItems.dtPopDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtPopDate"}/>
                                    </NdItem>
                                    <NdItem>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <NdButton text={this.lang.t("btnSave")} type="success" stylingMode="contained" width={'100%'} validationGroup={"frmPurcContItems"  + this.tabIndex}
                                                onClick={async (e)=>
                                                {       
                                                    if(e.validationGroup.validate().status == "valid")
                                                    {
                                                        this.txtPopItemsCode.value = ''
                                                        this.txtPopItemsName.value = ''
                                                        if(typeof this.expObj.dt()[0] != 'undefined')
                                                        {
                                                            if(this.expObj.dt()[this.expObj.dt().length - 1].CODE == '')
                                                            {
                                                                this.pg_txtItemsCode.show()
                                                                this.pg_txtItemsCode.onClick = async(data) =>
                                                                {
                                                                    if(data.length == 1)
                                                                    {
                                                                        this.addItem(data[0],this.expObj.dt().length - 1,this.txtPopQuantity.value,this.dtPopDate.value)
                                                                    }
                                                                }
                                                                return
                                                            }
                                                        }

                                                        let tmpExpItems = {...this.expObj.empty}
                                                        tmpExpItems.REF = this.txtRef.value
                                                        tmpExpItems.REF_NO = this.txtRefno.value
                                                        tmpExpItems.DOC_DATE = this.dtDocDate.value
                                                        this.expObj.addEmpty(tmpExpItems)
                                                        await this.addItem(this.PopGrdItemData[0],this.expObj.dt().length - 1,this.txtPopQuantity.value,this.dtPopDate.value)
                                                        this.PopGrdItemData = [];
                                                        this.popItems.hide();
                                                    }
                                                    else
                                                    {
                                                        this.toast.show({message:this.t("msgSaveValid.msg"),type:"error"})
                                                    }    
                                                }}/>
                                            </div>
                                            <div className='col-6'>
                                                <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'} onClick={()=>{this.popItems.hide()}}/>
                                            </div>
                                        </div>
                                    </NdItem>
                                </NdForm>
                            </NdPopUp>
                        </div>
                        {/* Stok Seçim */}
                        <NdPopGrid id={"popItemsCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                        visible={false}
                        position={{of:'#' + this.props.data.id + this.tabIndex}} 
                        showTitle={true} 
                        showBoffers={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("popItemsCode.title")} //
                        search={true}
                        data = 
                        {{
                            source:
                            {
                                select:
                                {
                                    query : "SELECT GUID,CODE,NAME,VAT,COST_PRICE FROM ITEMS_VW_04 WHERE STATUS = 1 AND UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                    param : ['VAL:string|50']
                                },
                                sql:this.core.sql
                            }
                        }}
                        >
                            <Column dataField="CODE" caption={this.t("popItemsCode.clmCode")} width={150} />
                            <Column dataField="NAME" caption={this.t("popItemsCode.clmName")} width={300} defaultSortoffer="asc" />
                        </NdPopGrid>
                    </div>
                    {/* BARKOD POPUP */}
                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                    visible={false}
                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtBarcode.title")} //
                    search={true}
                    data = 
                    {{
                        source:
                        {
                            select:
                            {
                                query : `SELECT 
                                        ITEMS.GUID,
                                        ITEMS.CODE,
                                        ITEMS.NAME,
                                        ITEMS.VAT,
                                        ITEMS.COST_PRICE,
                                        ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM_MULTICODE.ITEM = ITEMS.GUID ORDER BY LDATE DESC),'') AS MULTICODE, 
                                        ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_02 WHERE ITEM_MULTICODE_VW_02.ITEM_GUID = ITEMS.GUID ORDER BY LDATE DESC),'') AS CUSTOMER_NAME,
                                        BARCODE.BARCODE AS BARCODE 
                                        FROM ITEMS_VW_04 AS ITEMS 
                                        INNER JOIN ITEM_BARCODE_VW_01 AS BARCODE ON ITEMS.GUID = BARCODE.ITEM_GUID WHERE  BARCODE.BARCODE LIKE '%' + @BARCODE`,
                                param : ['BARCODE:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                        <Column dataField="CODE" caption={this.t("pg_txtBarcode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtBarcode.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                    {/* Miktar Dialog  */}
                    <NdDialog id={"msgQuantity"} container={"#" + this.props.data.id + this.tabIndex} parent={this}
                    showTitle={true} 
                    title={this.t("msgQuantity.title")} 
                    showCloseButton={false}
                    width={"350px"}
                    height={"auto"}
                    button={[{id:"btn01",caption:this.t("msgQuantity.btn01"),location:'after'}]}
                    >
                        <div className="row">
                            <div className="col-12 py-2">
                                <div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgQuantity.msg")}</div>
                            </div>
                            <div className="col-12 py-2">
                                <NdForm>
                                    {/* checkCustomer */}
                                    <NdItem>
                                        <NdLabel text={this.t("popItems.txtPopItemsQuantity")} alignment="right" />
                                        <NdNumberBox id="txtMsgQuantity" parent={this} simple={true} 
                                        onEnterKey={(async(e)=>{this.msgQuantity._onClick()}).bind(this)} 
                                        />
                                    </NdItem>
                                    <NdItem>
                                        <NdLabel text={this.t("popItems.dtPopDate")} alignment="right" />
                                        <NdDatePicker simple={true}  parent={this} id={"dtMsgDate"}/>
                                    </NdItem>
                                </NdForm>
                            </div>
                        </div>
                    </NdDialog>  
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}