import React from 'react';
import NbBase from './base.js';

export default class NbRadioButton extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            btnClass : 
            [
                '-outline',
                '-outline',
                '-outline'
            ],
            value : 0
        }
        this._onClick = this._onClick.bind(this)
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        for (let x = 0; x < this.state.btnClass.length; x++) 
        {
            this.state.btnClass[x] = "-outline"
        }
        this.state.btnClass[e] = ""

        this.setState({btnClass:this.state.btnClass,value:e})
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e)
        }
    }
    _buttonView()
    {
        if(typeof this.props.button != 'undefined')
        {
            let tmp = []
            
            let tmpIconFn = (pIcon) =>
            {
                if(typeof pIcon != 'undefined')
                {
                    pIcon = "fa-solid " + pIcon
                    return (
                        <div className='row'>
                            <i className={pIcon} style={{fontSize: "20px"}} />
                        </div>
                    )
                }
                return
            }
            let tmpTextFn = (pText) =>
            {
                if(typeof pText != 'undefined')
                {
                    return (
                        <div className='row'>
                            <span>{pText}</span>
                        </div>
                    )
                }
                return
            }

            for (let i = 0; i < this.props.button.length; i++) 
            {
                let tmpClass = "btn btn-block btn" + this.state.btnClass[i] + "-primary"
                tmp.push (
                    <button className={tmpClass} key={this.props.button[i].id} id={this.props.button[i].id} style={this.props.button[i].style}
                    onClick={()=>
                    {
                        for (let x = 0; x < this.state.btnClass.length; x++) 
                        {
                            this.state.btnClass[x] = "-outline"
                        }
                        this.state.btnClass[i] = ""

                        this.setState({btnClass:this.state.btnClass,value:i})
                        this._onClick(i)
                    }}>
                        {tmpIconFn(this.props.button[i].icon)}
                        {tmpTextFn(this.props.button[i].text)}
                    </button>
                )
            }
            return tmp
        }
    }
    render()
    {
        return (
            <div className="row">
                <div className='col-12 pe-1'>
                    <div className="btn-group-vertical" style={{width:'100%'}}>
                        {this._buttonView()}
                    </div>
                </div>            
            </div>
        )
    }
}