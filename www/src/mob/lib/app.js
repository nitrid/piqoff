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

import NbButton from '../../core/react/bootstrap/button';
import NdDialog,{dialog} from '../../core/react/devex/dialog';
import NbPopUp from '../../core/react/bootstrap/popup';

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
        if(!logined)
        {
            return <Login />
        }
        
        const Page = React.lazy(() => import('../pages/' + this.state.page));

        return (
            <div style={{height:'90%'}}>
                <div className="top-bar row shadow" style={{background: 'radial-gradient(ellipse 200px 200px at center, #5f27cd, #9a74e5)',height:"55px"}}>
                    <div className="col-4" style={{paddingLeft:"25px",paddingTop:"8px"}}>
                        <img src="./css/img/logo.png" width="40px" height="40px"/>
                    </div>
                    <div className="col-4" style={{paddingTop:"5px"}} align="center">
                        <NbButton className="form-group btn btn-primary btn-transparent btn-block" style={{height:"45px"}}
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
                        
                    </div>
                </div>
                <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
                    <div style={{paddingTop:'60px'}}>
                        <Page/>
                    </div>
                </React.Suspense>
                <div>
                    <NbPopUp id={"popMenu"} parent={this} title={""} fullscreen={true}>
                        <div>
                            {/* <div className='row' >
                                <div className='col-12'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%"}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'dashboard.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-chart-pie fa-3x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>{this.lang.t('menu.dashboard')}</h6>
                                            </div>
                                        </div>
                                    </NbButton>
                                </div>
                            </div> */}
                            <div className='row' style={{paddingTop:"10px"}}>
                                {/* SATIŞ */}
                                <div className='col-4 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'sale.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-barcode fa-2x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>Stok İşlemleri</h6>
                                            </div>
                                        </div>                                        
                                    </NbButton>
                                </div>
                                {/* SATIŞ */}
                                <div className='col-4 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'sale.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-warehouse fa-2x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>Depo İşlemleri</h6>
                                            </div>
                                        </div>                                        
                                    </NbButton>
                                </div>
                                {/* SATIŞ */}
                                <div className='col-4 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'sale.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-rectangle-list fa-2x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>Sipariş İşlemleri</h6>
                                            </div>
                                        </div>                                        
                                    </NbButton>
                                </div>
                                {/* SATIŞ */}
                                <div className='col-4 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'sale.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-clipboard-list fa-2x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>İrsaliye İşlemleri</h6>
                                            </div>
                                        </div>                                        
                                    </NbButton>
                                </div>
                                {/* SATIŞ */}
                                <div className='col-4 pb-2'>
                                    <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'sale.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-window-restore fa-2x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'40px'}}>Sipariş Karşılama</h6>
                                            </div>
                                        </div>                                        
                                    </NbButton>
                                </div>                                
                            </div>
                        </div>
                    </NbPopUp>
                </div>
            </div>
        )
    }
}