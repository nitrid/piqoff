
import React from "react";
import NbBase from "./base.js";

export default class NbLabel extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state.value = typeof props.value == 'undefined' ? ''  : props.value;
        this.state.text = typeof props.value == 'undefined' ? ''  : props.value;
        this.state.style = this.props.style

        this._isMounted = false;
    }
    componentDidMount()
    {
        this._isMounted = true;
    }
    componentWillUnmount()
    {
        this._isMounted = false;
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        if(this._isMounted)
        {
            if(typeof this.props.format != 'undefined' && this.props.format == 'currency')
            {
                this.setState({value:e == null ? 0 : e.toString(),text:Number(e).currency()})
            }
            else
            {
                this.setState({value:e == null ? '' : e.toString(),text:e.toString()})
            }
        }
    }
    get style()
    {
        return this.state.style
    }
    set style(e)
    {
        this.setState({style:e})
    }
    render()
    {
        return <span id={this.props.id} style={this.state.style}>{this.state.text}</span>
    }
}