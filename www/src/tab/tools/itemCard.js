import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NdTextBox,{ Button } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'

export default class NbItemCard extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            image : typeof this.props.image == 'undefined' ? '../css/img/noimage.jpg' : this.props.image,
            name : typeof this.props.name == 'undefined' ? '' : this.props.name,
            price : typeof this.props.price == 'undefined' ? 0 : this.props.price,
        }

        this.data = this.props.data
        this.value = 0
        this._onValueChange = this._onValueChange.bind(this);
        this._onClick = this._onClick.bind(this);
    }
    _onValueChange(e)
    {
        if(typeof this.props.onValueChange != 'undefined')
        {
            this.props.onValueChange(e);
        }
    }
    _onClick()
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick();
        }
    }
    setDocItem()
    {
        let tmpDt = typeof this.props.dt == 'undefined' ? [] : this.props.dt.where({'ITEM':this.props.data.GUID})
        if(tmpDt.length > 0)
        {
            this["txtQuantity" + this.props.id].value = tmpDt[0].QUANTITY
        }
    }
    render()
    {
        return(
            <div className="card shadow-sm">
                <img src={this.state.image} className="card-img-top" height={'280px'} 
                onClick={()=>
                {
                    this._onClick()
                }}/>
                <div className="card-body">
                    <div className='row pb-2'>
                        <div className='col-6'>
                            <h5 className="card-title" style={{marginBottom:'0px',paddingTop:'5px'}}>{this.state.price}€</h5>
                        </div>
                        <div className='col-6'>
                            <NdSelectBox simple={true} parent={this} id="cmbGroup" height='fit-content' 
                            displayExpr="NAME"                       
                            valueExpr="GUID"
                            value= {this.props.data.UNIT}
                            searchEnabled={true}
                            data={{source:[{GUID:this.props.data.UNIT,NAME:this.props.data.UNIT_NAME}]}}
                            />
                        </div>
                    </div>
                    <div className='row pb-1'>
                        <div className='col-12'>
                            <div className="overflow-hidden" style={{height:'75px'}}>{this.state.name}</div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <NdTextBox id={"txtQuantity" + this.props.id} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }}
                            value={0}
                            onChange={(async(e)=>
                            {
                                this.props.data.QUANTITY = this["txtQuantity" + this.props.id].value
                                this._onValueChange(this.props.data)
                            }).bind(this)}
                            button={
                            [
                                {
                                    id:'01',
                                    icon:'minus',
                                    location:'before',
                                    onClick:async()=>
                                    {
                                        if(this["txtQuantity" + this.props.id].value > 0)
                                        {
                                            this["txtQuantity" + this.props.id].value = Number(this["txtQuantity" + this.props.id].value) - 1 
                                            this.props.data.QUANTITY = this["txtQuantity" + this.props.id].value
                                            this._onValueChange(this.props.data)
                                        }
                                        
                                    }
                                },
                                {
                                    id:'02',
                                    icon:'plus',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        this["txtQuantity" + this.props.id].value = Number(this["txtQuantity" + this.props.id].value) + 1 
                                        this.props.data.QUANTITY = this["txtQuantity" + this.props.id].value
                                        this._onValueChange(this.props.data)
                                    }
                                }                                                    
                            ]}>
                            </NdTextBox>
                        </div>                                            
                    </div>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
            </div>
        )
    }
}