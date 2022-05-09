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
            show : false
        }
    }
    show()
    {
        this.setState({show:true})
    }
    hide()
    {        
        this.setState({show:false})
    }
    render()
    {
        return(
            <Modal show={this.state.show} fullscreen={this.state.fullscreen} onHide={()=>{this.hide()}}>
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