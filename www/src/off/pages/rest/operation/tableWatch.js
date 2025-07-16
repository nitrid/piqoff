import React from 'react';
import App from '../../../lib/app.js';
import { restTableCls } from '../../../../core/cls/rest.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar,{ Item } from 'devextreme-react/toolbar';
import LoadIndicator from 'devextreme-react/load-indicator';
import NdButton from '../../../../core/react/devex/button.js';
import NbTableView from "../../../../rest/tools/tableView.js";

export default class TableWatch extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            isLoading : true
        } 

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.tableObj = new restTableCls();
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.setState({isLoading:true})

        this.tableView.items.selectCmd = 
        {
            query : "SELECT * FROM REST_TABLE_VW_01 ORDER BY CODE ASC"
        }
        await this.tableView.items.refresh()
        this.tableView.updateState()
        this.setState({isLoading:false})
    }    
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnRefresh" parent={this} icon="refresh" type="default"
                                    onClick={()=>
                                    {
                                        this.init()
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div style={{display:(this.state.isLoading ? 'block' : 'none'),position:'relative',top:"7%",width:'100%',height:'100%',backgroundColor:'#ecf0f1'}}>
                        <div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}>
                            <LoadIndicator height={40} width={40} />
                        </div>
                    </div>
                    <div className='row p-2'>
                        <NbTableView parent={this} id="tableView"/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
