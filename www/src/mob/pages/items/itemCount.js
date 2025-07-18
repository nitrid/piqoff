import React from 'react';
import App from '../../lib/app';
import { datatable } from '../../../core/core.js'
import { itemCountCls } from '../../../core/cls/count.js'

import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdDatePicker from '../../../core/react/devex/datepicker';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdNumberBox from '../../../core/react/devex/numberbox';
import NdGrid,{ Column, Editing, Paging, Scrolling, KeyboardNavigation } from '../../../core/react/devex/grid';
import { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';
export default class itemCount extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;

        this.countObj = new itemCountCls();
        this.itemDt = new datatable();
        this.unitDt = new datatable();
        this.countDt = new datatable();

        this.itemDt.selectCmd = 
        {
            query : `SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE) OR (@CODE = '')`,
            param : ['CODE:string|25'],
        }
        this.unitDt.selectCmd = 
        {
            query : `SELECT GUID,ID,NAME,SYMBOL,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID AND TYPE <> 1 ORDER BY TYPE ASC`,
            param : ['ITEM_GUID:string|50'],
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
        this.countObj.clearAll()
        this.countDt.clear();

        this.countDt.push({UNIT:"",FACTOR:0,QUANTITY:0})
        this.dtDocDate.value = moment(new Date())
        this.cmbDepot.value = '',

        await this.cmbDepot.dataRefresh({source:{select:{query : `SELECT * FROM DEPOT_VW_01`},sql:this.core.sql}});

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false
        this.cmbDepot.readOnly = false
        this.dtDocDate.readOnly = false

        this.clearEntry();

        this.txtRef.value = this.user.CODE
        this.txtRef.props.onChange(this.user.CODE)

        await this.grdList.dataRefresh({source:this.countObj.dt('ITEM_COUNT')});
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

        this.lblItemName.value = ""
        this.lblDepotQuantity.value = 0
        this.txtQuantity.value = 0
        this.cmbUnit.setData([])
    }
    async getDoc(pGuid,pRef,pRefno)
    {
        this.countObj.clearAll()
        await this.countObj.load({GUID:pGuid,REF:pRef,REF_NO:pRefno});
        
        this.txtRef.readOnly = true
        this.txtRefNo.readOnly = true
        this.cmbDepot.readOnly = true
        this.dtDocDate.readOnly = true
        this.txtTotalLine.value = this.countObj.dt().length
        this.txtTotalCount.value = this.countObj.dt().sum("QUANTITY",3)
    }
    getItem(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode.replace(/^\s+/, '').replace(/\s+$/, '') == '')
            {
                this.txtBarcode.value = ''
                resolve();
                return
            }
            else
            {
                this.clearEntry();
            
                this.itemDt.selectCmd.value = [pCode]
                await this.itemDt.refresh();  
                
                if(this.itemDt.length > 0)
                {
                    this.lblItemName.value = this.itemDt[0].NAME
    
                    this.unitDt.selectCmd.value = [this.itemDt[0].GUID]
                    await this.unitDt.refresh()
                    this.cmbUnit.setData(this.unitDt)
    
                    if(this.unitDt.length > 0)
                    {
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
            }
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
                let tmpQuantity = this.countDt[0].QUANTITY * this.countDt[0].FACTOR
                this.countObj.dt()[i].QUANTITY = this.countObj.dt()[i].QUANTITY + tmpQuantity
                this.clearEntry()
                await this.save()
            }

            for (let i = 0; i < this.countObj.dt().length; i++) 
            {
                if(this.countObj.dt()[i].ITEM_CODE == this.itemDt[0].CODE)
                {
                    if(prmRowMerge == 2)
                    {
                        document.getElementById("Sound2").play(); 

                        let tmpConfObj = 
                        {
                            id:'msgCombineItem',showTitle:true,title:this.lang.t("msgCombineItem.title"),showCloseButton:true,width:'350px',height:'auto',
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

        let tmpDocItems = {...this.countObj.empty}

        tmpDocItems.REF = this.txtRef.value
        tmpDocItems.REF_NO = this.txtRefNo.value
        tmpDocItems.ITEM_NAME = this.itemDt[0].NAME
        tmpDocItems.ITEM_CODE = this.itemDt[0].CODE
        tmpDocItems.ITEM = this.itemDt[0].GUID
        tmpDocItems.LINE_NO = this.countObj.dt().length
        tmpDocItems.DEPOT = this.cmbDepot.value
        tmpDocItems.DOC_DATE = this.dtDocDate.value
        tmpDocItems.QUANTITY = this.countDt[0].QUANTITY * this.countDt[0].FACTOR

        this.countObj.addEmpty(tmpDocItems)
        this.clearEntry()

        await this.save()
    }
    async save()
    {
        return new Promise(async resolve => 
        {
            if((await this.countObj.save()) == 0)
            {
                this.txtTotalLine.value = this.countObj.dt().length
                this.txtTotalCount.value = this.countObj.dt().sum("QUANTITY",3)
            }
            else
            {
                this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgNotSave")}</div>)
                await dialog(this.alertContent);
            }

            this.txtBarcode.focus()
            resolve()
        })
    }
    async deleteAll()
    {
        let tmpDelete = {...this.countObj.dt('ITEM_COUNT')}

        for (let i = 0; i < tmpDelete.length; i++) 
        {
            this.countObj.dt('ITEM_COUNT').removeAt(0)
        }

        await this.countObj.dt('ITEM_COUNT').delete();
        
        this.init(); 
        this.pageView.activePage('Main')
    }
    async onClickBarcodeShortcut()
    {
        if(this.cmbDepot.value == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgDepot")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Entry')
    }
    async onClickProcessShortcut()
    {
        if(this.countObj.dt("ITEM_COUNT").length == 0)
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgProcess")}</div>)
            await dialog(this.alertContent);
            return
        }

        this.pageView.activePage('Process')
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_05")} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :
                            [
                                {
                                    icon : "fa-file",
                                    text : this.lang.t("btnNewDoc"),
                                    onClick : ()=>{this.init()}
                                },
                                {
                                    icon : "fa-trash",
                                    text : this.lang.t("btnDocDelete"),
                                    onClick : ()=>
                                    {
                                        if(this.countObj.dt().length > 0)
                                        {
                                            this.deleteAll();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            menu :[],
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
                <div style={{position:'relative',top:'5px',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} onActivePage={(e)=>{this.pageBar.activePage(e)}}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div className='card-body' style={{padding: '0'}}>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '4px',display: 'block'}}>
                                                    🔖 {this.t("lblRef")}
                                                </label>
                                                <div className='row'>
                                                    <div className='col-4'>
                                                        <div style={{position: 'relative'}}>
                                                            <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.countObj.dt(),field:"REF"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '6px'}}
                                                            onChange={(async(e)=>
                                                            {
                                                                try 
                                                                {
                                                                    let tmpQuery = 
                                                                    {
                                                                        query : `SELECT ISNULL(MAX(REF_NO) + 1,1) AS REF_NO FROM ITEM_COUNT WHERE REF = @REF `,
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
                                                            <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.countObj.dt(),field:"REF_NO"}}
                                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '6px'}}
                                                            button={[
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
                                                            data = 
                                                            {{
                                                                source:
                                                                {
                                                                    select:
                                                                    {
                                                                        query : `SELECT REF,REF_NO,CONVERT(NVARCHAR,DOC_DATE,104) AS DOC_DATE,DEPOT_NAME,
                                                                                SUM(QUANTITY) AS QUANTITY,COUNT(REF) AS TOTAL_LINE 
                                                                                FROM ITEM_COUNT_VW_01 GROUP BY REF,REF_NO,DOC_DATE,DEPOT_NAME ORDER BY DOC_DATE DESC`
                                                                    },
                                                                    sql:this.core.sql
                                                                }
                                                            }}
                                                            >
                                                                <Column dataField="REF" caption={this.t("popDoc.clmRef")} width={120} />
                                                                <Column dataField="REF_NO" caption={this.t("popDoc.clmRefNo")} width={100}  />
                                                                <Column dataField="DEPOT_NAME" caption={this.t("popDoc.clmDepotName")} width={100}  />
                                                                <Column dataField="DOC_DATE" caption={this.t("popDoc.clmDocDate")} width={200}  />
                                                                <Column dataField="TOTAL_LINE" caption={this.t("popDoc.clmTotalLine")} width={200}  />
                                                                <Column dataField="QUANTITY" caption={this.t("popDoc.clmQuantity")} width={200}  />
                                                            </NdPopGrid>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '4px',display: 'block'}}>
                                                    🏭 {this.t("lblDepot")}
                                                </label>
                                                <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={false}
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '6px'}}
                                                dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DEPOT"}}/>
                                            </div>
                                            <div className='form-group mb-2' style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                                <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '4px',display: 'block'}}>
                                                    📅 {this.t("lblDate")}
                                                </label>
                                                <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"} 
                                                style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',padding: '6px'}}
                                                dt={{data:this.countObj.dt('ITEM_COUNT'),field:"DOC_DATE"}}/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className='row pb-1'>
                                        <div className='col-6 pe-1'>
                                            <div className='card action-card' style={{background: '#007bff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,123,255,0.2)',border: 'none',height: '70px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.onClickBarcodeShortcut.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-barcode"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnBarcodeEntry")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                        <div className='col-6 ps-1'>
                                            <div className='card action-card' style={{background: '#28a745',borderRadius: '8px',boxShadow: '0 2px 8px rgba(40,167,69,0.2)',border: 'none',height: '70px',transition: 'all 0.3s ease'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" style={{height:"100%",width:"100%",background:"transparent",border:"none"}} 
                                                onClick={this.onClickProcessShortcut.bind(this)}>
                                                    <div className='d-flex align-items-center justify-content-center h-100'>
                                                        <div className='text-center'>
                                                            <i className={"fa-solid fa-file-lines"} style={{color:'#ffffff',fontSize:'18px',marginBottom:'4px'}}></i>
                                                            <div style={{color:'#ffffff',fontSize:'12px',fontWeight:'600'}}>{this.lang.t("btnProcessLines")}</div>
                                                        </div>
                                                    </div>
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Entry"} onActive={()=>{this.txtBarcode.focus()}}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    {/* Barkod Giriş Kartı */}
                                    <div className='card entry-card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                        style={{borderRadius: '6px',border: '1px solid #ced4da',fontSize: '14px',padding: '10px',backgroundColor: '#ffffff'}}
                                        placeholder={this.t("lblBarcode")}
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
                                        ]}/>
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
                                    {/* Ürün Bilgileri */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center',marginBottom: '8px'}}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                📦 {this.t("lblItemName")}
                                            </span>
                                            <span style={{fontSize: '13px', color: '#6c757d'}}>
                                                {this.t("lblDepotQuantity")}: <strong><NbLabel id="lblDepotQuantity" parent={this} value={0}/></strong>
                                            </span>
                                        </div>
                                        <div style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px',border: '1px solid #dee2e6',textAlign: 'center',minHeight: '40px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                                            <NbLabel id="lblItemName" parent={this} value={""} style={{fontSize: '14px', fontWeight: '500', color: '#495057'}}/>
                                        </div>
                                    </div>
                                    {/* Miktar ve Birim */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        {/* Birim */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblUnit")}</label>
                                            </div>
                                            <div className='col-8'>
                                                <NdSelectBox simple={true} parent={this} id="cmbUnit" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={true}
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', fontSize: '13px'}}
                                                dt={{data:this.countDt,field:"UNIT"}}
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
                                        {/* Miktar */}
                                        <div className='row mb-2'>
                                            <div className='col-4'>
                                                <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500'}}>{this.t("lblQuantity")}</label>
                                            </div>
                                            <div className='col-3'>
                                                <NdTextBox id="txtFactor" parent={this} simple={true} maxLength={32} readOnly={true} onValueChanged={this.calcEntry.bind(this)} dt={{data:this.countDt,field:"FACTOR"}}
                                                style={{borderRadius: '6px', border: '1px solid #ced4da', textAlign: 'center', fontSize: '13px'}}
                                                onEnterKey={this.addItem.bind(this)}/>
                                            </div>
                                            <div className='col-2 d-flex align-items-center justify-content-center'>
                                                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#6c757d'}}>×</span>
                                            </div>
                                            <div className='col-3'>
                                                <NdNumberBox id="txtQuantity" parent={this} simple={true} maxLength={32} onValueChanged={this.calcEntry.bind(this)} dt={{data:this.countDt,field:"QUANTITY"}}
                                                style={{borderRadius: '6px', border: '2px solid #007bff', textAlign: 'center', fontSize: '13px'}}
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
                                    {/* Sayım Listesi */}
                                    <div className='card mb-2' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div style={{display: 'flex',alignItems: 'center',marginBottom: '12px'}}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                📋 {this.t("grdList.title")}
                                            </span>
                                        </div>
                                        <NdGrid parent={this} id={"grdList"} 
                                        showBorders={true} 
                                        columnsAutoWidth={true} 
                                        allowColumnReordering={true} 
                                        allowColumnResizing={true} 
                                        headerFilter = {{visible:false}}
                                        height={'350'} 
                                        width={'100%'}
                                        dbApply={false}
                                        style={{borderRadius: '6px',overflow: 'hidden',border: '1px solid #dee2e6'}}
                                        onRowRemoved={async (e)=>
                                        {
                                            if(this.countObj.dt().length == 0)
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
                                            <Column dataField="ITEM_NAME" caption={this.t("grdList.clmItemName")} width={150} />
                                            <Column dataField="QUANTITY" caption={this.t("grdList.clmQuantity")} dataType={'number'} width={40}/>
                                        </NdGrid>
                                    </div>
                                    {/* Toplam Bilgileri */}
                                    <div className='card' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '12px'}}>
                                        <div style={{display: 'flex',alignItems: 'center',marginBottom: '12px'}}>
                                            <span style={{fontSize: '14px', fontWeight: '600', color: '#495057'}}>
                                                📊 Toplam Bilgileri
                                            </span>
                                        </div>
                                        <div className='form-group' style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px',marginBottom: '8px'}}>
                                            <div className='row align-items-center'>
                                                <div className='col-8'>
                                                    <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500', margin: 0}}>
                                                        📝 {this.t("lblTotalLine")}
                                                    </label>
                                                </div>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtTotalLine" parent={this} simple={true} readOnly={true} maxLength={32}
                                                    style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',textAlign: 'center',backgroundColor: '#ffffff'}}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='form-group' style={{background: '#f8f9fa',padding: '10px',borderRadius: '6px'}}>
                                            <div className='row align-items-center'>
                                                <div className='col-8'>
                                                    <label style={{fontSize: '12px', color: '#6c757d', fontWeight: '500', margin: 0}}>
                                                        🔢 {this.t("lblTotalCount")}
                                                    </label>
                                                </div>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtTotalCount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                    style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '12px',textAlign: 'center',backgroundColor: '#ffffff'}}/>
                                                </div>
                                            </div>
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