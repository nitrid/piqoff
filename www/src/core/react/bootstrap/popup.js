import React from 'react';
import NbBase from './base.js';
import { Modal } from 'react-bootstrap'

export default class NbPopUp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            fullscreen : this.props.fullscreen,
            show : false,
            centered : this.props.centered
        }
    }
    show()
    {
        this.setState({show:true})
        if(typeof this.props.onShowed != 'undefined')
        {
            this.props.onShowed()
        }
    }
    hide()
    {  
        setTimeout(() => 
        {
            this.setState({show:false})    
        }, 100);   
        if(typeof this.props.onHideing != 'undefined')
        {
            this.props.onHideing()
        }
    }
    render()
    {
        return(
            <Modal show={this.state.show} fullscreen={this.state.fullscreen} centered={this.state.centered} onHide={()=>{this.hide()}} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{typeof this.props.title == 'undefined' ? '' : this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
            </Modal>
        )
    }
}