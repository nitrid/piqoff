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
                <NbButton className="btn btn-outline-light d-flex justify-content-start" style={{height:"40px",paddingTop:'10px'}}
                onClick={()=>
                {
                    if(typeof this.props.onBackClick != 'undefined')
                    {
                        this.props.onBackClick()
                    }
                }}>
                    <i className={"bi bi-align-center fa-solid fa-arrow-left fa-lg"} style={{color:'#858585'}}></i>
                </NbButton>
            )
        }
        
        if(tmpContent.isTitle)
        {
            tmpCenterBar = (<h5 className='overflow-hidden d-flex justify-content-center align-items-center' style={{color:'#858585',height:'40px',fontSize:'16px'}}>{this.props.title}</h5>)
        }
        else if(typeof tmpContent.shortcuts != 'undefined' && Array.isArray(tmpContent.shortcuts))
        {
            let tmpShortcuts = []
            let tmpKey = 0
            tmpContent.shortcuts.map((item) =>
            {
                tmpShortcuts.push(
                    <NbButton key={tmpKey} className="btn btn-outline-light d-flex justify-content-center mx-2" style={{height:"40px",paddingTop:'10px'}}
                    onClick={()=>
                    {
                        if(typeof item.onClick != 'undefined')
                        {
                            item.onClick()
                        }
                    }}>
                        <FontAwesomeIcon icon={["fa",item.icon]} size="lg" style={{color:'#858585'}}/>
                    </NbButton>
                )
                tmpKey++
            })

            tmpCenterBar = (<div className='d-flex justify-content-center'>{tmpShortcuts}</div>)
        }

        if(typeof tmpContent.menu != 'undefined' && Array.isArray(tmpContent.menu))
        {
            tmpRightBar = (
                <NbButton className="btn btn-outline-light d-flex justify-content-end" style={{height:"40   px",paddingTop:'10px'}}
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
                    <i className={"bi bi-align-center fa-solid fa-bars-staggered fa-lg"} style={{color:'#858585'}}></i>
                </NbButton>
            )

            let tmpMenuArr = []
            let tmpKey = 0
            tmpContent?.menu?.map(item =>
            {
                tmpMenuArr.push(
                    <li className="nav-item" key={tmpKey}>
                        <a href="#" className="nav-link" aria-current="page" onClick={item.onClick}>
                            {(()=>
                            {
                                if(typeof item.icon != 'undefined')
                                {
                                    return <FontAwesomeIcon icon={["fa",item.icon]} size="lg" style={{paddingRight:"10px"}}/>
                                }
                                else
                                {
                                    return
                                }
                            })()}
                            {item.text}
                        </a>
                    </li>
                )
                tmpKey++                                        
            })
            
            tmpSideBar = (
            <div className="d-flex flex-column flex-shrink-0 p-3" style={{width: '280px'}}>
                <ul className="nav nav-pills flex-column mb-auto">
                    {tmpMenuArr}
                </ul>
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
                <div className='pageBar'>
                    <div className='row'>
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
            </div>
        )
    }
}