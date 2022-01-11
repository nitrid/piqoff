import React from 'react';
import Base from './base.js';

export default class Button extends Base
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
    }
    render()
    {
        return (
            <button 
                className={this.props.className} 
                type="button"
                id={this.props.id}
                onClick={this._onClick}
                >{this.props.text}
            </button>
        )
    }
}