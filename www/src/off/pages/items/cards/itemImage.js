import React from 'react';
import App from '../../../lib/app.js';
import {itemImageCls} from '../../../../core/cls/items.js'
import moment from 'moment';

import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';

import NdTextBox, { Validator, NumericRule, RequiredRule, CompareRule, EmailRule, PatternRule, StringLengthRule, RangeRule, AsyncRule } from '../../../../core/react/devex/textbox.js'
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdGrid,{Column,Editing,Paging,Scrolling,Button as grdbutton} from '../../../../core/react/devex/grid.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NbLabel from '../../../../core/react/bootstrap/label';
import { datatable } from '../../../../core/core.js';

export default class itemImage extends React.PureComponent
{
    constructor(props)
    {
        super(props)                
        this.state = {underPrice : "",isItemGrpForOrginsValid : false,isItemGrpForMinMaxAccess : false,isTaxSugar : false}
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});

        this.itemImageObj = new itemImageCls();
        
        this.tabIndex = props.data.tabkey
        this.tmpGuid = ""
    }    
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        if(typeof this.pagePrm != 'undefined')
        {
            await this.init(); 
            this.getItem(this.pagePrm.CODE)
        }
        else
        {
            this.init(); 
        }
    }    
    async init()
    {  
        this.itemImageObj.clearAll();
        this.tmpGuid = "";
        this.txtRef.value = "";
        this.lblName.value = "";
        this.imgFile1.value = "";
        this.imgFile2.value = "";
        this.imgFile3.value = "";
        this.imgFile4.value = "";
        this.imgFile5.value = "";
    }
    async getItem(pCode,pName,pGuid)
    {
        this.itemImageObj.clearAll();

        this.txtRef.value = pCode
        this.lblName.value = pName
        this.tmpGuid = pGuid

        await this.itemImageObj.load({ITEM_CODE:pCode});        
    }
    async selectedImage(pSort,pImage,pWidth,pHeight)
    {
        if(this.itemImageObj.dt().where({SORT:pSort}).length == 0)
        {
            this.itemImageObj.addEmpty();
        
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].CUSER = this.core.auth.data.CODE,  
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].ITEM_GUID = this.tmpGuid 
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].IMAGE = pImage
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].SORT = pSort
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].WIDTH = pWidth
            this.itemImageObj.dt()[this.itemImageObj.dt().length - 1].HEIGHT = pHeight
        }
        else
        {
            let tmpDt = this.itemImageObj.dt().where({SORT:pSort})
            tmpDt[0].CUSER = this.core.auth.data.CODE,  
            tmpDt[0].ITEM_GUID = this.tmpGuid 
            tmpDt[0].IMAGE = pImage
            tmpDt[0].SORT = pSort
            tmpDt[0].WIDTH = pWidth
            tmpDt[0].HEIGHT = pHeight
        }
    }
    async deleteRow(pSort)
    {        
        if(this.itemImageObj.dt().where({SORT:pSort}).length > 0)
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
                this["imgFile" + (pSort + 1)].value = "";
                this.itemImageObj.dt().removeAt(this.itemImageObj.dt().where({SORT:pSort})[0])
                this.itemImageObj.dt().delete();
            }
        }
    }
    render()
    {           
        return (
            <React.Fragment>                
                <ScrollView>                    
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnNew" parent={this} icon="file" type="default"
                                    onClick={()=>
                                    {
                                        this.init(); 
                                    }}/>
                                </Item>
                                <Item location="after" locateInMenu="auto">
                                    <NdButton id="btnSave" parent={this} icon="floppy" type="success" validationGroup={"frmItems" + this.tabIndex}
                                    onClick={async (e)=>
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
                                            
                                            if((await this.itemImageObj.save()) == 0)
                                            {         
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"green"}}>{this.t("msgSaveResult.msgSuccess")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
                                            else
                                            {
                                                tmpConfObj1.content = (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgSaveResult.msgFailed")}</div>)
                                                await dialog(tmpConfObj1);
                                            }
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
                                            this.itemImageObj.dt().removeAll()
                                            this.itemImageObj.dt().delete()
                                            this.init()
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
                            <Form colCount={2} id={"frmItemImage" + this.tabIndex}>
                                {/* txtRef */}
                                <Item>                                    
                                    <Label text={this.t("txtRef")} alignment="right" />
                                    <NdTextBox id="txtRef" parent={this} simple={true} tabIndex={this.tabIndex}
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
                                                            this.getItem(data[0].CODE,data[0].NAME,data[0].GUID)
                                                        }
                                                    }
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
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>      
                                    {/* STOK SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtRef"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtRef.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,CODE,NAME,STATUS FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    >
                                        <Column dataField="CODE" caption={this.t("pg_txtRef.clmCode")} width={'20%'} />
                                        <Column dataField="NAME" caption={this.t("pg_txtRef.clmName")} width={'70%'} defaultSortOrder="asc" />
                                        <Column dataField="STATUS" caption={this.t("pg_txtRef.clmStatus")} width={'10%'} />
                                    </NdPopGrid>
                                </Item>
                                {/* Name */}
                                <Item> 
                                    <NbLabel id="lblName" parent={this} value={""}/>
                                </Item>
                            </Form>
                        </div>                        
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <h3>Küçük Resim - 120X90</h3>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">  
                        <div className="col-2">
                            <div className='row'>
                                <div className='col-12'>
                                    <NdImageUpload id="imgFile1" parent={this} dt={{data:this.itemImageObj.dt(),field:"IMAGE",filter:{SORT:0}}} imageWidth={"120"} imageHeight={"90"} imageScale={true} buttonTrigger={"#btnSmallImg"}
                                    onValueChanged={async(e)=>
                                    {
                                        let tmpResolution = await this.imgFile1.getResolution()
                                        this.selectedImage(0,e,tmpResolution.width,tmpResolution.height)
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnSmallImg" parent={this} icon="add" type="default" width='100%'/>
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={async()=>
                                    {
                                        this.deleteRow(0)
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <h3>Büyük Resim - 620X465</h3>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">  
                        <div className="col-2">
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile2" parent={this} dt={{data:this.itemImageObj.dt(),field:"IMAGE",filter:{SORT:1}}} imageWidth={"620"} imageHeight={"465"} imageScale={true} buttonTrigger={"#btnLargeImg1"}
                                    onValueChanged={async(e)=>
                                    {
                                        let tmpResolution = await this.imgFile2.getResolution()
                                        this.selectedImage(1,e,tmpResolution.width,tmpResolution.height)
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnLargeImg1" parent={this} icon="add" type="default" width='100%'/>
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={()=>
                                    {
                                        this.deleteRow(1)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile3" parent={this} dt={{data:this.itemImageObj.dt(),field:"IMAGE",filter:{SORT:2}}} imageWidth={"620"} imageScale={true} buttonTrigger={"#btnLargeImg2"}
                                    onValueChanged={async(e)=>
                                    {
                                        let tmpResolution = await this.imgFile3.getResolution()
                                        this.selectedImage(2,e,tmpResolution.width,tmpResolution.height)
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnLargeImg2" parent={this} icon="add" type="default" width='100%'/>
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={()=>
                                    {
                                        this.deleteRow(2)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile4" parent={this} dt={{data:this.itemImageObj.dt(),field:"IMAGE",filter:{SORT:3}}} imageWidth={"620"} imageScale={true} buttonTrigger={"#btnLargeImg3"}
                                    onValueChanged={async(e)=>
                                    {
                                        let tmpResolution = await this.imgFile4.getResolution()
                                        this.selectedImage(3,e,tmpResolution.width,tmpResolution.height)
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnLargeImg3" parent={this} icon="add" type="default" width='100%'/>
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={()=>
                                    {
                                        this.deleteRow(3)
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className='row'>
                                <div className='col-12'>                                
                                    <NdImageUpload id="imgFile5" parent={this} dt={{data:this.itemImageObj.dt(),field:"IMAGE",filter:{SORT:4}}} imageWidth={"620"} imageScale={true} buttonTrigger={"#btnLargeImg4"}
                                    onValueChanged={async(e)=>
                                    {
                                        let tmpResolution = await this.imgFile5.getResolution()
                                        this.selectedImage(4,e,tmpResolution.width,tmpResolution.height)
                                    }}/>
                                </div>
                            </div>
                            <div className='row pt-2'>
                                <div className='col-6'>
                                    <NdButton id="btnLargeImg4" parent={this} icon="add" type="default" width='100%'/>
                                </div>
                                <div className='col-6'>
                                    <NdButton id="btnImgDel" parent={this} icon="trash" type="default" width='100%'
                                    onClick={()=>
                                    {
                                        this.deleteRow(4)
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollView>
            </React.Fragment>
        )
    }
}