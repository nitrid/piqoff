import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NbItemCard from '../tools/itemCard';
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';
import Toolbar from 'devextreme-react/toolbar';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../core/react/devex/grid.js';
import NdPopGrid from '../../core/react/devex/popgrid.js';

export default class Sale extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"sale")
        this.lang = App.instance.lang;
    }
    async componentDidMount()
    {
    }
    render()
    {
        return(
            <div>
                <div style={{height:'50px',backgroundColor:'#f5f6fa',top:'65px',position:'sticky',borderBottom:'1px solid #7f8fa6'}}>
                    <div className="row">
                        <div className="col-1" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-secondary" style={{height:"100%",width:"100%"}}
                            onClick={()=>
                            {
                                this.popCart.show()
                            }}>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </NbButton>
                        </div>
                        <div className="col-1" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            <NbButton className="form-group btn btn-block btn-outline-secondary" style={{height:"100%",width:"100%"}}
                            onClick={()=>
                            {
                                this.popMenu.hide()
                                this.setState({page:'dashboard.js'})
                            }}>
                                <i className="fa-solid fa-filter"></i>
                            </NbButton>
                        </div>
                        <div className="col-2" align="left" style={{paddingLeft:'20px',paddingTop:'10px'}}>
                            
                        </div>
                        <div className="col-4" align="center" style={{paddingTop:'5px'}}>
                            <NdTextBox id={"txtSearch"} parent={this} simple={true} placeholder={"Search"}/>
                        </div>
                        <div className="col-4" align="right" style={{paddingRight:'25px',paddingTop:'5px'}}>
                            <NdSelectBox simple={true} parent={this} id="cmbGroup" height='fit-content' style={{width:'150px'}}
                            displayExpr="NAME"                       
                            valueExpr="CODE"
                            value= ""
                            searchEnabled={true}
                            data={{source:[{CODE:'001',NAME:'XXX'}]}}
                            />
                        </div>
                    </div>
                </div>
                <div style={{paddingLeft:"15px",paddingRight:"15px",paddingTop:"65px"}}>
                    <ScrollView showScrollbar={'never'} useNative={false}>
                        <div className='row pt-3' style={{paddingBottom:"200px"}}>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard1"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard1"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                            <div className='col-lg-3 col-md-4 pb-2'>
                                <NbItemCard id={"itemCard2"} parent={this} price={"1,60"} name={"LAVETTE MICROFIBRE MULTI-USAGES 30X30CM LOT DE 2 - 1GREGE + 1 BLEU NEPTUNE"}
                                image={"https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F1%2FApples.jpg&w=1920&q=75"}/>
                            </div>
                        </div>
                        {/* CART */}
                        <div>
                            <NbPopUp id={"popCart"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12' align={"right"}>
                                            <Toolbar>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                    }}>
                                                        <i className="fa-solid fa-file fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                    }}>
                                                        <i className="fa-solid fa-floppy-disk fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                    }}>
                                                        <i className="fa-solid fa-trash fa-1x"></i>
                                                    </NbButton>                                                    
                                                </Item>
                                                <Item location="after" locateInMenu="auto">
                                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                                    onClick={()=>
                                                    {
                                                        this.popCart.hide();
                                                    }}>
                                                        <i className="fa-solid fa-xmark fa-1x"></i>
                                                    </NbButton>
                                                </Item>
                                            </Toolbar>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-12'>
                                            <Form colCount={1}>
                                                {/* MUSTERI */}
                                                <Item>
                                                    <Label text={this.t("popCart.txtCustomer")} alignment="right" />
                                                    <NdTextBox id="txtCustomer" parent={this} simple={true} readOnly={true}
                                                    button=
                                                    {
                                                        [
                                                            {
                                                                id:'01',
                                                                icon:'more',
                                                                onClick:()=>
                                                                {
                                                                    this.popCustomer.show()
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    selectAll={true}                           
                                                    >     
                                                    </NdTextBox>
                                                </Item>
                                                {/* GRID */}
                                                <Item>
                                                    <NdGrid parent={this} id={"grdSale"} 
                                                    showBorders={true} 
                                                    columnsAutoWidth={true} 
                                                    allowColumnReordering={true} 
                                                    allowColumnResizing={true} 
                                                    headerFilter={{visible:true}}
                                                    height={'400'} 
                                                    width={'100%'}
                                                    dbApply={false}
                                                    filterRow={{visible:true}}
                                                    onRowPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdating={async (e)=>
                                                    {
                                                    }}
                                                    onCellPrepared={(e) =>
                                                    {
                                                    }}
                                                    onRowUpdated={async(e)=>
                                                    {
                                                    }}
                                                    onRowRemoved={async (e)=>
                                                    {
                                                    }}
                                                    onReady={async()=>
                                                    {
                                                    }}
                                                    >
                                                        <Paging defaultPageSize={10} />
                                                        <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                        <KeyboardNavigation editOnKeyPress={true} enterKeyAction={'moveFocus'} enterKeyDirection={'column'} />
                                                        <Scrolling mode="standart" />
                                                        <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                                        <Column dataField="ITEM_NAME" caption={this.t("grdSale.clmItemName")} width={200} allowHeaderFiltering={false}/>
                                                        <Column dataField="QUANTITY" caption={this.t("grdSale.clmQuantity")} width={70} dataType={'number'} cellRender={(e)=>{return e.value + " / " + e.data.UNIT_SHORT}}/>
                                                        <Column dataField="PRICE" caption={this.t("grdSale.clmPrice")} width={70} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 3}}/>
                                                        <Column dataField="AMOUNT" caption={this.t("grdSale.clmAmount")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={80} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT" caption={this.t("grdSale.clmDiscount")} dataType={'number'} format={{ style: "currency", currency: "EUR",precision: 2}} editCellRender={this._cellRoleRender} width={70} allowHeaderFiltering={false}/>
                                                        <Column dataField="DISCOUNT_RATE" caption={this.t("grdSale.clmDiscountRate")} dataType={'number'}  format={'##0.00'} width={60} editCellRender={this._cellRoleRender} allowHeaderFiltering={false}/>
                                                        <Column dataField="VAT" caption={this.t("grdSale.clmVat")} format={'€#,##0.000'}allowEditing={false} width={75} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTALHT" caption={this.t("grdSale.clmTotalHt")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                        <Column dataField="TOTAL" caption={this.t("grdSale.clmTotal")} format={{ style: "currency", currency: "EUR",precision: 2}} allowEditing={false} width={90} allowHeaderFiltering={false}/>
                                                    </NdGrid>
                                                </Item>
                                                {/* DIP TOPLAM */}
                                                <Item>
                                                    <div className="row px-2 pt-2">
                                                        <div className="col-12">
                                                            <Form colCount={2} parent={this} id={"frmSale"}>
                                                                {/* Ara Toplam */}
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtAmount")} alignment="right" />
                                                                    <NdTextBox id="txtAmount" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDiscount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtDocDiscount")} alignment="right" />
                                                                    <NdTextBox id="txtDocDiscount" parent={this} simple={true} readOnly={true} maxLength={32}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem colSpan={1}/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotalHt")} alignment="right" />
                                                                    <NdTextBox id="txtTotalHt" parent={this} simple={true} readOnly={true}/>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtVat")} alignment="right" />
                                                                    <NdTextBox id="txtVat" parent={this} simple={true} readOnly={true} maxLength={32}
                                                                    button=
                                                                    {
                                                                        [
                                                                            {
                                                                                id:'01',
                                                                                icon:'more',
                                                                                onClick:async ()  =>
                                                                                {
                                                                                    
                                                                                }
                                                                            },
                                                                        ]
                                                                    }
                                                                    ></NdTextBox>
                                                                </Item>
                                                                <EmptyItem/>
                                                                <Item>
                                                                    <Label text={this.t("popCart.txtTotal")} alignment="right" />
                                                                    <NdTextBox id="txtTotal" parent={this} simple={true} readOnly={true} maxLength={32}/>
                                                                </Item>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                </Item>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>
                        {/* CARI SECIMI POPUP */}
                        <div>                            
                            <NbPopUp id={"popCustomer"} parent={this} title={""} fullscreen={true}>
                                <div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-10' align={"left"}>
                                            <h2 className='text-danger'>{this.t('popCustomer.title')}</h2>
                                        </div>
                                        <div className='col-2' align={"right"}>
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>                                    
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-12'>
                                            <NdTextBox id="txtCustomerSearch" parent={this} simple={true} selectAll={true} />
                                        </div>
                                    </div>
                                    <div className='row' style={{paddingTop:"10px"}}>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();
                                            }}>
                                                {this.t('popCustomer.btn01')}
                                            </NbButton>
                                        </div>
                                        <div className='col-6'>
                                            <NbButton className="btn btn-block btn-primary" style={{width:"100%"}}
                                            onClick={()=>
                                            {
                                                this.popCustomer.hide();
                                            }}>
                                                {this.t('popCustomer.btn02')}
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <NdGrid parent={this} id={"grdCustomer"} 
                                            showBorders={true} 
                                            columnsAutoWidth={true} 
                                            headerFilter={{visible:true}}
                                            height={'400'}
                                            width={'100%'}
                                            >
                                                <Paging defaultPageSize={10} />
                                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                                <Scrolling mode="standart" />
                                                <Column dataField="CODE" caption={this.t("popCustomer.clmCode")} width={200}/>
                                                <Column dataField="TITLE" caption={this.t("popCustomer.clmName")} width={400}/>
                                            </NdGrid>
                                        </div>
                                    </div>
                                </div>
                            </NbPopUp>
                        </div>
                    </ScrollView>
                </div>
            </div>
        )
    }
}
