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

        this.onValueChange = this.onValueChange.bind(this);
        this.onClicked = this.onClicked.bind(this)
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
    onValueChange(e)
    {
        if(typeof this.props.onValueChange != 'undefined')
        {
            this.props.onValueChange(e);
            this.setItemAll()
        }
    }
    onClicked(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick();
        }
        this.itemPopUp.open(e)
    }
    render()
    {
        return(
            <div>
                <div className='row pt-3' style={{paddingBottom:"20px"}}>
                    {this.state.items.map((function(object, i)
                    {
                        return (
                            <div className='col-lg-3 col-md-4 col-sm-4 col-6 pb-2' key={'div' + i}>
                                <div className="item-card-wrapper" style={{borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)', border: '1px solid rgba(127,143,166,0.3)'}} 
                               >
                                    <NbItemCard id={'itemCard' + i} parent={this} key={'itemCard' + i} price={object.PRICE} name={object.NAME} prm={object.PRM}
                                    image={object.IMAGE == '' ? './css/img/noimage.jpg' : object.IMAGE} data={object} dt={this.props.dt} onValueChange={this.onValueChange} onClick={this.onClicked}
                                    defaultUnit={this.props.defaultUnit} unitLock={this.props.unitLock} />
                                </div>
                            </div>)
                    }).bind(this))}                
                </div>    
                {/* CARD POPUP */}
                <div>
                    <NbItemPopUp id={"itemPopUp"} parent={this} onValueChange={this.onValueChange} listPriceLock={this.props.listPriceLock} />
                </div>             
            </div>
        )
    }
}