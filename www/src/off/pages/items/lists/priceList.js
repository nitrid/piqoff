import React from 'react';
import App from '../../../lib/app.js';

import Toolbar,{ Item } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';

import NdGrid,{Column, ColumnChooser, Paging, Pager, Scrolling, Export, Editing, StateStoring} from '../../../../core/react/devex/grid.js';
import NdTextBox, { Validator, RequiredRule} from '../../../../core/react/devex/textbox.js'
import NdSelectBox from '../../../../core/react/devex/selectbox.js';
import NdButton from '../../../../core/react/devex/button.js';
import NdCheckBox from '../../../../core/react/devex/checkbox.js';
import { dialog } from '../../../../core/react/devex/dialog.js';
import { itemsCls } from '../../../../core/cls/items.js';
import NdPopUp from '../../../../core/react/devex/popup.js';
import NdHtmlEditor from '../../../../core/react/devex/htmlEditor.js';
import { NdForm, NdItem, NdLabel } from '../../../../core/react/devex/form.js';
import { NdToast } from '../../../../core/react/devex/toast.js';
export default class priceList extends React.PureComponent
{
    constructor(props)
    {
        super(props)

        this.prmObj = this.param.filter({TYPE:1,USERS:this.user.CODE});
        this.core = App.instance.core;
        this.tabIndex = props.data.tabkey
        
        this.btnGetirClick = this.btnGetirClick.bind(this)
        
        this.saveState = this.saveState.bind(this)
        this.loadState = this.loadState.bind(this)

        this.itemsObj = new itemsCls();
    }
    loadState() 
    {
        let tmpLoad = this.access.filter({ELEMENT:'grdPriceListe',USERS:this.user.CODE})
        return tmpLoad.getValue()
    }
    saveState(e)
    {
        let tmpSave = this.access.filter({ELEMENT:'grdPriceListe',USERS:this.user.CODE})
        tmpSave.setValue(e)
        tmpSave.save()
    }
    componentDidMount()
    {
    }
    async getItem(pCode)
    {
        this.itemsObj.clearAll();
        await this.itemsObj.load({CODE:pCode});
    }
    async btnGetirClick()
    {
        if(this.cmbPricingList.value == '')
        {
            App.instance.alert(this.lang.t("msgWarning"),"error")
            return;
        }
        let tmpQuery = '';
        if(this.chkCatalog.value == false)
        {
            tmpQuery = `SELECT * FROM ITEM_PRICE_VW_01 WHERE LIST_NO = @LIST_NO AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0`;
        }
        else
        {
            tmpQuery = `SELECT ITEM_PRICE_VW_01.* 
                        FROM ITEM_PRICE_VW_01 
                        WHERE ITEM_PRICE_VW_01.LIST_NO = @LIST_NO 
                        AND ITEM_PRICE_VW_01.CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' 
                        AND ITEM_PRICE_VW_01.TYPE = 0 AND ITEM_PRICE_VW_01.CATALOG = @CATALOG`;
        }
        
        let tmpSource = 
        {
            source : 
            {
                select : 
                {
                    query : tmpQuery,
                    param : ['LIST_NO:int','CATALOG:int'],
                    value : [this.cmbPricingList.value,this.chkCatalog.value]
                },
                sql : this.core.sql
            }
        }

        App.instance.loading.show()
        await this.grdPriceListe.dataRefresh(tmpSource)
        App.instance.loading.hide()
        this.txtTotalCount.value = this.grdPriceListe.data.datatable.length
    }
    render()
    {
        return(
            <div id={this.props.data.id + this.tabIndex}>
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
                                        icon: 'add',
                                        onClick: async () => 
                                        {
                                            App.instance.menuClick(
                                            {
                                                id: 'stk_03_002',
                                                text: this.lang.t('menuOff.stk_03_002'),
                                                path: 'items/lists/priceList.js',
                                            })
                                        }
                                    }    
                                } />
                                <Item location="after" locateInMenu="auto"> 
                                    <NdButton id="btnPrint" parent={this} icon="print" type="default"
                                    onClick={async ()=>
                                    {   
                                        this.popDesign.show() 
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
                            <NdForm colCount={2} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("cmbPricingList")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbPricingList" notRefresh={true}
                                    displayExpr = "NAME"
                                    valueExpr = "NO"
                                    value = ""
                                    searchEnabled = {true}
                                    data = {{source:{select:{query : "SELECT NO,NAME FROM ITEM_PRICE_LIST_VW_01 ORDER BY NO ASC"},sql:this.core.sql}}}
                                    param = {this.param.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}
                                    access = {this.access.filter({ELEMENT:'cmbPricingList',USERS:this.user.CODE})}
                                    />
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("chkCatalog")} alignment="right" />
                                    <NdCheckBox id="chkCatalog" parent={this} defaultValue={false} param={this.param.filter({ELEMENT:'chkCatalog',USERS:this.user.CODE})}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-3 offset-9">
                            <NdButton text={this.t("btnGet")} type="success" width="100%" onClick={this.btnGetirClick}></NdButton>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdForm colCount={3} id="frmKriter">
                                <NdItem>
                                    <NdLabel text={this.t("txtTotalCount")} alignment="right" />
                                    <NdTextBox id="txtTotalCount" parent={this} simple={true} readOnly={true}/>
                                </NdItem>
                            </NdForm>
                        </div>
                    </div>
                    <div className="row px-2 pt-2">
                        <div className="col-12">
                            <NdGrid id="grdPriceListe" parent={this} 
                            selection={{mode:"multiple"}} 
                            height={600}
                            showBorders={true}
                            filterRow={{visible:true}} 
                            headerFilter={{visible:true}}
                            columnAutoWidth={true}
                            allowColumnReordering={true}
                            allowColumnResizing={true}
                            loadPanel={{enabled:true}}
                            onRowDblClick={async(e)=>
                            {
                                App.instance.menuClick(
                                {
                                    id: 'stk_01_001',
                                    text: e.data.ITEM_NAME.substring(0,10),
                                    path: 'items/cards/itemCard.js',
                                    pagePrm:{CODE:e.data.ITEM_CODE}
                                })
                            }}
                            >                                    
                                <StateStoring enabled={true} type="custom" customLoad={this.loadState} customSave={this.saveState} storageKey={this.props.data.id + "_grdPriceListe"}/>
                                <ColumnChooser enabled={true} />
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Paging defaultPageSize={20} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Pager visible={true} allowedPageSizes={[5,10,50]} showPageSizeSelector={true} /> : <Paging enabled={false} />}
                                {this.sysParam.filter({ID:'pageListControl',USERS:this.user.CODE}).getValue().value == true ? <Scrolling mode="standart" /> : <Scrolling mode="virtual" />}
                                <Editing mode="cell" allowUpdating={false} allowDeleting={false} confirmDelete={false}/>
                                <Export fileName={this.lang.t("menuOff.stk_03_001")} enabled={true} allowExportSelectedData={true} />
                                <Column dataField="LIST_NO" caption={this.t("grdPriceListe.clmListNo")} visible={true} width={80}/> 
                                <Column dataField="LIST_NAME" caption={this.t("grdPriceListe.clmListName")} visible={true} defaultSortOrder="asc" width={160}/> 
                                <Column dataField="ITEM_CODE" caption={this.t("grdPriceListe.clmItemCode")} visible={true} width={150}/> 
                                <Column dataField="ITEM_NAME" caption={this.t("grdPriceListe.clmItemName")} visible={true} /> 
                                <Column dataField="MAIN_GRP_NAME" caption={this.t("grdPriceListe.clmMainGrpName")} visible={true} width={150}/> 
                                <Column dataField="QUANTITY" caption={this.t("grdPriceListe.clmQuantity")} visible={true} width={80}/> 
                                <Column dataField="PRICE_HT" caption={this.t("grdPriceListe.clmPriceHt")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}} width={150}/> 
                                <Column dataField="PRICE_TTC" caption={this.t("grdPriceListe.clmPriceTtc")} visible={true} format={{ style: "currency", currency: "EUR",precision: 2}} width={150}/>                         
                            </NdGrid>
                        </div>
                    </div>
                    {/* Dizayn Seçim PopUp */}
                    <div>
                        <NdPopUp parent={this} id={"popDesign"} 
                        visible={false}
                        showCloseButton={true}
                        showTitle={true}
                        title={this.t("popDesign.title")}
                        container={'#' + this.props.data.id + this.tabIndex} 
                        width={'500'}
                        height={'280'}
                        position={{of:'#' + this.props.data.id + this.tabIndex}}
                        deferRendering={false}
                        >
                            <NdForm colCount={1} height={'fit-content'}>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.design")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignList" notRefresh = {true}
                                    displayExpr="DESIGN_NAME"                       
                                    valueExpr="TAG"
                                    value=""
                                    searchEnabled={true}
                                    data={{source:{select:{query : "SELECT TAG,DESIGN_NAME FROM [dbo].[LABEL_DESIGN] WHERE PAGE = '999'"},sql:this.core.sql}}}
                                    param={this.param.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    access={this.access.filter({ELEMENT:'cmbDesignList',USERS:this.user.CODE})}
                                    >
                                        <Validator validationGroup={"frmPrintPop" + this.tabIndex}>
                                            <RequiredRule message={this.t("validDesign")} />
                                        </Validator> 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <NdLabel text={this.t("popDesign.lang")} alignment="right" />
                                    <NdSelectBox simple={true} parent={this} id="cmbDesignLang" notRefresh = {true}
                                    displayExpr="VALUE"                       
                                    valueExpr="ID"
                                    value={localStorage.getItem('lang').toUpperCase()}
                                    searchEnabled={true}
                                    data={{source:[{ID:"FR",VALUE:"FR"},{ID:"DE",VALUE:"DE"},{ID:"TR",VALUE:"TR"}]}}
                                    > 
                                    </NdSelectBox>
                                </NdItem>
                                <NdItem>
                                    <div className='row py-2'>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnView")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {       
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query:  `SELECT *,(SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN) AS PATH, 
                                                                (SELECT TOP 1 IMAGE FROM ITEM_IMAGE WHERE ITEM = ITEM_PRICE_VW_01.ITEM_GUID AND TYPE = 0) AS IMAGE 
                                                                FROM ITEM_PRICE_VW_01 WHERE  LIST_NO = @LIST_NO AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND 
                                                                (CATALOG = @CATALOG OR @CATALOG = 0)`,
                                                        param:  ['LIST_NO:int','CATALOG:int','DESIGN:string|25'],
                                                        value:  [this.cmbPricingList.value,this.chkCatalog.value,this.cmbDesignList.value]
                                                    }

                                                    App.instance.loading.show()
                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    App.instance.loading.hide()
                                                    
                                                    this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpData.result.recordset[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpData.result.recordset) + '}',(pResult) => 
                                                    {
                                                        if(pResult.split('|')[0] != 'ERR')
                                                        {
                                                            var mywindow = window.open('printview.html','_blank',"width=900,height=1000,left=500");      
                                                            mywindow.onload = function() 
                                                            { 
                                                                mywindow.document.getElementById("view").innerHTML="<iframe src='data:application/pdf;base64," + pResult.split('|')[1] + "' type='application/pdf' width='100%' height='100%'></iframe>"      
                                                            } 
                                                        }
                                                    });
                                                }
                                            }}/>
                                        </div>
                                        <div className='col-6'>
                                            <NdButton text={this.t("btnMailsend")} type="normal" stylingMode="contained" width={'100%'}  validationGroup={"frmPrintPop" + this.tabIndex}
                                            onClick={async (e)=>
                                            {    
                                                if(e.validationGroup.validate().status == "valid")
                                                {
                                                    let tmpQuery = 
                                                    {
                                                        query: `SELECT *,(SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN) AS PATH, 
                                                                (SELECT TOP 1 IMAGE FROM ITEM_IMAGE WHERE ITEM = ITEM_PRICE_VW_01.ITEM_GUID AND TYPE = 0) AS IMAGE 
                                                                FROM ITEM_PRICE_VW_01 WHERE  LIST_NO = @LIST_NO AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' AND TYPE = 0 AND 
                                                                (CATALOG = @CATALOG OR @CATALOG = 0)`,
                                                        param:  ['LIST_NO:int','CATALOG:int','DESIGN:string|25'],
                                                        value:  [this.cmbPricingList.value,this.chkCatalog.value,this.cmbDesignList.value]
                                                    }

                                                    let tmpData = await this.core.sql.execute(tmpQuery) 
                                                    
                                                    if(tmpData.result.recordset.length > 0)
                                                    {
                                                        await this.popMailSend.show()
                                                        this.txtSendMail.value = tmpData.result.recordset[0].EMAIL
                                                    }
                                                    else
                                                    {
                                                        this.popMailSend.show()
                                                    }
                                                }
                                            }}/>
                                        </div>
                                    </div>
                                </NdItem>
                            </NdForm>
                        </NdPopUp>
                    </div>  
                    {/* Mail Send PopUp */}
                    <NdPopUp parent={this} id={"popMailSend"} 
                    visible={false}
                    showCloseButton={true}
                    showTitle={true}
                    title={this.t("popMailSend.title")}
                    container={'#' + this.props.data.id + this.tabIndex} 
                    width={'600'}
                    height={'600'}
                    position={{of:'#' + this.props.data.id + this.tabIndex}}
                    deferRendering={true}
                    >
                        <NdForm colCount={1} height={'fit-content'}>
                            <NdItem>
                                <NdLabel text={this.t("popMailSend.cmbMailAddress")} alignment="right" />
                                <NdSelectBox simple={true} parent={this} id="cmbMailAddress" notRefresh = {true}
                                displayExpr="MAIL_ADDRESS"                       
                                valueExpr="GUID"
                                value=""
                                searchEnabled={true}
                                data={{source:{select:{query : "SELECT * FROM MAIL_SETTINGS "},sql:this.core.sql}}}
                                >
                                    <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                        <RequiredRule message={this.t("validMail")} />
                                    </Validator> 
                                </NdSelectBox>
                            </NdItem>
                            <NdItem>
                                <NdLabel text={this.t("popMailSend.txtMailSubject")} alignment="right" />
                                <NdTextBox id="txtMailSubject" parent={this} simple={true} maxLength={128}>
                                    <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                        <RequiredRule message={this.t("validMail")} />
                                    </Validator> 
                                </NdTextBox>
                            </NdItem>
                            <NdItem>
                                <NdLabel text={this.t("popMailSend.txtSendMail")} alignment="right" />
                                <NdTextBox id="txtSendMail" parent={this} simple={true} maxLength={128}>
                                    <Validator validationGroup={"frmMailsend" + this.tabIndex}>
                                        <RequiredRule message={this.t("validMail")} />
                                    </Validator> 
                                </NdTextBox>
                            </NdItem>
                            <NdItem>
                                <NdHtmlEditor id="htmlEditor" parent={this} height={300} placeholder={this.t("placeMailHtmlEditor")}/>
                            </NdItem>
                            <NdItem>
                                <div className='row'>
                                    <div className='col-6'>
                                        <NdButton text={this.t("popMailSend.btnSend")} type="normal" stylingMode="contained" width={'100%'}  
                                        validationGroup={"frmMailsend"  + this.tabIndex}
                                        onClick={async (e)=>
                                        {       
                                            if(e.validationGroup.validate().status == "valid")
                                            {
                                                let tmpLines = []
                                                App.instance.loading.show()

                                                let tmpQuery = 
                                                {
                                                    query:  `SELECT *,(SELECT TOP 1 PATH FROM LABEL_DESIGN WHERE TAG = @DESIGN) AS PATH,
                                                            (SELECT TOP 1 IMAGE FROM ITEM_IMAGE WHERE ITEM = ITEM_PRICE_VW_01.ITEM_GUID AND TYPE = 0) AS IMAGE 
                                                            FROM ITEM_PRICE_VW_01 WHERE  LIST_NO = @LIST_NO AND CUSTOMER_GUID = '00000000-0000-0000-0000-000000000000' AND 
                                                            TYPE = 0 AND (CATALOG = @CATALOG OR @CATALOG = 0)`,
                                                    param:  ['LIST_NO:int','CATALOG:int','DESIGN:string|25'],
                                                    value:  [this.cmbPricingList.value,this.chkCatalog.value,this.cmbDesignList.value]
                                                }

                                                let tmpData = await this.core.sql.execute(tmpQuery) 
                                                
                                                for (let x = 0; x < tmpData.result.recordset.length; x++) 
                                                {
                                                    tmpLines.push(tmpData.result.recordset[x])
                                                }

                                                this.core.socket.emit('devprint','{"TYPE":"REVIEW","PATH":"' + tmpLines[0].PATH.replaceAll('\\','/') + '","DATA":' + JSON.stringify(tmpLines) + '}',async(pResult) =>
                                                {
                                                    let tmpAttach = pResult.split('|')[1]
                                                    let tmpHtml = this.htmlEditor.value

                                                    if(this.htmlEditor.value.length == 0)
                                                    {
                                                        tmpHtml = ''
                                                    }

                                                    let tmpMailData = {html:tmpHtml,subject:this.txtMailSubject.value,sendMail:this.txtSendMail.value,attachName:"Rapport Facture"+".pdf",attachData:tmpAttach,text:"",mailGuid:this.cmbMailAddress.value}
                                                    
                                                    this.core.socket.emit('mailer',tmpMailData,async(pResult1) => 
                                                    {
                                                        App.instance.loading.hide()
                                                        
                                                        if((pResult1) == 0)
                                                        {
                                                            this.toast.show({message:this.t("msgMailSendResult.msgSuccess"),type:"success"})
                                                            this.htmlEditor.value = '',
                                                            this.txtMailSubject.value = '',
                                                            this.txtSendMail.value = ''
                                                            this.popMailSend.hide();  
                                                        }
                                                        else
                                                        {
                                                            let tmpConfObj1 =
                                                            {
                                                                id:'msgMailSendResult',showTitle:true,title:this.t("msgMailSendResult.title"),showCloseButton:true,width:'500px',height:'auto',
                                                                button:[{id:"btn01",caption:this.t("msgMailSendResult.btn01"),location:'after'}],
                                                                content: (<div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{this.t("msgMailSendResult.msgFailed")}</div>)
                                                            }
                                                            await dialog(tmpConfObj1);
                                                            this.popMailSend.hide(); 
                                                        }
                                                    });
                                                });
                                                App.instance.loading.hide()
                                            }
                                        }}/>
                                    </div>
                                    <div className='col-6'>
                                        <NdButton text={this.lang.t("btnCancel")} type="normal" stylingMode="contained" width={'100%'}
                                        onClick={()=>
                                        {
                                            this.popMailSend.hide();  
                                        }}/>
                                    </div>
                                </div>
                            </NdItem>
                        </NdForm>
                    </NdPopUp>
                    <NdToast id={"toast"} parent={this} displayTime={2000} position={{at:"top center",offset:'0px 110px'}}/>
                </ScrollView>
            </div>
        )
    }
}