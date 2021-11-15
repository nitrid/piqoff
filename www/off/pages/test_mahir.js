import React from 'react';
import App from '../lib/app.js';
import { datatable } from '../../core/core.js';
import TextBox from 'devextreme-react/text-box';

export default class Test extends React.Component
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }
    async componentDidMount() 
    {        
        
    }
    onSelectionChanged(e)
    {
        if(e.selectedRowsData.length > 0)
        {
            this.txtSira.value = e.selectedRowsData[0].ROLE
        }
    }
    render()
    {
        return (
            <div>
                <div className="row py-3">
                    {/* <div className="col-3">
                        <NdTextBox id="txtSeri" parent={this} title={"Seri :"} titleAlign={"left"}
                            lang={"tr"} 
                            param={this.param.filter({ELEMENT:'txtSeri',USERS:this.user.CODE})} 
                            access={this.access.filter({ELEMENT:'txtSeri',USERS:this.user.CODE})} />
                    </div> */}
                </div>
            </div>
        )
    }
}