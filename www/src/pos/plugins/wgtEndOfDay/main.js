import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import { docCls} from "../../../core/cls/doc.js"
import { posEnddayCls } from '../../../core/cls/pos.js';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NdDialog,{ dialog } from "../../../core/react/devex/dialog.js";
import NbPopDescboard from "../../tools/popdescboard.js";
import { dataset,datatable } from "../../../core/core.js";
import NdPopUp from "../../../core/react/devex/popup.js";
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdNumberBox from '../../../core/react/devex/numberbox.js';
import NbKeyboard from "../../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../../core/react/devex/textbox.js";
import NbWizard from "../../../core/react/bootstrap/wizard.js"
import NbLabel from "../../../core/react/bootstrap/label.js";
import {prm} from './meta/prm.js'

const orgLoadPos = App.prototype.loadPos
const orgInit = posDoc.prototype.init
const orgComponentWillMount = posDoc.prototype.componentWillMount
const orgRender = posDoc.prototype.render

App.prototype.loadPos = async function()
{
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }

    this.prmObj.meta = this.prmObj.meta.concat(prm)
    return orgLoadPos.call(this)
}
posDoc.prototype.init = function() 
{
    orgInit.call(this)    
}
posDoc.prototype.componentWillMount = function() 
{
    this.state.popEndDay =
    {
        Cash : 0,
        DebitCard : 0,
        Check : 0,  
        TicketRest : 0,
        color :
        {
            cash :"green",
            card :"green",
            check :"green",
            rest :"green",
        }
    }  

    if(typeof orgComponentWillMount != 'undefined')
    {
        orgComponentWillMount.call(this)
    }
}
posDoc.prototype.render = function() 
{
    const originalRenderOutput = orgRender.call(this);
    const modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(render.bind(this))());
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
}
function render()
{
    return (
        <NdLayoutItem key={"btnEndOfDayLy"} id={"btnEndOfDayLy"} parent={this} data-grid={{x:40,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnEndOfDayLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnEndOfDay"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={onClick.bind(this)}>
                    <i className="text-white fa-solid fa-cash-register" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
            <div>
                <NdPopUp parent={this} id={"popEndDay"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.lang.t("popEndDay.title")}
                container={"#root"} 
                width={"100%"}
                height={"100%"}
                style={{padding:"10px"}}
                position={{of:"#root"}}
                >
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <NbWizard id={"wzdEndDay"} parent={this} onInit={()=>
                            {
                                this.wzdEndDay.setStep("step1")
                            }}
                            >
                                <div id={"step1"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.dtPopEndDayDocDate")} alignment="right" />
                                                    <NdDatePicker simple={true} parent={this} id={"dtPopEndDayDocDate"} />
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep1Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step2")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                <div id={"step2"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <EmptyItem/>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.txtPopEndDayAdvance")} alignment="right" />
                                                    <NdNumberBox id="txtPopEndDayAdvance" parent={this} simple={true} readOnly={true}/>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep2Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step1")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep2Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step3")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                <div id={"step3"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <Item>
                                                    <Form colCount={1}>
                                                        <Item>
                                                            <Label text={"0.01€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum1" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot1.value = Number(Number(e) * 0.01).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot1.text = Number(Number(e) * 0.01).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum1"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum1.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot1" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"0.02€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum2" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot2.value = Number(Number(e) * 0.02).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot2.text = Number(Number(e) * 0.02).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum2"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum2.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot2" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"0.05€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum3" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot3.value = Number(Number(e) * 0.05).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot3.text = Number(Number(e) * 0.05).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum3"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum3.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot3" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"0.10€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum4" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot4.value = Number(Number(e) * 0.1).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot4.text = Number(Number(e) * 0.1).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum4"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum4.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot4" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"0.20€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum5" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot5.value = Number(Number(e) * 0.20).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot5.text = Number(Number(e) * 0.20).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum5"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum5.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot5" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"0.50€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum6" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot6.value = Number(Number(e) * 0.5).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot6.text = Number(Number(e) * 0.5).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum6"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum6.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot6" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"1€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum7" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot7.value = Number(Number(e) * 1).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot7.text = Number(Number(e) * 1).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum7"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum7.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot7" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"2€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum8" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot8.value = Number(Number(e) * 2).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot8.text = Number(Number(e) * 2).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum8"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum8.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot8" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"5€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum9" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot9.value = Number(Number(e) * 5).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot9.text = Number(Number(e) * 5).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum9"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum9.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot9" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"10€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum10" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot10.value = Number(Number(e) * 10).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot10.text = Number(Number(e) * 10).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum10"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum10.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot10" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"20€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum11" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot11.value = Number(Number(e) * 20).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot11.text = Number(Number(e) * 20).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum11"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum11.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot11" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"50€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum12" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot12.value = Number(Number(e) * 50).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot12.text = Number(Number(e) * 50).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum12"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum12.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot12" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"100€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum13" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot13.value = Number(Number(e) * 100).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot13.text = Number(Number(e) * 100).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum13"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum13.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot13" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                        <Item>
                                                            <Label text={"200€ X "} alignment="right" />
                                                            <div className={"row"}>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashNum14" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                                    onValueChanging={(e)=>
                                                                    {       
                                                                        this.keyStep3.setCaretPosition(e.length)
                                                                        this.keyStep3.setInput(e)

                                                                        this.txtPopEndDayCashTot14.value = Number(Number(e) * 200).round(2).toFixed(2) + "€"
                                                                        this.txtPopEndDayCashTot14.text = Number(Number(e) * 200).round(2)

                                                                        moneyCalc = moneyCalc.bind(this)
                                                                        this.txtPopEndDayCash.value = moneyCalc()
                                                                    }}
                                                                    onFocusIn={()=>
                                                                    {                                    
                                                                        this.keyStep3.inputName = "txtPopEndDayCashNum14"
                                                                        this.keyStep3.setInput(this.txtPopEndDayCashNum14.value)
                                                                    }}/>
                                                                </div>
                                                                <div className={"col-6"}>
                                                                    <NdTextBox id="txtPopEndDayCashTot14" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                    </Form>
                                                </Item>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.txtPopEndDayCash")} alignment="right" />
                                                    <NdTextBox id="txtPopEndDayCash" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',top:'30%',right:'2%',width:'400px'}}>
                                        <NbKeyboard id={"keyStep3"} parent={this} inputName={"txtPopEndDayCash"} layoutName={"numberSimple"} />
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep3Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step2")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep3Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step4")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>                                
                                </div>
                                <div id={"step4"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <EmptyItem/>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.txtPopEndDayCreditCard")} alignment="right" />
                                                    <NdTextBox id="txtPopEndDayCreditCard" parent={this} simple={true} value={"0"} />
                                                </Item>
                                            </Form>    
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',top:'30%',right:'2%',width:'400px'}}>
                                        <NbKeyboard id={"keyStep4"} parent={this} inputName={"txtPopEndDayCreditCard"} layoutName={"numberSimple"} />
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep4Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step3")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep4Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step5")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                <div id={"step5"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <EmptyItem/>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.txtPopEndDayCheck")} alignment="right" />
                                                    <NdTextBox id="txtPopEndDayCheck" parent={this} simple={true} value={"0"} />
                                                </Item>
                                            </Form>    
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',top:'30%',right:'2%',width:'400px'}}>
                                        <NbKeyboard id={"keyStep5"} parent={this} inputName={"txtPopEndDayCheck"} layoutName={"numberSimple"} />
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep5Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step4")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep5Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step6")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                <div id={"step6"}>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={2}>
                                                <EmptyItem/>
                                                <Item>
                                                    <Label text={this.lang.t("popEndDay.txtPopEndDayRestorant")} alignment="right" />
                                                    <NdTextBox id="txtPopEndDayRestorant" parent={this} simple={true} value={"0"} />
                                                </Item>
                                            </Form>      
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',top:'30%',right:'2%',width:'400px'}}>
                                        <NbKeyboard id={"keyStep6"} parent={this} inputName={"txtPopEndDayRestorant"} layoutName={"numberSimple"} />
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep6Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step5")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep6Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            finishResult = finishResult.bind(this)
                                            finishResult()
                                            this.wzdEndDay.setStep("step7")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                                <div id={"step7"}>
                                    <div className={"row"}>                                            
                                        <div className='col-12'>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <h2>{this.lang.t("popEndDay.cash")}</h2>
                                                </div>
                                                <div className='col-6'>
                                                    <NbLabel id="lblEndDayCashResult" parent={this} value={""} style={{color:"green",fontSize:"28px",fontWeight:"bold"}}/>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <h2>{this.lang.t("popEndDay.debitCard")}</h2>
                                                </div>
                                                <div className='col-6'>
                                                    <NbLabel id="lblEndDayDebitResult" parent={this} value={""} style={{color:"green",fontSize:"28px",fontWeight:"bold"}}/>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <h2>{this.lang.t("popEndDay.check")}</h2>
                                                </div>
                                                <div className='col-6'>
                                                    <NbLabel id="lblEndDayCheckResult" parent={this} value={""} style={{color:"green",fontSize:"28px",fontWeight:"bold"}}/>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <h2>{this.lang.t("popEndDay.ticketRest")}</h2>
                                                </div>
                                                <div className='col-6'>
                                                    <NbLabel id="lblEndDayTRestResult" parent={this} value={""} style={{color:"green",fontSize:"28px",fontWeight:"bold"}}/>
                                                </div>
                                            </div>
                                            {/* <div className='row px-4'>
                                                <div className='col-12'>
                                                    <h2>{this.lang.t("popEndDay.advanceMsg1")}</h2>
                                                </div>
                                            </div>
                                            <div className='row px-4'>
                                                <div className='col-4 offset-4'>
                                                    <h2>{this.state.message}</h2>
                                                </div>
                                            </div>
                                            <div className='row px-4'>
                                                <div className='col-12'>
                                                    <h2>{this.lang.t("popEndDay.advanceMsg2")}</h2>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                        <NbButton id={"btnStep7Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.wzdEndDay.setStep("step6")
                                        }}>
                                            <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',left:'75%'}}>
                                        <NbButton id={"btnStep7Center"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={async()=>
                                        {
                                            //YAZDIRMA İŞLEMİNDEN ÖNCE KULLANICIYA SORULUYOR
                                            let tmpConfObj =
                                            {
                                                id:'msgMailPrintAlert',showTitle:true,title:this.lang.t("msgMailPrintAlert.title"),showCloseButton:true,width:'500px',height:'250px',
                                                button:[{id:"btn01",caption:this.lang.t("msgMailPrintAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("msgMailPrintAlert.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgMailPrintAlert.msg")}</div>)
                                            }
                                            let pResult = await dialog(tmpConfObj);
                                        }}>
                                            <i className="text-white fa-solid fa-print" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                        <NbButton id={"btnStep7Finish"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                        onClick={()=>
                                        {
                                            this.popEndDay.hide()
                                            this.popEndDayAdvance.show()
                                        }}>
                                            <i className="text-white fa-solid fa-flag-checkered" style={{fontSize: "24px"}} />
                                        </NbButton>
                                    </div>
                                </div>
                            </NbWizard>
                        </div>
                    </div>
                </NdPopUp>
            </div>
            <div>
                <NdPopUp parent={this} id={"popEndDayAdvance"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.lang.t("popEndDay.popEndDayAdvance.title")}
                container={"#root"} 
                width={"900px"}
                height={"100%"}
                style={{padding:"10px"}}
                position={{of:"#root"}}
                >
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <Form colCount={2}>
                                <Item>
                                    <Form colCount={1}>
                                        <Item>
                                            <Label text={"0.01€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum1" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot1.value = Number(Number(e) * 0.01).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot1.text = Number(Number(e) * 0.01).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum1"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum1.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot1" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"0.02€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum2" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot2.value = Number(Number(e) * 0.02).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot2.text = Number(Number(e) * 0.02).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum2"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum2.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot2" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"0.05€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum3" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot3.value = Number(Number(e) * 0.05).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot3.text = Number(Number(e) * 0.05).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum3"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum3.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot3" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"0.10€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum4" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot4.value = Number(Number(e) * 0.1).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot4.text = Number(Number(e) * 0.1).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum4"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum4.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot4" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"0.20€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum5" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot5.value = Number(Number(e) * 0.20).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot5.text = Number(Number(e) * 0.20).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum5"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum5.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot5" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"0.50€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum6" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot6.value = Number(Number(e) * 0.5).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot6.text = Number(Number(e) * 0.5).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum6"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum6.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot6" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"1€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum7" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot7.value = Number(Number(e) * 1).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot7.text = Number(Number(e) * 1).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum7"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum7.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot7" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"2€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum8" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot8.value = Number(Number(e) * 2).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot8.text = Number(Number(e) * 2).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum8"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum8.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot8" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"5€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum9" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot9.value = Number(Number(e) * 5).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot9.text = Number(Number(e) * 5).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum9"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum9.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot9" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"10€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum10" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot10.value = Number(Number(e) * 10).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot10.text = Number(Number(e) * 10).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum10"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum10.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot10" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"20€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum11" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot11.value = Number(Number(e) * 20).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot11.text = Number(Number(e) * 20).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum11"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum11.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot11" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                        <Item>
                                            <Label text={"50€ X "} alignment="right" />
                                            <div className={"row"}>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashNum12" parent={this} simple={true} placeholder={"Saisissez nombre des pièces"} selectAll={false}
                                                    onValueChanging={(e)=>
                                                    {       
                                                        this.keyAdvence.setCaretPosition(e.length)
                                                        this.keyAdvence.setInput(e)

                                                        this.txtPopEndDayAdvanceCashTot12.value = Number(Number(e) * 50).round(2).toFixed(2) + "€"
                                                        this.txtPopEndDayAdvanceCashTot12.text = Number(Number(e) * 50).round(2)

                                                        moneyAdvCalc = moneyAdvCalc.bind(this)
                                                        this.txtPopEndDayAdvanceCash.value = moneyAdvCalc()
                                                    }}
                                                    onFocusIn={()=>
                                                    {                                    
                                                        this.keyAdvence.inputName = "txtPopEndDayAdvanceCashNum12"
                                                        this.keyAdvence.setInput(this.txtPopEndDayAdvanceCashNum12.value)
                                                    }}/>
                                                </div>
                                                <div className={"col-6"}>
                                                    <NdTextBox id="txtPopEndDayAdvanceCashTot12" parent={this} simple={true} value={"0"} readOnly={true}/>
                                                </div>
                                            </div>
                                        </Item>
                                    </Form>
                                </Item>
                                <Item>
                                    <Label text={this.lang.t("popEndDay.popEndDayAdvance.txtPopEndDayAdvanceCash")} alignment="right" />
                                    <NdTextBox id="txtPopEndDayAdvanceCash" parent={this} simple={true} value={"0"} readOnly={true}/>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div style={{position:'absolute',top:'30%',right:'2%',width:'400px'}}>
                        <NbKeyboard id={"keyAdvence"} parent={this} inputName={"txtPopEndDayAdvanceCash"} layoutName={"numberSimple"} />
                    </div>
                    <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                        <NbButton id={"btnAdvenceOk"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                        onClick={()=>
                        {
                            advanceOk = advanceOk.bind(this)
                            advanceOk()
                        }}>
                            <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                        </NbButton>
                    </div>
                </NdPopUp>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    this.parkDt.selectCmd.value[0] = this.core.auth.data.CODE;
    await this.parkDt.refresh();

    if(this.parkDt.length > 0)
    {
        let tmpConfObj =
        {
            id:'msgEndDayParkAlert',showTitle:true,title:this.lang.t("popEndDay.msgEndDayParkAlert.title"),showCloseButton:false,width:'500px',height:'250px',
            button:[{id:"btn01",caption:this.lang.t("popEndDay.msgEndDayParkAlert.btn01"),location:'before'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popEndDay.msgEndDayParkAlert.msg")}</div>)
        }

        let pResult = await dialog(tmpConfObj);
        
        if(pResult == 'btn01')
        {
            await this.grdPopParkList.dataRefresh({source:this.parkDt});
            this.popParkList.show();
            return
        }
    }
    // else
    // {
    //     let tmpConfObj =
    //     {
    //         id:'msgEndDayChoiceAlert',showTitle:true,title:this.lang.t("popEndDay.msgEndDayChoiceAlert.title"),showCloseButton:false,width:'500px',height:'250px',
    //         button:[{id:"btn01",caption:this.lang.t("popEndDay.msgEndDayChoiceAlert.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("popEndDay.msgEndDayChoiceAlert.btn02"),location:'after'}],
    //         content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popEndDay.msgEndDayChoiceAlert.msg")}</div>)
    //     }

    //     let pResult = await dialog(tmpConfObj);
        
    //     if(pResult == 'btn02')
    //     {
    //         this.popEndDayAdvance.show()
    //         return
    //     }
    // }

    this.popEndDay.show()
    this.dtPopEndDayDocDate.value = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.txtPopEndDayAdvance.value = 0
    this.txtPopEndDayCash.value = 0
    this.txtPopEndDayCreditCard.value = 0
    this.txtPopEndDayCheck.value = 0
    this.txtPopEndDayRestorant.value = 0
    this.txtPopEndDayAdvanceCash.value = 0
}
function moneyCalc()
{
    let tmpTotal = 0
    for (let i = 0; i < 14; i++) 
    {
        if(typeof this["txtPopEndDayCashTot" + (i + 1)] != 'undefined' && typeof this["txtPopEndDayCashTot" + (i + 1)].text != 'undefined')
        {
            tmpTotal = tmpTotal + this["txtPopEndDayCashTot" + (i + 1)].text
        }
    }
    return Number(tmpTotal).round(2).toFixed(2)
}
function moneyAdvCalc()
{
    let tmpTotal = 0
    for (let i = 0; i < 12; i++) 
    {
        if(typeof this["txtPopEndDayAdvanceCashTot" + (i + 1)] != 'undefined' && typeof this["txtPopEndDayAdvanceCashTot" + (i + 1)].text != 'undefined')
        {
            tmpTotal = tmpTotal + this["txtPopEndDayAdvanceCashTot" + (i + 1)].text
        }
    }
    return Number(tmpTotal).round(2).toFixed(2)
}
async function finishResult()
{
    let paymentData = new datatable()

    let tmpQuery = 
    {
        query : "SELECT   " +
                "MAX(DOC_DATE) AS DOC_DATE,PAY_TYPE AS PAY_TYPE,TYPE AS TYPE,  " +
                "PAY_TYPE_NAME AS PAY_TYPE_NAME,   " +
                "CASE WHEN TYPE = 0 THEN SUM(AMOUNT - CHANGE) ELSE SUM(AMOUNT) * -1 END AS AMOUNT   " +
                "FROM POS_PAYMENT_VW_01 WHERE DOC_DATE = @DOC_DATE AND DEVICE = @DEVICE AND STATUS = 1   " +
                "GROUP BY PAY_TYPE_NAME,PAY_TYPE,TYPE " ,
        param : ['DOC_DATE:date','DEVICE:string|50'],
        value : [this.dtPopEndDayDocDate.value,this.posObj.dt()[this.posObj.dt().length - 1].DEVICE]
    }
    let tmpData = await this.core.sql.execute(tmpQuery) 
    if(tmpData.result.recordset.length > 0)
    {
        paymentData.clear()
        for (let i = 0; i < tmpData.result.recordset.length; i++) 
        {
            paymentData.push(tmpData.result.recordset[i])
        }
    }
    if(parseFloat(paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2)) ==  parseFloat((this.txtPopEndDayCash.value - this.txtPopEndDayAdvance.value).toFixed(2)))
    {
        this.lblEndDayCashResult.style = {color:"green",fontSize:"28px",fontWeight:"bold"}
        this.lblEndDayCashResult.value = ":" + this.lang.t("popEndDay.txtReal")
    }
    else
    {
        let tmpCash = (parseFloat((parseFloat(this.txtPopEndDayCash.value) - parseFloat(this.txtPopEndDayAdvance.value).toFixed(2))) - parseFloat((paymentData.where({'PAY_TYPE':0}).sum('AMOUNT').toFixed(2))))
        let tmpCashValue
        if(tmpCash > 0)
        {
            this.lblEndDayCashResult.style = {color:"blue",fontSize:"28px",fontWeight:"bold"}
            tmpCashValue = '+' + tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
            this.lblEndDayCashResult.style = {color:"red",fontSize:"28px",fontWeight:"bold"}
            tmpCashValue = tmpCash.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        
        this.lblEndDayCashResult.value = ":" + tmpCashValue
    }
    
    if((paymentData.where({'PAY_TYPE':1}).sum('AMOUNT')).toFixed(2) ==  Number(this.txtPopEndDayCreditCard.value).toFixed(2))
    {
        this.lblEndDayDebitResult.style = {color:"green",fontSize:"28px",fontWeight:"bold"}
        this.lblEndDayDebitResult.value = ":" + this.lang.t("popEndDay.txtReal")
    }
    else 
    {
        let tmpDebit = (this.txtPopEndDayCreditCard.value - parseFloat(paymentData.where({'PAY_TYPE':1}).sum('AMOUNT'))).toFixed(2)
        let tmpDebitValue
        if(tmpDebit > 0)
        {
            this.lblEndDayDebitResult.style = {color:"blue",fontSize:"28px",fontWeight:"bold"}
            tmpDebitValue = '+' + tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
            this.lblEndDayDebitResult.style = {color:"red",fontSize:"28px",fontWeight:"bold"}
            tmpDebitValue = tmpDebit.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.lblEndDayDebitResult.value = ":" + tmpDebitValue
    }

    if(parseFloat((paymentData.where({'PAY_TYPE':2}).sum('AMOUNT')).toFixed(2)) ==  this.txtPopEndDayCheck.value)
    {
        this.lblEndDayCheckResult.style = {color:"green",fontSize:"28px",fontWeight:"bold"}
        this.lblEndDayCheckResult.value = ":" + this.lang.t("popEndDay.txtReal")
    }
    else 
    {
        let tmpCheck = parseFloat((this.txtPopEndDayCheck.value - parseFloat(paymentData.where({'PAY_TYPE':2}).sum('AMOUNT'))).toFixed(2))
        let tmpCheckValue
        if(tmpCheck > 0)
        {
            this.lblEndDayCheckResult.style = {color:"blue",fontSize:"28px",fontWeight:"bold"}
            tmpCheckValue = '+' + tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
            this.lblEndDayCheckResult.style = {color:"red",fontSize:"28px",fontWeight:"bold"}
            tmpCheckValue = tmpCheck.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.lblEndDayCheckResult.value = ":" + tmpCheckValue
    }

    if(parseFloat(paymentData.where({'PAY_TYPE':3}).sum('AMOUNT')) ==  this.txtPopEndDayRestorant.value)
    {
        this.lblEndDayTRestResult.style = {color:"green",fontSize:"28px",fontWeight:"bold"}
        this.lblEndDayTRestResult.value = ":" + this.lang.t("popEndDay.txtReal")
    }
    else 
    {
        let tmpTikcet = parseFloat((this.txtPopEndDayRestorant.value - parseFloat(paymentData.where({'PAY_TYPE':3}).sum('AMOUNT'))).toFixed(2))
        let tmpTicketValue
        if(tmpTikcet > 0)
        {
            this.lblEndDayTRestResult.style = {color:"blue",fontSize:"28px",fontWeight:"bold"}
            tmpTicketValue = '+' + tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        else
        {
            this.lblEndDayTRestResult.style = {color:"red",fontSize:"28px",fontWeight:"bold"}
            tmpTicketValue = tmpTikcet.toLocaleString('en-IN', {style: 'currency',currency: 'eur', minimumFractionDigits: 2})
        }
        this.lblEndDayTRestResult.value = ":" + tmpTicketValue
    }
}
async function advanceOk()
{
    let enddayObj = new posEnddayCls()
    let docObj = new docCls()

    let tmpQuery = 
    {
        query : "SELECT GUID FROM SAFE_VW_01 WHERE CODE = @INPUT_CODE",
        param : ['INPUT_CODE:string|50'],
        value : [this.posObj.dt()[this.posObj.dt().length - 1].DEVICE]
    }
    let tmpData = await this.core.sql.execute(tmpQuery) 
    let tmpSafe = tmpData.result.recordset[0].GUID

    if(docObj.dt().length == 0)
    {
        docObj.addEmpty()
        docObj.dt()[0].TYPE = 2
        docObj.dt()[0].DOC_TYPE = 201
        docObj.dt()[0].REF = 'POS'
        docObj.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
        docObj.dt()[0].DOC_DATE = this.dtPopEndDayDocDate.value
        docObj.dt()[0].INPUT = tmpSafe
        docObj.dt()[0].OUTPUT = '00000000-0000-0000-0000-000000000000'
        docObj.dt()[0].AMOUNT =  Number(this.txtPopEndDayAdvanceCash.value + this.txtPopEndDayCash.value).round(2)
        docObj.dt()[0].TOTAL = Number(this.txtPopEndDayAdvanceCash.value + this.txtPopEndDayCash.value).round(2)
    }
    
    docObj.docCustomer.addEmpty()
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT = tmpSafe
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 20
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = Number(this.txtPopEndDayCash.value).round(2)
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''

    let tmpEndday = {...enddayObj.empty}
    tmpEndday.CASH = this.txtPopEndDayCash.value
    tmpEndday.CDATE = this.dtPopEndDayDocDate.value
    tmpEndday.CREDIT = this.txtPopEndDayCreditCard.value
    tmpEndday.CHECK = this.txtPopEndDayCheck.value
    tmpEndday.TICKET = this.txtPopEndDayRestorant.value
    tmpEndday.ADVANCE = this.txtPopEndDayAdvanceCash.value
    tmpEndday.SAFE = tmpSafe
    
    enddayObj.addEmpty(tmpEndday)
    enddayObj.save()

    if(docObj.dt().length == 0)
    {
        docObj.addEmpty()
        docObj.dt()[0].TYPE = 2
        docObj.dt()[0].DOC_TYPE = 201
        docObj.dt()[0].REF = 'POS'
        docObj.dt()[0].REF_NO = Math.floor(Date.now() / 1000)
        docObj.dt()[0].DOC_DATE = this.dtPopEndDayDocDate.value
        docObj.dt()[0].INPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
        docObj.dt()[0].OUTPUT =  tmpSafe
        docObj.dt()[0].AMOUNT = 0
        docObj.dt()[0].TOTAL = 0
    }

    docObj.docCustomer.addEmpty()
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  ''
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = tmpSafe 
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 20
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = Number(this.txtPopEndDayCash.value + this.txtPopEndDayAdvanceCash.value).round(2)
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''

    if(this.txtPopEndDayCreditCard.value > 0)
    {
        docObj.docCustomer.addEmpty()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'BankSafe',TYPE:1}).getValue()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 21
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopEndDayCreditCard.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''
    }
    if(this.txtPopEndDayRestorant.value > 0)
    {
        docObj.docCustomer.addEmpty()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'TicketRestSafe',TYPE:1}).getValue()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 20
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopEndDayRestorant.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''
    }
    if(this.txtPopEndDayCheck.value > 0)
    {
        docObj.docCustomer.addEmpty()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT = this.prmObj.filter({ID:'CheckSafe',TYPE:1}).getValue()
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = '00000000-0000-0000-0000-000000000000'
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 20
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopEndDayCheck.value
        docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''
    }

    docObj.docCustomer.addEmpty()
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].TYPE = 2
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_GUID = docObj.dt()[0].GUID
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_TYPE = 201
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DOC_DATE = this.dtPopEndDayDocDate.value
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF = 'POS'
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].REF_NO = docObj.dt()[0].REF_NO
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT =tmpSafe
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].INPUT_NAME =  this.posObj.dt()[this.posObj.dt().length - 1].DEVICE
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].OUTPUT = this.prmObj.filter({ID:'SafeCenter',TYPE:1}).getValue()
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].PAY_TYPE = 20
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].AMOUNT = this.txtPopEndDayAdvanceCash.value
    docObj.docCustomer.dt()[docObj.docCustomer.dt().length-1].DESCRIPTION = ''

    docObj.dt()[0].AMOUNT = Number(this.txtPopEndDayAdvanceCash.value + this.txtPopEndDayCash.value).round(2)
    docObj.dt()[0].TOTAL = Number(this.txtPopEndDayAdvanceCash.value + this.txtPopEndDayCash.value).round(2)

    await docObj.save()

    let tmpConfObj =
    {
        id:'msgAdvenceSucces',showTitle:true,title:this.lang.t("popEndDay.msgAdvenceSucces.title"),showCloseButton:true,width:'500px',height:'200px',
        button:[{id:"btn01",caption:this.lang.t("popEndDay.msgAdvenceSucces.btn01"),location:'after'}],
        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popEndDay.msgAdvenceSucces.msg")}</div>)
    }
    
    await dialog(tmpConfObj);

    this.popEndDayAdvance.hide()
}
function addChildToElementWithId(children, id, newChild) 
{
    return React.Children.map(children, child => 
    {
        if (!React.isValidElement(child)) 
        {
            return child;
        }
        if (child.props.id === id) 
        {
            const newChildren = React.Children.toArray(child.props.children);
            newChildren.push(newChild);
            return React.cloneElement(child, {}, ...newChildren);
        } 
        else if (child.props.children) 
        {
            return React.cloneElement(child, {}, addChildToElementWithId(child.props.children, id, newChild));
        }
        return child;
    });
}