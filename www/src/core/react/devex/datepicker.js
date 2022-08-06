import React from 'react';
import DateBox from 'devextreme-react/date-box';
import Base,{ Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from './base.js';
import moment from 'moment';

export { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule }
export default class NdDatePicker extends Base
{
    constructor(props)
    {
        super(props)
        
        this.state.value = typeof props.param == 'undefined' ? new Date(0) : new Date(props.param.getValue().toString())
        this.state.title = typeof props.title == 'undefined' ? '' : props.title
        this.state.titleAlign = typeof props.titleAlign == 'undefined' ? 'left' : props.titleAlign
        this.state.showClearButton = typeof props.showClearButton == 'undefined' ? false : props.showClearButton
        this.state.type = typeof props.type == 'undefined' ? 'date' : props.type
        this.state.editorOptions = typeof props.editorOptions == 'undefined' ? undefined : props.editorOptions
        
        this._onValueChanged = this._onValueChanged.bind(this)
        this._onEnterKey = this._onEnterKey.bind(this)
    }
    //#region Private
    _onValueChanged(e) 
    {           
        console.log(e)
        this.value = e.value;
        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onValueChanged();
        }
    }
    _onEnterKey()
    {
        if(typeof this.props.onEnterKey != 'undefined')
        {
            this.props.onEnterKey();
        }
    }
    _dateView()
    {
        return (
            <DateBox id={this.props.id} showClearButton={this.state.showClearButton} 
            height='fit-content' 
            valueChangeEvent="keyup" 
            value={moment(this.state.value).format("YYYY-MM-DD") == '1970-01-01' ? null : moment(this.state.value)} 
            disabled={this.state.editable}
            type={this.state.type}
            dateSerializationFormat={"yyyy-MM-dd"}
            editorOptions={this.state.editorOptions}
            onEnterKey={this._onEnterKey} onValueChanged={this._onValueChanged}>
                {this.props.children}
                {this.validationView()}
            </DateBox>
        )
    }
    //#endregion
    get value()
    {
        return this.state.value == null ? new Date(0) : this.state.value
    }
    set value(e)
    {        
        if(typeof e == 'undefined')
        {
            return;
        }
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
        // YETKİLENDİRMEDEN GELEN GÖRÜNÜR GÖRÜNMEZ DURUMU. DEĞER BASE DEN GELİYOR.
        if(this.state.visible == false)
        {
            return <div></div>
        }
        if(typeof this.props.simple != 'undefined' && this.props.simple)
        {
            return this._dateView()
        }
        if(typeof this.state.title == 'undefined')
        {
            return (
                <div className="dx-field">
                    {this._dateView()}
                </div>
            )
        }
        else
        {
            // TITLE POZISYONU LEFT,RIGHT,TOP,BOTTOM 
            if(typeof this.state.titleAlign == 'undefined')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{this.state.title}</div>
                        {this._dateView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'top')
            {
                return (
                    <div className="dx-field">
                        <div>{this.state.title}</div>
                        {this._dateView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'bottom')
            {
                return (
                    <div className="dx-field">                        
                        {this._dateView()}
                        <div>{this.state.option.title}</div>
                    </div>
                )
            }
            else if(this.state.titleAlign == 'left')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{this.state.title}</div>
                        {this._dateView()}
                    </div>
                )
            }
            else if(this.state.titleAlign == 'right')
            {
                return (
                    <div className="dx-field">                        
                        {this._dateView()}
                        <div className="dx-field-label" style={{float:'right',paddingLeft:'15px'}}>{this.state.title}</div>
                    </div>
                )
            }
        }
    }
}