import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js';
import '../css/itemInfoScreen.css'


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
        
    }
    render()
    {
        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <img src="./css/img/piqlogo.png" />
                    </div>
                    <div className="col-6 px-5">
                        <img src="pos\resources\logoProInter.png" className="float-end" alt="Logo"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="infoContainer">
                            <div className="row">
                                <div className="col-4">
                                    <div className="productImg">
                                        IMAGE:
                                    </div>                    
                                    <div className="productCodeBarre">
                                        CODEBARRE:
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="productName">
                                        NAME:
                                    </div>
                                    <div className="productData">
                                        DATA
                                    </div>                      
                                </div>
                            </div>
                            <button type="button" className="btn btn-success">VALIDER</button>
                        </div>              
                    </div>
                </div>
            </div>
        )
    }
}