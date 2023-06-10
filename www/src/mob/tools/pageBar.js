import React from 'react';
import NbButton from '../../core/react/bootstrap/button';
import NbBase from '../../core/react/bootstrap/base';

export class PageBar extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            isBack : false,
            isTitle : false,
            title : ""
        }
    }
    build()
    {
        this
    }
    sector1()
    {

    }
    render()
    {
        const tmpSector1 = (
        <div className='col-2'>
            <div className='btn btn-outline-light d-flex justify-content-start pt-2'>
                <i className={"bi bi-align-center fa-solid " + "fa-bars-staggered" + " fa-lg"} style={{color:'#858585'}}></i>
            </div>
        </div>)

        const tmpMain = (
            <React.Fragment>
                <div className='col-2'>
                    {/* <div className='btn btn-outline-light d-flex justify-content-start pt-2'>
                        <i className={"bi bi-align-center fa-solid " + "fa-bars-staggered" + " fa-lg"} style={{color:'#858585'}}></i>
                    </div> */}
                </div>
                <div className='col-8'>
                    <h5 className='overflow-hidden d-flex justify-content-center align-items-center' style={{color:'#858585',height:'40px',fontSize:'16px'}}>Alış Siparişi</h5>
                </div>
                <div className='col-2'>
                    <div className='btn btn-outline-light d-flex justify-content-end pt-2'>
                        <i className={"bi bi-align-center fa-solid " + "fa-bars-staggered" + " fa-lg"} style={{color:'#858585'}}></i>
                    </div>
                </div>
            </React.Fragment>);
        
        return(
            <div style={{height:'45px',backgroundColor:'white',position:'fixed',width:'100%',zIndex:'1000',borderBottom:'2px solid #dcdde1'}}>
                <div className='row'>
                    {tmpMain}
                </div>
            </div>
        )
    }
}