import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
import { docCls,docOrdersCls, docCustomerCls } from '../../../../core/cls/doc.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem, SimpleItem } from 'devextreme-react/form';
import DropDownButton from 'devextreme-react/drop-down-button';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';
import { triggerHandler } from 'devextreme/events';

export default class salesOrder extends React.Component
{
    constructor()
    {
        super()
        this.state = 
        {
            tbMain:"visible",
            tbBarcode:"hidden",
            tbDocument: "hidden"
        }     
        this.barcode = 
        {
            name:"",
            price:0,
            barcode: "",
            code:""
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});

        this.docObj = new docCls();

        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnDeleteRow")]
        this.pageChange = this.pageChange.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.docObj.clearAll()

        let tmpDoc = {...this.docObj.empty}

        
        this.docObj.addEmpty(tmpDoc);

        this.txtCustomerCode.readOnly = false;
        this.txtRef.readOnly = false
        this.txtRefno.readOnly = false
        this.txtRef.readOnly = true
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.docObj.clearAll()
        await this.docObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno,TYPE:1,DOC_TYPE:60});

        this.txtRef.readOnly = true
        this.txtRefno.readOnly = true
    }
    async pageChange(pPage)
    {
        if(pPage == "Main")
        {
            this.setState({tbMain:"visible"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"hidden"})
        }
        if(pPage == "Barcode")
        {
            if(this.cmbDepotList.value == "")
            {
                let tmpConfObj = 
                {
                    id:'msgDepotSelect',showTitle:true,title:this.t("msgDepotSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgDepotSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDepotSelect.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                return
            }
            else if(this.docObj.dt()[0].INPUT_CODE == "")
            {
                let tmpConfObj = 
                {
                    id:'msgCustomerSelect',showTitle:true,title:this.t("msgCustomerSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCustomerSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCustomerSelect.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                return
            }
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"visible"})
            this.setState({tbDocument:"hidden"})
            this.txtBarcode.focus()
        }
        if(pPage == "Document")
        {
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"visible"})
        }
    }    
    render()
    {
        return(
        <div className="row px-2 pt-2">
            <div className="row px-2 pt-2" style={{visibility:this.state.tbMain,position:"fixed"}}>
                <Form colCount={1}>
                    <Item>
                        <div className="row">
                            <div className="col-8"></div>
                            <div className="col-4">
                                <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuMainItems}  onItemClick={this.dropmenuClick}/>
                            </div>
                        </div>
                    </Item>
                    {/* txtRef-Refno */}
                    <Item>
                        <Label text={this.t("txtRefRefno")} alignment="right" />
                        <div className="row">
                            <div className="col-5 pe-0">
                                <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                maxLength={32}
                                onChange={(async()=>
                                {
                                    let tmpQuery = 
                                    {
                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 60 AND REF = @REF ",
                                        param : ['REF:string|25'],
                                        value : [this.txtRef.value]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length > 0)
                                    {
                                        this.txtRefno.value=tmpData.result.recordset[0].REF_NO
                                    }
                                }).bind(this)}
                                param={this.param.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtRef',USERS:this.user.CODE})}
                                >
                                <Validator validationGroup={"frmLabelQeueu"}>
                                        <RequiredRule message={this.t("validRef")} />
                                    </Validator>  
                                </NdTextBox>
                            </div>
                            <div className="col-7 ps-0">
                                <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:async()=>
                                            {
                                                this.pg_Docs.show()
                                                this.pg_Docs.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.getDoc(data[0].GUID,data[0].REF,data[0].REF_NO)
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
                                <Validator validationGroup={"frmLabelQeueu"}>
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
                        data={{source:{select:{query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 60 AND REBATE = 0"},sql:this.core.sql}}}
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
                        <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={150} defaultSortOrder="asc" />
                        <Column dataField="INPUT_NAME" caption={this.t("pg_Docs.clmInputName")} width={200} defaultSortOrder="asc" />
                        <Column dataField="INPUT_CODE" caption={this.t("pg_Docs.clmInputCode")} width={200} defaultSortOrder="asc" />
                        </NdPopGrid>
                    </Item>
                    {/* Depot */}
                    <Item>
                        <Label text={this.t("txtDepot")} alignment="right" />
                        <NdSelectBox simple={true} parent={this} id="cmbDepotList" notRefresh = {true}
                        dt=""
                        displayExpr="NAME"
                        valueExpr="GUID"
                        value=""
                        searchEnabled={true}
                        onValueChanged={(async(e)=>
                            {
                                
                            }).bind(this)}
                        data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                        param={this.param.filter({ELEMENT:'cmbDepotList',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'cmbDepotList',USERS:this.user.CODE})}
                        >
                        </NdSelectBox>
                    </Item>
                    {/* txtCustomerCode */}
                    <Item>
                        <Label text={this.t("txtCustomerCode")} alignment="right" />
                        <div className="row">
                            <div className="col-12">
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                dt={{data:this.docObj.dt('DOC'),field:"INPUT_CODE"}}
                                onEnterKey={(async()=>
                                    {
                                        await this.pg_CustomerSelect.setVal(this.txtCustomerCode.value)
                                        this.pg_CustomerSelect.show()
                                        this.pg_CustomerSelect.onClick = (data) =>
                                        {
                                            if(data.length > 0)
                                            {
                                                this.docObj.dt()[0].INPUT = data[0].GUID
                                                this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                console.log(this.docObj.dt()[0].INPUT_NAME)
                                                let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                {
                                                    this.txtRef.value=data[0].CODE;
                                                    this.txtRef.props.onChange()
                                                }
                                            }
                                        }
                                    }).bind(this)}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:async()=>
                                            {
                                                console.log(111111)
                                                this.pg_CustomerSelect.show()
                                                this.pg_CustomerSelect.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        console.log(this.docObj.dt())
                                                        this.docObj.dt()[0].INPUT = data[0].GUID
                                                        this.docObj.dt()[0].INPUT_CODE = data[0].CODE
                                                        this.docObj.dt()[0].INPUT_NAME = data[0].TITLE
                                                        let tmpData = this.sysParam.filter({ID:'refForCustomerCode',USERS:this.user.CODE}).getValue()
                                                        console.log(this.txtCustomerCode)
                                                        if(typeof tmpData != 'undefined' && tmpData.value ==  true)
                                                        {
                                                            this.txtRef.value=data[0].CODE;
                                                            this.txtRef.props.onChange()
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            id:'02',
                                            icon:'arrowdown',
                                            onClick:()=>
                                            {
                                                
                                            }
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    
                                }).bind(this)}
                                param={this.param.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtCustomerCode',USERS:this.user.CODE})}
                                >
                                </NdTextBox>
                            </div>
                        </div>
                        {/*CARİ SEÇİM */}
                        <NdPopGrid id={"pg_CustomerSelect"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pg_CustomerSelect.title")} 
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
                            <Column dataField="CODE" caption={this.t("pg_CustomerSelect.clmCode")} width={150} />
                            <Column dataField="TITLE" caption={this.t("pg_CustomerSelect.clmTitle")} width={200} defaultSortOrder="asc" />
                            <Column dataField="TYPE_NAME" caption={this.t("pg_CustomerSelect.clmTypeName")} width={100} />
                            <Column dataField="GENUS_NAME" caption={this.t("pg_CustomerSelect.clmGenusName")} width={100} />
                        </NdPopGrid>
                    </Item> 
                    {/* txtCustomerName */}
                    <Item>
                        <Label text={this.t("txtCustomerName")} alignment="right" />
                        <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                        readOnly={true}
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        dt={{data:this.docObj.dt('DOC'),field:"INPUT_NAME"}} 
                        param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                    {/* txtDate */}
                    <Item>
                        <Label text={this.t("txtDate")} alignment="right" />
                        <NdDatePicker simple={true}  parent={this} id={"dtDocDate"}
                        dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}
                        onValueChanged={(async()=>
                            {
                        }).bind(this)}
                        >
                            <Validator validationGroup={"frmslsDoc"}>
                                <RequiredRule message={this.t("validDocDate")} />
                            </Validator> 
                        </NdDatePicker>
                    </Item>
                    <Item>
                        <div className="row">
                            <div className="col-6 px-4 pt-4">
                                <NdButton text={this.t("btnBarcodeEntry")} type="default" width="100%" onClick={()=>this.pageChange("Barcode")}></NdButton>
                            </div>
                            <div className="col-6 px-4 pt-4">
                                <NdButton text={this.t("btnDocument")} type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                            </div>
                        </div>
                    </Item>
                </Form>
            </div>
            <div className="row px-2 pt-2" style={{visibility:this.state.tbBarcode,position:"fixed"}}>
                <Form colCount={1}>
                    <Item>
                    <div className="row">
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                        </div>
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                        </div>
                        <div className="col-4 px-2 pt-2">
                            
                            <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} defaultValue={false} 
                            param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                        </div>
                    </div>
                    </Item>
                    <Item>
                    <div className="col-12 px-2 pt-2">
                            <NdTextBox id="txtBarcode" parent={this} placeholder={this.t("txtBarcodePlace")}
                            button=
                            {
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    onClick:async()=>
                                    {
                                        this.popItemCode.show()
                                        this.popItemCode.onClick = async(data) =>
                                        {
                                            if(data.length == 1)
                                            {
                                                this.txtBarcode.value = data[0].CODE
                                                this.barcode = {
                                                    name:data[0].NAME,
                                                    code:data[0].CODE,
                                                    barcode:data[0].BARCODE,
                                                    price:data[0].PRICE
                                                }
                                                this.numPrice.value = data[0].PRICE
                                                this.setState({tbBarcode:"visible"})
                                            }
                                            else if(data.length > 1)
                                            {
                                                for (let i = 0; i < data.length; i++) 
                                                {
                                                    this.txtBarcode.value = data[i].CODE
                                                    this.barcode = {
                                                        name:data[i].NAME,
                                                        code:data[i].CODE,
                                                        barcode:data[i].BARCODE,
                                                        price:data[i].PRICE
                                                    }
                                                    await this.addItem()
                                                }
                                                let tmpConfObj = 
                                                {
                                                    id:'msgItemsAdd',showTitle:true,title:this.t("msgItemsAdd.title"),showCloseButton:true,width:'350px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgItemsAdd.btn01"),location:'after'}],
                                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgItemsAdd.msg")}</div>)
                                                }
                                                await dialog(tmpConfObj);
                                            }
                                        }
                                    }
                                }
                            ]
                            }
                            onEnterKey={(async(e)=>
                                {
                                    if(e.component._changedValue == "")
                                    {
                                        return
                                    }
                                    let tmpQuery = 
                                    {
                                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE()) AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                                        param : ['BARCODE:string|50'],
                                        value : [e.component._changedValue]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length >0)
                                    {
                                        this.barcode.name = tmpData.result.recordset[0].NAME
                                        this.barcode.barcode = tmpData.result.recordset[0].BARCODE 
                                        this.barcode.code = tmpData.result.recordset[0].CODE 
                                        this.barcode.price = tmpData.result.recordset[0].PRICE 
                                        this.numPrice.value = parseFloat(tmpData.result.recordset[0].PRICE)
                                        if(this.chkAutoAdd.value == true)
                                        {
                                            this.addItem()
                                        }
                                        else
                                        {
                                            this.numPrice.focus()
                                        }
                                        this.setState({tbBarcode:"visible"})
                                    }
                                    else
                                    {
                                        let tmpConfObj = 
                                        {
                                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                        this.txtBarcode.value = ""
                                    }
                                    
                                }).bind(this)}></NdTextBox>
                        </div>
                    </Item>
                    <Item> 
                        <div>
                            <h4 className="text-center">
                                {this.barcode.name}
                            </h4>
                        </div>
                    </Item>
                    {/* txtQuantity */}
                    <GroupItem colCountByScreen={{xs:2}}>
                        <SimpleItem/>
                        <SimpleItem>
                            <Label text={this.t("txtQuantity")}/>
                            <NdNumberBox id="txtBarQuantity" parent={this} simple={true}  
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                param={this.param.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtQuantity',USERS:this.user.CODE})}
                                >
                            </NdNumberBox>
                        </SimpleItem>
                    </GroupItem>
                    {/* txtPrice */}
                    <GroupItem colCountByScreen={{xs:2}}>
                    <SimpleItem/>
                    <SimpleItem>
                       <Label text={this.t("txtPrice")} alignment="right" />
                       <NdNumberBox id="txtPrice" parent={this} simple={true}
                       param={this.param.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                       access={this.access.filter({ELEMENT:'txtPrice',USERS:this.user.CODE})}
                       onEnterKey={(async(e)=>
                           {

                           }).bind(this)}
                       >
                       </NdNumberBox>
                    </SimpleItem>
                    </GroupItem>
                    {/* txtVat */}
                    <GroupItem colCountByScreen={{xs:2}}>
                        <SimpleItem/>
                        <SimpleItem>
                            <Label text={this.t("txtVat")} alignment="right" />
                            <NdTextBox id="txtBarVat" parent={this} simple={true}  
                            readOnly={true}
                            param={this.param.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'txtVat',USERS:this.user.CODE})}
                            >
                            </NdTextBox>
                        </SimpleItem>
                    </GroupItem> 
                    {/* txtDiscount */}
                    <GroupItem colCountByScreen={{xs:2}}>
                        <SimpleItem/>
                        <SimpleItem>
                            <Label text={this.t("txtDiscount")} alignment="right" />
                            <NdTextBox id="txtBarDisCount" parent={this} simple={true}  
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                            readOnly={true}
                            param={this.param.filter({ELEMENT:'txtDiscount',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'txtDiscount',USERS:this.user.CODE})}
                            >
                            </NdTextBox>
                        </SimpleItem>
                    </GroupItem> 
                    {/* txtAmount */}
                    <GroupItem colCountByScreen={{xs:2}}>
                        <SimpleItem/>
                        <SimpleItem>
                            <Label text={this.t("txtAmount")} alignment="right" />
                            <NdTextBox id="txtBarAmount" parent={this} simple={true}  
                            upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                            readOnly={true}
                            param={this.param.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'txtAmount',USERS:this.user.CODE})}
                            >
                            </NdTextBox>
                        </SimpleItem>
                    </GroupItem>
                    <Item>
                        <div className="row">
                            <div className="col-12 px-4 pt-4">
                                <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.addItem()}></NdButton>
                            </div>
                        </div>
                    </Item>
                </Form>
            </div>
            <div className="row px-2 pt-2" style={{visibility:this.state.tbDocument,position:"fixed"}}>
                <Form colCount={1} >
                <Item>
                    <div className="row">
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                        </div>
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="plus" type="default" width="100%" onClick={()=>this.pageChange("Barcode")}></NdButton>
                        </div>
                        <div className="col-4">
                                <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuDocItems}  onItemClick={this.dropmenuClick}/>
                        </div>
                    </div>
                </Item>
                <Item>
                    <NdGrid parent={this} id={"grdSlsOrder"} 
                    showBorders={true} 
                    columnsAutoWidth={true} 
                    allowColumnReordering={true} 
                    allowColumnResizing={true} 
                    height={'400'} 
                    width={'100%'}
                    dbApply={false}
                    onRowUpdated={async(e)=>{
                        
                    }}
                    onRowRemoved={async (e)=>{
                       
                    }}
                    >
                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                        <Scrolling mode="infinite" />
                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                        <Column dataField="CODE" caption={this.t("grdSlsOrder.clmItemCode")} width={150}/>
                        <Column dataField="NAME" caption={this.t("grdSlsOrder.clmItemName")} width={350} />
                        <Column dataField="BARCODE" caption={this.t("grdSlsOrder.clmBarcode")} width={250} />
                        <Column dataField="PRICE" caption={this.t("grdSlsOrder.clmPrice")} width={250} />
                    </NdGrid>
                </Item>
                </Form>
            </div>
            {/* Stok Seçim */}
            <NdPopGrid id={"popItemCode"} parent={this} container={"#root"}
                visible={false}
                position={{of:'#root'}} 
                showTitle={true} 
                showBorders={true}
                width={'90%'}
                height={'90%'}
                title={this.t("popItemCode.title")} //
                search={true}
                data = 
                {{
                    source:
                    {
                        select:
                        {
                            query : "SELECT  *,  " +
                                    "CASE WHEN UNDER_UNIT_VALUE =0  " +
                                    "THEN 0 " +
                                    "ELSE " +
                                    "ROUND((PRICE * UNDER_UNIT_VALUE),2) " +
                                    "END AS UNDER_UNIT_PRICE " +
                                    "FROM  (  SELECT GUID,   " +
                                    "CODE,   " +
                                    "NAME,   " +
                                    "ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID ORDER BY CDATE DESC),'') AS BARCODE,   " +
                                    "MAIN_GRP AS ITEM_GRP,   " +
                                    "MAIN_GRP_NAME AS ITEM_GRP_NAME,   " +
                                    "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE())) AS PRICE  , " +
                                    "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                    "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'') <> '') AS TMP " +
                                    "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                            param : ['VAL:string|50']
                        },
                        sql:this.core.sql
                    }
                }}
                >
                    <Column dataField="CODE" caption={this.t("popItemCode.clmCode")} width={150} />
                    <Column dataField="NAME" caption={this.t("popItemCode.clmName")} width={300} defaultSortOrder="asc" />
            </NdPopGrid>
        </div>
        )
    }
}