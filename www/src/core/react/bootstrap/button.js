import React from 'react';
import NbBase from './base.js';
import {acsDialog} from '../devex/acsdialog.js';

export default class NbButton extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state.disabled = this.props.disabled
        
        this._onClick = this._onClick.bind(this);
    }
    get disabled()
    {
        return this.state.disabled
    }
    set disabled(e)
    {
        this.setState({disabled:e})
    }
    async _onClick()
    {
        if(typeof this.props.onClick != 'undefined')
        {
            if(typeof this.props.access != 'undefined' && typeof this.props.access.getValue().dialog != 'undefined' && this.props.access.getValue().dialog.type != -1)
            {   
                let tmpResult = await acsDialog({id:"AcsDialog",parent:this.props.parent,type:this.props.access.getValue().dialog.type})
                if(tmpResult)
                {
                    this.props.onClick();
                }
            }
            else
            {
                this.props.onClick();
            }
        }
        if(typeof this.props.keyBtn != 'undefined' && typeof this.props.parent != 'undefined' && typeof this.props.id != 'undefined')
        {
            if(this.props.keyBtn.key == 'Backspace')
            {                
                //EKRAN YENİ AÇILDIĞINDA BUTONA BASTIĞINDA TEXTBOX A İLK DEĞER ATAMASI
                if(typeof this.props.parent[this.props.keyBtn.textbox].newStart != 'undefined' && this.props.parent[this.props.keyBtn.textbox].newStart)
                {
                    this.props.parent[this.props.keyBtn.textbox].value = ""
                    this.props.parent[this.props.keyBtn.textbox].newStart = false;
                }
                else
                {
                    this.props.parent[this.props.keyBtn.textbox].value = this.props.parent[this.props.keyBtn.textbox].value.substring(0,this.props.parent[this.props.keyBtn.textbox].value.length - 1)
                }
            }
            else
            {
                //EKRAN YENİ AÇILDIĞINDA BUTONA BASTIĞINDA TEXTBOX A İLK DEĞER ATAMASI
                if(typeof this.props.parent[this.props.keyBtn.textbox].newStart != 'undefined' && this.props.parent[this.props.keyBtn.textbox].newStart)
                {
                    this.props.parent[this.props.keyBtn.textbox].value = this.props.keyBtn.key
                    this.props.parent[this.props.keyBtn.textbox].newStart = false;
                }
                else
                {
                    this.props.parent[this.props.keyBtn.textbox].value = this.props.parent[this.props.keyBtn.textbox].value + this.props.keyBtn.key
                }
            }
        }
    }
    render()
    {
        return (
            <button 
            className={this.props.className} 
            id={this.props.id}
            disabled={this.state.disabled}
            style={this.props.style}
            onClick={this._onClick}
            >
                {this.props.children}
            </button>
        )
    }
}