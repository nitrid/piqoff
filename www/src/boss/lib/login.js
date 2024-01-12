import React from 'react';
import App from './app.js'
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/textbox.js'
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import NdCheckBox from '../../core/react/devex/checkbox.js';
import NdPopUp from '../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,KeyboardNavigation,Export} from '../../core/react/devex/grid.js';
import i18n from './i18n.js'
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import { dialog } from '../../core/react/devex/dialog.js';
import { datatable } from '../../core/core';

export default class Login extends React.PureComponent
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                backgroundColor: '#0047AB',
                height : '100%',
                paddingTop : '100px' 
            },
            login_box :
            {
                position : 'inherit',
                margin :'auto',
                top : '50%',
                width : '350px',
                height : 'fit-content',
                backgroundColor : '#f8f9fa',  
            },
            login_box_header : 
            {
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'height': '100px',
            }
        }  
        this.state = 
        {
            kullanici: '',
            sifre: '',
            alert: ''
        }  
        this.core = App.instance.core;    
        this.lang = App.instance.lang;

        this.onLoginClick = this.onLoginClick.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.textValueChanged = this.textValueChanged.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        if(typeof localStorage.userName != 'undefined' && typeof localStorage.userPwd != 'undefined')
        {
           this.chkRememberMe.value = true
           this.state.kullanici = localStorage.userName 
           this.state.sifre = localStorage.userPwd
           this.Kullanici.value = localStorage.userName 
           this.Sifre.value = localStorage.userPwd
        }
        this.Kullanici.focus()
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

        if(this.chkRememberMe.value == true)
        {
            localStorage.userName = this.state.kullanici
            localStorage.userPwd = this.state.sifre
        }
        else
        {
            localStorage.userName =''
            localStorage.userPwd =''
        }

        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'BOSS')))
        {
            // SADECE UYGULAMAYA AİT KULLANICILARININ GİREMEMESİ İÇİN YAPILDI
            let tmpDt = new datatable()
            tmpDt.import([this.core.auth.data])
            if(tmpDt.where({USER_APP : {"LIKE" : "BOSS"}}).length == 0)
            {
                this.setState({logined:false,alert:this.lang.t("msgUserAccess")})
            }
            else
            {
                App.instance.setState({logined:true});
            }
        }
        else
        {
            this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
        }
    }
    async getUserList()
    {
        let tmpData = await this.core.auth.getUserList()
        let tmpDt = new datatable()
        tmpDt.import(tmpData)
        tmpDt = tmpDt.where({USER_APP : {"LIKE" : "BOSS"}})
        await this.pg_users.setData(tmpDt)
        
        this.pg_users.show()
        this.pg_users.onClick = (data) =>
        {
            this.setState({kullanici: data[0].CODE});
            this.Kullanici.setState({value:data[0].CODE})
            this.Sifre.focus()
        }
    }
    closePage()
    {
        window.close()
    }
    render()
    {
        return (
            <div style={this.style.body}>
                <div className="p-5"></div>
                <div className="card" style={this.style.login_box}>
                    <div className="card-header">
                        <div className='row'>
                            <div className='col-4'></div>
                            <div className='col-8'>
                                <img src="./css/img/piqsoftlogo.png" height="48px"/>
                            </div>
                        </div>
                    </div>
                   <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h6 className="text-center" style={{color:'#ff7675'}}>{this.state.alert}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-10 pb-2">
                            
                            </div>
                            <div className="col-2 pb-2">
                                <Button icon="preferences" visible={App.instance.device}
                                onClick={()=>window.location="../boss/appUpdate.html"}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtLangSelect")}</div>
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
                            <div className="dx-field-label">{this.lang.t("txtUser")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged}  
                                placeholder={this.lang.t("txtUser")}/>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">{this.lang.t("txtPass")}</div>
                            <div className="dx-field-value">
                                <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='fit-content' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} 
                                onEnterKey={this.onLoginClick}
                                placeholder={this.lang.t("txtPass")}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-value" >
                            <NdCheckBox  text={this.lang.t("chkRememberMe")}id="chkRememberMe" parent={this} defaultValue={false} />
                            </div>
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <div className="dx-field">
                                    <Button
                                    width={'100%'}
                                    height='fit-content'
                                    text={this.lang.t("btnUserSelect")}
                                    type="success"
                                    stylingMode="contained"
                                    onClick={this.getUserList}
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
                                    text={this.lang.t("btnLogin")}
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
                                    text={this.lang.t("btnLogout")}
                                    type="danger"
                                    stylingMode="contained"
                                    onClick={this.closePage}
                                    />
                                </div>
                            </div>
                        </div>
                        <NdPopGrid id={"pg_users"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'100%'}
                        height={'100%'}
                        selection={{mode:"single"}}
                        title={this.lang.t("userListTitle")}
                        >
                            <Column dataField="CODE" caption="CODE" width={150} defaultSortOrder="asc"/>
                            <Column dataField="NAME" caption="NAME" width={150} defaultSortOrder="asc" />                            
                        </NdPopGrid>
                   </div>
                </div>
                <div className="p-2"></div>
            </div>
        )
    }
}