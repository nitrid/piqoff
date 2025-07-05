import React from 'react';
import App from '../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls,quickDescCls } from '../../../core/cls/doc.js';
import {itemExpDateCls} from '../../../core/cls/items.js'
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

export default class expdateOperations extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:2,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.docObj = new docCls();
        this.expObj = new itemExpDateCls();
        this.itemDt = new datatable();    
        
        this.itemDt.selectCmd = 
        {
            query : "SELECT *,(SELECT [dbo].[FN_DEPOT_QUANTITY](GUID, @DEPOT_GUID,GETDATE())) AS DEPOT_QUANTITY FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE ) OR (@CODE = '')",
            param : ['CODE:string|25','DEPOT_GUID:string|50'],
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
            this.expObj.clearAll()

            
            this.dtDocDate.value = moment(new Date())
    
            
            await this.cmbDepot.dataRefresh({source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}});
            let tmpExpDate = {...this.expObj.empty}


            this.txtRef.value = this.user.CODE
            this.cmbDepot.value = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'cmbDepot'}).getValue().value
            this.dtDocDate.value = moment(new Date())
            this.lblExpDate.value = moment(new Date())
            this.txtRef.readOnly = false
            this.txtRefNo.readOnly = false
            this.cmbDepot.readOnly = false
            this.dtDocDate.readOnly = false    
            this.clearEntry();
    
            this.txtRef.props.onChange(tmpExpDate.REF)
            await this.grdExpDate.dataRefresh({source:this.expObj.dt('ITEM_EXPDATE')});

            
        }
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.lblQuantity.value = 0

    }

    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode,this.cmbDepot.value]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME
                this.lblDepotQuantity.value = this.itemDt[0].DEPOT_QUANTITY
                this.lblQuantity.value = 0
                this.txtBarcode.value = "" 
                this.lblQuantity.focus();

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
    async onClickBarcodeShortcut()
    {
        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.expObj.dt('ITEM_EXPDATE').length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    async addItem()
    {
        if(this.itemDt.length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        let prmRowMerge = this.param.filter({TYPE:1,USERS:this.user.CODE,ID:'rowMerge'}).getValue().value
        if(prmRowMerge > 0)
        {     
            let tmpFnMergeRow = async (i) =>
            {
                this.clearEntry()
                await this.save()
            }       

            for (let i = 0; i < this.expObj.dt().length; i++) 
            {
                if(this.expObj.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
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
        
        let tmpDocItems = {...this.expObj.empty}

        tmpDocItems.REF = this.txtRef.value
        tmpDocItems.REF_NO = this.txtRefNo.value
        tmpDocItems.DOC_DATE = this.dtDocDate.value
        tmpDocItems.DEPOT = this.cmbDepot.value
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM_GUID = this.itemDt[0].GUID
        tmpDocItems.QUANTITY = this.lblQuantity.value
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.EXP_DATE = this.lblExpDate.value


        this.expObj.addEmpty(tmpDocItems)
        this.clearEntry()
        await this.save()
        this.txtBarcode.focus();
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            if(this.expObj.dt().length > 0)
            {
                this.expObj.dt()[0].DESCRIPTION 
            }
            
            let tmpConfObj1 =
            {
                id:'msgSaveResult',showTitle:true,title:this.lang.t("msgSave.title"),showCloseButton:true,width:'350px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgSave.btn01"),location:'after'}],
            }
            
            if((await this.expObj.save()) == 0)
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

    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_10")} content=
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
                <div style={{position:'relative',top:'1px',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className="row px-2">
                            <div className="col-12">
                                    <div className='card modern-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '12px'
                                    }}>
                                        
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '4px',
                                                    display: 'block'
                                                }}>
                                                    🔖 {this.t("lblRef")}
                                                </label>
                                            <div className='row'>
                                                <div className='col-4'>
                                                        <div style={{position: 'relative'}}>
                                                <NdTextBox id="txtRef" parent={this} simple={true} readOnly={false} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                            style={{
                                                                borderRadius: '4px',
                                                                border: '1px solid #ced4da',
                                                                fontSize: '12px',
                                                                padding: '6px'
                                                            }}
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

                                                            if(tmpData.result.recordset.length > 0)
                                                            {
                                                                this.txtRefNo.value = tmpData.result.recordset[0].REF_NO
                                                            }
                                                        }
                                                        catch (error) 
                                                        {
                                                            console.log("Hata oluştu: ", error);
                                                        }
                                                        
                                                    }).bind(this)}
                                                    />
                                                        </div>
                                                </div>
                                                <div className='col-8'>
                                                        <div style={{position: 'relative'}}>
                                                <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={false} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                            style={{
                                                                borderRadius: '4px',
                                                                border: '1px solid #ced4da',
                                                                fontSize: '12px',
                                                                padding: '6px'
                                                            }}
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
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '4px',
                                                    display: 'block'
                                                }}>
                                                    📅 {this.t("lblDate")}
                                                </label>
                                                <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} 
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '6px'
                                                }}
                                                dt={{data:this.docObj.dt('DOC'),field:"DOC_DATE"}}/>
                                        </div>
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '4px',
                                                    display: 'block'
                                                }}>
                                                    🏭 {this.t("lblDepot")}
                                                </label>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot"
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '6px'
                                                }}
                                            dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"DEPOT"}}  
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            notRefresh = {true}
                                            //data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            param={this.param.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            access={this.access.filter({ELEMENT:'cmbDepot',USERS:this.user.CODE})}
                                            >
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className='row'>
                                        <div className='col-6'>
                                            <div className='card action-card mb-2' 
                                            style={{
                                                background: '#007bff',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(40,167,69,0.2)',
                                                border: 'none',
                                                height: '70px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                <div className='card-body text-center py-3' style={{padding: '16px'}}>
                                                    <i className={"fa-solid fa-barcode"} style={{color:'#ffffff', fontSize:'24px', marginBottom:'8px'}}></i>
                                                    <h6 className='text-white mb-0' style={{fontSize:'12px', fontWeight:'600'}}>
                                                        {this.lang.t("btnBarcodeEntry")}
                                                    </h6>
                                                    </div>
                                                </div>
                                        </div>
                                        <div className='col-6'>
                                            <div className='card action-card mb-2' 
                                            style={{
                                                background: '#28a745',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(40,167,69,0.2)',
                                                border: 'none',
                                                height: '70px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={this.onClickProcessShortcut.bind(this)}>
                                                <div className='card-body text-center py-3' style={{padding: '16px'}}>
                                                    <i className={"fa-solid fa-file-lines"} style={{color:'#ffffff', fontSize:'24px', marginBottom:'8px'}}></i>
                                                    <h6 className='text-white mb-0' style={{fontSize:'12px', fontWeight:'600'}}>
                                                        {this.lang.t("btnProcessLines")}
                                                    </h6>
                                                    </div>
                                                </div>
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
                                        {/* Barkod Giriş Kartı */}
                                        <div className='card entry-card mb-2' style={{
                                            background: '#ffffff',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #e9ecef',
                                            padding: '12px'
                                        }}>
                                                <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            style={{
                                                borderRadius: '6px',
                                                border: '1px solid #ced4da',
                                                fontSize: '14px',
                                                padding: '10px',
                                                backgroundColor: '#ffffff'
                                            }}
                                            placeholder={this.t("lblBarcode")}
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

                                        {/* Ürün Bilgileri */}
                                        <div className='card mb-2' style={{
                                            background: '#ffffff',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #e9ecef',
                                            padding: '12px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '8px'
                                            }}>
                                                <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                    📦 {this.t("lblItemName")}
                                                </span>
                                                <span style={{fontSize: '13px', color: '#6c757d'}}>
                                                    {this.t("lblDepotQuantity")}: <strong><NbLabel id="lblDepotQuantity" parent={this} value={0}/></strong>
                                                </span>
                                        </div>
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6',
                                                textAlign: 'center',
                                                minHeight: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <NbLabel id="lblItemName" parent={this} value={""} 
                                                style={{fontSize: '14px', fontWeight: '500', color: '#495057'}}/>
                                            </div>
                                        </div>

                                        {/* SKT Bilgileri */}
                                        <div className='card mb-2' style={{
                                            background: '#ffffff',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #e9ecef',
                                            padding: '12px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                    📅 {this.t("lblExpDateInfo")}
                                                </span>
                                            </div>
                                            
                                            {/* Miktar */}
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px'
                                            }}>
                                                <div className='row align-items-center'>
                                                    <div className='col-4'>
                                                        <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500', margin: 0}}>
                                                            🔢 {this.t("lblQuantity")}
                                                        </label>
                                                </div>
                                                    <div className='col-8'>
                                                    <NdNumberBox id="lblQuantity" parent={this} simple={true} maxLength={32}
                                                        style={{
                                                            borderRadius: '4px',
                                                            border: '2px solid #007bff',
                                                            fontSize: '13px',
                                                            textAlign: 'center',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                    onValueChanged={(async()=>
                                                    {

                                                    }).bind(this)}
                                                    onEnterKey={this.addItem.bind(this)}/>
                                                </div>
                                        </div>
                                            </div>

                                            {/* Son Kullanma Tarihi */}
                                            <div className='form-group' style={{
                                                background: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '6px'
                                            }}>
                                                <div className='row align-items-center'>
                                                    <div className='col-4'>
                                                        <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500', margin: 0}}>
                                                            📅 {this.t("lblExpDate")}
                                                        </label>
                                                    </div>
                                                    <div className='col-8'>
                                                        <NdDatePicker simple={true}  parent={this} id={"lblExpDate"}
                                                        style={{
                                                            borderRadius: '4px',
                                                            border: '1px solid #ced4da',
                                                            fontSize: '13px',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                        onValueChanged={(async()=>
                                                        {

                                                        }).bind(this)}
                                                        dt={{data:this.expObj.dt('ITEM_EXPDATE'),field:"EXP_DATE"}}
                                                        onEnterKey={this.addItem.bind(this)}
                                                        >
                                                        </NdDatePicker>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                        {/* Ekle Butonu */}
                                        <div className='card action-button' style={{
                                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(40,167,69,0.3)',
                                            border: 'none',
                                            overflow: 'hidden'
                                        }}>
                                            <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{
                                                height:"60px",
                                                width:"100%",
                                                background:"transparent",
                                                border:"none",
                                                color:"#ffffff",
                                                fontSize:"16px",
                                                fontWeight:"600"
                                            }} 
                                            onClick={this.addItem.bind(this)}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <i className="fa-solid fa-plus" style={{marginRight: '8px', fontSize: '16px'}}></i>
                                                    {this.t("lblAdd")}
                                                </div>
                                                </NbButton>
                                        </div>
                                    </div>
                                </div>
                         </PageContent>
                        <PageContent id={"Process"}>
                                <div className='row px-2'>
                                    <div className='col-12'>
                                        <div className='row pb-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdExpDate"} 
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
                                                }}
                                                onRowRemoved={async (e)=>
                                                {
                                                    if(this.expObj.dt().length == 0)
                                                    {
                                                        await this.save()
                                                        this.init()
                                                        this.pageView.activePage('Main')
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
                                                    <Column dataField="ITEM_NAME" caption={this.t("grdExpDate.clmItemName")} width={300} />
                                                    <Column dataField="ITEM_CODE" caption={this.t("grdExpDate.clmItemCode")} width={250}/>
                                                    <Column dataField="QUANTITY" caption={this.t("grdExpDate.clmQuantity")} dataType={'number'} width={150}/>
                                                    <Column dataField="EXP_DATE" caption={this.t("grdExpDate.clmExpDate")} dataType={'date'} width={250} />
                                                    <Column dataField="DESCRIPTION" caption={this.t("grdExpDate.clmDescription")} width={350}/>
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