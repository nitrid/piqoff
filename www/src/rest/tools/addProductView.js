import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import { datatable } from '../../core/core.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NdTextBox from "../../core/react/devex/textbox.js";
import NbLabel from "../../core/react/bootstrap/label.js";

export default class NbAddProductView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.grpItem = new datatable();
        this.fullItems = new datatable();
        this.mounted = false;

        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data
        
        this._onClick = this._onClick.bind(this)
        this._onCloseClick = this._onCloseClick.bind(this)
        this._onPlusClick = this._onPlusClick.bind(this)
        this._onMinusClick = this._onMinusClick.bind(this)
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    _onCloseClick()
    {
        if(typeof this.props.onCloseClick != 'undefined')
        {
            this.props.onCloseClick();
        }
    }
    _onPlusClick(e)
    {
        if(typeof this.props.onPlusClick != 'undefined')
        {
            this.props.onPlusClick(e);
        }
    }
    _onMinusClick(e)
    {
        if(typeof this.props.onMinusClick != 'undefined')
        {
            this.props.onMinusClick(e);
        }
    }
    componentDidMount() 
    {
        this.mounted = true; // Bileşen monte edildiğinde flag'i true olarak ayarlayın
        this.updateState();
    }    
    componentWillUnmount() 
    {
        this.mounted = false; // Bileşen unmounted olduğunda flag'i false olarak ayarlayın
    }
    async updateState() 
    {
        await this.props.parent.core.util.waitUntil(0)
        if (this.mounted) 
        {
            this.setState({data:[]},()=>
            {
                this.setState({data:this.items})
            })
        }
    }
    buildItem()
    {
        let tmpTable = []
        for (let i = 0; i < this.state.data.length; i++) 
        {
            tmpTable.push(
                <div key={i} className="col-6 col-xs-6 col-sm-4 col-md-3 col-lg-2 pb-2">
                    <div style={{backgroundColor:'#079992',height:"40px",borderTopRightRadius:"5px",
                    borderTopLeftRadius:"5px",display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <div style={{fontSize:"14px",color:"white",fontWeight:"bold",padding:'5px',overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2}}>
                            {this.state.data[i].ITEM_NAME}
                        </div>                                            
                    </div>
                    <NbButton className="form-group btn btn-success btn-block" 
                    style={{height:"110px",width:"100%",fontSize:"14px",backgroundSize:"100% 100%",padding:"0px",position:"relative",borderRadius:"0px",border:'solid 2px #079992',backgroundImage:"url(" + this.state.data[i].IMAGE + ")"}}
                    onClick={()=>
                    {
                        this._onClick(i)
                    }}> 
                    </NbButton>
                    <div style={{display:'flex'}}>
                        <div style={{flex:0.3333}}>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"46px",width:"100%",backgroundColor:"#079992",color:"white",border:"solid 2px #079992",paddingTop:'5px',borderTopLeftRadius:'0px',borderTopRightRadius:'0px',borderBottomRightRadius:'0px',borderTop:'none'}}
                            onClick={()=>
                            {
                                this.items[i].QUANTITY = this.props.parent.isMultiQtyGrp(this.items[i].SUB_CODE) ? this.items[i].QUANTITY + 1 : 1
                                this["quantity" + i].value = this.items[i].QUANTITY
                                this._onPlusClick(i);
                            }}>
                                <i className="fa-solid fa-plus fa-2x"></i>
                            </NbButton>
                        </div>
                        <div style={{flex:0.3333,height:"46px",width:"100%",color:"#079992",borderBottom:"solid 2px",paddingTop:'5px'}}>
                            <h2 style={{textAlign:"center",color:"#FF6B6B"}}><NbLabel id={"quantity" + i} parent={this} value={this.items[i].QUANTITY}/></h2>
                        </div>
                        <div style={{flex:0.3333}}>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"46px",width:"100%",backgroundColor:"#079992",color:"white",border:"solid 2px #079992",paddingTop:'5px',borderTopLeftRadius:'0px',borderTopRightRadius:'0px',borderBottomLeftRadius:'0px',borderTop:'none'}}
                            onClick={()=>
                            {
                                if(this.items[i].QUANTITY > 0)
                                {
                                    this.items[i].QUANTITY = this.items[i].QUANTITY - 1
                                }
                                this["quantity" + i].value = this.items[i].QUANTITY
                                this._onMinusClick(i);
                            }}>
                                <i className="fa-solid fa-minus fa-2x"></i>
                            </NbButton>
                        </div>
                    </div>
                </div>
            )
        }
        return tmpTable
    }
    buildGrp()
    {
        let tmpGrp = []
        for (let i = 0; i < this.grpItem.length; i++) 
        {
            tmpGrp.push(
            <div key={i}>
                <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"60px",width:'95%',color:"#079992",border:"solid 2px",padding:'5px'}}
                onClick={async()=>
                {
                    await this.props.parent.core.util.waitUntil(0)
                    this.txtSearch.value = ""
                    this.items = this.fullItems.where({SUB_CODE:this.grpItem[i].CODE})
                    this.updateState()
                }}>
                    <h6 style={{overflow:'hidden',textOverflow:'ellipsis',display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 2}}>{this.grpItem[i].NAME}</h6>
                </NbButton>
            </div>
            )
        }
        return tmpGrp
    }
    render()
    {
        const settings = 
        {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3
        };

        return(
            <div>
                <div style={{position:'fixed',left:'0px',right:'0px',paddingLeft:'15px',paddingRight:'15px',zIndex:'1500',backgroundColor:'white'}}>
                    <div className="row pt-2">
                        <div className="col-12">
                            <Slider {...settings}>
                                {this.buildGrp()}
                            </Slider>
                        </div>
                    </div>
                    <div className="row">
                        <div style={{flex:1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NdTextBox id="txtSearch" parent={this} simple={true} elementAttr={{style:"font-size:15pt;font-weight:bold;border:2px solid #079992;"}}
                            onValueChanged={(e)=>
                            {
                                this.items = this.fullItems.where({ITEM_NAME: {'LIKE' : e.value}})
                                this.items = this.items.filter(x => x.ITEM_NAME.toLowerCase().indexOf(e.value.toLowerCase()) > -1 || x.ITEM_CODE.toLowerCase().indexOf(e.value.toLowerCase()) > -1).sort((a, b) => 
                                {
                                    const aValue = e.value.toLowerCase();
                                    const bValue = e.value.toLowerCase();
                                
                                    const aStarts = a.ITEM_NAME.toLowerCase().startsWith(aValue) || a.ITEM_CODE.toLowerCase().startsWith(aValue);
                                    const bStarts = b.ITEM_NAME.toLowerCase().startsWith(bValue) || b.ITEM_CODE.toLowerCase().startsWith(bValue);
                                
                                    if (aStarts && !bStarts) 
                                    {
                                        return -1;
                                    } 
                                    else if (!aStarts && bStarts) 
                                    {
                                        return 1;
                                    } 
                                    else 
                                    {
                                        const aIndex = Math.min(
                                            a.ITEM_NAME.toLowerCase().indexOf(aValue), 
                                            a.ITEM_CODE.toLowerCase().indexOf(aValue)
                                        );
                                        const bIndex = Math.min(
                                            b.ITEM_NAME.toLowerCase().indexOf(bValue), 
                                            b.ITEM_CODE.toLowerCase().indexOf(bValue)
                                        );
                                        return aIndex - bIndex;
                                    }
                                });
                                this.updateState()
                            }}/>
                        </div>
                        <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"50px",width:"100%",color:"#079992",border:"solid 2px",paddingTop:'5px'}}
                            onClick={()=>
                            {
                                this._onCloseClick();
                            }}>
                                <i className="fa-solid fa-circle-xmark fa-2x"></i>
                            </NbButton>
                        </div>
                    </div>
                </div>
                <div style={{position:'relative',top:'135px'}}>
                    <div className='row'>
                        {this.buildItem()}
                    </div>
                </div>
            </div>
        )
    }
}