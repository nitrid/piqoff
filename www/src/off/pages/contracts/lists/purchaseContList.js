import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import Form, { Label } from 'devextreme-react/form';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling} from '../../../../core/react/devex/grid.js';
import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdDropDownBox from '../../../../core/react/devex/dropdownbox.js';
import NdListBox from '../../../../core/react/devex/listbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import { dialog } from '../../../../core/react/devex/dialog.js';

export default class purchaseContList extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            columnListValue : ['CDATE_FORMAT','LUSER_NAME','ITEM_CODE','ITEM_NAME','CUSTOMER_NAME','PRICE','QUANTITY']
        }
        
        this.core = App.instance.core;
        this.columnListData = 
        [
            {CODE : "CDATE_FORMAT",NAME : this.t("grdPurcContList.clmCreateDate")},
            {CODE : "LUSER_NAME",NAME : this.t("grdPurcContList.clmUser")},
            {CODE : "ITEM_CODE",NAME : this.t("grdPurcContList.clmCode")},
            {CODE : "ITEM_NAME",NAME : this.t("grdPurcContList.clmName")}, 
            {CODE : "CUSTOMER_NAME",NAME : this.t("grdPurcContList.clmCustomerName")},                                   
            {CODE : "PRICE",NAME : this.t("grdPurcContList.clmPrıce")},
            {CODE : "QUANTITY",NAME : this.t("grdPurcContList.clmQuantity")},
            {CODE : "START_DATE",NAME : this.t("grdPurcContList.clmStartDate")},
            {CODE : "FINISH_DATE",NAME : this.t("grdPurcContList.clmFinishDate")},
            {CODE : "DEPOT_NAME",NAME : this.t("grdPurcContList.clmDepotName")},
        ]
        this.groupList = [];
        this._btnGetClick = this._btnGetClick.bind(this)
        this._columnListBox = this._columnListBox.bind(this)
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
        this.txtCustomerCode.CODE = ''
    }
    _columnListBox(e)
    {
        let onOptionChanged = (e) =>
        {
            if (e.name == 'selectedItemKeys') 
            {
                this.groupList = [];
                if(typeof e.value.find(x => x == 'CDATE_FORMAT') != 'undefined')
                {
                    this.groupList.push('CDATE_FORMAT')
                }
                if(typeof e.value.find(x => x == 'LUSER_NAME') != 'undefined')
                {
                    this.groupList.push('LUSER_NAME')
                }
                if(typeof e.value.find(x => x == 'ITEM_CODE') != 'undefined')
                {
                    this.groupList.push('ITEM_CODE')
                }                
                if(typeof e.value.find(x => x == 'ITEM_NAME') != 'undefined')
                {
                    this.groupList.push('ITEM_NAME')
                }
                if(typeof e.value.find(x => x == 'CUSTOMER_NAME') != 'undefined')
                {
                    this.groupList.push('CUSTOMER_NAME')
                }
                if(typeof e.value.find(x => x == 'PRICE') != 'undefined')
                {
                    this.groupList.push('PRICE')
                }
                if(typeof e.value.find(x => x == 'QUANTITY') != 'undefined')
                {
                    this.groupList.push('QUANTITY')
                }
                
                for (let i = 0; i < this.grdPurcContList.devGrid.columnCount(); i++) 
                {
                    if(typeof e.value.find(x => x == this.grdPurcContList.devGrid.columnOption(i).name) == 'undefined')
                    {
                        this.grdPurcContList.devGrid.columnOption(i,'visible',false)
                    }
                    else
                    {
                        this.grdPurcContList.devGrid.columnOption(i,'visible',true)
                    }
                }

                this.setState(
                    {
                        columnListValue : e.value
                    }
                )
            }
        }
        
        return(
            <NdListBox id='columnListBox' parent={this}
            data={{source: this.columnListData}}
            width={'100%'}
            showSelectionControls={true}
            selectionMode={'multiple'}
            displayExpr={'NAME'}
            keyExpr={'CODE'}
            value={this.state.columnListValue}
            onOptionChanged={onOptionChanged}
            >
            </NdListBox>
        )
    }
    async _btnGetClick()
    {
        
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query : "SELECT * FROM ITEM_PRICE_VW_01 " +
                            "WHERE ((CUSTOMER_CODE = @CUSTOMER_CODE) OR (@CUSTOMER_CODE = '')) AND "+ 
                            " TYPE = 1 ORDER BY CUSTOMER_CODE,ITEM_CODE",
                    param : ['CUSTOMER_CODE:string|50'],
                    value : [this.txtCustomerCode.CODE]
                },
                sql : this.core.sql
            }
        }
        
        await this.grdPurcContList.dataRefresh(tmpSource)
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'cnt_01_001',
                                                text: this.t('menu'),
                                                path: '../pages/contracts/cards/purchaseContract.js'
                                            })
                                        }
                                    }    
                                } />
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
                            <Form colCount={2} id="frmCriter">
                            <Item>
                                <Label text={this.t("txtCustomerCode")} alignment="right" />
                                <NdTextBox id="txtCustomerCode" parent={this} simple={true} 
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtCustomerCode.show()
                                                this.pg_txtCustomerCode.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtCustomerCode.setState({value:data[0].TITLE})
                                                        this.txtCustomerCode.CODE = data[0].CODE
                                                    }
                                                }
                                            }
                                        },
                                    ]
                                }
                                >
                                </NdTextBox>
                                {/*CARI SECIMI POPUP */}
                                <NdPopGrid id={"pg_txtCustomerCode"} parent={this} container={"#root"}
                                visible={false}
                                position={{of:'#root'}} 
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
                                    <Column dataField="CODE" caption={this.t("pg_txtCustomerCode.clmCode")} width={150} />
                                    <Column dataField="TITLE" caption={this.t("pg_txtCustomerCode.clmTitle")} width={500} defaultSortOrder="asc" />
                                    <Column dataField="TYPE_NAME" caption={this.t("pg_txtCustomerCode.clmTypeName")} width={150} />
                                    <Column dataField="GENUS_NAME" caption={this.t("pg_txtCustomerCode.clmGenusName")} width={150} filterType={"include"} filterValues={['Tedarikçi']}/>
                                    
                                </NdPopGrid>
                            </Item> 
                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3">
                            <NdDropDownBox simple={true} parent={this} id="cmbColumn"
                            value={this.state.columnListValue}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            data={{source: this.columnListData}}
                            contentRender={this._columnListBox}
                            />
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
                            <NdGrid id="grdPurcContList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            >                            
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />

                                <Column dataField="CDATE_FORMAT" caption={this.t("grdPurcContList.clmCreateDate")} visible={true} width={200}/> 
                                <Column dataField="LUSER_NAME" caption={this.t("grdPurcContList.clmUser")} visible={true} width={200}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdPurcContList.clmCode")} visible={true} width={200}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdPurcContList.clmName")} visible={true}/> 
                                <Column dataField="CUSTOMER_NAME" caption={this.t("grdPurcContList.clmCustomerName")} visible={true}/> 
                                <Column dataField="PRICE" caption={this.t("grdPurcContList.clmPrıce")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}} width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdPurcContList.clmQuantity")} visible={true} width={150}/> 
                                <Column dataField="START_DATE" caption={this.t("grdPurcContList.clmStartDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>  
                                <Column dataField="FINISH_DATE" caption={this.t("grdPurcContList.clmFinishDate")} visible={false} 
                                editorOptions={{value:null}}
                                cellRender={(e) => 
                                {
                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                    {
                                        return e.text
                                    }
                                    
                                    return
                                }}/>  
                                <Column dataField="DEPOT_NAME" caption={this.t("grdPurcContList.clmDepotName")} visible={false} />              
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}