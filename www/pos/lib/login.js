import React from 'react';
import App from './app.js'
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import i18n from './i18n.js'
import { locale, loadMessages, formatMessage } from 'devextreme/localization';

export default class Login extends React.Component
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                backgroundColor : '#0d6efd',                
                height: '100%',
            },
            login_box :
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
            kullanici: '',
            sifre: '',
            alert: ''
        }  
        this.core = App.instance.core;    

        this.onLoginClick = this.onLoginClick.bind(this)
        this.textValueChanged = this.textValueChanged.bind(this)
    }
    textValueChanged(e) 
    {      
        if(e.element.id == 'Kullanici')
        {
            this.setState({kullanici: e.value});
        } 
        else if(e.element.id == 'Sifre')
        {
            this.setState({sifre: e.value});
        }
    }
    async onLoginClick(e)
    {
        if(this.state.kullanici == '' && this.state.sifre == '')
        {
            return;
        }
        
        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'OFF')))
        {
            //ADMIN PANELINE YANLIZCA ADMINISTRATOR ROLUNDEKİ KULLANICILAR GİREBİLİR...
            if(this.core.auth.data.ROLE == 'Administrator')
            {
                App.instance.setState({logined:true});
            }
            else
            {
                this.setState({logined:false,alert:'Kullanıcının giriş yetkisi yok !'})
            }
        }
        else
        {
            this.setState({logined:false,alert:'Kullanıcı yada şifre geçersiz !'})
        }
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="card" style={this.style.login_box}>
                   <div className="card-header">Login</div>
                   <div className="card-body">
                        <div className="row">
                            <div className="col-12 pb-2">
                                <h6 className="text-center" style={{color:'#ff7675'}}>{this.state.alert}</h6>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Dil Seçimi</div>
                            <div className="dx-field-value">
                            <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content'
                                    displayExpr="text"                       
                                    valueExpr="id"
                                    value= {localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')}
                                    data={{source:[{id:"en",text:"EN"},{id:"fr",text:"FR"},{id:"tr",text:"TR"}]}}
                                    onValueChanged={(async(args)=>
                                            {
                                                localStorage.setItem('lang',args.value)
                                                i18n.changeLanguage(args.value)
                                                locale(args.value)
                                                window.location.reload()
                                        }).bind(this)}
                                    />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Kullanıcı Adı</div>
                            <div className="dx-field-value">
                                <TextBox id="Kullanici" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Şifre</div>
                            <div className="dx-field-value">
                                <TextBox id="Sifre" mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} />
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text="Kullanıcı Seçim"
                                        type="success"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-6">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text="Giriş"
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dx-field">
                                    <Button
                                        width={'100%'}
                                        height='fit-content'
                                        text="Çıkış"
                                        type="danger"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <div className="dx-field">
                                    <Button
                                        icon={"fa-regular fa-id-card"}
                                        width={'100%'}
                                        height='50px'
                                        type="default"
                                        stylingMode="contained"
                                        onClick={this.onLoginClick}
                                    />
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        )
    }
}