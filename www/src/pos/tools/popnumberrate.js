import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NbNumberboard from "../../core/react/bootstrap/numberboard.js";

export default class NbPopNumberRate extends NbBase
{
    constructor(props)
    {
        super(props)
    }
    async show(pTitle,pValue)
    {
        this[this.props.id].setTitle(typeof pTitle == 'undefined' ? '' : pTitle);
        this["txt" + this.props.id].value = typeof pValue == 'undefined' ? 0 : pValue
        this["txt" + this.props.id].newStart = true;
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
                showCloseButton={true}
                showTitle={true}
                title={""}
                container={"#root"} 
                width={"400"}
                height={"475"}
                onHiding={()=> {this._onClick('close')}}
                position={{of:"#root"}}
                >
                    {/* txt */}
                    <div className="row pt-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true} />     
                        </div>
                    </div> 
                    <div className="row pt-2">
                        <div className="col-9">
                            {/* num */}
                            <div className="row">
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
                        </div>
                        <div className="col-3">
                            {/* btnPopDiscount10 */}
                            <div className="row pb-1">
                                <div className="col-12 ps-1">
                                    <NbButton id={"btnPopDiscount10"} parent={this} className="form-group btn btn-primary btn-block" 
                                    onClick={()=>{this["txt" + this.props.id].value = 10}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                    % 10
                                    </NbButton>
                                </div>
                            </div>
                            {/* btnPopDiscount20 */}
                            <div className="row py-1">
                                <div className="col-12 ps-1">
                                    <NbButton id={"btnPopDiscount20"} parent={this} className="form-group btn btn-primary btn-block" 
                                    onClick={()=>{this["txt" + this.props.id].value = 20}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                    % 20
                                    </NbButton>
                                </div>
                            </div>
                            {/* btnPopDiscount30 */}
                            <div className="row py-1">
                                <div className="col-12 ps-1">
                                    <NbButton id={"btnPopDiscount30"} parent={this} className="form-group btn btn-primary btn-block" 
                                    onClick={()=>{this["txt" + this.props.id].value = 30}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                    % 30
                                    </NbButton>
                                </div>
                            </div>
                            {/* btnPopDiscount40 */}
                            <div className="row py-1">
                                <div className="col-12 ps-1">
                                    <NbButton id={"btnPopDiscount40"} parent={this} className="form-group btn btn-primary btn-block" 
                                    onClick={()=>{this["txt" + this.props.id].value = 40}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                    % 40
                                    </NbButton>
                                </div>
                            </div>
                            {/* btnPopDiscount50 */}
                            <div className="row py-1">
                                <div className="col-12 ps-1">
                                    <NbButton id={"btnPopDiscount50"} parent={this} className="form-group btn btn-primary btn-block" 
                                    onClick={()=>{this["txt" + this.props.id].value = 50}} style={{height:"60px",width:"100%",fontSize: "20px"}}>
                                    % 50
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )
    }
}