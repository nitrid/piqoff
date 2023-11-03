import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

import moment from 'moment';
import io from "socket.io-client";

import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import React from 'react';
import {core, datatable} from '../../core/core.js'
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import { LoadPanel } from 'devextreme-react/load-panel';
import HTMLReactParser from 'html-react-parser';

import Login from './login.js'
import Pos from '../pages/posDoc.js'
import CustomerInfoScreen from '../pages/customerInfoScreen.js'
import ItemInfoScreen from '../pages/itemInfoScreen.js'
import transferCls from './transfer.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';

import * as appInfo from '../../../package.json'
import '../plugins/balanceCounter.js'

export default class App extends React.PureComponent
{
    static instance = null;

    constructor()
    {
        super();

        loadMessages(enMessages);
        loadMessages(frMessages);
        loadMessages(trMessages);
        locale(localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'));
        i18n.changeLanguage(localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'))
        this.lang = i18n;  
        moment.locale(localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'));
        
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
            opened : true,
            logined : false,
            splash : true,
            vtadi : '',
            lcd : false,
            itemInfo : false,
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
            }
        ];
        
        let tmpHost = window.location.origin
        if(localStorage.getItem('local') != null && localStorage.getItem('local'))
        {
            tmpHost = localStorage.getItem('host')
        }
        
        this.core = new core(io(tmpHost,{timeout:100000,transports : ['websocket']}));
        this.transfer = new transferCls()
        this.core.appInfo = appInfo

        this.textValueChanged = this.textValueChanged.bind(this)
        
        if(!App.instance)
        {
            App.instance = this;
        }

        if(this.core.util.isElectron())
        {
            this.electron = global.require('electron');
        }

        let tmpOneShoot = false;
        this.core.socket.on('connect',async () => 
        {
            this.core.offline = false;
            this.login()
        })
        this.core.socket.on('connect_error',async(error) => 
        {
            this.core.offline = true;
            if(!tmpOneShoot)
            {                
                tmpOneShoot = true
                if(window.sessionStorage.getItem('auth') == null)
                {
                    App.instance.setState({logined:false,splash:false});
                }
                else
                {
                    this.login()
                }                
            }
        })
        this.core.socket.on('disconnect',async () => 
        {
            App.instance.setState({splash:false});
            this.core.offline = true;
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
    async login()
    {
        //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
        if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'POS')))
        {
            App.instance.setState({logined:true,splash:false});
        }
        else
        {
            App.instance.setState({logined:false,splash:false});
        }
    }
    menuClick(data)
    {
        if(typeof data.path != 'undefined')
        {
            Panel.instance.addPage(data);
        }
    }
    textValueChanged(e) 
    {      
        if(e.element.id == 'VtAdi')
        {
            this.setState({vtadi: e.value});
        } 
    }
    electronSend(pData)
    {
        //ELECTRONJS ILE HABERLEŞMEK İÇİN YAPILDI.AYNI UYGULAMA ÜZERİNDE AÇILMIŞ DİĞER PENCERELER İLE HABERLEŞİLEBİLİR.
        if(this.core.util.isElectron())
        {
            return new Promise(async resolve => 
            {
                this.electron.ipcRenderer.send('get',pData);
                this.electron.ipcRenderer.on('receive', (event, data) => 
                {
                    resolve(data)
                });
            })
        }
        //********************************************************************************************************** */
    }
    async componentDidMount()
    {
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('lcd') != null)
        {
            this.setState({lcd:true})
        }
        else
        {
            //DEVICE ID VE DİĞER PARAMETRELER ELECTRONJS ÜZERİNDEKİ CONFIG DEN GETIRILIYOR.
            let tmpData = await this.electronSend({tag:"arguments"})
            if(typeof tmpData != 'undefined' && typeof tmpData.data != 'undefined' && typeof tmpData.data != 'undefined' && typeof tmpData.data.deviceId != 'undefined')
            {
                localStorage.setItem('device',tmpData.data.deviceId)
                localStorage.setItem('macId',tmpData.data.macId)
                //YENİ KURULMUŞ CİHAZLARDA DEFAULT DİL SEÇİMİ.
                if(typeof tmpData.data.lang != 'undefined' && localStorage.getItem('lang') == null)
                {
                    localStorage.setItem('lang',tmpData.data.lang)    
                    i18n.changeLanguage(tmpData.data.lang)
                    locale(tmpData.data.lang)
                    window.location.reload()
                }
                if(typeof tmpData.data.itemInfo != 'undefined' && tmpData.data.itemInfo == true)
                {
                    this.setState({itemInfo:true})
                }
            }
            //************************************************************************** */
            await this.core.util.waitUntil(0)
            await this.transfer.init('POS') 
        }
    }
    render() 
    {
        const { logined,splash,lcd,itemInfo } = this.state;
        if(lcd)
        {
            return <CustomerInfoScreen/>
        }
        if(itemInfo)
        {
            return <ItemInfoScreen/>
        }
        
        if(splash)
        {
            return(
                <div style={this.style.splash_body}>
                    <div className="card" style={this.style.splash_box}>
                        <div className="card-header">{this.lang.t("loading")}</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 pb-2">
                                    <h5 className="text-center">{this.lang.t("serverConnection")}</h5>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            )           
        }
        if(!logined)
        {
            return <Login />
        }
        
        return (
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <Pos/>
            </div>
        );
    }
}