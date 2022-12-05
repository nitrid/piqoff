import React from 'react';
import App from '../../../lib/app.js';
import { docCls,docItemsCls, docCustomerCls } from '../../../../core/cls/doc.js';
import { supportCls } from '../../../../core/cls/company.js';
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import ContextMenu from 'devextreme-react/context-menu';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Pager,KeyboardNavigation} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import tr from '../../../meta/lang/devexpress/tr.js';

export default class rebateOperation extends React.PureComponent
{
    constructor(props)
    {

        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
        this.supportObj = new supportCls()       
        this.state = 
        {
            html:"",
        },
        this.serviceGuid = '00000000-0000-0000-0000-000000000000'

    }
    componentDidMount()
    {
        setTimeout(async () => 
        {
            this.Init()
        }, 1000);
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
                <div className="row px-2 pt-2">
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'200px',
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
                    <div className="row px-2 pt-2">
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
                            onRowDblClick={async(e)=>
                                {
                                   this.setState({html:e.data.HTML})
                                   this.txtPopDate.value = e.data.CDATE
                                   this.txtPopUser.value = e.data.CUSER_NAME
                                   this.txtPopSubject.value = e.data.SUBJECT
                                   this.txtPopProcess.value = e.data.PROCESS
                                   this.serviceGuid = e.data.GUID
                                   setTimeout(() => {
                                    this.popService.show()                                   
                                   }, 500);
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
                        <NdTextBox id="txtPopDate" parent={this} simple={true} readOnly={true} 
                        maxLength={32}
                    
                        ></NdTextBox>
                        </Item>
                        <Item>
                        <Label text={this.t("txtPopUser")} alignment="right" />
                        <NdTextBox id="txtPopUser" parent={this} simple={true} readOnly={true} 
                        maxLength={32}
                    
                        ></NdTextBox>
                        </Item>
                        <Item colSpan={2}>
                            <Label text={this.t("txtPopSubject")} alignment="right" />
                            <NdTextBox id="txtPopSubject" parent={this} simple={true} readOnly={true} 
                            maxLength={32}
                        
                            ></NdTextBox>
                        </Item>
                    </Form>
                    <Form colCount={2}>
                        <Item colSpan={2}>
                            <Label text={this.t("txtPopProcess")} alignment="right" />
                            <NdTextBox id="txtPopProcess" parent={this} simple={true} 
                            maxLength={100}
                            ></NdTextBox>
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
                                    onClick={()=>
                                    {
                                        this.popService.hide();  
                                    }}/>
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