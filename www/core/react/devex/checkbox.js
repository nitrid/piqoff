import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import Base from './base.js';
import { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from 'devextreme-react/validator';

export { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule }
export default class NdCheckBox extends Base
{
    constructor(props)
    {
        super(props)
        
        this.state.value = typeof props.value != 'undefined' ? props.value : false

        this._onValueChanged = this._onValueChanged.bind(this);       
        
        //PARAMETRE DEĞERİ SET EDİLİYOR.
        if(typeof props.param != 'undefined')
        {   
            let tmpVal = props.param.getValue()
            if(typeof props.param.getValue() == 'object')
            {
                tmpVal = typeof props.param.getValue().value == 'undefined' ? '' : props.param.getValue().value
            }     
            this.state.value = tmpVal;
        }
    }
    _onValueChanged(e) 
    {
        this.value = e.value;
        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onValueChanged(e);
        }
    } 
    get value()
    {
        return this.state.value
    }
    set value(e)
    {
        //VALUE DEĞİŞTİĞİNDE BU DEĞİŞİKLİK DATATABLE A YANSITMAK İÇİN YAPILDI.
        if(typeof this.props.dt != 'undefined' && typeof this.props.dt.data != 'undefined' && this.props.dt.data.length > 0 && typeof this.props.dt.field != 'undefined')
        {
            if(typeof this.props.dt.filter == 'undefined')
            {
                if(typeof this.props.dt.row != 'undefined' && typeof this.props.dt.data.find(x => x === this.props.dt.row) != 'undefined')
                {
                    this.props.dt.data.find(x => x === this.props.dt.row)[this.props.dt.field] = e
                }
                else
                {
                    this.props.dt.data[this.props.dt.data.length-1][this.props.dt.field] = e
                }
            }   
            else
            {
                let tmpData = this.props.dt.data.where(this.props.dt.filter);
                if(tmpData.length > 0)
                {
                    if(typeof this.props.dt.row != 'undefined' && typeof tmpData.find(x => x === this.props.dt.row) != 'undefined')
                    {
                        tmpData.find(x => x === this.props.dt.row)[this.props.dt.field] = e
                    }
                    else
                    {
                        tmpData[tmpData.length-1][this.props.dt.field] = e
                    }
                    
                }
            }
        }
        this.setState({value:e})
    }
    render()
    {
        return(
            <CheckBox id={this.props.id} defaultValue={this.props.defaultValue} value={this.state.value} text={this.props.text} onValueChanged={this._onValueChanged}>
            {this.props.children}
            </CheckBox>
        )
    }
}