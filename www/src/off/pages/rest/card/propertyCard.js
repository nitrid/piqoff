import React from 'react';
import App from '../../../lib/app.js';
import { restPropertyCls } from '../../../../core/cls/rest.js';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NbButton from '../../../../core/react/bootstrap/button';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class PropertyCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.propertyObj = new restPropertyCls();
        this.propData = []
        this.prevCode = "";
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(500)
        this.init()
    }
    async init()
    {
        this.propData = []
        this.propertyObj.clearAll();
        this.propertyObj.addEmpty();

        await this.grdList.dataRefresh({source:this.propertyObj.dt('REST_ITEM_PROPERTY')})
        await this.grdProps.dataRefresh({source:this.propData})

        this.propertyObj.ds.on('onAddRow',(pTblName,pData) =>
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
            }
        })
        this.propertyObj.ds.on('onEdit',(pTblName,pData) =>
        {            
            if(pData.rowData.stat == 'edit')
            {
                this.btnBack.setState({disabled:false});
                this.btnNew.setState({disabled:true});
                this.btnSave.setState({disabled:false});
                this.btnDelete.setState({disabled:false});

                pData.rowData.CUSER = this.user.CODE
            }                 
        })
        this.propertyObj.ds.on('onRefresh',(pTblName) =>
        {            
            this.prevCode = this.propertyObj.dt().length > 0 ? this.propertyObj.dt()[0].CODE : '';
            this.btnBack.setState({disabled:true});
            this.btnNew.setState({disabled:false});
            this.btnSave.setState({disabled:true});
            this.btnDelete.setState({disabled:false});
        })
        this.propertyObj.ds.on('onDelete',(pTblName) =>
        {            
            this.btnBack.setState({disabled:false});
            this.btnNew.setState({disabled:true});
            this.btnSave.setState({disabled:false});
            this.btnDelete.setState({disabled:false});
        })
    }
    async getProperty(pCode)
    {
        this.propertyObj.clearAll()
        await this.propertyObj.load({CODE:pCode});

        if(this.propertyObj.dt().length > 0)
        {
            if(this.propertyObj.dt()[0].PROPERTY != "")
            {
                this.propData = JSON.parse(this.propertyObj.dt()[0].PROPERTY)
                this.grdProps.dataRefresh({source:this.propData})
            }
        }
    }
    async checkProperty(pCode)
    {
        return new Promise(async resolve =>
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query :"SELECT * FROM REST_PROPERTY WHERE CODE = @CODE AND DELETED = 0",
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
                        height:'200px',
                        button:[{id:"btn01",caption:this.t("msgCode.btn01"),location:'before'},{id:"btn02",caption:this.t("msgCode.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgCode.msg")}</div>)
                    }
    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getProperty(pCode)
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
                                            this.getProperty(this.prevCode); 
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
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmDepot"  + this.tabIndex}
                                    onClick={async (e)=>
                                    {
                                        if(this.propertyObj.dt().CODE == "")
                                        {
                                            return
                                        }

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

                                                if(this.propData.length > 0)
                                                {
                                                    this.propertyObj.dt()[0].PROPERTY = JSON.stringify(this.propData)
                                                }
                                                
                                                if((await this.propertyObj.save()) == 0)
                                                {                                      
                                                    this.btnNew.setState({disabled:false});
                                                    this.btnSave.setState({disabled:true});              
                                                    tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                    await dialog(tmpConfObj1);
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
                                    <NdButton id="btnDelete" parent={this} icon="trash" type="danger"
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
                                            this.propertyObj.dt("REST_ITEM_PROPERTY").removeAll()
                                            this.propertyObj.dt().removeAt(0)
                                            await this.propertyObj.dt().delete();
                                            await this.propertyObj.dt("REST_ITEM_PROPERTY").delete();
                                            this.init(); 
                                        }
                                        
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
                            <Form colCount={3}>
                                {/* txtCode */}
                                <Item>
                                    <Label text={this.t("txtCode")} alignment="right" />
                                    <NdTextBox id="txtCode" parent={this} simple={true} dt={{data:this.propertyObj.dt(),field:"CODE"}}  
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
                                                            this.getProperty(data[0].CODE)
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
                                        let tmpResult = await this.checkProperty(this.txtCode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtCode.value = "";
                                        }
                                    }).bind(this)}
                                    param={this.param.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtCode',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmDepot"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator>  
                                    </NdTextBox>
                                    {/* ÖZELLİK SECIMI POPUP */}
                                    <NdPopGrid id={"pg_txtCode"} parent={this} container={"#root"}
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtCode.title")}
                                    deferRendering={true}
                                    data={{source:{select:{query : "SELECT CODE,NAME FROM REST_PROPERTY WHERE DELETED = 0"},sql:this.core.sql}}}                                   
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtCode.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtCode.clmName")} width={300} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </Item>
                                {/* txtTitle */}
                                <Item>
                                    <Label text={this.t("txtName")} alignment="right" />
                                    <NdTextBox id="txtTitle" parent={this} simple={true} dt={{data:this.propertyObj.dt(),field:"NAME"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}                                    
                                    param={this.param.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtName',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                                {/* txtSelection */}
                                <Item>
                                    <Label text={this.t("txtSelection")} alignment="right" />
                                    <NdTextBox id="txtSelection" parent={this} simple={true} dt={{data:this.propertyObj.dt(),field:"SELECTION"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}                                    
                                    param={this.param.filter({ELEMENT:'txtSelection',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'txtSelection',USERS:this.user.CODE})}
                                    >
                                    </NdTextBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2}>
                                <Item>
                                    <Form colCount={1}>
                                        <Item>
                                            <NdGrid parent={this} id={"grdList"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true}
                                            allowColumnResizing={true}
                                            selection={{mode:'multiple'}}
                                            height={'600'} 
                                            width={'100%'}
                                            dbApply={false}
                                            loadPanel={{enabled:true}}
                                            
                                            >
                                                <Scrolling mode="standart" />
                                                <Column dataField="ITEM_NAME" 
                                                        caption={this.t("grdList.ITEM_NAME")} 
                                                        width={500} 
                                                        defaultSortOrder="asc"
                                                        calculateSortValue={(data) => {
                                                            let text = data.ITEM_NAME || '';
                                                            // BASTAKI NOKTA VE BOSLUKLAR ICIN
                                                            text = text.replace(/^[.\s]+/, '');
                                                            
                                                            // SAYI ILE BASLIYORSA
                                                            if(/^\d+/.test(text)) {
                                                                let number = text.match(/^\d+/)[0];
                                                                let paddedNumber = number.padStart(10, '0');
                                                                return 'zzz' + paddedNumber + text.substring(number.length);
                                                            }
                                                            
                                                            return text.toUpperCase(); 
                                                        }}
                                                />
                                            </NdGrid>
                                        </Item>
                                        <Item location="after">
                                            <Button icon="add" 
                                            onClick={async (e)=>
                                            {
                                                this.pgProduct.show()
                                                this.pgProduct.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        let tmpEmpty = 
                                                        {
                                                            CUSER : this.user.CODE,
                                                            LUSER : this.user.CODE,
                                                            ITEM : data[0].GUID,
                                                            PROPERTY : this.propertyObj.dt()[0].GUID,
                                                            ITEM_NAME : data[0].NAME
                                                        }

                                                        this.propertyObj.dt('REST_ITEM_PROPERTY').push(tmpEmpty)
                                                    }
                                                }
                                            }}/>
                                            <Button icon="minus" 
                                            onClick={async (e)=>
                                            {
                                                for (let i = 0; i < this.grdList.getSelectedData().length; i++) 
                                                {
                                                    this.propertyObj.dt('REST_ITEM_PROPERTY').removeAt(this.grdList.getSelectedData()[i])
                                                }
                                                this.grdList.dataRefresh()
                                            }}/>
                                        </Item>
                                    </Form>
                                </Item>
                                <Item>
                                    <div className="row">
                                        <div className="col-12">
                                            <Form colCount={1}>
                                                <Item>
                                                    <NdGrid parent={this} id={"grdProps"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true}
                                                    allowColumnResizing={true}
                                                    height={'600'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    sorting={{mode:'none'}}
                                                    selection={{mode:"multiple"}}
                                                    loadPanel={{enabled:true}}
                                                    onInitialized={()=>
                                                    {
                                                        this.grdProps.dataRefresh({source:this.propData})
                                                    }}
                                                    >
                                                        <Editing mode="cell" allowUpdating={true}/>
                                                        <Scrolling mode="standart" />
                                                        <Column dataField="TITLE" caption={this.t("grdProps.TITLE")} width={400}/>
                                                        <Column dataField="VALUE" caption={""} width={50} dataType={"boolean"}/>
                                                    </NdGrid>
                                                </Item>
                                                <Item location="after">
                                                    <Button icon="add" 
                                                    onClick={async(e)=>
                                                    {
                                                        this.propData.push({TITLE:"",VALUE:false})
                                                        this.grdProps.dataRefresh({source:this.propData})
                                                    }}/>
                                                    <Button icon="minus" 
                                                    onClick={async(e)=>
                                                    {
                                                        for (let i = 0; i < this.grdProps.getSelectedData().length; i++) 
                                                        {
                                                            let tmpIndex = this.propData.findIndex(x => x.TITLE === this.grdProps.getSelectedData()[i].TITLE)
                                                            this.propData.splice(tmpIndex,1)
                                                            this.grdProps.dataRefresh({source:this.propData})
                                                        }
                                                    }}/>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    {/* ÜRÜN SECIMI POPUP */}
                    <div>
                        <NdPopGrid id={"pgProduct"} parent={this} container={"#root"}
                        visible={false}
                        position={{of:'#root'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={this.t("pgProduct.title")} 
                        deferRendering={true}
                        data={{source:{select:{query : "SELECT GUID,CODE,NAME FROM ITEMS WHERE DELETED = 0"},sql:this.core.sql}}}                                   
                        >
                            <Column dataField="CODE" caption={this.t("pgProduct.clmCode")} width={150} />
                            <Column dataField="NAME" caption={this.t("pgProduct.clmName")} width={300} defaultSortOrder="asc" />
                        </NdPopGrid>
                    </div>
                </ScrollView>
            </div>
        )
    }
}
