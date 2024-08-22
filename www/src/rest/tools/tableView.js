import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import { datatable } from '../../core/core.js';

export default class NbTableView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data

        this._onClick = this._onClick.bind(this)
        this._onDeleteClick = this._onDeleteClick.bind(this)
        this._onChangeClick = this._onChangeClick.bind(this)
        this._onSaveClick = this._onSaveClick.bind(this)    
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
            let tmpCardStyle = {height:'120px',width:'100%',borderRadius:'10px',backgroundColor:'#00d2d3',border:'solid 2px rgb(7, 153, 146)',borderRadius:'10px'}
            let tmpCountStyle = {marginBottom:'0px',height:'40px'}

            if(this.state.data[i].ORDER_COUNT > 0)
            {
                tmpCardStyle = {height:'120px',width:'100%',borderRadius:'10px',backgroundColor:'#ff9f43',border:'solid 2px rgb(7, 153, 146)',borderRadius:'10px'}
                tmpCountStyle = {marginBottom:'0px',height:'40px',color:'#079992',textShadow: '-1px -1px 0 #fff,1px -1px 0 #fff,-1px  1px 0 #fff,1px  1px 0 #fff'}
            }

            tmpTable.push(
                <div key={i} className='col-xs-6 col-sm-4 col-md-3 col-lg-2 pb-2'>
                    <div className="card" style={tmpCardStyle}>
                        <div className="card-body">
                            <div className="row" onClick={()=>
                            {
                                this._onClick(i)
                            }}>
                                <div className="col-12">
                                    <h5 className="card-title text-center m-0">{this.state.data[i].NAME}</h5>
                                    <p className="fs-3 fw-bold text-center" style={tmpCountStyle}>{this.state.data[i].ORDER_COUNT == 0 ? '' : this.state.data[i].ORDER_COMPLATE_COUNT + ' / ' + this.state.data[i].ORDER_COUNT}</p>
                                </div>
                            </div>
                            {(()=>
                            {
                                if(this.state.data[i].ORDER_COUNT > 0)
                                {
                                    return (
                                        <div className="row">
                                            <div className="col-4 text-center">
                                                <NbButton className="form-group btn btn-block" style={{color:"white",border:"none"}}
                                                onClick={()=>
                                                {
                                                    this._onDeleteClick(i)
                                                }}>
                                                    <i className="fa-solid fa-trash" style={{fontSize:'18px'}}></i>
                                                </NbButton>
                                            </div>
                                            <div className="col-4 text-center">
                                                <NbButton className="form-group btn btn-block" style={{color:"white",border:"none"}}
                                                onClick={()=>
                                                {
                                                    this._onChangeClick(i)
                                                }}>
                                                    <i className="fa-solid fa-arrows-rotate" style={{fontSize:'18px'}}></i>
                                                </NbButton>
                                            </div>
                                            <div className="col-4 text-center">
                                                <NbButton className="form-group btn btn-block" style={{color:"white",border:"none"}}
                                                onClick={()=>
                                                {
                                                    this._onSaveClick(i);
                                                }}>
                                                    {(()=>
                                                    {
                                                        if(this.state.data[i].DELIVERED > 0)
                                                        {
                                                            return <i className="fa-solid fa-bell-concierge" style={{fontSize:'18px',color:'#079992'}}></i>
                                                        }
                                                        else
                                                        {
                                                            return <i className="fa-solid fa-bell-concierge" style={{fontSize:'18px'}}></i>
                                                        }
                                                    })()}
                                                </NbButton>
                                            </div>
                                        </div>
                                    )
                                }
                                else
                                {
                                    return null
                                }
                            })()}                                
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
            this.buildItem()
        )
    }
}