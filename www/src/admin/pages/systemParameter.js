import React from 'react';
import App from '../lib/app';
import { core,param } from '../../core/core';
import Form, { Label,Item } from 'devextreme-react/form';
import NdTextBox from '../../core/react/devex/textbox';
import NdSelectBox from '../../core/react/devex/selectbox';
import { prm as offPrm } from '../../off/meta/prm';
import { prm as posPrm } from '../../pos/meta/prm';
import { prm as mobPrm } from '../../mob/meta/prm';

export default class systemParameter extends React.PureComponent
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.state = 
        {
            metaPrm : []
        }
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)

        let tmpPrm = new param(offPrm)
        await tmpPrm.load({APP:'OFF'})
        this.setState({metaPrm:tmpPrm.filter({TYPE:0}).meta})
    }
    buildItem()
    {
        let tmpItems = []
        this.state.metaPrm.map((pItem,pIndex) => 
        {
            tmpItems.push(
                <Item key={"Item" + pIndex}>
                    <NdTextBox id={"txtRef" + pIndex} key={"txtRef" + pIndex} parent={this} simple={true} tabIndex={this.tabIndex} />     
                </Item>
            )
        });
        return tmpItems
    }
    render()
    {
        return(
            <div>
                <div className='row px-2 pt-2'>
                    <div className='col-12'>
                        <Form colCount={2} id={"frmFilter" + this.tabIndex}>
                            <Item>
                                <Label text={"App"} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbApp" tabIndex={this.tabIndex}
                                displayExpr="NAME"                       
                                valueExpr="ID"
                                value={"OFF"}
                                data={{source:[{ID:"OFF",NAME:"OFF"},{ID:"POS",NAME:"POS"},{ID:"MOB",NAME:"MOB"}]}}
                                onValueChanged={async (e)=>
                                {
                                    let tmpMetaPrm = null
                                    if(e.value == "OFF")
                                    {
                                        tmpMetaPrm = offPrm
                                    }
                                    else if(e.value == "POS")
                                    {
                                        tmpMetaPrm = posPrm
                                    }
                                    else if(e.value == "MOB")
                                    {
                                        tmpMetaPrm = mobPrm
                                    }
                                    let tmpPrm = new param(tmpMetaPrm)
                                    await tmpPrm.load({TYPE:0,APP:e.value})
                                    this.setState({metaPrm:tmpPrm.filter({TYPE:0}).meta})
                                }}
                                />
                            </Item>
                            <Item>
                                <Label text={"Kullanıcı"} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbUser" tabIndex={this.tabIndex}
                                displayExpr="CODE"                       
                                valueExpr="CODE"
                                value={""}
                                showClearButton={true}
                                data={{source:{select:{query : "SELECT CODE,NAME FROM USERS ORDER BY NAME ASC"},sql:this.core.sql}}}
                                onValueChanged={(e)=>
                                {
                                   
                                }}
                                />
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
            </div>
        )
    }
}