import React from 'react';
import App from '../../../lib/app.js';
import { posDeviceCls} from '../../../../core/cls/pos';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import { Item } from 'devextreme-react/form';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { Column} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
import { NdForm,NdItem, NdLabel } from '../../../../core/react/devex/form.js';
export default class posDeviceCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.deviceObj = new posDeviceCls();
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.deviceObj.clearAll();
        this.deviceObj.addEmpty();

        this.deviceObj.ds.on('onAddRow',(pTblName,pData) =>
        {
            if(pData.stat == 'new')
            {
                if(this.prevCode != '')
                {
                    this.btnNew.setState({disabled:true});
                    this.btnBack.setState({disabled:false});
                }
                else
                {
                    this.btnNew.setState({disabled:false});
                    this.btnBack.setState({disabled:true});
                }
                
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
            }
        })
        this.deviceObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.deviceObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.deviceObj.dt('POS_DEVICE').length > 0 ? this.deviceObj.dt('POS_DEVICE')[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })
        this.deviceObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })
    }
    async getDevice(pCode)
    {
        this.deviceObj.clearAll()
        await this.deviceObj.load({CODE:pCode});
    }
    async checkDevice(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query : `SELECT * FROM [POS_DEVICE_VW_01] WHERE CODE = @CODE`,
                    param : ['CODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'auto',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getDevice(pCode)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) // TAMAM BUTONU
                    }
                }
                else
                {
                    resolve(1) // KAYIT BULUNAMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnBack" parent={this} icon="revert" type="default"
                                        onClick={()=>
                                        {
                                            if(this.prevCode != '')
                                            {
                                                this.getDevice(this.prevCode); 
                                            }
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=> { this.init() }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmDevice"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                if((await this.deviceObj.save()) == 0)
                                                {                                                    
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                    }
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'auto',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
                                    onClick={async()=>
                                    {
                                        
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.deviceObj.dt('POS_DEVICE').removeAt(0)
                                            await this.deviceObj.dt('POS_DEVICE').delete();
                                            this.toast.show({message:this.t("msgDeleteResult.msgSuccess"),type:"success"})
                                            this.init(); 
                                        }
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"/>
                                </Item>
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
                            <NdForm colCount={2} id={"frmDevice"  + this.tabIndex}>
                                {/* txtCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"CODE"}}  
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtCode.show()
                                                    this.pg_txtCode.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getDevice(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtCode.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkDevice(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDevice"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*KASA SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}  
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCode.title")} //
                                    data={{source:{select:{query : `SELECT CODE,NAME FROM POS_DEVICE_VW_01`},sql:this.core.sql}}}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCode.clmCode")} width={300} />
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </NdItem>
                                {/* txtTitle */}
                                <NdItem>
                                    <NdLabel text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                {/* txtLcdPort */}
                                <NdItem>
                                    <NdLabel text={this.t("txtLcdPort")} alignment="right" />
                                    <NdTextBox id="txtLcdPort" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"LCD_PORT"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    param={this.param.filter({ELEMENT:'txtLcdPort',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtLcdPort',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                {/* txtScalePort */}
                                <NdItem>
                                    <NdLabel text={this.t("txtScalePort")} alignment="right" />
                                    <NdTextBox id="txtScalePort" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"SCALE_PORT"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                {/* txtPayCardPort */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPayCardPort")} alignment="right" />
                                    <NdTextBox id="txtPayCardPort" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"PAY_CARD_PORT"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                {/* txtPrintDesing */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPrintDesing")} alignment="right" />
                                    <NdTextBox id="txtPrintDesing" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"PRINT_DESING"}}
                                    />
                                </NdItem>
                                {/* txtMacId */}
                                <NdItem>
                                    <NdLabel text={this.t("txtMacId")} alignment="right" />
                                    <NdTextBox id="txtMacId" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"MACID"}}/>
                                </NdItem>
                                {/* cmbDepot */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbDepot")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDepot" tabIndex={this.tabIndex}
                                    dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"DEPOT_GUID",display:"DEPOT_NAME"}}
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    value=""
                                    searchEnabled={true} 
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh={true}
                                    data={{source:{select:{query : `SELECT '00000000-0000-0000-0000-000000000000' AS GUID, 'GENERAL' AS NAME UNION ALL SELECT GUID,NAME FROM DEPOT_VW_01 WHERE  STATUS = 1 ORDER BY NAME ASC`},sql:this.core.sql}}}
                                    />
                                </NdItem>
                                {/* txtPrinterPort */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPrinterPort")} alignment="right" />
                                    <NdTextBox id="txtPrinterPort" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"PRINTER_PORT"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("txtScannerPort")} alignment="right" />
                                    <NdTextBox id="txtScannerPort" parent={this} simple={true} dt={{data:this.deviceObj.dt('POS_DEVICE'),field:"SCANNER_PORT"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    />
                                </NdItem>
                            </NdForm>
                        </div>
                        <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
