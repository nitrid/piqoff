import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import NdCheckBox from  '../../core/react/devex/checkbox';
import ScrollView from 'devextreme-react/scroll-view';
import NdTreeView from '../tools/NdTreeView.js';

import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdButton from '../../core/react/devex/button.js';
import {testData as menuOff} from '../meta/testMeta.js'
import {menu as menuMob} from '../../mob/lib/menu.js'

export default class menutest extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
       

        this.getKeyByValue = this.getKeyByValue.bind(this);

        this.menu =  {}   
    }
    _cellRoleRender(e)
    {
       
    }
    async init()
    {
        this.menu = menuOff(App.instance.lang);
        this.setState({menu:menuOff(App.instance.lang)})
    }
    componentDidMount()
    {
        this.init()
    }
    getKeyByValue(object, value) 
    {
        return Object.keys(object).find(key => object[key] === value);
    }
    Test()
    {
        let deneme = [...this.menu]
       
        for (let i = 0; i < this.menu.length; i++) 
        {
            for (let x = 0; x < this.menu[i].items.length; x++) 
            {
                if(typeof this.menu[i].items[x].items != 'undefined')
                {
                    let counter = 0
                    for (let y = 0; y < this.menu[i].items[x].items.length; y++) 
                    {
                        counter = counter + 1
                        console.log(counter)
                        console.log(this.menu[i].items[x].items[y])
                        if(this.menu[i].items[x].items[y].selected == false || typeof this.menu[i].items[x].items[y].selected == 'undefined')
                        {
                            console.log(y + '++++' +  counter)
                            console.log(this.menu[i].items[x].items[y].id)
                            deneme[i].items[x].items.splice(y,1)
                           
                        }
                    }
                }
            }
        }
    }
    async test2(pData)
    {
        return new Promise(async resolve => 
        {
            pData.forEach(async function (element,index,object)
            {
                if(typeof element.items != 'undefined')
                {
                    this.test2(element.items)
                }
                else
                {
                    if(typeof element.selected == 'undefined' || element.selected == false)
                    {
                        object.splice(index,1)
                        index = index -1 
                        this.test2(object)
                    }
                }
            }.bind(this));
            resolve()
        });
    }
    async test3()
    {
        await this.test2(this.menu)
        await this.test4(this.menu)
    }
    async test4(pData)
    {
        return new Promise(async resolve => 
            {
                pData.forEach(async function (element,index,object)
                {
                    if(typeof element.items != 'undefined')
                    {
                        if(element.items.length == 0)
                        {
                            object.splice(index,1)
                            this.test4(object)
                        }
                        else
                        {
                            this.test4(element.items)
                        }
                    }
                }.bind(this));
                resolve()
            });
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row p-2">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-6">
                                <NdButton text={"run"} type="default" width="100%" onClick={async()=>{this.test3()}}></NdButton>
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