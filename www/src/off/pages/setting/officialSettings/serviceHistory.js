import React from 'react';
import App from '../../../lib/app.js';
import { supportCls } from '../../../../core/cls/company.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,} from 'devextreme-react/form';

import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Paging,Pager} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import HTMLReactParser from 'html-react-parser';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class rebateOperation extends React.PureComponent
{
    constructor(props)
    {

        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.supportObj = new supportCls()       

        this.serviceGuid = '00000000-0000-0000-0000-000000000000'
        this.serviceHtml = ''

    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }
    async Init()
    {
        await this.supportObj.load({GUID:'00000000-0000-0000-0000-000000000000'})
        await this.grdServiceList.dataRefresh({source:this.supportObj.dt('SUPPORT_DETAIL')});
    }
    render()
    {
        
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                            <Item location="after"
                                locateInMenu="auto"
                                widget="dxButton"
                                options=
                                {
                                    {
                                        type: 'default',
                                        icon: 'clear',
                                        onClick: async () => 
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.lang.t("btnYes"),location:'before'},{id:"btn02",caption:this.lang.t("btnNo"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgClose")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                App.instance.panel.closePage()
                                            }
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <NdGrid id="grdServiceList" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            loadPanel={{enabled:true}}
                            allowColumnResizing={true}
                            height={'700px'}
                            width={'100%'}
                            onRowDblClick={async(e)=>
                                {
                                   this.setState({html:e.data.HTML})

                                   this.txtPopDate.value = e.data.CDATE
                                   this.txtPopUser.value = e.data.CUSER_NAME
                                   this.txtPopSubject.value = e.data.SUBJECT
                                   this.txtPopProcess.value = e.data.PROCESS

                                   this.serviceGuid = e.data.GUID
                                   this.serviceHtml = e.data.HTML

                                   setTimeout(() => {this.popService.show() }, 500);
                                }}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="CDATE" caption={this.t("grdServiceList.clmDate")} visible={true} dataType="date" 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>
                                <Column dataField="CUSER_NAME" caption={this.t("grdServiceList.clmUser")} visible={true} width={300}/> 
                                <Column dataField="SUBJECT" caption={this.t("grdServiceList.clmSubject")} visible={true}/> 
                                <Column dataField="PROCESS" caption={this.t("grdServiceList.clmProcess")} visible={true}/> 
                            </NdGrid>
                        </div>
                    </div>
                    {/* Detay Popup */}
                    <div>
                        <NdPopUp parent={this} id={"popService"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popService.title")}
                        container={"#root"} 
                        width={'800'}
                        height={'600'}
                        position={{of:'#root'}}
                        >
                        <Form colCount={2}>
                            <Item>
                                <Label text={this.t("txtPopDate")} alignment="right" />
                                <NdTextBox id="txtPopDate" parent={this} simple={true} readOnly={true} maxLength={32} />
                            </Item>
                            <Item>
                                <Label text={this.t("txtPopUser")} alignment="right" />
                                <NdTextBox id="txtPopUser" parent={this} simple={true} readOnly={true}  maxLength={32} />
                            </Item>
                            <Item colSpan={2}>
                                <Label text={this.t("txtPopSubject")} alignment="right" />
                                <NdTextBox id="txtPopSubject" parent={this} simple={true} readOnly={true}  maxLength={32} />
                            </Item>
                            <Item>
                            {HTMLReactParser(this.serviceHtml)}
                            </Item>
                        </Form>
                        <Form colCount={2}>
                            <Item colSpan={2}>
                                <Label text={this.t("txtPopProcess")} alignment="right" />
                                <NdTextBox id="txtPopProcess" parent={this} simple={true} maxLength={100} />
                            </Item>
                            <Item>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnApprove")} type="normal" stylingMode="contained" width={'100%'} 
                                        onClick={async ()=>
                                        {       
                                            this.supportObj.dt().where({'GUID':this.serviceGuid})[0].PROCESS = this.txtPopProcess.value
                                            this.supportObj.save()
                                            this.popService.hide();  
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>  { this.popService.hide()  }}/>
                                    </div>
                                </div>
                            </Item>
                        </Form>
                        </NdPopUp>
                    </div>  
                </ScrollView>
            </div>
        )
    }
}