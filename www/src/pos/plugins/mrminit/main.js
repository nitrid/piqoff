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
posDoc.prototype.saleRowAdd = function saleRowAdd(pItemData) 
{
    pItemData.NAME = pItemData.NAME + " " + pItemData.LIST_TAG
    pItemData.SNAME = pItemData.NAME.substring(0,50)
    return orgSaleRowAdd.call(this,pItemData)
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
                    this.txtPopReFashionTicketNote.value = dtTicket[0].DESCRIPTION
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
                                    
                                    dtTicket[0].FIRST_IMG = this.imgPopReFashionTicketFirst.value
                                    dtTicket[0].LAST_IMG = this.imgPopReFashionTicketLast.value
                                    dtTicket[0].DESCRIPTION = this.txtPopReFashionTicketNote.value
                                    
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
                                <NdTextBox id="txtPopReFashionTicket" parent={this} title={this.lang.t("popReFashionTicket.txPopReFashionTicket")} dt={{data:dtTicket,field:"TICKET_PDF"}} readOnly={true}
                                button=
                                {
                                    [
                                        {
                                            id:'01',
                                            icon:'more',
                                            onClick:()=>
                                            {
                                                console.log(this.pg_txtPopReFashionTicket)
                                                this.pg_txtPopReFashionTicket.show()
                                                this.pg_txtPopReFashionTicket.onClick = (data) =>
                                                {
                                                    if(data.length > 0)
                                                    {
                                                        this.txtPopReFashionTicket.value = data[0].GUID
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
        console.log(pData)
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