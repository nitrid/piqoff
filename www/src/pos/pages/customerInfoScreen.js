import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'
import LCD from 'dot-matrix-lcd'
export default class customerInfoScreen extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core
        this.t = App.instance.lang.getFixedT(null,null,"pos");
        this.lang = App.instance.lang;
        this.prmObj = new param(prm)
        this.state = {digit : false}

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
                if(typeof data.data != "undefined")
                {
                    this.txtCustomer.value = data.data.posObj[0].CUSTOMER_NAME.toString().substring(0,45)
                    this.txtPoint.value = data.data.posObj[0].CUSTOMER_POINT
                    this.totalGrand.value = data.data.grandTotal
    
                    await this.grdList.dataRefresh({source:data.data.posSaleObj});
                }
                else if(typeof data.digit != "undefined")
                {
                    if(!this.state.digit)
                    {
                        this.setState({digit:true})
                    }

                    this.lcd.writeString({string:data.digit, offset:0})
                    
                    setTimeout(() => 
                    {
                        this.lcd.clearScreen()
                        this.setState({digit:false})
                    }, 1500);
                }
            });
        }
        this.lcd = new LCD(
        {
            elem: document.getElementById("lcd-container"),
            rows: 2, // number of character rows on the LCD screen
            columns: 20, // number of character columns on the LCD screen
            pixelSize: 4, // size of each pixel
            pixelColor: "#000", // color of the pixel
        });
    }
    isUnitDecimal(pUnit)
    {
        if(pUnit.toLowerCase() == 'kg' || pUnit.toLowerCase() == 'm')
        {
            return true
        }
        return false
    }
    render()
    {
        return (
            <div>
                <div style={{position:'absolute',zIndex:1500,width:"100%",height:"100%",backgroundColor:"black",justifyContent:"center",alignItems:"center",display:"flex",visibility:this.state.digit ? 'visible' : 'hidden'}}>
                    <div id="lcd-container" className="lcd-container"></div>
                </div>
                <div className="row g-0" style={{backgroundColor:"#0984e3",height:"15%"}}>
                    <div className="col-1" style={{textAlign:"center",margin:"auto"}}>
                        <img src="./css/img/logo.png" width="70%" height="70%"/>
                    </div>
                    <div className="col-8 ps-4 align-middle" style={{margin:"auto",color:"white",fontSize:"24px",fontWeight:"bold"}}>
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
                <div className="row g-0" style={{height:"70%"}}>
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
                            <Column dataField="ITEM_SNAME" caption={this.lang.t("grdList.ITEM_NAME")} width={"50%"} cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="QUANTITY" caption={this.lang.t("grdList.QUANTITY")} width={"15%"} cellRender={(e)=>{return (e.data.SCALE_MANUEL == true ? "M-" : "") + (this.isUnitDecimal(e.data.UNIT_SHORT) ? Number(e.value / e.data.UNIT_FACTOR).round(3).toFixed(3) : Number(e.value / e.data.UNIT_FACTOR).round(0)) + e.data.UNIT_SHORT}} format={"#,##0.000" } cssClass={"lcd-cell-fontsize"}/>
                            <Column dataField="PRICE" caption={this.lang.t("grdList.PRICE")} width={"15%"} cssClass={"lcd-cell-fontsize"}
                            cellRender={(e)=>
                            {
                                let tmpVal = e.data.DISCOUNT != 0 ? e.value - Number(e.data.DISCOUNT / e.data.QUANTITY).round(2) : e.value
                                return Number(tmpVal * e.data.UNIT_FACTOR).round(2).toFixed(2) + Number.money.sign + '/' + e.data.UNIT_SHORT
                            }}/>
                            <Column dataField="AMOUNT" alignment={"right"} caption={this.lang.t("grdList.AMOUNT")} width={"15%"} format={"#,##0.00" + Number.money.sign} cssClass={"lcd-cell-fontsize"}
                            cellRender={(e)=>
                            {
                                return Number(e.value - e.data.DISCOUNT).round(2).toFixed(2) + Number.money.sign
                            }}
                            />                                                
                        </NdGrid>
                    </div>
                </div>
                {/* Grand Total */}
                <div className="row g-0" style={{height:"50%"}}>
                    <div className="col-12">
                        <div className="row p-2 g-0">
                            <div className="col-12">
                                <p className="h1 fs-1 fw-bold text-center m-0"><NbLabel id="totalGrand" parent={this} value={"0.00"} format={"currency"}/></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}