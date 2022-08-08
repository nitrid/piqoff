import React from 'react';
import App from '../../../lib/app.js';
import { customersCls,customerAdressCls, customerOfficalCls } from '../../../../core/cls/customers.js';


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdNumberBox from '../../../../core/react/devex/numberbox.js';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class customerAddressCard extends React.Component
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.customerObj = new customersCls();
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        

        this._onItemRendered = this._onItemRendered.bind(this)
        
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.customerObj.clearAll();

        this.customerObj.ds.on('onAddRow',(pTblName,pData) =>
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
        this.customerObj.ds.on('onEdit',(pTblName,pData) =>
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
        this.customerObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.customerObj.dt('CUSTOMERS').length > 0 ? this.customerObj.dt('CUSTOMERS')[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })
        this.customerObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
        })
        this.txtCode.value = ''
        
    }
    async getCustomer(pCode)
    {
        this.customerObj.clearAll()
        await this.customerObj.load({CODE:pCode});
    }
    async checkCustomer(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpData = await new customersCls().load({CODE:pCode});

                if(tmpData.length > 0)
                {
                    let tmpConfObj = 
                    {
                        id: 'msgCode',
                        showTitle:true,
                        title:this.t("msgCode.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getCustomer(pCode)
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
    async _onCustomerRendered(e)
    {
        await this.core.util.waitUntil(10)
    }
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == this.t("tabTitleAdress"))
        {        
            await this.grdAdress.dataRefresh({source:this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')});
        }
    }
    render()
    {
        return(
            <div>
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
                                                this.getCustomer(this.prevCode); 
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup={"frmCustomerAddress"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                }
                                                
                                                if((await this.customerObj.save()) == 0)
                                                {                                                    
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
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
                                                id:'msgSaveValid',showTitle:true,title:this.t("msgSaveValid.title"),showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgSaveValid.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveValid.msg")}</div>)
                                            }
                                            
                                            await dialog(tmpConfObj);
                                        }                                                 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="default"
                                    onClick={async()=>
                                    {
                                        
                                        let tmpConfObj =
                                        {
                                            id:'msgDelete',showTitle:true,title:this.t("msgDelete.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgDelete.btn01"),location:'before'},{id:"btn02",caption:this.t("msgDelete.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDelete.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        if(pResult == 'btn01')
                                        {
                                            this.customerObj.dt('CUSTOMERS').removeAt(0)
                                            await this.customerObj.dt('CUSTOMERS').delete();
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
                            <Form colCount={2} id={"frmCustomerAddress"  + this.tabIndex}>
                                {/* txtCode */}
                                <Item>
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"CODE"}}  
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
                                                            this.getCustomer(data[0].CODE)
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
                                        let tmpResult = await this.checkCustomer(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmCustomerAddress"  + this.tabIndex}>
                                            <RequiredRule message="Kodu boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                    {/*CARI SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
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
                                                query : "SELECT GUID,CODE,TITLE,NAME,LAST_NAME,[TYPE_NAME],[GENUS_NAME] FROM CUSTOMER_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(TITLE) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    button=
                                    {
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(1111)
                                            }
                                        }
                                    }
                                    >
                                         <Column dataField="CODE" caption={this.t("pg_txtCode.clmCode")} width={150} />
                                        <Column dataField="TITLE" caption={this.t("pg_txtCode.clmTitle")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300} defaultSortOrder="asc" />
                                        <Column dataField="LAST_NAME" caption={this.t("pg_txtCode.clmLastName")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                 {/* txtTitle */}
                                 <Item>
                                    <Label text={this.t("txtTitle")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TITLE"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                            </Form>
                        </div>
                        <div className='row px-2 pt-2'>
                            <div className='col-12'>
                                <TabPanel height="100%" onItemRendered={this._onItemRendered}>
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
                                                    <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                    <Column dataField="ADRESS" caption={this.t("grdAdress.clmAdress")} />
                                                    <Column dataField="ZIPCODE" caption={this.t("grdAdress.clmZipcode")} />
                                                    <Column dataField="CITY" caption={this.t("grdAdress.clmCity")}/>
                                                    <Column dataField="COUNTRY" caption={this.t("grdAdress.clmCountry")}/>
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
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={this.t("popAdress.txtPopAdress")} alignment="right" />
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopZipcode")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopZipcode"
                                    displayExpr="ZIPNAME"                       
                                    valueExpr="ZIPCODE"
                                    value=""
                                    searchEnabled={true}
                                    onValueChanged={(async()=>
                                        {
                                           
                                    }).bind(this)}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT [COUNTRY_CODE],[ZIPCODE],[PLACE],ZIPCODE + ' ' + PLACE AS ZIPNAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCity")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCity"
                                    displayExpr="CITYNAME"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    pageSize ={50}
                                    notRefresh = {true}
                                    data={{source:{select:{query : "SELECT COUNTRY_CODE,ZIPCODE,PLACE,PLACE + ' ' + ZIPCODE AS CITYNAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={this.t("popAdress.cmbPopCountry")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCountry"
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    value="FR"
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM COUNTRY ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text={this.lang.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.customerObj.customerAdress.empty};
                                               
                                                
                                                tmpEmpty.TYPE = 0
                                                tmpEmpty.ADRESS = this.txtPopAdress.value
                                                tmpEmpty.ZIPCODE = this.cmbPopZipcode.value
                                                tmpEmpty.CITY = this.cmbPopCity.value
                                                tmpEmpty.COUNTRY = this.cmbPopCountry.value
                                                tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                this.customerObj.customerAdress.addEmpty(tmpEmpty);    
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
                </ScrollView>
            </div>
        )
    }
}