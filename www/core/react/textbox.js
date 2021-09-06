import React from 'react';
import TextBox from 'devextreme-react/text-box';

export default class NdTextBox extends React.Component
{
    constructor(props)
    {
        super(props)
        
        this.state = 
        {
            value : ''
        }
        if(typeof props.param != 'undefined' && props.param.length > 0 && typeof props.id != 'undefined')
        {
            let tmp = props.param.filter(x => x.ELEMENT_ID === props.id)
            if(tmp.length > 0)
            {
                this.state.value = tmp[0].VALUE
            }
        }

        this.onValueChanged = this.onValueChanged.bind(this)
        this.onEnterKey = this.onEnterKey.bind(this)
        
        if(typeof this.props.parent != 'undefined' && typeof this.props.id != 'undefined')
        {
            this.props.parent[this.props.id] = this
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
    onValueChanged(e) 
    {           
        this.value = e.value;
        if(typeof this.props.onValueChanged != 'undefined')
        {
            this.props.onValueChanged();
        }
    }
    onEnterKey()
    {
        if(typeof this.props.onEnterKey != 'undefined')
        {
            this.props.onEnterKey();
        }
    }
    render()
    {
        if(typeof this.props.title == 'undefined')
        {
            return (
                <div className="dx-field">
                    <TextBox showClearButton={true} height='fit-content' 
                        valueChangeEvent="keyup" onValueChanged={this.onValueChanged} 
                        onEnterKey={this.onEnterKey} value={this.state.value}/>
                </div>
            )
        }
        else
        {
            return (
                <div className="dx-field">
                    <div className="dx-field-label" style={{textAlign:'right'}}>{this.props.title}</div>
                    <TextBox className="dx-field-value" showClearButton={true} height='fit-content' 
                        valueChangeEvent="keyup" onValueChanged={this.onValueChanged} 
                        onEnterKey={this.onEnterKey}  value={this.state.value}/>
                </div>
            )
        }
    }
}