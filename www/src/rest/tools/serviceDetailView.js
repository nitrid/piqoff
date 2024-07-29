import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import { datatable } from '../../core/core.js';

export default class NbServiceDetailView extends NbBase
{
    constructor(props)
    {
        super(props)

        this.items = new datatable();
        this.state.data = typeof this.state.data == 'undefined' ? this.items : this.state.data
        this.state.title = typeof this.props.title == 'undefined' ? '' : this.props.title

        this._onClick = this._onClick.bind(this)
        this._onDoubleClick = this._onDoubleClick.bind(this)
        this._onDeleteClick = this._onDeleteClick.bind(this)
        this._onChangeClick = this._onChangeClick.bind(this)
        this._onAddClick = this._onAddClick.bind(this)
        this._onPlusClick = this._onPlusClick.bind(this)
        this._onMinusClick = this._onMinusClick.bind(this)
        this._onCloseClick = this._onCloseClick.bind(this)

        this.clickTimeout = null;
    }
    _onClick(e)
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(e);
        }
    }
    _onDoubleClick(e)
    {
        if(typeof this.props.onDoubleClick != 'undefined')
        {
            this.props.onDoubleClick(e);
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
    _onAddClick()
    {
        if(typeof this.props.onAddClick != 'undefined')
        {
            this.props.onAddClick();
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
    buildItem()
    {
        let tmpTable = []
        for (let i = 0; i < this.state.data.length; i++) 
        {
            let tmpPropStr = ""
            if(this.isValidJSON(this.state.data[i].PROPERTY))
            {
                tmpPropStr = "("
                let tmpProp = JSON.parse(this.state.data[i].PROPERTY)
                
                for (let i = 0; i < tmpProp.length; i++) 
                {
                    if(tmpProp[i].VALUE)
                    {
                        tmpPropStr += tmpProp[i].TITLE + ","
                    }
                    
                }
                tmpPropStr = tmpPropStr.substring(0,tmpPropStr.length-1) + ")"
            }

            tmpTable.push(
                <div key={i} className='row' style={{ display: 'flex' }}>
                    <div style={{flex:1,paddingTop:'10px',paddingRight:'0px',paddingBottom:'10px'}}>
                        <div className="card" style={{height:'100px',width:'100%',border:'solid 2px #079992',borderRight:'none',borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                        onClick={()=>
                        {
                            if (this.clickTimeout) 
                            {
                                clearTimeout(this.clickTimeout);
                                this.clickTimeout = null;
                                this._onDoubleClick(i)
                            }
                            else 
                            {
                                this.clickTimeout = setTimeout(async() => 
                                {
                                    if(this.items[i].STATUS == 2)
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgOrderDisable',showTitle:true,title:this.lang.t("msgOrderDisable.title"),showCloseButton:true,width:'80%',height:'180px',
                                            button:[{id:"btn01",caption:this.lang.t("msgOrderDisable.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderDisable.msg")}</div>)
                                        }
                                        await dialog(tmpConfObj)
                                        return
                                    }

                                    this._onClick(i)
                                    this.clickTimeout = null;
                                }, 300);
                            }
                        }}
                        >
                            {(()=>
                            {
                                if(this.state.data[i].STATUS == 2 || this.state.data[i].STATUS == 3)
                                {
                                    return <i className="fa-solid fa-check fa-6x" style={{position:'absolute',left:'35%',color:'rgb(5 128 121 / 65%)'}}></i>
                                }
                                else
                                {
                                    return null
                                }
                            })()}
                            <div className="card-body" style={{padding:'5px',display:'flex',alignItems:'center'}}>
                                <h6 className="card-title" 
                                style={{margin:'0px',overflow: 'hidden',textOverflow: 'ellipsis',
                                display: '-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp: 4}}>
                                {this.state.data[i].ITEM_NAME + " " + tmpPropStr}
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div style={{flex:0.15,paddingTop:'10px',paddingRight:'0px',paddingBottom:'10px',paddingLeft:'0px'}}>
                        <div>
                            <NbButton className="form-group btn btn-block btn-outline-dark" 
                            style={{height:"35px",width:"100%",color:"#079992",border:"solid 2px",borderTopLeftRadius:'0px',
                            borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px',borderTopRightRadius:'0px',borderRight:'none',
                            transaction:'none'}}
                            onClick={async()=>
                            {
                                if(this.items[i].STATUS == 2)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderDisable',showTitle:true,title:this.lang.t("msgOrderDisable.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderDisable.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderDisable.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj)
                                    return
                                }
                                this.items[i].QUANTITY += 1
                                this.items[i].STATUS = 0
                                this.updateState()
                                this._onPlusClick(i)
                            }}>
                                <i className="fa-solid fa-plus fa-1x"></i>
                            </NbButton>
                        </div>
                        <div style={{height:"30px",width:"100%",borderLeft:"solid 2px #079992",borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}>
                            <h3 style={{margin:'0px',height:'100%',alignContent:'center',textAlign:'center',color:'#ff6b6b'}}>{this.state.data[i].QUANTITY}</h3>
                        </div>
                        <div>
                            <NbButton className="form-group btn btn-block btn-outline-dark" 
                            style={{height:"35px",width:"100%",color:"#079992",border:"solid 2px",borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px',borderTopRightRadius:'0px',borderRight:'none'}}
                            onClick={async()=>
                            {
                                if(this.items[i].STATUS == 2)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderDisable',showTitle:true,title:this.lang.t("msgOrderDisable.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderDisable.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderDisable.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj)
                                    return
                                }

                                if(this.items[i].QUANTITY > 1)
                                {
                                    this.items[i].QUANTITY -= 1
                                    this.items[i].STATUS = 0
                                    this.updateState()
                                    this._onMinusClick(i)
                                }
                            }}>
                                <i className="fa-solid fa-minus fa-1x"></i>
                            </NbButton>
                        </div>
                    </div>
                    <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px',paddingLeft:'0px'}}>
                        <div>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"50px",width:"100%",color:"#079992",border:"solid 2px",borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px'}}
                            onClick={async()=>
                            {
                                if(this.items[i].STATUS == 2)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderDisable',showTitle:true,title:this.lang.t("msgOrderDisable.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderDisable.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderDisable.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj)
                                    return
                                }
                                this._onChangeClick(i);
                            }}>
                                <i className="fa-solid fa-arrows-rotate fa-1x"></i>
                            </NbButton>
                        </div>
                        <div>
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"50px",width:"100%",color:"#079992",border:"solid 2px",borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px',borderTopRightRadius:'0px',borderTop:'none'}}
                            onClick={async()=>
                            {
                                if(this.items[i].STATUS == 2)
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgOrderDisable',showTitle:true,title:this.lang.t("msgOrderDisable.title"),showCloseButton:true,width:'80%',height:'180px',
                                        button:[{id:"btn01",caption:this.lang.t("msgOrderDisable.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgOrderDisable.msg")}</div>)
                                    }
                                    await dialog(tmpConfObj)
                                    return
                                }
                                this._onDeleteClick(i)
                            }}>
                                <i className="fa-solid fa-trash fa-1x"></i>
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
                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"60px",width:'100%',color:"#079992",border:"solid 2px"}}
                            onClick={()=>
                            {
                                this._onAddClick();
                            }}>
                                <i className="fa-solid fa-plus fa-2x"></i>
                            </NbButton>
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