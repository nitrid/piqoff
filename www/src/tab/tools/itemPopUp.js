import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbPopUp from '../../core/react/bootstrap/popup';
import NbButton from '../../core/react/bootstrap/button';
import Toolbar,{Item} from 'devextreme-react/toolbar';

export default class NbItemPopUp extends NbBase
{
    constructor(props)
    {
        super(props)

        this.state =
        {
            items : []
        }
    }
    open()
    {
        this.popCard.show();
    }
    render()
    {
        return(
            <React.Fragment>
            <NbPopUp id={"popCard"} parent={this} title={""} fullscreen={true}>
                <div>
                    <div className='row' style={{paddingTop:"10px"}}>
                        <div className='col-12' align={"right"}>
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                    onClick={()=>
                                    {
                                        this.popCard.hide();
                                    }}>
                                        <i className="fa-solid fa-xmark fa-1x"></i>
                                    </NbButton>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className='row pt-2'>
                        <div className='col-12'>
                            
                        </div>
                    </div>
                </div>
            </NbPopUp>
            </React.Fragment>
        )
    }
}