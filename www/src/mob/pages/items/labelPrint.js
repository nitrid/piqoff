import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import { labelCls,labelMainCls} from '../../../core/cls/label.js'

import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdCheckBox  from '../../../core/react/devex/checkbox';
import NdNumberBox from '../../../core/react/devex/numberbox';
import NdGrid,{Column, Editing, Paging, Scrolling, KeyboardNavigation } from '../../../core/react/devex/grid';
import { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
export default class labelPrint extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.lblObj = new labelCls();
        this.mainLblObj = new labelMainCls()
        this.itemDt = new datatable();
        this.pageCount = 0;

        this.itemDt.selectCmd = 
        {
            query : `SELECT *, 
                    CASE WHEN UNDER_UNIT_VALUE = 0 
                    THEN 0 
                    ELSE 
                    ROUND((PRICE / UNDER_UNIT_VALUE),2) 
                    END AS UNDER_UNIT_PRICE
                    FROM (SELECT ITEMS.GUID, 
                    ITEM_BARCODE.CDATE, 
                    ISNULL((SELECT TOP 1 CODE FROM ITEM_MULTICODE WHERE ITEM = ITEMS.GUID ORDER BY LDATE DESC),ITEMS.CODE) AS MULTICODE, 
                    ISNULL((SELECT NAME FROM COUNTRY WHERE COUNTRY.CODE = ITEMS.ORGINS),'') AS ORGINS, 
                    ITEMS.CODE, 
                    ITEMS.NAME, 
                    ITEM_BARCODE.BARCODE, 
                    ITEMS.MAIN_GRP AS ITEM_GRP, 
                    ITEMS.MAIN_GRP_NAME AS ITEM_GRP_NAME, 
                    ISNULL((SELECT TOP 1 CUSTOMER_NAME FROM ITEM_MULTICODE_VW_01 WHERE ITEM_GUID = ITEMS.GUID),'') AS CUSTOMER_NAME, 
                    (SELECT [dbo].[FN_PRICE](ITEMS.GUID,ISNULL(ITEM_BARCODE.UNIT_FACTOR,1),dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)) * ISNULL(ITEM_BARCODE.UNIT_FACTOR,1) AS PRICE, 
                    ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT WHERE TYPE = 1 AND ITEM_UNIT.ITEM = ITEMS.GUID),0) AS UNDER_UNIT_VALUE, 
                    ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE TYPE = 1 AND ITEM_UNIT_VW_01.ITEM_GUID = ITEMS.GUID),0) AS UNDER_UNIT_SYMBOL 
                    FROM ITEMS_VW_01 AS ITEMS LEFT OUTER  JOIN ITEM_BARCODE_VW_01 AS ITEM_BARCODE ON ITEMS.GUID = ITEM_BARCODE.ITEM_GUID  
                    WHERE ((ITEMS.CODE = @CODE) OR (ITEM_BARCODE.BARCODE = @CODE)) AND ITEMS.STATUS = 1 
                    ) AS TMP ORDER BY CDATE DESC`,
            param : ['CODE:string|50'],
        }

        this.alertContent = 
        {
            id:'msgAlert',showTitle:true,title:this.t("msgAlert.title"),showCloseButton:true,width:'90%',height:'auto',
            button:[{id:"btn01",caption:this.t("msgAlert.btn01"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}></div>)
        }
    }
    async init()
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll();

        let tmpLbl = {...this.lblObj.empty}
        tmpLbl.REF = this.user.NAME
        this.mainLblObj.addEmpty(tmpLbl);

        this.cmbDesing.value = '',
        this.chkAutoAdd.value = this.param.filter({TYPE:2,USERS:this.user.CODE,ELEMENT:'chkAutoAdd'}).getValue().value

        await this.cmbDesing.dataRefresh({source:{select:{query:`SELECT TAG,DESIGN_NAME,PAGE_COUNT FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '01'`},sql:this.core.sql}});

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false

        this.clearEntry();

        this.txtRef.value = this.user.CODE
        this.txtRef.props.onChange(this.user.CODE)

        await this.grdList.dataRefresh({source:this.lblObj.dt()});
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

        if(this.chkAutoAdd.value != true)
        {
            this.lblItemName.value = ""
            this.txtPrice.value = 0
        }
        this.txtPrice.value = 0
    }
    async getDoc(pGuid)
    {
        this.lblObj.clearAll()
        this.mainLblObj.clearAll()

        await this.lblObj.load({GUID:pGuid});
        await this.mainLblObj.load({GUID:pGuid});

        for (let i = 0; i < this.cmbDesing.data.datatable.length; i++) 
        {
            if(this.cmbDesing.data.datatable[i].TAG == this.mainLblObj.dt()[0].DESING)
            {
                this.pageCount = this.cmbDesing.data.datatable[i].PAGE_COUNT
            }
        }

        this.calculateCount()
        this.txtRef.readOnly = true
        this.txtRefNo.readOnly = true
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
                this.txtPrice.value = this.itemDt[0].PRICE
                this.txtBarcode.value = ""

                if(this.itemDt[0].STATUS == false)
                {
                    document.getElementById("Sound2").play(); 

                    let tmpConfObj = 
                    {
                        id:'msgPassiveItem',showTitle:true,title:this.lang.t("msgPassiveItem.title"),showCloseButton:true,width:'350px',height:'auto',
                        button:[{id:"btn01",caption:this.lang.t("msgPassiveItem.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgPassiveItem.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPassiveItem.msg")}</div>)
                    }

                    let pResult = await dialog(tmpConfObj);
                    
                    if(pResult == 'btn01')
                    {  
                        let tmpQuery = 
                        {
                            query : `UPDATE ITEMS SET STATUS = 1 WHERE GUID = @GUID `,
                            param : ['GUID:string|50'],
                            value : [this.itemDt[0].GUID]
                        }

                        await this.core.sql.execute(tmpQuery) 
                    }
                }

                if(this.txtPrice.value == 0)
                {
                    document.getElementById("Sound").play(); 
                    return
                }

                if(this.chkAutoAdd.value == true)
                {
                    this.addItem()
                }
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
            for (let i = 0; i < this.lblObj.dt().length; i++) 
            {
                if(this.lblObj.dt()[i].CODE == this.itemDt[0].CODE)
                {
                    document.getElementById("Sound2").play(); 

                    let tmpConfObj = 
                    {
                        id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'auto',
                        button:[{id:"btn03",caption:this.lang.t("msgCombineItem.btn03"),location:'before'},{id:"btn02",caption:this.lang.t("msgCombineItem.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgCombineItem.msg")}</div>)
                    }

                    let pResult = await dialog(tmpConfObj);
                    
                    if(pResult == 'btn03')
                    {                   
                        return
                    }
                    else
                    {
                        break
                    }
                }
            }
        }

        let tmpDocItems = {...this.lblObj.empty}

        tmpDocItems.REF = this.txtRef.value
        tmpDocItems.REF_NO = this.txtRefNo.value
        tmpDocItems.NAME = this.itemDt[0].NAME
        tmpDocItems.CODE = this.itemDt[0].CODE
        tmpDocItems.BARCODE = this.itemDt[0].BARCODE
        tmpDocItems.PRICE = this.txtPrice.value
        tmpDocItems.MULTICODE = this.itemDt[0].MULTICODE
        tmpDocItems.ITEM_GRP = this.itemDt[0].ITEM_GRP
        tmpDocItems.ITEM_GRP_NAME = this.itemDt[0].ITEM_GRP_NAME
        tmpDocItems.CUSTOMER_NAME = this.itemDt[0].CUSTOMER_NAME
        tmpDocItems.UNDER_UNIT_VALUE = this.itemDt[0].UNDER_UNIT_VALUE
        tmpDocItems.UNDER_UNIT_PRICE = this.itemDt[0].UNDER_UNIT_PRICE
        tmpDocItems.UNDER_UNIT_SYMBOL = this.itemDt[0].UNDER_UNIT_SYMBOL
        tmpDocItems.ORGINS = this.itemDt[0].ORGINS

        this.lblObj.addEmpty(tmpDocItems)
        this.clearEntry()

        await this.save()
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            let Data = {data:this.lblObj.dt().toArray()}

            this.mainLblObj.dt()[0].DATA = JSON.stringify(Data)
            await this.mainLblObj.save()
            
            if((await this.mainLblObj.save()) == 0)
            {
                this.txtBarcode.focus()
                this.calculateCount()
            }
            else
            {
                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgNotSave")}</div>)
                await dialog(this.alertContent);
            }
            resolve()
        })
    }
    async deleteAll()
    {
        let tmpDelete = {...this.lblObj.dt()}

        for (let i = 0; i < tmpDelete.length; i++) 
        {
            this.lblObj.dt().removeAt(0)
        }

        await this.lblObj.dt().delete();
        
        this.init(); 
        this.pageView.activePage('Main')
    }
    async onClickBarcodeShortcut()
    {
        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.lblObj.dt().length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    async getDocs(pType)
    {
        let tmpQuery = 
        {
            query : `SELECT GUID,REF,REF_NO FROM LABEL_QUEUE WHERE STATUS IN("+pType+") AND REF <> 'SPECIAL'`
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        let tmpRows = []
        
        if(tmpData.result.recordset.length > 0)
        {
            tmpRows = tmpData.result.recordset
        }
        
        await this.popDoc.setData(tmpRows)
        
        this.popDoc.show()
        this.popDoc.onClick = (data) =>
        {
            if(data.length > 0)
            {
                this.getDoc(data[0].GUID)
            }
        }
    }
    calculateCount()
    {
        this.txtPageCount.value = Math.ceil(this.lblObj.dt().length /this.pageCount)
        this.txtFreeLabel.value = this.pageCount - (this.lblObj.dt().length % this.pageCount)
        this.txtLine.value = this.lblObj.dt().length
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_06")} content=
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
                                        if(this.lblObj.dt().length > 0)
                                        {
                                            this.deleteAll();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            menu : [],
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
                    <PageView id={"pageView"} parent={this} onActivePage={(e)=>{this.pageBar.activePage(e)}}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6x'}}>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    🔖 {this.t("lblRef")}
                                                </label>
                                                <div className='row'>
                                                    <div className='col-4'>
                                                        <div style={{position: 'relative'}}>
                                                            <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.mainLblObj.dt(),field:"REF"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px'}}
                                                            onChange={(async(e)=>
                                                            {
                                                                try 
                                                                {
                                                                    let tmpQuery = 
                                                                    {
                                                                        query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM LABEL_QUEUE WHERE  REF = @REF `,
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
                                                            <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.mainLblObj.dt(),field:"REF_NO"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px'}}
                                                            button={[
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
                                                                        this.txtRefNo.value = Math.floor(Date.now() / 1000)
                                                                    }
                                                                }
                                                            ]}/>
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
                                                            button=
                                                            {
                                                                [
                                                                    {
                                                                        id:'01',
                                                                        icon:'more',
                                                                        onClick:()=>
                                                                        {
                                                                            this.popDoc.hide()
                                                                            this.getDocs('0,1')
                                                                        }
                                                                    }
                                                                ]
                                                                
                                                            }
                                                            >
                                                                <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                                <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                            </NdPopGrid>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    🎨 {this.t("lblDesing")}
                                                </label>
                                                <NdSelectBox simple={true} parent={this} id="cmbDesing" notRefresh = {true} displayExpr="DESIGN_NAME" valueExpr="TAG" value="" searchEnabled={false}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px'}}
                                                dt={{data:this.mainLblObj.dt('MAIN_LABEL_QUEUE'),field:"DESING"}}
                                                onValueChanged={(async(e)=>
                                                {
                                                    for (let i = 0; i < this.cmbDesing.data.datatable.length; i++) 
                                                    {
                                                        if(this.cmbDesing.data.datatable[i].TAG == e.value)
                                                        {
                                                            this.pageCount = this.cmbDesing.data.datatable[i].PAGE_COUNT
                                                        }
                                                    }
                                                    this.calculateCount()
                                                }).bind(this)}
                                                />
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    📄 {this.t("lblPageCount")}
                                                </label>
                                                <NdTextBox id="txtPageCount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px',backgroundColor: '#e9ecef'}}/>
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    🏷️ {this.t("lblFreeLabel")}
                                                </label>
                                                <NdTextBox id="txtFreeLabel" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px',backgroundColor: '#e9ecef'}}/>
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                    📏 {this.t("lblLine")}
                                                </label>
                                                <NdTextBox id="txtLine" parent={this} simple={true} readOnly={true} maxLength={32}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '4px',backgroundColor: '#e9ecef'}}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className='row'>
                                        <div className='col-6 pe-1'>
                                            <div className='card action-card mb-2' 
                                            style={{background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',borderRadius: '8px',boxShadow: '0 4px 12px rgba(0,123,255,0.3)',border: 'none',cursor: 'pointer',transition: 'all 0.3s ease',height: '70px'}}
                                            onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                <div className='card-body text-center d-flex flex-column justify-content-center align-items-center h-100' style={{padding: '12px'}}>
                                                    <i className={"fa-solid fa-barcode"} style={{color:'#ffffff', fontSize:'20px', marginBottom:'4px'}}></i>
                                                    <h6 className='text-white mb-0' style={{fontSize:'11px', fontWeight:'600'}}>
                                                        {this.lang.t("btnBarcodeEntry")}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-6 ps-1'>
                                            <div className='card action-card mb-2' 
                                            style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',borderRadius: '8px',boxShadow: '0 4px 12px rgba(40,167,69,0.3)',border: 'none',cursor: 'pointer',transition: 'all 0.3s ease',height: '70px'}}
                                            onClick={this.onClickProcessShortcut.bind(this)}>
                                                <div className='card-body text-center d-flex flex-column justify-content-center align-items-center h-100' style={{padding: '12px'}}>
                                                    <i className={"fa-solid fa-file-lines"} style={{color:'#ffffff', fontSize:'20px', marginBottom:'4px'}}></i>
                                                    <h6 className='text-white mb-0' style={{fontSize:'11px', fontWeight:'600'}}>
                                                        {this.lang.t("btnProcessLines")}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Entry"} onActive={()=>{this.txtBarcode.focus()}}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-3' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div className='card-header' style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',borderRadius: '6px',padding: '12px',marginBottom: '6px',border: 'none'}}>
                                            <h6 className='text-white mb-0' style={{fontSize:'14px', fontWeight:'600'}}>
                                                🏷️ {this.t("lblPrintInfo")}
                                            </h6>
                                        </div>
                                        <div className='form-group mb-3' style={{background: '#f8f9fa',padding: '12px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                            <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '2px',display: 'block'}}>
                                                📦 {this.t("lblBarcode")}
                                            </label>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '14px',padding: '4px',backgroundColor: '#ffffff'}}
                                            onKeyUp={(async(e)=>
                                            {
                                                if(e.event.key == 'Enter')
                                                {
                                                    await this.getItem(this.txtBarcode.value)
                                                }
                                            }).bind(this)}
                                            button={[
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
                                            ]}>
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
                                                        query : `SELECT CODE,NAME FROM ITEMS_VW_01 
                                                                WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL))`,
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
                                        <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '4px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                            <div className='row align-items-center'>
                                                <div className='col-8'>
                                                    <span style={{fontSize: '12px', color: '#6c757d'}}>⚡ Otomatik Ekleme</span>
                                                </div>
                                                <div className='col-4 text-end'>
                                                    <NdCheckBox id="chkAutoAdd" text={this.t("lblAutoAdd")} parent={this} value={true} defaultValue={true} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ürün Bilgileri */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',marginBottom: '8px'}}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                🏷️ {this.t("lblItemName")}
                                            </span>
                                        </div>
                                        <div style={{background: '#f8f9fa',padding: '6px',borderRadius: '6px',border: '1px solid #dee2e6',textAlign: 'center',minHeight: '40px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                                            <NbLabel id="lblItemName" parent={this} value={""} style={{fontSize: '14px', fontWeight: '500', color: '#495057'}}/>
                                        </div>
                                    </div>
                                    {/* Fiyat */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '6px'}}>
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblPrice")}</label>
                                            </div>
                                            <div className='col-8'>
                                                <NdNumberBox id="txtPrice" parent={this} simple={true} maxLength={32} 
                                                style={{borderRadius: '6px', border: '2px solid #007bff', fontSize: '13px', textAlign: 'center'}}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ekle Butonu */}
                                    <div className='card action-button' style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',borderRadius: '8px',boxShadow: '0 4px 12px rgba(40,167,69,0.3)',border: 'none',overflow: 'hidden'}}>
                                        <NbButton className="form-group btn btn-primary btn-purple btn-block" 
                                        style={{height:"60px",width:"100%",background:"transparent",border:"none",color:"#ffffff",fontSize:"16px",fontWeight:"600"}} 
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
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            headerFilter = {{visible:false}}
                                            height={'350'} 
                                            width={'100%'}
                                            dbApply={false}
                                            onRowRemoved={async (e)=>
                                            {
                                                if(this.lblObj.dt().length == 0)
                                                {
                                                    this.deleteAll()
                                                }
                                                else
                                                {
                                                    await this.save()
                                                }
                                            }}
                                            onRowUpdating={async (e)=>
                                            {
                                                if(e.key.LOCKED != 0)
                                                {
                                                    e.cancel = true
                                                    this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgRowNotUpdate")}</div>)
                                                    await dialog(this.alertContent);
                                                    e.component.cancelEditData()
                                                }
                                            }}
                                            onRowUpdated={async(e)=>
                                            {
                                                await this.save()
                                            }}
                                            >
                                                <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'row'} />
                                                <Scrolling mode="standart" />
                                                <Paging defaultPageSize={10} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                <Column dataField="BARCODE" caption={this.t("grdList.clmBarcode")} width={150} />
                                                <Column dataField="NAME" caption={this.t("grdList.clmName")} width={150} />
                                                <Column dataField="PRICE" caption={this.t("grdList.clmPrice")}  width={100}/>
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