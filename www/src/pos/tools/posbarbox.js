import React from 'react';
import ReactDOM from 'react-dom';
import {TextBox,Button,Item} from 'devextreme-react/text-box';
import Base,{ Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../core/react/devex/base.js';
export { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule }
export default class NdPosBarBox extends Base
{
    constructor(props)
    {
        super(props)
        
        this.dev = null;

        this.state.mode = typeof props.mode == 'undefined' ? 'text' : props.mode
        this.state.placeholder = typeof props.placeholder == 'undefined' ? '' : props.placeholder
        this.state.showClearButton = typeof props.showClearButton == 'undefined' ? false : props.showClearButton

        
        this._onInitialized = this._onInitialized.bind(this);
        this._onValueChanged = this._onValueChanged.bind(this);
        this._onEnterKey = this._onEnterKey.bind(this);
        this._onFocusIn = this._onFocusIn.bind(this);
        this._onFocusOut = this._onFocusOut.bind(this);
        this._onChange = this._onChange.bind(this);   
        this._onKeyDown = this._onKeyDown.bind(this);   
        this._onKeyUp = this._onKeyUp.bind(this);   
    }
    //#region Private
    _onInitialized(e) 
    {
        this.dev = e.component;    
        this.dev.option('value',this.props.value)
    }
    _onValueChanged(e) 
    {       
        if(this.props.upper)
        {
            this.value = e.value.toString().toUpperCase();
        }    
        else
        {
            this.value = e.value;
        }
        
        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onValueChanged(e);
        }
    }
    _onEnterKey(e)
    {
        if(typeof this.props.onEnterKey != 'undefined')
        {
            this.props.onEnterKey(e);
        }
    }
    _onFocusIn(e)
    {
        if(typeof this.props.selectAll == 'undefined' || this.props.selectAll == true)
        {
            this.dev.element().getElementsByTagName('input')[0].select()
        }
        if(typeof this.props.onFocusIn != 'undefined')
        {
            this.props.onFocusIn(e);
        }
    }
    _onFocusOut()
    {
        if(typeof this.props.onFocusOut != 'undefined')
        {
            this.props.onFocusOut();
        }
    }
    _onChange(e)
    {
        this.value = e.value;
        if(typeof this.props.onChange != 'undefined')
        {
            this.props.onChange(e);
        }
    }
    _onKeyDown(e)
    {
        if(typeof this.props.onKeyDown != 'undefined')
        {
            this.props.onKeyDown(e);
        }
    }
    _onKeyUp(e)
    {
        if(typeof this.props.onKeyUp != 'undefined')
        {
            this.props.onKeyUp(e);
        }
    }
    _buttonView()
    {
        if(typeof this.props.button != 'undefined')
        {
            let tmp = []
            let tmpStyle = undefined

            if(typeof this.props.displayValue != 'undefined')
            {
                tmpStyle = {style:'z-index:2'}
            }

            for (let i = 0; i < this.props.button.length; i++) 
            {
                tmp.push (
                    <Button key={i}
                        name={"btn_" + this.props.button[i].id}
                        location="after"                                               
                        options=
                        {
                            {
                                disabled:false,
                                icon: this.props.button[i].icon,
                                stylingMode: "text",
                                onClick: this.props.button[i].onClick,
                                elementAttr: tmpStyle 
                            }
                        }
                    >                
                    </Button>
                )
            }
            return tmp
        }
    }
    _txtView()
    {                        
        return (
            <TextBox id={this.props.id} mode={this.state.mode} showClearButton={this.state.showClearButton} height='fit-content'  
                maxLength={this.props.maxLength}
                placeholder={this.state.placeholder}
                style={this.props.style}
                elementAttr={this.props.elementAttr}
                valueChangeEvent="keyup" onValueChanged={this._onValueChanged} 
                onEnterKey={this._onEnterKey} onFocusIn={this._onFocusIn} onFocusOut={this._onFocusOut}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown} onKeyUp={this._onKeyUp}
                onInitialized={this._onInitialized}
                disabled={typeof this.props.editable == 'undefined' ? this.state.editable : this.props.editable}>                    
                    {this.props.children}
                    {this._buttonView()}                   
            </TextBox>
        )
    }
    //#endregion
    get value()
    {
        return this.dev.option('value')
    }
    set value(e)
    {   
        if(typeof e == 'undefined')
        {
            return;
        }        
        this.dev.option('value',e.toString())
    } 
    focus()
    {
        this.dev.focus();
    }
    render()
    {        
        // YETKİLENDİRMEDEN GELEN GÖRÜNÜR GÖRÜNMEZ DURUMU. DEĞER BASE DEN GELİYOR.
        if(this.state.visible == false)
        {
            return <div></div>
        }

        if(typeof this.props.simple != 'undefined' && this.props.simple)
        {
            return this._txtView()
        }

        if(this.state.title == '')
        {
            return (
                <div className="dx-field">
                    {this._txtView()}
                </div>
            )
        }
        else
        {
            // TITLE POZISYONU LEFT,RIGHT,TOP,BOTTOM 
            if(typeof this.state.titleAlign == 'undefined')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{this.state.title}</div>
                        {this._txtView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'top')
            {
                return (
                    <div className="dx-field">
                        <div>{this.state.title}</div>
                        {this._txtView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'bottom')
            {
                return (
                    <div className="dx-field">                        
                        {this._txtView()}
                        <div>{this.state.option.title}</div>
                    </div>
                )
            }
            else if(this.state.titleAlign == 'left')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{this.state.title}</div>
                        {this._txtView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'right')
            {
                return (
                    <div className="dx-field">                        
                        {this._txtView()}
                        <div className="dx-field-label" style={{float:'right',paddingLeft:'15px'}}>{this.state.title}</div>
                    </div>
                )
            }
        }
    }
}