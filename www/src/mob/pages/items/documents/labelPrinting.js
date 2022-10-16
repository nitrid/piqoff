import React from 'react';
import App from '../../../lib/app.js';
import { labelCls,labelMainCls } from '../../../../core/cls/label.js';
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
            name:"",
            price:0,
            barcode: "",
            code:""
        }
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.lblObj = new labelCls();
        this.mainLblObj = new labelMainCls()
        this.pageCount = 0;
        this.dropmenuMainItems = [this.t("btnNew"),this.t("btnSave")]
        this.dropmenuDocItems = [this.t("btnDeleteRow")]
        this.pageChange = this.pageChange.bind(this)
        this.dropmenuClick = this.dropmenuClick.bind(this)
        this.barcodeScan = this.barcodeScan.bind(this)
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
        tmpLbl.REF = this.user.NAME
        this.mainLblObj.addEmpty(tmpLbl);
        
        this.txtSer.readOnly = false
        this.txtRefno.readOnly = false
        this.txtSer.readOnly = true
        this.calculateCount()
        
        await this.grdLblPrinting.dataRefresh({source:this.lblObj.dt('LABEL_QUEUE')});

        this.txtSer.props.onChange()
    }
    async dropmenuClick(e)
    {
        if(e.itemData == this.t("btnNew"))
        {
            this.init()
        }
        else if(e.itemData == this.t("btnSave"))
        {
            let tmpConfObj =
            {
                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
            }
            
            let pResult = await dialog(tmpConfObj);
            if(pResult == 'btn01')
            {
                let Data = {data:this.lblObj.dt().toArray()}
                this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)

                let tmpConfObj1 =
                {
                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                }
                
                if((await this.mainLblObj.save()) == 0)
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
    }
    calculateCount()
    {
        this.txtPage.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        this.txtBarPage.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        if(this.txtPage.value == '')
        {
            this.txtPage.value = this.t("validDesign")
            this.txtBarPage.value = this.t("validDesign")
        }
        if(this.pageCount == 0)
        {
            this.txtFreeLabel.value = this.t("validDesign")
            this.txtBarFreeLabel.value = this.t("validDesign")
        }
        else
        {
            this.txtFreeLabel.value = this.pageCount - (this.lblObj.dt().length % this.pageCount)
            this.txtBarFreeLabel.value  = this.pageCount - (this.lblObj.dt().length % this.pageCount)
        }
        this.txtLineCount.value = this.lblObj.dt().length
        this.txtBarLineCount.value = this.lblObj.dt().length
    }
    async getDoc(pGuid)
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()
        await this.lblObj.load({GUID:pGuid});
        await this.mainLblObj.load({GUID:pGuid});
        let tmpQuery = 
        {
            query : "SELECT PAGE_COUNT FROM LABEL_DESIGN  WHERE TAG = @TAG ",
            param : ['TAG:string|50'],
            value : [this.mainLblObj.dt()[0].DESING]
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        this.pageCount = tmpData.result.recordset[0].PAGE_COUNT
        this.calculateCount()

        this.txtSer.readOnly = true
        this.txtRefno.readOnly = true
    }
    async getDocs(pType)
    {
        let tmpQuery = 
        {
            query : "SELECT GUID,REF,REF_NO FROM LABEL_QUEUE WHERE STATUS IN("+pType+") AND REF = '" +this.txtSer.value+"' " 
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        await this.pg_Docs.setData(tmpRows)
        this.pg_Docs.show()
        this.pg_Docs.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID)
            }
        }
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
            if(this.cmbDesignList.value == "")
            {
                let tmpConfObj = 
                {
                    id:'msgDesignSelect',showTitle:true,title:this.t("msgDesignSelect.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgDesignSelect.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDesignSelect.msg")}</div>)
                }
                await dialog(tmpConfObj);
                return
            }
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"visible"})
            this.setState({tbDocument:"hidden"})
            if(this.chkAutoAdd.value == false)
            {
                this.txtBarcode.focus()
            }
        }
        if(pPage == "Document")
        {
            this.setState({tbMain:"hidden"})
            this.setState({tbBarcode:"hidden"})
            this.setState({tbDocument:"visible"})
        }
    }    
    async addItem()
    {
        if(this.txtBarcode.value == "")
        {
            let tmpConfObj = 
            {
                id:'msgBarcodeCheck',showTitle:true,title:this.t("msgBarcodeCheck.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.t("msgBarcodeCheck.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeCheck.msg")}</div>)
            }
            let pResult = await dialog(tmpConfObj);
            return
        }
        for (let i = 0; i < this.lblObj.dt().length; i++) 
        {
            if(this.lblObj.dt()[i].CODE == this.barcode.code)
            {
                let tmpConfObj = 
                {
                    id:'msgCombineItem',showTitle:true,title:this.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCombineItem.btn02"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCombineItem.msg")}</div>)
                }
                let pResult = await dialog(tmpConfObj);
                if(pResult == 'btn01')
                {                   
                    this.barcodeReset()
                    return
                }
                else
                {
                    break
                }
                
            }
        }
        let tmpDocItems = {...this.lblObj.empty}
        tmpDocItems.REF = this.mainLblObj.dt()[0].REF
        tmpDocItems.REF_NO = this.mainLblObj.dt()[0].REF_NO
        tmpDocItems.NAME = this.barcode.name
        tmpDocItems.CODE = this.barcode.code
        tmpDocItems.BARCODE = this.barcode.barcode
        tmpDocItems.PRICE = this.barcode.price
        this.lblObj.addEmpty(tmpDocItems)
        this.barcodeReset()
        let Data = {data:this.lblObj.dt().toArray()}
        this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)
        await this.mainLblObj.save()
       
    }
    barcodeReset()
    {
        if(this.chkAutoAdd.value == false)
        {
            this.barcode = 
            {
                name:"",
                price:0,
                barcode: "",
                code:""
            }
            this.numPrice.value=0
        }
        this.txtBarcode.value = ""
        this.setState({tbBarcode:"visible"})
        if(this.chkAutoAdd.value == false)
        {
            this.txtBarcode.focus()
        }
        this.calculateCount()
    }
    async barcodeScan()
    {
        
        cordova.plugins.barcodeScanner.scan(
            async function (result) 
            {
                if(result.cancelled == false)
                {
                    this.txtBarcode.value = result.text;
                    let tmpQuery = 
                    {
                        query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
                        param : ['BARCODE:string|50'],
                        value : [result.text]
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
                        }
                        this.setState({tbBarcode:"visible"})
                    }
                    else
                    {
                        document.getElementById("Sound").play(); 
                        let tmpConfObj = 
                        {
                            id:'msgBarcodeNotFound',showTitle:true,title:this.t("msgBarcodeNotFound.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn01",caption:this.t("msgBarcodeNotFound.btn01"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgBarcodeNotFound.msg")}</div>)
                        }
                        await dialog(tmpConfObj);
                        this.txtBarcode.value = ""
                    }
                }
            }.bind(this),
            function (error) 
            {
                //alert("Scanning failed: " + error);
            },
            {
              prompt : "Scan",
              orientation : "portrait"
            }
        );
    }
    render()
    {
        return(
            <ScrollView>
            <div className="row px-1 pt-1">
                <div className="row" style={{visibility:this.state.tbMain,position:"absolute"}}>
                    <Form colCount={1}>
                        {/* <Item>
                            <div className="row">
                                <div className="col-8"></div>
                                <div className="col-4">
                                    <DropDownButton text={this.t("btnDropmenu")} icon="menu" items={this.dropmenuMainItems}  onItemClick={this.dropmenuClick}/>
                                </div>
                            </div>
                        </Item> */}
                        {/* txtSer-Refno */}
                        <Item>
                            <Label text={this.t("txtRefRefno")} alignment="right" />
                            <div className="row">
                                <div className="col-4 pe-0">
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
                                            this.txtRefno.value=tmpData.result.recordset[0].REF_NO
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
                                <div className="col-8 ps-0">
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
                                            },
                                            {
                                                id:'03',
                                                icon:'revert',
                                                onClick:()=>
                                                {
                                                    this.init()
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
                            columnsAutoWidth={false}
                            showBorders={true}
                            width={'90%'}
                            height={'80%'}
                            selection={{mode:"single"}}
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
                                <Column dataField="REF_NO" caption={this.t("pg_Docs.clmRefNo")} width={100} defaultSortOrder="asc" />
                                <Column dataField="" caption="" width={10} defaultSortOrder="asc" />
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
                <div className="row" style={{visibility:this.state.tbBarcode,position:"absolute"}}>
                    <Form colCount={1} >
                        <Item>
                        <div className="row"style={{height:"25px"}}>
                            <div className="col-4">
                                <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                            </div>
                            <div className="col-4">
                                <NdButton icon="detailslayout" type="default" width="100%" onClick={()=>this.pageChange("Document")}></NdButton>
                            </div>
                            <div className="col-4">
                                
                                <NdCheckBox id="chkAutoAdd" text={this.t("chkAutoAdd")} parent={this} value={true} defaultValue={true} />
                            </div>
                        </div>
                        </Item>
                        <Item>
                        <div className="col-12 py-1 pt-1">
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
                                        },
                                        {
                                            id:'02',
                                            icon:'photo',
                                            onClick:async()=>
                                            {
                                                this.barcodeScan()
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
                                            query : "SELECT ITEM_CODE AS CODE,ITEM_NAME AS NAME,ITEM_GUID AS GUID,BARCODE,[dbo].[FN_PRICE_SALE](ITEM_GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000') AS PRICE FROM ITEM_BARCODE_VW_01  WHERE BARCODE = @BARCODE OR ITEM_CODE = @BARCODE ",
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
                                            }
                                            this.setState({tbBarcode:"visible"})
                                        }
                                        else
                                        {
                                            document.getElementById("Sound").play(); 

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
                                <h5 className="text-center">
                                    {this.barcode.name}
                                </h5>
                            </div>
                        </Item>
                        {/* txtPage */}
                        <Item>
                            <Label text={this.t("txtPage")} alignment="right" />
                            <NdTextBox id="txtBarPage" parent={this} simple={true}  
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
                            <NdTextBox id="txtBarFreeLabel" parent={this} simple={true}  
                            readOnly={true}
                            param={this.param.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                            access={this.access.filter({ELEMENT:'txtFreeLabel',USERS:this.user.CODE})}
                            >
                            </NdTextBox>
                        </Item> 
                        {/* txtLineCount */}
                        <Item>
                            <Label text={this.t("txtLineCount")} alignment="right" />
                            <NdTextBox id="txtBarLineCount" parent={this} simple={true}  
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
                            onEnterKey={(async(e)=>
                                {
                                    this.addItem()
                                }).bind(this)}
                            >
                            </NdNumberBox>
                        </Item> 
                        <Item>
                            <div className="row">
                                <div className="col-12">
                                    <NdButton text={this.t("btnItemAdd")} type="default" width="100%" onClick={()=>this.addItem()}></NdButton>
                                </div>
                            </div>
                        </Item>
                    </Form>
                </div>
                <div className="row" style={{visibility:this.state.tbDocument,position:"absolute"}}>
                    <Form colCount={1} >
                    <Item>
                        <div className="row" style={{height:"25px"}}>
                            <div className="col-4">
                                <NdButton icon="arrowleft" type="default" width="100%" onClick={()=>this.pageChange("Main")}></NdButton>
                            </div>
                            <div className="col-4">
                                <NdButton icon="plus" type="default" width="100%" onClick={()=>this.pageChange("Barcode")}></NdButton>
                            </div>
                            <div className="col-4">
                                  
                            </div>
                        </div>
                    </Item>
                    <Item>
                        <NdGrid parent={this} id={"grdLblPrinting"} 
                        showBorders={true} 
                        columnsAutoWidth={false} 
                        allowColumnReordering={true} 
                        allowColumnResizing={true} 
                        height={'400'} 
                        width={'100%'}
                        dbApply={false}
                        onContentReady={async(e)=>{
                            e.component.columnOption("command:edit", 'visibleIndex', -1)
                        }}
                        onRowUpdated={async(e)=>{
                            
                        }}
                        onRowRemoved={async (e)=>{
                            let Data = {data:this.lblObj.dt().toArray()}
                            this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)
                            await this.mainLblObj.save()
                        }}
                        >
                            <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                            <Scrolling mode="standart" />
                            <Editing mode="cell" allowUpdating={false} allowDeleting={true} confirmDelete={false}/>
                            <Column dataField="BARCODE" caption={this.t("grdLblPrinting.clmBarcode")} width={110} />
                            <Column dataField="NAME" caption={this.t("grdLblPrinting.clmItemName")}  width={250}/>
                            <Column dataField="PRICE" caption={this.t("grdLblPrinting.clmPrice")} width={60} />
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
                    selection={{mode:"single"}}
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
                                        "(SELECT [dbo].[FN_PRICE_SALE](GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000')) AS PRICE  , " +
                                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS_VW_01.GUID),0) AS UNDER_UNIT_VALUE " +
                                        "FROM ITEMS_VW_01 WHERE ISNULL((SELECT TOP 1 BARCODE FROM ITEM_BARCODE WHERE ITEM = ITEMS_VW_01.GUID),'') <> '') AS TMP " +
                                        "WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL) " ,
                                param : ['VAL:string|50']
                            },
                            sql:this.core.sql
                        }
                    }}
                    >
                        <Column dataField="CODE" caption={this.t("popItemCode.clmCode")} width={100} />
                        <Column dataField="NAME" caption={this.t("popItemCode.clmName")} defaultSortOrder="asc" />
                </NdPopGrid>
            </div>
            </ScrollView>
       
        )
    }
}