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
import Login from './login.js'
import NdDialog,{dialog} from '../../core/react/devex/dialog';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import * as appInfo from '../../../package.json'

import Chart, {
    ArgumentAxis,
    Series,
    CommonSeriesSettings,
    Label,
    Legend,
    Border,
    Export,
  } from 'devextreme-react/chart';

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
        
        console.log(new Date())
        console.log(moment(new Date(),'DD.MM.YYYY hh:mm:ss').utcOffset(0).toDate())
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
            connected : false,
            splash : 
            {
                type : 0,
                headers : 'Warning',
                title : 'Sunucu ile bağlantı kuruluyor.',
            },
            vtadi : '',
            isExecute:false,
            page:{id: 'main_01_001',text: 'main',path: 'main'}
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
                    value: localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang'),
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
        ];

        if(window.origin.substring(0,4) == 'http')
        {
            this.device = false
        }
        else
        {
            var body = document.getElementsByTagName('body')[0];
            var js = document.createElement("script");
            js.type = "text/javascript";
            js.src = "../../cordova.js";
            body.appendChild(js);
            this.device = true
        }

        this.core = new core(io(this.device ? 'http://' + localStorage.host : window.origin,{timeout:100000,transports : ['websocket']}));
        this.textValueChanged = this.textValueChanged.bind(this)
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
                    headers : 'Warning',
                    title: 'Sql sunucuya bağlanılamıyor.',
                }
                App.instance.setState({logined:false,connected:false,splash:tmpSplash});
            }
            else
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers : 'Warning',
                    title : 'Sunucu ile bağlantı kuruluyor.',
                }
                App.instance.setState({splash:tmpSplash});
            }
            //SUNUCUYA BAĞLANDIKDAN SONRA AUTH ILE LOGIN DENETLENIYOR
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'TAB')))
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
    textValueChanged(e) 
    {      
        if(e.element.id == 'VtAdi')
        {
            this.setState({vtadi: e.value});
        } 
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
        }

        if(!logined)
        {
            return <Login />
        }
        
        return (
            <div style={{backgroundColor:"#ecf0f1"}}>
                <div className="top-bar row shadow" style={{backgroundColor: "#0d6efd",height:"65px"}}>
                    <div className="col-4" style={{paddingLeft:"25px",paddingTop:"10px"}}>
                        <img src="./css/img/logo.png" width="45px" height="45px"/>
                    </div>
                    <div className="col-4" style={{paddingTop:"10px"}} align="center">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px",width:"20%"}}
                        onClick={()=>
                        {
                        }}>
                            <i className="fa-solid fa-bars fa-2x"></i>
                        </NbButton>
                    </div>
                    <div className="col-4" style={{paddingRight:"25px",paddingTop:"10px"}} align="right">
                        <NbButton className="form-group btn btn-primary btn-block" style={{height:"45px",width:"20%"}}
                        onClick={()=>
                        {
                        }}>
                            <i class="fa-solid fa-user fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <ScrollView>
                    <div className='row'>
                        <div className='col-12' style={{paddingLeft:"15px",paddingRight:"15px",paddingTop:"70px"}}>
                            <Chart
        title="Australian Medal Count"
        dataSource={[{
            year: 1896,
            gold: 2,
            silver: 0,
            bronze: 0,
          }, {
            year: 1900,
            gold: 2,
            silver: 0,
            bronze: 3,
          }, {
            year: 1904,
            gold: 0,
            silver: 0,
            bronze: 0,
          }, {
            year: 1908,
            gold: 1,
            silver: 2,
            bronze: 2,
          }, {
            year: 1912,
            gold: 2,
            silver: 2,
            bronze: 3,
          }, {
            year: 1916,
            gold: 0,
            silver: 0,
            bronze: 0,
          }, {
            year: 1920,
            gold: 0,
            silver: 2,
            bronze: 1,
          }, {
            year: 1924,
            gold: 3,
            silver: 1,
            bronze: 2,
          }, {
            year: 1928,
            gold: 1,
            silver: 2,
            bronze: 1,
          }, {
            year: 1932,
            gold: 3,
            silver: 1,
            bronze: 1,
          }, {
            year: 1936,
            gold: 0,
            silver: 0,
            bronze: 1,
          }, {
            year: 1940,
            gold: 0,
            silver: 0,
            bronze: 0,
          }, {
            year: 1944,
            gold: 0,
            silver: 0,
            bronze: 0,
          }, {
            year: 1948,
            gold: 2,
            silver: 6,
            bronze: 5,
          }, {
            year: 1952,
            gold: 6,
            silver: 2,
            bronze: 3,
          }, {
            year: 1956,
            gold: 13,
            silver: 8,
            bronze: 14,
          }, {
            year: 1960,
            gold: 8,
            silver: 8,
            bronze: 6,
          }, {
            year: 1964,
            gold: 6,
            silver: 2,
            bronze: 10,
          }, {
            year: 1968,
            gold: 5,
            silver: 7,
            bronze: 5,
          }, {
            year: 1972,
            gold: 8,
            silver: 7,
            bronze: 2,
          }, {
            year: 1976,
            gold: 0,
            silver: 1,
            bronze: 4,
          }, {
            year: 1980,
            gold: 2,
            silver: 2,
            bronze: 5,
          }, {
            year: 1984,
            gold: 4,
            silver: 8,
            bronze: 12,
          }, {
            year: 1988,
            gold: 3,
            silver: 6,
            bronze: 5,
          }, {
            year: 1992,
            gold: 7,
            silver: 9,
            bronze: 11,
          }, {
            year: 1996,
            gold: 9,
            silver: 9,
            bronze: 23,
          }, {
            year: 2000,
            gold: 16,
            silver: 25,
            bronze: 17,
          }, {
            year: 2004,
            gold: 17,
            silver: 16,
            bronze: 16,
          }, {
            year: 2008,
            gold: 14,
            silver: 15,
            bronze: 17,
          }, {
            year: 2012,
            gold: 8,
            silver: 15,
            bronze: 12,
          }, {
            year: 2016,
            gold: 8,
            silver: 11,
            bronze: 10,
          }]}
        id="chart">
        <Series valueField="bronze" name="Bronze Medals" color="#cd7f32" />
        <Series valueField="silver" name="Silver Medals" color="#c0c0c0" />
        <Series valueField="gold" name="Gold Medals" color="#ffd700" />
        <CommonSeriesSettings
          argumentField="year"
          type="steparea">
          <Border visible={false} />
        </CommonSeriesSettings>
        <ArgumentAxis valueMarginsEnabled={false}>
          <Label format="decimal" />
        </ArgumentAxis>
        <Export enabled={true} />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center" />
      </Chart>
                        </div>
                    </div>
                </ScrollView>
            </div>
        );
    }
}