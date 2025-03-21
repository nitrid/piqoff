import React from 'react';
import App from '../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,quickDescCls } from '../../../core/cls/doc.js';
import moment from 'moment';
import NbButton from '../../../core/react/bootstrap/button';
import NbLabel from '../../../core/react/bootstrap/label';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../core/react/devex/grid.js';
import NdButton from '../../../core/react/devex/button.js';
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../core/react/devex/imageupload.js';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import { datatable } from '../../../core/core.js';
import tr from '../../meta/lang/devexpress/tr.js';
import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';

export default class outageDoc extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:2,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.qDescObj = new quickDescCls();
        this.quantityControl = false
        this.itemDt = new datatable();
        this.unitDt = new datatable();      
        this.orderDt = new datatable();
        
        this.itemDt.selectCmd = 
        {
            query : "SELECT *,(SELECT [dbo].[FN_DEPOT_QUANTITY](GUID, @DEPOT_GUID,GETDATE())) AS DEPOT_QUANTITY FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE ) OR (@CODE = '')",
            param : ['CODE:string|25','DEPOT_GUID:string|50'],
        }
        this.unitDt.selectCmd = 
        {
            query : "SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1 ORDER BY TYPE ASC",
            param : ['ITEM_GUID:string|50'],
        }

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'200px',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
     
    

        this.frmOutwas = undefined;
        this.docLocked = false;      
        this.combineControl = true
        this.combineNew = false  
        
        this.rightItems = [{ text: this.t("getDispatch"), }]
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.pageView.activePage('Main')
        this.init()
    }
    async init()
    {
        {
            this.docObj.clearAll()
            this.qDescObj.clearAll()
            
            this.dtDocDate.value = moment(new Date())
    
            
            await this.cmbDepot.dataRefresh({source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}});
            let tmpDoc = {...this.docObj.empty}


            tmpDoc.TYPE = 1
            tmpDoc.DOC_TYPE = 1
            tmpDoc.REBATE = 0
            tmpDoc.REF = this.user.CODE
            tmpDoc.OUTPUT = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value
            tmpDoc.INPUT = "00000000-0000-0000-0000-000000000000"
            this.docObj.addEmpty(tmpDoc);

            this.txtRef.readOnly = false
            this.txtRefNo.readOnly = false
            this.cmbDepot.readOnly = false
            this.dtDocDate.readOnly = false    
            this.clearEntry();
    
            this.txtRef.props.onChange(tmpDoc.REF)
            await this.grdOutwasItems.dataRefresh({source:this.docObj.docItems.dt('DOC_ITEMS')});
            await this.cmbUnit.dataRefresh({source : this.unitDt})
        }
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.unitDt.clear();
        this.orderDt.clear();

        this.orderDt.push({UNIT:"",FACTOR:0,QUANTITY:0,PRICE:0,AMOUNT:0,DISCOUNT:0,DISCOUNT_RATE:0,VAT:0,SUM_AMOUNT:0})
        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.cmbUnit.setData([])

    }

    getItem(pCode)
    {
        console.log("buradayim -6")
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode,this.docObj.dt()[0].OUTPUT]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                console.log("aaa")
                this.lblItemName.value = this.itemDt[0].NAME
                this.lblDepotQuantity.value = this.itemDt[0].DEPOT_QUANTITY

                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh()
                this.cmbUnit.setData(this.unitDt)

                if(this.unitDt.length > 0)
                {
                    console.log("bbb")
                    this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                    this.txtFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                    this.txtFactor.props.onValueChanged()
                }

                this.txtBarcode.value = ""
                this.txtQuantity.focus();
            }
            else
            {                               
                document.getElementById("Sound").play(); 
                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeNotFound")}</div>)
                await dialog(this.alertContent);
                this.txtBarcode.value = ""
                this.txtBarcode.focus();
            }
            resolve();
        });
    }
    async checkRow()
    {
        for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
        {
            this.docObj.docItems.dt()[i].INPUT = this.docObj.dt()[0].INPUT
            this.docObj.docItems.dt()[i].OUTPUT = this.docObj.dt()[0].OUTPUT
            this.docObj.docItems.dt()[i].DOC_DATE = this.docObj.dt()[0].DOC_DATE
        }
    }
    async deleteAll()
    {
        this.docObj.dt('DOC').removeAt(0)
        await this.docObj.dt('DOC').delete();
        this.init()
        this.pageView.activePage('Main')
    }
    async onClickBarcodeShortcut()
    {
        console.log("this.docObj.dt()[0].OUTPUT",this.docObj.dt())
        if(this.docObj.dt()[0].OUTPUT == "")
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgInDepot")}</div>)
            await dialog(this.alertContent);
            return
        }
        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.docObj.dt("DOC_ITEMS").length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    async addItem()
    {
        console.log("this.itemDt.length ", this.itemDt.length)
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        console.log("this.txtQuantity.value ", this.txtQuantity.value)
        if(this.txtQuantity.value == "" || this.txtQuantity.value == 0 || this.txtQuantity.value > 15000000)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgQuantityCheck")}</div>)
            await dialog(this.alertContent);
            return
        }

        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value

        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                let tmpQuantity = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
                this.docObj.docItems.dt()[i].QUANTITY = this.docObj.docItems.dt()[i].QUANTITY + tmpQuantity
                this.clearEntry()
                await this.save()
            }       

            for (let i = 0; i < this.docObj.docItems.dt().length; i++) 
            {
                if(this.docObj.docItems.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
                {
                    if(prmRowMerge == 2)
                    {
                        document.getElementById("Sound2").play(); 
                        let tmpConfObj = 
                        {
                            id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgCombineItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgCombineItem.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCombineItem.msg")}</div>)
                        }
                        let pResult = await dialog(tmpConfObj);
                        if(pResult == 'btn01')
                        {                   
                            tmpFnMergeRow(i)
                            return
                        }
                        else
                        {
                            break
                        }
                    }
                    else
                    {
                        tmpFnMergeRow(i)
                        return
                    }
                }
            }
        }
        
        let tmpDocItems = {...this.docObj.docItems.empty}

        tmpDocItems.REF = this.docObj.dt()[0].REF
        tmpDocItems.REF_NO = this.docObj.dt()[0].REF_NO
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.DOC_GUID = this.docObj.dt()[0].GUID
        tmpDocItems.TYPE = this.docObj.dt()[0].TYPE
        tmpDocItems.DOC_TYPE = this.docObj.dt()[0].DOC_TYPE
        tmpDocItems.LINE_NO = this.docObj.docItems.dt().length
        tmpDocItems.UNIT = this.orderDt[0].UNIT
        tmpDocItems.INPUT = this.docObj.dt()[0].INPUT
        tmpDocItems.DISCOUNT = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_1 = this.orderDt[0].DISCOUNT
        tmpDocItems.DISCOUNT_RATE = this.orderDt[0].DISCOUNT_RATE
        tmpDocItems.OUTPUT = this.docObj.dt()[0].OUTPUT
        tmpDocItems.DOC_DATE = this.docObj.dt()[0].DOC_DATE
        tmpDocItems.QUANTITY = this.orderDt[0].QUANTITY * this.orderDt[0].FACTOR
        tmpDocItems.VAT_RATE = this.itemDt[0].VAT
        tmpDocItems.PRICE = this.orderDt[0].PRICE
        tmpDocItems.VAT = this.orderDt[0].VAT
        tmpDocItems.AMOUNT = this.orderDt[0].AMOUNT
        tmpDocItems.TOTALHT = Number(this.orderDt[0].AMOUNT - this.orderDt[0].DISCOUNT).round(2)
        tmpDocItems.TOTAL = this.orderDt[0].SUM_AMOUNT

        this.docObj.docItems.addEmpty(tmpDocItems)
        this.clearEntry()
        await this.save()
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            if(this.docObj.dt().length > 0)
            {
                console.log("this.docObj.docItems.dt().DESCRIPTION",this.docObj.docItems.dt().DESCRIPTION)
                this.docObj.dt()[0].DESCRIPTION = this.docObj.docItems.dt().DESCRIPTION
            }
            
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'after'}],
            }
            
            if((await this.docObj.save()) == 0)
            {                                                    
               
            }
            else
            {
                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.lang.t("msgSaveResult.msgFailed")}</div>)
                await dialog(tmpConfObj1);
            }
            resolve()
        })
    }
    async calcEntry() {
        // Vérifie si l'une des propriétés a une valeur différente de zéro
        if (this.txtFactor.value !== 0 || this.txtQuantity.value !== 0 ) {
            
            // Calcule la quantité temporaire en multipliant txtFactor par txtQuantity
            let tmpQuantity = this.txtFactor.value * this.txtQuantity.value;
     
            // Récupère la limite de quantité depuis les paramètres système
            let prmLimitQuantity = this.sysParam.filter({ USERS: this.user.CODE, ID: 'limitQuantity' }).getValue()?.value;
    
            // Vérifie si la quantité temporaire dépasse la limite définie
            if (tmpQuantity > prmLimitQuantity) {
                // Affiche un message d'alerte et limite la valeur de txtQuantity à la limite définie
                this.alertContent.content = (
                    <div style={{ textAlign: "center", fontSize: "20px" }}>
                        {this.t("msgAlert.msgLimitQuantityCheck")}
                    </div>
                );
                await dialog(this.alertContent);
                this.txtQuantity.value = prmLimitQuantity;
                return; // Sort de la fonction si la quantité est limitée
            }
        }
    }

    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_09")} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :
                            [
                                {
                                    icon : "fa-file",
                                    text : this.lang.t("btnNewDoc"),
                                    onClick : ()=>
                                    {
                                        this.init()
                                    }
                                },
                                {
                                    icon : "fa-trash",
                                    text : this.lang.t("btnDocDelete"),
                                    onClick : ()=>
                                    {
                                        if(this.docObj.dt().length > 0)
                                        {
                                            this.deleteAll();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            shortcuts :
                            [
                                {icon : "fa-file-lines",onClick : this.onClickProcessShortcut.bind(this)}
                            ]
                        },
                        {
                            name : 'Process',isBack : true,isTitle : false,
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)}
                            ]
                        }
                    ]}
                    onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'50px',height:'100%'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className="row px-2">
                            <div className="col-12">
                                    {/* REF-REF NO */}
                                    <div className="row pb-2">
                                        <div className="col-3 d-flex justify-content-end align-items-center text-size-12">{this.t("lblRef")}</div>
                                        <div className='col-9'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                <NdTextBox id="txtRef" parent={this} simple={true} readOnly={false} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}
                                                    onChange={(async(e)=>
                                                    {
                                                        try 
                                                        {
                                                            let tmpQuery = 
                                                            {
                                                                query :"SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM DOC WHERE TYPE = 1 AND DOC_TYPE = 1 AND REF = @REF ",
                                                                param : ['REF:string|25'],
                                                                value : [typeof e.component == 'undefined' ? e : this.txtRef.value]
                                                            }

                                                            let tmpData = await this.core.sql.execute(tmpQuery) 
                                                            console.log("tmpData",tmpData)

                                                            if(tmpData.result.recordset.length > 0)
                                                            {
                                                                this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
                                                                console.log("this.txtRefNo.value",this.txtRefNo.value)
                                                            }
                                                        }
                                                        catch (error) 
                                                        {
                                                            console.log("Hata oluştu: ", error);
                                                        }
                                                        
                                                    }).bind(this)}
                                                    />
                                                </div>
                                                <div className='col-8'>
                                                <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={false} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:async()=>
                                                                {
                                                                    this.popDoc.show()
                                                                    this.popDoc.onClick = (data) =>
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
                                                                    this.txtRefNo.value = Math.floor(Date.now() / 1000)
                                                                    console.log("this.txtRefNo.value",this.txtRefNo.value)
                                                                }
                                                            }
                                                        ]
                                                    }/>
                                                    {/*EVRAK SEÇİM */}
                                                    <NdPopGrid id={"popDoc"} parent={this} container={"#root"}
                                                    selection={{mode:"single"}}
                                                    visible={false}
                                                    position={{of:'#root'}} 
                                                    showTitle={true} 
                                                    showBorders={true}
                                                    width={'100%'}
                                                    height={'100%'}
                                                    title={this.t("popDoc.title")} 
                                                    data = 
                                                    {{
                                                        source:
                                                        {
                                                            select:
                                                            {
                                                                query : "SELECT GUID,REF,REF_NO,INPUT_CODE,INPUT_NAME,DOC_DATE_CONVERT FROM DOC_VW_01 WHERE TYPE = 1 AND DOC_TYPE = 1 AND REBATE = 1 ORDER BY DOC_DATE DESC"
                                                            },
                                                            sql:this.core.sql
                                                        }
                                                    }}
                                                    >
                                                        <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                        <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                        <Column dataField="DOC_DATE_CONVERT" caption={this.t("popDoc.clmDate")} width={100}  />
                                                        <Column dataField="INPUT_NAME" caption={this.t("popDoc.clmInputName")} width={200}  />
                                                        <Column dataField="INPUT_CODE" caption={this.t("popDoc.clmInputCode")} width={150}  />
                                                    </NdPopGrid>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* DATE */}
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblDate")}</div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}/>
                                        </div>
                                    </div>
                                    {/* SORTIE DEPOT */}
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblOutput")}</div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                            dt={{data:this.docObj.dt('DOC'),field:"OUTPUT"}}  
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            notRefresh = {true}
                                            onValueChanged={(async()=>
                                                {
                                                    this.checkRow()
                                                }).bind(this)}
                                            data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            >
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                    {/* BARCODE - LINES SHORTCUT */}
                                    
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-barcode"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnBarcodeEntry")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={this.onClickProcessShortcut.bind(this)}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-file-lines"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>{this.lang.t("btnProcessLines")}</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
  
                         <PageContent id={"Entry"} onActive={()=>
                            {
                                this.txtBarcode.focus();
                            }}>
                                <div className='row px-2'>
                                    <div className='col-12'>
                                        <div className='row pb-2'>
                                            <div className='col-12'>
                                                <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                                onKeyUp={(async(e)=>
                                                {
                                                    if(e.event.key == 'Enter')
                                                    {
                                                        await this.getItem(this.txtBarcode.value)
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
                                                                this.popItem.show()
                                                                this.popItem.onClick = (data) =>
                                                                {
                                                                    if(data.length > 0)
                                                                    {
                                                                        this.getItem(data[0].CODE)
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id:'02',
                                                            icon:'photo',
                                                            onClick:()=>
                                                            {
                                                                if(typeof cordova == "undefined")
                                                                {
                                                                    return;
                                                                }
                                                                cordova.plugins.barcodeScanner.scan(
                                                                    async function (result) 
                                                                    {
                                                                        if(result.cancelled == false)
                                                                        {
                                                                            this.txtBarcode.value = result.text;
                                                                            this.getItem(result.text)
                                                                        }
                                                                    }.bind(this),
                                                                    function (error) 
                                                                    {
                                                                        
                                                                    },
                                                                    {
                                                                    prompt : "Scan",
                                                                    orientation : "portrait"
                                                                    }
                                                                );
                                                            }
                                                        }
                                                    ]
                                                }>
                                                </NdTextBox>
                                                {/*STOK SEÇİM */}
                                                <NdPopGrid id={"popItem"} parent={this} container={"#root"}
                                                selection={{mode:"single"}}
                                                visible={false}
                                                position={{of:'#root'}} 
                                                showTitle={true} 
                                                showBorders={true}
                                                width={'100%'}
                                                height={'100%'}
                                                search={true}
                                                title={this.lang.t("popItem.title")} 
                                                data = 
                                                {{
                                                    source:
                                                    {
                                                        select:
                                                        {
                                                            query : "SELECT CODE,NAME FROM ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))",
                                                            param : ['VAL:string|50']
                                                        },
                                                        sql:this.core.sql
                                                    }
                                                }}
                                                >
                                                    <Column dataField="CODE" caption={this.lang.t("popItem.clmCode")} width={120} />
                                                    <Column dataField="NAME" caption={this.lang.t("popItem.clmName")} width={100} />
                                                </NdPopGrid>
                                            </div>
                                        </div>
                                        <div className='row pb-2'>
                                            <div className='col-12'>
                                                <h6 style={{height:'60px',textAlign:"center",overflow:"hidden"}}>
                                                    <NbLabel id="lblItemName" parent={this} value={""}/>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className='row pb-2'>
                                            <div className='col-6'>
                                                <div style={{fontSize:'14px',fontWeight:'bold'}}>
                                                    <label className='text-purple-light'>{this.t("lblDepotQuantity")}</label>
                                                    <NbLabel id="lblDepotQuantity" parent={this} value={0}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row pb-2'>
                                            <div className='col-8 d-flex align-items-center justify-content-end'>
                                                <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblUnit")}</label>                                            
                                            </div>
                                            <div className='col-4'>
                                                <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                dt={{data:this.orderDt,field:"UNIT"}}
                                                onValueChanged={(e)=>
                                                {
                                                    if(e.value != null && e.value != "")
                                                    {
                                                        let tmpFactor = this.unitDt.where({GUID:e.value});
                                                        if(tmpFactor.length > 0)
                                                        {
                                                            this.txtFactor.value = tmpFactor[0].FACTOR
                                                            this.txtFactor.props.onValueChanged()
                                                        }
                                                    }
                                                }}/>
                                            </div>
                                        </div>
                                        <div className='row pb-2'>
                                            <div className='col-3 d-flex align-items-center justify-content-end'>
                                                <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblQuantity")}</label>                                            
                                            </div>
                                            <div className='col-4'>
                                                <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onValueChanged={this.calcEntry.bind(this)} dt={{data:this.orderDt,field:"FACTOR"}}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                            <div className='col-1 d-flex align-items-center justify-content-center'>
                                                <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>X</label>                                            
                                            </div>
                                            <div className='col-4'>
                                                <NdNumberBox id="txtQuantity" parent={this} simple={true} maxLength={32}
                                                onValueChanged=
                                                {
                                                    this.calcEntry.bind(this)
                                                } 
                                                dt={{data:this.orderDt,field:"QUANTITY"}}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                        </div>
                                        <div className='row pb-2'>
                                            <div className='col-12'>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%"}} 
                                                onClick={this.addItem.bind(this)}>{this.t("lblAdd")}
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                         </PageContent>
                        <PageContent id={"Process"}>
                                <div className='row px-2'>
                                    <div className='col-12'>
                                        <div className='row pb-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdOutwasItems"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                headerFilter = {{visible:false}}
                                                height={'350'} 
                                                width={'100%'}
                                                dbApply={false}
                                                onRowRemoving={async (e)=>
                                                {
                                                    if(e.key.SHIPMENT_LINE_GUID != '00000000-0000-0000-0000-000000000000')
                                                    {
                                                        e.cancel = true
                                                        this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotDelete")}</div>)
                                                        await dialog(this.alertContent);
                                                        e.component.cancelEditData()
                                                    }
                                                }}
                                                onRowRemoved={async (e)=>
                                                {
                                                    if(this.docObj.docItems.dt().length == 0)
                                                    {
                                                        this.deleteAll()
                                                    }
                                                    else
                                                    {
                                                        await this.save()
                                                    }
                                                    
                                                }}
                                                onRowUpdated={async (e)=>
                                                {
                                                    await this.save()
                                                    
                                                }}
                                                >
                                                    <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                    <Scrolling mode="standart" />
                                                    <Paging defaultPageSize={10} />
                                                    {/* <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} /> */}
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                    <Column dataField="ITEM_NAME" caption={this.t("grdOutwasItems.clmItemName")} width={300} />
                                                    <Column dataField="QUANTITY" caption={this.t("grdOutwasItems.clmQuantity")} dataType={'number'} width={150}/>
                                                    <Column dataField="DESCRIPTION" caption={this.t("grdOutwasItems.clmDescription")} dataType={'string'} width={650} />
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}