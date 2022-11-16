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
        await this.acsData.load({APP:'OFF'})        

        let tmpDt = new datatable()
        tmpDt.import(this.acsData.filter({TYPE:2}).meta)
        tmpDt = tmpDt.groupBy('PAGE')
        console.log(tmpDt)
        let tmpMenu = []
        for (let i = 0; i < tmpDt.length; i++) 
        {
            tmpMenu.push({CODE:tmpDt[i].PAGE,NAME:tmpDt[i].VIEW.PAGE_NAME})            
        }
        await this.cmbDoc.dataRefresh({source:tmpMenu});
    }
    buildItem()
    {
        let tmpItems = []
        this.state.metaAcs.map((pItem) => 
        {
            tmpItems.push(this.ItemBuild(pItem))
        });
        return tmpItems
    }
    render()
    {
        return(
            <div>
                <div className='row px-2 pt-2'>
                    <div className='col-12'>
                        <Form colCount={3} id={"frmFilter" + this.tabIndex}>
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
                                    await this.acsData.load({APP:'OFF'})                                    

                                    this.state.metaAcs.map((pItem) => 
                                    {
                                        let tmpData = {...pItem} 
                                        tmpData.VALUE = this.acsData.filter({TYPE:2,USERS:e.value,ID:pItem.ID}).getValue()                                        
                                        this.ItemSet(tmpData)
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
                                // data={{source:{select:{query : "SELECT CODE,NAME FROM USERS ORDER BY NAME ASC"},sql:this.core.sql}}}
                                onValueChanged={async(e)=>
                                {
                                    await this.acsData.load({APP:'OFF'})
                                    console.log(this.acsData.filter({TYPE:2,PAGE:this.cmbDoc.value}).meta)
                                    this.setState({metaAcs:this.acsData.filter({TYPE:2,PAGE:this.cmbDoc.value}).meta})
                                    
                                    this.state.metaAcs.map((pItem) => 
                                    {
                                        let tmpData = {...pItem} 
                                        tmpData.VALUE = this.acsData.filter({TYPE:2,USERS:e.value,ID:pItem.ID}).getValue()                                        
                                        this.ItemSet(tmpData)
                                    })
                                }}
                                />
                            </Item>
                            <Item>
                                <NdButton text={this.t("btnSave")} type="default" width="100%"
                                onClick={async()=>
                                {
                                    this.pg_UserList.show();
                                    this.pg_UserList.onClick = async(data) =>
                                    {
                                        for (let i = 0; i < data.length; i++) 
                                        {
                                            for (let x = 0; x < this.state.metaAcs.length; x++) 
                                            {
                                                this.acsData.add
                                                (
                                                    {
                                                        TYPE:this.state.metaAcs[x].TYPE,
                                                        ID:this.state.metaAcs[x].ID,
                                                        VALUE:await this.ItemGet(this.state.metaAcs[x]),
                                                        SPECIAL:this.state.metaAcs[x].SPECIAL,
                                                        USERS:data[i].CODE,
                                                        PAGE:this.state.metaAcs[x].PAGE,
                                                        ELEMENT:this.state.metaAcs[x].ELEMENT,
                                                        APP:this.state.metaAcs[x].APP,
                                                    }
                                                )
                                            }
                                        }
                                        await this.acsData.save()
                                        await this.acsData.load({APP:'OFF'})
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