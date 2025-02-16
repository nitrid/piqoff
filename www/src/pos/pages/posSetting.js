import React from "react";
import App from "../lib/app.js";

import NbButton from "../../core/react/bootstrap/button.js";

export default class posSetting extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core
        this.lang = App.instance.lang
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.acsObj = App.instance.acsObj

        // NUMBER İÇİN PARAMETREDEN PARA SEMBOLÜ ATANIYOR.
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }
    render()
    {
        return (
            <React.Fragment>
                <div className="row pt-2 px-2" style={{'--bs-gutter-x': '0.0rem'}}>
                    <div className="col-3 pe-1">
                        <NbButton id={"btnItemsList"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('itemsList')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posItemsList")}</span>
                        </NbButton>
                    </div>
                    <div className="col-3 px-1">
                        <NbButton id={"btnSaleReport"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('posSaleReport')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posSaleReport")}</span>
                        </NbButton>
                    </div>
                    <div className="col-3 px-1">
                        <NbButton id={"btnCustomerPointReport"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('posCustomerPointReport')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posCustomerPointReport")}</span>
                        </NbButton>
                    </div>
                    <div className="col-3 ps-1">
                        <NbButton id={"btnTicketEndDescription"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('posTicketEndDescription')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posTicketEndDescription")}</span>
                        </NbButton>
                    </div>
                </div>
                <div className="row pt-2 px-2" style={{'--bs-gutter-x': '0.0rem'}}>
                    <div className="col-3 pe-1">
                        <NbButton id={"btnGroupSaleReport"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('posGrpSalesReport')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posGroupSaleReport")}</span>
                        </NbButton>
                    </div>
                    <div className="col-3 px-1">
                        <NbButton id={"btnCompanyInfo"} parent={this} className="form-group btn btn-primary btn-block" 
                        style={{height:"100px",width:"100%"}}
                        onClick={() => App.instance.setPage('posCompanyInfo')}>
                            <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>{this.lang.t("posSettings.posCompanyInfo")}</span>
                        </NbButton>
                    </div>
                </div>
                <div style={{position: "absolute", bottom: "0", width: "100%", padding: "10px"}}>
                    <NbButton id={"btnExit"} parent={this} className="form-group btn btn-danger btn-block" 
                    style={{height:"80px",width:"100%"}}
                    onClick={() => App.instance.setPage('')}>
                        <span style={{fontSize: "18px", fontWeight: "bold", color: "#ffffff"}}>Çıkış</span>
                    </NbButton>
                </div>
            </React.Fragment>
            
        )
    }
}