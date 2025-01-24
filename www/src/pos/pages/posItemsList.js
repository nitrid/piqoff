import React from "react";
import App from "../lib/app.js";

import NbButton from "../../core/react/bootstrap/button.js";
import NbKeyboard from "../../core/react/bootstrap/keyboard.js";
import NdTextBox from "../../core/react/devex/textbox.js";
import NdGrid,{Column,Editing,Paging,Scrolling} from "../../core/react/devex/grid.js";

export default class posItemsList extends React.PureComponent
{
    constructor()
    {
        super()
        this.state = 
        {
            keyboardVisibility: false,
            keyboardPosition: {top: 0, left: 0}
        }
        this.core = App.instance.core;
        this.lang = App.instance.lang;
        this.user = this.core.auth.data
        this.prmObj = App.instance.prmObj
        this.acsObj = App.instance.acsObj
        
        Number.money = this.prmObj.filter({ID:'MoneySymbol',TYPE:0}).getValue()
    }
    toggleKeyboardVisibility(inputId)
    {
        if(!this.state.keyboardVisibility)
        {
            // Textbox elementini bul
            const element = document.getElementById(inputId);
            if(element)
            {
                // Elementin pozisyonunu al
                const rect = element.getBoundingClientRect();
                // Klavyeyi elementin altında konumlandır
                this.setState({
                    keyboardVisibility: true,
                    keyboardPosition: {top: rect.bottom + window.scrollY}
                });
            }
        }
        else
        {
            this.setState({
                keyboardVisibility: false
            });
        }
    }
    render()
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#fff'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem',borderBottom:'1px solid #dee2e6',backgroundColor:'#f8f9fa'}}>
                    <div style={{margin:0,fontWeight:'500',color:'#212529', textAlign:'center', flexGrow: 1}}>
                        <h3 style={{margin: 0}}>{this.lang.t("posSettings.posItemsList")}</h3>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                        <button type="button" className="btn-close" onClick={() => App.instance.setPage('menu')}></button>
                    </div>
                </div>
                <div style={{flex:1,padding:'0.5rem',overflowY:'auto'}}>
                    <div className="row">
                        <div className="col-1 offset-11">
                            <NbButton id={"btnNewItem"} parent={this} className="form-group btn btn-primary btn-block" 
                            style={{height:"50px",width:"100%"}}
                            onClick={() => App.instance.setPage('itemsList')}>
                                <i className="fa-regular fa-file" style={{fontSize:'20px'}}></i>
                            </NbButton>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col-10">
                            <NdTextBox id="txtItemSearch" parent={this} simple={true} placeholder={this.lang.t("posItemsList.txtItemSearchPholder")}
                            // onFocusIn={()=>
                            // {
                            //     this.toggleKeyboardVisibility('txtItemSearch')
                            //     this.keyboardRef.inputName = "txtItemSearch"
                            //     this.keyboardRef.setInput(this.txtItemSearch.value)
                            // }}
                            // onFocusOut={()=>
                            // {
                            //     // Klavyeye tıklandığında textbox'ın focus'u kaybolmasın
                            //     const keyboard = document.querySelector('.simple-keyboard');
                            //     if(keyboard && !keyboard.contains(document.activeElement))
                            //     {
                            //         this.setState({keyboardVisibility: false})
                            //     }
                            // }}
                            onChange={async(e)=>
                            {                         
                                // Değişiklik olduğunda direkt değeri güncelle
                                //this.txtItemSearch.value = e
                            }}
                            button=
                            {[
                                {
                                    id:'01',
                                    icon:'edit',
                                    onClick:async()=>
                                    {
                                        this.toggleKeyboardVisibility('txtItemSearch')
                                        this.keyboardRef.inputName = "txtItemSearch"
                                        this.keyboardRef.setInput(this.txtItemSearch.value)
                                    }
                                },
                            ]}>     
                            </NdTextBox>
                        </div>
                        <div className="col-2">
                            <NbButton id={"btnItemSearch"} parent={this} className="form-group btn btn-primary btn-block" 
                            style={{height:"36px",width:"100%"}}
                            onClick={() => this.toggleKeyboardVisibility('txtItemSearch')}>
                                {this.lang.t("posItemsList.btnItemSearch")}
                            </NbButton>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col-12">
                            <NdGrid parent={this} id={"grdItemList"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            height={"100%"} 
                            width={"100%"}
                            dbApply={false}
                            selection={{mode:"single"}}
                            onRowPrepared={(e)=>
                            {
                                if(e.rowType == "header")
                                {
                                    e.rowElement.style.fontWeight = "bold";    
                                }
                                e.rowElement.style.fontSize = "13px";
                            }}
                            onCellPrepared={(e)=>
                            {
                                e.cellElement.style.padding = "4px"
                            }}
                            >
                                <Column dataField="REF" caption={this.lang.t("grdPopOrderList.REF")} width={120} alignment={"center"}/>
                                <Column dataField="REF_NO" caption={this.lang.t("grdPopOrderList.REF_NO")} width={75}  />
                                <Column dataField="DOC_DATE" caption={this.lang.t("grdPopOrderList.DOC_DATE")} width={150} dataType="datetime" format={"dd/MM/yyyy - HH:mm:ss"} />
                                <Column dataField="INPUT_CODE" caption={this.lang.t("grdPopOrderList.INPUT_CODE")} width={150}/>
                                <Column dataField="INPUT_NAME" caption={this.lang.t("grdPopOrderList.INPUT_NAME")} width={150}/>
                                <Column dataField="TOTAL" caption={this.lang.t("grdPopOrderList.TOTAL")} width={75} format={"#,##0.00" + Number.money.sign}/>
                            </NdGrid>
                        </div>
                    </div>
                </div>
                {this.state.keyboardVisibility && 
                (
                    <div style={{
                        position: 'absolute',
                        top: this.state.keyboardPosition.top + 'px',
                        left: '0px',
                        zIndex: 1050,
                        backgroundColor: '#fff',
                        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                        padding: '10px',
                        width: '100%'
                    }}>
                        <NbKeyboard id={"keyboardRef"} parent={this} inputName={"txtItemSearch"} 
                        keyType={this.prmObj.filter({ID:'KeyType',TYPE:0,USERS:this.user.CODE}).getValue()}
                        />
                    </div>
                )}
            </div>
        )
    }
}