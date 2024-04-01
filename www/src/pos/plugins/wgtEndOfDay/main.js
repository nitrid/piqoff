import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NdDialog,{ dialog } from "../../../core/react/devex/dialog.js";
import NbPopDescboard from "../../tools/popdescboard.js";
import { dataset,datatable } from "../../../core/core.js";
import NdPopUp from "../../../core/react/devex/popup.js";
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdNumberBox from '../../../core/react/devex/numberbox.js';
import { Wizard, Steps, Step } from 'react-albus';
import NbKeyboard from "../../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../../core/react/devex/textbox.js";

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

    return orgLoadPos.call(this)
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
                position={{of:"#root"}}
                >
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <Wizard>
                                <Steps>
                                    <Step id="step1" render={({ next }) => (
                                        <div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <Form colCount={2}>
                                                        <Item>
                                                            <Label text={this.lang.t("popEndDay.dtPopEndDayDocDate")} alignment="right" />
                                                            <NdDatePicker simple={true}  parent={this} id={"dtPopEndDayDocDate"} />
                                                        </Item>
                                                    </Form>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep1Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step2" render={({ next, previous }) => (
                                        <div>
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
                                                <NbButton id={"btnStep2Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep2Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step3" render={({ next, previous }) => (
                                        <div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <Form colCount={2}>
                                                        <EmptyItem/>
                                                        <Item>
                                                            <Label text={this.lang.t("popEndDay.txtPopEndDayCash")} alignment="right" />
                                                            <NdTextBox id="txtPopEndDayCash" parent={this} simple={true} value={"0"}/>
                                                        </Item>
                                                    </Form>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <NbKeyboard id={"keyStep3"} parent={this} inputName={"txtPopEndDayCash"} layoutName={"numbers"}/>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                                <NbButton id={"btnStep3Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep3Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step4" render={({ next, previous }) => (
                                        <div>
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
                                            <div className="row">
                                                <div className="col-12">
                                                    <NbKeyboard id={"keyStep4"} parent={this} inputName={"txtPopEndDayCreditCard"} layoutName={"numbers"}/>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                                <NbButton id={"btnStep4Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep4Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step5" render={({ next, previous }) => (
                                        <div>
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
                                            <div className="row">
                                                <div className="col-12">
                                                    <NbKeyboard id={"keyStep5"} parent={this} inputName={"txtPopEndDayCheck"} layoutName={"numbers"}/>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                                <NbButton id={"btnStep5Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep5Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step6" render={({ next, previous }) => (
                                        <div>
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
                                            <div className="row">
                                                <div className="col-12">
                                                    <NbKeyboard id={"keyStep6"} parent={this} inputName={"txtPopEndDayRestorant"} layoutName={"numbers"}/>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                                <NbButton id={"btnStep6Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep6Right"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={next}>
                                                    <i className="text-white fa-solid fa-angle-right" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                    <Step id="step7" render={({ next, previous }) => (
                                        <div>
                                            <div className={"row"}>                                            
                                                <div className='col-12'>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <h2>{this.lang.t("popEndDay.cash")}</h2>
                                                        </div>
                                                        <div className='col-6' style={{color:this.state.popEndDay.color.cash}}>
                                                            <h2> : {this.state.popEndDay.Cash}</h2>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <h2>{this.lang.t("popEndDay.debitCard")}</h2>
                                                        </div>
                                                        <div className='col-6' style={{color:this.state.popEndDay.color.card}}>
                                                            <h2> : {this.state.popEndDay.DebitCard}</h2>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <h2>{this.lang.t("popEndDay.check")}</h2>
                                                        </div>
                                                        <div className='col-6' style={{color:this.state.popEndDay.color.check}}>
                                                            <h2> : {this.state.popEndDay.Check}</h2>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <h2>{this.lang.t("popEndDay.ticketRest")}</h2>
                                                        </div>
                                                        <div className='col-6' style={{color:this.state.popEndDay.color.rest}}>
                                                            <h2> : {this.state.popEndDay.TicketRest}</h2>
                                                        </div>
                                                    </div>
                                                    <div className='row px-4'>
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
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',left:'0px'}}>
                                                <NbButton id={"btnStep7Left"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} onClick={previous}>
                                                    <i className="text-white fa-solid fa-angle-left" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                            <div style={{position:'absolute',bottom:'0px',right:'0px'}}>
                                                <NbButton id={"btnStep7Finish"} parent={this} className="form-group btn btn-primary btn-block" style={{width:'100px'}} 
                                                onClick={()=>
                                                {
                                                    console.log(this)
                                                }}>
                                                    <i className="text-white fa-solid fa-flag-checkered" style={{fontSize: "24px"}} />
                                                </NbButton>
                                            </div>
                                        </div>
                                    )}/>
                                </Steps>
                            </Wizard>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    this.popEndDay.show()
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