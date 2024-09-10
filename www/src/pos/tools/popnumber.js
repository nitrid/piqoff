import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NbNumberboard from "../../core/react/bootstrap/numberboard.js";

export default class NbPopNumber extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state.showCloseButton = typeof this.props.showCloseButton == 'undefined' ? true : false
        this.state.content = typeof this.props.content == 'undefined' ? '' : this.props.content
    }
    async show(pTitle,pValue,pShowCloseButton,pContent)
    {
        if(typeof pContent != 'undefined')
        {
            this.setState({content:pContent})
        }
        else
        {
            this.setState({content:''})
        }
        
        this[this.props.id].setTitle(typeof pTitle == 'undefined' ? '' : pTitle);
        this["txt" + this.props.id].value = typeof pValue == 'undefined' ? 0 : pValue
        this["txt" + this.props.id].newStart = true;
        this[this.props.id].setState({showCloseButton: typeof pShowCloseButton == 'undefined' ? true : pShowCloseButton})
        this[this.props.id].show();
        return new Promise(async resolve => 
        {
            this._onClick = function(e)
            {
                if(e == 'click')
                {
                    this[this.props.id].hide();
                    resolve(this["txt" + this.props.id].value)
                }
                else
                {
                    resolve()
                }
            }
        });
    }
    render()
    {
        return(
            <div>
                <NdPopUp parent={this} id={this.props.id} 
                visible={false}                        
                showCloseButton={this.state.showCloseButton}
                showTitle={true}
                title={""}
                container={"#root"} 
                width={"300"}
                height={"495"}
                onHiding={()=> {this._onClick('close')}}
                position={{of:"#root"}}
                >
                    <div className="row pt-1" style={{display:'list-item'}}>
                        <div className="col-12" style={{overflow:'hidden',whiteSpace:'nowrap',fontWeight:600,color:'#198754'}}>
                            {this.state.content}
                        </div>
                    </div> 
                    {/* txt */}
                    <div className="row pt-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true}>     
                            </NdTextBox> 
                        </div>
                    </div> 
                    <div className="row pt-2">
                        {/* num */}
                        <div className="col-12">
                            <NbNumberboard id={"num" + this.props.id} parent={this} textobj={"txt" + this.props.id} span={1} buttonHeight={"60px"}/>
                        </div>
                    </div>
                    {/* btn */}
                    <div className="row pt-2">
                        <div className="col-12">
                            <NbButton id={"btn" + this.props.id} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                            onClick={()=>{this._onClick('click')}}>
                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )
    }
}