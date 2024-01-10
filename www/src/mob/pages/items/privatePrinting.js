import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import { priLabelObj,labelMainCls } from '../../../core/cls/label.js';


import NdTextBox from '../../../core/react/devex/textbox';
import NbButton from '../../../core/react/bootstrap/button';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NbLabel from '../../../core/react/bootstrap/label';
import NbPopNumber from '../../tools/popnumber';
import NdNumberBox from '../../../core/react/devex/numberbox';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class priceCheck extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.itemDt = new datatable();
        this.prilabelCls = new priLabelObj();
        this.labelMainObj = new labelMainCls();

        this.itemDt.selectCmd = 
        {
            query : "SELECT * FROM ITEMS_BARCODE_MULTICODE_VW_01 WHERE (CODE = @CODE OR BARCODE = @CODE ) OR (@CODE = '')",
            param : ['CODE:string|25'],
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

        this.txtPrice.value = 0
        this.txtQuantity.value = 1
        this.txtDescription.value = ''
        this.lblItemName.value = ''
        this.txtBarcode.focus()
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
                this.txtPrice.value = this.itemDt[0].PRICE_SALE 
                this.txtBarcode.value = ""
                this.txtPrice.focus()
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


        let tmpQuery = 
        {
            query : "SELECT ISNULL(REPLACE(STR(SUBSTRING(MAX(CODE),0,8) + 1, 7), SPACE(1), '0'),'2700001') AS CODE FROM ITEM_UNIQ ",
        }
        let tmpData = await this.core.sql.execute(tmpQuery) 
        if(tmpData.result.recordset.length > 0)
        {   
            let tmpdefCode = tmpData.result.recordset[0].CODE
            for (let i = 0; i < this.txtQuantity.value; i++) 
            {
                tmpdefCode = tmpdefCode.toString()
                let tmpCode = ''
                let output = []
                for (var x = 0, len = tmpdefCode.length; x < len; x += 1) {
                    output.push(+tmpdefCode.charAt(x));
                }
        
                var tek=(output[0]+output[2]+output[4]+output[6])*3
                var cift=output[1]+output[3]+output[5]
                var say = tek+cift
                let sonuc = (10 - (say %= 10))
                if(sonuc == 10)
                {
                    sonuc = 0
                }
                tmpCode = tmpdefCode + sonuc.toString();
                let tmpEmpty = {...this.prilabelCls.empty};
                tmpEmpty.CODE = tmpCode
                tmpEmpty.ITEM = this.itemDt[0].GUID
                tmpEmpty.NAME = this.lblItemName.value
                tmpEmpty.PRICE = this.txtPrice.value
                tmpEmpty.QUANTITY = this.txtQuantity.value
                tmpEmpty.DESCRIPTION = this.txtDescription.value
                this.prilabelCls.addEmpty(tmpEmpty);  
                tmpdefCode = Number(tmpdefCode) + 1
            }
        }
        let tmpConfObj1 =
        {
            id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
        }
        if((await this.prilabelCls.save()) == 0)
        {                  
        
            let Data = {data:this.prilabelCls.dt().toArray()}                                  
            let tmpLbl = {...this.labelMainObj.empty}
            tmpLbl.REF = 'SPECIAL'
            tmpLbl.DATA = JSON.stringify(Data)     
            this.labelMainObj.addEmpty(tmpLbl);
            this.labelMainObj.save()
        }
        else
        {
            tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
            await dialog(tmpConfObj1);
        }
        this.clearEntry()
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={this.lang.t("menu.stk_07")} content=
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
                <div style={{position:'relative',top:'50px',height:'100%'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
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
                                    <div className='row pb-1'>
                                        <div className='col-12'>
                                            <h6 style={{height:'40px',textAlign:"center",overflow:"hidden"}}>
                                                <NbLabel id="lblItemName" parent={this} value={""}/>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='row  pb-2'>
                                        <div className='col-4 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblPrice")}</label>                                            
                                        </div>
                                        <div className='col-8'>
                                            <NdNumberBox id="txtPrice" parent={this} simple={true} maxLength={32}/>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-4 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblQuantity")}</label>                                            
                                        </div>
                                        <div className='col-8'>
                                            <NdNumberBox id="txtQuantity" parent={this} simple={true} maxLength={32} 
                                            onEnterKey={this.addItem.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-4 d-flex align-items-center justify-content-end'>
                                            <label className='text-purple-light' style={{fontSize:'14px',fontWeight:'bold'}}>{this.t("lblDescription")}</label>                                            
                                        </div>
                                        <div className='col-8'>
                                            <NdTextBox id="txtDescription" parent={this} simple={true} maxLength={32} 
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
                            {/* Number Popup */}
                            <div>
                                <NbPopNumber id={"popNumber"} parent={this}/>
                            </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}