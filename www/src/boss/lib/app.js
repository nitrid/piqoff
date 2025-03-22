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
                headers : 'Warning',
                title : 'Sunucu ile bağlantı kuruluyor.',
            },
           
            page:'dashboard.js',
            pageId: 'dash'
        }

        console.log(localStorage.getItem('module')),
        console.log(this)
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
        this.core.appInfo = appInfo

        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.socket.on('connect',async () => 
        {            
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'BOSS')))
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
    render() 
    {
        const { logined,connected,splash } = this.state;

        if(this.state.licenced)
        {
            //LİSANS KONTROLÜ YAPILDIKTAN SONRA BAĞLANTI YOKSA YA DA SQL SUNUCUYA BAĞLANAMIYORSA...
            return(
                <div style={this.style.splash_body}>
                    <div className="card" style={this.style.splash_box}>
                        <div className="card-header">{"Licence"}</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 pb-2">
                                    <h5 className="text-center">{this.state.licenceMsg}</h5>
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
        }
        if(!logined)
        {
            return <Login />
        }
        
        const Page = React.lazy(() => import('../pages/' + this.state.page).then(async (obj)=>
        {
            //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
            let tmpPrm = new param(prm);
            await tmpPrm.load({APP:'BOSS'})
            
            let tmpAcs = new access(acs);
            await tmpAcs.load({APP:'BOSS'})

            obj.default.prototype.param = tmpPrm.filter({PAGE:this.state.pageId});
            obj.default.prototype.sysParam = tmpPrm.filter({TYPE:0});
            obj.default.prototype.access = tmpAcs.filter({PAGE:this.state.pageId});
            obj.default.prototype.user = this.core.auth.data;
            obj.default.prototype.lang = App.instance.lang;
            obj.default.prototype.t = App.instance.lang.getFixedT(null,null,this.state.pageId)

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
            <div style={{overflow:'hidden'}}>
                <div className="top-bar row" style={{backgroundColor: '#0047AB',height:"55px",borderBottom:'2px solid #0047AB'}}>
                    <div className="col-4" style={{paddingLeft:"25px",paddingTop:"8px"}}>
                        <img src="./css/img/logo.png" width="40px" height="40px"/>
                    </div>
                    <div className="col-4" style={{paddingTop:"5px"}} align="center">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px", backgroundColor:"#0047AB", borderColor:"#0047AB"}}
                        onClick={()=>
                        {
                            window.location.reload();
                        }}>
                            <i className="fa-solid fa-refresh fa-2x"></i>
                        </NbButton>
                    </div>
                    <div className="col-4" style={{paddingTop:"5px"}} align="right">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px", backgroundColor:"#0047AB", borderColor:"#0047AB"}}
                        onClick={()=>
                        {
                            this.core.auth.logout();
                            window.location.reload();
                        }}>
                            <i className="fa-solid fa-arrow-right-from-bracket fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
                    <div style={{position:'relative',top:'55px',height:'100%'}}>
                        <Page/>
                    </div>
                </React.Suspense>
                <div>
                    <MenuView id={"popMenu"} parent={this} lang={this.lang} onMenuClick={(e)=>
                    {
                        this.setState({page:e.path,pageId:e.id})
                    }}/>
                </div>
            </div>
        )
    }
}