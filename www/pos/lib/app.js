import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {core, datatable} from '../../core/core.js'
import enMessages from '../meta/lang/devexpress/en.js';
import frMessages from '../meta/lang/devexpress/fr.js';
import trMessages from '../meta/lang/devexpress/tr.js';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import i18n from './i18n.js'
import Drawer from 'devextreme-react/drawer';
import {Toolbar} from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem,GroupItem } from 'devextreme-react/form';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import SelectBox from 'devextreme-react/select-box';
import { LoadPanel } from 'devextreme-react/load-panel';

import HTMLReactParser from 'html-react-parser';

import Login from './login.js'

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
            connected : false,
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
        
        this.core = new core(io(window.location.origin,{timeout:100000}));
        this.textValueChanged = this.textValueChanged.bind(this)
        this.onDbClick = this.onDbClick.bind(this)

        if(!App.instance)
        {
            App.instance = this;
        }

        this.core.on('connect',async () => 
        {
            if((await this.core.sql.try()).status == 1)
            {
                let tmpSplash = 
                {
                    type : 0,
                    headers : 'Warning',
                    title: 'Sql sunucuya bağlanılamıyor.',
                }
                App.instance.setState({logined:false,connected:false,splash:tmpSplash});
            }
            else if((await this.core.sql.try()).status == 2)
            {
                let tmpSplash = 
                {
                    type : 1,
                    headers : 'Veritabanı yok. Oluşturmak istermisiniz.',
                    title: '',
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
            if((await this.core.auth.login(window.sessionStorage.getItem('auth'),'ADMIN')))
            {
                //ADMIN PANELINE YANLIZCA ADMINISTRATOR ROLUNDEKİ KULLANICILAR GİREBİLİR...
                if(this.core.auth.data.ROLE == 'Administrator')
                {
                    App.instance.setState({logined:true,connected:true});
                }
                else
                {
                    App.instance.setState({logined:false,connected:true});
                }
            }
            else
            {
                App.instance.setState({logined:false,connected:true});
            }
        })
        this.core.on('connect_error',(error) => 
        {
            this.setState({connected:false});
        })
        this.core.on('disconnect',async () => 
        {
            App.instance.setState({connected:false});
            this.core.auth.logout()
        })
        
        this.core.on('onExecuting',()=>
        {
            console.log('onExecuting')
        })    
        this.core.on('onExecuted',()=>
        {
            console.log('onExecuted')
        })       
    }
    async componentDidMount()
    {
        console.log(22)
        let tmpDt = new datatable()
        tmpDt.selectCmd = "SELECT * FROM ITEMS"
        await tmpDt.refresh()
        console.log(33)
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
            else
            {
                //VERITABANI OLUŞTURMAK İÇİN AÇILAN EKRAN.
                return(
                    <div style={this.style.splash_body}>
                        <div className="card" style={this.style.splash_box}>
                            <div className="card-header" style={{height:'40px'}}>{splash.headers}</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 pb-2">
                                        <h6 className="text-center">{splash.title}</h6>
                                    </div>
                                </div>
                                <div className="dx-field">
                                    <div className="dx-field-label">Veritabanı Adı</div>
                                    <div className="dx-field-value">
                                        <TextBox id="VtAdi" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} />
                                    </div>
                                </div>
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text="Oluştur"
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onDbClick}
                                    />
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
            <div>
                <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#root' }}
                visible={this.state.isExecute}
                showIndicator={true}
                shading={true}
                showPane={true}
                />
                <div className="top-bar" style={{backgroundColor:"#3498db"}}>
                    AAAA       
                </div>
                <div>
                    TEST
                </div>
            </div>
        );
    }
}