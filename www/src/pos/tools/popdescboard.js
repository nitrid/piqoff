import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NdDialog,{dialog} from "../../core/react/devex/dialog.js";

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
            position:this.props.position,
            buttons:typeof this.props.param != 'undefined' && typeof this.props.param.getValue().buttons ? this.props.param.getValue().buttons : [],
            disable:typeof this.props.param != 'undefined' && typeof this.props.param.getValue().disable != 'undefined' ? this.props.param.getValue().disable : false,
            minCharSize:typeof this.props.param != 'undefined' && typeof this.props.param.getValue().minCharSize != 'undefined' ? this.props.param.getValue().minCharSize : 25
        }
        this._onClick = this._onClick.bind(this)
    }
    _buttonView1()
    {
        if(typeof this.state.buttons != 'undefined')
        {
            let tmp = []
            for (let i = 0; i < 4; i++) 
            {
                if(typeof this.state.buttons[i] != 'undefined')
                {
                    tmp.push (
                        <div className="col-3" key={this.state.buttons[i].id}>
                            <NbButton id={this.state.buttons[i].id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this["txt" + this.props.id].value = this.state.buttons[i].text
                            }}>
                                {this.state.buttons[i].title}
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
        if(typeof this.state.buttons != 'undefined')
        {
            let tmp = []
            for (let i = 4; i < 8; i++) 
            {
                if(typeof this.state.buttons[i] != 'undefined')
                {
                    tmp.push (
                        <div className="col-3" key={this.state.buttons[i].id}>
                            <NbButton id={this.state.buttons[i].id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this["txt" + this.props.id].value = this.state.buttons[i].text
                            }}>
                                {this.state.buttons[i].title}
                            </NbButton>
                        </div>
                    )
                }
            }
            return tmp
        }
    }
    _buttonView3()
    {
        if(typeof this.state.buttons != 'undefined')
        {
            let tmp = []
            for (let i = 8; i < 12; i++) 
            {
                if(typeof this.state.buttons[i] != 'undefined')
                {
                    tmp.push (
                        <div className="col-3" key={this.state.buttons[i].id}>
                            <NbButton id={this.state.buttons[i].id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                this["txt" + this.props.id].value = this.state.buttons[i].text
                            }}>
                                {this.state.buttons[i].title}
                            </NbButton>
                        </div>
                    )
                }
            }
            return tmp
        }
    }
    async _onClick()
    {       
        if(this["txt" + this.props.id].value == '')
        {
            let tmpConfObj =
            {
                id:'popDescbordValidation',showTitle:true,title:this.lang.t("popDescbordValidation.title"),showCloseButton:true,width:'500px',height:'250px',
                button:[{id:"btn01",caption:this.lang.t("popDescbordValidation.btn01"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDescbordValidation.msg")}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }
        if(this["txt" + this.props.id].value.length < this.state.minCharSize)
        {
            let tmpConfObj =
            {
                id:'popDescbordValidation2',showTitle:true,title:this.lang.t("popDescbordValidation2.title"),showCloseButton:true,width:'500px',height:'auto',
                button:[{id:"btn01",caption:this.lang.t("popDescbordValidation2.title"),location:'before'}],
                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("popDescbordValidation2.msg1") + this.state.minCharSize + this.lang.t("popDescbordValidation2.msg2")}</div>)
            }
            await dialog(tmpConfObj);
            return;
        }

        if(typeof this.props.onClick != 'undefined')
        {
            this.props.onClick(this["txt" + this.props.id].value)
        }
        this[this.props.id].hide()

        if(typeof this.awaitClick != 'undefined')
        {
            this.awaitClick(true)
        }
    }
    async show()
    {
        //EĞER PARAMETEREDEN DISABLE AKTİF İSE AÇIKLAMA EKRANI ÇIKMIYOR
        if(this.state.disable)
        {
            if(typeof this.props.onClick != 'undefined')
            {
                this.props.onClick()
            }
            this[this.props.id].hide()
            return "Description disabled from parameter"
        }

        await this[this.props.id].show()
        this["txt" + this.props.id].value = ""

        if(typeof this.props.onClick == 'undefined')
        {
            return new Promise(async resolve => 
            {
                this.awaitClick = (e) =>
                {
                    if(e)
                    {
                        resolve(this["txt" + this.props.id].value)
                        return
                    }
                    else
                    {
                        resolve()
                        return
                    }
                }
            });
        }
    }
    setText(e)
    {
        this["txt" + this.props.id].value = e
    }
    setParam(e)
    {
        this.setState({disable:e.disable,minCharSize:e.minCharSize,buttons:e.buttons})
    }
    render()
    {
        return(
            <div>
                <NdPopUp parent={this} id={this.props.id} 
                visible={false}                        
                showCloseButton={false}
                showTitle={true}
                title={this.state.head}
                container={this.state.position} 
                width={this.state.width}
                height={this.state.height}
                position={{of:this.state.position}}
                deferRendering={true}
                >
                    <div className="row py-1">
                        <div className="col-12">
                            <h6 className="text-primary text-center">{this.state.title}</h6>    
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true} onValueChanging={(e)=>{this["key" + this.props.id].setInput(e)}}/>       
                        </div>
                    </div>
                    <div className="row py-1">
                        {this._buttonView1()}
                    </div>
                    <div className="row py-1">
                        {this._buttonView2()}
                    </div>
                    <div className="row py-1">
                        {this._buttonView3()}
                    </div>
                    <div className="row py-1">
                        <div className="col-12">
                            <NbKeyboard id={"key" + this.props.id} parent={this} inputName={"txt" + this.props.id}/>
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-6">
                            <NbButton id={"btnCancel" + this.props.id} parent={this} className="form-group btn btn-danger btn-block" style={{height:"55px",width:"100%"}}
                            onClick={()=>
                            {
                                if(typeof this.awaitClick != 'undefined')
                                {
                                    this.awaitClick(false)
                                }
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