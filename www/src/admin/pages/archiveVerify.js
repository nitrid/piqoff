import React from 'react';
import App from '../lib/app.js';
import NdDialog,{ dialog } from '../../core/react/devex/dialog.js';

export default class deviceChoose extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.core = App.instance.core;

        this.state = 
        {
            txtSign : "",
            fileBinary : undefined
        }
    }
    render()
    {
        return(
            <div className='row p-3'>
                <div className='col-12'>
                    <div className='row'>
                        <div className='col-auto'>
                            <input className="form-control" type="file" id="formFileMultiple" multiple onChange={async(e)=>
                            {
                                let tmpTxtSign = ""
                                let tmpBinary = undefined
     
                                for (let i = 0; i < e.target.files.length; i++) 
                                {
                                    if(e.target.files[i].type == 'text/plain')
                                    {
                                        tmpTxtSign = await e.target.files[i].text()
                                        tmpTxtSign = tmpTxtSign.substring(tmpTxtSign.indexOf('-') + 2,tmpTxtSign.length)
                                        console.log(tmpTxtSign)
                                    }
                                    else if(e.target.files[i].type == 'application/x-zip-compressed')
                                    {
                                        tmpBinary = await e.target.files[i].arrayBuffer()
                                    }
                                }

                                this.setState({txtSign:tmpTxtSign,fileBinary:tmpBinary})
                            }}/>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary" style={{lineHeight:1.3}} onClick={async()=>
                            {
                                this.core.socket.emit('nf525ArchiveFileVerify',{sign:this.state.txtSign,buffer:this.state.fileBinary},async(pResult)=>
                                {
                                    let tmpConfObj =
                                    {
                                        id:'msgVerify',showTitle:true,title:this.t("msgVerify.title"),showCloseButton:true,width:'500px',height:'auto',
                                        button:[{id:"btn01",caption:this.t("msgVerify.btn01"),location:'after'}],
                                    }

                                    if(pResult)
                                    {
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVerify.msgSuccess")}</div>)
                                    }
                                    else
                                    {
                                        tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgVerify.msgFailed")}</div>)
                                    }

                                    await dialog(tmpConfObj);
                                })
                            }}>Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}