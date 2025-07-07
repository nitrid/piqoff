import React from 'react';
import LoadIndicator from 'devextreme-react/load-indicator';
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import io from "socket.io-client";
import {core} from '../../core/core.js'
import * as appInfo from '../../../package.json'
import Login from './login.js'
import { MenuView } from './menu';

import NbButton from '../../core/react/bootstrap/button';
import NdDialog,{dialog} from '../../core/react/devex/dialog';
import NbPopUp from '../../core/react/bootstrap/popup';
import { param,access } from '../../core/core.js';
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

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
                width: '80%',
                height: 'fit-content',
            }
        }
        this.state = 
        {
            logined : false,
            connected : false,
            licenced : false,
            licenceMsg : '',
            splash : 
            {
                type : 0,
                headers : this.lang.t("splash.headers"),
                title : this.lang.t("splash.title")
            },
            page:'empty.js',
            pageId: 'kar_02'
        }

        this.pageHistory = []; // Sayfa geçmişi için array

        if(window.origin.substring(0,4) == 'http')
        {
            this.device = false
            this.init();
        }
        else
        {
            var body = document.getElementsByTagName('body')[0];
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = "../../cordova.js";
            body.appendChild(js);
            this.device = true
            document.addEventListener('deviceready', ()=>
            {
                this.init();
            }, false);
        }
    }
    init()
    {
        this.core = new core(io(this.device ? 'http://' + localStorage.host : window.origin,{timeout:100000,transports : ['websocket']}));
        this.core.appInfo = appInfo;

        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.socket.on('connect',async () => 
        {         
             // Sunucudan güncel versiyon bilgisini al
                this.core.socket.emit('get-version',{},(tmpVersion) =>
                {
                   if( this.device && tmpVersion.success && tmpVersion.version != this.core.appInfo.version)
                   {
                        window.location="../mob/appUpdate.html"
                   }
                })  
                // Versiyon kontrolünden sonra normal login işlemlerine devam et
                if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'MOB')))
                {
                    App.instance.setState({logined:true,connected:true});
                }
                else
                {
                    App.instance.setState({logined:false,connected:true});
                } 
         
        })
        this.core.socket.on('general',async(e)=>
        {
            if(typeof e.id != 'undefined' && e.id == 'M004')
            {
                let tmpConfObj =
                {
                    id:'msgAnotherUserAlert',showTitle:true,title:this.lang.t("msgAnotherUserAlert.title"),showCloseButton:true,width:'350px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgAnotherUserAlert.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgAnotherUserAlert.msg")}</div>)
                }
                await dialog(tmpConfObj);

                this.core.auth.logout()
                window.location.reload()
            }
            //LİSANS KONTROLÜ YAPILDIKTAN SONRA KULLANICI DISCONNECT EDİLİYOR.
            else if(typeof e.id != 'undefined' && e.id == 'M001')
            {
                this.core.auth.logout()
                this.core.socket.disconnect();
                this.setState({licenced:true,connected:false,logined:false,licenceMsg:e.data});                
            }
        })
    }
    menuClick(data)
    {
        this.setState({page:data.path, pageId:data.id})
    }

    render() 
    {
        const { logined,connected,splash } = this.state;

        if(this.state.licenced)
        {
            //LİSANS KONTROLÜ YAPILDIKTAN SONRA BAĞLANTI YOKSA YA DA SQL SUNUCUYA BAĞLANAMIYORSA...
            return(
                <div style={{
                    height: '100vh',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px'
                }}>
                    <div className="card" style={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '350px',
                        background: 'linear-gradient(135deg, #2c3e50 0%, #3a4b5c 100%)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(79, 172, 254, 0.2)'
                    }}>
                        <div className="card-header" style={{
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                            color: '#ffffff',
                            padding: '8px 10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{
                                    marginRight: '8px',
                                    fontSize: '18px',
                                    fontFamily: 'Font Awesome 6 Free',
                                    fontWeight: '900'
                                }}>🔑</span>
                                Licence
                            </div>
                        </div>
                        <div className="card-body" style={{
                            padding: '12px 10px',
                            textAlign: 'center'
                        }}>
                            <div className="row">
                                <div className="col-12 pb-2">
                                    <div style={{
                                        background: 'rgba(79, 172, 254, 0.1)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        border: '1px solid rgba(79, 172, 254, 0.2)',
                                        marginBottom: '16px'
                                    }}>
                                        <h5 style={{
                                            color: '#ffffff',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            lineHeight: '1.4',
                                            margin: '0'
                                        }}>
                                            {this.state.licenceMsg}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            )                
        }
        
        if(!connected)
        {
            //SPLASH EKRANI
            if(splash.type == 0)
            {
                //BAĞLANTI YOKSA YA DA SQL SUNUCUYA BAĞLANAMIYORSA...
                return(
                    <div style={{
                        height: '100vh',
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px'
                    }}>
                        <div className="card" style={{
                            position: 'relative',
                            width: '90%',
                            maxWidth: '350px',
                            background: 'linear-gradient(135deg, #2c3e50 0%, #3a4b5c 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(79, 172, 254, 0.2)'
                        }}>
                            <div className="card-header" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#ffffff',
                                padding: '8px 10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: 'none',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{
                                        marginRight: '8px',
                                        fontSize: '18px',
                                        fontFamily: 'Font Awesome 6 Free',
                                        fontWeight: '900'
                                    }}>📶</span>
                                    {splash.headers}
                                </div>
                            </div>
                            <div className="card-body" style={{
                                padding: '12px 10px',
                                textAlign: 'center'
                            }}>
                                <div className="row">
                                    <div className="col-12 pb-2">
                                        <div style={{
                                            background: 'rgba(79, 172, 254, 0.1)',
                                            borderRadius: '12px',
                                            padding: '8px',
                                            border: '1px solid rgba(79, 172, 254, 0.2)',
                                            marginBottom: '16px'
                                        }}>
                                        <div style={{
                                                 marginBottom: '8px',
                                                 display: 'flex',
                                                 justifyContent: 'center'
                                             }}>
                                                 <div style={{
                                                     width: '32px',
                                                     height: '32px',
                                                     border: '3px solid rgba(79, 172, 254, 0.3)',
                                                     borderTop: '3px solid rgb(18, 41, 61)',
                                                     borderRadius: '50%',
                                                     animation: 'spin 1s linear infinite'
                                                 }}></div>
                                             </div>
                                            <h5 style={{
                                                color: '#ffffff',
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                lineHeight: '1.2',
                                                margin: '0'
                                            }}>
                                                {splash.title}
                                            </h5>
                                        </div>
                                    </div>
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
        
        const Page = React.lazy(() => import('../pages/' + this.state.page).then(async (obj)=>
        {
            //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
            let tmpPrm = new param(prm);
            await tmpPrm.load({APP:'MOB'})
            
            let tmpAcs = new access(acs);
            await tmpAcs.load({APP:'MOB'})

            obj.default.prototype.param = tmpPrm.filter({PAGE:this.state.pageId});
            obj.default.prototype.sysParam = tmpPrm.filter({TYPE:0});
            obj.default.prototype.access = tmpAcs.filter({PAGE:this.state.pageId});
            obj.default.prototype.user = this.core.auth.data;
            obj.default.prototype.lang = App.instance.lang;
            obj.default.prototype.t = App.instance.lang.getFixedT(null,null,this.state.pageId)

            if(typeof obj.default.prototype.sysParam.filter({ID:'deafultPage',USERS:obj.default.prototype.user.CODE}).getValue() != 'undefined' && obj.default.prototype.sysParam.filter({ID:'deafultPage',USERS:obj.default.prototype.user.CODE}).getValue().value != '')
            {
                this.setState({page:obj.default.prototype.sysParam.filter({ID:'deafultPage',USERS:obj.default.prototype.user.CODE}).getValue().value})
                this.setState({pageId:obj.default.prototype.sysParam.filter({ID:'deafultPage',USERS:obj.default.prototype.user.CODE}).getValue().pageId})
            }
            obj.default.prototype.init = (function()
            {
                let tmpCached = obj.default.prototype.init;
                return function()
                {          
                    tmpCached.apply(this,arguments)
                    this.emit('onInit')
                }
            }());

            //EVENT PAGE - ALI KEMAL KARACA - 25.01.2022 *****/
            obj.default.prototype.listeners = Object();
            obj.default.prototype.on = function(pEvt, pCallback) 
            {
                if (!this.listeners.hasOwnProperty(pEvt))
                this.listeners[pEvt] = Array();
                this.listeners[pEvt].push(pCallback); 
            }
            obj.default.prototype.emit = function(pEvt, pParams)
            {
                if (pEvt in this.listeners) 
                {
                    let callbacks = this.listeners[pEvt];
                    for (var x in callbacks)
                    {
                        callbacks[x](pParams);
                    }
                } 
            }
            
            return obj;
        }));

        return (
            <div style={{
                height: '100vh',
                background: '#f5f5f5'
            }}>
                <div className="top-bar" style={{
                    background: 'linear-gradient(to right, #4a148c, #7b1fa2, #9c27b0, #ba68c8)',
                    height: "60px",
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    zIndex: 1000,
                    position: 'relative',
                    borderRadius: '10px'
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <img src="./css/img/logo.png" width="40px" height="40px" style={{
                            borderRadius: '8px'
                        }}/>
                    </div>

                    {/* Hamburger Menu */}
                    <NbButton className="form-group btn btn-menu" style={{
                        height: "45px",
                        width: "45px",
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onClick={()=>
                        {
                            if(!this.popMenu.isShowed)
                            {                                
                                this.popMenu.show()
                            }
                            else
                            {
                                this.popMenu.hide()
                            }
                        }}>
                    <span style={{
                        color: '#ffffff',
                        fontSize: '36px',
                        fontFamily: 'Font Awesome 6 Free',
                        fontWeight: '900'
                    }}>☰</span>
                        </NbButton>

                    {/* Çıkış Butonu */}
                    <NbButton className="form-group btn btn-logout" style={{
                        height: "45px",
                        width: "45px",
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onClick={()=>
                        {
                            this.core.auth.logout()
                            window.location.reload()
                        }}>
                    <i className="fa-solid fa-door-open" style={{
                        color: '#ffffff',
                        fontSize: '28px'
                    }}></i>
                        </NbButton>
                </div>
                <div style={{position:'relative',top:'0px',height:'calc(100vh - 60px)'}}>
                    <React.Suspense fallback={
                        <div style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            background: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            padding: '15px'
                        }}>
                            <div style={{
                                background: '#2196F3',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px auto'
                            }}>
                                <div style={{
                                    width: '25px',
                                    height: '25px',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    borderTop: '3px solid #ffffff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                            <div style={{
                                color: '#333333',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                {this.lang.t("loading")}
                            </div>
                        </div>
                    }>
                        <Page/>
                    </React.Suspense>
                    </div>
                <div>
                    <MenuView id={"popMenu"} parent={this} lang={this.lang} onMenuClick={(e)=>
                    {
                        this.setState({page:e.path,pageId:e.id})
                    }}/>
                </div>
                
                <style>
                {`
                    .btn-menu:hover, .btn-logout:hover {
                        background: rgba(255,255,255,0.1) !important;
                        transform: scale(1.1);
                    }
                    
                    .btn-menu:active, .btn-logout:active {
                        background: rgba(255,255,255,0.2) !important;
                        transform: scale(1.0);
                    }
                    
                     @keyframes spin {
                         0% { transform: rotate(0deg); }
                         100% { transform: rotate(360deg); }
                     }
                `}
                </style>
            </div>
        )
    }
}
