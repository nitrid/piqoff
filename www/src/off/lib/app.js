import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

import moment from 'moment';
import io from "socket.io-client";

import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {core} from '../../core/core.js'
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import Drawer from 'devextreme-react/drawer';
import Toolbar from 'devextreme-react/toolbar';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import { LoadPanel } from 'devextreme-react/load-panel';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import NdPopUp from '../../core/react/devex/popup.js';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdButton from '../../core/react/devex/button.js';

import HTMLReactParser from 'html-react-parser';

import Navigation from './navigation.js'
import Panel from './panel.js'
import Login from './login.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';
import IdleTimer from 'react-idle-timer'

import * as appInfo from '../../../package.json'
export default class App extends React.PureComponent
{
    static instance = null;

    constructor()
    {
        super();

        loadMessages(enMessages);
        loadMessages(frMessages);
        loadMessages(trMessages);
        locale(localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'));
        i18n.changeLanguage(localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'))
        this.lang = i18n;  
        moment.locale(localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'));
        
        this.UserChange = this.UserChange.bind(this)
                
        this.style =
        {
            splash_body : 
            {
                backgroundColor : '#ecf0f1',                
                height: '100%',
            },
            splash_box :
            {
                position: 'relative',
                margin:'auto',
                top: '30%',
                width: '400px',
                height: 'fit-content',
            }
        }

        this.toolbarItems = 
        [
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
                    text:"",
                    icon : 'refresh',
                    onClick : () => window.location.reload()
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
                icon : 'card',
                options : 
                {
                    icon : 'refresh',
                    onClick :this.UserChange
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
        ];

        this.state = 
        {
            opened : true,
            logined : false,
            connected : false,
            splash : 
            {
                type : 0,
                headers :this.lang.t("loading"),
                title :  this.lang.t('serverConnection'),
            },
            vtadi : '',
            isExecute:false,
            user : "",
            toolbarItems : this.toolbarItems,
            changeUser : "",
            changePass : ""
        }
                
        this.core = new core(io(window.location.origin,{timeout:100000,transports : ['websocket']}));
        this.textValueChanged = this.textValueChanged.bind(this)
        this.onDbClick = this.onDbClick.bind(this)
        this.core.appInfo = appInfo

        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.socket.on('connect',async () => 
        {
            if((await this.core.sql.try()).status == 1)
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers : 'Warning',
                    title: 'Sql sunucuya bağlanılamıyor.',
                }
                App.instance.setState({logined:false,connected:false,splash:tmpSplash});
            }
            else if((await this.core.sql.try()).status == 2)
            {
                let tmpSplash = 
                {
                    type : 1,
                    headers : 'Veritabanı yok. Oluşturmak istermisiniz.',
                    title: '',
                }

                App.instance.setState({logined:false,connected:false,splash:tmpSplash});
            }
            else
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers :this.lang.t("loading"),
                    title :  this.lang.t('serverConnection'),
                }
                App.instance.setState({splash:tmpSplash});
            }
            console.log(this.core.auth.data)
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'OFF')))
            {
                App.instance.setState({logined:true,connected:true});
                await this.core.util.waitUntil()
                this.setUser()

            }
            else
            {
                App.instance.setState({logined:false,connected:true});
            }
        })
        this.core.socket.on('connect_error',(error) => 
        {
            this.setState({connected:false});
        })
        this.core.socket.on('disconnect',async () => 
        {
            App.instance.setState({connected:false});
            this.core.auth.logout()
        })   
        this.core.socket.on('general',async(e)=>
        {
            if(typeof e.id != 'undefined' && e.id == 'M004')
            {
                let tmpConfObj =
                {
                    id:'msgAnotherUserAlert',showTitle:true,title:this.lang.t("msgAnotherUserAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgAnotherUserAlert.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgAnotherUserAlert.msg")}</div>)
                }
                await dialog(tmpConfObj);

                this.core.auth.logout()
                window.location.reload()
            }
        })
    }
    menuClick(data)
    {
        if(typeof data.path != 'undefined')
        {
            Panel.instance.addPage(data);
            this.panel = Panel.instance
        }
    }
    textValueChanged(e) 
    {      
        if(e.element.id == 'VtAdi')
        {
            this.setState({vtadi: e.value});
        } 
    }
    async onDbClick(e)
    {
        if(this.state.vtadi == '')
        {
            return;
        }

        let tmpResult = await this.core.sql.createDb(this.state.vtadi)
        if(tmpResult.msg == "")
        {
            let tmpSplash = 
            {
                type : 1,
                headers : 'Veritabanı yok. Oluşturmak istermisiniz.',
                title: 'Vt kurulumu başarılı.Lütfen config dosyasını kontrol edip sunucuyu restart ediniz.',
            }
            App.instance.setState({logined:false,connected:false,splash:tmpSplash});
        }
        else
        {
            let tmpSplash = 
            {
                type : 1,
                headers : 'Veritabanı yok. Oluşturmak istermisiniz.',
                title: tmpResult.msg,
            }
            App.instance.setState({logined:false,connected:false,splash:tmpSplash});
        }
    }
    async UserChange()
    {
        let tmpData = await this.core.auth.getUserList()
        await this.pg_users.setData(tmpData)
        this.pg_users.show()
        this.pg_users.onClick = (data) =>
        {
            this.state.changeUser = data[0].CODE,
            this.popPassword.show()
                                            this.txtPassword.value = ''
        }
    }
    setUser()
    {
        this.setState({toolbarItems:[
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
                    onClick : this.UserChange
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
    render() 
    {
        const { opened,logined,connected,splash } = this.state;

        if(!connected)
        {
            //SPLASH EKRANI
            if(splash.type == 0)
            {
                //BAĞLANTI YOKSA YA DA SQL SUNUCUYA BAĞLANAMIYORSA...
                return(
                    <div style={this.style.splash_body}>
                        <div className="card" style={this.style.splash_box}>
                            <div className="card-header">{splash.headers}</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 pb-2">
                                        <h5 className="text-center">{splash.title}</h5>
                                    </div>
                                </div>
                            </div>                        
                        </div>
                    </div>
                )                
            }
            else
            {
                //VERITABANI OLUŞTURMAK İÇİN AÇILAN EKRAN.
                return(
                    <div style={this.style.splash_body}>
                        <div className="card" style={this.style.splash_box}>
                            <div className="card-header" style={{height:'40px'}}>{splash.headers}</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 pb-2">
                                        <h6 className="text-center">{splash.title}</h6>
                                    </div>
                                </div>
                                <div className="dx-field">
                                    <div className="dx-field-label">Veritabanı Adı</div>
                                    <div className="dx-field-value">
                                        <TextBox id="VtAdi" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} />
                                    </div>
                                </div>
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text="Oluştur"
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onDbClick}
                                    />
                                </div>
                            </div>                        
                        </div>
                    </div>
                )                
            }
        }
        if(!logined)
        {
            return <Login />
        }
        
        return (
            <div>
                {/* Ekranda belirli bir süre boş beklediğinde logout olması için yapıldı */}
                <IdleTimer timeout={(180 * 60) * 1000}
                onIdle={()=>
                {
                    this.core.auth.logout()
                    window.location.reload()
                }}/>   
                <LoadPanel
                shadingColor="rgba(0,0,0,0)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <div className="top-bar">
                    <Toolbar className="main-toolbar" items={this.state.toolbarItems}/>
                </div>
                <div>
                    <Drawer className="main-drawer" opened={opened} openedStateMode={'shrink'} position={'left'} 
                        revealMode={'slide'} component={Navigation} >
                        <Panel />
                    </Drawer>
                </div>
                <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
              visible={false}
              position={{of:'#root'}} 
              showTitle={true} 
              showBorders={true}
              width={'50%'}
              height={'90%'}
              title="Kullanıcı Listesi"
              >
                  <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                  <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
              </NdPopGrid>
                <div>
                        <NdPopUp parent={this} id={"popPassword"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.lang.t("popPassword.title")}
                        container={"#root"} 
                        width={'500'}
                        height={'200'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.lang.t("popPassword.Password")} alignment="right" />
                                    <NdTextBox id="txtPassword" mode="password" parent={this} simple={true}
                                            maxLength={32}
                                    ></NdTextBox>
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("popPassword.btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {       
                                                if((await this.core.auth.login(this.state.changeUser,this.txtPassword.value,'OFF')))
                                                {
                                                    // POS KULLANICILARININ GİREMEMESİ İÇİN YAPILDI
                                                    if(this.core.auth.data.ROLE == 'Pos')
                                                    {
                                                        this.setState({logined:false,alert:this.lang.t("msgUserAccess")})
                                                    }
                                                    else
                                                    {
                                                        App.instance.setState({logined:true});
                                                        window.location.reload()
                                                    }
                                                }
                                                else
                                                {
                                                    let tmpConfObj =
                                                    {
                                                        id:'msgPasswordWrong',showTitle:true,title:this.lang.t("msgPasswordWrong.title"),showCloseButton:true,width:'500px',height:'200px',
                                                        button:[{id:"btn01",caption:this.lang.t("msgPasswordWrong.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPasswordWrong.msg")}</div>)
                                                    }
                                        
                                                    await dialog(tmpConfObj);
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popPassword.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
            </div>
             
        );
    }
}