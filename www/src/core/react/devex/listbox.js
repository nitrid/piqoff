import React from 'react';
import Base from './base.js';

import List from 'devextreme-react/list';

export default class NdListBox extends Base
{
    constructor(props)
    {
        super(props)
        
        this.state.value = typeof props.value == 'undefined' ? [] : props.value;

        this._onOptionChanged = this._onOptionChanged.bind(this);
    }
    //#region Private
    _onOptionChanged(e) 
    {
        if (e.name == 'selectedItemKeys') 
        {
            this.value = e.value;
        }
        
        if(typeof this.props.onOptionChanged != 'undefined')
        {
            this.props.onOptionChanged(e);
        }
    } 
    //#endregion
    async componentDidMount()
    {
        if(typeof this.state.data != 'undefined')
        {
            await this.dataRefresh(this.state.data)                 
        }
    }
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        this.setState({value:e})
    }
    async componentDidMount()
    {
        if(typeof this.state.data != 'undefined')
        {
            await this.dataRefresh(this.state.data)                 
        }
    }
    render()
    {
        return(
            <List
            dataSource={typeof this.state.data == 'undefined' ? undefined : this.state.data.store} 
            width={this.props.width}
            height={this.props.height}
            displayExpr={this.props.displayExpr}
            keyExpr={this.props.keyExpr}
            showSelectionControls={this.props.showSelectionControls}
            selectionMode={this.props.selectionMode}
            selectAllMode={this.props.selectAllMode}
            selectedItemKeys={this.state.value}
            onOptionChanged={this._onOptionChanged}
            >
            </List>
        )
    }
}