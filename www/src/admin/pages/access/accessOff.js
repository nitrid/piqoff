import React from 'react';
import { access, datatable } from '../../../core/core';
import App from '../../lib/app';
import { core,param } from '../../../core/core';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import { acs as acs } from '../../../off/meta/acs';
import NdButton from '../../../core/react/devex/button';
import {ItemBuild,ItemSet,ItemGet} from '../../tools/itemOp';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from '../../../core/react/devex/grid';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';

export default class accessOff extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.state = 
        {
            metaAcs : []
        }
        this.ItemBuild = ItemBuild.bind(this)
        this.ItemSet = ItemSet.bind(this)
        this.ItemGet = ItemGet.bind(this)

        this.acsData = null
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)

        this.acsData = new access(acs)
        await this.acsData.load({APP:'OFF',USERS:''})        

        let tmpDt = new datatable()
        tmpDt.import(this.acsData.meta)
        tmpDt = tmpDt.groupBy('PAGE')
        
        let tmpMenu = []
        for (let i = 0; i < tmpDt.length; i++) 
        {
            if(typeof tmpDt[i].VIEW != 'undefined')
            {
                tmpMenu.push({CODE:tmpDt[i].PAGE,NAME:tmpDt[i].VIEW.PAGE_NAME})  
            }
        }
        await this.cmbDoc.dataRefresh({source:tmpMenu});
    }
    buildItem()
    {
        let tmpItems = []
        this.state.metaAcs.map((pItem) => 
        {
            console.log(pItem)
            tmpItems.push(this.ItemBuild(pItem,this))
        });
        return tmpItems
    }
    render()
    {
        return(
            <div>
                <div className='row px-2 pt-2'>
                    <div className='col-12'>
                        <Form colCount={4} id={"frmFilter" + this.tabIndex}>
                            <Item>
                                <Label text={this.t("lblUser")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbUser"
                                displayExpr="CODE"                       
                                valueExpr="CODE"
                                value={""}
                                showClearButton={true}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM USERS ORDER BY NAME ASC"},sql:this.core.sql}}}
                                onValueChanged={async(e)=>
                                {
                                    if(e.value == null)
                                    {
                                        await this.acsData.load({APP:'OFF',USERS:''})
                                    }
                                    else
                                    {
                                        await this.acsData.load({APP:'OFF'})
                                    }

                                    this.state.metaAcs.map((pItem) => 
                                    {
                                        let tmpData = {...pItem} 
                                        tmpData.VALUE = this.acsData.filter({USERS:e.value == null ? '' : e.value,ID:pItem.ID}).getValue()                                        
                                        this.ItemSet(tmpData,this)
                                    })
                                }}
                                />
                            </Item>
                            <Item>
                                <Label text={this.t("lblDoc")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDoc"
                                displayExpr="NAME"                       
                                valueExpr="CODE"
                                showClearButton={true}
                                onValueChanged={async(e)=>
                                {
                                    if(e.value == null)
                                    {
                                        await this.acsData.load({APP:'OFF',USERS:''})
                                    }
                                    else
                                    {
                                        await this.acsData.load({APP:'OFF'})
                                    }

                                    this.setState({metaAcs:this.acsData.filter({PAGE:this.cmbDoc.value}).meta})
                                    
                                    this.state.metaAcs.map((pItem) => 
                                    {
                                        let tmpData = {...pItem} 
                                        tmpData.VALUE = this.acsData.filter({USERS:this.cmbUser.value == null ? '' : this.cmbUser.value,ID:pItem.ID}).getValue()                                        
                                        this.ItemSet(tmpData,this)
                                    })
                                }}
                                />
                            </Item>
                            <Item>
                                <NdButton text={this.t("btnMetaSave")} type="default" width="100%"
                                onClick={async()=>
                                {
                                    await this.acsData.load({APP:'OFF',USERS:''})

                                    let tmpConfObj =
                                    {
                                        id:'msgSaveResult',showTitle:true,title:App.instance.lang.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                        button:[{id:"btn02",caption:App.instance.lang.t("msgSaveResult.btn01"),location:'after'}],
                                    }

                                    App.instance.setState({isExecute:true})
                                    
                                    for (let x = 0; x < this.state.metaAcs.length; x++) 
                                    {
                                        if(typeof this.state.metaAcs[x].VIEW != 'undefined')
                                        {
                                            this.acsData.add
                                            (
                                                {
                                                    TYPE:this.state.metaAcs[x].TYPE,
                                                    ID:this.state.metaAcs[x].ID,
                                                    VALUE:await this.ItemGet(this.state.metaAcs[x],this),
                                                    SPECIAL:this.state.metaAcs[x].SPECIAL,
                                                    USERS:"",
                                                    PAGE:this.state.metaAcs[x].PAGE,
                                                    ELEMENT:this.state.metaAcs[x].ELEMENT,
                                                    APP:this.state.metaAcs[x].APP,
                                                }
                                            )
                                        }
                                    }
                                    let tmpResult = await this.acsData.save()
                                    await this.acsData.load({APP:'OFF'})
                                    App.instance.setState({isExecute:false})
                                    
                                    if(tmpResult == 0)
                                    {
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{App.instance.lang.t("msgSaveResult.msgSuccess")}</div>)
                                    }
                                    else
                                    {
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{App.instance.lang.t("msgSaveResult.msgFailed")}</div>)
                                    }
                                    await dialog(tmpConfObj);
                                }}></NdButton>
                            </Item>
                            <Item>
                                <NdButton text={this.t("btnSave")} type="default" width="100%"
                                onClick={async()=>
                                {
                                    this.pg_UserList.show();
                                    this.pg_UserList.onClick = async(data) =>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgSaveResult',showTitle:true,title:App.instance.lang.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn02",caption:App.instance.lang.t("msgSaveResult.btn01"),location:'after'}],
                                        }

                                        App.instance.setState({isExecute:true})

                                        for (let i = 0; i < data.length; i++) 
                                        {
                                            for (let x = 0; x < this.state.metaAcs.length; x++) 
                                            {
                                                this.acsData.add
                                                (
                                                    {
                                                        TYPE:this.state.metaAcs[x].TYPE,
                                                        ID:this.state.metaAcs[x].ID,
                                                        VALUE:await this.ItemGet(this.state.metaAcs[x],this),
                                                        SPECIAL:this.state.metaAcs[x].SPECIAL,
                                                        USERS:data[i].CODE,
                                                        PAGE:this.state.metaAcs[x].PAGE,
                                                        ELEMENT:this.state.metaAcs[x].ELEMENT,
                                                        APP:this.state.metaAcs[x].APP,
                                                    }
                                                )
                                            }
                                        }
                                        let tmpResult = await this.acsData.save()
                                        await this.acsData.load({APP:'OFF'})
                                        App.instance.setState({isExecute:false})

                                        if(tmpResult == 0)
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{App.instance.lang.t("msgSaveResult.msgSuccess")}</div>)
                                        }
                                        else
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{App.instance.lang.t("msgSaveResult.msgFailed")}</div>)
                                        }
                                        await dialog(tmpConfObj);
                                    }
                                }}></NdButton>
                            </Item>
                        </Form>
                    </div>    
                </div>
                <div className='row px-2 pt-2'>
                    <div className='col-12'>                            
                        <Form colCount={2} id={"frmParam" + this.tabIndex}>
                            {this.buildItem()}
                        </Form>  
                    </div>
                </div>
                <div>
                    <NdPopGrid id={"pg_UserList"} parent={this} container={"#root"}
                    visible={false}
                    position={{of:'#root'}}
                    showTitle={true}
                    showBorders={true}
                    width={'90%'}
                    height={'90%'}
                    title={this.t("pg_UserList.title")}
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
                    >
                        <Column dataField="CODE" caption={this.t("pg_UserList.clmCode")} width={300} />
                        <Column dataField="NAME" caption={this.t("pg_UserList.clmName")} width={300} defaultSortOrder="asc" />
                    </NdPopGrid>
                </div>
            </div>
        )
    }
}