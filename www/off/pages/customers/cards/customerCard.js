import React from 'react';
import App from '../../../lib/app.js';
import { customersCls,customerAdressCls, customerOfficalCls } from '../../../lib/cls/customers.js';

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

export default class CustomerCard extends React.Component
{
    constructor()
    {
        super()
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.customerObj = new customersCls();
        this.prevCode = "";
        this.state={officalVisible:true}
        

        this._onItemRendered = this._onItemRendered.bind(this)
        this._cellRoleRender = this._cellRoleRender.bind(this)
        
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
                this.btnPrint.setState({disabled:false});
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
                this.btnPrint.setState({disabled:false});

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
            this.btnPrint.setState({disabled:false});          
        })
        this.customerObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
            this.btnCopy.setState({disabled:false});
            this.btnPrint.setState({disabled:false});
        })

        this.customerObj.addEmpty();
        let tmpOffical = {...this.customerObj.customerOffical.empty}
        tmpOffical.CUSTOMER = this.customerObj.dt()[0].GUID 
        this.customerObj.customerOffical.addEmpty(tmpOffical)

        this.txtTitle.readOnly = true
        this.txtCode.value = ''
        this.setState({officalVisible:false})
        
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
                        id: 'txtCode',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Cariye Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz Cari sistem de kayıtlı !</div>)
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
            console.log(pCode)
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
        if(e.itemData.title == "Adres")
        {        
            await this.grdAdress.dataRefresh({source:this.customerObj.customerAdress.dt('CUSTOMER_ADRESS')});
        }
        if(e.itemData.title == "Yetkili")
        {        
            await this.grdOffical.dataRefresh({source:this.customerObj.customerOffical.dt('CUSTOMER_OFFICAL')});
        }
        if(e.itemData.title == "Yasal")
        {        
            await this.grdLegal.dataRefresh({source:this.customerObj.dt('CUSTOMERS')});
        }
    }
    _cellRoleRender(e)
    {
        let onValueChanged = function(data)
        {
            e.setValue(data.value)
        }
        return (
            <NdSelectBox 
                parent={this}                             
                id = "cmdTaxType"                             
                displayExpr="VALUE"                       
                valueExpr="ID"
                onValueChanged={onValueChanged}
                data={{source:[{ID:0,VALUE:"Bireysel"},{ID:1,VALUE:"Firma"}]}}
            >
            </NdSelectBox>
        )
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="default" validationGroup="frmCustomers" //Değişecek
                                    onClick={async (e)=>
                                    {
                                        if(e.validationGroup.validate().status == "valid")
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'diaSave1',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:'Tamam',location:'before'},{id:"btn02",caption:'Vazgeç',location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt etmek istediğinize eminmisiniz !</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            if(pResult == 'btn01')
                                            {
                                                let tmpConfObj1 =
                                                {
                                                    id:'diaSave2',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                    button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                }
                                                
                                                if((await this.customerObj.save()) == 0)
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt işleminiz başarılı !</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                                else
                                                {
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px"}}>Kayıt işleminiz başarısız !</div>)
                                                    await dialog(tmpConfObj1);
                                                }
                                            }
                                        }                              
                                        else
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'diaSave3',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                                button:[{id:"btn01",caption:'Tamam',location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>Lütfen gerekli alanları doldurunuz !</div>)
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
                                            id:'diaSave1',showTitle:true,title:"Dikkat",showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:'Tamam',location:'before'},{id:"btn02",caption:'Vazgeç',location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>Kaydı silmek istediğinize eminmisiniz ?</div>)
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
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={()=>
                                    {
                                        
                                    }}/>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id="frmCustomers">
                                {/* cmbType */}
                                <Item>
                                    <Label text={"Tip "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbType" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:"Bireysel"},{ID:1,VALUE:"Firma"}]}}
                                    onValueChanged={(async()=>
                                            {
                                                if(this.cmbType.value == 0)
                                                {
                                                    this.txtTitle.readOnly = true
                                                    this.setState({officalVisible:false})
                                                    this.txtTitle.value = ""
                                                    this.txtCode.value = ""
                                                }
                                                else if(this.cmbType.value == 1)
                                                {
                                                    this.txtTitle.readOnly = false
                                                    this.setState({officalVisible:true})
                                                    this.txtCode.value = Math.floor(Date.now() / 1000)
                                                }
                                        }).bind(this)}
                                    //param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* cmbGenus */}
                                <Item>
                                    <Label text={"Cinsi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbGenus" height='fit-content' dt={{data:this.customerObj.dt('CUSTOMERS'),field:"GENUS"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:[{ID:0,VALUE:"Müşteri"},{ID:1,VALUE:"Tedarikçi"},{ID:2,VALUE:"Her İkisi"}]}}
                                    //param={this.param.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    //access={this.access.filter({ELEMENT:'cmbType',USERS:this.user.CODE})}
                                    />
                                </Item>       
                                {/* txtCode */}
                                <Item>
                                    <Label text={"Kod"} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"CODE"}}  
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
                                        <Validator validationGroup={"frmCustomers"}>
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
                                    title={'Cari Seçim'}
                                    data={{source:{select:{query : "SELECT CODE,TITLE,NAME,LAST_NAME FROM CUSTOMER_VW_01"},sql:this.core.sql}}}
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
                                         <Column dataField="CODE" caption="KODU" width={150} />
                                        <Column dataField="TITLE" caption="ÜNVAN" width={300} defaultSortOrder="asc" />
                                        <Column dataField="NAME" caption="ADI" width={300} defaultSortOrder="asc" />
                                        <Column dataField="LAST_NAME" caption="SOYADI" width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                 {/* txtTitle */}
                                 <Item>
                                    <Label text={"Ünvan"} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"TITLE"}}
                                    onChange={(async()=>
                                    {
                                      
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtTitle',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerName */}
                                <Item>
                                    <Label text={"Adı "} alignment="right" />
                                    <NdTextBox id="txtCustomerName" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"NAME",filter:{TYPE:0}}}
                                    maxLength={32}
                                    param={this.param.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCustomerName',USERS:this.user.CODE})}
                                    >
                                     <Validator validationGroup={"frmCustomers"}>
                                            <RequiredRule message="Adı boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                {/* txtCustomerLastname */}
                                <Item>
                                    <Label text={"Soyadı "} alignment="right" />
                                        <NdTextBox id="txtCustomerLastname" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"LAST_NAME",filter:{TYPE:0}}}
                                        maxLength={32}
                                        param={this.param.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        access={this.access.filter({ELEMENT:'txtCustomerLastname',USERS:this.user.CODE})}
                                        >
                                     <Validator validationGroup={"frmCustomers"}>
                                            <RequiredRule message="Soyadı boş geçemezsiniz !" />
                                        </Validator>  
                                    </NdTextBox>
                                </Item>
                                 {/* txtPhone1 */}
                                 <Item>
                                    <Label text={"Telefon 1 "} alignment="right" />
                                        <NdTextBox id="txtPhone1" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE1",filter:{TYPE:0}}}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone1',USERS:this.user.CODE})}
                                       />
                                </Item>
                                 {/* txtPhone2 */}
                                 <Item>
                                    <Label text={"Telefon 2 "} alignment="right" />
                                        <NdTextBox id="txtPhone2" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"PHONE2",filter:{TYPE:0}}}
                                        maxLength={32}
                                        access={this.access.filter({ELEMENT:'txtPhone2',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtGsmPhone */}
                                 <Item>
                                    <Label text={"Gsm Tel "} alignment="right" />
                                        <NdTextBox id="txtGsmPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"GSM_PHONE",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtGsmPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtOtherPhone */}
                                 <Item>
                                    <Label text={"Diğer Tel "} alignment="right" />
                                        <NdTextBox id="txtOtherPhone" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"OTHER_PHONE",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtOtherPhone',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtEmail */}
                                 <Item>
                                    <Label text={"E-Mail "} alignment="right" />
                                        <NdTextBox id="txtEmail" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMER_OFFICAL'),field:"EMAIL",filter:{TYPE:0}}}
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtEmail',USERS:this.user.CODE})}
                                        />
                                </Item>
                                 {/* txtWev */}
                                 <Item>
                                    <Label text={"Web "} alignment="right" />
                                        <NdTextBox id="txtWeb" parent={this} simple={true} dt={{data:this.customerObj.dt('CUSTOMERS'),field:"WEB"}} 
                                        maxLength={32}
                                         access={this.access.filter({ELEMENT:'txtWeb',USERS:this.user.CODE})}
                                        />
                                </Item>
                            </Form>
                        </div>
                        <div className='row px-2 pt-2'>
                            <div className='col-12'>
                                <TabPanel height="100%" onItemRendered={this._onItemRendered}>
                                    <Item title="Adres">
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
                                                    <Column dataField="ADRESS" caption="Adres" />
                                                    <Column dataField="ZIPCODE" caption="Posta Kodu" />
                                                    <Column dataField="CITY" caption="Şehir"/>
                                                    <Column dataField="COUNTRY" caption="Ülke"/>
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>   
                                    <Item title="Yasal">
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdLegal"} 
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
                                                    <Column dataField="SIRET_ID" caption="SIRET No"/>
                                                    <Column dataField="APE_CODE" caption="APE Kodu"/>
                                                    <Column dataField="TAX_OFFICE" caption="Vergi Dairesi"/>
                                                    <Column dataField="TAX_NO" caption="Vergi No"/>
                                                    <Column dataField="INT_VAT_NO" caption="Ulus. Kdv No:"/>
                                                    <Column dataField="TAX_TYPE" caption="Vergi Tipi" editCellRender={this._cellRoleRender} />
                                                </NdGrid>
                                            </div>
                                        </div>
                                    </Item>  
                                    <Item title="Yetkili" visible={this.state.officalVisible}>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <Toolbar>
                                                    <Item location="after">
                                                        <Button icon="add"
                                                        onClick={async ()=>
                                                        {
                                                            this.txtPopName.value = "";
                                                            this.txtPopLastName.value = "";
                                                            this.txtPopPhone1.value = "";
                                                            this.txtPopPhone2.value = ''
                                                            this.txtPopGsmPhone.value = ''
                                                            this.txtPopOtherPhone.value = ''
                                                            this.txtPopMail.value = ''
                                                            this.popOffical.show();
                                                        }}/>
                                                    </Item>
                                                </Toolbar>
                                            </div>
                                        </div>
                                        <div className='row px-2 py-2'>
                                            <div className='col-12'>
                                                <NdGrid parent={this} id={"grdOffical"} 
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
                                                    <Column dataField="NAME" caption="Ad"/>
                                                    <Column dataField="LAST_NAME" caption="Soyad"/>
                                                    <Column dataField="PHONE1" caption="Telefon 1"/>
                                                    <Column dataField="PHONE2" caption="Telefon 2"/>
                                                    <Column dataField="GSM_PHONE" caption="GSM"/>
                                                    <Column dataField="EMAIL" caption="E-Mail"/>
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
                        title={"Adres Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Adresi "} alignment="right" />
                                    <NdTextBox id={"txtPopAdress"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Posta Kodu "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopZipcode"
                                    displayExpr="NAME"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    pageSize ={50}
                                    data={{source:{select:{query : "SELECT [COUNTRY_CODE],[ZIPCODE],[PLACE],PLACE + ' ' + ZIPCODE AS NAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Şehir "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopCity"
                                    displayExpr="NAME"                       
                                    valueExpr="PLACE"
                                    value=""
                                    searchEnabled={true}
                                    pageSize ={50}
                                    data={{source:{select:{query : "SELECT [COUNTRY_CODE],[ZIPCODE],[PLACE],PLACE + ' ' + ZIPCODE AS NAME  FROM [dbo].[ZIPCODE]"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Ülke "} alignment="right" />
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
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
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
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
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
                    {/* Yetkili POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popOffical"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Yetkili Ekle"}
                        container={"#root"} 
                        width={'500'}
                        height={'350'}
                        position={{of:'#root'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Adı "} alignment="right" />
                                    <NdTextBox id={"txtPopName"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Soyadı "} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopLastName"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Telefon1"} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone1"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Telefon2"} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopPhone2"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"GSM"} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopGsmPhone"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Diğer Telefon"} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopOtherPhone"
                                    />
                                </Item>
                                <Item>
                                    <Label text={"E-Mail"} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtPopMail"
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.customerObj.customerOffical.empty};
                                               
                                                
                                                tmpEmpty.TYPE = 1
                                                tmpEmpty.NAME = this.txtPopName.value
                                                tmpEmpty.LAST_NAME = this.txtPopLastName.value
                                                tmpEmpty.PHONE1 = this.txtPopPhone1.value
                                                tmpEmpty.PHONE2 = this.txtPopPhone2.value
                                                tmpEmpty.GSM_PHONE = this.txtPopGsmPhone.value
                                                tmpEmpty.OTHER_PHONE = this.txtPopOtherPhone.value          
                                                tmpEmpty.EMAIL = this.txtPopMail.value
                                                tmpEmpty.CUSTOMER = this.customerObj.dt()[0].GUID 

                                                this.customerObj.customerOffical.addEmpty(tmpEmpty);    
                                                this.popOffical.hide(); 
                                                
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popOffical.hide();  
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