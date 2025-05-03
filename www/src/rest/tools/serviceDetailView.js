import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import { datatable } from '../../core/core.js';
import NbLabel from "../../core/react/bootstrap/label.js";

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
        this._onPersonClick = this._onPersonClick.bind(this)
        this._onWaitClick = this._onWaitClick.bind(this)
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
    _onPersonClick(e)
    {
        if(typeof this.props.onPersonClick != 'undefined')
        {
            this.props.onPersonClick(e);
        }
    }
    _onWaitClick(e)
    {
        if(typeof this.props.onWaitClick != 'undefined')
        {
            this.props.onWaitClick(e);
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
                        tmpPropStr += tmpProp[i].TITLE + ", "
                    }                    
                }
                tmpPropStr = tmpPropStr.substring(0,tmpPropStr.length-1) + ")"
            }

            tmpTable.push(
                <div key={i} className='row' style={{ display: 'flex', marginBottom: '15px' }}>
                    <div style={{flex:1,paddingTop:'10px',paddingRight:'0px',paddingBottom:'10px'}}>
                        <div className="card" style={{
                            height:'120px',
                            width:'100%',
                            border:'none',
                            borderRadius:'10px',
                            boxShadow:'0 4px 6px rgba(0,0,0,0.1)',
                            transition:'transform 0.2s',
                            '&:hover': {
                                transform:'translateY(-5px)'
                            }
                        }}
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
                        }}>
                            {(()=>
                            {
                                if(this.state.data[i].STATUS == 2 || this.state.data[i].STATUS == 3)
                                {
                                    return <i className="fa-solid fa-check fa-6x" style={{position:'absolute',left:'35%',color:'rgba(21, 76, 121, 0.65)'}}></i>
                                }
                                else
                                {
                                    return null
                                }
                            })()}
                            <div className="card-body" style={{padding:'15px',display:'flex',alignItems:'center'}}>
                                <h6 className="card-title" 
                                style={{
                                    margin:'0px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient:'vertical',
                                    WebkitLineClamp: 4,
                                    color:'#154c79',
                                    fontSize:'16px',
                                    fontWeight:'bold'
                                }}>
                                {this.state.data[i].ITEM_NAME + " " + tmpPropStr}
                                </h6>
                            </div>
                        </div>
                    </div>
                    {(()=>
                    {
                        if(this.state.data[i].WAITING == 1)
                        {
                            return (
                                <div style={{flex:0.1,paddingTop:'10px',paddingRight:'0px',paddingBottom:'10px',paddingLeft:'0px'}}>
                                    <div>
                                        <NbButton className="form-group btn btn-block" 
                                        style={{
                                            height:"120px",
                                            width:"100%",
                                            backgroundColor:"#154c79",
                                            color:"white",
                                            border:"none",
                                            borderRadius:'10px',
                                            transition:'all 0.3s',
                                            '&:hover': {
                                                backgroundColor:'#0d3a5a'
                                            }
                                        }}
                                        onClick={async()=>
                                        {
                                            this._onWaitClick(i)
                                        }}>
                                            <i className="fa-solid fa-clock-rotate-left fa-2x" 
                                            style={{
                                                color:(this.state.data[i].WAIT_STATUS == 0 ? '#ff6b81' : this.state.data[i].WAIT_STATUS == 1 ? '#f6b93b' : 'white')
                                            }}></i>
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
                    
                    <div style={{flex:0.1,padding:'10px 0', marginLeft:'10px'}}>
                        <div style={{marginBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block" 
                            style={{
                                height:"55px",
                                width:"100%",
                                backgroundColor:"#154c79",
                                color:"white",
                                border:"none",
                                borderRadius:'10px',
                                transition:'all 0.3s',
                                '&:hover': {
                                    backgroundColor:'#0d3a5a'
                                }
                            }}
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
                            <NbButton className="form-group btn btn-block" 
                            style={{
                                height:"55px",
                                width:"100%",
                                backgroundColor:"#154c79",
                                color:"white",
                                border:"none",
                                borderRadius:'10px',
                                transition:'all 0.3s',
                                '&:hover': {
                                    backgroundColor:'#0d3a5a'
                                }
                            }}
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
                <div style={{position:'fixed',left:'0px',right:'0px',paddingLeft:'15px',paddingRight:'15px',zIndex:'1500',backgroundColor:'white',boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                    <div className='row pt-2'>
                        <div className='col-12'>
                            <h3 className="text-center" style={{color:'#154c79'}}>{this.state.title}</h3>
                        </div>
                    </div>
                    <div className="row" style={{ display: 'flex' }}>
                        <div style={{flex:1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block" 
                            style={{
                                height:"60px",
                                width:'100%',
                                backgroundColor:"#154c79",
                                color:"white",
                                border:"none",
                                borderRadius:'10px',
                                transition:'all 0.3s',
                                '&:hover': {
                                    backgroundColor:'#0d3a5a'
                                }
                            }}
                            onClick={()=>
                            {
                                this._onAddClick();
                            }}>
                                <i className="fa-solid fa-plus fa-2x"></i>
                            </NbButton>
                        </div>
                        <div style={{flex:0.1,paddingTop:'10px',paddingRight:'5px',paddingBottom:'10px'}}>
                            <NbButton className="form-group btn btn-block" 
                            style={{
                                height:"60px",
                                width:"100%",
                                backgroundColor:"#154c79",
                                color:"white",
                                border:"none",
                                borderRadius:'10px',
                                transition:'all 0.3s',
                                '&:hover': {
                                    backgroundColor:'#0d3a5a'
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
                    <div className="row" style={{ display: 'flex'}}>
                        <div style={{display:'flex',width:'100%'}}>
                            <div style={{flex:0.3333}}>
                                <NbButton className="form-group btn btn-block" 
                                style={{
                                    height:"46px",
                                    width:"100%",
                                    backgroundColor:"#154c79",
                                    color:"white",
                                    border:"none",
                                    borderRadius:'10px',
                                    transition:'all 0.3s',
                                    '&:hover': {
                                        backgroundColor:'#0d3a5a'
                                    }
                                }}
                                onClick={()=>
                                {
                                    this.lblPerson.value = (Number(this.lblPerson.value) + 1).toString()
                                    this._onPersonClick(Number(this.lblPerson.value) + 1)
                                }}>
                                    <i className="fa-solid fa-plus fa-2x"></i>
                                </NbButton>
                            </div>
                            <div style={{flex:0.3333,height:"46px",width:"100%",backgroundColor:"#154c79",color:"white",paddingTop:'5px',borderRadius:'10px'}}>
                                <div className="row">
                                    <div className="col-5 text-center">
                                        <i className="fa-solid fa-users" style={{fontSize:'26px'}}></i>
                                    </div>
                                    <div className="col-7">
                                        <h2 style={{color:"white"}}><NbLabel id="lblPerson" parent={this} value={"1"}/></h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{flex:0.3333}}>
                                <NbButton className="form-group btn btn-block" 
                                style={{
                                    height:"46px",
                                    width:"100%",
                                    backgroundColor:"#154c79",
                                    color:"white",
                                    border:"none",
                                    borderRadius:'10px',
                                    transition:'all 0.3s',
                                    '&:hover': {
                                        backgroundColor:'#0d3a5a'
                                    }
                                }}
                                onClick={()=>
                                {
                                    if(Number(this.lblPerson.value) > 1)
                                    {
                                        this.lblPerson.value = (Number(this.lblPerson.value) - 1).toString()
                                        this._onPersonClick(this.lblPerson.value)
                                    }
                                }}>
                                    <i className="fa-solid fa-minus fa-2x"></i>
                                </NbButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{position:'relative',top:'180px',padding:'15px'}}>
                    {this.buildItem()}
                </div>
            </div>
        )
    }
}