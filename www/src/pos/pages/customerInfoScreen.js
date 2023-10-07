import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'

export default class customerInfoScreen extends React.PureComponent
{
    constructor()
    {
        super()

        this.core = App.instance.core
        this.t = App.instance.lang.getFixedT(null,null,"pos");
        this.lang = App.instance.lang;
        this.prmObj = new param(prm)
        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()

        setInterval(()=>
        {
            this.txtTime.value = moment(new Date(),"DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss")
        },1000)
    }
    async componentDidMount()
    {
        if(this.core.util.isElectron())
        {
            App.instance.electron.ipcRenderer.on('receive', async(event, data) => 
            {
                this.txtCustomer.value = data.data.posObj[0].CUSTOMER_NAME
                this.totalRowCount.value = data.data.posObj.length
                this.totalItemCount.value = data.data.totalItemQ
                this.totalLoyalty.value = data.data.posObj[0].LOYALTY
                this.txtTicRest.value = data.data.cheqLength + '/' + parseFloat(data.data.cheqTotal).round(2) + ' ' + Number.money.sign
                this.totalSub.value = data.data.posObj[0].FAMOUNT
                this.totalVat.value = data.data.posObj[0].VAT
                this.totalDiscount.value = Number(data.data.posObj[0].DISCOUNT) * -1
                this.totalGrand.value = data.data.grandTotal

                await this.grdList.dataRefresh({source:data.data.posSaleObj});
            });
        }
    }
    render()
    {
        return (
            <div>
                <div className="row" style={{backgroundColor:"#0984e3",height:"60px"}}>
                    <div className="col-8 ps-4 align-middle" style={{margin:"auto",color:"white",fontSize:"18px",fontWeight:"bold"}}>
                        <NbLabel id="txtCustomer" parent={this} value={""}/>
                    </div>
                    <div className="col-4 align-middle" style={{textAlign:"center",margin:"auto",color:"white",fontSize:"18px",fontWeight:"bold"}}>
                        <NbLabel id="txtTime" parent={this} value={""}/>
                    </div>
                </div>
                <div className="row" style={{height:"70%"}}>
                    <div className="col-12 py-2" style={{paddingLeft:"18px",paddingRight:"18px"}}>
                        <NdGrid parent={this} id={"grdList"} 
                        showBorders={true} 
                        columnsAutoWidth={false} 
                        allowColumnResizing={true} 
                        allowColumnReordering={false}
                        height={"100%"} 
                        width={"100%"}
                        dbApply={false}
                        selection={{mode:"single"}}
                        loadPanel={{enabled:false}}
                        sorting={{ mode: 'none' }}
                        onRowPrepared={(e)=>
                        {                                    
                            if(e.rowType == "header")
                            {
                                e.rowElement.style.fontWeight = "bold";    
                            }
                            e.rowElement.style.fontSize = "15px";
                            if(e.rowType == "data")
                            {
                                if(e.data.PROMO_TYPE > 1)
                                {
                                    e.rowElement.style.backgroundColor = "#00cec9";
                                }
                                else
                                {
                                    e.rowElement.style.backgroundColor = "white";
                                }
                            }
                        }}
                        onCellPrepared={(e)=>
                        {                                    
                            e.cellElement.style.padding = "4px"                                    
                            if(e.rowType == 'data' && e.column.dataField == 'AMOUNT')
                            {
                                e.cellElement.style.fontWeight = "bold";
                            }
                        }}
                        >
                            <Editing confirmDelete={false}/>
                            <Scrolling mode="standard" />
                            <Paging defaultPageSize={5} />
                            <Column dataField="LDATE" caption={this.lang.t("grdList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false} cssClass={"cell-fontsize"}/>
                            <Column dataField="NO" caption={""} width={"5%"} cellTemplate={(cellElement,cellInfo)=>
                            {
                                //cellElement.innerText = this.posObj.posSale.dt().length - cellInfo.rowIndex
                            }}
                            alignment={"center"} cssClass={"cell-fontsize"}/>                                    
                            <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={"60%"} cssClass={"cell-fontsize"}/>
                            <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={"10%"} cellRender={(e)=>{return (e.data.SCALE_MANUEL == true ? "M-" : "") + (e.data.UNIT_SHORT == 'kg' ? Number(e.value / e.data.UNIT_FACTOR).round(2) : Number(e.value / e.data.UNIT_FACTOR).round(0)) + e.data.UNIT_SHORT}} format={"#,##0.000" } cssClass={"cell-fontsize"}/>
                            <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={"10%"} cellRender={(e)=>{return Number(e.value * e.data.UNIT_FACTOR).round(2) + Number.money.sign + '/' + e.data.UNIT_SHORT}} cssClass={"cell-fontsize"}/>
                            <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={"15%"} format={"#,##0.00" + Number.money.sign} cssClass={"cell-fontsize"}/>                                                
                        </NdGrid>
                    </div>
                </div>
                {/* Grand Total */}
                <div className="row p-2">
                    <div className="col-6">
                        <div className="row">
                            <div className="col-6">
                                <p className="fs-4 text-primary text-start m-0">{this.lang.t("totalLine")}<span className="text-dark"><NbLabel id="totalRowCount" parent={this} value={"0"}/></span></p>    
                            </div>
                            <div className="col-6">
                                <p className="fs-4 text-primary text-start m-0">{this.lang.t("totalQuantity")}<span className="text-dark"><NbLabel id="totalItemCount" parent={this} value={"0"}/></span></p>    
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-4 text-primary text-start m-0">{this.lang.t("loyaltyDiscount")}<span className="text-dark"><NbLabel id="totalLoyalty" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-4 text-primary text-start m-0">{this.lang.t("ticketRect")}<span className="text-dark"><NbLabel id="txtTicRest" parent={this} value={""}/></span></p>    
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-4 text-primary text-end m-0">{this.lang.t("amount")}<span className="text-dark"><NbLabel id="totalSub" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-4 text-primary text-end m-0">{this.lang.t("vat")}<span className="text-dark"><NbLabel id="totalVat" parent={this} value={"0.00 " + Number.money.sign} format={"currency"}/></span></p>    
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-4 text-primary text-end m-0">{this.lang.t("discount")}<span className="text-dark"><NbLabel id="totalDiscount" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row p-2">
                    <div className="col-12">
                        <p className="fs-1 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12' style={{textAlign:"right"}}>
                        <img src="./css/img/piqsoftlogo.png" height="32px"/>
                    </div>
                </div>
            </div>
        )
    }
}