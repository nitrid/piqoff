import React from 'react';
import App from '../../../lib/app.js';
import { supportCls } from '../../../../core/cls/company.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';

import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class serviceContact extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.sysPrmObj = this.param.filter({TYPE:0,USERS:this.user.CODE});

        this.prevCode = "";
        this.state={officalVisible:true}
        this.tabIndex = props.data.tabkey
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
                                <NdTextBox id="sendMail" parent={this} simple={true} placeholder={this.t("sendMailPlace")} maxLength={32}/>
                            </Item>
                            <Item>
                                <Label text={this.t("mailSubject")} alignment="right" />
                                <NdTextBox id="mailSubject" parent={this} simple={true} placeholder={this.t("mailSubjectPlace")} maxLength={32}/>
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
                                let tmpData = {html:this.htmlEditor.value,subject:this.mailSubject.value + '-' + this.sendMail.value,sendMail:"receeep7@gmail.com",}
                                this.core.socket.emit('mailer',tmpData,async(pResult) => 
                                {
                                    if((pResult) == 0)
                                    {       
                                        this.supportObj.clearAll()

                                        let tmpSupport = {...this.supportObj.empty}

                                        tmpSupport.SUBJECT = this.mailSubject.value
                                        tmpSupport.HTML =  this.htmlEditor.value
                                        tmpSupport.REPLY_MAIL = this.sendMail.value

                                        this.supportObj.addEmpty(tmpSupport);

                                        await this.supportObj.save()

                                        this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})

                                        this.htmlEditor.value = '',
                                        this.mailSubject.value = '',
                                        this.sendMail.value = ''
                                    }
                                    else
                                    {
                                        let tmpConfObj1 =
                                        {
                                            id:'msgSaveResult',showTitle:true,title:this.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
                                        }
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