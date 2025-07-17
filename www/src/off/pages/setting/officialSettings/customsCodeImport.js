import React from 'react';
import App from '../../../lib/app.js';
import { transportTypeCls} from '../../../../core/cls/doc.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import * as xlsx from 'xlsx'

import NdTextBox, { Validator, RequiredRule} from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import {Column} from '../../../../core/react/devex/grid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';
import {NdForm,NdItem,NdLabel, NdEmptyItem} from '../../../../core/react/devex/form.js';
import {NdToast} from '../../../../core/react/devex/toast.js';

export default class customsCodeImport extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.transportObj = new transportTypeCls();

        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.customsData = new datatable
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
       this.txtPopMulticode.value = "MULTICODE",
       this.txtPopCustoms.value = "CUSTOMS",
       this.txtPopOrigin.value = "ORIGIN",
       this.customerGuid = ''
    }
    async excelAdd(pData)
    {
        this.customsData.insertCmd = 
        {
            query : `EXEC [dbo].[PRD_ITEMS_CUSTOMS_DATA_INSERT] 
                    @MULTICODE = @PMULTICODE, 
                    @NAME = @PNAME, 
                    @CUSTOMS = @PCUSTOMS, 
                    @ORIGIN = @PORIGIN, 
                    @CUSTOMER = @PCUSTOMER `, 
            param : ['PMULTICODE:string|50','PNAME:string|max','PCUSTOMS:string|50','PORIGIN:string|50','PCUSTOMER:string|50'],
            dataprm : ['MULTICODE','NAME','CUSTOMS','ORIGIN','CUSTOMER','CUSTOMER']
        } 
        App.instance.setState({isExecute:true})

        for (let i = 0; i < pData.length; i++) 
        {
            pData[i].CUSTOMER = this.customerGuid
            this.customsData.push(pData[i])
        }

        await this.customsData.update()

        App.instance.setState({isExecute:false})

        this.customsData.clear()

        this.toast.show({message:this.t("msgSucces.msg"),type:"success"});

    }
    render()
    {
        return(
            <div id = {this.props.data.id + this.tabIndex}>
                <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
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
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmCustoms">
                                   {/* txtCustomerCode */}
                                   <NdItem>
                                    <NdLabel text={this.t("txtCustomerCode")} alignment="right" />
                                    <NdTextBox id="txtCustomerCode" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    onEnterKey={(async()=>
                                        {
                                            await this.pg_txtCustomerCode.setVal(this.txtCustomerCode.value)
                                            this.pg_txtCustomerCode.show()
                                            this.pg_txtCustomerCode.onClick = async(data) =>
                                            {
                                                if(data.length > 0)
                                                {
                                                    this.customerGuid = data[0].GUID
                                                    this.txtCustomerCode.value = data[0].CODE
                                                    this.txtCustomerName.value  = data[0].TITLE
                                                }
                                            }
                                        }).bind(this)}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCustomerCode.show()
                                                    this.pg_txtCustomerCode.onClick = async(data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.customerGuid = data[0].GUID
                                                            this.txtCustomerCode.value = data[0].CODE
                                                            this.txtCustomerName.value  = data[0].TITLE
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }
                                    >
                                        <Validator validationGroup={"frmslsDoc" + this.tabIndex}>
                                            <RequiredRule message={this.t("validCustomerCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCustomerCode"} parent={this} 
                                    container={"#" + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCustomerCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)) AND STATUS = 1`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                        <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                        <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} />
                                    </NdPopGrid>
                                </NdItem> 
                                {/* txtCustomerName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCustomerName")} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    readOnly={true}
                                    />
                                </NdItem> 
                                <NdEmptyItem />
                                <NdItem>
                                <Button icon="xlsxfile" text={this .t("excelAdd")}
                                    validationGroup={"frmslsDoc"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.customerGuid == '')
                                        {
                                            this.toast.show({message:this.t("msgNotCustomer.msg"),type:"warning"});
                                        }
                                        this.popExcel.show()
                                    }}/>  
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                       {/* Excel PopUp */}
                       <div>
                        <NdPopUp parent={this} id={"popExcel"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popExcel.title")}
                        container={"#" + this.props.data.id + this.tabIndex} 
                        width={'600'}
                        height={'450'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popExcel.txtMulticode")} alignment="right" />
                                    <NdTextBox id="txtPopMulticode" parent={this} simple={true}  notRefresh = {true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popExcel.txtCustoms")} alignment="right" />
                                    <NdTextBox id="txtPopCustoms" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popExcel.txtOrigin")} alignment="right" />
                                    <NdTextBox id="txtPopOrigin" parent={this} simple={true}  notRefresh = {true}  readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </Item>
                            </Form>
                            <Form colCount={2}>
                                <Item>
                                    <input type="file" name="upload" id="upload" text={"Excel Aktarım"} onChange={(e)=>
                                    {
                                        e.preventDefault();
                                        if (e.target.files) 
                                        {
                                            const reader = new FileReader();
                                            reader.onload = (e) => 
                                            {
                                                const data = e.target.result;
                                                const workbook = xlsx.read(data, { type: "array" });
                                                const sheetName = workbook.SheetNames[0];
                                                const worksheet = workbook.Sheets[sheetName];
                                                const json = xlsx.utils.sheet_to_json(worksheet);
                                                this.popExcel.hide()
                                                this.excelAdd(json)
                                            };
                                            reader.readAsArrayBuffer(e.target.files[0]);
                                        }
                                    }}/>    
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                </ScrollView>
            </div>
        )
    }
}
