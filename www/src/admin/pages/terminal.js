import React from 'react';
import TextArea from 'devextreme-react/text-area';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import App from '../lib/app.js';

export default class Terminal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.style = 
        {
            div:
            {
                height:'100%'
            }
        }
        this.state = 
        {
            console: '',
            command: ''
        }
        this.sendClick = this.sendClick.bind(this)
        this.commandValueChanged = this.commandValueChanged.bind(this)
        this.commandEnterKey = this.commandEnterKey.bind(this)

        this.core = App.instance.core;
        this.core.socket.on('terminal',(pData) =>
        {
            this.setState(
                {
                    console : this.state.console + pData + '\n'
                }
            )
        })
    }
    sendClick(e) 
    {
        this.core.socket.emit('terminal',this.state.command); 

        this.setState(
            {
                console : this.state.console + this.state.command + '\n',
                command : ''
            }
        )        
    }
    commandValueChanged(e) 
    {        
        this.setState(
        {
            command: e.value
        });
    }
    commandEnterKey(e)
    {
        this.sendClick();
    }
    render()
    {
        return(
                <div className="row px-3 py-2" style={this.style.div}>
                    <div className="col-12" style={{height:'90%'}}>
                        <div className="row" style={this.style.div}>
                            <div className="col-12">
                                <TextArea
                                    height={'100%'}
                                    defaultValue={''} readOnly={true} value={this.state.console}/>
                            </div>
                        </div>
                        <div className="row pt-2">
                            <div className="col-11">
                                <TextBox defaultValue="" height={'fit-content'} value={this.state.command} 
                                    valueChangeEvent="keyup" onValueChanged={this.commandValueChanged}
                                    onEnterKey={this.commandEnterKey} />
                            </div>
                            <div className="col-1">
                                <Button
                                    width={'100%'}
                                    height={34}
                                    text="Send"
                                    type="success"
                                    stylingMode="contained"
                                    onClick={this.sendClick}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            
        )
    }
}