import React from 'react';
import ReactDOM from 'react-dom';
import NdBase from './base.js';
import NbButton from '../bootstrap/button.js';
import NdPopUp from './popup.js';
import NdTextBox from './textbox.js';
import NbNumberboard from '../bootstrap/numberboard.js';
import { dialog } from './dialog.js';

export default class NdAcsDialog extends NdBase
{
    constructor(props)
    {
        super(props);
        this.state.title = this.props.title;
        this.core = this.props.parent.core;
        this.user = this.props.parent.user;
    }
    show(pType)
    {
        let tmpQuery = ""
        this[this.props.id].show();        
        this[this.props.id].setTitle(pType == 0 ? "Yetkili şifresini giriniz !" : "Şifrenizi giriniz !")
        
        return new Promise(async resolve => 
        {
            this._onClick = async () =>
            {
                if(pType == 0)
                {
                    tmpQuery = 
                    {
                        query : "SELECT TOP 1 * FROM USERS WHERE PWD = @PWD AND ROLE = 'Administrator'", 
                        param : ['PWD:string|50'],
                        value : [btoa(this["txt" + this.props.id].value)]
                    }
                }
                else
                {
                    tmpQuery = 
                    {
                        query : "SELECT TOP 1 * FROM USERS WHERE CODE = @CODE AND PWD = @PWD", 
                        param : ['CODE:string|25','PWD:string|50'],
                        value : [this.user.CODE,btoa(this["txt" + this.props.id].value)]
                    }
                }
                
                let tmpData = await this.core.sql.execute(tmpQuery)
                
                if(tmpData.result.recordset.length > 0)
                {
                    this[this.props.id].hide()
                    resolve(true)
                }
                else
                {
                    let tmpConfObj =
                    {
                        id:'msgAlert',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                        button:[{id:"btn01",caption:"Tamam",location:'before'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Geçersiz şifre !"}</div>)
                    }
                    await dialog(tmpConfObj);
                    this[this.props.id].hide()
                    resolve(false)
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
                showCloseButton={false}
                showTitle={true}
                title={this.state.title}
                container={"#root"} 
                width={"300"}
                height={"550"}
                position={{of:"#root"}}
                >
                    <div className="row pt-1">
                        <div className="col-12">
                            <NdTextBox id={"txt" + this.props.id} parent={this} simple={true} mode={"password"}/>                                  
                        </div>
                    </div> 
                    <div className="row pt-2">
                        {/* Number Board */}
                        <div className="col-12">
                            <NbNumberboard id={"num" + this.props.id} parent={this} textobj={"txt" + this.props.id} span={1} buttonHeight={"60px"}/>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col-6">
                            <NbButton id={"btn" + this.props.id} parent={this} className="form-group btn btn-danger btn-block" style={{height:"60px",width:"100%"}}
                            onClick={()=>{this[this.props.id].hide()}}>
                                <i className="text-white fa-solid fa-xmark" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                        <div className="col-6">
                            <NbButton id={"btn" + this.props.id} parent={this} className="form-group btn btn-success btn-block" style={{height:"60px",width:"100%"}}
                            onClick={()=>{this._onClick()}}>
                                <i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} />
                            </NbButton>
                        </div>
                    </div>
                    <div className="row pt-2">
                            <div className="col-12">
                                <NbButton id={"btnCard" + this.props.id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%"}}>
                                    <i className="text-white fa-solid fa-id-card" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                </NdPopUp>
            </div>
        )
    }
}
export const acsDialog = function()
{            
    return new Promise(async resolve => 
    {
        if(arguments.length == 0)
        {
            resolve();
        }

        let tmpObj = React.createRef();
        let tmpJsx = 
        (
            <NdAcsDialog ref={tmpObj} id={arguments[0].id} parent={arguments[0].parent} />
        )
        
        ReactDOM.render(tmpJsx,document.body.appendChild(document.createElement('div',{id:'acsdialog'})));
        resolve(await tmpObj.current.show(arguments[0].type))
    });
}