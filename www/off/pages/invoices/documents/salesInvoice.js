import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../lib/cls/doc.js';

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
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';



export default class salesInvoice extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();

        this._onItemRendered = this._onItemRendered.bind(this)
        this._cellRoleRender = this._cellRoleRender.bind(this)
        this._calculateTotal = this._calculateTotal.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        console.log(this.param.filter({TYPE:1,USERS:this.user.CODE}))
        this.docObj.clearAll()

        this.docObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnBack.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});
            }
        })
        this.docObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:false});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.docObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.docObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.dtDocDate.value = moment(new Date())
        this.dtShipDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}
        tmpDoc.TYPE = 1
        tmpDoc.DOC_TYPE = 20
        tmpDoc.REBATE = 0
        tmpDoc.DOC_DATE =  moment(this.dtDocDate.value).format("DD/MM/YYYY")
        tmpDoc.SHIPMENT_DATE = moment(this.dtShipDate.value).format("DD/MM/YYYY")
        this.docObj.addEmpty(tmpDoc);

        let tmpDocCustomer = {...this.docObj.docCustomer.empty}
        tmpDocCustomer.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocCustomer.TYPE = this.docObj.dt()[0].TYPE
        tmpDocCustomer.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocCustomer.REBATE = this.docObj.dt()[0].REBATE
        tmpDocCustomer.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        this.docObj.docCustomer.addEmpty(tmpDocCustomer)

        this.txtCustomerCode.value = ''
        this.txtCustomerName.value = ''
        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        
        await this.grdDocItems.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
    }
    async GetDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:20});
        console.log()
        this.txtCustomerCode.value = this.docObj.dt()[0].INPUT_CODE
        this.txtCustomerName.value = this.docObj.dt()[0].INPUT_NAME
        this.dtDocDate.value = this.docObj.dt()[0].DOC_DATE
        this.dtShipDate.value = this.docObj.dt()[0].SHIPMENT_DATE
        this.docObj.dt()[0].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY")
        this.docObj.docCustomer.dt()[0].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY")
        this.docObj.dt()[0].SHIPMENT_DATE = moment(this.dtShipDate.value).format("DD/MM/YYYY")
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.docItems.dt()[i].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY")
            this.docObj.docItems.dt()[i].SHIPMENT_DATE =  moment(this.dtShipDate.value).format("DD/MM/YYYY")
        }
        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
        this._calculateTotal
        
    }
    async checkDoc(pGuid,pRef,pRefno)
    {
        console.log(pGuid)
        return new Promise(async resolve =>
        {
            if(pRef !== '')
            {
                let tmpData = await new docCls().load({GUID:pGuid,REF:pRef,REF_NO:pRefno});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Evrağa Git",location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Evrak Bulundu"}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.GetDoc(pGuid,pRef,pRefno)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    async _calculateTotal()
    {
        this.docObj.dt()[0].AMOUNT = 0;
        this.docObj.dt()[0].DISCOUNT = 0;
        this.docObj.dt()[0].VAT = 0;
        this.docObj.dt()[0].TOTAL = 0;
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.dt()[0].AMOUNT +=  parseFloat((this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY).toFixed(2))
            this.docObj.dt()[0].DISCOUNT += parseFloat((this.docObj.docItems.dt()[i].DISCOUNT).toFixed(2))
            this.docObj.dt()[0].VAT += parseFloat((this.docObj.docItems.dt()[i].VAT).toFixed(2))
            this.docObj.dt()[0].TOTAL +=  parseFloat((this.docObj.docItems.dt()[i].AMOUNT).toFixed(2))
        }
        this.docObj.docCustomer.dt()[0].AMOUNT = this.docObj.dt()[0].TOTAL
    }
    _cellRoleRender(e)
    {
        if(e.column.dataField == "ITEM_CODE")
        {
            return (
                <NdTextBox id={"txtGrdItemsCode"+e.rowIndex} parent={this} simple={true}
                button=
                {
                    [
                        {
                            id:'01',
                            icon:'more',
                            onClick:()  =>
                            {
                                this.pg_txtItemsCode.show()
                                this.pg_txtItemsCode.onClick = async(data) =>
                                {
                                    if(data.length > 0)
                                    {
                                        this.docObj.docItems.dt()[e.rowIndex].ITEM_CODE = data[0].CODE
                                        this.docObj.docItems.dt()[e.rowIndex].ITEM = data[0].GUID
                                        this.docObj.docItems.dt()[e.rowIndex].VAT_RATE = data[0].VAT
                                        this.docObj.docItems.dt()[e.rowIndex].ITEM_NAME = data[0].NAME
                                        let tmpQuery = 
                                        {
                                            query :"SELECT dbo.FN_PRICE_SALE(@CODE,1,GETDATE()) AS PRICE  ",
                                            param : ['CODE:string|50'],
                                            value : [data[0].CODE]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {
                                            this.docObj.docItems.dt()[e.rowIndex].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
                                            this.docObj.docItems.dt()[e.rowIndex].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (data[0].VAT / 100)).toFixed(2))
                                            this.docObj.docItems.dt()[e.rowIndex].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE + this.docObj.docItems.dt()[e.rowIndex].VAT).toFixed(2))
                                            this._calculateTotal()
                                            this.grdDocItems.devGrid.focus(this.grdDocItems.devGrid.getCellElement(e.rowIndex,e.columnIndex))
                                        }
                                        
                                    }
                                }
                            }
                        },
                    ]
                }
                >  
                </NdTextBox>
            )
        }
        else if(e.column.dataField == "ITEM_NAME")
        { 
            return (<NdTextBox id={"txtGrdItemsName" +e.rowIndex} parent={this} simple={true} readOnly={true}/>)
        }
        else if(e.column.dataField == "VAT")
        { 
            return (<NdTextBox id={"txtGrdVat" +e.rowIndex} parent={this} simple={true} readOnly={true}/>)
        }
        else if(e.column.dataField == "AMOUNT")
        { 
            return (<NdTextBox id={"txtGrdAmount" +e.rowIndex} parent={this} simple={true} readOnly={true}/>)
        }
        
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {

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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmDoc"
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
                                                
                                                if((await this.docObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msgFailed")}</div>)
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
                                            this.docObj.dt('DOC').removeAt(0)
                                            await this.docObj.dt('DOC').delete();
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
                        <div className="col-12">
                            <Form colCount={3} id="frmDoc">
                                {/* txtRef-Refno */}
                                <Item>
                                    <Label text={this.t("txtRefRefno")} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                            readOnly={true}
                                            maxLength={32}
                                            onValueChanged={(async()=>
                                                {
                                                    this.docObj.docCustomer.dt()[0].REF = this.txtRef.value 
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 20 AND REF = @REF ",
                                                        param : ['REF:string|50'],
                                                        value : [this.txtRef.value]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        console.log(tmpData.result.recordset[0])
                                                        this.txtRefno.value = tmpData.result.recordset[0].REF_NO
                                                        this.docObj.docCustomer.dt()[0].REF_NO = tmpData.result.recordset[0].REF_NO
                                                    }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmDoc"}>
                                                    <RequiredRule message={this.t("validRef")} />
                                                </Validator>  
                                            </NdTextBox>
                                        </div>
                                        <div className="col-5 ps-0">
                                            <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
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
                                                                    this.GetDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
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
                                                this.docObj.docCustomer.dt()[0].REF_NO = this.txtRefno.value
                                                let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtRef.value,this.txtRefno.value)
                                                if(tmpResult == 3)
                                                {
                                                    this.txtRefno.value = "";
                                                }
                                            }).bind(this)}
                                            param={this.param.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'txtRefno',USERS:this.user.CODE})}
                                            >
                                            <Validator validationGroup={"frmDoc"}>
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
                                    data={{source:{select:{query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 20"},sql:this.core.sql}}}
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
                                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={300} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </Item>
                                {/* cmbDepot */}
                                <Item>
                                    <Label text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                    dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                            this.docObj.docCustomer.dt()[0].OUTPUT = this.cmbDepot.value
                                        }).bind(this)}
                                    data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDoc"}>
                                            <RequiredRule message={this.t("validDepot")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </Item>
                                {/* BOŞ */}
                                <Item> </Item>
                                {/* txtCustomerCode */}
                                <Item>
                                    <Label text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
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
                                                            this.docObj.dt()[0].INPUT = data[0].GUID
                                                            this.docObj.docCustomer.dt()[0].INPUT = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE
                                                            this.txtCustomerName.value = data[0].TITLE
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDoc"}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'80%'}
                                    height={'80%'}
                                    title={this.t("pg_txtCustomerCode.title")} //
                                    data={{source:{select:{query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01"},sql:this.core.sql}}}
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
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Tedarikçi']}/>
                                        
                                    </NdPopGrid>
                                </Item> 
                                 {/* txtCustomerName */}
                                 <Item>
                                    <Label text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}   
                                    readOnly={true}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item> 
                               
                                 {/* BOŞ */}
                                 <Item> </Item>
                                 {/* dtDocDate */}
                                 <Item>
                                    <Label text={this.t("dtDocDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                                    onValueChanged={(async()=>
                                        {
                                            this.docObj.dt()[0].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY") 
                                            this.docObj.docCustomer.dt()[0].DOC_DATE = moment(this.dtDocDate.value).format("DD/MM/YYYY") 
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmDoc"}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                {/* dtDocDate */}
                                <Item>
                                    <Label text={this.t("dtShipDate")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtShipDate"}
                                    onValueChanged={(async()=>
                                        {
                                            this.docObj.dt()[0].SHIPMENT_DATE = moment(this.dtShipDate.value).format("DD/MM/YYYY") 
                                    }).bind(this)}
                                    >
                                        <Validator validationGroup={"frmDoc"}>
                                            <RequiredRule message={this.t("validDocDate")} />
                                        </Validator> 
                                    </NdDatePicker>
                                </Item>
                                 {/* BOŞ */}
                                 <Item> </Item>
                                 </Form>
                            </div>
                        </div>
                        {/* GRİD */}
                        <div className="row px-2 pt-2">
                            <div className="col-12">
                                <Form colCount={1} >
                                <Item location="after">
                                    <Button icon="add"
                                    validationGroup="frmDoc"
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpDocItems = {...this.docObj.docItems.empty}
                                            tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
                                            tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
                                            tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
                                            tmpDocItems.REBATE = this.docObj.dt()[0].REBATE
                                            tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
                                            tmpDocItems.REF = this.docObj.dt()[0].REF
                                            tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
                                            tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
                                            tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
                                            tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
                                            tmpDocItems.SHIPMENT_DATE = this.docObj.dt()[0].SHIPMENT_DATE
                                            this.docObj.docItems.addEmpty(tmpDocItems)
                                            this.txtRef.readOnly = true
                                            this.txtRefno.readOnly = true
                                            this.pg_txtItemsCode.show()
                                            this.pg_txtItemsCode.onClick = async(data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].ITEM_CODE = data[0].CODE
                                                    this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].ITEM = data[0].GUID
                                                    this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].VAT_RATE = data[0].VAT
                                                    this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].ITEM_NAME = data[0].NAME
                                                    let tmpQuery = 
                                                    {
                                                        query :"SELECT dbo.FN_PRICE_SALE(@CODE,1,GETDATE()) AS PRICE  ",
                                                        param : ['CODE:string|50'],
                                                        value : [data[0].CODE]
                                                    }
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].PRICE = parseFloat((tmpData.result.recordset[0].PRICE).toFixed(2))
                                                        this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].VAT = parseFloat((tmpData.result.recordset[0].PRICE * (data[0].VAT / 100)).toFixed(2))
                                                        this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].AMOUNT = parseFloat((tmpData.result.recordset[0].PRICE + this.docObj.docItems.dt()[(this.docObj.docItems.dt().length - 1)].VAT).toFixed(2))
                                                        this._calculateTotal()
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
                                </Item>
                                 <Item onItemRendered={this._onItemRendered}>
                                    <NdGrid parent={this} id={"grdDocItems"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={'100%'} 
                                    width={'100%'}
                                    dbApply={false}
                                    onEditorPrepared={(e)=>{
                                        if(e.name== 'PRICE' || e.name == 'QUANTITY' || e.name == 'DISCOUNT')
                                        {
                                           
                                            if(e.row.data.DISCOUNT > (e.row.data.PRICE * e.row.data.QUANTITY))
                                            {
                                                let tmpConfObj =
                                                {
                                                    id:'Dıscountmsg',showTitle:true,title:"Uyarı",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"İndirim Tutardan Yüksek Olamaz"}</div>)
                                                }
                                            
                                                dialog(tmpConfObj);
                                                this.docObj.docItems.dt()[e.row.rowIndex].DISCOUNT = 0 
                                                return
                                            }
                                            this.docObj.docItems.dt()[e.row.rowIndex].VAT = parseFloat(((((e.row.data.PRICE * e.row.data.QUANTITY) - e.row.data.DISCOUNT) * (e.row.data.VAT_RATE) / 100)).toFixed(2))
                                            this.docObj.docItems.dt()[e.row.rowIndex].AMOUNT = parseFloat((((e.row.data.PRICE * e.row.data.QUANTITY) - e.row.data.DISCOUNT) +this.docObj.docItems.dt()[e.row.rowIndex].VAT).toFixed(2)) 
                                            this._calculateTotal()
                                            
                                        }
                                    }}
                                    onRowRemoved={(e)=>{
                                        this._calculateTotal()
                                    }}
                                    >
                                        <KeyboardNavigation
                                        editOnKeyPress={true}
                                        enterKeyAction={'moveFocus'}
                                        enterKeyDirection={'row'} />
                                        <Scrolling mode="infinite" />
                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                        <Column dataField="ITEM_CODE" caption={this.t("grdDocItems.clmItemCode")} width={150} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="ITEM_NAME" caption={this.t("grdDocItems.clmItemName")} width={500} />
                                        <Column dataField="PRICE" caption={this.t("grdDocItems.clmPrice")} dataType={'number'}/>
                                        <Column dataField="QUANTITY" caption={this.t("grdDocItems.clmQuantity")} dataType={'number'}/>
                                        <Column dataField="DISCOUNT" caption={this.t("grdDocItems.clmDiscount")} dataType={'number'}/>
                                        <Column dataField="VAT" caption={this.t("grdDocItems.clmVat")} editCellRender={this._cellRoleRender}/>
                                        <Column dataField="AMOUNT" caption={this.t("grdDocItems.clmAmount")} editCellRender={this._cellRoleRender}/>
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={4} id="frmDoc">
                                {/* Ara Toplam */}
                                <Item colSpan={3}></Item>
                                <Item  >
                                <Label text={this.t("txtAmount")} alignment="right" />
                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"AMOUNT"}}
                                    maxLength={32}
                                   
                                    ></NdTextBox>
                                </Item>
                                {/* İndirim */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtDiscount")} alignment="right" />
                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"DISCOUNT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()  =>
                                                {
                                                console.log(1)
                                                }
                                            },
                                        ]
                                    }
                                    ></NdTextBox>
                                </Item>
                                {/* KDV */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtVat")} alignment="right" />
                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"VAT"}}
                                    maxLength={32}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'clear',
                                                onClick:async ()  =>
                                                {
                                                    
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgVatDelete',showTitle:true,title:this.t("msgVatDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.t("msgVatDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVatDelete.msg")}</div>)
                                                    }
                                                    
                                                    let pResult = await dialog(tmpConfObj);
                                                    if(pResult == 'btn01')
                                                    {
                                                        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
                                                        {
                                                            this.docObj.docItems.dt()[i].VAT = 0  
                                                            this.docObj.docItems.dt()[i].VAT_RATE = 0
                                                            this.docObj.docItems.dt()[i].AMOUNT = (this.docObj.docItems.dt()[i].PRICE * this.docObj.docItems.dt()[i].QUANTITY) - this.docObj.docItems.dt()[i].DISCOUNT
                                                            this._calculateTotal()
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    ></NdTextBox>
                                </Item>
                                {/* KDV */}
                                <Item colSpan={3}></Item>
                                <Item>
                                <Label text={this.t("txtTotal")} alignment="right" />
                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} dt={{data:this.docObj.dt('DOC'),field:"TOTAL"}}
                                    maxLength={32}
                                    //param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                    ></NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                        
                </ScrollView>
                <NdPopGrid id={"pg_txtItemsCode"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}} 
                    showTitle={true} 
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_txtItemsCode.title")} //
                    data={{source:{select:{query : "SELECT GUID,CODE,NAME,VAT FROM ITEMS_VW_01"},sql:this.core.sql}}}
                    button=
                    {
                        {
                            id:'01',
                            icon:'more',
                            onClick:()=>
                            {
                                console.log(11)
                            }
                        }
                    }
                    >
                            <Column dataField="CODE" caption={this.t("pg_txtItemsCode.clmCode")} width={150} />
                        <Column dataField="NAME" caption={this.t("pg_txtItemsCode.clmName")} width={300} defaultSortOrder="asc" />
                </NdPopGrid>
                                
            </div>
        )
    }
}