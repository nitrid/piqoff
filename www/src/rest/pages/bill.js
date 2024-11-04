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

export default class bill extends React.PureComponent
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
        this.grpItem = new datatable()
        this.productItem = new datatable()
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

        let tmpGrpPrm = this.param.filter({ID:'Groups',TYPE:0}).getValue().map(code => `'${code}'`).join(',')

        this.grpItem.selectCmd = 
        {
            query : `SELECT CODE,NAME FROM ITEM_SUB_GROUP_VW_01 WHERE CODE IN (${tmpGrpPrm}) ORDER BY CODE ASC`
        }
        await this.grpItem.refresh()
        
        this.productItem.selectCmd = 
        {
            query : `SELECT 
                    ITEM_GUID,
                    ITEM_CODE,
                    ITEM_NAME,
                    SUB_CODE,
                    SUB_NAME,
                    ISNULL((SELECT TOP 1 VAT FROM ITEMS WHERE ITEMS.GUID = ITEM.ITEM_GUID),0) AS VAT,
                    ISNULL((SELECT TOP 1 WAITING FROM ITEMS_REST WHERE ITEMS_REST.ITEM = ITEM.ITEM_GUID),0) AS WAITING,
                    ISNULL((SELECT TOP 1 IMAGE FROM ITEM_IMAGE_VW_01 AS IMG WHERE IMG.ITEM_GUID = ITEM.ITEM_GUID),'') AS IMAGE
                    FROM ITEMS_SUB_GRP_VW_01 AS ITEM WHERE SUB_CODE IN (${tmpGrpPrm})`
        }
        await this.productItem.refresh();
        
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
    getProperty(pItemGuid,pItemProperty)
    {
        return new Promise(async resolve => 
        {
            let tmpData = new datatable()
            tmpData.selectCmd = 
            {
                query : `SELECT * FROM REST_ITEM_PROPERTY_VW_01 WHERE ITEM_GUID = @ITEM_GUID`,
                param : ['ITEM_GUID:string|50'],
                value : [pItemGuid]
            }
            
            await tmpData.refresh()

            if(typeof pItemProperty != 'undefined')
            {
                for (let i = 0; i < tmpData.length; i++) 
                {
                    if(this.isValidJSON(tmpData[i].PROPERTY) && this.isValidJSON(pItemProperty))
                    {
                        let tmpArrProp = []
                        let tmpItemProp = JSON.parse(pItemProperty)
                        let tmpProp = JSON.parse(tmpData[i].PROPERTY)
                        for (let x = 0; x < tmpProp.length; x++) 
                        {
                            if(tmpItemProp.find(item => item.TITLE === tmpProp[x].TITLE)?.VALUE)
                            {
                                tmpProp[x].VALUE = true
                            }
                            else
                            {
                                tmpProp[x].VALUE = false
                            }
                        }
                        tmpData[i].PROPERTY = tmpProp.length > 0 ? JSON.stringify(tmpProp) : ''
                    }
                }
            }
            resolve(tmpData)
        })
    }
    getPrice(pItem)
    {
        return new Promise(async resolve => 
        {
            let tmpPriceDt = new datatable()
            tmpPriceDt.selectCmd = 
            {
                query : "SELECT dbo.FN_PRICE(@GUID,1,dbo.GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1) AS PRICE",
                param : ['GUID:string|50']
            }
            tmpPriceDt.selectCmd.value = [pItem]
            await tmpPriceDt.refresh();
            
            if(tmpPriceDt.length > 0)
            {
                resolve(parseFloat(tmpPriceDt[0].PRICE).toFixed(2))
            }
            else
            {
                resolve(parseFloat(0).toFixed(2))
            }
        })
    }
    async addOrder()
    {
        return new Promise(async resolve => 
        {
            let tmpMaxRef = 0
            if(this.serviceView.items.length > 0)
            {
                tmpMaxRef = this.serviceView.items.max('REF') + 1
            }
            else
            {
                let tmpQuery = 
                {
                    query : "SELECT ISNULL(MAX(REF),0) + 1 AS MAX_REF FROM REST_ORDER_VW_01 WHERE ZONE = @ZONE",
                    param : ['ZONE:string|50'],
                    value : [this.tableSelected.GUID]
                }

                let tmpResult = await this.core.sql.execute(tmpQuery)
                
                if(tmpResult.result.recordset.length > 0)
                {
                    tmpMaxRef = tmpResult.result.recordset[0].MAX_REF
                }
            }
            
            let tmpEmpty = {...this.restOrderObj.empty}

            tmpEmpty.ZONE = this.tableSelected.GUID
            tmpEmpty.ZONE_CODE = this.tableSelected.CODE
            tmpEmpty.ZONE_NAME = this.tableSelected.NAME
            tmpEmpty.REF = tmpMaxRef
            tmpEmpty.PERSON = 1

            this.restOrderObj.addEmpty(tmpEmpty)
            
            this.serviceView.items.push(
            {
                GUID : this.restOrderObj.dt()[0].GUID,
                ZONE : this.restOrderObj.dt()[0].ZONE,
                ZONE_CODE : this.restOrderObj.dt()[0].ZONE_CODE,
                ZONE_NAME : this.restOrderObj.dt()[0].ZONE_NAME,
                REF : this.restOrderObj.dt()[0].REF,
                ORDER_COMPLATE_COUNT : 0,
                ORDER_COUNT : 0,
                DELIVERED : 0
            })
            resolve()
        })
    }
    async addItem(pData)
    {
        let tmpEmpty = {...this.restOrderObj.restOrderDetail.empty}
        tmpEmpty.ZONE = this.serviceSelected.ZONE
        tmpEmpty.ZONE_CODE = this.serviceSelected.ZONE_CODE
        tmpEmpty.ZONE_NAME = this.serviceSelected.ZONE_NAME
        tmpEmpty.REF = this.serviceSelected.REF
        tmpEmpty.REST_GUID = this.serviceSelected.GUID
        tmpEmpty.LINE_NO = this.restOrderObj.restOrderDetail.dt().max('LINE_NO') + 1
        tmpEmpty.ITEM = pData.ITEM_GUID
        tmpEmpty.ITEM_CODE = pData.ITEM_CODE
        tmpEmpty.ITEM_NAME = pData.ITEM_NAME
        tmpEmpty.QUANTITY = pData.QUANTITY
        tmpEmpty.PRICE = Number(pData.PRICE)        
        tmpEmpty.AMOUNT = Number(Number(pData.PRICE) * Number(pData.QUANTITY)).round(2)
        tmpEmpty.FAMOUNT = Number(tmpEmpty.AMOUNT).rateInNum(pData.VAT)
        tmpEmpty.DISCOUNT = 0
        tmpEmpty.VAT = Number(Number(tmpEmpty.AMOUNT) - Number(tmpEmpty.FAMOUNT))
        tmpEmpty.PROPERTY = typeof pData.PROPERTY == 'undefined' ? '' : pData.PROPERTY
        tmpEmpty.DESCRIPTION = typeof pData.DESCRIPTION == 'undefined' ? '' : pData.DESCRIPTION
        tmpEmpty.TOTAL = tmpEmpty.AMOUNT
        tmpEmpty.STATUS = 0
        tmpEmpty.WAITING = pData.WAITING
        tmpEmpty.PRINTED = 0
        
        this.restOrderObj.restOrderDetail.addEmpty(tmpEmpty)
        
        if(this.restOrderObj.dt().length == 0)
        {
            await this.addOrder()
        }
        this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
        this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
        this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
        this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))
    }
    changeTable(pTableValue,pTableData)
    {
        return new Promise(async resolve => 
        {
            let tmpTable = new datatable()
            tmpTable.selectCmd =
            {
                query : "SELECT * FROM REST_TABLE_VW_01 WHERE CODE = @CODE OR NAME = @NAME",
                param : ['CODE:string|50','NAME:string|50'],
                value : [pTableValue,pTableValue]
            }
    
            await tmpTable.refresh()
            
            if(tmpTable.length > 0)
            {
                let tmpRestOrder = new restOrderCls()
                await tmpRestOrder.load({ZONE:pTableData.ZONE,REF:pTableData.REF})
                
                if(tmpRestOrder.dt().length > 0)
                {
                    let tmpMaxRef = 0
                    let tmpQuery = 
                    {
                        query : "SELECT ISNULL(MAX(REF),0) + 1 AS MAX_REF FROM REST_ORDER_VW_01 WHERE ZONE = @ZONE",
                        param : ['ZONE:string|50'],
                        value : [tmpTable[0].GUID]
                    }
    
                    let tmpResult = await this.core.sql.execute(tmpQuery)
                    
                    if(tmpResult.result.recordset.length > 0)
                    {
                        tmpMaxRef = tmpResult.result.recordset[0].MAX_REF
                    }
    
                    tmpRestOrder.dt()[0].ZONE = tmpTable[0].GUID
                    tmpRestOrder.dt()[0].REF = tmpMaxRef
    
                    await tmpRestOrder.save()
    
                    resolve(true)
                }
            }
            else
            {
                resolve(false)
            }
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
    isMultiQtyGrp(pGrp)
    {
        let tmpMGrp = this.param.filter({ID:'MultiQtyGrp',TYPE:0}).getValue()
        return tmpMGrp.some(item => item === pGrp);
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

                            if(!this.param.filter({ID:'MultiService',TYPE:0}).getValue())
                            {
                                if(this.serviceView.items.length == 0)
                                {
                                    this.restOrderObj.clearAll()                                

                                    await this.addOrder()

                                    this.serviceSelected = this.serviceView.items[this.serviceView.items.length-1]
                                    this.serviceView.updateState()

                                    await this.popServiceDetail.show()

                                    this.serviceDetailView.items = this.restOrderObj.restOrderDetail.dt()
                                    this.serviceDetailView.title =  this.restOrderObj.dt()[0].ZONE_NAME + " / SERVICE - " + this.restOrderObj.dt()[0].REF
                                    this.serviceDetailView.updateState()
                                }
                                else
                                {
                                    this.serviceView._onClick(0)
                                }
                            }
                        }}
                        onSaveClick={async(e)=>
                        {
                            let tmpPrintDt = []
                            let tmpServices = await this.getServices(this.tableView.items[e].GUID)
                            for (let x = 0; x < tmpServices.length; x++) 
                            {
                                await this.restOrderObj.load({ZONE:tmpServices[x].ZONE,REF:tmpServices[x].REF})
                                
                                let tmpFilter = this.restOrderObj.restOrderDetail.dt().where({STATUS:0})
                                
                                if (tmpFilter.length > 0)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgSendKitchen',showTitle:true,title:this.lang.t("msgSendKitchen.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgSendKitchen.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgSendKitchen.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSendKitchen.msg")}</div>)
                                    }

                                    let msgResult = await dialog(tmpConfObj);

                                    if(msgResult == "btn02")
                                    {
                                        return
                                    }
                                    
                                    for (let i = 0; i < tmpFilter.length; i++) 
                                    {
                                        tmpPrintDt.push(
                                        {
                                            LDATE : moment(new Date()).utcOffset(0, true),
                                            LUSER : this.core.auth.data.CODE,
                                            REST : tmpFilter[i].REST,
                                            PERSON : tmpFilter[i].PERSON,
                                            ZONE_NAME : tmpFilter[i].ZONE_NAME,
                                            REF : tmpFilter[i].REF,
                                            ITEM : tmpFilter[i].ITEM,
                                            ITEM_CODE : tmpFilter[i].ITEM_CODE,
                                            ITEM_NAME : tmpFilter[i].ITEM_NAME,
                                            QUANTITY : tmpFilter[i].QUANTITY,
                                            PROPERTY : tmpFilter[i].PROPERTY,
                                            DESCRIPTION : tmpFilter[i].DESCRIPTION,
                                            WAITING : tmpFilter[i].WAITING,
                                            WAIT_STATUS : tmpFilter[i].WAIT_STATUS,
                                            PRINTED : tmpFilter[i].PRINTED
                                        })
                                        tmpFilter[i].PRINTED = tmpFilter[i].PRINTED == 0 ? 1 : tmpFilter[i].PRINTED
                                        tmpFilter[i].STATUS = 1
                                    }
                                    this.tableView.items[e].DELIVERED = 0
                                }
                                await this.restOrderObj.save()
                            }

                            await this.print(tmpPrintDt)
                            
                            this.tableView.updateState()
                        }}
                        onChangeClick={async(e)=>
                        {
                            await this.popChangeTable.show()
                            this.popChangeTable.item = this.tableView.items[e]
                            this.popChangeTable.page = "tableView"
                        }}
                        onDeleteClick={async(e)=>
                        {
                            let tmpConfObj =
                            {
                                id:'msgTableDelete',showTitle:true,title:this.lang.t("msgTableDelete.title"),showCloseButton:true,width:'80%',height:'180px',
                                button:[{id:"btn01",caption:this.lang.t("msgTableDelete.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgTableDelete.btn02"),location:'after'}],
                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgTableDelete.msg")}</div>)
                            }
                            let msgResult = await dialog(tmpConfObj);
                            if(msgResult == "btn01")
                            {
                                let tmpPrintDt = []
                                let tmpServices = await this.getServices(this.tableView.items[e].GUID)
                                for (let i = 0; i < tmpServices.length; i++) 
                                {
                                    await this.restOrderObj.load({ZONE:tmpServices[i].ZONE,REF:tmpServices[i].REF})

                                    for (let x = 0; x < this.restOrderObj.restOrderDetail.dt().length; x++) 
                                    {
                                        if(this.restOrderObj.restOrderDetail.dt()[x].PRINTED == 1)
                                        {
                                            tmpPrintDt.push(
                                            {
                                                LDATE : moment(new Date()).utcOffset(0, true),
                                                LUSER : this.core.auth.data.CODE,
                                                REST : this.restOrderObj.restOrderDetail.dt()[x].REST,
                                                PERSON : this.restOrderObj.restOrderDetail.dt()[x].PERSON,
                                                ZONE_NAME : this.restOrderObj.restOrderDetail.dt()[x].ZONE_NAME,
                                                REF : this.restOrderObj.restOrderDetail.dt()[x].REF,
                                                ITEM : this.restOrderObj.restOrderDetail.dt()[x].ITEM,
                                                ITEM_CODE : this.restOrderObj.restOrderDetail.dt()[x].ITEM_CODE,
                                                ITEM_NAME : this.restOrderObj.restOrderDetail.dt()[x].ITEM_NAME,
                                                QUANTITY : this.restOrderObj.restOrderDetail.dt()[x].QUANTITY,
                                                PROPERTY : this.restOrderObj.restOrderDetail.dt()[x].PROPERTY,
                                                DESCRIPTION : this.restOrderObj.restOrderDetail.dt()[x].DESCRIPTION,
                                                WAITING : this.restOrderObj.restOrderDetail.dt()[x].WAITING,
                                                WAIT_STATUS : 3,
                                                PRINTED : 0
                                            })
                                        }
                                    }

                                    this.restOrderObj.dt().removeAt(0)
                                    await this.restOrderObj.save()
                                }

                                await this.print(tmpPrintDt)
                                this.init()
                            }                            
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
                            onAddClick={async()=>
                            {
                                this.restOrderObj.clearAll()                                

                                await this.addOrder()

                                this.serviceSelected = this.serviceView.items[this.serviceView.items.length-1]
                                this.serviceView.updateState()

                                await this.popServiceDetail.show()

                                this.serviceDetailView.items = this.restOrderObj.restOrderDetail.dt()
                                this.serviceDetailView.title =  this.restOrderObj.dt()[0].ZONE_NAME + " / SERVICE - " + this.restOrderObj.dt()[0].REF
                                this.serviceDetailView.updateState()
                            }}
                            onChangeClick={async(e)=>
                            {
                                await this.popChangeTable.show()
                                this.popChangeTable.item = this.serviceView.items[e]
                                this.popChangeTable.page = "serviceView"
                            }}
                            onSaveClick={async(e)=>
                            {
                                let tmpPrintDt = []
                                await this.restOrderObj.load({ZONE:this.tableSelected.GUID,REF:this.serviceView.items[e].REF})

                                let tmpFilter = this.restOrderObj.restOrderDetail.dt().where({STATUS:0})

                                if (tmpFilter.length > 0)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgSendKitchen',showTitle:true,title:this.lang.t("msgSendKitchen.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgSendKitchen.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgSendKitchen.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgSendKitchen.msg")}</div>)
                                    }

                                    let msgResult = await dialog(tmpConfObj);

                                    if(msgResult == "btn02")
                                    {
                                        return
                                    }
                                    for (let i = 0; i < tmpFilter.length; i++) 
                                    {
                                        tmpPrintDt.push(
                                        {
                                            LDATE : moment(new Date()).utcOffset(0, true),
                                            LUSER : this.core.auth.data.CODE,
                                            REST : tmpFilter[i].REST,
                                            PERSON : tmpFilter[i].PERSON,
                                            ZONE_NAME : tmpFilter[i].ZONE_NAME,
                                            REF : tmpFilter[i].REF,
                                            ITEM : tmpFilter[i].ITEM,
                                            ITEM_CODE : tmpFilter[i].ITEM_CODE,
                                            ITEM_NAME : tmpFilter[i].ITEM_NAME,
                                            QUANTITY : tmpFilter[i].QUANTITY,
                                            PROPERTY : tmpFilter[i].PROPERTY,
                                            DESCRIPTION : tmpFilter[i].DESCRIPTION,
                                            WAITING : tmpFilter[i].WAITING,
                                            WAIT_STATUS : tmpFilter[i].WAIT_STATUS,
                                            PRINTED : tmpFilter[i].PRINTED
                                        })
                                        tmpFilter[i].PRINTED = tmpFilter[i].PRINTED == 0 ? 1 : tmpFilter[i].PRINTED
                                        tmpFilter[i].STATUS = 1
                                    }
                                    await this.print(tmpPrintDt)
                                    await this.restOrderObj.save()
                                    this.serviceView.items[e].DELIVERED = 0
                                    this.serviceView.updateState()
                                }
                                else
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgRePrint',showTitle:true,title:this.lang.t("msgRePrint.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgRePrint.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgRePrint.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRePrint.msg")}</div>)
                                    }
    
                                    let msgResult = await dialog(tmpConfObj);

                                    if(msgResult == "btn01")
                                    {
                                        for (let i = 0; i < this.restOrderObj.restOrderDetail.dt().length; i++) 
                                        {
                                            tmpPrintDt.push(
                                            {
                                                LDATE : moment(new Date()).utcOffset(0, true),
                                                LUSER : this.core.auth.data.CODE,
                                                REST : this.restOrderObj.restOrderDetail.dt()[i].REST,
                                                PERSON : this.restOrderObj.restOrderDetail.dt()[i].PERSON,
                                                ZONE_NAME : this.restOrderObj.restOrderDetail.dt()[i].ZONE_NAME,
                                                REF : this.restOrderObj.restOrderDetail.dt()[i].REF,
                                                ITEM : this.restOrderObj.restOrderDetail.dt()[i].ITEM,
                                                ITEM_CODE : this.restOrderObj.restOrderDetail.dt()[i].ITEM_CODE,
                                                ITEM_NAME : this.restOrderObj.restOrderDetail.dt()[i].ITEM_NAME,
                                                QUANTITY : this.restOrderObj.restOrderDetail.dt()[i].QUANTITY,
                                                PROPERTY : this.restOrderObj.restOrderDetail.dt()[i].PROPERTY,
                                                DESCRIPTION : this.restOrderObj.restOrderDetail.dt()[i].DESCRIPTION,
                                                WAITING : this.restOrderObj.restOrderDetail.dt()[i].WAITING,
                                                WAIT_STATUS : this.restOrderObj.restOrderDetail.dt()[i].WAIT_STATUS,
                                                PRINTED : this.restOrderObj.restOrderDetail.dt()[i].PRINTED
                                            })
                                            this.restOrderObj.restOrderDetail.dt()[i].PRINTED = this.restOrderObj.restOrderDetail.dt()[i].PRINTED == 0 ? 1 : this.restOrderObj.restOrderDetail.dt()[i].PRINTED
                                            this.restOrderObj.restOrderDetail.dt()[i].STATUS = 1
                                        }
                                        await this.print(tmpPrintDt)
                                        await this.restOrderObj.save()
                                        this.serviceView.items[e].DELIVERED = 0
                                        this.serviceView.updateState()
                                    }
                                }
                            }}
                            onDeleteClick={async(e)=>
                            {
                                let tmpConfObj =
                                {
                                    id:'msgServiceDelete',showTitle:true,title:this.lang.t("msgServiceDelete.title"),showCloseButton:true,width:'80%',height:'180px',
                                    button:[{id:"btn01",caption:this.lang.t("msgServiceDelete.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgServiceDelete.btn02"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgServiceDelete.msg")}</div>)
                                }

                                let msgResult = await dialog(tmpConfObj);
                                if(msgResult == "btn01")
                                {
                                    await this.restOrderObj.load({ZONE:this.tableSelected.GUID,REF:this.serviceView.items[e].REF})

                                    let tmpPrintDt = []
                                    for (let x = 0; x < this.restOrderObj.restOrderDetail.dt().length; x++) 
                                    {
                                        if(this.restOrderObj.restOrderDetail.dt()[x].PRINTED == 1)
                                        {
                                            tmpPrintDt.push(
                                            {
                                                LDATE : moment(new Date()).utcOffset(0, true),
                                                LUSER : this.core.auth.data.CODE,
                                                REST : this.restOrderObj.restOrderDetail.dt()[x].REST,
                                                PERSON : this.restOrderObj.restOrderDetail.dt()[x].PERSON,
                                                ZONE_NAME : this.restOrderObj.restOrderDetail.dt()[x].ZONE_NAME,
                                                REF : this.restOrderObj.restOrderDetail.dt()[x].REF,
                                                ITEM : this.restOrderObj.restOrderDetail.dt()[x].ITEM,
                                                ITEM_CODE : this.restOrderObj.restOrderDetail.dt()[x].ITEM_CODE,
                                                ITEM_NAME : this.restOrderObj.restOrderDetail.dt()[x].ITEM_NAME,
                                                QUANTITY : this.restOrderObj.restOrderDetail.dt()[x].QUANTITY,
                                                PROPERTY : this.restOrderObj.restOrderDetail.dt()[x].PROPERTY,
                                                DESCRIPTION : this.restOrderObj.restOrderDetail.dt()[x].DESCRIPTION,
                                                WAITING : this.restOrderObj.restOrderDetail.dt()[x].WAITING,
                                                WAIT_STATUS : 3,
                                                PRINTED : 0
                                            })
                                        }
                                    }
                                    await this.print(tmpPrintDt)
                                    
                                    this.restOrderObj.dt().removeAt(0)
                                    await this.restOrderObj.save()

                                    this.serviceView.items = await this.getServices(this.tableView.items[e].GUID)
                                    this.serviceView.title = this.tableView.items[e].NAME
                                    this.serviceView.updateState()
                                }
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
                            onClick={async(e)=>
                            {
                                await this.popProductDetail.show()
                                
                                let tmpItemProperty = new datatable()
                                tmpItemProperty.selectCmd = 
                                {
                                    query : `SELECT * FROM REST_ITEM_PROPERTY_VW_01 WHERE ITEM_GUID = @ITEM_GUID`,
                                    param : ['ITEM_GUID:string|50'],
                                    value : [this.serviceDetailView.items[e].ITEM]
                                }
                                await tmpItemProperty.refresh()
                                
                                this.productDetailView.items = this.serviceDetailView.items[e]
                                this.productDetailView.itemProp = await this.getProperty(this.serviceDetailView.items[e].ITEM,this.productDetailView.items.PROPERTY)
                                
                                let tmpImg = this.productItem.where({ITEM_GUID:this.productDetailView.items.ITEM})
                                if(tmpImg.length > 0)
                                {
                                    this.productDetailView.items.IMAGE = tmpImg[0].IMAGE
                                }
                                
                                this.productDetailView.txtNote.value = this.productDetailView.items.DESCRIPTION
                                this.productDetailView.updateState()
                            }}
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
                            onAddClick={async()=>
                            {
                                if(this.restOrderObj.dt().length == 0)
                                {
                                    await this.addOrder()
                                    this.serviceSelected = this.serviceView.items[this.serviceView.items.length-1]
                                    this.serviceView.updateState()
                                    this.serviceDetailView.title =  this.restOrderObj.dt()[0].ZONE_NAME + " / SERVICE - " + this.restOrderObj.dt()[0].REF
                                }

                                await this.popAddProduct.show()
                                for (let i = 0; i < this.productItem.length; i++) 
                                {
                                    this.productItem[i].QUANTITY = 0
                                }

                                this.addProductView.grpItem = this.grpItem
                                this.addProductView.fullItems = this.productItem

                                if(this.param.filter({ID:'SelectionGroup',TYPE:0}).getValue() == '')
                                {
                                    this.addProductView.items = new datatable()
                                    this.addProductView.lblGroup.value = ""
                                }
                                else
                                {
                                    this.addProductView.items = this.addProductView.fullItems.where({SUB_CODE:this.param.filter({ID:'SelectionGroup',TYPE:0}).getValue()})
                                    if(this.addProductView.items.length > 0)
                                    {
                                        this.addProductView.lblGroup.value = this.addProductView.items[0].SUB_NAME
                                    }
                                }

                                this.addProductView.updateState()

                                if(this.param.filter({ID:'OpenedGroup',TYPE:0}).getValue())
                                {
                                    this.addProductView.setState({page:'group'})
                                }
                            }}
                            onChangeClick={async(e)=>
                            {
                                await this.popAddProduct.show()

                                for (let i = 0; i < this.productItem.length; i++) 
                                {
                                    this.productItem[i].QUANTITY = 0
                                }

                                this.addProductView.grpItem = this.grpItem
                                this.addProductView.fullItems = this.productItem
                                this.addProductView.items = this.productItem
                                this.restItemSelected = this.serviceDetailView.items[e]
                                this.addProductView.updateState()
                            }}
                            onPlusClick={async(e)=>
                            {
                                this.serviceDetailView.items[e].PRICE = await this.getPrice(this.serviceDetailView.items[e].ITEM)
                                this.serviceDetailView.items[e].AMOUNT = Number(Number(this.serviceDetailView.items[e].PRICE) * Number(this.serviceDetailView.items[e].QUANTITY)).round(2)
                                this.serviceDetailView.items[e].FAMOUNT = Number(this.serviceDetailView.items[e].AMOUNT).rateInNum(this.serviceDetailView.items[e].VATRATE)
                                this.serviceDetailView.items[e].VAT = Number(Number(this.serviceDetailView.items[e].AMOUNT) - Number(this.serviceDetailView.items[e].FAMOUNT))
                                this.serviceDetailView.items[e].TOTAL = this.serviceDetailView.items[e].AMOUNT

                                this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
                                this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
                                this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
                                this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))
                                
                                if(this.serviceDetailView.items[e].WAITING)
                                {
                                    this.serviceDetailView.items[e].WAIT_STATUS = 0
                                }
                                
                                this.restOrderObj.save()
                                this.serviceDetailView.updateState()
                            }}
                            onMinusClick={async(e)=>
                            {
                                this.serviceDetailView.items[e].PRICE = await this.getPrice(this.serviceDetailView.items[e].ITEM)
                                this.serviceDetailView.items[e].AMOUNT = Number(Number(this.serviceDetailView.items[e].PRICE) * Number(this.serviceDetailView.items[e].QUANTITY)).round(2)
                                this.serviceDetailView.items[e].FAMOUNT = Number(this.serviceDetailView.items[e].AMOUNT).rateInNum(this.serviceDetailView.items[e].VATRATE)
                                this.serviceDetailView.items[e].VAT = Number(Number(this.serviceDetailView.items[e].AMOUNT) - Number(this.serviceDetailView.items[e].FAMOUNT))
                                this.serviceDetailView.items[e].TOTAL = this.serviceDetailView.items[e].AMOUNT

                                this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
                                this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
                                this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
                                this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))

                                if(this.serviceDetailView.items[e].WAITING)
                                {
                                    this.serviceDetailView.items[e].WAIT_STATUS = 0
                                }

                                this.restOrderObj.save()
                                this.serviceDetailView.updateState()
                            }}
                            onPersonClick={async(e)=>
                            {
                                console.log(this.restOrderObj.dt())
                                this.restOrderObj.dt()[0].PERSON = e
                                this.restOrderObj.save()
                            }}
                            onDeleteClick={async(e)=>
                            {
                                let tmpConfObj =
                                {
                                    id:'msgItemDelete',showTitle:true,title:this.lang.t("msgItemDelete.title"),showCloseButton:true,width:'80%',height:'180px',
                                    button:[{id:"btn01",caption:this.lang.t("msgItemDelete.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgItemDelete.btn02"),location:'after'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgItemDelete.msg")}</div>)
                                }
                                let msgResult = await dialog(tmpConfObj);
                                if(msgResult == "btn01")
                                {
                                    let tmpDelete = this.restOrderObj.restOrderDetail.dt().where({GUID:this.serviceDetailView.items[e].GUID})

                                    if(tmpDelete.length > 0 && tmpDelete[0].PRINTED > 0)
                                    {
                                        let tmpPrintDt = []

                                        tmpPrintDt.push(
                                        {
                                            LDATE : moment(new Date()).utcOffset(0, true),
                                            LUSER : this.core.auth.data.CODE,
                                            REST : tmpDelete[0].REST,
                                            PERSON : tmpDelete[0].PERSON,
                                            ZONE_NAME : tmpDelete[0].ZONE_NAME,
                                            REF : tmpDelete[0].REF,
                                            ITEM : tmpDelete[0].ITEM,
                                            ITEM_CODE : tmpDelete[0].ITEM_CODE,
                                            ITEM_NAME : tmpDelete[0].ITEM_NAME,
                                            QUANTITY : tmpDelete[0].QUANTITY,
                                            PROPERTY : tmpDelete[0].PROPERTY,
                                            DESCRIPTION : tmpDelete[0].DESCRIPTION,
                                            WAITING : tmpDelete[0].WAITING,
                                            WAIT_STATUS : 3,
                                            PRINTED : 0
                                        })

                                        await this.print(tmpPrintDt)
                                    }
                                    

                                    this.restOrderObj.restOrderDetail.dt().removeAt(this.serviceDetailView.items[e])
                                    if(this.restOrderObj.restOrderDetail.dt().length == 0)
                                    {                                    
                                        this.serviceView.items.removeAt(this.serviceView.items.where({GUID:this.restOrderObj.dt()[0].GUID})[0])
                                        this.restOrderObj.dt().removeAt(0)
                                        this.serviceView.updateState()
                                    }
                                    await this.restOrderObj.save()
                                    this.serviceDetailView.updateState()
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
                                this.popServiceDetail.hide()

                                this.serviceView.items = await this.getServices(this.tableSelected.GUID)
                                this.serviceView.updateState()

                                if(!this.param.filter({ID:'MultiService',TYPE:0}).getValue())
                                {
                                    this.serviceView._onCloseClick()
                                }
                            }}/>
                        </NbPopUp>
                    </div>
                    {/* ADD PRODUCT */}
                    <div>
                        <NbPopUp id={"popAddProduct"} parent={this} title={""} fullscreen={true} style={{paddingLeft:'5px'}}>
                            <NbAddProductView parent={this} id="addProductView" 
                            onClick={async(e)=>
                            {
                                await this.popProductDetail.show()
                                
                                this.productDetailView.items = this.addProductView.items[e]
                                this.productDetailView.items.PRICE = await this.getPrice(this.addProductView.items[e].ITEM_GUID)
                                this.productDetailView.itemProp = await this.getProperty(this.addProductView.items[e].ITEM_GUID)
                                
                                this.productDetailView.updateState()
                            }} 
                            onCloseClick={async()=>
                            {
                                let tmpSave = false
                                for (let i = 0; i < this.addProductView.fullItems.length; i++) 
                                {
                                    if(this.addProductView.fullItems[i].QUANTITY > 0)
                                    {
                                        if(typeof this.addProductView.fullItems[i].PROPERTY == 'undefined' || this.addProductView.fullItems[i].PROPERTY == '')
                                        {
                                            let tmpFullProp = await this.getProperty(this.addProductView.fullItems[i].ITEM_GUID)
                                            let tmpArrProp = []
                                            for (let x = 0; x < tmpFullProp.length; x++) 
                                            {
                                                if(this.isValidJSON(tmpFullProp[x].PROPERTY))
                                                {
                                                    JSON.parse(tmpFullProp[x].PROPERTY).filter((elm) => 
                                                    {
                                                        if(elm.VALUE)
                                                        {
                                                            tmpArrProp.push(elm)
                                                        }
                                                    })
                                                }
                                            }
                                            this.addProductView.fullItems[i].PROPERTY = tmpArrProp.length > 0 ? JSON.stringify(tmpArrProp) : ''
                                        }
                                        
                                        if(typeof this.restItemSelected == 'undefined')
                                        {
                                            let tmpQty = this.addProductView.fullItems[i].QUANTITY
                                            for (let x = 0; x < tmpQty; x++) 
                                            {
                                                this.addProductView.fullItems[i].QUANTITY = 1
                                                this.addProductView.fullItems[i].PRICE = await this.getPrice(this.addProductView.fullItems[i].ITEM_GUID)
                                                this.addItem(this.addProductView.fullItems[i])
                                                this.restItemSelected = undefined
                                            }
                                        }
                                        else
                                        {
                                            for (let x = 0; x < this.addProductView.fullItems[i].QUANTITY; x++) 
                                            {
                                                this.restItemSelected.QUANTITY = 1
                                                this.restItemSelected.PRICE = await this.getPrice(this.addProductView.fullItems[i].ITEM_GUID)
                                                this.restItemSelected.AMOUNT = Number(Number(this.restItemSelected.PRICE) * 1).round(2)
                                                this.restItemSelected.FAMOUNT = Number(this.restItemSelected.AMOUNT).rateInNum(this.addProductView.fullItems[i].VAT)
                                                this.restItemSelected.VAT = Number(Number(this.restItemSelected.AMOUNT) - Number(this.restItemSelected.FAMOUNT))
                                                this.restItemSelected.TOTAL = this.restItemSelected.AMOUNT
                                                this.restItemSelected.ITEM = this.addProductView.fullItems[i].ITEM_GUID
                                                this.restItemSelected.ITEM_NAME = this.addProductView.fullItems[i].ITEM_NAME
                                                this.restItemSelected.PROPERTY = this.addProductView.fullItems[i].PROPERTY
                                                this.restItemSelected.DESCRIPTION = this.addProductView.fullItems[i].DESCRIPTION
                                                this.restItemSelected.STATUS = 0
    
                                                this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
                                                this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
                                                this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
                                                this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))
                                            }
                                        }
                                        
                                        tmpSave = true
                                    }
                                }
                                if(tmpSave)
                                {
                                    await this.restOrderObj.save()
                                }

                                this.serviceDetailView.items = this.restOrderObj.restOrderDetail.dt()
                                this.serviceDetailView.updateState()

                                this.restItemSelected = undefined
                                
                                this.popAddProduct.hide()                                
                            }}/>
                        </NbPopUp>
                    </div>
                    {/* PRODUCT DETAIL */}
                    <div>
                        <NbPopUp id={"popProductDetail"} parent={this} title={""} fullscreen={true} style={{paddingLeft:'5px'}}>
                            <NbProductDetailView parent={this} id="productDetailView" param={this.param.filter({ID:'SpecialNote',TYPE:0})}
                            onCloseClick={async()=>
                            {
                                try
                                {
                                    let tmpArrProp = []

                                    for (let i = 0; i < this.productDetailView.itemProp.length; i++) 
                                    {
                                        let tmpObjP = this.productDetailView["ChkGrp" + this.productDetailView.itemProp[i].CODE].state.items
                                        for (let x = 0; x < tmpObjP.length; x++) 
                                        {
                                            if(tmpObjP[x].VALUE)
                                            {
                                                tmpArrProp.push(tmpObjP[x])
                                                tmpArrProp[tmpArrProp.length - 1].CODE = this.productDetailView.itemProp[i].CODE
                                            }
                                        }
                                    }
                                    
                                    let tmpItem = typeof this.productDetailView.items.ITEM_GUID == 'undefined' ? this.productDetailView.items.ITEM : this.productDetailView.items.ITEM_GUID

                                    this.productDetailView.items.PROPERTY = tmpArrProp.length > 0 ? JSON.stringify(tmpArrProp) : ''
                                    this.productDetailView.items.DESCRIPTION = this.productDetailView.txtNote.value
                                    this.productDetailView.items.PRICE = await this.getPrice(tmpItem)
                                    this.productDetailView.items.AMOUNT = Number(Number(this.productDetailView.items.PRICE) * Number(this.productDetailView.items.QUANTITY)).round(2)
                                    this.productDetailView.items.FAMOUNT = Number(this.productDetailView.items.AMOUNT).rateInNum(this.productDetailView.items.VATRATE)
                                    this.productDetailView.items.VAT = Number(Number(this.productDetailView.items.AMOUNT) - Number(this.productDetailView.items.FAMOUNT))
                                    this.productDetailView.items.TOTAL = this.productDetailView.items.AMOUNT
    
                                    this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
                                    this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
                                    this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
                                    this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))
    
                                    if(this.productDetailView.items.QUANTITY == 0)
                                    {
                                        let tmpRemoveItem = this.restOrderObj.restOrderDetail.dt().where({ITEM:this.productDetailView.items.ITEM})
                                        if(tmpRemoveItem.length > 0)
                                        {
                                            if(tmpRemoveItem[0].PRINTED > 0)
                                            {
                                                let tmpPrintDt = []

                                                tmpPrintDt.push(
                                                {
                                                    LDATE : moment(new Date()).utcOffset(0, true),
                                                    LUSER : this.core.auth.data.CODE,
                                                    REST : tmpRemoveItem[0].REST,
                                                    PERSON : tmpRemoveItem[0].PERSON,
                                                    ZONE_NAME : tmpRemoveItem[0].ZONE_NAME,
                                                    REF : tmpRemoveItem[0].REF,
                                                    ITEM : tmpRemoveItem[0].ITEM,
                                                    ITEM_CODE : tmpRemoveItem[0].ITEM_CODE,
                                                    ITEM_NAME : tmpRemoveItem[0].ITEM_NAME,
                                                    QUANTITY : tmpRemoveItem[0].QUANTITY,
                                                    PROPERTY : tmpRemoveItem[0].PROPERTY,
                                                    DESCRIPTION : tmpRemoveItem[0].DESCRIPTION,
                                                    WAITING : tmpRemoveItem[0].WAITING,
                                                    WAIT_STATUS : 3,
                                                    PRINTED : 0
                                                })
    
                                                await this.print(tmpPrintDt)
                                            }
                                            
                                            this.restOrderObj.restOrderDetail.dt().removeAt(tmpRemoveItem[0])
                                        }
                                        if(this.restOrderObj.restOrderDetail.dt().length == 0)
                                        {
                                            this.serviceView.items.removeAt(this.serviceView.items.where({GUID:this.restOrderObj.dt()[0].GUID})[0])
                                            this.restOrderObj.dt().removeAt(0)
                                            this.serviceView.updateState()
                                        }
                                    }
    
                                    await this.restOrderObj.save()
    
                                    if(typeof this.serviceDetailView != 'undefined')
                                    {
                                        this.serviceDetailView.updateState()
                                    }
                                    if(typeof this.addProductView != 'undefined')
                                    {
                                        this.addProductView.updateState()
                                    }
                                }
                                catch(e)
                                {
                                    console.log(e)
                                }

                                this.popProductDetail.hide()
                            }}/>
                        </NbPopUp>
                    </div>
                    {/* TABLE CHANGE */}
                    <div>
                        <NbPopUp id={"popChangeTable"} parent={this} title={""} fullscreen={false} centered={true} header={false} style={{backgroundColor:"#000000b3"}}>
                            <div className="row">
                                <div className="col-12">                                    
                                    <h3 className="text-center">{this.lang.t("popChangeTable.title")}</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">                                    
                                    <NdTextBox id="txtServiceTable" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:2px solid #079992;"}}/>
                                </div>
                            </div>
                            <div className="row pt-2">
                                <div className="col-6">                                    
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"50px",width:"100%",color:"#079992",border:"solid 2px",paddingTop:'5px'}}
                                    onClick={async()=>
                                    {
                                        if(this.txtServiceTable.value != '')
                                        {
                                            if(this.popChangeTable.page == "serviceView")
                                            {
                                                let tmpResult = await this.changeTable(this.txtServiceTable.value,this.popChangeTable.item)
                                                if(tmpResult)
                                                {
                                                    this.popChangeTable.hide()
                                                        
                                                    this.serviceView.items = await this.getServices(this.popChangeTable.item.ZONE)
                                                    this.serviceView.title = this.popChangeTable.item.ZONE_NAME
                                                    this.serviceView.updateState()

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgChangeSuccess',showTitle:true,title:this.lang.t("msgChangeSuccess.title"),showCloseButton:true,width:'80%',height:'180px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgChangeSuccess.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgChangeSuccess.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                                else
                                                {
                                                    this.popChangeTable.hide()

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgChangeFailed',showTitle:true,title:this.lang.t("msgChangeFailed.title"),showCloseButton:true,width:'80%',height:'180px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgChangeFailed.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgChangeFailed.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                            }
                                            else if(this.popChangeTable.page == "tableView")
                                            {
                                                let tmpServices = await this.getServices(this.popChangeTable.item.GUID)
                                                let tmpSuccess = true
                                                for (let i = 0; i < tmpServices.length; i++) 
                                                {
                                                    let tmpResult = await this.changeTable(this.txtServiceTable.value,tmpServices[i])
                                                    if(!tmpResult)
                                                    {
                                                        tmpSuccess = false
                                                    }
                                                }

                                                if(tmpSuccess)
                                                {
                                                    this.popChangeTable.hide()
                                                    this.init()

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgChangeSuccess',showTitle:true,title:this.lang.t("msgChangeSuccess.title"),showCloseButton:true,width:'80%',height:'180px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgChangeSuccess.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgChangeSuccess.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                                else
                                                {
                                                    this.popChangeTable.hide()

                                                    let tmpConfObj =
                                                    {
                                                        id:'msgChangeFailed',showTitle:true,title:this.lang.t("msgChangeFailed.title"),showCloseButton:true,width:'80%',height:'180px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgChangeFailed.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgChangeFailed.msg")}</div>)
                                                    }
                                                    await dialog(tmpConfObj);
                                                }
                                                this.tableView.updateState()
                                            }
                                        }
                                    }}>
                                        <i className="fa-solid fa-check fa-2x"></i>
                                    </NbButton>
                                </div>
                                <div className="col-6">                                    
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"50px",width:"100%",color:"#079992",border:"solid 2px",paddingTop:'5px'}}
                                    onClick={()=>
                                    {
                                        this.popChangeTable.hide();
                                    }}>
                                        <i className="fa-solid fa-xmark fa-2x"></i>
                                    </NbButton>
                                </div>
                            </div>
                        </NbPopUp>
                    </div>
                </ScrollView>                
            </div>
        )
    }
}
