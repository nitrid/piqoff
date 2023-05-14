import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NdTextBox,{ Button } from '../../core/react/devex/textbox'
import NdPopUp from "../../core/react/devex/popup.js";
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
    }
    render()
    {
        return(
            <div className="card shadow-sm">
                <img src={this.state.image} className="card-img-top" height={'280px'}/>
                <div className="card-body">
                    <div className='row pb-2'>
                        <div className='col-6'>
                            <h5 className="card-title" style={{marginBottom:'0px',paddingTop:'5px'}}>{this.state.price}€</h5>
                        </div>
                        <div className='col-6'>
                            <NdSelectBox simple={true} parent={this} id="cmbGroup" height='fit-content' style={{width:'100px'}}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            value= ""
                            searchEnabled={true}
                            data={{source:[{CODE:'001',NAME:'XXX'}]}}
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
                            <NdTextBox id={"txtQuantity"} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }}
                            value={0}
                            button={
                            [
                                {
                                    id:'01',
                                    icon:'minus',
                                    location:'before',
                                    onClick:async()=>
                                    {
                                        
                                    }
                                },
                                {
                                    id:'02',
                                    icon:'plus',
                                    location:'after',
                                    onClick:async()=>
                                    {
                                        
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