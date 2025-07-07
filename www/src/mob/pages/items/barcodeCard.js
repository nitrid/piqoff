import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import {itemBarcodeCls} from '../../../core/cls/items'

import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button';
import Form, { Item } from 'devextreme-react/form';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdDatePicker from '../../../core/react/devex/datepicker';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdCheckBox  from '../../../core/react/devex/checkbox';
import NdNumberBox from '../../../core/react/devex/numberbox';
import NdPopUp from '../../../core/react/devex/popup';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class barcodeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.barcodeObj =  new itemBarcodeCls()
        this.itemDt = new datatable();
        this.unitDt = new datatable();


        this.itemDt.selectCmd = 
        {
            query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE) OR (@CODE = '')",
            param : ['CODE:string|25'],
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
    }
    async init()
    {
        this.clearEntry();
        this.itemDt.clear()
        this.unitDt.clear()
        this.barcodeObj.clearAll()
        this.cmbUnit.value = ''
        this.txtNewBarcode.value = ''
        await this.cmbUnit.dataRefresh({source : this.unitDt})

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.pageView.activePage('Main')
        this.init()
    }
    clearEntry()
    {
        this.itemDt.clear();
        this.unitDt.clear();
        this.cmbUnit.value = '';
        this.lblItemName.value = '';

    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            this.clearEntry();
            
            this.itemDt.selectCmd.value = [pCode]
            await this.itemDt.refresh();  
            
            if(this.itemDt.length > 0)
            {
                this.lblItemName.value = this.itemDt[0].NAME
                this.txtBarcode.value = ""
                this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                await this.unitDt.refresh();  

                if(this.unitDt.length > 0)
                {
                    this.cmbUnit.value = this.unitDt.where({TYPE:0})[0].GUID
                    this.txtBarUnitFactor.value = this.unitDt.where({TYPE:0})[0].FACTOR
                }
                if(this.itemDt[0].STATUS == false)
                {
                    document.getElementById("Sound2").play(); 
                    let tmpConfObj = 
                    {
                        id:'msgPassiveItem',showTitle:true,title:this.lang.t("msgPassiveItem.title"),showCloseButton:true,width:'350px',height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("msgPassiveItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPassiveItem.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPassiveItem.msg")}</div>)
                    }
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {  
                        let tmpQuery = 
                        {
                            query :"UPDATE ITEMS SET STATUS = 1 WHERE GUID = @GUID ",
                            param : ['GUID:string|50'],
                            value : [this.itemDt[0].GUID]
                        }

                        await this.core.sql.execute(tmpQuery) 
                    }
                }
                this.txtNewBarcode.focus();
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
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query :"SELECT BARCODE FROM ITEM_BARCODE WHERE BARCODE = @CODE",
                    param : ['CODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    resolve(2) //KAYIT VAR
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }   
    async barcodeSave()
    {

        if(this.itemDt.length == 0 || this.txtNewBarcode.value == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }
        let tmpBarcode = {...this.barcodeObj.empty}

        tmpBarcode.BARCODE = this.txtNewBarcode.value
        tmpBarcode.TYPE = this.cmbPopBarType.value
        tmpBarcode.UNIT_GUID = this.cmbUnit.value
        tmpBarcode.ITEM_GUID = this.itemDt[0].GUID

        this.barcodeObj.addEmpty(tmpBarcode);

        if((await this.barcodeObj.save()) == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgSave")}</div>)
            await dialog(this.alertContent);
            this.init()
        }
        else
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgNotSave")}</div>)
            await dialog(this.alertContent);
        }
        this.txtBarcode.focus()
    }
    render()
    {
        return(
            <div>
                <div>
                <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_03")} content=
                {[
                    {
                        name : 'Main',isBack : false,isTitle : true,
                        menu :
                        [
                        ]
                    },
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
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Barkod Arama Kartı */}
                                    <div className='card entry-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '4px'
                                    }}>
                                        <div className='card-header' style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '6px 6px 0 0',
                                            padding: '2px 4px',
                                            marginBottom: '2px',
                                            color: '#ffffff'
                                        }}>
                                            <h6 className='mb-0' style={{fontSize: '14px', fontWeight: '600'}}>
                                                🔍 {this.t("popItem.title")}
                                            </h6>
                                        </div>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            style={{
                                                borderRadius: '6px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '14px',
                                                padding: '4px'
                                            }}
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
                                    
                                    {/* Ürün Bilgi Kartı */}
                                    <div className='card product-info-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '4px'
                                    }}>
                                        <div className='card-header' style={{
                                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                            borderRadius: '6px',
                                            padding: '2px 4px',
                                            marginBottom: '2px',
                                            color: '#ffffff'
                                        }}>
                                            <h6 className='mb-0' style={{fontSize: '14px', fontWeight: '600'}}>
                                                📦 {this.t("lblItemInfo")}
                                            </h6>
                                        </div>
                                        <div className='product-name' style={{
                                            background: '#f8f9fa',
                                            borderRadius: '6px',
                                            padding: '4px',
                                            textAlign: 'center',
                                            minHeight: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <NbLabel id="lblItemName" parent={this} value={""} style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#495057'
                                            }}/>
                                        </div>
                                    </div>
                                    
                                    {/* Barkod Form Kartı */}
                                    <div className='card form-card mb-2' style={{
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #e9ecef',
                                        padding: '2px'
                                    }}>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '2px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    🏷️ {this.t("lblBarcode")}
                                                </label>
                                                <NdTextBox id="txtNewBarcode" parent={this} simple={true} maxLength={32}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '2px'
                                                }}
                                                onValueChanged={(e)=>
                                                {
                                                    if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                                    {
                                                        this.cmbPopBarType.value = "2"
                                                        return;
                                                    }
                                                    if(e.value.length == 8)
                                                    {                                            
                                                        this.cmbPopBarType.value = "0"
                                                    }
                                                    else if(e.value.length == 13)
                                                    {
                                                        this.cmbPopBarType.value = "1"
                                                    }
                                                    else
                                                    {
                                                        this.cmbPopBarType.value = "2"
                                                    }
                                                }}
                                                onChange={(async()=>
                                                {
                                                    let tmpResult = await this.checkBarcode(this.txtNewBarcode.value)
                                                    if(tmpResult == 2)
                                                    {
                                                        this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDblBarcode")}</div>)
                                                        await dialog(this.alertContent);
                                                        this.txtNewBarcode.value = "";
                                                        this.init()
                                                        return
                                                    }
                                                }).bind(this)} />
                                            </div>
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '2px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    🔢 {this.t("lblType")}
                                                </label>
                                                <NdSelectBox simple={true} parent={this} id="cmbPopBarType" displayExpr="VALUE"                       
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '2px'
                                                }}
                                                valueExpr="ID" value="0" data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}/>
                                            </div>
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '2px 4px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    📏 {this.t("lblUnit")}
                                                </label>
                                                <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '2px'
                                                }}
                                                dt={{data:this.orderDt,field:"UNIT"}}
                                                onValueChanged={(e)=>
                                                {
                                                    if(e.value != null && e.value != "")
                                                    {
                                                        let tmpFactor = this.unitDt.where({GUID:e.value});
                                                        if(tmpFactor.length > 0)
                                                        {
                                                            this.txtBarUnitFactor.value = tmpFactor[0].FACTOR
                                                        }
                                                    }
                                                }}/>
                                            </div>
                                            
                                            <div className='form-group mb-2' style={{
                                                background: '#f8f9fa',
                                                padding: '2px 4px',
                                                borderRadius: '6px',
                                                border: '1px solid #dee2e6'
                                            }}>
                                                <label className='form-label' style={{
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    color: '#6c757d',
                                                    marginBottom: '2px',
                                                    display: 'block'
                                                }}>
                                                    ⚖️ {this.t("lblFactor")}
                                                </label>
                                                <NdTextBox simple={true} parent={this} id="txtBarUnitFactor" readOnly={true}
                                                style={{
                                                    borderRadius: '4px',
                                                    border: '1px solid #ced4da',
                                                    fontSize: '12px',
                                                    padding: '2px',
                                                    backgroundColor: '#e9ecef'
                                                }}
                                                upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Kaydet Butonu */}
                                    <div className='card action-card' style={{
                                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onClick={(() =>
                                    {
                                        this.barcodeSave()
                                    }).bind(this)}>
                                        <div className='card-body text-center py-3' style={{padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'}}>
                                            <i className={"fa-solid fa-save"} style={{color:'#ffffff', fontSize:'24px'}}></i>
                                            <h6 className='text-white mb-0' style={{fontSize:'18px', fontWeight:'600', marginBottom: 0}}>
                                                {this.t("lblSave")}
                                            </h6>
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