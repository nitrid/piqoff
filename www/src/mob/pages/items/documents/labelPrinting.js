import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
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

export default class labelPrinting extends React.Component
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
            name:"AYTAC KAVURMA/BOEUF PRECUIT SOUS VIDE 300G"
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.lblObj = new labelCls();
        this.mainLblObj = new labelMainCls()
        this.pageCount = 0;
        this.dropmenuItems = [this.t("btnNew"),this.t("btnSave"),this.t("btnDelete"), ]
        this.pageChange = this.pageChange.bind(this)
        this.vsChange = this.vsChange.bind(this)
       


        this.frmOutwas = undefined;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()

        let tmpLbl = {...this.lblObj.empty}
        tmpLbl.REF = this.user.CODE
        this.mainLblObj.addEmpty(tmpLbl);
        
        this.txtSer.readOnly = false
        this.txtRefno.readOnly = false
        this.txtSer.readOnly = true
        this.calculateCount()
        
        //await this.grdLabelQueue.dataRefresh({source:this.lblObj.dt('LABEL_QUEUE')});

        this.txtSer.props.onChange()
    }
    dropmenuClick(e)
    {
        console.log(e)
    }
    calculateCount()
    {
        this.txtPage.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        if(this.txtPage.value == '')
        {
            this.txtPage.value = 'Lütfen Dizayn Seçiniz'
        }
        if(this.pageCount == 0)
        {
            this.txtFreeLabel.value = 'Lütfen Dizayn Seçiniz'
        }
        else
        {
            this.txtFreeLabel.value = this.pageCount - (this.lblObj.dt().length % this.pageCount)
        }
        this.txtLineCount.value = this.lblObj.dt().length
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
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"visible"})
            this.setState({tbDocument:"hidden"})
        }
        if(pPage == "Document")
        {
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"visible"})
        }
    }    
    async addItem(pData,pIndex)
    {
        for (let i = 0; i < this.lblObj.dt().length; i++) 
        {
            if(this.lblObj.dt()[i].CODE == pData.CODE)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {
                   
                    await this.grdLabelQueue.devGrid.deleteRow(pIndex)
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        this.lblObj.dt()[pIndex].CODE = pData.CODE
        this.lblObj.dt()[pIndex].BARCODE = pData.BARCODE
        this.lblObj.dt()[pIndex].NAME = pData.NAME
        this.lblObj.dt()[pIndex].ITEM_GRP = pData.ITEM_GRP
        this.lblObj.dt()[pIndex].ITEM_GRP_NAME = pData.ITEM_GRP_NAME
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].UNDER_UNIT_VALUE = pData.UNDER_UNIT_VALUE
        this.lblObj.dt()[pIndex].UNDER_UNIT_PRICE = pData.UNDER_UNIT_PRICE
        this.lblObj.dt()[pIndex].PRICE = pData.PRICE
        this.lblObj.dt()[pIndex].LINE_NO = pIndex + 1
        this.calculateCount()
    }
    vsChange()
    {
        if(this.state.visible == "visible")
        {
            this.setState({visible:"hidden"})
        }
        else
        {
            this.setState({visible:"visible"})
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
                                <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuItems}  onItemClick={this.dropmenuClick}/>
                            </div>
                        </div>
                    </Item>
                    {/* txtSer-Refno */}
                    <Item>
                        <Label text={this.t("txtRefRefno")} alignment="right" />
                        <div className="row">
                            <div className="col-5 pe-0">
                                <NdTextBox id="txtSer" parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF"}}
                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                readOnly={true}
                                maxLength={32}
                                onChange={(async()=>
                                {
                                    let tmpQuery = 
                                    {
                                        query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM LABEL_QUEUE WHERE  REF = @REF ",
                                        param : ['REF:string|25'],
                                        value : [this.txtSer.value]
                                    }
                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                    if(tmpData.result.recordset.length > 0)
                                    {
                                        this.txtRefno.setState({value:tmpData.result.recordset[0].REF_NO})
                                    }
                                }).bind(this)}
                                param={this.param.filter({ELEMENT:'txtSer',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'txtSer',USERS:this.user.CODE})}
                                >
                                <Validator validationGroup={"frmLabelQeueu"}>
                                        <RequiredRule message={this.t("validRef")} />
                                    </Validator>  
                                </NdTextBox>
                            </div>
                            <div className="col-7 ps-0">
                                <NdTextBox id="txtRefno" parent={this} simple={true} dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"REF_NO"}}
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
                                                this.getDocs(0)   
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
                                    let tmpResult = await this.checkDoc('00000000-0000-0000-0000-000000000000',this.txtSer.value,this.txtRefno.value)
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
                        button=
                        {
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    onClick:()=>
                                    {
                                        this.pg_Docs.hide()
                                        this.getDocs('0,1')
                                    }
                                }
                            ]
                            
                        }
                        >
                            <Column dataField="REF" caption={this.t("pg_Docs.clmRef")} width={150} defaultSortOrder="asc"/>
                            <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={300} defaultSortOrder="asc" />
                        </NdPopGrid>
                    </Item>
                    {/* design */}
                    <Item>
                        <Label text={this.t("design")} alignment="right" />
                        <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                        dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"DESING"}}
                        displayExpr="DESIGN_NAME"                       
                        valueExpr="TAG"
                        value=""
                        searchEnabled={true}
                        onValueChanged={(async(e)=>
                            {
                                for (let i = 0; i < this.cmbDesignList.data.datatable.length; i++) 
                                {
                                    if(this.cmbDesignList.data.datatable[i].TAG == e.value)
                                    {
                                        this.pageCount = this.cmbDesignList.data.datatable[i].PAGE_COUNT
                                    }
                                }
                                this.calculateCount()
                            }).bind(this)}
                        data={{source:{select:{query : "SELECT TAG,DESIGN_NAME,PAGE_COUNT FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '01'"},sql:this.core.sql}}}
                        param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                        >
                            <Validator validationGroup={"frmLabelQeueu"}>
                                <RequiredRule message={this.t("validDesign")} />
                            </Validator> 
                        </NdSelectBox>
                    </Item>
                    {/* txtPage */}
                    <Item>
                        <Label text={this.t("txtPage")} alignment="right" />
                        <NdTextBox id="txtPage" parent={this} simple={true}  
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                    {/* txtFreeLabel */}
                    <Item>
                        <Label text={this.t("txtFreeLabel")} alignment="right" />
                        <NdTextBox id="txtFreeLabel" parent={this} simple={true}  
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                    {/* txtLineCount */}
                    <Item>
                        <Label text={this.t("txtLineCount")} alignment="right" />
                        <NdTextBox id="txtLineCount" parent={this} simple={true}  
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
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
                <Form colCount={1} >
                    <Item>
                    <div className="row">
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                        </div>
                        <div className="col-4 px-2 pt-2">
                            <NdButton icon="detailslayout" type="default" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                        <div className="col-4 px-2 pt-2">
                            
                            <NdCheckBox id="chkAutoAdd" text={"Oto Ekle"} parent={this} defaultValue={false} 
                            param={this.param.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'chkAutoAdd',USERS:this.user.CODE})}/>
                        </div>
                    </div>
                    </Item>
                    <Item>
                    <div className="col-12 px-2 pt-2">
                            <NdTextBox id="txtBarcode" parent={this} placeholder="Lütfen Barkod Okutunuz"
                            button=
                            {
                            [
                                {
                                    id:'01',
                                    icon:'more',
                                    onClick:()=>
                                    {
                                        this.popItemCode.show()
                                        this.popItemCode.onClick = async(data) =>
                                        {
                                            if(data.length == 1)
                                            {
                                                    let tmpDocItems = {...this.lblObj.empty}
                                                    tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                    tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                    this.lblObj.addEmpty(tmpDocItems)
                                                    this.addItem(data[i],this.lblObj.dt().length -1)
                                            }
                                            else if(data.length > 1)
                                            {
                                                for (let i = 0; i < data.length; i++) 
                                                {
                                                    let tmpDocItems = {...this.lblObj.empty}
                                                    tmpDocItems.REF = this.mainLblObj.dt()[0].REF
                                                    tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
                                                    this.lblObj.addEmpty(tmpDocItems)
                                                    this.addItem(data[i],this.lblObj.dt().length -1)
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                            }></NdTextBox>
                        </div>
                    </Item>
                    <Item> 
                        <div>
                            <h4 className="text-center">
                                {this.barcode.name}
                            </h4>
                        </div>
                    </Item>
                     {/* txtPage */}
                     <Item>
                        <Label text={this.t("txtPage")} alignment="right" />
                        <NdTextBox id="txtPage" parent={this} simple={true}  
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtPage',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                    {/* txtFreeLabel */}
                    <Item>
                        <Label text={this.t("txtFreeLabel")} alignment="right" />
                        <NdTextBox id="txtFreeLabel" parent={this} simple={true}  
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                    {/* txtLineCount */}
                    <Item>
                        <Label text={this.t("txtLineCount")} alignment="right" />
                        <NdTextBox id="txtLineCount" parent={this} simple={true}  
                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                        readOnly={true}
                        param={this.param.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'txtLineCount',USERS:this.user.CODE})}
                        >
                        </NdTextBox>
                    </Item> 
                     {/* txtPrice */}
                     <Item>
                        <Label text={this.t("numPrice")} alignment="right" />
                        <NdNumberBox id="numPrice" parent={this} simple={true}  
                        param={this.param.filter({ELEMENT:'numPrice',USERS:this.user.CODE})}
                        access={this.access.filter({ELEMENT:'numPrice',USERS:this.user.CODE})}
                        >
                        </NdNumberBox>
                    </Item> 
                    <Item>
                        <div className="row">
                            <div className="col-12 px-4 pt-4">
                                <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                            </div>
                        </div>
                    </Item>
                </Form>
            </div>
            <div className="row px-2 pt-2" style={{visibility:this.state.tbDocument,position:"fixed"}}>
                <Form colCount={1} >
                 
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