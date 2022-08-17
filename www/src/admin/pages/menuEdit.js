import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import NdCheckBox from  '../../core/react/devex/checkbox';
import ScrollView from 'devextreme-react/scroll-view';
import NdTreeView from '../tools/NdTreeView.js';

import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdButton from '../../core/react/devex/button.js';
import {menu as menuOff} from '../../off/lib/menu.js'
import {menu as menuMob} from '../../mob/lib/menu.js'

export default class menuEdit extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
       

        this.treeViewSelectionChanged = this.treeViewSelectionChanged.bind(this);
        this.menu =  {}   
    }
    _cellRoleRender(e)
    {
       
    }
    async init()
    {
        console.log(this.menuOff)
    }
    componentDidMount()
    {
        this.init()
    }
    treeViewSelectionChanged(e) 
    {
       console.log(e)
    }
    Test()
    {
        console.log(this.Menu1.dev.getSelectedNodes())
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row p-2">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-3">
                                    <Label text={"Kullanıcı"} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUser"
                                        displayExpr="CODE"                       
                                        valueExpr="CODE"
                                        value=""
                                        searchEnabled={true} 
                                        showClearButton={true}
                                        pageSize ={50}
                                        notRefresh={true}
                                        data={{source:{select:{query : "SELECT CODE FROM USERS ORDER BY CODE ASC"},sql:this.core.sql}}}
                                        onValueChanged={(e)=>
                                        {

                                        }}
                                        />
                                </div>
                                <div className="col-3">
                                <Label text={"Uygulama"} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbApp"
                                    displayExpr="VALUE"                       
                                    valueExpr="VALUE"
                                    value=""
                                    searchEnabled={true} 
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh={true}
                                    data={{source:[{ID:0,VALUE:"OFF"},{ID:1,VALUE:"MOB"}]}}
                                    onValueChanged={(e)=>
                                    {
                                        if(e.value == 'OFF')
                                        {
                                            this.menu = menuOff(App.instance.lang);
                                            this.setState({menu:menuOff(App.instance.lang)})
                                        }
                                        else if(e.value == 'OFF')
                                        {
                                            this.menu = menuMob(App.instance.lang);
                                            this.setState({menu:menuMob(App.instance.lang)})
                                        }
                                        console.log(this)
                                    }}
                                    />
                                </div>
                                <div className="col-6">
                                <NdButton text={this.t("Getir")} type="default" width="100%" onClick={async()=>{this.Test()}}></NdButton>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <NdTreeView id="Menu1" parent={this}
                            items = {this.menu}
                            width = {300}
                            height = {'100%'}
                            selectNodesRecursive={true}
                            showCheckBoxesMode={"normal"}
                            selectionMode={"multiple"}
                            onSelectionChanged={async(e)=>
                                {
                                    console.log(e)
                                }}
                            >
                            </NdTreeView>  
                        </div>
                    </div>
                </ScrollView>
            </div>
           
        )
    }
}