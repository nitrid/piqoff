import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

import moment from 'moment';
import io from "socket.io-client";

import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import React from 'react';
import LoadIndicator from 'devextreme-react/load-indicator';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {core,param,access} from '../../core/core.js'
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import Login from './login.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';
import NbButton from '../../core/react/bootstrap/button';
import NbPopUp from '../../core/react/bootstrap/popup';
import * as appInfo from '../../../package.json'
import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

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
        this.state = 
        {
            logined : false,
            connected : false,
            splash : 
            {
                type : 0,
                headers : 'Warning',
                title : 'Sunucu ile bağlantı kuruluyor.',
                value: localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'),
            },
            page:'bill.js'
        }
        this.pagePrm = null
        this.prmObj = null

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
    async init()
    {
        this.core = new core(io(this.device ? 'http://' + localStorage.host : window.origin,{timeout:1000,reconnection: true,reconnectionAttempts: Infinity,reconnectionDelay: 500,reconnectionDelayMax: 1000,transports : ['websocket']}));
        this.core.appInfo = appInfo
        
        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.socket.on('connect',async () => 
        {            
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'REST')))
            {
                await this.loadTab()
                App.instance.setState({logined:true,connected:true});
            }
            else
            {
                App.instance.setState({logined:false,connected:true});
            }
        })
        this.core.socket.on('connect_error',async () => 
        {
            App.instance.setState({connected:false});
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
        })
    }
    componentDidMount()
    {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('monitor') != null)
        {
            this.setState({page:'monitor.js'})
        }
    }
    async loadTab()
    {
        return new Promise(async (resolve) =>
        {
            this.prmObj = new param(prm)
            await this.prmObj.load({APP:'REST',USERS:this.core.auth.data.CODE})
            resolve()
        })
    }
    loadPage()
    {
        return React.lazy(() => import('../pages/' + this.state.page).then(async (obj)=>
        {
            //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
            let tmpPrm = new param(prm);
            await tmpPrm.load({APP:'REST'})

            let tmpAcs = new access(acs);
            await tmpAcs.load({APP:'REST'})

            obj.default.prototype.param = tmpPrm.filter({PAGE:this.state.page});
            obj.default.prototype.sysParam = tmpPrm.filter({TYPE:0});
            obj.default.prototype.access = tmpAcs.filter({PAGE:this.state.page});
            obj.default.prototype.user = this.core.auth.data;

            return obj;
        }));
    }
    render() 
    {
        const { logined,connected,splash } = this.state;

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

        const Page = this.loadPage()

        return (
            <div style={{height:'90%'}}>
                <div className="top-bar row shadow" style={{backgroundColor: "#079992",height:"65px"}}>
                    <div className="col-4" style={{paddingLeft:"25px",paddingTop:"10px"}}>
                        <img src="./css/img/logo.png" width="45px" height="45px"/>
                    </div>
                    <div className="col-4" style={{paddingTop:"10px"}} align="center">
                        <NbButton id="btnRefresh" parent={this} className="form-group btn btn-primary btn-block" style={{height:"45px"}}
                        onClick={()=>
                        {
                            window.location.reload()
                        }}>
                            <i className="fa-solid fa-arrows-rotate fa-2x"></i>
                        </NbButton>
                    </div>
                    <div className="col-4" style={{paddingRight:"25px",paddingTop:"10px"}} align="right">
                        <NbButton id="btnLogout" parent={this} className="form-group btn btn-primary btn-block" style={{height:"45px"}}
                        onClick={()=>
                        {
                            this.core.auth.logout()
                            window.location.reload()
                        }}>
                            <i className="fa-solid fa-right-from-bracket fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
                    <Page/>
                </React.Suspense>
            </div>
        );
    }
}