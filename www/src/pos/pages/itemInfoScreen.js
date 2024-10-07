import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js';
import JsBarcode from 'jsbarcode';

export default class itemInfoScreen extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core
        this.t = App.instance.lang.getFixedT(null,null,"pos");
        this.lang = App.instance.lang;
        this.prmObj = new param(prm)
        this.state = 
        {
            splash : true,
            name : "",
            price : "",
            under_unit : "",
            itemImg : "",
            timeout : this.timeout
        }
        this.barcode = "";
        this.timeout = 30
        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0,USERS:this.core.auth.data.CODE}).getValue()
        this.pricingListNo = this.prmObj.filter({ID:'PricingListNo',TYPE:0,USERS:this.core.auth.data.CODE}).getValue()

        document.addEventListener("keydown", (function(event) 
        {
            if (event.key === "Enter") 
            {
                this.getItem(this.barcode)
                this.barcode = ""
            }
            else
            {
                if (!event.ctrlKey && !event.altKey && !event.shiftKey && event.key !== "Backspace" && event.key !== "Delete") 
                {
                    this.barcode += event.key;
                }
            }
        }).bind(this));

        setInterval(()=>
        {
            if(this.state.timeout != 0 && this.state.splash == false)
            {
                this.setState({timeout:this.state.timeout - 1})
            }
            else
            {
                this.setState(
                {
                    splash : true,
                    name : "",
                    price : "",
                    under_unit : "",
                    itemImg : "",
                    timeout : this.timeout
                })
            }
            
        },1000)
    }
    async componentDidMount()
    {
        let tmpLoginResult = await this.core.auth.login('kiosk','kiosk','POS')
        if(!tmpLoginResult)
        {
            console.log("Login failed")
        }
    }
    getItemDb(pCode)
    {
        return new Promise(async resolve => 
        {
            let tmpDt = new datatable(); 
            tmpDt.selectCmd = 
            {
                query : "SELECT TOP 1 " +  
                        "NAME, " +  
                        "UNIT_NAME, " +  
                        "ROUND((SELECT dbo.FN_PRICE(ITEM.GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',@LIST_NO,0,1)),2) AS PRICE, " +  
                        "ISNULL((SELECT TOP 1 SYMBOL FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = ITEM.GUID AND TYPE = 1),'') AS UNDER_UNIT_SYMBOL, " +  
                        "ISNULL((SELECT TOP 1 FACTOR FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = ITEM.GUID AND TYPE = 1),'') AS UNDER_UNIT_FACTOR, " +  
                        "ISNULL((SELECT TOP 1 IMAGE FROM ITEM_IMAGE WHERE ITEM = ITEM.GUID),'') AS IMAGE " +  
                        "FROM ITEMS_POS_VW_01 AS ITEM WHERE CODE = @CODE OR BARCODE = @CODE AND STATUS = 1",
                param : ['CODE:string|25','LIST_NO:int'],
                value: [pCode,this.pricingListNo],
            }
            await tmpDt.refresh();            
            resolve(tmpDt)
        });
    }
    async getItem(pBarcode)
    {
        if(pBarcode != "")
        {
            let tmpItemsDt = await this.getItemDb(pBarcode)
            if(tmpItemsDt.length > 0)
            {
                this.setState(
                {
                    splash : false,
                    name : tmpItemsDt[0].NAME,
                    price : Number(tmpItemsDt[0].PRICE).toFixed(2) + Number.money.sign + " / " + tmpItemsDt[0].UNIT_NAME,
                    under_unit : (Number(tmpItemsDt[0].UNDER_UNIT_FACTOR) / Number(tmpItemsDt[0].PRICE)).toFixed(2) + Number.money.sign + " / " + Number(tmpItemsDt[0].UNDER_UNIT_FACTOR).toFixed(3) + tmpItemsDt[0].UNDER_UNIT_SYMBOL,
                    itemImg : tmpItemsDt[0].IMAGE,
                    timeout : this.timeout
                })
                const canvas = document.getElementById('barcode');
                JsBarcode(canvas, pBarcode);
            }
            else
            {
                let tmpConfObj =
                {
                    id:'msgBarcodeNotFound',
                    timeout:2000,
                    showTitle:true,
                    title:this.lang.t("msgBarcodeNotFound.title"),
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgBarcodeNotFound.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgBarcodeNotFound.msg")}</div>)
                }
                dialog(tmpConfObj);
            }
        }
    }
    render() 
    {
        return (
            <div style={{backgroundColor:"rgb(44 35 98)"}}>
                <div style={{position:'absolute',zIndex:1500,width:"100%",height:"100%",backgroundColor:"rgb(44 35 98)",justifyContent:"center",alignItems:"center",display:"flex",visibility:this.state.splash ? 'visible' : 'hidden'}}>
                    <div className="row g-0">
                        <div className="col-12">
                            <div className="row g-0 py-5">
                                <div className="col-12 d-flex align-items-center justify-content-center">
                                    <img src="./css/img/itemInfoLogo.jpeg" className="img-fluid h-75" alt="Logo"/>
                                </div>
                            </div>
                            <div className="row g-0">
                                <div className="col-12">
                                    <h1 className="text-center" style={{fontSize:"50px",color:"#ffeaa7"}}>{this.lang.t("itemInfo.msgSplash")}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-0 px-5" style={{height:"18%"}}>
                    <div className="col-12 px-2" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <img src="./css/img/itemInfoLogo.jpeg" className="img-fluid" width={"700px"} alt="Logo"/>
                    </div>
                </div>
                <div className="row g-0 p-3" style={{height:"82%"}}>
                    <div className="col-12" style={{backgroundColor:"rgb(44 35 98)",height:"100%",borderRadius:"10px"}}>
                        <div className="row g-0 p-2" style={{height:"100%"}}>
                            <div className="col-4" style={{color:"white"}}>
                                <div className="row g-0" style={{height:"70%"}}>
                                    <div className="col-12" style={{backgroundColor:"white",borderRadius:"10px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                    {
                                        this.state.itemImg != "" ? (<img src={this.state.itemImg} className="img-fluid h-75" alt="Logo" />) : (<p></p>)
                                    }
                                    </div>
                                </div>
                                <div className="row g-0 pt-2" style={{height:"30%"}}>
                                    <div className="col-12" style={{backgroundColor:"white",borderRadius:"10px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        <canvas id="barcode"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div className="col-8" style={{color:"white"}}>
                                <div className="row g-0 px-2" style={{height:"30%"}}>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <h1 className="text-center" style={{letterSpacing:"10px"}}>{this.state.name}</h1>
                                    </div>
                                </div>
                                <div className="row g-0 px-2" style={{height:"60%"}}>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <h1 className="text-center" style={{fontSize:"50px",color:"#ffeaa7"}}>{this.state.price}</h1>
                                    </div>
                                </div>
                                <div className="row g-0 px-2" style={{height:"10%"}}>
                                    <div className="col-10 d-flex align-items-center">
                                        <h3 className="text-left">{this.state.under_unit}</h3>
                                    </div>
                                    <div className="col-2 d-flex align-items-center">
                                        <NbButton id={"btnOk"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.setState(
                                            {
                                                splash : true,
                                                name : "",
                                                price : "",
                                                under_unit : "",
                                                itemImg : "",
                                                timeout : this.timeout
                                            })
                                        }}>
                                            {"OK - " + this.state.timeout + "s"}
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}