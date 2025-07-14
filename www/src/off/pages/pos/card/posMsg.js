import React from 'react';
import App from '../../../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox';
import NdTextArea from '../../../../core/react/devex/textarea';
import NdButton from '../../../../core/react/devex/button';
import NdListBox from '../../../../core/react/devex/listbox';
import { dialog } from "../../../../core/react/devex/dialog.js";
export default class posDeviceCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.tabIndex = props.data.tabkey
        this.deviceData = []
        
        this.state = 
        {
            deviceSelectValue : []
        }

        this.contentRender = this.contentRender.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        let tmpQuery = 
        {
            query : "SELECT CODE,NAME FROM POS_DEVICE_VW_01 ORDER BY CODE ASC"
        }

        let tmpResult = await this.core.sql.execute(tmpQuery)
        
        if(typeof tmpResult.result.err == 'undefined' && tmpResult.result.recordset.length > 0)
        {
            this.deviceData = tmpResult.result.recordset
        }
    }
    contentRender()
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.setState(
                    {
                        deviceSelectValue : e.value
                    }
                )
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.deviceData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.deviceSelectValue}
            onOptionChanged={onOptionChanged}
            >
            </NdListBox>
        )
    }
    render()
    {
        return (
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className='col-2'>
                            <label className="col-form-label d-flex justify-content-end">{this.t("cmbDevice") + " :"}</label>
                        </div>
                        <div className="col-10">
                            <NdDropDownBox parent={this} id="cmbDevice" tabIndex={this.tabIndex} simple={true}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.deviceData}}
                            contentRender={this.contentRender}
                            />    
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className='col-2'>
                            <label className="col-form-label d-flex justify-content-end">{this.t("txtMsg") + " :"}</label>
                        </div>
                        <div className="col-10">
                            <NdTextArea parent={this} id="txtMsg" tabIndex={this.tabIndex} simple={true} height={100}/>    
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className='col-12'>
                            <NdButton  id={"btnSend"} text={this.t('btnSend')} width={'100%'} type={"default"}
                            onClick={async()=>
                            {
                                let tmpData = 
                                {
                                    tag : "msgPosDevice",
                                    devices : this.state.deviceSelectValue,
                                    msg : this.txtMsg.value
                                }
                                this.core.socket.emit('msgService',tmpData)

                                let tmpConfObj =
                                {
                                    id:'msgResult',showTitle:true,title:this.t("msgResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                    button:[{id:"btn01",caption:this.t("msgResult.btn01"),location:'before'}],
                                    content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgResult.msg")}</div>)
                                }
                                
                                await dialog(tmpConfObj);
                            }}
                            >
                            </NdButton>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}