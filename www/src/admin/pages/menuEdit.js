import React from 'react';
import App from '../lib/app.js';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from  '../../core/react/devex/grid.js';
import NdCheckBox from  '../../core/react/devex/checkbox';
import ScrollView from 'devextreme-react/scroll-view';
import NdTreeView from '../tools/NdTreeView.js';

import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import NdButton from '../../core/react/devex/button.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';
import {menu as menuOff} from '../../off/lib/menu.js'
import {menu as menuMob} from '../../mob/lib/menu.js'
import {menu} from '../../core/core'
import { data } from 'jquery';


export default class menuEdit extends React.Component
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.menu =  []
        this.prmObj = new menu()
    }
    _cellRoleRender(e)
    {

    }
    async init()
    {
        this.menu =  []
        this.setState({menu:{}})
        this.cmbApp.value = ''
        this.cmbUser.value = ''
        this.pg_CltvSaveData = ''
        
    }
    async menuBuild(pData)
    {
        return new Promise(async resolve =>
        {
            pData.forEach(async function (element,index,object)
            {
                if(typeof element.items != 'undefined')
                {
                    this.menuBuild(element.items)
                }
                else
                {
                    if(typeof element.selected == 'undefined' || element.selected == false)
                    {
                        object[index].visible = false
                    }
                    else if( element.selected == true)
                    {
                        object[index].visible = true
                    }
                }
            }.bind(this));
            resolve()
        });
    }
    async menuSave()
    {
        await this.menuBuild(this.menu)
        await this.visibleBuild(this.menu)
        for (let i = 0; i < this.pg_CltvSaveData.length; i++)
        {
            await this.prmObj.load({USER:this.pg_CltvSaveData[i].CODE,APP:this.cmbApp.value})
            if(this.prmObj.dt().length > 0)
            {
                this.prmObj.dt()[0].VALUE = JSON.stringify(this.menu)
                this.prmObj.save()
            }
            else
            {
                let tmpEmpty = {...this.prmObj.empty};
                tmpEmpty.TYPE = 0
                tmpEmpty.ID = "menu"
                tmpEmpty.VALUE = JSON.stringify(this.menu)
                tmpEmpty.USERS = this.pg_CltvSaveData[i].CODE;
                tmpEmpty.APP = this.cmbApp.value

                this.prmObj.addEmpty(tmpEmpty);
                this.prmObj.save()
            }
            
        }
    }
    componentDidMount()
    {
        this.init()
    }
    mergeMenu(tmpMenu,tmpMenuData)
    {
        return new Promise(async resolve =>
        {
            tmpMenu.forEach(async function (element,index,object)
            {
                if(typeof element.items != 'undefined')
                {
                    this.mergeMenu(element.items,tmpMenuData)
                }
                else
                {
                    let tmpMerge = await tmpMenuData.findSub({id:element.id},'items')
                    if(typeof tmpMerge != 'undefined' && typeof tmpMerge.selected != 'undefined')
                    {
                        object[index].selected = tmpMerge.selected
                    }
                }
            }.bind(this));

            resolve()
        });
    }
    async visibleBuild(tmpMenu)
    {
        return new Promise(async resolve =>
            {
                tmpMenu.forEach(async function (element,index,object)
                {
                    if(typeof element.items != 'undefined')
                    {
                        await this.visibleBuild(element.items)
                        let tmpVisible = await element.items.findSub({visible:true},'items')
                        if(typeof tmpVisible == 'undefined')
                        {
                            object[index].visible = false
                        }
                    }
                }.bind(this));
                resolve(this.menu)
            });
    }
    async visibleClear(pData)
    {
        return new Promise(async resolve =>
        {
            pData.forEach(async function (element,index,object)
            {
                if(typeof element.items != 'undefined')
                {
                    this.visibleClear(element.items)
                }
                else
                {
                    if(typeof element.visible != 'undefined' || element.visible == false)
                    {
                        object[index].visible = true
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
                        <div className="col-12">
                            <div className="col-6">
                                <div className="row">
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
                                        onValueChanged={async (e)=>
                                        {
                                            if(e.value == 'OFF')
                                            {
                                                this.menu = menuOff(App.instance.lang)
                                                this.prmObj = new menu(this.menu)
                                            }
                                            else if(e.value == 'MOB')
                                            {
                                                this.menu = menuMob(App.instance.lang)
                                                this.prmObj = new menu(this.menu)
                                            }
                                            let tmpMenu = await this.prmObj.load({USER:this.cmbUser.value,APP:this.cmbApp.value})
                                            await this.mergeMenu(this.menu,tmpMenu)
                                            this.setState({menu:this.menu})
                                        }}
                                        />
                                    </div>
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
                                        onValueChanged={async (e)=>
                                        {
                                            if(this.cmbApp.value == 'OFF')
                                            {
                                                this.menu = menuOff(App.instance.lang)
                                                this.prmObj = new menu(this.menu)
                                            }
                                            else if(this.cmbApp.value == 'MOB')
                                            {
                                                this.menu = menuMob(App.instance.lang)
                                                this.prmObj = new menu(this.menu)
                                            }
                                            let tmpMenu = await this.prmObj.load({USER:this.cmbUser.value,APP:this.cmbApp.value})
                                            await this.mergeMenu(this.menu,tmpMenu)
                                            this.setState({menu:this.menu})
                                        }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <NdButton text={"Kaydet"} type="default" width="100%"
                                        onClick={async()=>
                                        {
                                            // await this.menuSave()
                                            this.pg_CltvSave.show();
                                            this.pg_CltvSave.onClick = async(data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.pg_CltvSaveData = data;
                                                    this.menuSave();
                                                }
                                            }
                                        }}></NdButton>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
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
                        </div>
                    </div>
                    <NdPopGrid id={"pg_CltvSave"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}}
                    showTitle={true}
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_CltvSave.title")}
                    data =
                    {{
                        source:
                        {
                            select:
                            {
                                query : "SELECT CODE,NAME FROM USERS ORDER BY CODE ASC"
                            },
                            sql:this.core.sql
                        }
                    }}
                    onRowPrepared={(async(e)=>
                    {
                        this.SaveRow = e;
                        if(typeof this.SaveRow.data != "undefined")
                        {
                            if(this.cmbUser.value == e.data.CODE)
                            {
                                await this.core.util.waitUntil(200)
                                this.pg_CltvSave.grid.devGrid.selectRowsByIndexes(e.dataIndex)
                            }
                        }
                    })}
                    >
                    <Column dataField="CODE" caption={this.t("pg_CltvSave.clmCode")} width={300} />
                    <Column dataField="NAME" caption={this.t("pg_CltvSave.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                </ScrollView>
            </div>
        )
    }
}