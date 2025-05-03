import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from '../../core/react/bootstrap/button';
import NdDialog,{ dialog } from "../../core/react/devex/dialog.js";
import { datatable } from '../../core/core.js';
import NbLabel from "../../core/react/bootstrap/label.js";

export default class NbServiceMDetailView extends NbBase
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
                tmpPropStr = ""
                let tmpProp = JSON.parse(this.state.data[i].PROPERTY)
                
                for (let j = 0; j < tmpProp.length; j++)
                {
                    if(tmpProp[j].VALUE)
                    {
                        tmpPropStr += tmpProp[j].TITLE + ", "
                    }                    
                }
                tmpPropStr = tmpPropStr.substring(0,tmpPropStr.length-2)
            }

            let itemCardStyle = {
                height: 'auto',
                minHeight: '65px',
                width: '100%',
                borderRadius: '10px',
                border: 'solid 1px #154c79',
                backgroundColor: 'rgba(21, 76, 121, 0.08)',
                marginBottom: '10px',
                padding: '8px 12px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease-out'
            };

            let completedOverlayStyle = {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(5, 128, 121, 0.1)',
                color: '#058079',
                zIndex: 1
            };

            let waitingIndicatorStyle = {
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '14px',
                color: this.state.data[i].WAIT_STATUS == 0 ? '#ff6b81' : this.state.data[i].WAIT_STATUS == 1 ? '#f6b93b' : '#079992'
            };

            tmpTable.push(
                <div key={i} className='row' 
                    onClick={(e)=>
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
                    style={{paddingLeft: '15px', paddingRight: '15px'}}
                    >
                    <div className="card" style={itemCardStyle}>
                        <div style={{ position: 'relative', zIndex: 0 }}> 
                            <div className="row">
                                <div className="col-12">
                                    <h6 style={{
                                        margin: '0 0 4px 0', 
                                        fontSize: '16px', 
                                        fontWeight: 'bold',
                                        color: '#154c79',
                                        paddingRight: '20px'
                                    }}>
                                        {this.state.data[i].ITEM_NAME}
                                    </h6>
                                </div>
                            </div>
                            {tmpPropStr !== "" && (
                                <div className="row">
                                    <div className="col-12">
                                        <h6 style={{
                                            margin: '0 0 4px 0', 
                                            fontSize: '13px', 
                                            color: '#1e6091',
                                            fontStyle: 'italic'
                                            }}>
                                            {tmpPropStr}
                                        </h6>
                                    </div>
                                </div>
                            )}
                            {this.state.data[i].DESCRIPTION !== "" && (
                                <div className="row">
                                    <div className="col-12">
                                        <h6 style={{
                                            margin:'0', 
                                            fontSize:'13px', 
                                            color:'#d9534f'
                                        }}>
                                            {this.state.data[i].DESCRIPTION}
                                        </h6>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(this.state.data[i].WAITING == 1 && this.state.data[i].WAIT_STATUS > 0) &&
                            <i className="fa-solid fa-clock-rotate-left" style={waitingIndicatorStyle}></i>
                        }
                        {(this.state.data[i].STATUS == 2 || this.state.data[i].STATUS == 3) && (
                            <div style={completedOverlayStyle}>
                                <i className="fa-solid fa-check fa-3x"></i> 
                            </div>
                        )}
                    </div>
                </div>
            )
        }
        return tmpTable
    }
    render()
    {
        const headerStyle = {
            position:'fixed',
            left:'0px',
            right:'0px',
            top: 0,
            padding: '10px 15px',
            zIndex:'1500',
            backgroundColor:'#f8f9fa',
            borderBottom: '1px solid #dee2e6'
        };

        const titleStyle = {
            color:'#154c79',
            fontWeight: 'bold',
            margin: 0
        };

        const personSectionStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const personIconStyle = {
            fontSize:'24px', 
            color:'#154c79',
            marginBottom: '4px' 
        };

        const personCountStyle = {
            color:"#FF6B6B", 
            margin: 0,
            fontSize: '22px',
            fontWeight: 'bold'
        };

        const closeButtonStyle = {
            height:"100%",
            width:"100%",
            color:"#154c79",
            border:"none",
            backgroundColor:'rgba(21, 76, 121, 0.1)',
            borderRadius:'8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition:'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(21, 76, 121, 0.2)',
            '&:hover': {
                backgroundColor:'rgba(21, 76, 121, 0.2)',
                transform:'translateY(-1px) scale(1.05)',
                boxShadow: '0 2px 4px rgba(21, 76, 121, 0.3)'
            }
        }

        return(
            <div>
                <div style={headerStyle}>
                    <div className='row align-items-center'>
                        <div className='col-8'>
                            <h3 className="text-left" style={titleStyle}>{this.state.title}</h3>
                        </div>
                        <div className='col-3 text-center' style={personSectionStyle}>
                            <i className="fa-solid fa-users" style={personIconStyle}></i>
                            <h2 style={personCountStyle}><NbLabel id="lblPerson" parent={this} value={"1"}/></h2>
                        </div>
                        <div className='col-1' style={{padding: '0 5px 0 0'}}> 
                            <NbButton className="form-group btn btn-block" style={closeButtonStyle}
                            onClick={()=> { this._onCloseClick() }}>
                                <i className="fa-solid fa-circle-xmark fa-lg"></i> 
                            </NbButton>
                        </div>
                    </div>
                </div>
                <div style={{paddingTop:'90px', paddingBottom: '10px'}}> 
                    {this.buildItem()}
                </div>
            </div>
        )
    }
}