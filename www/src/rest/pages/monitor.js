import React from 'react';
import App from '../lib/app.js';
import moment from 'moment';
import ScrollView from 'devextreme-react/scroll-view';
import LoadIndicator from 'devextreme-react/load-indicator';
import NbPopUp from '../../core/react/bootstrap/popup';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox from "../../core/react/devex/textbox.js";
import NdCheckBox from "../../core/react/devex/checkbox.js";
import NbTableView from "../tools/tableView.js"
import NbServiceView from "../tools/serviceView.js"
import NbServiceDetailView from "../tools/serviceDetailView.js"
import NbAddProductView from "../tools/addProductView.js"
import NbProductDetailView from "../tools/productDetailView.js"
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";

import { datatable } from '../../core/core.js';
import { restOrderCls,restOrderDetailCls} from "../../core/cls/rest.js";

export default class monitor extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.state = 
        {
            isLoading : true
        } 

        this.tableSelected = undefined
        this.serviceSelected = undefined
        this.restItemSelected = undefined

        this.lang = App.instance.lang;

        this.restOrderObj = new restOrderCls()
    }
    async componentDidMount()
    {
        this.init()        
    }
    async init()
    {
        this.restOrderObj.clearAll()

        this.tableView.items.selectCmd = 
        {
            query : "SELECT * FROM REST_TABLE_VW_01 ORDER BY CODE ASC"
        }
        await this.tableView.items.refresh()
        this.tableView.updateState()
        
        this.setState({isLoading:false})
    }    
    getServices(pGuid)
    {
        return new Promise(async resolve => 
        {
            let tmpData = new datatable()
            tmpData.selectCmd = 
            {
                query : `SELECT 
                        MAX(GUID) AS GUID,
                        MAX(ZONE) AS ZONE,
                        MAX(ZONE_CODE) AS ZONE_CODE,
                        MAX(ZONE_NAME) AS ZONE_NAME,
                        MAX(REF) AS REF,
                        MAX(ORDER_COMPLATE_COUNT) AS ORDER_COMPLATE_COUNT,
                        MAX(ORDER_COUNT) AS ORDER_COUNT,
                        MAX(DELIVERED) AS DELIVERED 
                        FROM REST_ORDER_VW_01 WHERE ORDER_COUNT > 0 AND ZONE = @ZONE GROUP BY REF`,
                param : ['ZONE:string|50'],
                value : [pGuid]
            }
            await tmpData.refresh()
            resolve(tmpData)
        })
    }
    isValidJSON(value)
    {
        try 
        {
            JSON.parse(value);
            return true;
        } catch (e) 
        {
            return false;
        }
    }
    async print(pData)
    {
        return new Promise(async resolve => 
        {
            let replaceTurkishChars = (str) => 
            {
                const turkishChars = 
                {
                    'Ç': 'C', 'ç': 'c',
                    'Ğ': 'G', 'ğ': 'g',
                    'İ': 'I', 'ı': 'i',
                    'Ö': 'O', 'ö': 'o',
                    'Ş': 'S', 'ş': 's',
                    'Ü': 'U', 'ü': 'u',
                    'È': 'E', 'é': 'e',
                    'À': 'A', 'à': 'a',
                };
            
                return str.split('').map(char => turkishChars[char] || char).join('');
            }

            if(pData.map(obj => `'${obj.ITEM}'`).join(", ") == '')
            {
                resolve(false)
                return
            }

            let tmpPrintDt = new datatable()
            tmpPrintDt.selectCmd = 
            {
                query : "SELECT * FROM REST_PRINT_ITEM_VW_01 WHERE ITEM_GUID IN (" + pData.map(obj => `'${obj.ITEM}'`).join(", ") + ") ORDER BY CODE ASC"
            }
            await tmpPrintDt.refresh()
            
            let tmpArrDt = []
            for (let i = 0; i < tmpPrintDt.groupBy('CODE').length; i++) 
            {
                let tmpItems = new datatable()
                for (let x = 0; x < pData.length; x++) 
                {
                    let tmpFilterPrinter = tmpPrintDt.where({CODE:tmpPrintDt.groupBy('CODE')[i].CODE}).where({ITEM_GUID:pData[x].ITEM})
                    if(tmpFilterPrinter.length > 0)
                    {
                        pData[x].ITEM_NAME = replaceTurkishChars(pData[x].ITEM_NAME)
                        pData[x].PRINTER_PATH = tmpFilterPrinter[0].PRINTER_PATH
                        pData[x].DESIGN_PATH = tmpFilterPrinter[0].DESIGN_PATH
                        if(this.isValidJSON(pData[x].PROPERTY))
                        {
                            pData[x].PROPERTY = JSON.parse(pData[x].PROPERTY).map(item => item.TITLE).join('\n')
                            pData[x].PROPERTY = replaceTurkishChars(pData[x].PROPERTY)
                        }
                        pData[x].DESCRIPTION = replaceTurkishChars(pData[x].DESCRIPTION)
                        
                        tmpItems.push({...pData[x]})
                    }
                }
                tmpArrDt.push(tmpItems)
            }
            
            for (let i = 0; i < tmpArrDt.length; i++) 
            {
                let tmpStatus0 = tmpArrDt[i].where({WAIT_STATUS:0})
                let tmpStatus1 = tmpArrDt[i].where({WAIT_STATUS:1})
                let tmpStatus2 = tmpArrDt[i].where({WAIT_STATUS:2})
                let tmpStatus3 = tmpArrDt[i].where({WAIT_STATUS:3})

                if(tmpStatus0.length > 0)
                {
                    this.core.socket.emit('devprint','{"TYPE":"PRINT","PATH":"' + tmpStatus0[0].DESIGN_PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpStatus0.toArray()) + ',"PRINTER":"' + tmpStatus0[0].PRINTER_PATH + '"}',async(pResult) =>
                    {
                        console.log(pResult)
                    })
                }
                if(tmpStatus1.length > 0)
                {
                    this.core.socket.emit('devprint','{"TYPE":"PRINT","PATH":"' + tmpStatus1[0].DESIGN_PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpStatus1.toArray()) + ',"PRINTER":"' + tmpStatus1[0].PRINTER_PATH + '"}',async(pResult) =>
                    {
                        console.log(pResult)
                    })
                }
                if(tmpStatus2.length > 0)
                {
                    this.core.socket.emit('devprint','{"TYPE":"PRINT","PATH":"' + tmpStatus2[0].DESIGN_PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpStatus2.toArray()) + ',"PRINTER":"' + tmpStatus2[0].PRINTER_PATH + '"}',async(pResult) =>
                    {
                        console.log(pResult)
                    })
                }
                if(tmpStatus3.length > 0)
                {
                    this.core.socket.emit('devprint','{"TYPE":"PRINT","PATH":"' + tmpStatus3[0].DESIGN_PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpStatus3.toArray()) + ',"PRINTER":"' + tmpStatus3[0].PRINTER_PATH + '"}',async(pResult) =>
                    {
                        console.log(pResult)
                    })
                }
            }

            resolve(true)
        })
    }
    render()
    {    
        return(
            <div style={{paddingLeft:"10px",paddingRight:"10px",paddingTop:"75px"}}>
                <ScrollView showScrollbar={'never'} useNative={false}>
                    <div style={{display:(this.state.isLoading ? 'block' : 'none'),position:'relative',top:"7%",width:'100%',height:'100%',backgroundColor:'#ecf0f1'}}>
                        <div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}>
                            <LoadIndicator height={40} width={40} />
                        </div>
                    </div>
                    <div className='row'>
                        <NbTableView parent={this} id="tableView" 
                        onClick={async(e)=>
                        {
                            await this.popTableDetail.show()
                            this.serviceView.items = await this.getServices(this.tableView.items[e].GUID)
                            this.serviceView.title = this.tableView.items[e].NAME
                            this.serviceView.updateState()
                            this.tableSelected = this.tableView.items[e]
                            App.instance.btnLogout.setLock({display:"none"})
                        }}
                        />
                    </div>
                    {/* TABLE DETAIL */}
                    <div>
                        <NbPopUp id={"popTableDetail"} parent={this} title={""} fullscreen={true}>
                            <NbServiceView parent={this} id="serviceView" 
                            onClick={async(e)=>
                            {
                                this.restOrderObj.clearAll()
                                await this.popServiceDetail.show()
                                this.serviceSelected = this.serviceView.items[e]
                                await this.restOrderObj.load({ZONE:this.tableSelected.GUID,REF:this.serviceView.items[e].REF})
                                this.serviceDetailView.title = this.serviceView.items[e].ZONE_NAME + " / SERVICE - " + this.serviceView.items[e].REF
                                
                                try
                                {
                                    this.serviceDetailView.lblPerson.value = this.restOrderObj.dt()[0].PERSON
                                }catch{}

                                this.serviceDetailView.items = this.restOrderObj.restOrderDetail.dt()
                                this.serviceDetailView.updateState()
                            }}
                            onCloseClick={(e)=>
                            {
                                this.popTableDetail.hide();
                                this.init()
                                App.instance.btnLogout.setUnLock({display:"block"})
                            }}/>
                        </NbPopUp>
                    </div>
                    {/* SERVICE DETAIL */}
                    <div>
                        <NbPopUp id={"popServiceDetail"} parent={this} title={""} fullscreen={true} style={{paddingLeft:'5px'}}>
                            <NbServiceDetailView parent={this} id="serviceDetailView" 
                            onDoubleClick={async(e)=>
                            {
                                if(this.serviceDetailView.items[e].STATUS == 1)
                                {                                    
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderCheck',showTitle:true,title:this.lang.t("msgOrderCheck.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderCheck.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgOrderCheck.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderCheck.msg")}</div>)
                                    }
                                    let msgResult = await dialog(tmpConfObj);
                                    if(msgResult == "btn01")
                                    {
                                        this.serviceDetailView.items[e].STATUS = 2
                                        await this.restOrderObj.save()
                                        this.serviceDetailView.updateState()
                                    }
                                }
                                else if(this.serviceDetailView.items[e].STATUS == 2)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderUnCheck',showTitle:true,title:this.lang.t("msgOrderUnCheck.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderUnCheck.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgOrderUnCheck.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderUnCheck.msg")}</div>)
                                    }
                                    let msgResult = await dialog(tmpConfObj);
                                    if(msgResult == "btn01")
                                    {
                                        this.serviceDetailView.items[e].STATUS = 1
                                        await this.restOrderObj.save()
                                        this.serviceDetailView.updateState()
                                    }
                                }
                            }}
                            onWaitClick={async(e)=>
                            {
                                let tmpConfObj =
                                {
                                    id:'msgWaitStatus',showTitle:true,title:this.lang.t("msgWaitStatus.title"),showCloseButton:true,width:'90%',height:'200px',
                                    button:[{id:"btn01",caption:this.lang.t("msgWaitStatus.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgWaitStatus.btn02"),location:'after'}],
                                }

                                if(this.serviceDetailView.items[e].WAIT_STATUS == 0)
                                {
                                    tmpConfObj.content = <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgWaitStatus.msg1")}</div>

                                    let tmpResult = await dialog(tmpConfObj);
                                    if(tmpResult == "btn01")
                                    {
                                        this.serviceDetailView.items[e].STATUS = 0
                                        this.serviceDetailView.items[e].WAIT_STATUS = 1
                                        await this.restOrderObj.save()
                                        this.serviceDetailView.updateState()
                                    }
                                }
                                else if(this.serviceDetailView.items[e].WAIT_STATUS == 1)
                                {
                                    tmpConfObj.content = <div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgWaitStatus.msg2")}</div>

                                    let tmpResult = await dialog(tmpConfObj);
                                    if(tmpResult == "btn01")
                                    {
                                        this.serviceDetailView.items[e].STATUS = 0
                                        this.serviceDetailView.items[e].WAIT_STATUS = 2
                                        await this.restOrderObj.save()
                                        this.serviceDetailView.updateState()
                                    }
                                }
                            }}
                            onCloseClick={async()=>
                            {
                                if(this.serviceDetailView.items.length > 0)
                                {

                                }
                                
                                this.popServiceDetail.hide()

                                this.serviceView.items = await this.getServices(this.tableSelected.GUID)
                                this.serviceView.updateState()
                            }}/>
                        </NbPopUp>
                    </div>
                </ScrollView>                
            </div>
        )
    }
}
