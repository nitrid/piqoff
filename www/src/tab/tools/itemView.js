import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NdTextBox,{ Button } from '../../core/react/devex/textbox.js'
import NdPopUp from "../../core/react/devex/popup.js";
import NdSelectBox from '../../core/react/devex/selectbox.js'
import NbItemCard from './itemCard';

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
        console.log(e)
        if(typeof this.props.onValueChange != 'undefined')
        {
            this.props.onValueChange(e);
        }
    }
    render()
    {
        return(
            <div className='row pt-3' style={{paddingBottom:"200px"}}>
                {this.state.items.map((function(object, i)
                {
                    return (
                        <div className='col-lg-3 col-md-4 pb-2' key={'div' + i}>
                            <NbItemCard id={'itemCard' + i} parent={this} key={'itemCard' + i} price={object.PRICE} name={object.NAME}
                            image={object.IMAGES} data={object} dt={this.props.dt}
                            onValueChange={this._onValueChange}
                            />
                        </div>)
                }).bind(this))}
           </div>
        )
    }
}