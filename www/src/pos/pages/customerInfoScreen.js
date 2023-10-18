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
                this.txtCustomer.value = data.data.posObj[0].CUSTOMER_NAME.toString().substring(0,45)
                this.txtPoint.value = data.data.posObj[0].CUSTOMER_POINT
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
                <div className="row g-0" style={{backgroundColor:"#0984e3",height:"10%"}}>
                    <div className="col-1" style={{textAlign:"center",margin:"auto"}}>
                        <img src="./css/img/logo.png" width="70%" height="70%"/>
                    </div>
                    <div className="col-8 ps-4 align-middle" style={{margin:"auto",color:"white",fontSize:"16px",fontWeight:"bold"}}>
                        <div className="row g-0">
                            <div className="col-12">
                                <span className="text-white"><i className="text-white fa-solid fa-circle-user pe-2"></i><NbLabel id="txtCustomer" parent={this} value={""}/></span>
                            </div>
                        </div>
                        <div className="row g-0">
                            <div className="col-12">
                                <span className="text-light"><i className="text-light fa-solid fa-user-plus pe-2"></i><NbLabel id="txtPoint" parent={this} value={""}/></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 pe-2 align-middle" style={{textAlign:"right",margin:"auto",color:"white",fontSize:"18px",fontWeight:"bold"}}>
                        <NbLabel id="txtTime" parent={this} value={""}/>
                    </div>
                </div>
                <div className="row g-0" style={{height:"59%"}}>
                    <div className="col-12 p-2">
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
                            <Paging defaultPageSize={6} />
                            <Column dataField="LDATE" caption={this.lang.t("grdList.LDATE")} width={40} alignment={"center"} dataType={"datetime"} format={"dd-MM-yyyy - HH:mm:ss SSSZ"} defaultSortOrder="desc" visible={false} cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="NO" caption={""} width={"5%"} cellTemplate={(cellElement,cellInfo)=>
                            {
                                //cellElement.innerText = this.posObj.posSale.dt().length - cellInfo.rowIndex
                            }}
                            alignment={"center"} cssClass={"lcd-cell-fontsize"}/>                                    
                            <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={"50%"} cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={"15%"} cellRender={(e)=>{return (e.data.SCALE_MANUEL == true ? "M-" : "") + (e.data.UNIT_SHORT == 'kg' ? Number(e.value / e.data.UNIT_FACTOR).round(2) : Number(e.value / e.data.UNIT_FACTOR).round(0)) + e.data.UNIT_SHORT}} format={"#,##0.000" } cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={"15%"} cellRender={(e)=>{return Number(e.value * e.data.UNIT_FACTOR).round(2) + Number.money.sign + '/' + e.data.UNIT_SHORT}} cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={"15%"} format={"#,##0.00" + Number.money.sign} cssClass={"lcd-cell-fontsize"}/>                                                
                        </NdGrid>
                    </div>
                </div>
                {/* Grand Total */}
                <div className="row g-0" style={{height:"30%"}}>
                    <div className="col-12">
                        <div className="row p-2 g-0" style={{height:"60%"}}>
                            <div className="col-6">
                                <div className="row g-0">
                                    <div className="col-6">
                                        <p className="fs-4 text-primary text-start m-0">{this.lang.t("totalLine")}<span className="text-dark"><NbLabel id="totalRowCount" parent={this} value={"0"}/></span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="fs-4 text-primary text-start m-0">{this.lang.t("totalQuantity")}<span className="text-dark"><NbLabel id="totalItemCount" parent={this} value={"0"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row g-0">
                                    <div className="col-12">
                                        <p className="fs-4 text-primary text-start m-0">{this.lang.t("loyaltyDiscount")}<span className="text-dark"><NbLabel id="totalLoyalty" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row g-0">
                                    <div className="col-12">
                                        <p className="fs-4 text-primary text-start m-0">{this.lang.t("ticketRect")}<span className="text-dark"><NbLabel id="txtTicRest" parent={this} value={""}/></span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row g-0">
                                    <div className="col-12">
                                        <p className="fs-4 text-primary text-end m-0">{this.lang.t("amount")}<span className="text-dark"><NbLabel id="totalSub" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row g-0">
                                    <div className="col-12">
                                        <p className="fs-4 text-primary text-end m-0">{this.lang.t("vat")}<span className="text-dark"><NbLabel id="totalVat" parent={this} value={"0.00 " + Number.money.sign} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                                <div className="row g-0">
                                    <div className="col-12">
                                        <p className="fs-4 text-primary text-end m-0">{this.lang.t("discount")}<span className="text-dark"><NbLabel id="totalDiscount" parent={this} value={"0.00"} format={"currency"}/></span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row p-2 g-0" style={{height:"30%"}}>
                            <div className="col-12">
                                <p className="fs-1 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}