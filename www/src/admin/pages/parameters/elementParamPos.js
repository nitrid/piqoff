import React from 'react';
import { datatable } from '../../../core/core';
import App from '../../lib/app';
import { core,param } from '../../../core/core';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import { prm as posPrm } from '../../../pos/meta/prm';
import NdButton from '../../../core/react/devex/button';
import {ItemBuild,ItemSet,ItemGet} from '../../tools/itemOp';
import NdPopGrid from '../../../core/react/devex/popgrid';
import NdGrid,{Column,Editing,Popup,Paging,Scrolling,KeyboardNavigation,Lookup} from '../../../core/react/devex/grid';
import ScrollView from 'devextreme-react/scroll-view';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';

export default class elementParamPos extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.state = 
        {
            metaPrm : []
        }

        this.ItemBuild = ItemBuild.bind(this)
        this.ItemSet = ItemSet.bind(this)
        this.ItemGet = ItemGet.bind(this)

        this.prmData = null
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)

        this.prmData = new param(posPrm)
        await this.prmData.load({APP:'POS'})        

        let tmpDt = new datatable()
        tmpDt.import(this.prmData.filter({TYPE:2}).meta)
        tmpDt = tmpDt.groupBy('PAGE')

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
        this.state.metaPrm.map((pItem) => 
        {
            tmpItems.push(this.ItemBuild(pItem,this))
        });
        return tmpItems
    }
    render()
    {
        return(
            <div>
                <ScrollView>
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
                                    data={{source:{select:{query : `SELECT CODE,NAME FROM USERS ORDER BY NAME ASC`},sql:this.core.sql}}}
                                    onValueChanged={async(e)=>
                                    {
                                        await this.prmData.load({APP:'POS'})                                    

                                        this.state.metaPrm.map((pItem) => 
                                        {
                                            let tmpData = {...pItem} 
                                            tmpData.VALUE = this.prmData.filter({TYPE:2,USERS:e.value,ID:pItem.ID}).getValue()                                        
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
                                        await this.prmData.load({APP:'POS'})
                                        this.setState({metaPrm:this.prmData.filter({TYPE:2,PAGE:this.cmbDoc.value}).meta})
                                        
                                        this.state.metaPrm.map((pItem) => 
                                        {
                                            let tmpData = {...pItem} 
                                            tmpData.VALUE = this.prmData.filter({TYPE:2,USERS:this.cmbUser.value,ID:pItem.ID}).getValue()                                        
                                            this.ItemSet(tmpData,this)
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
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveResult',showTitle:true,title:App.instance.lang.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn02",caption:App.instance.lang.t("msgSaveResult.btn01"),location:'after'}],
                                            }

                                            App.instance.setState({isExecute:true})

                                            for (let i = 0; i < data.length; i++) 
                                            {
                                                for (let x = 0; x < this.state.metaPrm.length; x++) 
                                                {
                                                    this.prmData.add
                                                    (
                                                        {
                                                            TYPE:this.state.metaPrm[x].TYPE,
                                                            ID:this.state.metaPrm[x].ID,
                                                            VALUE:await this.ItemGet(this.state.metaPrm[x],this),
                                                            SPECIAL:this.state.metaPrm[x].SPECIAL,
                                                            USERS:data[i].CODE,
                                                            PAGE:this.state.metaPrm[x].PAGE,
                                                            ELEMENT:this.state.metaPrm[x].ELEMENT,
                                                            APP:this.state.metaPrm[x].APP,
                                                        }
                                                    )
                                                }
                                            }

                                            let tmpResult = await this.prmData.save()
                                            await this.prmData.load({APP:'POS'})
                                            
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
                                    query : `SELECT CODE,NAME FROM USERS ORDER BY CODE ASC`
                                },
                                sql:this.core.sql
                            }
                        }}
                        >
                            <Column dataField="CODE" caption={this.t("pg_UserList.clmCode")} width={300} />
                            <Column dataField="NAME" caption={this.t("pg_UserList.clmName")} width={300} defaultSortOrder="asc" />
                        </NdPopGrid>
                    </div>
                </ScrollView>
            </div>
        )
    }
}