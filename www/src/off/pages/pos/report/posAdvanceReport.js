import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label,EmptyItem } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class enddayReport extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        
        this.core = App.instance.core;
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
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
         
    }
    async _btnGetClick()
    {
        if(this.cmbDevice.value == '')
        {
            let tmpConfObj =
            {
              id:'msgDeviceSelect',showTitle:true,title:this.t("msgDeviceSelect.title"),showCloseButton:true,width:'500px',height:'200px',
              button:[{id:"btn01",caption:this.t("msgDeviceSelect.btn01"),location:'before'}],
              content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDeviceSelect.msg")}</div>)
            }
            
            await dialog(tmpConfObj);
            return
        }
        console.log(this.dtFirst.value)
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT * FROM DOC_CUSTOMER_VW_01 WHERE REF= 'POS' AND PAY_TYPE =20 AND ((INPUT_CODE = @INPUT_CODE) OR (@INPUT_CODE = '')) AND ((CONVERT(NVARCHAR,CDATE,112) >= @START_DATE) OR (@START_DATE = '19700101')) " +
                            "AND ((CONVERT(NVARCHAR,CDATE,112) <= @FINISH_DATE) OR (@FINISH_DATE = '19700101')) ORDER BY CDATE DESC",
                    param : ['INPUT_CODE:string|50','START_DATE:date','FINISH_DATE:date'],
                    value : [this.cmbDevice.value,this.dtFirst.value,this.dtLast.value]
                },
                sql : this.core.sql
            }
        }
        App.instance.setState({isExecute:true})
        await this.grdAdvanceData.dataRefresh(tmpSource)
        App.instance.setState({isExecute:false})

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
                            <Form colCount={3} id="frmCriter">
                            {/* cmbDevice */}
                            <Item>
                                <Label text={this.t("cmbDevice")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbDevice"
                                displayExpr="DISPLAY"                       
                                valueExpr="CODE"
                                showClearButton={true}
                                notRefresh={true}
                                data={{source:{select:{query:"SELECT CODE + '-' + NAME AS DISPLAY,CODE,NAME FROM SAFE_VW_01 WHERE TYPE = 2 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                param={this.param.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                access={this.access.filter({ELEMENT:'cmbDevice',USERS:this.user.CODE})}
                                />
                            </Item>
                            {/* dtFirst */}
                            <Item>
                                <Label text={this.t("dtFirst")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtFirst"}
                                >
                                </NdDatePicker>
                            </Item>
                            {/* dtLast */}
                            <Item>
                                <Label text={this.t("dtLast")} alignment="right" />
                                <NdDatePicker simple={true}  parent={this} id={"dtLast"}
                                >
                                </NdDatePicker>
                            </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            
                        </div>
                        <div className="col-3">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this._btnGetClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdAdvanceData" parent={this} 
                            selection={{mode:"single"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={20} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Export fileName={this.lang.t("menu.pos_02_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="CDATE_FORMAT" caption={this.t("grdAdvanceData.clmDate")} visible={true}/> 
                                <Column dataField="CUSER_NAME" caption={this.t("grdAdvanceData.clmUser")} visible={true}/> 
                                <Column dataField="INPUT_NAME" caption={this.t("grdAdvanceData.clmSafe")} visible={true} /> 
                                <Column dataField="AMOUNT" caption={this.t("grdAdvanceData.clmCash")} visible={true} /> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}