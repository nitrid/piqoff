import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import Base,{ Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from './base.js';

export { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule }

export default class NdSelectBox extends Base
{
    constructor(props)
    {
        super(props)
        this.dev = null;

        this.state.value = typeof props.value != 'undefined' ? props.value : ''
        this.state.readOnly = typeof props.readOnly == 'undefined' ? false : props.readOnly 

        this._onInitialized = this._onInitialized.bind(this);
        this._onValueChanged = this._onValueChanged.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onCustomItemCreating = this._onCustomItemCreating.bind(this);
        this._onSelectionChanged = this._onSelectionChanged.bind(this);
        this._onFocusIn = this._onFocusIn.bind(this);
        this._onFocusOut = this._onFocusOut.bind(this);
        this._onOpened = this._onOpened.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this.setData = this.setData.bind(this);
    }
    //#region Private
    _onInitialized(e) 
    {
        this.dev = e.component;
        if(typeof this.props.dt != 'undefined' && typeof this.props.dt.data != 'undefined' && typeof this.props.dt.field != 'undefined')
        {
            this.onRefresh()
        } 
    }  
    _selectBoxView()
    {
        return (
            <SelectBox id={this.props.id}
            readOnly={this.state.readOnly}
            acceptCustomValue={this.props.acceptCustomValue}
            dataSource={typeof this.state.data == 'undefined' ? typeof this.props.dataSource != 'undefined' ? this.props.dataSource : undefined : this.state.data.store} 
            displayExpr={this.props.displayExpr} 
            valueExpr={this.props.valueExpr}
            defaultValue={this.props.defaultValue}
            showClearButton={this.props.showClearButton}
            searchEnabled={this.props.searchEnabled}
            searchMode={'contains'}
            searchExpr={this.props.searchExpr}
            searchTimeout={this.props.searchTimeout || 200}
            minSearchLength={this.props.minSearchLength || 0}
            openOnFieldClick={this.props.openOnFieldClick}
            onValueChanged={this._onValueChanged}
            onChange={this._onChange}
            onCustomItemCreating = {this._onCustomItemCreating}
            onInitialized={this._onInitialized}
            onSelectionChanged={this._onSelectionChanged}
            onFocusIn={this._onFocusIn}
            onFocusOut={this._onFocusOut}
            onOpened={this._onOpened}
            onKeyDown={this._onKeyDown}
            itemRender={this.props.itemRender}
            height={this.props.height}
            style={this.props.style}
            value={this.state.value}
            dropDownButtonRender={this.props.dropDownButtonRender}
            buttons={this.props.buttons}
            >
                {this.props.children}
                {this.validationView()}
            </SelectBox>
        )
    }
    _onValueChanged(e) 
    {
        if(this.value != e.value)
        {
            if(e.value == null)
            {
                this.value = ""
            }
            else
            {
                this.value = e.value;
            }    
        }

        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onValueChanged(e);
        }
    }
    _onCustomItemCreating(e)
    {       
        if(typeof this.props.onCustomItemCreating != 'undefined')
        {
            this.props.onCustomItemCreating(e)
        }
    }
    _onChange() 
    {
        if(typeof this.props.onChange != 'undefined')
        {
            this.props.onChange();
        }
    }
    _onSelectionChanged(e)
    {
        if(typeof this.props.onSelectionChanged != 'undefined')
        {
            this.props.onSelectionChanged(e);
        }
    }
    _onFocusIn(e)
    {
        if(typeof this.props.onFocusIn != 'undefined')
        {
            this.props.onFocusIn(e);
        }
    }
    _onFocusOut(e)
    {
        if(typeof this.props.onFocusOut != 'undefined')
        {
            this.props.onFocusOut(e);
        }
    }
    _onOpened(e)
    {
        if(typeof this.props.onOpened != 'undefined')
        {
            this.props.onOpened(e);
        }
    }
    _onKeyDown(e)
    {
        if(typeof this.props.onKeyDown != 'undefined')
        {
            this.props.onKeyDown(e);
        }
    }
    //#endregion
    get value()
    {
        return this.state.value
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
                    //SELECTBOX DA DEĞİŞEN DEĞERİN DISPLAY DE DEĞERİNİ DATATABLE A YANSITILIYOR
                    if(typeof this.props.dt.display != 'undefined' && typeof this.displayValue != 'undefined' && this.displayValue != null)
                    {
                        this.props.dt.data.find(x => x === this.props.dt.row)[this.props.dt.display] = this.displayValue
                    }
                }
                else
                {
                    this.props.dt.data[this.props.dt.data.length-1][this.props.dt.field] = e
                    //SELECTBOX DA DEĞİŞEN DEĞERİN DISPLAY DE DEĞERİNİ DATATABLE A YANSITILIYOR
                    if(typeof this.props.dt.display != 'undefined' && typeof this.displayValue != 'undefined' && this.displayValue != null)
                    {
                        this.props.dt.data[this.props.dt.data.length-1][this.props.dt.display] = this.displayValue
                    }
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
                        //SELECTBOX DA DEĞİŞEN DEĞERİN DISPLAY DE DEĞERİNİ DATATABLE A YANSITILIYOR
                        if(typeof this.props.dt.display != 'undefined' && typeof this.displayValue != 'undefined' && this.displayValue != null)
                        {
                            tmpData.find(x => x === this.props.dt.row)[this.props.dt.display] = this.displayValue
                        }
                    }
                    else
                    {
                        tmpData[tmpData.length-1][this.props.dt.field] = e
                        //SELECTBOX DA DEĞİŞEN DEĞERİN DISPLAY DE DEĞERİNİ DATATABLE A YANSITILIYOR
                        if(typeof this.props.dt.display != 'undefined' && typeof this.displayValue != 'undefined' && this.displayValue != null)
                        {
                            tmpData[tmpData.length-1][this.props.dt.display] = this.displayValue
                        }
                    }
                }
            }
        }

        this.setState({value:e == null ? '' : e})
    }
    get readOnly()
    {
        return this.state.readOnly
    }
    set readOnly(e)
    {
        this.setState({readOnly:e})
    }
    get displayValue()
    {
        return this.dev.option('displayValue');
    }
    async componentDidMount()
    {
        if(typeof this.state.data != 'undefined')
        {
            await this.dataRefresh(this.state.data)                         
        }
    }
    async setData(pData)
    {
        await this.dataRefresh({source:pData})
    }
    focus()
    {
        this.dev.focus();
    }
    render()
    {
        if(typeof this.props.simple != 'undefined' && this.props.simple)
        {
            return this._selectBoxView()
        }
        else
        {
            // TITLE POZISYONU LEFT,RIGHT,TOP,BOTTOM 
            if(typeof this.state.titleAlign == 'undefined')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{typeof this.props.title == 'undefined' ? '' : this.props.title}</div>
                        <div className="dx-field-value">
                            {this._selectBoxView()}
                        </div>
                    </div>
                )
            }
            else if(this.state.titleAlign == 'left')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label">{typeof this.props.title == 'undefined' ? '' : this.props.title}</div>
                        <div className="dx-field-value">
                            {this._selectBoxView()}
                        </div>
                    </div>
                )
            }
            else if(this.state.titleAlign == 'right')
            {
                return (
                    <div className="dx-field">
                        <div className="dx-field-label" style={{textAlign:'right'}}>{typeof this.props.title == 'undefined' ? '' : this.props.title}</div>
                        <div className="dx-field-value">
                            {this._selectBoxView()}
                        </div>
                    </div>
                )
            }
        }
    }
}