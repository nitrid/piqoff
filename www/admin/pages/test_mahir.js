import React from 'react';
import App from '../lib/app.js';
import { datatable } from '../../core/core.js';
import Textbox from '../../core/react/bootstrap/textbox.js';
import Button from '../../core/react/bootstrap/button.js';
import PopUp from '../../core/react/bootstrap/popup.js';
import NdDatePicker from '../../core/react/devex/datepicker.js';

export default class Test_Mahir extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }
    async componentDidMount() 
    {        
        //console.log(this.T01.value = "mahır")
    }
    onSelectionChanged(e)
    {
        if(e.key == "m")
        {
            console.log(this.T01.state.disabled)
            this.T01.state.disabled = true;
        }
    }
    onClick(e)
    {
        $("#P01").modal("show");
    }
    render()
    {
        return (
            <div>
                <div className="row">
                    <div className="col-4">
                        <Textbox 
                        parent = {this}
                        id = {"T01"}
                        lang = {"tr"}
                        title = {"Test :"}
                        titleAlign = {"right"}
                        type = {"text"}
                        disabled = {false}
                        onKeyUp = {this.onSelectionChanged}
                        onClick = {this.onClick}
                        >
                        </Textbox>
                    </div>
                    <div className="col-4">
                        <Button
                            parent = {this}
                            id = {"T01"}
                            text = "Button"
                            className = "btn btn-danger btn-block"
                            onClick={this.onClick}
                        >
                        </Button>
                    </div>
                    <div className="col-4">
                        <NdDatePicker 
                            id="txtBelge" 
                            parent={this} 
                            title={"Tarih :"}
                            param={this.param.filter({ELEMENT:'txtBelge',USERS:this.user.CODE})} 
                            access={this.access.filter({ELEMENT:'txtBelge',USERS:this.user.CODE})} 
                        />
                    </div>
                </div>
                <div>
                    <PopUp
                    parent = {this}
                    id = {"P01"}
                    >
                    <div className="row">
                        <div className="col-12">
                        <NdDatePicker 
                            id="txtBelge2" 
                            parent={this}
                            title={"Tarih :"}
                            param={this.param.filter({ELEMENT:'txtBelge',USERS:this.user.CODE})} 
                            access={this.access.filter({ELEMENT:'txtBelge',USERS:this.user.CODE})} 
                        />
                        </div>
                    </div>
                    </PopUp> 
                </div>
            </div>
        )
    }
}