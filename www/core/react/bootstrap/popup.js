import React from 'react';
import NbBase from './base.js';

export default class NbPopUp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            type : typeof this.props.type == 'undefined' ? 'fullscreen' : this.props.type
        }
    }
    show()
    {
        $('#' + this.props.id).modal('show')
    }
    render()
    {
        return(
            <div className="modal" id={this.props.id}>
                <div className={"modal-dialog modal-" + this.state.type}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{typeof this.props.title == 'undefined' ? '' : this.props.title}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}