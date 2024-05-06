import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NbDateRange from '../../../../core/react/bootstrap/daterange.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

import { datatable } from '../../../../core/core.js';

export default class priceAllItemSend extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.btnItemsSend = this.btnItemsSend.bind(this)
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
      
    }
    async btnItemsSend()
    {
        this.core.socket.emit('priceAllItemSend')
        let tmpConfObj1 =
        {
            id:'msgItemSend',showTitle:true,title:this.t("msgItemSend.title"),showCloseButton:true,width:'500px',height:'200px',
            button:[{id:"btn01",caption:this.t("msgItemSend.btn01"),location:'after'}],
        }
             
        tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgItemSend.msgSuccess")}</div>)
        await dialog(tmpConfObj1);
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                }/>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdButton text={this.t("btnItemsSend")} type="default" width="100%" 
                            onClick={this.btnItemsSend}></NdButton>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}