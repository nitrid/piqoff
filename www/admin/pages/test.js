import React from 'react';
import NdTextBox from '../../core/react/textbox.js';
import App from '../lib/app.js';

export default class Test extends React.Component
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
    }
    componentDidMount() 
    {
        //this.txtSeri.value = "aa"
        this.txtSira.value = "100"
    }
    render()
    {
        return (
            <div>
                <div className="row">
                    <div className="col-4">
                        <NdTextBox id="txtSeri" parent={this} title={"Seri : "} user={this.user}
                        lang={"tr"} param={this.param} auth={""} data={""}/>
                    </div>
                    <div className="col-4">
                        <NdTextBox id="txtSira" parent={this} title={"Sıra : "} />
                    </div>
                    <div className="col-4">
                        <NdTextBox id="txtBelgeNo" parent={this} title={"Belge No : "} />
                    </div>
                </div>
            </div>
        )
    }
}