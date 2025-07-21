import React from 'react';
import App from '../../../lib/app.js';

import ScrollView from 'devextreme-react/scroll-view';
import Form, { Label,Item } from 'devextreme-react/form';

import NdButton from '../../../../core/react/devex/button.js';
import NdSelectBox from '../../../../core/react/devex/selectbox';
import {ItemBuild,ItemSet,ItemGet} from '../../../../admin/tools/itemOp';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
import { param } from '../../../../core/core.js';

export default class piqPoidDeviceCard extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.prevCode = "";
        this.tabIndex = props.data.tabkey
        this.prmData = null
        this.state = 
        {
            metaPrm : []
        }
        this.ItemBuild = ItemBuild.bind(this)
        this.ItemSet = ItemSet.bind(this)
        this.ItemGet = ItemGet.bind(this)

        this.prm =
        [
            // Miktar Düzenle
            {
                TYPE : 0,
                ID :"QuantityEdit",
                VALUE : true,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "checkbox",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Miktar Düzenle",fr:"Modifier la quantité"}
                }
            },
            // Fiyat Düzenle
            {
                TYPE : 0,
                ID :"PriceEdit",
                VALUE : true,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "checkbox",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Fiyat Düzenle",fr:"Modifier le prix"}
                }
            },
            // Tölerans
            {
                TYPE : 0,
                ID :"Tolerance",
                VALUE : 100,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "text",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Tölerans",fr:"Tolérance"}
                }
            },
            // Satış Tipi
            {
                TYPE : 0,
                ID :"SaleType",
                VALUE : 0,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "text",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Satış Tipi",fr:"Type de vente"}
                }
            },
            // Yazdırma Ayarı
            {
                TYPE : 0,
                ID :"PrintSetting",
                VALUE : 
                {
                    // design : "B",
                    // width : 60,
                    // height : 0,
                    // sensor : 36,
                    // speed : 4,
                    // density : 10,
                    // port : "/dev/ttyS1"
                    design : "A",
                    width : 56,
                    height : 42,
                    sensor : 36,
                    speed : 4,
                    density : 10,
                    port : "/dev/ttyS1"
                },
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "popInput",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Yazdırma Ayarı",fr:"Paramètres d'impression"},
                    DISPLAY : "port",
                    FORM: 
                    {
                        width:"400",
                        height:"320",
                        item:
                        [
                            {type:"text",caption:"Design",field:"design",id:"txtPopPrmDesign"},
                            {type:"text",caption:"Width",field:"width",id:"txtPopPrmWidth"},
                            {type:"text",caption:"Height",field:"height",id:"txtPopPrmHeight"},
                            {type:"text",caption:"Sensor",field:"sensor",id:"txtPopPrmSensor"},
                            {type:"text",caption:"Speed",field:"speed",id:"txtPopPrmSpeed"},
                            {type:"text",caption:"Density",field:"density",id:"txtPopPrmDensity"},
                            {type:"text",caption:"Port",field:"port",id:"txtPopPrmPort"},
                        ]
                    }
                }
            },
            // Barcode Flag
            {
                TYPE : 0,
                ID :"BarcodeFlag",
                VALUE : "26",
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "text",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Barkod Flag",fr:"Indicateur de code-barres"}
                }
            },
            // Ürün Resimi
            {
                TYPE : 0,
                ID :"ItemImage",
                VALUE : false,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "checkbox",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Ürün Resim",fr:"Image du produit"}
                }
            },
            // Etiket Göster
            {
                TYPE : 0,
                ID :"TicketShow",
                VALUE : true,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "checkbox",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Etiket Göster",fr:"Afficher l'étiquette"}
                }
            },
            // Etiket Birleştir
            {
                TYPE : 0,
                ID :"TicketMerge",
                VALUE : false,
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "checkbox",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Etiket Birleştir",fr:"Fusionner les étiquettes"}
                }
            },
            // Terazide Gözükücek Ana Grup
            {
                TYPE : 0,
                ID :"MainGrp",
                VALUE : "",
                SPECIAL : "",
                PAGE : "poid",
                ELEMENT : "",
                APP : "POID",
                VIEW : 
                {
                    TYPE : "text",
                    PAGE_NAME : "Poid",
                    CAPTION : {tr:"Terazide Gözükücek Ana Grup",fr:"Groupe principal à afficher sur la balance"}
                }
            },
        ]
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.prmData = new param(this.prm)
        await this.prmData.load({APP:'POID'})
        
        this.setState({metaPrm:this.prmData.filter({TYPE:0}).meta})
        
        this.prmData.filter({TYPE:0}).meta.map((pItem,pIndex) => 
        {
            let tmpData = {...pItem}
            tmpData.VALUE = this.prmData.filter({TYPE:0,ID:pItem.ID}).getValue()
            this.ItemSet(tmpData,this)
        })
    }
    buildItem()
    {
        let tmpItems = []
        this.state.metaPrm.map((pItem) => 
        {
            tmpItems.push(this.ItemBuild(pItem,this,this.lang.language))
        });
        return tmpItems
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id={"frmFilter" + this.tabIndex}>
                                <Item>
                                    <Label text={this.t("lblDevice")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDevice" tabIndex={this.tabIndex}
                                    displayExpr="CODE"                       
                                    valueExpr="CODE"
                                    value={""}
                                    showClearButton={true}
                                    data={{source:{select:{query : `SELECT CODE,NAME FROM BALANCE_DEVICES ORDER BY NAME ASC`},sql:this.core.sql}}}
                                    onValueChanged={async(e)=>
                                    {
                                        await this.prmData.load({APP:'POID'})
                                        this.prmData.filter({TYPE:0}).meta.map((pItem) => 
                                        {
                                            let tmpData = {...pItem}
                                            tmpData.VALUE = this.prmData.filter({TYPE:0,USERS:e.value,ID:pItem.ID}).getValue()
                                            this.ItemSet(tmpData,this)
                                        })
                                    }}
                                    />
                                </Item>
                                <Item>
                                    <NdButton text={this.t("btnSave")} type="default" width="100%"
                                    onClick={async()=>
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgSaveResult',showTitle:true,title:this.t("msgSaveResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                            button:[{id:"btn02",caption:this.t("msgSaveResult.btn01"),location:'after'}],
                                        }

                                        App.instance.loading.show()
                                        for (let x = 0; x < this.state.metaPrm.length; x++) 
                                        {
                                            this.prmData.add
                                            (
                                                {
                                                    TYPE:this.state.metaPrm[x].TYPE,
                                                    ID:this.state.metaPrm[x].ID,
                                                    VALUE:await this.ItemGet(this.state.metaPrm[x],this),
                                                    SPECIAL:this.state.metaPrm[x].SPECIAL,
                                                    USERS:this.cmbDevice.value,
                                                    PAGE:this.state.metaPrm[x].PAGE,
                                                    ELEMENT:this.state.metaPrm[x].ELEMENT,
                                                    APP:this.state.metaPrm[x].APP,
                                                }
                                            )
                                        }
                                        let tmpResult = await this.prmData.save()                                            
                                        await this.prmData.load({APP:'POID'})
                                        App.instance.loading.hide()

                                        if(tmpResult == 0)
                                        {
                                           this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
                                        }
                                        else
                                        {
                                            tmpConfObj.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                            await dialog(tmpConfObj);
                                        }
                                        
                                    }}></NdButton>
                                </Item>

                            </Form>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Form colCount={2} id={"frmParam" + this.tabIndex}>
                                {this.buildItem()}
                            </Form>  
                        </div>
                    </div>
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}
