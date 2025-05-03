import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import { datatable } from '../../core/core.js';

export default class NbTableMView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data

        this._onClick = this._onClick.bind(this)
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
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
            let tmpCardStyle = {
                height:'130px',
                width:'100%',
                borderRadius:'12px',
                backgroundColor:'rgba(255, 107, 107, 0.1)',
                border:'solid 1px #FF6B6B',
                boxShadow:'0 3px 6px rgba(255, 107, 107, 0.1)',
                transition:'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                position:'relative',
                overflow:'hidden',
                '&:hover': {
                    transform:'translateY(-3px)',
                    boxShadow:'0 6px 12px rgba(255, 107, 107, 0.15)',
                    backgroundColor:'rgba(255, 107, 107, 0.15)'
                },
                '&:before': {
                    content:'""',
                    position:'absolute',
                    top:0,
                    left:0,
                    width:'100%',
                    height:'3px',
                    background:'linear-gradient(90deg, #FF6B6B, rgba(255, 107, 107, 0.2))'
                }
            }
            let tmpCountStyle = {
                marginBottom:'0px',
                height:'45px',
                color:'#154c79',
                fontSize:'24px',
                fontWeight:'600',
                textShadow:'0px 1px 2px rgba(0,0,0,0.05)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                borderRadius:'8px',
                padding:'4px 8px',
                position:'relative',
                overflow:'hidden',
                borderBottom: '2px solid transparent',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box'
            }

            if(this.state.data[i].ORDER_COUNT > 0)
            {
                tmpTable.push(
                    <div key={i} className='col-xs-6 col-sm-4 col-md-3 col-lg-2 pb-2'>
                        <div className="card" style={tmpCardStyle}>
                            <div className="card-body" style={{padding: '10px'}}> 
                                <div className="row" onClick={()=>
                                {
                                    this._onClick(i)
                                }}>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className="card-title text-center m-0" style={{
                                                    color:'#154c79', 
                                                    fontSize:'20px', 
                                                    fontWeight:'bold',
                                                    marginBottom:'6px',
                                                    textShadow:'0px 1px 1px rgba(0,0,0,0.1)',
                                                    overflow:'hidden',
                                                    textOverflow:'ellipsis',
                                                    whiteSpace:'nowrap',
                                                    borderBottom: '1px solid rgba(21, 76, 121, 0.3)',
                                                    paddingBottom: '4px'
                                                }}>{this.state.data[i].NAME}</h5>
                                            </div>
                                        </div>
                                        <div className="row" style={{marginTop: '4px'}}>
                                            <div className="col-6"> 
                                                <p className="fs-3 fw-bold text-center" style={tmpCountStyle}>{this.state.data[i].ORDER_COUNT == 0 ? '' : this.state.data[i].ORDER_COMPLATE_COUNT + ' / ' + this.state.data[i].ORDER_COUNT}</p>
                                            </div>
                                            <div className="col-6" style={{alignContent:'center'}}>
                                                <div className="row" style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    height: '45px' 
                                                }}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent:'center',
                                                        backgroundColor:'rgba(21, 76, 121, 0.05)',
                                                        borderRadius:'8px',
                                                        padding:'4px 8px',
                                                        height:'100%',
                                                        width: '100%',
                                                        position:'relative',
                                                        overflow:'hidden',
                                                        borderBottom: '2px solid transparent',
                                                        backgroundOrigin: 'border-box',
                                                        backgroundClip: 'content-box, border-box'
                                                    }}>
                                                        <i className="fa-solid fa-users" style={{ 
                                                            fontSize: '18px',
                                                            marginRight: '5px',
                                                            color:'#154c79'
                                                        }}></i>
                                                        <h5 style={{ 
                                                            margin: 0, 
                                                            fontSize: '22px',
                                                            color:'#154c79',
                                                            fontWeight:'bold'
                                                        }}>{this.state.data[i].PERSON}</h5>
                                                    </div>
                                                </div>
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
        return tmpTable
    }
    render()
    {
        return(
            this.buildItem()
        )
    }
}