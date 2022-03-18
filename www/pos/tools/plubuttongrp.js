import React from "react";
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NbPosPopGrid,{Column} from "./pospopgrid.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NbKeyboard from "./keyboard.js";
import { posPluCls } from "../../core/cls/pos.js";
import { datatable } from "../../core/core.js";
import { dialog } from "../../core/react/devex/dialog.js";
import App from "../lib/app.js";

export default class NbPluButtonGrp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.pluObj = new posPluCls()
        this.state =
        {
            btnCategory : [],
            btnImage : [],
            btnPlu : []
        }
        this.edit = true;
        this.isCategory = 0
        this.clickData = {};
        this.init()

        this._onClick = this._onClick.bind(this);
    }
    async init()
    {
        await this.pluObj.load({CUSER:this.core.auth.data.CODE})
        this.setCategory(this.isCategory)
    }
    setCategory(pIndex)
    {
        this.isCategory = pIndex
        this.setState(
        {
            btnCategory:this.pluObj.dt().where({TYPE:0}),
            btnPlu:this.pluObj.dt().where({TYPE:1}).where({GROUP_INDEX:pIndex}),
            btnImage:this.pluObj.dt().where({TYPE:2}).where({GROUP_INDEX:pIndex})
        })
    }
    refresh()
    {
        this.setCategory(this.isCategory)
    }
    _btnCategoryView()
    {
        let tmpView = []
        for (let i = 0; i < 5; i++) 
        {
            let tmpData = []
            if(typeof this.state.btnCategory != 'undefined' && this.state.btnCategory instanceof datatable)
            {
                tmpData = this.state.btnCategory.where({LOCATION:i})
            }
            if(tmpData.length == 0)
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnCategory" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnCategory" + i} 
                        parent={this} className="form-group btn btn-info btn-block my-1 text-white" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,0)}}>
                        </NbButton>
                    </div>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <div key={this.props.id + "_btnCategory" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnCategory" + i} 
                        parent={this} className="form-group btn btn-info btn-block my-1 text-white" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,0,tmpData[0])}}>
                        {tmpData[0].NAME}
                        </NbButton>
                    </div>
                )
            }
            
        }
        return tmpView;
    }
    _btnImageView()
    {
        let tmpView = []
        for (let i = 0; i < 5; i++) 
        {
            let tmpData = []
            if(typeof this.state.btnImage != 'undefined' && this.state.btnImage instanceof datatable)
            {
                tmpData = this.state.btnImage.where({LOCATION:i})
            }
            if(tmpData.length == 0)
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnImage" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} parent={this} className="form-group btn btn-dark btn-block my-1" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,2)}}>
                        </NbButton>
                    </div>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <div key={this.props.id + "_btnImage" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} parent={this} className="form-group btn btn-dark btn-block my-1" 
                        style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,2,tmpData[0])}}>
                        {tmpData[0].NAME}
                        </NbButton>
                    </div>
                )
            }
        }
        return tmpView;
    }
    _btnPluView1()
    {
        let tmpView = []
        for (let i = 0; i < 5; i++) 
        {   
            let tmpData = []
            if(typeof this.state.btnPlu != 'undefined' && this.state.btnPlu instanceof datatable)
            {
                tmpData = this.state.btnPlu.where({LOCATION:i})
            }
            if(tmpData.length == 0)
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnPlu" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,1)}}>
                        </NbButton>
                    </div>
                )  
            }
            else
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnPlu" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,1,tmpData[0])}}>
                        {tmpData[0].NAME}
                        </NbButton>
                    </div>
                )
            }
        }
        return tmpView;
    }
    _btnPluView2()
    {
        let tmpView = []
        for (let i = 5; i < 10; i++) 
        {
            let tmpData = []
            if(typeof this.state.btnPlu != 'undefined' && this.state.btnPlu instanceof datatable)
            {
                tmpData = this.state.btnPlu.where({LOCATION:i})
            }
            if(tmpData.length == 0)
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnPlu" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,1)}}>
                        </NbButton>
                    </div>
                )  
            }
            else
            {
                tmpView.push
                (
                    <div key={this.props.id + "_btnPlu" + i} className="col px-1">
                        <NbButton id={this.props.id + "_btnImage" + i} className="form-group btn btn-success btn-block my-1" style={{height:"70px",width:"100%",fontSize:"10pt"}}
                        onClick={()=>{this._onClick(i,1,tmpData[0])}}>
                        {tmpData[0].NAME}
                        </NbButton>
                    </div>
                )
            }
        }
        return tmpView;
    }
    async _onClick(pIndex,pType,pData)
    {
        this.clickData = {index:pIndex,type:pType,data:pData,status:typeof pData == 'undefined' ? 0 : 1} //status : 0 = new, 1 = update

        if(this.edit)
        {    
            if(pType == 0)
            {
                if(this.clickData.status == 1) //update
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Düzenle",location:'before'},{id:"btn02",caption:"Sil",location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Buton üzerinde ne yapmak istiyorsunuz ?"}</div>)
                    }
                    let pResult = await dialog(tmpConfObj);
                    if(typeof pResult == 'undefined')
                    {
                        return
                    }
                    if(pResult == 'btn02')
                    {
                        let tmpData = this.pluObj.dt();
                        for (let i = 0; i < tmpData.length; i++) 
                        {
                            if(tmpData[i].GROUP_INDEX == pIndex)
                            {
                                tmpData.removeAt(i)
                            }
                        }
                        this.refresh();
                        return;                        
                    }
                }
                this.popGroupEntry.show()
            }        
            else if(pType == 1)
            {
                if(this.clickData.status == 1) //update
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Düzenle",location:'before'},{id:"btn02",caption:"Sil",location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Buton üzerinde ne yapmak istiyorsunuz ?"}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(typeof pResult == 'undefined')
                    {
                        return
                    }
                    if(pResult == 'btn02')
                    {
                        let tmpData = this.pluObj.dt();
                        for (let i = 0; i < tmpData.length; i++) 
                        {
                            if(tmpData[i].GUID == pData.GUID)
                            {
                                tmpData.removeAt(i)
                            }
                        }
                        this.refresh();
                        return;                        
                    }
                }

                this[this.props.id + "_popSelect"].setTitle("Stok Seçim")
                this[this.props.id + "_popSelect"].data = 
                {
                    source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,NAME FROM ITEMS_VW_01 WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.props.parent.core.sql
                    }
                }
                this[this.props.id + "_popSelect"].show()
            }
            else if(pType == 2)
            {
                if(this.clickData.status == 1) //update
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:"Dikkat",
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:"Düzenle",location:'before'},{id:"btn02",caption:"Sil",location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{"Buton üzerinde ne yapmak istiyorsunuz ?"}</div>)
                    }
                    
                    let pResult = await dialog(tmpConfObj);
                    if(typeof pResult == 'undefined')
                    {
                        return
                    }
                    if(pResult == 'btn02')
                    {
                        let tmpData = this.pluObj.dt();
                        for (let i = 0; i < tmpData.length; i++) 
                        {
                            if(tmpData[i].GUID == pData.GUID)
                            {
                                tmpData.removeAt(i)
                            }
                        }
                        this.refresh();
                        return;                        
                    }
                }
                this[this.props.id + "_popSelect"].setTitle("Ürün Grubu Seçim")
                this[this.props.id + "_popSelect"].data = 
                {
                    source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,NAME FROM ITEM_GROUP WHERE UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)",
                            param : ['VAL:string|50']
                        },
                        sql:this.props.parent.core.sql
                    }
                }
                this[this.props.id + "_popSelect"].show()
            }
        }
        else
        {
            if(typeof pData != 'undefined')
            {
                if(typeof this.props.onClick != 'undefined')
                {
                    this.props.onClick(pIndex,pData);
                }
                if(pData.TYPE == 0)
                {
                    this.setCategory(pIndex)
                }
            }
        }                
    }
    render()
    {
        return(
            <div>
                {/* PLU (Line 1)  */}
                <div className="row">
                    {this._btnPluView1()}
                </div>
                {/* PLU (Line 2) */}
                <div className="row">
                    {this._btnPluView2()}
                </div>
                {/* PLU Group (Line 3) */}
                <div className="row">
                    {this._btnCategoryView()}
                </div>
                {/* PLU Image Group (Line 4) */}
                <div className="row">
                    {this._btnImageView()}
                </div>
                {/* Selection List Popup */}
                <div>
                    <NbPosPopGrid id={this.props.id + "_popSelect"} parent={this} width={"900"} height={"650"} position={"#root"}
                    onSelection={(pData)=>
                    {
                        if(pData.length > 0)
                        {
                            if(this.clickData.status == 0) //new
                            {
                                this.pluObj.addEmpty()
                                this.pluObj.dt()[this.pluObj.dt().length-1].TYPE = this.clickData.type
                                this.pluObj.dt()[this.pluObj.dt().length-1].NAME = pData[0].NAME
                                this.pluObj.dt()[this.pluObj.dt().length-1].LINK = pData[0].GUID
                                this.pluObj.dt()[this.pluObj.dt().length-1].LOCATION = this.clickData.index
                                this.pluObj.dt()[this.pluObj.dt().length-1].GROUP_INDEX = this.isCategory
                                this.refresh();
                            }
                            else if(this.clickData.status == 1) //update
                            {                            
                                let tmpData = this.pluObj.dt().where({GUID:this.clickData.data.GUID});
                                if(tmpData.length > 0)
                                {
                                    tmpData[0].NAME = pData[0].NAME
                                    tmpData[0].LINK = pData[0].LINK
                                }
                                this.popGroupEntry.hide();
                                this.refresh();
                            }
                        }
                        
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={150} />
                        <Column dataField="NAME" caption={"NAME"} width={250} />
                    </NbPosPopGrid>
                </div> 
                {/* Group Entry Popup */}
                <div>
                    <NdPopUp parent={this} id={"popGroupEntry"} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Plu Grubu"}
                    container={"#root"} 
                    width={"700"}
                    height={"420"}
                    position={{of:"#root"}}
                    >
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id={"txtGroupEntry"} parent={this} simple={true} />     
                            </div>                            
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnSelect" + this.props.id} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={async ()=>
                                {
                                    if(this.clickData.status == 0) //new
                                    {
                                        this.pluObj.addEmpty()
                                        this.pluObj.dt()[this.pluObj.dt().length-1].TYPE = 0
                                        this.pluObj.dt()[this.pluObj.dt().length-1].NAME = this.txtGroupEntry.value
                                        this.pluObj.dt()[this.pluObj.dt().length-1].LOCATION = this.clickData.index
                                        this.pluObj.dt()[this.pluObj.dt().length-1].GROUP_INDEX = this.clickData.index
                                        this.popGroupEntry.hide();
                                        this.refresh();
                                    }
                                    else if(this.clickData.status == 1) //update
                                    {
                                        let tmpData = this.pluObj.dt().where({GUID:this.clickData.data.GUID});
                                        if(tmpData.length > 0)
                                        {
                                            tmpData[0].NAME = this.txtGroupEntry.value
                                        }
                                        this.popGroupEntry.hide();
                                        this.refresh();
                                    }
                                }}><i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} /></NbButton>
                            </div>
                        </div>
                        <div className="row pt-1">
                            <NbKeyboard id={"keyGroupEntry"} parent={this} textobj={"txtGroupEntry"} span={1} buttonHeight={"40px"}/>
                        </div>
                    </NdPopUp>
                </div>
            </div>
        )
    }
}