import React from 'react';
import App from '../../lib/app';
import {datatable} from '../../../core/core.js'
import {docCls,docExtraCls} from '../../../core/cls/doc.js'

import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';
import NdDatePicker from '../../../core/react/devex/datepicker';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';
import moment from 'moment';

export default class purchaseOrder extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.docObj = new docCls();
        this.extraObj = new docExtraCls();
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.acsobj = this.access.filter({TYPE:1,USERS:this.user.CODE});
    }
    async init()
    {
        this.docObj.clearAll()
        this.extraObj.clearAll()

        this.dtDocDate.value = moment(new Date())

        let tmpDoc = {...this.docObj.empty}

        tmpDoc.TYPE = 0
        tmpDoc.DOC_TYPE = 60
        this.docObj.addEmpty(tmpDoc);

        this.txtRef.readOnly = false
        this.txtRefNo.readOnly = false

        let m = [{"productGuid":"FE82547B-4E72-457F-A011-DFB024055DF7","idList":["20000563349391"],"packageItemId":["1000540970427"],"maincode":"058990","barcode":"80176800","price":105,"discount":"0.00","firstQuantity":1,"quantity":1,"vatBaseAmount":1,"amount":"105.00","name":"NUTELLA 750GR KAKAOLU FINDIK KREMASI","brand":"NUTELLA","unitType":0,"unitName":"Adet","weight":1,"weightPrice":0,"alternativeList":[],"image":"https://cdn.dsmcdn.com//ty182/product/media/images/20210922/17/135328587/16172528/1/1_org.jpg","change":false,"changeType":-1,"productStatus":true,"rowInfo":"","$$hashKey":"object:102"},{"productGuid":"78CDAF29-0BF2-4C10-9E5D-FB4163D20D65","idList":["20000563349392"],"packageItemId":["1000540970428"],"maincode":"100700","barcode":"8690504135562","price":16.8,"discount":"0.00","firstQuantity":1,"quantity":1,"vatBaseAmount":1,"amount":"16.80","name":"ULKER 1355-06 CIKOLATALI GOFRET 4X36GR","brand":"ULKER","unitType":0,"unitName":"Adet","weight":1,"weightPrice":0,"alternativeList":[],"image":"http://picture.seyhanlar.teknoticari.com:8083/8690504135562.jpg","change":false,"changeType":-1,"productStatus":true,"rowInfo":"","$$hashKey":"object:106"},{"productGuid":"D6CE075C-6332-450A-ABFE-BFF089E1FEBF","idList":["20000563349393"],"packageItemId":["1000540970429"],"maincode":"019085","barcode":"8690504142959","price":14.7,"discount":"0.00","firstQuantity":1,"quantity":1,"vatBaseAmount":1,"amount":"14.70","name":"ULKER 1429-05 KARE SUTLU CIKOLATA 60GR","brand":"ULKER","unitType":0,"unitName":"Adet","weight":1,"weightPrice":0,"alternativeList":[],"image":"https://cdn.dsmcdn.com//ty97/product/media/images/20210405/03/aed0f586/60383886/1/1_org.jpg","change":false,"changeType":-1,"productStatus":true,"rowInfo":"","$$hashKey":"object:109"},{"productGuid":"043294A1-1DB2-4E8B-9C51-0D857AC88F12","idList":["20000563349394","20000563349395"],"packageItemId":["1000540970430","1000540970431"],"maincode":"097731","barcode":"8690624304695","price":7.9,"discount":"0.00","firstQuantity":2,"quantity":2,"vatBaseAmount":1,"amount":"15.80","name":"CIPS.CHEETOS AILE PLUS 41GR FIRINDAN FISTIK","brand":"CHEETOS","unitType":0,"unitName":"Adet","weight":1,"weightPrice":0,"alternativeList":[],"image":"http://picture.seyhanlar.teknoticari.com:8083/8690624304695.jpg","change":false,"changeType":-1,"productStatus":true,"rowInfo":"","$$hashKey":"object:110"}]
        let x = new datatable()
        x.import(m)
        console.log(x.where({amount:{'>':10}}).where({amount:{'<':20}}).sum('amount'))
    }
    async componentDidMount()
    {
        this.pageView.activePage('Main')

        await this.core.util.waitUntil(0)
        this.init()
    }
    onClickBarcodeShortcut()
    {
        this.pageView.activePage('Entry')
    }
    render()
    {
        return(
            <div>
                <div>
                    <PageBar id={"pageBar"} parent={this} title={"Alış Siparişi"} content=
                    {[
                        {
                            name : 'Main',isBack : false,isTitle : true,
                            menu :
                            [
                                {
                                    icon : "fa-ban",
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        console.log(1)
                                    },
                                },
                                {
                                    icon : "fa-trash",
                                    text : "Evrak Sil",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                }
                            ]
                        },
                        {
                            name : 'DocInfo',isBack : true,isTitle : false,
                            menu :
                            [
                                {
                                    icon : "fa-file",
                                    text : "Kaydet",
                                    onClick : ()=>
                                    {
                                        console.log(2)
                                    },
                                },
                                {
                                    icon : "fa-eraser",
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                },
                                {
                                    icon : "fa-ban",
                                    text : "Evrak Sil",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                }
                            ],
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)},
                                {icon : "fa-circle-info",onClick : ()=>{console.log(2)}},
                                {icon : "fa-file-lines",onClick : ()=>{console.log(3)}}
                            ]
                        },
                        {
                            name : 'Entry',isBack : true,isTitle : false,
                            menu :
                            [
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                },
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                }
                            ],
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)},
                                {icon : "fa-circle-info",onClick : ()=>{console.log(2)}},
                                {icon : "fa-file-lines",onClick : ()=>{console.log(3)}}
                            ]
                        },
                        {
                            name : 'Process',isBack : true,isTitle : false,
                            menu :
                            [
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                },
                                {
                                    text : "Yeni Evrak",
                                    onClick : ()=>
                                    {
                                        
                                    },
                                }
                            ],
                            shortcuts :
                            [
                                {icon : "fa-barcode",onClick : this.onClickBarcodeShortcut.bind(this)},
                                {icon : "fa-circle-info",onClick : ()=>{console.log(2)}},
                                {icon : "fa-file-lines",onClick : ()=>{console.log(3)}}
                            ]
                        },
                    ]}
                    onBackClick=
                    {
                        ()=>
                        {
                            this.pageView.activePage('Main')
                        }
                    }/>
                </div>
                <div style={{position:'relative',top:'50px',height:'100%'}}>
                    <PageView id={"pageView"} parent={this} 
                    onActivePage={(e)=>
                    {
                        this.pageBar.activePage(e)
                    }}>
                        <PageContent id={"Main"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>
                                            Seri - Sıra :
                                        </div>
                                        <div className='col-9'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF"}}>
                                                    </NdTextBox>
                                                </div>
                                                <div className='col-8'>
                                                    <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32} dt={{data:this.docObj.dt('DOC'),field:"REF_NO"}}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:async()=>
                                                                {
                                                                    
                                                                }
                                                            },
                                                            {
                                                                id:'02',
                                                                icon:'arrowdown',
                                                                onClick:()=>
                                                                {
                                                                    this.txtRefNo.value = Math.floor(Date.now() / 1000)
                                                                }
                                                            }
                                                        ]
                                                    }>
                                                    </NdTextBox>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>
                                            Depo :
                                        </div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                            dt={{data:this.docObj.dt('DOC'),field:"INPUT"}}
                                            displayExpr="NAME"
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            data={{source:{select:{query : "SELECT * FROM DEPOT_VW_01"},sql:this.core.sql}}}
                                            >
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>
                                            Cari Kodu :
                                        </div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerName" parent={this} simple={true} readOnly={true} maxLength={32}
                                            button=
                                            {
                                                [
                                                    {
                                                        id:'01',
                                                        icon:'more',
                                                        onClick:async()=>
                                                        {
                                                            
                                                        }
                                                    }
                                                ]
                                            }>
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>
                                            Cari Adı :
                                        </div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}>
                                            </NdTextBox>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-12'>
                                            Tarih :
                                        </div>
                                        <div className='col-9'>
                                            <NdDatePicker simple={true}  parent={this} id={"dtDocDate"} pickerType={"rollers"}>
                                            </NdDatePicker>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={()=>
                                            {
                                                this.pageView.activePage('Entry')
                                            }}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-barcode"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>Barkod Giriş</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="form-group btn btn-primary btn-purple-light btn-block" style={{height:"100%",width:"100%"}} 
                                            onClick={()=>
                                            {
                                                this.pageView.activePage('Process')
                                            }}>
                                                <div className='row py-2'>
                                                    <div className='col-12'>
                                                        <i className={"fa-solid fa-file-lines"} style={{color:'#ecf0f1',fontSize:'20px'}}></i>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <h6 className='overflow-hidden d-flex align-items-center justify-content-center' style={{color:'#ecf0f1',height:'20px'}}>İşlem Satırları</h6>
                                                    </div>
                                                </div>
                                            </NbButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"DocInfo"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    BELGE BILGISI......................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ...................................................................
                                    ALIKEMALKAR........................................................
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Entry"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    BARKOD GİRİŞ
                                </div>
                            </div>
                        </PageContent>
                        <PageContent id={"Process"}>
                            <div className='row px-2'>
                                <div className='col-12'>
                                    İŞLEM SATIRLARI
                                </div>
                            </div>
                        </PageContent>
                    </PageView>
                </div>
            </div>
        )
    }
}