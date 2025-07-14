import React from 'react';
import App from '../../../lib/app.js';
import ScrollView from 'devextreme-react/scroll-view';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item,EmptyItem } from 'devextreme-react/form';
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdGrid,{Column,Editing,Paging,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdToast } from '../../../../core/react/devex/toast.js';


export default class pluCopy extends React.PureComponent
{
    constructor(props)
    {
        super(props)
        this.core = App.instance.core;
        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.prevCode = "";
        this.tabIndex = props.data.tabkey

        this.btnSave = this.btnSave.bind(this)
    }
    async componentDidMount()
    {
        await this.core.util.waitUntil(0)
        this.init()
    }
    async init()
    {
        this.getUSers()
    }
    async getUSers()
    {
        let tmpSource =
        {
            source : 
            {
                groupBy : this.groupList,
                select : 
                {
                    query :"SELECT * FROM USERS WHERE STATUS = 1",
                },
                sql : this.core.sql
            }
        }
        
        await this.grdUserList.dataRefresh(tmpSource)
    }
    async btnSave()
    {
        if(this.cmbUser.value == '')
        {
            this.toast.show({message:this.t("msgUserNotFound.msg"),type:"warning"})
            return
        }

        let tmpConfObj1 =
        {
            id:'msgSave',showTitle:true,title:this.t("msgSave.title"),showCloseButton:true,width:'500px',height:'auto',
            button:[{id:"btn01",caption:this.t("msgSave.btn01"),location:'before'},{id:"btn02",caption:this.t("msgSave.btn02"),location:'after'}],
            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSave.msg")}</div>)
        }
        
        let pResult1 = await dialog(tmpConfObj1);
        if(pResult1 == 'btn02')
        {
            return    
        }

        for (let i = 0; i < this.grdUserList.getSelectedData().length; i++) 
        {
            if(this.grdUserList.getSelectedData()[i].CODE != this.cmbUser.value)
            {
                let tmpQuery = 
                {
                    query : "EXEC [dbo].[PRD_PLU_COPY] " +
                    "@NEW_USER =@PNEW_USER, " +
                    "@COPY_USER = @PCOPY_USER " ,
                    param : ['PNEW_USER:string|50','PCOPY_USER:string|50'],
                    value : [this.grdUserList.getSelectedData()[i].CODE,this.cmbUser.value]
                }
                await this.core.sql.execute(tmpQuery) 
            }
        }
        
        this.toast.show({message:this.t("msgSaveResult.msgSuccess"),type:"success"})
    }
    render()
    {
        return(
            <div>
                <ScrollView>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <Toolbar>
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
                                                id:'msgClose',showTitle:true,title:this.lang.t("msgWarning"),showCloseButton:true,width:'500px',height:'auto',
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
                            <Form colCount={2} id={"frmCopy"  + this.tabIndex}>
                                <Item>
                                        <Label text={this.t("cmbUser")} alignment="right" />
                                        <NdSelectBox simple={true} parent={this} id="cmbUser"
                                        displayExpr="NAME"
                                        valueExpr="CODE"
                                        value=""
                                        searchEnabled={true}
                                        showClearButton={true}
                                        pageSize ={50}
                                        notRefresh={true}
                                        data={{source:{select:{query : "SELECT CODE,NAME FROM USERS WHERE STATUS = 1 ORDER BY CODE ASC"},sql:this.core.sql}}}
                                        onValueChanged={async (e)=>
                                        {
                                           
                                        }}/>
                                </Item>
                                <Item>
                                    <NdButton text={this.t("btnSave")} type="success" width="100%" onClick={this.btnSave} ></NdButton>
                                </Item>
                                <Item colSpan={2}>
                                    <NdGrid id="grdUserList" parent={this} onSelectionChanged={this.onSelectionChanged} 
                                    showBorders={true}
                                    allowColumnResizing={true}
                                    selection={{mode:"multiple"}} 
                                    width={'100%'}
                                    height={'600'}
                                    data={this.data}
                                    dbApply={false}
                                    filterRow={{visible:true}} headerFilter={{visible:true}}
                                    >
                                        <Column dataField="CODE" caption={this.t("grdUserList.clmCode")}/>
                                        <Column dataField="NAME" caption={this.t("grdUserList.clmName")} />
                                    </NdGrid>
                                </Item>
                            </Form>
                        </div>
                    </div>
                    <NdToast id="toast" parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}
