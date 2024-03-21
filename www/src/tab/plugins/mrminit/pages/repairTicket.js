import React from 'react';
import App from '../../../lib/app.js';
import NbButton from '../../../../core/react/bootstrap/button';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import Toolbar from 'devextreme-react/toolbar';
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';

export default class repairTicket extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.core = App.instance.core;
        this.t = App.instance.lang.getFixedT(null,null,"repairTicket")
        this.lang = App.instance.lang;
    }
    render()
    {
        return(
            <div>
                <div style={{paddingLeft:"10px",paddingRight:"10px",paddingTop:"65px"}}>
                    <div className='row' style={{paddingTop:"10px"}}>
                        <div className='col-12' align={"right"}>
                            <Toolbar>
                                <Item location="after" locateInMenu="auto">
                                    <NbButton className="form-group btn btn-block btn-outline-dark" style={{height:"40px",width:"40px"}}
                                    onClick={async()=>
                                    {
                                        let tmpConfObj1 =
                                        {
                                            id:'msgNew',showTitle:true,title:this.t("msgNew.title"),showCloseButton:true,width:'500px',height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgNew.btn01"),location:'before'},{id:"btn02",caption:this.t("msgNew.btn02"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgNew.msg")}</div>)
                                        }

                                        let pResult = await dialog(tmpConfObj1);
                                        
                                        if(pResult == 'btn01')
                                        {
                                            localStorage.removeItem("data");
                                            this.init()
                                            this.popCart.hide();
                                        }
                                    }}>
                                        <i className="fa-solid fa-file fa-1x"></i>
                                    </NbButton>
                                </Item>
                            </Toolbar>
                        </div>
                    </div>
                    <div className='row pt-2' style={{height:'100%'}}>
                        <div className='col-12'>
                            <NdGrid parent={this} id={"grdList"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            sorting={{ mode: 'single' }}
                            height={'100%'} 
                            width={'100%'}
                            dbApply={false}
                            >
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Column dataField="DOC_DATE" caption={this.t("grdList.clmDocDate")} width={200} defaultSortOrder="asc"/>
                                <Column dataField="REF" caption={this.t("grdList.clmRef")} width={70} dataType={'number'} width={200}/>
                                <Column dataField="DESCRIPTION" caption={this.t("grdList.clmDescription")} width={400} dataType={'number'} />
                                <Column dataField="STATUS" caption={this.t("grdList.clmStatus")} width={70}/>
                            </NdGrid>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
