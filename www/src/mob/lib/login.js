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

export default class Login extends React.PureComponent
{
    constructor()
    {
        super()
        this.style =
        {
            body : 
            {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight : '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            },
            login_box :
            {
                width : '100%',
                maxWidth: '400px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: 'none',
                overflow: 'hidden'
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

        if((await this.core.auth.login(this.state.kullanici,this.state.sifre,'MOB')))
        {
           
            App.instance.setState({logined:true});
        }
        else
        {
            this.setState({logined:false,alert:this.lang.t("msgInvalidUser")})
        }
    }
    async getUserList()
    {
        let tmpData = await this.core.auth.getUserList()
        await this.pg_users.setData(tmpData)
        
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
                <div className="card" style={this.style.login_box}>
                   {/* Header */}
                   <div style={{
                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                       padding: '10px 10px',
                       textAlign: 'center',
                       color: '#ffffff'
                   }}>
                       <div style={{
                           fontSize: '24px',
                           fontWeight: '700',
                           marginBottom: '4px'
                       }}>
                           🔐 PiqMob
                       </div>
                       <div style={{
                           fontSize: '13px',
                           opacity: '0.9'
                       }}>
                            {this.lang.t("lblLogin")}
                       </div>
                   </div>

                   <div style={{padding: '10px 10px'}}>
                        {/* Alert Message */}
                        {this.state.alert && (
                            <div style={{
                                 background: '#fee2e2',
                                 border: '1px solid #fecaca',
                                 borderRadius: '8px',
                                 padding: '5px',
                                 marginBottom: '8px',
                                 textAlign: 'center'
                            }}>
                                <span style={{color: '#dc2626', fontSize: '14px', fontWeight: '500'}}>
                                    ⚠️ {this.state.alert}
                                </span>
                            </div>
                        )}

                        {/* Settings Button */}
                        <div style={{
                             display: 'flex',
                             justifyContent: 'flex-end',
                             marginBottom: '8px'
                         }}>
                            <Button 
                                icon="preferences" 
                                visible={App.instance.device}
                                onClick={()=>window.location="../mob/appUpdate.html"}
                                style={{
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '4px'
                                }}
                            />
                        </div>

                        {/* Language Selection */}
                        <div style={{
                             background: '#f8f9fa',
                             padding: '8px',
                             borderRadius: '10px',
                             marginBottom: '8px'
                         }}>
                            <label style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '4px',
                                display: 'block'
                            }}>
                                🌐 {this.lang.t("txtLangSelect")}
                            </label>
                            <NdSelectBox simple={true} parent={this} id="cmbType" height='40px'
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px'
                            }}
                            displayExpr="text"                       
                            valueExpr="id"
                            value= {localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')}
                            data={{source:[{id:"en",text:"🇺🇸 English"},{id:"fr",text:"🇫🇷 Français"},{id:"tr",text:"🇹🇷 Türkçe"},{id:"de",text:"🇩🇪 Deutsch"}]}}
                            onValueChanged={(async(args)=>
                            {
                                localStorage.setItem('lang',args.value)
                                i18n.changeLanguage(args.value)
                                locale(args.value)
                                window.location.reload()
                            }).bind(this)}
                            />
                        </div>

                        {/* User Input */}
                         <div style={{
                             background: '#f8f9fa',
                             padding: '8px',
                             borderRadius: '10px',
                             marginBottom: '4px'
                         }}>
                            <label style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '4px',
                                display: 'block'
                            }}>
                                👤 {this.lang.t("txtUser")}
                            </label>
                            <NdTextBox id="Kullanici" parent={this} simple={true} showClearButton={true} height='45px' valueChangeEvent="keyup" onValueChanged={this.textValueChanged}  
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                fontSize: '14px',
                                transition: 'border-color 0.2s ease'
                            }}
                            placeholder={this.lang.t("txtUser")}/>
                        </div>

                        {/* Password Input */}
                         <div style={{
                             background: '#f8f9fa',
                             padding: '8px',
                             borderRadius: '10px',
                             marginBottom: '4px'
                         }}>
                            <label style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#374151',
                                marginBottom: '8px',
                                display: 'block'
                            }}>
                                🔒 {this.lang.t("txtPass")}
                            </label>
                            <NdTextBox id="Sifre" parent={this} mode="password" showClearButton={true} height='45px' valueChangeEvent="keyup" onValueChanged={this.textValueChanged} 
                            style={{
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                fontSize: '14px',
                                transition: 'border-color 0.2s ease'
                            }}
                            onEnterKey={this.onLoginClick}
                            placeholder={this.lang.t("txtPass")}
                            />
                        </div>

                        {/* Remember Me */}
                         <div style={{
                             marginBottom: '8px',
                             padding: '4px 0'
                         }}>
                            <NdCheckBox text={this.lang.t("chkRememberMe")} id="chkRememberMe" parent={this} defaultValue={false} 
                            style={{
                                fontSize: '14px',
                                color: '#6b7280'
                            }}/>
                        </div>

                          {/* User Select Button */}
                         <div style={{marginBottom: '8px'}}>
                            <Button
                             width={'100%'}
                             height='35px'
                             text={`👥 ${this.lang.t("btnUserSelect")}`}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={this.getUserList}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px'
                        }}>
                            <Button
                                width={'100%'}
                                height='35px'
                                text={`🚀 ${this.lang.t("btnLogin")}`}
                                style=
                                {{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                            onClick={this.onLoginClick}
                            />
                            <Button
                                width={'100%'}
                                height='35px'
                                text={`🚪 ${this.lang.t("btnLogout")}`}
                                style=
                                {{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                                    transition: 'all 0.2s ease'
                                }}
                            onClick={this.closePage}
                            />
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
            </div>
        )
    }
}