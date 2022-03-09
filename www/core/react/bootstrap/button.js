import React from 'react';
import NbBase from './base.js';

export default class NbButton extends NbBase
{
    constructor(props)
    {
        super(props)

        this._onClick = this._onClick.bind(this);
    }
    _onClick()
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick();
        }
        if(typeof this.props.keyBtn != 'undefined' && typeof this.props.parent != 'undefined' && typeof this.props.id != 'undefined')
        {
            if(this.props.keyBtn.key == 'Backspace')
            {
                this.props.parent[this.props.keyBtn.textbox].value = this.props.parent[this.props.keyBtn.textbox].value.substring(0,this.props.parent[this.props.keyBtn.textbox].value.length - 1)
            }
            else
            {
                this.props.parent[this.props.keyBtn.textbox].value = this.props.parent[this.props.keyBtn.textbox].value + this.props.keyBtn.key
            }
        }
    }
    render()
    {
        return (
            <button 
            className={this.props.className} 
            id={this.props.id}
            style={this.props.style}
            onClick={this._onClick}
            >
                {this.props.children}
            </button>
        )
    }
}