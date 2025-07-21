import React from 'react';
import App from '../../../lib/app.js';
import moment from 'moment';

import Toolbar,{Item} from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column,Paging,Pager,Button,Scrolling} from '../../../../core/react/devex/grid.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { NdForm,NdItem,NdLabel } from '../../../../core/react/devex/form.js';

export default class piqXBranchPurcDispatchList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        
        this.btnGetClick = this.btnGetClick.bind(this)
        this.taxId = ""
    }
    componentDidMount()
    {
        setTimeout(async () => { this.Init() }, 1000);
    }
    async Init()
    {
        this.dtFirst.value=moment(new Date()).format("YYYY-MM-DD");
        this.dtLast.value=moment(new Date()).format("YYYY-MM-DD");

        let tmpCompQuery = 
        {
            query : `SELECT TOP 1 TAX_NO FROM COMPANY`
        }

        let tmpCompData = await this.core.sql.execute(tmpCompQuery) 
        
        if(tmpCompData?.result?.recordset?.length > 0)
        {
            this.taxId = tmpCompData.result.recordset[0].TAX_NO
        }
        else
        {
            this.taxId = ""
        }
    }
    async btnGetClick()
    {
        if(this.taxId != "")
        {
            this.core.socket.emit('piqXInvoiceList',{taxId:this.taxId,first:moment(this.dtFirst.value).utcOffset(0, true),last:moment(this.dtLast.value).utcOffset(0, true),docType:42,rebate:0},async(pData)=>
            {
                await this.grdList.dataRefresh({source:[]})
                App.instance.loading.show()
                await this.grdList.dataRefresh({source:pData})
                App.instance.loading.hide()
            })
        }
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
                            <NdForm colCount={2} id="frmFilter">
                                {/* dtFirst */}
                                <NdItem>
                                    <NdLabel text={this.t("dtFirst")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtFirst"}/>
                                </NdItem>
                                {/* dtLast */}
                                <NdItem>
                                    <NdLabel text={this.t("dtLast")} alignment="right" />
                                    <NdDatePicker simple={true}  parent={this} id={"dtLast"}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetClick}/>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdList" parent={this} 
                            selection={{mode:"multiple"}} 
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            width={'100%'}
                            >                            
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} />
                                <Column dataField="DOC_DATE" caption={this.t("grdList.clmDate")} visible={true} width={'10%'} dataType={'date'}/> 
                                <Column dataField="DOC_FROM_NO" caption={this.t("grdList.clmFromNo")} visible={true} width={'35%'}/> 
                                <Column dataField="DOC_FROM_TITLE" caption={this.t("grdList.clmFromTitle")} visible={true} width={'40%'}/> 
                                <Column dataField="STATUS" caption={this.t("grdList.clmStatus")} visible={true} width={'5%'} 
                                cellRender={(e)=>
                                {
                                    if(e.value == 0)
                                    {
                                        return (<div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',color:'red'}}><i className="dx-icon-remove"></i></div>)    
                                    }
                                    else if(e.value == 1)
                                    {
                                        return (<div style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'center',color:'green'}}><i className="dx-icon-todo"></i></div>)
                                    }
                                    else
                                    {
                                        return (<div></div>)
                                    }
                                }}/>
                                <Column type="buttons" width={'10%'}>
                                    <Button icon="pdffile"
                                    onClick={(e)=>
                                    {
                                        this.core.socket.emit('piqXInvoice',{invoiceId:e.row.data.GUID},
                                        (pData) =>
                                        {
                                            if(typeof pData != 'undefined' && typeof pData.err == 'undefined' && pData.length > 0)
                                            {
                                                let mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                mywindow.onload = function() 
                                                { 
                                                    mywindow.document.getElementById("view").innerHTML="<iframe src='" + pData[0].PDF + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                }
                                            }
                                        })
                                    }}/>
                                    <Button icon="download"
                                    onClick={(e)=>
                                    {
                                        this.core.socket.emit('piqXInvoice',{invoiceId:e.row.data.GUID},
                                        async(pData) =>
                                        {
                                            if(typeof pData != 'undefined' && typeof pData.err == 'undefined' && pData.length > 0)
                                            {
                                                try
                                                {
                                                    if(pData[0].STATUS == 1)
                                                    {
                                                        let tmpConfObj =
                                                        {
                                                            id:'msgImport',showTitle:true,title:this.t("msgImport.title"),showCloseButton:true,width:'500px',height:'auto',
                                                            button:[{id:"btn01",caption:this.t("msgImport.btn01"),location:'after'}],
                                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgImport.msg")}</div>)
                                                        }
                                                        await dialog(tmpConfObj);
                                                        return
                                                    }
                                                    
                                                    App.instance.menuClick(
                                                    {
                                                        id: 'irs_02_006',
                                                        text: this.lang.t('menuOff.irs_02_006'),
                                                        path: 'dispatch/documents/branchPurcDispatch.js',
                                                        pagePrm: {piqx:pData}
                                                    })
                                                }
                                                catch (err) 
                                                {
                                                    console.log(err)
                                                }
                                            }
                                        })
                                    }}/>
                                </Column> 
                            </NdGrid>
                        </div>
                    </div>
                </ScrollView>
            </div>
        )
    }
}