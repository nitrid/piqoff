import React from 'react';
import { Toast } from 'devextreme-react/toast';
import Base from './base.js';

export class NdToast extends Base 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            isVisible:false,
            message:'',
            type:'info',
            displayTime:typeof props.displayTime != 'undefined' ? props.displayTime : 1000,
            width:typeof props.width != 'undefined' ? props.width : 'auto',
            position:typeof props.position != 'undefined' ? props.position : 'top center'
        }
        this.onHiding = this.onHiding.bind(this);
    }
    show(obj)
    {
        let message = obj.message;
        let type = obj.type;
        let displayTime = obj.displayTime||this.state.displayTime;
        let width = obj.width||this.state.width;
        let position = obj.position||this.state.position;

        this.setState(
            {
                isVisible:true,
                message:message,
                type:type,
                displayTime:displayTime,
                width:width,
                position:position
            });
    }
    hide()
    {
        this.setState({isVisible:false});
    }
    onHiding(e)
    {
        if(typeof this.props.onHiding != 'undefined')
        {
            this.props.onHiding(e);
        }
        this.hide();
    }
    render()
    {
        return (
            <Toast visible={this.state.isVisible} 
            id={this.props.id}
            message={this.state.message} 
            type={this.state.type} 
            displayTime={this.state.displayTime}
            width={this.state.width}
            position={this.state.position}
            onHiding={this.onHiding}/>
        );
    }
}