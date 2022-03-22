import React from "react";
import App from "../lib/app.js";

import Form, { Label,Item } from "devextreme-react/form";
import { ButtonGroup } from "devextreme-react/button-group";

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from "../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NbNumberboard from "../tools/numberboard.js";
import NbKeyboard from "../tools/keyboard.js";
import NbCalculator from "../tools/calculator.js";
import NbPopUp from "../../core/react/bootstrap/popup.js";
import NdDatePicker from "../../core/react/devex/datepicker.js";
import NdSelectBox from "../../core/react/devex/selectbox.js";
import NbPluButtonGrp from "../tools/plubuttongrp.js";
import { dialog } from "../../core/react/devex/dialog.js";

import { posCls,posSaleCls,posPaymentCls,posPluCls } from "../../core/cls/pos.js";
import { itemsCls } from "../../core/cls/items.js";
import { dataset,datatable,param,access } from "../../core/core.js";
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

export default class posDoc extends React.Component
{
    constructor()
    {
        super() 
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.t = App.instance.lang.getFixedT(null,null,"pos")
        this.prmObj = new param(prm);

        this.state =
        {
            isPluEdit:false,
            isBtnGetCustomer:false,
            isBtnInfo:false
        }      
        document.onkeydown = (e) =>
        {
            //EĞER TXTBARCODE ELEMENT HARİCİNDE BAŞKA BİR İNPUT A FOKUSLANILMIŞSA FONKSİYONDAN ÇIKILIYOR.
            if(document.activeElement.type == 'text' && document.activeElement.parentElement.parentElement.parentElement.id != 'txtBarcode')
            {
                return
            }
            
            this.txtBarcode.focus()
            if(e.which == 38) //UP
            {
                
            }
            else if(e.which == 40) //DOWN
            {
                
            }
            else if(e.which == 123) //F12
            {
                
            }
        }     
        
        this.init()
    }
    async componentDidMount()
    {        
        
    }
    async init()
    {
        await this.prmObj.load({PAGE:"pos",APP:'POS'})        
    }
    async getItem(pCode)
    {
        let tmpQuantity = 1
        let tmpPrice = 0
        if(pCode == '')
        {
            return
        }
        //EĞER CARİ SEÇ BUTONUNA BASILDIYSA CARİ BARKODDAN SEÇİLECEK.
        if(this.state.isBtnGetCustomer)
        {

        }
        //******************************************************** */
        //BARKOD X MİKTAR İŞLEMİ.
        if(pCode.indexOf("*") != -1)
        {
            if(pCode.split("*")[0] == "")
            {
                document.getElementById("Sound").play();
                let tmpConfObj =
                {
                    id:'msgAlert',
                    showTitle:true,
                    title:"Uyarı",
                    showCloseButton:true,
                    width:'500px',
                    height:'200px',
                    button:[{id:"btn01",caption:"Tamam",location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Miktar sıfır giremezsiniz !"}</div>)
                }
                await dialog(tmpConfObj);
                this.txtBarcode.value = "";
                return
            }
            tmpQuantity = pCode.split("*")[0];
            pCode = pCode.split("*")[1];
        }
        //******************************************************** */
        //BARKOD DESENİ
        let tmpBarPattern = this.getBarPattern(pCode)
        tmpPrice = typeof tmpBarPattern.price == 'undefined' || tmpBarPattern.price == 0 ? tmpPrice : tmpBarPattern.price
        tmpQuantity = typeof tmpBarPattern.quantity == 'undefined' || tmpBarPattern.quantity == 0 ? tmpQuantity : tmpBarPattern.quantity
        pCode = tmpBarPattern.barcode
        console.log(tmpPrice)
        //******************************************************** */
        //SARI ETIKET BARKODU

        //******************************************************** */
        
    }
    getBarPattern(pBarcode)
    {
        let tmpPrm = this.prmObj.filter({ID:'BarcodePattern'}).getValue();
        
        if(typeof tmpPrm == 'undefined' || tmpPrm.length == 0)
        {            
            return {barcode:pBarcode}
        }
        //201234012550 0211234012550
        for (let i = 0; i < tmpPrm.length; i++) 
        {
            let tmpFlag = tmpPrm[i].substring(0,tmpPrm[i].indexOf('N'))

            if(tmpFlag != '' && tmpPrm[i].length == pBarcode.length && pBarcode.substring(0,tmpFlag.length) == tmpFlag)
            {
                let tmpMoney = pBarcode.substring(tmpPrm[i].indexOf('M'),tmpPrm[i].lastIndexOf('M') + 1)
                let tmpCent = pBarcode.substring(tmpPrm[i].indexOf('C'),tmpPrm[i].lastIndexOf('C') + 1)
                let tmpKg = pBarcode.substring(tmpPrm[i].indexOf('K'),tmpPrm[i].lastIndexOf('K') + 1)
                let tmpGram = pBarcode.substring(tmpPrm[i].indexOf('G'),tmpPrm[i].lastIndexOf('G') + 1)
                
                return {
                    barcode : pBarcode.substring(0,tmpPrm[i].lastIndexOf('N') + 1),
                    price : parseFloat((tmpMoney == '' ? "0" : tmpMoney) + "." + (tmpCent == '' ? "0" : tmpCent)),
                    quantity : parseFloat((tmpKg == '' ? "0" : tmpKg) + "." + (tmpGram == '' ? "0" : tmpGram))
                }
            }
        }

        return {barcode : pBarcode}
    }
    render()
    {
        return(
            <div>                
                <div className="top-bar row">
                    <div className="col-12">                    
                        <div className="row m-2">
                            <div className="col-1">
                                <img src="./css/img/logo2.png" width="50px" height="50px"/>
                            </div>
                            <div className="col-1">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-white fa-solid fa-user p-2"></i>
                                        <span className="text-white">TEST1</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-tv p-2"></i>
                                        <span className="text-light">004</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">                                
                                        <i className="text-white fa-solid fa-circle-user p-2"></i>
                                        <span className="text-white">ALI KEMAL KARACA</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-user-plus p-2"></i>
                                        <span className="text-light">0</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-white fa-solid fa-calendar p-2"></i>
                                        <span className="text-white">03.03.2022</span>
                                    </div>    
                                </div>
                                <div className="row" style={{height:"25px"}}>
                                    <div className="col-12">
                                        <i className="text-light fa-solid fa-clock p-2"></i>
                                        <span className="text-light">12:12:04</span>
                                    </div> 
                                </div>
                            </div>
                            <div className="col-1 offset-3 px-1">
                                <NbButton id={"btnRefresh"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    document.location.reload()
                                }}>
                                    <i className="text-white fa-solid fa-arrows-rotate" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 px-1">
                                <NbButton id={"btnPluEdit"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {       
                                    if(this.pluBtnGrp.edit)
                                    {
                                        this.pluBtnGrp.edit = false
                                        this.pluBtnGrp.save()                   
                                    }                              
                                    else
                                    {
                                        this.pluBtnGrp.edit = true
                                    }                   
                                    this.setState({isPluEdit:this.pluBtnGrp.edit})
                                }}>
                                    <i className={this.state.isPluEdit == true ? "text-white fa-solid fa-lock-open" : "text-white fa-solid fa-lock"} style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                            <div className="col-1 ps-1 pe-3">
                                <NbButton id={"btnClose"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                                onClick={()=>
                                {                                                        
                                    
                                }}>
                                    <i className="text-white fa-solid fa-power-off" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="row p-2">
                    {/* Left Column */}
                    <div className="col-6">
                        {/* txtBarcode */}
                        <div className="row">
                            <div className="col-12">
                                <NdTextBox id="txtBarcode" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:"01",
                                            icon:"more",
                                            onClick:()=>
                                            {
                                                this.popItemList.show()
                                            }
                                        },
                                        {
                                            id:"02",
                                            icon:"arrowdown",
                                            onClick:()=>
                                            {
                                                this.txtRef.value = Math.floor(Date.now() / 1000)
                                            }
                                        }
                                    ]
                                }
                                onChange={(async(e)=>
                                {
                                    this.getItem(this.txtBarcode.value)
                                }).bind(this)} 
                                >     
                                </NdTextBox>  
                            </div>                            
                        </div>
                        {/* grdList */}
                        <div className="row">
                            <div className="12">
                                <NdGrid parent={this} id={"grdList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"156px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Grand Total */}
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-3">
                                        <p className="text-primary text-start m-0">T.Satır : <span className="text-dark">0</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">T.Ürün Mik.: <span className="text-dark">0</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Sadakat İndirim : <span className="text-dark">0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-start m-0">Ticket Rest.: <span className="text-dark">0.00 €</span></p>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Ara Toplam : <span className="text-dark">0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">Kdv : <span className="text-dark">0.00 €</span></p>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-primary text-end m-0">İndirim : <span className="text-dark">0.00 €</span></p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="fs-2 fw-bold text-center m-0">0.00 €</p>
                            </div>
                        </div>
                        {/* Button Console */}
                        <div className="row">
                            <div className="col-12">
                                {/* Line 1 */}
                                <div className="row px-2">
                                    {/* Total */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnTotal"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popTotal.show();
                                        }}>
                                            <i className="text-white fa-solid fa-euro-sign" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Credit Card */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popCardPay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-credit-card" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey7"} parent={this} keyBtn={{textbox:"txtBarcode",key:"7"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-7" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 8 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey8"} parent={this} keyBtn={{textbox:"txtBarcode",key:"8"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-8" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 9 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey9"} parent={this} keyBtn={{textbox:"txtBarcode",key:"9"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-9" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Check */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>  
                                {/* Line 2 */}
                                <div className="row px-2">
                                    {/* Safe Open */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                             
                                            this.popAccessPass.show();
                                        }}
                                        >
                                            <i className="text-white fa-solid fa-inbox" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Cash */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                             
                                            this.popCashPay.show();
                                        }}>
                                            <i className="text-white fa-solid fa-money-bill-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey4"} parent={this} keyBtn={{textbox:"txtBarcode",key:"4"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-4" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey5"} parent={this} keyBtn={{textbox:"txtBarcode",key:"5"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-5" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey6"} parent={this} keyBtn={{textbox:"txtBarcode",key:"6"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-6" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Backspace */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyBs"} parent={this} keyBtn={{textbox:"txtBarcode",key:"Backspace"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-delete-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 3 */}
                                <div className="row px-2">
                                    {/* Discount */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popDiscount.show()
                                        }}>
                                            <i className="text-white fa-solid fa-percent" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Ticket */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popTicket.show();
                                        }}>
                                            <i className="text-white fa-solid fa-ticket" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey1"} parent={this} keyBtn={{textbox:"txtBarcode",key:"1"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-1" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey2"} parent={this} keyBtn={{textbox:"txtBarcode",key:"2"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-2" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey3"} parent={this} keyBtn={{textbox:"txtBarcode",key:"3"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-3" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* X */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyX"} parent={this} keyBtn={{textbox:"txtBarcode",key:"*"}} 
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div> 
                                {/* Line 4 */}
                                <div className="row px-2">
                                    {/* Calculator */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.Calculator.show();
                                        }}>
                                            <i className="text-white fa-solid fa-calculator" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Info */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className={this.state.isBtnInfo == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.state.isBtnInfo)
                                            {
                                                this.setState({isBtnInfo:false})
                                            }
                                            else
                                            {
                                                this.setState({isBtnInfo:true})
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-info" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* . */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKeyDot"} parent={this} keyBtn={{textbox:"txtBarcode",key:"."}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"26pt"}}>.</NbButton>
                                    </div>
                                    {/* 0 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btnKey0"} parent={this} keyBtn={{textbox:"txtBarcode",key:"0"}}
                                        className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-0" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* -1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}>-1</NbButton>
                                    </div>
                                    {/* +1 */}
                                    <div className="col-2 px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-primary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"20pt"}}>+1</NbButton>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-6">
                        {/* Button Console */}
                        <div className="row">
                            <div className="col-12">
                                {/* Line 1-2-3-4 */}
                                <div className="row px-2">
                                    <div className="col-2">
                                        {/* Up */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}>
                                                    <i className="text-white fa-solid fa-arrow-up" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Down */}
                                        <div className="row">
                                            <div className="col-12 px-1">
                                                <NbButton id={"btn"} parent={this} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%"}}>
                                                    <i className="text-white fa-solid fa-arrow-down" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}>
                                                    <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                        {/* Line Delete */}
                                        <div className="row">                                            
                                            <div className="col-12 px-1">
                                                <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}>
                                                    <i className="text-white fa-solid fa-outdent" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-10">
                                        <NbPluButtonGrp id="pluBtnGrp" parent={this} 
                                        onSelection={(pItem)=>
                                        {
                                            this.txtBarcode.value = pItem;
                                        }}/>
                                    </div>
                                </div>  
                                {/* Line 5 */}
                                <div className="row px-2">
                                    {/* Item Return */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-danger btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-retweet" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-plus-minus" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 6 */}
                                <div className="row px-2">
                                    {/* Park List */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popParkList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-arrow-up-right-from-square" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Advance */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-circle-dollar-to-slot" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 7 */}
                                <div className="row px-2">
                                    {/* Park */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-warning btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-arrow-right-to-bracket" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer Point */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-gift" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>
                                {/* Line 8 */}
                                <div className="row px-2">
                                    {/* Get Customer */}
                                    <div className="col px-1">
                                        <NbButton id={"btnGetCustomer"} parent={this} className={this.state.isBtnGetCustomer == true ? "form-group btn btn-danger btn-block my-1" : "form-group btn btn-info btn-block my-1"} style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {
                                            if(this.state.isBtnGetCustomer)
                                            {
                                                this.setState({isBtnGetCustomer:false})
                                            }
                                            else
                                            {
                                                this.setState({isBtnGetCustomer:true})
                                            }
                                        }}>
                                            <i className="text-white fa-solid fa-circle-user" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Customer List */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                             
                                            this.popCustomerList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-users" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Print */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-info btn-block my-1" style={{height:"70px",width:"100%"}}
                                        onClick={()=>
                                        {                                                        
                                            this.popLastSaleList.show();
                                        }}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                    {/* Blank */}
                                    <div className="col px-1">
                                        <NbButton id={"btn"} parent={this} className="form-group btn btn-secondary btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}></NbButton>
                                    </div>
                                </div>       
                            </div>
                        </div>
                    </div>
                </div>
                {/* Total Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTotal"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ara Toplam"}
                    container={"#root"} 
                    width={"600"}
                    height={"590"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-12">
                                {/* Top Total Indicator */}
                                <div className="row">
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">12.94€</span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">12.94€</span></p>    
                                    </div>
                                    <div className="col-4">
                                        <p className="text-primary text-start m-0">Para Üstü : <span className="text-dark">12.94€</span></p>    
                                    </div>
                                </div>
                                <div className="row pt-2">
                                    {/* Payment Type Selection */}
                                    <div className="col-2">
                                        
                                    </div>
                                    {/* Payment Grid */}
                                    <div className="col-7">
                                        <div className="row">
                                            <div className="col-12">
                                                <NdGrid parent={this} id={"grdPay"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                showRowLines={true}
                                                showColumnLines={true}
                                                showColumnHeaders={false}
                                                height={"138px"} 
                                                width={"100%"}
                                                dbApply={false}
                                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                                onRowPrepared=
                                                {
                                                    (e)=>
                                                    {
                                                        e.rowElement.style.fontSize = "13px";
                                                        e.rowElement.style.backgroundColor = "#ecf0f1"
                                                    }
                                                }
                                                >
                                                    <Column dataField="TYPE_NAME" caption={"NO"} width={100} alignment={"center"}/>
                                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={40}/>                                                
                                                </NdGrid>
                                            </div>
                                        </div>
                                        <div className="row pt-1">
                                            <div className="col-12">
                                                <NdTextBox id="txtPopTotal" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                                </NdTextBox> 
                                            </div>
                                        </div>                                        
                                    </div>
                                    {/* Cash Button Group */}
                                    <div className="col-3">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopTotalCash5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    {/* Number Board */}
                                    <div className="col-6">
                                        <NbNumberboard id={"numPopTotal"} parent={this} textobj="txtPopTotal" span={1} buttonHeight={"60px"}/>
                                    </div>
                                    <div className="col-6">
                                        <div className="row pb-1">
                                            {/* T.R Detail */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalTRDetail"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                                    T.R Detay
                                                </NbButton>
                                            </div>
                                            {/* 10 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Line Delete */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalLineDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                                    Satır İptal
                                                </NbButton>
                                            </div>
                                            {/* 20 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Cancel */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCancel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                                    Vazgeç
                                                </NbButton>
                                            </div>
                                            {/* 50 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="row py-1">
                                            {/* Okey */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalOkey"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            {/* 100 € */}
                                            <div className="col-6">
                                                <NbButton id={"btnPopTotalCash100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Card Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCardPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Kart Ödeme"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        {/* Top Total Indicator */}
                        <div className="row">
                            <div className="col-12">
                               <div className="row">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">12.94€</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">12.94€</span></p>    
                                    </div>
                                </div> 
                            </div>
                        </div>
                        {/* txtPopCardPay */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCardPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        {/* numPopCardPay */}
                        <div className="row pt-2">                            
                            <div className="col-12">
                                <NbNumberboard id={"numPopCardPay"} parent={this} textobj="txtPopCardPay" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopCardPaySend */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopCardPaySend"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                    Gönder
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Cash Pay Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCashPay"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Nakit Ödeme"}
                    container={"#root"} 
                    width={"600"}
                    height={"570"}
                    position={{of:"#root"}}
                    >
                        <div className="row">
                            <div className="col-9">
                                {/* Top Total Indicator */}
                                <div className="row pb-3">
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Toplam : <span className="text-dark">0</span></p>    
                                    </div>
                                    <div className="col-6">
                                        <p className="text-primary text-start m-0">Kalan : <span className="text-dark">0</span></p>    
                                    </div>
                                </div>
                                {/* txtPopCashPay */}
                                <div className="row pt-5">
                                    <div className="col-12">
                                        <NdTextBox id="txtPopCashPay" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                        </NdTextBox> 
                                    </div>
                                </div>
                                {/* numPopCashPay */}
                                <div className="row pt-2">                            
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopCashPay"} parent={this} textobj="txtPopPrice" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                {/* numPopCashPay */}
                                <div className="row pt-2">
                                    <div className="col-12">
                                        <NbButton id={"btnPopCashPayOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row">
                                    <div className="col-12">
                                        {/* 1 € */}
                                        <div className="row pb-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay1"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/1€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 2 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay2"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/2€.png)",backgroundRepeat:"no-repeat",backgroundSize:"55% 100%",backgroundPosition: "center",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 5 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay5"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/5€.jfif)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 10 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay10"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/10€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 20 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay20"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/20€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 50 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay50"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/50€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                        {/* 100 € */}
                                        <div className="row py-1">
                                            <div className="col-12">
                                                <NbButton id={"btnPopCashPay100"} parent={this} className="btn btn-block" 
                                                style={{height:"60px",width:"100%",backgroundImage:"url(css/img/100€.jpg)",backgroundSize:"cover",borderColor:"#6c757d"}}
                                                onClick={()=>
                                                {                                                        
                                                    
                                                }}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                                
                    </NdPopUp>
                </div>
                {/* Access Pass Popup */}
                <div>
                    <NdPopUp parent={this} id={"popAccessPass"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Yetkili Şifresi Giriniz"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopAccessPass" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row pt-2">
                            {/* Number Board */}
                            <div className="col-12">
                                <NbNumberboard id={"numPopAccessPass"} parent={this} textobj="txtPopAccessPass" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopAccessPass"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Quantity Popup */}
                <div>
                    <NdPopUp parent={this} id={"popQuantity"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Miktar"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopQuantity" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div> 
                        <div className="row pt-2">
                            {/* numPopQuantity */}
                            <div className="col-12">
                                <NbNumberboard id={"numPopQuantity"} parent={this} textobj="txtPopQuantity" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopQuantity"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Price Popup */}
                <div>
                    <NdPopUp parent={this} id={"popPrice"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Fiyat"}
                    container={"#root"} 
                    width={"300"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopPrice */}
                        <div className="row pt-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopPrice" parent={this} simple={true}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* numPopPrice */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbNumberboard id={"numPopPrice"} parent={this} textobj="txtPopPrice" span={1} buttonHeight={"60px"}/>
                            </div>
                        </div>
                        {/* btnPopPriceOk */}
                        <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnPopPriceOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NdPopUp>
                </div>  
                {/* Customer List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popCustomerList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Müşteri Listesi"}
                    container={"#root"} 
                    width={"900"}
                    height={"650"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopCustomerList */}
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopCustomerList" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:"01",
                                            icon:"more",
                                            onClick:()=>
                                            {
                                                
                                            }
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    let tmpResult = await this.checkItem(this.txtRef.value)
                                    if(tmpResult == 3)
                                    {
                                        this.txtRef.value = "";
                                    }
                                }).bind(this)} 
                                >     
                                </NdTextBox>  
                            </div>                            
                        </div>
                        {/* grdPopCustomerList */}
                        <div className="row py-1">
                            <div className="12">
                                <NdGrid parent={this} id={"grdPopCustomerList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"220px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Button Group */}
                        <div className="row py-1">
                            {/* btnPopCustomerListSelect */}
                            <div className="col-6">
                                <NbButton id={"btnPopCustomerListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}>Seç</NbButton> 
                            </div>
                            {/* btnPopCustomerList */}
                            <div className="col-6">
                                <NbButton id={"btnPopCustomerList"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}>Listele</NbButton>
                            </div>
                        </div>
                        {/* keyPopCustomerList */}
                        <div className="row pt-1">
                            <NbKeyboard id={"keyPopCustomerList"} parent={this} textobj="txtPopCustomerList" span={1} buttonHeight={"40px"}/>
                        </div>
                    </NdPopUp>
                </div>
                {/* Item List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popItemList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ürün Listesi"}
                    container={"#root"} 
                    width={"900"}
                    height={"650"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopItemList */}
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id="txtPopItemList" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:"01",
                                            icon:"more",
                                            onClick:()=>
                                            {
                                                
                                            }
                                        }
                                    ]
                                }
                                onChange={(async()=>
                                {
                                    let tmpResult = await this.checkItem(this.txtRef.value)
                                    if(tmpResult == 3)
                                    {
                                        this.txtRef.value = "";
                                    }
                                }).bind(this)} 
                                >     
                                </NdTextBox>  
                            </div>                            
                        </div>
                        {/* grdPopItemList */}
                        <div className="row py-1">
                            <div className="12">
                                <NdGrid parent={this} id={"grdPopItemList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"220px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Button Group */}
                        <div className="row py-1">
                            {/* btnPopItemListSelect */}
                            <div className="col-6">
                                <NbButton id={"btnPopItemListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}>Seç</NbButton> 
                            </div>
                            {/* btnPopItemList */}
                            <div className="col-6">
                                <NbButton id={"btnPopItemList"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}>Listele</NbButton>
                            </div>
                        </div>
                        {/* keyPopItemList */}
                        <div className="row pt-1">
                            <NbKeyboard id={"keyPopItemList"} parent={this} textobj="txtPopItemList" span={1} buttonHeight={"40px"}/>
                        </div>
                    </NdPopUp>
                </div>  
                {/* Park List Popup */}
                <div>
                    <NdPopUp parent={this} id={"popParkList"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Park daki İşlemler"}
                    container={"#root"} 
                    width={"900"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        {/* grdPopParkList */}
                        <div className="row py-1">
                            <div className="12">
                                <NdGrid parent={this} id={"grdPopParkList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"425px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* btnPopParkListSelect */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnPopParkListSelect"} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}>Seç</NbButton> 
                            </div>
                        </div>
                    </NdPopUp>
                </div>  
                {/* Ticket Popup */}
                <div>
                    <NdPopUp parent={this} id={"popTicket"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Ticket Giriş"}
                    container={"#root"} 
                    width={"900"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        {/* txtPopTicket */}
                        <div className="row">
                            <div className="col-12">
                                <NdTextBox id="txtPopTicket" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* grdPopTicketList */}
                        <div className="row py-1">
                            <div className="12">
                                <NdGrid parent={this} id={"grdPopTicketList"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                height={"280px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:0},{TYPE_NAME:1},{TYPE_NAME:2},{TYPE_NAME:3},{TYPE_NAME:4},{TYPE_NAME:5},{TYPE_NAME:6},{TYPE_NAME:7},{TYPE_NAME:8},{TYPE_NAME:9}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="TYPE_NAME" caption={"NO"} width={40} alignment={"center"}/>
                                    <Column dataField="DEPOT" caption={"ADI"} width={350} />
                                    <Column dataField="CUSTOMER_NAME" caption={"MIKTAR"} width={100}/>
                                    <Column dataField="QUANTITY" caption={"FIYAT"} width={100}/>
                                    <Column dataField="VAT_EXT" caption={"TUTAR"} width={100}/>                                                
                                </NdGrid>
                            </div>
                        </div>
                        {/* Last Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Son Okutulan : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                        {/* Total Read */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Toplam Okutulan : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                        {/* Rest */}
                        <div className="row py-1">
                            <div className="col-12">
                                <h3 className="text-primary text-center">Kalan Ödeme : <span className="text-dark">0.00 €</span></h3>    
                            </div>
                        </div>
                    </NdPopUp>
                </div>     
                {/* Calculator Popup */}
                <div>
                    <NbCalculator parent={this} id={"Calculator"}></NbCalculator>
                </div>      
                {/* Discount Popup */}     
                <div>
                    <NdPopUp parent={this} id={"popDiscount"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"İskonto"}
                    container={"#root"} 
                    width={"600"}
                    height={"580"}
                    position={{of:"#root"}}
                    >
                        {/* Discount Header */}
                        <div className="row pb-1">
                            <div className="col-4">

                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-danger text-center">Öncesi</h3>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-primary text-center">51.95 €</h3>    
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-danger text-center">Sonrası</h3>    
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="text-primary text-center">51.95 €</h3>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Discount Input */}
                        <div className="row py-1">
                            {/* txtPopDiscountAmount */}
                            <div className="col-6">
                                <NdTextBox id="txtPopDiscountAmount" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                            {/* txtPopDiscountPercent */}
                            <div className="col-6">
                                <NdTextBox id="txtPopDiscountPercent" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:3px solid #428bca;"}}>     
                                </NdTextBox> 
                            </div>
                        </div>
                        {/* Discount Number Board */}
                        <div className="row py-1">
                            <div className="col-9">
                                {/* numPopDiscount */}
                                <div className="row pb-1">
                                    <div className="col-12">
                                        <NbNumberboard id={"numPopDiscount"} parent={this} textobj="txtPopDiscountAmount" span={1} buttonHeight={"60px"}/>
                                    </div>
                                </div>
                                <div className="row pt-1">
                                    {/* btnPopDiscountDel */}
                                    <div className="col-4 pe-1">
                                        <NbButton id={"btnPopDiscountDel"} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-eraser" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopDiscountOk */}
                                    <div className="col-8 ps-1">
                                        <NbButton id={"btnPopDiscountOk"} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                {/* btnPopDiscount10 */}
                                <div className="row pb-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount10"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 10
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount20 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount20"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 20
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount30 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount30"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 30
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount40 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount40"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 40
                                        </NbButton>
                                    </div>
                                </div>
                                {/* btnPopDiscount50 */}
                                <div className="row py-1">
                                    <div className="col-12 ps-1">
                                        <NbButton id={"btnPopDiscount50"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                        % 50
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NdPopUp>
                </div>
                {/* Last Sale List Popup */} 
                <div>
                    <NbPopUp id="popLastSaleList" parent={this} title={"Son Satış Listesi"}>
                        {/* Tool Button Group */} 
                        <div className="row pb-1">
                            <div className="offset-10 col-2">
                                <div className="row px-2">
                                    {/* btnPopLastSaleTRest */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSaleTRest"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-utensils" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSaleFile */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSaleFile"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-file-lines" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                    {/* btnPopLastSalePrint */}
                                    <div className="col-4 p-1">
                                        <NbButton id={"btnPopLastSalePrint"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"50px",width:"100%"}}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: "16px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Filter */}
                        <div className="row py-1">
                            {/* dtPopLastSaleStartDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true}  parent={this} id={"dtPopLastSaleStartDate"}/>
                            </div>
                            {/* dtPopLastSaleFinishDate */} 
                            <div className="col-2">
                                <NdDatePicker simple={true}  parent={this} id={"dtPopLastSaleFinishDate"}/>
                            </div>
                            {/* cmbPopLastSalePayType */} 
                            <div className="col-2">
                                <NdSelectBox simple={true} parent={this} id="cmbPopLastSalePayType"/>
                            </div>
                            {/* btnPopLastSaleSearch */} 
                            <div className="col-1">
                                <NbButton id={"btnPopLastSaleSearch"} parent={this} className="form-group btn btn-primary btn-block" style={{height:"36px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-magnifying-glass" style={{fontSize: "16px"}} />
                                </NbButton>
                            </div>
                        </div>
                        {/* grdLastSale */}
                        <div className="row py-1">
                            <div className="col-12">
                                <NdGrid parent={this} id={"grdLastSale"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"TARIH"} width={100}/>
                                    <Column dataField="X11" caption={"SAAT"} width={100}/>    
                                    <Column dataField="XX2" caption={"SERI"} width={40}/>
                                    <Column dataField="XX3" caption={"SIRA"} width={40}/> 
                                    <Column dataField="XX4" caption={"SATIR"} width={40}/>
                                    <Column dataField="XX5" caption={"MÜŞTERİ"} width={200}/> 
                                    <Column dataField="XX6" caption={"KULLANICI"} width={100}/>
                                    <Column dataField="XX7" caption={"INDIRIM"} width={100}/> 
                                    <Column dataField="XX8" caption={"SADAKAT"} width={100}/>
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={100}/>                                             
                                </NdGrid>
                            </div>
                        </div>
                        <div className="row py-1">
                            {/* grdLastSaleItem */}
                            <div className="col-6">
                                <NdGrid parent={this} id={"grdLastSaleItem"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"BARKOD"} width={120}/>
                                    <Column dataField="XX2" caption={"NAME"} width={200}/>    
                                    <Column dataField="XX3" caption={"MIKTAR"} width={50}/>
                                    <Column dataField="XX4" caption={"FIYAT"} width={50}/> 
                                    <Column dataField="AMOUNT" caption={"TUTAR"} width={100}/>
                                </NdGrid>
                            </div>
                            {/* grdLastSalePay */}
                            <div className="col-6">
                                <NdGrid parent={this} id={"grdLastSalePay"} 
                                showBorders={true} 
                                columnsAutoWidth={true} 
                                allowColumnReordering={true} 
                                allowColumnResizing={true} 
                                showRowLines={true}
                                showColumnLines={true}
                                height={"250px"} 
                                width={"100%"}
                                dbApply={false}
                                data={{source:[{TYPE_NAME:"ESC",AMOUNT:100.99}]}}
                                onRowPrepared=
                                {
                                    (e)=>
                                    {
                                        if(e.rowType == "header")
                                        {
                                            e.rowElement.style.fontWeight = "bold";    
                                        }
                                        e.rowElement.style.fontSize = "13px";
                                    }
                                }
                                onCellPrepared=
                                {
                                    (e)=>
                                    {
                                        e.cellElement.style.padding = "4px"
                                    }
                                }
                                >
                                    <Column dataField="XX1" caption={"TIP"} width={200}/>
                                    <Column dataField="XX2" caption={"AMOUNT"} width={100}/>    
                                    <Column dataField="XX3" caption={"CHANGE"} width={100}/>
                                </NdGrid>
                            </div>
                        </div>
                    </NbPopUp>
                </div>                
            </div>
        )
    }
}