
import React from "react";
import NbBase from "./base.js";

export default class NbLabel extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state.value = typeof props.value == 'undefined' ? ''  : props.value;
        this.state.text = typeof props.value == 'undefined' ? ''  : props.value;
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        if(typeof this.props.format != 'undefined' && this.props.format == 'currency')
        {
            this.setState({value:e.toString(),text:Number(e).currency()})
            return
        }
        
        this.setState({value:e.toString(),text:e.toString()})
    }
    render()
    {
        return <span id={this.props.id}>{this.state.text}</span>
    }
}