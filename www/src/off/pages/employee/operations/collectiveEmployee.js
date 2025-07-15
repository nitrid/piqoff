import React from 'react';
import App from '../../../lib/app.js';
import { employeesCls } from '../../../../core/cls/employees.js';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item} from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';
import NdTextBox, { Validator, NumericRule, RequiredRule, EmailRule} from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';        
import { NdToast } from '../../../../core/react/devex/toast.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
export default class collectiveEmployee extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.employeeObj = new employeesCls();
        this.prevCode = "";
        this.state={officalVisible:true}
        this.tabIndex = props.data.tabkey
        this.sysPrmObj = this.param.filter({TYPE:0,USERS:this.user.CODE});

        this.onItemRendered  = this.onItemRendered .bind(this)
       
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
        if(typeof this.pagePrm != 'undefined')
        {
            this.employeeObj.clearAll()
            await this.employeeObj.load({GUID:this.pagePrm.GUID});
        }
    }
    async init()
    {
        this.employeeObj.clearAll();

        this.employeeObj.ds.on('onAddRow',(pTblName,pData) =>
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
                this.btnPrint.setState({disabled:false});
            }
        })
        this.employeeObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});
                this.btnCopy.setState({disabled:false});
                this.btnPrint.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.employeeObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.employeeObj.dt().length > 0 ? this.employeeObj.dt()[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});          
        })
        this.employeeObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        

        this.employeeObj.addEmpty();
        this.txtCode.value = ''
        this.setState({officalVisible:false})
      
        
    }
    async getEmployee(pCode)
    {
        this.employeeObj.clearAll()
        await this.employeeObj.load({CODE:pCode});
        console.log(this.employeeObj.dt())
    }

    async checkEmployee(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpData = await new employeesCls().load({CODE:pCode});

                if(tmpData.length > 0)
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
                        this.getEmployee(pCode)
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
    async checkZipcode(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpQuery = {
                    query :"SELECT COUNTRY_CODE,PLACE FROM ZIPCODE WHERE ZIPCODE = @ZIPCODE ",
                    param : ['ZIPCODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 
                if(tmpData.result.recordset.length > 0)
                {
                    
                    this.cmbPopCity.value = tmpData.result.recordset[0].PLACE
                    this.cmbPopCountry.value = tmpData.result.recordset[0].COUNTRY_CODE
                    resolve(1)
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
    async _onEmployeeRendered(e)
    {
        await this.core.util.waitUntil(10)
    }
    async onItemRendered (e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitleAdress"))
        {        
            await this.grdAdress.dataRefresh({source:this.employeeObj.employeeAdress.dt('EMPLOYEE_ADRESS')});
        }
       
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
                                                this.getEmployee(this.prevCode); 
                                            }
                                        }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmEmployees"  + this.tabIndex}
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
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.employeeObj.save()) == 0)
                                                {
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                                    this.btnSave.setState({disabled:true});
                                                    this.btnNew.setState({disabled:false});
                                                }
                                                else
                                                {
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
                                            this.employeeObj.dt('EMPLOYEE').removeAt(0)
                                            await this.employeeObj.dt('EMPLOYEE').delete();
                                            this.toast.show({message:this.t("msgDeleteSuccess.msg"),type:"success"})
                                            this.init(); 
                                        }
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnCopy" parent={this} icon="copy" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        this.popDesign.show()
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto" widget="dxButton"
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
                            <NdForm colCount={2} id={"frmEmployees"  + this.tabIndex}>     
                                {/* txtCode */}
                                <NdItem>
                                    <NdLabel text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"CODE"}} 
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
                                                            this.getEmployee(data[0].CODE)
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
                                        let tmpResult = await this.checkEmployee(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmEmployees"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validation.frmEmployees")}/>
                                        </Validator>  
                                    </NdTextBox>
                                    {/*PERSONEL SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={'#' + this.props.data.id + this.tabIndex}
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCode.title")} //
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT * FROM EMPLOYEE_VW_01 WHERE (((NAME like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) OR ((CODE like '%' + @EMPLOYEE_NAME + '%') OR (@EMPLOYEE_NAME = '')) )",
                                                param : ['EMPLOYEE_NAME:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCode.clmCode")} width={150} />
                                        <Column dataField="GENDER" caption={this.t("pg_txtCode.clmGender")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="LAST_NAME" caption={this.t("pg_txtCode.clmLastName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="MARIAL_STATUS" caption={this.t("pg_txtCode.clmStatus")} width={300} />
                                    </NdPopGrid>
                                </NdItem>
                                {/* txtEmployeeName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtEmployeeName")} alignment="right" />
                                    <NdTextBox id="txtEmployeeName" parent={this} simple={true} tabIndex={this.tabIndex} dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtEmployeeName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtEmployeeName',USERS:this.user.CODE})}
                                    >                                      
                                    </NdTextBox>
                                </NdItem>
                                {/* txtEmployeeLastname */}
                                <NdItem>
                                    <NdLabel text={this.t("txtEmployeeLastname")} alignment="right" />
                                    <NdTextBox id="txtEmployeeLastname" parent={this} simple={true} tabIndex={this.tabIndex} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"LAST_NAME"}}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtEmployeeLastname',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtEmployeeLastname',USERS:this.user.CODE})}
                                    >                                      
                                    </NdTextBox>
                                </NdItem>
                                {/* txtPhone1 */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPhone1")} alignment="right" />
                                    <NdTextBox id="txtPhone1" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"PHONE1"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                {/* txtPhone2 */}
                                <NdItem>
                                    <NdLabel text={this.t("txtPhone2")} alignment="right" />
                                    <NdTextBox id="txtPhone2" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"PHONE2"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone2',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                {/* txtGsmPhone */}
                                <NdItem>
                                    <NdLabel text={this.t("txtGsmPhone")} alignment="right" />
                                    <NdTextBox id="txtGsmPhone" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"GSM_PHONE"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtGsmPhone',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                {/* txtOtherPhone */}
                                <NdItem>
                                    <NdLabel text={this.t("txtOtherPhone")} alignment="right" />
                                    <NdTextBox id="txtOtherPhone" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"OTHER_PHONE"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtOtherPhone',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <NumericRule message={this.lang.t("phoneIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                {/* txtEmail */}
                                <NdItem>
                                    <NdLabel text={this.t("txtEmail")} alignment="right" />
                                    <NdTextBox id="txtEmail"                                       
                                        parent={this} 
                                        simple={true}  
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"EMAIL"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={100}
                                        access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                    >
                                        <Validator>
                                            <EmailRule message={this.lang.t("mailIsInvalid")}/>
                                        </Validator>
                                    </NdTextBox>
                                </NdItem>
                                {/* txtAge */}
                                <NdItem>
                                    <NdLabel text={this.t("txtAge")} alignment="right" />
                                    <NdTextBox id="txtAge" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"AGE"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtAge',USERS:this.user.CODE})}
                                    >
                                     
                                    </NdTextBox>
                                </NdItem>
                                {/* txtInsuranceNo */}
                                <NdItem>
                                    <NdLabel text={this.t("txtInsuranceNo")} alignment="right" />
                                    <NdTextBox id="txtInsuranceNo" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"INSURANCE_NO"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtInsuranceNo',USERS:this.user.CODE})}
                                    >                                  
                                    </NdTextBox>
                                </NdItem>
                                {/* txtGender */}
                                <NdItem>
                                    <NdLabel text={this.t("txtGender")} alignment="right" />
                                    <NdTextBox id="txtGender" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"GENDER"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtGender',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </NdItem>
                                {/* txtMarialStatus */}
                                <NdItem>
                                    <NdLabel text={this.t("txtMarialStatus")} alignment="right" />
                                    <NdTextBox id="txtMarialStatus"                                       
                                        parent={this} 
                                        simple={true}  
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"MARIAL_STATUS"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={100}
                                        access={this.access.filter({ELEMENT:'txtMarialStatus',USERS:this.user.CODE})}
                                    >
                                       
                                    </NdTextBox>
                                </NdItem>
                                 {/* txtWage */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtWage")} alignment="right" />
                                    <NdTextBox id="txtWage" 
                                        parent={this} 
                                        simple={true} 
                                        dt={{data:this.employeeObj.dt('EMPLOYEE'),field:"WAGE"}}
                                        upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtWage',USERS:this.user.CODE})}
                                    >
                                     
                                    </NdTextBox>
                                </NdItem>
                            </NdForm>
                        </div>
                        <div className='row px-2 pt-2'>
                            <div className='col-12'>
                                <TabPanel height="100%" onItemRendered={this.onItemRendered } deferRendering={false}>
                                    <Item title={this.t("tabTitleAdress")}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <Toolbar>
                                                    <Item location="after">
                                                        <Button icon="add"
                                                        onClick={async ()=>
                                                        {
                                                            this.txtPopAdress.value = "";
                                                            this.cmbPopZipcode.value = "";
                                                            this.cmbPopCity.value = "";
                                                            this.cmbPopCountry.value = ''
                                                            this.popAdress.show();
                                                        }}/>
                                                    </Item>
                                                </Toolbar>
                                            </div>
                                        </div>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdAdress"} 
                                                showBorders={true} 
                                                columnsAutoWidth={true} 
                                                allowColumnReordering={true} 
                                                allowColumnResizing={true} 
                                                height={'100%'} 
                                                width={'100%'}
                                                dbApply={false}
                                                >
                                                    <Paging defaultPageSize={5} />
                                                    <Editing mode="popup" allowUpdating={true} allowDeleting={true} />
                                                    <Column dataField="ADRESS" caption={this.t("grdAdress.clmAdress")} />
                                                    <Column dataField="ZIPCODE" caption={this.t("grdAdress.clmZipcode")} />
                                                    <Column dataField="CITY" caption={this.t("grdAdress.clmCity")}/>
                                                    <Column dataField="COUNTRY" caption={this.t("grdAdress.clmCountry")} allowEditing={false}/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>   
                                           
                                </TabPanel>
                            </div>
                        </div> 
                    </div>
                    {/* Adres POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popAdress"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popAdress.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popAdress.txtPopAdress")} alignment="right" />
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} 
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}/>
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCountry")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCountry"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value="FR"
                                    searchEnabled={true}
                                    showClearButton={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    onValueChanged={(async()=>
                                    {
                                        let tmpQuery = 
                                        {
                                            query : "SELECT [ZIPCODE], ZIPCODE AS ZIPNAME  FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY ZIPCODE",
                                            param : ['COUNTRY_CODE:string|5'],
                                            value : [this.cmbPopCountry.value]
                                        }
                                        let tmpData = await this.core.sql.execute(tmpQuery) 
                                        if(tmpData.result.recordset.length > 0)
                                        {   
                                            await this.cmbPopZipcode.setData(tmpData.result.recordset)
                                        }
                                        else
                                        {
                                            await this.cmbPopZipcode.setData([])
                                        }
                                        let tmpCityQuery = 
                                        {
                                            query : "SELECT [PLACE] FROM [dbo].[ZIPCODE] WHERE COUNTRY_CODE = @COUNTRY_CODE GROUP BY PLACE",
                                            param : ['COUNTRY_CODE:string|5'],
                                            value : [this.cmbPopCountry.value]
                                        }
                                        let tmpCityData = await this.core.sql.execute(tmpCityQuery) 
                                        if(tmpCityData.result.recordset.length > 0)
                                        {   
                                            await this.cmbPopCity.setData(tmpCityData.result.recordset)
                                        }
                                        else
                                        {
                                            await this.cmbPopCity.setData([])
                                        }

                                    }).bind(this)}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopZipcode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopZipcode" 
                                    acceptCustomValue={true}
                                   
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize={50}
                                    notRefresh={true}
                                    onCustomItemCreating={async(e)=>
                                    {
                                        if (!e.text) {
                                            e.customItem = null;
                                            return;
                                        }
                                     
                                        const { component, text } = e;
                                        const currentItems = component.option('items');
                                     
                                        const newItem = {
                                            ZIPCODE: text.trim(),
                                            ZIPNAME: text.trim(),
                                        };
                                     
                                        const itemInDataSource = currentItems.find((item) => item.text === newItem.text)
                                        if (itemInDataSource) {
                                            e.customItem = itemInDataSource;
                                        } else {    
                                            currentItems.push(newItem);
                                            component.option('items', currentItems);
                                            e.customItem = newItem;
                                        }
                                    }}
                                    >
                                    </NdSelectBox>
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCity"
                                    displayExpr="PLACE"                       
                                    valueExpr="PLACE"
                                    value=""
                                    acceptCustomValue={true}
                                    searchEnabled={true}
                                    showClearButton={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    onCustomItemCreating={async(e)=>
                                    {
                                        if (!e.text) {
                                            e.customItem = null;
                                            return;
                                        }
                                        
                                        const { component, text } = e;
                                        const currentItems = component.option('items');
                                        
                                        const newItem = {
                                            PLACE: text.trim(),
                                            PLACE: text.trim(),
                                        };
                                        
                                        const itemInDataSource = currentItems.find((item) => item.text === newItem.text)
                                        if (itemInDataSource) {
                                            e.customItem = itemInDataSource;
                                        } else {    
                                            currentItems.push(newItem);
                                            component.option('items', currentItems);
                                            e.customItem = newItem;
                                        }
                                    }}
                                    />
                                </Item>
                              
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="success" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.employeeObj.employeeAdress.empty};
                                               
                                                
                                                tmpEmpty.ADRESS_NO = this.employeeObj.employeeAdress.dt().length
                                                tmpEmpty.ADRESS = this.txtPopAdress.value
                                                tmpEmpty.ZIPCODE = this.cmbPopZipcode.value
                                                tmpEmpty.CITY = this.cmbPopCity.value
                                                tmpEmpty.COUNTRY = this.cmbPopCountry.value
                                                tmpEmpty.EMPLOYEE = this.employeeObj.dt()[0].GUID 

                                                this.employeeObj.employeeAdress.addEmpty(tmpEmpty);    
                                                this.popAdress.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popAdress.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div> 
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}