import React from "react";
import App from "../lib/app.js";
import moment from 'moment';

import NbLabel from "../../core/react/bootstrap/label.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js';


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
            <div className="container-fluid" style={{ backgroundColor: '#0B2559' }}>
                <div className="row">
                    <div className="col-md-6">
                    <img src="./css/img/piqlogo.png" className="img-fluid" alt="Logo" />
                    </div>
                    <div className="col-md-6 px-5">
                    <img src="pos/resources/logoProInter.png" className="float-end img-fluid" alt="Logo" />
                    </div>
                </div>
                <div className="row pt-2">
                    <div className="col-md-4">
                        <div className="card" style={{ width: '18rem',height: '20rem', }}>
                            <div className="card-body">
                            IMAGE:
                            </div>
                        </div>
                        <div className="card mt-3" style={{ width: '18rem',height: '10rem' }}>
                            <div className="card-body">
                            CODEBARRE:
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card" style={{ height: '18rem', backgroundColor: 'transparent', border: '1px solid aliceblue' }}>
                            <div className="card-body">
                            NAME:
                            </div>
                        </div>
                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="col-12">
                                    <div className="row" style={{height: '8rem'}}>
                                        <div className="col-7">
                                            UNIT
                                        </div>
                                        <div className="col-5">
                                            PRICE
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="offset-7 col-5">
                                           SUBUNIT
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-5">
                    <div className="col-12">
                    <button type="button" className="btn btn-primary mt-3">VALIDER</button>
                    </div>
                </div>
                <div className="row" style={{height:'15rem'}}/>
            </div>
        );
    }
}