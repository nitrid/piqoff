import React from 'react';
import App from '../../../../admin/lib/app.js';
import NdTextBox from '../../../../core/react/devex/textbox.js';

export default class Param extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
    }
    render()
    {
        return( 
            <div>
                <div className="row">
                    <div className="col-4">
                        <NdTextBox id="txtSeri" parent={this} title={"Seri : "} user={this.user}
                        lang={"tr"} param={this.param} auth={""} data={""}/>
                    </div>
                </div>
            </div>
        )
    }
}