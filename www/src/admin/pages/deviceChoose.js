import React from 'react';
import TextArea from 'devextreme-react/text-area';
import TextBox from 'devextreme-react/text-box';
import NdSelectBox from '../../core/react/devex/selectbox.js';
import Button from 'devextreme-react/button';
import App from '../lib/app.js';
export default class deviceChoose extends React.Component
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
            command: '',
            txtData: '',
            path : ''
        }

        this.core = App.instance.core;
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        
        console.log(this.state.txtData)

        setInterval(()=>
        {
            this.readFile()
        },5000)
    }
    async readFile()
    {
        if(this.state.path != "")
        {
            this.setState({txtData : await this.core.util.readFile("./www/log/pos_" + this.state.path + ".txt")})
        }
        return
    }
    render()
    {
        return(
            <div className="row px-3 py-2" style={this.style.div}>
                <div className="col-12" style={{height:'90%'}}>
                    <div className="row pt-2">
                        <div className="col-12">
                            <NdSelectBox simple={true} parent={this} id="cmbApp"
                            displayExpr="NAME"
                            valueExpr="CODE"
                            value=""
                            searchEnabled={true}
                            showClearButton={true}
                            pageSize ={50}
                            notRefresh={true}
                            data={{
                                source:
                                {
                                    select:
                                    {
                                        query : `select CODE,NAME from POS_DEVICE ORDER BY CODE ASC`
                                    }
                                    ,sql:this.core.sql
                                }
                            }}
                            onValueChanged={(async(e)=>
                            {
                                console.log(e)
                                this.setState({path: e.value})
                                this.readFile()
                            }).bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row" style={this.style.div}>
                        <div className="col-12">
                            <TextArea
                            height={'100%'}
                            defaultValue={''} readOnly={true} value={this.state.txtData}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}