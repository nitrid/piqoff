import React from 'react';
import App from '../../../lib/app.js';
import { itemBarcodeCls } from '../../../../core/cls/items.js'


import ScrollView from 'devextreme-react/scroll-view';
import Toolbar, { Item } from 'devextreme-react/toolbar';

import NdTextBox, { Validator, RequiredRule } from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { Column } from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm, NdItem, NdLabel, NdEmptyItem } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class barcodeCard extends React.PureComponent
{
    constructor(props)
    {
        super(props) 
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.getUnit = this.getUnit.bind(this)

        this.itemBarcodeObj = new itemBarcodeCls();
        this.tabIndex = props.data.tabkey
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init(); 
    }  
    async init()
    {
        this.itemBarcodeObj.clearAll();
        this.cmbBarUnit.value= ''
        this.txtBarUnitFactor.setState({value:'0'})
        this.txtItem.setState({value:''})
        this.txtItemName.setState({value:''})
        this.txtBarcode.setState({value:''})

        this.pg_txtPartiLot.on('showing',()=>
        {
            this.pg_txtPartiLot.setSource(
            {
                source:
                {
                    select:
                    {
                        query : `SELECT GUID,LOT_CODE,SKT FROM ITEM_PARTI_LOT_VW_01 WHERE  UPPER(LOT_CODE) LIKE UPPER(@VAL) AND  ITEM = '${this.itemBarcodeObj.dt()[0].ITEM_GUID}'`,
                        param : ['VAL:string|50']
                    },
                    sql:this.core.sql
                }
            })
        })
    }
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpQuery = 
                {
                    query : `SELECT BARCODE,ITEM_GUID,ITEM_NAME,ITEM_CODE FROM ITEM_BARCODE_VW_01 WHERE BARCODE = @CODE`,
                    param : ['CODE:string|50'],
                    value : [pCode]
                }
                let tmpData = await this.core.sql.execute(tmpQuery) 

                if(tmpData.result.recordset.length > 0)
                {
                    this.toast.show({message:this.t("msgCheckBarcode.msg"),type:'warning'})

                    this.itemBarcodeObj.clearAll();
                    let tmpEmpty = {...this.itemBarcodeObj.empty};
                    tmpEmpty.BARCODE = ""
                    tmpEmpty.ITEM_GUID = tmpData.result.recordset[0].ITEM_GUID
                    tmpEmpty.ITEM_NAME = tmpData.result.recordset[0].ITEM_NAME
                    tmpEmpty.ITEM_CODE = tmpData.result.recordset[0].ITEM_CODE
                    tmpEmpty.UNIT_GUID = ''
                    this.itemBarcodeObj.addEmpty(tmpEmpty);  
                    this.getUnit(tmpData.result.recordset[0].ITEM_GUID)
                    resolve(2) //KAYIT VAR
                }
                else
                {
                    resolve(1) //KAYIT BULUNMADI
                }
            }
            else
            {
                resolve(0) //PARAMETRE BOŞ
            }
        });
    }   
    async getBarcode(pCode)
    {
        this.itemBarcodeObj.clearAll();
        
        await this.core.util.waitUntil(0)
        await this.itemBarcodeObj.load({BARCODE:pCode});
        this.getUnit(this.itemBarcodeObj.dt()[0].ITEM_GUID)
    }
    async getUnit(pGuid)
    {
        let tmpQuery = 
        {
            query : `SELECT GUID,NAME,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID`,
            param : ['ITEM_GUID:string|50'],
            value : [pGuid]
        }

        let tmpData = await this.core.sql.execute(tmpQuery) 
        
        if(tmpData.result.recordset.length > 0)
        {
            await this.cmbBarUnit.dataRefresh({source:tmpData.result.recordset})
        }

        if(this.cmbBarUnit.data.datatable.length > 0)
        {
            this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].FACTOR});
            let tmpGuid = this.cmbBarUnit.data.datatable.where({'TYPE':0})[0].GUID
            this.cmbBarUnit.value = tmpGuid;
            this.txtUnitTypeName.setState({value:this.t("MainUnit")})
        }

        await this.cmbBarUnit.data.datatable.refresh()
    }
    render()
    {           
        return (
            <div id={this.props.data.id + this.tabIndex}>                
                <ScrollView>                    
                    <div className="row px-2 pt-1">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>{this.init()}}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmBarcode"  + this.tabIndex}
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
                                                if((await this.itemBarcodeObj.save()) == 0)
                                                {
                                                    this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:'success'})
                                                    this.init()
                                                }
                                                else
                                                {
                                                    let tmpConfObj1 =
                                                    {
                                                        id:'msgSaveResult',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
                                                        button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'after'}],
                                                        content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                    }
                                                    await dialog(tmpConfObj1);
                                                }
                                            }          
                                        }                              
                                        else
                                        {
                                            this.toast.show({message:this.t("msgSaveValid.msg"),type:'warning'})
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
                        <div className="col-9">
                            <NdForm colCount={2} id={"frmBarcode"  + this.tabIndex}>
                                {/* txtItem */}
                                <NdItem>                                    
                                    <NdLabel text={this.t("txtItem")} alignment="right" />
                                    <NdTextBox id="txtItem" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_CODE"}} validationGroup={"frmBarcode"  + this.tabIndex}
                                    readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtItem.show()
                                                    this.pg_txtItem.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.itemBarcodeObj.clearAll();
                                                            let tmpEmpty = {...this.itemBarcodeObj.empty};
                                                            tmpEmpty.BARCODE = this.txtBarcode.value
                                                            tmpEmpty.TYPE = this.cmbPopBarType.value
                                                            tmpEmpty.ITEM_GUID = data[0].GUID
                                                            tmpEmpty.ITEM_NAME = data[0].NAME
                                                            tmpEmpty.ITEM_CODE = data[0].CODE
                                                            tmpEmpty.UNIT_GUID = ''
                                                            this.itemBarcodeObj.addEmpty(tmpEmpty);  
                                                            this.getUnit(data[0].GUID)
                                                        }
                                                    }
                                                }
                                            },
                                        ]
                                    }                       
                                    >   
                                        <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator>    
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtItem"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtItem.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,CODE,NAME,VAT FROM ITEMS_VW_04 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtItem.clmCode")} width={150} />
                                        <Column dataField="NAME" caption={this.t("pg_txtItem.clmName")} width={650} defaultSortOrder="asc" />
                                    </NdPopGrid>
                                </NdItem>                           
                                {/* txtItemName */}
                                <NdItem>
                                    <NdLabel text={this.t("txtItemName")} alignment="right" />
                                    <NdTextBox id="txtItemName" parent={this} simple={true} readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"ITEM_NAME"}} />
                                </NdItem>
                                 {/* txtBarcode */}
                                 <NdItem>                                    
                                    <NdLabel text={this.t("txtBarcode")} alignment="right" />
                                    <NdTextBox id="txtBarcode" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"BARCODE"}}  placeholder={this.t("barcodePlace")} validationGroup={"frmBarcode"  + this.tabIndex}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtBarcode.value = Math.floor(Date.now() / 10)
                                                }
                                            }
                                        ]
                                    }
                                    onValueChanged={(e)=>
                                    {
                                        if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                        {
                                            this.cmbPopBarType.value = "2"
                                            return;
                                        }
                                        if(e.value.length == 8)
                                        {                                            
                                            this.cmbPopBarType.value = "0"
                                        }
                                        else if(e.value.length == 13)
                                        {
                                            this.cmbPopBarType.value = "1"
                                        }
                                        else
                                        {
                                            this.cmbPopBarType.value = "2"
                                        }
                                    }}
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkBarcode(this.txtBarcode.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtBarcode.value = "";
                                        }
                                    }).bind(this)} 
                                    param={this.param.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})} 
                                    access={this.access.filter({ELEMENT:'txtBarcode',USERS:this.user.CODE})}                                
                                    >     
                                        <Validator validationGroup={"frmBarcode"  + this.tabIndex}>
                                            <RequiredRule message={this.t("validCode")} />
                                        </Validator>   
                                    </NdTextBox>      
                                    {/* BARCODE SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtBarcode"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtBarcode.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : `SELECT GUID,BARCODE,ITEM_CODE,ITEM_NAME FROM ITEM_BARCODE_VW_01 WHERE UPPER(BARCODE) LIKE UPPER(@VAL) OR UPPER(ITEM_NAME) LIKE UPPER(@VAL) OR UPPER(ITEM_CODE) LIKE UPPER(@VAL)`,
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="BARCODE" caption={this.t("pg_txtBarcode.clmBarcode")} width={150} />
                                        <Column dataField="ITEM_CODE" caption={this.t("pg_txtBarcode.clmItemCode")} width={650} defaultSortOrder="asc" />
                                        <Column dataField="ITEM_NAME" caption={this.t("pg_txtBarcode.clmItemName")} width={650} defaultSortOrder="asc" />
                                        
                                    </NdPopGrid>
                                </NdItem> 
                                <NdEmptyItem/>
                                {/* txtPartiLot */}
                                <NdItem>                                    
                                    <NdLabel text={this.t("txtPartiLot")} alignment="right" />
                                    <NdTextBox id="txtPartiLot" parent={this} simple={true} dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"LOT_CODE"}}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    if(!this.itemBarcodeObj.dt().length || !this.itemBarcodeObj.dt()[0].ITEM_GUID)
                                                    {
                                                        return;
                                                    }

                                                    this.pg_txtPartiLot.onClick = async(data) =>
                                                    {
                                                        this.txtPartiLot.value = data[0].LOT_CODE
                                                        this.itemBarcodeObj.dt()[0].LOT_CODE = data[0].LOT_CODE
                                                        this.itemBarcodeObj.dt()[0].PARTILOT_GUID = data[0].GUID
                                                    }
                                                    this.pg_txtPartiLot.setVal(this.txtPartiLot.value)
                                                }
                                            }
                                        ]
                                    }   
                                    onEnterKey={()=>
                                    {
                                        this.pg_txtPartiLot.onClick = async(data) =>
                                        {
                                            this.txtPartiLot.value = data[0].LOT_CODE
                                            this.itemBarcodeObj.dt()[0].LOT_CODE = data[0].LOT_CODE
                                            this.itemBarcodeObj.dt()[0].PARTILOT_GUID = data[0].GUID
                                        }
                                        this.pg_txtPartiLot.setVal(this.txtPartiLot.value)
                                    }}                          
                                    >     
                                    </NdTextBox>      
                                    {/* PARTILOT SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtPartiLot"} parent={this} container={'#' + this.props.data.id + this.tabIndex} 
                                    visible={false}
                                    position={{of:'#' + this.props.data.id + this.tabIndex}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_partiLot.title")} 
                                    search={true}
                                    deferRendering={true}
                                    >
                                        <Column dataField="LOT_CODE" caption={this.t("pg_partiLot.clmLotCode")} width={150} />
                                        <Column dataField="SKT" caption={this.t("pg_partiLot.clmSkt")} width={300} dataType={"date" } defaultSortOrder="asc" /> 
                                    </NdPopGrid>
                                </NdItem> 
                                <NdEmptyItem/>
                                <NdItem>
                                    <NdLabel text={this.t("cmbPopBarType")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarType"
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}/>
                                </NdItem>
                                <NdEmptyItem/>
                                {/* cmbBarUnit */}
                                <NdItem>
                                    <NdLabel text={this.t("cmbBarUnit")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbBarUnit"  searchEnabled={true}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_GUID"}} 
                                    displayExpr="NAME"                       
                                    valueExpr="GUID"
                                    onValueChanged={(async(e)=>
                                    {
                                        if(e.value != '00000000-0000-0000-0000-000000000000' && e.value != '')
                                        {
                                            this.txtBarUnitFactor.setState({value:this.cmbBarUnit.data.datatable.where({'GUID':e.value})[0].FACTOR});
                                            let tmpUnitType = this.cmbBarUnit.data.datatable.where({'GUID':e.value})[0].TYPE
                                            if(tmpUnitType == 0)
                                            {
                                                this.txtUnitTypeName.setState({value:this.t("MainUnit")})
                                            }
                                            else
                                            {
                                                this.txtUnitTypeName.setState({value:this.t("SubUnit")})
                                            }
                                        }
                                    }).bind(this)}
                                    />
                                </NdItem>
                                {/* txtBarUnitFactor */}
                                <NdItem>
                                    <NdLabel text={this.t("txtBarUnitFactor")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtBarUnitFactor" readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value}
                                    dt={{data:this.itemBarcodeObj.dt('ITEM_BARCODE'),field:"UNIT_FACTOR"}} />
                                </NdItem>
                                 {/* txtBarUnitFactor */}
                                 <NdItem>
                                    <NdLabel text={this.t("txtUnitTypeName")} alignment="right" />
                                    <NdTextBox simple={true} parent={this} id="txtUnitTypeName" readOnly={true}
                                    upper={this.sysParam.filter({ID:'onlyBigChar',USERS:this.user.CODE}).getValue().value} />
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>                                   
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )        
    }
}