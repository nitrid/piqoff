import moment from 'moment';
import React from 'react';
import i18n from 'i18next';
import App from '../../lib/app.js'
import posDoc from '../../pages/posDoc.js';
import NdGrid,{Column,Editing,Paging,Pager,Scrolling,KeyboardNavigation,Export,ColumnChooser,StateStoring} from "../../../core/react/devex/grid.js";
import { NdLayout,NdLayoutItem } from '../../../core/react/devex/layout';
import NbButton from "../../../core/react/bootstrap/button.js";
import NdPopUp from "../../../core/react/devex/popup.js";
import NdTextBox,{ Button,Validator, NumericRule, RequiredRule, CompareRule } from '../../../core/react/devex/textbox'
import NbPopUp from '../../../core/react/bootstrap/popup';
import NdDatePicker from '../../../core/react/devex/datepicker.js';
import NdTextArea from '../../../core/react/devex/textarea.js';
import NdImageUpload from '../../../core/react/devex/imageupload.js';
import NdButton from '../../../core/react/devex/button.js';
import NdDialog, { dialog } from '../../../core/react/devex/dialog.js';
import NdPopGrid from '../../../core/react/devex/popgrid.js';
import NdSelectBox from "../../../core/react/devex/selectbox.js";
import Form, { Label,Item, EmptyItem } from 'devextreme-react/form';

import {local,datatable} from '../../../core/core.js'
import './css/custom.css';

const orgLoadPos = App.prototype.loadPos
const orgComponentWillMount = posDoc.prototype.componentWillMount
const orgInit = posDoc.prototype.init
const orgRender = posDoc.prototype.render
const orgSaleRowAdd = posDoc.prototype.saleRowAdd
const orgSaleRowUpdate = posDoc.prototype.saleRowUpdate

let localDb = null
let dtList = null
let dtTicket = null
let empty = null

App.prototype.loadPos = async function()
{
    let tmpLang = localStorage.getItem('lang') == null ? 'tr' : localStorage.getItem('lang')
    const resources = await import(`./meta/lang/${tmpLang}.js`)
    
    for (let i = 0; i < Object.keys(resources.default).length; i++) 
    {
        i18n.addResource(tmpLang, 'translation', Object.keys(resources.default)[i], resources.default[Object.keys(resources.default)[i]])
    }

    Service = Service.bind(this)
    Service()

    return orgLoadPos.call(this)
}
posDoc.prototype.componentWillMount = function componentWillMount()
{
    dtList = new datatable()
    dtTicket = new datatable()
    
    empty =
    {
        CUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
        CDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        LUSER : this.core.auth.data == null ? '' : this.core.auth.data.CODE,
        LDATE : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        REF : "",
        DOC_DATE : moment(new Date()),
        CATEGORY : "VILLE_PLATE_BASSE",
        REPAIRS : "FERMETURE_ECLAIR_INF_20_CM",
        DESCRIPTION : "",
        FIRST_IMG : "",
        LAST_IMG : "",
        TICKET : "",
        TICKET_PDF : "",
        STATUS : 0
    }

    if(typeof orgComponentWillMount != 'undefined')
    {
        orgComponentWillMount.call(this)
    }
}
posDoc.prototype.init = function init()
{
    orgInit.call(this)
}
posDoc.prototype.saleRowAdd = async function saleRowAdd(pItemData) 
{
    pItemData.NAME = pItemData.NAME + " " + pItemData.LIST_TAG
    pItemData.SNAME = pItemData.NAME.substring(0,50)

    orgSaleRowAdd.call(this,pItemData)

    let tmpQuery = 
    {
        query : "SELECT * FROM SPC_REFASHION_PAY WHERE ITEM = @ITEM" ,
        param : ['ITEM:string|50'],
        value : [pItemData.GUID]
    }
    let tmpData = await this.core.sql.execute(tmpQuery) 

    if(tmpData.result.recordset.length > 0)
    {
        let tmpRefashPay = tmpData.result.recordset[0]
        this.payRowAdd({PAY_TYPE:5,AMOUNT:tmpRefashPay.REPERATION_PRICE * pItemData.QUANTITY,CHANGE:0})
    }
}
posDoc.prototype.saleRowUpdate = async function saleRowUpdate(pRowData,pItemData)
{
    orgSaleRowUpdate.call(this,pRowData,pItemData)

    let tmpQuery = 
    {
        query : "SELECT * FROM SPC_REFASHION_PAY WHERE ITEM = @ITEM" ,
        param : ['ITEM:string|50'],
        value : [pRowData.ITEM_GUID]
    }
    let tmpData = await this.core.sql.execute(tmpQuery) 
    
    if(tmpData.result.recordset.length > 0)
    {
        let tmpRefashPay = tmpData.result.recordset[0]
        let tmpRowData = this.isRowMerge('PAY',{TYPE:5})

        await this.payRowUpdate(tmpRowData,{AMOUNT:Number(parseFloat(Number(tmpRefashPay.REPERATION_PRICE * pItemData.QUANTITY)).round(2)),CHANGE:0})
    }
}
posDoc.prototype.render = function() 
{
    const originalRenderOutput = orgRender.call(this);
    const modifiedChildren = addChildToElementWithId(originalRenderOutput.props.children,'frmBtnGrp',(render.bind(this))());
    return React.cloneElement(originalRenderOutput, {}, ...modifiedChildren);
}
function render()
{
    return (
        <NdLayoutItem key={"btnReFashionLy"} id={"btnReFashionLy"} parent={this} data-grid={{x:45,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}} 
        access={this.acsObj.filter({ELEMENT:'btnReFashionLy',USERS:this.user.CODE})}>
            <div>
                <NbButton id={"btnReFashion"} parent={this} className="form-group btn btn-info btn-block" style={{height:"100%",width:"100%"}}
                onClick={onClick.bind(this)}>
                    <i className="text-white fa-solid fa-shoe-prints" style={{fontSize: "24px"}} />
                </NbButton>
            </div>
            <div>
                <NdPopUp parent={this} id={"popReFashion"} 
                visible={false}                        
                showCloseButton={true}
                showTitle={true}
                title={this.lang.t("popReFashion.title")}
                container={"#root"} 
                width={"100%"}
                height={"100%"}
                position={{of:"#root"}}
                >
                    <div className={'row'}>
                        <div className='col-6' align={"right"}>
                            <NdTextBox id="txtPopReFashionRef" parent={this} title={this.lang.t("popReFashion.txtPopReFashionRef")} selectAll={true} />     
                        </div>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-2 offset-8 pe-1' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        getList = getList.bind(this)
                                        getList(this.txtPopReFashionRef.value)
                                    }}>
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </NbButton>
                                </div>
                                <div className='col-2 ps-1' align={"right"}>
                                    <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"100%"}}
                                    onClick={async()=>
                                    {
                                        dtTicket.clear()
                                        dtTicket.push({...empty})
                                        this.popReFashionTicket.show()
                                    }}>
                                        <i className="fa-solid fa-file fa-1x"></i>
                                    </NbButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pt-2' style={{height:'95%'}}>
                        <div className='col-12'>
                            <NdGrid parent={this} id={"grdPopReFashionList"} 
                            showBorders={true} 
                            columnsAutoWidth={true} 
                            allowColumnReordering={true} 
                            allowColumnResizing={true} 
                            sorting={{ mode: 'single' }}
                            height={'100%'} 
                            width={'100%'}
                            selection={{mode:"single"}} 
                            dbApply={false}
                            onRowDblClick={async(e)=>
                            {
                                dtTicket.clear()
                                let tmpData = await select({REF:e.data.REF})
                                dtTicket.import(tmpData.result.recordset)
                                this.popReFashionTicket.show()
                            }}
                            >
                                <Paging defaultPageSize={10} />
                                <Pager visible={true} allowedPageSizes={[5,10,20,50,100]} showPageSizeSelector={true} />
                                <Scrolling mode="standart" />
                                <Editing mode="cell" allowUpdating={true} allowDeleting={true} confirmDelete={false}/>
                                <Column dataField="DOC_DATE" dataType="date" caption={this.lang.t("popReFashion.grdPopReFashionList.clmDocDate")} width={200} defaultSortOrder="asc" allowEditing={false} alignment={'left'}/>
                                <Column dataField="REF" caption={this.lang.t("popReFashion.grdPopReFashionList.clmRef")} width={70} dataType={'number'} width={200} allowEditing={false} alignment={'left'}/>
                                <Column dataField="DESCRIPTION" caption={this.lang.t("popReFashion.grdPopReFashionList.clmDescription")} width={400} dataType={'number'} allowEditing={false} alignment={'left'}/>
                                <Column dataField="STATUS" caption={this.lang.t("popReFashion.grdPopReFashionList.clmStatus")} width={70} allowEditing={false} alignment={'left'}/>
                            </NdGrid>
                        </div>
                    </div>
                </NdPopUp>
            </div>
            {/* Repair Ticket PopUp */}
            <div>
                <NdPopUp id={"popReFashionTicket"} parent={this}
                visible={false}                        
                showCloseButton={true}
                showTitle={false}
                title={""}
                container={"#root"} 
                width={"100%"}
                height={"100%"}
                position={{of:"#root"}}
                onShowed={()=>
                {
                    this.txtPopReFashionTicketRef.value = dtTicket[0].REF
                    this.txtPopReFashionTicketNote.value = dtTicket[0].DESCRIPTION
                    this.txtPopReFashionTicket.value = dtTicket[0].TICKET
                    this.imgPopReFashionTicketFirst.value = dtTicket[0].FIRST_IMG
                    this.imgPopReFashionTicketLast.value = dtTicket[0].LAST_IMG
                }}>
                    <div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-1 offset-10 pe-1' align={"right"}>
                                <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"100%"}}
                                onClick={async()=>
                                {
                                    if(this.txtPopReFashionTicketRef.value == '')
                                    {
                                        let tmpConfObj =
                                        {
                                            id:'msgPopReFashionTicketRef',
                                            showTitle:true,
                                            title:this.lang.t("msgPopReFashionTicketRef.title"),
                                            showCloseButton:true,
                                            width:'500px',
                                            height:'200px',
                                            button:[{id:"btn01",caption:this.lang.t("msgPopReFashionTicketRef.btn01"),location:'after'}],
                                            content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPopReFashionTicketRef.msg")}</div>)
                                        }
                                        
                                        let pResult = await dialog(tmpConfObj);
                                        return
                                    }
                                    console.log(this.txtPopReFashionTicket.base64)
                                    dtTicket[0].FIRST_IMG = this.imgPopReFashionTicketFirst.value
                                    dtTicket[0].LAST_IMG = this.imgPopReFashionTicketLast.value
                                    dtTicket[0].DESCRIPTION = this.txtPopReFashionTicketNote.value
                                    dtTicket[0].TICKET = this.txtPopReFashionTicket.value

                                    if(dtTicket[0].stat == 'new')
                                    {
                                        await insert(dtTicket[0])
                                    }
                                    else if(dtTicket[0].stat == 'edit')
                                    {
                                        await update(dtTicket[0])
                                    }
                                    
                                    let tmpConfObj =
                                    {
                                        id:'msgPopReFashionTicketSaveResult',
                                        showTitle:true,
                                        title:this.lang.t("msgPopReFashionTicketSaveResult.title"),
                                        showCloseButton:true,
                                        width:'500px',
                                        height:'200px',
                                        button:[{id:"btn01",caption:this.lang.t("msgPopReFashionTicketSaveResult.btn01"),location:'after'}],
                                        content:(<div style={{textAlign:"center",fontSize:"20px"}}>{this.lang.t("msgPopReFashionTicketSaveResult.msg")}</div>)
                                    }
                                    let pResult = await dialog(tmpConfObj);

                                    this.popReFashionTicket.hide()
                                    getList = getList.bind(this)
                                    getList(this.txtPopReFashionTicketRef.value)
                                }}>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                </NbButton>
                            </div>
                            <div className='col-1 ps-1' align={"right"}>
                                <NbButton className="form-group btn btn-block btn-primary" style={{height:"40px",width:"100%"}}
                                onClick={async()=>
                                {
                                    this.popReFashionTicket.hide()
                                    getList = getList.bind(this)
                                    getList(this.txtPopReFashionTicketRef.value)
                                }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </NbButton>
                            </div>
                        </div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-6'>
                                <NdTextBox id="txtPopReFashionTicketRef" parent={this} title={this.lang.t("popReFashionTicket.txtPopReFashionTicketRef")} dt={{data:dtTicket,field:"REF"}} readOnly={true}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'arrowdown',
                                            onClick:()=>
                                            {
                                                this.txtPopReFashionTicketRef.value = Math.floor(Date.now() / 1000)
                                            }
                                        }
                                    ]
                                }
                                selectAll={true}                           
                                >     
                                </NdTextBox>
                            </div>
                            <div className='col-6'>
                                <NdDatePicker title={this.lang.t("popReFashionTicket.dtPopReFashionTicketDate")} parent={this} id={"dtPopReFashionTicketDate"} dt={{data:dtTicket,field:"DOC_DATE"}}
                                onValueChanged={(async()=>
                                {
                                    
                                }).bind(this)}
                                >
                                </NdDatePicker>
                            </div>
                        </div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-6'>
                                <NdTextBox id="txtPopReFashionTicket" parent={this} title={this.lang.t("popReFashionTicket.txPopReFashionTicket")} readOnly={true}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                this.pg_txtPopReFashionTicket.show()
                                                this.pg_txtPopReFashionTicket.onClick = async(data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        getPosPrintData = getPosPrintData.bind(this)
                                                        pdfToBase64 = pdfToBase64.bind(this)

                                                        let tmpPosPrintData = await getPosPrintData(data[0])
                                                        let tmpPdfToBase64 = await pdfToBase64(tmpPosPrintData)
                                                        
                                                        dtTicket[0].TICKET_PDF = btoa(tmpPdfToBase64.output())
                                                        this.txtPopReFashionTicket.value = data[0].DEVICE + " - " + data[0].REF
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                                selectAll={true}                           
                                >
                                </NdTextBox>
                            </div>
                            <div className='col-6'>
                                <NbButton className="form-group btn btn-block btn-primary" style={{height:"35px",width:"40px"}}
                                onClick={async()=>
                                {
                                    let pdfBlob = base64ToBlob(dtTicket[0].TICKET_PDF, 'application/pdf');
                                    let pdfUrl = URL.createObjectURL(pdfBlob);
                                    window.open(pdfUrl, '_blank', "width=900,height=1000,left=500");
                                }}>
                                    <i className="fa-solid fa-file-pdf"></i>
                                </NbButton>
                            </div>
                        </div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-6'>
                                <NdSelectBox simple={true} parent={this} id="cmbReFashionTicketCategory" displayExpr={'NAME'} valueExpr={'ID'} value={"VILLE_PLATE_BASSE"}
                                title={this.lang.t("popReFashionTicket.cmbReFashionTicketCategory")} dt={{data:dtTicket,field:"CATEGORY"}}
                                data={{source : 
                                [
                                    {ID:"VILLE_PLATE_BASSE",NAME:"Chaussures de ville plate basse"},
                                    {ID:"SANDALES_PLATE_BASSE",NAME:"Sandales plate basse"},
                                    {ID:"SNEAKERS_PLATE_BASSE",NAME:"Sneakers plate basse"},
                                    {ID:"BOTTES_BOTTINES_TALON_BAS",NAME:"Bottes / Bottines talon bas"},
                                    {ID:"ESCARPINS_TALON_HAUT",NAME:"Escarpins talon haut"},
                                    {ID:"SANDALES_TALON_HAUT",NAME:"Sandales talon haut"},
                                    {ID:"BOTTES_BOTTINES_TALON_HAUT",NAME:"Bottes / Bottines talon haut"},
                                ]}}/>
                            </div>
                            <div className='col-6'>
                                <NdSelectBox simple={true} parent={this} id="cmbReFashionTicketRepair" displayExpr={'NAME'} valueExpr={'ID'} value={"FERMETURE_ECLAIR_INF_20_CM"}
                                title={this.lang.t("popReFashionTicket.cmbReFashionTicketRepair")} dt={{data:dtTicket,field:"REPAIRS"}}
                                data={{source : 
                                [
                                    {ID:"FERMETURE_ECLAIR_INF_20_CM",NAME:"Fermeture éclair < 20 cm"},
                                    {ID:"FERMETURE_ECLAIR_SUP_20_CM",NAME:"Fermeture éclair > 20 cm"},
                                    {ID:"BONBOUT",NAME:"Bonbout"},
                                    {ID:"RESSEMELAGE_CUIR",NAME:"Ressemelage cuir"},
                                    {ID:"RESSEMELAGE_GOMME",NAME:"Ressemelage gomme"},
                                    {ID:"COUTURE_COLLAGE",NAME:"Couture et/ou Collage"},
                                    {ID:"PATIN",NAME:"Patin"},
                                ]}}/>
                            </div>
                        </div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-12'>
                                <NdTextArea simple={true} parent={this} id="txtPopReFashionTicketNote" height='100px'/>
                            </div>
                        </div>
                        <div className='row' style={{paddingTop:"10px"}}>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-12'>                                
                                        <h2>{this.lang.t("popReFashionTicket.txtImgFirstTitle")}</h2>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>                                
                                        <NdImageUpload id="imgPopReFashionTicketFirst" parent={this} imageWidth={"120"} height={'350px'} dt={{data:dtTicket,field:"FIRST_IMG"}}/>
                                    </div>
                                </div>                                
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-12'>                                
                                        <h2>{this.lang.t("popReFashionTicket.txtImgLastTitle")}</h2>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>                                
                                        <NdImageUpload id="imgPopReFashionTicketLast" parent={this} imageWidth={"120"} height={'350px'} dt={{data:dtTicket,field:"LAST_IMG"}}/>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </NdPopUp>
            </div>
            {/* Fiş Seçim PopUp */}
            <div>            
                <NdPopGrid id={"pg_txtPopReFashionTicket"} parent={this} container={"#root"} 
                visible={false}
                position={{of:'#root'}} 
                showTitle={true} 
                showBorders={true}
                width={'90%'}
                height={'90%'}
                title={this.lang.t("pg_txtPopReFashionTicket.title")} 
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
                    <Column dataField="DOC_DATE" dataType="date" caption={this.lang.t("pg_txtPopReFashionTicket.clmDate")} width={'30%'} />
                    <Column dataField="DEVICE" caption={this.lang.t("pg_txtPopReFashionTicket.clmDevice")} width={'30%'} defaultSortOrder="asc" />
                    <Column dataField="REF" caption={this.lang.t("pg_txtPopReFashionTicket.clmRef")} width={'40%'} />
                </NdPopGrid>
            </div>
        </NdLayoutItem>
    )
}
async function onClick()
{
    this.popReFashion.show()
}
function addChildToElementWithId(children, id, newChild) 
{
    return React.Children.map(children, child => 
    {
        if (!React.isValidElement(child)) 
        {
            return child;
        }
        if (child.props.id === id) 
        {
            const newChildren = React.Children.toArray(child.props.children);
            newChildren.push(newChild);
            return React.cloneElement(child, {}, ...newChildren);
        } 
        else if (child.props.children) 
        {
            return React.cloneElement(child, {}, addChildToElementWithId(child.props.children, id, newChild));
        }
        return child;
    });
}
async function getList(pRef)
{
    dtList.clear()
    let tmpData = await select({REF:''})
    dtList.import(tmpData.result.recordset)
    await this.grdPopReFashionList.dataRefresh({source:dtList});
}
function getPosPrintData(pData)
{
    return new Promise(async resolve => 
    {
        let tmpPosDt = new datatable();
        let tmpPosSaleDt = new datatable();
        let tmpPosPayDt = new datatable();
        let tmpPosPromoDt = new datatable();  

        tmpPosDt.selectCmd = 
        {
            query:  "SELECT TOP 1 *,CONVERT(NVARCHAR,LDATE,104) + '-' + CONVERT(NVARCHAR,LDATE,108) AS CONVERT_DATE, " +
                    "SUBSTRING(CONVERT(NVARCHAR(50),GUID),20,36) AS REF_NO " + 
                    "FROM POS_VW_01 WHERE DEVICE = @DEVICE AND REF = @REF AND STATUS = 1 ORDER BY LDATE DESC",
            param:  ["DEVICE:string|25","REF:int"],
            value:  [pData.DEVICE,pData.REF],
            local : 
            {
                type : "select",
                query : `SELECT *, 
                        strftime('%d-%m-%Y', LDATE) || '-' || strftime('%H:%M:%S', LDATE) AS CONVERT_DATE, 
                        SUBSTR(GUID, 20, 36) AS REF_NO 
                        FROM POS_VW_01 
                        WHERE DEVICE = ? AND REF = ? AND STATUS = 1 
                        ORDER BY LDATE DESC
                        LIMIT 1;`,
                values : [pData.DEVICE,pData.REF]
            }
        }
        await tmpPosDt.refresh()
        if(tmpPosDt.length > 0)
        {
            tmpPosSaleDt.selectCmd = 
            {
                query:  "SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = @POS_GUID ORDER BY LDATE DESC",
                param:  ["POS_GUID:string|50"],
                value:  [tmpPosDt[0].GUID],
                local : 
                {
                    type : "select",
                    query : `SELECT * FROM POS_SALE_VW_01 WHERE POS_GUID = ? ORDER BY LDATE DESC`,
                    values : [tmpPosDt[0].GUID]
                }
            }                                                
            await tmpPosSaleDt.refresh()
            tmpPosPayDt.selectCmd = 
            {
                query:  "SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = @POS_GUID ORDER BY LDATE DESC",
                param:  ["POS_GUID:string|50"],
                value:  [tmpPosDt[0].GUID],
                local : 
                {
                    type : "select",
                    query : `SELECT * FROM POS_PAYMENT_VW_01 WHERE POS_GUID = ? ORDER BY LDATE DESC`,
                    values : [tmpPosDt[0].GUID]
                }
            }
            await tmpPosPayDt.refresh()
            tmpPosPromoDt.selectCmd = 
            {
                query : "SELECT * FROM [dbo].[POS_PROMO_VW_01] WHERE POS_GUID = @POS_GUID",
                param : ['POS_GUID:string|50'],
                value:  [tmpPosDt[0].GUID],
                local : 
                {
                    type : "select",
                    query : `SELECT * FROM POS_PROMO_VW_01 WHERE POS_GUID = ?`,
                    values : [tmpPosDt[0].GUID]
                }
            } 
            await tmpPosPromoDt.refresh()
        }

        let tmpData = 
        {
            pos : tmpPosDt,
            possale : tmpPosSaleDt,
            pospay : tmpPosPayDt,
            pospromo : tmpPosPromoDt,
            firm : this.firm,
            special : 
            {
                type : 'Fis',
                ticketCount : 0,
                reprint : 1,
                repas : 0,
                factCertificate : '',
                dupCertificate : '',
                customerUsePoint : 0,
                customerPoint : 0,
                customerGrowPoint : 0,
                customerPointFactory : 0
            }
        }
        
        resolve(tmpData)
    });
}
function pdfToBase64(pData)
{
    return new Promise(async resolve => 
    {
        let prmPrint = this.posDevice.dt().length > 0 ? this.posDevice.dt()[0].PRINT_DESING : ""

        import("../../meta/print/" + prmPrint).then(async(e)=>
        {
            let tmpPrint = e.print(pData)
            let tmpPdf = await this.posDevice.pdf(tmpPrint)

            resolve(tmpPdf)
        })
    })
}
function base64ToBlob(base64, mimeType) 
{
    var byteCharacters = atob(base64);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) 
    {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
}
async function Service()
{
    if(this.core.util.isElectron())
    {
        localDb = new local()

        await localDb.init({name:"MR_MINIT",tables: initDb().table})

        const io = global.require('socket.io')(1453);
        
        io.on('connection', (socket) => 
        {
            socket.on('disconnect', () => 
            {
                console.log('Kullanıcı bağlantısı kesti');
            });
            socket.on('execute', async(pParam,pCallback) => 
            {
                if(pParam.type == 'select')
                {
                    let tmpData = await select(pParam.data)
                    pCallback(tmpData)
                }
                else if(pParam.type == 'insert')
                {
                    await insert(pParam.data)
                }
                else if(pParam.type == 'update')
                {
                    await update(pParam.data)
                }
                else if(pParam.type == 'delete')
                {
                    await deleted(pParam.data)
                }
            });
        });
    }
}
function initDb()
{
    let tmpSchema =
    {
        table : 
        [
            {
                name : "MRMINIT_REPAIR",
                query : `CREATE TABLE IF NOT EXISTS MRMINIT_REPAIR 
                        (
                            GUID TEXT PRIMARY KEY, 
                            CDATE DATETIME, 
                            CUSER TEXT, 
                            LDATE DATETIME, 
                            LUSER TEXT,
                            REF TEXT, 
                            DOC_DATE DATETIME, 
                            CATEGORY TEXT,
                            REPAIRS TEXT,
                            DESCRIPTION TEXT, 
                            FIRST_IMG TEXT, 
                            LAST_IMG TEXT, 
                            TICKET TEXT,
                            TICKET_PDF TEXT, 
                            STATUS INTEGER
                        );`
            }
        ],
        select : 
        {
            type : "select",
            query : `SELECT * FROM MRMINIT_REPAIR WHERE REF = ? OR ? = ''`
        },
        insert : 
        {
            type : "insert",
            query : `INSERT OR REPLACE INTO MRMINIT_REPAIR (GUID,CDATE,CUSER,LDATE,LUSER,REF,DOC_DATE,CATEGORY,REPAIRS,DESCRIPTION,FIRST_IMG,LAST_IMG,TICKET,TICKET_PDF,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        },
        update :
        {
            type : "update",
            query : `UPDATE MRMINIT_REPAIR SET LDATE = ?, LUSER = ?, REF = ?, DOC_DATE = ?, CATEGORY = ?, REPAIRS = ?, DESCRIPTION = ?, FIRST_IMG = ?, LAST_IMG = ?, TICKET = ?, TICKET_PDF = ?, STATUS = ? WHERE GUID = ?;`,
        },
        delete :
        {
            type : "delete",
            query : `DELETE MRMINIT_REPAIR WHERE REF = ?;`
        }
    }
    return tmpSchema
}
function select(pData)
{
    return new Promise(async resolve => 
    {
        let tmpQuery = {...initDb().select}
        
        tmpQuery.values = [pData.REF,pData.REF]
        let tmpData = await localDb.select(tmpQuery)

        resolve(tmpData)
    });
}
function insert(pData)
{
    return new Promise(async resolve => 
    {
        let tmpQuery = {...initDb().insert}
        
        tmpQuery.values = [
            datatable.uuidv4(),
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            pData.CUSER,
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            pData.LUSER,
            pData.REF,
            moment(pData.DOC_DATE).format('YYYY-MM-DD'),
            pData.CATEGORY,
            pData.REPAIRS,
            pData.DESCRIPTION,
            pData.FIRST_IMG,
            pData.LAST_IMG,
            pData.TICKET,
            pData.TICKET_PDF,
            pData.STATUS
        ]

        await localDb.insert(tmpQuery)

        resolve()
    });
}
function update(pData)
{
    return new Promise(async resolve => 
    {
        let tmpQuery = {...initDb().update}
        tmpQuery.values = 
        [
            moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            pData.LUSER,
            pData.REF,
            moment(pData.DOC_DATE).format('YYYY-MM-DD'),
            pData.CATEGORY,
            pData.REPAIRS,
            pData.DESCRIPTION,
            pData.FIRST_IMG,
            pData.LAST_IMG,
            pData.TICKET,
            pData.TICKET_PDF,
            pData.STATUS,
            pData.GUID
        ]
        console.log(tmpQuery)
        await localDb.update(tmpQuery)

        resolve()
    });
}
function deleted(pData)
{
    return new Promise(async resolve => 
    {
        let tmpQuery = {...initDb().delete}
        tmpQuery.values = [pData.REF]
    
        await localDb.delete(tmpQuery)
        resolve()
    });
}