import React from 'react';
import App from '../../../lib/app.js';
import { supportCls } from '../../../../core/cls/company.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';
import { core,param } from '../../../../core/core';


import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class serviceContact extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.state={officalVisible:true}
        this.tabIndex = props.data.tabkey
        this.sysPrmObj = this.param.filter({TYPE:0,USERS:this.user.CODE});
        this.supportObj = new supportCls()        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
       
    }
    async init()
    {
    }
    render()
    {
        return(
            <div>
            <ScrollView>
                {/* Toolbar */}
                <div className="row px-2 pt-2">
                    <div className="col-12">
                        <Toolbar>
                            <Item location="after"
                            locateInMenu="auto"
                            widget="dxButton"
                            options=
                            {
                                {
                                    type: 'default',
                                    icon: 'clear',
                                    onClick: async () => 
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            App.instance.panel.closePage()
                                        }
                                    }
                                }    
                            } />
                        </Toolbar>
                    </div>
                </div>
                <div className="row px-2 pt-2">
                    <div className="col-8">
                        <Form>
                            <Item>
                                <Label text={this.t("sendMail")} alignment="right" />
                                <NdTextBox id="sendMail" parent={this} simple={true} placeholder={this.t("sendMailPlace")}
                                maxLength={32}
                                >
                                </NdTextBox>
                            </Item>
                            <Item>
                                <Label text={this.t("mailSubject")} alignment="right" />
                                <NdTextBox id="mailSubject" parent={this} simple={true} placeholder={this.t("mailSubjectPlace")}
                                maxLength={32}
                                >
                                </NdTextBox>
                            </Item>
                        </Form>
                    </div>
                </div>
                <NdHtmlEditor id="htmlEditor" parent={this} height={700}>
                </NdHtmlEditor>
                <div className="row px-1 pt-1">
                    <Form>
                        <Item>
                        <NdButton text={this.t("btnApprove")} type="success" stylingMode="contained" width={'100%'} parent={this}
                        onClick={async (e)=>
                        {       
                                let tmpData = {html:this.htmlEditor.value,subject:this.mailSubject.value + '-' + this.sendMail.value}
                                this.core.socket.emit('mailer',tmpData,async(pResult) => 
                                {
                                    let tmpConfObj1 =
                                    {
                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
                                    }
                                    
                                    if((pResult) == 0)
                                    {       
                                        this.supportObj.clearAll()
                                        let tmpSupport = {...this.supportObj.empty}
                                        tmpSupport.SUBJECT = this.mailSubject.value
                                        tmpSupport.HTML =  this.htmlEditor.value
                                        tmpSupport.REPLY_MAIL = this.sendMail.value
                                        this.supportObj.addEmpty(tmpSupport);
                                        await this.supportObj.save()
                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                        await dialog(tmpConfObj1);
                                        this.htmlEditor.value = '',
                                        this.mailSubject.value = '',
                                        this.sendMail.value = ''
                                    }
                                    else
                                    {
                                        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                        await dialog(tmpConfObj1);
                                    }
                                });
                        }}/>
                        </Item>
                    </Form>
                </div>
            </ScrollView>               
            </div>
        )
    }
}