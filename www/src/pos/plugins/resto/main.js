import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NbPopUp from '../../../core/react/bootstrap/popup';
import NbTableView from './tools/tableView.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../../core/react/devex/grid.js";
import NbLabel from "../../../core/react/bootstrap/label.js";
import posDoc from '../../pages/posDoc.js';
import { datatable } from "../../../core/core.js";
import NdDialog,{ dialog } from "../../../core/react/devex/dialog.js";
import NbPopNumber from "../../tools/popnumber.js";

import {prm} from './meta/prm.js'
import {acs} from './meta/acs.js'

const orgLoadPos = App.prototype.loadPos
const orgInit = posDoc.prototype.init
const orgDelete = posDoc.prototype.delete
const orgRowDelete = posDoc.prototype.rowDelete
const orgComponentWillMount = posDoc.prototype.componentWillMount
const orgRender = posDoc.prototype.render

App.prototype.loadPos = async function()
{
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./meta/lang/${tmpLang}.js`)
    
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
    orgRowDelete.call(this)
}
posDoc.prototype.delete = async function()
{
    let tmpUpdateQ = 
    {
        query : `UPDATE REST_ORDER_DETAIL SET STATUS = 3, POS = '00000000-0000-0000-0000-000000000000', POS_SALE = '00000000-0000-0000-0000-000000000000' 
                 WHERE POS = @POS`,
        param : ['POS:string|50'],
        value : [this.posObj.dt()[0].GUID]
    }
    await this.core.sql.execute(tmpUpdateQ)

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
                                    console.log(this.state.restTableGrp)
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