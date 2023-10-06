import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'

export default class posLcd extends React.PureComponent
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
        await this.grdList.dataRefresh({source:[{ITEM_SNAME:"DENEME",QUANTITY:1,PRICE:10,AMOUNT:10}]});

        if(this.core.util.isElectron())
        {
            const ipcMain = global.require('electron');
            // Uygulama 1'den veriyi iste
            console.log(ipcMain)
            ipcMain.ipcRenderer.on('share-data', (event, data) => {
                // Veriyi al ve işle
                console.log(data);
              });
        }
    }
    render()
    {
        return (
            <div>
                <div className="row" style={{backgroundColor:"#0984e3",height:"60px"}}>
                    <div className="col-8 ps-4 align-middle" style={{margin:"auto",color:"white",fontSize:"18px",fontWeight:"bold"}}>
                        <NbLabel id="txtCustomer" parent={this} value={"ALI KEMAL KARACA"}/>
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
                <div className="row">
                    <div className="col-12 py-2 align-middle" style={{textAlign:"right",margin:"auto",paddingLeft:"18px",paddingRight:"18px",fontSize:"30px",fontWeight:"bold"}}>
                        <NbLabel id="txtTotal" parent={this} value={"TOTAL : 10.00€"}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12' style={{textAlign:"center"}}>
                        <img src="./css/img/piqsoftlogo.png" height="28px"/>
                    </div>
                </div>
            </div>
        )
    }
}