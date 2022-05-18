
import React from "react";
import NbBase from "./base.js";

export default class NbLabel extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state.value = typeof props.value == 'undefined' ? ''  : props.value;
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        this.setState({value:e.toString()})
    }
    render()
    {
        return this.state.value
    }
}