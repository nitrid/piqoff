import React from 'react';
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import io from "socket.io-client";
import {core} from '../../core/core.js'
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
            },
            page:'dashboard.js'
        }

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
            if((await this.core.sql.try()).status > 0)
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers : this.lang.t('msgWarning'),
                    title: this.lang.t('msgSqlService1'),
                }
                App.instance.setState({logined:false,connected:false,splash:tmpSplash});
            }
            else
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers : this.lang.t('msgWarning'),
                    title : this.lang.t('serverConnection'),
                }
                App.instance.setState({splash:tmpSplash});
            }
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'MOB')))
            {
                App.instance.setState({logined:true,connected:true});
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
        // if(!logined)
        // {
        //     return <Login />
        // }
        
        const Page = React.lazy(() => import('../pages/' + this.state.page));

        return (
            <div style={{height:'90%'}}>
                <div className="top-bar row shadow" style={{backgroundColor: "#0d6efd",height:"65px"}}>
                    <div className="col-4" style={{paddingLeft:"25px",paddingTop:"10px"}}>
                        <img src="./css/img/logo.png" width="45px" height="45px"/>
                    </div>
                    <div className="col-4" style={{paddingTop:"10px"}} align="center">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px",width:"20%"}}
                        onClick={()=>
                        {
                            if(!this.popMenu.state.show)
                            {
                                this.popMenu.show()
                            }
                            else
                            {
                                this.popMenu.hide()
                            }
                        }}>
                            <i className="fa-solid fa-bars fa-2x"></i>
                        </NbButton>
                    </div>
                    <div className="col-4" style={{paddingRight:"25px",paddingTop:"10px"}} align="right">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px",width:"20%"}}
                        onClick={()=>
                        {
                            
                        }}>
                            <i className="fa-solid fa-user fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
                    <Page/>
                </React.Suspense>
            </div>
        )
    }
}