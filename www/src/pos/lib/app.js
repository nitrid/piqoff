import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

import moment from 'moment';
import io from "socket.io-client";

import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import React from 'react';
import {core, datatable,param,access} from '../../core/core.js'
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import { LoadPanel } from 'devextreme-react/load-panel';

import Login from './login.js'
import Pos from '../pages/posDoc.js'
import CustomerInfoScreen from '../pages/customerInfoScreen.js'
import ItemInfoScreen from '../pages/itemInfoScreen.js'
import PosSetting from '../pages/posSetting.js'
import PosItemsList from '../pages/posItemsList.js'
import PosSaleReport from '../pages/posSaleReport.js'
import transferCls from './transfer.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';

import {prm} from '../meta/prm.js'
import {acs} from '../meta/acs.js'

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
            transferPanel : false,
            transProgress : "",
            msgTransfer : "",
            licenced : false,
            licenceMsg : '',
            page:''
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

        if(/android/i.test(navigator.userAgent || navigator.vendor || window.opera))
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
        else
        {
            
            this.device = false
            this.init();
        }
    }
    async init()
    {
        let tmpHost = window.location.origin
        if(this.device)
        {
            tmpHost = typeof localStorage.host != 'undefined' ? 'http://' + localStorage.host : window.location.origin
        }
        else
        {
            if(localStorage.getItem('local') != null && localStorage.getItem('local'))
            {
                tmpHost = localStorage.getItem('host')
            }
        }
        
        //this.core = new core(io(tmpHost,{timeout:1000,reconnection: true,reconnectionAttempts: Infinity,reconnectionDelay: 500,reconnectionDelayMax: 1000,transports : ['websocket']}));        
        this.core = new core(io(tmpHost,{transports : ['websocket']}));        
        this.core.appInfo = {...appInfo}
        this.prmObj = new param(prm)
        this.acsObj = new access(acs);
        this.payType = new datatable();
        
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
            //LİSANS KONTROLÜ YAPILDIKTAN SONRA KULLANICI DISCONNECT EDİLİYOR.
            else if(typeof e.id != 'undefined' && e.id == 'M001')
            {
                this.core.auth.logout()
                this.core.socket.disconnect();
                this.setState({licenced:true,logined:false,licenceMsg:e.data});                
            }
        })

        this.transfer = new transferCls()
        await this.transfer.init('POS');
        await this.core.util.waitUntil(0)
    }
    async login()
    {
        //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
        if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'POS')))
        {
            await this.loadPos()
            App.instance.setState({logined:true,splash:false});
        }
        else
        {
            App.instance.setState({logined:false,splash:false});
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
        if (/android/i.test(navigator.userAgent || navigator.vendor || window.opera) == false) 
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
        }
    }
    async loadPos()
    {
        return new Promise(async (resolve) =>
        {
            await this.prmObj.load({APP:'POS',USERS:this.core.auth.data.CODE})
            await this.acsObj.load({APP:'POS',USERS:this.core.auth.data.CODE})

            this.payType.selectCmd = {query:"SELECT * FROM POS_PAY_TYPE",local:{type : "select",query : "SELECT * FROM POS_PAY_TYPE;"}}
            await this.payType.refresh()
            
            if(this.core.util.isElectron() && !this.core.offline)
            {
                let deviceData = await this.core.local.select({ query: "SELECT * FROM POS_DEVICE_VW_01" });
                let userData = await this.core.local.select({ query: "SELECT * FROM USERS WHERE STATUS = 1" });
                this.core.appInfo.version = await this.core.util.getVersion()
                if(localStorage.getItem('version') == null || localStorage.getItem('version') != this.core.appInfo.version || deviceData.result.recordset.length === 0 || userData.result.recordset.length === 0)
                {
                    App.instance.setState({splash:false,transferPanel:true});
                    //DATA TRANSFER İŞLEMİ
                    this.transfer.on('onState',(pParam)=>
                    {
                        if(pParam.tag == 'progress')
                        {
                            App.instance.setState({transProgress : pParam.index + " / " + pParam.count});
                        }
                        else
                        {
                            App.instance.setState({msgTransfer : pParam.text + " " + this.lang.t("popTransfer.msg3")});
                        }
                    })
                    await this.transfer.transferSql(true)
                    App.instance.setState({transProgress : "",msgTransfer:this.lang.t("popTransfer.msgApp")});
                    setTimeout(() => {window.close()}, 2000);
                    localStorage.setItem('version',this.core.appInfo.version)
                }    
            }
            resolve()
        })
    }
    setPage(pPage)
    {
        this.setState({page:pPage})
    }
    render() 
    {
        const { logined,splash,lcd,itemInfo,transferPanel,transProgress,msgTransfer,page } = this.state;

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
        
        if(lcd)
        {
            return <CustomerInfoScreen/>
        }
        if(itemInfo)
        {
            return <ItemInfoScreen/>
        }
        
        if(transferPanel)
        {
            return(
                <div style={this.style.splash_body}>
                    <div className="card" style={{position: 'relative',margin:'auto',top: '30%',width: '600px',height: 'fit-content'}}>
                        <div className="card-header">{this.lang.t("popTransfer.titleApp")}</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 pb-2">
                                    <h3 className="text-center">{transProgress}</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="text-center">{msgTransfer}</h3>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            )
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
        
        if(page == 'menu')
        {
            return <PosSetting/>
        }
        else if(page == 'itemsList')
        {
            return <PosItemsList/>
        }
        else if(page == 'posSaleReport')
        {
            return <PosSaleReport/>
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