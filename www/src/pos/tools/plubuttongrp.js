import React from "react";
import LoadIndicator from 'devextreme-react/load-indicator';
import NbBase from "../../core/react/bootstrap/base.js";
import NbButton from "../../core/react/bootstrap/button.js";
import NbPosPopGrid,{Column} from "./pospopgrid.js";
import NdPopUp from "../../core/react/devex/popup.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import NbPopUp from "../../core/react/bootstrap/popup.js";
import { posPluCls } from "../../core/cls/pos.js";
import { datatable } from "../../core/core.js";
import { dialog } from "../../core/react/devex/dialog.js";
import App from "../lib/app.js";
import NdNumberBox from "../../core/react/devex/numberbox.js";
import { NdLayout,NdLayoutItem } from '../../core/react/devex/layout';
export default class NbPluButtonGrp extends NbBase
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.pluObj = new posPluCls();
        
        this.state =
        {
            btnCategory : [],
            btnGroup : [],
            btnPlu : [],
            isLoading : true,
            btnPluImageGrp : [],
            pluImageCurrentPage : 1
        }
        this.edit = false;
        this.isCategory = 0
        this.clickData = {};
        
        this.pluImageDt = new datatable();        

        this.init()

        this._onClick = this._onClick.bind(this);
        this._onSelection = this._onSelection.bind(this);
    }
    async init()
    {        
        await this.pluObj.load({CUSER:this.core.auth.data.CODE})
        this.setCategory(this.isCategory)        

        let tmpArr = []
        for (let i = 0; i < this.pluObj.dt().where({TYPE:2}).length; i++) 
        {
            tmpArr.push(this.pluObj.dt().where({TYPE:2})[i].LINK)
        }
        
        this.pluImageDt.selectCmd = 
        {
            query : `SELECT *,ISNULL((SELECT TOP 1 1 FROM PROMO_COND_APP_VW_01 WHERE COND_ITEM_GUID = ITEM_GUID AND START_DATE <= CONVERT(NVARCHAR(10),GETDATE(),112) AND 
                    FINISH_DATE >= CONVERT(NVARCHAR(10),GETDATE(),112)),0) AS PROMO FROM PLU_IMAGE_VW_01 WHERE MAIN_GUID IN (SELECT CASE WHEN value = '' THEN '00000000-0000-0000-0000-000000000000' ELSE value END 
                    FROM STRING_SPLIT(@MAIN_GUID,',')) ORDER BY ITEM_NAME ASC`,
            param : ['MAIN_GUID:string|max'],
            value : [tmpArr.toString()],
            local : 
            {
                type : "select",
                query : `SELECT * FROM PLU_IMAGE_VW_01 WHERE MAIN_GUID IN (${tmpArr.map(() => '?').join(',')}) ORDER BY ITEM_NAME ASC`,
                values : tmpArr,
            }
        }        
        await this.pluImageDt.refresh()
        this.setState({isLoading:false})
    }
    async save()
    {
        await this.pluObj.save();
        this.setState({isLoading:true})
        this.init()
    }
    setCategory(pIndex)
    {
        this.isCategory = pIndex
        this.setState(
        {
            btnCategory:this.pluObj.dt().where({TYPE:0}),
            btnPlu:this.pluObj.dt().where({TYPE:1}).where({GROUP_INDEX:pIndex}),
            btnGroup:this.pluObj.dt().where({TYPE:2}).where({GROUP_INDEX:pIndex})
        })
    }
    refresh()
    {
        this.setCategory(this.isCategory)
    }
    pluImageShow(pCode)
    {
        this["popPluGroup" + this.props.id].show()        
        this.setState(
        {
            btnPluImageGrp:this.pluImageDt.where({MAIN_GUID:pCode}),
            pluImageCurrentPage:1
        })
    }
    _btnCategoryView()
    {
        let tmpView = []
        for (let i = 0; i < 6; i++) 
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
                    <NdLayoutItem key={"btnCategory" + this.props.id + i + "Ly"} id={"btnCategory" + this.props.id + i + "Ly"} data-grid={{x:i,y:2,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnCategory" + this.props.id + i} parent={this} className="form-group btn btn-info btn-block text-white" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,0)}}>
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <NdLayoutItem key={"btnCategory" + this.props.id + i + "Ly"} id={"btnCategory" + this.props.id + i + "Ly"} data-grid={{x:i,y:2,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnCategory" + this.props.id + i} parent={this} className="form-group btn btn-info btn-block text-white" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"    }}
                            onClick={()=>{this._onClick(i,0,tmpData[0])}}>
                            {tmpData[0].NAME}
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )
            }
        }
        return tmpView;
    }
    _btnGroupView()
    {
        let tmpView = []
        for (let i = 0; i < 6; i++) 
        {
            let tmpData = []
            if(typeof this.state.btnGroup != 'undefined' && this.state.btnGroup instanceof datatable)
            {
                tmpData = this.state.btnGroup.where({LOCATION:i})
            }
            if(tmpData.length == 0)
            {
                tmpView.push
                (
                    <NdLayoutItem key={"btnGroup" + this.props.id + i + "Ly"} id={"btnGroup" + this.props.id + i + "Ly"} data-grid={{x:i,y:3,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnGroup" + this.props.id + i} parent={this} className="form-group btn btn-dark btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,2)}}>
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )    
            }
            else
            {                
                tmpView.push
                (
                    <NdLayoutItem key={"btnGroup" + this.props.id + i + "Ly"} id={"btnGroup" + this.props.id + i + "Ly"} data-grid={{x:i,y:3,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnGroup" + this.props.id + i} parent={this} className="form-group btn btn-dark btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,2,tmpData[0])}}>
                            {tmpData[0].NAME}
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )
            }
        }
        return tmpView;
    }
    _btnPluView1()
    {
        let tmpView = []
        for (let i = 0; i < 6; i++) 
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
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:i,y:0,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1)}}>
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )  
            }
            else
            {
                tmpView.push
                (
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:i,y:0,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1,tmpData[0])}}>
                            {tmpData[0].NAME}
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )
            }
        }
        return tmpView;
    }
    _btnPluView2()
    {
        let tmpView = []
        for (let i = 6; i < 12; i++) 
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
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:(i-6),y:1,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1)}}>
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )  
            }
            else
            {
                tmpView.push
                (
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:(i-6),y:1,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1,tmpData[0])}}>
                            {tmpData[0].NAME}
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )
            }
        }
        return tmpView;
    }
    _btnPluView3()
    {
        let tmpView = []
        for (let i = 12; i < 18; i++) 
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
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:(i-12),y:1,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1)}}>
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )  
            }
            else
            {
                tmpView.push
                (
                    <NdLayoutItem key={"btnPlu" + this.props.id + i + "Ly"} id={"btnPlu" + this.props.id + i + "Ly"} data-grid={{x:(i-12),y:1,h:1,w:1}}>
                        <div>
                            <NbButton id={"btnPlu" + this.props.id + i} className="form-group btn btn-success btn-block" style={{height:"100%",width:"100%",fontSize:"10px",padding:"0px"}}
                            onClick={()=>{this._onClick(i,1,tmpData[0])}}>
                            {tmpData[0].NAME}
                            </NbButton>
                        </div>
                    </NdLayoutItem>
                )
            }
        }
        return tmpView;
    }
    _btnPluImageGrpView()
    {
        if(this.state.btnPluImageGrp.length == 0)
        {
            return
        }

        let tmpView = []
        let tmpPageCount = Math.ceil(this.state.btnPluImageGrp.length / 24)
        let tmpPageMod = this.state.btnPluImageGrp.length % 24 == 0 ? 24 : this.state.btnPluImageGrp.length % 24
        let tmpPageStart = (this.state.pluImageCurrentPage - 1) * 24
        let tmpPageEnd = tmpPageCount == this.state.pluImageCurrentPage ? tmpPageStart + tmpPageMod : tmpPageStart + 24 //EĞER SON SATIRDA MOD VARSA KONTROLÜ 
        
        let tmpColumn = []

        for (let i = tmpPageStart; i < tmpPageEnd; i++) 
        {
            let tmpImg = "url(" + this.state.btnPluImageGrp[i].IMAGE + ")"
            let tmpColor = "rgba(47, 198, 26, 0.5)"
            let tmpTxtPromo = ""
            if(this.state.btnPluImageGrp[i].PROMO == 1)
            {
                tmpTxtPromo = " - PROMO"
                tmpColor = "rgba(255,0,0,0.8)"
            }
            tmpColumn.push(
                <div key={i} className='col-2 ps-0 pe-1'>
                    <NbButton id={"btnPopPluGroup" + i} parent={this} className="form-group btn btn-success btn-block" 
                    style={{height:"100px",width:"100%",fontSize:"14px",backgroundSize:"100% 100%",padding:"0px",position:"relative",backgroundImage:tmpImg}}
                    onClick={()=>
                    {
                        this["popPluGroup" + this.props.id].hide();
                        this._onSelection(this.state.btnPluImageGrp[i].ITEM_CODE);
                    }}>
                        <div style={{backgroundColor:tmpColor,position:"relative",bottom:"32px",height:"35px",borderBottomRightRadius:"0.215rem",
                        borderBottomLeftRadius:"0.215rem"}}>
                            <div style={{fontSize:"12px",color:"black",fontWeight:"bold"}}>
                                {this.state.btnPluImageGrp[i].ITEM_NAME + tmpTxtPromo}
                            </div>                                            
                        </div>
                        <div style={{position:"absolute",bottom:"0",right:"5px",fontSize:"12px",color:"black",fontWeight:"bold"}}>
                            {this.state.btnPluImageGrp[i].ORGINS_CODE + " " + Number(this.state.btnPluImageGrp[i].PRICE).round(2) + Number.money.sign}
                        </div>   
                    </NbButton>
                </div>
            )
            
            if(i % 6 == 5 || i == (tmpPageEnd-1))
            {
                tmpView.push(<div key={i} className='row py-1'>{tmpColumn}</div>)
                tmpColumn = []
            }
        }
        
        return(tmpView)
    }
    _btnAlphClick()
    {
        if(this.parent.clickData.data.TYPE == 2)
        {
            let tmpData = this.parent.pluImageDt.where({MAIN_GUID:this.parent.clickData.data.LINK})
            if(this.children != "ALL")
            {
                tmpData = tmpData.filter(x => x.ITEM_NAME.indexOf(this.children) == 0)
            }

            this.parent.setState(
                {
                    btnPluImageGrp : tmpData,
                    pluImageCurrentPage:1
                }
            )
        }
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
                        title:this.lang.t("nbPluButtonGrp.msgRef.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("nbPluButtonGrp.msgRef.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("nbPluButtonGrp.msgRef.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("nbPluButtonGrp.msgRef.msg")}</div>)
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
                        await this.pluObj.dt().delete()
                        this.refresh();
                        return;                        
                    }
                }
                this["txtGroupEntry" + this.props.id].value = ""
                this["popGroupEntry" + this.props.id].show()
            }        
            else if(pType == 1)
            {
                if(this.clickData.status == 1) //update
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:this.lang.t("nbPluButtonGrp.msgRef.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("nbPluButtonGrp.msgRef.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("nbPluButtonGrp.msgRef.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("nbPluButtonGrp.msgRef.msg")}</div>)
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
                        await this.pluObj.dt().delete()
                        this.refresh();
                        return;                        
                    }
                }

                this["popSelect" + this.props.id].setTitle(this.lang.t("nbPluButtonGrp.popSelectItem"))
                this["popSelect" + this.props.id].data = 
                {
                    source:
                    {
                        select:
                        {
                            query : "SELECT GUID,CODE,NAME,ROUND((SELECT dbo.FN_PRICE(GUID,1,GETDATE(),'00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-000000000000',1,0,1)), 2) AS PRICE FROM ITEMS_VW_01 WHERE (UPPER(CODE) LIKE UPPER(@VAL) OR UPPER(NAME) LIKE UPPER(@VAL)) AND STATUS = 1 ",
                            param : ['VAL:string|50']
                        },
                        sql:this.props.parent.core.sql
                    }
                }
                this["popSelect" + this.props.id].clear()
                this["popSelect" + this.props.id].show()
            }
            else if(pType == 2)
            {
                if(this.clickData.status == 1) //update
                {
                    let tmpConfObj =
                    {
                        id:'msgRef',
                        showTitle:true,
                        title:this.lang.t("nbPluButtonGrp.msgRef.title"),
                        showCloseButton:true,
                        width:'500px',
                        height:'200px',
                        button:[{id:"btn01",caption:this.lang.t("nbPluButtonGrp.msgRef.btn01"),location:'before'},{id:"btn02",caption:this.lang.t("nbPluButtonGrp.msgRef.btn02"),location:'after'}],
                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("nbPluButtonGrp.msgRef.msg")}</div>)
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
                        await this.pluObj.dt().delete()
                        this.refresh();
                        return;                        
                    }
                }
                this["popSelect" + this.props.id].setTitle(this.lang.t("nbPluButtonGrp.popSelectItemGrp"))
                this["popSelect" + this.props.id].data = 
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
                this["popSelect" + this.props.id].clear()
                this["popSelect" + this.props.id].show()
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
                else if(pData.TYPE == 1)
                {
                    this._onSelection(pData.LINK_CODE,pData.QUANTITY);
                }
                else if(pData.TYPE == 2)
                {
                    this.pluImageShow(pData.LINK)
                }
            }
        }                
    }
    _onSelection(pItem,pQuantity)
    {
        if(typeof this.props.onSelection != 'undefined')
        {            
            this.props.onSelection(pItem,pQuantity);
        }
    }
    render()
    {
        if(this.state.isLoading)
        {
            return(<div style={{position: 'relative',margin:'auto',top: '40%',left:'50%'}}><LoadIndicator height={40} width={40} /></div>)
        }

        return(
            <div style={{width:'101.3%'}}>
                <NdLayout parent={this} id={"frmPluBtnGrp"} cols={6} rowHeight={60} margin={[4,4]}>
                    {this._btnPluView1()}
                    {this._btnPluView2()}
                    {this._btnPluView3()}
                    {this._btnCategoryView()}
                    {this._btnGroupView()}
                </NdLayout>
                {/* Selection List Popup */}
                <div>
                    <NbPosPopGrid id={"popSelect" + this.props.id} parent={this} width={"100%"} height={"100%"} position={"#root"}
                    onSelection={(pData)=>
                    {
                        if(pData.length > 0)
                        {           
                            this.clickData.data = pData[0]
                            this["popNameEntry" + this.props.id].show()
                            this["txtNameEntry" + this.props.id].value = pData[0].NAME
                            this["txtQuantityEntry" + this.props.id].value = 1
                        }
                    }}>
                        <Column dataField="CODE" caption={"CODE"} width={150} />
                        <Column dataField="NAME" caption={"NAME"} width={250} />
                        <Column dataField="PRICE" caption={"PRICE"} width={250} />
                    </NbPosPopGrid>
                </div> 
                {/* Group Entry Popup */}
                <div>
                    <NdPopUp parent={this} id={"popGroupEntry" + this.props.id} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={"Plu Grubu"}
                    container={"#root"} 
                    width={"700"}
                    height={"460"}
                    position={{of:"#root"}}
                    >
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id={"txtGroupEntry" + this.props.id} parent={this} simple={true} onValueChanging={(e)=>{this.keyGroupEntry.setInput(e)}} />     
                            </div>                            
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnSelectGroupEntry" + this.props.id} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={async ()=>
                                {
                                    if(this.clickData.status == 0) //new
                                    {
                                        this.pluObj.addEmpty()
                                        this.pluObj.dt()[this.pluObj.dt().length-1].TYPE = 0
                                        this.pluObj.dt()[this.pluObj.dt().length-1].NAME = this["txtGroupEntry" + this.props.id].value
                                        this.pluObj.dt()[this.pluObj.dt().length-1].LOCATION = this.clickData.index
                                        this.pluObj.dt()[this.pluObj.dt().length-1].GROUP_INDEX = this.clickData.index
                                        this["popGroupEntry" + this.props.id].hide();
                                        this.refresh();
                                    }
                                    else if(this.clickData.status == 1) //update
                                    {
                                        let tmpData = this.pluObj.dt().where({GUID:this.clickData.data.GUID});
                                        if(tmpData.length > 0)
                                        {
                                            tmpData[0].NAME = this["txtGroupEntry" + this.props.id].value
                                        }
                                        this["popGroupEntry" + this.props.id].hide();
                                        this.refresh();
                                    }
                                }}><i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} /></NbButton>
                            </div>
                        </div>
                        <div className="row pt-1">
                            <NbKeyboard id={"keyGroupEntry"} parent={this} inputName={"txtGroupEntry" + this.props.id}/>
                        </div>
                    </NdPopUp>
                </div>
                {/* Plu Name Entry Popup */}
                <div>
                    <NdPopUp parent={this} id={"popNameEntry" + this.props.id} 
                    visible={false}                        
                    showCloseButton={true}
                    showTitle={true}
                    title={this.lang.t("nbPluButtonGrp.popNameEntry")}
                    container={"#root"} 
                    width={"750"}
                    height={"500"}
                    position={{of:"#root"}}
                    >
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id={"txtNameEntry" + this.props.id} parent={this} simple={true} onValueChanging={(e)=>{this.keyNameEntry.setInput(e)}} 
                                  onFocusIn={()=>
                                    {
                                        this.keyNameEntry.inputName = ["txtNameEntry" + this.props.id]
                                        this.keyNameEntry.setInput(this["txtNameEntry" + this.props.id].value)
                                    }}/>     
                            </div>                            
                        </div>
                        <div className="row pb-1">
                            <div className="col-12">
                                <NdTextBox id={"txtQuantityEntry" + this.props.id} type={"number"} parent={this} simple={true} onValueChanging={(e)=>{this.keyNameEntry.setInput(e)}} 
                                onFocusIn={()=>
                                    {
                                        this.keyNameEntry.inputName = ["txtQuantityEntry" + this.props.id]
                                        this.keyNameEntry.setInput(this["txtQuantityEntry" + this.props.id].value)
                                    }}
                                />     
                            </div>                            
                        </div>
                        <div className="row py-1">
                            <div className="col-12">
                                <NbButton id={"btnSelectNameEntry" + this.props.id} parent={this} className="form-group btn btn-success btn-block" 
                                style={{height:"45px",width:"100%",fontSize:"16px"}}
                                onClick={async ()=>
                                {       
                                    if(this.clickData.status == 0) //new
                                    {
                                        this.pluObj.addEmpty()
                                        this.pluObj.dt()[this.pluObj.dt().length-1].TYPE = this.clickData.type
                                        this.pluObj.dt()[this.pluObj.dt().length-1].NAME = this["txtNameEntry" + this.props.id].value
                                        this.pluObj.dt()[this.pluObj.dt().length-1].QUANTITY = this["txtQuantityEntry" + this.props.id].value
                                        this.pluObj.dt()[this.pluObj.dt().length-1].LINK = this.clickData.data.GUID
                                        this.pluObj.dt()[this.pluObj.dt().length-1].LOCATION = this.clickData.index
                                        this.pluObj.dt()[this.pluObj.dt().length-1].GROUP_INDEX = this.isCategory
                                        this.refresh();
                                    }
                                    else if(this.clickData.status == 1) //update
                                    {                                                       
                                        let tmpData = this.pluObj.dt().where({TYPE:this.clickData.type}).where({LOCATION:this.clickData.index}).where({GROUP_INDEX:this.isCategory})
                                        if(tmpData.length > 0)
                                        {
                                            tmpData[0].NAME = this["txtNameEntry" + this.props.id].value
                                            tmpData[0].QUANTITY = this["txtQuantityEntry" + this.props.id].value
                                            tmpData[0].LINK = this.clickData.data.GUID                                            
                                        }                                        
                                        this.refresh();
                                    }
                                    this["popNameEntry" + this.props.id].hide();
                                }}><i className="text-white fa-solid fa-check" style={{fontSize: "24px"}} /></NbButton>
                            </div>
                        </div>
                        <div className="row pt-1">
                            <NbKeyboard id={"keyNameEntry"} parent={this} inputName={"txtNameEntry" + this.props.id}/>
                        </div>
                    </NdPopUp>
                </div>
                {/* Plu Group Popup */}
                <div>
                    <NbPopUp id={"popPluGroup" + this.props.id} parent={this} title={""} fullscreen={true}>
                        {/* Alphabet Button Group */}
                        <div className="row py-1">
                            <NbButton id={"btnAph01"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>A</NbButton>
                            <NbButton id={"btnAph02"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>B</NbButton>
                            <NbButton id={"btnAph03"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>C</NbButton>
                            <NbButton id={"btnAph04"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>D</NbButton>
                            <NbButton id={"btnAph05"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>E</NbButton>
                            <NbButton id={"btnAph06"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>F</NbButton>
                            <NbButton id={"btnAph07"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>G</NbButton>
                            <NbButton id={"btnAph08"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>H</NbButton>
                            <NbButton id={"btnAph09"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>I</NbButton>
                            <NbButton id={"btnAph10"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>J</NbButton>
                            <NbButton id={"btnAph11"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>K</NbButton>
                            <NbButton id={"btnAph12"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>L</NbButton>
                            <NbButton id={"btnAph13"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>M</NbButton>
                            <NbButton id={"btnAph14"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>N</NbButton>
                            <NbButton id={"btnAph15"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>O</NbButton>
                            <NbButton id={"btnAph16"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>Q</NbButton>
                            <NbButton id={"btnAph17"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>P</NbButton>
                            <NbButton id={"btnAph18"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>R</NbButton>
                            <NbButton id={"btnAph19"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>S</NbButton>
                            <NbButton id={"btnAph20"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>T</NbButton>
                            <NbButton id={"btnAph21"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>U</NbButton>
                            <NbButton id={"btnAph22"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>V</NbButton>
                            <NbButton id={"btnAph23"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>W</NbButton>
                            <NbButton id={"btnAph24"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>Y</NbButton>
                            <NbButton id={"btnAph25"} parent={this} className="form-group btn btn-warning me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>Z</NbButton>
                            <NbButton id={"btnAph26"} parent={this} className="form-group btn btn-primary me-1" style={{height:"55px",width:"55px"}} onClick={this._btnAlphClick}>ALL</NbButton>
                        </div>
                        <div style={{height:"430px"}}>
                            {this._btnPluImageGrpView()}
                        </div>
                        <div className="row py-1">
                            {/* btnLeft */}
                            <div className="col-1 ps-0 pe-1">
                                <NbButton id={"btnLeft" + this.props.id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>
                                {
                                    this.setState({pluImageCurrentPage:this.state.pluImageCurrentPage == 1 ? 1 : this.state.pluImageCurrentPage - 1})
                                }}>
                                    <i className="text-white fa-solid fa-arrow-left" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                            {/* btnRight */}
                            <div className="col-1 px-1">
                                <NbButton id={"btnRight" + this.props.id} parent={this} className="form-group btn btn-primary btn-block" style={{height:"60px",width:"100%"}}
                                onClick={()=>
                                {
                                    let tmpPageCount = Math.ceil(this.state.btnPluImageGrp.length / 24)
                                    this.setState({pluImageCurrentPage:this.state.pluImageCurrentPage == tmpPageCount ? tmpPageCount : this.state.pluImageCurrentPage + 1})
                                }}>
                                    <i className="text-white fa-solid fa-arrow-right" style={{fontSize: "24px"}} />
                                </NbButton>
                            </div>
                        </div>
                    </NbPopUp>
                </div>
            </div>
        )
    }
}