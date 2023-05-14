import React from 'react';
import App from '../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import NbButton from '../../core/react/bootstrap/button';
import NdTextBox,{ Button } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdButton from '../../core/react/devex/button';
import NbItemCard from '../tools/itemCard';
import NbPopUp from '../../core/react/bootstrap/popup';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';

export default class Sale extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"sale")
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
                                            <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                            onClick={()=>
                                            {
                                                this.popCart.hide();
                                            }}>
                                                <i className="fa-solid fa-xmark fa-1x"></i>
                                            </NbButton>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-12'>
                                            <Form colCount={1}>
                                                {/* Musteri */}
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
                                                                    
                                                                }
                                                            }
                                                        ]
                                                    }
                                                    selectAll={true}                           
                                                    >     
                                                    </NdTextBox>
                                                </Item>
                                            </Form>
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
