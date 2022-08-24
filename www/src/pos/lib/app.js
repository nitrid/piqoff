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
import transferCls from './transfer.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';

export default class App extends React.Component
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
            connected : true,
            splash : 
            {
                type : 0,
                headers : 'Warning',
                title : 'Sunucu ile bağlantı kuruluyor.',
            },
            vtadi : ''
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

        this.textValueChanged = this.textValueChanged.bind(this)
        this.onDbClick = this.onDbClick.bind(this)        
        
        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.on('connect',async () => 
        {
            if(!this.state.connected)
            {
                let tmpConfObj =
                {
                    id:'msgOnlineAlert',showTitle:true,title:this.lang.t("msgOnlineAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                    button:[{id:"btn01",caption:this.lang.t("msgOnlineAlert.btn01"),location:'after'}],
                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOnlineAlert.msg")}</div>)
                }
                await dialog(tmpConfObj);
            }
            
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'POS')))
            {
                App.instance.setState({logined:true,connected:true});
            }
            else
            {
                App.instance.setState({logined:false,connected:true});
            }
        })
        this.core.on('connect_error',(error) => 
        {
            //this.setState({connected:false});
        })
        this.core.on('disconnect',async () => 
        {
            App.instance.setState({connected:false});
            let tmpConfObj =
            {
                id:'msgOfflineAlert',showTitle:true,title:this.lang.t("msgOfflineAlert.title"),showCloseButton:true,width:'500px',height:'200px',
                button:[{id:"btn01",caption:this.lang.t("msgOfflineAlert.btn01"),location:'after'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOfflineAlert.msg")}</div>)
            }
            await dialog(tmpConfObj);
        })        
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
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        await this.transfer.init('POS')
    }
    render() 
    {
        const { opened,logined,connected,splash } = this.state;

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