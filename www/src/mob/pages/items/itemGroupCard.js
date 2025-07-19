import React from 'react';
import App from '../../lib/app';
import { datatable } from '../../../core/core.js'

import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdCheckBox  from '../../../core/react/devex/checkbox';
import { Column } from '../../../core/react/devex/grid';
import { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
export default class itemGroupCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.itemDt = new datatable();

        this.itemDt.selectCmd = 
        {
            query : `SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE ) OR (@CODE = '')`,
            param : ['CODE:string|25'],
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
        this.clearEntry();
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
        this.lblItemGroup.value = "";
        this.lblItemName.value = "";
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
                this.lblItemGroup.value = this.itemDt[0].MAIN_GRP_NAME

                if(this.chkAutoAdd.value == true)
                {
                    this.grpSave()
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
    async grpSave()
    {
        if(this.itemDt.length == 0 || this.cmbGroup.value == '')
        {
            this.alertContent.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgAlert.msgBarcodeCheck")}</div>)
            await dialog(this.alertContent);
            return
        }

        let tmpQuery = 
        {
            query : `UPDATE ITEMS_GRP SET MAIN_GUID = @MAIN WHERE ITEM = @ITEM`,
            param : ['MAIN:string|50','ITEM:string|50'],
            value : [this.cmbGroup.value,this.itemDt[0].GUID]
        }

        await this.core.sql.execute(tmpQuery)

        this.txtBarcode.focus()
        this.clearEntry()
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_04")} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :[]
                        },
                    ]}
                    onBackClick={()=>{this.pageView.activePage('Main')}}/>
                </div>
                <div style={{position:'relative',top:'5px',height:'calc(100vh - 1px)',overflow:'hidden'}}>
                    <PageView id={"pageView"} parent={this} onActivePage={(e)=>{this.pageBar.activePage(e)}}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='card modern-card mb-3' style={{background: '#ffffff',borderRadius: '8px',boxShadow: '0 2px 8px rgba(0,0,0,0.06)',border: '1px solid #e9ecef',padding: '16px'}}>
                                        <div className='form-group mb-3' style={{background: '#f8f9fa',padding: '12px',borderRadius: '6px',border: '1px solid #dee2e6'}}>
                                            <label className='form-label' style={{fontSize: '12px',fontWeight: '500',color: '#6c757d',marginBottom: '6px',display: 'block'}}>
                                                📦 {this.t("lblBarcode")} 
                                            </label>
                                            <NdTextBox id="txtBarcode" parent={this} simple={true} maxLength={32}
                                            style={{borderRadius: '4px',border: '1px solid #ced4da',fontSize: '14px',padding: '8px',backgroundColor: '#ffffff'}}
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
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-8 d-flex align-items-center justify-content-end'>
                                                                                     
                                        </div>
                                        <div className='col-4'>
                                            <NdCheckBox id="chkAutoAdd" text={this.t("lblAutoAdd")} parent={this} value={false} defaultValue={false} />
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <h6 style={{height:'30px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <h6 style={{height:'30px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemGroup" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>{this.t("lblGroup")}</div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbGroup" notRefresh = {true} displayExpr="NAME" valueExpr="GUID" value="" searchEnabled={false}
                                             data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}/>
                                        </div>
                                    </div>
                                    <div className="row p-1">
                                        <div className='col-12'>
                                            <div className='card action-button' style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',borderRadius: '8px',boxShadow: '0 4px 12px rgba(40,167,69,0.3)',border: 'none',overflow: 'hidden'}}>
                                                <NbButton className="form-group btn btn-primary btn-purple btn-block" 
                                                style={{height:"60px",width:"100%",background:"transparent",border:"none",color:"#ffffff",fontSize:"16px",fontWeight:"600"}} 
                                                onClick={(() =>{this.grpSave()}).bind(this)
                                                }>
                                                    {this.t("lblSave")}
                                                </NbButton>
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