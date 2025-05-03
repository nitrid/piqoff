import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import { datatable } from '../../core/core.js';

export default class NbServiceMView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data
        this.state.title = typeof this.props.title == 'undefined' ? '' : this.props.title
         
        this._onClick = this._onClick.bind(this)
        this._onSaveClick = this._onSaveClick.bind(this)
        this._onCloseClick = this._onCloseClick.bind(this)
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    _onSaveClick(e)
    {
        if(typeof this.props.onSaveClick != 'undefined')
        {
            this.props.onSaveClick(e);
        }
    }
    _onCloseClick()
    {
        if(typeof this.props.onCloseClick != 'undefined')
        {
            this.props.onCloseClick();
        }
    }
    get title()
    {
        return this.state.title
    }
    set title(value)
    {
        this.setState({title:value})
    }
    async updateState() 
    {
        await this.props.parent.core.util.waitUntil(0)
        this.setState({data:[]},()=>
        {
            this.setState({data:this.items})
        })
    }
    buildItem()
    {
        let tmpTable = []
        for (let i = 0; i < this.state.data.length; i++) 
        {
            tmpTable.push(
                <div key={i} className='row' style={{ display: 'flex' }}>
                    <div style={{flex:1,paddingTop:'10px',paddingRight:'0px',paddingBottom:'10px'}}>
                        <div className="card" 
                            style={{
                            height:'120px',
                            width:'100%',
                            border:'solid 2px #154c79',
                            borderRight:'none',
                            borderTopRightRadius:'0px',
                            borderBottomRightRadius:'0px',
                            backgroundColor:'rgba(21,76,121,0.05)',
                            boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
                            transition:'all 0.3s ease',
                            '&:hover': {
                                transform:'translateY(-2px)',
                                boxShadow:'0 4px 6px rgba(0,0,0,0.2)',
                                backgroundColor:'rgba(21,76,121,0.1)'
                            }
                        }}
                        onClick={()=>
                        {
                            this._onClick(i)
                        }}>
                            {(()=>
                            {
                                if(this.state.data[i].ORDER_COMPLATE_COUNT == this.state.data[i].ORDER_COUNT)
                                {
                                    return <i className="fa-solid fa-check fa-6x" style={{position:'absolute',left:'35%',color:'rgb(5 128 121 / 65%)'}}></i>
                                }
                                else
                                {
                                    return null
                                }
                            })()}
                            <div className="card-body" style={{padding:'5px',display:'flex',alignItems:'center'}}>
                                <h3 className="card-title text-center" style={{color:'#154c79',fontSize:'22px',fontWeight:'bold',margin:'0',flex:1}}>{"SERVICE - " + this.state.data[i].REF}</h3>
                                <p className="fs-3 fw-bold position-absolute" style={{marginBottom:'0px',color:'#154c79',fontSize:'20px',fontWeight:'bold'}}>{this.state.data[i].ORDER_COUNT == 0 ? '' : this.state.data[i].ORDER_COMPLATE_COUNT + ' / ' + this.state.data[i].ORDER_COUNT}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex',justifyContent: 'flex-end',gap: '10px',paddingTop: '10px'}}>
                        <div>
                            <NbButton className="form-group btn btn-block btn-outline-dark" 
                              style={{
                                height:"35px",
                                width:"35px",
                                color:"#154c79",
                                border:"solid 2px #154c79",
                                borderRadius:'50%',
                                backgroundColor:'rgba(21,76,121,0.05)',
                                transition:'all 0.3s ease',
                                boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor:'rgba(21,76,121,0.15)',
                                    transform:'translateY(-2px)',
                                    boxShadow:'0 4px 8px rgba(0,0,0,0.2)'
                                },
                                '&:active': {
                                    transform:'scale(0.95)'
                                }
                            }}
                            onClick={()=>
                            {
                                this._onSaveClick(i)
                            }}>
                                {(()=>
                                {
                                    if(this.state.data[i].DELIVERED > 0)
                                    {
                                        return <i className="fa-solid fa-bell-concierge fa-2x" style={{color:'#ff6b81'}}></i>
                                    }
                                    else
                                    {
                                        return <i className="fa-solid fa-bell-concierge fa-2x" style={{color:'#079992'}}></i>
                                    }
                                })()}
                                
                            </NbButton>
                        </div>
                    </div>
                </div>
            )
        }
        return tmpTable
    }
    render()
    {
        return(
            <div>
                <div style={{position:'fixed',left:'0px',right:'0px',paddingLeft:'15px',paddingRight:'15px',zIndex:'1500',backgroundColor:'white'}}>
                    <div className='row pt-2'>
                        <div className='col-12'>
                            <h3 className="text-center" style={{color:'#079992'}}>{this.state.title}</h3>
                        </div>
                    </div>
                    <div className="row" style={{ display: 'flex' }}>
                        <div style={{flex:1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            
                        </div>
                        <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"60px",width:"100%",color:"#079992",border:"solid 2px"}}
                            onClick={()=>
                            {
                                this._onCloseClick()
                            }}>
                                <i className="fa-solid fa-circle-xmark fa-2x"></i>
                            </NbButton>
                        </div>
                    </div>
                </div>
                <div style={{position:'relative',top:'120px'}}>
                    {this.buildItem()}
                </div>
            </div>
        )
    }
}