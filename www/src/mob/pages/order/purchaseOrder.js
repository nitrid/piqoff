import React from 'react';
import App from '../../lib/app';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../../core/react/bootstrap/button';
import NdTextBox from '../../../core/react/devex/textbox';
import NdSelectBox from '../../../core/react/devex/selectbox';

import { PageBar } from '../../tools/pageBar';
import { PageView,PageContent } from '../../tools/pageView';

export default class purchaseOrder extends React.PureComponent
{
    constructor(props)
    {
        super(props)
    }
    componentDidMount()
    {
        this.pageView.activePage('Main')
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
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-14'>
                                            Seri - Sıra :
                                        </div>
                                        <div className='col-9'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <NdTextBox id="txtRef" parent={this} simple={true} readOnly={true} maxLength={32}>
                                                    </NdTextBox>
                                                </div>
                                                <div className='col-8'>
                                                    <NdTextBox id="txtRefNo" parent={this} simple={true} readOnly={true} maxLength={32}
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
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-14'>
                                            Depo :
                                        </div>
                                        <div className='col-9'>
                                            <NdSelectBox simple={true} parent={this} id="cmbDepot" notRefresh = {true}
                                            displayExpr="NAME"
                                            valueExpr="GUID"
                                            value=""
                                            searchEnabled={true}
                                            onValueChanged={(async(e)=>
                                            {
                                                
                                            }).bind(this)}
                                            >
                                            </NdSelectBox>
                                        </div>
                                    </div>
                                    <div className='row pb-2'>
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-14'>
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
                                        <div className='col-3 d-flex justify-content-end align-items-center text-size-14'>
                                            Cari Adı :
                                        </div>
                                        <div className='col-9'>
                                            <NdTextBox id="txtCustomerCode" parent={this} simple={true} readOnly={true} maxLength={32}>
                                            </NdTextBox>
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