import React from "react";
import NbBase from "../../../../core/react/bootstrap/base.js";
import NbButton from '../../../../core/react/bootstrap/button';
import { datatable } from '../../../../core/core.js';

export default class NbTableView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data

        this._onClick = this._onClick.bind(this)
        this._onPrintClick = this._onPrintClick.bind(this)
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    _onPrintClick(e)
    {
        if(typeof this.props.onPrintClick != 'undefined')
        {
            this.props.onPrintClick(e);
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
                tmpCountStyle = {marginBottom:'0px',height:'40px',color:'#079992',textShadow: '-1px -1px 0 #fff,1px -1px 0 #fff,-1px  1px 0 #fff,1px  1px 0 #fff',alignContent:'center'}
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
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="card-title text-center m-0">{this.state.data[i].NAME}</h5>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 p-0">
                                            <p className="fs-6 fw-bold text-center" style={tmpCountStyle}>{this.state.data[i].ORDER_COUNT == 0 ? '' : this.state.data[i].ORDER_COMPLATE_COUNT + ' / ' + this.state.data[i].ORDER_COUNT}</p>
                                        </div>
                                        <div className="col-6" style={{alignContent:'center'}}>
                                            {(()=>
                                            {
                                                if(this.state.data[i].ORDER_COUNT != 0)
                                                {
                                                    return (
                                                        <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color:'#0f6f6a' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}>
                                                                <i className="fa-solid fa-users" style={{ fontSize: '16px', marginRight: '5px' }}></i>
                                                                <h5 style={{ margin: 0, fontSize: '18px' }}><strong>{this.state.data[i].PERSON}</strong></h5>
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
                            </div>
                            {(()=>
                            {
                                if(this.state.data[i].ORDER_COUNT > 0)
                                {
                                    return (
                                        <div className="row">
                                            <div className="col-8 text-center" style={{fontSize:"18px",fontWeight:"bold",padding:"0px"}}>
                                                {Number(this.state.data[i].TOTAL).toFixed(2) + Number.money.sign}
                                            </div>
                                            <div className="col-4 text-center" style={{padding:"0px"}}>
                                                <NbButton className="form-group btn btn-block" style={{border:"none"}}
                                                onClick={()=>
                                                {
                                                    this._onPrintClick(i);
                                                }}>
                                                    <i className="fa-solid fa-print" style={{fontSize:'18px'}}></i>
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