import moment from 'moment';
import React from 'react';
import App from '../../../lib/app.js';
import { datatable } from '../../../../core/core.js';
import NbButton from '../../../../core/react/bootstrap/button';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../../../core/react/devex/textbox'
import NbPopUp from '../../../../core/react/bootstrap/popup';
import NdDatePicker from '../../../../core/react/devex/datepicker.js';
import NdTextArea from '../../../../core/react/devex/textarea.js';
import NdImageUpload from '../../../../core/react/devex/imageupload.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdDialog, { dialog } from '../../../../core/react/devex/dialog.js';
import NdPopGrid from '../../../../core/react/devex/popgrid.js';
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

        this.dtList = new datatable()
        this.dtList.selectCmd =
        {
            query : "SELECT * FROM MRMINIT_REPAIR WHERE ((REF = @REF) OR (@REF = ''))",
            param : ['REF:string|25']
        }
        this.dtTicket = new datatable()
        this.initTicket()
        this.empty =
        {
            CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            LUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
            REF : "",
            DOC_DATE : moment(new Date()),
            DESCRIPTION : "",
            FIRST_IMG : "",
            LAST_IMG : "",
            TICKET_PDF : "",
            STATUS : 0
        }
    }
    componentDidMount()
    {
        this.init()
    }
    init()
    {
        this.getList('')
    }
    async getList(pRef)
    {
        this.dtList.selectCmd.value = [pRef]
        await this.dtList.refresh();
    }
    initTicket()
    {
        this.dtTicket.selectCmd =
        {
            query : `SELECT * FROM MRMINIT_REPAIR WHERE REF = @REF`,
            param : ['REF:string|25']
        }
        this.dtTicket.insertCmd =
        {
            query : `INSERT INTO [dbo].[MRMINIT_REPAIR](
                    [CDATE]
                    ,[CUSER]
                    ,[LDATE]
                    ,[LUSER]
                    ,[REF]
                    ,[DOC_DATE]
                    ,[DESCRIPTION]
                    ,[FIRST_IMG]
                    ,[LAST_IMG]
                    ,[TICKET_PDF]
                    ,[STATUS]
                    ) VALUES ( 
                    GETDATE()
                    ,@CUSER
                    ,GETDATE()
                    ,@LUSER
                    ,@REF
                    ,@DOC_DATE
                    ,@DESCRIPTION
                    ,@FIRST_IMG
                    ,@LAST_IMG
                    ,@TICKET_PDF
                    ,@STATUS
                    )`,
            param : ['CUSER:string|25','LUSER:string|25','REF:string|25','DOC_DATE:datetime','DESCRIPTION:string|max','FIRST_IMG:string|max','LAST_IMG:string|max',
                    'TICKET_PDF:string|max','STATUS:int'],
            dataprm : ['CUSER','LUSER','REF','DOC_DATE','DESCRIPTION','FIRST_IMG','LAST_IMG','TICKET_PDF','STATUS'],
            
        }
        this.dtTicket.updateCmd =
        {
            query : `UPDATE [dbo].[MRMINIT_REPAIR] SET 
                     [LDATE] = GETDATE()
                    ,[LUSER] = @LUSER
                    ,[DOC_DATE] = @DOC_DATE
                    ,[DESCRIPTION] = @DESCRIPTION
                    ,[FIRST_IMG] = @FIRST_IMG
                    ,[LAST_IMG] = @LAST_IMG
                    ,[TICKET_PDF] = @TICKET_PDF
                    ,[STATUS] = @STATUS
                    WHERE [REF] = @REF`,
            param : ['LUSER:string|25','DOC_DATE:datetime','DESCRIPTION:string|max','FIRST_IMG:string|max','LAST_IMG:string|max','TICKET_PDF:string|max','STATUS:int',
                    'REF:string|25'],
            dataprm : ['LUSER','DOC_DATE','DESCRIPTION','FIRST_IMG','LAST_IMG','TICKET_PDF','STATUS','REF'],
        }
    }
    render()
    {
        return(
            <div>
                <div style={{paddingLeft:"10px",paddingRight:"10px",paddingTop:"65px"}}>
                    <div className='row' style={{paddingTop:"10px"}}>
                        <div className='col-6' align={"right"}>
                            <NdTextBox id="txtRef" parent={this} title={this.t("txtRef")}
                            button=
                            {
                                [
                                    {
                                        id:'01',
                                        icon:'photo',
                                        onClick:()=>
                                        {
                                            if(typeof cordova == "undefined")
                                            {
                                                return;
                                            }
                                            cordova.plugins.barcodeScanner.scan(
                                                async function (result) 
                                                {
                                                    if(result.cancelled == false)
                                                    {
                                                        this.txtRef.value = result.text;
                                                        this.getList(result.text)
                                                    }
                                                }.bind(this),
                                                function (error) 
                                                {
                                                    
                                                },
                                                {
                                                    prompt : "Scan",
                                                    orientation : "portrait"
                                                }
                                            );
                                        }
                                    }
                                ]
                            }
                            selectAll={true}                           
                            >     
                            </NdTextBox>
                        </div>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-2 offset-8' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"40px"}}
                                    onClick={async()=>
                                    {
                                        this.getList(this.txtRef.value)
                                    }}>
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </NbButton>
                                </div>
                                <div className='col-2' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"40px"}}
                                    onClick={async()=>
                                    {
                                        this.dtTicket.clear()
                                        this.initTicket()
                                        this.dtTicket.push({...this.empty})
                                        this.popRepairTicket.show()
                                    }}>
                                        <i className="fa-solid fa-file fa-1x"></i>
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pt-2' style={{height:'95%'}}>
                        <div className='col-12'>
                            <NdGrid parent={this} id={"grdList"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            sorting={{ mode: 'single' }}
                            height={'100%'} 
                            width={'100%'}
                            selection={{mode:"single"}} 
                            dbApply={false}
                            onReady={async()=>
                            {
                                await this.grdList.dataRefresh({source:this.dtList});
                            }}
                            onRowDblClick={async(e)=>
                            {
                                this.dtTicket.clear()
                                this.initTicket()
                                this.dtTicket.selectCmd.value = [e.data.REF]
                                await this.dtTicket.refresh()
                                this.popRepairTicket.show()
                            }}
                            >
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Column dataField="DOC_DATE" dataType="date" caption={this.t("grdList.clmDocDate")} width={200} defaultSortOrder="asc" allowEditing={false} alignment={'left'}/>
                                <Column dataField="REF" caption={this.t("grdList.clmRef")} width={70} dataType={'number'} width={200} allowEditing={false} alignment={'left'}/>
                                <Column dataField="DESCRIPTION" caption={this.t("grdList.clmDescription")} width={400} dataType={'number'} allowEditing={false} alignment={'left'}/>
                                <Column dataField="STATUS" caption={this.t("grdList.clmStatus")} width={70} allowEditing={false} alignment={'left'}/>
                            </NdGrid>
                        </div>
                    </div>                    
                </div>
                {/* Repair Ticket PopUp */}
                <div>
                    <NbPopUp id={"popRepairTicket"} parent={this} title={""} fullscreen={true} onShowed={()=>
                    {
                        this.txtPopNote.value = this.dtTicket[0].DESCRIPTION
                        this.imgFirst.value = this.dtTicket[0].FIRST_IMG
                        this.imgLast.value = this.dtTicket[0].LAST_IMG
                    }}>
                        <div>
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-1 offset-10' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"40px"}}
                                    onClick={async()=>
                                    {
                                        if(this.txtPopRef.value == '')
                                        {
                                            let tmpConfObj =
                                            {
                                                id:'msgPopRef',
                                                showTitle:true,
                                                title:this.t("msgPopRef.title"),
                                                showCloseButton:true,
                                                width:'500px',
                                                height:'200px',
                                                button:[{id:"btn01",caption:this.t("msgPopRef.btn01"),location:'after'}],
                                                content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgPopRef.msg")}</div>)
                                            }
                                            
                                            let pResult = await dialog(tmpConfObj);
                                            return
                                        }
                                        this.dtTicket[0].FIRST_IMG = this.imgFirst.value
                                        this.dtTicket[0].LAST_IMG = this.imgLast.value
                                        this.dtTicket[0].DESCRIPTION = this.txtPopNote.value
                                        await this.dtTicket.update()

                                        let tmpConfObj =
                                        {
                                            id:'msgSaveResult',
                                            showTitle:true,
                                            title:this.t("msgSaveResult.title"),
                                            showCloseButton:true,
                                            width:'500px',
                                            height:'200px',
                                            button:[{id:"btn01",caption:this.t("msgSaveResult.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.t("msgSaveResult.msg")}</div>)
                                        }
                                        let pResult = await dialog(tmpConfObj);

                                        this.popRepairTicket.hide()
                                        this.getList(this.txtRef.value)
                                    }}>
                                        <i className="fa-solid fa-floppy-disk"></i>
                                    </NbButton>
                                </div>
                                <div className='col-1' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"40px"}}
                                    onClick={async()=>
                                    {
                                        this.popRepairTicket.hide()
                                        this.getList(this.txtRef.value)
                                    }}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </NbButton>
                                </div>
                            </div>
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-6'>
                                    <NdTextBox id="txtPopRef" parent={this} title={this.t("txtRef")} dt={{data:this.dtTicket,field:"REF"}} readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'arrowdown',
                                                onClick:()=>
                                                {
                                                    this.txtPopRef.value = Math.floor(Date.now() / 1000)
                                                }
                                            }
                                        ]
                                    }
                                    selectAll={true}                           
                                    >     
                                    </NdTextBox>
                                </div>
                                <div className='col-6'>
                                    <NdDatePicker title={this.t("dtPopDate")} parent={this} id={"dtPopDate"} dt={{data:this.dtTicket,field:"DOC_DATE"}}
                                    onValueChanged={(async()=>
                                    {
                                        
                                    }).bind(this)}
                                    >
                                    </NdDatePicker>
                                </div>
                            </div>
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-6'>
                                    <NdTextBox id="txtPopSaleTicket" parent={this} title={this.t("txtPopSaleTicket")} dt={{data:this.dtTicket,field:"TICKET_PDF"}} readOnly={true}
                                    button=
                                    {
                                        [
                                            {
                                                id:'01',
                                                icon:'more',
                                                onClick:()=>
                                                {
                                                    this.pg_txtPopSaleTicket.show()
                                                    this.pg_txtPopSaleTicket.onClick = (data) =>
                                                    {
                                                        if(data.length > 0)
                                                        {
                                                            this.txtPopSaleTicket.value = data[0].GUID
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                    selectAll={true}                           
                                    >
                                    </NdTextBox>
                                    {/* FİŞ SEÇİM POPUP */}
                                    <NdPopGrid id={"pg_txtPopSaleTicket"} parent={this} container={"#root"} 
                                    visible={false}
                                    position={{of:'#root'}} 
                                    showTitle={true} 
                                    showBorders={true}
                                    width={'90%'}
                                    height={'90%'}
                                    title={this.t("pg_txtPopSaleTicket.title")} 
                                    search={true}
                                    data = 
                                    {{
                                        source:
                                        {
                                            select:
                                            {
                                                query : "SELECT GUID,DOC_DATE,DEVICE,REF FROM POS_VW_01 WHERE UPPER(REF) LIKE UPPER(@VAL)",
                                                param : ['VAL:string|50']
                                            },
                                            sql:this.core.sql
                                        }
                                    }}
                                    deferRendering={true}
                                    >
                                        <Column dataField="DOC_DATE" dataType="date" caption={this.t("pg_txtPopSaleTicket.clmDate")} width={'30%'} />
                                        <Column dataField="DEVICE" caption={this.t("pg_txtPopSaleTicket.clmDevice")} width={'30%'} defaultSortOrder="asc" />
                                        <Column dataField="REF" caption={this.t("pg_txtPopSaleTicket.clmRef")} width={'40%'} />
                                    </NdPopGrid>
                                </div>
                            </div>
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-12'>
                                    <NdTextArea simple={true} parent={this} id="txtPopNote" height='100px'/>
                                </div>
                            </div>
                            <div className='row' style={{paddingTop:"10px"}}>
                                <div className='col-6'>
                                    <div className='row'>
                                        <div className='col-12'>                                
                                            <NdImageUpload id="imgFirst" parent={this} imageWidth={"120"} height={'350px'} dt={{data:this.dtTicket,field:"FIRST_IMG"}}/>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-6'>
                                            <NdButton id="btnFirstNewImg" parent={this} icon="add" type="default" width='100%'
                                            onClick={async()=>
                                            {
                                                if(typeof cordova == "undefined")
                                                {
                                                    this.imgFirst.value = "data:image/png;base64,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AAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgGWETAAAAAMkImwAAAABIRtgEAAAAQDLCJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAyQibAAAAAEhG2AQAAABAMsImAAAAAJIRNgEAAACQjLAJAAAAgGSETQAAAAAkI2wCAAAAIBlhEwAAAADJCJsAAAAASEbYBAAAAEAywiYAAAAAkhE2AQAAAJCMsAkAAACAZIRNAAAAACQjbAIAAAAgmbKq6nl1eQ0AAAAAa8TIJgAAAACSETYBAAAAkIywCQAAAIBkhE0AAAAAJCNsAgAAACAZYRMAAAAAiYTw/wFZOyj0PQtsGgAAAABJRU5ErkJggg=="
                                                    return;
                                                }

                                                navigator.camera.getPicture(onSuccess.bind(this), undefined, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });

                                                function onSuccess(imageURI) 
                                                {
                                                    this.imgFirst.value = "data:image/jpeg;base64," + imageURI
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton id="btnFirstImgDel" parent={this} icon="trash" type="default" width='100%'
                                            onClick={()=>
                                            {
                                                this.imgFirst.value = ""
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <div className='row'>
                                        <div className='col-12'>                                
                                            <NdImageUpload id="imgLast" parent={this} imageWidth={"120"} height={'350px'} dt={{data:this.dtTicket,field:"LAST_IMG"}}/>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='col-6'>
                                            <NdButton id="btnLastNewImg" parent={this} icon="add" type="default" width='100%' 
                                            onClick={async()=>
                                            {
                                                if(typeof cordova == "undefined")
                                                {
                                                    this.imgLast.value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAANCAYAAABGkiVgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVDhPY2RY0fKfgcqAieE/0EwqYyao4VQFo4ZSHwwlQ7GkM0oxTVzK+OHTV6Dx1AU0cCkDAwB8qlnG0qKRdgAAAABJRU5ErkJggg=="
                                                    return;
                                                }

                                                navigator.camera.getPicture(onSuccess.bind(this), undefined, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });

                                                function onSuccess(imageURI) 
                                                {
                                                    this.imgLast.value = "data:image/jpeg;base64," + imageURI
                                                }

                                                function onFail(message) {}
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton id="btnLastImgDel" parent={this} icon="trash" type="default" width='100%'
                                            onClick={()=>
                                            {
                                                this.imgLast.value = ""
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NbPopUp>
                </div>
            </div>
        )
    }
}
