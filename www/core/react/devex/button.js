import React from 'react';
import {Button} from 'devextreme-react/button';
import Base from './base.js';

export default class NdButton extends Base
{
    constructor(props)
    {
        super(props)

        this.state.text = props.text;
        this.state.icon = props.icon;
        this.state.width = props.width;
        this.state.height = props.height;
        this.state.type = props.type;
        this.state.stylingMode = props.stylingMode;
        this.state.disabled = props.disabled;

        this._onClick = this._onClick.bind(this);
    }
    //#region Private
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    //#endregion
    render()
    {
        // YETKİLENDİRMEDEN GELEN GÖRÜNÜR GÖRÜNMEZ DURUMU. DEĞER BASE DEN GELİYOR.
        if(this.state.visible == false)
        {
            return <div></div>
        }

        return (
            <Button id={this.props.id} 
            location={this.props.location}
            text={this.state.text} 
            width={this.state.width} 
            height={this.state.height} 
            type={this.state.type} 
            stylingMode={this.state.stylingMode}
            icon={this.state.icon}
            onClick={this._onClick}
            validationGroup={this.props.validationGroup}
            disabled={this.state.disabled}
            />
        )
    }
}