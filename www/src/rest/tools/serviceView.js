import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import { datatable } from '../../core/core.js';

export default class NbServiceView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data
        this.state.title = typeof this.props.title == 'undefined' ? '' : this.props.title
         
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
                <div key={i} className='row' style={{ display: 'flex', marginBottom: '20px' }}>
                    <div style={{flex:1}}>
                        <div className="card" style={{
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
                            <div className="card-body" style={{padding:'12px',display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%'}}>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <h3 className="card-title text-center" style={{
                                        color:'#154c79',
                                        fontSize:'22px',
                                        fontWeight:'bold',
                                        margin:'0',
                                        flex:1
                                    }}>{"SERVICE - " + this.state.data[i].REF}</h3>
                                    <p className="fs-3 fw-bold" style={{
                                        marginBottom:'0px',
                                        color:'#154c79',
                                        fontSize:'20px',
                                        fontWeight:'bold'
                                    }}>{this.state.data[i].ORDER_COUNT == 0 ? '' : this.state.data[i].ORDER_COMPLATE_COUNT + ' / ' + this.state.data[i].ORDER_COUNT}</p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    paddingTop: '10px'
                                }}>
                                    <NbButton className="form-group btn btn-block" 
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
                                            transform:'translateY(-2px) rotate(15deg)',
                                            boxShadow:'0 4px 8px rgba(0,0,0,0.2)'
                                        },
                                        '&:active': {
                                            transform:'scale(0.95)'
                                        }
                                    }}
                                    onClick={()=>
                                    {
                                        this._onChangeClick(i)
                                    }}>
                                        <i className="fa-solid fa-arrows-rotate fa-1x" style={{filter:'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))'}}></i>
                                    </NbButton>
                                    <NbButton className="form-group btn btn-block" 
                                    style={{
                                        height:"35px",
                                        width:"35px",
                                        color:"#e74c3c",
                                        border:"solid 2px #154c79",
                                        borderRadius:'50%',
                                        backgroundColor:'rgba(231,76,60,0.05)',
                                        transition:'all 0.3s ease',
                                        boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor:'rgba(231,76,60,0.15)',
                                            transform:'translateY(-2px)',
                                            boxShadow:'0 4px 8px rgba(0,0,0,0.2)'
                                        },
                                        '&:active': {
                                            transform:'scale(0.95)'
                                        }
                                    }}
                                    onClick={()=>
                                    {
                                        this._onDeleteClick(i)
                                    }}>
                                        <i className="fa-solid fa-trash fa-1x" style={{filter:'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))'}}></i>
                                    </NbButton>
                                    <NbButton className="form-group btn btn-block" 
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
                                    onClick={(e)=>
                                    {
                                        this._onSaveClick(i)
                                    }}>
                                        {(()=>
                                        {
                                            if(this.state.data[i].DELIVERED > 0)
                                            {
                                                return <i className="fa-solid fa-bell-concierge fa-1x" style={{color:'#FF6B6B', textShadow:'0px 0px 5px rgba(255,107,107,0.5)', animation:'pulse 1.5s virtual'}}></i>
                                            }
                                            else
                                            {
                                                return <i className="fa-solid fa-bell-concierge fa-1x" style={{color:'#154c79', filter:'drop-shadow(0px 1px 2px rgba(21,76,121,0.3))'}}></i>
                                            }
                                        })()}
                                    </NbButton>
                                </div>
                            </div>
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
                <div style={{
                    position:'fixed',
                    left:'0px',
                    right:'0px',
                    paddingLeft:'15px',
                    paddingRight:'15px',
                    zIndex:'1500',
                    backgroundColor:'white',
                    boxShadow:'0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div className='row pt-2'>
                        <div className='col-12'>
                            <h3 className="text-center" style={{
                                color:'#154c79',
                                fontSize:'24px',
                                fontWeight:'bold',
                                marginBottom:'10px'
                            }}>{this.state.title}</h3>
                        </div>
                    </div>
                    <div className="row" style={{ display: 'flex' }}>
                        <div style={{flex:1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block" style={{
                                height:"60px",
                                width:'100%',
                                color:"#154c79",
                                border:"solid 2px #154c79",
                                borderRadius:'8px',
                                backgroundColor:'rgba(21,76,121,0.05)',
                                transition:'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor:'rgba(21,76,121,0.1)',
                                    transform:'translateY(-2px)',
                                    boxShadow:'0 4px 6px rgba(0,0,0,0.1)'
                                }
                            }}
                            onClick={async()=>
                            {
                                this._onAddClick()
                            }}>
                                <i className="fa-solid fa-plus fa-2x"></i>
                            </NbButton>
                        </div>
                        <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block" style={{
                                height:"60px",
                                width:"100%",
                                color:"#154c79",
                                border:"solid 2px #154c79",
                                borderRadius:'8px',
                                backgroundColor:'rgba(21,76,121,0.05)',
                                transition:'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor:'rgba(21,76,121,0.1)',
                                    transform:'translateY(-2px)',
                                    boxShadow:'0 4px 6px rgba(0,0,0,0.1)'
                                }
                            }}
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