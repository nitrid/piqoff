import React from 'react';
import App from '../../../lib/app.js';
import {itemsCls,itemPriceCls,itemBarcodeCls,itemMultiCodeCls,unitCls} from '../../../lib/cls/items.js'

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item } from 'devextreme-react/form';
import TabPanel from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';

import NdTextBox from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { datatable } from '../../../../core/core.js';

export default class itemCard extends React.Component
{
    constructor()
    {
        super()
 
        this.core = App.instance.core;
        this.itemsObj = new itemsCls();
        this.itemsPriceSupply = new itemPriceCls();        
        
        this._onItemRendered = this._onItemRendered.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init();      
    }    
    async init()
    {              
        this.itemsObj.clearAll();  
        this.itemsPriceSupply.clearAll();
        
        let tmpUnit = new unitCls();
        await tmpUnit.load()

        let tmpMainUnitObj = {...this.itemsObj.itemUnit.empty}
        tmpMainUnitObj.TYPE = 0
        tmpMainUnitObj.TYPE_NAME = 'Ana Birim'
        if(tmpUnit.dt(0).length > 0)
        {
            tmpMainUnitObj.ID = tmpUnit.dt(0)[0].ID
        }
        
        let tmpUnderUnitObj = {...this.itemsObj.itemUnit.empty}
        tmpUnderUnitObj.TYPE = 1,
        tmpUnderUnitObj.TYPE_NAME = 'Alt Birim'
        if(tmpUnit.dt(0).length > 0)
        {
            tmpUnderUnitObj.ID = tmpUnit.dt(0)[0].ID
        }

        this.itemsObj.addEmpty();
        this.itemsObj.itemBarcode.addEmpty();     
        this.itemsObj.itemUnit.addEmpty(tmpMainUnitObj);
        this.itemsObj.itemUnit.addEmpty(tmpUnderUnitObj);                
        
        this.txtRef.value = Math.floor(Date.now() / 1000)
        this.txtTedarikci.value = "";   
        this.txtBarkod.readOnly = false;     
        
        // this.itemsObj.itemPrice.dt().on('onAddRow',(pItem)=>
        // {
        //     console.log(pItem)
        // })
        
        //this.itemsObj.dt('ITEM_UNIT').find(x => x.TYPE == 0).TYPE = 1;
        //this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].TYPE = 1
        //this.x = this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})
        // console.log(this.itemsObj.dt('ITEM_UNIT'))
        //this.itemsObj.dt('ITEM_UNIT').where({TYPE:0})[0].TYPE = 2
        //console.log(this.itemsObj.dt('ITEM_UNIT'))
        //this.itemsObj.dt('ITEMS')[0].CODE = '111'
        //this.dtToForm();
        // this.itemsCls.dt('ITEMS')[0].CODE = 1111
        // this.itemsCls.dt('ITEMS')[0].CODE = 1111222
        // console.log(this.txtRef.value)  
        // await this.itemsCls.getVat()
        // await this.cmbVergi.dataRefresh(
        //     {
        //         source : 
        //         {
        //             select : 
        //             {
        //                 query : "SELECT * FROM [dbo].[VAT] ",
        //             },
        //             sql : this.core.sql
        //         }
        //     })
        //await this.cmbVergi.dataRefresh({source:this.itemsCls.data.get('VAT').toArray()})
    }
    async getItem(pCode)
    {
        this.itemsObj.clearAll();
        await this.itemsObj.load({CODE:pCode});
        //TEDARİKÇİ FİYAT GETİR İŞLEMİ.                
        await this.itemsPriceSupply.load({ITEM_CODE:pCode,TYPE:1})    
        this.txtBarkod.readOnly = true;
    }
    async checkItem(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemsCls().load({CODE:pCode});
    
                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'txtRef',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz stok sistem de kayıtlı !</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(pCode)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
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
    async checkBarcode(pCode)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemBarcodeCls().load({BARCODE:pCode});

                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'txtBarkod',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz barkod sistem de kayıtlı !</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(tmpData[0].ITEM_CODE)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
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
    async checkMultiCode(pCode,pSupply)
    {
        return new Promise(async resolve => 
        {
            if(pCode !== '')
            {
                let tmpData = await new itemMultiCodeCls().load({MULTICODE:pCode,CUSTOMER_CODE:pSupply});

                if(tmpData.length > 0)
                {
                    let tmpConfObj =
                    {
                        id:'txtBarkod',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:'Ürüne Git',location:'before'},{id:"btn02",caption:'Tamam',location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>Girmiş olduğunuz tedarikçi stok kodu sistem de kayıtlı !</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(pResult == 'btn01')
                    {
                        this.getItem(tmpData[0].ITEM_CODE)
                        resolve(2) //KAYIT VAR
                    }
                    else
                    {
                        resolve(3) //TAMAM BUTONUNA BASILDI
                    }
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
    async _onItemRendered(e)
    {
        await this.core.util.waitUntil(10)
        if(e.itemData.title == "Fiyat")
        {        
            await this.grdFiyat.dataRefresh({source:this.itemsObj.itemPrice.dt('ITEM_PRICE')});
        }
        else if(e.itemData.title == "Birim")
        {
            await this.grdBirim.dataRefresh({source:this.itemsObj.itemUnit.dt('ITEM_UNIT')});
        }
        else if(e.itemData.title == "Barkod")
        {
            await this.grdBarkod.dataRefresh({source:this.itemsObj.itemBarcode.dt('ITEM_BARCODE')});
        }
        else if(e.itemData.title == "Tedarikçi")
        {
            await this.grdTedarikci.dataRefresh({source:this.itemsObj.itemMultiCode.dt('ITEM_MULTICODE')});
        }
        else if(e.itemData.title == "Tedarikçi Fiyat")
        {
            await this.grdTedarikciFiyat.dataRefresh({source:this.itemsPriceSupply.dt()});
        }
    }
    render()
    {
        return (
            <div>
                <div id="csx"></div>
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
                                        icon: 'file',
                                        onClick: async () => 
                                        {
                                            this.init();
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
                                        icon: 'floppy',
                                        onClick: async () => 
                                        {
                                            console.log(this.itemsObj)
                                            console.log(this.txtBarkod)
                                            //await this.itemsObj.itemPrice.save();
                                            await this.itemsObj.save()
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
                                        icon: 'trash',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: '../pages/items/cards/itemCard.js'
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
                                        icon: 'copy',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: '../pages/items/cards/itemCard.js'
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
                                        icon: 'print',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_01_001',
                                                text: 'Stok Tanımları',
                                                path: '../pages/items/cards/itemCard.js'
                                            })
                                        }
                                    }    
                                } />
                            </Toolbar>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">                        
                        <div className="col-9">
                            <Form colCount={2} id="frmItems">
                                {/* txtRef */}
                                <Item>
                                    <Label text={"Referans "} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"CODE"}} 
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtRef.show()
                                                    this.pg_txtRef.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.getItem(data[0].CODE)
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtRef.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        let tmpResult = await this.checkItem(this.txtRef.value)
                                        if(tmpResult == 3)
                                        {
                                            this.txtRef.value = "";
                                        }
                                    }).bind(this)}                                    
                                    >                                        
                                    </NdTextBox>
                                </Item>
                                {/* cmbUrunGrup */}
                                <Item>
                                    <Label text={"Ürün Grubu "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUrunGrup" showClearButton={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"MAIN_GRP"}}                                    
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    searchEnabled={true}
                                    searchExpr={"NAME"}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM ITEM_GROUP ORDER BY NAME ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                {/* txtTedarikci */}
                                <Item>
                                    <Label text={"Tedarikçi "} alignment="right" />
                                    <NdTextBox id="txtTedarikci" parent={this} simple={true}
                                    dt={{data:this.itemsObj.dt('ITEM_MULTICODE'),field:"CUSTOMER_CODE"}}
                                    readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:()=>
                                                {
                                                    this.txtPopTedKodu.value = "";
                                                    this.txtPopTedAdi.value = "";
                                                    this.txtPopTedStokKodu.value = "";
                                                    this.txtPopTedFiyat.value = "0";
                                                    this.popTedarikci.show();
                                                }
                                            }
                                        ]
                                    }>
                                    </NdTextBox>
                                </Item>
                                {/* txtTedarikciStok */}
                                {/* <Item>
                                    <Label text={"Tedarikçi Stok "} alignment="right" />
                                    <NdTextBox id="txtTedarikciStok" parent={this} simple={true} />
                                </Item> */}
                                {/* cmbUrunCins */}
                                <Item>
                                    <Label text={"Ürün Cinsi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbUrunCins" dt={{data:this.itemsObj.dt('ITEMS'),field:"TYPE"}}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    data={{source:{select:{query:"SELECT ID,VALUE FROM ITEM_TYPE ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                {/* txtBarkod */}
                                <Item>
                                    <Label text={"Barkod "} alignment="right" />
                                    <NdTextBox id="txtBarkod" parent={this} simple={true}
                                    dt={{data:this.itemsObj.dt('ITEM_BARCODE'),field:"BARCODE"}}
                                    button=
                                    {
                                        [
                                            {
                                                id:'001',
                                                icon:'add',
                                                onClick:()=>
                                                {
                                                    this.txtPopBarkod.value = "";
                                                    this.cmbPopBarTip.value = "0";
                                                    this.cmbPopBarBirim.value = "Unité"
                                                    this.popBarkod.show();
                                                }
                                            }
                                        ]
                                    }
                                    onChange={(async()=>
                                    {
                                        await this.checkBarcode(this.txtBarkod.value)
                                    }).bind(this)}
                                    />
                                </Item>  
                                {/* cmbVergi */}
                                <Item>
                                    <Label text={"Vergi "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbVergi" height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"VAT"}}
                                    displayExpr="VAT"                       
                                    valueExpr="VAT"
                                    data={{source:{select:{query:"SELECT VAT FROM VAT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>                              
                                {/* cmbAnaBirim */}
                                <Item>
                                    <Label text={"Ana Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAnaBirim" height='fit-content' 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:0}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAnaBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:0}}}/>
                                        </div>
                                    </div>
                                </Item>     
                                {/* cmbMensei */}
                                <Item>
                                    <Label text={"Menşei "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbMensei" showClearButton={true} height='fit-content' dt={{data:this.itemsObj.dt('ITEMS'),field:"ORGINS_GRP"}}
                                    displayExpr="NAME"                       
                                    valueExpr="CODE"
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM COUNTRY ORDER BY CODE ASC"},sql:this.core.sql}}}
                                    />
                                </Item>                           
                                {/* cmbAltBirim */}
                                <Item>
                                    <Label text={"Alt Birim "} alignment="right" />
                                    <div className="row">
                                        <div className="col-4 pe-0">
                                            <NdSelectBox simple={true} parent={this} id="cmbAltBirim" height='fit-content' 
                                            dt={{data:this.itemsObj.dt('ITEM_UNIT'),field:"ID",display:"NAME",filter:{TYPE:1}}}
                                            style={{borderTopRightRadius:'0px',borderBottomRightRadius:'0px'}}
                                            displayExpr="NAME"                       
                                            valueExpr="ID"
                                            data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                            />
                                        </div>
                                        <div className="col-4 ps-0">
                                            <NdTextBox id="txtAltBirim" parent={this} simple={true} style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}} 
                                            dt={{id:"txtAltBirim",data:this.itemsObj.dt('ITEM_UNIT'),field:"FACTOR",filter:{TYPE:1}}} />
                                        </div>
                                    </div>                                     
                                </Item>   
                                {/* Boş */}
                                <Item> </Item>                             
                                {/* txtUrunAdi */}
                                <Item>
                                    <Label text={"Ürün Adı "} alignment="right" />
                                    <NdTextBox id="txtUrunAdi" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"NAME"}}/>
                                </Item>
                                {/* txtKisaAdi */}
                                <Item>
                                    <Label text={"Kısa Adı "} alignment="right" />
                                        <NdTextBox id="txtKisaAdi" parent={this} simple={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"SNAME"}}/>
                                </Item>
                            </Form>
                        </div>
                        <div className="col-3">
                        IMAJ
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={6} id="frmChkBox">
                                {/* chkAktif */}
                                <Item>
                                    <Label text={"Aktif "} alignment="right" />
                                    <NdCheckBox id="chkAktif" parent={this} defaultValue={true} dt={{data:this.itemsObj.dt('ITEMS'),field:"STATUS"}}></NdCheckBox>
                                </Item>
                                {/* chkKasaTartilsin */}
                                <Item>
                                    <Label text={"Kasada Tartılsın "} alignment="right" />
                                    <NdCheckBox id="chkKasaTartilsin" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"WEIGHING"}}></NdCheckBox>
                                </Item>
                                {/* chkSatisBirlestir */}
                                <Item>
                                    <Label text={"Satış da Satır Birleştir "} alignment="right" />
                                    <NdCheckBox id="chkSatisBirlestir" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"SALE_JOIN_LINE"}}></NdCheckBox>
                                </Item>
                                {/* chkTicketRest */}
                                <Item>
                                    <Label text={"Ticket Rest. "} alignment="right" />
                                    <NdCheckBox id="chkTicketRest" parent={this} defaultValue={false} dt={{data:this.itemsObj.dt('ITEMS'),field:"TICKET_REST"}}></NdCheckBox>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <div className='row px-2 pt-2'>
                        <div className='col-12'>
                            <TabPanel height="100%" onItemRendered={this._onItemRendered}>
                                <Item title="Fiyat">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaliyetFiyat" parent={this} title={"Maliyet Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"COST_PRICE"}}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinSatisFiyat" parent={this} title={"Min. Satış Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"MIN_PRICE"}}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxSatisFiyat" parent={this} title={"Max. Satış Fiyatı"} titleAlign={"top"} dt={{data:this.itemsObj.dt('ITEMS'),field:"MAX_PRICE"}}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtSonAlisFiyat" parent={this} title={"Son Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-4'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {                                                        
                                                        this.dtPopFiyBasTarih.value = "1970-01-01"
                                                        this.dtPopFiyBitTarih.value = "1970-01-01"
                                                        this.txtPopFiyMiktar.value = "0"
                                                        this.txtPopFiyFiyat.value = "0"

                                                        this.popFiyat.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdFiyat"} 
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
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="DEPOT" caption="Depo" />
                                                <Column dataField="START_DATE" caption="Baş.Tarih" dataType="date" 
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="FINISH_DATE" caption="Bit.Tarih" dataType="date"
                                                editorOptions={{value:null}}
                                                cellRender={(e) => 
                                                {
                                                    if(moment(e.value).format("YYYY-MM-DD") != '1970-01-01')
                                                    {
                                                        return e.text
                                                    }
                                                    
                                                    return
                                                }}/>
                                                <Column dataField="QUANTITY" caption="Miktar"/>
                                                <Column dataField="VAT_EXT" caption="Vergi Hariç" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="CUSTOMER_NAME" caption="Cari"/>
                                                <Column dataField="PRICE" caption="Fiyat" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="GROSS_MARGIN" caption="Brüt Marj" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="NET_MARGIN" caption="Net Marj" dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Birim">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtAltBirimFiyat" parent={this} title={"Alt Birim Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-10'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {
                                                        this.cmbPopBirimTip.value = "2"
                                                        this.cmbPopBirimAdi.value = "001"
                                                        this.txtPopBirimKatsayi.value = "0"
                                                        this.txtPopBirimAgirlik.value = "0"
                                                        this.txtPopBirimHacim.value = "0";
                                                        this.txtPopBirimEn.value = "0";
                                                        this.txtPopBirimBoy.value = "0"
                                                        this.txtPopBirimYukseklik.value = "0"

                                                        this.popBirim.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBirim"} 
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
                                                <Column dataField="TYPE_NAME" caption="Tip" />
                                                <Column dataField="NAME" caption="Adı" />
                                                <Column dataField="FACTOR" caption="Katsayı"/>
                                                <Column dataField="WEIGHT" caption="Ağırlık"/>
                                                <Column dataField="VOLUME" caption="Hacim"/>
                                                <Column dataField="WIDTH" caption="En"/>
                                                <Column dataField="HEIGHT" caption="Boy"/>
                                                <Column dataField="SIZE" caption="Yükseklik"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Barkod">
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {
                                                        this.txtPopBarkod.value = "";
                                                        this.cmbPopBarTip.value = "0";
                                                        this.cmbPopBarBirim.value = "Unité"
                                                        this.popBarkod.show();
                                                    }}/>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdBarkod"} 
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
                                                <Column dataField="BARCODE" caption="Barkod" />
                                                <Column dataField="UNIT_NAME" caption="Birim" />
                                                <Column dataField="TYPE_NAME" caption="Tip"/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>                                
                                <Item title="Tedarikçi">
                                    <div className='row px-2 py-2'>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMinAlisFiyat" parent={this} title={"Min. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-2'>
                                            <NdTextBox id="txtMaxAlisFiyat" parent={this} title={"Max. Alış Fiyatı"} titleAlign={"top"}/>
                                        </div>
                                        <div className='col-8'>
                                            <Toolbar>
                                                <Item location="after">
                                                    <Button icon="add"
                                                    onClick={()=>
                                                    {
                                                        this.txtPopTedStokKodu.value = "";
                                                        this.txtPopTedFiyat.value = "0";
                                                        this.popTedarikci.show();
                                                    }}/>                                                                                                            
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdTedarikci"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="CUSTOMER_CODE" caption="Kodu" />
                                                <Column dataField="CUSTOMER_NAME" caption="Adı" />
                                                <Column dataField="CUSTOMER_PRICE_USER_NAME" caption="Kullanıcı" />
                                                <Column dataField="CUSTOMER_PRICE_DATE" caption="Son Fiyat Tarih" allowEditing={false} dataType="date"/>
                                                <Column dataField="CUSTOMER_PRICE" caption="Fiyat" allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption="Tedarikçi Stok Kodu" />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Tedarikçi Fiyat">
                                    <div className='row px-2 py-2'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdTedarikciFiyat"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            allowColumnReordering={true} 
                                            allowColumnResizing={true} 
                                            height={'100%'} 
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={5} />
                                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} />
                                                <Column dataField="LOG_USER_NAME" caption="Kullanıcı" />
                                                <Column dataField="CUSTOMER_CODE" caption="Kodu" />
                                                <Column dataField="CUSTOMER_NAME" caption="Adı" />
                                                <Column dataField="CHANGE_DATE" caption="Son Fiyat Tarih" allowEditing={false} dataType="date"/>
                                                <Column dataField="PRICE" caption="Fiyat" allowEditing={false} dataType="number" format={{ style: "currency", currency: "EUR",precision: 2}}/>
                                                <Column dataField="MULTICODE" caption="Tedarikçi Stok Kodu" />
                                            </NdGrid>
                                        </div>
                                    </div>
                                </Item>
                                <Item title="Bilgi"></Item>
                            </TabPanel>
                        </div>
                    </div>
                    {/* STOK SEÇİM POPUP */}
                    <div>
                        <NdPopGrid id={"pg_txtRef"} parent={this} container={".dx-multiview-wrapper"} 
                        position={{of:'#page'}} 
                        showTitle={true} 
                        showBorders={true}
                        width={'90%'}
                        height={'90%'}
                        title={'Stok Seçim'} 
                        data={{source:{select:{query : "SELECT CODE,NAME FROM ITEMS"},sql:this.core.sql}}}
                        />
                    </div>
                    {/* FİYAT POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popFiyat"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Fiyat Ekle"}
                        container={".dx-multiview-wrapper"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#page'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Baş.Tarih "} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id="dtPopFiyBasTarih"/>
                                </Item>
                                <Item>
                                    <Label text={"Bit.Tarih "} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id="dtPopFiyBitTarih"/>
                                </Item>
                                <Item>
                                    <Label text={"Miktar "} alignment="right" />
                                    <NdTextBox id={"txtPopFiyMiktar"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Fiyat "} alignment="right" />
                                    <NdTextBox id={"txtPopFiyFiyat"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemPrice.empty};
                                                console.log(this.itemsObj.dt()[0].GUID )
                                                tmpEmpty.TYPE = 0
                                                tmpEmpty.TYPE_NAME = 'Standart'
                                                tmpEmpty.ITEM_GUID = this.itemsObj.dt()[0].GUID 
                                                tmpEmpty.DEPOT = "0"
                                                tmpEmpty.START_DATE = this.dtPopFiyBasTarih.value
                                                tmpEmpty.FINISH_DATE = this.dtPopFiyBitTarih.value
                                                tmpEmpty.PRICE = this.txtPopFiyFiyat.value
                                                tmpEmpty.QUANTITY = this.txtPopFiyMiktar.value

                                                this.itemsObj.itemPrice.addEmpty(tmpEmpty); 
                                                this.popFiyat.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBirim.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BİRİM POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBirim"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Birim Ekle"}
                        container={".dx-multiview-wrapper"} 
                        width={'500'}
                        height={'510'}
                        position={{of:'#page'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Tip "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBirimTip"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="2"
                                    data={{source:[{ID:"2",VALUE:"Üst Birim"}]}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Birim Adı "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBirimAdi"
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value="001"
                                    data={{source:{select:{query:"SELECT ID,NAME,SYMBOL FROM UNIT ORDER BY ID ASC"},sql:this.core.sql}}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Katsayı "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimKatsayi"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Ağırlık "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimAgirlik"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Hacim "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimHacim"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"En "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimEn"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Boy "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimBoy"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Yükseklik "} alignment="right" />
                                    <NdTextBox id={"txtPopBirimYukseklik"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemUnit.empty};
                                                
                                                tmpEmpty.TYPE = this.cmbPopBirimTip.value
                                                tmpEmpty.TYPE_NAME = this.cmbPopBirimTip.displayValue
                                                tmpEmpty.ID = this.cmbPopBirimAdi.value
                                                tmpEmpty.NAME = this.cmbPopBirimAdi.displayValue
                                                tmpEmpty.FACTOR = this.txtPopBirimKatsayi.value
                                                tmpEmpty.WEIGHT = this.txtPopBirimAgirlik.value
                                                tmpEmpty.VOLUME = this.txtPopBirimHacim.value
                                                tmpEmpty.WIDTH = this.txtPopBirimEn.value
                                                tmpEmpty.HEIGHT = this.txtPopBirimBoy.value
                                                tmpEmpty.SIZE = this.txtPopBirimYukseklik.value

                                                this.itemsObj.itemUnit.addEmpty(tmpEmpty); 
                                                this.popBirim.hide();
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBirim.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>
                    {/* BARKOD POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popBarkod"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Barkod Ekle"}
                        container={".dx-multiview-wrapper"} 
                        width={'500'}
                        height={'275'}
                        position={{of:'#page'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Barkodu "} alignment="right" />
                                    <NdTextBox id={"txtPopBarkod"} parent={this} simple={true} 
                                    onValueChanged={(e)=>
                                    {
                                        if(parseInt(e.value) == NaN || parseInt(e.value).toString() != e.value)
                                        {
                                            this.cmbPopBarTip.value = "2"
                                            return;
                                        }
                                        if(e.value.length == 8)
                                        {                                            
                                            this.cmbPopBarTip.value = "0"
                                        }
                                        else if(e.value.length == 13)
                                        {
                                            this.cmbPopBarTip.value = "1"
                                        }
                                        else
                                        {
                                            this.cmbPopBarTip.value = "2"
                                        }
                                    }}/>
                                </Item>
                                <Item>
                                    <Label text={"Birim "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarBirim"
                                    displayExpr="NAME"                       
                                    valueExpr="ID"
                                    value="Unité"
                                    data={{source:this.itemsObj.dt('ITEM_UNIT')}}
                                    />
                                </Item>
                                <Item>
                                    <Label text={"Tip "} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPopBarTip"
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value="0"
                                    data={{source:[{ID:"0",VALUE:"EAN8"},{ID:"1",VALUE:"EAN13"},{ID:"2",VALUE:"CODE39"}]}}
                                    />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {
                                                let tmpEmpty = {...this.itemsObj.itemBarcode.empty};
                                                let tmpEmptyStat = true
                                                if(typeof this.itemsObj.itemBarcode.dt().find(x => x.BARCODE === '') != 'undefined')
                                                {
                                                    tmpEmptyStat = false;
                                                    tmpEmpty = this.itemsObj.itemBarcode.dt().find(x => x.BARCODE === '')
                                                }
                                                
                                                tmpEmpty.BARCODE = this.txtPopBarkod.value
                                                tmpEmpty.TYPE = this.cmbPopBarTip.value
                                                tmpEmpty.UNIT_NAME = this.cmbPopBarBirim.value

                                                let tmpResult = await this.checkBarcode(this.txtPopBarkod.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popBarkod.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    if(tmpEmptyStat)
                                                    {
                                                        this.itemsObj.itemBarcode.addEmpty(tmpEmpty);    
                                                    }
                                                    
                                                    this.popBarkod.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popBarkod.hide();  
                                            }}/>
                                        </div>
                                    </div>
                                </Item>
                            </Form>
                        </NdPopUp>
                    </div>  
                    {/* TEDARİKÇİ POPUP */}
                    <div>
                        <NdPopUp parent={this} id={"popTedarikci"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={"Tedarikçi Ekle"}
                        container={".dx-multiview-wrapper"} 
                        width={'500'}
                        height={'320'}
                        position={{of:'#page'}}
                        >
                            <Form colCount={1} height={'fit-content'}>
                                <Item>
                                    <Label text={"Kodu "} alignment="right" />
                                    <NdTextBox id={"txtPopTedKodu"} parent={this} simple={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {                                                
                                                    this.pg_txtPopTedKodu.show()
                                                    this.pg_txtPopTedKodu.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopTedKodu.value = data[0].CODE;
                                                            this.txtPopTedAdi.value = data[0].NAME;
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'add',
                                                onClick:()=>
                                                {                                                
                                                   
                                                }
                                            }
                                        ]
                                    }>                                        
                                    </NdTextBox>
                                    <NdPopGrid id={"pg_txtPopTedKodu"} parent={this} container={".dx-multiview-wrapper"} 
                                    position={{of:'#page'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={'Tedarikçi Seçim'} 
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    data={{source:{select:{query:"SELECT CODE,NAME FROM CUSTOMERS WHERE TYPE = 1 "},sql:this.core.sql}}}
                                    >           
                                    <Scrolling mode="virtual" />                         
                                    <Column dataField="NAME" caption="NAME" width={650} defaultSortOrder="asc" />
                                    <Column dataField="CODE" caption="CODE" width={150} />
                                    </NdPopGrid>
                                </Item>
                                <Item>
                                    <Label text={"Adı "} alignment="right" />
                                    <NdTextBox id={"txtPopTedAdi"} parent={this} simple={true} editable={true}/>
                                </Item>
                                <Item>
                                    <Label text={"Stok Kodu "} alignment="right" />
                                    <NdTextBox id={"txtPopTedStokKodu"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <Label text={"Fiyat "} alignment="right" />
                                    <NdTextBox id={"txtPopTedFiyat"} parent={this} simple={true} />
                                </Item>
                                <Item>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <NdButton text="Kaydet" type="normal" stylingMode="contained" width={'100%'} 
                                            onClick={async ()=>
                                            {                                                
                                                this.itemsObj.itemMultiCode.empty.CUSTOMER_CODE = this.txtPopTedKodu.value
                                                this.itemsObj.itemMultiCode.empty.CUSTOMER_NAME = this.txtPopTedAdi.value
                                                this.itemsObj.itemMultiCode.empty.MULTICODE = this.txtPopTedStokKodu.value
                                                this.itemsObj.itemMultiCode.empty.CUSTOMER_ITEM_PRICE = this.txtPopTedFiyat.value
                                                this.itemsObj.itemMultiCode.empty.CUSTOMER_ITEM_PRICE_DATE = moment(new Date()).format("DD.MM.YYYY")                                                    

                                                this.itemsPriceSupply.empty.TYPE = 1;
                                                this.itemsPriceSupply.empty.ITEM_CODE = this.itemsObj.dt('ITEMS')[0].CODE;
                                                this.itemsPriceSupply.empty.DEPOT = '0';
                                                this.itemsPriceSupply.empty.PRICE = this.txtPopTedFiyat.value;
                                                this.itemsPriceSupply.empty.QUANTITY = 1;
                                                this.itemsPriceSupply.empty.CUSTOMER_CODE = this.txtPopTedKodu.value;
                                                this.itemsPriceSupply.empty.CUSTOMER_NAME = this.txtPopTedAdi.value;
                                                this.itemsPriceSupply.empty.MULTICODE = this.txtPopTedStokKodu.value;
                                                this.itemsPriceSupply.empty.CHANGE_DATE = moment(new Date()).format("DD.MM.YYYY");

                                                let tmpResult = await this.checkMultiCode(this.txtPopTedStokKodu.value,this.txtPopTedKodu.value)
                                                if(tmpResult == 2) //KAYIT VAR
                                                {
                                                    this.popTedarikci.hide(); 
                                                }
                                                else if(tmpResult == 1) //KAYIT YOK
                                                {
                                                    this.itemsObj.itemMultiCode.addEmpty();
                                                    this.itemsPriceSupply.addEmpty();
                                                    this.popTedarikci.hide(); 
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text="İptal" type="normal" stylingMode="contained" width={'100%'}
                                            onClick={()=>
                                            {
                                                this.popTedarikci.hide();  
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