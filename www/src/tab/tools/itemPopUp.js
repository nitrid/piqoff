import React from "react";
import App from "../lib/app.js";
import NbBase from "../../core/react/bootstrap/base.js";
import NbPopUp from '../../core/react/bootstrap/popup';
import NbButton from '../../core/react/bootstrap/button';
import Form, { Label, EmptyItem } from 'devextreme-react/form';
import Toolbar,{Item} from 'devextreme-react/toolbar';
import Carousel from 'react-bootstrap/Carousel';
import NdTextBox,{ Button } from '../../core/react/devex/textbox'
import NdSelectBox from '../../core/react/devex/selectbox'
import NdGrid,{Column, ColumnChooser,ColumnFixing,Paging,Pager,Scrolling,Export, Summary, TotalItem} from '../../core/react/devex/grid'
import NdButton from '../../core/react/devex/button.js';
import NdNumberBox from '../../core/react/devex/numberbox.js'
export default class NbItemPopUp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.state =
        {
            images : [],
            minImgStyle1 : {border:"solid 2px rgb(13, 110, 253)",padding:"2px",height:'90px'},
            minImgStyle2 : {border:"solid 1px rgb(223, 230, 233)",padding:"2px",height:'90px'},
            minImgStyle3 : {border:"solid 1px rgb(223, 230, 233)",padding:"2px",height:'90px'},
            minImgStyle4 : {border:"solid 1px rgb(223, 230, 233)",padding:"2px",height:'90px'}
        }
        this.data = []
    }
    async open(pData)
    {        
        this.data = pData.data
        let tmpQuery = 
        {
            query :"SELECT IMAGE AS IMAGE1,  " +
                    "(SELECT IMAGE FROM ITEM_IMAGE AS IMG1 WHERE IMG1.ITEM = ITEM_IMAGE.ITEM AND SORT = 1) AS IMAGE2,  " +
                    "(SELECT IMAGE FROM ITEM_IMAGE AS IMG1 WHERE IMG1.ITEM = ITEM_IMAGE.ITEM AND SORT = 2) AS IMAGE3,  " +
                    "(SELECT IMAGE FROM ITEM_IMAGE AS IMG1 WHERE IMG1.ITEM = ITEM_IMAGE.ITEM AND SORT = 3) AS IMAGE4,  " +
                    "(SELECT IMAGE FROM ITEM_IMAGE AS IMG1 WHERE IMG1.ITEM = ITEM_IMAGE.ITEM AND SORT = 4) AS IMAGE5  " +
                    "FROM ITEM_IMAGE WHERE ITEM = @ITEM AND SORT = 0 ",
            param : ['ITEM:string|50'],
            value : [this.data.GUID],
        }
        let tmpData = await this.core.sql.execute(tmpQuery)
        if(tmpData.result.recordset.length > 0)
        {
            this.data.IMAGE1 = tmpData.result.recordset[0].IMAGE1 == '' ? './css/img/noimage.jpg' : tmpData.result.recordset[0].IMAGE1
            this.data.IMAGE2 = tmpData.result.recordset[0].IMAGE2 == '' ? './css/img/noimage.jpg' : tmpData.result.recordset[0].IMAGE2
            this.data.IMAGE3 = tmpData.result.recordset[0].IMAGE3 == '' ? './css/img/noimage.jpg' : tmpData.result.recordset[0].IMAGE3
            this.data.IMAGE4 = tmpData.result.recordset[0].IMAGE3 == '' ? './css/img/noimage.jpg' : tmpData.result.recordset[0].IMAGE4
            if(typeof this.data.QUANTITY == 'undefined')
            {
                this.data.QUANTITY = 0
            }
            this.setState({images:[]})
            this.popCard.show();
        }
        else
        {
            this.data.IMAGE1 = './css/img/noimage.jpg'
            this.data.IMAGE2 = './css/img/noimage.jpg'
            this.data.IMAGE3 = './css/img/noimage.jpg'
            this.data.IMAGE4 = './css/img/noimage.jpg'
            if(typeof this.data.QUANTITY == 'undefined')
            {
                this.data.QUANTITY = 0
            }
            this.setState({images:[]})
            this.popCard.show();
        }                

        let tmpItemsSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :  "SELECT *,((DEPOT_QUANTITY + INPUT_RESERVE) - OUTPUT_RESERVE) AS TOTAL_QUANTITY FROM   " +
                            "( SELECT GUID, " +
                            "    (SELECT [dbo].[FN_DEPOT_QUANTITY](GUID,'00000000-0000-0000-0000-000000000000',dbo.GETDATE())) AS DEPOT_QUANTITY,  " +
                            "    (SELECT dbo.FN_ORDER_PEND_QTY(GUID,0,'00000000-0000-0000-0000-000000000000')) AS INPUT_RESERVE,  " +
                            "    (SELECT dbo.FN_ORDER_PEND_QTY(GUID,1,'00000000-0000-0000-0000-000000000000')) AS OUTPUT_RESERVE  " +
                            "    FROM ITEMS WHERE GUID = @ITEM  " +
                            ") AS TMP  " ,
                    param : ['ITEM:string|50'],
                    value : [this.data.GUID]
                },
                sql : this.core.sql
            }
        }
        await this.grdQuantity.dataRefresh(tmpItemsSource)
    }
    _onValueChange(e)
    {
        if(typeof this.props.onValueChange != 'undefined')
        {
            this.props.onValueChange(e);
        }
    }
    render()
    {
        return(
            <React.Fragment>
            <NbPopUp id={"popCard"} parent={this} title={""} fullscreen={true}
            onShowed={async()=>
            {
                await this.core.util.waitUntil(0)
                
                let tmpSource =
                {
                    source : 
                    {
                        select : 
                        {
                            query : "SELECT GUID,NAME,FACTOR,TYPE FROM ITEM_UNIT_VW_01 WHERE ITEM_GUID = @ITEM_GUID",
                            param : ['ITEM_GUID:string|50'],
                            value : [this.data.GUID]
                        },
                        sql : this.core.sql
                    }
                }
                await this.cmbUnit.dataRefresh(tmpSource)

                if(this.cmbUnit.data.datatable.length > 0)
                {
                    this.cmbUnit.value = this.data.UNIT;
                    this.txtPrice.value = Number(this.data.PRICE * this.data.UNIT_FACTOR).round(3)
                }
            }}>
                <div>
                    <div className='row' style={{paddingTop:"10px"}}>
                        <div className='col-12' align={"right"}>
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                    onClick={()=>
                                    {
                                        this.popCard.hide();
                                    }}>
                                        <i className="fa-solid fa-xmark fa-1x"></i>
                                    </NbButton>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className='row pt-2'>
                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-12' style={{height:'350px'}}>
                                    <Carousel onSelect={(e)=>
                                    {
                                        for (let i = 0; i < 4; i++) 
                                        {
                                            if(e == i)
                                            {
                                                this.setState({["minImgStyle" + (i + 1)] : {border:"solid 2px rgb(13, 110, 253)",padding:"2px",height:'90px'}})
                                            }
                                            else
                                            {
                                                this.setState({["minImgStyle" + (i + 1)] : {border:"solid 1px rgb(223, 230, 233)",padding:"2px",height:'90px'}})
                                            }
                                        }
                                    }}>
                                        <Carousel.Item>
                                            <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE1}/>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE2}/>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE3}/>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE4}/>
                                        </Carousel.Item>
                                    </Carousel>
                                </div>
                            </div>
                            <div className='row pt-3'>
                                <div className='col-3' style={this.state.minImgStyle1}>
                                    <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE1}/>
                                </div>
                                <div className='col-3' style={this.state.minImgStyle2}>
                                    <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE2}/>
                                </div>
                                <div className='col-3' style={this.state.minImgStyle3}>
                                    <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE3}/>
                                </div>
                                <div className='col-3' style={this.state.minImgStyle4}>
                                    <img className="d-block h-100" style={{margin: 'auto auto'}} src={this.data.IMAGE4}/>
                                </div>
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className='col-12'>
                                <h5 className="text-danger">{this.data.CODE + " - " + this.data.NAME}</h5>
                            </div>                            
                        </div>
                        <div className='row pt-2'>
                            <div className='col-12'>
                                <h5 className="overflow-hidden"></h5>
                            </div>                            
                        </div>
                        <div className='row pt-2'>
                            <div className='col-12'>
                                <Form colCount={2}>
                                    <Item>
                                        <Label text={this.t("itemPopup.txtPrice")} alignment="right" />
                                        <NdTextBox id={"txtPrice"} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }} value={this.data.PRICE}/>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("itemPopup.cmbUnit")} alignment="right" />
                                        <div className="row">
                                            <div className="col-8">
                                            <NdSelectBox simple={true} parent={this} id="cmbUnit" height='fit-content' 
                                            displayExpr="NAME"                       
                                            valueExpr="GUID"
                                            searchEnabled={true}
                                            onValueChanged={(async(e)=>
                                            {
                                                if(e.value != '00000000-0000-0000-0000-000000000000' && e.value != '')
                                                {                                                
                                                    this.data.UNIT_FACTOR = this.cmbUnit.data.datatable.where({'GUID':e.value})[0].FACTOR
                                                    this.data.UNIT = e.value
                                                    this.txtPrice.value = Number(this.data.PRICE * this.data.UNIT_FACTOR).round(3)
                                                    this.txtFactor.value = this.cmbUnit.data.datatable.where({'GUID':e.value})[0].FACTOR
                                                    this._onValueChange(this.data)
                                                }
                                            }).bind(this)}
                                            />
                                            </div>
                                            <div className="col-4">
                                                <NdTextBox id={"txtFactor"} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }} value={this.data.UNIT_FACTOR} readOnly={true}/>
                                            </div>
                                        </div>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("itemPopup.txtDiscount")} alignment="right" />
                                        <NdTextBox id={"txtDiscount"} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }} value={this.data.DISCOUNT}
                                        onChange={(async(e)=>
                                        {
                                            
                                            this.data.DISCOUNT = this.txtDiscount.value
                                            this._onValueChange(this.data)
                                        }).bind(this)}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                location:'after',
                                                onClick:async()=>
                                                {
                                                    this.popDiscount.show()
                                                    
                                                    await this.core.util.waitUntil(200)
                                                    this.txtDiscountPrice1.value = Number(this.data.DISCOUNT).round(2)
                                                    this.txtDiscountPercent1.value = Number(this.data.QUANTITY * this.data.PRICE).rate2Num(this.data.DISCOUNT,3)
                                                }
                                            } 
                                        ]}/>
                                    </Item>
                                    <Item>
                                        <Label text={this.t("itemPopup.txtQuantity")} alignment="right" />
                                        <NdTextBox id={"txtQuantity"} parent={this} simple={true} inputAttr={{ class: 'dx-texteditor-input txtbox-center' }}
                                        value={this.data.QUANTITY}
                                        onChange={(async(e)=>
                                        {
                                            this.data.QUANTITY = this.txtQuantity.value
                                            this._onValueChange(this.data)
                                        }).bind(this)}
                                        button={
                                        [
                                            {
                                                id:'01',
                                                icon:'minus',
                                                location:'before',
                                                onClick:async()=>
                                                {
                                                    if(this["txtQuantity" + this.props.id].value > 0)
                                                    {
                                                        this.txtQuantity.value = Number(this.txtQuantity.value) - 1 
                                                        this.data.QUANTITY = this.txtQuantity.value
                                                        this._onValueChange(this.data)
                                                    }
                                                    
                                                }
                                            },
                                            {
                                                id:'02',
                                                icon:'plus',
                                                location:'after',
                                                onClick:async()=>
                                                {
                                                    this.txtQuantity.value = Number(this.txtQuantity.value) + 1 
                                                    this.data.QUANTITY = this.txtQuantity.value
                                                    this._onValueChange(this.data)
                                                }
                                            }                                                    
                                        ]}>
                                        </NdTextBox>
                                    </Item>
                                </Form>
                                {/* İNDİRİM POPUP */}
                                <div>
                                    <NbPopUp parent={this} id={"popDiscount"} 
                                    centered={true}
                                    title={this.t("popDiscount.title")}
                                    >
                                        <Form colCount={1} height={'fit-content'}>
                                            <Item>
                                                <Label text={this.t("popDiscount.Percent1")} alignment="right" />
                                                <NdNumberBox id="txtDiscountPercent1" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPercent1.value > 100)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPercent',showTitle:true,title:this.t("msgDiscountPercent.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPercent.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPercent.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent1.value = 0;
                                                        this.txtDiscountPrice1.value = 0;
                                                        return
                                                    }

                                                    this.txtDiscountPrice1.value =  Number(this.data.QUANTITY * this.data.PRICE).rateInc(this.txtDiscountPercent1.value,2)
                                                }).bind(this)}
                                                ></NdNumberBox>
                                            </Item>
                                            <Item>
                                                <Label text={this.t("popDiscount.Price1")} alignment="right" />
                                                <NdNumberBox id="txtDiscountPrice1" parent={this} simple={true}
                                                maxLength={32}
                                                onValueChanged={(async()=>
                                                {
                                                    if( this.txtDiscountPrice1.value > this.data.AMOUNT)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgDiscountPrice',showTitle:true,title:this.t("msgDiscountPrice.title"),showCloseButton:true,width:'500px',height:'200px',
                                                            button:[{id:"btn01",caption:this.t("msgDiscountPrice.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgDiscountPrice.msg")}</div>)
                                                        }
                                            
                                                        await dialog(tmpConfObj);
                                                        this.txtDiscountPercent1.value = 0;
                                                        this.txtDiscountPrice1.value = 0;
                                                        return
                                                    }
                                                    
                                                    this.txtDiscountPercent1.value = Number(this.data.QUANTITY * this.data.PRICE).rate2Num(this.txtDiscountPrice1.value,3)
                                                }).bind(this)}
                                                ></NdNumberBox>
                                            </Item>
                                            <Item>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <NdButton text={this.t("btnSave")} type="normal" stylingMode="contained" width={'100%'} 
                                                        onClick={async ()=>
                                                        {
                                                            this.txtDiscount.value = this.txtDiscountPrice1.value
                                                            this.data.DISCOUNT = this.txtDiscountPrice1.value
                                                            this._onValueChange(this.data)
                                                            this.popDiscount.hide();
                                                        }}/>
                                                    </div>
                                                    <div className='col-6'>
                                                        <NdButton text={this.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                                        onClick={()=>
                                                        {
                                                            this.popDiscount.hide();  
                                                        }}/>
                                                    </div>
                                                </div>
                                            </Item>
                                        </Form>
                                    </NbPopUp>
                                </div> 
                            </div>
                        </div>
                        <div className='row pt-2'>
                            <div className='col-12'>
                                <NdGrid id="grdQuantity" parent={this} 
                                    selection={{mode:"single"}} 
                                    showBorders={true}
                                    headerFilter={{visible:false}}
                                    columnAutoWidth={true}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    >                            
                                        <Paging defaultPageSize={5} />
                                        <Column dataField="DEPOT_QUANTITY" caption={this.t("grdQuantity.clmDepot")} visible={true} width={150}/> 
                                        <Column dataField="INPUT_RESERVE" caption={this.t("grdQuantity.clmInput")} visible={true} width={250}/> 
                                        <Column dataField="OUTPUT_RESERVE" caption={this.t("grdQuantity.clmOutput")} visible={true} width={100}/> 
                                        <Column dataField="TOTAL_QUANTITY" caption={this.t("grdQuantity.clmTotal")} visible={true} width={150} /> 
                                </NdGrid>
                            </div>                                            
                        </div>
                    </div>
                </div>
            </NbPopUp>
            </React.Fragment>
        )
    }
}