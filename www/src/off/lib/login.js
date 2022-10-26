import React from 'react';
import App from './app.js'
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import i18n from './i18n.js'
import NbKeyboard from "../tools/keyboard.js";
import { Gallery } from 'devextreme-react/gallery';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import { dialog } from '../../core/react/devex/dialog.js';
import NbLabel from '../../core/react/bootstrap/label.js';

export default class Login extends React.Component
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                backgroundColor : '#0d6efd',                
                height: '100%',
            },
            login_box :
            {
                position: 'inherit',
                margin:'auto',
                top: '30%',
                width: '400px',
                height: 'fit-content',
            },
            keyboardBox :
            {
                position: 'inherit',
                backgroundColor : '#0d6efd',        
                margin:'auto',
                top: '30%',
                width: '90%',
                height: 'fit-content',
            }
        }  
        this.state = 
        {
            kullanici: '',
            sifre: '',
            alert: ''
        }  
        this.core = App.instance.core;    
        this.lang = App.instance.lang;
        this.image = ['../../cardicon3.png'];

        this.cardIdCheck = this.cardIdCheck.bind(this)
        this.onLoginClick = this.onLoginClick.bind(this)
        this.cardIdRead = this.cardIdRead.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.textValueChanged = this.textValueChanged.bind(this)
        this.setUser = this.setUser.bind(this)

    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.Kullanici.focus()
    }
    textValueChanged(e) 
    {      
        if(e.element.id == 'Kullanici')
        {
            this.setState({kullanici: e.value});
        } 
        else if(e.element.id == 'Sifre')
        {
            this.setState({sifre: e.value});
        }
    }
    async onLoginClick(e)
    {
        if(this.state.kullanici == '' && this.state.sifre == '')
        {
            return;
        }
        
        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'OFF')))
        {
            // POS KULLANICILARININ GİREMEMESİ İÇİN YAPILDI
            if(this.core.auth.data.ROLE == 'Pos')
            {
                this.setState({logined:false,alert:this.lang.t("msgUserAccess")})
            }
            else
            {
                App.instance.setState({logined:true});
                this.setUser()
            }
        }
        else
        {
            this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
        }
    }
    async getUserList()
    {
        let tmpData = await this.core.auth.getUserList()
        await this.pg_users.setData(tmpData)
        this.pg_users.show()
        this.pg_users.onClick = (data) =>
        {
            this.setState({kullanici: data[0].CODE});
            this.Kullanici.setState({value:data[0].CODE})
        }
    }
    closePage()
    {
        window.close()
    }
    setUser()
    {
        App.instance.setState({toolbarItems:[
            {
                widget : 'dxButton',
                location : 'before',
                options : 
                {
                    icon : 'menu',
                    onClick : () => this.setState({opened: !this.state.opened})
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    text:this.core.auth.data.NAME,
                    icon : 'card',
                    onClick : App.instance.UserChange
                }
            },
            {
                widget : 'dxSelectBox',
                location : 'after',
                options : 
                {
                    width: 80,
                    items: [{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"}],
                    valueExpr: 'id',
                    displayExpr: 'text',
                    value: localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'),
                    onValueChanged: (args) => 
                    {
                        localStorage.setItem('lang',args.value)
                        i18n.changeLanguage(args.value)
                        locale(args.value)
                        window.location.reload()
                    }
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    icon : 'refresh',
                    onClick : () => window.location.reload()
                }
            },
            {
                widget : 'dxButton',
                location : 'after',
                options : 
                {
                    icon : 'fa-solid fa-arrow-right-to-bracket',
                    onClick : () => 
                    {                                                        
                        this.core.auth.logout()
                        window.location.reload()
                    }
                }
            }
        ]})
    }
    async cardIdRead()
    {
        this.setState({kullanici: ''});
        this.setState({sifre: ''});
        this.Kullanici.setState({value: ''});
        this.Sifre.setState({value: ''});
        await this.popCardId.show();
        setTimeout(() => {
            this.cardRead.focus()
        }, 500);
        
    }
    async cardIdCheck(pValue)
    {
        let idCheck = false
        let tmpData = await this.core.auth.getUserList()
        for (let i = 0; i < tmpData.length; i++) 
        {
            if(tmpData[i].CARDID == pValue)
            {
                if(await this.core.auth.login(tmpData[i].CODE,tmpData[i].PWD,'OFF'))
                {
                    App.instance.setState({logined:true});
                    idCheck = true
                }
                else
                {
                    this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
                }
            }
        }

        if(idCheck == false)
        {
            let tmpConfObj =
            {
                id:'msgInvalidUser',showTitle:true,title:this.lang.t("msgInvalidUser"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("btnOk"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgInvalidUser")}</div>)
            }

            await dialog(tmpConfObj);
        }
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="p-5"></div>
                <div className="card" style={this.style.login_box}>
                   <div className="card-header">Login</div>
                   <div className="card-body">
                        <div className="row">
                            <div className="col-12 pb-2">
                                <h6 className="text-center" style={{color:'#ff7675'}}>{this.state.alert}</h6>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtLangSelect")}</div>
                            <div className="dx-field-value">
                            <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content'
                                    displayExpr="text"                       
                                    valueExpr="id"
                                    value= {localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')}
                                    data={{source:[{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"}]}}
                                    onValueChanged={(async(args)=>
                                            {
                                                localStorage.setItem('lang',args.value)
                                                i18n.changeLanguage(args.value)
                                                locale(args.value)
                                                window.location.reload()
                                        }).bind(this)}
                                    />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtUser")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} 
                                onFocusIn={()=>{this.keyboard.textobj = "Kullanici"}} placeholder={this.lang.t("txtUser")}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtPass")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged}
                                onEnterKey={this.onLoginClick}
                                onFocusIn={()=>{this.keyboard.textobj="Sifre"}} placeholder={this.lang.t("txtPass")}
                                />
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnUserSelect")}
                                        type="success"
                                        stylingMode="contained"
                                        onClick={this.getUserList}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-6">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnLogin")}
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text={this.lang.t("btnLogout")}
                                        type="danger"
                                        stylingMode="contained"
                                        onClick={this.closePage}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <div className="dx-field">
                                    <Button
                                        icon={"fa-regular fa-id-card"}
                                        width={'100%'}
                                        height='50px'
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.cardIdRead}
                                    />
                                </div>
                            </div>                            
                        </div>    
                        <div className="row">
                            <div className="col-12">
                                <NbLabel id="info" parent={this} value={this.core.appInfo.name + " version : " + this.core.appInfo.version}/>
                            </div>
                        </div>                    
                        <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'50%'}
                        height={'90%'}
                        selection={{mode:"single"}}
                        title={this.lang.t("userListTitle")}
                        >
                            <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                            <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
                        </NdPopGrid>
                         {/* CardId PopUp */}              
                        <NdPopUp parent={this} id={"popCardId"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        container={"#root"} 
                        width={'500'}
                        height={'500'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                            <Item>
                                <img src="./css/img/cardicon3.png" height="300px"/>
                            </Item>
                            <Item>
                            <NdTextBox id="cardRead" parent={this} simple={true}  mode="password" showClearButton={true} height='fit-content'
                                placeholder={this.lang.t("txtCardRead")}
                                onKeyUp={async(k)=>
                                {
                                    if(k.event.code != 'Enter')
                                    {
                                      setTimeout(() => {
                                          this.cardRead.value = ''
                                      }, 50);
                                    }
                                    else
                                    {
                                       this.cardIdCheck(this.cardRead.value)
                                    }
                                }}
                                />
                            </Item>
                            </Form>
                        </NdPopUp>
                   </div>
                </div>
                <div className="p-2"></div>
                <div className="card" style={this.style.keyboardBox}>
                    <NbKeyboard id={"keyboard"} parent={this}  textobj="Kullanici"/>
                </div>
            </div>
        )
    }
}