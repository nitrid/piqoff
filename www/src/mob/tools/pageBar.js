import React from 'react';
import NbButton from '../../core/react/bootstrap/button';
import NbBase from '../../core/react/bootstrap/base';
import { right } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class PageBar extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            title : '',
            activeContent : {},
            rightSide : false,
            rightSideHidden : true
        }
    }
    componentDidMount()
    {
        // document.addEventListener("click", (e)=>
        // {
        //     const elementLeft = window.getComputedStyle(document.querySelector('.pageBarSide')).getPropertyValue('left')
        //     const percentageLeft = (parseFloat(elementLeft) / document.querySelector('.pageBarSide').parentElement.offsetWidth) * 100
            
        //     if (percentageLeft == 30) 
        //     {
        //         this.setState({ rightSide: false });
        //     }
        // });
    }
    activePage(pPage)
    {
        if(typeof this.props.content != 'undefined' && Array.isArray(this.props.content))
        {
            this.setState({activeContent:this.props.content.find(x => x.name == pPage)})
        }
    }
    render()
    {
        let tmpContent = this.state.activeContent
        let tmpLeftBar = (<div></div>)
        let tmpCenterBar = (<div></div>)
        let tmpRightBar = (<div></div>)
        let tmpSideBar = (<div></div>)

        if(tmpContent.isBack)
        {
            tmpLeftBar = (
                <NbButton className="btn btn-block back-button-corporate" style={{
                    height:"40px",
                    background:"transparent",
                    border:"none",
                    padding: '8px',
                    borderRadius: '0'
                }}
                onClick={()=>
                {
                    if(typeof this.props.onBackClick != 'undefined')
                    {
                        this.props.onBackClick()
                    }
                }}>
                    <div className='d-flex align-items-center justify-content-center h-100'>
                        <i className={"fa-solid fa-arrow-left"} style={{
                            color:'#495057',
                            fontSize:'16px'
                        }}></i>
                    </div>
                </NbButton>
            )
        }
        
        if(tmpContent.isTitle)
        {
            tmpCenterBar = (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px'
                }}>
                    <h5 className='overflow-hidden' style={{
                        color:'#343a40',
                        margin: '0',
                        fontSize:'16px',
                        fontWeight: '600'
                    }}>
                        {this.props.title}
                    </h5>
                </div>
            )
        }
        else if(typeof tmpContent.shortcuts != 'undefined' && Array.isArray(tmpContent.shortcuts))
        {
            let tmpShortcuts = []
            let tmpKey = 0
            tmpContent.shortcuts.map((item) =>
            {
                tmpShortcuts.push(
                    <NbButton key={tmpKey} className="btn btn-block shortcut-button-corporate" style={{
                        height:"40px",
                        background:"transparent",
                        border:"none",
                        borderRadius: '0',
                        padding: '8px',
                        marginLeft: '8px',
                        marginRight: '8px'
                    }}
                    onClick={()=>
                    {
                        if(typeof item.onClick != 'undefined')
                        {
                            item.onClick()
                        }
                    }}>
                        <div className='d-flex align-items-center justify-content-center h-100'>
                            <FontAwesomeIcon icon={["fa",item.icon]} style={{
                                color:'#495057',
                                fontSize:'16px'
                            }}/>
                        </div>
                    </NbButton>
                )
                tmpKey++
            })

            tmpCenterBar = (
                <div className='d-flex justify-content-center align-items-center' style={{height:'40px'}}>
                    {tmpShortcuts}
                </div>
            )
        }

        if(typeof tmpContent.menu != 'undefined' && Array.isArray(tmpContent.menu))
        {
            tmpRightBar = (
                <NbButton className="btn btn-block menu-button-corporate" style={{
                    height:"40px",
                    background:"transparent",
                    border:"none",
                    borderRadius: '0',
                    padding: '8px'
                }}
                onClick={()=>
                {
                    if(this.state.rightSide)
                    {
                        this.setState({rightSide:false})
                    }
                    else
                    {
                        this.setState({rightSide:true})
                    }                    
                }}>
                    <div className='d-flex align-items-center justify-content-center h-100'>
                        <i className={"fa-solid fa-bars"} style={{
                            color:'#495057',
                            fontSize:'16px'
                        }}></i>
                    </div>
                </NbButton>
            )

            let tmpMenuArr = []
            let tmpKey = 0
            tmpContent?.menu?.map(item =>
            {
                tmpMenuArr.push(
                    <div key={tmpKey} style={{
                        background: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #e9ecef',
                        marginBottom: '8px',
                        transition: 'all 0.2s ease'
                    }}>
                        <a href="#" className="menu-item-corporate" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            color: '#495057',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '8px'
                        }} onClick={item.onClick}>
                            {(()=>
                            {
                                if(typeof item.icon != 'undefined')
                                {
                                    return <FontAwesomeIcon icon={["fa",item.icon]} style={{
                                        marginRight:"12px",
                                        color: '#6c757d',
                                        fontSize: '14px'
                                    }}/>
                                }
                                else
                                {
                                    return
                                }
                            })()}
                            {item.text}
                        </a>
                    </div>
                )
                tmpKey++                                        
            })
            
            tmpSideBar = (
            <div className="d-flex flex-column flex-shrink-0 p-3" style={{
                width: '250px',
                background: '#f8f9fa',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                margin: '8px'
            }}>
                <div style={{
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #dee2e6',
                    textAlign: 'center'
                }}>
                    <h6 style={{
                        color: '#343a40',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0'
                    }}>
                        {this.t("lblMenu")}
                    </h6>
                </div>
                <div className="menu-container-corporate" style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {tmpMenuArr}
                </div>
            </div>)
        }

        const tmpMain = (
            <React.Fragment>
                <div className='col-2'>
                    {tmpLeftBar}
                </div>
                <div className='col-8'>
                    {tmpCenterBar}
                </div>
                <div className='col-2'>
                    {tmpRightBar}
                </div>
            </React.Fragment>);
        
        return(
            <div>
                <div className='pageBar' style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e1e5e9',
                    margin: '4px',
                    padding: '0',
                    overflow: 'hidden'
                }}>
                    <div className='row' style={{margin: '0'}}>
                        {tmpMain}
                    </div>
                </div>
                <div className={'pageBarSide ' + (this.state.rightSide ? 'sideOpen' : 'sideClose')} 
                style={{visibility: this.state.rightSideHidden ? 'hidden' : 'visible'}}
                onAnimationStart={
                (e)=>
                {
                    if(e.animationName == 'animPageBarSideOpen')
                    {
                        this.setState({rightSideHidden:false})
                    }
                }}
                onAnimationEnd={
                (e)=>
                {
                    if(e.animationName == 'animPageBarSideClose')
                    {
                        this.setState({rightSideHidden:true})
                    }
                }}>
                    {tmpSideBar}
                </div>
                
                <style>{`
                    /* Corporate PageBar Styles */
                    .back-button-corporate:hover {
                        background: rgba(73,80,87,0.08) !important;
                        transition: all 0.2s ease;
                    }
                    
                    .shortcut-button-corporate:hover {
                        background: rgba(73,80,87,0.08) !important;
                        transition: all 0.2s ease;
                    }
                    
                    .menu-button-corporate:hover {
                        background: rgba(73,80,87,0.08) !important;
                        transition: all 0.2s ease;
                    }
                    
                    .menu-item-corporate:hover {
                        background: #f8f9fa !important;
                        color: #343a40 !important;
                        text-decoration: none;
                        transform: translateX(2px);
                        transition: all 0.2s ease;
                    }
                    
                    /* Unified bar styling */
                    .pageBar {
                        position: relative;
                    }
                    
                    .pageBar::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 1px;
                        background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
                    }
                `}</style>
            </div>
        )
    }
}