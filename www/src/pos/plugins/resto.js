import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../lib/app.js'
import { NdLayout,NdLayoutItem } from '../../core/react/devex/layout.js';
import NbButton from "../../core/react/bootstrap/button.js";
import NbPopUp from '../../core/react/bootstrap/popup.js';
import NbTableView from './resto/tools/tableView.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NbLabel from "../../core/react/bootstrap/label.js";
import posDoc from '../pages/posDoc.js';
import { datatable } from "../../core/core.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import NbPopNumber from "../tools/popnumber.js";

import {prm} from './resto/meta/prm.js'
import {acs} from './resto/meta/acs.js'

const orgLoadPos = App.prototype.loadPos
const orgInit = posDoc.prototype.init
const orgDelete = posDoc.prototype.delete
const orgRowDelete = posDoc.prototype.rowDelete
const orgComponentWillMount = posDoc.prototype.componentWillMount
const orgRender = posDoc.prototype.render

App.prototype.loadPos = async function()
{
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./resto/meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }
    
    this.acsObj.meta = this.acsObj.meta.concat(acs)
    this.prmObj.meta = this.prmObj.meta.concat(prm)

    return orgLoadPos.call(this)
}
posDoc.prototype.init = function() 
{
    orgInit.call(this)    
}
posDoc.prototype.componentWillMount = function() 
{
    this.state.showPage = 'table'
    this.state.restTableGrp = []
    
    if(typeof orgComponentWillMount != 'undefined')
    {
        orgComponentWillMount.call(this)
    }
}
posDoc.prototype.rowDelete = async function()
{
    if(typeof this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() != 'undefined' && this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() == true)
    {
        if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
        {
            let tmpUpdateQ = 
            {
                query : `UPDATE REST_ORDER_DETAIL SET DELETED = 1 WHERE POS_SALE = @POS_SALE`,
                param : ['POS_SALE:string|50'],
                value : [this.grdList.devGrid.getSelectedRowKeys()[0].GUID]
            }
            await this.core.sql.execute(tmpUpdateQ)
        }
    }
    else
    {
        if(this.posObj.posSale.dt().length > 0)
        {
            if(this.grdList.devGrid.getSelectedRowKeys().length > 0)
            {
                let tmpUpdateQ = 
                {
                    query : `UPDATE REST_ORDER_DETAIL SET STATUS = 3, POS = '00000000-0000-0000-0000-000000000000', POS_SALE = '00000000-0000-0000-0000-000000000000' 
                                WHERE POS_SALE = @POS_SALE`,
                    param : ['POS_SALE:string|50'],
                    value : [this.grdList.devGrid.getSelectedRowKeys()[0].GUID]
                }
                await this.core.sql.execute(tmpUpdateQ)
            }
        } 
    }
  
    orgRowDelete.call(this)
}
posDoc.prototype.delete = async function()
{
    if(typeof this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() != 'undefined' && this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() == true)
    {
        let tmpUpdateQ = 
        {
            query : `UPDATE REST_ORDER_DETAIL SET DELETED = 1 WHERE POS = @POS`,
            param : ['POS:string|50'],
            value : [this.posObj.dt()[0].GUID]
        }
        await this.core.sql.execute(tmpUpdateQ)
    }
    else
    {
        let tmpUpdateQ = 
        {
            query : `UPDATE REST_ORDER_DETAIL SET STATUS = 3, POS = '00000000-0000-0000-0000-000000000000', POS_SALE = '00000000-0000-0000-0000-000000000000' 
                     WHERE POS = @POS`,
            param : ['POS:string|50'],
            value : [this.posObj.dt()[0].GUID]
        }
        await this.core.sql.execute(tmpUpdateQ)
    }
  
    orgDelete.call(this)
}
posDoc.prototype.render = function() 
{
    let originalRenderOutput = orgRender.call(this);
    let modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(renderTables.bind(this))());
    modifiedChildren = addChildToElementWithId(modifiedChildren,'frmBtnGrp',(renderDiscount.bind(this))());
    modifiedChildren = addChildToElementWithId(modifiedChildren,'frmBtnGrp',(renderPaySplit.bind(this))());
    
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
}
function addChildToElementWithId(children, id, newChild) 
{
    return React.Children.map(children, child => 
    {
        if (!React.isValidElement(child)) 
        {
            return child;
        }
        if (child.props.id === id) 
        {
            const newChildren = React.Children.toArray(child.props.children);
            newChildren.push(newChild);
            return React.cloneElement(child, {}, ...newChildren);
        } 
        else if (child.props.children) 
        {
            return React.cloneElement(child, {}, addChildToElementWithId(child.props.children, id, newChild));
        }
        return child;
    });
}
async function getTables(pGrp)
{
    this.restTableView.items.selectCmd = 
    {
        query : `SELECT *,ISNULL((SELECT SUM(TOTAL) FROM REST_ORDER_VW_01 WHERE ORDER_COUNT > 0 AND ZONE = REST_TABLE_VW_01.GUID),0) AS TOTAL 
                 FROM REST_TABLE_VW_01 WHERE GRP = '${typeof pGrp == 'undefined' ? '' : pGrp}' OR '${typeof pGrp == 'undefined' ? '' : pGrp}' = '' ORDER BY CODE ASC`
    }
    await this.restTableView.items.refresh()
    this.restTableView.updateState()
}
async function getGrp() 
{
    let tmpTbl = new datatable()
    tmpTbl.selectCmd = 
    {
        query : "SELECT GRP FROM REST_TABLE_VW_01 GROUP BY GRP"
    }
    await tmpTbl.refresh()
    this.setState({restTableGrp:tmpTbl.toArray()})
}
function renderPaySplit()
{
    return (
        <NdLayoutItem key={"btnRestPaySplitLy"} id={"btnRestPaySplitLy"} parent={this} data-grid={{x:45,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:30}}
        access={this.acsObj.filter({ELEMENT:'btnRestPaySplitLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnRestPaySplit"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",border:"#ff9f43"}}
                onClick={async()=>
                {
                    if(this.payRest.value == 0)
                    {
                        return
                    }

                    let tmpResult = await this.popRestNP.show(this.lang.t("popRestNP.title"),1,undefined,this.lang.t("popRestNP.msg") + Number(this.payRest.value).round(2).toFixed(2) + Number.money.sign)
                    if(typeof tmpResult != 'undefined' && tmpResult != '')
                    {
                        let tmpPay = Number(this.payRest.value / tmpResult).round(2)
                        let tmpPayChange = 0
                        let tmpPayType = 0

                        this.lblMsgRestPaymentType.value = this.lang.t("msgRestPaymentType.msg") + Number(tmpPay).round(2).toFixed(2) + Number.money.sign
                        let tmpResult2 = await this.msgRestPaymentType.show()
                     
                        if(tmpResult2 == "btn01")
                        {
                            tmpPayType = 0
                            let tmpResult3 = await this.popRestPayment.show(this.lang.t("popRestPayment.title"),tmpPay,undefined,this.lang.t("popRestPayment.msg") + Number(tmpPay).round(2).toFixed(2) + Number.money.sign)
                            if(typeof tmpResult3 != 'undefined' && tmpResult3 != '')
                            {
                                tmpPayChange = tmpResult3 - tmpPay
                                if(tmpPayChange > 0)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgRestMoneyChange',
                                        showTitle:true,
                                        title:this.lang.t("msgRestMoneyChange.title"),
                                        showCloseButton:true,
                                        width:'500px',
                                        height:'250px',
                                        button:[{id:"btn01",caption:this.lang.t("msgRestMoneyChange.btn01"),location:'after'}],
                                        content:(<div><h3 className="text-danger text-center">{Number(tmpPayChange).toFixed(2) + " " + Number.money.sign}</h3><h3 className="text-primary text-center">{this.lang.t("msgRestMoneyChange.msg")}</h3></div>)
                                    }
                                    await dialog(tmpConfObj);
                                }
                                
                                this.payAdd(tmpPayType,tmpPay)
                            }
                        }
                        else if(tmpResult2 == "btn02")
                        {
                            tmpPayType = 1
                            this.payAdd(tmpPayType,tmpPay)
                        }
                    }
                }}>
                    <i className="text-white fa-solid fa-comments-dollar" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
            {/* Rest NP Popup */}
            <div>
                <NbPopNumber id={"popRestNP"} parent={this}/>
            </div>
            {/* Rest Payment Type Popup */}
            <div>
                <NdDialog id={"msgRestPaymentType"} container={"#root"} parent={this}
                position={{of:'#root'}} 
                showTitle={true} 
                title={this.lang.t("msgRestPaymentType.title")} 
                showCloseButton={false}
                width={"500px"}
                height={"200px"}
                deferRendering={false}
                >
                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-center"><NbLabel id={"lblMsgRestPaymentType"} parent={this} value={""}/></h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 py-2">
                            <NbButton id={"btnMsgRestPaymentESC"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                            onClick={()=>
                            {
                                this.msgRestPaymentType._onClick("btn01")
                            }}>
                                <div className="row"><div className="col-12">{"ESC"}</div></div>
                                <div className="row"><div className="col-12"><i className={"text-white fa-solid fa-money-bill"} style={{fontSize: "24px"}}/></div></div>
                            </NbButton>
                        </div>
                        <div className="col-6 py-2">
                            <NbButton id={"btnMsgRestPaymentCB"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"70px",width:"100%"}}
                            onClick={()=>
                            {
                                this.msgRestPaymentType._onClick("btn02")
                            }}>
                                <div className="row"><div className="col-12">{"CB"}</div></div>
                                <div className="row"><div className="col-12"><i className={"text-white fa-solid fa-credit-card"} style={{fontSize: "24px"}}/></div></div>                                    
                            </NbButton>
                        </div>
                    </div>
                </NdDialog>
            </div>
            {/* Rest Payment Popup */}
            <div>
                <NbPopNumber id={"popRestPayment"} parent={this}/>
            </div>
        </NdLayoutItem>
    )
}
function renderDiscount()
{
    return (
        <NdLayoutItem key={"btnRestDiscountLy"} id={"btnRestDiscountLy"} parent={this} data-grid={{x:40,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:30}}
        access={this.acsObj.filter({ELEMENT:'btnRestDiscountLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnRestDiscount"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",border:"#ff9f43"}}
                onClick={async()=>
                {
                    if(this.grdList.getSelectedData().length > 0)
                    {
                        let tmpConfObj =
                        {
                            id:'msgRestDiscount',showTitle:true,title:this.lang.t("msgRestDiscount.title"),showCloseButton:true,width:'500px',height:'200px',
                            button:[{id:"btn01",caption:this.lang.t("msgRestDiscount.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgRestDiscount.btn02"),location:'after'}],
                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRestDiscount.msg")}</div>)
                        }

                        let tmpMsgResult = await dialog(tmpConfObj);
                        
                        if(tmpMsgResult == "btn01")
                        {
                            let tmpDiscount = Number(this.grdList.getSelectedData()[0].AMOUNT).rateInc(100,2)
                                            
                            let tmpData = this.grdList.getSelectedData()[0]
                            let tmpCalc = this.calcSaleTotal(tmpData.PRICE,tmpData.QUANTITY,tmpDiscount,tmpData.LOYALTY,tmpData.VAT_RATE)
                            
                            this.grdList.getSelectedData()[0].LDATE = moment(new Date()).utcOffset(0, true)
                            this.grdList.getSelectedData()[0].FAMOUNT = tmpCalc.FAMOUNT
                            this.grdList.getSelectedData()[0].AMOUNT = tmpCalc.AMOUNT
                            this.grdList.getSelectedData()[0].DISCOUNT = tmpDiscount
                            this.grdList.getSelectedData()[0].VAT = tmpCalc.VAT
                            this.grdList.getSelectedData()[0].TOTAL = tmpCalc.TOTAL
    
                            await this.calcGrandTotal();
                        }
                    }
                }}>
                    <i className="text-white fa-solid fa-tag" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
        </NdLayoutItem>
    )
}
function renderTables()
{
    getTables = getTables.bind(this)
    getGrp = getGrp.bind(this)

    return (
        <NdLayoutItem key={"btnRestTablesLy"} id={"btnRestTablesLy"} parent={this} data-grid={{x:40,y:90,h:32,w:30,minH:16,maxH:32,minW:3,maxW:30}}
        access={this.acsObj.filter({ELEMENT:'btnRestTablesLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnRestTables"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%",backgroundColor:"#ff9f43",border:"#ff9f43"}}
                onClick={async()=>
                {
                    await this.popRestTable.show()
                    this.setState({showPage:"table"})
                    getTables()
                    getGrp()
                }}>
                    <i className="text-white fa-solid fa-utensils" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
            <div>
                <NbPopUp id={"popRestTable"} parent={this} title={""} fullscreen={true} header={false}>
                    <div className="row" style={{visibility:(this.state.showPage == 'table' ? "visible" : "hidden"),display:(this.state.showPage == 'table' ? "flex" : "none")}}>
                        <div className="col-10 pt-1 pb-1 px-1">
                            <div className="row">
                                {(()=>
                                {
                                    let tmpGrpArr = []
                                    for (let i = 0; i < this.state.restTableGrp.length; i++) 
                                    {
                                        tmpGrpArr.push(
                                        <div key={"btnRestGrp" + i} className="col">
                                            <NbButton id={"btnRestGrp" + i} parent={this} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%",padding:"5px"}}
                                            onClick={()=>
                                            {
                                                getTables(this.state.restTableGrp[i].GRP)
                                            }}>
                                                <div style={{fontSize:'16px',fontWeight:'bold'}}>{this.state.restTableGrp[i].GRP}</div>
                                            </NbButton>
                                        </div>
                                        )
                                    }
                                    return tmpGrpArr
                                })()}
                                
                            </div>
                        </div>
                        <div className="col-2 pt-1 pb-1">
                            <div className="row">
                                <div className="col-6">
                                    <NbButton id={"btnRefreshRestTable"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"100%",width:"100%",padding:"5px"}}
                                    onClick={()=>
                                    {
                                        getTables()
                                    }}>
                                        <i className="text-white fa-solid fa-arrows-rotate" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                                <div className="col-6">
                                    <NbButton id={"btnCloseRestTable"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"100%",width:"100%",padding:"5px"}}
                                    onClick={()=>
                                    {
                                        this.popRestTable.hide()
                                    }}>
                                        <i className="text-white fa-solid fa-arrow-right-from-bracket" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row pt-2" style={{visibility:(this.state.showPage == 'table' ? "visible" : "hidden"),display:(this.state.showPage == 'table' ? "flex" : "none")}}>
                        <NbTableView parent={this} id="restTableView" 
                        onClick={async(e)=>
                        {
                            if(this.restTableView.items[e].ORDER_COUNT > 0)
                            {
                                if(typeof this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() != 'undefined' && this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() == true)
                                {
                                    if(this.posObj.posSale.dt().length > 0)
                                    {
                                        let tmpConfObj1 =
                                        {
                                            id:'msgAllreadySale',showTitle:true,title:this.lang.t("msgAllreadySale.title"),showCloseButton:true,width:'500px',height:'240px',
                                            button:[{id:"btn01",caption:this.lang.t("msgAllreadySale.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgAllreadySale.msg")}</div>)
                                        }
        
                                        await dialog(tmpConfObj1);
                                        return
                                    }
                                    this.setState({showPage:"detail"})
                                    let tmpData = new datatable()
                                    tmpData.selectCmd = 
                                    {
                                        query: "SELECT * FROM REST_ORDER_DETAIL_VW_01 WHERE ZONE = @ZONE AND STATUS <> 4 ORDER BY REF ASC",
                                        param: ['ZONE:string|50'],
                                        value: [this.restTableView.items[e].GUID]
                                    }
                                    await tmpData.refresh()
    
                                    if(tmpData[0].POS != '00000000-0000-0000-0000-000000000000')
                                    {
                                        let tmpUpdate = 
                                        {
                                            query : "UPDATE REST_ORDER_DETAIL SET STATUS = 4 WHERE POS = @POS " +
                                                    "UPDATE POS SET STATUS = 0 WHERE GUID = @POS ",
                                            param : ['POS:string|50','POS_SALE:string|50'],
                                            value : [tmpData[0].POS]
                                        }
                                        await this.core.sql.execute(tmpUpdate)
                                        this.getDoc(tmpData[0].POS)
                                        this.popRestTable.hide()
                                        return
                                    }
                                }
                                else
                                {
                                    this.setState({showPage:"detail"})
                                    let tmpData = new datatable()
                                    tmpData.selectCmd = 
                                    {
                                        query: "SELECT * FROM REST_ORDER_DETAIL_VW_01 WHERE ZONE = @ZONE AND STATUS <> 4 ORDER BY REF ASC",
                                        param: ['ZONE:string|50'],
                                        value: [this.restTableView.items[e].GUID]
                                    }
                                    await tmpData.refresh()
    
                                    await this.grdRestTableItem.dataRefresh({source:tmpData});
                                }
                            }
                            else
                            {
                                if(typeof this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() != 'undefined' && this.prmObj.filter({ID:'PosAddition',TYPE:0,USERS:this.user.CODE}).getValue() == true)
                                {
                                    let tmpConfObj1 =
                                    {
                                        id:'msgRestPosSaleAdd',showTitle:true,title:this.lang.t("msgRestPosSaleAdd.title"),showCloseButton:true,width:'500px',height:'240px',
                                        button:[{id:"btn01",caption:this.lang.t("msgRestPosSaleAdd.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgRestPosSaleAdd.btn02"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRestPosSaleAdd.msg")}</div>)
                                    }
    
                                    let tmpMsgResult1 = await dialog(tmpConfObj1);
    
                                    this.restOrderObj.clearAll()
                                    
                                    let tmpMaxRef = 0
                                    let tmpQuery = 
                                    {
                                        query : "SELECT ISNULL(MAX(REF),0) + 1 AS MAX_REF FROM REST_ORDER_VW_01 WHERE ZONE = @ZONE",
                                        param : ['ZONE:string|50'],
                                        value : [this.restTableView.items[e].GUID]
                                    }
                    
                                    let tmpResult = await this.core.sql.execute(tmpQuery)
                                    
                                    if(tmpResult.result.recordset.length > 0)
                                    {
                                        tmpMaxRef = tmpResult.result.recordset[0].MAX_REF
                                    }
                                    if(tmpMsgResult1 == "btn01")
                                    {
                                    
                                        let tmpRestQuery = 
                                        {
                                            query : "SELECT * FROM REST_ORDER_DETAIL WHERE POS = @POS ",
                                            param : ['POS:string|50'],
                                            value : [this.posObj.dt()[0].GUID]
                                        }
                        
                                        let tmpRestResult = await this.core.sql.execute(tmpRestQuery)
                                        
                                        if(tmpRestResult.result.recordset.length > 0)
                                        {
                                            console.log(tmpRestResult)
                                            await this.restOrderObj.load({ZONE:tmpRestResult.result.recordset[0].ZONE,REF:tmpRestResult.result.recordset[0].REF})
                                            this.restOrderObj.dt()[0].ZONE = this.restTableView.items[e].GUID
                                            if(tmpRestResult.result.recordset[0].ZONE != this.restTableView.items[e].GUID)
                                            {
                                                this.restOrderObj.dt()[0].REF = tmpMaxRef
                                            }
                                        }
                                        else
                                        {
                                            let tmpEmpty = {...this.restOrderObj.empty}
    
                                            tmpEmpty.ZONE = this.restTableView.items[e].GUID
                                            tmpEmpty.ZONE_CODE = this.restTableView.items[e].CODE
                                            tmpEmpty.ZONE_NAME = this.restTableView.items[e].NAME
                                            tmpEmpty.REF = tmpMaxRef
                                            tmpEmpty.PERSON = 1
                                            this.restOrderObj.addEmpty(tmpEmpty)
                                        }
                                        console.log(this.restOrderObj.restOrderDetail.dt())
                                        for (let i = 0; i < this.posObj.posSale.dt().length; i++) 
                                        {
                                            let tmpEmpty = this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})
                                            if(tmpEmpty.length > 0)
                                            {
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].QUANTITY = this.posObj.posSale.dt()[i].QUANTITY
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].PRICE = Number(this.posObj.posSale.dt()[i].PRICE)        
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].AMOUNT =  Number(Number(this.posObj.posSale.dt()[i].PRICE) * Number(this.posObj.posSale.dt()[i].QUANTITY)).round(2)
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].FAMOUNT = Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].AMOUNT).rateInNum(10)
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].DISCOUNT = 0
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].VAT = Number(Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].AMOUNT) - Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].FAMOUNT))
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].TOTAL = Number(Number(this.posObj.posSale.dt()[i].PRICE) * Number(this.posObj.posSale.dt()[i].QUANTITY)).round(2)
                                                this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].STATUS = 0
                                                this.posObj.posSale.dt()[i].AMOUNT = Number(Number(this.posObj.posSale.dt()[i].PRICE) * Number(this.posObj.posSale.dt()[i].QUANTITY)).round(2)
                                                this.posObj.posSale.dt()[i].FAMOUNT =Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].AMOUNT).rateInNum(10)
                                                this.posObj.posSale.dt()[i].VAT =  Number(Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].AMOUNT) - Number(this.restOrderObj.restOrderDetail.dt().where({POS_SALE:this.posObj.posSale.dt()[i].GUID})[0].FAMOUNT))
                                                this.posObj.posSale.dt()[i].VAT_RATE = 10
                                            }
                                            else
                                            {
                                                let tmpEmpty = {...this.restOrderObj.restOrderDetail.empty}
                                                tmpEmpty.REST_GUID = this.restOrderObj.dt()[0].GUID
                                                tmpEmpty.LINE_NO = this.restOrderObj.restOrderDetail.dt().max('LINE_NO') + 1
                                                tmpEmpty.ITEM = this.posObj.posSale.dt()[i].ITEM_GUID
                                                tmpEmpty.ITEM_CODE = this.posObj.posSale.dt()[i].ITEM_CODE
                                                tmpEmpty.ITEM_NAME = this.posObj.posSale.dt()[i].ITEM_NAME
                                                tmpEmpty.QUANTITY = this.posObj.posSale.dt()[i].QUANTITY
                                                tmpEmpty.PRICE = Number(this.posObj.posSale.dt()[i].PRICE)        
                                                tmpEmpty.AMOUNT = Number(Number(this.posObj.posSale.dt()[i].PRICE) * Number(this.posObj.posSale.dt()[i].QUANTITY)).round(2)
                                                tmpEmpty.FAMOUNT = Number(tmpEmpty.AMOUNT).rateInNum(10)
                                                tmpEmpty.DISCOUNT = 0
                                                tmpEmpty.VAT = Number(Number(tmpEmpty.AMOUNT) - Number(tmpEmpty.FAMOUNT))
                                                tmpEmpty.PROPERTY = '' 
                                                tmpEmpty.DESCRIPTION = ''
                                                tmpEmpty.TOTAL = tmpEmpty.AMOUNT
                                                tmpEmpty.STATUS = 0
                                                tmpEmpty.WAITING = 0
                                                tmpEmpty.PRINTED = 0
                                                tmpEmpty.POS = this.posObj.dt()[0].GUID
                                                tmpEmpty.POS_SALE = this.posObj.posSale.dt()[i].GUID
                                                this.posObj.posSale.dt()[i].AMOUNT = tmpEmpty.AMOUNT
                                                this.posObj.posSale.dt()[i].FAMOUNT = Number(tmpEmpty.AMOUNT).rateInNum(10)
                                                this.posObj.posSale.dt()[i].VAT = Number(Number(tmpEmpty.AMOUNT) - Number(tmpEmpty.FAMOUNT))
                                                this.posObj.posSale.dt()[i].VAT_RATE = 10
    
                                                await this.restOrderObj.restOrderDetail.addEmpty(tmpEmpty)
                                            }
                                        }
                                        console.log(this.restOrderObj.restOrderDetail.dt())
                                        this.restOrderObj.dt()[0].FAMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('FAMOUNT',2)).round(2))
                                        this.restOrderObj.dt()[0].AMOUNT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('AMOUNT',2)).round(2))
                                        this.restOrderObj.dt()[0].VAT = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('VAT',2)).round(2))
                                        this.restOrderObj.dt()[0].TOTAL = Number(parseFloat(this.restOrderObj.restOrderDetail.dt().sum('TOTAL',2)).round(2))
                                        await this.calcGrandTotal()
                                        this.posObj.dt()[0].STATUS = -1
                                        await this.posObj.save()
                                        await this.restOrderObj.save()
                                        await this.popRestTable.hide()
                                        this.init()
                                    }
                                    else
                                    {
                                        return
                                    }
                                }
                                else
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgTableEmptyAlert',showTitle:true,title:this.lang.t("msgTableEmptyAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgTableEmptyAlert.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgTableEmptyAlert.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj);
                                }
                               
                            }
                        }}
                        onPrintClick={async(e)=>
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
                                    'Ü': 'U', 'ü': 'u'
                                };
                            
                                return str.split('').map(char => turkishChars[char] || char).join('');
                            }
                            let isValidJSON = (value) =>
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

                            let tmpData = new datatable()
                            tmpData.selectCmd = 
                            {
                                query: "SELECT * FROM REST_ORDER_DETAIL_VW_01 WHERE ZONE = @ZONE AND STATUS <> 4 ORDER BY REF ASC",
                                param: ['ZONE:string|50'],
                                value: [this.restTableView.items[e].GUID]
                            }
                            await tmpData.refresh()

                            for (let i = 0; i < tmpData.length; i++) 
                            {
                                tmpData[i].ITEM_NAME = replaceTurkishChars(tmpData[i].ITEM_NAME)
                                tmpData[i].DESCRIPTION = replaceTurkishChars(tmpData[i].DESCRIPTION)
                                if(isValidJSON(tmpData[i].PROPERTY))
                                {
                                    tmpData[i].PROPERTY = JSON.parse(tmpData[i].PROPERTY).map(item => item.TITLE).join(', ')
                                    tmpData[i].PROPERTY = replaceTurkishChars(tmpData[i].PROPERTY)
                                }
                                
                            }

                            this.core.socket.emit('devprint','{"TYPE":"PRINT","PATH":"adisyon/AdisyonTicket.repx","DATA":' + JSON.stringify(tmpData.toArray()) + ',"PRINTER":"TP808"}',async(pResult) =>
                            {
                                console.log(pResult)
                            })
                            console.log(JSON.stringify(tmpData.toArray()))
                        }}>
                        </NbTableView>
                    </div>
                    <div className="row pt-2" style={{visibility:(this.state.showPage == 'detail' ? "visible" : "hidden"),display:(this.state.showPage == 'detail' ? "flex" : "none")}}>
                        <div className="col-12">
                            <div className="row pb-1">
                                <div className="col-12">
                                    <NdGrid parent={this} id={"grdRestTableItem"} 
                                    showBorders={true} 
                                    columnsAutoWidth={true} 
                                    allowColumnReordering={true} 
                                    allowColumnResizing={true} 
                                    height={"530px"} 
                                    width={"100%"}
                                    dbApply={false}
                                    selection={{mode:"multiple"}}
                                    loadPanel={{enabled:false}}
                                    onRowPrepared={(e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";   
                                            e.rowElement.style.fontSize = "15px"; 
                                        }
                                        else
                                        {
                                            e.rowElement.style.fontSize = "20px";
                                        }
                                    }}
                                    onCellPrepared={(e)=>
                                    {
                                        e.cellElement.style.padding = "8px"     
                                    }}
                                    onSelectionChanged={(e)=>
                                    {
                                        let tmpSeletionDt = new datatable()
                                        tmpSeletionDt.import(e.selectedRowsData)
                                        this.totalRowCountRestTable.value = tmpSeletionDt.length
                                        this.totalItemCountRestTable.value = tmpSeletionDt.length
                                        this.totalSubRestTable.value = tmpSeletionDt.sum('FAMOUNT',2)
                                        this.totalVatRestTable.value = tmpSeletionDt.sum('VAT',2)
                                        this.totalGrandRestTable.value = tmpSeletionDt.sum('TOTAL',2)
                                    }}
                                    >
                                        <Editing confirmDelete={false}/>
                                        <Column dataField="REF" caption={this.lang.t("grdRestTableItem.REF")} width={80}/>
                                        <Column dataField="ITEM_NAME" caption={this.lang.t("grdRestTableItem.ITEM_NAME")} width={600}/>
                                        <Column dataField="QUANTITY" caption={this.lang.t("grdRestTableItem.QUANTITY")} width={80} />
                                        <Column dataField="PRICE" caption={this.lang.t("grdRestTableItem.PRICE")} width={80} format={"#,##0.00" + Number.money.sign}/>
                                        <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdRestTableItem.TOTAL")} width={80} format={"#,##0.00" + Number.money.sign}/>                                                
                                    </NdGrid>
                                </div>
                            </div>
                            <div className="row py-2">
                                <div className="col-7 pe-1">
                                    <div className="row">
                                        <div className="col-5 pe-1">
                                            <p className="text-primary text-start m-0">{this.lang.t("totalLine")}<span className="text-dark"><NbLabel id={"totalRowCountRestTable"} parent={this} value={"0"}/></span></p>    
                                        </div>
                                        <div className="col-7 ps-1">
                                            <p className="text-primary text-start m-0">{this.lang.t("totalQuantity")}<span className="text-dark"><NbLabel id={"totalItemCountRestTable"} parent={this} value={"0"}/></span></p>    
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5 ps-1">
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="text-primary text-end m-0">{this.lang.t("amount")}<span className="text-dark"><NbLabel id={"totalSubRestTable"} parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <p className="text-primary text-end m-0">{this.lang.t("vat")}<span className="text-dark"><NbLabel id={"totalVatRestTable"} parent={this} value={"0.00 " + Number.money.sign} format={"currency"}/></span></p>    
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <NbButton id={"btnCancelRestTable"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"100%",width:"100%",padding:"5px"}}
                                    onClick={()=>
                                    {
                                        this.setState({showPage:"table"})
                                    }}>
                                        <i className="text-white fa-solid fa-circle-xmark" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                                <div className="col-6">
                                    <p className="fs-2 fw-bold text-center m-0"><NbLabel id={"totalGrandRestTable"} parent={this} value={"0.00"} format={"currency"}/></p>
                                </div>
                                <div className="col-3">
                                    <NbButton id={"btnSelectionRestTable"} parent={this} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",padding:"5px"}}
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgConvertPosAddition',showTitle:true,title:this.lang.t("msgConvertPosAddition.title"),showCloseButton:true,width:'500px',height:'240px',
                                            button:[{id:"btn01",caption:this.lang.t("msgConvertPosAddition.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgConvertPosAddition.btn02"),location:'after'}],
                                        }

                                        let tmpCount = this.grdRestTableItem.data.datatable.length - this.grdRestTableItem.getSelectedData().length
                                        
                                        if(this.posObj.posSale.dt().length > 0)
                                        {
                                            let tmpConfObj1 =
                                            {
                                                id:'msgRestPosSaleAdd',showTitle:true,title:this.lang.t("msgRestPosSaleAdd.title"),showCloseButton:true,width:'500px',height:'240px',
                                                button:[{id:"btn01",caption:this.lang.t("msgRestPosSaleAdd.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgRestPosSaleAdd.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgRestPosSaleAdd.msg")}</div>)
                                            }

                                            let tmpMsgResult1 = await dialog(tmpConfObj1);

                                            if(tmpMsgResult1 == "btn02")
                                            {
                                                return
                                            }
                                        }

                                        if(tmpCount > 0)
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgConvertPosAddition.msg",{ count: tmpCount })}</div>)
                                        }
                                        else
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgConvertPosAddition.msg1")}</div>)
                                        }
                                        
                                        let tmpMsgResult = await dialog(tmpConfObj);
                                        
                                        if(tmpMsgResult == "btn02")
                                        {
                                            return
                                        }
                                        
                                        for (let i = 0; i < this.grdRestTableItem.getSelectedData().length; i++) 
                                        {
                                            let tmpItemsDt = await this.getItemDb(this.grdRestTableItem.getSelectedData()[i].ITEM_CODE)
                                            if(tmpItemsDt.length > 0)
                                            {
                                                tmpItemsDt[0].PRICE = Number(this.grdRestTableItem.getSelectedData()[i].PRICE).round(2)
                                                tmpItemsDt[0].QUANTITY = Number(this.grdRestTableItem.getSelectedData()[i].QUANTITY).round(2)
                                                await this.saleAdd(tmpItemsDt[0])

                                                let tmpUpdate = 
                                                {
                                                    query : "UPDATE REST_ORDER_DETAIL SET STATUS = 4,POS = @POS, POS_SALE = @POS_SALE WHERE GUID = @GUID",
                                                    param : ['GUID:string|50','POS:string|50','POS_SALE:string|50'],
                                                    value : [this.grdRestTableItem.getSelectedData()[i].GUID,this.posObj.dt()[0].GUID,this.posObj.posSale.dt()[this.posObj.posSale.dt().length - 1].GUID]
                                                }
                                                await this.core.sql.execute(tmpUpdate)
                                            }
                                        }
                                        this.popRestTable.hide()
                                    }}>
                                        <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </NbPopUp>
            </div>
        </NdLayoutItem>
    )
}