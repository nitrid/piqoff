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
import transferCls from './transfer';
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
            licenced : false,
            licenceMsg : '',
            splash : 
            {
                type : 0,
                headers : 'Warning',
                title : 'Sunucu ile bağlantı kuruluyor.',
                value: localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'),
            },
            page:'dashboard.js',
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
                console.log(navigator.camera)
                this.init();
            }, false);
        }
    }
    async init()
    {
        this.core = new core(io(this.device ? 'http://' + localStorage.host : window.origin,{timeout:100000,transports : ['websocket']}));
        this.core.appInfo = appInfo
        this.transfer = new transferCls()
        await this.transfer.init('TAB')
        
        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.socket.on('connect',async () => 
        {            
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'TAB')))
            {
                await this.loadTab()
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
    async loadTab()
    {
        return new Promise(async (resolve) =>
        {
            this.prmObj = new param(prm)
            await this.prmObj.load({APP:'TAB',USERS:this.core.auth.data.CODE})
            resolve()
        })
    }
    menu()
    {
        const menuButtons = [
            {
                id: 'saleCard',
                icon: 'fa-scale-unbalanced',
                text:this.lang.t('menu.sale'),
                onClick: () => 
                {
                    this.popMenu.hide()
                    this.setState({page:'sale.js'})
                }
            },
            {
                id: 'customerExtractCard',
                icon: 'fa-receipt',
                text: this.lang.t('menu.customerAccount'),
                onClick: () => 
                {
                    this.popMenu.hide()
                    this.setState({page:'extract.js'})
                }
            },
            {
                id: 'productCard',
                icon: 'fa-circle-info',
                text: this.lang.t('menu.itemDetail'),
                onClick: () => 
                {
                    this.popMenu.hide()
                    this.setState({page:'itemDetail.js'})
                }
            },
            {
                id: 'collectionCard',
                icon: 'fa-scale-unbalanced-flip',
                text: this.lang.t('menu.collection'),
                onClick: () => 
                {
                    this.popMenu.hide();
                    this.setState({ page: 'collection.js' });
                }
            },
            {
                id: 'customerCard',
                icon: 'fa-user-plus',
                text: this.lang.t('menu.customerCard'),
                onClick: () => 
                {
                    this.popMenu.hide();
                    this.setState({ page: 'customerCard.js' });
                }
            },
            {
                id: 'openInvoiceList',
                icon: 'fa fa-building',
                text: this.lang.t('menu.openInvoiceList'),
                onClick: () => 
                {
                    this.popMenu.hide();
                    this.setState({ page: 'openInvoiceList.js' });
                }
            }
        ];

        let tmpMenu = []
        for (let i = 0; i < menuButtons.length; i++) 
        {
            if(this.prmObj.filter({ID:menuButtons[i].id}).getValue() != false || typeof this.prmObj.filter({ID:menuButtons[i].id}).getValue() == 'undefined' )
            {
                tmpMenu.push(menuButtons[i])
            }
        }
        return tmpMenu.map(button => (
            <div className='col-4' style={{paddingTop:"30px"}} key={button.id}>
                <NbButton className="form-group btn btn-block" style={{ height: "100%", width: "100%", backgroundColor: '#0d6efd' }} onClick={button.onClick}>
                    <div className='row py-2'>
                        <div className='col-12'>
                            <i className={`fa-solid ${button.icon} fa-4x`} style={{ color: '#ecf0f1' }}></i>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <h3 style={{ color: '#ecf0f1' }}>{button.text}</h3>
                        </div>
                    </div>
                </NbButton>
            </div>
        ));
    }
    loadPage()
    {
        return React.lazy(() => import('../pages/' + this.state.page).then(async (obj)=>
        {
            //SAYFA YÜKLENMEDEN ÖNCE PARAMETRE, DİL, YETKİLENDİRME DEĞERLERİ GETİRİLİP CLASS PROTOTYPE A SET EDİLİYOR.
            let tmpPrm = new param(prm);
            await tmpPrm.load({APP:'TAB'})

            let tmpAcs = new access(acs);
            await tmpAcs.load({APP:'TAB'})

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

        const Page = this.loadPage()

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
                            this.core.auth.logout()
                            window.location.reload()
                        }}>
                            <i className="fa-solid fa-share fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <React.Suspense fallback={<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>}>
                    <Page/>
                </React.Suspense>
                <div>
                    <NbPopUp id={"popMenu"} parent={this} title={""} fullscreen={true}>
                        <div>
                            {/* 1 */}
                            <div className='row' style={{paddingTop:"30px"}}>
                                {/* DASHBOARD */}
                                <div className='col-12'>
                                    <NbButton className="form-group btn btn-block" style={{height:"100%",width:"100%",backgroundColor:'#0d6efd'}}
                                    onClick={()=>
                                    {
                                        this.popMenu.hide()
                                        this.setState({page:'dashboard.js'})
                                    }}>
                                        <div className='row py-2'>
                                            <div className='col-12'>
                                                <i className="fa-solid fa-chart-pie fa-4x" style={{color:'#ecf0f1'}}></i>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <h3 style={{color:'#ecf0f1'}}>{this.lang.t('menu.dashboard')}</h3>
                                            </div>
                                        </div>
                                    </NbButton>
                                </div>
                            </div>
                            <div className='row' >
                                {this.menu()}
                            </div>                  
                        </div>
                    </NbPopUp>
                </div>
            </div>
        );
    }
}