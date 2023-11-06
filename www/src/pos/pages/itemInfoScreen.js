import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

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
        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }
    async componentDidMount()
    {
        const barcodeValue = '123456789'; // Barkodun değeri
        const canvas = document.getElementById('barcode');
        JsBarcode(canvas, barcodeValue);
    }
    render() 
    {
        return (
            <div>
                <div className="row g-0 px-5" style={{height:"18%"}}>
                    <div className="col-md-6 px-2" style={{display:"flex",alignItems:"center"}}>
                        <img src="./css/img/piqsoftlogo.png" className="img-fluid h-75" alt="Logo"/>
                    </div>
                    <div className="col-md-6 px-2" style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        <img src="pos/resources/logop.png" className="float-end img-fluid h-75" alt="Logo" />
                    </div>
                </div>
                <div className="row g-0 p-3" style={{height:"82%"}}>
                    <div className="col-12" style={{backgroundColor:"#000C66",height:"100%",borderRadius:"10px"}}>
                        <div className="row g-0 p-2" style={{height:"100%"}}>
                            <div className="col-4" style={{color:"white"}}>
                                <div className="row g-0" style={{height:"70%"}}>
                                    <div className="col-12" style={{backgroundColor:"white",borderRadius:"10px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                        <img src="./css/img/en.png" className="img-fluid h-75" alt="Logo"/>
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
                                    <div className="col-12">
                                        <h1 className="text-center" style={{letterSpacing:"10px"}}>LAVETTE MICROFIBRE MULTI-USAGES 30X30CM</h1>
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