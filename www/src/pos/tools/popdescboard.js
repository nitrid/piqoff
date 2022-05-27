import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NdGrid,{Paging,Pager,Column} from "../../core/react/devex/grid.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdPopUp from "../../core/react/devex/popup.js";

export default class NbPopDescboard extends NbBase
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            head:this.props.head,
            title:this.props.title,
            width:this.props.width,
            height:this.props.height,
            position:this.props.position
        }
        this._onClick = this._onClick.bind(this)
    }
    _buttonView1()
    {
        if(typeof this.props.button != 'undefined')
        {
            let tmp = []
            for (let i = 0; i < 4; i++) 
            {
                if(typeof this.props.button[i] != 'undefined')
                {
                    tmp.push (
                        <div className="col-3" key={this.props.button[i].id}>
                            <NbButton id={this.props.button[i].id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this["txt" + this.props.id].value = this.props.button[i].text
                            }}>
                                {this.props.button[i].text}
                            </NbButton>
                        </div>
                    )
                }
            }
            return tmp
        }
    }
    _buttonView2()
    {
        if(typeof this.props.button != 'undefined')
        {
            let tmp = []
            for (let i = 4; i < 8; i++) 
            {
                if(typeof this.props.button[i] != 'undefined')
                {
                    tmp.push (
                        <div className="col-3" key={this.props.button[i].id}>
                            <NbButton id={this.props.button[i].id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this["txt" + this.props.id].value = this.props.button[i].text
                            }}>
                                {this.props.button[i].text}
                            </NbButton>
                        </div>
                    )
                }
            }
            return tmp
        }
    }
    _onClick()
    {
        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(this["txt" + this.props.id].value)
        }
        this[this.props.id].hide()
    }
    async show()
    {
        this["txt" + this.props.id].value = ""
        this[this.props.id].show()
    }
    render()
    {
        return(
            <div>
                <NdPopUp parent={this} id={this.props.id} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.state.head}
                container={this.state.position} 
                width={this.state.width}
                height={this.state.height}
                position={{of:this.state.position}}
                >
                    <div className="row py-1">
                        <div className="col-12">
                            <h6 className="text-primary text-center">{this.state.title}</h6>    
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true}/>       
                        </div>
                    </div>
                    <div className="row py-1">
                        {this._buttonView1()}
                    </div>
                    <div className="row py-1">
                        {this._buttonView2()}
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <NbKeyboard id={"key" + this.props.id} parent={this} textobj={"txt" + this.props.id} span={1} buttonHeight={"40px"}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-6">
                            <NbButton id={"btnCancel" + this.props.id} parent={this} className="form-group btn btn-danger btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this[this.props.id].hide()
                            }}>
                                <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                        <div className="col-6">
                            <NbButton id={"btnOk" + this.props.id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={this._onClick}>
                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                    </div>
                </NdPopUp>
            </div>
        )
    }
}