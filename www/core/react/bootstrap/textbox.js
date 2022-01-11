import React from 'react';
import Base from './base.js';

export default class Textbox extends Base
{
    constructor(props)
    {
        super(props)

        this.state.disabled = typeof props.disabled == 'undefined' ? false : props.disabled
        this.state.value = typeof props.value == 'undefined' ? '' : props.value

        this._onKeyUp = this._onKeyUp.bind(this)
        this._onChange = this._onChange.bind(this)
        this._onClick = this._onClick.bind(this)
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        this.setState({value:e})
    }
    _onKeyUp(e)
    {
        if(typeof this.props.onKeyUp != 'undefined')
        {
            this.props.onKeyUp(e);
        }
    }
    _onChange(e) 
    {       
        this.value = e.target.value;
        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onChanged();
        }
    }
    _onClick(e) 
    {       
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick();
        }
    }
    render()
    {
        if(this.state.visible == false)
        {
            return <div></div>
        }
        else
        {
            // TITLE POZISYONU LEFT,RIGHT,TOP
            if(typeof this.props.titleAlign == 'undefined')
            {
                return (
                    <div>
                        <label>{this.props.title}</label>
                        <input 
                            className="form-control"
                            type={this.props.type} 
                            id={this.props.id}
                            disabled={this.state.disabled}
                            value={this.state.value}
                            onKeyUp={this._onKeyUp}
                            onChange={this._onChange}
                            onClick={this._onClick}
                        >
                        </input>
                    </div>
                )
            }
            else if(this.props.titleAlign == 'top')
            {
                return (
                    <div>
                        <label>{this.props.title}</label>
                        <input 
                            className="form-control"
                            type={this.props.type} 
                            id={this.props.id}
                            disabled={this.state.disabled}
                            value={this.state.value}
                            onKeyUp={this._onKeyUp}
                            onChange={this._onChange}
                            onClick={this._onClick}
                        >
                        </input>
                    </div>
                )
            }
            else if(this.props.titleAlign == 'left')
            {
                return (
                    <div className="form-group row">
                    <label className="col-3 col-form-label" style={{textAlign:'left'}}>{this.props.title}</label>
                        <div className="col-9">
                            <input 
                                className="form-control"
                                type={this.props.type} 
                                id={this.props.id}
                                disabled={this.state.disabled}
                                value={this.state.value}
                                onKeyUp={this._onKeyUp}
                                onChange={this._onChange}
                                onClick={this._onClick}
                            >
                            </input>
                        </div>
                    </div>
                )
            }
            else if(this.props.titleAlign == 'right')
            {
                return (
                    <div className="form-group row">
                    <label className="col-3 col-form-label" style={{textAlign:'right'}}>{this.props.title}</label>
                        <div className="col-9">
                            <input 
                                className="form-control"
                                type={this.props.type} 
                                id={this.props.id}
                                disabled={this.state.disabled}
                                value={this.state.value}
                                onKeyUp={this._onKeyUp}
                                onChange={this._onChange}
                                onClick={this._onClick}
                            >
                            </input>
                        </div>
                    </div>
                )
            }
        }
    }
}