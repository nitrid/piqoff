import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button.js';
import { datatable } from '../../core/core.js';
import NdTextArea from "../../core/react/devex/textarea.js";
import { NbCheckBox,NbCheckBoxGroup } from '../../core/react/bootstrap/checkbox.js';

export default class NbProductDetailView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.itemProp = new datatable();

        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data
        this.state.prop = typeof this.state.prop == 'undefined' ? this.itemProp : this.state.prop

        this._onClick = this._onClick.bind(this)
        this._onDeleteClick = this._onDeleteClick.bind(this)
        this._onChangeClick = this._onChangeClick.bind(this)
        this._onSaveClick = this._onSaveClick.bind(this)
        this._onAddClick = this._onAddClick.bind(this)
        this._onCloseClick = this._onCloseClick.bind(this)
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    _onDeleteClick(e)
    {
        if(typeof this.props.onDeleteClick != 'undefined')
        {
            this.props.onDeleteClick(e);
        }
    }
    _onChangeClick(e)
    {
        if(typeof this.props.onChangeClick != 'undefined')
        {
            this.props.onChangeClick(e);
        }
    }
    _onSaveClick(e)
    {
        if(typeof this.props.onSaveClick != 'undefined')
        {
            this.props.onSaveClick(e);
        }
    }
    _onAddClick()
    {
        if(typeof this.props.onAddClick != 'undefined')
        {
            this.props.onAddClick();
        }
    }
    _onCloseClick()
    {
        if(typeof this.props.onCloseClick != 'undefined')
        {
            this.props.onCloseClick();
        }
    }
    async updateState() 
    {
        await this.props.parent.core.util.waitUntil(0)
        this.setState({data:[],prop:[]},()=>
        {
            this.setState({data:this.items,prop:this.itemProp})
        })
    }
    isValidJSON(value)
    {
        try 
        {
            JSON.parse(value);
            return true;
        } catch (e) 
        {
            return false;
        }
    }
    buildProp()
    {
        let tmpProp = []
        for (let i = 0; i < this.state.prop.length; i++) 
        {
            if(this.isValidJSON(this.state.prop[i].PROPERTY))
            {
                const renderCheckbox = (item, isChecked, handleChange) => 
                {
                    return(
                        <div className="row p-2">
                            <div className="col-12">
                                <NbCheckBox text={item.TITLE} value={isChecked} onChange={(title, value) => handleChange(title, value)}/>
                            </div>
                        </div>
                    )
                }

                tmpProp.push(
                    <div key={i} className="row pt-2">
                        <div className="col-12">
                            <div style={{width:"100%",border:"solid 2px #079992",borderRadius:"5px"}}>
                                <div style={{backgroundColor:'#079992',height:"30px",display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <div style={{fontSize:"18px",color:"white",fontWeight:"bold",padding:'5px',overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2,textAlign:"center"}}>
                                        {this.state.prop[i].NAME}
                                    </div>                                            
                                </div>
                                <NbCheckBoxGroup id={"ChkGrp" + this.state.prop[i].CODE} parent={this} items={JSON.parse(this.state.prop[i].PROPERTY)} 
                                maxSelectable={this.state.prop[i].SELECTION == 0 ? 1000 : this.state.prop[i].SELECTION} renderCheckbox={renderCheckbox} 
                                onChange={(value)=>
                                {
                                    this.itemProp[i].PROPERTY = JSON.stringify(value)
                                    this.updateState()
                                }}/>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return tmpProp
    }
    render()
    {
        return(
            <div>
                <div style={{display:'flex',position:'fixed',left:'0px',right:'0px',paddingLeft:'15px',paddingRight:'15px',zIndex:'1500',backgroundColor:'white'}}>
                    <div style={{flex:1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                    </div>
                    <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                        <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"46px",width:"100%",color:"#079992",border:"solid 2px",paddingTop:'5px'}}
                        onClick={()=>
                        {
                            this._onCloseClick();
                        }}>
                            <i className="fa-solid fa-circle-xmark fa-2x"></i>
                        </NbButton>
                    </div>
                </div>
                <div style={{position:'relative',top:'60px'}}>
                    <div className="row pt-2">
                        <div className="col-12">
                            <div style={{width:"100%",height:"25vh",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center",border:"solid 2px #079992",padding:"5px",borderRadius:"5px",borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px'}}>
                                <img style={{width:"100%",height:"auto",maxHeight:"100%"}} src={typeof this.state.data.IMAGE == 'undefined' ? '' : this.state.data.IMAGE} />
                            </div>
                            <div style={{backgroundColor:'#079992',height:"50px",display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <div style={{fontSize:"14px",color:"white",fontWeight:"bold",padding:'5px',overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2,textAlign:"center"}}>
                                    {typeof this.state.data.ITEM_NAME == 'undefined' ? '' : this.state.data.ITEM_NAME}
                                </div>                                            
                            </div>
                            <div style={{backgroundColor:'#079992',height:"30px",display:'flex',justifyContent:'right',alignItems:'center',paddingRight:'20px'}}>
                                <div style={{fontSize:"20px",color:"#eb2f06",fontWeight:"bold",padding:'5px',overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2,textAlign:"center"}}>
                                    {typeof this.state.data.PRICE == 'undefined' ? '' : this.state.data.PRICE + '€'}
                                </div>                                            
                            </div>
                            <div style={{display:'flex'}}>
                                <div style={{flex:0.3333}}>
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"46px",width:"100%",backgroundColor:"white",color:"#079992",border:"solid 2px #079992",paddingTop:'5px',borderTopLeftRadius:'0px',borderTopRightRadius:'0px',borderBottomRightRadius:'0px',borderTop:'none'}}
                                    onClick={()=>
                                    {
                                        this.items.QUANTITY = this.items.QUANTITY + 1
                                        this.updateState()
                                    }}>
                                        <i className="fa-solid fa-plus fa-2x"></i>
                                    </NbButton>
                                </div>
                                <div style={{flex:0.3333,height:"46px",width:"100%",color:"#079992",borderBottom:"solid 2px",paddingTop:'5px'}}>
                                    <h2 style={{textAlign:"center",color:"#FF6B6B"}}>{typeof this.state.data.QUANTITY == 'undefined' ? '' : this.state.data.QUANTITY}</h2>
                                </div>
                                <div style={{flex:0.3333}}>
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"46px",width:"100%",backgroundColor:"white",color:"#079992",border:"solid 2px #079992",paddingTop:'5px',borderTopLeftRadius:'0px',borderTopRightRadius:'0px',borderBottomLeftRadius:'0px',borderTop:'none'}}
                                    onClick={()=>
                                    {
                                        if(this.items.QUANTITY > 0)
                                        {
                                            this.items.QUANTITY = this.items.QUANTITY - 1
                                        }
                                        this.updateState()
                                    }}>
                                        <i className="fa-solid fa-minus fa-2x"></i>
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.buildProp()}
                    <div className="row pt-2">
                        <div className="col-12">
                            <div style={{width:"100%",border:"solid 2px #079992",borderRadius:"5px"}}>
                                <div style={{backgroundColor:'#079992',height:"30px",display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <div style={{fontSize:"18px",color:"white",fontWeight:"bold",padding:'5px',overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2,textAlign:"center"}}>
                                        {"Not"}
                                    </div>                                            
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <NdTextArea simple={true} parent={this} id="txtNote" height='200px'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}