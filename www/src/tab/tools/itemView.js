import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbItemCard from './itemCard';
import NbItemPopUp from '../tools/itemPopUp';

export default class NbItemView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.state =
        {
            items : []
        }

        this._onValueChange = this._onValueChange.bind(this);
        this._onClick = this._onClick.bind(this)
    }
    get items()
    {
        return this.state.items
    }
    set items(e)
    {
        this.setState({items:[]})
        this.setState({items:e})
    }
    setItemAll()
    {
        Object.keys(this).filter(key => key.startsWith("itemCard")).map((key) =>
        {
            this[key].setDocItem()
        });
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
        this.itemPopUp.open()
        console.log(1111)
    }
    render()
    {
        return(
            <div>
                <div className='row pt-3' style={{paddingBottom:"200px"}}>
                    {this.state.items.map((function(object, i)
                    {
                        return (
                            <div className='col-lg-3 col-md-4 pb-2' key={'div' + i}>
                                <NbItemCard id={'itemCard' + i} parent={this} key={'itemCard' + i} price={object.PRICE} name={object.NAME}
                                image={object.IMAGE} data={object} dt={this.props.dt} onValueChange={this._onValueChange} onClick={this._onClick}/>
                            </div>)
                    }).bind(this))}                
                </div>
                {/* CARD POPUP */}
                <div>
                    <NbItemPopUp id={"itemPopUp"} parent={this}/>
                </div>
            </div>
        )
    }
}